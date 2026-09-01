# Development To-Do & Progress Tracker — PRAVYA TECH PMS

## Phase 0 — Foundation (Completed)

- [x] Project structure + development environment
- [x] FastAPI backend foundation
- [x] PostgreSQL + SQLAlchemy async setup with `asyncpg`
- [x] Database models: `proposals`, `proposal_views`, `admins`
- [x] Admin authentication API (`/api/auth/login`, `/api/auth/me`, `/api/auth/refresh`)
- [x] Proposal CRUD APIs (`/api/proposals`)
- [x] Public token-based client endpoints (`/api/public/proposals/{token}`)
- [x] PDF generation service (`backend/app/services/pdf_service.py`)
- [x] React + TypeScript frontend
- [x] Admin Dashboard UI
- [x] Client Proposal Portal UI (`/p/{token}`)
- [x] CORS + frontend-backend integration
- [x] Admin login end-to-end with JSON auth

---

## Phase 1 — Mode A: Company Profile (Next Up)

**Goal:** Validate the fixed company profile flow end-to-end.

### Admin Actions

- [ ] Navigate to `/admin/proposals/create`
- [ ] Select **Mode A: Company Profile**
- [ ] Fill required fields:
  - Client name
  - Company name
  - Phone/email
  - Project title
- [ ] Click **Generate Company Profile**
- [ ] Verify success toast shows proposal number
- [ ] Redirect to `/admin/proposals`

### Backend Verification

- [ ] Verify proposal is saved in `proposals` table with `type = profile_only`
- [ ] Verify `proposal_no` is generated (e.g., `PT-2026-001`)
- [ ] Verify `unique_token` is a non-empty string
- [ ] Verify `status = sent`
- [ ] Verify `pdf_path` is populated after PDF generation

### Client Verification

- [ ] Copy private link from proposals table
- [ ] Open `/p/{token}` in browser
- [ ] Verify company profile renders without errors
- [ ] Verify mobile responsive layout

### Tracking Verification

- [ ] Check `proposal_views` table has a new entry
- [ ] Verify `view_count` incremented to 1
- [ ] Verify `first_opened_at` is set
- [ ] Verify `last_opened_at` is set
- [ ] Verify status changed from `sent` to `viewed`

### PDF Verification

- [ ] Click **Download PDF** from client viewer
- [ ] Verify PDF downloads successfully
- [ ] Verify PDF contains correct company profile content

---

## Phase 2 — Mode B: Project Proposal + Quotation

**Goal:** Validate the dynamic quotation workflow with structured pricing.

### Admin Actions

- [ ] Navigate to `/admin/proposals/create`
- [ ] Select **Mode B: Project Proposal + Quotation**
- [ ] Fill Step 1: Client/company information
- [ ] Fill Step 2: Project title, description, timeline
- [ ] Fill Step 3:
  - Add line items with title, description, quantity, unit price
  - Select currency (USD, INR, AED, etc.)
  - Set contract duration
  - Set renewal date
  - Enter terms/conditions
- [ ] Click **Generate Proposal & Private Link**
- [ ] Verify proposal appears in `/admin/proposals`

### Backend Verification

- [ ] Verify proposal saved with `type = quotation_proposal`
- [ ] Verify `amount` matches total of line items
- [ ] Verify `currency` is stored correctly
- [ ] Verify `renewal_date` is saved
- [ ] Verify `line_items` data is stored
- [ ] Verify `unique_token` is generated

### Client Verification

- [ ] Open `/p/{token}` in browser
- [ ] Verify 12-page quotation structure renders:
  - Cover page
  - Executive summary
  - Scope & deliverables
  - Technical solution
  - Commercials/pricing table
  - SLA & terms
  - Sign-off section
- [ ] Verify pricing table shows line items correctly
- [ ] Verify currency symbol displays correctly
- [ ] Verify mobile responsive layout

### Acceptance Flow

- [ ] Click **Accept & Sign Proposal**
- [ ] Enter signer name and designation
- [ ] Choose signature mode (type/draw)
- [ ] Agree to terms
- [ ] Submit acceptance
- [ ] Verify status changed to `accepted`
- [ ] Verify confetti celebration triggers
- [ ] Verify acceptance recorded in `proposal_views`

---

## Phase 3 — Tracking & Engagement

**Goal:** Ensure all client interactions are tracked accurately.

### View Tracking

- [ ] Open `/p/{token}` multiple times from different devices
- [ ] Verify each open creates a new `proposal_views` entry
- [ ] Verify `view_count` increments correctly
- [ ] Verify `first_opened_at` is set on first open
- [ ] Verify `last_opened_at` updates on subsequent opens
- [ ] Verify `ip_address` and `user_agent` are captured

### PDF Download Tracking

- [ ] Open `/p/{token}` and click Download PDF
- [ ] Verify download event is recorded
- [ ] Verify PDF file is generated in `generated_pdfs/` directory
- [ ] Verify PDF contains correct proposal data

