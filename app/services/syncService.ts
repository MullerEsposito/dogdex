import axios from 'axios';
import { DogdexEntry } from '../hooks/useDogdexStorage';
import { BASE_URL } from './api';

export const syncService = {
  async push(token: string, entries: DogdexEntry[]) {
    // We send the entries to the backend. 
    // The backend handles saving/updating and linking to the user.
    const response = await axios.post(`${BASE_URL}/sync/push`, { entries }, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  },

  async pull(token: string): Promise<DogdexEntry[]> {
    const response = await axios.get(`${BASE_URL}/sync/pull`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    
    // Mapeia o localId do backend de volta para o id do frontend para bater com o banco local
    return (response.data.entries || []).map((e: any) => ({
      ...e,
      id: e.localId || e.id
    }));
  },
};
