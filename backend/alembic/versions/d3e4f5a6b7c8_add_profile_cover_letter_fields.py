"""add profile and cover letter fields to company_profile

Revision ID: d3e4f5a6b7c8
Revises: c3d4e5f6a7b8
Create Date: 2026-09-17 16:41:43.000000

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = "d3e4f5a6b7c8"
down_revision: Union[str, Sequence[str], None] = "c3d4e5f6a7b8"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    conn = op.get_context().connection

    def column_exists(t, c):
        return bool(conn.execute(
            sa.text("SELECT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = :t AND column_name = :c)")
            .bindparams(t=t, c=c)
        ).scalar())

    # Add profile_paragraphs column
    if not column_exists("company_profile", "profile_paragraphs"):
        op.add_column("company_profile", sa.Column("profile_paragraphs", sa.JSON(), nullable=True))

    # Add cover_letter_salutation column
    if not column_exists("company_profile", "cover_letter_salutation"):
        op.add_column("company_profile", sa.Column("cover_letter_salutation", sa.Text(), nullable=True))

    # Add cover_letter_paragraphs column
    if not column_exists("company_profile", "cover_letter_paragraphs"):
        op.add_column("company_profile", sa.Column("cover_letter_paragraphs", sa.JSON(), nullable=True))

    # Add cover_letter_signoff column
    if not column_exists("company_profile", "cover_letter_signoff"):
        op.add_column("company_profile", sa.Column("cover_letter_signoff", sa.Text(), nullable=True))


def downgrade() -> None:
    conn = op.get_context().connection

    def column_exists(t, c):
        return bool(conn.execute(
            sa.text("SELECT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = :t AND column_name = :c)")
            .bindparams(t=t, c=c)
        ).scalar())

    # Drop the columns in reverse order
    if column_exists("company_profile", "cover_letter_signoff"):
        op.drop_column("company_profile", "cover_letter_signoff")

    if column_exists("company_profile", "cover_letter_paragraphs"):
        op.drop_column("company_profile", "cover_letter_paragraphs")

    if column_exists("company_profile", "cover_letter_salutation"):
        op.drop_column("company_profile", "cover_letter_salutation")

    if column_exists("company_profile", "profile_paragraphs"):
        op.drop_column("company_profile", "profile_paragraphs")