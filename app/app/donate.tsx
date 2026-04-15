import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  SafeAreaView,
  Platform,
  Alert
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import * as Clipboard from 'expo-clipboard';

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
        <View style={{ width: 24 }} />
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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1A1D23',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 15,
    paddingVertical: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#333',
    ...Platform.select({
      android: {
        marginTop: 20,
      }
    })
  },
  backButton: {
    padding: 5,
  },
  title: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: 'bold',
    letterSpacing: 2,
  },
  content: {
    padding: 24,
    alignItems: 'center',
    flex: 1,
  },
  iconContainer: {
    width: 140,
    height: 140,
    borderRadius: 70,
    backgroundColor: 'rgba(250, 48, 69, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 30,
    marginTop: 20,
  },
  heading: {
    color: '#FFF',
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center',
  },
  description: {
    color: '#AAA',
    fontSize: 16,
    lineHeight: 24,
    textAlign: 'center',
    marginBottom: 40,
  },
  pixBox: {
    width: '100%',
    backgroundColor: '#2A303A',
    borderRadius: 12,
    padding: 20,
    borderWidth: 1,
    borderColor: '#383D47',
    marginBottom: 24,
  },
  pixLabel: {
    color: '#8BAC0F',
    fontSize: 12,
    fontWeight: 'bold',
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 8,
  },
  pixKeyContainer: {
    backgroundColor: 'rgba(0,0,0,0.2)',
    padding: 12,
    borderRadius: 8,
  },
  pixKeyValue: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace',
  },
  copyButton: {
    width: '100%',
    backgroundColor: '#FA3045',
    flexDirection: 'row',
    paddingVertical: 18,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5,
    shadowColor: '#FA3045',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    gap: 10,
    marginBottom: 40,
  },
  copyButtonSuccess: {
    backgroundColor: '#4CAF50',
    shadowColor: '#4CAF50',
  },
  copyButtonText: {
    color: '#FFF',
    fontWeight: 'bold',
    fontSize: 16,
    letterSpacing: 1.5,
  },
  thankYouText: {
    color: '#666',
    fontSize: 14,
    fontStyle: 'italic',
  }
});
