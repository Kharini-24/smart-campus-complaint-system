from backend.auth import hash_password
from backend.database import get_db
from backend.models import utc_now_iso
import asyncio


async def create_staff():
    db = get_db()

    email = "maintenance@college.com"

    existing = await db["users"].find_one({"email": email})

    if existing:
        print("Staff account already exists.")
        return

    staff_doc = {
        "name": "Maintenance Staff",
        "email": email,
        "password_hash": hash_password("Staff@123"),
        "role": "staff",
        "department": "Maintenance",
        "created_at": utc_now_iso(),
    }

    result = await db["users"].insert_one(staff_doc)

    print("Staff account created successfully!")
    print("Email: maintenance@college.com")
    print("Password: Staff@123")
    print("Department: Maintenance")
    print("ID:", result.inserted_id)


if __name__ == "__main__":
    asyncio.run(create_staff())