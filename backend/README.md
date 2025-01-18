# Food Recommendation Backend

The backend service for the Food Recommendation App, built with Python, FastAPI, and OpenAI's GPT-4.

## Directory Structure 

### Test Structure

1. **Food Recommendation Tests** (`test_food_recommendation_service.py`):
   - Tests recommendation generation
   - Verifies meal type determination
   - Checks response structure and content
   ```python
   # Example test
   @pytest.mark.asyncio
   async def test_get_recommendations():
       result = await food_recommendation_service.get_recommendations(
           lat=40.7128, lon=-74.0060, mood="happy"
       )
       assert "recommendations" in result
   ```

2. **Weather Service Tests** (`test_weather_service.py`):
   - Tests weather data fetching
   - Verifies temperature conversion
   - Checks API response handling

### Test Configuration
- `pytest.ini` is configured to set the Python path
- Tests use `pytest-asyncio` for async function testing
- Environment variables are loaded from `.env`

### Common Test Issues
1. **API Key Errors**:
   - Ensure `.env` file exists and has valid API keys
   - Check API key permissions and quotas

2. **Import Errors**:
   - Verify you're running tests from backend directory
   - Check `PYTHONPATH` setting in `.env`

3. **Failed Assertions**:
   - Check API response formats
   - Verify network connectivity
   - Look for rate limiting issues

## API Services

### Weather Service
`weather_service.py` handles:
- Real-time weather data fetching
- Temperature and condition parsing
- Metric unit conversion

### Food Recommendation Service
`food_recommendation_service.py` provides:
- Context-aware food suggestions
- Time-based meal type determination
- Weather and mood integration

## Development

### Adding New Features
1. Add tests in `tests/`
2. Implement feature in `app/`
3. Run tests to verify

### Code Style
- Follow PEP 8
- Use type hints
- Add docstrings for functions

## Troubleshooting

### Common Issues
1. Import errors: Ensure PYTHONPATH includes the backend directory
2. API key errors: Verify .env file configuration
3. Test failures: Check OpenWeatherMap API quota and connectivity 