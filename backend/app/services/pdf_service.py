import base64
import copy
import io
import json
import os
import shutil
import subprocess
import uuid
from datetime import datetime, timedelta
from pathlib import Path
from typing import Any

import qrcode
from jinja2 import Environment, FileSystemLoader, select_autoescape
from markupsafe import Markup
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select

from app.models.company_profile import CompanyProfile
from app.models.company_profile_normalized import ContractTerm
from app.models.proposal import Proposal
from app.utils.security import settings

OUTPUT_DIR = Path(settings.PDF_OUTPUT_DIR or "./generated_pdfs")
OUTPUT_DIR.mkdir(parents=True, exist_ok=True)

UPLOAD_DIR = Path(settings.UPLOAD_DIR or "./uploads")
UPLOAD_DIR.mkdir(parents=True, exist_ok=True)

TEMPLATE_DIR = Path(__file__).resolve().parent.parent / "templates"


def _logo_path_to_base64(logo_path: str | None) -> str:
    """Convert a logo path (e.g., '/uploads/abc.png') to a base64 data URL for PDF rendering."""
    if not logo_path:
        return ""
    # If it's already a data URL, return as-is
    if logo_path.startswith("data:"):
        return logo_path
    # If it's an HTTP/HTTPS URL, return as-is (browser can fetch it)
    if logo_path.startswith("http://") or logo_path.startswith("https://"):
        return logo_path
    # If it's a /uploads/ path, convert to base64
    if logo_path.startswith("/uploads/"):
        filename = logo_path.split("/uploads/")[-1]
        file_path = UPLOAD_DIR / filename
        if file_path.exists():
            try:
                with open(file_path, "rb") as f:
                    data = f.read()
                mime_type = "image/png"
                if filename.lower().endswith((".jpg", ".jpeg")):
                    mime_type = "image/jpeg"
                elif filename.lower().endswith(".svg"):
                    mime_type = "image/svg+xml"
                elif filename.lower().endswith(".webp"):
                    mime_type = "image/webp"
                b64 = base64.b64encode(data).decode("utf-8")
                return f"data:{mime_type};base64,{b64}"
            except Exception:
                pass
    return logo_path

