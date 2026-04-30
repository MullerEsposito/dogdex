import React, { useState } from 'react';
import { 
  View, 
  Text, 
  TouchableOpacity, 
  SafeAreaView,
  Alert
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import * as Clipboard from 'expo-clipboard';
import { styles } from './styles';

export default function DonateScreen() {
  const router = useRouter();
  const [copied, setCopied] = useState(false);
  const pixKey = process.env.EXPO_PUBLIC_PIX_KEY || 'Chave PIX não configurada';

  const copyToClipboard = async () => {
    if (!process.env.EXPO_PUBLIC_PIX_KEY) {
      Alert.alert('Ops!', 'A chave PIX não foi configurada.');
      return;
    }
    await Clipboard.setStringAsync(pixKey);
    setCopied(true);
    Alert.alert('Copiado!', 'Chave PIX copiada para a área de transferência.');
    
    setTimeout(() => {
      setCopied(false);
    }, 3000);
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#FFF" />
        </TouchableOpacity>
        <Text style={styles.title}>APOIE O PROJETO</Text>
        <View style={styles.headerSpacer} />
      </View>

      <View style={styles.content}>
        <View style={styles.iconContainer}>
          <Ionicons name="heart" size={80} color="#FA3045" />
        </View>
        
        <Text style={styles.heading}>Gostou do DogDex?</Text>
        <Text style={styles.description}>
          O DogDex é mantido de forma independente. Sua doação ajuda a manter os servidores ativos, 
          melhorar a inteligência artificial e continuar trazendo novidades e novas raças para o aplicativo.
        </Text>

        <View style={styles.pixBox}>
          <Text style={styles.pixLabel}>Chave PIX (Copiar e Colar)</Text>
          <View style={styles.pixKeyContainer}>
            <Text style={styles.pixKeyValue} numberOfLines={1} adjustsFontSizeToFit>
              {pixKey}
            </Text>
          </View>
        </View>

        <TouchableOpacity 
          style={[styles.copyButton, copied && styles.copyButtonSuccess]}
          onPress={copyToClipboard}
          activeOpacity={0.8}
        >
          <Ionicons name={copied ? "checkmark-circle" : "copy-outline"} size={20} color="#FFF" />
          <Text style={styles.copyButtonText}>
            {copied ? 'CHAVE COPIADA!' : 'COPIAR CHAVE PIX'}
          </Text>
        </TouchableOpacity>

        <Text style={styles.thankYouText}>
          Qualquer valor é muito bem-vindo! 🐕💛
        </Text>
      </View>
    </SafeAreaView>
  );
}
