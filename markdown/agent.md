# PRAVYA TECH Proposal Management System

# Phased Development Plan

> **Important:** This document defines the implementation phases for the PRAVYA TECH Proposal Management System.
>
> Read `AGENTS.md` first.
>
> Before implementing any phase, read the relevant documentation listed in `AGENTS.md`.
>
> **Do not implement multiple phases at once.**
>
> Complete the requested phase, test it, fix issues, verify the Definition of Done, and then **STOP**.

---

# 1. Development Philosophy

The system must be built incrementally.

The development order is:

```text
Phase 1
Project Structure + Development Environment
        ↓
Phase 2
FastAPI Backend Foundation
        ↓
Phase 3
PostgreSQL + SQLAlchemy Setup
        ↓
Phase 4
Database Models + Migrations
        ↓
Phase 5
Admin Authentication
        ↓
Phase 6
Proposal CRUD APIs
        ↓
Phase 7
React + TypeScript Frontend
        ↓
Phase 8
Admin Dashboard
        ↓
Phase 9
Company Profile Workflow
        ↓
Phase 10
Project Proposal + Quotation Workflow
        ↓
Phase 11
PDF Generation
        ↓
Phase 12
Private /p/{token} Client Viewer
        ↓
Phase 13
View + Download Tracking
        ↓
Phase 14
WhatsApp Sharing
        ↓
Phase 15
Quote Acceptance
        ↓
Phase 16
Renewal Management
        ↓
Phase 17
Testing + Security Review
        ↓
Phase 18
Production Deployment
```

---

# 2. Rules for Every Phase

These rules apply to every phase.

## 2.1 Do not skip phases

Do not jump directly to dashboard, PDF generation, client viewer, or renewal functionality.

Follow the defined dependency order.

---

## 2.2 Do not build future functionality early

If the current phase is Phase 3, do not start implementing:

* Authentication
* Dashboard
* PDF generation
* Client viewer
* Tracking
* WhatsApp
* Renewals

unless explicitly required by the current phase.

---

## 2.3 Preserve existing functionality

When implementing a new phase:

* Do not unnecessarily rewrite working code.
* Do not remove existing features.
* Do not break previous phases.
* Reuse existing services/components where appropriate.

---

## 2.4 Use real functionality

Do not replace required backend/database functionality with fake/mock data.

Mock data may only be used temporarily for UI development when the real API does not yet exist.

Replace it when the corresponding backend functionality is implemented.

---

## 2.5 Follow project documentation

Before implementing a phase, inspect the relevant files inside:

```text
markdown/
```

Important references include:

```text
markdown/README.md
markdown/techstack.md
markdown/database-schema.md
markdown/api-structure.md
markdown/folder-structure.md
markdown/auth.md
markdown/pdf-generation.md
markdown/tracking.md
markdown/proposal-workflow.md
markdown/renewals.md
markdown/workflow.md
markdown/ui-design.md
markdown/Gotchas.md
```

If detailed documentation conflicts with an implementation assumption, follow the project documentation and update the documentation when necessary.

---

# PHASE 1 — PROJECT STRUCTURE + DEVELOPMENT ENVIRONMENT

## Objective

Create the initial project structure and development environment.

At the end of this phase:

* Backend directory exists.
* Frontend directory exists.
* Git configuration exists.
* Environment configuration is prepared.
* Backend and frontend can be started independently.

---

## Backend

Create the basic FastAPI project.

Recommended structure:

```text
backend/
├── app/
│   ├── main.py
│   ├── core/
│   ├── models/
│   ├── schemas/
│   ├── routers/
│   ├── services/
│   ├── repositories/
│   └── utils/
├── tests/
├── requirements.txt
├── .env.example
└── .gitignore
```

---

## Frontend

Create the React + Vite + TypeScript application.

Recommended structure:

```text
frontend/
├── src/
│   ├── components/
│   ├── pages/
│   ├── layouts/
│   ├── services/
│   ├── hooks/
│   ├── types/
│   ├── utils/
│   ├── routes/
│   ├── context/
│   ├── App.tsx
│   └── main.tsx
├── public/
├── package.json
├── tsconfig.json
└── vite.config.ts
```

The frontend must use:

```text
.ts
.tsx
```

Do not create the application using plain JSX/JavaScript.

---

## Environment

Create:

```text
.env.example
```

Example:

