"""merge_heads

Revision ID: 0402831f4676
Revises: 1a65c62d5e9e, e4f5a6b7c8d9
Create Date: 2026-09-18 15:34:01.493895

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = '0402831f4676'
down_revision: Union[str, Sequence[str], None] = ('1a65c62d5e9e', 'e4f5a6b7c8d9')
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Upgrade schema."""
    pass


def downgrade() -> None:
    """Downgrade schema."""
    pass
