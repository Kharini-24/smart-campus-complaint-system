"""Application configuration loaded from environment variables."""

import os
from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    mongodb_uri: str = ""
    jwt_secret: str = "dev-secret-change-in-production"
    jwt_algorithm: str = "HS256"
    jwt_expire_minutes: int = 1440  # 24 hours
    database_name: str = "smart_campus"
    
    cloudinary_cloud_name: str = ""
    cloudinary_api_key: str = ""
    cloudinary_api_secret: str = ""

    model_config = {"env_file": ".env", "env_file_encoding": "utf-8", "extra": "ignore"}


settings = Settings()

# Also allow reading MONGODB_URI from the system environment directly
if not settings.mongodb_uri:
    settings.mongodb_uri = os.getenv("MONGODB_URI", "")

if not settings.jwt_secret or settings.jwt_secret == "dev-secret-change-in-production":
    env_secret = os.getenv("JWT_SECRET")
    if env_secret:
        settings.jwt_secret = env_secret