```env
DATABASE_URL=postgresql+asyncpg://postgres:password@localhost:5432/proposal_management_system

JWT_SECRET_KEY=change-this-secret

FRONTEND_URL=http://localhost:5173

BACKEND_URL=http://localhost:8000
```

Never commit the real `.env`.

---

## Phase 1 Testing

Verify:

```bash
npm run dev
```

and:

```bash
uvicorn app.main:app --reload
```

Both applications should start without errors.

---

## Definition of Done

* [ ] Frontend starts.
* [ ] Backend starts.
* [ ] TypeScript compilation works.
* [ ] Python imports work.
* [ ] `.env.example` exists.
* [ ] `.env` is ignored by Git.
* [ ] Project folders follow the documented structure.

### STOP

Do not begin Phase 2 automatically.

---

# PHASE 2 — FASTAPI BACKEND FOUNDATION

## Objective

Create the initial FastAPI backend architecture.

---

## Backend Tasks

Configure:

* FastAPI application.
* Application entry point.
* Router registration.
* Configuration management.
* CORS.
* Error handling foundation.
* Health endpoint.

---

## Health API

Create:

```http
GET /api/health
```

Example response:

```json
{
  "success": true,
  "message": "PRAVYA TECH PMS API is running"
}
```

---

## Router Structure

Prepare:

```text
app/routers/
├── health.py
├── auth.py
├── proposals.py
├── clients.py
├── dashboard.py
└── public.py
```

Only implement the routers required by the current phase.

Future routers may remain empty or unregistered until needed.

---

## Phase 2 Testing

Verify:

```http
GET /api/health
```

returns HTTP 200.

Verify the FastAPI application starts successfully.

---

## Definition of Done

* [ ] FastAPI starts.
* [ ] `/api/health` works.
* [ ] CORS is configured.
* [ ] Configuration loads from environment variables.
* [ ] Router architecture is ready.
* [ ] No database logic is hardcoded into routers.

### STOP

---

# PHASE 3 — POSTGRESQL + SQLALCHEMY SETUP

## Objective

Connect FastAPI to PostgreSQL using SQLAlchemy 2.0 async.

---

## Database

Database:

```text
proposal_management_system
```

Use PostgreSQL.

---

## SQLAlchemy

Configure:

* Async engine.
* Async session maker.
* Declarative base.
* Dependency for database sessions.

Use:

```text
SQLAlchemy 2.0
asyncpg
```

---

## Recommended Database Files

```text
app/core/database.py
app/core/config.py
```

---

## Database Session

Create a reusable database dependency.

Routers should not manually create database connections.

---

## Connection Test

Create a safe way to verify the database connection.

The health endpoint may return database status if appropriate.

Example:

```json
{
  "success": true,
  "api": "ok",
  "database": "ok"
}
```

---

## Phase 3 Testing

Verify:

* PostgreSQL is running.
* Database exists.
* FastAPI connects successfully.
* Async SQLAlchemy session works.
* No plaintext credentials are hardcoded.

---

## Definition of Done

* [ ] PostgreSQL connection works.
* [ ] Async SQLAlchemy works.
* [ ] Database session dependency works.
* [ ] Environment variables are used.
* [ ] Connection errors are handled cleanly.

### STOP

---

# PHASE 4 — DATABASE MODELS + MIGRATIONS

## Objective

Create the database models and Alembic migrations required by the current system design.

Before implementing models, read:

```text
markdown/database-schema.md
```

---

## Core Models

The system will require the proposal/tracking model and supporting entities required by authentication and structured quotations.

Expected entities include:

```text
users
clients
proposals
proposal_items
proposal_views
```

The authoritative field definitions belong in:

```text
markdown/database-schema.md
```

Do not invent conflicting fields.

---

## Proposal

A proposal must support:

* Unique ID.
* Proposal type.
* Proposal number.
* Client information.
* Project information.
* Pricing.
* Currency.
* Contract duration.
* Renewal date.
* PDF path.
* Private token.
* Sent timestamp.
* First opened timestamp.
* Last opened timestamp.
* View count.
* Download count.
* Status.
* Acceptance information.
* Renewal/history relationship.
* Created/updated timestamps.

---

## Proposal Items

Quotation pricing must be structured.

Each quotation may contain:

```text
item name
description
quantity
unit price
total price
sort order
```

Do not store the entire quotation as one unstructured text field.

---

## Proposal Views

Each client view must be represented as a separate event.

Expected information:

```text
proposal
viewed timestamp
IP address
user agent
```

---

## Migrations

Configure Alembic.

Create the initial migration.

Run:

```bash
alembic upgrade head
```

The migration must successfully create the required tables.

---

## Definition of Done

* [ ] Models exist.
* [ ] Relationships work.
* [ ] Alembic is configured.
* [ ] Initial migration exists.
* [ ] Migration runs successfully.
* [ ] Database tables are created.
* [ ] Foreign keys are correct.
* [ ] Required indexes/unique constraints are implemented.

### STOP

---
-------------------------------------------------------------
# PHASE 5 — ADMIN AUTHENTICATION

## Objective

Implement secure administrator authentication.

Read:

```text
markdown/auth.md
```

before implementation.

---

## User Model

Implement the admin user model according to:

```text
markdown/database-schema.md
```

Passwords must never be stored in plaintext.

Use secure password hashing.

---

## Authentication API

Implement:

```http
POST /api/auth/login
GET /api/auth/me
POST /api/auth/refresh
```

Use JWT.

---

## Login

Admin submits:

```text
email
password
```

Successful authentication returns the required authentication tokens.

---

## Protected Routes

Create authentication dependency/middleware.

Admin APIs must require valid authentication.

---

## Frontend

Create:

```text
/login
```

The login page will be fully connected to the API when the frontend phase is implemented.

---

## Security

Implement:

* Password hashing.
* JWT validation.
* Token expiration.
* Protected routes.
* Safe authentication errors.
* Environment-based JWT secret.

Never expose password hashes through API responses.

---

## Definition of Done

* [ ] Admin can authenticate.
* [ ] JWT is issued.
* [ ] Protected API rejects unauthenticated requests.
* [ ] `/api/auth/me` returns the authenticated admin.
* [ ] Invalid credentials are rejected.
* [ ] Passwords are hashed.

### STOP

---

# PHASE 6 — PROPOSAL CRUD APIs

## Objective

Create backend APIs for managing clients and proposals.

Read:

```text
markdown/api-structure.md
markdown/proposal-workflow.md
markdown/database-schema.md
```

---

## Client APIs

Implement the documented client CRUD APIs.

Support:

* Create.
* List.
* Retrieve.
* Update.
* Delete where allowed.

---

## Proposal APIs

Implement:

```http
GET /api/proposals
POST /api/proposals
GET /api/proposals/{id}
PUT /api/proposals/{id}
DELETE /api/proposals/{id}
```

Use authenticated admin access.

---

## Proposal Creation

Support:

```text
Company Profile
Project Proposal / Quotation
```

Quotation proposals must support structured line items.

---

## Proposal Number

Proposal numbers must be unique.

Use the format defined by the project documentation.

Do not generate duplicate numbers.

---

## Validation

Validate:

* Required client fields.
* Proposal type.
* Pricing.
* Currency.
* Line items.
* Contract duration.
* Renewal date.

Backend validation is mandatory.

---

## Private Token

Every proposal must have a unique private token.

The token must be cryptographically secure.

Do not use the database ID as the token.

---

## Definition of Done

* [ ] Client CRUD works.
* [ ] Proposal CRUD works.
* [ ] Quotation line items work.
* [ ] Validation works.
* [ ] Unique proposal numbers work.
* [ ] Every proposal receives a unique private token.
* [ ] Admin authentication protects the endpoints.

### STOP

---

# PHASE 7 — REACT + TYPESCRIPT FRONTEND

## Objective

Create the frontend application foundation and connect it to the backend.

---

## Frontend

Use:

```text
React
Vite
TypeScript
TSX
React Router
```

---

## API Layer

Create a reusable API client.

Example:

```text
src/services/api.ts
```

Configure:

* API base URL.
* Authentication handling.
* Request handling.
* Response handling.
* Error handling.

---

## Routing

Prepare:

```text
/login
/dashboard
/clients
/proposals
/proposals/create
/proposals/:id
/proposals/:id/edit
```

The public route will be implemented later.

---

## Type Definitions

Create TypeScript types/interfaces for:

```text
User
Client
Proposal
ProposalItem
API responses
```

Avoid unnecessary `any`.

---

## Definition of Done

* [ ] React application starts.
* [ ] TypeScript compilation works.
* [ ] Router works.
* [ ] API service exists.
* [ ] Authentication state architecture exists.
* [ ] Backend communication works.

