import { 
  View, 
  Text, 
  FlatList, 
  Image, 
  TouchableOpacity, 
  SafeAreaView,
  Alert,
  Platform,
  Modal,
  ScrollView
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useDogdexStorage, DogdexEntry } from '../../hooks/useDogdexStorage';
import { useAuth } from '../../hooks/useAuth';
import { useEffect, useCallback, useState } from 'react';
import ProfileModal from '../../components/ProfileModal';

import { styles, COLUMN_COUNT } from './styles';

export default function DogdexScreen() {
  const router = useRouter();
  const { user } = useAuth();
  const { getEntries, deleteEntry, syncWithCloud } = useDogdexStorage();
  const [entries, setEntries] = useState<DogdexEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedDog, setSelectedDog] = useState<DogdexEntry | null>(null);
  const [isSyncing, setIsSyncing] = useState(false);
  const [isProfileVisible, setIsProfileVisible] = useState(false);

  const loadData = useCallback(async () => {
    setLoading(true);
    const data = await getEntries();
    setEntries(data);
    setLoading(false);
  }, [getEntries]);

  const handleSync = useCallback(async () => {
    setIsSyncing(true);
    try {
      const result = await syncWithCloud();
      if (result.pulled > 0 || result.pushed > 0) {
        const data = await getEntries();
        setEntries(data);
      }
    } catch {
      console.warn('Silent sync failed');
    } finally {
      setIsSyncing(false);
    }
  }, [syncWithCloud, getEntries]);

  useEffect(() => {
    let mounted = true;
    const init = async () => {
      await loadData();
      if (mounted) {
        await handleSync();
      }
    };
    init();
    return () => { mounted = false; };
  }, []); // Only once on mount

  const handleDelete = async (id: string, name: string) => {
    const performDelete = async () => {
      const success = await deleteEntry(id);
      if (success) {
        setEntries(prev => prev.filter(e => e.id !== id));
      } else {
        Alert.alert('Erro', 'Não foi possível apagar o registro.');
      }
    };

    if (Platform.OS === 'web') {
      if (confirm(`Deseja apagar o registro de ${name}?`)) {
        performDelete();
      }
    } else {
      Alert.alert(
        'Apagar Registro',
        `Deseja realmente remover ${name} da sua Dogdex?`,
        [
          { text: 'Cancelar', style: 'cancel' },
          { text: 'Apagar', style: 'destructive', onPress: performDelete }
        ]
      );
    }
  };
  
  const renderItem = ({ item }: { item: DogdexEntry }) => (
    <TouchableOpacity 
      style={styles.card} 
      activeOpacity={0.8} 
      onPress={() => setSelectedDog(item)}
    >
      <View style={styles.imageContainer}>
        <Image source={{ uri: item.imageUri }} style={styles.image} />
        <View style={styles.confidenceBadge}>
          <Text style={styles.confidenceText}>{((item.confidence || 0) * 100).toFixed(0)}%</Text>
        </View>
        
        {/* Sync Status Icon */}
        <View style={styles.syncIndicator}>
          <Ionicons 
            name={item.status === 'synced' ? "cloud-done" : "cloud-upload"} 
            size={14} 
            color={item.status === 'synced' ? "#4CAF50" : "#FFA000"} 
          />
        </View>

        <TouchableOpacity 
          style={styles.deleteButton} 
          onPress={() => handleDelete(item.id, item.breedName)}
        >
          <Ionicons name="trash" size={18} color="#FFF" />
        </TouchableOpacity>
      </View>
      <View style={styles.cardInfo}>
        <Text style={styles.breedName} numberOfLines={1}>{item.breedName}</Text>
        <View style={styles.metaRow}>
          <Ionicons name="location-outline" size={12} color="#AAA" />
          <Text style={styles.metaText} numberOfLines={1}>{item.locationAddr}</Text>
        </View>
        <Text style={styles.dateText}>
          {new Date(item.timestamp).toLocaleDateString('pt-BR')}
        </Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#FFF" />
        </TouchableOpacity>
        
        <View style={styles.titleContainer}>
          <Text style={styles.title}>DOGDEX</Text>
          {user && (
            <TouchableOpacity onPress={() => setIsProfileVisible(true)} activeOpacity={0.7}>
              <Text style={styles.userEmail} numberOfLines={1}>
                {user.email} <Ionicons name="chevron-down" size={10} color="#666" />
              </Text>
            </TouchableOpacity>
          )}
        </View>

        <View style={styles.headerActions}>
          <TouchableOpacity
            onPress={handleSync}
            style={[styles.actionButton, isSyncing && styles.actionButtonDisabled]}
            disabled={isSyncing}
          >
            <Ionicons 
              name={isSyncing ? "sync" : "refresh"} 
              size={20} 
              color={isSyncing ? "#555" : "#FFF"} 
            />
          </TouchableOpacity>
        </View>
      </View>

      {loading ? (
        <View style={styles.centered}>
          <Text style={styles.loadingText}>Loading database...</Text>
        </View>
      ) : entries.length === 0 ? (
        <View style={styles.centered}>
          <Ionicons name="paw-outline" size={64} color="#333" />
          <Text style={styles.emptyText}>No dogs scanned yet.</Text>
          <TouchableOpacity 
            style={styles.scanNowButton}
            onPress={() => router.push('/')}
          >
            <Text style={styles.scanNowText}>SCAN NOW</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <FlatList
          data={entries}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          numColumns={COLUMN_COUNT}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
        />
      )}

      <Modal
        visible={!!selectedDog}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setSelectedDog(null)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <TouchableOpacity style={styles.modalCloseButton} onPress={() => setSelectedDog(null)}>
              <Ionicons name="close-circle" size={32} color="#FA3045" />
            </TouchableOpacity>

            {selectedDog && (
              <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.listContent}>
                <Image source={{ uri: selectedDog.imageUri }} style={styles.modalImage} />
                
                <View style={styles.modalInfoContainer}>
                  <Text style={styles.modalBreedTitle}><Ionicons name="paw" size={24} color="#0F380F" /> {selectedDog.breedName}</Text>
                  
                  <View style={styles.modalMetaRow}>
                    <Ionicons name="location" size={16} color="#0F380F" />
                    <Text style={styles.modalMetaText}>{selectedDog.locationAddr}</Text>
                  </View>
                  
                  <View style={styles.modalMetaRow}>
                    <Ionicons name="calendar" size={16} color="#0F380F" />
                    <Text style={styles.modalMetaText}>{new Date(selectedDog.timestamp).toLocaleString('pt-BR')}</Text>
                  </View>
                  
                  <View style={styles.modalDivider} />

                  <Text style={styles.modalSectionTitle}>ANALYSIS DATA</Text>
                  <Text style={styles.modalDetailText}>Precisão: {((selectedDog.confidence || 0) * 100).toFixed(1)}%</Text>
                  
                  {selectedDog.dogData && (
                    <>
                      <Text style={styles.modalDetailText}>Temperamento: {selectedDog.dogData.temperament?.join(', ') || 'N/A'}</Text>
                      <Text style={styles.modalDetailText}>Energia: {selectedDog.dogData.energy || 'N/A'}</Text>
                      <Text style={styles.modalDetailText}>Vida Prevista: {selectedDog.dogData.life || 'N/A'}</Text>
                    </>
                  )}
                </View>
              </ScrollView>
            )}
          </View>
        </View>
      </Modal>

      <ProfileModal 
        isVisible={isProfileVisible} 
        onClose={() => setIsProfileVisible(false)} 
      />
    </SafeAreaView>
  );
}
