from datetime import datetime, timezone
import json
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from sqlalchemy.orm import selectinload
from app.models.company_profile import CompanyProfile
from app.models.company_profile_normalized import CoreValue, Service, BNIClient, RegionalClient, InternationalClient, BranchOffice, WorkProcessStep, PaymentMethod, Signature, BankDetails, StatementOfWork
from typing import Any


DEFAULT_COMPANY_PROFILE = {
    "company_name": "PRAVYA TECH Solutions",
    "tagline": "Empowering Businesses Through Technology",
    "email": "contact@pravyatech.com",
    "phone": "+91 98765 43210",
    "website": "www.pravyatech.com",
    "sales_head_name": "Rahul Mehta",
    "sales_head_title": "Founder & CEO",
    "mission": (
        "To empower businesses with cutting-edge digital solutions that transform "
        "challenges into opportunities, fostering growth and innovation across industries."
    ),
    "vision": (
        "To be a globally recognized technology partner known for integrity, innovation, "
        "and delivering exceptional value to our clients and stakeholders."
    ),
    "core_values": [
        {"title": "Integrity", "description": "We uphold the highest ethical standards in all our dealings."},
        {"title": "Innovation", "description": "We embrace change and continuously seek better ways to solve problems."},
        {"title": "Excellence", "description": "We are committed to delivering quality work that stands the test of time."},
        {"title": "Collaboration", "description": "We believe in the power of teamwork and long-term partnerships."},
    ],
    "statement_of_work": [
        {"title": "Project Scope", "description": "Define project objectives, deliverables, and success criteria in collaboration with stakeholders."},
        {"title": "Timeline & Milestones", "description": "Establish a clear project schedule with measurable milestones and regular review checkpoints."},
        {"title": "Deliverables", "description": "Specify all deliverables including source code, documentation, and deployment assets."},
        {"title": "Revisions Policy", "description": "Include up to two rounds of revisions per deliverable to ensure client satisfaction."},
        {"title": "Payment Terms", "description": "50% advance payment at project kickoff, 30% at midpoint milestone, and 20% upon final delivery."},
        {"title": "Support Period", "description": "Provide 60 days of post-launch support for bug fixes and minor adjustments."},
        {"title": "Confidentiality", "description": "Both parties agree to maintain confidentiality of proprietary information throughout the engagement."},
    ],
    "work_process_steps": [],
    "logo_data": None,
    "logo_url": None,
    "qr_code": None,
    # Profile & Cover Letter fields
    "profile_paragraphs": [
        "PRAVYA TECH is a leading technology partner specializing in digital transformation, custom software development, and creative design solutions. We empower businesses across industries to embrace innovation and achieve sustainable growth through technology.",
        "Our team combines deep technical expertise with strategic thinking to deliver solutions that are not just functional but transformative. From startups to enterprises, we tailor our approach to each client's unique challenges and opportunities.",
        "We believe in building long-term partnerships based on trust, transparency, and measurable results. Every project we undertake is backed by our commitment to excellence and our passion for creating digital experiences that matter."
    ],
    "cover_letter_salutation": "Dear {recipient_name},",
    "cover_letter_paragraphs": [
        "Thank you for considering PRAVYA TECH as your technology partner. We understand the importance of choosing the right team to bring your vision to life, and we are honored by the opportunity to present our capabilities.",
        "Our approach combines creative strategy, technical excellence, and a deep understanding of your business objectives. We don't just build software—we craft digital solutions that drive real business outcomes and create lasting value for your organization.",
        "The enclosed proposal outlines our understanding of your requirements, our recommended approach, and a transparent breakdown of investment and timeline. We are committed to open communication, collaborative execution, and delivering results that exceed expectations."
    ],
    "cover_letter_signoff": "Warm regards,",
    # Bank Details
    "bank_name": "HDFC Bank",
    "bank_account_name": "PRAVYA TECH Solutions",
    "bank_account_number": "50200012345678",
    "bank_ifsc": "HDFC0001234",
    "bank_branch": "Rajkot Main Branch",
    "upi_id": "pravyatech@hdfcbank",
"swift_code": "HDFCINBB",
    }


async def _sync_core_values(db: AsyncSession, profile: CompanyProfile, values: list[dict]) -> None:
    """Sync core values from JSON to relational table"""
    # Delete existing
    await db.execute(
        CoreValue.__table__.delete().where(CoreValue.company_profile_id == profile.id)
    )
    await db.flush()
    
    # Insert new
    for i, val in enumerate(values or []):
        if isinstance(val, dict):
            title = val.get("title", "")
            description = val.get("description", "")
            logo = val.get("logo", "")
        else:
            title = str(val)
            description = ""
            logo = ""
        if title:
            db.add(CoreValue(
                company_profile_id=profile.id,
                title=title,
                description=description,
                logo=logo,
                sort_order=i,
            ))


