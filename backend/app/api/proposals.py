from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from typing import List

from app.database import get_db
from app.models.proposal import Proposal, ProposalStatus
from app.schemas.proposal import ProposalCreate, ProposalUpdate, ProposalRead, ProposalAnalytics
from app.services.proposal_service import (
    create_proposal,
    get_proposals,
    get_proposal_by_id,
    update_proposal,
    delete_proposal,
    record_view,
    get_analytics,
)
from app.api.auth import get_current_admin

router = APIRouter(prefix="/proposals", tags=["proposals"])


@router.get("", response_model=List[ProposalRead])
async def list_proposals(
    skip: int = 0,
    limit: int = 50,
    status: str | None = Query(None),
    search: str | None = Query(None),
    db: AsyncSession = Depends(get_db),
    current_admin=Depends(get_current_admin),
):
    proposals = await get_proposals(db, skip=skip, limit=limit, status=status, search=search)
    return proposals


@router.post("", response_model=ProposalRead, status_code=status.HTTP_201_CREATED)
async def create_new_proposal(
    proposal_in: ProposalCreate,
    db: AsyncSession = Depends(get_db),
    current_admin=Depends(get_current_admin),
):
    proposal = await create_proposal(db, proposal_in.model_dump())
    return proposal


@router.get("/{proposal_id}", response_model=ProposalRead)
async def get_proposal(
    proposal_id: int,
    db: AsyncSession = Depends(get_db),
    current_admin=Depends(get_current_admin),
):
    proposal = await get_proposal_by_id(db, proposal_id)
    if not proposal:
        raise HTTPException(status_code=404, detail="Proposal not found")
    return proposal


@router.put("/{proposal_id}", response_model=ProposalRead)
async def update_existing_proposal(
    proposal_id: int,
    proposal_in: ProposalUpdate,
    db: AsyncSession = Depends(get_db),
    current_admin=Depends(get_current_admin),
):
    proposal = await update_proposal(db, proposal_id, proposal_in.model_dump(exclude_unset=True))
    if not proposal:
        raise HTTPException(status_code=404, detail="Proposal not found")
    return proposal


@router.delete("/{proposal_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_existing_proposal(
    proposal_id: int,
    db: AsyncSession = Depends(get_db),
    current_admin=Depends(get_current_admin),
):
    success = await delete_proposal(db, proposal_id)
    if not success:
        raise HTTPException(status_code=404, detail="Proposal not found")
    return None


@router.post("/{proposal_id}/renew", response_model=ProposalRead)
async def renew_proposal(
    proposal_id: int,
    db: AsyncSession = Depends(get_db),
    current_admin=Depends(get_current_admin),
):
    original = await get_proposal_by_id(db, proposal_id)
    if not original:
        raise HTTPException(status_code=404, detail="Proposal not found")
    new_proposal_data = {
        "proposal_type": original.proposal_type,
        "client_name": original.client_name,
        "company_name": original.company_name,
        "phone": original.phone,
        "email": original.email,
        "project_title": original.project_title,
        "amount": original.amount,
        "currency": original.currency,
    }
    new_proposal = await create_proposal(db, new_proposal_data)
    new_proposal.status = ProposalStatus.renewed
    original.status = ProposalStatus.renewal_due
    await db.commit()
    await db.refresh(new_proposal)
    await db.refresh(original)
    return new_proposal


@router.get("/{proposal_id}/analytics", response_model=ProposalAnalytics)
async def get_proposal_analytics(
    proposal_id: int,
    db: AsyncSession = Depends(get_db),
    current_admin=Depends(get_current_admin),
):
    analytics = await get_analytics(db, proposal_id)
    if not analytics:
        raise HTTPException(status_code=404, detail="Proposal not found")
    return analytics
