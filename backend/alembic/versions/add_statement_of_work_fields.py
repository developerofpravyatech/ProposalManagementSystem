"""add statement_of_work field to company_profile

Revision ID: add_statement_of_work_fields
Revises: merge_heads_2
Create Date: 2026-09-21 09:00:00.000000
"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = "add_statement_of_work_fields"
down_revision: Union[str, Sequence[str], None] = "merge_heads_2"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    conn = op.get_context().connection

    def column_exists(t, c):
        return bool(conn.execute(
            sa.text("SELECT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = :t AND column_name = :c)")
            .bindparams(t=t, c=c)
        ).scalar())

    if not column_exists("company_profile", "statement_of_work"):
        op.add_column("company_profile", sa.Column("statement_of_work", sa.JSON(), nullable=True))


def downgrade() -> None:
    conn = op.get_context().connection

    def column_exists(t, c):
        return bool(conn.execute(
            sa.text("SELECT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = :t AND column_name = :c)")
            .bindparams(t=t, c=c)
        ).scalar())

    if column_exists("company_profile", "statement_of_work"):
        op.drop_column("company_profile", "statement_of_work")
