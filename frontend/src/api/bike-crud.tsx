import axios from 'axios';

export interface Bike {
  id?: number;
  city: string;
  latitude: number;
  longitude: number;
  chargingSpotId: number;
  autonomy: number;
}

const base_api_url = import.meta.env.VITE_API_URL;
const API_BASE = `${base_api_url}/bikes`;

export const getAllBikes = async (): Promise<Bike[]> => {
  const response = await axios.get<Bike[]>(API_BASE);
  return response.data;
};

export const getBikeById = async (id: number): Promise<Bike> => {
  const response = await axios.get<Bike>(`${API_BASE}/${id}`);
  return response.data;
};

export const searchBikesByCity = async (city: string): Promise<Bike[]> => {
  const response = await axios.get<Bike[]>(`${API_BASE}/search`, {
    params: { city },
  });
  return response.data;
};

export const getAvailableBikesNearLocation = async (
  latitude: number,
  longitude: number
): Promise<Bike[]> => {
  const response = await axios.get<Bike[]>(`${API_BASE}/available`, {
    params: { latitude, longitude },
  });
  return response.data;
};

export const createBike = async (bike: Bike): Promise<Bike> => {
  const response = await axios.post<Bike>(API_BASE, bike);
  return response.data;
};

export const updateBike = async (id: number, updatedBike: Bike): Promise<Bike> => {
  const response = await axios.put<Bike>(`${API_BASE}/${id}`, updatedBike);
  return response.data;
};

export const deleteBike = async (id: number): Promise<void> => {
  await axios.delete(`${API_BASE}/${id}`);
};