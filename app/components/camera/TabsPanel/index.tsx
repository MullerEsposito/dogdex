import { View, Text, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { CopilotStep, walkthroughable } from 'react-native-copilot';
import { styles } from './styles';

const WalkthroughableTouchableOpacity = walkthroughable(TouchableOpacity);

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
        
        <CopilotStep text="Veja aqui todos os cães identificados. Seus dados são sincronizados automaticamente com a nuvem!" order={7} name="dogdex">
          <WalkthroughableTouchableOpacity 
            style={[styles.tabItem, styles.tabItemCenter]} 
            activeOpacity={0.7}
            onPress={() => router.push('/dogdex' as any)}
          >
            <Text style={styles.tabText}>DOGDEX</Text>
          </WalkthroughableTouchableOpacity>
        </CopilotStep>
        
        <TouchableOpacity style={styles.tabItem} activeOpacity={0.7}>
          <Text style={styles.tabText}>MAP</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
