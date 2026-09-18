"""remove_logo_from_branch_offices

Revision ID: e4f5a6b7c8d9
Revises: d3e4f5a6b7c8
Create Date: 2026-09-18 09:55:00.000000

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = 'e4f5a6b7c8d9'
down_revision: Union[str, Sequence[str], None] = 'd3e4f5a6b7c8'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Upgrade schema."""
    conn = op.get_context().connection

    def column_exists(t, c):
        return bool(conn.execute(
            sa.text("SELECT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = :t AND column_name = :c)")
            .bindparams(t=t, c=c)
        ).scalar())

    # Remove logo column from company_branch_offices
    if column_exists("company_branch_offices", "logo"):
        op.drop_column("company_branch_offices", "logo")


def downgrade() -> None:
    """Downgrade schema."""
    conn = op.get_context().connection

    def column_exists(t, c):
        return bool(conn.execute(
            sa.text("SELECT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = :t AND column_name = :c)")
            .bindparams(t=t, c=c)
        ).scalar())

    # Add logo column back
    if not column_exists("company_branch_offices", "logo"):
        op.add_column("company_branch_offices", sa.Column("logo", sa.Text(), nullable=True))