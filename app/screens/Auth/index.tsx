import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  KeyboardAvoidingView,
  Platform,
  Image,
  ScrollView,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../../hooks/useAuth';
import { authService } from '@/services/authService';

import { styles, COLORS } from './styles';

const GlassContainer = ({ children, style, intensity, tint }: any) => {
  if (Platform.OS === 'android') {
    return <View style={[style, { backgroundColor: 'rgba(20, 20, 25, 0.95)' }]}>{children}</View>;
  }
  return <BlurView intensity={intensity} tint={tint} style={style}>{children}</BlurView>;
};

export default function AuthScreen() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [focusedField, setFocusedField] = useState<string | null>(null);
  
  const nameRef = React.useRef<TextInput>(null);
  const emailRef = React.useRef<TextInput>(null);
  const passwordRef = React.useRef<TextInput>(null);
  
  const { signIn, signUp, signInWithGoogle } = useAuth();

  const handleAuth = async () => {
    if (!email || !password || (!isLogin && !name)) {
      Alert.alert('Ops!', 'Preencha todos os campos para continuar.');
      return;
    }

    setLoading(true);
    try {
      if (isLogin) {
        await signIn(email, password);
      } else {
        const result = await signUp(email, password, name);
        if (result?.needsConfirmation) {
          Alert.alert(
            'Verifique seu e-mail',
            'Enviamos um link de confirmação para o seu e-mail. Por favor, confirme para poder acessar o DogDex.',
            [{ text: 'OK', onPress: () => setIsLogin(true) }]
          );
        }
      }
    } catch (error: any) {
      if (error.code === 'EMAIL_NOT_CONFIRMED') {
        Alert.alert(
          'E-mail pendente',
          'Seu e-mail ainda não foi verificado. Deseja que enviemos um novo link de confirmação?',
          [
            { text: 'Agora não', style: 'cancel' },
            { 
              text: 'Reenviar e-mail', 
              onPress: async () => {
                try {
                  setLoading(true);
                  await authService.resendConfirmationEmail(email);
                  Alert.alert('Sucesso', 'E-mail de verificação reenviado!');
                } catch {
                  Alert.alert('Erro', 'Não foi possível reenviar o e-mail.');
                } finally {
                  setLoading(false);
                }
              }
            }
          ]
        );
      } else {
        const msg = error.message || 'Não foi possível completar a operação.';
        Alert.alert('Erro na autenticação', msg);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setLoading(true);
    try {
      await signInWithGoogle();
    } catch {
      Alert.alert('Erro', 'Falha na autenticação social.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      {/* Background Glows */}
      <View style={styles.glowPurple} />
      <View style={styles.glowOrange} />
      
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.container}
      >
        <ScrollView 
          contentContainerStyle={styles.scrollContent} 
          bounces={false}
          keyboardShouldPersistTaps="handled"
        >
        {/* Top Section - Hero Dog Image with Fade Out */}
        <View style={styles.heroSection}>
          <Image 
            source={require('../../assets/images/login-screen.png')} 
            style={styles.heroImage}
            resizeMode="cover"
          />
          {/* Transition Gradient (Fade Out to Background) */}
          <LinearGradient
            colors={['transparent', COLORS.background]}
            style={styles.heroFade}
          />

          {/* Logo - Large Proportion */}
          <View style={styles.logoWrapper}>
            <Image 
              source={require('../../assets/images/android-icon-foreground3.png')} 
              style={styles.logoImage}
            />
          </View>

          {/* Title - Over Hero Image */}
          <View style={styles.titleWrapper}>
            <Text style={styles.mainTitle}>DOGDEX</Text>
            <Text style={styles.tagline}>Identify & Discover Every Breed</Text>
          </View>
        </View>

        {/* Main Content Area */}
        <View style={styles.content}>
          
          {/* Frosted Glass Card with Fixes */}
          <View style={styles.glassCardWrapper}>
            <GlassContainer intensity={70} tint="dark" style={styles.glassCard}>
                <Text style={styles.cardTitle}>
                {isLogin ? 'Welcome to DogDex' : 'Create Account'}
                </Text>
                <Text style={styles.cardSubtitle}>
                {isLogin ? 'Sign in to continue.' : 'Register to get started.'}
                </Text>

                <View style={styles.form}>
                {!isLogin && (
                    <View style={[styles.inputContainer, focusedField === 'name' && styles.inputContainerActive]}>
                    <Ionicons 
                        name="person-outline" 
                        size={20} 
                        color={focusedField === 'name' ? COLORS.accent : COLORS.textSecondary} 
                        style={styles.inputIcon} 
                    />
                    <TextInput
                        ref={nameRef}
                        style={styles.input}
                        placeholder="Full Name"
                        placeholderTextColor={COLORS.textSecondary}
                        value={name}
                        onChangeText={setName}
                        onFocus={() => setFocusedField('name')}
                        onBlur={() => setFocusedField(null)}
                        returnKeyType="next"
                        onSubmitEditing={() => emailRef.current?.focus()}
                        blurOnSubmit={false}
                    />
                    </View>
                )}

                <View style={[styles.inputContainer, focusedField === 'email' && styles.inputContainerActive]}>
                    <Ionicons 
                        name="mail-outline" 
                        size={20} 
                        color={focusedField === 'email' ? COLORS.accent : COLORS.textSecondary} 
                        style={styles.inputIcon} 
                    />
                    <TextInput
                        ref={emailRef}
                        style={styles.input}
                        placeholder="Email Address"
                        placeholderTextColor={COLORS.textSecondary}
                        value={email}
                        onChangeText={setEmail}
                        keyboardType="email-address"
                        autoCapitalize="none"
                        autoCorrect={false}
                        onFocus={() => setFocusedField('email')}
                        onBlur={() => setFocusedField(null)}
                        returnKeyType="next"
                        onSubmitEditing={() => passwordRef.current?.focus()}
                        blurOnSubmit={false}
                    />
                </View>

                <View style={[styles.inputContainer, focusedField === 'password' && styles.inputContainerActive]}>
                    <Ionicons 
                        name="lock-closed-outline" 
                        size={20} 
                        color={focusedField === 'password' ? COLORS.accent : COLORS.textSecondary} 
                        style={styles.inputIcon} 
                    />
                    <TextInput
                        ref={passwordRef}
                        style={styles.input}
                        placeholder="Password"
                        placeholderTextColor={COLORS.textSecondary}
                        value={password}
                        onChangeText={setPassword}
                        secureTextEntry={!showPassword}
                        onFocus={() => setFocusedField('password')}
                        onBlur={() => setFocusedField(null)}
                        returnKeyType="done"
                        onSubmitEditing={handleAuth}
                    />
                    <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                    <Ionicons 
                        name={showPassword ? "eye-off-outline" : "eye-outline"} 
                        size={20} 
                        color={COLORS.textSecondary} 
                    />
                    </TouchableOpacity>
                </View>

                {isLogin && (
                    <TouchableOpacity 
                        style={[styles.forgotPassword, loading && styles.actionButtonDisabled]}
                        disabled={loading}
                        onPress={async () => {
                            if (!email) {
                                Alert.alert('Atenção', 'Digite seu e-mail no campo acima para recuperar a senha.');
                                return;
                            }
                            try {
                                setLoading(true);
                                await authService.forgotPassword(email);
                                Alert.alert('Sucesso', 'E-mail de recuperação enviado! Verifique sua caixa de entrada.');
                            } catch {
                                Alert.alert('Erro', 'Não foi possível enviar o e-mail. Verifique o endereço digitado.');
                            } finally {
                                setLoading(false);
                            }
                        }}
                    >
                    <Text style={styles.forgotText}>{loading ? 'Enviando...' : 'Forgot Password?'}</Text>
                    </TouchableOpacity>
                )}

                <TouchableOpacity style={styles.authButton} onPress={handleAuth} disabled={loading}>
                    <LinearGradient 
                    colors={['#7F5AF0', '#FF8906']} 
                    start={{x: 0, y: 0}} 
                    end={{x: 1, y: 0}}
                    style={styles.buttonGradient}
                    >
                    <Text style={styles.buttonText}>
                        {loading ? 'AGUARDE...' : (isLogin ? 'LOGIN' : 'REGISTER')}
                    </Text>
                    </LinearGradient>
                </TouchableOpacity>
                </View>
            </GlassContainer>
          </View>

          {/* Social and Switch Section */}
          <View style={styles.footer}>
            <View style={styles.dividerRow}>
              <View style={styles.line} />
              <Text style={styles.dividerText}>Or continue with:</Text>
              <View style={styles.line} />
            </View>

            <TouchableOpacity 
                style={styles.socialButton} 
                onPress={handleGoogleSignIn}
                activeOpacity={0.8}
            >
              <Image 
                source={{ uri: 'https://cdn-icons-png.flaticon.com/512/2991/2991148.png' }} 
                style={styles.socialIcon}
              />
              <Text style={styles.socialText}>Continue with Google</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => setIsLogin(!isLogin)} style={styles.switchButton}>
              <Text style={styles.switchLabel}>
                {isLogin ? "Don't have an account? " : "Already have an account? "}
                <Text style={styles.switchHighlight}>{isLogin ? 'Sign Up' : 'Sign In'}</Text>
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}