REFERENCE_CONTENT = {
    "cover": {
        "project_title": "Genie - Ask, Give Connect !!",
        "cover_tagline": "Build your company's strong online presence.",
        "client_name": "Mr. Mohammad Sharif",
        "client_designation": "Executive Director",
        "client_website": "www.pravyatech.com",
        "prepared_by_name": "Mr. Pratikbharathi Goswami",
        "prepared_by_designation": "Sales Head",
        "office_name": "PRAVYA TECH (HEAD OFFICE)",
        "office_address": "618 Level 6, 150 Feet Ring Road,\nOpp. Imperial Heights,\nRajkot 360005.",
        "phone": "+(91) 898 0000 196",
        "email": "talk@pravyatech.com",
        "issued_date": "25/05/2026",
        "valid_till": "01/06/2026",
        "closing_tagline": "We are not developing the technology,\nWe are technology.",
    },
    "cover_letter": {
        "recipient_name": "Mr. Mohammad Sharif",
        "recipient_designation": "Director",
        "letter_date": "23/05/2026",
        "letter_body": [
            "PRAVYA TECH is pleased to submit this website development proposal. We understand the importance of a strong digital presence and the role a customized, user-friendly website plays in building trust with customers.",
            "The proposed website will be performance-driven, responsive, scalable, and optimized for a seamless user experience. Our team combines creativity, technical expertise, and industry knowledge to align every deliverable with your business goals.",
            "The enclosed proposal includes the project scope, timeline, technologies, and cost breakdown. We are committed to transparent communication, timely delivery, and long-term support.",
        ],
        "signer_name": "PRATIKBHARATHI GOSWAMI",
        "signer_designation": "FOUNDER & CEO",
        "proposal_introduction": "Thank you for considering PRAVYA TECH. We look forward to building a lasting partnership.",
    },
    "company_profile": {
        "positioning": "A Creative, Strategic & Accountable Design Agency.",
        "vision": "To become a global leader in mobile-first technology by empowering businesses and individuals with innovative, intuitive, and impactful digital solutions.",
        "mission": "To design and develop smart, scalable, user-centric mobile and web applications that solve real-world problems with simplicity, speed, and a seamless user experience.",
        "core_values": [
            {"title": "Customers First", "description": "Client outcomes guide every decision."},
            {"title": "Act with Integrity", "description": "We earn trust through transparent work."},
            {"title": "Great Teamwork", "description": "Shared ownership produces better outcomes."},
            {"title": "Focus on Solutions", "description": "We turn constraints into practical progress."},
        ],
    },
    "services": {
        "positioning": "We are a leading design agency with a market-leading presence in the digital market.",
        "categories": [
            {"name": "DESIGN", "items": ["Wordpress UI / UX", "Mobile App UI / UX", "E-Commerce UI / UX", "Custom Application Design"]},
            {"name": "DEVELOPMENT", "items": ["Wordpress Development", "Mobile App Development", "E-Commerce Development", "Custom Application Development"]},
            {"name": "MARKETING / COMMUNICATION", "items": ["Social Media Marketing", "Email Marketing", "Whatsapp Chatbot"]},
            {"name": "ANALYTICS", "items": ["Website Analytics", "Mobile App Analytics"]},
        ],
        "additional_labels": ["Website Designing", "Research & Analysis", "Content Marketing", "Design & Illustration"],
    },
    "process": {
        "intro": "We work with clients to develop the right strategy from the very first stage to the last stage.",
        "heading": "Our work process - From very first touch point to launch and beyond.",
        "steps": [
            {"number": "01", "title": "Initial Discussion", "description": "Initial meeting, project discussion, assessment, and agreement."},
            {"number": "02", "title": "Research & Design", "description": "Research, project outline, wireframes, artwork, and revisions."},
            {"number": "03", "title": "Development", "description": "Coding, development, validation, and cross-platform testing."},
            {"number": "04", "title": "Implementation", "description": "Implementation, content placement, optimization, and testing."},
            {"number": "05", "title": "Finalization", "description": "Final refinement, deployment, maintenance, training, and support."},
        ],
    },
    "terms": {
        "payment_terms": ["50% Advanced", "50% Immediately After Deployment", "18% GST will be applicable as per government regulations."],
        "annual_maintenance_contract": ["25% of project value as per bill.", "AMC applies when existing features are not working or technical bugs occur.", "New features and requirements are not included in AMC."],
        "services_limitations": ["PRAVYA TECH is not liable for issues occurring in integrated third-party services including Cloud, Backups, E-Mail, SMS, WhatsApp, IVR, and other integrated software or services."],
        "exclusions": ["Anything not specified in the approved specification and demo system.", "Third-party software and API integrations not specifically mentioned.", "Cloud hosting charges.", "Future updates in App, Web, or Software."],
        "client_side_support": ["One decision-maker is required from the client side.", "PRAVYA TECH will communicate with that person and their decisions will be final for the engagement."],
        "project_cancellation": ["Payment is non-refundable once work has started from PRAVYA TECH's side."],
    },
    "clients": {
        "bni": [
            {"name": "Shree Cement"},
            {"name": "Adani Group"},
            {"name": "Reliance Industries"},
            {"name": "Tata Consultancy Services"},
            {"name": "Infosys"},
            {"name": "Wipro"},
        ],
        "international": [
            {"name": "TechFlow Inc. (USA)"},
            {"name": "EuroTech Solutions (Germany)"},
            {"name": "Asia Pacific Digital (Singapore)"},
            {"name": "UK Digital Labs (London)"},
            {"name": "Canada Tech Ventures (Toronto)"},
        ],
    },
    "pricing": {
        "items": [{"name": "Genie - Ask, Give & Connect", "description": ["Android & iOS App", "Web Admin Panel", "Technical Support", "Include Server Cost"], "price": "9 OMR", "unit": "Member / Year"}],
        "currency": "OMR",
        "billing_unit": "Member / Year",
        "tax_rate": 18,
        "note": "Note: the amount is excluding 18% GST.",
    },
    "payment_methods": {
        "qr_code": None,
        "upi_id": "PRAVYA2618@OKSBI",
        "bank_name": "STATE BANK OF INDIA",
        "account_number": "40410281486",
        "branch_name": "Bhanktinagar Station Main Road",
        "ifsc": "SBIN0001851",
        "swift_code": "",
        "iban": "",
    },
    "acceptance": {
        "text": "By signing this document, the client confirms acceptance of the quote and authorizes PRAVYA TECH to commence the project. The client accepts the project scope, estimated timeline, payment terms, and relevant terms and conditions.",
        "additional_work_clause": "Additional work outside the agreed scope may require a separate quotation and written approval.",
        "signature_fields": {"date": "Date", "name": "Name", "signature": "Signature"},
    },
    "branches": [
        {"branch_name": "PRAVYA TECH (MAIN BRANCH)", "address": "618 LEVEL 6, 150 FEET RING ROAD,\nOPP. IMPERIAL HEIGHTS, NEAR BIG BAZAR,\nRAJKOT 360005.", "phone": "+(91) 898 00 00 196", "email": "sales@pravyatech.com", "website": "www.pravyatech.com"},
        {"branch_name": "SECOND BRANCH", "address": "304, NAKSHATRA 6, GONDAL ROAD,\nOPP. PINEVINTA HOTEL,\nRAJKOT 360002.", "phone": "+(91) 898 00 00 196", "email": "sales@pravyatech.com", "website": ""},
        {"branch_name": "THIRD BRANCH", "address": "143 KERRY CMN,\nFremont, California U.S.A,\n94536.", "phone": "+1 (408) 507-6353", "email": "sales@pravyatech.com", "website": ""},
    ],
    "closing_statement": "Take your business to the next level.",
}


