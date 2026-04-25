import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
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
import { sendSupportReport } from '../../services/api';
import { DeviceInfo } from '@dogdex/shared';
import { styles } from './styles';

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
        style={styles.container}
      >
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <Ionicons name="arrow-back" size={24} color="#FFF" />
          </TouchableOpacity>
          <Text style={styles.title}>SUPORTE & FEEDBACK</Text>
          <View style={styles.headerSpacer} />
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
            <View style={styles.contactField}>
              <TextInput
                style={styles.smallInput}
                placeholder="Seu nome"
                placeholderTextColor="#666"
                value={userName}
                onChangeText={setUserName}
              />
            </View>
            <View style={styles.contactField}>
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
                <Ionicons name="send" size={18} color="#FFF" style={styles.submitIcon} />
              </>
            )}
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
