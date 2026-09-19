from backend.auth import hash_password
from backend.database import get_db
from backend.models import utc_now_iso
import asyncio


STAFF_ACCOUNTS = [
    {
        "name": "Transport Staff",
        "email": "transport@college.com",
        "department": "Transport",
    },
    {
        "name": "Finance Staff",
        "email": "finance@college.com",
        "department": "Finance",
    },
    {
        "name": "Academic Staff",
        "email": "academic@college.com",
        "department": "Academic Department",
    },
]


async def create_staff_accounts():
    db = get_db()

    for staff in STAFF_ACCOUNTS:
        existing = await db["users"].find_one(
            {"email": staff["email"]}
        )

        if existing:
            print(f"{staff['email']} already exists.")
            continue

        staff_doc = {
            "name": staff["name"],
            "email": staff["email"],
            "password_hash": hash_password("Staff@123"),
            "role": "staff",
            "student_id": None,
            "department": staff["department"],
            "created_at": utc_now_iso(),
        }

        result = await db["users"].insert_one(staff_doc)

        print(
            f"Created: {staff['email']} | "
            f"Department: {staff['department']} | "
            f"ID: {result.inserted_id}"
        )


if __name__ == "__main__":
    asyncio.run(create_staff_accounts())
    