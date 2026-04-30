import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
import MapView, { Marker, Callout, PROVIDER_GOOGLE } from 'react-native-maps';
import * as Location from 'expo-location';
import { Ionicons } from '@expo/vector-icons';
import { useRouter, useFocusEffect } from 'expo-router';
import { styles } from './styles';
import { BASE_URL } from '../../services/api';
import { AdoptionPoint } from '@dogdex/shared';
import axios from 'axios';
import { chatService } from '../../services/chatService';
import { supabase } from '../../lib/supabase';

const mapStyle = [
  {
    featureType: 'poi',
    stylers: [{ visibility: 'off' }],
  },
  {
    featureType: 'transit',
    stylers: [{ visibility: 'off' }],
  },
];

export default function MapScreen() {
  const router = useRouter();
  const [location, setLocation] = useState<Location.LocationObject | null>(null);
  const [selectedCoordinate, setSelectedCoordinate] = useState<{latitude: number, longitude: number} | null>(null);
  const [points, setPoints] = useState<AdoptionPoint[]>([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setErrorMsg('Permissão de localização negada');
        setLoading(false);
        return;
      }

      let currentLocation = await Location.getCurrentPositionAsync({});
      setLocation(currentLocation);
    })();
  }, []);

  useFocusEffect(
    useCallback(() => {
      fetchPoints();
      fetchUnreadCount();

      const interval = setInterval(() => {
        fetchUnreadCount();
      }, 5000); // Poll for unread count every 5 seconds

      return () => clearInterval(interval);
    }, [])
  );

  const fetchUnreadCount = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return;

      const response = await chatService.getUnreadCount(session.access_token);
      if (response.success) {
        setUnreadCount(response.data.count);
      }
    } catch (error) {
      console.error('Error fetching unread count:', error);
    }
  };

  const fetchPoints = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${BASE_URL}/adoption/points`);
      if (response.data.success) {
        setPoints(response.data.data);
      }
    } catch (error) {
      console.error('Erro ao buscar pontos de adoção:', error);
      Alert.alert('Erro', 'Não foi possível carregar os pontos de adoção.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      {loading && (
        <View style={styles.loaderContainer}>
          <ActivityIndicator size="large" color="#8DB0C2" />
          <Text>Carregando mapa...</Text>
        </View>
      )}

      {location && (
        <MapView
          provider={PROVIDER_GOOGLE}
          style={styles.map}
          customMapStyle={mapStyle}
          initialRegion={{
            latitude: location.coords.latitude,
            longitude: location.coords.longitude,
            latitudeDelta: 0.0922,
            longitudeDelta: 0.0421,
          }}
          showsUserLocation={false}
          onLongPress={(e) => setSelectedCoordinate(e.nativeEvent.coordinate)}
          onPress={() => setSelectedCoordinate(null)}
        >
          {selectedCoordinate && (
            <Marker
              coordinate={selectedCoordinate}
              onPress={() => setSelectedCoordinate(null)}
            >
              <View style={styles.selectedMarkerContainer}>
                <Ionicons name="location" size={30} color="#3498db" />
              </View>
            </Marker>
          )}
          {points
            .filter(p => p && p.latitude != null && p.longitude != null)
            .map((point) => (
            <Marker
              key={point.id}
              coordinate={{
                latitude: Number(point.latitude),
                longitude: Number(point.longitude),
              }}
            >
              <View style={styles.markerContainer}>
                <Ionicons name="paw" size={24} color="#8DB0C2" />
              </View>
              <Callout onPress={() => router.push({ pathname: '/adoption-details', params: { id: point.id } } as any)}>
                <View style={styles.calloutContainer}>
                  <Text style={styles.calloutTitle}>{point.name}</Text>
                  <Text style={styles.calloutDescription} numberOfLines={2}>
                    {point.description || 'Ponto de adoção'}
                  </Text>
                  <View style={styles.calloutButton}>
                    <Text style={styles.calloutButtonText}>Ver Galeria</Text>
                  </View>
                </View>
              </Callout>
            </Marker>
          ))}
        </MapView>
      )}

      <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
        <Ionicons name="arrow-back" size={24} color="#fff" />
      </TouchableOpacity>

      <TouchableOpacity 
        style={styles.fab} 
        onPress={() => {
          if (selectedCoordinate) {
            router.push({
              pathname: '/create-point',
              params: {
                lat: selectedCoordinate.latitude,
                lng: selectedCoordinate.longitude
              }
            } as any);
          } else if (location) {
            router.push({
              pathname: '/create-point',
              params: {
                lat: location.coords.latitude,
                lng: location.coords.longitude
              }
            } as any);
          } else {
            Alert.alert('Aguarde', 'Obtendo sua localização atual...');
          }
        }}
      >
        <Ionicons name="add" size={30} color="#fff" />
      </TouchableOpacity>

      <TouchableOpacity 
        style={styles.chatFab} 
        onPress={() => router.push('/chat' as any)}
      >
        <Ionicons name="chatbubbles" size={30} color="#fff" />
        {unreadCount > 0 && (
          <View style={styles.badge}>
            <Text style={styles.badgeText}>
              {unreadCount > 9 ? '9+' : unreadCount}
            </Text>
          </View>
        )}
      </TouchableOpacity>

      {errorMsg && (
        <View style={styles.loaderContainer}>
          <Text>{errorMsg}</Text>
          <TouchableOpacity onPress={() => router.back()} style={{ marginTop: 20 }}>
            <Text style={{ color: '#8DB0C2' }}>Voltar</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}
