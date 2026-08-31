from fastapi import APIRouter, Depends, HTTPException, status, Request
from sqlalchemy.ext.asyncio import AsyncSession

from app.database import get_db
from app.models.proposal import Proposal, ProposalStatus
from app.schemas.proposal import ProposalRead
from app.services.proposal_service import get_proposal_by_token, record_view

router = APIRouter(prefix="/public/proposals", tags=["public"])


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
    if not proposal.pdf_path:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="PDF not available")
    from fastapi.responses import FileResponse
    return FileResponse(proposal.pdf_path, filename=f"{proposal.proposal_number}.pdf")


@router.post("/{token}/accept")
async def accept_proposal(token: str, request: Request, db: AsyncSession = Depends(get_db)):
    proposal = await get_proposal_by_token(db, token)
    if not proposal:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Proposal not found")
    if proposal.proposal_type.value != "project_quotation":
        raise HTTPException(status_code=400, detail="Only quotations can be accepted")
    proposal.status = ProposalStatus.accepted
    await db.commit()
    await db.refresh(proposal)
    return {"detail": "Proposal accepted", "proposal_number": proposal.proposal_number}
