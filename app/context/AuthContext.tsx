import React, { createContext, useState, useEffect, ReactNode } from 'react';
import * as SecureStore from 'expo-secure-store';
import { authService, User } from '../services/authService';

interface AuthContextData {
  user: User | null;
  token: string | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, name?: string) => Promise<void>;
  signOut: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextData>({} as AuthContextData);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadStorageData() {
      try {
        const storedToken = await SecureStore.getItemAsync('dogdex_token');
        
        if (storedToken) {
          try {
            const userData = await authService.getMe(storedToken);
            setToken(storedToken);
            setUser(userData);
          } catch (error) {
            // Token expired or invalid
            await SecureStore.deleteItemAsync('dogdex_token');
          }
        }
      } catch (error) {
        console.error('Failed to load auth data:', error);
      } finally {
        setLoading(false);
      }
    }

    loadStorageData();
  }, []);

  const signIn = async (email: string, password: string) => {
    const { token: authToken, user: authUser } = await authService.login(email, password);
    
    await SecureStore.setItemAsync('dogdex_token', authToken);
    setToken(authToken);
    setUser(authUser);
  };

  const signUp = async (email: string, password: string, name?: string) => {
    const { token: authToken, user: authUser } = await authService.register(email, password, name);
    
    await SecureStore.setItemAsync('dogdex_token', authToken);
    setToken(authToken);
    setUser(authUser);
  };

  const signOut = async () => {
    await SecureStore.deleteItemAsync('dogdex_token');
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, token, loading, signIn, signUp, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};
