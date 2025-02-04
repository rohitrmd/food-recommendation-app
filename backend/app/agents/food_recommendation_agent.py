from typing import Dict, Any
from langchain.prompts import ChatPromptTemplate
from langchain_openai import ChatOpenAI
from langgraph.graph import Graph
from datetime import datetime
from ..weather.weather_service import weather_service
import logging
import json

logger = logging.getLogger(__name__)

class FoodRecommendationAgent:
    def __init__(self):
        self.llm = ChatOpenAI(
            model="gpt-4-turbo-preview",
            temperature=0.7
        )
        logger.info("FoodRecommendationAgent initialized")

    async def get_weather_analysis(self, data: Dict[str, Any]) -> Dict[str, Any]:
        """Get and analyze weather data"""
        logger.info(f"Getting weather analysis for data: {data}")
        weather_data = await weather_service.get_current_weather(
            lat=data["lat"],
            lon=data["lon"]
        )
        logger.info(f"Received weather data: {weather_data}")
        
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
        logger.info(f"Weather analysis result: {analysis.content}")
        
        return {
            "weather_data": weather_data,
            "weather_analysis": analysis.content,
            **data  # Pass through other data
        }

    def analyze_time_context(self, data: Dict[str, Any]) -> Dict[str, Any]:
        """Analyze time-based factors"""
        logger.info(f"Analyzing time context for data: {data}")
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
        logger.info(f"Time analysis result: {analysis.content}")
        
        return {
            "time_data": {"time": current_time, "meal_type": meal_type},
            "time_analysis": analysis.content,
            **data  # Pass through other data
        }

    def generate_final_recommendations(self, data: Dict[str, Any]) -> Dict[str, Any]:
        """Generate final recommendations based on all analyses"""
        logger.info(f"Generating final recommendations with data: {data}")
        prompt = ChatPromptTemplate.from_messages([
            ("system", r"""Based on the following analyses:

Weather Context:
{weather_analysis}

Time Context:
{time_analysis}

User's Mood: {mood}

Generate 3 specific food recommendations. Return ONLY a valid JSON object with exactly this structure:

{{
    "recommendations": [
        {{
            "id": "1",
            "name": "Restaurant or Dish Name",
            "description": "Why this is perfect based on weather, time, and mood"
        }},
        {{
            "id": "2",
            "name": "Second Restaurant or Dish Name",
            "description": "Why this is perfect based on weather, time, and mood"
        }},
        {{
            "id": "3",
            "name": "Third Restaurant or Dish Name",
            "description": "Why this is perfect based on weather, time, and mood"
        }}
    ]
}}

IMPORTANT: 
1. Return ONLY the raw JSON object
2. Do NOT include any markdown formatting, code blocks, or additional text
3. Ensure the JSON is properly formatted and valid""")
        ])
        
        messages = prompt.format_messages(
            weather_analysis=data.get("weather_analysis", ""),
            time_analysis=data.get("time_analysis", ""),
            mood=data.get("mood", "")
        )
        response = self.llm.invoke(messages)
        
        try:
            # Clean the response content
            content = response.content.strip()
            # Remove markdown code blocks if present
            if content.startswith("```"):
                content = "\n".join(content.split("\n")[1:-1])
            content = content.strip()
            
            logger.info(f"Cleaned content before parsing: {content}")
            
            # Parse the cleaned content as JSON
            recommendations = json.loads(content)
            logger.info(f"Successfully parsed recommendations: {recommendations}")
            return recommendations
            
        except json.JSONDecodeError as e:
            logger.error(f"JSON parsing error: {e}")
            logger.error(f"Raw response: {response.content}")
            logger.error(f"Cleaned content that failed to parse: {content}")
            return {
                "recommendations": [
                    {
                        "id": "1",
                        "name": "Error in recommendation",
                        "description": "Failed to generate structured recommendations"
                    }
                ]
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
        logger.info(f"Starting recommendation workflow for lat:{lat}, lon:{lon}, mood:{mood}")
        
        workflow = self.create_workflow()
        chain = workflow.compile()
        
        current_time = datetime.now().strftime("%H:%M")
        logger.info(f"Current time: {current_time}")
        
        try:
            input_data = {
                "lat": lat,
                "lon": lon,
                "current_time": current_time,
                "mood": mood
            }
            logger.info(f"Invoking workflow with input: {input_data}")
            
            result = await chain.ainvoke(input_data)
            logger.info(f"Raw workflow result: {result}")
            
            if not result:
                logger.error("Workflow returned empty result")
            elif "recommendations" not in result:
                logger.error(f"Missing recommendations in result. Keys present: {result.keys()}")
            else:
                logger.info(f"Successfully generated recommendations: {result['recommendations'][:200]}...")
                
            return result
        except Exception as e:
            logger.error(f"Error in workflow execution: {str(e)}", exc_info=True)
            raise

# Create singleton instance
food_recommendation_agent = FoodRecommendationAgent() 