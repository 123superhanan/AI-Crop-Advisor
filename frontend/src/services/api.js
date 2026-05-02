import axios from 'axios';
const API_URL = 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const predictionService = {
  // Get all predictions
  getPredictions: async () => {
    const response = await api.get('/predictions');
    return response.data;
  },

  // Create new prediction
  createPrediction: async data => {
    const response = await api.post('/predictions', data);
    return response.data;
  },
};

export default api;