from fastapi import APIRouter, Depends, Request, UploadFile, File, HTTPException, Response
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from app.database import get_db
from app.schemas.company_profile import CompanyProfileRead, CompanyProfileUpdate, CompanyProfileWithRelations
from app.services.company_profile_service import (
    get_or_create_company_profile,
    get_company_profile,
    update_company_profile,
)
from app.services.pdf_service import build_company_profile_pdf
from app.api.auth import get_current_admin
from app.utils.security import settings
from app.models.company_profile import CompanyProfile
import os
import logging
import uuid
import base64
from datetime import datetime


router = APIRouter(prefix="/company-profile", tags=["company-profile"])
logger = logging.getLogger(__name__)

ALLOWED_EXTENSIONS = {".png", ".jpg", ".jpeg", ".svg", ".webp"}
MAX_FILE_SIZE = 2 * 1024 * 1024  # 2MB


def validate_file(file: UploadFile) -> None:
    """Validate uploaded file"""
    if not file.filename:
        raise HTTPException(status_code=400, detail="No filename provided")
    
    ext = os.path.splitext(file.filename.lower())[1]
    if ext not in ALLOWED_EXTENSIONS:
        raise HTTPException(status_code=400, detail=f"Invalid file type. Allowed: {', '.join(ALLOWED_EXTENSIONS)}")
    
    # Check file size
    file.file.seek(0, 2)  # Seek to end
    size = file.file.tell()
    file.file.seek(0)  # Reset to beginning
    if size > MAX_FILE_SIZE:
        raise HTTPException(status_code=400, detail="File size must be less than 2MB")


@router.get("/", response_model=CompanyProfileRead)
async def get_company(
    db: AsyncSession = Depends(get_db),
):
    profile = await get_company_profile(db)
    if not profile:
        profile = await get_or_create_company_profile(db)
    return profile


@router.get("/full", response_model=CompanyProfileWithRelations)
async def get_company_full(
    db: AsyncSession = Depends(get_db),
):
    """Get company profile with all normalized relations loaded"""
    profile = await get_company_profile(db)
    if not profile:
        profile = await get_or_create_company_profile(db)
    return profile


@router.put("/", response_model=CompanyProfileRead)
async def upsert_company(
    request: Request,
    body: CompanyProfileUpdate,
    db: AsyncSession = Depends(get_db),
    current_admin=Depends(get_current_admin),
):
    logger.info(f"PUT /company-profile - Content-Length: {request.headers.get('content-length')}, User: {current_admin.email}")
    try:
        profile = await update_company_profile(db, body.model_dump(exclude_unset=True))
        logger.info(f"PUT /company-profile - Success for user: {current_admin.email}")
        return profile
    except Exception as e:
        logger.error(f"PUT /company-profile - Error: {e}", exc_info=True)
        raise


@router.post("/pdf")
async def generate_company_profile_pdf(
    db: AsyncSession = Depends(get_db),
    current_admin=Depends(get_current_admin),
):
    profile = await get_company_profile(db)
    if not profile:
        profile = await get_or_create_company_profile(db)
    os.makedirs("./generated_pdfs", exist_ok=True)
    from datetime import datetime
    filename = f"company_profile_{datetime.now().strftime('%Y%m%d%H%M%S')}.pdf"
    filepath = os.path.join("./generated_pdfs", filename)
    build_company_profile_pdf(profile, filepath)
    return {"detail": "Company Profile PDF generated successfully", "filename": filename}


@router.post("/upload-logo")
async def upload_logo(
    file: UploadFile = File(...),
    db: AsyncSession = Depends(get_db),
    current_admin=Depends(get_current_admin),
):
    """Upload a logo file and store as base64 in database"""
    validate_file(file)
    
    content = await file.read()
    
    # Convert to base64 data URL
    ext = os.path.splitext(file.filename.lower())[1]
    mime_type = {
        ".png": "image/png",
        ".jpg": "image/jpeg",
        ".jpeg": "image/jpeg",
        ".svg": "image/svg+xml",
        ".webp": "image/webp",
    }.get(ext, "application/octet-stream")
    
    base64_data = base64.b64encode(content).decode("utf-8")
    data_url = f"data:{mime_type};base64,{base64_data}"
    
    # Update company profile with base64 logo
    profile = await get_or_create_company_profile(db)
    profile.logo_data = data_url
    profile.logo_url = None  # Clear file URL since we're storing in DB
    await db.commit()
    await db.refresh(profile)
    
    return {"url": data_url, "filename": file.filename, "stored_in_db": True}


@router.get("/logo")
async def get_logo(
    db: AsyncSession = Depends(get_db),
):
    """Serve logo from database"""
    profile = await get_company_profile(db)
    if not profile or not profile.logo_data:
        raise HTTPException(status_code=404, detail="Logo not found")
    
    # Parse data URL to get mime type and base64
    # Format: data:image/png;base64,...
    if not profile.logo_data.startswith("data:"):
        raise HTTPException(status_code=500, detail="Invalid logo data format")
    
    header, base64_data = profile.logo_data.split(",", 1)
    mime_type = header.split(":")[1].split(";")[0]
    
    # Decode and return binary
    image_data = base64.b64decode(base64_data)
    return Response(content=image_data, media_type=mime_type)