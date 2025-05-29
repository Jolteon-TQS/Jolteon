import axios from 'axios';

const API_BASE_URL = 'http://localhost:8080/api/bikes';

export async function getBikeById(id = '1') { // getting bike 1 for testing purposes
  try {
    const response = await axios.get(`${API_BASE_URL}/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Failed to fetch bike with ID ${id}:`, error);
    throw error;
  }
}
