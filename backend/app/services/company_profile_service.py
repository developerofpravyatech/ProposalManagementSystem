from datetime import datetime, timezone
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from app.models.company_profile import CompanyProfile


DEFAULT_COMPANY_PROFILE = {
    "company_name": "PRAVYA TECH Solutions",
    "tagline": "Empowering Businesses Through Technology",
    "email": "contact@pravyatech.com",
    "phone": "+91 98765 43210",
    "website": "www.pravyatech.com",
    "address": "Office: Rajkot, Gujarat, India",
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
    "services": [
        {"title": "Design & Illustration", "description": "Creative visual assets, branding, and illustration services that communicate your brand story effectively."},
        {"title": "Website Designing", "description": "Responsive, user-centric website designs that deliver exceptional user experiences across all devices."},
        {"title": "Research & Analysis", "description": "In-depth market research and data-driven analysis to inform strategic business decisions."},
        {"title": "Content Marketing", "description": "Engaging content strategies that drive traffic, generate leads, and build brand authority."},
    ],
    "bni_clients": ["Shree Cement", "Adani Group", "Reliance Industries", "Tata Consultancy Services", "Infosys", "Wipro"],
    "international_clients": [
        "TechFlow Inc. (USA)",
        "EuroTech Solutions (Germany)",
        "Asia Pacific Digital (Singapore)",
        "UK Digital Labs (London)",
        "Canada Tech Ventures (Toronto)",
    ],
    "branch_offices": [
        "Rajkot - 150ft Rd, Gondal Rd, Gujarat, India",
        "California, USA",
    ],
    "logo_data": None,
    "logo_url": None,
    "qr_code": None,
    "primary_color": "#4F46E5",
    "secondary_color": "#0F172A",
    "accent_color": "#10B981",
    "theme_config": {},
    "terms": (
        "All proposals are valid for 30 days from the date of issuance.\n"
        "Payment terms: 50% advance, 30% on milestone completion, 20% on final delivery.\n"
        "Any changes to project scope must be documented and agreed upon in writing.\n"
        "Intellectual property rights transfer upon full payment settlement.\n"
        "Confidentiality: Both parties agree to protect sensitive information shared during the engagement.\n"
        "Governing Law: This agreement shall be governed by the laws of India."
    ),
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


async def get_or_create_company_profile(db: AsyncSession) -> CompanyProfile:
    result = await db.execute(select(CompanyProfile).limit(1))
    profile = result.scalar_one_or_none()
    if profile is None:
        profile = CompanyProfile(**DEFAULT_COMPANY_PROFILE)
        db.add(profile)
        await db.commit()
        await db.refresh(profile)
    return profile


async def get_company_profile(db: AsyncSession) -> CompanyProfile | None:
    result = await db.execute(select(CompanyProfile).limit(1))
    return result.scalar_one_or_none()


async def update_company_profile(db: AsyncSession, update_data: dict) -> CompanyProfile:
    profile = await get_or_create_company_profile(db)
    updated = False
    for key, value in update_data.items():
        if key in {"id", "created_at", "updated_at"}:
            continue
        if value is not None and hasattr(profile, key):
            setattr(profile, key, value)
            updated = True
    if updated:
        profile.updated_at = datetime.now(timezone.utc)
    await db.commit()
    await db.refresh(profile)
    return profile
