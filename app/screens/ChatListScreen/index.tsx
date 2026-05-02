import React, { useState, useCallback } from 'react';
import { View, Text, FlatList, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { supabase } from '../../lib/supabase';
import { chatService, ChatSession } from '../../services/chatService';
import { useFocusEffect } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { useAuth } from '../../hooks/useAuth';
import { styles } from './styles';

export default function ChatListScreen() {
  const router = useRouter();
  const { user } = useAuth();
  const [sessions, setSessions] = useState<ChatSession[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchSessions = useCallback(async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return;
      
      const response = await chatService.getMySessions(session.access_token);
      if (response.success) {
        setSessions(response.data);
      }
    } catch (error) {
      console.error('Error fetching chat sessions:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      fetchSessions();
    }, [fetchSessions])
  );

  const getOtherUser = (session: ChatSession) => {
    if (session.adopterId === user?.id) {
      return session.creator;
    }
    return session.adopter;
  };

  const renderItem = ({ item }: { item: ChatSession }) => {
    const otherUser = getOtherUser(item);
    const lastMessage = item.messages?.[0];
    
    return (
      <TouchableOpacity 
        style={styles.chatItem}
        onPress={() => router.push(`/chat/${item.id}` as any)}
      >
        {otherUser?.avatarUrl ? (
          <Image 
            source={{ uri: otherUser.avatarUrl }} 
            style={styles.avatar} 
            contentFit="cover"
          />
        ) : (
          <View style={[styles.avatar, { justifyContent: 'center', alignItems: 'center', backgroundColor: '#e0e0e0' }]}>
            <Ionicons name="person" size={28} color="#999" />
          </View>
        )}
        <View style={styles.chatInfo}>
          <Text style={styles.chatName}>{otherUser?.name || 'Usuário Desconhecido'}</Text>
          <Text style={styles.chatPoint}>Ponto: {item.adoptionPoint?.name}</Text>
          {lastMessage && (
            <Text style={styles.lastMessage} numberOfLines={1}>
              {lastMessage.content}
            </Text>
          )}
        </View>
        <Ionicons name="chevron-forward" size={24} color="#ccc" />
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Minhas Conversas</Text>
        <View style={{ width: 40 }} />
      </View>

      {loading ? (
        <View style={styles.center}>
          <ActivityIndicator size="large" color="#4CAF50" />
        </View>
      ) : sessions.length === 0 ? (
        <View style={styles.center}>
          <Ionicons name="chatbubbles-outline" size={64} color="#ccc" />
          <Text style={styles.emptyText}>Nenhuma conversa iniciada ainda.</Text>
        </View>
      ) : (
        <FlatList
          data={sessions}
          keyExtractor={item => item.id}
          renderItem={renderItem}
          contentContainerStyle={styles.list}
        />
      )}
    </View>
  );
}

