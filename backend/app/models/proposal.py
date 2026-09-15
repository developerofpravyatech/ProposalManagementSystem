from sqlalchemy import String, DateTime, Date, Integer, Numeric, Text, Enum, ForeignKey, JSON, func
from sqlalchemy.orm import Mapped, mapped_column, relationship
from datetime import datetime
from enum import Enum as PyEnum
from app.database import Base


class ProposalType(str, PyEnum):
    profile_only = "profile_only"
    quotation_proposal = "quotation_proposal"


class ProposalStatus(str, PyEnum):
    sent = "sent"
    viewed = "viewed"
    accepted = "accepted"
    renewal_due = "renewal_due"
    renewed = "renewed"


class Proposal(Base):
    __tablename__ = "proposals"

    id: Mapped[int] = mapped_column(primary_key=True, index=True)
    type: Mapped[ProposalType] = mapped_column(Enum(ProposalType, name="proposal_type"), nullable=False)
    proposal_no: Mapped[str | None] = mapped_column(String(50), nullable=True, index=True)
    client_name: Mapped[str] = mapped_column(String(255), nullable=False)
    company_name: Mapped[str | None] = mapped_column(String(255), nullable=True)
    phone: Mapped[str | None] = mapped_column(String(50), nullable=True)
    email: Mapped[str | None] = mapped_column(String(255), nullable=True)
    project_title: Mapped[str | None] = mapped_column(String(500), nullable=True)
    project_subtitle: Mapped[str | None] = mapped_column(String(500), nullable=True)
    amount: Mapped[float | None] = mapped_column(Numeric(10, 2), nullable=True)
    currency: Mapped[str | None] = mapped_column(String(10), nullable=True)
    currency_symbol: Mapped[str | None] = mapped_column(String(10), nullable=True)
    contract_duration: Mapped[str | None] = mapped_column(String(100), nullable=True)
    renewal_date: Mapped[datetime | None] = mapped_column(Date, nullable=True)
    terms: Mapped[str | None] = mapped_column(Text, nullable=True)
    line_items: Mapped[list | None] = mapped_column(JSON, nullable=True)
    content: Mapped[dict | None] = mapped_column(JSON, nullable=True)
    pdf_path: Mapped[str | None] = mapped_column(String(500), nullable=True)
    unique_token: Mapped[str] = mapped_column(String(255), unique=True, nullable=False, index=True)
    sent_at: Mapped[datetime | None] = mapped_column(DateTime(timezone=True), nullable=True)
    first_opened_at: Mapped[datetime | None] = mapped_column(DateTime(timezone=True), nullable=True)
    last_opened_at: Mapped[datetime | None] = mapped_column(DateTime(timezone=True), nullable=True)
    view_count: Mapped[int] = mapped_column(Integer, default=0, nullable=False)
    pdf_downloaded_at: Mapped[datetime | None] = mapped_column(DateTime(timezone=True), nullable=True)
    accepted_by: Mapped[str | None] = mapped_column(String(255), nullable=True)
    accepted_at: Mapped[datetime | None] = mapped_column(DateTime(timezone=True), nullable=True)
    signature_data: Mapped[str | None] = mapped_column(Text, nullable=True)
    status: Mapped[ProposalStatus] = mapped_column(Enum(ProposalStatus, name="proposal_status"), default=ProposalStatus.sent, nullable=False, index=True)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now(), nullable=False)
    updated_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now(), nullable=False)

    views: Mapped[list["ProposalView"]] = relationship("ProposalView", back_populates="proposal", cascade="all, delete-orphan")


class ProposalView(Base):
    __tablename__ = "proposal_views"

    id: Mapped[int] = mapped_column(primary_key=True, index=True)
    proposal_id: Mapped[int] = mapped_column(ForeignKey("proposals.id", ondelete="CASCADE"), nullable=False, index=True)
    viewed_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now(), nullable=False)
    ip_address: Mapped[str | None] = mapped_column(String(45), nullable=True)
    user_agent: Mapped[str | None] = mapped_column(Text, nullable=True)

    proposal: Mapped["Proposal"] = relationship("Proposal", back_populates="views")
