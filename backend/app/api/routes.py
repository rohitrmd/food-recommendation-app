from fastapi import APIRouter, HTTPException
from ..agents.food_recommendation_agent import food_recommendation_agent
from pydantic import BaseModel
import logging
import time

# Set up logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

router = APIRouter()

class RecommendationRequest(BaseModel):
    latitude: float
    longitude: float
    mood: str
    dietary_restrictions: list[str] = []

class Recommendation(BaseModel):
    id: str
    name: str
    description: str

class RecommendationsResponse(BaseModel):
    recommendations: list[Recommendation]

@router.post("/recommendations", response_model=RecommendationsResponse)
async def get_recommendations(request: RecommendationRequest):
    start_time = time.time()
    request_id = str(time.time())
    logger.info(f"[{request_id}] Received recommendation request - lat: {request.latitude}, lon: {request.longitude}, mood: {request.mood}")
    
    try:
        logger.info(f"[{request_id}] Starting recommendation generation...")
        raw_recommendations = await food_recommendation_agent.get_recommendations(
            lat=request.latitude,
            lon=request.longitude,
            mood=request.mood
        )
        duration = time.time() - start_time
        
        logger.info(f"[{request_id}] Raw recommendations: {raw_recommendations}")
        
        # Validate and transform the response
        if not isinstance(raw_recommendations, dict) or "recommendations" not in raw_recommendations:
            logger.error(f"[{request_id}] Invalid response format from agent: {raw_recommendations}")
            raise HTTPException(status_code=500, detail="Invalid recommendations format")
        
        # Create a validated RecommendationsResponse
        response = RecommendationsResponse(
            recommendations=[
                Recommendation(
                    id=str(rec.get("id", i)),
                    name=rec.get("name", ""),
                    description=rec.get("description", "")
                )
                for i, rec in enumerate(raw_recommendations["recommendations"])
            ]
        )
        
        logger.info(f"[{request_id}] Request completed in {duration:.2f} seconds")
        logger.info(f"[{request_id}] Returning validated response: {response}")
        
        return response
    except Exception as e:
        logger.error(f"[{request_id}] Error processing request: {str(e)}", exc_info=True)
        raise HTTPException(status_code=500, detail=str(e)) 