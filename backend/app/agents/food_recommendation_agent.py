from typing import Dict, Any
from langchain.prompts import ChatPromptTemplate
from langchain_openai import ChatOpenAI
from langgraph.graph import Graph
from datetime import datetime
from ..weather.weather_service import weather_service

class FoodRecommendationAgent:
    def __init__(self):
        self.llm = ChatOpenAI(
            model="gpt-4-turbo-preview",
            temperature=0.7
        )

    async def get_weather_analysis(self, data: Dict[str, Any]) -> Dict[str, Any]:
        """Get and analyze weather data"""
        weather_data = await weather_service.get_current_weather(
            lat=data["lat"],
            lon=data["lon"]
        )
        
        prompt = ChatPromptTemplate.from_messages([
            ("system", """Analyze how these weather conditions might affect food choices:
            Temperature: {temperature}°C
            Weather: {condition}
            Feels like: {feels_like}°C
            
            Consider:
            - Hot vs cold foods
            - Indoor vs outdoor dining
            - Comfort food factors""")
        ])
        
        messages = prompt.format_messages(
            temperature=weather_data["temperature"],
            condition=weather_data["condition"],
            feels_like=weather_data["feels_like"]
        )
        analysis = self.llm.invoke(messages)
        
        return {
            "weather_data": weather_data,
            "weather_analysis": analysis.content,
            **data  # Pass through other data
        }

    def analyze_time_context(self, data: Dict[str, Any]) -> Dict[str, Any]:
        """Analyze time-based factors"""
        current_time = data["current_time"]
        hour = int(current_time.split(":")[0])
        if 5 <= hour < 11:
            meal_type = "breakfast"
        elif 11 <= hour < 15:
            meal_type = "lunch"
        elif 15 <= hour < 21:
            meal_type = "dinner"
        else:
            meal_type = "late night snack"
            
        prompt = ChatPromptTemplate.from_messages([
            ("system", """For {meal_type} at {time}, analyze:
            - Appropriate portion sizes
            - Traditional meal patterns
            - Time-specific cravings""")
        ])
        
        messages = prompt.format_messages(
            meal_type=meal_type,
            time=current_time
        )
        analysis = self.llm.invoke(messages)
        
        return {
            "time_data": {"time": current_time, "meal_type": meal_type},
            "time_analysis": analysis.content,
            **data  # Pass through other data
        }

    def generate_final_recommendations(self, data: Dict[str, Any]) -> Dict[str, Any]:
        """Generate final recommendations based on all analyses"""
        prompt = ChatPromptTemplate.from_messages([
            ("system", """Based on the following analyses:
            
            Weather Context:
            {weather_analysis}
            
            Time Context:
            {time_analysis}
            
            User's Mood: {mood}
            
            Generate 3 specific food recommendations with explanations.""")
        ])
        
        messages = prompt.format_messages(
            weather_analysis=data["weather_analysis"],
            time_analysis=data["time_analysis"],
            mood=data["mood"]
        )
        response = self.llm.invoke(messages)
        
        return {
            "recommendations": response.content,
            "context": {
                "weather": data["weather_data"],
                "time": data["time_data"],
                "mood": data["mood"]
            }
        }

    def create_workflow(self) -> Graph:
        """Create LangGraph workflow for recommendation process"""
        workflow = Graph()
        
        # Define nodes
        workflow.add_node("get_weather_analysis", self.get_weather_analysis)
        workflow.add_node("analyze_time", self.analyze_time_context)
        workflow.add_node("generate_recommendations", self.generate_final_recommendations)
        
        # Define edges and flow
        workflow.set_entry_point("get_weather_analysis")
        workflow.add_edge("get_weather_analysis", "analyze_time")
        workflow.add_edge("analyze_time", "generate_recommendations")
        workflow.set_finish_point("generate_recommendations")
        
        return workflow

    async def get_recommendations(
        self,
        lat: float,
        lon: float,
        mood: str
    ) -> Dict[str, Any]:
        """Execute the recommendation workflow"""
        # Create and compile workflow
        workflow = self.create_workflow()
        chain = workflow.compile()
        
        # Get current time
        current_time = datetime.now().strftime("%H:%M")
        
        # Execute graph with initial data
        result = await chain.ainvoke({
            "lat": lat,
            "lon": lon,
            "current_time": current_time,
            "mood": mood
        })
        
        return result

# Create singleton instance
food_recommendation_agent = FoodRecommendationAgent() 