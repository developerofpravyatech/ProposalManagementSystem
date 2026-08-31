from fastapi import APIRouter
from app.api import auth, proposals, public

api_router = APIRouter(prefix="/api")
api_router.include_router(auth.router)
api_router.include_router(proposals.router)
api_router.include_router(public.router)
