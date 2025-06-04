import axios from "axios";


export interface CulturalLandmark {
    id?: number;
    name: string;
    description: string;
    city: string;
    latitude: number;
    longitude: number;
    imageUrl?: string;
}

const base_api_url = import.meta.env.VITE_API_URL;
const API_BASE = `${base_api_url}/cultural-landmarks`;

// get 
// delete /id
//post 
// {
//     "name": "string",
//     "city": "string",
//     "description": "string",
//     "imageUrl": "string",
//     "latitude": 0,
//     "longitude": 0
//   }

export const getAllCulturalLandmarks = async (): Promise<CulturalLandmark[]> => {
    const response = await axios.get<CulturalLandmark[]>(API_BASE);
    return response.data;
};

export const getCulturalLandmarkById = async (id: number): Promise<CulturalLandmark> => {
    const response = await axios.get<CulturalLandmark>(`${API_BASE}/${id}`);
    return response.data;
};

export const createCulturalLandmark = async (landmark: CulturalLandmark): Promise<CulturalLandmark> => {
    const response = await axios.post<CulturalLandmark>(API_BASE, landmark);
    return response.data;
  };



export const updateCulturalLandmark = async (
    id: number,
    updatedCulturalLandmark: CulturalLandmark,
  ): Promise<CulturalLandmark> => {
    const response = await axios.put<CulturalLandmark>(`${API_BASE}/${id}`, updatedCulturalLandmark);
    return response.data;
  };
  
  export const deleteCulturalLandmark = async (id: number): Promise<void> => {
    await axios.delete(`${API_BASE}/${id}`);
  };
  