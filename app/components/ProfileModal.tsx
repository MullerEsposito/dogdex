import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, Alert, Platform, Dimensions, ActivityIndicator } from 'react-native';
import { Image } from 'expo-image';
import Animated, { useSharedValue, useAnimatedStyle, withSpring, withTiming } from 'react-native-reanimated';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../hooks/useAuth';
import { authService } from '../services/authService';

const { height } = Dimensions.get('window');

const COLORS = {
  accent: '#FF8906',
};

interface ProfileModalProps {
  isVisible: boolean;
  onClose: () => void;
}

export default function ProfileModal({ isVisible, onClose }: ProfileModalProps) {
  const { user, session } = useAuth();
  const translateY = useSharedValue(-height);
  const opacity = useSharedValue(0);
  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const [newPassword, setNewPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [hasPassword, setHasPassword] = useState<boolean | null>(null);

  const fetchProfile = async () => {
    if (!session?.access_token) return;
    try {
      const data = await authService.getMeBackend(session.access_token);
      setHasPassword(data.user.hasPassword);
    } catch (err) {
      console.error('Error fetching backend profile:', err);
    }
  };

  useEffect(() => {
    if (isVisible) {
      fetchProfile();
      translateY.value = withSpring(0, { damping: 15, stiffness: 100 });
      opacity.value = withTiming(1, { duration: 300 });
    } else {
      translateY.value = withTiming(-height, { duration: 300 });
      opacity.value = withTiming(0, { duration: 300 });
      setShowPasswordForm(false);
      setNewPassword('');
    }
  }, [isVisible]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }],
  }));

  const backdropStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
  }));

  const handleForgotPassword = async () => {
    if (!user?.email) return;
    setLoading(true);
    try {
      await authService.forgotPassword(user.email);
      Alert.alert('Sucesso', 'E-mail de redefinição enviado! Verifique sua caixa de entrada.');
    } catch (err) {
      Alert.alert('Erro', 'Não foi possível enviar o e-mail de redefinição.');
    } finally {
      setLoading(false);
    }
  };

  const handleSetPassword = async () => {
    if (newPassword.length < 6) {
      Alert.alert('Erro', 'A senha deve ter pelo menos 6 caracteres.');
      return;
    }
    if (!session?.access_token) return;

    setLoading(true);
    try {
      await authService.setPassword(newPassword, session.access_token);
      Alert.alert('Sucesso', 'Senha definida com sucesso!');
      setHasPassword(true); // Atualiza estado local
      setShowPasswordForm(false);
      setNewPassword('');
    } catch (err: any) {
      Alert.alert('Erro', err.response?.data?.error || 'Não foi possível definir a senha.');
    } finally {
      setLoading(false);
    }
  };

  if (!isVisible && opacity.value === 0) return null;

  return (
    <View style={styles.overlay} pointerEvents={isVisible ? 'auto' : 'none'}>
      <Animated.View style={[styles.backdrop, backdropStyle]}>
        <TouchableOpacity style={{ flex: 1 }} onPress={onClose} activeOpacity={1} />
      </Animated.View>
      
      <Animated.View style={[styles.container, animatedStyle]}>
        <View style={styles.content}>
          <TouchableOpacity style={styles.closeButton} onPress={onClose}>
            <Ionicons name="chevron-up" size={30} color="#AAA" />
          </TouchableOpacity>

          <View style={styles.profileHeader}>
            <View style={styles.avatarContainer}>
              {user?.avatarUrl ? (
                <Image 
                  source={{ uri: user.avatarUrl }} 
                  style={styles.avatar} 
                  contentFit="cover"
                  transition={200}
                />
              ) : (
                <View style={styles.avatarPlaceholder}>
                  <Ionicons name="person" size={40} color="#555" />
                </View>
              )}
            </View>
            <View style={styles.userInfo}>
              <Text style={styles.userName}>{user?.name || 'Explorador DogDex'}</Text>
              <Text style={styles.userEmail}>{user?.email}</Text>
            </View>
          </View>

          <View style={styles.divider} />

          <Text style={styles.sectionTitle}>SEGURANÇA</Text>
          
          {hasPassword === true ? (
            <TouchableOpacity 
              style={styles.menuItem} 
              onPress={handleForgotPassword}
              disabled={loading}
            >
              <View style={[styles.iconBox, { backgroundColor: 'rgba(74, 158, 219, 0.1)' }]}>
                <Ionicons name="mail-unread-outline" size={22} color="#4A9EDB" />
              </View>
              <View style={styles.menuItemContent}>
                <Text style={styles.menuText}>Redefinir senha via E-mail</Text>
                <Text style={styles.menuSubtext}>Enviaremos um link de recuperação</Text>
              </View>
              <Ionicons name="chevron-forward" size={18} color="#444" />
            </TouchableOpacity>
          ) : hasPassword === false ? (
            <TouchableOpacity 
              style={styles.menuItem} 
              onPress={() => setShowPasswordForm(!showPasswordForm)}
              disabled={loading}
            >
              <View style={[styles.iconBox, { backgroundColor: 'rgba(76, 175, 80, 0.1)' }]}>
                <Ionicons name="lock-closed-outline" size={22} color="#4CAF50" />
              </View>
              <View style={styles.menuItemContent}>
                <Text style={styles.menuText}>Definir Nova Senha</Text>
                <Text style={styles.menuSubtext}>Ative o login por e-mail e senha</Text>
              </View>
              <Ionicons name={showPasswordForm ? "chevron-down" : "chevron-forward"} size={18} color="#444" />
            </TouchableOpacity>
          ) : (
            <View style={{ height: 80, justifyContent: 'center', alignItems: 'center' }}>
              <ActivityIndicator size="small" color={COLORS.accent} />
            </View>
          )}

          {showPasswordForm && (
            <Animated.View style={styles.formContainer}>
              <TextInput
                style={styles.input}
                placeholder="Nova Senha"
                placeholderTextColor="#666"
                secureTextEntry
                value={newPassword}
                onChangeText={setNewPassword}
                autoFocus
              />
              <TouchableOpacity 
                style={[styles.saveButton, loading && styles.saveButtonDisabled]} 
                onPress={handleSetPassword}
                disabled={loading}
              >
                <Text style={styles.saveButtonText}>{loading ? 'Salvando...' : 'SALVAR SENHA'}</Text>
              </TouchableOpacity>
            </Animated.View>
          )}

          <TouchableOpacity 
            style={[styles.signOutButton]} 
            onPress={onClose} // In a real app this might trigger logout from here too
          >
            <Text style={styles.signOutText}>FECHAR PERFIL</Text>
          </TouchableOpacity>
        </View>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 1000,
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.7)',
  },
  container: {
    width: '100%',
    backgroundColor: '#1E2127',
    borderBottomLeftRadius: 32,
    borderBottomRightRadius: 32,
    paddingTop: Platform.OS === 'ios' ? 60 : 30,
    paddingBottom: 30,
    borderBottomWidth: 1,
    borderBottomColor: '#333',
  },
  content: {
    paddingHorizontal: 24,
  },
  closeButton: {
    alignSelf: 'center',
    padding: 10,
    marginTop: -10,
  },
  profileHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
  },
  avatarContainer: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: '#2A303A',
    borderWidth: 2,
    borderColor: '#4A9EDB',
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
  avatar: {
    width: '100%',
    height: '100%',
  },
  avatarPlaceholder: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  userInfo: {
    marginLeft: 18,
    flex: 1,
  },
  userName: {
    color: '#FFF',
    fontSize: 22,
    fontWeight: 'bold',
  },
  userEmail: {
    color: '#888',
    fontSize: 14,
    marginTop: 2,
  },
  divider: {
    height: 1,
    backgroundColor: '#333',
    marginVertical: 24,
  },
  sectionTitle: {
    color: '#444',
    fontSize: 11,
    fontWeight: 'bold',
    letterSpacing: 2,
    marginBottom: 16,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    marginBottom: 8,
  },
  iconBox: {
    width: 44,
    height: 44,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  menuItemContent: {
    flex: 1,
    marginLeft: 16,
  },
  menuText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '600',
  },
  menuSubtext: {
    color: '#666',
    fontSize: 12,
    marginTop: 2,
  },
  formContainer: {
    marginTop: 10,
    padding: 16,
    backgroundColor: '#16191E',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#333',
  },
  input: {
    backgroundColor: '#2A303A',
    borderRadius: 12,
    padding: 12,
    color: '#FFF',
    fontSize: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#444',
  },
  saveButton: {
    backgroundColor: '#4CAF50',
    padding: 14,
    borderRadius: 12,
    alignItems: 'center',
  },
  saveButtonDisabled: {
    opacity: 0.5,
  },
  saveButtonText: {
    color: '#FFF',
    fontWeight: 'bold',
    fontSize: 14,
    letterSpacing: 1,
  },
  signOutButton: {
    marginTop: 30,
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#333',
    alignItems: 'center',
  },
  signOutText: {
    color: '#666',
    fontSize: 12,
    fontWeight: 'bold',
    letterSpacing: 2,
  }
});
