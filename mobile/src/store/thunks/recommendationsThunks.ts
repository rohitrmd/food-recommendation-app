export const fetchRecommendations = (params) => async (dispatch) => {
  try {
    dispatch(fetchRecommendationsStart());
    const response = await api.getRecommendations(params);
    dispatch(fetchRecommendationsSuccess(response.data));
  } catch (error) {
    dispatch(fetchRecommendationsFailure(error.message));
  }
}; 