def _deep_merge(base: dict[str, Any], override: dict[str, Any]) -> dict[str, Any]:
    result = copy.deepcopy(base)
    for key, value in override.items():
        if isinstance(value, dict) and isinstance(result.get(key), dict):
            result[key] = _deep_merge(result[key], value)
        else:
            result[key] = value
    return result


def _as_dict(value: Any) -> dict[str, Any]:
    return value if isinstance(value, dict) else {}


def _as_list(value: Any) -> list[Any]:
    return value if isinstance(value, list) else []


def _item_text(item: Any, key: str = "name", fallback: str = "") -> str:
    if isinstance(item, dict):
        return str(item.get(key) or item.get("title") or fallback)
    if hasattr(item, key):
        return str(getattr(item, key) or fallback)
    return str(item or fallback)


def _safe_hex(value: Any, fallback: str) -> str:
    text = str(value or "").strip()
    if len(text) in {4, 7} and text.startswith("#"):
        return text
    return fallback


def _format_date(value: Any, fallback: str | None = None) -> str:
    if value:
        try:
            if isinstance(value, datetime):
                return value.strftime("%d/%m/%Y")
            return datetime.fromisoformat(str(value).replace("Z", "+00:00")).strftime("%d/%m/%Y")
        except ValueError:
            return str(value)
    return fallback or datetime.now().strftime("%d/%m/%Y")


def _service_categories(company_profile: CompanyProfile | None) -> list[dict[str, Any]]:
    services = _as_list(company_profile.services if company_profile else None)
    names = [_item_text(item, "title") for item in services if _item_text(item, "title")]
    if not names:
        return copy.deepcopy(REFERENCE_CONTENT["services"]["categories"])
    groups = {
        "DESIGN": [],
        "DEVELOPMENT": [],
        "MARKETING / COMMUNICATION": [],
        "ANALYTICS": [],
    }
    for name in names:
        lowered = name.lower()
        if any(word in lowered for word in ["design", "ui / ux", "illustration"]):
            groups["DESIGN"].append(name)
        elif any(word in lowered for word in ["development", "wordpress", "mobile", "ecommerce", "application"]):
            groups["DEVELOPMENT"].append(name)
        elif any(word in lowered for word in ["marketing", "social", "email", "whatsapp"]):
            groups["MARKETING / COMMUNICATION"].append(name)
        else:
            groups["ANALYTICS"].append(name)
    return [{"name": name, "items": items or ["Custom digital solutions"]} for name, items in groups.items()]


def _service_categories_with_logos(company_profile: CompanyProfile | None, services: list[dict]) -> list[dict[str, Any]]:
    """Like _service_categories but preserves logos from the services list."""
    # Build a map of title -> logo for quick lookup
    logo_map = {}
    for s in services:
        if isinstance(s, dict) and s.get("title") and s.get("logo"):
            logo_map[s["title"]] = s["logo"]
    
    names = [s.get("title") for s in services if isinstance(s, dict) and s.get("title")]
    if not names:
        return copy.deepcopy(REFERENCE_CONTENT["services"]["categories"])
    groups = {
        "DESIGN": [],
        "DEVELOPMENT": [],
        "MARKETING / COMMUNICATION": [],
        "ANALYTICS": [],
    }
    for name in names:
        lowered = name.lower()
        if any(word in lowered for word in ["design", "ui / ux", "illustration"]):
            groups["DESIGN"].append({"name": name, "logo": logo_map.get(name)})
        elif any(word in lowered for word in ["development", "wordpress", "mobile", "ecommerce", "application"]):
            groups["DEVELOPMENT"].append({"name": name, "logo": logo_map.get(name)})
        elif any(word in lowered for word in ["marketing", "social", "email", "whatsapp"]):
            groups["MARKETING / COMMUNICATION"].append({"name": name, "logo": logo_map.get(name)})
        else:
            groups["ANALYTICS"].append({"name": name, "logo": logo_map.get(name)})
    return [{"name": name, "items": items or [{"name": "Custom digital solutions", "logo": None}]} for name, items in groups.items()]


