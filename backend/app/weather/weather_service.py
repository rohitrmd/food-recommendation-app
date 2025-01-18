import aiohttp
import os
from dotenv import load_dotenv
from typing import Dict, Any

load_dotenv()

class WeatherService:
    def __init__(self):
        self.api_key = os.getenv("OPENWEATHERMAP_API_KEY")
        if not self.api_key:
            raise ValueError("OpenWeatherMap API key not found in environment variables")
        self.base_url = "http://api.openweathermap.org/data/2.5/weather"

    async def get_current_weather(self, lat: float, lon: float) -> Dict[str, Any]:
        """
        Get current weather data for given coordinates
        
        Args:
            lat (float): Latitude
            lon (float): Longitude
            
        Returns:
            Dict containing weather information
        """
        try:
            async with aiohttp.ClientSession() as session:
                params = {
                    "lat": lat,
                    "lon": lon,
                    "appid": self.api_key,
                    "units": "metric"  # For Celsius
                }
                
                async with session.get(self.base_url, params=params) as response:
                    if response.status != 200:
                        error_data = await response.json()
                        raise Exception(f"Weather API error: {error_data.get('message', 'Unknown error')}")
                    
                    data = await response.json()
                    
                    return {
                        "temperature": float(data["main"]["temp"]),
                        "condition": data["weather"][0]["main"],
                        "description": data["weather"][0]["description"],
                        "humidity": data["main"]["humidity"],
                        "wind_speed": data["wind"]["speed"],
                        "feels_like": float(data["main"]["feels_like"])
                    }
                    
        except Exception as e:
            raise Exception(f"Failed to fetch weather data: {str(e)}")

# Create a singleton instance
weather_service = WeatherService() 