"""merge heads

Revision ID: merge_heads_2
Revises: create_regional_clients_table, a1b2c3d4e5f7
Create Date: 2026-09-21
"""
from alembic import op

# revision identifiers, used by Alembic.
revision = 'merge_heads_2'
down_revision = ('create_regional_clients_table', 'a1b2c3d4e5f7')
branch_labels = None
depends_on = None


def upgrade() -> None:
    pass


def downgrade() -> None:
    pass