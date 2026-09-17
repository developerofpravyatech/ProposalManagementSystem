from datetime import datetime, timezone
import json
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from sqlalchemy.orm import selectinload
from app.models.company_profile import CompanyProfile
from app.models.company_profile_normalized import CoreValue, Service, BNIClient, InternationalClient, BranchOffice, WorkProcessStep, PaymentMethod, Signature, ContractTerm


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
    "work_process_steps": [],
    "logo_data": None,
    "logo_url": None,
    "qr_code": None,
    "terms": (
        "All proposals are valid for 30 days from the date of issuance.\n"
        "Payment terms: 50% advance, 30% on milestone completion, 20% on final delivery.\n"
        "Any changes to project scope must be documented and agreed upon in writing.\n"
        "Intellectual property rights transfer upon full payment settlement.\n"
        "Confidentiality: Both parties agree to protect sensitive information shared during the engagement.\n"
        "Governing Law: This agreement shall be governed by the laws of India."
    ),
    "contract_terms": [
        {"title": "Project Scope Definition", "bullets": ["Detailed project scope document with deliverables", "Timeline with milestone schedule", "Acceptance criteria and sign-off process", "Change request and approval workflow", "Scope exclusion list"]},
        {"title": "Payment Terms and Conditions", "bullets": ["50% advance payment before project commencement", "30% payment at mid-project milestone", "20% payment upon final delivery and acceptance", "Payment method: Bank transfer or UPI", "Late payment penalty: 1.5% per month"]},
        {"title": "Intellectual Property Rights", "bullets": ["All deliverables IP transfers upon full payment", "Pre-existing tools and frameworks remain owned by vendor", "Client provided materials remain their property", "Source code ownership upon final payment", "License grants for third-party components"]},
        {"title": "Confidentiality and NDA", "bullets": ["Both parties maintain strict confidentiality", "Non-compete clause for project duration", "Employee and contractor confidentiality obligations", "Duration: 3 years post-project completion", "Exceptions for public domain information"]},
        {"title": "Warranty and Support", "bullets": ["30-day warranty period from delivery date", "Bug fixes provided free of charge", "Support via email and phone during business hours", "Warranty excludes client-requested changes", "Extended support available via separate agreement"]},
    ],
    # Bank Details
    "bank_name": "HDFC Bank",
    "bank_account_name": "PRAVYA TECH Solutions",
    "bank_account_number": "50200012345678",
    "bank_ifsc": "HDFC0001234",
    "bank_branch": "Rajkot Main Branch",
    "upi_id": "pravyatech@hdfcbank",
    "swift_code": "HDFCINBB",
    "iban": None,
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
            logo = office.get("logo", "")
        else:
            name = str(office)
            logo = ""
        if name:
            db.add(BranchOffice(
                company_profile_id=profile.id,
                name=name,
                logo=logo,
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
        existing.iban = data.get("iban")
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
            iban=data.get("iban"),
        ))


async def _sync_contract_terms(db: AsyncSession, profile: CompanyProfile, terms: list) -> None:
    """Sync contract terms from JSON to relational table"""
    await db.execute(
        ContractTerm.__table__.delete().where(ContractTerm.company_profile_id == profile.id)
    )
    await db.flush()
    
    for i, term in enumerate(terms or []):
        if isinstance(term, dict):
            title = term.get("title", "")
            bullets = term.get("bullets", [])
        else:
            title = str(term)
            bullets = []
        if title:
            db.add(ContractTerm(
                company_profile_id=profile.id,
                title=title,
                bullets=bullets,
                sort_order=i,
            ))


