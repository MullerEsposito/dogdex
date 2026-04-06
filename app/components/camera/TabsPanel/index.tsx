import { View, Text, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { styles } from './styles';

export default function TabsPanel() {
  const router = useRouter();

  return (
    <View style={styles.tabsWrapper}>
      <View style={styles.tabsContainer}>
        <TouchableOpacity style={styles.tabItem} activeOpacity={0.7} onPress={() => router.push('/')}>
          <Text style={[styles.tabText, styles.tabTextActive]}>SCANNING</Text>
          <View style={styles.tabIndicatorContainer}>
            <View style={styles.tabIndicator} />
          </View>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[styles.tabItem, styles.tabItemCenter]} 
          activeOpacity={0.7}
          onPress={() => router.push('/dogdex')}
        >
          <Text style={styles.tabText}>DOGDEX</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.tabItem} activeOpacity={0.7}>
          <Text style={styles.tabText}>MAP</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
