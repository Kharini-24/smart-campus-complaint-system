"""
Test script for the Smart Campus Complaint Management System backend.
Tests: MongoDB connection, registration, login, invalid login, /me,
complaint creation, listing, unauthorized access.
"""

import sys
import os
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

# Ensure no MONGODB_URI so we use the mock
os.environ.pop("MONGODB_URI", None)

from fastapi.testclient import TestClient
from backend.main import app

client = TestClient(app)

passed = 0
failed = 0


def test(name: str, condition: bool, detail: str = ""):
    global passed, failed
    if condition:
        print(f"  PASS: {name}")
        passed += 1
    else:
        print(f"  FAIL: {name} — {detail}")
        failed += 1


print("\n=== Smart Campus Backend Tests ===\n")

# 1. Health check (MongoDB connection)
print("1. Health Check / MongoDB Connection")
resp = client.get("/api/health")
test("Health endpoint returns 200", resp.status_code == 200, f"Got {resp.status_code}")
test("Database connected", resp.json().get("database") == "connected", str(resp.json()))

# 2. Student Registration
print("\n2. Student Registration")
resp = client.post("/api/auth/register", json={
    "name": "Test Student",
    "email": "teststudent@campus.edu",
    "password": "testpass123",
    "student_id": "CS21B999",
})
test("Register returns 201", resp.status_code == 201, f"Got {resp.status_code}: {resp.text}")
reg_data = resp.json() if resp.status_code == 201 else {}
test("Token returned", "access_token" in reg_data, str(reg_data))
test("Role is student", reg_data.get("user", {}).get("role") == "student", str(reg_data))
student_token = reg_data.get("access_token", "")

# 3. Duplicate registration
print("\n3. Duplicate Registration")
resp = client.post("/api/auth/register", json={
    "name": "Test Student",
    "email": "teststudent@campus.edu",
    "password": "testpass123",
    "student_id": "CS21B999",
})
test("Duplicate returns 409", resp.status_code == 409, f"Got {resp.status_code}")

# 4. Student Login
print("\n4. Student Login")
resp = client.post("/api/auth/login", json={
    "email": "teststudent@campus.edu",
    "password": "testpass123",
})
test("Login returns 200", resp.status_code == 200, f"Got {resp.status_code}: {resp.text}")
login_data = resp.json() if resp.status_code == 200 else {}
test("Token returned", "access_token" in login_data, str(login_data))
test("User name matches", login_data.get("user", {}).get("name") == "Test Student")

# 5. Invalid Login
print("\n5. Invalid Login")
resp = client.post("/api/auth/login", json={
    "email": "teststudent@campus.edu",
    "password": "wrongpassword",
})
test("Invalid login returns 401", resp.status_code == 401, f"Got {resp.status_code}")

resp = client.post("/api/auth/login", json={
    "email": "nonexistent@campus.edu",
    "password": "testpass123",
})
test("Nonexistent email returns 401", resp.status_code == 401, f"Got {resp.status_code}")

# 6. Protected /me endpoint
print("\n6. Protected /me Endpoint")
resp = client.get("/api/auth/me")
test("No token returns 401", resp.status_code == 401, f"Got {resp.status_code}")

resp = client.get("/api/auth/me", headers={"Authorization": f"Bearer {student_token}"})
test("Valid token returns 200", resp.status_code == 200, f"Got {resp.status_code}: {resp.text}")
test("User email matches", resp.json().get("email") == "teststudent@campus.edu")

# 7. Complaint Creation
print("\n7. Complaint Creation")
resp = client.post("/api/complaints", json={
    "description": "The Wi-Fi in Block C has been down for two days and students cannot access online resources.",
    "location": "Block C, Floor 2, Room 204",
}, headers={"Authorization": f"Bearer {student_token}"})
test("Create complaint returns 201", resp.status_code == 201, f"Got {resp.status_code}: {resp.text}")
complaint_data = resp.json() if resp.status_code == 201 else {}
test("Status is Pending", complaint_data.get("status") == "Pending", str(complaint_data))
test("Category is null", complaint_data.get("category") is None, str(complaint_data))
test("Department is null", complaint_data.get("department") is None, str(complaint_data))
complaint_id = complaint_data.get("id", "")

# 8. Complaint validation
print("\n8. Complaint Validation")
resp = client.post("/api/complaints", json={
    "description": "short",
    "location": "Block C",
}, headers={"Authorization": f"Bearer {student_token}"})
test("Short description returns 422", resp.status_code == 422, f"Got {resp.status_code}")

# 9. List My Complaints
print("\n9. List My Complaints")
resp = client.get("/api/complaints/my", headers={"Authorization": f"Bearer {student_token}"})
test("My complaints returns 200", resp.status_code == 200, f"Got {resp.status_code}: {resp.text}")
test("Has at least 1 complaint", len(resp.json()) >= 1, str(resp.json()))

# 10. Get complaint by ID
print("\n10. Get Complaint by ID")
resp = client.get(f"/api/complaints/{complaint_id}", headers={"Authorization": f"Bearer {student_token}"})
test("Get by ID returns 200", resp.status_code == 200, f"Got {resp.status_code}: {resp.text}")
test("Complaint ID matches", resp.json().get("id") == complaint_id)

# 11. Invalid complaint ID
print("\n11. Invalid Complaint ID")
resp = client.get("/api/complaints/invalidid123", headers={"Authorization": f"Bearer {student_token}"})
test("Invalid ID returns 400", resp.status_code == 400, f"Got {resp.status_code}")

# 12. Unauthorized complaint creation
print("\n12. Unauthorized Access")
resp = client.post("/api/complaints", json={
    "description": "This is a test complaint that should not be created without auth.",
    "location": "Block A",
})
test("No token returns 401", resp.status_code == 401, f"Got {resp.status_code}")

resp = client.get("/api/complaints/my")
test("No token on my complaints returns 401", resp.status_code == 401, f"Got {resp.status_code}")

# 13. Second user cannot see first user's complaints
print("\n13. Cross-User Isolation")
resp = client.post("/api/auth/register", json={
    "name": "Second Student",
    "email": "secondstudent@campus.edu",
    "password": "testpass456",
    "student_id": "EE22B001",
})
second_token = resp.json().get("access_token", "")
resp = client.get("/api/complaints/my", headers={"Authorization": f"Bearer {second_token}"})
test("Second user has 0 complaints", len(resp.json()) == 0, str(resp.json()))

resp = client.get(f"/api/complaints/{complaint_id}", headers={"Authorization": f"Bearer {second_token}"})
test("Second user cannot see first user's complaint", resp.status_code == 403, f"Got {resp.status_code}")

# Summary
print(f"\n=== Results: {passed} passed, {failed} failed ===\n")
sys.exit(1 if failed > 0 else 0)
