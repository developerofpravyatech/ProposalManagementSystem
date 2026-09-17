"""add cover letter signature name designation date

Revision ID: a56c561fb407
Revises: d3e4f5a6b7c8
Create Date: 2026-09-17 16:57:47.669065

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = 'a56c561fb407'
down_revision: Union[str, Sequence[str], None] = 'd3e4f5a6b7c8'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    conn = op.get_context().connection

    def column_exists(t, c):
        return bool(conn.execute(
            sa.text("SELECT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = :t AND column_name = :c)")
            .bindparams(t=t, c=c)
        ).scalar())

    # Add cover_letter_signature_name column
    if not column_exists("company_profile", "cover_letter_signature_name"):
        op.add_column("company_profile", sa.Column("cover_letter_signature_name", sa.String(length=255), nullable=True))

    # Add cover_letter_signature_designation column
    if not column_exists("company_profile", "cover_letter_signature_designation"):
        op.add_column("company_profile", sa.Column("cover_letter_signature_designation", sa.String(length=255), nullable=True))

    # Add cover_letter_signature_date column
    if not column_exists("company_profile", "cover_letter_signature_date"):
        op.add_column("company_profile", sa.Column("cover_letter_signature_date", sa.String(length=50), nullable=True))


def downgrade() -> None:
    conn = op.get_context().connection

    def column_exists(t, c):
        return bool(conn.execute(
            sa.text("SELECT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = :t AND column_name = :c)")
            .bindparams(t=t, c=c)
        ).scalar())

    # Drop the columns in reverse order
    if column_exists("company_profile", "cover_letter_signature_date"):
        op.drop_column("company_profile", "cover_letter_signature_date")

    if column_exists("company_profile", "cover_letter_signature_designation"):
        op.drop_column("company_profile", "cover_letter_signature_designation")

    if column_exists("company_profile", "cover_letter_signature_name"):
        op.drop_column("company_profile", "cover_letter_signature_name")