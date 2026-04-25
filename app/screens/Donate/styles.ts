import { StyleSheet, Platform } from 'react-native';

export const styles = StyleSheet.create({
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
  },
  headerSpacer: {
    width: 24,
  }
});
