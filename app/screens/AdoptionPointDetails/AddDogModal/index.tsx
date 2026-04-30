import React, { useState } from 'react';
import { 
  View, 
  Text, 
  Modal, 
  TextInput, 
  TouchableOpacity, 
  Image, 
  ActivityIndicator, 
  Alert,
  ScrollView,
  KeyboardAvoidingView,
  Platform
} from 'react-native';
import { styles } from './styles';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { adoptionService } from '../../../services/adoptionService';
import { useAuth } from '../../../hooks/useAuth';

interface AddDogModalProps {
  isVisible: boolean;
  onClose: () => void;
  onSuccess: () => void;
  pointId: string;
}

export default function AddDogModal({ isVisible, onClose, onSuccess, pointId }: AddDogModalProps) {
  const { session } = useAuth();
  const [name, setName] = useState('');
  const [breedName, setBreedName] = useState('');
  const [age, setAge] = useState('');
  const [description, setDescription] = useState('');
  const [imageUri, setImageUri] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.7,
    });

    if (!result.canceled) {
      setImageUri(result.assets[0].uri);
    }
  };

  const handleAddDog = async () => {
    if (!name || !breedName || !imageUri) {
      Alert.alert('Erro', 'Por favor, preencha o nome, a raça e selecione uma foto.');
      return;
    }

    setLoading(true);
    try {
      if (!session?.access_token) {
        Alert.alert('Erro', 'Você precisa estar logado para realizar esta ação.');
        return;
      }

      const dog = await adoptionService.addDog(
        session.access_token,
        pointId,
        { name, breedName, age, description },
        imageUri
      );

      if (dog) {
        Alert.alert('Sucesso', 'Cão adicionado à galeria!');
        onSuccess();
        handleClose();
      } else {
        Alert.alert('Erro', 'Não foi possível adicionar o cão.');
      }
    } catch (error) {
      console.error('Erro ao adicionar cão:', error);
      Alert.alert('Erro', 'Ocorreu um erro ao processar sua solicitação.');
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setName('');
    setBreedName('');
    setAge('');
    setDescription('');
    setImageUri(null);
    onClose();
  };

  return (
    <Modal
      visible={isVisible}
      animationType="slide"
      transparent={true}
      onRequestClose={handleClose}
    >
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.overlay}
      >
        <View style={styles.content}>
          <View style={styles.header}>
            <Text style={styles.title}>Adicionar Cão para Adoção</Text>
            <TouchableOpacity onPress={handleClose}>
              <Ionicons name="close" size={28} color="#333" />
            </TouchableOpacity>
          </View>

          <ScrollView showsVerticalScrollIndicator={false}>
            <TouchableOpacity style={styles.imagePicker} onPress={pickImage}>
              {imageUri ? (
                <Image source={{ uri: imageUri }} style={styles.previewImage} />
              ) : (
                <View style={styles.imagePlaceholder}>
                  <Ionicons name="camera" size={40} color="#8DB0C2" />
                  <Text style={styles.imagePlaceholderText}>Selecionar Foto</Text>
                </View>
              )}
            </TouchableOpacity>

            <View style={styles.form}>
              <Text style={styles.label}>Nome do Cão *</Text>
              <TextInput
                style={styles.input}
                value={name}
                onChangeText={setName}
                placeholder="Ex: Totó"
              />

              <Text style={styles.label}>Raça *</Text>
              <TextInput
                style={styles.input}
                value={breedName}
                onChangeText={setBreedName}
                placeholder="Ex: Golden Retriever"
              />

              <Text style={styles.label}>Idade (opcional)</Text>
              <TextInput
                style={styles.input}
                value={age}
                onChangeText={setAge}
                placeholder="Ex: 2 anos"
              />

              <Text style={styles.label}>Descrição (opcional)</Text>
              <TextInput
                style={[styles.input, styles.textArea]}
                value={description}
                onChangeText={setDescription}
                placeholder="Conte um pouco sobre o cão..."
                multiline
                numberOfLines={4}
              />
            </View>

            <TouchableOpacity 
              style={[styles.submitButton, loading && styles.submitButtonDisabled]} 
              onPress={handleAddDog}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color="#FFF" />
              ) : (
                <Text style={styles.submitButtonText}>CADASTRAR CÃO</Text>
              )}
            </TouchableOpacity>
          </ScrollView>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}

