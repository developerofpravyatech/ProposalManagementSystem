import os
from dotenv import load_dotenv

load_dotenv(dotenv_path=os.path.join(os.path.dirname(__file__), '..', '.env'))

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
os.makedirs(settings.UPLOAD_DIR, exist_ok=True)


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

            print("[STARTUP] Adding new text fields to company_profile if missing...")
            await conn.run_sync(lambda sync_conn: sync_conn.execute(text("""
                DO $$
                BEGIN
                    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'company_profile' AND column_name = 'quote_acceptance_message') THEN
                        ALTER TABLE company_profile ADD COLUMN quote_acceptance_message TEXT;
                    END IF;
                    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'company_profile' AND column_name = 'footer_tagline') THEN
                        ALTER TABLE company_profile ADD COLUMN footer_tagline VARCHAR(500);
                    END IF;
                END $$;
            """)))

            print("[STARTUP] Creating company_signatures table if missing...")
            await conn.run_sync(lambda sync_conn: sync_conn.execute(text("""
                CREATE TABLE IF NOT EXISTS company_signatures (
                    id SERIAL PRIMARY KEY,
                    company_profile_id INTEGER NOT NULL REFERENCES company_profile(id) ON DELETE CASCADE,
                    image_data TEXT,
                    sort_order INTEGER DEFAULT 0,
                    UNIQUE(company_profile_id, sort_order)
                );
            """)))

            print("[STARTUP] Creating company_services table if missing...")
            await conn.run_sync(lambda sync_conn: sync_conn.execute(text("""
                CREATE TABLE IF NOT EXISTS company_services (
                    id SERIAL PRIMARY KEY,
                    company_profile_id INTEGER NOT NULL REFERENCES company_profile(id) ON DELETE CASCADE,
                    title VARCHAR(255) NOT NULL,
                    description TEXT,
                    image_data TEXT,
                    sort_order INTEGER DEFAULT 0,
                    UNIQUE(company_profile_id, sort_order)
                );
            """)))

            print("[STARTUP] Creating company_payment_methods table if missing...")
            await conn.run_sync(lambda sync_conn: sync_conn.execute(text("""
                CREATE TABLE IF NOT EXISTS company_payment_methods (
                    id SERIAL PRIMARY KEY,
                    company_profile_id INTEGER NOT NULL REFERENCES company_profile(id) ON DELETE CASCADE,
                    bank_name VARCHAR(255),
                    account_name VARCHAR(255),
                    account_number VARCHAR(50),
                    ifsc VARCHAR(20),
                    branch VARCHAR(255),
                    upi_id VARCHAR(100),
                    qr_code TEXT,
                    swift_code VARCHAR(20),
                    is_default BOOLEAN DEFAULT TRUE,
                    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
                    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
                    UNIQUE (company_profile_id)
                );
            """)))
            await conn.run_sync(lambda sync_conn: sync_conn.execute(text("""
                CREATE INDEX IF NOT EXISTS ix_company_payment_methods_company_profile_id ON company_payment_methods(company_profile_id);
            """)))

            print("[STARTUP] Migrating legacy bank data to company_payment_methods...")
            await conn.run_sync(lambda sync_conn: sync_conn.execute(text("""
                DO $$
                BEGIN
                    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'company_profile' AND column_name = 'bank_name') THEN
                        INSERT INTO company_payment_methods (
                            company_profile_id, bank_name, account_name, account_number, 
                            ifsc, branch, upi_id, qr_code, swift_code, is_default
                        )
                        SELECT 
                            id, bank_name, bank_account_name, bank_account_number,
                            bank_ifsc, bank_branch, upi_id, qr_code, swift_code, TRUE
                        FROM company_profile
                        WHERE (bank_name IS NOT NULL OR bank_account_name IS NOT NULL OR bank_account_number IS NOT NULL 
                               OR bank_ifsc IS NOT NULL OR bank_branch IS NOT NULL OR upi_id IS NOT NULL 
                               OR qr_code IS NOT NULL OR swift_code IS NOT NULL)
                        ON CONFLICT (company_profile_id) DO NOTHING;
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


assert settings.SECRET_KEY != "change_me_to_a_secure_random_key", "SECRET_KEY not configured in .env!"


app = FastAPI(
    title="PRAVYA TECH Proposal Management System",
    description="Enterprise backend API for managing proposals, quotations, client tracking, and renewals.",
    version="1.0.0",
    lifespan=lifespan,
    max_file_size=50 * 1024 * 1024,  # 50MB for file uploads
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
        "http://10.25.171.39:5173",
        "http://10.25.171.39:5174",
        "http://localhost:3000",
        "http://192.168.1.101:3000",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(api_router)


@app.options("/{path:path}")
async def cors_preflight(request: Request):
    origin = request.headers.get("Origin", "")
    return Response(
        status_code=204,
        headers={
            "Access-Control-Allow-Origin": origin,
            "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS, PATCH, HEAD",
            "Access-Control-Allow-Headers": "Content-Type, Authorization",
            "Access-Control-Allow-Credentials": "true",
        },
    )

app.mount("/generated_pdfs", StaticFiles(directory=settings.PDF_OUTPUT_DIR), name="generated_pdfs")
app.mount("/uploads", StaticFiles(directory=settings.UPLOAD_DIR), name="uploads")


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
