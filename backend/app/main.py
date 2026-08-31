import os
from contextlib import asynccontextmanager
from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import Response
from fastapi.staticfiles import StaticFiles
from app.database import engine, Base
from app.api import api_router
from app.utils.security import settings

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

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://192.168.1.101:5173", "http://192.168.1.101:3000", "http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(api_router)

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


@app.options("/{path:path}")
async def catch_all_options(request: Request, path: str):
    return Response(status_code=200)
