"""add signature table and remove signature_data column

Revision ID: a1b2c3d4e5f6
Revises: b3d7e9a1c2f4
Create Date: 2026-09-17 09:00:00.000000

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql


# revision identifiers, used by Alembic.
revision: str = "a1b2c3d4e5f6"
down_revision: Union[str, Sequence[str], None] = "b3d7e9a1c2f4"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    conn = op.get_context().connection

    def table_exists(name):
        return bool(conn.execute(
            sa.text("SELECT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = :name)")
            .bindparams(name=name)
        ).scalar())

    def column_exists(t, c):
        return bool(conn.execute(
            sa.text("SELECT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = :t AND column_name = :c)")
            .bindparams(t=t, c=c)
        ).scalar())

    # Create company_signatures table
    if not table_exists("company_signatures"):
        op.create_table(
            "company_signatures",
            sa.Column("id", sa.BigInteger(), primary_key=True),
            sa.Column("company_profile_id", sa.BigInteger(), sa.ForeignKey("company_profile.id", ondelete="CASCADE"), nullable=False, index=True),
            sa.Column("image_data", sa.Text(), nullable=True),
            sa.Column("sort_order", sa.Integer(), nullable=False, server_default=sa.text("0")),
            sa.UniqueConstraint("company_profile_id", "sort_order", name="uq_signature_profile_order"),
        )

    # Drop signature_data column from company_profile
    if column_exists("company_profile", "signature_data"):
        op.drop_column("company_profile", "signature_data")


def downgrade() -> None:
    conn = op.get_context().connection

    def table_exists(name):
        return bool(conn.execute(
            sa.text("SELECT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = :name)")
            .bindparams(name=name)
        ).scalar())

    def column_exists(t, c):
        return bool(conn.execute(
            sa.text("SELECT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = :t AND column_name = :c)")
            .bindparams(t=t, c=c)
        ).scalar())

    # Add back signature_data column
    if not column_exists("company_profile", "signature_data"):
        op.add_column("company_profile", sa.Column("signature_data", sa.Text(), nullable=True))

    # Drop company_signatures table
    if table_exists("company_signatures"):
        op.drop_table("company_signatures")