def _normalize_branches_rel(branches_rel: list) -> list[dict[str, Any]]:
    """Normalize branches from relational data (BranchOffice objects)"""
    result = []
    for index, office in enumerate(branches_rel, 1):
        result.append({
            "branch_name": str(getattr(office, "name", f"BRANCH {index:02d}")),
            "address": "",
            "phone": "",
            "email": "",
            "website": "",
        })
    return result


def _normalize_contract_terms(terms: Any) -> list[dict[str, Any]]:
    """Normalize contract terms from either JSON or relational data."""
    result = []
    for item in _as_list(terms):
        if isinstance(item, dict):
            result.append({
                "title": str(item.get("title") or "Section"),
                "bullets": _as_list(item.get("bullets")),
            })
        elif hasattr(item, "title"):
            # Relational ContractTerm object
            result.append({
                "title": str(getattr(item, "title", "Section")),
                "bullets": _as_list(getattr(item, "bullets", [])),
            })
        else:
            result.append({"title": str(item), "bullets": []})
    return result


def _normalize_clients(value: Any) -> list[dict[str, Any]]:
    result = []
    for item in _as_list(value):
        if isinstance(item, dict):
            logo = item.get("logo") or item.get("logo_url")
            if logo:
                logo = _logo_path_to_base64(logo)
            result.append({"name": str(item.get("name") or item.get("title") or "Client"), "logo": logo})
        else:
            result.append({"name": str(item), "logo": None})
    return result


def _normalize_clients_rel(clients_rel: list) -> list[dict[str, Any]]:
    """Normalize clients from relational data (BNIClient or InternationalClient objects)"""
    result = []
    for client in clients_rel:
        result.append({
            "name": client.name,
            "logo": _logo_path_to_base64(client.logo) if client.logo else None
        })
    return result


def _normalize_branches(value: Any) -> list[dict[str, Any]]:
    result = []
    for index, item in enumerate(_as_list(value), 1):
        if isinstance(item, dict):
            result.append({
                "branch_name": str(item.get("branch_name") or item.get("name") or f"BRANCH {index:02d}"),
                "address": str(item.get("address") or item.get("location") or ""),
                "phone": str(item.get("phone") or ""),
                "email": str(item.get("email") or ""),
                "website": str(item.get("website") or ""),
            })
        else:
            result.append({"branch_name": f"BRANCH {index:02d}", "address": str(item), "phone": "", "email": "", "website": ""})
    return result


