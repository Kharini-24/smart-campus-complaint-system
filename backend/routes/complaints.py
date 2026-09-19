"""Complaint routes: create, list own, staff management, get by id."""

from fastapi import APIRouter, Depends, HTTPException, status
from bson import ObjectId

from backend.auth import get_current_user, get_current_student
from backend.database import get_db
from backend.models import ComplaintCreate, ComplaintResponse, utc_now_iso
from backend.ml_predictor import predict_category

router = APIRouter(prefix="/api/complaints", tags=["complaints"])


def serialize_complaint(c: dict, student_name: str = "") -> ComplaintResponse:
    return ComplaintResponse(
        id=str(c["_id"]),
        student_id=c["student_id"],
        student_name=student_name or c.get("student_name", ""),
        description=c["description"],
        location=c["location"],
        image_url=c.get("image_url"),
        category=c.get("category"),
        department=c.get("department"),
        status=c["status"],
        resolution_note=c.get("resolution_note"),
        created_at=c["created_at"],
        updated_at=c["updated_at"],
    )


@router.post("", response_model=ComplaintResponse, status_code=status.HTTP_201_CREATED)
async def create_complaint(
    payload: ComplaintCreate,
    user: dict = Depends(get_current_student),
):
    db = get_db()
    now = utc_now_iso()

    # Predict complaint category using the trained DistilBERT model
    category = predict_category(payload.description)

    # Map category to responsible department
    department_map = {
        "Wi-Fi": "IT / Network",
        "Transport": "Transport",
        "Maintenance": "Maintenance",
        "Fees": "Finance",
        "Academics": "Academic Department",
    }

    department = department_map.get(category)

    complaint_doc = {
        "student_id": str(user["_id"]),
        "student_name": user["name"],
        "description": payload.description,
        "location": payload.location,
        "image_url": payload.image_url,
        "category": category,
        "department": department,
        "status": "Pending",
        "resolution_note": None,
        "created_at": now,
        "updated_at": now,
    }

    result = await db["complaints"].insert_one(complaint_doc)
    complaint_doc["_id"] = result.inserted_id

    return serialize_complaint(complaint_doc, user["name"])


# ---------------------------------------------------------
# STUDENT: VIEW OWN COMPLAINTS
# ---------------------------------------------------------

@router.get("/my", response_model=list[ComplaintResponse])
async def my_complaints(user: dict = Depends(get_current_user)):
    db = get_db()

    cursor = (
        db["complaints"]
        .find({"student_id": str(user["_id"])})
        .sort("created_at", -1)
    )

    complaints = await cursor.to_list(length=100)

    return [
        serialize_complaint(c, c.get("student_name", ""))
        for c in complaints
    ]


# ---------------------------------------------------------
# STAFF: VIEW DEPARTMENT COMPLAINTS
# ---------------------------------------------------------

@router.get("/staff", response_model=list[ComplaintResponse])
async def staff_complaints(user: dict = Depends(get_current_user)):
    # Only staff members can access this endpoint
    if user["role"] != "staff":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Staff access required",
        )

    db = get_db()

    cursor = (
        db["complaints"]
        .find({"department": user.get("department")})
        .sort("created_at", -1)
    )

    complaints = await cursor.to_list(length=100)

    return [
        serialize_complaint(c, c.get("student_name", ""))
        for c in complaints
    ]


# ---------------------------------------------------------
# STAFF: UPDATE COMPLAINT STATUS
# ---------------------------------------------------------

@router.put("/{complaint_id}/status", response_model=ComplaintResponse)
async def update_complaint_status(
    complaint_id: str,
    new_status: str,
    resolution_note: str | None = None,
    user: dict = Depends(get_current_user),
):
    # Only staff members can update complaints
    if user["role"] != "staff":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Staff access required",
        )

    # Validate complaint ID
    if not ObjectId.is_valid(complaint_id):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid complaint ID",
        )

    # Validate status
    allowed_statuses = {
        "Pending",
        "In Progress",
        "Resolved",
    }

    if new_status not in allowed_statuses:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid status",
        )

    db = get_db()

    complaint = await db["complaints"].find_one(
        {"_id": ObjectId(complaint_id)}
    )

    if complaint is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Complaint not found",
        )

    # Staff can only update complaints belonging to their department
    if complaint.get("department") != user.get("department"):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="You can only update complaints assigned to your department",
        )

    now = utc_now_iso()

    update_data = {
        "status": new_status,
        "updated_at": now,
    }

    if resolution_note is not None:
        update_data["resolution_note"] = resolution_note

    await db["complaints"].update_one(
        {"_id": ObjectId(complaint_id)},
        {"$set": update_data},
    )

    updated_complaint = await db["complaints"].find_one(
        {"_id": ObjectId(complaint_id)}
    )

    return serialize_complaint(
        updated_complaint,
        updated_complaint.get("student_name", ""),
    )


# ---------------------------------------------------------
# VIEW SINGLE COMPLAINT
# ---------------------------------------------------------

@router.get("/{complaint_id}", response_model=ComplaintResponse)
async def get_complaint(
    complaint_id: str,
    user: dict = Depends(get_current_user),
):
    if not ObjectId.is_valid(complaint_id):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid complaint ID",
        )

    db = get_db()

    complaint = await db["complaints"].find_one(
        {"_id": ObjectId(complaint_id)}
    )

    if complaint is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Complaint not found",
        )

    # Students can only view their own complaints
    if (
        user["role"] == "student"
        and complaint["student_id"] != str(user["_id"])
    ):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="You can only view your own complaints",
        )

    # Staff can only view complaints assigned to their department
    if (
        user["role"] == "staff"
        and complaint.get("department") != user.get("department")
    ):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="You can only view complaints assigned to your department",
        )

    return serialize_complaint(
        complaint,
        complaint.get("student_name", ""),
    )