### STOP

---

# PHASE 8 — ADMIN DASHBOARD

## Objective

Build the authenticated PRAVYA TECH admin interface.

Read:

```text
markdown/ui-design.md
```

---

## Admin Layout

Create:

```text
Sidebar
Header
Main content
User menu
Logout
```

---

## Navigation

Include:

```text
Dashboard
Clients
Proposals
Renewals
Settings
```

Future sections may remain unavailable until their phases are complete.

---

## Dashboard

Create initial dashboard cards:

```text
Total Proposals
Sent
Viewed
Accepted
Renewal Due
```

Use real backend data where APIs exist.

---

## Proposal List

Create a professional proposal table.

Columns may include:

```text
Proposal No.
Client
Company
Project
Type
Amount
Currency
Status
Created
Actions
```

---

## UI States

Implement:

```text
Loading
Empty
Error
Success
```

---

## Responsive Design

The admin interface should work on:

* Desktop.
* Laptop.
* Tablet.

---

## Definition of Done

* [ ] Admin can log in.
* [ ] Dashboard opens.
* [ ] Sidebar works.
* [ ] Proposal list works.
* [ ] Logout works.
* [ ] Protected routes work.
* [ ] UI is responsive.

### STOP

---
## WORK ARE IN PROGRESS 

# PHASE 9 — COMPANY PROFILE WORKFLOW

## Objective

Implement Mode A:

```text
Company Profile
```

The company profile is the standard PRAVYA TECH 9-page profile.

Read:

```text
markdown/pdf-generation.md
```

and the provided company profile reference.

---

## Company Profile Pages

The profile should follow the defined 9-page structure:

```text
Page 1
Company Profile Cover

Page 2
Cover Letter

Page 3
Mission / Vision / Core Values

Page 4
Services

Page 5
Work Process

Page 6
Top Clients / BNI

Page 7
Top Clients / International

Page 8
Terms / Statement of Work

Page 9
Back Cover / Contact Information
```

Do not change the business structure without updating the documentation.

---

## Admin Workflow

Admin should be able to select:

```text
Create Company Profile
```

and provide the required information.

---

## Proposal Record

The company profile should still be represented as a proposal where required by the system architecture.

It must have:

```text
proposal number
private token
status
timestamps
```

---

## Definition of Done

* [ ] Company profile workflow exists.
* [ ] Admin can create a company profile proposal.
* [ ] Required information is stored.
* [ ] Profile data is ready for PDF generation.
* [ ] No quotation-specific pricing is required for profile-only mode.

### STOP

---

# PHASE 10 — PROJECT PROPOSAL + QUOTATION WORKFLOW

## Objective

Implement Mode B:

```text
Project Proposal + Quotation
```

---

## Dynamic Information

Support:

```text
Client Name
Company Name
Phone
Email

Project Title
Project Subtitle

Proposal Number
Issue Date
Valid Until

Line Items
Quantity
Unit Price
Total Price

Currency
Contract Duration
Renewal Date
```

---

## Pricing

Pricing must be structured.

Example:

```text
Item
Description
Quantity
Unit Price
Total
```

Calculate totals consistently.

---

## Proposal Workflow

Admin should be able to:

```text
Create
 ↓
Edit
 ↓
Save
 ↓
Review
 ↓
Generate
```

---

## Status

Use only the documented proposal statuses.

Do not introduce arbitrary statuses.

---

## Definition of Done

* [ ] Admin can create quotation.
* [ ] Client information works.
* [ ] Project information works.
* [ ] Line items work.
* [ ] Totals calculate correctly.
* [ ] Currency works.
* [ ] Contract duration works.
* [ ] Renewal date works.
* [ ] Proposal is stored correctly.

### STOP

---

# PHASE 11 — PDF GENERATION

## Objective

Implement backend/server-side PDF generation.

Read:

```text
markdown/pdf-generation.md
```

---

## Important Rule

PDF generation belongs to the backend/service layer.

React must NOT generate the final proposal PDF.

React collects and displays proposal data.

Backend assembles the final PDF.

---

# Company Profile PDF

Generate the 9-page company profile.

---

# Project Proposal PDF

Generate the 12-page proposal.

Structure:

```text
Page 1
Dynamic Project Cover

Page 2
Dynamic Cover Letter

Pages 3–8
Embedded Company Profile / Case Studies

Page 9
Dynamic Pricing / Quotation

Page 10
Payment Information

Page 11
Acceptance / Sign-Off

Page 12
Back Cover / Contact
```

