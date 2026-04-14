import React from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { styles } from './styles';
import { AnalyzeResult } from '@dogdex/shared';

type LcdOverlayProps = {
  photo: any;
  status: 'idle' | 'loading' | 'success' | 'error';
  result: AnalyzeResult | null;
  onAddData: () => void;
  onClose: () => void;
  onRetry?: () => void;
};

export default function LcdOverlay({ photo, status, result, onAddData, onClose, onRetry }: LcdOverlayProps) {
  if (!photo) return null;

  return (
    <View style={styles.lcdScreenWrapper}>
      <View style={styles.lcdScreenHeader}>
        <Text style={styles.lcdScreenTitle}>DATA ANALYSIS</Text>
        <TouchableOpacity style={styles.lcdCloseButton} onPress={onClose}>
          <Ionicons name="close-circle" size={26} color="#FA3045" />
        </TouchableOpacity>
      </View>
      <ScrollView style={styles.lcdScreen} automaticallyAdjustContentInsets={false}>
        {status === 'loading' && (
          <Text style={styles.lcdTextTitle}>Analisando DNA...</Text>
        )}
        
        {status === 'error' && (
          <View>
            <Text style={styles.lcdTextError}>{result?.error || 'ERRO DE CONEXÃO'}</Text>
            {onRetry && (
              <TouchableOpacity style={styles.lcdAddButton} onPress={onRetry} activeOpacity={0.7}>
                <Ionicons name="refresh-circle" size={18} color="#0F380F" />
                <Text style={styles.lcdAddButtonText}>TENTAR NOVAMENTE</Text>
              </TouchableOpacity>
            )}
          </View>
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
            
            {result.breed && (
              <TouchableOpacity 
                style={styles.lcdAddButton} 
                onPress={onAddData}
                activeOpacity={0.7}
              >
                <Ionicons name="add-circle" size={18} color="#0F380F" />
                <Text style={styles.lcdAddButtonText}>ADD TO DOGDEX</Text>
              </TouchableOpacity>
            )}
          </View>
        )}
      </ScrollView>
    </View>
  );
}
