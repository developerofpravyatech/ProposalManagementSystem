# PRAVYA TECH Proposal Management System — To-Do List

> Implementation follows the 18-phase plan in `markdown/agent.md`.
> Complete one phase at a time, verify the Definition of Done, then STOP.

---

## Phase 1 — Project Structure + Development Environment

- [ ] Create backend folder structure (`app/main.py`, `app/core/`, `app/models/`, `app/schemas/`, `app/routers/`, `app/services/`, `app/repositories/`, `app/utils/`)
- [ ] Create backend `tests/`, `requirements.txt`, `.env.example`, `.gitignore`
- [ ] Create frontend folder structure (`src/components/`, `src/pages/`, `src/layouts/`, `src/services/`, `src/hooks/`, `src/types/`, `src/utils/`, `src/routes/`, `src/context/`, `src/App.tsx`, `src/main.tsx`)
- [ ] Create frontend `public/`, `package.json`, `tsconfig.json`, `vite.config.ts`
- [ ] Create root `.env.example`
- [ ] Ensure `.env` is ignored by Git
- [ ] Verify frontend starts (`npm run dev`)
- [ ] Verify backend starts (`uvicorn app.main:app --reload`)
- [ ] Verify TypeScript compilation works
- [ ] Verify Python imports work

### STOP — Do not begin Phase 2 automatically.

---

## Phase 2 — FastAPI Backend Foundation

- [ ] Configure FastAPI application
- [ ] Create application entry point
- [ ] Set up router registration
- [ ] Implement configuration management from environment variables
- [ ] Configure CORS
- [ ] Create error handling foundation
- [ ] Implement health endpoint (`GET /api/health`)
- [ ] Create router directory structure (`health.py`, `auth.py`, `proposals.py`, `clients.py`, `dashboard.py`, `public.py`)
- [ ] Verify `/api/health` returns HTTP 200
- [ ] Verify FastAPI application starts successfully

### STOP

---

## Phase 3 — PostgreSQL + SQLAlchemy Setup

- [ ] Ensure PostgreSQL is running and database `proposal_management_system` exists
- [ ] Configure async SQLAlchemy engine (`SQLAlchemy 2.0` + `asyncpg`)
- [ ] Create async session maker
- [ ] Create declarative base
- [ ] Create reusable database session dependency
- [ ] Implement configuration loading from environment variables
- [ ] Add database connection test/health check
- [ ] Handle connection errors cleanly
- [ ] Verify FastAPI connects to PostgreSQL successfully
- [ ] Verify async SQLAlchemy session works
- [ ] Ensure no plaintext credentials are hardcoded

### STOP

---

## Phase 4 — Database Models + Migrations

- [ ] Read `markdown/database-schema.md`
- [ ] Create `users` model
- [ ] Create `clients` model
- [ ] Create `proposals` model
- [ ] Create `proposal_items` model
- [ ] Create `proposal_views` model
- [ ] Define relationships between models
- [ ] Configure Alembic
- [ ] Create initial migration
- [ ] Run `alembic upgrade head`
- [ ] Verify database tables are created
- [ ] Verify foreign keys are correct
- [ ] Verify required indexes and unique constraints

### STOP

---

## Phase 5 — Admin Authentication

- [ ] Read `markdown/auth.md`
- [ ] Implement admin user model per `markdown/database-schema.md`
- [ ] Implement secure password hashing
- [ ] Implement `POST /api/auth/login`
- [ ] Implement `GET /api/auth/me`
- [ ] Implement `POST /api/auth/refresh`
- [ ] Configure JWT (issuance, validation, expiration)
- [ ] Create authentication dependency/middleware
- [ ] Protect admin API routes
- [ ] Ensure passwords are never returned via API
- [ ] Use environment-based JWT secret
- [ ] Verify admin can authenticate
- [ ] Verify JWT is issued correctly
- [ ] Verify protected API rejects unauthenticated requests
- [ ] Verify `/api/auth/me` returns authenticated admin
- [ ] Verify invalid credentials are rejected

