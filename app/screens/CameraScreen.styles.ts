import { StyleSheet, Dimensions } from 'react-native';

const { width } = Dimensions.get('window');

// Pokedex Color Palette
const POKEDEX_RED = '#DC0A2D';
const DARK_RED = '#8B0000';
const BORDER_DARK = '#2C2C2C';
const LENS_BLUE_IDLE = '#28AAFD';
const LENS_GREEN_SUCCESS = '#4CAF50';
const LENS_RED_ERROR = '#F44336';
const LENS_YELLOW_LOADING = '#FFEB3B';
const LCD_GREEN = '#8BAC0F';
const LCD_DARK = '#0F380F';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: POKEDEX_RED,
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: POKEDEX_RED,
  },
  
  // --- HEADER: LENS & LEDS ---
  headerWrapper: {
    marginTop: 30,
    marginBottom: 40,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
    zIndex: 10,
  },
  versionText: {
    position: 'absolute',
    top: -15,
    right: 25,
    color: 'rgba(255,255,255,0.6)',
    fontSize: 12,
    fontWeight: 'bold',
  },
  headerTrack: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#20252D', // Dark blue-ish grey
    width: '100%',
    height: 50,
    borderRadius: 25,
    borderWidth: 3,
    borderColor: '#111',
    paddingHorizontal: 15,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.5,
    shadowRadius: 3,
  },
  leftLedContainer: {
    flex: 1,
    alignItems: 'flex-start',
    paddingLeft: 10,
  },
  rightLedsContainer: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    gap: 8,
    paddingRight: 10,
  },
  mainLensContainer: {
    position: 'absolute',
    alignSelf: 'center',
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: '#DEDEDE', // Silver metallic ring base
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: '#444',
    elevation: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.6,
    shadowRadius: 5,
    zIndex: 20,
  },
  mainLensInnerRing: {
    width: 76,
    height: 76,
    borderRadius: 38,
    backgroundColor: '#F5F5F5',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#999',
  },
  mainLensGlass: {
    width: 60,
    height: 60,
    borderRadius: 30,
    borderWidth: 2,
    borderColor: '#000',
    overflow: 'hidden',
    justifyContent: 'center',
    alignItems: 'center',
  },
  lensReflection: {
    position: 'absolute',
    top: 5,
    left: 10,
    width: 25,
    height: 12,
    backgroundColor: 'rgba(255,255,255,0.7)',
    borderRadius: 10,
    transform: [{ rotate: '-45deg' }],
  },
  glassHighlight: {
    position: 'absolute',
    top: 2,
    right: 10,
    width: 10,
    height: 10,
    backgroundColor: 'rgba(255,255,255,0.8)',
    borderRadius: 5,
  },
  led: {
    width: 14,
    height: 14,
    borderRadius: 7,
    borderWidth: 1.5,
    borderColor: '#000',
  },
  ledRed: { backgroundColor: '#FF0000', shadowColor: '#FF0000', shadowOpacity: 0.8, shadowRadius: 5, elevation: 5 },
  ledYellow: { backgroundColor: '#FFCC00', shadowColor: '#FFCC00', shadowOpacity: 0.8, shadowRadius: 5, elevation: 5 },
  ledGreen: { backgroundColor: '#32CD32', shadowColor: '#32CD32', shadowOpacity: 0.8, shadowRadius: 5, elevation: 5 },
  ledBlueIdle: { backgroundColor: '#00FFFF', shadowColor: '#00FFFF', shadowOpacity: 0.8, shadowRadius: 10, elevation: 10 },

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
  
  // --- BOTTOM TABS PANEL ---
  tabsWrapper: {
    backgroundColor: '#20252D', // Darker than visor
    marginHorizontal: 30, // Much narrower than the main visor
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    paddingTop: 25, // Provide safe space for the overlap
    paddingBottom: 15,
    marginTop: -20, // Slide it under the main visor
    zIndex: 1, // Behind the visor
    borderWidth: 2,
    borderTopWidth: 0,
    borderColor: '#111',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.4,
    shadowRadius: 5,
  },
  tabsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
  },
  tabItem: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 5,
  },
  tabItemCenter: {
    borderLeftWidth: 1,
    borderRightWidth: 1,
    borderColor: '#4A5568',
  },
  tabText: {
    color: '#A0AEC0',
    fontSize: 14,
    fontWeight: 'bold',
    letterSpacing: 1.5,
  },
  tabTextActive: {
    color: '#00FFFF', // Cyan
  },
  tabIndicatorContainer: {
    position: 'absolute',
    bottom: -10,
    width: '100%',
    alignItems: 'center',
  },
  tabIndicator: {
    width: 60, 
    height: 3, 
    backgroundColor: '#00FFFF',
    borderRadius: 3,
    shadowColor: '#00FFFF',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 5,
    elevation: 3,
  },
  // --- CONTROL PANEL ---
  controlPanel: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 15,
    marginTop: 15,
    paddingBottom: 20,
    flex: 1,
  },
  
  // Left: D-Pad
  dpadWrapper: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 90,
  },
  dpadTitle: {
    color: '#FFF',
    fontSize: 10,
    fontWeight: 'bold',
    letterSpacing: 1,
    marginBottom: 10,
  },
  dpadCross: {
    width: 80,
    height: 80,
    justifyContent: 'center',
    alignItems: 'center',
  },
  dpadVertical: {
    position: 'absolute',
    width: 26,
    height: 80,
    backgroundColor: '#383D47',
    borderRadius: 5,
    borderWidth: 2,
    borderColor: '#111',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.6,
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 4,
  },
  dpadHorizontal: {
    position: 'absolute',
    width: 80,
    height: 26,
    backgroundColor: '#383D47',
    borderRadius: 5,
    borderWidth: 2,
    borderColor: '#111',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.6,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 4,
  },
  dpadCenter: {
    position: 'absolute',
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: '#20252D',
    borderWidth: 2,
    borderColor: '#111',
    zIndex: 2,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 3,
  },
  dpadArrowPolygon: {
    width: 0,
    height: 0,
    backgroundColor: 'transparent',
    borderStyle: 'solid',
  },
  
  // Center: Capture
  captureWrapper: {
    alignItems: 'center',
  },
  captureTitle: {
    color: '#FFF',
    fontSize: 11,
    fontWeight: 'bold',
    letterSpacing: 1.5,
    marginBottom: 8,
  },
  captureButtonOuter: {
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: '#2A303A', // Dark thick ring
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: '#151A22',
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.5,
    shadowRadius: 5,
  },
  captureButtonInner: {
    width: 68,
    height: 68,
    borderRadius: 34,
    backgroundColor: '#FA3045', // Bright red dome
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#C01025',
    elevation: 3,
    shadowColor: '#FF4050', // Red glow
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 1,
    shadowRadius: 10,
  },
  cameraIconText: {
    fontSize: 24,
  },
  
  // Right: Zoom Interaction
  interactionWrapper: {
    alignItems: 'center',
    justifyContent: 'space-between',
    width: 90,
    height: 120, // Match D-pad height area
  },
  interactionTitle: {
    color: '#FFF',
    fontSize: 10,
    fontWeight: 'bold',
    letterSpacing: 1,
    marginBottom: 5,
  },
  zoomButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#383D47',
    borderWidth: 2,
    borderColor: '#111',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.6,
  },
  zoomButtonText: {
    color: '#FFF',
    fontSize: 20,
    fontWeight: 'bold',
    lineHeight: 22,
  },
  interactionLabel: {
    color: '#FFF',
    fontSize: 9,
    marginVertical: 4,
  },

  // --- LCD RESULT STRIP ---
  lcdScreen: {
    backgroundColor: LCD_GREEN,
    borderWidth: 3,
    borderColor: '#555',
    borderRadius: 8,
    padding: 12,
    marginTop: 20,
    // Inner shadow simulation
    elevation: 1,
  },
  lcdTextTitle: {
    fontFamily: 'monospace',
    color: LCD_DARK,
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 5,
    textTransform: 'uppercase',
  },
  lcdTextSub: {
    fontFamily: 'monospace',
    color: LCD_DARK,
    fontSize: 14,
    marginBottom: 2,
  },
  lcdTextError: {
    fontFamily: 'monospace',
    color: '#800000',
    fontSize: 16,
    fontWeight: 'bold',
  },

  // --- PERMISSIONS / ERRORS ---
  message: {
    textAlign: 'center',
    fontSize: 16,
    color: '#FFF',
    fontWeight: 'bold',
    marginBottom: 24,
  },
  mainButton: {
    backgroundColor: BORDER_DARK,
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: '#000',
  },
  buttonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: 'bold',
    textTransform: 'uppercase',
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
