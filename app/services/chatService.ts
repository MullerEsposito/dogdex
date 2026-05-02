import axios from 'axios';

const API_URL = process.env.EXPO_PUBLIC_API_URL;

export interface UserPreview {
  id: string;
  name: string | null;
  avatarUrl: string | null;
}

export interface ChatSession {
  id: string;
  adopterId: string;
  creatorId: string;
  adoptionPointId: string;
  createdAt: string;
  updatedAt: string;
  adopter?: UserPreview;
  creator?: UserPreview;
  adoptionPoint?: { name: string };
  messages?: Message[];
}

export interface Message {
  id: string;
  sessionId: string;
  senderId: string;
  content: string;
  isRead: boolean;
  createdAt: string;
}

export const chatService = {
  createOrGetSession: async (token: string, adoptionPointId: string) => {
    const response = await axios.post(
      `${API_URL}/chat/session`,
      { adoptionPointId },
      { headers: { Authorization: `Bearer ${token}` } }
    );
    return response.data;
  },

  getMySessions: async (token: string) => {
    const response = await axios.get(`${API_URL}/chat/sessions`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  },

  getMessages: async (token: string, sessionId: string) => {
    const response = await axios.get(`${API_URL}/chat/sessions/${sessionId}/messages`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  },

  sendMessage: async (token: string, sessionId: string, content: string) => {
    const response = await axios.post(
      `${API_URL}/chat/sessions/${sessionId}/messages`,
      { content },
      { headers: { Authorization: `Bearer ${token}` } }
    );
    return response.data;
  },

  getUnreadCount: async (token: string) => {
    const response = await axios.get(`${API_URL}/chat/unread-count`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  },
};
