import { 
    View, 
    Text, 
    TextInput, 
    TouchableOpacity, 
    KeyboardAvoidingView, 
    Platform, 
    ScrollView, 
    Alert,
    ActivityIndicator,
    StyleSheet
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import { authService } from '../../services/authService';
import { styles, COLORS } from './styles';

import React, { useState } from 'react';

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
                [{ text: 'OK', onPress: () => router.replace('/auth' as any) }]
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
                style={styles.container}
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
                            onPress={() => router.replace('/auth' as any)}
                        >
                            <Text style={styles.backText}>Voltar para o Login</Text>
                        </TouchableOpacity>
                    </View>
                </ScrollView>
            </KeyboardAvoidingView>
        </View>
    );
}
