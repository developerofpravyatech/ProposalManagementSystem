# PRAVYA TECH --- 12-Page Company Profile / Proposal PDF UI Specification

## Purpose of this document

This document describes the uploaded 12-page PRAVYA TECH PDF page by
page so that Kilo Code can reproduce the **PDF layout, content
structure, sections, typography hierarchy, spacing, and visual intent**
in the proposal/company-profile generator UI.

The goal is **not** to redesign the document. The goal is to make the
generated PDF look as close as practical to the supplied reference PDF.

> Reference: uploaded 12-page PDF `PRV-Q1810-01(3).pdf`. The source
> contains 12 pages and includes the company profile, proposal cover
> letter, company vision/mission, services, work process, terms, client
> pages, project pricing, payment methods, acceptance/sign-off, and
> branch/contact information. fileciteturn0file0L1-L23

------------------------------------------------------------------------

# Global Design Direction

## Overall style

The document is a **premium corporate proposal/company-profile
document** for PRAVYA TECH.

The visual language should feel:

-   Professional
-   Modern
-   Premium
-   Technology-focused
-   Corporate
-   Clean and spacious
-   Suitable for sending to business clients
-   Strong use of large headings and section labels
-   Strong visual hierarchy
-   Consistent branding across all pages

The PDF should feel like a designed agency proposal rather than a plain
generated report.

## Important implementation principle

The proposal generator should treat each page as a **designed page
template**, not simply as a normal text document.

The application should allow the user to enter/edit dynamic information
such as:

-   Client name
-   Client designation
-   Proposal date
-   Issue date
-   Valid-until date
-   Prepared-by person
-   Project name
-   Project description
-   Services
-   Process steps
-   Terms
-   Pricing
-   Payment information
-   Acceptance/sign-off details
-   Company/branch information

The generated PDF should preserve the fixed visual layout while
replacing dynamic data.

------------------------------------------------------------------------

# PAGE 1 --- Cover / Front Page

## Purpose

Page 1 is the **main cover page** of the proposal.

It establishes the PRAVYA TECH brand and identifies who the proposal is
prepared for and by whom.

## Visible content

Top/hero branding:

-   `Genie - Ask, Give Connect !!`
-   Tagline: `Build your company's strong online presence.`

Client information:

-   Heading: `Prepared For`
-   `Mr. Mohammad Sharif`
-   `Executive Director`
-   `www.pravyatech.com`

Prepared-by information:

-   Heading: `Prepared By`
-   `Mr. Pratikbharathi Goswami`
-   `Sales Head`

Company address/contact:

-   `PRAVYA TECH (HEAD OFFICE)`
-   `618 Level 6, 150 Feet Ring Road,`
-   `Opp. Imperial Heights,`
-   `Rajkot 360005.`
-   Phone: `+(91) 898 0000 196`
-   Email: `talk@pravyatech.com`

Dates:

-   `Issued Date`
-   `25/05/2026`
-   `Valid Till`
-   `01/06/2026`

Footer/closing brand statement:

-   `We are not developing the technology,`
-   `We are technology.`

## Layout interpretation

The cover should have a strong visual hierarchy.

Recommended structure:

1.  Large PRAVYA TECH / project branding area
2.  Main tagline
3.  Prepared For block
4.  Prepared By block
5.  Office/contact information
6.  Issue and validity dates
7.  Strong closing brand statement near the bottom

Do not make this page look like a standard invoice.

It should look like a **high-end proposal cover**.

## Dynamic fields

The generator should make these values editable:

-   Proposal/project title
-   Client name
-   Client designation
-   Client/company website
-   Prepared-by name
-   Prepared-by designation
-   Office name
-   Office address
-   Phone
-   Email
-   Issue date
-   Valid-until date
-   Cover tagline
-   Closing tagline

Source content is shown on page 1 of the reference PDF.
fileciteturn0file0L1-L23

------------------------------------------------------------------------