### STOP

---

## Phase 6 — Proposal CRUD APIs

- [ ] Read `markdown/api-structure.md`, `markdown/proposal-workflow.md`, `markdown/database-schema.md`
- [ ] Implement Client CRUD APIs (Create, List, Retrieve, Update, Delete)
- [ ] Implement `GET /api/proposals`
- [ ] Implement `POST /api/proposals`
- [ ] Implement `GET /api/proposals/{id}`
- [ ] Implement `PUT /api/proposals/{id}`
- [ ] Implement `DELETE /api/proposals/{id}`
- [ ] Support Company Profile mode
- [ ] Support Project Proposal + Quotation mode
- [ ] Implement structured quotation line items
- [ ] Enforce unique proposal numbers
- [ ] Implement cryptographic private token generation for each proposal
- [ ] Validate required client fields
- [ ] Validate proposal type, pricing, currency, line items, contract duration, renewal date
- [ ] Protect endpoints with admin authentication

### STOP

---

## Phase 7 — React + TypeScript Frontend

- [ ] Initialize React + Vite + TypeScript application
- [ ] Configure TypeScript (`tsconfig.json`)
- [ ] Configure Vite (`vite.config.ts`)
- [ ] Create API client service (`src/services/api.ts`)
- [ ] Configure API base URL
- [ ] Implement authentication handling in API client
- [ ] Implement request/response handling
- [ ] Implement error handling
- [ ] Set up React Router
- [ ] Create routes: `/login`, `/dashboard`, `/clients`, `/proposals`, `/proposals/create`, `/proposals/:id`, `/proposals/:id/edit`
- [ ] Create TypeScript types/interfaces for `User`, `Client`, `Proposal`, `ProposalItem`, API responses
- [ ] Avoid unnecessary `any` types
- [ ] Verify React application starts
- [ ] Verify TypeScript compilation works
- [ ] Verify router works
- [ ] Verify backend communication works

### STOP

---

## Phase 8 — Admin Dashboard

- [ ] Read `markdown/ui-design.md`
- [ ] Create admin layout (Sidebar, Header, Main content, User menu, Logout)
- [ ] Implement navigation: Dashboard, Clients, Proposals, Renewals, Settings
- [ ] Create dashboard cards: Total Proposals, Sent, Viewed, Accepted, Renewal Due
- [ ] Create proposal list table with columns: Proposal No., Client, Company, Project, Type, Amount, Currency, Status, Created, Actions
- [ ] Implement UI states: Loading, Empty, Error, Success
- [ ] Implement responsive design (Desktop, Laptop, Tablet)
- [ ] Verify admin can log in
- [ ] Verify dashboard opens
- [ ] Verify sidebar works
- [ ] Verify proposal list works
- [ ] Verify logout works
- [ ] Verify protected routes work

### STOP

---

## Phase 9 — Company Profile Workflow

- [ ] Read `markdown/pdf-generation.md`
- [ ] Implement Mode A: Company Profile workflow
- [ ] Create admin interface for Company Profile creation
- [ ] Support 9-page company profile structure:
  - [ ] Page 1: Company Profile Cover
  - [ ] Page 2: Cover Letter
  - [ ] Page 3: Mission / Vision / Core Values
  - [ ] Page 4: Services
  - [ ] Page 5: Work Process
  - [ ] Page 6: Top Clients / BNI
  - [ ] Page 7: Top Clients / International
  - [ ] Page 8: Terms / Statement of Work
  - [ ] Page 9: Back Cover / Contact Information
- [ ] Store company profile as proposal with proposal number, private token, status, timestamps
- [ ] Prepare profile data for PDF generation
- [ ] Ensure no quotation-specific pricing is required for profile-only mode

### STOP

---

## Phase 10 — Project Proposal + Quotation Workflow

