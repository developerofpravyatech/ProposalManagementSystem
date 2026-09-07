from fastapi import APIRouter, Depends
from pydantic import BaseModel
from sqlalchemy import text

from app.database import engine


router = APIRouter()


class HealthResponse(BaseModel):
    success: bool
    api: str
    database: str


@router.get("/health", response_model=HealthResponse)
async def api_health():
    db_status = "ok"
    try:
        async with engine.begin() as conn:
            await conn.execute(text("SELECT 1"))
    except Exception:
        db_status = "error"
    return HealthResponse(success=True, api="ok", database=db_status)
