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
  Platform,
  Modal,
  ScrollView
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
  const [selectedDog, setSelectedDog] = useState<DogdexEntry | null>(null);

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
    <TouchableOpacity 
      style={styles.card} 
      activeOpacity={0.8} 
      onPress={() => setSelectedDog(item)}
    >
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
    </TouchableOpacity>
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

      <Modal
        visible={!!selectedDog}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setSelectedDog(null)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <TouchableOpacity style={styles.modalCloseButton} onPress={() => setSelectedDog(null)}>
              <Ionicons name="close-circle" size={32} color="#FA3045" />
            </TouchableOpacity>

            {selectedDog && (
              <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 20 }}>
                <Image source={{ uri: selectedDog.imageUri }} style={styles.modalImage} />
                
                <View style={styles.modalInfoContainer}>
                  <Text style={styles.modalBreedTitle}><Ionicons name="paw" size={24} color="#0F380F" /> {selectedDog.breedName}</Text>
                  
                  <View style={styles.modalMetaRow}>
                    <Ionicons name="location" size={16} color="#0F380F" />
                    <Text style={styles.modalMetaText}>{selectedDog.locationAddr}</Text>
                  </View>
                  
                  <View style={styles.modalMetaRow}>
                    <Ionicons name="calendar" size={16} color="#0F380F" />
                    <Text style={styles.modalMetaText}>{new Date(selectedDog.timestamp).toLocaleString('pt-BR')}</Text>
                  </View>
                  
                  <View style={styles.modalDivider} />

                  <Text style={styles.modalSectionTitle}>ANALYSIS DATA</Text>
                  <Text style={styles.modalDetailText}>Precisão: {((selectedDog.confidence || 0) * 100).toFixed(1)}%</Text>
                  
                  {selectedDog.dogData && (
                    <>
                      <Text style={styles.modalDetailText}>Temperamento: {selectedDog.dogData.temperament?.join(', ') || 'N/A'}</Text>
                      <Text style={styles.modalDetailText}>Energia: {selectedDog.dogData.energy || 'N/A'}</Text>
                      <Text style={styles.modalDetailText}>Vida Prevista: {selectedDog.dogData.life || 'N/A'}</Text>
                    </>
                  )}
                </View>
              </ScrollView>
            )}
          </View>
        </View>
      </Modal>
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
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.75)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: '90%',
    maxHeight: '85%',
    backgroundColor: '#8BAC0F', // LCD Green style
    borderRadius: 16,
    overflow: 'hidden',
    borderWidth: 4,
    borderColor: '#0F380F',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.5,
    shadowRadius: 15,
    elevation: 20,
  },
  modalCloseButton: {
    position: 'absolute',
    top: 10,
    right: 10,
    zIndex: 10,
    backgroundColor: 'rgba(255, 255, 255, 0.85)',
    borderRadius: 20,
  },
  modalImage: {
    width: '100%',
    height: 350,
    resizeMode: 'cover',
    borderBottomWidth: 3,
    borderBottomColor: '#0F380F',
  },
  modalInfoContainer: {
    padding: 20,
  },
  modalBreedTitle: {
    fontFamily: 'monospace',
    fontSize: 22,
    fontWeight: 'bold',
    color: '#0F380F',
    marginBottom: 10,
    textTransform: 'uppercase',
  },
  modalMetaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 6,
  },
  modalMetaText: {
    fontFamily: 'monospace',
    color: '#306230',
    fontSize: 14,
    flex: 1,
  },
  modalDivider: {
    height: 2,
    backgroundColor: '#0F380F',
    marginVertical: 15,
    opacity: 0.3,
  },
  modalSectionTitle: {
    fontFamily: 'monospace',
    fontSize: 16,
    fontWeight: 'bold',
    color: '#0F380F',
    marginBottom: 8,
  },
  modalDetailText: {
    fontFamily: 'monospace',
    fontSize: 14,
    color: '#306230',
    marginBottom: 6,
    lineHeight: 20,
  }
});
