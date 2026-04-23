import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
  Image,
  Dimensions,
  ScrollView,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../hooks/useAuth';
import { authService } from '@/services/authService';

const { width, height } = Dimensions.get('window');

const COLORS = {
  background: '#0B0B0F',
  surface: 'rgba(255, 255, 255, 0.05)',
  primary: '#7F5AF0',
  accent: '#FF8906',
  text: '#FFFFFF',
  textSecondary: '#A0A0B0',
};

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
        await signUp(email, password, name);
      }
    } catch (error: any) {
      const msg = error.message || 'Não foi possível completar a operação.';
      Alert.alert('Erro na autenticação', msg);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setLoading(true);
    try {
      await signInWithGoogle();
    } catch (error: any) {
      Alert.alert('Erro', error.message || 'Falha ao entrar com Google');
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
        style={{ flex: 1 }}
      >
        <ScrollView 
          contentContainerStyle={styles.scrollContent} 
          bounces={false}
          keyboardShouldPersistTaps="handled"
        >
        {/* Top Section - Hero Dog Image with Fade Out */}
        <View style={styles.heroSection}>
          <Image 
            source={require('../assets/images/login-screen.png')} 
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
              source={require('../assets/images/android-icon-foreground3.png')} 
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
                        style={styles.forgotPassword}
                        onPress={async () => {
                            if (!email) {
                                Alert.alert('Atenção', 'Digite seu e-mail no campo acima para recuperar a senha.');
                                return;
                            }
                            try {
                                setLoading(true);
                                await authService.forgotPassword(email);
                                Alert.alert('Sucesso', 'E-mail de recuperação enviado! Verifique sua caixa de entrada.');
                            } catch (error) {
                                Alert.alert('Erro', 'Não foi possível enviar o e-mail. Verifique o endereço digitado.');
                            } finally {
                                setLoading(false);
                            }
                        }}
                    >
                    <Text style={styles.forgotText}>Forgot Password?</Text>
                    </TouchableOpacity>
                )}

                <TouchableOpacity style={styles.authButton} onPress={handleAuth} disabled={loading}>
                    <LinearGradient 
                    colors={['#7F5AF0', '#FF8906']} 
                    start={{x: 0, y: 0}} 
                    end={{x: 1, y: 0}}
                    style={styles.buttonGradient}
                    >
                    {loading ? <ActivityIndicator color="white" /> : <Text style={styles.buttonText}>{isLogin ? 'SIGN IN' : 'SIGN UP'}</Text>}
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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  glowPurple: {
    position: 'absolute',
    top: height * 0.2,
    left: -width * 0.2,
    width: width * 1.2,
    height: width * 1.2,
    borderRadius: (width * 1.2) / 2,
    backgroundColor: '#7F5AF0',
    opacity: 0.1,
    // Using simple filter for web compatibility in styles
    ...Platform.select({
        web: { filter: 'blur(100px)' },
        default: { shadowColor: '#7F5AF0', shadowRadius: 100, shadowOpacity: 0.1 }
    })
  },
  glowOrange: {
    position: 'absolute',
    bottom: height * 0.1,
    right: -width * 0.2,
    width: width * 1,
    height: width * 1,
    borderRadius: (width * 1) / 2,
    backgroundColor: '#FF8906',
    opacity: 0.08,
    ...Platform.select({
        web: { filter: 'blur(100px)' },
        default: { shadowColor: '#FF8906', shadowRadius: 100, shadowOpacity: 0.08 }
    })
  },
  scrollContent: {
    flexGrow: 1,
  },
  heroSection: {
    width: '100%',
    height: height * 0.45,
    overflow: 'hidden',
  },
  heroImage: {
    width: '100%',
    height: '100%',
  },
  heroFade: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: height * 0.2,
  },
  logoWrapper: {
    position: 'absolute',
    top: 50,
    left: 30,
    width: 100,
    height: 100,
  },
  logoImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'contain',
  },
  titleWrapper: {
    position: 'absolute',
    bottom: 40,
    width: '100%',
    alignItems: 'center',
    zIndex: 10,
  },
  mainTitle: {
    fontSize: 42,
    fontWeight: '900',
    color: '#FFF',
    letterSpacing: 6,
    textShadowColor: 'rgba(0, 0, 0, 0.5)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 10,
  },
  tagline: {
    fontSize: 14,
    color: COLORS.textSecondary,
    letterSpacing: 2,
    fontWeight: '600',
    textShadowColor: 'rgba(0, 0, 0, 0.5)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 5,
  },
  content: {
    paddingHorizontal: 24,
    alignItems: 'center',
    marginTop: -10, // Slight overlap for smooth transition
    backgroundColor: '#0C0D12',
  },
  glassCardWrapper: {
    width: '100%',
    borderRadius: 30,
    overflow: 'hidden', // Required for BlurView on some platforms
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.15)',
    ...Platform.select({
        web: { backdropFilter: 'blur(25px)' }
    })
  },
  glassCard: {
    padding: 24,
    backgroundColor: 'rgba(255,255,255,0.02)',
  },
  cardTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: '#FFF',
    textAlign: 'center',
  },
  cardSubtitle: {
    fontSize: 14,
    color: COLORS.textSecondary,
    textAlign: 'center',
    marginTop: 4,
    marginBottom: 24,
  },
  form: {
    gap: 16,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 56,
    borderRadius: 28,
    borderWidth: 1,
    borderColor: 'rgba(255, 137, 6, 0.4)',
    paddingHorizontal: 20,
    backgroundColor: 'rgba(0,0,0,0.3)',
  },
  inputContainerActive: {
    borderColor: COLORS.accent,
    backgroundColor: 'rgba(255, 137, 6, 0.05)',
  },
  inputIcon: {
    marginRight: 12,
  },
  input: {
    flex: 1,
    color: '#FFF',
    fontSize: 14,
  },
  forgotPassword: {
    alignSelf: 'flex-end',
    marginTop: -8,
  },
  forgotText: {
    color: COLORS.accent,
    fontSize: 13,
    fontWeight: '600',
  },
  authButton: {
    height: 56,
    borderRadius: 28,
    overflow: 'hidden',
    marginTop: 8,
  },
  buttonGradient: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonText: {
    color: '#FFF',
    fontWeight: '900',
    fontSize: 16,
    letterSpacing: 2,
  },
  footer: {
    width: '100%',
    alignItems: 'center',
    marginTop: 24,
    paddingBottom: 40,
  },
  dividerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
  },
  line: {
    flex: 1,
    height: 1,
    backgroundColor: 'rgba(255,255,255,0.1)',
  },
  dividerText: {
    color: COLORS.textSecondary,
    paddingHorizontal: 15,
    fontSize: 12,
    letterSpacing: 1,
  },
  socialButton: {
    width: '100%',
    height: 56,
    borderRadius: 28,
    backgroundColor: '#FFF',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 12,
    marginBottom: 20,
    // Add shadow for premium feel on non-blur platforms
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 5,
  },
  socialIcon: {
    width: 24,
    height: 24,
  },
  socialText: {
    color: '#000',
    fontWeight: '700',
    fontSize: 15,
  },
  switchButton: {
    padding: 10,
  },
  switchLabel: {
    color: COLORS.textSecondary,
    fontSize: 14,
  },
  switchHighlight: {
    color: COLORS.accent,
    fontWeight: 'bold',
  },
});
