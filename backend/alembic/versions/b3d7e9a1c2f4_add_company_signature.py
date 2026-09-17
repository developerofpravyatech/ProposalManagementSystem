"""add company signature

Revision ID: b3d7e9a1c2f4
Revises: 82aaef6d6477
Create Date: 2026-09-17 08:45:00.000000

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


revision: str = "b3d7e9a1c2f4"
down_revision: Union[str, Sequence[str], None] = "82aaef6d6477"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.add_column("company_profile", sa.Column("signature_data", sa.Text(), nullable=True))


def downgrade() -> None:
    op.drop_column("company_profile", "signature_data")
