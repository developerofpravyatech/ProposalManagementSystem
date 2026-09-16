from pydantic import BaseModel, Field, ConfigDict
from datetime import datetime
from typing import Optional, Any


class CoreValueBase(BaseModel):
    title: str = Field(..., max_length=255)
    description: Optional[str] = None
    logo: Optional[str] = None
    sort_order: int = 0


class CoreValueCreate(CoreValueBase):
    pass


class CoreValueRead(CoreValueBase):
    model_config = ConfigDict(from_attributes=True)
    id: int


class ServiceBase(BaseModel):
    title: str = Field(..., max_length=255)
    description: Optional[str] = None
    logo: Optional[str] = None
    sort_order: int = 0


class ServiceCreate(ServiceBase):
    pass


class ServiceRead(ServiceBase):
    model_config = ConfigDict(from_attributes=True)
    id: int


class BNIClientBase(BaseModel):
    name: str = Field(..., max_length=255)
    logo: Optional[str] = None
    sort_order: int = 0


class BNIClientCreate(BNIClientBase):
    pass


class BNIClientRead(BNIClientBase):
    model_config = ConfigDict(from_attributes=True)
    id: int


class InternationalClientBase(BaseModel):
    name: str = Field(..., max_length=255)
    logo: Optional[str] = None
    sort_order: int = 0


class InternationalClientCreate(InternationalClientBase):
    pass


class InternationalClientRead(InternationalClientBase):
    model_config = ConfigDict(from_attributes=True)
    id: int


class BranchOfficeBase(BaseModel):
    name: str = Field(..., max_length=255)
    logo: Optional[str] = None
    sort_order: int = 0


class BranchOfficeCreate(BranchOfficeBase):
    pass


class BranchOfficeRead(BranchOfficeBase):
    model_config = ConfigDict(from_attributes=True)
    id: int


class ThemeConfigBase(BaseModel):
    section: str = Field(..., max_length=50)
    icon_name: Optional[str] = None


class ThemeConfigCreate(ThemeConfigBase):
    pass


class ThemeConfigRead(ThemeConfigBase):
    model_config = ConfigDict(from_attributes=True)
    id: int


class WorkProcessStepBase(BaseModel):
    icon: Optional[str] = None
    title: str = Field(..., max_length=255)
    description: Optional[str] = None
    sort_order: int = 0


class WorkProcessStepCreate(WorkProcessStepBase):
    pass


class WorkProcessStepRead(WorkProcessStepBase):
    model_config = ConfigDict(from_attributes=True)
    id: int


class PaymentMethodBase(BaseModel):
    bank_name: Optional[str] = Field(None, max_length=255)
    account_name: Optional[str] = Field(None, max_length=255)
    account_number: Optional[str] = Field(None, max_length=50)
    ifsc: Optional[str] = Field(None, max_length=20)
    branch: Optional[str] = Field(None, max_length=255)
    upi_id: Optional[str] = Field(None, max_length=100)
    qr_code: Optional[str] = None
    swift_code: Optional[str] = Field(None, max_length=20)
    iban: Optional[str] = Field(None, max_length=50)


class PaymentMethodCreate(PaymentMethodBase):
    pass


class PaymentMethodRead(PaymentMethodBase):
    model_config = ConfigDict(from_attributes=True)
    id: int
    created_at: datetime
    updated_at: datetime


