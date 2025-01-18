import pytest
from app.recommendation.food_recommendation_service import food_recommendation_service

@pytest.mark.asyncio
async def test_get_recommendations():
    # Test data
    lat = 40.7128  # New York coordinates for testing
    lon = -74.0060
    mood = "happy"
    
    result = await food_recommendation_service.get_recommendations(
        lat=lat,
        lon=lon,
        mood=mood
    )
    
    # Print the full response for debugging
    print("\n=== LLM Response ===")
    print(f"Full result: {result}")
    print("\n=== Context ===")
    print(f"Context data: {result.get('context', 'Not found')}")
    print("\n=== Recommendations ===")
    print(f"Recommendations: {result.get('recommendations', 'Not found')}\n")
    
    # Check response structure
    assert "recommendations" in result
    assert "context" in result
    
    # Check context data
    context = result["context"]
    assert "weather" in context
    assert "time" in context
    assert "meal_type" in context
    assert "mood" in context
    
    # Verify weather data
    weather = context["weather"]
    assert "temperature" in weather
    assert "condition" in weather
    
    # Check recommendations format
    recommendations = result["recommendations"]
    assert isinstance(recommendations, str)
    assert "1." in recommendations  # Should contain numbered recommendations

@pytest.mark.parametrize("hour,expected_meal", [
    ("07:00", "breakfast"),
    ("12:00", "lunch"),
    ("18:00", "dinner"),
    ("23:00", "late night snack")
])
def test_meal_type_determination(hour, expected_meal):
    meal_type = food_recommendation_service._get_meal_type(hour)
    assert meal_type == expected_meal 