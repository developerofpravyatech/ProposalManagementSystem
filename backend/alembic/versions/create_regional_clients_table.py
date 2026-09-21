"""create company_regional_clients table

Revision ID: create_regional_clients_table
Revises: create_bank_details_table
Create Date: 2026-09-21
"""
from alembic import op
import sqlalchemy as sa

# revision identifiers, used by Alembic.
revision = 'create_regional_clients_table'
down_revision = 'create_bank_details_table'
branch_labels = None
depends_on = None


def upgrade() -> None:
    # Create company_regional_clients table
    op.create_table(
        'company_regional_clients',
        sa.Column('id', sa.Integer(), nullable=False, primary_key=True, index=True),
        sa.Column('company_profile_id', sa.Integer(), sa.ForeignKey('company_profile.id', ondelete='CASCADE'), nullable=False, index=True),
        sa.Column('name', sa.String(255), nullable=False),
        sa.Column('logo', sa.Text(), nullable=True),
        sa.Column('sort_order', sa.Integer(), nullable=False, default=0),
    )

    # Create unique constraint
    op.create_unique_constraint(
        'uq_regional_client_profile_order',
        'company_regional_clients',
        ['company_profile_id', 'sort_order']
    )


def downgrade() -> None:
    op.drop_table('company_regional_clients')