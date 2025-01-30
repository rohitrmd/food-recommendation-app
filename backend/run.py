from fastapi import FastAPI
from app.api.routes import router
import uvicorn

app = FastAPI(title="Food Recommendation API")

# Add routes
app.include_router(router, prefix="/api")

if __name__ == "__main__":
    uvicorn.run("run:app", host="0.0.0.0", port=8000, reload=True) 