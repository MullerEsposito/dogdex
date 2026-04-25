import { StyleSheet, Dimensions, Platform } from 'react-native';

const { width } = Dimensions.get('window');
export const COLUMN_COUNT = 2;
export const ITEM_WIDTH = (width - 40) / COLUMN_COUNT;

export const styles = StyleSheet.create({
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
  titleContainer: {
    flex: 1,
    alignItems: 'center',
    marginHorizontal: 10,
  },
  title: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: 'bold',
    letterSpacing: 2,
  },
  userEmail: {
    color: '#AAA',
    fontSize: 10,
    marginTop: 2,
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
  },
  headerActions: {
    flexDirection: 'row',
    gap: 15,
  },
  actionButton: {
    padding: 5,
    borderRadius: 20,
    backgroundColor: '#2A303A',
  },
  actionButtonDisabled: {
    opacity: 0.5,
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
  syncIndicator: {
    position: 'absolute',
    top: 8,
    right: 45, // Next to confidence badge
    backgroundColor: 'rgba(0,0,0,0.6)',
    padding: 4,
    borderRadius: 12,
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
