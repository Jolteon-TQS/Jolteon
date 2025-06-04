import axios from "axios";
import { LandMark } from "./landmark-crud";
import { Station } from "./station-crud";
import { Bike } from "./bike-crud";


export interface User {
    id: number;
    username: string;
}

export interface BikeRentingDTO {
  bike: Bike;
  user: User;
  startSpot: Station | null;
  endSpot: Station | null;
  culturalLandmarks: LandMark[] | null;
  time: string; // ISO format date string
  endTime: string | null; // ISO format date string
}

const base_api_url = import.meta.env.VITE_API_URL;
const API_BASE = `${base_api_url}/rentings`;

export const createBikeRenting = async (rentingData: BikeRentingDTO): Promise<BikeRentingDTO> => {
    console.log("Creating bike renting with data:", rentingData);
  const response = await axios.post<BikeRentingDTO>(API_BASE, rentingData);
  return response.data;
};