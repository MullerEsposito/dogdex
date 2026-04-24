import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  // --- VIRTUAL SCREEN VISOR ---
  visorOuter: {
    backgroundColor: '#5C6675', // Lighter grey for visor
    borderRadius: 35,
    paddingTop: 15,
    paddingHorizontal: 15,
    paddingBottom: 20,
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.5,
    shadowRadius: 5,
    borderWidth: 3,
    borderTopColor: '#7A889A', // Lighter top for 3D effect
    borderLeftColor: '#7A889A',
    borderBottomColor: '#2C3545', // Darker bottom for 3D effect
    borderRightColor: '#2C3545',
    zIndex: 5,
  },
  visorVersionText: {
    position: 'absolute',
    top: 0,
    left: 30,
    color: 'rgba(255,255,255,0.4)',
    fontSize: 11,
    fontWeight: 'bold',
    letterSpacing: 0.5,
  },
  visorInner: {
    backgroundColor: '#1E2328', // Darker inner bezel
    borderRadius: 20,
    padding: 6,
  },
  cameraContainer: {
    width: '100%',
    aspectRatio: 1, // Square-ish view
    backgroundColor: '#000',
    borderRadius: 15,
    overflow: 'hidden',
  },
  camera: {
    flex: 1,
  },
  previewImage: {
    flex: 1,
    resizeMode: 'cover',
  },
  cameraOverlay: {
    position: 'absolute',
    top: 0, left: 0, right: 0, bottom: 0,
    padding: 15,
    justifyContent: 'space-between',
  },
  overlayTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  overlayText: {
    color: '#FFF',
    fontSize: 14,
    opacity: 0.8,
  },
  sliderContainer: {
    position: 'absolute',
    left: 15,
    top: '35%',
    bottom: '35%',
    justifyContent: 'space-between',
    alignItems: 'center',
    zIndex: 10,
  },
  sliderDot: {
    width: 4, height: 4, borderRadius: 2, backgroundColor: 'rgba(255,255,255,0.4)',
  },
  sliderDotActive: {
    width: 12, height: 12, borderRadius: 6, backgroundColor: 'transparent',
    borderWidth: 1.5, borderColor: '#FFF',
  },
  reticleCornerTL: { position: 'absolute', top: 10, left: 10, width: 30, height: 30, borderTopWidth: 2, borderLeftWidth: 2, borderColor: '#FFF', borderTopLeftRadius: 10, opacity: 0.6 },
  reticleCornerTR: { position: 'absolute', top: 10, right: 10, width: 30, height: 30, borderTopWidth: 2, borderRightWidth: 2, borderColor: '#FFF', borderTopRightRadius: 10, opacity: 0.6 },
  reticleCornerBL: { position: 'absolute', bottom: 10, left: 10, width: 30, height: 30, borderBottomWidth: 2, borderLeftWidth: 2, borderColor: '#FFF', borderBottomLeftRadius: 10, opacity: 0.6 },
  reticleCornerBR: { position: 'absolute', bottom: 10, right: 10, width: 30, height: 30, borderBottomWidth: 2, borderRightWidth: 2, borderColor: '#FFF', borderBottomRightRadius: 10, opacity: 0.6 },
  overlayBottomRow: {
    alignItems: 'center',
    marginBottom: 5,
  },
  resultPill: {
    backgroundColor: 'rgba(0,0,0,0.5)',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
  },
  resultPillText: {
    color: '#FFF',
    fontSize: 14,
  },
  offlineScreen: {
    flex: 1,
    backgroundColor: '#0A0A0A',
    justifyContent: 'center',
    alignItems: 'center',
  },
  offlineText: {
    color: '#333',
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 15,
    letterSpacing: 2,
  },
});
