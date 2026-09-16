from sqlalchemy import String, Text, ForeignKey, Integer, DateTime, func, UniqueConstraint
from sqlalchemy.orm import Mapped, mapped_column, relationship
from datetime import datetime
from app.database import Base


class CoreValue(Base):
    __tablename__ = "company_core_values"

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
    logo: Mapped[str | None] = mapped_column(Text, nullable=True)
    sort_order: Mapped[int] = mapped_column(Integer, nullable=False, default=0)

    company_profile: Mapped["CompanyProfile"] = relationship(back_populates="branch_offices_rel")

    __table_args__ = (
        UniqueConstraint("company_profile_id", "sort_order", name="uq_branch_office_profile_order"),
    )


class ThemeConfig(Base):
    __tablename__ = "company_theme_config"

    id: Mapped[int] = mapped_column(primary_key=True, index=True)
    company_profile_id: Mapped[int] = mapped_column(ForeignKey("company_profile.id", ondelete="CASCADE"), nullable=False, index=True, unique=True)
    section: Mapped[str] = mapped_column(String(50), nullable=False)
    icon_name: Mapped[str | None] = mapped_column(Text, nullable=True)

    company_profile: Mapped["CompanyProfile"] = relationship(back_populates="theme_config_rel")