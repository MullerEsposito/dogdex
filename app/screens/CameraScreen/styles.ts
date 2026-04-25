import { StyleSheet } from 'react-native';

// Pokedex Color Palette
export const POKEDEX_RED = '#DC0A2D';
export const LCD_GREEN = '#8BAC0F';
export const LCD_DARK = '#0F380F';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: POKEDEX_RED,
  },
  
  // --- HARDWARE EMBOSS DETAILS ---
  bottomLeftArcOuter: {
    position: 'absolute',
    bottom: 20,
    left: 20,
    width: 30,
    height: 30,
    borderBottomLeftRadius: 40,
    borderBottomWidth: 4.5,
    borderLeftWidth: 4.5,
    borderColor: 'rgba(255,255,255,0.22)',
  },
  bottomLeftArcInner: {
    position: 'absolute',
    bottom: 21,
    left: 21,
    width: 30,
    height: 30,
    borderBottomLeftRadius: 39,
    borderBottomWidth: 4.5,
    borderLeftWidth: 4.5,
    borderColor: 'rgba(0,0,0,0.37)',
  },
  bottomRightArcOuter: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    width: 30,
    height: 30,
    borderBottomRightRadius: 40,
    borderBottomWidth: 4.5,
    borderRightWidth: 4.5,
    borderColor: 'rgba(255,255,255,0.22)',
  },
  bottomRightArcInner: {
    position: 'absolute',
    bottom: 21,
    right: 21,
    width: 30,
    height: 30,
    borderBottomRightRadius: 39,
    borderBottomWidth: 4.5,
    borderRightWidth: 4.5,
    borderColor: 'rgba(0,0,0,0.37)',
  },
  bottomCenterSweep: {
    position: 'absolute',
    bottom: 10,
    left: '35%',
    right: '35%',
    borderBottomWidth: 4.5,
    borderTopLeftRadius: "15%",
    borderTopRightRadius: "15%",
    borderBottomLeftRadius: "15%",
    borderBottomRightRadius: "15%",
    borderColor: 'rgba(255,255,255,0.22)',
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
    backgroundColor: '#2C2C2C',
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
});
