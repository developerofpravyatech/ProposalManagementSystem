from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from app.database import get_db
from app.schemas.company_profile import CompanyProfileRead, CompanyProfileUpdate, CompanyProfileWithRelations
from app.services.company_profile_service import (
    get_or_create_company_profile,
    get_company_profile,
    update_company_profile,
)
from app.services.pdf_service import build_company_profile_pdf
from app.api.auth import get_current_admin
import os

router = APIRouter(prefix="/company-profile", tags=["company-profile"])


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
    body: CompanyProfileUpdate,
    db: AsyncSession = Depends(get_db),
    current_admin=Depends(get_current_admin),
):
    profile = await update_company_profile(db, body.model_dump(exclude_unset=True))
    return profile


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