# PAGE 2 --- Proposal Cover Letter

## Purpose

Page 2 is a formal **cover letter** introducing the proposal.

## Main heading

`Proposal Coverletter`

The page begins with a recipient block:

-   `To,`
-   `Mr. Mohammad Sharif`
-   `Director`
-   `Date : 23/05/2026`

## Main letter

The body explains that PRAVYA Tech is submitting a website-development
proposal.

The letter communicates:

-   PRAVYA Tech is pleased to submit the proposal.
-   The company understands the importance of digital presence.
-   The proposed website should be customized and user-friendly.
-   The website should be performance-driven.
-   PRAVYA Tech has expertise in web and mobile solutions.
-   The design should be visually strong while remaining functional.
-   Important qualities include speed, responsiveness, scalability and
    optimized user experience.
-   The team combines creativity, technical skills and industry
    knowledge.
-   The objective is to align the solution with business goals.

## Closing/signature

The page contains:

-   `PRATIKBHRATHI GOSWAMI`
-   `FOUNDER & CEO`

The page also introduces the detailed project proposal.

It states that the enclosed proposal includes:

-   Project scope
-   Timeline
-   Technologies
-   Cost breakdown

It emphasizes:

-   Transparent communication
-   Timely delivery
-   Long-term support

The letter closes by thanking the client for considering PRAVYA Tech.

## UI requirements

Create a formal letter layout.

Recommended hierarchy:

``` text
Proposal Coverletter

To,
[Client Name]
[Client Designation]
Date: [Date]

[Letter body]

[Signer Name]
[Signer Designation]

Project Proposal
[Short introduction to enclosed proposal]
```

The letter body should support multiple paragraphs.

The editor should allow the proposal creator to change:

-   Recipient
-   Designation
-   Date
-   Letter content
-   Signatory name
-   Signatory designation

Source content is on page 2. fileciteturn0file0L24-L47

------------------------------------------------------------------------

# PAGE 3 --- Company Introduction / Vision / Mission / Values

## Purpose

Page 3 introduces PRAVYA TECH's identity and company philosophy.

## Main headline

`A Creative, Strategic & Accountable Design Agency.`

This is a strong positioning statement and should visually dominate the
page.

## Vision section

Heading:

`Our Vision »`

Vision statement:

`To become a global leader in mobile-first technology by empowering businesses and individuals with innovative, intuitive, and impactful digital solutions.`

## Mission section

Heading:

`Our Mission »`

Mission statement explains that PRAVYA Tech aims to:

-   Design and develop smart solutions
-   Build scalable solutions
-   Build user-centric mobile and web applications
-   Solve real-world problems
-   Deliver high-quality technology solutions
-   Focus on simplicity
-   Focus on speed
-   Provide seamless user experience
-   Help clients grow, connect and thrive digitally

## Core values

Heading:

`Strong core values of our company »`

The values displayed are:

1.  `Customers First`
2.  `Act with Integrity`
3.  `Great teamwork`
4.  `Focus on solutions`

## Layout

This should be visually divided into three conceptual areas:

### Area 1 --- Company positioning

Large statement:

`A Creative, Strategic & Accountable Design Agency.`

### Area 2 --- Vision and mission

Two visually distinct text blocks.

### Area 3 --- Core values

Four separate visual/value blocks.

The values should not appear as one dense paragraph. They should be
displayed as separate cards/items/icons if the original visual design
uses icons.

Source content is on page 3. fileciteturn0file0L48-L72

------------------------------------------------------------------------

# PAGE 4 --- Services / What We Offer

## Purpose

Page 4 explains PRAVYA TECH's service offering and market position.

## Main heading

`What we offer and how we create values.`

## Supporting positioning text

The page states:

-   `We are leading design agency.`
-   `we have market leading presence in digital market.`

## Service categories

The services include:

### Design

-   Wordpress UI / UX
-   Mobile App UI / UX
-   E-Commerce UI / UX
-   Custom Application Design

