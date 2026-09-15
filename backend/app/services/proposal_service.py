import secrets
import string
import json
from datetime import datetime
from enum import Enum
from typing import Optional
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from sqlalchemy import func

from app.models.proposal import Proposal, ProposalView, ProposalStatus
from app.models.line_item import ProposalLineItem
from app.models.proposal_content import ProposalContent


def generate_token(length=32) -> str:
    alphabet = string.ascii_letters + string.digits
    return "".join(secrets.choice(alphabet) for _ in range(length))


async def get_next_proposal_number(db: AsyncSession) -> str:
    year = datetime.now().year
    result = await db.execute(select(func.count(Proposal.id)).where(Proposal.created_at >= datetime(year, 1, 1)))
    count = result.scalar_one() or 0
    return f"PT-{year}-{count + 1:03d}"


def _serialize_section(data: Optional[dict]) -> Optional[str]:
    if data is None:
        return None
    return json.dumps(data)


def _deserialize_section(data: Optional[str]) -> Optional[dict]:
    if data is None:
        return None
    try:
        return json.loads(data)
    except (json.JSONDecodeError, TypeError):
        return None


async def _sync_line_items(db: AsyncSession, proposal: Proposal, items: list) -> None:
    existing = await db.execute(
        select(ProposalLineItem).where(ProposalLineItem.proposal_id == proposal.id)
    )
    existing_items = existing.scalars().all()
    for item in existing_items:
        await db.delete(item)
    for idx, item in enumerate(items or []):
        line_item = ProposalLineItem(
            proposal_id=proposal.id,
            title=item.get("title", item.get("name", "")) if isinstance(item, dict) else str(item),
            description=item.get("description", "") if isinstance(item, dict) else "",
            quantity=item.get("quantity", 1) if isinstance(item, dict) else 1,
            unit_price=item.get("unit_price", item.get("price")) if isinstance(item, dict) else None,
            subtotal=item.get("subtotal", item.get("total_price")) if isinstance(item, dict) else None,
            currency=item.get("currency") if isinstance(item, dict) else None,
        )
        db.add(line_item)
    if items:
        await db.flush()


async def _sync_content(db: AsyncSession, proposal: Proposal, content: Optional[dict]) -> None:
    section_keys = [
        "cover", "cover_letter", "company_profile", "services", "process",
        "terms", "clients", "pricing", "payment_methods", "acceptance",
        "branches", "closing_statement",
    ]
    existing = await db.execute(
        select(ProposalContent).where(ProposalContent.proposal_id == proposal.id)
    )
    content_record = existing.scalar_one_or_none()
    if content_record is None:
        content_record = ProposalContent(proposal_id=proposal.id)
        db.add(content_record)
    for key in section_keys:
        value = content.get(key) if content else None
        setattr(content_record, key, _serialize_section(value) if isinstance(value, dict) else (_serialize_section(value) if value else None))
    await db.flush()


async def create_proposal(db: AsyncSession, proposal_data: dict) -> Proposal:
    proposal_number = await get_next_proposal_number(db)
    unique_token = generate_token()
    clean_data = {}
    for key, value in proposal_data.items():
        if isinstance(value, Enum):
            clean_data[key] = value.value
        else:
            clean_data[key] = value
    line_items = clean_data.pop("line_items", None)
    content = clean_data.pop("content", None)
    proposal = Proposal(
        **clean_data,
        proposal_no=proposal_number,
        unique_token=unique_token,
        status=ProposalStatus.sent,
    )
    db.add(proposal)
    await db.flush()
    if line_items is not None:
        await _sync_line_items(db, proposal, line_items)
    if content is not None:
        await _sync_content(db, proposal, content)
    await db.commit()
    await db.refresh(proposal)
    await _load_relations(db, proposal)
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
    proposals = result.scalars().all()
    for proposal in proposals:
        await _load_relations(db, proposal)
    return proposals


async def _load_relations(db: AsyncSession, proposal: Proposal) -> None:
    items = await db.execute(select(ProposalLineItem).where(ProposalLineItem.proposal_id == proposal.id))
    proposal.line_items = [
        {
            "id": item.id,
            "title": item.title,
            "description": item.description,
            "quantity": item.quantity,
            "unit_price": float(item.unit_price) if item.unit_price else None,
            "subtotal": float(item.subtotal) if item.subtotal else None,
            "currency": item.currency,
        }
        for item in items.scalars().all()
    ]
    content_record = await db.execute(select(ProposalContent).where(ProposalContent.proposal_id == proposal.id))
    content_data = content_record.scalar_one_or_none()
    if content_data:
        proposal.content = _deserialize_all_content(content_data)
    else:
        proposal.content = None


def _deserialize_all_content(content_record: ProposalContent) -> dict:
    result = {}
    for key in ["cover", "cover_letter", "company_profile", "services", "process",
                 "terms", "clients", "pricing", "payment_methods", "acceptance",
                 "branches", "closing_statement"]:
        raw = getattr(content_record, key, None)
        if raw:
            result[key] = _deserialize_section(raw)
    return result


async def get_proposal_by_id(db: AsyncSession, proposal_id: int) -> Proposal | None:
    result = await db.execute(select(Proposal).where(Proposal.id == proposal_id))
    proposal = result.scalar_one_or_none()
    if proposal:
        await _load_relations(db, proposal)
    return proposal


async def get_proposal_by_token(db: AsyncSession, token: str) -> Proposal | None:
    result = await db.execute(select(Proposal).where(Proposal.unique_token == token))
    proposal = result.scalar_one_or_none()
    if proposal:
        await _load_relations(db, proposal)
    return proposal


async def update_proposal(db: AsyncSession, proposal_id: int, update_data: dict) -> Proposal | None:
    proposal = await get_proposal_by_id(db, proposal_id)
    if not proposal:
        return None
    line_items = update_data.pop("line_items", None)
    content = update_data.pop("content", None)
    for key, value in update_data.items():
        if value is not None and hasattr(proposal, key):
            setattr(proposal, key, value)
    await db.commit()
    if line_items is not None:
        await _sync_line_items(db, proposal, line_items)
        await db.commit()
    if content is not None:
        await _sync_content(db, proposal, content)
        await db.commit()
    if line_items is not None or content is not None:
        await _load_relations(db, proposal)
    else:
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