- [ ] Read `markdown/proposal-workflow.md`
- [ ] Implement Mode B: Project Proposal + Quotation workflow
- [ ] Support dynamic client information (Name, Company, Phone, Email)
- [ ] Support project information (Title, Subtitle)
- [ ] Support proposal metadata (Proposal Number, Issue Date, Valid Until)
- [ ] Support structured line items (Item, Description, Quantity, Unit Price, Total)
- [ ] Support currency selection
- [ ] Support contract duration
- [ ] Support renewal date
- [ ] Implement pricing total calculation
- [ ] Implement proposal workflow: Create → Edit → Save → Review → Generate
- [ ] Use documented proposal statuses only
- [ ] Verify admin can create quotation
- [ ] Verify client information works
- [ ] Verify project information works
- [ ] Verify line items work
- [ ] Verify totals calculate correctly
- [ ] Verify currency works
- [ ] Verify contract duration works
- [ ] Verify renewal date works
- [ ] Verify proposal is stored correctly

### STOP

---

## Phase 11 — PDF Generation

- [ ] Read `markdown/pdf-generation.md`
- [ ] Implement backend PDF generation service
- [ ] Generate 9-page Company Profile PDF
- [ ] Generate 12-page Project Proposal PDF with structure:
  - [ ] Page 1: Dynamic Project Cover
  - [ ] Page 2: Dynamic Cover Letter
  - [ ] Pages 3–8: Embedded Company Profile / Case Studies
  - [ ] Page 9: Dynamic Pricing / Quotation
  - [ ] Page 10: Payment Information
  - [ ] Page 11: Acceptance / Sign-Off
  - [ ] Page 12: Back Cover / Contact
- [ ] Implement `POST /api/proposals/{id}/generate-pdf`
- [ ] Store generated PDFs securely
- [ ] Do not expose server file paths to clients
- [ ] Verify Company profile PDF generates
- [ ] Verify Quotation PDF generates
- [ ] Verify dynamic information appears correctly
- [ ] Verify pricing appears correctly
- [ ] Verify PDF page structure is correct
- [ ] Verify PDF can be downloaded by authorized admin
- [ ] Verify PDF generation errors are handled

### STOP

---

## Phase 12 — Private `/p/{token}` Client Viewer

- [ ] Create public route `/p/{token}`
- [ ] Implement `GET /api/public/proposals/{token}`
- [ ] Ensure token is unique and cryptographically secure
- [ ] Do not expose internal database IDs to client
- [ ] Display: PRAVYA TECH branding, proposal information, client information, project information, PDF viewer, Download button, WhatsApp button, Accept button
- [ ] Disable/placeholder features not yet implemented
- [ ] Implement responsive design (Desktop, Tablet, Mobile)
- [ ] Handle invalid/expired token safely
- [ ] Do not reveal whether internal proposal IDs exist
- [ ] Verify `/p/{token}` works
- [ ] Verify valid token loads correct proposal
- [ ] Verify invalid token is handled safely
- [ ] Verify internal proposal IDs are not required
- [ ] Verify client viewer is responsive
- [ ] Verify sensitive internal information is hidden

### STOP

---

## Phase 13 — View + Download Tracking

- [ ] Read `markdown/tracking.md`
- [ ] Create view event on every `/p/{token}` opening
- [ ] Record: `proposal_id`, `viewed_at`, `ip_address`, `user_agent`
- [ ] Update proposal: `first_opened_at`, `last_opened_at`, `view_count`
- [ ] Update proposal status on first open per documented workflow
- [ ] Track PDF downloads
- [ ] Update `download_count`
- [ ] Record download event/timestamp
- [ ] Implement admin analytics (Total Views, Downloads, First Opened, Last Opened)
- [ ] Implement view history
- [ ] Test: Client opens link → View event created → View count increases → First opened recorded → Last opened updated
- [ ] Test: Client downloads PDF → Download tracked → Admin can determine download activity

### STOP

---

## Phase 14 — WhatsApp Sharing

