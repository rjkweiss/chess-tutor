import os

from dotenv import load_dotenv
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

load_dotenv()

app = FastAPI(
    title="Chess Tutor API",
    description="AI powered chess learning platform",
    version="1.0.0"
)

origins = os.getenv("CORS_ORIGINS", "http://localhost:5173").split(",")

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/")
async def root():
    return {"message": "Chess Tutor API is running!"}


@app.get("/api/v1/health")
async def health_check():
    return {
        "status": "healthy",
        "environment": os.getenv("ENV", "unknown")
    }
