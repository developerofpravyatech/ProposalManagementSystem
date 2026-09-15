from sqlalchemy import String, Text, JSON, DateTime, func
from sqlalchemy.orm import Mapped, mapped_column
from datetime import datetime
from app.database import Base


class CompanyProfile(Base):
    __tablename__ = "company_profile"

    id: Mapped[int] = mapped_column(primary_key=True, index=True)
    company_name: Mapped[str] = mapped_column(String(255), nullable=False, default="PRAVYA TECH Solutions")
    tagline: Mapped[str | None] = mapped_column(String(500), nullable=True)
    email: Mapped[str | None] = mapped_column(String(255), nullable=True)
    phone: Mapped[str | None] = mapped_column(String(50), nullable=True)
    website: Mapped[str | None] = mapped_column(String(255), nullable=True)
    address: Mapped[str | None] = mapped_column(Text, nullable=True)
    sales_head_name: Mapped[str | None] = mapped_column(String(255), nullable=True)
    sales_head_title: Mapped[str | None] = mapped_column(String(255), nullable=True)
    mission: Mapped[str | None] = mapped_column(Text, nullable=True)
    vision: Mapped[str | None] = mapped_column(Text, nullable=True)
    core_values: Mapped[list | None] = mapped_column(JSON, nullable=True)
    services: Mapped[list | None] = mapped_column(JSON, nullable=True)
    bni_clients: Mapped[list | None] = mapped_column(JSON, nullable=True)
    international_clients: Mapped[list | None] = mapped_column(JSON, nullable=True)
    branch_offices: Mapped[list | None] = mapped_column(JSON, nullable=True)
    logo_data: Mapped[str | None] = mapped_column(Text, nullable=True)
    logo_url: Mapped[str | None] = mapped_column(String(500), nullable=True)
    qr_code: Mapped[str | None] = mapped_column(Text, nullable=True)
    primary_color: Mapped[str | None] = mapped_column(String(20), nullable=True, default="#4F46E5")
    secondary_color: Mapped[str | None] = mapped_column(String(20), nullable=True, default="#0F172A")
    accent_color: Mapped[str | None] = mapped_column(String(20), nullable=True, default="#10B981")
    theme_config: Mapped[dict | None] = mapped_column(JSON, nullable=True)
    terms: Mapped[str | None] = mapped_column(Text, nullable=True)
    
    # Bank Details for Payment Methods Page
    bank_name: Mapped[str | None] = mapped_column(String(255), nullable=True)
    bank_account_name: Mapped[str | None] = mapped_column(String(255), nullable=True)
    bank_account_number: Mapped[str | None] = mapped_column(String(50), nullable=True)
    bank_ifsc: Mapped[str | None] = mapped_column(String(20), nullable=True)
    bank_branch: Mapped[str | None] = mapped_column(String(255), nullable=True)
    upi_id: Mapped[str | None] = mapped_column(String(100), nullable=True)
    swift_code: Mapped[str | None] = mapped_column(String(20), nullable=True)
    iban: Mapped[str | None] = mapped_column(String(50), nullable=True)
    
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now(), nullable=False)
    updated_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now(), nullable=False)
