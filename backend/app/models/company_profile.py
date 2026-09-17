from sqlalchemy import String, Text, JSON, DateTime, func, ForeignKey
from sqlalchemy.orm import Mapped, mapped_column, relationship
from datetime import datetime
from typing import TYPE_CHECKING
from app.database import Base

if TYPE_CHECKING:
    from app.models.company_profile_normalized import (
        CoreValue,
        Service,
        BNIClient,
        InternationalClient,
        BranchOffice,
        WorkProcessStep,
        PaymentMethod,
    )


class CompanyProfile(Base):
    __tablename__ = "company_profile"

    id: Mapped[int] = mapped_column(primary_key=True, index=True)
    company_name: Mapped[str] = mapped_column(String(255), nullable=False, default="PRAVYA TECH Solutions")
    tagline: Mapped[str | None] = mapped_column(String(500), nullable=True)
    email: Mapped[str | None] = mapped_column(String(255), nullable=True)
    phone: Mapped[str | None] = mapped_column(String(50), nullable=True)
    website: Mapped[str | None] = mapped_column(String(255), nullable=True)
    sales_head_name: Mapped[str | None] = mapped_column(String(255), nullable=True)
    sales_head_title: Mapped[str | None] = mapped_column(String(255), nullable=True)
    mission: Mapped[str | None] = mapped_column(Text, nullable=True)
    vision: Mapped[str | None] = mapped_column(Text, nullable=True)
    services: Mapped[list | None] = mapped_column(JSON, nullable=True)
    bni_clients: Mapped[list | None] = mapped_column(JSON, nullable=True)
    international_clients: Mapped[list | None] = mapped_column(JSON, nullable=True)
    branch_offices: Mapped[list | None] = mapped_column(JSON, nullable=True)
    logo_data: Mapped[str | None] = mapped_column(Text, nullable=True)
    logo_url: Mapped[str | None] = mapped_column(String(500), nullable=True)
    qr_code: Mapped[str | None] = mapped_column(Text, nullable=True)
    terms: Mapped[str | None] = mapped_column(Text, nullable=True)
    contract_terms: Mapped[list | None] = mapped_column(JSON, nullable=True)

    # Bank Details - moved to company_payment_methods table
    # bank_name, bank_account_name, bank_account_number, bank_ifsc, bank_branch, upi_id, swift_code, iban kept for backward compatibility

    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now(), nullable=False)
    updated_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now(), nullable=False)

    # Normalized relationships
    core_values_rel: Mapped[list["CoreValue"]] = relationship(
        "CoreValue", back_populates="company_profile", cascade="all, delete-orphan", order_by="CoreValue.sort_order"
    )
    services_rel: Mapped[list["Service"]] = relationship(
        "Service", back_populates="company_profile", cascade="all, delete-orphan", order_by="Service.sort_order"
    )
    bni_clients_rel: Mapped[list["BNIClient"]] = relationship(
        "BNIClient", back_populates="company_profile", cascade="all, delete-orphan", order_by="BNIClient.sort_order"
    )
    international_clients_rel: Mapped[list["InternationalClient"]] = relationship(
        "InternationalClient", back_populates="company_profile", cascade="all, delete-orphan", order_by="InternationalClient.sort_order"
    )
    branch_offices_rel: Mapped[list["BranchOffice"]] = relationship(
        "BranchOffice", back_populates="company_profile", cascade="all, delete-orphan", order_by="BranchOffice.sort_order"
    )
    work_process_steps_rel: Mapped[list["WorkProcessStep"]] = relationship(
        "WorkProcessStep", back_populates="company_profile", cascade="all, delete-orphan", order_by="WorkProcessStep.sort_order"
    )
    payment_method_rel: Mapped["PaymentMethod | None"] = relationship(
        "PaymentMethod", back_populates="company_profile", cascade="all, delete-orphan", uselist=False
    )
