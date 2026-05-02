import React, { useState, useCallback } from 'react';
import { 
  View, 
  Text, 
  FlatList, 
  Image, 
  TouchableOpacity, 
  SafeAreaView, 
  ActivityIndicator,
  Alert,
  Modal,
  ScrollView,
  Linking
} from 'react-native';
import { useLocalSearchParams, useRouter, useFocusEffect } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { adoptionService } from '../../services/adoptionService';
import { styles, COLUMN_COUNT } from './styles';
import { BASE_URL } from '../../services/api';
import { AdoptionPoint, AdoptionDog } from '@dogdex/shared';
import axios from 'axios';
import AddDogModal from './AddDogModal/index';
import { supabase } from '../../lib/supabase';
import { chatService } from '../../services/chatService';

export default function AdoptionPointDetails() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const [point, setPoint] = useState<AdoptionPoint | null>(null);
  const [dogs, setDogs] = useState<AdoptionDog[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedDog, setSelectedDog] = useState<AdoptionDog | null>(null);
  const [isAddModalVisible, setIsAddModalVisible] = useState(false);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const [, setStartingChat] = useState(false);
  const [isContactChoiceVisible, setIsContactChoiceVisible] = useState(false);

  const handleStartChat = async () => {
    if (!point || !currentUserId) return;
    
    setStartingChat(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        Alert.alert('Erro', 'Você precisa estar logado para iniciar uma conversa.');
        return;
      }
      
      const response = await chatService.createOrGetSession(session.access_token, point.id);
      if (response.success && response.data) {
        setSelectedDog(null); // Close modal
        router.push(`/chat/${response.data.id}` as any);
      } else {
        Alert.alert('Erro', response.error || 'Não foi possível iniciar a conversa.');
      }
    } catch (error) {
      console.error('Error starting chat:', error);
      Alert.alert('Erro', 'Ocorreu um erro ao tentar iniciar o chat.');
    } finally {
      setStartingChat(false);
    }
  };

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      // Busca o usuário logado
      const { data: { user } } = await supabase.auth.getUser();
      setCurrentUserId(user?.id || null);

      // In a real app, we might have a specific endpoint for one point
      // For now, we list all points and filter (or we can add GET /adoption/points/:id)
      const response = await axios.get(`${BASE_URL}/adoption/points`);
      if (response.data.success) {
        const foundPoint = response.data.data.find((p: AdoptionPoint) => p.id === id);
        setPoint(foundPoint || null);
        
        if (foundPoint) {
          const dogsResponse = await axios.get(`${BASE_URL}/adoption/points/${id}/dogs`);
          if (dogsResponse.data.success) {
            setDogs(dogsResponse.data.data);
          }
        }
      }
    } catch (error) {
      console.error('Erro ao buscar detalhes do ponto:', error);
      Alert.alert('Erro', 'Não foi possível carregar os detalhes do ponto.');
    } finally {
      setLoading(false);
    }
  }, [id]);

  useFocusEffect(
    useCallback(() => {
      fetchData();
    }, [fetchData])
  );

  const handleUpdateDogStatus = async (dogId: string, status: 'available' | 'adopted') => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return;

      await adoptionService.updateDogStatus(session.access_token, dogId, status);
      Alert.alert('Sucesso', status === 'adopted' ? 'Cão marcado como adotado!' : 'Cão marcado como disponível!');
      setSelectedDog(null);
      fetchData();
    } catch (error) {
      console.error('Erro ao atualizar status do cão:', error);
      Alert.alert('Erro', 'Não foi possível atualizar o status do cão.');
    }
  };

  const handleDeleteDog = async (dogId: string) => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return;

      await adoptionService.deleteDog(session.access_token, dogId);
      Alert.alert('Sucesso', 'Registro excluído permanentemente.');
      setSelectedDog(null);
      fetchData();
    } catch (error) {
      console.error('Erro ao excluir cão:', error);
      Alert.alert('Erro', 'Não foi possível excluir o registro do cão.');
    }
  };

  const renderDog = ({ item }: { item: AdoptionDog }) => (
    <TouchableOpacity 
      style={styles.card} 
      activeOpacity={0.8} 
      onPress={() => setSelectedDog(item)}
    >
      <View style={styles.imageContainer}>
        <Image source={{ uri: item.imageUri }} style={styles.image} />
        <View style={styles.breedBadge}>
          <Text style={styles.breedBadgeText}>{item.breedName}</Text>
        </View>
      </View>
      <View style={styles.cardInfo}>
        <Text style={styles.dogName} numberOfLines={1}>{item.name}</Text>
        <Text style={styles.ageText}>{item.age || 'Idade desconhecida'}</Text>
      </View>
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#8DB0C2" />
        <Text style={styles.loadingText}>Carregando galeria...</Text>
      </View>
    );
  }

  if (!point) {
    return (
      <View style={styles.centered}>
        <Text style={styles.errorText}>Ponto de adoção não encontrado.</Text>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButtonLarge}>
          <Text style={styles.backButtonText}>Voltar ao Mapa</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#FFF" />
        </TouchableOpacity>
        <View style={styles.titleContainer}>
          <Text style={styles.title}>{point.name}</Text>
          <Text style={styles.subtitle} numberOfLines={1}>{point.description}</Text>
        </View>
        {point.creatorId === currentUserId && (
          <TouchableOpacity 
            onPress={() => router.push({
              pathname: '/create-point',
              params: {
                id: point.id,
                name: point.name,
                address: point.address,
                description: point.description,
                contactPhone: point.contactPhone,
                lat: point.latitude,
                lng: point.longitude
              }
            } as any)} 
            style={styles.editButton}
          >
            <Ionicons name="create-outline" size={24} color="#FFF" />
          </TouchableOpacity>
        )}
      </View>

      <FlatList
        data={dogs}
        keyExtractor={(item) => item.id}
        renderItem={renderDog}
        numColumns={COLUMN_COUNT}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Ionicons name="paw-outline" size={64} color="#CCC" />
            <Text style={styles.emptyText}>Ainda não há cães cadastrados neste ponto.</Text>
          </View>
        }
      />

      {point.creatorId === currentUserId && (
        <TouchableOpacity 
          style={styles.fab} 
          onPress={() => setIsAddModalVisible(true)}
        >
          <Ionicons name="add" size={30} color="#fff" />
        </TouchableOpacity>
      )}

      <AddDogModal
        isVisible={isAddModalVisible}
        onClose={() => setIsAddModalVisible(false)}
        onSuccess={fetchData}
        pointId={id as string}
      />

      <Modal
        visible={!!selectedDog}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setSelectedDog(null)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <TouchableOpacity style={styles.modalCloseButton} onPress={() => setSelectedDog(null)}>
              <Ionicons name="close-circle" size={32} color="#FA3045" />
            </TouchableOpacity>

            {selectedDog && (
              <ScrollView showsVerticalScrollIndicator={false}>
                <Image source={{ uri: selectedDog.imageUri }} style={styles.modalImage} />
                <View style={styles.modalInfoContainer}>
                  <Text style={styles.modalDogName}>{selectedDog.name}</Text>
                  <Text style={styles.modalBreedName}>{selectedDog.breedName}</Text>
                  
                  <View style={styles.modalDivider} />
                  
                  <Text style={styles.modalSectionTitle}>SOBRE</Text>
                  <Text style={styles.modalDescription}>
                    {selectedDog.description || 'Nenhuma descrição fornecida.'}
                  </Text>

                  <View style={styles.modalMetaRow}>
                    <Ionicons name="time-outline" size={20} color="#8DB0C2" />
                    <Text style={styles.modalMetaText}>Idade: {selectedDog.age || 'Não informada'}</Text>
                  </View>

                  {point.creatorId !== currentUserId && (
                    <TouchableOpacity 
                      style={styles.adoptButton}
                      onPress={() => {
                        if (!currentUserId) {
                          Alert.alert('Erro', 'Você precisa estar logado para manifestar interesse.');
                          return;
                        }

                        if (point.contactPhone) {
                          setIsContactChoiceVisible(true);
                        } else {
                          handleStartChat();
                        }
                      }}
                    >
                      <Text style={styles.adoptButtonText}>TENHO INTERESSE EM ADOTAR</Text>
                    </TouchableOpacity>
                  )}

                  {selectedDog.creatorId === currentUserId && (
                    <TouchableOpacity 
                      style={[styles.adoptButton, { backgroundColor: '#8DB0C2', marginTop: 10 }]}
                      onPress={() => {
                        Alert.alert(
                          'Confirmar Adoção',
                          `Tem certeza que deseja marcar ${selectedDog.name} como adotado? Ele não aparecerá mais na galeria pública.`,
                          [
                            { text: 'Cancelar', style: 'cancel' },
                            { text: 'Confirmar', onPress: () => handleUpdateDogStatus(selectedDog.id, 'adopted') }
                          ]
                        );
                      }}
                    >
                      <Text style={styles.adoptButtonText}>MARCAR COMO ADOTADO</Text>
                    </TouchableOpacity>
                  )}

                  {selectedDog.creatorId === currentUserId && (
                    <TouchableOpacity 
                      style={[styles.adoptButton, { backgroundColor: 'transparent', marginTop: 10, borderWidth: 1, borderColor: '#FA3045' }]}
                      onPress={() => {
                        Alert.alert(
                          'EXCLUIR DEFINITIVAMENTE',
                          `Tem certeza que deseja apagar o registro de ${selectedDog.name}? Esta ação não pode ser desfeita.`,
                          [
                            { text: 'Cancelar', style: 'cancel' },
                            { 
                              text: 'Excluir', 
                              style: 'destructive',
                              onPress: () => handleDeleteDog(selectedDog.id) 
                            }
                          ]
                        );
                      }}
                    >
                      <Text style={[styles.adoptButtonText, { color: '#FA3045' }]}>EXCLUIR REGISTRO</Text>
                    </TouchableOpacity>
                  )}
                </View>
              </ScrollView>
            )}
          </View>
        </View>
      </Modal>

      {/* Modal de Escolha de Contato */}
      <Modal
        visible={isContactChoiceVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setIsContactChoiceVisible(false)}
      >
        <TouchableOpacity 
          style={styles.choiceModalOverlay} 
          activeOpacity={1} 
          onPress={() => setIsContactChoiceVisible(false)}
        >
          <View style={styles.choiceModalContent}>
            <Text style={styles.choiceModalTitle}>Como deseja entrar em contato?</Text>
            <Text style={styles.choiceModalSubtitle}>Escolha o canal de preferência para falar com o responsável.</Text>
            
            <View style={styles.optionsContainer}>
              <TouchableOpacity 
                style={styles.optionButton}
                onPress={() => {
                  setIsContactChoiceVisible(false);
                  const cleanPhone = point!.contactPhone!.replace(/\D/g, '');
                  const phone = cleanPhone.startsWith('55') ? cleanPhone : `55${cleanPhone}`;
                  const message = encodeURIComponent(`Olá! Tenho interesse em adotar o cachorro ${selectedDog?.name} que vi no DogDex.`);
                  const url = `https://wa.me/${phone}?text=${message}`;
                  Linking.openURL(url).catch(() => {
                    Alert.alert('Erro', 'Não foi possível abrir o WhatsApp.');
                  });
                }}
              >
                <Ionicons name="logo-whatsapp" size={40} color="#25D366" />
                <Text style={styles.optionLabel}>WhatsApp</Text>
              </TouchableOpacity>

              <TouchableOpacity 
                style={styles.optionButton}
                onPress={() => {
                  setIsContactChoiceVisible(false);
                  handleStartChat();
                }}
              >
                <Ionicons name="chatbubbles" size={40} color="#4CAF50" />
                <Text style={styles.optionLabel}>Chat Interno</Text>
              </TouchableOpacity>
            </View>
          </View>
        </TouchableOpacity>
      </Modal>
    </SafeAreaView>
  );
}
