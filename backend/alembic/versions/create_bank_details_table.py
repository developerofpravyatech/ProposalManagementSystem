"""create company_bank_details table and move bank data from company_profile

Revision ID: create_bank_details_table
Revises: 
Create Date: 2026-09-19
"""
from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql

# revision identifiers, used by Alembic.
revision = 'create_bank_details_table'
down_revision = '0402831f4676'  # merge heads
branch_labels = None
depends_on = None


def upgrade() -> None:
    # Create company_bank_details table
    op.create_table(
        'company_bank_details',
        sa.Column('id', sa.Integer(), nullable=False, primary_key=True, index=True),
        sa.Column('company_profile_id', sa.Integer(), sa.ForeignKey('company_profile.id', ondelete='CASCADE'), nullable=False, unique=True, index=True),
        sa.Column('bank_name', sa.String(255), nullable=True),
        sa.Column('account_name', sa.String(255), nullable=True),
        sa.Column('account_number', sa.String(50), nullable=True),
        sa.Column('ifsc', sa.String(20), nullable=True),
        sa.Column('branch', sa.String(255), nullable=True),
        sa.Column('upi_id', sa.String(100), nullable=True),
        sa.Column('swift_code', sa.String(20), nullable=True),
        sa.Column('iban', sa.String(50), nullable=True),
        sa.Column('qr_code', sa.Text(), nullable=True),
        sa.Column('created_at', sa.DateTime(timezone=True), server_default=sa.func.now(), nullable=False),
        sa.Column('updated_at', sa.DateTime(timezone=True), server_default=sa.func.now(), onupdate=sa.func.now(), nullable=False),
    )

    # Migrate data from company_profile to company_bank_details
    op.execute("""
        INSERT INTO company_bank_details (
            company_profile_id, bank_name, account_name, account_number, 
            ifsc, branch, upi_id, swift_code, iban, qr_code,
            created_at, updated_at
        )
        SELECT 
            id, bank_name, bank_account_name, bank_account_number,
            bank_ifsc, bank_branch, upi_id, swift_code, iban, qr_code,
            created_at, updated_at
        FROM company_profile
        WHERE bank_name IS NOT NULL 
           OR bank_account_name IS NOT NULL
           OR bank_account_number IS NOT NULL
           OR bank_ifsc IS NOT NULL
           OR bank_branch IS NOT NULL
           OR upi_id IS NOT NULL
           OR swift_code IS NOT NULL
           OR iban IS NOT NULL
           OR qr_code IS NOT NULL
    """)

    # Drop bank columns from company_profile
    op.drop_column('company_profile', 'bank_name')
    op.drop_column('company_profile', 'bank_account_name')
    op.drop_column('company_profile', 'bank_account_number')
    op.drop_column('company_profile', 'bank_ifsc')
    op.drop_column('company_profile', 'bank_branch')
    op.drop_column('company_profile', 'upi_id')
    op.drop_column('company_profile', 'swift_code')
    op.drop_column('company_profile', 'iban')
    op.drop_column('company_profile', 'qr_code')


def downgrade() -> None:
    # Add bank columns back to company_profile
    op.add_column('company_profile', sa.Column('qr_code', sa.Text(), nullable=True))
    op.add_column('company_profile', sa.Column('iban', sa.String(50), nullable=True))
    op.add_column('company_profile', sa.Column('swift_code', sa.String(20), nullable=True))
    op.add_column('company_profile', sa.Column('upi_id', sa.String(100), nullable=True))
    op.add_column('company_profile', sa.Column('bank_branch', sa.String(255), nullable=True))
    op.add_column('company_profile', sa.Column('bank_ifsc', sa.String(20), nullable=True))
    op.add_column('company_profile', sa.Column('bank_account_number', sa.String(50), nullable=True))
    op.add_column('company_profile', sa.Column('bank_account_name', sa.String(255), nullable=True))
    op.add_column('company_profile', sa.Column('bank_name', sa.String(255), nullable=True))

    # Migrate data back
    op.execute("""
        UPDATE company_profile cp
        SET 
            bank_name = cbd.bank_name,
            bank_account_name = cbd.account_name,
            bank_account_number = cbd.account_number,
            bank_ifsc = cbd.ifsc,
            bank_branch = cbd.branch,
            upi_id = cbd.upi_id,
            swift_code = cbd.swift_code,
            iban = cbd.iban,
            qr_code = cbd.qr_code
        FROM company_bank_details cbd
        WHERE cp.id = cbd.company_profile_id
    """)

    # Drop company_bank_details table
    op.drop_table('company_bank_details')