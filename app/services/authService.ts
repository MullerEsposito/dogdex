import { Platform } from 'react-native';
import * as FileSystem from 'expo-file-system/legacy';
import * as WebBrowser from 'expo-web-browser';
import { makeRedirectUri } from 'expo-auth-session';
import axios from 'axios';
import { supabase } from '../lib/supabase';
import { BASE_URL } from './api';

export interface User {
  id: string;
  email: string;
  name?: string;
  avatarUrl?: string;
}

export interface AuthResponse {
  token?: string;
  user?: User;
  needsConfirmation?: boolean;
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
    
    // Se não há sessão, mas o usuário foi criado, é porque precisa de confirmação de e-mail
    if (!data.session && data.user) {
      return {
        needsConfirmation: true
      };
    }

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

    if (error) {
      if (error.message.includes('Email not confirmed')) {
        const customError = new Error('E-mail não confirmado. Por favor, verifique sua caixa de entrada.');
        (customError as any).code = 'EMAIL_NOT_CONFIRMED';
        throw customError;
      }
      throw error;
    }
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

  async forgotPassword(email: string) {
    const response = await axios.post(`${BASE_URL}/auth/forgot-password`, { email });
    return response.data;
  },

  async resetPassword(password: string, token: string) {
    const response = await axios.post(`${BASE_URL}/auth/reset-password`, { newPassword: password, token });
    return response.data;
  },

  async setPassword(password: string, accessToken: string) {
    // 1. Atualiza no Supabase Auth (Obrigatório para o login por e-mail funcionar)
    const { error: authError } = await supabase.auth.updateUser({
      password: password
    });

    if (authError) throw authError;

    // 2. Notifica nosso backend para atualizar metadados na tabela public.User
    try {
      await axios.post(`${BASE_URL}/auth/set-password`, { password }, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
    } catch (e) {
      console.warn('Erro ao sincronizar senha com backend, mas senha foi alterada no Supabase:', e);
      // Não lançamos erro aqui pois a senha principal no Supabase já foi alterada com sucesso
    }
    
    return { success: true };
  },

  async resendConfirmationEmail(email: string) {
    const { error } = await supabase.auth.resend({
      type: 'signup',
      email,
    });
    if (error) throw error;
    return { success: true };
  },

  async updateAvatar(userId: string, imageUri: string) {
    console.log('[AuthService] updateAvatar - Iniciando para URI:', imageUri);
    
    // 1. Lê a imagem do disco usando FileSystem (mais robusto no Android)
    let arrayBuffer: ArrayBuffer;
    try {
      console.log('[AuthService] FileSystem status:', !!FileSystem.readAsStringAsync);
      const base64 = await FileSystem.readAsStringAsync(imageUri, {
        encoding: 'base64', // Usando string direta para evitar erro de undefined no enum
      });
      
      console.log('[AuthService] Base64 lido, convertendo para ArrayBuffer...');
      // Conversão manual de Base64 para ArrayBuffer
      const binaryString = atob(base64);
      const bytes = new Uint8Array(binaryString.length);
      for (let i = 0; i < binaryString.length; i++) {
        bytes[i] = binaryString.charCodeAt(i);
      }
      arrayBuffer = bytes.buffer;
      
      console.log('[AuthService] updateAvatar - Arquivo lido e convertido com sucesso!');
    } catch (readErr: any) {
      console.error('[AuthService] updateAvatar - Erro ao ler arquivo local via FileSystem:', readErr);
      throw new Error(`Não foi possível ler a imagem do celular: ${readErr.message}`);
    }
    
    const fileExt = imageUri.split('.').pop();
    const fileName = `${userId}-${Date.now()}.${fileExt}`;
    const filePath = fileName;

    // 2. Faz o upload para o novo bucket 'avatars'
    console.log('[AuthService] updateAvatar - Enviando para Supabase Storage...');
    const { error: uploadError } = await supabase.storage
      .from('avatars')
      .upload(filePath, arrayBuffer, {
        contentType: `image/${fileExt === 'jpg' ? 'jpeg' : fileExt}`,
        cacheControl: '3600',
        upsert: true
      });

    if (uploadError) {
      console.error('[AuthService] updateAvatar - Erro no upload Supabase:', uploadError);
      throw uploadError;
    }

    // 3. Pega a URL pública
    const { data: { publicUrl } } = supabase.storage
      .from('avatars')
      .getPublicUrl(filePath);

    console.log('[AuthService] updateAvatar - URL Pública gerada:', publicUrl);
    return publicUrl;
  },

  async updateProfile(accessToken: string, data: { name?: string; avatarUrl?: string }) {
    // 1. Atualiza no Supabase Auth (Metadados)
    const { error: sbError } = await supabase.auth.updateUser({
      data: {
        full_name: data.name,
        avatar_url: data.avatarUrl,
      }
    });

    if (sbError) throw sbError;

    // 2. Atualiza no nosso Backend (Tabela User)
    const response = await axios.put(`${BASE_URL}/auth/update-profile`, data, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    return response.data;
  },

  async getMeBackend(accessToken: string) {
    const response = await axios.get(`${BASE_URL}/auth/me`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    return response.data;
  },
};
