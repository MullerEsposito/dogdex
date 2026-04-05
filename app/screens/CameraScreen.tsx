import React, { useRef, useState, useEffect } from 'react';
import { useCameraPermissions } from 'expo-camera';
import { Text, TouchableOpacity, Alert, Linking, View, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Svg, { Defs, RadialGradient, Rect, Stop } from 'react-native-svg';
import { analyzeDog } from '../services/api';
import { AnalyzeResult } from '@dogdex/shared';
import { styles } from './CameraScreen.styles';

// Hooks
import { useDogdexSounds } from '../hooks/useDogdexSounds';

// UI Components
import HeaderLeds from '../components/camera/HeaderLeds';
import Visor from '../components/camera/Visor';
import TabsPanel from '../components/camera/TabsPanel';
import ControlPanel from '../components/camera/ControlPanel';
import LcdOverlay from '../components/camera/LcdOverlay';

export default function CameraScreen() {
  const [permission, requestPermission] = useCameraPermissions();
  const [photo, setPhoto] = useState<any>(null);
  const [result, setResult] = useState<AnalyzeResult | null>(null);
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [isCameraReady, setIsCameraReady] = useState(false);
  const [isCameraActive, setIsCameraActive] = useState(true);
  const [zoom, setZoom] = useState(0);
  const cameraRef = useRef<any>(null);

  const { playSound, stopLoadingSound } = useDogdexSounds();

  const handleZoomIn = () => setZoom(prev => Math.min(prev + 0.1, 1));
  const handleZoomOut = () => setZoom(prev => Math.max(prev - 0.1, 0));

  const toggleCamera = () => {
    setIsCameraActive(prev => {
      const next = !prev;
      if (next) playSound('powerOn');
      else playSound('powerOff');
      return next;
    });
    setIsCameraReady(false);
  };

  useEffect(() => {
    if (status === 'loading') {
      playSound('loading');
    } else {
      stopLoadingSound();
      if (status === 'success') playSound('success');
      else if (status === 'error') playSound('error');
    }
  }, [status]);

  const handleAnalyze = async (photoUri: string) => {
    setStatus('loading');
    try {
      const analyzeResponse = await analyzeDog(photoUri);
      setResult(analyzeResponse);
      setStatus(analyzeResponse.error ? 'error' : 'success');
    } catch (error: any) {
      setResult({ error: 'Erro ao conectar com o servidor' } as any);
      setStatus('error');
    }
  };

  const takePicture = async () => {
    if (status === 'loading') return;
    
    if (cameraRef.current && isCameraReady) {
      try {
        const rawCapture = await cameraRef.current.takePictureAsync({ quality: 0.7 });
        let finalPhoto = rawCapture;

        if (!rawCapture.uri && rawCapture.savePictureAsync) {
          finalPhoto = await rawCapture.savePictureAsync();
        }
        
        setPhoto(finalPhoto);
        handleAnalyze(finalPhoto.uri);
      } catch (error: any) {
        console.error('❌ Erro técnico:', error);
        Alert.alert('Erro na Câmera', `Detalhes: ${error.message || 'Erro desconhecido'}`);
        setStatus('error');
      }
    } else {
      Alert.alert('Aguarde', 'A câmera ainda está carregando...');
    }
  };

  const resetCamera = () => {
    setPhoto(null);
    setResult(null);
    setStatus('idle');
  };

  if (!permission) return <SafeAreaView style={styles.centered}><Text style={styles.message}>Carregando permissões...</Text></SafeAreaView>;
  
  if (!permission.granted) {
    return (
      <SafeAreaView style={styles.centered}>
        <Text style={styles.message}>
          {permission.canAskAgain 
            ? 'Precisamos de acesso à câmera para identificar cachorros'
            : 'O acesso à câmera foi bloqueado. Por favor, libere a permissão nas Configurações.'}
        </Text>
        <TouchableOpacity style={styles.mainButton} onPress={permission.canAskAgain ? requestPermission : () => Linking.openSettings()}>
          <Text style={styles.buttonText}>{permission.canAskAgain ? 'Permitir Acesso' : 'Abrir Configurações'}</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  return (
    <View style={styles.container}>
      <View style={{...StyleSheet.absoluteFillObject, zIndex: -1}}>
        <Svg height="100%" width="100%">
          <Defs>
            <RadialGradient
              id="bgGrad"
              gradientUnits='userSpaceOnUse'
              cx="50%"
              cy="45%"
              rx="10%"
              ry="100%"
              fx="50%"
              fy="50%"
            >
              <Stop offset="0%" stopColor="#FF9AA5" />
              <Stop offset="20%" stopColor="#FF3B5C" />
              <Stop offset="55%" stopColor="#B0001E" />
              <Stop offset="80%" stopColor="#c1212b" />
              <Stop offset="100%" stopColor="#a11427" />
            </RadialGradient>
          </Defs>
          <Rect x="0" y="0" width="100%" height="100%" fill="url(#bgGrad)" />
        </Svg>
      </View>

      <SafeAreaView style={{ flex: 1 }}>
        <HeaderLeds status={status} isCameraReady={isCameraReady} />
      
      <Visor 
        photo={photo}
        isCameraActive={isCameraActive}
        cameraRef={cameraRef}
        zoom={zoom}
        status={status}
        result={result}
        setIsCameraReady={setIsCameraReady}
      />
      
      <TabsPanel />

      <ControlPanel 
        isCameraActive={isCameraActive}
        isCameraReady={isCameraReady}
        photo={photo}
        onToggleCamera={toggleCamera}
        onCapture={takePicture}
        onReset={resetCamera}
        onZoomIn={handleZoomIn}
        onZoomOut={handleZoomOut}
      />

      <LcdOverlay 
        photo={photo}
        status={status}
        result={result}
        onClose={resetCamera}
      />

      <View style={styles.bottomLeftArcOuter} pointerEvents="none" />
      <View style={styles.bottomLeftArcInner} pointerEvents="none" />
      <View style={styles.bottomRightArcOuter} pointerEvents="none" />
      <View style={styles.bottomRightArcInner} pointerEvents="none" />
      <View style={styles.bottomCenterSweep} pointerEvents="none" />
      </SafeAreaView>
    </View>
  );
}
