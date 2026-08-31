import os
from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from app.database import engine, Base
from app.api import api_router
from app.utils.security import settings

# Ensure generated PDFs output directory exists
os.makedirs(settings.PDF_OUTPUT_DIR, exist_ok=True)


@asynccontextmanager
async def lifespan(app: FastAPI):
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)
    yield


app = FastAPI(
    title="PRAVYA TECH Proposal Management System",
    description="Enterprise backend API for managing proposals, quotations, client tracking, and renewals.",
    version="1.0.0",
    lifespan=lifespan
)

cors_origins = [origin.strip() for origin in settings.CORS_ORIGINS.split(",") if origin.strip()]

app.add_middleware(
    CORSMiddleware,
    allow_origins=cors_origins if cors_origins else ["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(api_router)

# Mount generated PDFs directory for static serving
app.mount("/generated_pdfs", StaticFiles(directory=settings.PDF_OUTPUT_DIR), name="generated_pdfs")


@app.get("/")
async def root():
    return {
        "message": "PRAVYA TECH Proposal Management System API is running",
        "documentation": "/docs",
        "health": "/health",
        "api_endpoints": "/api",
        "version": "1.0.0"
    }


@app.get("/health")
async def health_check():
    return {"status": "ok"}
