from pydantic import BaseModel, EmailStr, Field, ConfigDict
from datetime import datetime
from typing import Optional


class Token(BaseModel):
    access_token: str
    refresh_token: str
    token_type: str = "bearer"


class TokenPayload(BaseModel):
    sub: str
    exp: Optional[datetime] = None


class AdminBase(BaseModel):
    email: EmailStr
    full_name: str = Field(..., min_length=1, max_length=255)


class AdminCreate(AdminBase):
    password: str = Field(..., min_length=6)


class AdminRead(AdminBase):
    model_config = ConfigDict(from_attributes=True)

    id: int
    created_at: datetime


class AdminLogin(BaseModel):
    email: EmailStr
    password: str