async def _sync_services(db: AsyncSession, profile: CompanyProfile, services: list[dict]) -> None:
    """Sync services from JSON to relational table"""
    await db.execute(
        Service.__table__.delete().where(Service.company_profile_id == profile.id)
    )
    await db.flush()

    for i, svc in enumerate(services or []):
        if isinstance(svc, dict):
            title = svc.get("title", "")
            description = svc.get("description", "")
            logo = svc.get("logo", "")
        else:
            title = str(svc)
            description = ""
            logo = ""
        if title:
            db.add(Service(
                company_profile_id=profile.id,
                title=title,
                description=description,
                logo=logo,
                sort_order=i,
            ))


async def _sync_bni_clients(db: AsyncSession, profile: CompanyProfile, clients: list) -> None:
    """Sync BNI clients from JSON to relational table"""
    await db.execute(
        BNIClient.__table__.delete().where(BNIClient.company_profile_id == profile.id)
    )
    await db.flush()
    
    for i, client in enumerate(clients or []):
        if isinstance(client, dict):
            name = client.get("name", "")
            logo = client.get("logo", "")
        else:
            name = str(client)
            logo = ""
        if name:
            db.add(BNIClient(
                company_profile_id=profile.id,
                name=name,
                logo=logo,
                sort_order=i,
            ))


async def _sync_regional_clients(db: AsyncSession, profile: CompanyProfile, clients: list) -> None:
    """Sync regional clients from JSON to relational table"""
    await db.execute(
        RegionalClient.__table__.delete().where(RegionalClient.company_profile_id == profile.id)
    )
    await db.flush()

    for i, client in enumerate(clients or []):
        if isinstance(client, dict):
            name = client.get("name", "")
            logo = client.get("logo", "")
        else:
            name = str(client)
            logo = ""
        if name:
            db.add(RegionalClient(
                company_profile_id=profile.id,
                name=name,
                logo=logo,
                sort_order=i,
            ))


async def _sync_international_clients(db: AsyncSession, profile: CompanyProfile, clients: list) -> None:
    """Sync international clients from JSON to relational table"""
    await db.execute(
        InternationalClient.__table__.delete().where(InternationalClient.company_profile_id == profile.id)
    )
    await db.flush()
    
    for i, client in enumerate(clients or []):
        if isinstance(client, dict):
            name = client.get("name", "")
            logo = client.get("logo", "")
        else:
            name = str(client)
            logo = ""
        if name:
            db.add(InternationalClient(
                company_profile_id=profile.id,
                name=name,
                logo=logo,
                sort_order=i,
            ))


async def _sync_branch_offices(db: AsyncSession, profile: CompanyProfile, offices: list) -> None:
    """Sync branch offices from JSON to relational table"""
    await db.execute(
        BranchOffice.__table__.delete().where(BranchOffice.company_profile_id == profile.id)
    )
    await db.flush()
    
    for i, office in enumerate(offices or []):
        if isinstance(office, dict):
            name = office.get("name", "")
        else:
            name = str(office)
        if name:
            db.add(BranchOffice(
                company_profile_id=profile.id,
                name=name,
                sort_order=i,
            ))


async def _sync_work_process_steps(db: AsyncSession, profile: CompanyProfile, steps: list[dict]) -> None:
    """Sync work process steps from JSON to relational table"""
    await db.execute(
        WorkProcessStep.__table__.delete().where(WorkProcessStep.company_profile_id == profile.id)
    )
    await db.flush()
    
    for i, step in enumerate(steps or []):
        if isinstance(step, dict):
            icon = step.get("icon", "")
            title = step.get("title", "")
            description = step.get("description", "")
        else:
            icon = ""
            title = str(step)
            description = ""
        if title:
            db.add(WorkProcessStep(
                company_profile_id=profile.id,
                icon=icon,
                title=title,
                description=description,
                sort_order=i,
            ))