- [ ] Add "Share via WhatsApp" action to proposal actions
- [ ] Generate message with client name and private proposal URL
- [ ] Use configured PRAVYA TECH contact details
- [ ] Ensure shared URL uses `/p/{token}` format
- [ ] Do not expose internal proposal IDs, database URLs, or server file paths
- [ ] Verify admin can share proposal through WhatsApp
- [ ] Verify correct client name is used
- [ ] Verify private proposal URL is included
- [ ] Verify URL uses token
- [ ] Verify no internal IDs are exposed

### STOP

---

## Phase 15 — Quote Acceptance

- [ ] Implement public acceptance endpoint `POST /api/public/proposals/{token}/accept`
- [ ] Identify proposal using private token only
- [ ] Do not allow arbitrary proposal IDs from client
- [ ] Display "Accept Quote" button on quotation proposals
- [ ] Show confirmation dialog: "Are you sure you want to accept this quotation?" with Cancel/Accept
- [ ] Record `accepted_at` timestamp on acceptance
- [ ] Update proposal status per documented workflow
- [ ] Show acceptance status and timestamp to admin
- [ ] Test: Client opens proposal → Clicks Accept → Confirms → Acceptance recorded → Admin sees accepted proposal

### STOP

---

## Phase 16 — Renewal Management

- [ ] Read `markdown/renewals.md`
- [ ] Ensure proposals support `contract_duration` and `renewal_date`
- [ ] Create `/renewals` dashboard
- [ ] Display: Upcoming Renewal, Renewal Due, Overdue, Renewed
- [ ] Implement renewal workflow:
  - [ ] Duplicate original proposal
  - [ ] Keep client, project, and pricing
  - [ ] Update dates
  - [ ] Generate new proposal number
  - [ ] Generate new private token
  - [ ] Generate new PDF
  - [ ] Create new proposal
- [ ] Maintain history relationship between old and new proposals
- [ ] Keep historical proposals available
- [ ] Verify renewal dates are stored
- [ ] Verify upcoming renewals are identified
- [ ] Verify overdue renewals are identified
- [ ] Verify admin can renew a quotation
- [ ] Verify new proposal is created
- [ ] Verify new proposal number is generated
- [ ] Verify new private token is generated
- [ ] Verify historical proposal remains unchanged
- [ ] Verify proposal history is linked
- [ ] Verify new PDF can be generated

### STOP

---

## Phase 17 — Testing + Security Review

### Backend Tests
- [ ] Test Health endpoint
- [ ] Test Authentication flows
- [ ] Test Users CRUD
- [ ] Test Clients CRUD
- [ ] Test Proposal CRUD
- [ ] Test Proposal Items
- [ ] Test Token generation
- [ ] Test PDF generation
- [ ] Test Public proposal access
- [ ] Test View tracking
- [ ] Test Download tracking
- [ ] Test Acceptance
- [ ] Test Renewal

### Frontend Tests
- [ ] Test Login
- [ ] Test Dashboard
- [ ] Test Clients
- [ ] Test Proposal creation
- [ ] Test Proposal editing
- [ ] Test Proposal details
- [ ] Test PDF generation
- [ ] Test Public viewer
- [ ] Test Download
- [ ] Test WhatsApp
- [ ] Test Acceptance
- [ ] Test Renewals

### Security Review
- [ ] Verify passwords are hashed
- [ ] Verify JWT secrets are not hardcoded
- [ ] Verify `.env` is not committed
- [ ] Verify admin APIs require authentication
- [ ] Verify public APIs use private tokens
- [ ] Verify internal proposal IDs are not used as client access tokens
- [ ] Verify SQL queries are parameterized through SQLAlchemy
- [ ] Verify Pydantic validation is applied
- [ ] Verify file uploads/downloads are controlled
- [ ] Verify sensitive database information is not returned
- [ ] Verify CORS is correctly configured
- [ ] Verify error messages do not expose internal implementation details

