import { 
  View, 
  Text, 
  StyleSheet, 
  FlatList, 
  Image, 
  TouchableOpacity, 
  SafeAreaView,
  Dimensions,
  Alert,
  Platform
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useDogdexStorage, DogdexEntry } from '../hooks/useDogdexStorage';
import { useEffect, useState } from 'react';

const { width } = Dimensions.get('window');
const COLUMN_COUNT = 2;
const ITEM_WIDTH = (width - 40) / COLUMN_COUNT;

export default function DogdexScreen() {
  const router = useRouter();
  const { getEntries, deleteEntry } = useDogdexStorage();
  const [entries, setEntries] = useState<DogdexEntry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    const data = await getEntries();
    setEntries(data);
    setLoading(false);
  };

  const handleDelete = async (id: string, name: string) => {
    const performDelete = async () => {
      const success = await deleteEntry(id);
      if (success) {
        setEntries(prev => prev.filter(e => e.id !== id));
      } else {
        Alert.alert('Erro', 'Não foi possível apagar o registro.');
      }
    };

    if (Platform.OS === 'web') {
      if (confirm(`Deseja apagar o registro de ${name}?`)) {
        performDelete();
      }
    } else {
      Alert.alert(
        'Apagar Registro',
        `Deseja realmente remover ${name} da sua Dogdex?`,
        [
          { text: 'Cancelar', style: 'cancel' },
          { text: 'Apagar', style: 'destructive', onPress: performDelete }
        ]
      );
    }
  };

  const renderItem = ({ item }: { item: DogdexEntry }) => (
    <View style={styles.card}>
      <View style={styles.imageContainer}>
        <Image source={{ uri: item.imageUri }} style={styles.image} />
        <View style={styles.confidenceBadge}>
          <Text style={styles.confidenceText}>{((item.confidence || 0) * 100).toFixed(0)}%</Text>
        </View>
        <TouchableOpacity 
          style={styles.deleteButton} 
          onPress={() => handleDelete(item.id, item.breedName)}
        >
          <Ionicons name="trash" size={18} color="#FFF" />
        </TouchableOpacity>
      </View>
      <View style={styles.cardInfo}>
        <Text style={styles.breedName} numberOfLines={1}>{item.breedName}</Text>
        <View style={styles.metaRow}>
          <Ionicons name="location-outline" size={12} color="#AAA" />
          <Text style={styles.metaText} numberOfLines={1}>{item.locationAddr}</Text>
        </View>
        <Text style={styles.dateText}>
          {new Date(item.timestamp).toLocaleDateString('pt-BR')}
        </Text>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#FFF" />
        </TouchableOpacity>
        <Text style={styles.title}>DOGDEX INVENTORY</Text>
        <View style={{ width: 24 }} />
      </View>

      {loading ? (
        <View style={styles.centered}>
          <Text style={styles.loadingText}>Loading database...</Text>
        </View>
      ) : entries.length === 0 ? (
        <View style={styles.centered}>
          <Ionicons name="paw-outline" size={64} color="#333" />
          <Text style={styles.emptyText}>No dogs scanned yet.</Text>
          <TouchableOpacity 
            style={styles.scanNowButton}
            onPress={() => router.push('/')}
          >
            <Text style={styles.scanNowText}>SCAN NOW</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <FlatList
          data={entries}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          numColumns={COLUMN_COUNT}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
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
  listContent: {
    padding: 15,
  },
  card: {
    width: ITEM_WIDTH,
    backgroundColor: '#2A303A',
    borderRadius: 12,
    marginBottom: 15,
    marginHorizontal: 5,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#383D47',
  },
  imageContainer: {
    width: '100%',
    height: ITEM_WIDTH,
  },
  image: {
    width: '100%',
    height: '100%',
  },
  confidenceBadge: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: 'rgba(0,0,0,0.6)',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  deleteButton: {
    position: 'absolute',
    top: 8,
    left: 8,
    backgroundColor: 'rgba(250, 48, 69, 0.8)',
    padding: 6,
    borderRadius: 8,
    elevation: 3,
  },
  confidenceText: {
    color: '#4CAF50',
    fontSize: 10,
    fontWeight: 'bold',
  },
  cardInfo: {
    padding: 10,
  },
  breedName: {
    color: '#FFF',
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginBottom: 4,
  },
  metaText: {
    color: '#AAA',
    fontSize: 10,
  },
  dateText: {
    color: '#666',
    fontSize: 9,
    textAlign: 'right',
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  loadingText: {
    color: '#FFF',
    marginTop: 10,
  },
  emptyText: {
    color: '#666',
    fontSize: 16,
    marginTop: 15,
    marginBottom: 20,
  },
  scanNowButton: {
    backgroundColor: '#FA3045',
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 25,
  },
  scanNowText: {
    color: '#FFF',
    fontWeight: 'bold',
    letterSpacing: 1,
  }
});
