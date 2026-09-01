import os
from datetime import datetime
from reportlab.lib.pagesizes import A4
from reportlab.lib import colors
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle, HRFlowable, PageBreak
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from typing import Any
from app.models.proposal import Proposal
from app.models.company_profile import CompanyProfile
from app.utils.security import settings

OUTPUT_DIR = settings.PDF_OUTPUT_DIR or "./generated_pdfs"
os.makedirs(OUTPUT_DIR, exist_ok=True)


def build_profile_pdf(proposal: Proposal, filepath: str, company_profile: "CompanyProfile | None" = None):
    doc = SimpleDocTemplate(
        filepath,
        pagesize=A4,
        rightMargin=50,
        leftMargin=50,
        topMargin=50,
        bottomMargin=50
    )
    styles = getSampleStyleSheet()
    
    brand_indigo = colors.HexColor("#4F46E5")
    brand_dark = colors.HexColor("#0F172A")
    brand_muted = colors.HexColor("#64748B")
    brand_slate = colors.HexColor("#F8FAFC")
    
    title_style = ParagraphStyle(
        'DocTitle',
        parent=styles['Heading1'],
        fontName='Helvetica-Bold',
        fontSize=24,
        leading=28,
        textColor=brand_indigo,
        spaceAfter=8,
        alignment=1
    )
    
    subtitle_style = ParagraphStyle(
        'DocSubtitle',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=12,
        leading=16,
        textColor=brand_muted,
        spaceAfter=20,
        alignment=1
    )

    section_heading = ParagraphStyle(
        'SectionHeading',
        parent=styles['Heading2'],
        fontName='Helvetica-Bold',
        fontSize=16,
        leading=20,
        textColor=brand_dark,
        spaceBefore=16,
        spaceAfter=10
    )

    body_style = ParagraphStyle(
        'BodyText',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=11,
        leading=15,
        textColor=brand_dark
    )

    center_style = ParagraphStyle(
        'CenterText',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=11,
        leading=15,
        textColor=brand_dark,
        alignment=1
    )

    story = []

    company = company_profile.company_name if company_profile else "PRAVYA TECH Solutions"
    tagline = company_profile.tagline if company_profile else "Empowering Businesses Through Technology"
    email = company_profile.email if company_profile else "contact@pravyatech.com"
    phone = company_profile.phone if company_profile else "+91 98765 43210"
    website = company_profile.website if company_profile else "www.pravyatech.com"
    address = company_profile.address if company_profile else "Office: Rajkot, Gujarat, India"
    sales_head = company_profile.sales_head_name if company_profile else "Rahul Mehta"
    sales_head_title = company_profile.sales_head_title if company_profile else "Founder & CEO"
    mission = company_profile.mission if company_profile else ""
    vision = company_profile.vision if company_profile else ""
    core_values = company_profile.core_values if company_profile else []
    services = company_profile.services if company_profile else []
    bni_clients = company_profile.bni_clients if company_profile else []
    intl_clients = company_profile.international_clients if company_profile else []
    branch_offices = company_profile.branch_offices if company_profile else []
    terms_text = company_profile.terms if company_profile else ""

    # ==================== PAGE 1: Cover ====================
    story.append(Spacer(1, 80))
    story.append(Paragraph(company, title_style))
    story.append(Paragraph("COMPANY PROFILE", title_style))
    story.append(Spacer(1, 30))
    story.append(Paragraph("Prepared for:", subtitle_style))
    story.append(Paragraph(f"<b>{proposal.company_name or proposal.client_name}</b>", subtitle_style))
    story.append(Spacer(1, 40))
    
    meta_data = [
        [Paragraph(f"<b>Proposal #:</b> {proposal.proposal_no or 'N/A'}", center_style), 
         Paragraph(f"<b>Date:</b> {datetime.now().strftime('%B %d, %Y')}", center_style)],
        [Paragraph(f"<b>Client:</b> {proposal.client_name}", center_style), 
         Paragraph(f"<b>Email:</b> {proposal.email or 'N/A'}", center_style)],
        [Paragraph(f"<b>Phone:</b> {proposal.phone or 'N/A'}", center_style), 
         Paragraph(f"<b>Company:</b> {proposal.company_name or 'N/A'}", center_style)],
    ]
    meta_table = Table(meta_data, colWidths=[200, 200])
    meta_table.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (-1, -1), brand_slate),
        ('PADDING', (0, 0), (-1, -1), 10),
        ('BOX', (0, 0), (-1, -1), 0.5, colors.HexColor("#E2E8F0")),
        ('VALIGN', (0, 0), (-1, -1), 'MIDDLE'),
    ]))
    story.append(meta_table)
    story.append(Spacer(1, 60))
    story.append(Paragraph("Sales Head", center_style))
    story.append(Paragraph(sales_head, center_style))
    story.append(Paragraph(address, center_style))
    story.append(Paragraph(f"{email} | {phone}", center_style))
    story.append(PageBreak())

    # ==================== PAGE 2: Cover Letter ====================
    story.append(Paragraph("Cover Letter", section_heading))
    story.append(HRFlowable(width="100%", thickness=1.5, color=brand_indigo, spaceAfter=14))
    story.append(Paragraph(f"<b>Date:</b> {datetime.now().strftime('%B %d, %Y')}", body_style))
    story.append(Paragraph(f"<b>To:</b> {proposal.client_name}, {proposal.company_name or ''}", body_style))
    story.append(Spacer(1, 20))
    story.append(Paragraph("Dear Sir/Madam,", body_style))
    story.append(Spacer(1, 10))
    story.append(Paragraph(
        f"It is with great pleasure that {company} presents this Company Profile for your consideration. "
        "As a trusted technology partner, we have consistently delivered innovative solutions that drive business growth "
        "and operational excellence for our clients worldwide.",
        body_style
    ))
    story.append(Spacer(1, 10))
    story.append(Paragraph(
        "At our company, we believe in building lasting partnerships through transparency, technical excellence, "
        "and a client-first approach. Our team of seasoned professionals is committed to understanding your unique "
        "challenges and crafting solutions that exceed expectations.",
        body_style
    ))
    story.append(Spacer(1, 10))
    story.append(Paragraph(
        "We look forward to the opportunity to collaborate with you and contribute to your success.",
        body_style
    ))
    story.append(Spacer(1, 40))
    story.append(Paragraph("Warm regards,", body_style))
    story.append(Spacer(1, 20))
    story.append(Paragraph(sales_head, body_style))
    story.append(Paragraph(f"{sales_head_title}, {company}", body_style))
    story.append(PageBreak())

    # ==================== PAGE 3: Mission, Vision & Values ====================
    story.append(Paragraph("Mission, Vision & Core Values", section_heading))
    story.append(HRFlowable(width="100%", thickness=1.5, color=brand_indigo, spaceAfter=14))
    story.append(Paragraph("<b>Mission</b>", body_style))
    story.append(Paragraph(mission, body_style))
    story.append(Spacer(1, 12))
    story.append(Paragraph("<b>Vision</b>", body_style))
    story.append(Paragraph(vision, body_style))
    story.append(Spacer(1, 12))
    story.append(Paragraph(f"<b>Our {len(core_values)} Core Values</b>", body_style))
    story.append(Spacer(1, 6))
    for i, val in enumerate(core_values, 1):
        if isinstance(val, dict):
            story.append(Paragraph(f"{i}. <b>{val.get('title', '')}:</b> {val.get('description', '')}", body_style))
        else:
            story.append(Paragraph(f"{i}. {val}", body_style))
    story.append(PageBreak())

    # ==================== PAGE 4: Services ====================
    story.append(Paragraph("Our Services", section_heading))
    story.append(HRFlowable(width="100%", thickness=1.5, color=brand_indigo, spaceAfter=14))
    story.append(Paragraph("We offer a comprehensive suite of digital services designed to elevate your business:", body_style))
    story.append(Spacer(1, 12))
    for i, svc in enumerate(services, 1):
        if isinstance(svc, dict):
            story.append(Paragraph(f"<b>{i}. {svc.get('title', '')}</b>", body_style))
            story.append(Paragraph(svc.get('description', ''), body_style))
        else:
            story.append(Paragraph(f"<b>{i}. {svc}</b>", body_style))
        story.append(Spacer(1, 8))
    story.append(PageBreak())

    # ==================== PAGE 5: Work Process ====================
    story.append(Paragraph("Our Work Process", section_heading))
    story.append(HRFlowable(width="100%", thickness=1.5, color=brand_indigo, spaceAfter=14))
    story.append(Paragraph("We follow a proven 5-step methodology to ensure successful project delivery:", body_style))
    story.append(Spacer(1, 16))
    story.append(Paragraph("<b>Step 01: Discovery</b>", body_style))
    story.append(Paragraph("Understanding your business goals, target audience, and project requirements through in-depth consultation.", body_style))
    story.append(Spacer(1, 10))
    story.append(Paragraph("<b>Step 02: Strategy</b>", body_style))
    story.append(Paragraph("Developing a comprehensive project roadmap with clear milestones, deliverables, and timelines.", body_style))
    story.append(Spacer(1, 10))
    story.append(Paragraph("<b>Step 03: Design & Development</b>", body_style))
    story.append(Paragraph("Executing the project with agile sprints, continuous feedback loops, and quality assurance checks.", body_style))
    story.append(Spacer(1, 10))
    story.append(Paragraph("<b>Step 04: Testing & Review</b>", body_style))
    story.append(Paragraph("Rigorous testing across devices and scenarios to ensure flawless functionality and performance.", body_style))
    story.append(Spacer(1, 10))
    story.append(Paragraph("<b>Step 05: Launch & Support</b>", body_style))
    story.append(Paragraph("Seamless deployment, training, and ongoing support to maximize your investment and ensure long-term success.", body_style))
    story.append(PageBreak())

    # ==================== PAGE 6: Top Clients (BNI Members) ====================
    story.append(Paragraph("Top Clients Showcase", section_heading))
    story.append(HRFlowable(width="100%", thickness=1.5, color=brand_indigo, spaceAfter=14))
    story.append(Paragraph("<b>BNI Members & Regional Partners</b>", body_style))
    story.append(Spacer(1, 12))
    story.append(Paragraph("We are proud to collaborate with leading organizations across various industries:", body_style))
    story.append(Spacer(1, 12))
    for client in bni_clients:
        story.append(Paragraph(f"• {client}", body_style))
        story.append(Spacer(1, 4))
    story.append(Spacer(1, 20))
    story.append(Paragraph("These partnerships reflect our commitment to delivering excellence and building trust.", body_style))
    story.append(PageBreak())

    # ==================== PAGE 7: Top Clients (International) ====================
    story.append(Paragraph("Global Clientele", section_heading))
    story.append(HRFlowable(width="100%", thickness=1.5, color=brand_indigo, spaceAfter=14))
    story.append(Paragraph("<b>International Partners</b>", body_style))
    story.append(Spacer(1, 12))
    story.append(Paragraph("Our reach extends beyond borders, serving clients across the globe:", body_style))
    story.append(Spacer(1, 12))
    for client in intl_clients:
        story.append(Paragraph(f"• {client}", body_style))
        story.append(Spacer(1, 4))
    story.append(Spacer(1, 20))
    story.append(Paragraph("Our global presence enables us to bring diverse perspectives and best practices to every engagement.", body_style))
    story.append(PageBreak())

    # ==================== PAGE 8: Terms & Conditions ====================
    story.append(Paragraph("General Terms & Conditions", section_heading))
    story.append(HRFlowable(width="100%", thickness=1.5, color=brand_indigo, spaceAfter=14))
    for line in terms_text.split('\n'):
        if line.strip():
            if line.startswith('Governing Law'):
                story.append(Paragraph(f"<b>{line.split(':', 1)[0]}:</b> {line.split(': ', 1)[1] if ':' in line else line}", body_style))
            else:
                story.append(Paragraph(line, body_style))
    story.append(PageBreak())

    # ==================== PAGE 9: Back Cover ====================
    story.append(Spacer(1, 100))
    story.append(Paragraph(company, title_style))
    story.append(Paragraph(tagline, subtitle_style))
    story.append(Spacer(1, 40))
    story.append(Paragraph("<b>Branch Offices:</b>", center_style))
    story.append(Spacer(1, 10))
    for office in branch_offices:
        story.append(Paragraph(str(office), center_style))
    story.append(Spacer(1, 30))
    story.append(Paragraph(email, center_style))
    story.append(Paragraph(phone, center_style))
    story.append(Paragraph(website, center_style))
    story.append(Spacer(1, 40))
    story.append(Paragraph("Thank you for considering us as your technology partner.", center_style))

    doc.build(story)


