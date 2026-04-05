import React, { useEffect, useRef } from 'react';
import { View, Text, Animated } from 'react-native';
import { styles } from './styles';

type HeaderLedsProps = {
  status: 'idle' | 'loading' | 'success' | 'error';
  isCameraReady: boolean;
};

export default function HeaderLeds({ status, isCameraReady }: HeaderLedsProps) {
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
      <Text style={styles.versionText}>Dogdex V1.0</Text>
      
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
    </View>
  );
}
