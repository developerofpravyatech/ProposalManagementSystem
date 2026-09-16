from datetime import datetime, timezone
from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from pydantic import BaseModel, EmailStr, Field
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
import logging

from app.database import get_db
from app.models.admin import Admin
from app.schemas.auth import AdminCreate, AdminRead, AdminLogin, Token
from app.utils.security import create_access_token, create_refresh_token, decode_token, hash_password, verify_password

router = APIRouter(prefix="/auth", tags=["auth"])
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/api/auth/login")
logger = logging.getLogger(__name__)


async def get_current_admin(token: str = Depends(oauth2_scheme), db: AsyncSession = Depends(get_db)) -> Admin:
    logger.debug(f"Validating token for /auth/me")
    payload = decode_token(token)
    if payload is None or payload.get("type") == "refresh":
        logger.warning(f"Invalid or expired token (payload: {payload})")
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid or expired token")
    admin_id = payload.get("sub")
    if admin_id is None:
        logger.warning("Token payload missing 'sub'")
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid token payload")
    result = await db.execute(select(Admin).where(Admin.id == int(admin_id)))
    admin = result.scalar_one_or_none()
    if not admin:
        logger.warning(f"Admin not found for id: {admin_id}")
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Admin not found")
    return admin


@router.post("/register", response_model=AdminRead)
async def register(admin_in: AdminCreate, db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(Admin).where(Admin.email == admin_in.email))
    if result.scalar_one_or_none():
        raise HTTPException(status_code=400, detail="Email already registered")
    admin = Admin(
        email=admin_in.email,
        full_name=admin_in.full_name,
        password=hash_password(admin_in.password),
    )
    db.add(admin)
    await db.commit()
    await db.refresh(admin)
    return admin


@router.post("/login", response_model=Token)
async def login(login_data: AdminLogin, db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(Admin).where(Admin.email == login_data.email))
    admin = result.scalar_one_or_none()
    if not admin or not verify_password(login_data.password, admin.password):
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid credentials")
    access_token = create_access_token({"sub": str(admin.id)})
    refresh_token = create_refresh_token({"sub": str(admin.id)})
    return Token(access_token=access_token, refresh_token=refresh_token)


@router.post("/refresh", response_model=Token)
async def refresh(token: str, db: AsyncSession = Depends(get_db)):
    logger.info(f"POST /auth/refresh - Attempting token refresh")
    payload = decode_token(token)
    if payload is None or payload.get("type") != "refresh":
        logger.warning(f"Invalid refresh token (payload: {payload})")
        raise HTTPException(status_code=401, detail="Invalid refresh token")
    admin_id = payload.get("sub")
    result = await db.execute(select(Admin).where(Admin.id == int(admin_id)))
    admin = result.scalar_one_or_none()
    if not admin:
        logger.warning(f"Admin not found for refresh token id: {admin_id}")
        raise HTTPException(status_code=401, detail="Admin not found")
    access_token = create_access_token({"sub": str(admin.id)})
    refresh_token = create_refresh_token({"sub": str(admin.id)})
    logger.info(f"POST /auth/refresh - Success for admin: {admin.email}")
    return Token(access_token=access_token, refresh_token=refresh_token)


@router.get("/me", response_model=AdminRead)
async def get_me(current_admin: Admin = Depends(get_current_admin)):
    logger.info(f"GET /auth/me - User: {current_admin.email}")
    return current_admin


@router.post("/logout")
async def logout():
    return {"detail": "Logged out successfully"}
