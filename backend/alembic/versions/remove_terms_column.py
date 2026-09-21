"""remove company profile terms data

Revision ID: a1b2c3d4e5f7
Revises: create_bank_details_table
Create Date: 2026-09-21 05:10:00.000000

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql


# revision identifiers, used by Alembic.
revision: str = 'a1b2c3d4e5f7'
down_revision: Union[str, Sequence[str], None] = 'create_bank_details_table'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Remove company profile terms data."""
    op.drop_table('company_contract_terms')
    op.drop_column('company_profile', 'terms')


def downgrade() -> None:
    """Restore company profile terms data."""
    op.add_column('company_profile', sa.Column('terms', sa.Text(), nullable=True))
    op.create_table(
        'company_contract_terms',
        sa.Column('id', sa.Integer(), primary_key=True, autoincrement=True),
        sa.Column('company_profile_id', sa.Integer(), sa.ForeignKey('company_profile.id', ondelete='CASCADE'), nullable=False),
        sa.Column('title', sa.String(length=255), nullable=False),
        sa.Column('bullets', postgresql.JSONB(), nullable=False, server_default=sa.text("'[]'::jsonb")),
        sa.Column('sort_order', sa.Integer(), nullable=False, server_default=sa.text('0')),
        sa.UniqueConstraint('company_profile_id', 'sort_order', name='uq_contract_term_profile_order'),
    )
