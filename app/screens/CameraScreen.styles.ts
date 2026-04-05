import { StyleSheet } from 'react-native';

// Pokedex Color Palette
export const POKEDEX_RED = '#DC0A2D';
export const DARK_RED = '#8B0000';
export const BORDER_DARK = '#2C2C2C';
export const LENS_BLUE_IDLE = '#28AAFD';
export const LENS_GREEN_SUCCESS = '#4CAF50';
export const LENS_RED_ERROR = '#F44336';
export const LENS_YELLOW_LOADING = '#FFEB3B';
export const LCD_GREEN = '#8BAC0F';
export const LCD_DARK = '#0F380F';

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
});
