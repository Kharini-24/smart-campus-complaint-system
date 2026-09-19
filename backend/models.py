"""Pydantic models for request validation and response serialization."""

from datetime import datetime, timezone
from typing import Optional

from pydantic import BaseModel, EmailStr, Field


# --- Auth models ---

class UserRegister(BaseModel):
    name: str = Field(min_length=1, max_length=100)
    email: EmailStr
    password: str = Field(min_length=6, max_length=128)
    student_id: str = Field(min_length=1, max_length=50)


class UserLogin(BaseModel):
    email: EmailStr
    password: str


class UserResponse(BaseModel):
    id: str
    name: str
    email: str
    role: str
    student_id: Optional[str] = None
    department: Optional[str] = None
    created_at: str


class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: UserResponse


# --- Complaint models ---

class ComplaintCreate(BaseModel):
    description: str = Field(min_length=10, max_length=5000)
    location: str = Field(min_length=1, max_length=200)
    image_url: Optional[str] = None


class ComplaintResponse(BaseModel):
    id: str
    student_id: str
    student_name: str
    description: str
    location: str
    image_url: Optional[str] = None
    category: Optional[str] = None
    department: Optional[str] = None
    status: str
    resolution_note: Optional[str] = None
    created_at: str
    updated_at: str


# --- Feedback model (collection created for future use) ---

class FeedbackCreate(BaseModel):
    complaint_id: str
    rating: int = Field(ge=1, le=5)
    comment: Optional[str] = None


def utc_now_iso() -> str:
    return datetime.now(timezone.utc).isoformat()
