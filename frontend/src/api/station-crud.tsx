import axios from "axios";

import { Bike } from "./bike-crud";

export interface Station {
  id: number;
  city: string;
  latitude: number;
  longitude: number;
  capacity: number;
  bikes: Bike[];
}

const base_api_url = import.meta.env.VITE_API_URL;
const API_BASE = `${base_api_url}/stations`;

export const getAllStations = async (): Promise<Station[]> => {
  const response = await axios.get<Station[]>(API_BASE);
  return response.data;
};

export const getStationById = async (id: number): Promise<Station> => {
  const response = await axios.get<Station>(`${API_BASE}/${id}`);
  return response.data;
};

export const createStation = async (
  station: Omit<Station, "id">,
): Promise<Station> => {
  const response = await axios.post<Station>(API_BASE, station);
  return response.data;
};

export const updateStation = async (
  id: number,
  updatedStation: Omit<Station, "id">,
): Promise<Station> => {
  const response = await axios.put<Station>(
    `${API_BASE}/${id}`,
    updatedStation,
  );
  return response.data;
};

export const deleteStation = async (id: number): Promise<void> => {
  await axios.delete(`${API_BASE}/${id}`);
};

export const searchStationsByCity = async (
  city: string,
): Promise<Station[]> => {
  try {
    const response = await axios.get<Station[]>(`${API_BASE}/search`, {
      params: { city },
    });
    return response.data;
  } catch (error) {
    console.error("Error searching stations:", error);
    throw error;
  }
};

export const getAvailableBikesAtStation = async (
  id: number,
): Promise<Bike[]> => {
  const response = await axios.get<Bike[]>(`${API_BASE}/${id}/available`);
  return response.data;
};
