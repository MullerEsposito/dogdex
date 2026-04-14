import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { CopilotStep, walkthroughable } from 'react-native-copilot';
import { styles } from './styles';

const WalkthroughableView = walkthroughable(View);
const WalkthroughableTouchableOpacity = walkthroughable(TouchableOpacity);

type ControlPanelProps = {
  isCameraActive: boolean;
  isCameraReady: boolean;
  photo: any;
  onToggleCamera: () => void;
  onCapture: () => void;
  onReset: () => void;
  onZoomIn: () => void;
  onZoomOut: () => void;
};

export default function ControlPanel({ 
  isCameraActive, 
  isCameraReady, 
  photo, 
  onToggleCamera, 
  onCapture, 
  onReset,
  onZoomIn, 
  onZoomOut 
}: ControlPanelProps) {
  return (
    <View style={styles.controlPanel}>
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
          <CopilotStep text="Ligue ou desligue o sensor da câmera aqui." order={4} name="power">
            <WalkthroughableTouchableOpacity style={styles.dpadCenter} onPress={onToggleCamera} activeOpacity={0.6}>
              <Ionicons name="power" size={20} color={isCameraActive ? "#4CAF50" : "#F44336"} />
            </WalkthroughableTouchableOpacity>
          </CopilotStep>
        </View>
      </View>

      <View style={styles.captureWrapper}>
        <Text style={styles.captureTitle}>CAPTURE</Text>
        <CopilotStep text="Toque para escanear o cão à sua frente após focar bem nele." order={5} name="capture">
          <WalkthroughableTouchableOpacity onPress={(!photo) ? onCapture : onReset} activeOpacity={0.7} disabled={!isCameraActive || (!photo && !isCameraReady)}>
            <View style={styles.captureButtonOuter}>
              <View style={styles.captureButtonInner}>
                <Ionicons name={!photo ? 'camera' : 'refresh'} size={36} color="rgba(255, 255, 255, 0.9)" />
              </View>
            </View>
          </WalkthroughableTouchableOpacity>
        </CopilotStep>
      </View>

      <CopilotStep text="Aproxime para capturar detalhes da raça com mais precisão." order={6} name="zoom">
        <WalkthroughableView style={styles.interactionWrapper}>
          <Text style={styles.interactionTitle}>INTERACTION</Text>
          <TouchableOpacity style={styles.zoomButton} onPress={onZoomIn} activeOpacity={0.7} disabled={!isCameraActive}>
            <Text style={styles.zoomButtonText}>+</Text>
          </TouchableOpacity>
          <Text style={styles.interactionLabel}>Zoom In</Text>
          <TouchableOpacity style={styles.zoomButton} onPress={onZoomOut} activeOpacity={0.7} disabled={!isCameraActive}>
            <Text style={styles.zoomButtonText}>-</Text>
          </TouchableOpacity>
          <Text style={styles.interactionLabel}>Zoom Out</Text>
        </WalkthroughableView>
      </CopilotStep>
    </View>
  );
}
