import axios from "axios";

export interface Review {
  id?: number;
  stars: number;
  description: string;
  user: number;
  culturalLandmark: number;
}

const base_api_url = import.meta.env.VITE_API_URL;
const API_BASE = `${base_api_url}/reviews`;

export const createReview = async (review: Review): Promise<Review> => {
  const response = await axios.post<Review>(API_BASE, review);
  return response.data;
};
