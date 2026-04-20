import axios from 'axios';
import { DogdexEntry } from '../hooks/useDogdexStorage';

const API_URL = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:3000';

export const syncService = {
  async push(token: string, entries: DogdexEntry[]) {
    // We send the entries to the backend. 
    // The backend handles saving/updating and linking to the user.
    const response = await axios.post(`${API_URL}/sync/push`, { entries }, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  },

  async pull(token: string): Promise<DogdexEntry[]> {
    const response = await axios.get(`${API_URL}/sync/pull`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  },
};
