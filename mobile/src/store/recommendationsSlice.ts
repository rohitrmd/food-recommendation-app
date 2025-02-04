import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { api, endpoints } from '../services/api';

interface Recommendation {
  id: string;
  name: string;
  description: string;
  // Add more fields as needed
}

interface RecommendationsState {
  items: Recommendation[] | null;
  loading: boolean;
  error: string | null;
}

const initialState: RecommendationsState = {
  items: null,
  loading: false,
  error: null,
};

export const fetchRecommendations = createAsyncThunk(
  'recommendations/fetch',
  async ({ latitude, longitude, mood }: { latitude: number; longitude: number; mood: string }) => {
    try {
      const response = await api.post(endpoints.recommendations, {
        latitude,
        longitude,
        mood: mood.toLowerCase(),
      });
      
      // Ensure we're returning an array
      const data = response.data?.recommendations || [];
      return data;
    } catch (error: any) {
      if (error.response) {
        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx
        throw new Error(error.response.data.message || 'Server error');
      } else if (error.request) {
        // The request was made but no response was received
        throw new Error('No response from server. Please check your connection.');
      } else {
        // Something happened in setting up the request that triggered an Error
        throw new Error('Failed to fetch recommendations');
      }
    }
  }
);

const recommendationsSlice = createSlice({
  name: 'recommendations',
  initialState,
  reducers: {
    clearRecommendations: (state) => {
      state.items = null;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchRecommendations.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.items = null;
      })
      .addCase(fetchRecommendations.fulfilled, (state, action) => {
        state.loading = false;
        state.items = Array.isArray(action.payload) ? action.payload : [];
      })
      .addCase(fetchRecommendations.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch recommendations';
        state.items = null;
      });
  },
});

export const { clearRecommendations } = recommendationsSlice.actions;
export default recommendationsSlice.reducer; 