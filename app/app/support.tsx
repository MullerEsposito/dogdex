import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TextInput, 
  TouchableOpacity, 
  ScrollView, 
  Image, 
  Alert, 
  ActivityIndicator,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import * as ImagePicker from 'expo-image-picker';
import * as Device from 'expo-device';
import { sendSupportReport } from '../services/api';
import { DeviceInfo } from '@dogdex/shared';

export default function SupportScreen() {
  const router = useRouter();
  const [type, setType] = useState<'bug' | 'feature'>('bug');
  const [userName, setUserName] = useState('');
  const [userEmail, setUserEmail] = useState('');
  const [text, setText] = useState('');
  const [screenshot, setScreenshot] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [deviceInfo, setDeviceInfo] = useState<DeviceInfo | null>(null);

  useEffect(() => {
    // Capture device info automatically
    setDeviceInfo({
      brand: Device.brand,
      modelName: Device.modelName,
      osName: Device.osName,
      osVersion: Device.osVersion,
      platform: Platform.OS
    });
  }, []);

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 0.8,
    });

    if (!result.canceled) {
      setScreenshot(result.assets[0].uri);
    }
  };

  const handleSubmit = async () => {
    if (!text.trim()) {
      Alert.alert('Erro', 'Por favor, descreva o problema ou sugestão.');
      return;
    }

    setLoading(true);
    try {
      const response = await sendSupportReport(
        { 
          type, 
          text, 
          userName: userName.trim() || undefined,
          userEmail: userEmail.trim() || undefined,
          deviceInfo 
        },
        screenshot || undefined
      );

      if (response.success) {
        Alert.alert(
          'Enviado!', 
          `Seu relato foi recebido com sucesso. ${response.previewUrl ? '\n\nPreview (Ethereal): ' + response.previewUrl : ''}`,
          [{ text: 'OK', onPress: () => router.back() }]
        );
      } else {
        throw new Error(response.message || response.error || 'Erro desconhecido');
      }
    } catch (error: any) {
      console.error(error);
      const errorMessage = error.message || 'Não foi possível enviar o relato. Tente novamente.';
      Alert.alert('Erro', errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
      >
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <Ionicons name="arrow-back" size={24} color="#FFF" />
          </TouchableOpacity>
          <Text style={styles.title}>SUPORTE & FEEDBACK</Text>
          <View style={{ width: 24 }} />
        </View>

        <ScrollView contentContainerStyle={styles.scrollContent}>
          <Text style={styles.label}>O que você deseja fazer?</Text>
          <View style={styles.typeSelector}>
            <TouchableOpacity 
              style={[styles.typeButton, type === 'bug' && styles.typeButtonActive]}
              onPress={() => setType('bug')}
            >
              <Ionicons name="bug" size={20} color={type === 'bug' ? '#FFF' : '#AAA'} />
              <Text style={[styles.typeButtonText, type === 'bug' && styles.typeButtonTextActive]}>
                Relatar Erro
              </Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={[styles.typeButton, type === 'feature' && styles.typeButtonActive]}
              onPress={() => setType('feature')}
            >
              <Ionicons name="bulb" size={20} color={type === 'feature' ? '#FFF' : '#AAA'} />
              <Text style={[styles.typeButtonText, type === 'feature' && styles.typeButtonTextActive]}>
                Sugestão
              </Text>
            </TouchableOpacity>
          </View>

          <Text style={styles.label}>Informações de Contato (Opcional)</Text>
          <View style={styles.contactRow}>
            <View style={{ flex: 1 }}>
              <TextInput
                style={styles.smallInput}
                placeholder="Seu nome"
                placeholderTextColor="#666"
                value={userName}
                onChangeText={setUserName}
              />
            </View>
            <View style={{ flex: 1 }}>
              <TextInput
                style={styles.smallInput}
                placeholder="Seu e-mail"
                placeholderTextColor="#666"
                keyboardType="email-address"
                autoCapitalize="none"
                value={userEmail}
                onChangeText={setUserEmail}
              />
            </View>
          </View>

          <Text style={styles.label}>Descrição</Text>
          <TextInput
            style={styles.input}
            placeholder={type === 'bug' ? "Descreva o erro que você encontrou..." : "Qual funcionalidade você gostaria de ver no DogDex?"}
            placeholderTextColor="#666"
            multiline
            numberOfLines={6}
            value={text}
            onChangeText={setText}
            textAlignVertical="top"
          />

          {type === 'bug' && (
            <>
              <Text style={styles.label}>Captura de Tela (Opcional)</Text>
              <TouchableOpacity style={styles.imagePicker} onPress={pickImage}>
                {screenshot ? (
                  <Image source={{ uri: screenshot }} style={styles.previewImage} />
                ) : (
                  <View style={styles.imagePickerPlaceholder}>
                    <Ionicons name="image-outline" size={40} color="#666" />
                    <Text style={styles.imagePickerText}>Selecionar imagem</Text>
                  </View>
                )}
              </TouchableOpacity>
              {screenshot && (
                <TouchableOpacity onPress={() => setScreenshot(null)} style={styles.removeImage}>
                  <Text style={styles.removeImageText}>Remover imagem</Text>
                </TouchableOpacity>
              )}
            </>
          )}

          <View style={styles.deviceInfoBox}>
            <View style={styles.deviceInfoHeader}>
              <Ionicons name="phone-portrait-outline" size={16} color="#AAA" />
              <Text style={styles.deviceInfoTitle}>Informações do Dispositivo</Text>
            </View>
            <Text style={styles.deviceInfoText}>
              {deviceInfo ? `${deviceInfo.brand} ${deviceInfo.modelName} - ${deviceInfo.osName} ${deviceInfo.osVersion}` : 'Carregando...'}
            </Text>
            <Text style={styles.deviceInfoSub}>Essas informações ajudam a equipe a resolver bugs mais rápido.</Text>
          </View>

          <TouchableOpacity 
            style={[styles.submitButton, loading && styles.submitButtonDisabled]}
            onPress={handleSubmit}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#FFF" />
            ) : (
              <>
                <Text style={styles.submitButtonText}>ENVIAR RELATÓRIO</Text>
                <Ionicons name="send" size={18} color="#FFF" style={{ marginLeft: 8 }} />
              </>
            )}
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1A1D23',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 15,
    paddingVertical: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#333',
  },
  backButton: {
    padding: 5,
  },
  title: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: 'bold',
    letterSpacing: 2,
  },
  scrollContent: {
    padding: 20,
  },
  label: {
    color: '#AAA',
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 10,
    marginTop: 10,
    letterSpacing: 1,
  },
  typeSelector: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 20,
  },
  typeButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    backgroundColor: '#2A303A',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#383D47',
    gap: 8,
  },
  typeButtonActive: {
    backgroundColor: '#FA3045',
    borderColor: '#FA3045',
  },
  typeButtonText: {
    color: '#AAA',
    fontWeight: 'bold',
  },
  typeButtonTextActive: {
    color: '#FFF',
  },
  input: {
    backgroundColor: '#2A303A',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#383D47',
    color: '#FFF',
    padding: 15,
    fontSize: 16,
    minHeight: 120,
    marginBottom: 20,
  },
  contactRow: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 10,
  },
  smallInput: {
    backgroundColor: '#2A303A',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#383D47',
    color: '#FFF',
    padding: 12,
    fontSize: 14,
  },
  imagePicker: {
    backgroundColor: '#2A303A',
    borderRadius: 8,
    borderWidth: 2,
    borderColor: '#383D47',
    borderStyle: 'dashed',
    height: 150,
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
  imagePickerPlaceholder: {
    alignItems: 'center',
  },
  imagePickerText: {
    color: '#666',
    marginTop: 10,
    fontWeight: 'bold',
  },
  previewImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  removeImage: {
    marginTop: 10,
    alignSelf: 'flex-end',
  },
  removeImageText: {
    color: '#FA3045',
    fontSize: 12,
    fontWeight: 'bold',
  },
  deviceInfoBox: {
    backgroundColor: 'rgba(255,255,255,0.05)',
    padding: 15,
    borderRadius: 8,
    marginTop: 20,
    marginBottom: 30,
    borderLeftWidth: 4,
    borderLeftColor: '#FA3045',
  },
  deviceInfoHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 5,
  },
  deviceInfoTitle: {
    color: '#AAA',
    fontSize: 12,
    fontWeight: 'bold',
  },
  deviceInfoText: {
    color: '#FFF',
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  deviceInfoSub: {
    color: '#666',
    fontSize: 10,
  },
  submitButton: {
    backgroundColor: '#FA3045',
    flexDirection: 'row',
    paddingVertical: 18,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5,
    shadowColor: '#FA3045',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
  },
  submitButtonDisabled: {
    backgroundColor: '#666',
    shadowOpacity: 0,
  },
  submitButtonText: {
    color: '#FFF',
    fontWeight: 'bold',
    fontSize: 16,
    letterSpacing: 1.5,
  },
});
