import React, { useState } from 'react';
import { 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Keyboard
} from 'react-native';
import { styles } from './styles';
import { Ionicons } from '@expo/vector-icons';
import { adoptionService } from '../../services/adoptionService';
import { useAuth } from '../../hooks/useAuth';
import { useRouter, useLocalSearchParams } from 'expo-router';
import * as Location from 'expo-location';

const applyPhoneMask = (text: string) => {
  if (!text) return '';
  const cleaned = text.replace(/\D/g, '');
  const limited = cleaned.slice(0, 11);
  
  if (limited.length <= 2) return limited;
  if (limited.length <= 6) return `(${limited.slice(0, 2)}) ${limited.slice(2)}`;
  if (limited.length <= 10) return `(${limited.slice(0, 2)}) ${limited.slice(2, 6)}-${limited.slice(6)}`;
  return `(${limited.slice(0, 2)}) ${limited.slice(2, 7)}-${limited.slice(7)}`;
};

export default function CreatePointScreen() {
  const { session } = useAuth();
  const router = useRouter();
  const params = useLocalSearchParams();
  
  const latitude = Number(params.lat) || 0;
  const longitude = Number(params.lng) || 0;

  const [coords, setCoords] = useState({ latitude, longitude });
  const [suggestions, setSuggestions] = useState<any[]>([]);
  const [searching, setSearching] = useState(false);
  const [name, setName] = useState(params.name as string || '');
  const [address, setAddress] = useState(params.address as string || '');
  const [description, setDescription] = useState(params.description as string || '');
  const [contactPhone, setContactPhone] = useState(applyPhoneMask(params.contactPhone as string || ''));
  const [loading, setLoading] = useState(false);
  const isEditing = !!params.id;

  React.useEffect(() => {
    if (coords.latitude && coords.longitude && !address) {
      (async () => {
        try {
          const [result] = await Location.reverseGeocodeAsync({ 
            latitude: coords.latitude, 
            longitude: coords.longitude 
          });
          if (result) {
            const street = result.street || '';
            const number = result.streetNumber || '';
            const district = result.district || result.subregion || '';
            const city = result.city || '';
            const formatted = `${street}${number ? `, ${number}` : ''}${district ? ` - ${district}` : ''}${city ? ` (${city})` : ''}`;
            setAddress(formatted);
          }
        } catch (error) {
          console.warn('Erro ao obter endereço:', error);
        }
      })();
    }
  }, [coords.latitude, coords.longitude, address]);
  
  const searchTimeout = React.useRef<NodeJS.Timeout | null>(null);

  const searchAddress = async (text: string) => {
    setAddress(text);
    
    if (searchTimeout.current) clearTimeout(searchTimeout.current);

    if (text.length < 3) {
      setSuggestions([]);
      return;
    }

    searchTimeout.current = setTimeout(async () => {
      setSearching(true);
      try {
        const url = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(text)}&format=json&addressdetails=1&limit=5&countrycodes=br`;
        console.log('Buscando endereço:', url);
        
        const response = await fetch(url, {
          headers: {
            'User-Agent': 'DogDexApp/0.4.0'
          }
        });
        const data = await response.json();
        
        console.log('Sugestões encontradas:', data?.length || 0);
        
        // Deduplicate results based on display name or address components
        if (Array.isArray(data)) {
          const uniqueSuggestions = [];
          const seen = new Set();
          
          for (const item of data) {
            const title = item.address?.road || item.address?.suburb || item.name || item.display_name.split(',')[0];
            const subtitle = [item.address?.suburb, item.address?.city, item.address?.state].filter(Boolean).join(', ');
            const key = `${title}-${subtitle}`;
            
            if (!seen.has(key)) {
              seen.add(key);
              uniqueSuggestions.push(item);
            }
          }
          
          setSuggestions(uniqueSuggestions);
        } else {
          setSuggestions([]);
        }
      } catch (error) {
        console.warn('Erro ao buscar sugestões:', error);
      } finally {
        setSearching(false);
      }
    }, 500); // 500ms debounce
  };

  const handleSelectSuggestion = (item: any) => {
    const lat = Number(item.lat);
    const lng = Number(item.lon);
    
    // Nominatim returns address details in 'address' object
    const addr = item.address || {};
    
    // Se a API não retornou o número, tenta extrair o que o usuário digitou (ex: "Rua X, 123")
    let houseNumber = addr.house_number;
    if (!houseNumber) {
      const match = address.match(/(?:,|nº|numero)\s*(\d+[a-zA-Z]?)/i);
      if (match) {
        houseNumber = match[1];
      }
    }

    const road = addr.road || addr.pedestrian || addr.suburb || item.name || item.display_name.split(',')[0];
    
    const formatted = [
      road,
      houseNumber,
      addr.suburb || addr.neighbourhood,
      addr.city || addr.town || addr.village,
      addr.state
    ].filter(Boolean).join(', ');

    // Se o formatado for muito curto, tenta usar o display_name original e injeta o número
    let finalAddress = formatted.length > 5 ? formatted : item.display_name;
    if (!addr.house_number && houseNumber && finalAddress === item.display_name) {
       finalAddress = finalAddress.replace(road, `${road}, ${houseNumber}`);
    }

    setAddress(finalAddress);
    setCoords({ latitude: lat, longitude: lng });
    setSuggestions([]);
    Keyboard.dismiss();
  };

  const handleCreate = async () => {
    if (!name.trim()) {
      Alert.alert('Erro', 'Por favor, informe um nome para o ponto.');
      return;
    }

    if (!session?.access_token) {
      Alert.alert('Erro', 'Você precisa estar logado para criar um ponto.');
      return;
    }

    setLoading(true);
    try {
      const data = {
        name,
        address,
        description,
        latitude: coords.latitude,
        longitude: coords.longitude,
        contactPhone: contactPhone.replace(/\D/g, '')
      };

      if (isEditing) {
        await adoptionService.updatePoint(session.access_token, params.id as string, data);
        Alert.alert('Sucesso', 'Ponto de adoção atualizado com sucesso!');
      } else {
        await adoptionService.createPoint(session.access_token, data);
        Alert.alert('Sucesso', 'Ponto de adoção criado com sucesso!');
      }
      router.back();
    } catch (error) {
      console.error('Erro ao salvar ponto:', error);
      Alert.alert('Erro', `Não foi possível ${isEditing ? 'atualizar' : 'criar'} o ponto de adoção.`);
    } finally {
      setLoading(false);
    }
  };

  const formContent = (
    <View style={styles.formContainer}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.title}>{isEditing ? 'Editar Ponto' : 'Novo Ponto'}</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps="handled">
        <View style={styles.form}>
          <Text style={styles.label}>Nome do Ponto</Text>
          <TextInput
            style={styles.input}
            placeholder="Ex: Abrigo do Coração"
            value={name}
            onChangeText={setName}
          />

          <Text style={styles.label}>Endereço</Text>
          <View style={styles.addressContainer}>
            <TextInput
              style={styles.input}
              placeholder="Ex: Rua das Flores, 123"
              value={address}
              onChangeText={searchAddress}
            />
            {searching && (
              <View style={styles.searchingIndicator}>
                <ActivityIndicator size="small" color="#8DB0C2" />
              </View>
            )}
          </View>

          {suggestions.length > 0 && (
            <View style={styles.suggestionsList}>
              {suggestions.map((item, index) => (
                <TouchableOpacity 
                  key={index} 
                  style={styles.suggestionItem}
                  onPress={() => handleSelectSuggestion(item)}
                >
                  <Ionicons name="location-outline" size={18} color="#666" />
                  <View style={styles.suggestionTextContainer}>
                    <Text style={styles.suggestionTitle} numberOfLines={1}>
                      {item.address?.road || item.address?.suburb || item.name || item.display_name.split(',')[0]}
                    </Text>
                    <Text style={styles.suggestionSubtitle} numberOfLines={1}>
                      {[item.address?.suburb, item.address?.city, item.address?.state].filter(Boolean).join(', ')}
                    </Text>
                  </View>
                </TouchableOpacity>
              ))}
            </View>
          )}

          <Text style={styles.label}>Descrição (Opcional)</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            placeholder="Fale um pouco sobre este local..."
            value={description}
            onChangeText={setDescription}
            multiline
            numberOfLines={4}
          />

          <Text style={styles.label}>WhatsApp / Telefone de Contato</Text>
          <TextInput
            style={styles.input}
            placeholder="Ex: (11) 99999-9999"
            value={contactPhone}
            onChangeText={(text) => setContactPhone(applyPhoneMask(text))}
            keyboardType="phone-pad"
            maxLength={15}
          />

          <View style={styles.locationInfo}>
            <Ionicons name="location" size={20} color="#8DB0C2" />
            <Text style={styles.locationText}>
              Localização: {coords.latitude.toFixed(4)}, {coords.longitude.toFixed(4)}
            </Text>
          </View>

          <TouchableOpacity 
            style={[styles.submitButton, loading && styles.disabledButton]} 
            onPress={handleCreate}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#FFF" />
            ) : (
              <Text style={styles.submitButtonText}>
                {isEditing ? 'SALVAR ALTERAÇÕES' : 'CRIAR PONTO'}
              </Text>
            )}
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );

  return (
    <View style={styles.container}>
      {Platform.OS === 'ios' ? (
        <KeyboardAvoidingView behavior="padding" style={styles.container}>
          {formContent}
        </KeyboardAvoidingView>
      ) : (
        formContent
      )}
    </View>
  );
}
