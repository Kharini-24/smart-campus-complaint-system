"""Student feedback routes."""

from fastapi import APIRouter, Depends, HTTPException, status
from bson import ObjectId

from backend.auth import get_current_student
from backend.database import get_db
from backend.models import FeedbackCreate, utc_now_iso

router = APIRouter(prefix="/api/feedback", tags=["feedback"])


@router.post("", status_code=status.HTTP_201_CREATED)
async def create_feedback(
    payload: FeedbackCreate,
    user: dict = Depends(get_current_student),
):
    db = get_db()

    # Validate complaint ID
    if not ObjectId.is_valid(payload.complaint_id):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid complaint ID",
        )

    complaint = await db["complaints"].find_one(
        {"_id": ObjectId(payload.complaint_id)}
    )

    if complaint is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Complaint not found",
        )

    # Student can only give feedback for their own complaint
    if complaint.get("student_id") != str(user["_id"]):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="You can only give feedback for your own complaints",
        )

    # Feedback is allowed only after resolution
    if complaint.get("status") != "Resolved":
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Feedback can only be submitted for resolved complaints",
        )

    # Prevent duplicate feedback
    existing = await db["feedback"].find_one(
        {
            "complaint_id": payload.complaint_id,
            "student_id": str(user["_id"]),
        }
    )

    if existing:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="Feedback has already been submitted for this complaint",
        )

    feedback_doc = {
        "complaint_id": payload.complaint_id,
        "student_id": str(user["_id"]),
        "rating": payload.rating,
        "comment": payload.comment,
        "created_at": utc_now_iso(),
    }

    result = await db["feedback"].insert_one(feedback_doc)

    return {
        "message": "Feedback submitted successfully",
        "feedback_id": str(result.inserted_id),
    }