from sqlalchemy import String, Text, ForeignKey, Integer, DateTime, func, UniqueConstraint, JSON
from sqlalchemy.orm import Mapped, mapped_column, relationship
from datetime import datetime
from app.database import Base


class CoreValue(Base):
    __tablename__ = "core_values"

    id: Mapped[int] = mapped_column(primary_key=True, index=True)
    company_profile_id: Mapped[int] = mapped_column(ForeignKey("company_profile.id", ondelete="CASCADE"), nullable=False, index=True)
    title: Mapped[str] = mapped_column(String(255), nullable=False)
    description: Mapped[str | None] = mapped_column(Text, nullable=True)
    logo: Mapped[str | None] = mapped_column(Text, nullable=True)
    sort_order: Mapped[int] = mapped_column(Integer, nullable=False, default=0)

    company_profile: Mapped["CompanyProfile"] = relationship(back_populates="core_values_rel")

    __table_args__ = (
        UniqueConstraint("company_profile_id", "sort_order", name="uq_core_value_profile_order"),
    )


class Service(Base):
    __tablename__ = "company_services"

    id: Mapped[int] = mapped_column(primary_key=True, index=True)
    company_profile_id: Mapped[int] = mapped_column(ForeignKey("company_profile.id", ondelete="CASCADE"), nullable=False, index=True)
    title: Mapped[str] = mapped_column(String(255), nullable=False)
    description: Mapped[str | None] = mapped_column(Text, nullable=True)
    logo: Mapped[str | None] = mapped_column(Text, nullable=True)
    sort_order: Mapped[int] = mapped_column(Integer, nullable=False, default=0)

    company_profile: Mapped["CompanyProfile"] = relationship(back_populates="services_rel")

    __table_args__ = (
        UniqueConstraint("company_profile_id", "sort_order", name="uq_service_profile_order"),
    )


class BNIClient(Base):
    __tablename__ = "company_bni_clients"

    id: Mapped[int] = mapped_column(primary_key=True, index=True)
    company_profile_id: Mapped[int] = mapped_column(ForeignKey("company_profile.id", ondelete="CASCADE"), nullable=False, index=True)
    name: Mapped[str] = mapped_column(String(255), nullable=False)
    logo: Mapped[str | None] = mapped_column(Text, nullable=True)
    sort_order: Mapped[int] = mapped_column(Integer, nullable=False, default=0)

    company_profile: Mapped["CompanyProfile"] = relationship(back_populates="bni_clients_rel")

    __table_args__ = (
        UniqueConstraint("company_profile_id", "sort_order", name="uq_bni_client_profile_order"),
    )


class InternationalClient(Base):
    __tablename__ = "company_international_clients"

    id: Mapped[int] = mapped_column(primary_key=True, index=True)
    company_profile_id: Mapped[int] = mapped_column(ForeignKey("company_profile.id", ondelete="CASCADE"), nullable=False, index=True)
    name: Mapped[str] = mapped_column(String(255), nullable=False)
    logo: Mapped[str | None] = mapped_column(Text, nullable=True)
    sort_order: Mapped[int] = mapped_column(Integer, nullable=False, default=0)

    company_profile: Mapped["CompanyProfile"] = relationship(back_populates="international_clients_rel")

    __table_args__ = (
        UniqueConstraint("company_profile_id", "sort_order", name="uq_intl_client_profile_order"),
    )


class BranchOffice(Base):
    __tablename__ = "company_branch_offices"

    id: Mapped[int] = mapped_column(primary_key=True, index=True)
    company_profile_id: Mapped[int] = mapped_column(ForeignKey("company_profile.id", ondelete="CASCADE"), nullable=False, index=True)
    name: Mapped[str] = mapped_column(String(255), nullable=False)
    sort_order: Mapped[int] = mapped_column(Integer, nullable=False, default=0)

    company_profile: Mapped["CompanyProfile"] = relationship(back_populates="branch_offices_rel")

    __table_args__ = (
        UniqueConstraint("company_profile_id", "sort_order", name="uq_branch_office_profile_order"),
    )


class WorkProcessStep(Base):
    __tablename__ = "company_work_process_steps"

    id: Mapped[int] = mapped_column(primary_key=True, index=True)
    company_profile_id: Mapped[int] = mapped_column(ForeignKey("company_profile.id", ondelete="CASCADE"), nullable=False, index=True)
    icon: Mapped[str | None] = mapped_column(Text, nullable=True)
    title: Mapped[str] = mapped_column(String(255), nullable=False)
    description: Mapped[str | None] = mapped_column(Text, nullable=True)
    sort_order: Mapped[int] = mapped_column(Integer, nullable=False, default=0)

    company_profile: Mapped["CompanyProfile"] = relationship(back_populates="work_process_steps_rel")

    __table_args__ = (
        UniqueConstraint("company_profile_id", "sort_order", name="uq_work_process_profile_order"),
    )


class Signature(Base):
    __tablename__ = "company_signatures"

    id: Mapped[int] = mapped_column(primary_key=True, index=True)
    company_profile_id: Mapped[int] = mapped_column(ForeignKey("company_profile.id", ondelete="CASCADE"), nullable=False, index=True)
    image_data: Mapped[str | None] = mapped_column(Text, nullable=True)
    sort_order: Mapped[int] = mapped_column(Integer, nullable=False, default=0)

    company_profile: Mapped["CompanyProfile"] = relationship(back_populates="signatures_rel")

    __table_args__ = (
        UniqueConstraint("company_profile_id", "sort_order", name="uq_signature_profile_order"),
    )


class PaymentMethod(Base):
    __tablename__ = "company_payment_methods"

    id: Mapped[int] = mapped_column(primary_key=True, index=True)
    company_profile_id: Mapped[int] = mapped_column(ForeignKey("company_profile.id", ondelete="CASCADE"), nullable=False, index=True, unique=True)
    bank_name: Mapped[str | None] = mapped_column(String(255), nullable=True)
    account_name: Mapped[str | None] = mapped_column(String(255), nullable=True)
    account_number: Mapped[str | None] = mapped_column(String(50), nullable=True)
    ifsc: Mapped[str | None] = mapped_column(String(20), nullable=True)
    branch: Mapped[str | None] = mapped_column(String(255), nullable=True)
    upi_id: Mapped[str | None] = mapped_column(String(100), nullable=True)
    qr_code: Mapped[str | None] = mapped_column(Text, nullable=True)
    swift_code: Mapped[str | None] = mapped_column(String(20), nullable=True)
    iban: Mapped[str | None] = mapped_column(String(50), nullable=True)
    is_default: Mapped[bool] = mapped_column(default=True, nullable=False)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now(), nullable=False)
    updated_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now(), nullable=False)

    company_profile: Mapped["CompanyProfile"] = relationship(back_populates="payment_method_rel")


class ContractTerm(Base):
    __tablename__ = "company_contract_terms"

    id: Mapped[int] = mapped_column(primary_key=True, index=True)
    company_profile_id: Mapped[int] = mapped_column(ForeignKey("company_profile.id", ondelete="CASCADE"), nullable=False, index=True)
    title: Mapped[str] = mapped_column(String(255), nullable=False)
    bullets: Mapped[list[str]] = mapped_column(JSON, nullable=False, default=list)
    sort_order: Mapped[int] = mapped_column(Integer, nullable=False, default=0)

    company_profile: Mapped["CompanyProfile"] = relationship(back_populates="contract_terms_rel")

    __table_args__ = (
        UniqueConstraint("company_profile_id", "sort_order", name="uq_contract_term_profile_order"),
    )