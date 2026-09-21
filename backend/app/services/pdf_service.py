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
            "title": str(getattr(office, "title", "")),
            "branch_name": str(getattr(office, "name", f"BRANCH {index:02d}")),
            "address": "",
            "phone": "",
            "email": "",
            "website": "",
        })
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


def _chunk_rows(items: list, size: int = 5) -> list[list]:
    """Split items into rows of up to `size` for the client showcase pages."""
    rows = []
    for i in range(0, len(items), size):
        rows.append(list(items[i:i + size]))
    return rows


def _text_items(value: Any) -> list[str]:
    """Convert a service/statement-of-work description into bullet items."""
    if isinstance(value, list):
        items = [str(x).strip() for x in value]
    else:
        text = str(value or "")
        items = [line.strip() for line in text.replace("\r\n", "\n").replace("\r", "\n").split("\n") if line.strip()]
    return items or ["Custom digital solutions"]


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

    clients_data = content.setdefault("clients", {})
    if getattr(company_profile, "bni_clients_rel", None):
        clients_data["bni"] = _normalize_clients_rel(company_profile.bni_clients_rel)
    elif raw_clients := raw.get("clients", {}).get("bni"):
        clients_data["bni"] = _normalize_clients(raw_clients)
    if getattr(company_profile, "regional_clients_rel", None):
        clients_data["regional"] = _normalize_clients_rel(company_profile.regional_clients_rel)
    elif raw_clients := raw.get("clients", {}).get("regional"):
        clients_data["regional"] = _normalize_clients(raw_clients)
    if getattr(company_profile, "international_clients_rel", None):
        clients_data["international"] = _normalize_clients_rel(company_profile.international_clients_rel)
    elif raw_clients := raw.get("clients", {}).get("international"):
        clients_data["international"] = _normalize_clients(raw_clients)

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
        bank_details = getattr(company_profile, "bank_details_rel", None)
        payment_method = getattr(company_profile, "payment_method_rel", None)
        if bank_details:
            payment_data.setdefault("qr_code", getattr(bank_details, "qr_code", None) or getattr(company_profile, "qr_code", None))
            payment_data.setdefault("upi_id", getattr(bank_details, "upi_id", None) or getattr(company_profile, "upi_id", None) or "PRAVYA2618@OKSBI")
            payment_data.setdefault("bank_name", getattr(bank_details, "bank_name", None) or getattr(company_profile, "bank_name", None) or "STATE BANK OF INDIA")
            payment_data.setdefault("account_number", getattr(bank_details, "account_number", None) or getattr(company_profile, "bank_account_number", None) or "40410281486")
            payment_data.setdefault("branch_name", getattr(bank_details, "branch", None) or getattr(company_profile, "bank_branch", None) or "Bhanktinagar Station Main Road")
            payment_data.setdefault("ifsc", getattr(bank_details, "ifsc", None) or getattr(company_profile, "bank_ifsc", None) or "SBIN0001851")
            payment_data.setdefault("swift_code", getattr(bank_details, "swift_code", None) or "")
            payment_data.setdefault("iban", getattr(bank_details, "iban", None) or "")
        elif payment_method:
            payment_data.setdefault("qr_code", getattr(payment_method, "qr_code", None) or getattr(company_profile, "qr_code", None))
            payment_data.setdefault("upi_id", getattr(payment_method, "upi_id", None) or getattr(company_profile, "upi_id", None) or "PRAVYA2618@OKSBI")
            payment_data.setdefault("bank_name", getattr(payment_method, "bank_name", None) or getattr(company_profile, "bank_name", None) or "STATE BANK OF INDIA")
            payment_data.setdefault("account_number", getattr(payment_method, "account_number", None) or getattr(company_profile, "bank_account_number", None) or "40410281486")
            payment_data.setdefault("branch_name", getattr(payment_method, "branch", None) or getattr(company_profile, "bank_branch", None) or "Bhanktinagar Station Main Road")
            payment_data.setdefault("ifsc", getattr(payment_method, "ifsc", None) or getattr(company_profile, "bank_ifsc", None) or "SBIN0001851")
            payment_data.setdefault("swift_code", getattr(payment_method, "swift_code", None) or "")
            payment_data.setdefault("iban", getattr(payment_method, "iban", None) or "")
        else:
            payment_data.setdefault("qr_code", getattr(company_profile, "qr_code", None) or getattr(company_profile, "payment_qr_code", None))
            payment_data.setdefault("upi_id", getattr(company_profile, "upi_id", None) or "PRAVYA2618@OKSBI")
            payment_data.setdefault("bank_name", getattr(company_profile, "bank_name", None) or "STATE BANK OF INDIA")
            payment_data.setdefault("account_number", getattr(company_profile, "bank_account_number", None) or "40410281486")
            payment_data.setdefault("branch_name", getattr(company_profile, "bank_branch", None) or "Bhanktinagar Station Main Road")
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
        qrcode.make(source).save(buffer)
        encoded = base64.b64encode(buffer.getvalue()).decode("ascii")
        return f"data:image/png;base64,{encoded}"
    except Exception:
        return ""


