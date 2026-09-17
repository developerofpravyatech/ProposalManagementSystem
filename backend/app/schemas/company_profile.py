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


class ContractTermBase(BaseModel):
    title: str = Field(..., max_length=255)
    bullets: list[str] = Field(default_factory=list)
    sort_order: int = 0


class ContractTermCreate(ContractTermBase):
    pass


class ContractTermRead(ContractTermBase):
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


class SignatureBase(BaseModel):
    image_data: Optional[str] = None
    sort_order: int = 0


class SignatureCreate(SignatureBase):
    pass


class SignatureRead(SignatureBase):
    model_config = ConfigDict(from_attributes=True)
    id: int


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
    core_values: Optional[list[Any]] = None
    logo_data: Optional[str] = None
    logo_url: Optional[str] = None
    qr_code: Optional[str] = None
    work_process_steps: Optional[list[Any]] = None
    terms: Optional[str] = None
    contract_terms: Optional[list[Any]] = None
    signatures: Optional[list[Any]] = None

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
    core_values: Optional[list[Any]] = None
    logo_data: Optional[str] = None
    logo_url: Optional[str] = None
    qr_code: Optional[str] = None
    work_process_steps: Optional[list[Any]] = None
    terms: Optional[str] = None
    contract_terms: Optional[list[Any]] = None
    signatures: Optional[list[Any]] = None
    
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
    work_process_steps_rel: list[WorkProcessStepRead] = []
    signatures_rel: list[SignatureRead] = []
    payment_method_rel: Optional[PaymentMethodRead] = None
    contract_terms_rel: list[ContractTermRead] = []


class CompanyProfileWithRelations(CompanyProfileRead):
    """Full company profile with all normalized relations loaded"""
    core_values_rel: list[CoreValueRead]
    services_rel: list[ServiceRead]
    bni_clients_rel: list[BNIClientRead]
    international_clients_rel: list[InternationalClientRead]
    branch_offices_rel: list[BranchOfficeRead]
    work_process_steps_rel: list[WorkProcessStepRead]
    signatures_rel: list[SignatureRead]
    payment_method_rel: Optional[PaymentMethodRead] = None
    contract_terms_rel: list[ContractTermRead]