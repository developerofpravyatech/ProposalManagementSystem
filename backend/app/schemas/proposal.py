from pydantic import BaseModel, EmailStr, Field, ConfigDict
from datetime import datetime
from typing import Optional
from app.models.proposal import ProposalType, ProposalStatus


class ProposalBase(BaseModel):
    proposal_type: ProposalType
    client_name: str = Field(..., min_length=1, max_length=255)
    company_name: Optional[str] = Field(None, max_length=255)
    phone: Optional[str] = Field(None, max_length=50)
    email: Optional[EmailStr] = None
    project_title: Optional[str] = Field(None, max_length=500)
    amount: Optional[float] = None
    currency: Optional[str] = Field(None, max_length=10)
    renewal_date: Optional[datetime] = None


class ProposalCreate(ProposalBase):
    pass


class ProposalUpdate(BaseModel):
    client_name: Optional[str] = Field(None, min_length=1, max_length=255)
    company_name: Optional[str] = Field(None, max_length=255)
    phone: Optional[str] = Field(None, max_length=50)
    email: Optional[EmailStr] = None
    project_title: Optional[str] = Field(None, max_length=500)
    amount: Optional[float] = None
    currency: Optional[str] = Field(None, max_length=10)
    status: Optional[ProposalStatus] = None
    renewal_date: Optional[datetime] = None
    pdf_path: Optional[str] = None


class ProposalRead(ProposalBase):
    model_config = ConfigDict(from_attributes=True)

    id: int
    proposal_number: str
    pdf_path: Optional[str]
    unique_token: str
    sent_at: Optional[datetime]
    first_opened_at: Optional[datetime]
    last_opened_at: Optional[datetime]
    view_count: int
    status: ProposalStatus
    created_at: datetime
    updated_at: datetime


class ProposalViewRead(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    proposal_id: int
    viewed_at: datetime
    ip_address: Optional[str]
    user_agent: Optional[str]


class ProposalAnalytics(BaseModel):
    total_views: int
    unique_devices: int
    first_opened_at: Optional[datetime]
    last_opened_at: Optional[datetime]
    downloaded: bool
    downloaded_at: Optional[datetime]
    events: list[ProposalViewRead]