def _template_context(content: dict[str, Any], company_profile: CompanyProfile | None) -> dict[str, Any]:
    # Hardcoded PravyaTech brand colors (removed from company_profile)
    primary = "#C81D31"
    dark = "#2A2C35"
    accent = "#C81D31"


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
    if not core_values:
        core_values = [
            {"title": title, "description": "", "logo": ""}
            for title in ("Customers First", "Act with Integrity", "Great Teamwork", "Focus on Solutions")
        ]

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

    regional_clients = []
    for c in getattr(cp, "regional_clients_rel", []):
        regional_clients.append({
            "name": c.name,
            "logo": _logo_path_to_base64(c.logo) if c.logo else None
        })

    international_clients = []
    for c in getattr(cp, "international_clients_rel", []):
        international_clients.append({
            "name": c.name,
            "logo": _logo_path_to_base64(c.logo) if c.logo else None
        })

    # Branches – use relational data with global phone/email fallback
    branches = []
    for o in getattr(cp, "branch_offices_rel", []):
        branches.append({
            "title": str(getattr(o, "title", "")),
            "branch_name": str(getattr(o, "name", "")),
            "address": str(getattr(o, "name", "")),
            "phone": str(getattr(cp, "phone", "") or ""),
            "email": str(getattr(cp, "email", "") or ""),
            "website": str(getattr(o, "website", "") or ""),
        })

    # Work Process - use relational data
    process_steps = []
    for step in getattr(cp, "work_process_steps_rel", []):
        process_steps.append({
            "title": step.title or "",
            "description": step.description or "",
            "icon": step.icon or "",
        })

    # Profile paragraphs - use saved content
    profile_paragraphs = getattr(cp, "profile_paragraphs", None) or []

    # Cover letter content - use saved content
    cover_letter_salutation = getattr(cp, "cover_letter_salutation", None) or "Dear Valued Client,"
    cover_letter_paragraphs = getattr(cp, "cover_letter_paragraphs", None) or []
    cover_letter_signoff = getattr(cp, "cover_letter_signoff", None) or "Warm regards,"

    # Quote acceptance and footer tagline
    quote_acceptance_message = getattr(cp, "quote_acceptance_message", None)
    footer_tagline = getattr(cp, "footer_tagline", None)

    # Statement of Work & Contract Terms - use relational data
    statement_of_work = []
    for sow in getattr(cp, "statement_of_work_rel", []) or []:
        statement_of_work.append({
            "title": sow.heading,
            "description": sow.description or "",
        })

    # Payment - use normalized bank_details_rel or payment_method_rel
    payment: dict[str, Any] = {}
    if cp:
        # Try bank_details_rel first (new normalized table)
        bank_details = getattr(cp, "bank_details_rel", None)
        # Fallback to payment_method_rel
        payment_method = getattr(cp, "payment_method_rel", None)
        
        if bank_details:
            payment["qr_code"] = getattr(bank_details, "qr_code", None)
            payment["upi_id"] = str(getattr(bank_details, "upi_id", None) or "")
            payment["bank_name"] = str(getattr(bank_details, "bank_name", None) or "")
            payment["account_number"] = str(getattr(bank_details, "account_number", None) or "")
            payment["branch_name"] = str(getattr(bank_details, "branch", None) or "")
            payment["ifsc"] = str(getattr(bank_details, "ifsc", None) or "")
            payment["swift_code"] = str(getattr(bank_details, "swift_code", None) or "")
            payment["iban"] = str(getattr(bank_details, "iban", None) or "")
        elif payment_method:
            payment["qr_code"] = getattr(payment_method, "qr_code", None)
            payment["upi_id"] = str(getattr(payment_method, "upi_id", None) or "")
            payment["bank_name"] = str(getattr(payment_method, "bank_name", None) or "")
            payment["account_number"] = str(getattr(payment_method, "account_number", None) or "")
            payment["branch_name"] = str(getattr(payment_method, "branch", None) or "")
            payment["ifsc"] = str(getattr(payment_method, "ifsc", None) or "")
            payment["swift_code"] = str(getattr(payment_method, "swift_code", None) or "")
            payment["iban"] = str(getattr(payment_method, "iban", None) or "")
        else:
            # Fallback to deprecated fields on CompanyProfile
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

    # Total pages: Cover + Cover Letter + Profile always
    total_pages = 3
    if services:
        total_pages += 1
    if bni_clients:
        total_pages += 1
    if regional_clients:
        total_pages += 1
    if international_clients:
        total_pages += 1
    if statement_of_work:
        total_pages += 1
    if payment and (payment.get("bank_name") or payment.get("upi_id")):
        total_pages += 1
    total_pages += 1  # branches/closing

    # Positioning - no dedicated field, keep the original brand statement
    positioning = "A Creative, Strategic & Accountable Design Agency."

    # Closing statement - use footer_tagline from company settings if available
    closing_statement = str(getattr(cp, "footer_tagline", None) or "Take your business to the next level.")
    closing_flat = closing_statement.replace("\r\n", " ").replace("\r", " ").replace("\n", " ").strip()
    closing_words = closing_flat.split()
    closing_main = " ".join(closing_words[:-2]).strip() if len(closing_words) >= 2 else closing_statement
    closing_highlight = " ".join(closing_words[-2:]) if len(closing_words) >= 2 else ""

    now = datetime.now()
    current_year = now.year
    current_date = now.strftime("%d/%m/%Y")
    valid_till = (now + timedelta(days=7)).strftime("%d/%m/%Y")

    # Brand / cover texts (static defaults mirroring the original design)
    cover_tagline = str(getattr(cp, "footer_tagline", None) or "We are not developing the technology,\nWe are technology.")
    cover_subtitle = "Build your company's strong online presence."

    # Text-logo fallback split (e.g. "PRAVYA TECH" -> "PRAVYA" + "TECH")
    company_label_a, _, company_label_b = company_name.partition(" ")
    if not company_label_b:
        company_label_a, company_label_b = company_name, ""

    # Signer from dedicated cover-letter fields, falling back to sales head
    signer_name = str(getattr(cp, "cover_letter_signature_name", None) or sales_head_name or sales_head_name.upper())
    signer_designation = str(getattr(cp, "cover_letter_signature_designation", None) or sales_head_title or sales_head_title.upper())
    letter_date_raw = getattr(cp, "cover_letter_signature_date", None)
    letter_date = _format_date(letter_date_raw) if letter_date_raw else current_date

    if not signature_src and getattr(cp, "cover_letter_signature_image", None):
        signature_src = _logo_path_to_base64(cp.cover_letter_signature_image)

    # Cover letter paragraphs with a sensible fallback
    cover_letter_paragraphs = cover_letter_paragraphs or [
        f"On behalf of {company_name}, I am pleased to submit our proposal for the development of your website. We understand how crucial your digital presence is in today's competitive environment, and we are excited about the opportunity to bring your vision to life with a customized, user-friendly, and performance-driven website.",
        "With our expertise in web and mobile solutions, we design websites that not only look stunning but also function seamlessly - ensuring speed, responsiveness, scalability, and optimized user experience across all devices. Our team brings in creativity, technical skills, and industry insights to deliver solutions that truly align with your business goals.",
        "Enclosed with this letter is our detailed proposal, which includes the project scope, timeline, technologies we will use, and cost breakdown. We believe in transparent communication, timely delivery, and long-term support to help your website thrive.",
        "Thank you for considering PRAVYA Tech. We look forward to the possibility of working together.",
    ]
    letter_spacing = 27.5 if len(cover_letter_paragraphs) <= 4 else 88.0 / len(cover_letter_paragraphs)

    # Office address for cover/back panels (branch field stores name/address)
    office_address = branches[0]["address"] if branches else ""

    # Services -> boxes with bullet items (description split on new lines)
    services_boxes = []
    for s in services:
        if not s.get("title"):
            continue
        services_boxes.append({
            "title": s.get("title", ""),
            "items": _text_items(s.get("description")),
        })
    if not services_boxes:
        services_boxes = [
            {"title": "Website Designing", "items": ["Wordpress UI / UX", "Mobile App UI / UX", "E-Commerce UI / UX", "Custom Application Design"]},
            {"title": "Research & Analysis", "items": ["Website Analytics", "Mobile App Analytics"]},
            {"title": "Design & Illustration", "items": ["Wordpress Development", "Mobile App Development", "E-Commerce Development", "Custom Application Design"]},
            {"title": "Content Marketing", "items": ["Social Media Marketing", "Email Marketing", "Whatsapp Chatbot"]},
        ]

    # Work process steps (capped at 5 to fit the page)
    process_steps_normalized = []
    for i, step in enumerate(process_steps[:5]):
        title = str(step.get("title") or "").strip() or f"Step - {i + 1:02d}"
        process_steps_normalized.append({"title": title, "description": str(step.get("description") or "")})
    if not process_steps_normalized:
        process_steps_normalized = [
            {"title": "Step - 01", "description": "Initial meeting / Project / Discussion / Assessment / Agreement"},
            {"title": "Step - 02", "description": "Research / Project Outline / Wireframe / Artwork / Revisions"},
            {"title": "Step - 03", "description": "Coding / Development / Validation / Cross Platform Testing"},
            {"title": "Step - 04", "description": "Implementation / Content Placement / Optimization / Testing"},
            {"title": "Step - 05", "description": "Final Refinement / Deployment / Maintenance / Training / Support"},
        ]

    # Statement of work & contract terms cells (capped at 6)
    statement_of_work_cells = []
    for sow in statement_of_work[:6]:
        statement_of_work_cells.append({
            "title": sow.get("title", ""),
            "items": _text_items(sow.get("description")),
        })
    if not statement_of_work_cells:
        statement_of_work_cells = [
            {"title": "Payment Terms", "items": ["50% Advance on confirmation.", "50% After successful project completion.", "18% GST will be applicable as per government regulations."]},
            {"title": "Annual Maintenance Contract", "items": ["25% of project value as per bill.", "AMC will work when existing features not working or technical bugs happen.", "New feature/requirements will not include in AMC."]},
            {"title": "Services Limitations", "items": ["We are not liable for any kind of issues that occurred in third-party services that we have used.", "Integrated with our product software like Cloud, Backups, E-Mail, SMS, WhatsApp, IVR, etc."]},
            {"title": "Exclusions", "items": ["Anything which is not specified in the above specification is excluded.", "Integration with any 3rd party software system and APIs other than those mentioned above.", "Cloud Hosting charges.", "Future Updates in App/Web/Software."]},
            {"title": "Client Side Support", "items": ["We require one decision-maker from your side, and we will communicate with him only, and his decision will be final for us."]},
            {"title": "Project Cancellation", "items": ["Payment is non-refundable once the work is started from our end."]},
        ]

    # Back-cover branch columns (up to two aside from the head-office column)
    back_branches = [
        {
            "name": b.get("branch_name") or b.get("title", ""),
            "address": b.get("address", ""),
            "phone": b.get("phone", "") or phone,
            "email": b.get("email", "") or email,
        }
        for b in branches[:2]
    ]

    # Client rows (5 per row) and year label
    clients_year = f"{current_year}-{current_year + 1}"
    bni_rows = _chunk_rows(bni_clients)
    regional_rows = _chunk_rows(regional_clients)
    international_rows = _chunk_rows(international_clients)

    # Sequential page numbers for the pages that are always present
    page_letter = 2
    page_vision = 3
    page_services = 4
    page_process = 5
    next_page = 6
    page_bni = next_page
    if bni_clients:
        next_page += 1
    page_regional = next_page
    if regional_clients:
        next_page += 1
    page_international = next_page
    if international_clients:
        next_page += 1
    page_terms = next_page

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
        company_label_a=company_label_a,
        company_label_b=company_label_b,
        tagline=tagline,
        email=email,
        phone=phone,
        website=website,
        office_address=office_address,
        sales_head_name=sales_head_name,
        sales_head_title=sales_head_title,
        logo_src=logo_src,
        signature_src=signature_src,
        signer_name=signer_name,
        signer_designation=signer_designation,
        letter_date=letter_date,
        letter_spacing=letter_spacing,
        cover_tagline=cover_tagline,
        cover_subtitle=cover_subtitle,
        positioning=positioning,
        vision=str(getattr(cp, "vision", None) or "To become a global leader in mobile-first technology by empowering businesses and individuals with innovative, intuitive, and impactful digital solutions."),
        mission=str(getattr(cp, "mission", None) or "To design and develop smart, scalable, user-centric mobile and web applications that solve real-world problems with simplicity, speed, and a seamless user experience."),
        core_values=core_values,
        services_heading="What we offer and how we create values.",
        services_subheading="We are leading design agency.",
        services_lead="we have market leading presence in digital market.",
        services=services_boxes,
        process_heading="Our work process - From very first touch point to launch and beyond.",
        process_lead="We work with client to develop the right strategy from the very first stage to last stage...",
        process_steps=process_steps_normalized,
        bni_clients=bni_clients,
        regional_clients=regional_clients,
        international_clients=international_clients,
        bni_rows=bni_rows,
        regional_rows=regional_rows,
        international_rows=international_rows,
        clients_year=clients_year,
        statement_of_work=statement_of_work_cells,
        branches=back_branches,
        closing_main=closing_main,
        closing_highlight=closing_highlight,
        closing_statement=closing_statement,
        total_pages=total_pages,
        current_year=current_year,
        next_year=current_year + 1,
        current_date=current_date,
        valid_till=valid_till,
        cover_letter_salutation=cover_letter_salutation,
        cover_letter_paragraphs=cover_letter_paragraphs,
        cover_letter_signoff=cover_letter_signoff,
        cover_letter_signature_name=getattr(cp, "cover_letter_signature_name", None) or sales_head_name,
        cover_letter_signature_designation=getattr(cp, "cover_letter_signature_designation", None) or sales_head_title,
        profile_paragraphs=profile_paragraphs,
        quote_acceptance_message=quote_acceptance_message,
        footer_tagline=footer_tagline,
        page_letter=page_letter,
        page_vision=page_vision,
        page_services=page_services,
        page_process=page_process,
        page_bni=page_bni,
        page_regional=page_regional,
        page_international=page_international,
        page_terms=page_terms,
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