def _build_content(proposal: Proposal, company_profile: CompanyProfile | None) -> dict[str, Any]:
    raw_value = getattr(proposal, "content", None)
    if isinstance(raw_value, str):
        try:
            raw_value = json.loads(raw_value)
        except json.JSONDecodeError:
            raw_value = {}
    raw = _as_dict(raw_value)
    content = _deep_merge(REFERENCE_CONTENT, raw)

    company = str(getattr(company_profile, "company_name", None) or "PRAVYA TECH")
    tagline = str(getattr(company_profile, "tagline", None) or "Empowering Businesses Through Technology")
    email = str(getattr(company_profile, "email", None) or "talk@pravyatech.com")
    phone = str(getattr(company_profile, "phone", None) or "+(91) 898 0000 196")
    website = str(getattr(company_profile, "website", None) or "www.pravyatech.com")
    sales_head = str(getattr(company_profile, "sales_head_name", None) or "Pratikbharathi Goswami")
    sales_head_title = str(getattr(company_profile, "sales_head_title", None) or "Founder & CEO")

    cover = content.setdefault("cover", {})
    cover.setdefault("project_title", getattr(proposal, "project_title", None) or company)
    cover.setdefault("cover_tagline", getattr(proposal, "project_subtitle", None) or tagline)
    cover.setdefault("client_name", getattr(proposal, "client_name", None) or company)
    cover.setdefault("client_designation", "Executive Director")
    cover.setdefault("client_website", getattr(proposal, "company_name", None) or website)
    cover.setdefault("prepared_by_name", sales_head)
    cover.setdefault("prepared_by_designation", sales_head_title)
    cover.setdefault("office_name", company)
    cover.setdefault("phone", phone)
    cover.setdefault("email", email)
    created = getattr(proposal, "created_at", None)
    cover.setdefault("issued_date", _format_date(created))
    cover.setdefault("valid_till", (created + timedelta(days=7)).strftime("%d/%m/%Y") if created else (datetime.now() + timedelta(days=7)).strftime("%d/%m/%Y"))
    cover.setdefault("closing_tagline", "We are not developing the technology,\nWe are technology.")

    letter = content.setdefault("cover_letter", {})
    letter.setdefault("recipient_name", getattr(proposal, "client_name", None) or cover.get("client_name", "Valued Client"))
    letter.setdefault("recipient_designation", "Director")
    letter.setdefault("letter_date", cover.get("issued_date", datetime.now().strftime("%d/%m/%Y")))
    letter.setdefault("signer_name", sales_head.upper())
    letter.setdefault("signer_designation", sales_head_title.upper())
    letter.setdefault("proposal_introduction", "Thank you for considering PRAVYA TECH. We look forward to building a lasting partnership.")

    # Use saved cover letter content from company profile if available
    if company_profile:
        if getattr(company_profile, "cover_letter_salutation", None):
            letter["salutation"] = company_profile.cover_letter_salutation
        if getattr(company_profile, "cover_letter_paragraphs", None):
            letter["letter_body"] = company_profile.cover_letter_paragraphs
        if getattr(company_profile, "cover_letter_signoff", None):
            letter["signoff"] = company_profile.cover_letter_signoff

    profile_data = content.setdefault("company_profile", {})
    raw_profile = _as_dict(raw.get("company_profile"))
    if not raw_profile.get("vision") and getattr(company_profile, "vision", None):
        profile_data["vision"] = company_profile.vision
    if not raw_profile.get("mission") and getattr(company_profile, "mission", None):
        profile_data["mission"] = company_profile.mission
    if not raw_profile.get("core_values") and getattr(company_profile, "core_values_rel", None):
        # Convert logos to base64 for PDF rendering
        core_values = []
        for v in company_profile.core_values_rel:
            core_values.append({
                "title": v.title,
                "description": v.description or "",
                "logo": _logo_path_to_base64(v.logo) if v.logo else ""
            })
        profile_data["core_values"] = core_values
    # Use saved profile paragraphs from company profile if available
    if company_profile and getattr(company_profile, "profile_paragraphs", None):
        profile_data["profile_paragraphs"] = company_profile.profile_paragraphs

    services_data = content.setdefault("services", {})
    if not raw.get("services") and company_profile and getattr(company_profile, "services_rel", None):
        # Convert service logos to base64 for PDF rendering
        services = []
        for s in company_profile.services_rel:
            services.append({
                "title": s.title,
                "description": s.description or "",
                "logo": _logo_path_to_base64(s.logo) if s.logo else ""
            })
        services_data["categories"] = _service_categories_with_logos(company_profile, services)

    process_data = content.setdefault("process", {})
    if not raw.get("process") and getattr(company_profile, "work_process_steps_rel", None):
        process_data["steps"] = [
            {
                "number": f"{i + 1:02d}",
                "title": step.title,
                "description": step.description or "",
                "icon": step.icon or "",
            }
            for i, step in enumerate(company_profile.work_process_steps_rel[:5])
        ]
    else:
        process_data.setdefault("steps", copy.deepcopy(REFERENCE_CONTENT["process"]["steps"]))

    terms_data = content.setdefault("terms", {})
    raw_terms = raw.get("terms_sections")
    if isinstance(raw_terms, dict):
        terms_data.update(raw_terms)
    elif not raw.get("terms") and getattr(company_profile, "terms", None):
        terms_data.update(_terms_from_text(company_profile.terms))

    # Contract terms from relational table
    if getattr(company_profile, "contract_terms_rel", None):
        content["contract_terms"] = _normalize_contract_terms(company_profile.contract_terms_rel)

    clients_data = content.setdefault("clients", {})
    if not raw.get("clients"):
        if getattr(company_profile, "bni_clients_rel", None):
            clients_data["bni"] = _normalize_clients_rel(company_profile.bni_clients_rel)
        if getattr(company_profile, "international_clients_rel", None):
            clients_data["international"] = _normalize_clients_rel(company_profile.international_clients_rel)

    pricing_data = content.setdefault("pricing", {})
    line_items = _as_list(getattr(proposal, "line_items", None))
    if line_items:
        pricing_items = []
        for item in line_items:
            if isinstance(item, dict):
                pricing_items.append({
                    "name": str(item.get("title") or item.get("name") or "Project delivery"),
                    "description": [str(item.get("description") or "")] if item.get("description") else [],
                    "price": f"{getattr(proposal, 'currency_symbol', None) or ''}{float(item.get('unit_price') or 0):,.2f}",
                    "unit": str(getattr(proposal, "contract_duration", None) or "Project"),
                })
        pricing_data["items"] = pricing_items
        pricing_data["currency"] = getattr(proposal, "currency", None) or "USD"
        pricing_data["note"] = f"Total investment: {(getattr(proposal, 'currency_symbol', None) or '')}{float(getattr(proposal, 'amount') or 0):,.2f} {getattr(proposal, 'currency', '')}"

    payment_data = content.setdefault("payment_methods", {})
    if company_profile:
        payment_data.setdefault("qr_code", getattr(company_profile, "qr_code", None) or getattr(company_profile, "payment_qr_code", None))
        payment_data.setdefault("upi_id", getattr(company_profile, "upi_id", None) or "PRAVYA2618@OKSBI")
        payment_data.setdefault("bank_name", getattr(company_profile, "bank_name", None) or "STATE BANK OF INDIA")
        payment_data.setdefault("account_number", getattr(company_profile, "bank_account_number", None) or "40410281486")
        payment_data.setdefault("branch_name", getattr(company_profile, "bank_branch", None) or "Rajkot")
        payment_data.setdefault("ifsc", getattr(company_profile, "bank_ifsc", None) or "SBIN0001851")
        payment_data.setdefault("swift_code", getattr(company_profile, "swift_code", None) or "")
        payment_data.setdefault("iban", getattr(company_profile, "iban", None) or "")

    if not raw.get("branches") and getattr(company_profile, "branch_offices_rel", None):
        content["branches"] = _normalize_branches_rel(company_profile.branch_offices_rel)

    return content


