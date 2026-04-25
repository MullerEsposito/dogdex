import { StyleSheet, Platform } from 'react-native';

export const COLORS = {
    primary: '#0C0D12',
    accent: '#FF8906',
    text: '#FFF',
    textSecondary: '#9ca3af',
    error: '#ef4444',
    success: '#22c55e'
};

export const styles = StyleSheet.create({
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