---

## PDF API

Implement the documented proposal PDF generation endpoint.

Example:

```http
POST /api/proposals/{id}/generate-pdf
```

---

## Storage

Generated PDFs must be stored securely.

Do not expose arbitrary server file paths to clients.

---

## Definition of Done

* [ ] Company profile PDF generates.
* [ ] Quotation PDF generates.
* [ ] Dynamic information appears correctly.
* [ ] Pricing appears correctly.
* [ ] PDF page structure is correct.
* [ ] PDF can be downloaded by authorized admin.
* [ ] PDF generation errors are handled.

### STOP

---

# PHASE 12 — PRIVATE /p/{token} CLIENT VIEWER

## Objective

Create the external client proposal viewer.

This is one of the most important system features.

---

## Route

The client must access proposals through:

```text
/p/{token}
```

Never:

```text
/p/{proposal_id}
```

---

## Token Rules

The token must:

* Be unique.
* Be difficult to guess.
* Identify the proposal.
* Not expose internal database IDs.

---

## Public API

Implement the documented public proposal endpoint.

Example:

```http
GET /api/public/proposals/{token}
```

---

## Client Response

Return only information required for the client experience.

Never expose:

* Internal IDs unnecessarily.
* Database information.
* Passwords.
* Internal metadata.
* Sensitive admin information.

---

## Viewer

Display:

```text
PRAVYA TECH
Proposal information
Client information
Project information
Proposal/PDF
Download
WhatsApp
Accept
```

Features that are not implemented yet should remain disabled/placeholder until their phase.

---

## Responsive Design

The public viewer MUST work on:

```text
Desktop
Tablet
Mobile
```

---

## Invalid Token

Invalid or expired token behavior must be handled safely.

Example:

```text
Proposal not found.
```

Do not reveal whether arbitrary internal proposal IDs exist.

---

## Definition of Done

* [ ] `/p/{token}` works.
* [ ] Valid token loads correct proposal.
* [ ] Invalid token is handled safely.
* [ ] Internal proposal IDs are not required.
* [ ] Client viewer is responsive.
* [ ] Sensitive internal information is hidden.

### STOP

---

# PHASE 13 — VIEW + DOWNLOAD TRACKING

## Objective

Implement proposal engagement tracking.

Read:

```text
markdown/tracking.md
```

---

# View Tracking

Every opening of:

```text
/p/{token}
```

must create a view event.

Record:

```text
proposal_id
viewed_at
ip_address
user_agent
```

Update proposal information:

```text
first_opened_at
last_opened_at
view_count
```

---

# Status Update

When a proposal is first opened, update the status according to the documented workflow.

Do not introduce an undocumented status.

---

# PDF Download Tracking

Every client PDF download must be trackable.

Update:

```text
download_count
```

and record the download event/timestamp according to the tracking design.

---

# Analytics

Admin should be able to see:

```text
Total Views
Downloads
First Opened
Last Opened
```

and view history where supported.

---

## Definition of Done

Test:

```text
Client opens link
      ↓
View event created
      ↓
View count increases
      ↓
First opened recorded
      ↓
Last opened updated
```

Then:

```text
Client downloads PDF
      ↓
Download tracked
      ↓
Admin can determine download activity
```

### STOP

---

# PHASE 14 — WHATSAPP SHARING

## Objective

Allow admins and clients to share/contact PRAVYA TECH through WhatsApp.

---

## Admin

Add:

```text
Share via WhatsApp
```

to the proposal actions.

The generated message should include the private proposal URL.

Example structure:

```text
Hi {Client Name},

Please find the PRAVYA TECH proposal here:

{private proposal URL}

Please let us know if you have any questions.
```

Use the configured PRAVYA TECH contact details.

---

## Client

Where specified by the UI design, provide a WhatsApp/contact action.

---

## Important

Do not expose:

* Internal proposal IDs.
* Internal database URLs.
* Server file paths.

The shared URL must be:

```text
/p/{token}
```

---

## Definition of Done

* [ ] Admin can share proposal through WhatsApp.
* [ ] Correct client name is used.
* [ ] Private proposal URL is included.
* [ ] URL uses token.
* [ ] No internal IDs are exposed.

### STOP

---

# PHASE 15 — QUOTE ACCEPTANCE

## Objective