def _nl2br_filter(value: Any) -> Markup:
    text = str(value or "").replace("\r\n", "\n").replace("\r", "\n").replace("\n", "<br/>")
    return Markup(text)


def _qr_src(value: Any) -> str:
    try:
        source = str(value or "www.pravyatech.com")
        if source.startswith("data:"):
            return source
        buffer = io.BytesIO()
        qrcode.make(source).save(buffer, format="PNG")
        encoded = base64.b64encode(buffer.getvalue()).decode("ascii")
        return f"data:image/png;base64,{encoded}"
    except Exception:
        return ""


def _template_context(content: dict[str, Any], company_profile: CompanyProfile | None) -> dict[str, Any]:
    # Hardcoded PravyaTech brand colors (removed from company_profile)
    primary = "#C81D31"
    dark = "#2A2C35"
    accent = "#C81D31"

    terms = content.get("terms", {})
    terms_sections = [
        ("Payment Terms", terms.get("payment_terms", [])),
        ("Annual Maintenance Contract", terms.get("annual_maintenance_contract", [])),
        ("Services Limitations", terms.get("services_limitations", [])),
        ("Exclusions", terms.get("exclusions", [])),
        ("Client Side Support", terms.get("client_side_support", [])),
        ("Project Cancellation", terms.get("project_cancellation", [])),
    ]

    payment = dict(content.get("payment_methods", {}))
    payment["qr_src"] = _qr_src(payment.get("qr_code") or payment.get("upi_id") or "www.pravyatech.com")
    payment["swift_iban"] = str(payment.get("swift_code") or payment.get("iban") or "")

    return {
        "colors": {
            "primary": primary,
            "dark": dark,
            "accent": accent,
            "light": "#F8FAFC",
            "line": "#E2E8F0",
            "muted": "#64748B",
        },
        "cover": content.get("cover", {}),
        "cover_letter": content.get("cover_letter", {}),
        "company_profile": content.get("company_profile", {}),
        "services": content.get("services", {}),
        "process": content.get("process", {}),
        "terms_sections": terms_sections,
        "contract_terms": content.get("contract_terms", []),
        "clients": content.get("clients", {}),
        "pricing": content.get("pricing", {}),
        "payment": payment,
        "acceptance": content.get("acceptance", {}),
        "branches": content.get("branches", []),
        "closing_statement": content.get("closing_statement", "Take your business to the next level."),
    }


def _find_browser() -> str:
    if os.name == "nt":
        candidates = [
            r"C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe",
            r"C:\Program Files\Microsoft\Edge\Application\msedge.exe",
            r"C:\Program Files\Google\Chrome\Application\chrome.exe",
            r"C:\Program Files (x86)\Google\Chrome\Application\chrome.exe",
            os.path.expandvars(r"%LOCALAPPDATA%\Microsoft\Edge\Application\msedge.exe"),
            os.path.expandvars(r"%LOCALAPPDATA%\Google\Chrome\Application\chrome.exe"),
        ]
    else:
        candidates = ["google-chrome", "google-chrome-stable", "chromium", "chromium-browser", "microsoft-edge"]
    for candidate in candidates:
        if os.path.exists(candidate) or shutil.which(candidate):
            return candidate
    raise RuntimeError("No compatible Chromium/Edge browser found for HTML->PDF rendering")


def _render_html_to_pdf(html: str, filepath: str) -> None:
    html_path = OUTPUT_DIR / f"_render_{uuid.uuid4().hex}.html"
    html_path.write_text(html, encoding="utf-8")
    try:
        browser = _find_browser()
        url = html_path.resolve().as_uri()
        command = [
            browser,
            "--headless",
            "--disable-gpu",
            "--no-sandbox",
            "--no-pdf-header-footer",
            f"--print-to-pdf={os.path.abspath(filepath)}",
            "--virtual-time-budget=15000",
            url,
        ]
        result = subprocess.run(command, capture_output=True, text=True, timeout=90)
        if not os.path.exists(filepath) or os.path.getsize(filepath) == 0:
            detail = result.stderr[-1500:] if result.stderr else "no error output"
            raise RuntimeError(f"HTML->PDF rendering failed: {detail}")
    finally:
        html_path.unlink(missing_ok=True)


