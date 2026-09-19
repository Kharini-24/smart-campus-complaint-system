"""Image upload routes using Cloudinary."""

from fastapi import APIRouter, Depends, File, HTTPException, UploadFile, status
import cloudinary
import cloudinary.uploader

from backend.auth import get_current_student
from backend.config import settings

router = APIRouter(prefix="/api/uploads", tags=["uploads"])


cloudinary.config(
    cloud_name=settings.cloudinary_cloud_name,
    api_key=settings.cloudinary_api_key,
    api_secret=settings.cloudinary_api_secret,
    secure=True,
)


@router.post("/image")
async def upload_image(
    file: UploadFile = File(...),
    user: dict = Depends(get_current_student),
):
    allowed_types = {
        "image/jpeg",
        "image/png",
        "image/webp",
    }

    if file.content_type not in allowed_types:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Only JPG, PNG, and WEBP images are allowed.",
        )

    contents = await file.read()

    max_size = 5 * 1024 * 1024

    if len(contents) > max_size:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Image size must be less than 5MB.",
        )

    try:
        result = cloudinary.uploader.upload(
            contents,
            folder="smart-campus/complaints",
            resource_type="image",
        )

        return {
            "message": "Image uploaded successfully",
            "image_url": result["secure_url"],
        }

    except Exception as e:
        print("CLOUDINARY ERROR:", repr(e))

        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Image upload failed: {str(e)}",
        )