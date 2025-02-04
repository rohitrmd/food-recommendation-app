import { createSlice } from '@reduxjs/toolkit';

const recommendationsSlice = createSlice({
  name: 'recommendations',
  initialState: {
    items: [],
    loading: false,
    error: null,
  },
  reducers: {
    fetchRecommendationsStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    fetchRecommendationsSuccess: (state, action) => {
      state.items = action.payload;
      state.loading = false;
      state.error = null;
    },
    fetchRecommendationsFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
  },
});

export const {
  fetchRecommendationsStart,
  fetchRecommendationsSuccess,
  fetchRecommendationsFailure,
} = recommendationsSlice.actions;

export default recommendationsSlice.reducer; 