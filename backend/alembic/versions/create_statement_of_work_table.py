"""create company_statement_of_work table and migrate data from JSON

Revision ID: create_statement_of_work_table
Revises: add_statement_of_work_fields
Create Date: 2026-09-21 09:15:00.000000
"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


revision: str = "create_statement_of_work_table"
down_revision: Union[str, Sequence[str], None] = "add_statement_of_work_fields"
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

    if not table_exists("company_statement_of_work"):
        op.create_table(
            "company_statement_of_work",
            sa.Column("id", sa.Integer(), nullable=False, primary_key=True, index=True),
            sa.Column("company_profile_id", sa.Integer(), sa.ForeignKey("company_profile.id", ondelete="CASCADE"), nullable=False, index=True),
            sa.Column("sort_order", sa.Integer(), nullable=False, default=0),
            sa.Column("heading", sa.String(255), nullable=False),
            sa.Column("description", sa.Text(), nullable=False),
        )
        op.create_unique_constraint(
            "uq_sow_profile_order",
            "company_statement_of_work",
            ["company_profile_id", "sort_order"]
        )

    if column_exists("company_profile", "statement_of_work"):
        result = conn.execute(sa.text("SELECT id, statement_of_work FROM company_profile WHERE statement_of_work IS NOT NULL"))
        for row in result:
            profile_id = row[0]
            items = row[1]
            if isinstance(items, str):
                import json
                try:
                    items = json.loads(items)
                except (json.JSONDecodeError, TypeError):
                    items = None
            if isinstance(items, list):
                for i, item in enumerate(items):
                    if isinstance(item, dict):
                        heading = item.get("title") or item.get("heading") or ""
                        description = item.get("description") or ""
                        if heading:
                            conn.execute(
                                sa.text("INSERT INTO company_statement_of_work (company_profile_id, sort_order, heading, description) VALUES (:pid, :ord, :heading, :desc)"),
                                {"pid": profile_id, "ord": i, "heading": heading, "desc": description}
                            )
        op.drop_column("company_profile", "statement_of_work")


def downgrade() -> None:
    def table_exists(name):
        return bool(op.get_context().connection.execute(
            sa.text("SELECT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = :name)")
            .bindparams(name=name)
        ).scalar())

    def column_exists(t, c):
        return bool(op.get_context().connection.execute(
            sa.text("SELECT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = :t AND column_name = :c)")
            .bindparams(t=t, c=c)
        ).scalar())

    if not column_exists("company_profile", "statement_of_work"):
        op.add_column("company_profile", sa.Column("statement_of_work", sa.JSON(), nullable=True))

        if table_exists("company_statement_of_work"):
            conn = op.get_context().connection
            result = conn.execute(sa.text("SELECT company_profile_id, sort_order, heading, description FROM company_statement_of_work ORDER BY company_profile_id, sort_order"))
            data_map = {}
            for row in result:
                profile_id = row[0]
                if profile_id not in data_map:
                    data_map[profile_id] = []
                data_map[profile_id].append({
                    "title": row[2],
                    "description": row[3],
                })
            for profile_id, items in data_map.items():
                conn.execute(
                    sa.text("UPDATE company_profile SET statement_of_work = :data WHERE id = :pid"),
                    {"data": __import__("json").dumps(items), "pid": profile_id}
                )

    if table_exists("company_statement_of_work"):
        op.drop_constraint("uq_sow_profile_order", "company_statement_of_work", type_="unique")
        op.drop_table("company_statement_of_work")
