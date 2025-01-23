from typing import Dict, Any
from app.weather.weather_service import weather_service
import os
from dotenv import load_dotenv
from langchain_openai import ChatOpenAI
from langchain.prompts import ChatPromptTemplate
from datetime import datetime
from ..agents.food_recommendation_agent import food_recommendation_agent

load_dotenv()

class FoodRecommendationService:
    def __init__(self):
        self.llm = ChatOpenAI(
            model=os.getenv("MODEL_NAME", "gpt-4-turbo-preview"),
            temperature=0.7
        )
        
        self.prompt = ChatPromptTemplate.from_messages([
            ("system", """You are a food recommendation expert. Provide personalized food suggestions based on:

            Weather Impact:
            - Hot weather (>25°C): Suggest cooling, refreshing foods
            - Cold weather (<15°C): Suggest warming, comforting foods
            - Rainy weather: Suggest cozy, warming foods
            
            Mood Impact:
            - Happy: Celebratory foods, social sharing dishes, colorful foods
            - Bored: Novel cuisines, exciting flavor combinations, interactive foods
            
            Time of Day:
            - Morning (5-11): Breakfast foods
            - Afternoon (11-15): Lunch options
            - Evening (15-21): Dinner choices
            - Late Night (21-5): Light snacks
            
            Provide 3 specific recommendations with explanations why they suit the current context.
            Format as:
            1. [Food Name]: [Explanation considering weather, mood, and time]
            2. [Food Name]: [Explanation considering weather, mood, and time]
            3. [Food Name]: [Explanation considering weather, mood, and time]"""),
            ("human", """Current conditions:
            Temperature: {temperature}°C
            Weather: {weather_condition}
            Time: {time}
            Mood: {mood}
            
            Please suggest suitable foods.""")
        ])

    def _get_meal_type(self, time: str) -> str:
        """Determine meal type based on time"""
        hour = int(time.split(":")[0])
        if 5 <= hour < 11:
            return "breakfast"
        elif 11 <= hour < 15:
            return "lunch"
        elif 15 <= hour < 21:
            return "dinner"
        else:
            return "late night snack"

    async def get_recommendations(
        self,
        lat: float,
        lon: float,
        mood: str
    ) -> Dict[str, Any]:
        """Get food recommendations using the AI agent"""
        return await food_recommendation_agent.get_recommendations(lat, lon, mood)

# Create a singleton instance
food_recommendation_service = FoodRecommendationService() 