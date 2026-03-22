import { CameraView, useCameraPermissions } from 'expo-camera';
import { useRef, useState } from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet, ActivityIndicator, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { analyzeDog } from '../services/api';

export default function CameraScreen() {
  const [permission, requestPermission] = useCameraPermissions();
  const [photo, setPhoto] = useState<any>(null);
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const cameraRef = useRef<any>(null);

  const handleAnalyze = async () => {
    if (photo) {
      setLoading(true);
      try {
        const result = await analyzeDog(photo.uri);
        setResult(result);
      } catch (error) {
        setResult({ error: 'Erro ao conectar com o servidor' });
      } finally {
        setLoading(false);
      }
    }
  };

  const takePicture = async () => {
    if (cameraRef.current) {
      const result = await cameraRef.current.takePictureAsync();
      setPhoto(result);
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
          <CameraView style={styles.camera} ref={cameraRef} />
          
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
                      {( (result.confidence || 0) * 100).toFixed(1)}% de precisão
                    </Text>
                  </View>
                  
                  {result.dogData && (
                    <View style={styles.infoSection}>
                      <InfoRow label="Temperamento" value={result.dogData.temperament?.join(', ')} />
                      <InfoRow label="Energia" value={result.dogData.energy} />
                      <InfoRow label="Vida" value={result.dogData.life} />
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

function InfoRow({ label, value }: { label: string, value: string }) {
  return (
    <View style={styles.infoRow}>
      <Text style={styles.infoLabel}>{label}:</Text>
      <Text style={styles.infoValue}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  cameraContainer: {
    flex: 1,
    overflow: 'hidden',
    backgroundColor: '#000',
  },
  camera: {
    flex: 1,
  },
  shutterContainer: {
    position: 'absolute',
    bottom: 40,
    alignSelf: 'center',
  },
  shutterButton: {
    width: 80,
    height: 80,
    borderRadius: 40,
    borderWidth: 4,
    borderColor: '#FFF',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'transparent',
  },
  shutterInner: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#FFF',
  },
  previewContainer: {
    padding: 20,
    paddingBottom: 40,
  },
  imageCard: {
    width: '100%',
    aspectRatio: 1,
    borderRadius: 20,
    overflow: 'hidden',
    backgroundColor: '#E9ECEF',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    marginBottom: 20,
  },
  previewImage: {
    width: '100%',
    height: '100%',
  },
  controls: {
    gap: 12,
  },
  mainButton: {
    backgroundColor: '#007AFF',
    paddingVertical: 16,
    borderRadius: 16,
    alignItems: 'center',
    elevation: 3,
  },
  buttonText: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: '600',
  },
  secondaryButton: {
    paddingVertical: 12,
    alignItems: 'center',
  },
  secondaryButtonText: {
    color: '#6C757D',
    fontSize: 16,
  },
  resultContainer: {
    marginTop: 24,
  },
  card: {
    backgroundColor: '#FFF',
    borderRadius: 24,
    padding: 24,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 12,
  },
  breedTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#212529',
    textAlign: 'center',
    marginBottom: 8,
    textTransform: 'capitalize',
  },
  badge: {
    backgroundColor: '#E7F3FF',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    alignSelf: 'center',
    marginBottom: 20,
  },
  confidenceText: {
    color: '#007AFF',
    fontWeight: '600',
  },
  infoSection: {
    gap: 12,
    borderTopWidth: 1,
    borderTopColor: '#F1F3F5',
    paddingTop: 16,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  infoLabel: {
    color: '#6C757D',
    fontSize: 15,
  },
  infoValue: {
    color: '#212529',
    fontWeight: '500',
    flex: 1,
    textAlign: 'right',
    marginLeft: 12,
  },
  errorText: {
    color: '#DC3545',
    textAlign: 'center',
    fontSize: 16,
  },
  message: {
    textAlign: 'center',
    fontSize: 18,
    color: '#495057',
    marginBottom: 24,
  }
});