async def _sync_signatures(db: AsyncSession, profile: CompanyProfile, signatures: list[dict]) -> None:
    """Sync signatures from JSON to relational table"""
    await db.execute(
        Signature.__table__.delete().where(Signature.company_profile_id == profile.id)
    )
    await db.flush()
    
    for i, sig in enumerate(signatures or []):
        if isinstance(sig, dict):
            image_data = sig.get("image_data", "")
        else:
            image_data = str(sig)
        if image_data:
            db.add(Signature(
                company_profile_id=profile.id,
                image_data=image_data,
                sort_order=i,
            ))


async def _sync_statement_of_work(db: AsyncSession, profile: CompanyProfile, items: list[dict]) -> None:
    """Sync statement of work from JSON to relational table"""
    await db.execute(
        StatementOfWork.__table__.delete().where(StatementOfWork.company_profile_id == profile.id)
    )
    await db.flush()

    for i, item in enumerate(items or []):
        if isinstance(item, dict):
            heading = item.get("title", "") or item.get("heading", "")
            description = item.get("description", "")
        else:
            heading = str(item)
            description = ""
        if heading:
            db.add(StatementOfWork(
                company_profile_id=profile.id,
                heading=heading,
                description=description or "",
                sort_order=i,
            ))


async def _sync_payment_method(db: AsyncSession, profile: CompanyProfile, data: dict | None) -> None:
    """Sync payment method from JSON to relational table"""
    if data is None:
        return
        
    result = await db.execute(select(PaymentMethod).where(PaymentMethod.company_profile_id == profile.id))
    existing = result.scalar_one_or_none()
    
    if existing:
        existing.bank_name = data.get("bank_name")
        existing.account_name = data.get("bank_account_name")  # backward compat
        existing.account_number = data.get("bank_account_number")  # backward compat
        existing.ifsc = data.get("bank_ifsc")  # backward compat
        existing.branch = data.get("bank_branch")  # backward compat
        existing.upi_id = data.get("upi_id")
        existing.qr_code = data.get("qr_code")
        existing.swift_code = data.get("swift_code")
        existing.updated_at = datetime.now(timezone.utc)
    else:
        db.add(PaymentMethod(
            company_profile_id=profile.id,
            bank_name=data.get("bank_name"),
            account_name=data.get("bank_account_name"),
            account_number=data.get("bank_account_number"),
            ifsc=data.get("bank_ifsc"),
            branch=data.get("bank_branch"),
            upi_id=data.get("upi_id"),
            qr_code=data.get("qr_code"),
            swift_code=data.get("swift_code"),
        ))


async def _sync_bank_details(db: AsyncSession, profile: CompanyProfile, data: dict | None) -> None:
    """Sync bank details from JSON to relational table"""
    if data is None:
        return
        
    result = await db.execute(select(BankDetails).where(BankDetails.company_profile_id == profile.id))
    existing = result.scalar_one_or_none()
    
    if existing:
        existing.bank_name = data.get("bank_name")
        existing.account_name = data.get("account_name")
        existing.account_number = data.get("account_number")
        existing.ifsc = data.get("ifsc")
        existing.branch = data.get("branch")
        existing.upi_id = data.get("upi_id")
        existing.qr_code = data.get("qr_code")
        existing.swift_code = data.get("swift_code")
        existing.updated_at = datetime.now(timezone.utc)
    else:
        db.add(BankDetails(
            company_profile_id=profile.id,
            bank_name=data.get("bank_name"),
            account_name=data.get("account_name"),
            account_number=data.get("account_number"),
            ifsc=data.get("ifsc"),
            branch=data.get("branch"),
            upi_id=data.get("upi_id"),
            qr_code=data.get("qr_code"),
            swift_code=data.get("swift_code"),
        ))


