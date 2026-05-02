import axios from 'axios';
import * as FileSystem from 'expo-file-system/legacy';
import { supabase } from '../lib/supabase';
import { BASE_URL } from './api';
import { AdoptionPoint, AdoptionDog } from '@dogdex/shared';

export const adoptionService = {
  async listPoints(): Promise<AdoptionPoint[]> {
    const response = await axios.get(`${BASE_URL}/adoption/points`);
    return response.data.data;
  },

  async createPoint(token: string, data: { name: string; address?: string; description: string; latitude: number; longitude: number; contactPhone?: string }): Promise<AdoptionPoint> {
    const response = await axios.post(`${BASE_URL}/adoption/points`, data, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return response.data.data;
  },

  async updatePoint(token: string, id: string, data: { name: string; address?: string; description: string; latitude: number; longitude: number; contactPhone?: string }): Promise<AdoptionPoint> {
    const response = await axios.put(`${BASE_URL}/adoption/points/${id}`, data, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return response.data.data;
  },

  async addDog(token: string, pointId: string, dogData: any, imageUri: string): Promise<AdoptionDog> {
    // 1. Upload image to Supabase (using dog-photos bucket for now)
    const publicUrl = await this.uploadImage(imageUri);

    // 2. Save to backend
    const response = await axios.post(`${BASE_URL}/adoption/points/${pointId}/dogs`, {
      ...dogData,
      imageUri: publicUrl
    }, {
      headers: { Authorization: `Bearer ${token}` }
    });
    
    return response.data.data;
  },

  async uploadImage(imageUri: string): Promise<string> {
    const base64 = await FileSystem.readAsStringAsync(imageUri, {
      encoding: 'base64',
    });
    
    const binaryString = atob(base64);
    const bytes = new Uint8Array(binaryString.length);
    for (let i = 0; i < binaryString.length; i++) {
      bytes[i] = binaryString.charCodeAt(i);
    }
    const arrayBuffer = bytes.buffer;
    
    const fileExt = imageUri.split('.').pop();
    const fileName = `adoption/dog-${Date.now()}.${fileExt}`;

    const { error } = await supabase.storage
      .from('dog-photos')
      .upload(fileName, arrayBuffer, {
        contentType: `image/${fileExt === 'jpg' ? 'jpeg' : fileExt}`,
        upsert: true
      });

    if (error) throw error;

    const { data: { publicUrl } } = supabase.storage
      .from('dog-photos')
      .getPublicUrl(fileName);

    return publicUrl;
  },

  async updateDogStatus(token: string, dogId: string, status: 'available' | 'adopted'): Promise<AdoptionDog> {
    const response = await axios.patch(`${BASE_URL}/adoption/dogs/${dogId}/status`, { status }, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return response.data.data;
  },

  async deleteDog(token: string, dogId: string): Promise<void> {
    await axios.delete(`${BASE_URL}/adoption/dogs/${dogId}`, {
      headers: { Authorization: `Bearer ${token}` }
    });
  }
};