def build_quotation_pdf(proposal: Proposal, filepath: str):
    doc = SimpleDocTemplate(
        filepath,
        pagesize=A4,
        rightMargin=40,
        leftMargin=40,
        topMargin=40,
        bottomMargin=40
    )
    styles = getSampleStyleSheet()
    
    brand_indigo = colors.HexColor("#4F46E5")
    brand_dark = colors.HexColor("#0F172A")
    brand_muted = colors.HexColor("#64748B")
    
    title_style = ParagraphStyle(
        'DocTitle',
        parent=styles['Heading1'],
        fontName='Helvetica-Bold',
        fontSize=22,
        leading=26,
        textColor=brand_indigo,
        spaceAfter=6
    )
    
    subtitle_style = ParagraphStyle(
        'DocSubtitle',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=12,
        leading=16,
        textColor=brand_muted,
        spaceAfter=14
    )

    section_heading = ParagraphStyle(
        'SectionHeading',
        parent=styles['Heading2'],
        fontName='Helvetica-Bold',
        fontSize=14,
        leading=18,
        textColor=brand_dark,
        spaceBefore=12,
        spaceAfter=8
    )

    body_style = ParagraphStyle(
        'BodyText',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=10,
        leading=14,
        textColor=brand_dark
    )

    story = []

    # Brand Header
    story.append(Paragraph("PRAVYA TECH SOLUTIONS", title_style))
    story.append(Paragraph("PROJECT PROPOSAL & QUOTATION", subtitle_style))
    story.append(HRFlowable(width="100%", thickness=1.5, color=brand_indigo, spaceAfter=14))

    # Meta Table
    meta_data = [
        [
            Paragraph(f"<b>Proposal #:</b> {proposal.proposal_no or 'N/A'}", body_style),
            Paragraph(f"<b>Date:</b> {datetime.now().strftime('%B %d, %Y')}", body_style)
        ],
        [
            Paragraph(f"<b>Client Name:</b> {proposal.client_name}", body_style),
            Paragraph(f"<b>Company:</b> {proposal.company_name or 'N/A'}", body_style)
        ],
        [
            Paragraph(f"<b>Email:</b> {proposal.email or 'N/A'}", body_style),
            Paragraph(f"<b>Phone:</b> {proposal.phone or 'N/A'}", body_style)
        ]
    ]
    meta_table = Table(meta_data, colWidths=[250, 250])
    meta_table.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (-1, -1), colors.HexColor("#F8FAFC")),
        ('PADDING', (0, 0), (-1, -1), 6),
        ('BOX', (0, 0), (-1, -1), 0.5, colors.HexColor("#E2E8F0")),
        ('VALIGN', (0, 0), (-1, -1), 'MIDDLE'),
    ]))
    story.append(meta_table)
    story.append(Spacer(1, 14))

    # Project Details
    story.append(Paragraph("1. Executive Overview", section_heading))
    project_title = proposal.project_title or "Bespoke Enterprise Technology Architecture"
    story.append(Paragraph(f"<b>Project Title:</b> {project_title}", body_style))
    story.append(Spacer(1, 4))
    story.append(Paragraph(
        "PRAVYA TECH is pleased to submit this official document outlining the architectural deliverables, "
        "production milestones, SLA commitments, and terms of engagement tailored for your enterprise.",
        body_style
    ))
    story.append(Spacer(1, 14))

    # Commercials Table if quotation
    if proposal.type.value in ["quotation_proposal", "quotation"]:
        story.append(Paragraph("2. Commercials & Investment Summary", section_heading))
        currency = proposal.currency or "USD"
        amount = proposal.amount or 0.0
        
        pricing_data = [
            [
                Paragraph("<b>Item Description</b>", body_style),
                Paragraph("<b>Qty</b>", body_style),
                Paragraph(f"<b>Amount ({currency})</b>", body_style)
            ],
            [
                Paragraph(f"{project_title} — Core Delivery & Deployment", body_style),
                Paragraph("1", body_style),
                Paragraph(f"{amount:,.2f}", body_style)
            ],
            [
                Paragraph("<b>Total Investment (Payable)</b>", body_style),
                Paragraph("", body_style),
                Paragraph(f"<b>{currency} {amount:,.2f}</b>", body_style)
            ]
        ]
        price_table = Table(pricing_data, colWidths=[330, 50, 120])
        price_table.setStyle(TableStyle([
            ('BACKGROUND', (0, 0), (-1, 0), colors.HexColor("#EEF2FF")),
            ('TEXTCOLOR', (0, 0), (-1, 0), brand_indigo),
            ('GRID', (0, 0), (-1, -1), 0.5, colors.HexColor("#CBD5E1")),
            ('PADDING', (0, 0), (-1, -1), 6),
            ('BACKGROUND', (0, -1), (-1, -1), colors.HexColor("#F1F5F9")),
            ('ALIGN', (1, 0), (1, -1), 'CENTER'),
            ('ALIGN', (2, 0), (2, -1), 'RIGHT'),
        ]))
        story.append(price_table)
        story.append(Spacer(1, 14))

    # Terms & Engagement
    story.append(Paragraph("3. Terms & Service Level Agreement", section_heading))
    terms_text = (
        "• Milestone-based delivery with continuous staging deployment reviews.<br/>"
        "• Standard 90-day comprehensive post-launch warranty covering defect rectification.<br/>"
        "• 100% intellectual property ownership transferred upon final milestone settlement.<br/>"
        "• Proposal validity is 30 days from date of issuance."
    )
    story.append(Paragraph(terms_text, body_style))
    story.append(Spacer(1, 20))

    # Sign-off Box
    story.append(Paragraph("4. Authorization & Sign-off", section_heading))
    sign_data = [
        [
            Paragraph("<b>For PRAVYA TECH Solutions:</b>", body_style),
            Paragraph(f"<b>For {proposal.company_name or proposal.client_name}:</b>", body_style)
        ],
        [
            Paragraph("<br/><br/>___________________________<br/>Authorized Signatory", body_style),
            Paragraph("<br/><br/>___________________________<br/>Client Signature & Date", body_style)
        ]
    ]
    sign_table = Table(sign_data, colWidths=[250, 250])
    sign_table.setStyle(TableStyle([
        ('PADDING', (0, 0), (-1, -1), 8),
        ('BOX', (0, 0), (-1, -1), 0.5, colors.HexColor("#E2E8F0")),
        ('BACKGROUND', (0, 0), (-1, -1), colors.HexColor("#F8FAFC")),
    ]))
    story.append(sign_table)

    doc.build(story)


def build_proposal_pdf(proposal: Proposal, filepath: str, company_profile: "CompanyProfile | None" = None):
    if proposal.type.value == "profile_only":
        build_profile_pdf(proposal, filepath, company_profile)
    else:
        build_quotation_pdf(proposal, filepath)


async def _fetch_company_profile(db: AsyncSession) -> "CompanyProfile | None":
    result = await db.execute(select(CompanyProfile).limit(1))
    return result.scalar_one_or_none()


async def generate_pdf(db: AsyncSession, proposal: Proposal) -> str:
    filename = f"{proposal.proposal_no or proposal.id}_{datetime.now().strftime('%Y%m%d%H%M%S')}.pdf"
    filepath = os.path.join(OUTPUT_DIR, filename)
    company_profile = await _fetch_company_profile(db)
    build_proposal_pdf(proposal, filepath, company_profile)
    proposal.pdf_path = filepath
    await db.commit()
    await db.refresh(proposal)
    return filepath
