"""Add structured proposal content and payment QR

Revision ID: 8f6d2c4a9b10
Revises: 45c14526050a
Create Date: 2026-09-15 11:06:00.000000

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


revision: str = "8f6d2c4a9b10"
down_revision: Union[str, Sequence[str], None] = "45c14526050a"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.add_column("proposals", sa.Column("content", sa.JSON(), nullable=True))
    op.add_column("company_profile", sa.Column("qr_code", sa.Text(), nullable=True))


def downgrade() -> None:
    op.drop_column("company_profile", "qr_code")
    op.drop_column("proposals", "content")
