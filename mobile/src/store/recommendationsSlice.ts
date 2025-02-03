import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

interface Recommendation {
  id: string;
  name: string;
  description: string;
  // Add more fields as needed
}

interface RecommendationsState {
  items: Recommendation[];
  loading: boolean;
  error: string | null;
}

const initialState: RecommendationsState = {
  items: [],
  loading: false,
  error: null,
};

export const fetchRecommendations = createAsyncThunk(
  'recommendations/fetch',
  async ({ latitude, longitude, mood }: { latitude: number; longitude: number; mood: string }) => {
    try {
      // TODO: Replace with actual API call
      const response = await fetch(`http://localhost:8000/recommendations/food?lat=${latitude}&lon=${longitude}&mood=${mood}`);
      const data = await response.json();
      return data;
    } catch (error) {
      throw error;
    }
  }
);

const recommendationsSlice = createSlice({
  name: 'recommendations',
  initialState,
  reducers: {
    clearRecommendations: (state) => {
      state.items = [];
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchRecommendations.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchRecommendations.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(fetchRecommendations.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch recommendations';
      });
  },
});

export const { clearRecommendations } = recommendationsSlice.actions;
export default recommendationsSlice.reducer; 