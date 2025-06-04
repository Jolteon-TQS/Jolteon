import axios from "axios";

export interface LandMark {
  id?: number;
  name: string;
  city: string;
  description: string;
  imageUrl: string;
  latitude: number;
  longitude: number;
}

const base_api_url = import.meta.env.VITE_API_URL;
const API_BASE = `${base_api_url}/bikes`;

export const getAllLandmarks = async (): Promise<LandMark[]> => {
  const response = await axios.get<LandMark[]>(`${API_BASE}/landmarks`);
  return response.data;
};

export const getLandmarksByCity = async (city: string): Promise<LandMark[]> => {
    // const response = await axios.get<LandMark[]>(`${API_BASE}/landmarks/search`, {
    //     params: { city },
    // });

    console.log(city);



    // return response.data;

    // Make sample data

    return [
        {
            id: 1,
            name: "Eiffel Tower",
            city: "Paris",
            description: "An iconic symbol of Paris.",
            imageUrl: "https://example.com/eiffel-tower.jpg",
            latitude: 48.8584,
            longitude: 2.2945,
        }
    ];

}   

