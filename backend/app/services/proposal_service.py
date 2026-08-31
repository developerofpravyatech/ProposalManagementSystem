import secrets
import string
from datetime import datetime
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from sqlalchemy import func

from app.models.proposal import Proposal, ProposalView, ProposalStatus


def generate_token(length=32) -> str:
    alphabet = string.ascii_letters + string.digits
    return "".join(secrets.choice(alphabet) for _ in range(length))


async def get_next_proposal_number(db: AsyncSession) -> str:
    year = datetime.now().year
    result = await db.execute(select(func.count(Proposal.id)).where(Proposal.created_at >= datetime(year, 1, 1)))
    count = result.scalar_one() or 0
    return f"PT-{year}-{count + 1:03d}"


async def create_proposal(db: AsyncSession, proposal_data: dict) -> Proposal:
    proposal_number = await get_next_proposal_number(db)
    unique_token = generate_token()
    proposal = Proposal(
        **proposal_data,
        proposal_no=proposal_number,
        unique_token=unique_token,
        status=ProposalStatus.sent,
    )
    db.add(proposal)
    await db.commit()
    await db.refresh(proposal)
    return proposal


async def get_proposals(db: AsyncSession, skip: int = 0, limit: int = 50, status: str | None = None, search: str | None = None):
    query = select(Proposal)
    if status:
        query = query.where(Proposal.status == status)
    if search:
        query = query.where(
            (Proposal.client_name.ilike(f"%{search}%"))
            | (Proposal.company_name.ilike(f"%{search}%"))
            | (Proposal.proposal_no.ilike(f"%{search}%"))
            | (Proposal.unique_token.ilike(f"%{search}%"))
        )
    query = query.order_by(Proposal.created_at.desc()).offset(skip).limit(limit)
    result = await db.execute(query)
    return result.scalars().all()


async def get_proposal_by_id(db: AsyncSession, proposal_id: int) -> Proposal | None:
    result = await db.execute(select(Proposal).where(Proposal.id == proposal_id))
    return result.scalar_one_or_none()


async def get_proposal_by_token(db: AsyncSession, token: str) -> Proposal | None:
    result = await db.execute(select(Proposal).where(Proposal.unique_token == token))
    return result.scalar_one_or_none()


async def update_proposal(db: AsyncSession, proposal_id: int, update_data: dict) -> Proposal | None:
    proposal = await get_proposal_by_id(db, proposal_id)
    if not proposal:
        return None
    for key, value in update_data.items():
        if value is not None and hasattr(proposal, key):
            setattr(proposal, key, value)
    await db.commit()
    await db.refresh(proposal)
    return proposal


async def delete_proposal(db: AsyncSession, proposal_id: int) -> bool:
    proposal = await get_proposal_by_id(db, proposal_id)
    if not proposal:
        return False
    await db.delete(proposal)
    await db.commit()
    return True


async def record_view(db: AsyncSession, proposal_id: int, ip_address: str | None, user_agent: str | None) -> ProposalView:
    view = ProposalView(proposal_id=proposal_id, ip_address=ip_address, user_agent=user_agent)
    db.add(view)
    proposal = await get_proposal_by_id(db, proposal_id)
    if proposal:
        proposal.view_count += 1
        proposal.last_opened_at = datetime.now()
        if proposal.first_opened_at is None:
            proposal.first_opened_at = datetime.now()
        if proposal.status == ProposalStatus.sent:
            proposal.status = ProposalStatus.viewed
    await db.commit()
    await db.refresh(view)
    return view


async def get_analytics(db: AsyncSession, proposal_id: int):
    proposal = await get_proposal_by_id(db, proposal_id)
    if not proposal:
        return None
    views_query = select(ProposalView).where(ProposalView.proposal_id == proposal_id).order_by(ProposalView.viewed_at.desc())
    result = await db.execute(views_query)
    events = result.scalars().all()
    return {
        "total_views": proposal.view_count,
        "unique_devices": len({(v.ip_address, v.user_agent) for v in events if v.ip_address}),
        "first_opened_at": proposal.first_opened_at,
        "last_opened_at": proposal.last_opened_at,
        "downloaded": proposal.pdf_path is not None,
        "downloaded_at": None,
        "events": events,
    }