async def get_or_create_company_profile(db: AsyncSession) -> CompanyProfile:
    result = await db.execute(
        select(CompanyProfile)
        .options(
            selectinload(CompanyProfile.core_values_rel),
            selectinload(CompanyProfile.services_rel),
            selectinload(CompanyProfile.bni_clients_rel),
            selectinload(CompanyProfile.international_clients_rel),
            selectinload(CompanyProfile.branch_offices_rel),
            selectinload(CompanyProfile.work_process_steps_rel),
            selectinload(CompanyProfile.signatures_rel),
            selectinload(CompanyProfile.payment_method_rel),
            selectinload(CompanyProfile.contract_terms_rel),
        )
        .limit(1)
    )
    profile = result.scalar_one_or_none()
    if profile is None:
        # Extract relational-only fields that don't exist as model columns
        profile_data = DEFAULT_COMPANY_PROFILE.copy()
        # core_values is not a column on the model; use it only for relational sync
        default_core_values = profile_data.pop("core_values", [])
        default_contract_terms = profile_data.pop("contract_terms", [])
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
        await _sync_contract_terms(db, profile, default_contract_terms)
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
        (ContractTerm, "contract_terms_rel", profile.contract_terms or [], _sync_contract_terms),
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
            "bank_name": profile.bank_name,
            "bank_account_name": profile.bank_account_name,
            "bank_account_number": profile.bank_account_number,
            "bank_ifsc": profile.bank_ifsc,
            "bank_branch": profile.bank_branch,
            "upi_id": profile.upi_id,
            "qr_code": profile.qr_code,
            "swift_code": profile.swift_code,
            "iban": profile.iban,
        }
        if any(legacy_data.values()):
            await _sync_payment_method(db, profile, legacy_data)
            await db.commit()


async def get_company_profile(db: AsyncSession) -> CompanyProfile | None:
    result = await db.execute(
        select(CompanyProfile)
        .options(
            selectinload(CompanyProfile.core_values_rel),
            selectinload(CompanyProfile.services_rel),
            selectinload(CompanyProfile.bni_clients_rel),
            selectinload(CompanyProfile.international_clients_rel),
            selectinload(CompanyProfile.branch_offices_rel),
            selectinload(CompanyProfile.work_process_steps_rel),
            selectinload(CompanyProfile.signatures_rel),
            selectinload(CompanyProfile.payment_method_rel),
            selectinload(CompanyProfile.contract_terms_rel),
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
                selectinload(CompanyProfile.international_clients_rel),
                selectinload(CompanyProfile.branch_offices_rel),
                selectinload(CompanyProfile.work_process_steps_rel),
                selectinload(CompanyProfile.signatures_rel),
                selectinload(CompanyProfile.payment_method_rel),
                selectinload(CompanyProfile.contract_terms_rel),
            )
            .where(CompanyProfile.id == profile.id)
        )
        profile = result.scalar_one_or_none()
    return profile


async def update_company_profile(db: AsyncSession, update_data: dict) -> CompanyProfile:
    profile = await get_or_create_company_profile(db)
    updated = False
    
    # Handle relational fields
    relational_fields = {
        "core_values": _sync_core_values,
        "bni_clients": _sync_bni_clients,
        "international_clients": _sync_international_clients,
        "branch_offices": _sync_branch_offices,
        "work_process_steps": _sync_work_process_steps,
        "signatures": _sync_signatures,
        "payment_method": _sync_payment_method,
        "contract_terms": _sync_contract_terms,
    }
    
    # Handle backward compatibility for signature_data
    if "signature_data" in update_data:
        signature_data = update_data.pop("signature_data")
        if signature_data:
            update_data["signatures"] = [{"image_data": signature_data}]
    
    for key, value in update_data.items():
        if key in {"id", "created_at", "updated_at"}:
            continue
        if key in relational_fields:
            await relational_fields[key](db, profile, value)
            updated = True
            # Also update JSON column for backward compatibility
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
            selectinload(CompanyProfile.international_clients_rel),
            selectinload(CompanyProfile.branch_offices_rel),
            selectinload(CompanyProfile.work_process_steps_rel),
            selectinload(CompanyProfile.signatures_rel),
            selectinload(CompanyProfile.payment_method_rel),
            selectinload(CompanyProfile.contract_terms_rel),
        )
        .where(CompanyProfile.id == profile_id)
    )
    return result.scalar_one()