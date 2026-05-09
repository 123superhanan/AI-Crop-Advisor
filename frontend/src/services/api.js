// src/services/api.js
import axios from 'axios';

const NODE_API_URL = 'http://localhost:5000/api';
const PYTHON_API_URL = 'http://localhost:5001';

export const predictionService = {
  // Analyze image using Python model
  analyzeImage: async formData => {
    try {
      const response = await axios.post(`${PYTHON_API_URL}/predict`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    } catch (error) {
      console.error('Error analyzing image:', error);
      throw error;
    }
  },

  // Save prediction to MongoDB
  savePrediction: async predictionData => {
    try {
      const response = await axios.post(`${NODE_API_URL}/predictions`, predictionData);
      return response.data;
    } catch (error) {
      console.error('Error saving prediction:', error);
      throw error;
    }
  },

  // Get all predictions from MongoDB
  getPredictions: async () => {
    try {
      const response = await axios.get(`${NODE_API_URL}/predictions`);
      return response.data;
    } catch (error) {
      console.error('Error fetching predictions:', error);
      throw error;
    }
  },

  // Complete flow: analyze and save
  analyzeAndSave: async (imageFile, formData) => {
    try {
      // Step 1: Analyze with Python model
      const analyzeFormData = new FormData();
      analyzeFormData.append('image', imageFile);
      analyzeFormData.append('cropType', formData.cropType);
      analyzeFormData.append('organicFarming', formData.organicFarming);
      analyzeFormData.append('weather', formData.weather);
      analyzeFormData.append('temperature', formData.temperature);

      const analysisResult = await axios.post(`${PYTHON_API_URL}/predict`, analyzeFormData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      // Step 2: Save to MongoDB
      const saveData = {
        userId: formData.userId || 'anonymous',
        crop: analysisResult.data.prediction.crop,
        disease: analysisResult.data.prediction.disease,
        confidence: analysisResult.data.prediction.confidence,
        severity: analysisResult.data.severity,
        recommendations: analysisResult.data.recommendations,
      };

      const savedResult = await axios.post(`${NODE_API_URL}/predictions`, saveData);

      return {
        analysis: analysisResult.data,
        saved: savedResult.data,
      };
    } catch (error) {
      console.error('Error in analyze and save:', error);
      throw error;
    }
  },
};
