from fastapi import APIRouter, Depends, HTTPException, status, Request
from sqlalchemy.ext.asyncio import AsyncSession
from datetime import datetime

from app.database import get_db
from app.models.proposal import Proposal, ProposalStatus
from app.models.company_profile import CompanyProfile
from app.schemas.proposal import ProposalRead
from app.schemas.company_profile import CompanyProfileRead
from app.services.proposal_service import get_proposal_by_token, record_view
from app.services.company_profile_service import get_or_create_company_profile

router = APIRouter(prefix="/public/proposals", tags=["public"])


@router.get("/company-profile", response_model=CompanyProfileRead)
async def get_public_company_profile(request: Request, db: AsyncSession = Depends(get_db)):
    profile = await get_or_create_company_profile(db)
    return profile


@router.get("/{token}", response_model=ProposalRead)
async def get_public_proposal(token: str, request: Request, db: AsyncSession = Depends(get_db)):
    proposal = await get_proposal_by_token(db, token)
    if not proposal:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Proposal not found")
    return proposal


@router.post("/{token}/view")
async def record_proposal_view(token: str, request: Request, db: AsyncSession = Depends(get_db)):
    proposal = await get_proposal_by_token(db, token)
    if not proposal:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Proposal not found")
    ip_address = request.client.host if request.client else None
    user_agent = request.headers.get("user-agent")
    await record_view(db, proposal.id, ip_address, user_agent)
    return {"detail": "View recorded"}


@router.get("/{token}/download")
async def download_proposal_pdf(token: str, request: Request, db: AsyncSession = Depends(get_db)):
    proposal = await get_proposal_by_token(db, token)
    if not proposal:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Proposal not found")
    proposal.pdf_downloaded_at = datetime.now()
    await db.commit()
    await db.refresh(proposal)
    if not proposal.pdf_path:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="PDF not available")
    from fastapi.responses import FileResponse
    return FileResponse(proposal.pdf_path, filename=f"{proposal.proposal_no or proposal.id}.pdf")


@router.post("/{token}/accept")
async def accept_proposal(token: str, request: Request, db: AsyncSession = Depends(get_db)):
    proposal = await get_proposal_by_token(db, token)
    if not proposal:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Proposal not found")
    if proposal.type.value != "quotation_proposal":
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Only quotations can be accepted")
    body = await request.json()
    proposal.status = ProposalStatus.accepted
    proposal.accepted_by = body.get("accepted_by", "Authorized Representative")
    proposal.accepted_at = datetime.now()
    proposal.signature_data = body.get("signature_data")
    await db.commit()
    await db.refresh(proposal)
    return {"detail": "Proposal accepted", "proposal_no": proposal.proposal_no}
