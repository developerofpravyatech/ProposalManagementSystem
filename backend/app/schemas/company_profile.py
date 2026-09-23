from pydantic import BaseModel, Field, ConfigDict, model_validator
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


class RegionalClientBase(BaseModel):
    name: str = Field(..., max_length=255)
    logo: Optional[str] = None
    sort_order: int = 0


class RegionalClientCreate(RegionalClientBase):
    pass


class RegionalClientRead(RegionalClientBase):
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
    title: str = Field(..., max_length=255)
    name: str = Field(..., max_length=255)
    sort_order: int = 0


class BranchOfficeCreate(BranchOfficeBase):
    pass


class BranchOfficeRead(BranchOfficeBase):
    model_config = ConfigDict(from_attributes=True)
    id: int


class WorkProcessStepBase(BaseModel):
    icon: Optional[str] = None
    title: Optional[str] = Field(None, max_length=255)
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


class PaymentMethodCreate(PaymentMethodBase):
    pass


class PaymentMethodRead(PaymentMethodBase):
    model_config = ConfigDict(from_attributes=True)
    id: int
    created_at: datetime
    updated_at: datetime


class BankDetailsBase(BaseModel):
    bank_name: Optional[str] = Field(None, max_length=255)
    account_name: Optional[str] = Field(None, max_length=255)
    account_number: Optional[str] = Field(None, max_length=50)
    ifsc: Optional[str] = Field(None, max_length=20)
    branch: Optional[str] = Field(None, max_length=255)
    upi_id: Optional[str] = Field(None, max_length=100)
    qr_code: Optional[str] = None
    swift_code: Optional[str] = Field(None, max_length=20)


class BankDetailsCreate(BankDetailsBase):
    pass


class BankDetailsRead(BankDetailsBase):
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


class StatementOfWorkBase(BaseModel):
    heading: str = Field(..., max_length=255)
    description: str = Field(..., min_length=1)
    sort_order: int = 0


class StatementOfWorkCreate(StatementOfWorkBase):
    pass