Allow clients to accept project quotations.

---

## Client

Quotation proposals should show:

```text
Accept Quote
```

---

## Confirmation

Before acceptance:

```text
Are you sure you want to accept this quotation?
```

Provide:

```text
Cancel
Accept
```

---

## API

Implement the documented public acceptance endpoint.

Example:

```http
POST /api/public/proposals/{token}/accept
```

The proposal must be identified using the private token.

Do not allow arbitrary proposal IDs from the client.

---

## Acceptance

When accepted:

```text
accepted_at = current timestamp
```

and update the status according to the documented workflow.

---

## Admin

Admin should see:

```text
Accepted
```

and the acceptance timestamp.

---

## Definition of Done

```text
Client opens proposal
       ↓
Clicks Accept
       ↓
Confirms
       ↓
Acceptance recorded
       ↓
Admin sees accepted proposal
```

### STOP

---

# PHASE 16 — RENEWAL MANAGEMENT

## Objective

Implement contract renewal management.

Read:

```text
markdown/renewals.md
```

---

# Renewal Date

Quotation proposals must support:

```text
contract_duration
renewal_date
```

---

# Renewal Dashboard

Create:

```text
/renewals
```

Display:

```text
Upcoming Renewal
Renewal Due
Overdue
Renewed
```

Use the exact workflow rules from:

```text
markdown/renewals.md
```

---

# Renewal

A renewal must create a **new proposal version**.

Do not overwrite the original proposal.

Workflow:

```text
Original Proposal
       ↓
Duplicate Proposal
       ↓
Keep Client
       ↓
Keep Project
       ↓
Keep Pricing
       ↓
Update Dates
       ↓
Generate New Proposal Number
       ↓
Generate New Private Token
       ↓
Generate New PDF
       ↓
Create New Proposal
```

---

# History

Maintain the relationship between old and new proposals.

Example:

```text
Proposal 2026
     ↓
Renewal 2027
     ↓
Renewal 2028
```

Historical proposals must remain available.

---

## Definition of Done

* [ ] Renewal dates are stored.
* [ ] Upcoming renewals are identified.
* [ ] Overdue renewals are identified.
* [ ] Admin can renew a quotation.
* [ ] New proposal is created.
* [ ] New proposal number is generated.
* [ ] New private token is generated.
* [ ] Historical proposal remains unchanged.
* [ ] Proposal history is linked.
* [ ] New PDF can be generated.

### STOP

---

# PHASE 17 — TESTING + SECURITY REVIEW

## Objective

Perform a complete functional, integration, security, and UI review.

---

# Backend Tests

Test:

```text
Health
Authentication
Users
Clients
Proposal CRUD
Proposal Items
Token generation
PDF generation
Public proposal access
View tracking
Download tracking
Acceptance
Renewal
```

---

# Frontend Tests

Test:

```text
Login
Dashboard
Clients
Proposal creation
Proposal editing
Proposal details
PDF generation
Public viewer
Download
WhatsApp
Acceptance
Renewals
```

---

# Security Review

Verify:

* Passwords are hashed.
* JWT secrets are not hardcoded.
* `.env` is not committed.
* Admin APIs require authentication.
* Public APIs use private tokens.
* Internal proposal IDs are not used as client access tokens.
* SQL queries are parameterized through SQLAlchemy.
* Pydantic validation is applied.
* File uploads/downloads are controlled.
* Sensitive database information is not returned.
* CORS is correctly configured.
* Error messages do not expose internal implementation details.

---

# Hard Rule Verification

Explicitly verify every rule from `AGENTS.md`:

```text
[ ] Unique private token
[ ] Token-based client access
[ ] Every client opening tracked
[ ] Every PDF download trackable
[ ] Status workflow consistent
[ ] Renewal creates new proposal/version/link
[ ] PDF generation in backend
[ ] Structured pricing
[ ] Mobile/desktop client viewer
[ ] No sensitive internal information exposed
```

---

# End-to-End Test

Run the complete business workflow:

```text
Admin Login
    ↓
Create Client
    ↓
Create Proposal
    ↓
Add Pricing
    ↓
Generate PDF
    ↓
Generate Private Link
    ↓
Share via WhatsApp
    ↓
Client Opens Link
    ↓
View Recorded
    ↓
Client Downloads PDF
    ↓
Download Recorded
    ↓
Client Accepts Quote
    ↓
Admin Sees Acceptance
    ↓
Renewal Becomes Due
    ↓
Admin Renews
    ↓
New Proposal Created
    ↓
New Token Created
    ↓
New PDF Generated
```

