import React, { useState } from 'react';
import { 
    StyleSheet, 
    View, 
    Text, 
    TextInput, 
    TouchableOpacity, 
    KeyboardAvoidingView, 
    Platform, 
    ScrollView, 
    Alert,
    Dimensions,
    ActivityIndicator
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import { authService } from '../services/authService';

const { width } = Dimensions.get('window');

const COLORS = {
    primary: '#0C0D12',
    accent: '#FF8906',
    text: '#FFF',
    textSecondary: '#9ca3af',
    error: '#ef4444',
    success: '#22c55e'
};

export default function ResetPasswordScreen() {
    const { token } = useLocalSearchParams();
    const router = useRouter();
    
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [focusedField, setFocusedField] = useState<'password' | 'confirm' | null>(null);

    const handleReset = async () => {
        if (!password || !confirmPassword) {
            Alert.alert('Erro', 'Por favor, preencha todos os campos.');
            return;
        }

        if (password !== confirmPassword) {
            Alert.alert('Erro', 'As senhas não coincidem.');
            return;
        }

        if (password.length < 6) {
            Alert.alert('Erro', 'A senha deve ter pelo menos 6 caracteres.');
            return;
        }

        if (!token) {
            Alert.alert('Erro', 'Token de recuperação não encontrado. Solicite um novo e-mail.');
            return;
        }

        try {
            setLoading(true);
            await authService.resetPassword(password, token as string);
            
            Alert.alert(
                'Sucesso', 
                'Sua senha foi alterada com sucesso! Agora você pode fazer login.',
                [{ text: 'OK', onPress: () => router.replace('/auth') }]
            );
        } catch (error: any) {
            console.error('Reset password error:', error);
            Alert.alert('Erro', error.response?.data?.error || 'Não foi possível redefinir sua senha. Verifique se o link expirou.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <View style={styles.container}>
            <LinearGradient
                colors={['#0C0D12', '#1A1C26', '#0C0D12']}
                style={StyleSheet.absoluteFill}
            />
            
            <KeyboardAvoidingView 
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                style={{ flex: 1 }}
            >
                <ScrollView contentContainerStyle={styles.scrollContent}>
                    <View style={styles.header}>
                        <View style={styles.logoContainer}>
                            <Text style={styles.logoText}>DOGDEX</Text>
                            <View style={styles.logoDot} />
                        </View>
                        <Text style={styles.tagline}>NOVA SENHA</Text>
                    </View>

                    <View style={styles.content}>
                        <View style={styles.glassCardWrapper}>
                            <BlurView intensity={30} style={styles.glassCard}>
                                <Text style={styles.cardTitle}>Redefinir Senha</Text>
                                <Text style={styles.cardSubtitle}>
                                    Crie uma senha forte para proteger sua conta.
                                </Text>

                                <View style={styles.form}>
                                    {/* Nova Senha */}
                                    <View style={[
                                        styles.inputContainer, 
                                        focusedField === 'password' && styles.inputContainerActive
                                    ]}>
                                        <Ionicons 
                                            name="lock-closed-outline" 
                                            size={20} 
                                            color={focusedField === 'password' ? COLORS.accent : COLORS.textSecondary} 
                                            style={styles.inputIcon} 
                                        />
                                        <TextInput
                                            style={styles.input}
                                            placeholder="Nova Senha"
                                            placeholderTextColor="#666"
                                            value={password}
                                            onChangeText={setPassword}
                                            secureTextEntry={!showPassword}
                                            onFocus={() => setFocusedField('password')}
                                            onBlur={() => setFocusedField(null)}
                                        />
                                        <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                                            <Ionicons 
                                                name={showPassword ? "eye-off-outline" : "eye-outline"} 
                                                size={20} 
                                                color={COLORS.textSecondary} 
                                            />
                                        </TouchableOpacity>
                                    </View>

                                    {/* Confirmar Senha */}
                                    <View style={[
                                        styles.inputContainer, 
                                        focusedField === 'confirm' && styles.inputContainerActive
                                    ]}>
                                        <Ionicons 
                                            name="checkmark-circle-outline" 
                                            size={20} 
                                            color={focusedField === 'confirm' ? COLORS.accent : COLORS.textSecondary} 
                                            style={styles.inputIcon} 
                                        />
                                        <TextInput
                                            style={styles.input}
                                            placeholder="Confirmar Nova Senha"
                                            placeholderTextColor="#666"
                                            value={confirmPassword}
                                            onChangeText={setConfirmPassword}
                                            secureTextEntry={!showPassword}
                                            onFocus={() => setFocusedField('confirm')}
                                            onBlur={() => setFocusedField(null)}
                                        />
                                    </View>

                                    <TouchableOpacity 
                                        style={styles.authButton}
                                        onPress={handleReset}
                                        disabled={loading}
                                    >
                                        <LinearGradient
                                            colors={['#FF8906', '#FF5F06']}
                                            start={{ x: 0, y: 0 }}
                                            end={{ x: 1, y: 0 }}
                                            style={styles.buttonGradient}
                                        >
                                            {loading ? (
                                                <ActivityIndicator color="#FFF" />
                                            ) : (
                                                <Text style={styles.buttonText}>ALTERAR SENHA</Text>
                                            )}
                                        </LinearGradient>
                                    </TouchableOpacity>
                                </View>
                            </BlurView>
                        </View>

                        <TouchableOpacity 
                            style={styles.backButton}
                            onPress={() => router.replace('/auth')}
                        >
                            <Text style={styles.backText}>Voltar para o Login</Text>
                        </TouchableOpacity>
                    </View>
                </ScrollView>
            </KeyboardAvoidingView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#0C0D12',
    },
    scrollContent: {
        flexGrow: 1,
        paddingBottom: 40,
    },
    header: {
        height: 280,
        justifyContent: 'center',
        alignItems: 'center',
    },
    logoContainer: {
        flexDirection: 'row',
        alignItems: 'baseline',
        marginBottom: 8,
    },
    logoText: {
        fontSize: 48,
        fontWeight: '900',
        color: '#FFF',
        letterSpacing: 6,
    },
    logoDot: {
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: COLORS.accent,
        marginLeft: 4,
    },
    tagline: {
        fontSize: 14,
        color: COLORS.textSecondary,
        letterSpacing: 2,
        fontWeight: '600',
    },
    content: {
        paddingHorizontal: 24,
        alignItems: 'center',
        marginTop: -40,
    },
    glassCardWrapper: {
        width: '100%',
        borderRadius: 30,
        overflow: 'hidden',
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.15)',
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
    backButton: {
        marginTop: 32,
    },
    backText: {
        color: COLORS.textSecondary,
        fontSize: 14,
        fontWeight: '600',
    }
});
