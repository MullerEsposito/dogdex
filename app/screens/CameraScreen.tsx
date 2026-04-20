import React, { useRef, useState, useEffect } from 'react';
import { useCameraPermissions } from 'expo-camera';
import { Text, TouchableOpacity, Alert, Linking, View, StyleSheet, Platform, StatusBar } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Svg, { Defs, RadialGradient, Rect, Stop } from 'react-native-svg';
import * as Location from 'expo-location';
import { analyzeDog } from '../services/api';
import { AnalyzeResult } from '@dogdex/shared';
import { styles } from './CameraScreen.styles';
import { CopilotProvider, useCopilot } from 'react-native-copilot';

// Hooks
import { useDogdexSounds } from '../hooks/useDogdexSounds';
import { useDogdexStorage } from '../hooks/useDogdexStorage';
import { useDogdexSpeech } from '../hooks/useDogdexSpeech';
import { useAudio } from '../context/AudioContext';

// UI Components
import HeaderLeds from '../components/camera/HeaderLeds';
import Visor from '../components/camera/Visor';
import TabsPanel from '../components/camera/TabsPanel';
import ControlPanel from '../components/camera/ControlPanel';
import LcdOverlay from '../components/camera/LcdOverlay';

export default function CameraScreen() {
  return (
    <CopilotProvider 
      labels={{ skip: "Pular", previous: "Anterior", next: "Próximo", finish: "Fim" }}
      stepNumberComponent={() => null}
      tooltipStyle={{ borderRadius: 10, backgroundColor: '#FFF' }}
      verticalOffset={Platform.OS === 'android' ? (StatusBar.currentHeight || 24) : 0}
    >
      <MainCameraScreen />
    </CopilotProvider>
  );
}

function MainCameraScreen() {
  const [permission, requestPermission] = useCameraPermissions();
  const [photo, setPhoto] = useState<any>(null);
  const [result, setResult] = useState<AnalyzeResult | null>(null);
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [isCameraReady, setIsCameraReady] = useState(false);
  const [isCameraActive, setIsCameraActive] = useState(true);
  const [zoom, setZoom] = useState(0);
  const [locationPermission, setLocationPermission] = useState<boolean | null>(null);
  const cameraRef = useRef<any>(null);

  const { playSound, stopLoadingSound } = useDogdexSounds();
  const { saveEntry, hasCompletedTour, completeTour } = useDogdexStorage();
  const { speakAnalyzeResult, stopSpeech } = useDogdexSpeech();
  const { isAudioEnabled, toggleAudio } = useAudio();
  
  const { start, copilotEvents } = useCopilot();

  const handleZoomIn = () => setZoom(prev => Math.min(prev + 0.1, 1));
  const handleZoomOut = () => setZoom(prev => Math.max(prev - 0.1, 0));

  useEffect(() => {
    (async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      setLocationPermission(status === 'granted');
    })();
  }, []);

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
      if (status === 'success') {
        playSound('success');
        speakAnalyzeResult(result);
      } else if (status === 'error') {
        playSound('error');
        speakAnalyzeResult(result);
      }
    }
  }, [status, result]);

  useEffect(() => {
    (async () => {
      const completed = await hasCompletedTour();
      if (!completed && permission?.granted) {
        setTimeout(() => {
          start();
        }, 800);
      }
    })();
  }, [permission?.granted]);

  useEffect(() => {
    if (copilotEvents) {
      copilotEvents.on('stop', () => {
        completeTour();
      });
      return () => {
        copilotEvents.off('stop');
      };
    }
  }, [copilotEvents]);

  const MIN_CONFIDENCE = 0.5; // 50% threshold

  const handleAnalyze = async (photoUri: string) => {
    setStatus('loading');
    try {
      const analyzeResponse = await analyzeDog(photoUri);
      
      if (!analyzeResponse.error && (analyzeResponse.confidence || 0) < MIN_CONFIDENCE) {
        setResult({ error: 'Nenhum cachorro identificado com clareza. Tente aproximar mais.' } as any);
        setStatus('error');
        return;
      }

      setResult(analyzeResponse);
      setStatus(analyzeResponse.error ? 'error' : 'success');
    } catch (error: any) {
      setResult({ error: 'Erro ao conectar com o servidor' } as any);
      setStatus('error');
    }
  };

  const handleRetry = () => {
    if (photo && photo.uri) {
      handleAnalyze(photo.uri);
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
    stopSpeech();
    setPhoto(null);
    setResult(null);
    setStatus('idle');
  };

  const handleAddData = async () => {
    if (!photo || !result || status !== 'success') {
      Alert.alert('Erro', 'Realize primeiro um escaneamento bem-sucedido.');
      return;
    }

    try {
      let addressStr = 'Localização desconhecida';
      
      if (locationPermission) {
        try {
          const loc = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.Balanced });
          const [geo] = await Location.reverseGeocodeAsync({
            latitude: loc.coords.latitude,
            longitude: loc.coords.longitude
          });

          if (geo) {
            const cityPart = geo.city || geo.subregion || geo.district || '';
            const regionPart = geo.region || '';
            addressStr = `${cityPart}${cityPart && regionPart ? ', ' : ''}${regionPart}`.trim() || `Lat: ${loc.coords.latitude.toFixed(2)}, Lon: ${loc.coords.longitude.toFixed(2)}`;
          } else {
            addressStr = `${loc.coords.latitude.toFixed(4)}, ${loc.coords.longitude.toFixed(4)}`;
          }
        } catch (locErr) {
          console.warn('Location fetch failed:', locErr);
          addressStr = 'GPS indisponível';
        }
      } else {
        addressStr = 'Sem permissão GPS';
      }

      const saved = await saveEntry(photo.uri, result, addressStr);
      if (saved) {
        Alert.alert('DogDex Atualizada', `${result.breed} foi adicionado à sua base de dados!`);
        resetCamera();
      } else {
        throw new Error('Falha ao salvar no storage');
      }
    } catch (error) {
      console.error('Save error:', error);
      Alert.alert('Erro', 'Não foi possível salvar os dados do scanner.');
    }
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
        <HeaderLeds 
          status={status} 
          isCameraReady={isCameraReady} 
          isAudioEnabled={isAudioEnabled} 
          onToggleAudio={toggleAudio}
          onStartTour={() => start()}
        />
      
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
        onAddData={handleAddData}
        onClose={resetCamera}
        onRetry={handleRetry}
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
