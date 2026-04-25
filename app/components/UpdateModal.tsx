import React from 'react';
import { View, Text, StyleSheet, Modal, TouchableOpacity, Dimensions, Platform } from 'react-native';
import { BlurView } from 'expo-blur';
import { Ionicons } from '@expo/vector-icons';
import Animated, { FadeIn, SlideInDown } from 'react-native-reanimated';

const { width } = Dimensions.get('window');

interface UpdateModalProps {
  isVisible: boolean;
  isForceUpdate: boolean;
  latestVersion: string;
  releaseNotes?: string;
  onUpdate: () => void;
  onDismiss: () => void;
}

export default function UpdateModal({ 
  isVisible, 
  isForceUpdate, 
  latestVersion, 
  releaseNotes, 
  onUpdate, 
  onDismiss 
}: UpdateModalProps) {
  if (!isVisible) return null;

  return (
    <Modal transparent visible={isVisible} animationType="none">
      <View style={styles.overlay}>
        <Animated.View 
          entering={FadeIn}
          style={StyleSheet.absoluteFill}
        >
          <BlurView intensity={20} style={StyleSheet.absoluteFill} tint="dark" />
        </Animated.View>

        <Animated.View 
          entering={SlideInDown.springify().damping(15)}
          style={styles.container}
        >
          <View style={styles.header}>
            <View style={[styles.iconContainer, isForceUpdate && styles.forceIconContainer]}>
              <Ionicons 
                name={isForceUpdate ? "alert-circle" : "rocket"} 
                size={32} 
                color="#FFF" 
              />
            </View>
            <Text style={styles.title}>
              {isForceUpdate ? "Atualização Obrigatória" : "Nova Versão Disponível!"}
            </Text>
            <Text style={styles.versionTag}>v{latestVersion}</Text>
          </View>

          <View style={styles.body}>
            <Text style={styles.description}>
              {isForceUpdate 
                ? "Uma atualização crítica é necessária para continuar explorando com o DogDex. Por favor, atualize agora."
                : "Uma nova versão do DogDex está pronta para você com melhorias e novas funcionalidades."
              }
            </Text>
            
            {releaseNotes && (
              <View style={styles.notesContainer}>
                <Text style={styles.notesTitle}>O QUE HÁ DE NOVO:</Text>
                <Text style={styles.notesText}>• {releaseNotes}</Text>
              </View>
            )}
          </View>

          <View style={styles.footer}>
            <TouchableOpacity 
              style={styles.updateButton} 
              onPress={onUpdate}
              activeOpacity={0.8}
            >
              <Text style={styles.updateButtonText}>ATUALIZAR AGORA</Text>
              <Ionicons name="arrow-forward" size={18} color="#FFF" style={{ marginLeft: 8 }} />
            </TouchableOpacity>

            {!isForceUpdate && (
              <TouchableOpacity 
                style={styles.dismissButton} 
                onPress={onDismiss}
                activeOpacity={0.6}
              >
                <Text style={styles.dismissButtonText}>Lembrar mais tarde</Text>
              </TouchableOpacity>
            )}
          </View>
        </Animated.View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  container: {
    width: '100%',
    backgroundColor: '#1E2127',
    borderRadius: 32,
    padding: 24,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.5,
    shadowRadius: 20,
    elevation: 10,
  },
  header: {
    alignItems: 'center',
    marginBottom: 20,
  },
  iconContainer: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#FF8906',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
    shadowColor: '#FF8906',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  forceIconContainer: {
    backgroundColor: '#FF4B4B',
    shadowColor: '#FF4B4B',
  },
  title: {
    color: '#FFF',
    fontSize: 22,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  versionTag: {
    color: '#FF8906',
    fontSize: 14,
    fontWeight: '600',
    marginTop: 4,
    backgroundColor: 'rgba(255, 137, 6, 0.1)',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  body: {
    marginBottom: 24,
  },
  description: {
    color: '#AAA',
    fontSize: 15,
    lineHeight: 22,
    textAlign: 'center',
  },
  notesContainer: {
    marginTop: 20,
    padding: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 16,
  },
  notesTitle: {
    color: '#FFF',
    fontSize: 11,
    fontWeight: 'bold',
    letterSpacing: 1,
    marginBottom: 8,
  },
  notesText: {
    color: '#888',
    fontSize: 13,
    lineHeight: 18,
  },
  footer: {
    gap: 12,
  },
  updateButton: {
    backgroundColor: '#FF8906',
    height: 56,
    borderRadius: 16,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  updateButtonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: 'bold',
    letterSpacing: 1,
  },
  dismissButton: {
    height: 48,
    justifyContent: 'center',
    alignItems: 'center',
  },
  dismissButtonText: {
    color: '#666',
    fontSize: 14,
    fontWeight: '600',
  },
});
