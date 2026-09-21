"""make work_process_steps title nullable

Revision ID: a2b3c4d5e6f7
Revises: 51b2b7a1b2d5
Create Date: 2026-09-21 12:00:00.000000

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa

# revision identifiers, used by Alembic.
revision: str = 'a2b3c4d5e6f7'
down_revision: Union[str, Sequence[str], None] = '51b2b7a1b2d5'
branch_labels = None
depends_on = None


def upgrade() -> None:
    op.alter_column('company_work_process_steps', 'title', existing_type=sa.String(length=255), nullable=True)


def downgrade() -> None:
    op.alter_column('company_work_process_steps', 'title', existing_type=sa.String(length=255), nullable=False)
