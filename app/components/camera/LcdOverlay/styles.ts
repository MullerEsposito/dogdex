import { StyleSheet } from 'react-native';
import { LCD_GREEN, LCD_DARK } from '../../../screens/CameraScreen.styles';

export const styles = StyleSheet.create({
  // --- LCD RESULT STRIP OVERLAY ---
  lcdScreenWrapper: {
    position: 'absolute',
    bottom: '5%',
    width: '100%',
    alignSelf: 'center',
    backgroundColor: '#1E232B',
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#383D47',
    zIndex: 50,
    padding: 12,
    elevation: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.8,
    shadowRadius: 15,
  },
  lcdScreenHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  lcdScreenTitle: {
    color: '#FFF',
    fontWeight: 'bold',
    letterSpacing: 1,
    fontSize: 12,
  },
  lcdCloseButton: {
    padding: 2,
  },
  lcdScreen: {
    backgroundColor: LCD_GREEN,
    borderWidth: 3,
    borderColor: '#111',
    borderRadius: 8,
    padding: 12,
    maxHeight: 250,
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
  }
});
