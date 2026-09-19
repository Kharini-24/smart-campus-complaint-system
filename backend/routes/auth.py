"""Authentication routes: register, login, me."""

from fastapi import APIRouter, Depends, HTTPException, status
from bson import ObjectId

from backend.auth import create_access_token, get_current_user, hash_password, verify_password
from backend.config import settings
from backend.database import get_db
from backend.models import UserLogin, UserRegister, UserResponse, TokenResponse, utc_now_iso

router = APIRouter(prefix="/api/auth", tags=["auth"])


def serialize_user(user: dict) -> UserResponse:
    return UserResponse(
    id=str(user["_id"]),
    name=user["name"],
    email=user["email"],
    role=user["role"],
    student_id=user.get("student_id"),
    department=user.get("department"),
    created_at=user["created_at"],
)


@router.post("/register", response_model=TokenResponse, status_code=status.HTTP_201_CREATED)
async def register(payload: UserRegister):
    db = get_db()

    existing = await db["users"].find_one({"email": payload.email})
    if existing:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="An account with this email already exists",
        )

    now = utc_now_iso()
    user_doc = {
        "name": payload.name,
        "email": payload.email,
        "password_hash": hash_password(payload.password),
        "role": "student",
        "student_id": payload.student_id,
        "created_at": now,
    }
    result = await db["users"].insert_one(user_doc)
    user_doc["_id"] = result.inserted_id

    token = create_access_token({"sub": str(result.inserted_id), "role": "student"})
    return TokenResponse(access_token=token, user=serialize_user(user_doc))


@router.post("/login", response_model=TokenResponse)
async def login(payload: UserLogin):
    db = get_db()

    user = await db["users"].find_one({"email": payload.email})
    if user is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password",
        )
    if not verify_password(payload.password, user["password_hash"]):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password",
        )

    token = create_access_token({"sub": str(user["_id"]), "role": user["role"]})
    return TokenResponse(access_token=token, user=serialize_user(user))


@router.get("/me", response_model=UserResponse)
async def me(user: dict = Depends(get_current_user)):
    return serialize_user(user)
