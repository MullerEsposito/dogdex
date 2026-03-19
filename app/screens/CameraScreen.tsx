import { CameraView, useCameraPermissions } from 'expo-camera';
import { useRef, useState } from 'react';
import { View, Text, Button, Image } from 'react-native';
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
      const result = await analyzeDog(photo.uri);
      setResult(result);
      setLoading(false);
    }
  };

  if (!permission) {
    return <Text>Carregando permissões...</Text>;
  }

  if (!permission.granted) {
    return (
      <View>
        <Text>Precisamos de acesso à câmera</Text>
        <Button title="Permitir" onPress={requestPermission} />
      </View>
    );
  }

  const takePicture = async () => {
    if (cameraRef.current) {
      const result = await cameraRef.current.takePictureAsync();
      setPhoto(result);
    }
  };

  return (
    <View style={{ flex: 1 }}>
      {!photo ? (
        <>
          <CameraView style={{ flex: 1 }} ref={cameraRef} />
          <Button title="Capturar" onPress={takePicture} />
        </>
      ) : (
        <>
          <Image source={{ uri: photo.uri }} style={{ flex: 1 }} />
          <Button title="Analisar cachorro" onPress={handleAnalyze} />
          <Button title="Tirar outra" onPress={() => setPhoto(null)} />
          {result && (
            <View style={{ padding: 20 }}>
              <Text style={{ fontSize: 20, fontWeight: 'bold' }}>
                {result.breed}
              </Text>

              <Text>Confiança: {(result.confidence * 100).toFixed(1)}%</Text>

              {result.info && (
                <>
                  <Text>Temperamento: {result.info.temperament?.join(', ')}</Text>
                  <Text>Energia: {result.info.energy}</Text>
                  <Text>Expectativa de vida: {result.info.life}</Text>
                </>
              )}
            </View>
          )}
        </>
      )}
    </View>
  );
}