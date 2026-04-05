import React from 'react';
import { View, Text, Image } from 'react-native';
import { CameraView } from 'expo-camera';
import { Ionicons } from '@expo/vector-icons';
import { styles } from '../../screens/CameraScreen.styles';
import { AnalyzeResult } from '@dogdex/shared';

type VisorProps = {
  photo: any;
  isCameraActive: boolean;
  cameraRef: React.RefObject<any>;
  zoom: number;
  status: 'idle' | 'loading' | 'success' | 'error';
  result: AnalyzeResult | null;
  setIsCameraReady: (v: boolean) => void;
};

export default function Visor({ photo, isCameraActive, cameraRef, zoom, status, result, setIsCameraReady }: VisorProps) {
  return (
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

          <View style={styles.reticleCornerTL} />
          <View style={styles.reticleCornerTR} />
          <View style={styles.reticleCornerBL} />
          <View style={styles.reticleCornerBR} />
        </View>
      </View>
    </View>
  );
}
