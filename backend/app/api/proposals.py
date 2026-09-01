from fastapi import APIRouter, Depends, HTTPException, status, Query, Request
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from typing import List, Any

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
from app.services.pdf_service import generate_pdf
from app.api.auth import get_current_admin

router = APIRouter(prefix="/proposals", tags=["proposals"])


@router.get("/dashboard-stats")
async def get_dashboard_summary(
    db: AsyncSession = Depends(get_db),
    current_admin=Depends(get_current_admin),
):
    all_props = await get_proposals(db, limit=500)
    total_proposals = len(all_props)
    profile_count = len([p for p in all_props if p.type.value in ["profile_only", "profile"]])
    quotation_count = len([p for p in all_props if p.type.value in ["quotation_proposal", "quotation"]])
    total_views = sum(p.view_count for p in all_props)
    viewed_props = len([p for p in all_props if p.view_count > 0])
    open_rate = round((viewed_props / total_proposals * 100)) if total_proposals > 0 else 0
    accepted = [p for p in all_props if p.status == ProposalStatus.accepted]
    total_accepted_val = sum((p.amount or 0) for p in accepted)

    return {
        "totalProposals": total_proposals,
        "profileCount": profile_count,
        "quotationCount": quotation_count,
        "totalViews": total_views,
        "openRate": open_rate,
        "acceptedCount": len(accepted),
        "totalAcceptedValue": total_accepted_val,
        "renewalsDueCount": len([p for p in all_props if p.status == ProposalStatus.renewal_due]),
        "recentActivity": []
    }


@router.post("/{proposal_id}/pdf")
async def create_proposal_pdf(
    proposal_id: int,
    db: AsyncSession = Depends(get_db),
    current_admin=Depends(get_current_admin),
):
    proposal = await get_proposal_by_id(db, proposal_id)
    if not proposal:
        raise HTTPException(status_code=404, detail="Proposal not found")
    filepath = await generate_pdf(db, proposal)
    return {"detail": "PDF generated successfully", "pdf_path": filepath}


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
    request: Request,
    db: AsyncSession = Depends(get_db),
    current_admin=Depends(get_current_admin),
):
    original = await get_proposal_by_id(db, proposal_id)
    if not original:
        raise HTTPException(status_code=404, detail="Proposal not found")
    try:
        renewal_payload: dict[str, Any] = await request.json()
    except Exception:
        renewal_payload = {}
    new_proposal_data = {
        "type": original.type,
        "client_name": original.client_name,
        "company_name": original.company_name,
        "phone": original.phone,
        "email": original.email,
        "project_title": renewal_payload.get("project_title", original.project_title),
        "project_subtitle": original.project_subtitle,
        "amount": original.amount,
        "currency": original.currency,
        "currency_symbol": original.currency_symbol,
        "contract_duration": renewal_payload.get("contract_duration", original.contract_duration),
        "renewal_date": renewal_payload.get("renewal_date", original.renewal_date),
        "terms": original.terms,
        "line_items": original.line_items,
    }
    new_proposal = await create_proposal(db, new_proposal_data)
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