### Development

-   Wordpress Development
-   Mobile App Development
-   E-Commerce Development
-   Custom Application Design

### Marketing / Communication

-   Social Media Marketing
-   Email Marketing
-   Whatsapp Chatbot

### Analytics

-   Website Analytics
-   Mobile App Analytics

## Additional category labels

The page also visually references:

-   Website Designing
-   Research & Analysis
-   Content Marketing
-   Design & Illustration

## Layout requirements

This page should look like a **service catalogue**, not a paragraph.

Use separate groups/columns/cards.

Recommended structure:

``` text
What we offer and how we create values.

[Company positioning]

DESIGN
- ...
- ...

DEVELOPMENT
- ...
- ...

MARKETING
- ...
- ...

ANALYTICS
- ...
- ...

[Additional service/category labels]
```

The service list should be data-driven in the application so an admin
can add/remove/reorder services.

Source content is on page 4. fileciteturn0file0L73-L99

------------------------------------------------------------------------

# PAGE 5 --- Work Process

## Purpose

Page 5 explains the complete project delivery process from first client
contact through deployment and support.

## Main introductory statement

`We work with client to develop the right strategy from the very first stage to last stage...`

Secondary heading:

`Our work process - From very first touch point to launch and beyond.`

## Five process steps

### Step 01 --- Initial discussion

Title:

`Initial meeting / Project / Discussion / Assessment / Agreement`

This represents the first client interaction and project understanding.

### Step 02 --- Research and design

Title:

`Research / Project Outline / Wire frame / Artwork / Revisions`

This represents research, planning, wireframing, design and revisions.

### Step 03 --- Development

Title:

`Coding / Development / Validation / Cross Platform Testing`

This represents implementation and technical validation.

### Step 04 --- Implementation

Title:

`Implementation / Content Placement / Optimization / Testing`

This represents content integration, optimization and testing.

### Step 05 --- Finalization

Title:

`Final Refinement / Deployment / Maintenance / Training / Support`

This represents final quality checks, deployment and ongoing support.

## Layout

This page should use a **timeline/process visualization**.

Five clearly separated stages should be visible.

Recommended UI:

``` text
01 → 02 → 03 → 04 → 05

Initial       Research       Coding       Implementation       Final
Meeting       & Design       & Testing    & Optimization       Deployment
```

On a PDF, the process should be easy to scan visually.

Do not render the five steps as one long paragraph.

Source content is on page 5. fileciteturn0file0L100-L129

------------------------------------------------------------------------

# PAGE 6 --- Statement of Work / Contract Terms

## Purpose

Page 6 contains the important commercial and contractual terms.

## Main heading

`Statement of work and Contract Terms.`

The page is organized into numbered sections.

------------------------------------------------------------------------

## Section 01 --- Payment Terms

Heading:

`Payment Terms`

Items:

-   `50% Advanced`
-   `50% Immediate After Deployment`
-   `18% GST will be applicable as per government regulations.`

### UI

Display this as a clearly separated commercial terms card/section.

------------------------------------------------------------------------

## Section 02 --- Annual Maintenance Contract

Heading:

`Annual Maintenance Contract`

Terms include:

-   `25% of project value as per bill.`
-   AMC applies when existing features are not working or technical bugs
    happen.
-   New features/requirements are not included in AMC.

### Important UI concept

The application should distinguish between:

-   Existing-feature maintenance
-   New feature requests

New features should visually be shown as excluded from AMC.

------------------------------------------------------------------------

## Section 03 --- Services Limitations

Heading:

`Services Limitations`

The company is not liable for issues occurring in third-party services
used or integrated with products/services such as:

-   Cloud
-   Backups
-   E-Mail
-   SMS
-   WhatsApp
-   IVR
-   Other integrated product software/services

This should be shown as a limitation/exclusion-style section.

------------------------------------------------------------------------

## Section 04 --- Exclusions

