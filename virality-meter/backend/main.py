"""
X Algorithm Virality Meter - Backend API

A FastAPI service that analyzes content against X's recommendation algorithm
and provides virality predictions with humorous tier classifications.
"""

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routers import analyze_router

app = FastAPI(
    title="X Algorithm Virality Meter",
    description="Analyze your content's viral potential using X's actual algorithm signals",
    version="1.0.0",
)

# CORS middleware for frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, restrict to your domain
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(analyze_router)


@app.get("/")
async def root():
    return {
        "message": "X Algorithm Virality Meter API",
        "version": "1.0.0",
        "endpoints": {
            "analyze": "/api/analyze - Analyze content for virality",
            "account": "/api/account/simulate - Simulate account virality",
            "tiers": "/api/tiers - Get all virality tier definitions",
            "docs": "/docs - Interactive API documentation",
        }
    }


@app.get("/health")
async def health():
    return {"status": "healthy"}


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
