from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from sqlalchemy import func

from app.models.client import Client


async def get_clients(db: AsyncSession, skip: int = 0, limit: int = 50, search: str | None = None):
    query = select(Client)
    if search:
        query = query.where(
            (Client.client_name.ilike(f"%{search}%"))
            | (Client.company_name.ilike(f"%{search}%"))
            | (Client.email.ilike(f"%{search}%"))
        )
    query = query.order_by(Client.created_at.desc()).offset(skip).limit(limit)
    result = await db.execute(query)
    return result.scalars().all()


async def get_client_by_id(db: AsyncSession, client_id: int) -> Client | None:
    result = await db.execute(select(Client).where(Client.id == client_id))
    return result.scalar_one_or_none()


async def create_client(db: AsyncSession, client_data: dict) -> Client:
    client = Client(**client_data)
    db.add(client)
    await db.commit()
    await db.refresh(client)
    return client


async def update_client(db: AsyncSession, client_id: int, update_data: dict) -> Client | None:
    client = await get_client_by_id(db, client_id)
    if not client:
        return None
    for key, value in update_data.items():
        if value is not None and hasattr(client, key):
            setattr(client, key, value)
    await db.commit()
    await db.refresh(client)
    return client


async def delete_client(db: AsyncSession, client_id: int) -> bool:
    client = await get_client_by_id(db, client_id)
    if not client:
        return False
    await db.delete(client)
    await db.commit()
    return True