Heading:

`Exclusions`

Excluded items:

-   Anything not specified in the above specification and demo system.
-   Integration with third-party software systems and APIs other than
    those specifically mentioned.
-   Cloud hosting charges.
-   Future updates in App/Web/Software.

------------------------------------------------------------------------

## Section 05 --- Client Side Support

The document says:

-   One decision-maker is required from the client side.
-   PRAVYA Tech will communicate with that person.
-   That person's decision will be final for PRAVYA Tech.

This should be displayed clearly because it is a client responsibility.

------------------------------------------------------------------------

## Section 06 --- Project Cancellation

Heading:

`Project Cancellation`

The key rule is:

-   Payment is non-refundable once work has started from PRAVYA Tech's
    side.

## Layout

Because this is a terms-heavy page, avoid oversized decorative elements.

Prioritize:

-   Readability
-   Clear numbered sections
-   Consistent spacing
-   Strong section headings
-   Bullet points
-   Professional legal/commercial appearance

Source content is on page 6. fileciteturn0file0L130-L177

------------------------------------------------------------------------

# PAGE 7 --- Top Clients / BNI Members

## Purpose

Page 7 is a client showcase page.

Main heading:

`Our Top Clients`

Subheading/context:

`2025-2026 (BNI MEMBERS)`

## Layout

This page is primarily visual.

The original page contains client branding/logos rather than a large
amount of text.

Therefore, the proposal generator should support:

-   Client logo uploads
-   Logo grid
-   Consistent logo sizing
-   Automatic alignment
-   Spacing between logos
-   Optional client names

## Important implementation detail

Do not force all logos into a text list.

Create a reusable **logo-grid component**.

The admin should be able to:

-   Add logo
-   Remove logo
-   Reorder logos
-   Change logo size if necessary
-   Upload transparent PNG/SVG/JPG files

The page should maintain a premium corporate portfolio appearance.

Source identifies this as the 2025--2026 BNI member client page.
fileciteturn0file0L178-L181

------------------------------------------------------------------------

# PAGE 8 --- Top Clients / International

## Purpose

Page 8 continues the client showcase, specifically for international
clients.

Main heading:

`Our Top Clients`

Subheading:

`2025-2026 (INTERNATIONAL)`

## Layout

Like page 7, this page is primarily visual and should use a logo grid.

## UI requirements

Create a reusable `ClientLogoGrid` component with configurable:

-   Heading
-   Subheading
-   Client logos
-   Number of columns
-   Logo spacing
-   Logo size
-   Page background
-   Optional captions

The component should be reusable for:

-   BNI clients
-   International clients
-   Other client groups

Source identifies page 8 as the international top-client page.
fileciteturn0file0L182-L185

------------------------------------------------------------------------

# PAGE 9 --- Project Rate / Estimation

## Purpose

Page 9 presents the project pricing/estimation.

## Main heading

`Project Rate Estimations`

The page uses a pricing table-like structure.

## Column structure

The document contains:

-   `Particulars`
-   `Est. Price`

## Project item

Main item:

`1. Genie - Ask, Give & Connect`

Sub-items:

-   Android & iOS App
-   Web Admin Panel
-   Technical Support
-   Include Server Cost

## Price

`9 OMR / Member / Year`

## Note

`Note:* the amount is excluding 18% GST.`

## Layout

This should look like a professional quotation/pricing table.

Recommended structure:

``` text
Project Rate
Estimations

------------------------------------------------
Particulars                         Est. Price
------------------------------------------------
1. Genie - Ask, Give & Connect      9 OMR /
   • Android & iOS App              Member /
   • Web Admin Panel                Year
   • Technical Support
   • Include Server Cost
------------------------------------------------

Note: The amount is excluding 18% GST.
```

## Dynamic pricing requirements

The generator should support:

-   Multiple line items
-   Description/sub-items
-   Quantity/unit model
-   Price
-   Currency
-   Billing period
-   Tax note
-   Additional notes