class StatementOfWorkRead(StatementOfWorkBase):
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
    services: Optional[list[Any]] = None
    logo_data: Optional[str] = None
    logo_url: Optional[str] = None
    qr_code: Optional[str] = None
    work_process_steps: Optional[list[Any]] = None
    signatures: Optional[list[Any]] = None
    profile_paragraphs: Optional[list[str]] = None
    cover_letter_salutation: Optional[str] = None
    cover_letter_paragraphs: Optional[list[str]] = None
    cover_letter_signoff: Optional[str] = None
    cover_letter_signature_name: Optional[str] = Field(None, max_length=255)
    cover_letter_signature_designation: Optional[str] = Field(None, max_length=255)
    cover_letter_signature_date: Optional[str] = Field(None, max_length=50)
    cover_letter_signature_image: Optional[str] = None
    statement_of_work: Optional[list[Any]] = None
    quote_acceptance_message: Optional[str] = None
    footer_tagline: Optional[str] = Field(None, max_length=500)

    # Bank Details - deprecated, use payment_method_rel instead
    bank_name: Optional[str] = Field(None, max_length=255)
    bank_account_name: Optional[str] = Field(None, max_length=255)
    bank_account_number: Optional[str] = Field(None, max_length=50)
    bank_ifsc: Optional[str] = Field(None, max_length=20)
    bank_branch: Optional[str] = Field(None, max_length=255)
    upi_id: Optional[str] = Field(None, max_length=100)
    swift_code: Optional[str] = Field(None, max_length=20)


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
    services: Optional[list[Any]] = None
    logo_data: Optional[str] = None
    logo_url: Optional[str] = None
    qr_code: Optional[str] = None
    work_process_steps: Optional[list[Any]] = None
    signatures: Optional[list[Any]] = None
    bni_clients: Optional[list[Any]] = None
    regional_clients: Optional[list[Any]] = None
    international_clients: Optional[list[Any]] = None
    branch_offices: Optional[list[Any]] = None
    profile_paragraphs: Optional[list[str]] = None
    cover_letter_salutation: Optional[str] = None
    cover_letter_paragraphs: Optional[list[str]] = None
    cover_letter_signoff: Optional[str] = None
    cover_letter_signature_name: Optional[str] = Field(None, max_length=255)
    cover_letter_signature_designation: Optional[str] = Field(None, max_length=255)
    cover_letter_signature_date: Optional[str] = Field(None, max_length=50)
    cover_letter_signature_image: Optional[str] = None
    statement_of_work: Optional[list[Any]] = None
    quote_acceptance_message: Optional[str] = None
    footer_tagline: Optional[str] = Field(None, max_length=500)
    
    # Bank Details - deprecated, use payment_method instead
    bank_name: Optional[str] = Field(None, max_length=255)
    bank_account_name: Optional[str] = Field(None, max_length=255)
    bank_account_number: Optional[str] = Field(None, max_length=50)
    bank_ifsc: Optional[str] = Field(None, max_length=20)
    bank_branch: Optional[str] = Field(None, max_length=255)
    upi_id: Optional[str] = Field(None, max_length=100)
    swift_code: Optional[str] = Field(None, max_length=20)
    
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
    regional_clients_rel: list[RegionalClientRead] = []
    international_clients_rel: list[InternationalClientRead] = []
    branch_offices_rel: list[BranchOfficeRead] = []
    work_process_steps_rel: list[WorkProcessStepRead] = []
    signatures_rel: list[SignatureRead] = []
    statement_of_work_rel: list[StatementOfWorkRead] = []
    payment_method_rel: Optional[PaymentMethodRead] = None
    bank_details_rel: Optional[BankDetailsRead] = None

    @model_validator(mode="after")
    def _set_fields_from_rel(self):
        if not self.core_values and self.core_values_rel:
            self.core_values = [
                {"title": cv.title, "description": cv.description, "logo": cv.logo}
                for cv in self.core_values_rel
            ]
        if not self.services and self.services_rel:
            self.services = [
                {"title": s.title, "description": s.description, "logo": s.logo}
                for s in self.services_rel
            ]
        if not self.statement_of_work and self.statement_of_work_rel:
            self.statement_of_work = [
                {"title": sow.heading, "description": sow.description}
                for sow in self.statement_of_work_rel
            ]
        if not self.work_process_steps and self.work_process_steps_rel:
            self.work_process_steps = [
                {"icon": s.icon, "title": s.title, "description": s.description}
                for s in self.work_process_steps_rel
            ]
        if not self.signatures and self.signatures_rel:
            self.cover_letter_signature_image = self.signatures_rel[0].image_data
            self.signatures = [{"image_data": s.image_data} for s in self.signatures_rel]
        source = self.payment_method_rel or self.bank_details_rel
        if source:
            self.bank_name = source.bank_name
            self.bank_account_name = source.account_name
            self.bank_account_number = source.account_number
            self.bank_ifsc = source.ifsc
            self.bank_branch = source.branch
            self.upi_id = source.upi_id
            self.qr_code = source.qr_code
            self.swift_code = source.swift_code
        return self


class CompanyProfileWithRelations(CompanyProfileRead):
    """Full company profile with all normalized relations loaded"""
    core_values_rel: list[CoreValueRead]
    services_rel: list[ServiceRead]
    bni_clients_rel: list[BNIClientRead]
    regional_clients_rel: list[RegionalClientRead]
    international_clients_rel: list[InternationalClientRead]
    branch_offices_rel: list[BranchOfficeRead]
    work_process_steps_rel: list[WorkProcessStepRead]
    signatures_rel: list[SignatureRead]
    statement_of_work_rel: list[StatementOfWorkRead] = []
    payment_method_rel: Optional[PaymentMethodRead] = None
    bank_details_rel: Optional[BankDetailsRead] = None
