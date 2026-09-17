"""add cover letter signature image

Revision ID: 1a65c62d5e9e
Revises: a56c561fb407
Create Date: 2026-09-17 17:13:47.828107

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = '1a65c62d5e9e'
down_revision: Union[str, Sequence[str], None] = 'a56c561fb407'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    conn = op.get_context().connection

    def column_exists(t, c):
        return bool(conn.execute(
            sa.text("SELECT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = :t AND column_name = :c)")
            .bindparams(t=t, c=c)
        ).scalar())

    # Add cover_letter_signature_image column
    if not column_exists("company_profile", "cover_letter_signature_image"):
        op.add_column("company_profile", sa.Column("cover_letter_signature_image", sa.Text(), nullable=True))


def downgrade() -> None:
    conn = op.get_context().connection

    def column_exists(t, c):
        return bool(conn.execute(
            sa.text("SELECT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = :t AND column_name = :c)")
            .bindparams(t=t, c=c)
        ).scalar())

    # Drop the column
    if column_exists("company_profile", "cover_letter_signature_image"):
        op.drop_column("company_profile", "cover_letter_signature_image")