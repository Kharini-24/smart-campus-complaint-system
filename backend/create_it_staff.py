from backend.auth import hash_password
from backend.database import get_db
from backend.models import utc_now_iso
import asyncio


async def create_it_staff():
    db = get_db()

    email = "it@college.com"

    existing = await db["users"].find_one({"email": email})

    if existing:
        print("IT Staff account already exists.")
        return

    staff_doc = {
        "name": "IT Staff",
        "email": email,
        "password_hash": hash_password("Staff@123"),
        "role": "staff",
        "student_id": None,
        "department": "IT / Network",
        "created_at": utc_now_iso(),
    }

    result = await db["users"].insert_one(staff_doc)

    print("IT Staff account created successfully!")
    print("Email: it@college.com")
    print("Password: Staff@123")
    print("Role: staff")
    print("Department: IT / Network")
    print("ID:", result.inserted_id)


if __name__ == "__main__":
    asyncio.run(create_it_staff())