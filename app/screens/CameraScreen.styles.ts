import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  cameraContainer: {
    flex: 1,
    overflow: 'hidden',
    backgroundColor: '#000',
  },
  camera: {
    flex: 1,
  },
  shutterContainer: {
    position: 'absolute',
    bottom: 40,
    alignSelf: 'center',
  },
  shutterButton: {
    width: 80,
    height: 80,
    borderRadius: 40,
    borderWidth: 4,
    borderColor: '#FFF',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'transparent',
  },
  shutterInner: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#FFF',
  },
  previewContainer: {
    padding: 20,
    paddingBottom: 40,
  },
  imageCard: {
    width: '100%',
    aspectRatio: 1,
    borderRadius: 20,
    overflow: 'hidden',
    backgroundColor: '#E9ECEF',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    marginBottom: 20,
  },
  previewImage: {
    width: '100%',
    height: '100%',
  },
  controls: {
    gap: 12,
  },
  mainButton: {
    backgroundColor: '#007AFF',
    paddingVertical: 16,
    borderRadius: 16,
    alignItems: 'center',
    elevation: 3,
  },
  buttonText: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: '600',
  },
  secondaryButton: {
    paddingVertical: 12,
    alignItems: 'center',
  },
  secondaryButtonText: {
    color: '#6C757D',
    fontSize: 16,
  },
  resultContainer: {
    marginTop: 24,
  },
  card: {
    backgroundColor: '#FFF',
    borderRadius: 24,
    padding: 24,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 12,
  },
  breedTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#212529',
    textAlign: 'center',
    marginBottom: 8,
    textTransform: 'capitalize',
  },
  badge: {
    backgroundColor: '#E7F3FF',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    alignSelf: 'center',
    marginBottom: 20,
  },
  confidenceText: {
    color: '#007AFF',
    fontWeight: '600',
  },
  infoSection: {
    gap: 12,
    borderTopWidth: 1,
    borderTopColor: '#F1F3F5',
    paddingTop: 16,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  infoLabel: {
    color: '#6C757D',
    fontSize: 15,
  },
  infoValue: {
    color: '#212529',
    fontWeight: '500',
    flex: 1,
    textAlign: 'right',
    marginLeft: 12,
  },
  errorText: {
    color: '#DC3545',
    textAlign: 'center',
    fontSize: 16,
  },
  message: {
    textAlign: 'center',
    fontSize: 18,
    color: '#495057',
    marginBottom: 24,
  },
});