The price in this reference is OMR, but the UI should not hard-code OMR.

The user should be able to select a currency.

Source content is on page 9. fileciteturn0file0L186-L199

------------------------------------------------------------------------

# PAGE 10 --- Payment Methods

## Purpose

Page 10 provides payment instructions.

Main heading/context:

`Payment Methods`

The page provides multiple ways to make payment.

## Payment method 1 --- QR Code

Label:

`Via QR CODE`

The page contains a QR-code-based payment method.

### UI requirement

The proposal generator should allow the admin to upload/select a QR code
image.

Do not generate a fake QR code.

If a QR image is provided, embed it into the PDF.

------------------------------------------------------------------------

## Payment method 2 --- UPI

Label:

`Via UPI-ID`

UPI ID:

`PRAVYA2618@OKSBI`

------------------------------------------------------------------------

## Bank details

Bank name:

`STATE BANK OF INDIA`

Account number:

`40410281486`

Branch:

`Bhanktinagar Station Main Road`

IFSC:

`SBIN0001851`

UPI ID:

`PRAVYA2618@OKSBI`

## Layout

This page should be designed as a clean payment-information page.

Recommended visual structure:

``` text
Payment Methods

[ QR CODE ]
Via QR CODE

[ UPI INFORMATION ]
Via UPI-ID

UPI ID: ...

[ BANK INFORMATION ]
Bank Name: ...
Account No.: ...
Branch: ...
IFSC: ...
UPI ID: ...
```

## Security / application requirement

Bank and payment information should be configurable company-level data.

Do not hard-code the reference values into the application if the goal
is a reusable proposal generator.

The values above are the values shown in this particular reference PDF.

Source content is on page 10. fileciteturn0file0L200-L212

------------------------------------------------------------------------

# PAGE 11 --- Acceptance / Quote Sign-Off

## Purpose

Page 11 is the formal acceptance page.

Main heading:

`Acceptance of Quote / Sign off`

Closing message:

`Thank you for business with us!`

## Acceptance statement

The client confirms that by signing:

-   They accept the quote provided by PRAVYA Tech.
-   They authorize commencement of the project.
-   They accept the project scope.
-   They accept the estimated timeline.
-   They accept payment terms.
-   They accept relevant terms and conditions.

## Additional-work clause

The page states that:

-   Additional work outside the agreed scope may require a separate
    quotation and approval.

## Signature fields

The page provides fields for:

-   Date
-   Name
-   Signature

## UI requirements

This should be implemented as a reusable **sign-off/acceptance
template**.

Include:

``` text
Acceptance of Quote / Sign off

[Acceptance statement]

[Additional work clause]

Date: __________________

Name: __________________

Signature: ______________
```

The generated PDF should leave sufficient physical/digital signing
space.

If the system supports electronic signing, the signature area can later
be enhanced, but the PDF template must first reproduce the existing
sign-off layout.

Source content is on page 11. fileciteturn0file0L213-L234

------------------------------------------------------------------------

# PAGE 12 --- Company Branches / Contact / Closing Page

## Purpose

Page 12 is the final company/contact page.

It contains the company's branch information and a closing marketing
statement.

------------------------------------------------------------------------

## Main Branch

Heading:

`PRAVYA TECH(MAIN BRANCH)`

Address:

`618 LEVEL 6, 150 FEET RING ROAD,`
`OPP. IMPERIAL HEIGHTS, NEAR BIG BAZAR,` `RAJKOT 360005.`

Phone:

`+(91) 898 00 00 196`

Email:

`sales@pravyatech.com`

Website:

`www.pravyatech.com`

------------------------------------------------------------------------

## Second Branch

Heading:

`SECOND BRANCH`

Address:

`304, NAKSHATRA 6, GONDAL ROAD,` `OPP. PINEVINTA HOTEL,`
`RAJKOT 360002.`

Phone:

