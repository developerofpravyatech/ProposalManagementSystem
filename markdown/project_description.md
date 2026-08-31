# PRAVYA TECH Proposal Management System

Read this first, every session. This is the map — details live in `markdown/`. Don't duplicate those docs here; link to them.

## What this is

Internal proposal/quotation management system for PRAVYA TECH.

The system allows admins to create and share:

* Company Profile proposals
* Custom Project Proposals + Quotations

It also provides private client links, real-time view/download tracking, quotation acceptance, WhatsApp sharing, and contract renewal management.

Full context: `markdown/README.md`

## Stack

* Backend: FastAPI, SQLAlchemy 2.0, PostgreSQL → `markdown/techstack.md`
* Frontend: React + Vite, TypeScript → `frontend/`
* Database: PostgreSQL
* API: REST API
* PDF: Server-side PDF generation → `markdown/pdf-generation.md`
* Authentication: Admin authentication → `markdown/auth.md`

## Hard rules — do not violate these

1. **Every proposal must have a unique private token.**
   Client-facing proposals are accessed through `/p/{token}`. Never expose internal proposal IDs as the client access mechanism.

2. **Client proposal access is token-based.**
   Portal/client endpoints must identify the proposal from the authenticated/private token URL, not from an arbitrary client-supplied proposal ID.

3. **Every client opening must be tracked.**
   When `/p/{token}` is opened, record the view in `proposal_views` and update the proposal's first/last opened information and view count.

4. **Every PDF download must be trackable.**
   Downloads from the client proposal viewer must record the download event/timestamp so the admin can determine whether the proposal was downloaded.

5. **Proposal status must remain consistent with the workflow.**
   Proposal states include `sent`, `viewed`, `accepted`, `renewal_due`, and `renewed`. Do not introduce arbitrary status values without updating the system documentation.

6. **Renewals must create a new proposal version/link.**
   A renewal duplicates the quotation, updates the relevant dates, and generates a new proposal link rather than modifying the historical proposal in a way that loses its previous record.

7. **PDF generation belongs in the backend/service layer.**
   React should collect and display proposal information; PDF creation and document assembly must be handled by the backend.

8. **Pricing must be represented as structured proposal data.**
   Project quotations must support line items, pricing, currency, and contract/renewal period rather than storing only an unstructured text description.

9. **Client-facing pages must work on mobile and desktop.**
   The `/p/{token}` viewer is an external client experience and must remain responsive.

10. **Never expose sensitive/internal database information to the client.**
    Client endpoints should return only the information required to view, download, contact PRAVYA TECH, or accept the proposal.

## Where to look

| Need                            | File                            |
| ------------------------------- | ------------------------------- |
| Project overview                | `markdown/README.md`            |
| Tech stack and architecture     | `markdown/techstack.md`         |
| Database/table design           | `markdown/database-schema.md`   |
| API structure                   | `markdown/api-structure.md`     |
| Backend/frontend folder pattern | `markdown/folder-structure.md`  |
| Authentication                  | `markdown/auth.md`              |
| PDF generation                  | `markdown/pdf-generation.md`    |
| Client tracking                 | `markdown/tracking.md`          |
| Proposal workflow               | `markdown/proposal-workflow.md` |
| Renewal workflow                | `markdown/renewals.md`          |
| Development/setup workflow      | `markdown/workflow.md`          |
| UI / UX design specification    | `markdown/ui-design.md`         |
| Known mistakes to avoid         | `markdown/Gotchas.md`           |

## Core system modes

### Mode A — Company Profile

Fixed 9-page PRAVYA TECH company profile.

Used when introducing PRAVYA TECH to a new lead.

Features:

* Standard company profile PDF
* Private proposal link
* View tracking
* PDF download tracking
* WhatsApp sharing

### Mode B — Project Proposal & Quotation

Dynamic 12-page proposal package.

Features:

* Client/contact information
* Company information
* Project title/subtitle
* Line items
* Pricing
* Currency
* Contract duration
* Embedded company profile
* Payment information
* Acceptance/sign-off
* Renewal date
* Private tracking link

## Client flow

The client receives a private URL:

```text
/p/{token}
```

Flow:

```text
Admin creates proposal
        ↓
Generate unique token
        ↓
Generate proposal/PDF
        ↓
Share private link
        ↓
Client opens /p/{token}
        ↓
Record view
        ↓
Client views proposal
        ↓
Download / WhatsApp / Accept
```

## Admin flow

```text
Admin Dashboard
      ↓
Choose proposal type
      ↓
Enter client/project information
      ↓
Enter pricing if quotation
      ↓
Generate proposal
      ↓
Create private tracking link
      ↓
Share through WhatsApp
      ↓
Monitor engagement
      ↓
Manage acceptance / renewal
```

## Database

The initial system is based around two core tables:

### `proposals`

Stores:

* Proposal ID
* Proposal type
* Proposal number
* Client name
* Company name
* Phone
* Email
* Project title
* Amount
* Currency
* PDF path
* Unique token
* Sent timestamp
* First opened timestamp
* Last opened timestamp
* View count
* Renewal date
* Status
* Created/updated timestamps

### `proposal_views`

Stores each proposal viewing event:

* View ID
* Proposal ID
* Viewed timestamp
* IP address
* User agent

Relationship:

```text
proposals
    │
    └──────< proposal_views
```

## Build order — do not skip ahead

1. Project structure + development environment
2. FastAPI backend foundation
3. PostgreSQL + SQLAlchemy setup
4. Database models + migrations
5. Admin authentication
6. Proposal CRUD APIs
7. React + TypeScript frontend
8. Admin Dashboard
9. Company Profile workflow
10. Project Proposal + Quotation workflow
11. PDF generation
12. Private `/p/{token}` client viewer
13. View/download tracking
14. WhatsApp sharing
15. Quote acceptance
16. Renewal management
17. Testing + security review
18. Production deployment

## Current status

Initial development stage.

The project foundation is being created using:

* Python/FastAPI APIs
* React + TypeScript frontend
* PostgreSQL database

Start with the backend foundation, database connection, models, and migrations before implementing the complete dashboard or client viewer.

The source system specification defines the core proposal, quotation, tracking, client viewer, and renewal requirements.