### Hard Rule Verification
- [ ] Unique private token
- [ ] Token-based client access
- [ ] Every client opening tracked
- [ ] Every PDF download trackable
- [ ] Status workflow consistent
- [ ] Renewal creates new proposal/version/link
- [ ] PDF generation in backend
- [ ] Structured pricing
- [ ] Mobile/desktop client viewer
- [ ] No sensitive internal information exposed

### End-to-End Test
- [ ] Run complete business workflow:
  - [ ] Admin Login
  - [ ] Create Client
  - [ ] Create Proposal
  - [ ] Add Pricing
  - [ ] Generate PDF
  - [ ] Generate Private Link
  - [ ] Share via WhatsApp
  - [ ] Client Opens Link
  - [ ] View Recorded
  - [ ] Client Downloads PDF
  - [ ] Download Recorded
  - [ ] Client Accepts Quote
  - [ ] Admin Sees Acceptance
  - [ ] Renewal Becomes Due
  - [ ] Admin Renews
  - [ ] New Proposal Created
  - [ ] New Token Created
  - [ ] New PDF Generated

- [ ] Automated tests pass
- [ ] Integration tests pass
- [ ] Main user workflow works
- [ ] Security review complete
- [ ] No critical errors remain
- [ ] No critical console errors remain
- [ ] No broken API endpoints remain
- [ ] Responsive client viewer works

### STOP

---

## Phase 18 — Production Deployment

- [ ] Read `markdown/workflow.md`
- [ ] Configure production PostgreSQL
- [ ] Configure production backend
- [ ] Configure production frontend
- [ ] Configure production environment variables
- [ ] Configure production PDF storage
- [ ] Run database migrations
- [ ] Verify database
- [ ] Create required admin account
- [ ] Verify indexes
- [ ] Verify constraints
- [ ] Verify FastAPI production startup
- [ ] Verify CORS configuration
- [ ] Verify environment variables
- [ ] Verify database connection
- [ ] Verify logging
- [ ] Verify error handling
- [ ] Verify PDF generation
- [ ] Verify file storage
- [ ] Build production frontend
- [ ] Verify API URL
- [ ] Verify routing
- [ ] Verify authentication
- [ ] Verify public `/p/{token}` routes
- [ ] Verify responsive layout
- [ ] Ensure `.env` and secrets are not committed
- [ ] Enable HTTPS
- [ ] Run final smoke test:
  - [ ] Login
  - [ ] Create proposal
  - [ ] Generate PDF
  - [ ] Open private link
  - [ ] Track view
  - [ ] Download
  - [ ] Track download
  - [ ] Accept
  - [ ] Renew

- [ ] Production frontend deployed
- [ ] Production backend deployed
- [ ] Production PostgreSQL configured
- [ ] Database migrations applied
- [ ] Environment secrets configured
- [ ] PDF storage works
- [ ] Authentication works
- [ ] Public proposal links work
- [ ] Tracking works
- [ ] Acceptance works
- [ ] Renewal works
- [ ] HTTPS enabled
- [ ] Final smoke test passes

### STOP — All phases complete.

---

## Final System Checklist

### Admin Features
- [ ] Login
- [ ] Dashboard
- [ ] Clients
- [ ] Create Proposal
- [ ] Edit Proposal
- [ ] View Proposal
- [ ] Generate PDF
- [ ] Share Proposal
- [ ] WhatsApp
- [ ] Analytics
- [ ] Acceptance
- [ ] Renewals
- [ ] Proposal History

### Company Profile
- [ ] 9-page company profile
- [ ] Private link
- [ ] View tracking
- [ ] Download tracking
- [ ] WhatsApp sharing

### Project Proposal
- [ ] 12-page proposal
- [ ] Client information
- [ ] Project information
- [ ] Line items
- [ ] Pricing
- [ ] Currency
- [ ] Contract duration
- [ ] Renewal date
- [ ] Payment information
- [ ] Acceptance
- [ ] Private link
- [ ] Tracking

### Client Experience
- [ ] Open private link
- [ ] View proposal
- [ ] Download PDF
- [ ] Contact PRAVYA TECH
- [ ] Accept quotation (no account required)
