"""Admin routes for system-wide complaint statistics and management."""

from fastapi import APIRouter, Depends, HTTPException, status

from backend.auth import get_current_user
from backend.database import get_db


router = APIRouter(prefix="/api/admin", tags=["admin"])


@router.get("/dashboard")
async def admin_dashboard(user: dict = Depends(get_current_user)):
    if user["role"] != "admin":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Admin access required",
        )

    db = get_db()

    complaints = await db["complaints"].find().sort("created_at", -1).to_list(length=500)

    total = len(complaints)
    pending = sum(1 for c in complaints if c.get("status") == "Pending")
    in_progress = sum(1 for c in complaints if c.get("status") == "In Progress")
    resolved = sum(1 for c in complaints if c.get("status") == "Resolved")

    resolution_rate = round((resolved / total) * 100) if total > 0 else 0

    # Category statistics
    category_counts = {}

    for complaint in complaints:
        category = complaint.get("category") or "Uncategorized"
        category_counts[category] = category_counts.get(category, 0) + 1

    # Department statistics
    department_stats = {}

    for complaint in complaints:
        department = complaint.get("department") or "Unassigned"

        if department not in department_stats:
            department_stats[department] = {
                "assignedCount": 0,
                "resolvedCount": 0,
            }

        department_stats[department]["assignedCount"] += 1

        if complaint.get("status") == "Resolved":
            department_stats[department]["resolvedCount"] += 1

    # All complaints for admin table
    complaint_list = []

    for complaint in complaints:
        complaint_list.append({
            "id": str(complaint["_id"]),
            "title": complaint["description"],
            "category": complaint.get("category"),
            "department": complaint.get("department"),
            "studentName": complaint.get("student_name", ""),
            "status": complaint.get("status", "Pending"),
        })

    return {
        "stats": {
            "total": total,
            "pending": pending,
            "in_progress": in_progress,
            "resolved": resolved,
            "resolution_rate": resolution_rate,
        },
        "category_counts": category_counts,
        "department_stats": department_stats,
        "complaints": complaint_list,
    }