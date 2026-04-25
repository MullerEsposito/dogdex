import { StyleSheet, Dimensions, Platform } from 'react-native';

const { width, height } = Dimensions.get('window');

export const COLORS = {
  background: '#0B0B0F',
  surface: 'rgba(255, 255, 255, 0.05)',
  primary: '#7F5AF0',
  accent: '#FF8906',
  text: '#FFFFFF',
  textSecondary: '#A0A0B0',
};

export const styles = StyleSheet.create({
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
    marginTop: -10,
    backgroundColor: '#0C0D12',
  },
  glassCardWrapper: {
    width: '100%',
    borderRadius: 30,
    overflow: 'hidden',
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
  actionButtonDisabled: {
    opacity: 0.5,
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
