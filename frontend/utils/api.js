import { API_ENDPOINTS } from "@/lib/api_endpoints";

export const fetchFromAPI = async (endpoint, options = {}) => {
  try {
    const response = await fetch(`${API_ENDPOINTS.HOSTNAME}${endpoint}`, options);
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('API Error:', error);
    throw error;
  }
}; 