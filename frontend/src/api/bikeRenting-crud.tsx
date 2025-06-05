import axios from "axios";
import { CulturalLandmark } from "./landmark-crud";
import { Station } from "./station-crud";
import { Bike } from "./bike-crud";

export interface User {
  id: number;
  username: string;
}

export interface BikeRentingDTO {
  id?: number;
  bike: Bike;
  user: User;
  startSpot: Station | null;
  endSpot: Station | null;
  culturalLandmarks: CulturalLandmark[] | null;
  time: string; // ISO format date string
  endTime: string | null; // ISO format date string
}

const base_api_url = import.meta.env.VITE_API_URL;
const API_BASE = `${base_api_url}/rentings`;

export const createBikeRenting = async (
  rentingData: BikeRentingDTO,
): Promise<BikeRentingDTO> => {
  console.log("Creating bike renting with data:", rentingData);
  const response = await axios.post<BikeRentingDTO>(API_BASE, rentingData);
  return response.data;
};

export const getBikeRentingById = async (
  id: number,
): Promise<BikeRentingDTO | null> => {
  try {
    const response = await axios.get<BikeRentingDTO>(
      `${API_BASE}/active/${id}`,
    );
    return response.data;
  } catch (error: unknown) {
    if (
      typeof error === "object" &&
      error !== null &&
      "response" in error &&
      typeof (error as { response?: { status?: number } }).response === "object" &&
      (error as { response?: { status?: number } }).response !== null &&
      (error as { response?: { status?: number } }).response?.status === 404
    ) {
      return null; // No active rental
    }
    throw error; // Re-throw other errors
  }
};

export const endBikeRenting = async (
  id: number,
  endSpotId: number,
): Promise<BikeRentingDTO> => {
  const response = await axios.put<BikeRentingDTO>(
    `${API_BASE}/${id}/end?endSpotId=${endSpotId}`,
  );
  return response.data;
};
