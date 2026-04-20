import React, { useEffect, useRef } from 'react';
import { View, Text, Animated, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { CopilotStep, walkthroughable } from 'react-native-copilot';
import Constants from 'expo-constants';
import { styles } from './styles';

const WalkthroughableView = walkthroughable(View);
const WalkthroughableTouchableOpacity = walkthroughable(TouchableOpacity);

type HeaderLedsProps = {
  status: 'idle' | 'loading' | 'success' | 'error';
  isCameraReady: boolean;
  isAudioEnabled: boolean;
  onToggleAudio: () => void;
  onStartTour?: () => void;
};

export default function HeaderLeds({ status, isCameraReady, isAudioEnabled, onToggleAudio, onStartTour }: HeaderLedsProps) {
  const router = useRouter();
  const appVersion = Constants.expoConfig?.version || '1.0';
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

  const getLensColor = () => {
    switch (status) {
      case 'success': return '#4CAF50';
      case 'error': return '#F44336';
      default: return '#00FFFF';
    }
  };

  return (
    <View style={styles.headerWrapper}>
      <Text style={styles.versionText}>Dogdex V{appVersion}</Text>
      <View style={styles.topInfoRow}>
        <View style={styles.leftControls}>
          <CopilotStep text="Gosta do projeto? Apoie a manutenção do sistema com uma doação!" order={8} name="donate">
            <WalkthroughableTouchableOpacity style={styles.speechToggle} onPress={() => router.push('/donate' as any)} activeOpacity={0.7}>
              <Ionicons name="heart-half-outline" size={18} color="#FFF" />
            </WalkthroughableTouchableOpacity>
          </CopilotStep>
          <TouchableOpacity style={styles.speechToggle} onPress={onStartTour} activeOpacity={0.7}>
            <Ionicons name="help-circle-outline" size={18} color="#FFF" />
          </TouchableOpacity>
        </View>
        
        <View style={styles.rightControls}>
          <CopilotStep text="Encontrou um erro ou tem uma ideia? Use o botão de Bug para nos avisar." order={2} name="support">
            <WalkthroughableTouchableOpacity style={styles.supportButton} onPress={() => router.push('/support' as any)}>
              <Ionicons name="bug-outline" size={18} color="#FFF" />
            </WalkthroughableTouchableOpacity>
          </CopilotStep>
          <CopilotStep text="Ative ou desative o áudio global do aplicativo (efeitos e voz)." order={3} name="audio">
            <WalkthroughableTouchableOpacity style={styles.speechToggle} onPress={onToggleAudio}>
              <Ionicons 
                name={isAudioEnabled ? "volume-medium" : "volume-mute"} 
                size={18} 
                color="#FFF" 
              />
            </WalkthroughableTouchableOpacity>
          </CopilotStep>
        </View>
      </View>
      
      <CopilotStep text={`Este é o seu scanner DogDex v${appVersion}. Ele indica se o sistema está pronto e o status da análise em andamento.`} order={1} name="status">
        <WalkthroughableView style={{ justifyContent: 'center' }}>
          <View style={styles.headerTrack}>
            <View style={styles.leftLedContainer}>
              <Animated.View style={[styles.led, styles.ledRed, { opacity: isCameraReady ? 1 : 0.3 }]} />
            </View>
            
            <View style={styles.rightLedsContainer}>
              <Animated.View style={[styles.led, styles.ledRed, { opacity: ledAnim1 }]} />
              <Animated.View style={[styles.led, styles.ledYellow, { opacity: ledAnim2 }]} />
              <Animated.View style={[styles.led, styles.ledGreen, { opacity: ledAnim3 }]} />
            </View>
          </View>

          <View style={styles.mainLensContainer}>
            <View style={styles.mainLensInnerRing}>
              <Animated.View style={[styles.mainLensGlass, { backgroundColor: getLensColor(), opacity: mainLensAnim }]}>
                <View style={styles.lensReflection} />
                <View style={styles.glassHighlight} />
              </Animated.View>
            </View>
          </View>
        </WalkthroughableView>
      </CopilotStep>
    </View>
  );
}
