from sqlalchemy import Text, ForeignKey, DateTime, func
from sqlalchemy.orm import Mapped, mapped_column, relationship
from datetime import datetime
from app.database import Base


class ProposalContent(Base):
    __tablename__ = "proposal_content"

    id: Mapped[int] = mapped_column(primary_key=True, index=True)
    proposal_id: Mapped[int] = mapped_column(ForeignKey("proposals.id", ondelete="CASCADE"), nullable=False, unique=True, index=True)
    cover: Mapped[str | None] = mapped_column(Text, nullable=True)
    cover_letter: Mapped[str | None] = mapped_column(Text, nullable=True)
    company_profile: Mapped[str | None] = mapped_column(Text, nullable=True)
    services: Mapped[str | None] = mapped_column(Text, nullable=True)
    process: Mapped[str | None] = mapped_column(Text, nullable=True)
    terms: Mapped[str | None] = mapped_column(Text, nullable=True)
    clients: Mapped[str | None] = mapped_column(Text, nullable=True)
    pricing: Mapped[str | None] = mapped_column(Text, nullable=True)
    payment_methods: Mapped[str | None] = mapped_column(Text, nullable=True)
    acceptance: Mapped[str | None] = mapped_column(Text, nullable=True)
    branches: Mapped[str | None] = mapped_column(Text, nullable=True)
    closing_statement: Mapped[str | None] = mapped_column(Text, nullable=True)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now(), nullable=False)
    updated_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now(), nullable=False)

    proposal: Mapped["Proposal"] = relationship("Proposal", back_populates="content_data")