`+(91) 898 00 00 196`

Email:

`sales@pravyatech.com`

------------------------------------------------------------------------

## Third Branch

Heading:

`THIRD BRANCH`

Address:

`143 KERRY CMN,` `Fremont, California U.S.A,` `94536.`

Phone:

`+1 (408) 507-6353`

Email:

`sales@pravyatech.com`

------------------------------------------------------------------------

## Closing statement

Large closing message:

`Take your business to the next level.`

## Layout

This should be a strong closing page.

Recommended structure:

``` text
[Company branding]

MAIN BRANCH
[address]
[phone]
[email]
[website]

SECOND BRANCH
[address]
[phone]
[email]

THIRD BRANCH
[address]
[phone]
[email]

----------------------------

Take your
business to
the next level.
```

The final statement should be visually prominent.

Source content is on page 12. fileciteturn0file0L235-L257

------------------------------------------------------------------------

# Proposal Generator Data Model

To reproduce this document dynamically, the application should not store
the PDF as one large text blob.

Instead, model the proposal as structured data.

## Proposal

``` text
Proposal
├── Cover
├── Cover Letter
├── Company Profile
├── Services
├── Work Process
├── Terms & Conditions
├── Client Showcase
│   ├── BNI Clients
│   └── International Clients
├── Pricing
├── Payment Methods
├── Acceptance / Sign-Off
└── Contact / Branches
```

------------------------------------------------------------------------

# Recommended Editable Fields

## Cover

``` text
project_title
cover_tagline
client_name
client_designation
client_website
prepared_by_name
prepared_by_designation
office_name
office_address
phone
email
issued_date
valid_till
closing_tagline
```

## Cover Letter

``` text
recipient_name
recipient_designation
letter_date
letter_body
signer_name
signer_designation
proposal_introduction
```

## Company Profile

``` text
company_positioning
vision
mission
core_values[]
```

## Services

``` text
service_categories[]
services[]
```

Each service can have:

``` text
category
name
description
icon/image
display_order
```

## Work Process

``` text
process_steps[]
```

Each step:

``` text
step_number
title
description
```

## Terms

``` text
payment_terms[]
annual_maintenance_terms[]
service_limitations[]
exclusions[]
client_support_terms[]
cancellation_terms[]
```

## Client Pages

``` text
bni_clients[]
international_clients[]
```

Each client:

``` text
name
logo
website
display_order
```

## Pricing

``` text
pricing_items[]
currency
billing_unit
tax_rate
pricing_note
```

Each pricing item:

``` text
name
description[]
price
unit
```

## Payment Methods

``` text
qr_code
upi_id
bank_name
account_number
branch_name
ifsc
```

## Acceptance

``` text
acceptance_text
additional_work_clause
signature_fields
```

## Branches

``` text
branches[]
```

Each branch:

``` text
branch_name
address
phone
email
website
```

------------------------------------------------------------------------

# PDF Page Architecture

Kilo Code should implement the PDF generator with a strict page-oriented
architecture.

Each page should have a dedicated template/component.

Suggested structure:

``` text
ProposalPDF
│
├── Page01Cover
├── Page02CoverLetter
├── Page03CompanyProfile
├── Page04Services
├── Page05WorkProcess
├── Page06Terms
├── Page07ClientLogosBNI
├── Page08ClientLogosInternational
├── Page09Pricing
├── Page10PaymentMethods
├── Page11Acceptance
└── Page12Contact
```

This is preferable to one giant PDF component.

------------------------------------------------------------------------

# Important UI/PDF Rules

## 1. Preserve page boundaries

Each of the 12 reference pages represents a deliberate design section.

Do not allow content from one page to randomly overflow onto the next
page.

Each page should have a fixed printable area.

------------------------------------------------------------------------

## 2. Prevent unwanted page breaks

Long text should be handled intelligently.

For example:

-   If a terms section becomes longer, reduce spacing slightly.
-   If a list becomes longer, wrap correctly.
-   If a section genuinely cannot fit, provide controlled overflow
    behavior rather than breaking the page layout randomly.

------------------------------------------------------------------------

## 3. Keep typography consistent

Use a consistent typography system:

``` text
Cover Title
Large Section Heading
Subheading
Body Text
Small Label
Footer Text
```

The exact font family can be configurable, but the hierarchy must remain
consistent.

------------------------------------------------------------------------

## 4. Use reusable design components

Create reusable components such as:

``` text
ProposalHeader
ProposalFooter
SectionTitle
InfoBlock
ClientInfo
ContactBlock
ServiceCard
ProcessStep
TermsSection
PricingTable
PaymentCard
ClientLogoGrid
SignatureBlock
BranchCard
```

This prevents each page from being coded independently with duplicated
styling.

------------------------------------------------------------------------

# Admin UI Recommended Structure

The proposal generator should have two major areas:

## Left / Main area

Form/editor for proposal content.

## Right / Preview area

Live PDF-like preview.

Example:

``` text
---------------------------------------------------------
| Proposal Editor                 | Live Preview         |
|                                 |                      |
| Cover                            |   PAGE 1             |
| Cover Letter                     |   Proposal Cover     |
| Company Profile                  |                      |
| Services                         |                      |
| Work Process                     |                      |
| Terms                            |                      |
| Clients                          |                      |
| Pricing                          |                      |
| Payment                          |                      |
| Acceptance                       |                      |
| Contact                          |                      |
---------------------------------------------------------
```

The preview should look like the final A4 PDF.

------------------------------------------------------------------------

# Page Navigation

The editor should make it easy to move between the 12 pages.

Example:

``` text
01 Cover
02 Cover Letter
03 Company
04 Services
05 Process
06 Terms
07 BNI Clients
08 International Clients
09 Pricing
10 Payment
11 Acceptance
12 Contact
```

Selecting a page should show the relevant editing controls.

------------------------------------------------------------------------

# Template vs Dynamic Data

Keep these two concepts separate.

## Template

Controls:

-   Page size
-   Margins
-   Typography
-   Section positions
-   Logo positions
-   Backgrounds
-   Borders
-   Spacing
-   Layout
-   Header/footer

## Dynamic data

Controls:

-   Client information
-   Dates
-   Project name
-   Description
-   Pricing
-   Services
-   Logos
-   Payment information
-   Branch information
-   Sign-off details

This allows the same 12-page design to generate many different
proposals.

------------------------------------------------------------------------

# Reference Content vs Reusable System

The exact values from this PDF are an **example proposal**.

The application should not permanently hard-code:

-   Mohammad Sharif
-   23/05/2026
-   25/05/2026
-   01/06/2026
-   9 OMR
-   Specific bank account
-   Specific client logos
-   Specific branch data

Instead, preload these values as the reference/demo proposal if desired,
but make them editable.

------------------------------------------------------------------------

# Final Implementation Goal

Kilo Code should build a proposal generator where an admin can enter
proposal information through a structured UI and generate a **12-page
professional PDF that follows the same visual structure as this PRAVYA
TECH reference document**.

The twelve pages should remain logically consistent:

1.  **Cover**
2.  **Proposal Cover Letter**
3.  **Company Vision / Mission / Values**
4.  **Services**
5.  **Work Process**
6.  **Statement of Work / Contract Terms**
7.  **Top Clients --- BNI**
8.  **Top Clients --- International**
9.  **Project Rate / Estimation**
10. **Payment Methods**
11. **Acceptance / Sign-Off**
12. **Branches / Contact / Closing**

The most important requirement is that Kilo Code should understand that
this is a **designed A4 proposal document**, not a normal web page
converted to PDF.

Every page should have intentional positioning, spacing, typography,
visual hierarchy, and section grouping.

The final generated PDF should look like a polished corporate proposal
suitable for sending directly to a client.