---

# Definition of Done

* [ ] Automated tests pass.
* [ ] Integration tests pass.
* [ ] Main user workflow works.
* [ ] Security review complete.
* [ ] No critical errors remain.
* [ ] No critical console errors remain.
* [ ] No broken API endpoints remain.
* [ ] Responsive client viewer works.

### STOP

---

# PHASE 18 — PRODUCTION DEPLOYMENT

## Objective

Prepare the completed system for production deployment.

Read:

```text
markdown/workflow.md
```

and all relevant deployment documentation.

---

# Production Environment

Configure:

```text
Production PostgreSQL
Production backend
Production frontend
Production environment variables
Production PDF storage
```

---

# Environment Variables

Production secrets must be provided through the deployment environment.

Never commit:

```text
.env
JWT secrets
Database passwords
API secrets
Private credentials
```

---

# Database

Before deployment:

```text
Run migrations
Verify database
Create required admin account
Verify indexes
Verify constraints
```

---

# Backend

Verify:

* FastAPI production startup.
* CORS.
* Environment variables.
* Database connection.
* Logging.
* Error handling.
* PDF generation.
* File storage.

---

# Frontend

Verify:

* Production build.
* API URL.
* Routing.
* Authentication.
* Public `/p/{token}` routes.
* Responsive layout.

---

# Final Smoke Test

Test production:

```text
Login
 ↓
Create proposal
 ↓
Generate PDF
 ↓
Open private link
 ↓
Track view
 ↓
Download
 ↓
Track download
 ↓
Accept
 ↓
Renew
```

---

# Definition of Done

* [ ] Production frontend deployed.
* [ ] Production backend deployed.
* [ ] Production PostgreSQL configured.
* [ ] Database migrations applied.
* [ ] Environment secrets configured.
* [ ] PDF storage works.
* [ ] Authentication works.
* [ ] Public proposal links work.
* [ ] Tracking works.
* [ ] Acceptance works.
* [ ] Renewal works.
* [ ] HTTPS enabled.
* [ ] Final smoke test passes.

### STOP

---

# FINAL SYSTEM CHECKLIST

After all 18 phases are complete, the system must support:

## Admin

```text
Login
Dashboard
Clients
Create Proposal
Edit Proposal
View Proposal
Generate PDF
Share Proposal
WhatsApp
Analytics
Acceptance
Renewals
Proposal History
```

---

## Company Profile

```text
9-page company profile
Private link
View tracking
Download tracking
WhatsApp sharing
```

---

## Project Proposal

```text
12-page proposal
Client information
Project information
Line items
Pricing
Currency
Contract duration
Renewal date
Payment information
Acceptance
Private link
Tracking
```

---

## Client

The client should be able to:

```text
Open private link
View proposal
Download PDF
Contact PRAVYA TECH
Accept quotation
```

without creating an account.

---

# FINAL ARCHITECTURE

```text
                    PRAVYA TECH PMS
                           │
             ┌─────────────┴─────────────┐
             │                           │
      COMPANY PROFILE             PROJECT PROPOSAL
         9 PAGES                    12 PAGES
             │                           │
             └─────────────┬─────────────┘
                           │
                      BACKEND API
                           │
                    PostgreSQL DB
                           │
                     PDF SERVICE
                           │
                    PRIVATE TOKEN
                           │
                       /p/{token}
                           │
                         CLIENT
                           │
             ┌─────────────┼─────────────┐
             │             │             │
            VIEW        DOWNLOAD       ACCEPT
             │             │             │
             └─────────────┼─────────────┘
                           │
                       TRACKING
                           │
                       ANALYTICS
                           │
                        RENEWAL
                           │
                    NEW PROPOSAL
```

---

# MOST IMPORTANT INSTRUCTION FOR AI CODING AGENTS

When this file is provided to an AI coding agent:

```text
1. Read AGENTS.md.
2. Read the relevant markdown documentation.
3. Identify the requested phase.
4. Implement ONLY that phase.
5. Do not implement future phases.
6. Test the implementation.
7. Fix errors caused by the current phase.
8. Verify the Definition of Done.
9. Report what was completed.
10. STOP.
```

Never assume that completing one phase gives permission to start the next phase.

The developer will explicitly request the next phase.