def render_proposal_pdf(content: dict[str, Any], company_profile: CompanyProfile | None, filepath: str) -> None:
    context = _template_context(content, company_profile)
    env = Environment(
        loader=FileSystemLoader(str(TEMPLATE_DIR)),
        autoescape=select_autoescape(["html", "htm", "xml"]),
    )
    env.filters["nl2br"] = _nl2br_filter
    template = env.get_template("proposal_template.html")
    html = template.render(**context)
    _render_html_to_pdf(html, filepath)


def build_proposal_pdf(proposal: Proposal, filepath: str, company_profile: CompanyProfile | None = None):
    content = _build_content(proposal, company_profile)
    render_proposal_pdf(content, company_profile, filepath)


def build_profile_pdf(proposal: Proposal, filepath: str, company_profile: CompanyProfile | None = None):
    build_proposal_pdf(proposal, filepath, company_profile)


def render_company_profile_pdf(company_profile: CompanyProfile | None, filepath: str) -> None:
    """Render a dedicated company profile PDF using company_profile_template.html."""
    cp = company_profile

    # Hardcoded PravyaTech brand colors (removed from company_profile)
    primary = "#C81D31"
    dark = "#2A2C35"
    accent = "#C81D31"

    company_name = str(getattr(cp, "company_name", None) or "PRAVYA TECH")
    tagline = str(getattr(cp, "tagline", None) or "Empowering Businesses Through Technology")
    email = str(getattr(cp, "email", None) or "")
    phone = str(getattr(cp, "phone", None) or "")
    website = str(getattr(cp, "website", None) or "")
    sales_head_name = str(getattr(cp, "sales_head_name", None) or "")
    sales_head_title = str(getattr(cp, "sales_head_title", None) or "")

    # Logo src: prefer logo_data (base64), fall back to logo_url, then convert /uploads/ paths to base64
    logo_data = getattr(cp, "logo_data", None)
    logo_url = getattr(cp, "logo_url", None)
    logo_src = _logo_path_to_base64(logo_data if logo_data else (logo_url if logo_url else ""))
    signature_data = None
    if getattr(cp, "signatures_rel", None) and len(cp.signatures_rel) > 0:
        signature_data = cp.signatures_rel[0].image_data
    signature_src = _logo_path_to_base64(signature_data) if signature_data else ""

    # Core values – use relational data and convert logos to base64
    core_values = []
    for v in getattr(cp, "core_values_rel", []):
        core_values.append({
            "title": v.title,
            "description": v.description or "",
            "logo": _logo_path_to_base64(v.logo) if v.logo else ""
        })

    # Services – use relational data and convert logos to base64
    services = []
    for s in getattr(cp, "services_rel", []):
        services.append({
            "title": s.title,
            "description": s.description or "",
            "logo": _logo_path_to_base64(s.logo) if s.logo else ""
        })

    # Clients – use relational data and convert logos to base64
    bni_clients = []
    for c in getattr(cp, "bni_clients_rel", []):
        bni_clients.append({
            "name": c.name,
            "logo": _logo_path_to_base64(c.logo) if c.logo else None
        })

    international_clients = []
    for c in getattr(cp, "international_clients_rel", []):
        international_clients.append({
            "name": c.name,
            "logo": _logo_path_to_base64(c.logo) if c.logo else None
        })

    # Branches – use relational data
    branches = []
    for o in getattr(cp, "branch_offices_rel", []):
        branches.append({
            "branch_name": o.name,
            "address": "",
            "phone": "",
            "email": "",
            "website": ""
        })

    # Contract Terms – use relational data
    contract_terms = []
    for t in getattr(cp, "contract_terms_rel", []):
        contract_terms.append({
            "title": t.title,
            "bullets": t.bullets or []
        })

    # Profile paragraphs - use saved content
    profile_paragraphs = getattr(cp, "profile_paragraphs", None) or []

    # Cover letter content - use saved content
    cover_letter_salutation = getattr(cp, "cover_letter_salutation", None) or "Dear Valued Client,"
    cover_letter_paragraphs = getattr(cp, "cover_letter_paragraphs", None) or []
    cover_letter_signoff = getattr(cp, "cover_letter_signoff", None) or "Warm regards,"

    # Terms (legacy)
    terms_text = str(getattr(cp, "terms", None) or "")
    terms_dict = _terms_from_text(terms_text) if terms_text else {}
    terms_sections = [
        ("Payment Terms", terms_dict.get("payment_terms", [])),
        ("Annual Maintenance Contract", terms_dict.get("annual_maintenance_contract", [])),
        ("Services Limitations", terms_dict.get("services_limitations", [])),
        ("Exclusions", terms_dict.get("exclusions", [])),
        ("Client Side Support", terms_dict.get("client_side_support", [])),
        ("Project Cancellation", terms_dict.get("project_cancellation", [])),
    ]
    # Only include sections that have content
    terms_sections = [(t, items) for t, items in terms_sections if items]

    # Payment
    payment: dict[str, Any] = {}
    if cp:
        payment["qr_code"] = getattr(cp, "qr_code", None)
        payment["upi_id"] = str(getattr(cp, "upi_id", None) or "")
        payment["bank_name"] = str(getattr(cp, "bank_name", None) or "")
        payment["account_number"] = str(getattr(cp, "bank_account_number", None) or "")
        payment["branch_name"] = str(getattr(cp, "bank_branch", None) or "")
        payment["ifsc"] = str(getattr(cp, "bank_ifsc", None) or "")
        payment["swift_code"] = str(getattr(cp, "swift_code", None) or "")
        payment["iban"] = str(getattr(cp, "iban", None) or "")
        payment["swift_iban"] = payment["swift_code"] or payment["iban"] or "-"
        payment["qr_src"] = _qr_src(payment["qr_code"] or payment["upi_id"] or website or "")

    # Calculate total pages: Cover + Cover Letter + Profile + Services? + Terms? + BNI? + Intl? + Payment? + Branches
    total_pages = 3  # cover + cover letter + profile always
    if services:
        total_pages += 1
    if terms_sections:
        total_pages += 1
    if bni_clients:
        total_pages += 1
    if international_clients:
        total_pages += 1
    if payment and (payment.get("bank_name") or payment.get("upi_id")):
        total_pages += 1
    total_pages += 1  # branches/closing

    positioning = getattr(cp, "tagline", None) or tagline
    closing_statement = "Take your business to the next level."

    now = datetime.now()
    current_date = now.strftime("%d/%m/%Y")
    valid_till = (now + timedelta(days=7)).strftime("%d/%m/%Y")

    env = Environment(
        loader=FileSystemLoader(str(TEMPLATE_DIR)),
        autoescape=select_autoescape(["html", "htm", "xml"]),
    )
    env.filters["nl2br"] = _nl2br_filter
    template = env.get_template("company_profile_template.html")
    html = template.render(
        colors={
            "primary": primary,
            "dark": dark,
            "accent": accent,
            "light": "#F8FAFC",
            "line": "#E2E8F0",
            "muted": "#64748B",
        },
        company_name=company_name,
        tagline=tagline,
        email=email,
        phone=phone,
        website=website,
        sales_head_name=sales_head_name,
        sales_head_title=sales_head_title,
        logo_src=logo_src,
        signature_src=signature_src,
        positioning=positioning,
        vision=str(getattr(cp, "vision", None) or ""),
        mission=str(getattr(cp, "mission", None) or ""),
        core_values=core_values,
        services=services,
        terms_sections=terms_sections,
        contract_terms=contract_terms,
        bni_clients=bni_clients,
        international_clients=international_clients,
        payment=payment,
        branches=branches,
        closing_statement=closing_statement,
        total_pages=total_pages,
        current_year=now.year,
        current_date=current_date,
        valid_till=valid_till,
        # New cover letter and profile content
        cover_letter_salutation=cover_letter_salutation,
        cover_letter_paragraphs=cover_letter_paragraphs,
        cover_letter_signoff=cover_letter_signoff,
        profile_paragraphs=profile_paragraphs,
    )
    _render_html_to_pdf(html, filepath)


async def _fetch_company_profile(db: AsyncSession) -> CompanyProfile | None:
    result = await db.execute(select(CompanyProfile).limit(1))
    return result.scalar_one_or_none()


def build_company_profile_pdf(company_profile: CompanyProfile | None, filepath: str):
    render_company_profile_pdf(company_profile, filepath)


async def generate_pdf(db: AsyncSession, proposal: Proposal) -> str:
    filename = f"{proposal.proposal_no or proposal.id}_{datetime.now().strftime('%Y%m%d%H%M%S')}.pdf"
    filepath = str(OUTPUT_DIR / filename)
    company_profile = await _fetch_company_profile(db)
    build_proposal_pdf(proposal, filepath, company_profile)
    proposal.pdf_path = filepath
    proposal.status = "sent"
    proposal.sent_at = proposal.sent_at or datetime.now()
    await db.commit()
    await db.refresh(proposal)
    return filepath