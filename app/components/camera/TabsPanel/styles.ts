import { StyleSheet, Dimensions } from 'react-native';
import { POKEDEX_RED, DARK_RED, BORDER_DARK, LENS_BLUE_IDLE, LENS_GREEN_SUCCESS, LENS_RED_ERROR, LENS_YELLOW_LOADING, LCD_GREEN, LCD_DARK } from '../../../screens/CameraScreen.styles';

const { width } = Dimensions.get('window');

export const styles = StyleSheet.create({
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
  }
});
