"""Replace JSON columns with relational tables for line_items and content

Revision ID: 9a1b2c3d4e5f
Revises: 8f6d2c4a9b10
Create Date: 2026-09-15 12:00:00.000000

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


revision: str = "9a1b2c3d4e5f"
down_revision: Union[str, Sequence[str], None] = "8f6d2c4a9b10"
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

    if not table_exists("proposal_content"):
        op.create_table(
            "proposal_content",
            sa.Column("id", sa.BigInteger(), primary_key=True),
            sa.Column("proposal_id", sa.BigInteger(), sa.ForeignKey("proposals.id", ondelete="CASCADE"), nullable=False, unique=True, index=True),
            sa.Column("cover", sa.Text(), nullable=True),
            sa.Column("cover_letter", sa.Text(), nullable=True),
            sa.Column("company_profile", sa.Text(), nullable=True),
            sa.Column("services", sa.Text(), nullable=True),
            sa.Column("process", sa.Text(), nullable=True),
            sa.Column("terms", sa.Text(), nullable=True),
            sa.Column("clients", sa.Text(), nullable=True),
            sa.Column("pricing", sa.Text(), nullable=True),
            sa.Column("payment_methods", sa.Text(), nullable=True),
            sa.Column("acceptance", sa.Text(), nullable=True),
            sa.Column("branches", sa.Text(), nullable=True),
            sa.Column("closing_statement", sa.Text(), nullable=True),
            sa.Column("created_at", sa.DateTime(timezone=True), server_default=sa.text("now()"), nullable=False),
            sa.Column("updated_at", sa.DateTime(timezone=True), server_default=sa.text("now()"), nullable=False),
        )
        op.create_index(op.f("ix_proposal_content_proposal_id"), "proposal_content", ["proposal_id"], unique=True)

    if not table_exists("proposal_line_items"):
        op.create_table(
            "proposal_line_items",
            sa.Column("id", sa.BigInteger(), primary_key=True),
            sa.Column("proposal_id", sa.BigInteger(), sa.ForeignKey("proposals.id", ondelete="CASCADE"), nullable=False, index=True),
            sa.Column("title", sa.String(length=500), nullable=False),
            sa.Column("description", sa.String(length=1000), nullable=True),
            sa.Column("quantity", sa.Integer(), nullable=False, server_default=sa.text("1")),
            sa.Column("unit_price", sa.Numeric(10, 2), nullable=True),
            sa.Column("subtotal", sa.Numeric(10, 2), nullable=True),
            sa.Column("currency", sa.String(length=10), nullable=True),
            sa.Column("created_at", sa.DateTime(timezone=True), server_default=sa.text("now()"), nullable=False),
            sa.Column("updated_at", sa.DateTime(timezone=True), server_default=sa.text("now()"), nullable=False),
        )
        op.create_index(op.f("ix_proposal_line_items_proposal_id"), "proposal_line_items", ["proposal_id"], unique=False)

    if column_exists("proposals", "content"):
        op.drop_column("proposals", "content")
    if column_exists("proposals", "line_items"):
        op.drop_column("proposals", "line_items")


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

    if not column_exists("proposals", "line_items"):
        op.add_column("proposals", sa.Column("line_items", sa.JSON(), nullable=True))
    if not column_exists("proposals", "content"):
        op.add_column("proposals", sa.Column("content", sa.JSON(), nullable=True))

    if table_exists("proposal_line_items"):
        op.drop_index(op.f("ix_proposal_line_items_proposal_id"), table_name="proposal_line_items")
        op.drop_table("proposal_line_items")

    if table_exists("proposal_content"):
        op.drop_index(op.f("ix_proposal_content_proposal_id"), table_name="proposal_content")
        op.drop_table("proposal_content")