class CompanyProfileBase(BaseModel):
    company_name: str = Field(..., max_length=255)
    tagline: Optional[str] = Field(None, max_length=500)
    email: Optional[str] = Field(None, max_length=255)
    phone: Optional[str] = Field(None, max_length=50)
    website: Optional[str] = Field(None, max_length=255)
    sales_head_name: Optional[str] = Field(None, max_length=255)
    sales_head_title: Optional[str] = Field(None, max_length=255)
    mission: Optional[str] = None
    vision: Optional[str] = None
    services: Optional[list[Any]] = None
    bni_clients: Optional[list[Any]] = None
    international_clients: Optional[list[Any]] = None
    branch_offices: Optional[list[Any]] = None
    logo_data: Optional[str] = None
    logo_url: Optional[str] = None
    qr_code: Optional[str] = None
    primary_color: Optional[str] = Field(None, max_length=20)
    secondary_color: Optional[str] = Field(None, max_length=20)
    accent_color: Optional[str] = Field(None, max_length=20)
    theme_config: Optional[dict[str, Any]] = None
    work_process_steps: Optional[list[Any]] = None
    terms: Optional[str] = None
    contract_terms: Optional[list[Any]] = None

    # Bank Details - deprecated, use payment_method_rel instead
    bank_name: Optional[str] = Field(None, max_length=255)
    bank_account_name: Optional[str] = Field(None, max_length=255)
    bank_account_number: Optional[str] = Field(None, max_length=50)
    bank_ifsc: Optional[str] = Field(None, max_length=20)
    bank_branch: Optional[str] = Field(None, max_length=255)
    upi_id: Optional[str] = Field(None, max_length=100)
    swift_code: Optional[str] = Field(None, max_length=20)
    iban: Optional[str] = Field(None, max_length=50)


class CompanyProfileUpdate(BaseModel):
    """Schema for partial updates - all fields optional"""
    company_name: Optional[str] = Field(None, max_length=255)
    tagline: Optional[str] = Field(None, max_length=500)
    email: Optional[str] = Field(None, max_length=255)
    phone: Optional[str] = Field(None, max_length=50)
    website: Optional[str] = Field(None, max_length=255)
    sales_head_name: Optional[str] = Field(None, max_length=255)
    sales_head_title: Optional[str] = Field(None, max_length=255)
    mission: Optional[str] = None
    vision: Optional[str] = None
    services: Optional[list[Any]] = None
    bni_clients: Optional[list[Any]] = None
    international_clients: Optional[list[Any]] = None
    branch_offices: Optional[list[Any]] = None
    logo_data: Optional[str] = None
    logo_url: Optional[str] = None
    qr_code: Optional[str] = None
    primary_color: Optional[str] = Field(None, max_length=20)
    secondary_color: Optional[str] = Field(None, max_length=20)
    accent_color: Optional[str] = Field(None, max_length=20)
    theme_config: Optional[dict[str, Any]] = None
    work_process_steps: Optional[list[Any]] = None
    terms: Optional[str] = None
    contract_terms: Optional[list[Any]] = None
    
    # Bank Details - deprecated, use payment_method instead
    bank_name: Optional[str] = Field(None, max_length=255)
    bank_account_name: Optional[str] = Field(None, max_length=255)
    bank_account_number: Optional[str] = Field(None, max_length=50)
    bank_ifsc: Optional[str] = Field(None, max_length=20)
    bank_branch: Optional[str] = Field(None, max_length=255)
    upi_id: Optional[str] = Field(None, max_length=100)
    swift_code: Optional[str] = Field(None, max_length=20)
    iban: Optional[str] = Field(None, max_length=50)
    
    # Payment Method (normalized)
    payment_method: Optional[PaymentMethodCreate] = None


class CompanyProfileRead(CompanyProfileBase):
    model_config = ConfigDict(from_attributes=True)

    id: int
    created_at: datetime
    updated_at: datetime
    core_values_rel: list[CoreValueRead] = []
    services_rel: list[ServiceRead] = []
    bni_clients_rel: list[BNIClientRead] = []
    international_clients_rel: list[InternationalClientRead] = []
    branch_offices_rel: list[BranchOfficeRead] = []
    theme_config_rel: Optional[ThemeConfigRead] = None
    work_process_steps_rel: list[WorkProcessStepRead] = []
    payment_method_rel: Optional[PaymentMethodRead] = None


class CompanyProfileWithRelations(CompanyProfileRead):
    """Full company profile with all normalized relations loaded"""
    core_values_rel: list[CoreValueRead]
    services_rel: list[ServiceRead]
    bni_clients_rel: list[BNIClientRead]
    international_clients_rel: list[InternationalClientRead]
    branch_offices_rel: list[BranchOfficeRead]
    theme_config_rel: Optional[ThemeConfigRead] = None
    work_process_steps_rel: list[WorkProcessStepRead]
    payment_method_rel: Optional[PaymentMethodRead] = None