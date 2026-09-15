import os
from contextlib import asynccontextmanager
from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import Response
from fastapi.staticfiles import StaticFiles
from sqlalchemy import text
from sqlalchemy.future import select
from app.database import engine, Base, async_session_maker
from app.api import api_router
from app.utils.security import settings, hash_password
from app.models.admin import Admin

os.makedirs(settings.PDF_OUTPUT_DIR, exist_ok=True)


@asynccontextmanager
async def lifespan(app: FastAPI):
    try:
        print("[STARTUP] Beginning database setup...")
        async with engine.begin() as conn:
            print("[STARTUP] Creating tables if they don't exist...")
            await conn.run_sync(Base.metadata.create_all)

            print("[STARTUP] Migrating admins table to plain-text password column...")
            await conn.run_sync(lambda sync_conn: sync_conn.execute(text("""
                DO $$
                BEGIN
                    IF EXISTS (
                        SELECT 1
                        FROM information_schema.columns
                        WHERE table_name = 'admins'
                        AND column_name = 'hashed_password'
                    ) THEN
                        IF NOT EXISTS (
                            SELECT 1
                            FROM information_schema.columns
                            WHERE table_name = 'admins'
                            AND column_name = 'password'
                        ) THEN
                            ALTER TABLE admins ADD COLUMN password VARCHAR(255);
                        END IF;

                        UPDATE admins
                        SET password = hashed_password
                        WHERE password IS NULL;

                        ALTER TABLE admins DROP COLUMN hashed_password;
                    END IF;
                END $$;
            """)))

            print("[STARTUP] Tables ready.")

        async with async_session_maker() as session:
            result = await session.execute(select(Admin).where(Admin.email == "admin@pravyatech.com"))
            admin = result.scalar_one_or_none()
            if not admin:
                print("[STARTUP] Seeding default admin user...")
                default_admin = Admin(
                    email="admin@pravyatech.com",
                    full_name="Admin",
                    password=hash_password("admin123"),
                    is_active=True,
                )
                session.add(default_admin)
                await session.commit()
                print("[STARTUP] Default admin seeded.")
            else:
                admin.password = hash_password("admin123")
                admin.full_name = "Admin"
                admin.is_active = True
                await session.commit()
                print("[STARTUP] Default admin password synced.")
    except Exception as e:
        print(f"[STARTUP] Error during database setup: {e}")
        raise

    yield


app = FastAPI(
    title="PRAVYA TECH Proposal Management System",
    description="Enterprise backend API for managing proposals, quotations, client tracking, and renewals.",
    version="1.0.0",
    lifespan=lifespan
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://localhost:5174",
        "http://192.168.1.70:5173",
        "http://192.168.1.70:5174",
        "http://192.168.1.101:5173",
        "http://192.168.1.101:5174",
        "http://localhost:3000",
        "http://192.168.1.101:3000",
    ],
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
        "health": "/api/health",
        "api_endpoints": "/api",
        "version": "1.0.0"
    }


@app.get("/api/health")
async def api_health():
    db_status = "ok"
    try:
        async with engine.begin() as conn:
            await conn.execute(text("SELECT 1"))
    except Exception:
        db_status = "error"
    return {"success": True, "api": "ok", "database": db_status}


@app.get("/health")
async def health_check():
    db_status = "ok"
    try:
        async with engine.begin() as conn:
            await conn.execute(text("SELECT 1"))
    except Exception:
        db_status = "error"
    return {"status": "ok", "database": db_status}
