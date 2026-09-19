"""
Smart Campus Complaint Management System
FastAPI Backend

Run with:  uvicorn backend.main:app --reload
"""

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from backend.database import ping_database, get_collections
from backend.routes.auth import router as auth_router
from backend.routes.complaints import router as complaints_router
from backend.routes.admin import router as admin_router
from backend.routes.uploads import router as uploads_router
from backend.routes.feedback import router as feedback_router

app = FastAPI(
    title="Smart Campus Complaint Management System",
    description="Backend API for the Smart Campus Complaint Management System using NLP and Machine Learning.",
    version="0.2.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth_router)
app.include_router(complaints_router)
app.include_router(admin_router)
app.include_router(uploads_router)
app.include_router(feedback_router)

@app.on_event("startup")
async def startup_db_client():
    ok = await ping_database()
    if not ok:
        print("WARNING: Could not connect to MongoDB — check MONGODB_URI")
    else:
        print("MongoDB connection established")
        # Ensure unique index on users.email
        collections = get_collections()
        await collections["users"].create_index("email", unique=True)


@app.get("/api/health")
async def health_check():
    db_ok = await ping_database()
    return {
        "status": "healthy" if db_ok else "degraded",
        "service": "Smart Campus Complaint Management System",
        "version": "0.2.0",
        "database": "connected" if db_ok else "disconnected",
    }
