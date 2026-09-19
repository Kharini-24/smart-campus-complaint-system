from backend.auth import hash_password
from backend.database import get_db
from backend.models import utc_now_iso
import asyncio


async def create_admin():
    db = get_db()

    email = "admin@college.com"

    existing = await db["users"].find_one({"email": email})

    if existing:
        print("Admin account already exists.")
        return

    admin_doc = {
        "name": "College Admin",
        "email": email,
        "password_hash": hash_password("Admin@123"),
        "role": "admin",
        "student_id": None,
        "department": None,
        "created_at": utc_now_iso(),
    }

    result = await db["users"].insert_one(admin_doc)

    print("Admin account created successfully!")
    print("Email: admin@college.com")
    print("Password: Admin@123")
    print("Role: admin")
    print("ID:", result.inserted_id)


if __name__ == "__main__":
    asyncio.run(create_admin())