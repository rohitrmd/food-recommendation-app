import pytest
import asyncio
from app.weather.weather_service import weather_service

@pytest.mark.asyncio
async def test_get_current_weather():
    # Test coordinates (New York City)
    lat = 40.7128
    lon = -74.0060
    
    weather_data = await weather_service.get_current_weather(lat, lon)
    
    # Check if all required fields are present
    assert "temperature" in weather_data
    assert "condition" in weather_data
    assert "description" in weather_data
    assert "humidity" in weather_data
    assert "wind_speed" in weather_data
    assert "feels_like" in weather_data
    
    # Check data types
    assert isinstance(weather_data["temperature"], float)
    assert isinstance(weather_data["condition"], str)
    assert isinstance(weather_data["description"], str) 