from pydantic import BaseModel, Field, ConfigDict
from datetime import datetime
from typing import Optional, Any


class CompanyProfileBase(BaseModel):
    company_name: str = Field(..., max_length=255)
    tagline: Optional[str] = Field(None, max_length=500)
    email: Optional[str] = Field(None, max_length=255)
    phone: Optional[str] = Field(None, max_length=50)
    website: Optional[str] = Field(None, max_length=255)
    address: Optional[str] = None
    sales_head_name: Optional[str] = Field(None, max_length=255)
    sales_head_title: Optional[str] = Field(None, max_length=255)
    mission: Optional[str] = None
    vision: Optional[str] = None
    core_values: Optional[list[Any]] = None
    services: Optional[list[Any]] = None
    bni_clients: Optional[list[Any]] = None
    international_clients: Optional[list[Any]] = None
    branch_offices: Optional[list[Any]] = None
    terms: Optional[str] = None


class CompanyProfileUpdate(CompanyProfileBase):
    pass


class CompanyProfileRead(CompanyProfileBase):
    model_config = ConfigDict(from_attributes=True)

    id: int
    created_at: datetime
    updated_at: datetime
