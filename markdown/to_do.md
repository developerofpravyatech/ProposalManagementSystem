# Development To-Do & Progress Tracker — PRAVYA TECH PMS

## Phase 0 — Foundation (Completed)
- [x] Project structure + development environment
- [x] FastAPI backend foundation
- [x] PostgreSQL + SQLAlchemy setup
- [x] Database models + migrations
- [x] Admin authentication API
- [x] Proposal CRUD APIs
- [x] Public token-based client endpoints
- [x] PDF generation service
- [x] React + TypeScript frontend
- [x] Admin Dashboard UI
- [x] Client Proposal Portal UI (`/p/{token}`)
- [x] CORS + frontend-backend integration
- [x] Admin login end-to-end

---

## Phase 1 — Mode A: Company Profile (Current Focus)
**Goal:** Validate the fixed company profile flow end-to-end.

- [ ] Create Company Profile from admin panel
- [ ] Verify proposal is saved in `proposals` table with `type = profile_only`
- [ ] Copy private link (`/p/{token}`)
- [ ] Open private link in browser and verify profile renders
- [ ] Verify view is recorded in `proposal_views`
- [ ] Verify PDF download works
- [ ] Verify status transitions: `sent` → `viewed`

---

## Phase 2 — Mode B: Project Proposal + Quotation
**Goal:** Validate the dynamic quotation workflow with structured pricing.

- [ ] Create Project Proposal with line items
- [ ] Verify currency, contract duration, renewal date
- [ ] Verify proposal saved with `type = quotation_proposal`
- [ ] Open private link and verify quotation viewer
- [ ] Verify pricing table renders correctly
- [ ] Test acceptance/sign-off flow
- [ ] Verify status transitions: `sent` → `viewed` → `accepted`

---

## Phase 3 — Tracking & Engagement
**Goal:** Ensure all client interactions are tracked.

- [ ] Verify every page open records a `proposal_views` entry
- [ ] Verify `first_opened_at` and `last_opened_at` update correctly
- [ ] Verify `view_count` increments on each open
- [ ] Verify PDF download tracking works
- [ ] Verify WhatsApp sharing generates correct private link
- [ ] Test analytics modal shows correct events

---

## Phase 4 — Renewal Management
**Goal:** Validate renewal workflow creates new proposals without breaking history.

- [ ] Create renewal from an existing quotation
- [ ] Verify new proposal is created with new `unique_token`
- [ ] Verify original proposal status changes to `renewal_due`
- [ ] Verify new proposal status is `sent`
- [ ] Open new private link and verify it works
- [ ] Verify historical proposal data is preserved

---

## Phase 5 — Hardening & Testing
**Goal:** Make the system reliable and secure.

- [ ] Backend automated tests (`pytest`)
- [ ] Frontend integration tests
- [ ] Security review: JWT secret strength, CORS restrictions, input validation
- [ ] Add rate limiting on auth endpoints
- [ ] Add request logging/audit trail
- [ ] Error handling and user-friendly error messages
- [ ] Loading states and skeleton screens

---

## Phase 6 — Production Readiness
**Goal:** Prepare for deployment.

- [ ] Add Alembic migrations
- [ ] Add `.env.example` files
- [ ] Docker + docker-compose setup
- [ ] Production CORS config
- [ ] Database backup strategy
- [ ] Health check endpoints
- [ ] Deployment documentation

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
