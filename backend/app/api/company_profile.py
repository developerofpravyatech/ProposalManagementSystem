from fastapi import APIRouter, Depends, HTTPException, status, Request
from sqlalchemy.ext.asyncio import AsyncSession
from typing import Any
from app.database import get_db
from app.models.company_profile import CompanyProfile
from app.schemas.company_profile import CompanyProfileRead, CompanyProfileUpdate
from app.services.company_profile_service import (
    get_or_create_company_profile,
    get_company_profile,
    update_company_profile,
)
from app.api.auth import get_current_admin

router = APIRouter(prefix="/company-profile", tags=["company-profile"])


@router.get("/", response_model=CompanyProfileRead)
async def get_company(
    request: Request,
    db: AsyncSession = Depends(get_db),
):
    profile = await get_company_profile(db)
    if not profile:
        profile = await get_or_create_company_profile(db)
    return profile


@router.put("/", response_model=CompanyProfileRead)
async def upsert_company(
    request: Request,
    db: AsyncSession = Depends(get_db),
    current_admin=Depends(get_current_admin),
):
    body: dict[str, Any] = await request.json()
    profile = await update_company_profile(db, body)
    return profile
