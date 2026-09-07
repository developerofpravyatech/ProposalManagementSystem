from fastapi import APIRouter
from app.api import auth, proposals, public, company_profile, clients

api_router = APIRouter(prefix="/api")
api_router.include_router(auth.router)
api_router.include_router(clients.router)
api_router.include_router(proposals.router)
api_router.include_router(public.router)
api_router.include_router(company_profile.router)
