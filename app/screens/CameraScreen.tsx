import React, { useRef, useState, useEffect } from 'react';
import { CameraView, useCameraPermissions } from 'expo-camera';
import { View, Text, TouchableOpacity, Image, ActivityIndicator, ScrollView, Alert, Linking, Animated } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { analyzeDog } from '../services/api';
import { AnalyzeResult } from '@dogdex/shared';
import { styles } from './CameraScreen.styles';

export default function CameraScreen() {
  const [permission, requestPermission] = useCameraPermissions();
  const [photo, setPhoto] = useState<any>(null);
  const [result, setResult] = useState<AnalyzeResult | null>(null);
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [isCameraReady, setIsCameraReady] = useState(false);
  const [isCameraActive, setIsCameraActive] = useState(true);
  const [zoom, setZoom] = useState(0);
  const cameraRef = useRef<any>(null);

  const handleZoomIn = () => setZoom(prev => Math.min(prev + 0.1, 1));
  const handleZoomOut = () => setZoom(prev => Math.max(prev - 0.1, 0));

  const toggleCamera = () => {
    setIsCameraActive(prev => !prev);
    setIsCameraReady(false);
  };

  // Animation values for LEDs
  const ledAnim1 = useRef(new Animated.Value(0.3)).current;
  const ledAnim2 = useRef(new Animated.Value(0.3)).current;
  const ledAnim3 = useRef(new Animated.Value(0.3)).current;
  const mainLensAnim = useRef(new Animated.Value(0.5)).current;

  useEffect(() => {
    if (status === 'loading') {
      Animated.loop(
        Animated.sequence([
          Animated.timing(ledAnim1, { toValue: 1, duration: 200, useNativeDriver: true }),
          Animated.timing(ledAnim1, { toValue: 0.3, duration: 200, useNativeDriver: true }),
          Animated.timing(ledAnim2, { toValue: 1, duration: 200, useNativeDriver: true }),
          Animated.timing(ledAnim2, { toValue: 0.3, duration: 200, useNativeDriver: true }),
          Animated.timing(ledAnim3, { toValue: 1, duration: 200, useNativeDriver: true }),
          Animated.timing(ledAnim3, { toValue: 0.3, duration: 200, useNativeDriver: true }),
        ])
      ).start();
      
      Animated.timing(mainLensAnim, {
        toValue: 0.7,
        duration: 300,
        useNativeDriver: true,
      }).start();
      
    } else {
      ledAnim1.setValue(0.3);
      ledAnim2.setValue(0.3);
      ledAnim3.setValue(0.3);
      
      Animated.timing(mainLensAnim, { 
        toValue: (status === 'success' || status === 'error') ? 1 : 0.5, 
        duration: 300, 
        useNativeDriver: true 
      }).start();
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

        // Native Expo SDK 55 compatibility
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

  const getLensColor = () => {
    switch (status) {
      case 'success': return '#4CAF50';
      case 'error': return '#F44336';
      default: return '#00FFFF';
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
    <SafeAreaView style={styles.container}>
      {/* HEADER: LENS & LEDS */}
      <View style={styles.headerWrapper}>
        <Text style={styles.versionText}>Dogdex V1.0</Text>
        
        <View style={styles.headerTrack}>
          {/* Left isolated LED */}
          <View style={styles.leftLedContainer}>
            <Animated.View style={[styles.led, styles.ledRed, { opacity: isCameraReady ? 1 : 0.3 }]} />
          </View>
          
          {/* Right 3 LEDs */}
          <View style={styles.rightLedsContainer}>
            <Animated.View style={[styles.led, styles.ledRed, { opacity: ledAnim1 }]} />
            <Animated.View style={[styles.led, styles.ledYellow, { opacity: ledAnim2 }]} />
            <Animated.View style={[styles.led, styles.ledGreen, { opacity: ledAnim3 }]} />
          </View>
        </View>

        {/* Center Main Lens */}
        <View style={styles.mainLensContainer}>
          <View style={styles.mainLensInnerRing}>
            <Animated.View style={[styles.mainLensGlass, { backgroundColor: getLensColor(), opacity: mainLensAnim }]}>
              <View style={styles.lensReflection} />
              <View style={styles.glassHighlight} />
            </Animated.View>
          </View>
        </View>
      </View>

      {/* VIRTUAL SCREEN VISOR */}
      <View style={styles.visorOuter}>
        <View style={styles.visorInner}>
          <View style={styles.cameraContainer}>
            {!photo ? (
              isCameraActive ? (
                <CameraView
                  style={styles.camera}
                  ref={cameraRef}
                  zoom={zoom}
                  onCameraReady={() => setIsCameraReady(true)}
                />
              ) : (
                <View style={styles.offlineScreen}>
                  <Ionicons name="power" size={64} color="#333" />
                  <Text style={styles.offlineText}>SYSTEM OFFLINE</Text>
                </View>
              )
            ) : (
              <Image source={{ uri: photo.uri }} style={styles.previewImage} />
            )}
            
            {/* OVERLAYS */}
            <View style={styles.cameraOverlay}>
              <View style={styles.overlayTopRow}>
                <Text style={styles.overlayText}>{(1 + zoom * 4).toFixed(1)}x</Text>
                <Ionicons name="camera-outline" size={20} color="rgba(255,255,255,0.8)" />
              </View>
              
              <View style={styles.overlayBottomRow}>
                {(status === 'loading' || status === 'success') && (
                  <View style={styles.resultPill}>
                    <Text style={styles.resultPillText}>
                      {status === 'loading' ? 'Scanning...' : (result?.breed ? `${result.breed} detected` : 'No match')}
                    </Text>
                  </View>
                )}
              </View>
            </View>

            {/* Slider Dots */}
            <View style={styles.sliderContainer}>
              {[5, 4, 3, 2, 1, 0].map(index => {
                const isActive = Math.round(zoom * 5) === index;
                return (
                  <View 
                    key={index} 
                    style={isActive ? styles.sliderDotActive : styles.sliderDot} 
                  />
                );
              })}
            </View>

            {/* Reticle Brackets */}
            <View style={styles.reticleCornerTL} />
            <View style={styles.reticleCornerTR} />
            <View style={styles.reticleCornerBL} />
            <View style={styles.reticleCornerBR} />
          </View>
        </View>
      </View>

      {/* BOTTOM TABS PANEL */}
      <View style={styles.tabsWrapper}>
        <View style={styles.tabsContainer}>
          <View style={styles.tabItem}>
            <Text style={[styles.tabText, styles.tabTextActive]}>SCANNING</Text>
            <View style={styles.tabIndicatorContainer}>
              <View style={styles.tabIndicator} />
            </View>
          </View>
          <View style={[styles.tabItem, styles.tabItemCenter]}>
            <Text style={styles.tabText}>POKEDEX</Text>
          </View>
          <View style={styles.tabItem}>
            <Text style={styles.tabText}>MAP</Text>
          </View>
        </View>
      </View>

      {/* CONTROL PANEL */}
      <View style={styles.controlPanel}>
        
        {/* Left: D-Pad */}
        <View style={styles.dpadWrapper}>
          <Text style={styles.dpadTitle}>D-PAX</Text>
          <View style={styles.dpadCross}>
            <View style={styles.dpadVertical}>
              <View style={[styles.dpadArrowPolygon, { borderLeftWidth: 6, borderRightWidth: 6, borderBottomWidth: 10, borderBottomColor: '#FFF' }]} />
              <View style={[styles.dpadArrowPolygon, { borderLeftWidth: 6, borderRightWidth: 6, borderTopWidth: 10, borderTopColor: '#FFF' }]} />
            </View>
            <View style={styles.dpadHorizontal}>
              <View style={[styles.dpadArrowPolygon, { borderTopWidth: 6, borderBottomWidth: 6, borderRightWidth: 10, borderRightColor: '#FFF' }]} />
              <View style={[styles.dpadArrowPolygon, { borderTopWidth: 6, borderBottomWidth: 6, borderLeftWidth: 10, borderLeftColor: '#FFF' }]} />
            </View>
            <TouchableOpacity style={styles.dpadCenter} onPress={toggleCamera} activeOpacity={0.6}>
              <Ionicons name="power" size={20} color={isCameraActive ? "#4CAF50" : "#F44336"} />
            </TouchableOpacity>
          </View>
        </View>

        {/* Center: Capture Button */}
        <View style={styles.captureWrapper}>
          <Text style={styles.captureTitle}>CAPTURE</Text>
          <TouchableOpacity onPress={(!photo) ? takePicture : resetCamera} activeOpacity={0.7} disabled={!isCameraActive || (!photo && !isCameraReady)}>
            <View style={styles.captureButtonOuter}>
              <View style={styles.captureButtonInner}>
                <Ionicons name={!photo ? 'camera' : 'refresh'} size={36} color="rgba(255, 255, 255, 0.9)" />
              </View>
            </View>
          </TouchableOpacity>
        </View>

        {/* Right: Interaction (Zoom) */}
        <View style={styles.interactionWrapper}>
          <Text style={styles.interactionTitle}>INTERACTION</Text>
          <TouchableOpacity style={styles.zoomButton} onPress={handleZoomIn} activeOpacity={0.7} disabled={!isCameraActive}>
            <Text style={styles.zoomButtonText}>+</Text>
          </TouchableOpacity>
          <Text style={styles.interactionLabel}>Zoom In</Text>
          <TouchableOpacity style={styles.zoomButton} onPress={handleZoomOut} activeOpacity={0.7} disabled={!isCameraActive}>
            <Text style={styles.zoomButtonText}>-</Text>
          </TouchableOpacity>
          <Text style={styles.interactionLabel}>Zoom Out</Text>
        </View>

      </View>

        {/* LCD RESULT STRIP - FLOATING OVERLAY */}
        {photo && (
          <View style={styles.lcdScreenWrapper}>
            <View style={styles.lcdScreenHeader}>
              <Text style={styles.lcdScreenTitle}>DATA ANALYSIS</Text>
              <TouchableOpacity style={styles.lcdCloseButton} onPress={resetCamera}>
                <Ionicons name="close-circle" size={26} color="#FA3045" />
              </TouchableOpacity>
            </View>
            <ScrollView style={styles.lcdScreen} automaticallyAdjustContentInsets={false}>
              {status === 'loading' && (
                <Text style={styles.lcdTextTitle}>Analisando DNA...</Text>
              )}
              
              {status === 'error' && (
                <Text style={styles.lcdTextError}>{result?.error || 'ERRO DE CONEXÃO'}</Text>
              )}

              {status === 'success' && result && !result.error && (
                <View>
                  <Text style={styles.lcdTextTitle}><Ionicons name="paw" size={20} color="#0F380F" /> {result.breed}</Text>
                  <Text style={styles.lcdTextSub}>Precisão: {((result.confidence || 0) * 100).toFixed(1)}%</Text>
                  {result.dogData && (
                    <View style={{ marginTop: 10, borderTopWidth: 1, borderTopColor: '#555', paddingTop: 10 }}>
                      <Text style={styles.lcdTextSub}>Temperamento: {result.dogData.temperament?.join(', ') || 'N/A'}</Text>
                      <Text style={styles.lcdTextSub}>Energia: {result.dogData.energy || 'N/A'}</Text>
                      <Text style={styles.lcdTextSub}>Vida: {result.dogData.life || 'N/A'}</Text>
                    </View>
                  )}
                </View>
              )}
            </ScrollView>
          </View>
        )}
    </SafeAreaView>
  );
}
