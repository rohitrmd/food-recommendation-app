import pytest
from app.agents.food_recommendation_agent import food_recommendation_agent

@pytest.mark.asyncio
async def test_weather_analysis():
    """Test the weather analysis functionality"""
    result = await food_recommendation_agent.get_weather_analysis({
        "lat": 40.7128,
        "lon": -74.0060
    })
    assert "weather_data" in result
    assert "weather_analysis" in result
    
    # Verify weather data structure
    weather_data = result["weather_data"]
    assert "temperature" in weather_data
    assert "condition" in weather_data
    assert "feels_like" in weather_data

def test_time_analysis():
    """Test the time analysis functionality"""
    result = food_recommendation_agent.analyze_time_context({
        "current_time": "12:00"
    })
    assert "time_data" in result
    assert "time_analysis" in result
    
    # Verify time data
    time_data = result["time_data"]
    assert time_data["meal_type"] == "lunch"
    assert "time" in time_data

def test_generate_recommendations():
    """Test recommendation generation"""
    test_data = {
        "weather_data": {
            "temperature": 20,
            "condition": "Clear",
            "feels_like": 22
        },
        "weather_analysis": "Weather is mild and pleasant",
        "time_data": {
            "time": "12:00",
            "meal_type": "lunch"
        },
        "time_analysis": "Perfect time for a hearty lunch",
        "mood": "happy"
    }
    
    result = food_recommendation_agent.generate_final_recommendations(test_data)
    
    assert "recommendations" in result
    assert "context" in result
    assert "weather" in result["context"]
    assert "time" in result["context"]
    assert "mood" in result["context"]

@pytest.mark.asyncio
async def test_full_workflow():
    """Test the complete recommendation workflow"""
    result = await food_recommendation_agent.get_recommendations(
        lat=40.7128,
        lon=-74.0060,
        mood="happy"
    )
    
    assert result is not None
    assert "recommendations" in result
    assert "context" in result
    assert "weather" in result["context"]
    assert "time" in result["context"]
    assert "mood" in result["context"] 