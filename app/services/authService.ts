import { Platform } from 'react-native';
import * as WebBrowser from 'expo-web-browser';
import { makeRedirectUri } from 'expo-auth-session';
import { supabase } from '../lib/supabase';

export interface User {
  id: string;
  email: string;
  name?: string;
  avatarUrl?: string;
}

export interface AuthResponse {
  token: string;
  user: User;
}

export const authService = {
  async register(email: string, password: string, name?: string): Promise<AuthResponse> {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: name,
        },
      },
    });

    if (error) throw error;
    if (!data.session || !data.user) throw new Error('Falha no registro');

    return {
      token: data.session.access_token,
      user: {
        id: data.user.id,
        email: data.user.email || '',
        name: data.user.user_metadata?.full_name,
        avatarUrl: data.user.user_metadata?.avatar_url,
      },
    };
  },

  async login(email: string, password: string): Promise<AuthResponse> {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) throw error;
    if (!data.session || !data.user) throw new Error('Falha no login');

    return {
      token: data.session.access_token,
      user: {
        id: data.user.id,
        email: data.user.email || '',
        name: data.user.user_metadata?.full_name,
        avatarUrl: data.user.user_metadata?.avatar_url,
      },
    };
  },

  async signInWithGoogle() {
    const redirection = makeRedirectUri({
      scheme: 'dogdex',
      path: 'auth'
    });

    const isWeb = Platform.OS === 'web';

    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: redirection,
        skipBrowserRedirect: !isWeb,
      },
    });

    if (error) throw error;

    // Se estiver no Mobile, precisamos gerenciar o navegador e o retorno
    if (!isWeb && data?.url) {
      const res = await WebBrowser.openAuthSessionAsync(data.url, redirection);

      if (res.type === 'success' && res.url) {
        // Supabase returns tokens in the URL fragment (#)
        const url = res.url.replace('#', '?');
        const params = new URL(url).searchParams;
        
        const accessToken = params.get('access_token');
        const refreshToken = params.get('refresh_token');

        if (accessToken && refreshToken) {
          const { error: sessionError } = await supabase.auth.setSession({
            access_token: accessToken,
            refresh_token: refreshToken
          });
          
          if (sessionError) throw sessionError;
        }
      }
    }
  },

  async signOut() {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
  },

  async getMe(): Promise<User> {
    const { data: { user }, error } = await supabase.auth.getUser();
    
    if (error) throw error;
    if (!user) throw new Error('Usuário não autenticado');

    return {
      id: user.id,
      email: user.email || '',
      name: user.user_metadata?.full_name,
      avatarUrl: user.user_metadata?.avatar_url,
    };
  },
};