### Analytics Verification

- [ ] Open analytics modal from admin panel
- [ ] Verify total views count is correct
- [ ] Verify unique devices count is correct
- [ ] Verify event timeline shows all opens/downloads
- [ ] Verify timestamps are accurate

### WhatsApp Sharing

- [ ] Click WhatsApp share button in admin panel
- [ ] Verify message template includes correct:
  - Client name
  - Proposal number
  - Private link
  - Amount/currency
- [ ] Verify WhatsApp opens with pre-filled message
- [ ] Verify link works when opened by client

---

## Phase 4 — Renewal Management

**Goal:** Validate renewal workflow creates new proposals without breaking history.

### Renewal Creation

- [ ] Navigate to `/admin/renewals`
- [ ] Find a quotation with `status = accepted`
- [ ] Click **Renew** button
- [ ] Verify new proposal is created with:
  - New `proposal_no`
  - New `unique_token`
  - Same client/company info
  - Same line items/pricing
- [ ] Verify original proposal status changes to `renewal_due`
- [ ] Verify new proposal status is `sent`

### New Link Verification

- [ ] Copy new proposal's private link
- [ ] Open `/p/{token}` in browser
- [ ] Verify new proposal renders correctly
- [ ] Verify it's a separate record from original

### Historical Preservation

- [ ] Verify original proposal data is unchanged
- [ ] Verify original proposal is still accessible
- [ ] Verify both proposals exist in database
- [ ] Verify `proposal_views` are separate for each

---

## Phase 5 — Hardening & Testing

**Goal:** Make the system reliable and secure.

### Backend Testing

- [ ] Write pytest tests for `/api/auth/login`
- [ ] Write pytest tests for `/api/auth/register`
- [ ] Write pytest tests for `/api/proposals` CRUD
- [ ] Write pytest tests for `/api/public/proposals/{token}`
- [ ] Write pytest tests for `/api/proposals/{id}/renew`
- [ ] Write pytest tests for `/api/proposals/{id}/analytics`
- [ ] Achieve 80%+ code coverage

### Frontend Testing

- [ ] Test login flow with invalid credentials
- [ ] Test login flow with valid credentials
- [ ] Test proposal creation with missing fields
- [ ] Test proposal listing with filters
- [ ] Test public viewer with invalid token
- [ ] Test acceptance flow end-to-end

### Security Review

- [ ] Change default JWT `SECRET_KEY` in production
- [ ] Restrict CORS origins to actual domains
- [ ] Add rate limiting on `/api/auth/login`
- [ ] Add input validation on all endpoints
- [ ] Sanitize user inputs to prevent XSS
- [ ] Ensure no sensitive data exposed in API responses
- [ ] Add HTTPS enforcement for production

### Error Handling

- [ ] Add user-friendly error messages
- [ ] Add loading skeletons for all data fetches
- [ ] Add retry logic for failed API calls
- [ ] Add offline detection and user notification
- [ ] Add proper error boundaries in React

---

## Phase 6 — Production Readiness

**Goal:** Prepare for deployment.

### Database

- [ ] Set up Alembic migrations
- [ ] Create migration for initial schema
- [ ] Test rollback/upgrade scenarios
- [ ] Add database backup automation
- [ ] Add database connection pooling

### Environment & Config

- [ ] Create `.env.example` with all required vars
- [ ] Add environment validation on startup
- [ ] Separate dev/staging/production configs
- [ ] Add secret management solution

### Docker & Deployment

- [ ] Create `Dockerfile` for backend
- [ ] Create `Dockerfile` for frontend
- [ ] Create `docker-compose.yml` with:
  - PostgreSQL
  - Backend
  - Frontend
  - Nginx reverse proxy
- [ ] Test full stack in Docker
- [ ] Add health check endpoints

### Documentation

- [ ] Update `README.md` with setup instructions
- [ ] Document API endpoints in `markdown/api-structure.md`
- [ ] Document database schema in `markdown/database-schema.md`
- [ ] Create deployment guide
- [ ] Create user manual for admins

### Monitoring & Maintenance

- [ ] Add application logging
- [ ] Add error tracking (Sentry/Rollbar)
- [ ] Add performance monitoring
- [ ] Set up automated backups
- [ ] Create runbook for common issues

---

## Hard Rules Reminder

1. Every proposal must have a unique private token (`/p/{token}`)
2. Client access is token-based only
3. Every client opening must be tracked in `proposal_views`
4. Every PDF download must be trackable
5. Proposal status must follow: `sent` → `viewed` → `accepted` / `renewal_due` → `renewed`
6. Renewals must create new proposal version/link
7. PDF generation stays in backend
8. Pricing must be structured line items
9. Client pages must be responsive
10. Never expose sensitive DB data to clients
