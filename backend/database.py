"""MongoDB connection module using Motor (async driver).

Uses MONGODB_URI from the environment. Falls back to an in-memory mock
when no URI is configured (development/testing only).
"""

import os

from backend.config import settings

_client = None
_db = None
_use_mock = False

# If no MONGODB_URI is set, use mongomock-motor for local dev/testing
if not settings.mongodb_uri:
    try:
        from mongomock_motor import AsyncMongoMockClient

        _use_mock = True
    except ImportError:
        pass


def get_client():
    global _client
    if _client is None:
        if _use_mock:
            _client = AsyncMongoMockClient()
        else:
            from motor.motor_asyncio import AsyncIOMotorClient

            _client = AsyncIOMotorClient(settings.mongodb_uri)
    return _client


def get_db():
    global _db
    if _db is None:
        _db = get_client()[settings.database_name]
    return _db


async def ping_database() -> bool:
    try:
        if _use_mock:
            return True
        await get_client().admin.command("ping")
        return True
    except Exception as e:
        print(f"MongoDB ping failed: {type(e).__name__}: {e}")
        return False


def get_collections():
    db = get_db()
    return {
        "users": db["users"],
        "complaints": db["complaints"],
        "feedback": db["feedback"],
    }
