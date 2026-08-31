import os
from datetime import datetime
from reportlab.lib.pagesizes import A4
from reportlab.lib import colors
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle, HRFlowable
from sqlalchemy.ext.asyncio import AsyncSession
from app.models.proposal import Proposal
from app.utils.security import settings

OUTPUT_DIR = settings.PDF_OUTPUT_DIR or "./generated_pdfs"
os.makedirs(OUTPUT_DIR, exist_ok=True)


def build_proposal_pdf(proposal: Proposal, filepath: str):
    doc = SimpleDocTemplate(
        filepath,
        pagesize=A4,
        rightMargin=40,
        leftMargin=40,
        topMargin=40,
        bottomMargin=40
    )
    styles = getSampleStyleSheet()
    
    # Custom styles
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
    is_quotation = str(proposal.proposal_type.value) in ["project_quotation", "quotation"]
    doc_type_title = "PROJECT PROPOSAL & QUOTATION" if is_quotation else "COMPANY PROFILE & CAPABILITIES"
    story.append(Paragraph(doc_type_title, subtitle_style))
    story.append(HRFlowable(width="100%", thickness=1.5, color=brand_indigo, spaceAfter=14))

    # Meta Table
    meta_data = [
        [
            Paragraph(f"<b>Proposal #:</b> {proposal.proposal_number}", body_style),
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
    if is_quotation:
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


async def generate_pdf(db: AsyncSession, proposal: Proposal) -> str:
    filename = f"{proposal.proposal_number}_{datetime.now().strftime('%Y%m%d%H%M%S')}.pdf"
    filepath = os.path.join(OUTPUT_DIR, filename)
    build_proposal_pdf(proposal, filepath)
    proposal.pdf_path = filepath
    await db.commit()
    await db.refresh(proposal)
    return filepath