async def get_or_create_company_profile(db: AsyncSession) -> CompanyProfile:
    result = await db.execute(
        select(CompanyProfile)
        .options(
            selectinload(CompanyProfile.core_values_rel),
            selectinload(CompanyProfile.services_rel),
            selectinload(CompanyProfile.bni_clients_rel),
            selectinload(CompanyProfile.regional_clients_rel),
            selectinload(CompanyProfile.international_clients_rel),
            selectinload(CompanyProfile.branch_offices_rel),
            selectinload(CompanyProfile.work_process_steps_rel),
            selectinload(CompanyProfile.signatures_rel),
            selectinload(CompanyProfile.statement_of_work_rel),
            selectinload(CompanyProfile.payment_method_rel),
            selectinload(CompanyProfile.bank_details_rel),
        )
        .limit(1)
    )
    profile = result.scalar_one_or_none()
    if profile is None:
        # Extract relational-only fields that don't exist as model columns
        profile_data = DEFAULT_COMPANY_PROFILE.copy()
        # core_values is not a column on the model; use it only for relational sync
        default_core_values = profile_data.pop("core_values", [])
        # Bank details defaults
        default_bank_details = {
            "bank_name": profile_data.pop("bank_name", None),
            "account_name": profile_data.pop("bank_account_name", None),
            "account_number": profile_data.pop("bank_account_number", None),
            "ifsc": profile_data.pop("bank_ifsc", None),
            "branch": profile_data.pop("bank_branch", None),
            "upi_id": profile_data.pop("upi_id", None),
            "swift_code": profile_data.pop("swift_code", None),
            "qr_code": profile_data.pop("qr_code", None),
        }
        # statement_of_work defaults
        default_statement_of_work = profile_data.pop("statement_of_work", [])
        profile = CompanyProfile(**profile_data)
        db.add(profile)
        await db.flush()
        # Create default normalized data
        await _sync_core_values(db, profile, default_core_values)
        await _sync_services(db, profile, [
            {"title": "Design & Illustration", "description": "Creative visual assets, branding, and illustration services that communicate your brand story effectively."},
            {"title": "Website Designing", "description": "Responsive, user-centric website designs that deliver exceptional user experiences across all devices."},
            {"title": "Research & Analysis", "description": "In-depth market research and data-driven analysis to inform strategic business decisions."},
            {"title": "Content Marketing", "description": "Engaging content strategies that drive traffic, generate leads, and build brand authority."},
        ])
        await _sync_statement_of_work(db, profile, default_statement_of_work)
        await _sync_bank_details(db, profile, default_bank_details)
        await db.commit()
        await db.refresh(profile)
    else:
        # Sync JSON data to relational tables if they're empty
        await _sync_if_empty(db, profile)
    return profile


async def _sync_if_empty(db: AsyncSession, profile: CompanyProfile) -> None:
    """Populate normalized tables from legacy JSON fields when needed."""
    relation_sources = (
        (CoreValue, "core_values_rel", getattr(profile, "core_values", None) or [], _sync_core_values),
        (WorkProcessStep, "work_process_steps_rel", getattr(profile, "work_process_steps", None) or [], _sync_work_process_steps),
    )
    updated = False

    for model, relation_name, source, sync_function in relation_sources:
        result = await db.execute(
            select(model.id).where(model.company_profile_id == profile.id).limit(1)
        )
        if result.first() is None:
            await sync_function(db, profile, source)
            updated = True

    if updated:
        await db.commit()

    result = await db.execute(select(PaymentMethod).where(PaymentMethod.company_profile_id == profile.id))
    if not result.scalar():
        legacy_data = {
            "bank_name": getattr(profile, "bank_name", None),
            "bank_account_name": getattr(profile, "bank_account_name", None),
            "bank_account_number": getattr(profile, "bank_account_number", None),
            "bank_ifsc": getattr(profile, "bank_ifsc", None),
            "bank_branch": getattr(profile, "bank_branch", None),
            "upi_id": getattr(profile, "upi_id", None),
            "qr_code": getattr(profile, "qr_code", None),
            "swift_code": getattr(profile, "swift_code", None),
        }
        if any(legacy_data.values()):
            await _sync_payment_method(db, profile, legacy_data)
            await db.commit()

    result = await db.execute(select(BankDetails).where(BankDetails.company_profile_id == profile.id))
    if not result.scalar():
        legacy_data = {
            "bank_name": getattr(profile, "bank_name", None),
            "account_name": getattr(profile, "bank_account_name", None),
            "account_number": getattr(profile, "bank_account_number", None),
            "ifsc": getattr(profile, "bank_ifsc", None),
            "branch": getattr(profile, "bank_branch", None),
            "upi_id": getattr(profile, "upi_id", None),
            "qr_code": getattr(profile, "qr_code", None),
            "swift_code": getattr(profile, "swift_code", None),
        }
        if any(legacy_data.values()):
            await _sync_bank_details(db, profile, legacy_data)
            await db.commit()


