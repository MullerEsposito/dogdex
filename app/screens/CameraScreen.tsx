import React, { useRef, useState } from 'react';
import { CameraView, useCameraPermissions } from 'expo-camera';
import { View, Text, TouchableOpacity, Image, ActivityIndicator, ScrollView, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { analyzeDog } from '../services/api';
import { AnalyzeResult } from '@dogdex/shared';
import { styles } from './CameraScreen.styles';

export default function CameraScreen() {
  const [permission, requestPermission] = useCameraPermissions();
  const [photo, setPhoto] = useState<any>(null);
  const [result, setResult] = useState<AnalyzeResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [isCameraReady, setIsCameraReady] = useState(false);
  const cameraRef = useRef<any>(null);

  const handleAnalyze = async () => {
    if (photo) {
      setLoading(true);
      try {
        const analyzeResponse = await analyzeDog(photo.uri);
        setResult(analyzeResponse);
      } catch (error: any) {
        setResult({ error: 'Erro ao conectar com o servidor' } as any);
      } finally {
        setLoading(false);
      }
    }
  };

  const takePicture = async () => {
    if (cameraRef.current && isCameraReady) {
      try {
        const rawCapture = await cameraRef.current.takePictureAsync({
          quality: 0.7,
        });
        
        let finalPhoto = rawCapture;
        // Native Expo SDK 55 compatibility: check if it's a PictureRef without a URI
        if (!rawCapture.uri && rawCapture.savePictureAsync) {
          finalPhoto = await rawCapture.savePictureAsync();
        }
        
        setPhoto(finalPhoto);
      } catch (error: any) {
        console.error('❌ Erro técnico:', error);
        Alert.alert('Erro na Câmera', `Detalhes: ${error.message || 'Erro desconhecido'}`);
      }
    } else {
      Alert.alert('Aguarde', 'A câmera ainda está carregando...');
    }
  };

  if (!permission) return <SafeAreaView style={styles.centered}><Text>Carregando permissões...</Text></SafeAreaView>;
  if (!permission.granted) {
    return (
      <SafeAreaView style={styles.centered}>
        <Text style={styles.message}>Precisamos de acesso à câmera para identificar cachorros</Text>
        <TouchableOpacity style={styles.mainButton} onPress={requestPermission}>
          <Text style={styles.buttonText}>Permitir Acesso</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      {!photo ? (
        <View style={styles.cameraContainer}>
          <CameraView
            style={styles.camera}
            ref={cameraRef}
            onCameraReady={() => setIsCameraReady(true)}
          />

          <View style={styles.shutterContainer}>
            <TouchableOpacity
              style={styles.shutterButton}
              onPress={takePicture}
              activeOpacity={0.7}
            >
              <View style={styles.shutterInner} />
            </TouchableOpacity>
          </View>
        </View>
      ) : (
        <ScrollView contentContainerStyle={styles.previewContainer}>
          <View style={styles.imageCard}>
            <Image source={{ uri: photo.uri }} style={styles.previewImage} />
          </View>

          <View style={styles.controls}>
            {!loading ? (
              <>
                <TouchableOpacity style={styles.mainButton} onPress={handleAnalyze}>
                  <Text style={styles.buttonText}>Analisar Cachorro</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.secondaryButton} onPress={() => {
                  setPhoto(null);
                  setResult(null);
                }}>
                  <Text style={styles.secondaryButtonText}>Tirar Outra</Text>
                </TouchableOpacity>
              </>
            ) : (
              <ActivityIndicator size="large" color="#007AFF" style={{ marginVertical: 20 }} />
            )}
          </View>

          {result && (
            <View style={styles.resultContainer}>
              {result.error ? (
                <Text style={styles.errorText}>{result.error}</Text>
              ) : (
                <View style={styles.card}>
                  <Text style={styles.breedTitle}>{result.breed}</Text>
                  <View style={styles.badge}>
                    <Text style={styles.confidenceText}>
                      {((result.confidence || 0) * 100).toFixed(1)}% de precisão
                    </Text>
                  </View>

                  {result.dogData && (
                    <View style={styles.infoSection}>
                      <InfoRow label="Temperamento" value={result.dogData.temperament?.join(', ') || 'N/A'} />
                      <InfoRow label="Energia" value={result.dogData.energy || 'N/A'} />
                      <InfoRow label="Vida" value={result.dogData.life || 'N/A'} />
                    </View>
                  )}
                </View>
              )}
            </View>
          )}
        </ScrollView>
      )}
    </SafeAreaView>
  );
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.infoRow}>
      <Text style={styles.infoLabel}>{label}:</Text>
      <Text style={styles.infoValue}>{value}</Text>
    </View>
  );
}
