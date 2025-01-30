from fastapi import APIRouter, HTTPException
from ..agents.food_recommendation_agent import food_recommendation_agent
from pydantic import BaseModel

router = APIRouter()

class RecommendationRequest(BaseModel):
    latitude: float
    longitude: float
    mood: str
    dietary_restrictions: list[str] = []

@router.post("/recommendations")
async def get_recommendations(request: RecommendationRequest):
    try:
        recommendations = await food_recommendation_agent.get_recommendations(
            lat=request.latitude,
            lon=request.longitude,
            mood=request.mood
        )
        return recommendations
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e)) 