import React from 'react';
import { View, Text, Modal, TouchableOpacity, StyleSheet } from 'react-native';
import { BlurView } from 'expo-blur';
import { Ionicons } from '@expo/vector-icons';
import Animated, { FadeIn, SlideInDown } from 'react-native-reanimated';
import { styles } from './styles';


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