async def get_company_profile(db: AsyncSession) -> CompanyProfile | None:
    result = await db.execute(
        select(CompanyProfile)
         .options(
            selectinload(CompanyProfile.core_values_rel),
            selectinload(CompanyProfile.services_rel),
            selectinload(CompanyProfile.bni_clients_rel),
            selectinload(CompanyProfile.regional_clients_rel),
            selectinload(CompanyProfile.international_clients_rel),
            selectinload(CompanyProfile.branch_offices_rel),
            selectinload(CompanyProfile.work_process_steps_rel),
            selectinload(CompanyProfile.signatures_rel),
            selectinload(CompanyProfile.statement_of_work_rel),
            selectinload(CompanyProfile.payment_method_rel),
            selectinload(CompanyProfile.bank_details_rel),
        )
        .limit(1)
    )
    profile = result.scalar_one_or_none()
    if profile:
        await _sync_if_empty(db, profile)
        result = await db.execute(
            select(CompanyProfile)
            .options(
                selectinload(CompanyProfile.core_values_rel),
                selectinload(CompanyProfile.services_rel),
                selectinload(CompanyProfile.bni_clients_rel),
                selectinload(CompanyProfile.regional_clients_rel),
                selectinload(CompanyProfile.international_clients_rel),
                selectinload(CompanyProfile.branch_offices_rel),
                selectinload(CompanyProfile.work_process_steps_rel),
                selectinload(CompanyProfile.signatures_rel),
                selectinload(CompanyProfile.statement_of_work_rel),
                selectinload(CompanyProfile.payment_method_rel),
                selectinload(CompanyProfile.bank_details_rel),
                )
            .where(CompanyProfile.id == profile.id)
        )
        profile = result.scalar_one_or_none()
    return profile


async def update_company_profile(db: AsyncSession, update_data: dict) -> CompanyProfile:
    profile = await get_or_create_company_profile(db)
    updated = False

    # Handle qr_code specially - it's stored in PaymentMethod/BankDetails, not CompanyProfile
    if "qr_code" in update_data:
        qr_code_value = update_data.pop("qr_code")
        result = await db.execute(
            select(PaymentMethod).where(PaymentMethod.company_profile_id == profile.id)
        )
        payment_method = result.scalar_one_or_none()
        if payment_method:
            payment_method.qr_code = qr_code_value
            payment_method.updated_at = datetime.now(timezone.utc)
        else:
            result = await db.execute(
                select(BankDetails).where(BankDetails.company_profile_id == profile.id)
            )
            bank_details = result.scalar_one_or_none()
            if bank_details:
                bank_details.qr_code = qr_code_value
                bank_details.updated_at = datetime.now(timezone.utc)
        updated = True

    # Handle relational fields
    relational_fields = {
        "core_values": _sync_core_values,
        "services": _sync_services,
        "bni_clients": _sync_bni_clients,
        "regional_clients": _sync_regional_clients,
        "international_clients": _sync_international_clients,
        "branch_offices": _sync_branch_offices,
        "work_process_steps": _sync_work_process_steps,
        "signatures": _sync_signatures,
        "statement_of_work": _sync_statement_of_work,
        "payment_method": _sync_payment_method,
        "bank_details": _sync_bank_details,
    }

    # Handle backward compatibility for signature_data
    if "signature_data" in update_data:
        signature_data = update_data.pop("signature_data")
        if signature_data:
            update_data["signatures"] = [{"image_data": signature_data}]

    # Handle cover_letter_signature_image -> signatures sync
    if "cover_letter_signature_image" in update_data:
        cover_letter_sig = update_data["cover_letter_signature_image"]
        if cover_letter_sig and "signatures" not in update_data:
            update_data["signatures"] = [{"image_data": cover_letter_sig}]

    for key, value in update_data.items():
        if key in {"id", "created_at", "updated_at"}:
            continue
        if key in relational_fields:
            await relational_fields[key](db, profile, value)
            updated = True
            if hasattr(profile, key):
                setattr(profile, key, value)
        elif value is not None and hasattr(profile, key):
            setattr(profile, key, value)
            updated = True

    if updated:
        profile.updated_at = datetime.now(timezone.utc)
    profile_id = profile.id
    await db.commit()
    result = await db.execute(
        select(CompanyProfile)
        .options(
            selectinload(CompanyProfile.core_values_rel),
            selectinload(CompanyProfile.services_rel),
            selectinload(CompanyProfile.bni_clients_rel),
            selectinload(CompanyProfile.regional_clients_rel),
            selectinload(CompanyProfile.international_clients_rel),
            selectinload(CompanyProfile.branch_offices_rel),
            selectinload(CompanyProfile.work_process_steps_rel),
             selectinload(CompanyProfile.signatures_rel),
             selectinload(CompanyProfile.statement_of_work_rel),
             selectinload(CompanyProfile.payment_method_rel),
             selectinload(CompanyProfile.bank_details_rel),
        )
        .where(CompanyProfile.id == profile_id)
    )
    return result.scalar_one()