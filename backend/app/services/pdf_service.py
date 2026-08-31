import os
from datetime import datetime
from weasyprint import HTML, CSS
from fastapi import HTTPException
from sqlalchemy.ext.asyncio import AsyncSession

from app.models.proposal import Proposal


OUTPUT_DIR = os.getenv("PDF_OUTPUT_DIR", "./generated_pdfs")
os.makedirs(OUTPUT_DIR, exist_ok=True)


def render_proposal_html(proposal: Proposal) -> str:
    if proposal.proposal_type.value == "company_profile":
        return render_company_profile_html(proposal)
    return render_project_quotation_html(proposal)


def render_company_profile_html(proposal: Proposal) -> str:
    return f"""
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="UTF-8">
        <title>PRAVYA TECH - Company Profile</title>
        <style>
            body {{ font-family: Arial, sans-serif; margin: 0; padding: 0; }}
            .page {{ width: 210mm; min-height: 297mm; padding: 20mm; margin: 0 auto; box-sizing: border-box; }}
            h1 {{ color: #4F46E5; }}
            h2 {{ color: #1E293B; border-bottom: 2px solid #6366F1; padding-bottom: 5px; }}
            .header {{ text-align: center; margin-bottom: 30px; }}
            .footer {{ position: fixed; bottom: 0; width: 100%; text-align: center; font-size: 10px; color: #64748B; }}
        </style>
    </head>
    <body>
        <div class="page">
            <div class="header">
                <h1>PRAVYA TECH</h1>
                <p>Company Profile</p>
                <p>Proposal Number: {proposal.proposal_number}</p>
            </div>
            <h2>About Us</h2>
            <p>PRAVYA TECH is a leading technology solutions provider...</p>
            <h2>Our Services</h2>
            <ul>
                <li>Software Development</li>
                <li>Cloud Solutions</li>
                <li>Digital Transformation</li>
            </ul>
            <h2>Contact</h2>
            <p>Email: info@pravyatech.com</p>
            <p>Phone: +91-XXXXXXXXXX</p>
        </div>
        <div class="footer">Generated on {datetime.now().strftime('%Y-%m-%d %H:%M:%S')} | PRAVYA TECH</div>
    </body>
    </html>
    """


def render_project_quotation_html(proposal: Proposal) -> str:
    return f"""
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="UTF-8">
        <title>Proposal {proposal.proposal_number}</title>
        <style>
            body {{ font-family: Arial, sans-serif; margin: 0; padding: 0; }}
            .page {{ width: 210mm; min-height: 297mm; padding: 20mm; margin: 0 auto; box-sizing: border-box; }}
            h1 {{ color: #4F46E5; }}
            h2 {{ color: #1E293B; border-bottom: 2px solid #6366F1; padding-bottom: 5px; }}
            table {{ width: 100%; border-collapse: collapse; margin: 20px 0; }}
            th, td {{ border: 1px solid #E2E8F0; padding: 8px; text-align: left; }}
            th {{ background-color: #F8FAFC; }}
            .total {{ font-size: 18px; font-weight: bold; color: #10B981; }}
            .footer {{ position: fixed; bottom: 0; width: 100%; text-align: center; font-size: 10px; color: #64748B; }}
        </style>
    </head>
    <body>
        <div class="page">
            <div class="header">
                <h1>PRAVYA TECH</h1>
                <h2>Project Proposal & Quotation</h2>
                <p>Proposal Number: {proposal.proposal_number}</p>
                <p>Client: {proposal.client_name}</p>
                <p>Company: {proposal.company_name or 'N/A'}</p>
            </div>
            <h2>Project Details</h2>
            <p><strong>Project Title:</strong> {proposal.project_title or 'N/A'}</p>
            <p><strong>Email:</strong> {proposal.email or 'N/A'}</p>
            <p><strong>Phone:</strong> {proposal.phone or 'N/A'}</p>
            <h2>Pricing</h2>
            <table>
                <tr><th>Description</th><th>Amount</th></tr>
                <tr><td>Project Total</td><td>{proposal.currency or 'USD'} {proposal.amount or 0:,.2f}</td></tr>
            </table>
            <p class="total">Total Investment: {proposal.currency or 'USD'} {proposal.amount or 0:,.2f}</p>
            <h2>Terms & Acceptance</h2>
            <p>This proposal is valid for 30 days from the date of issue.</p>
        </div>
        <div class="footer">Generated on {datetime.now().strftime('%Y-%m-%d %H:%M:%S')} | PRAVYA TECH</div>
    </body>
    </html>
    """


async def generate_pdf(db: AsyncSession, proposal: Proposal) -> str:
    html_content = render_proposal_html(proposal)
    filename = f"{proposal.proposal_number}_{datetime.now().strftime('%Y%m%d%H%M%S')}.pdf"
    filepath = os.path.join(OUTPUT_DIR, filename)
    HTML(string=html_content).write_pdf(filepath)
    proposal.pdf_path = filepath
    await db.commit()
    await db.refresh(proposal)
    return filepath
