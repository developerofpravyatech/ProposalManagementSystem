# PRAVYA TECH Proposal Management System - Product Requirements Document (PRD)

**Source Reference:** [PRAVYA_TECH_Proposal_System_Phase_Wise.md](../md_files/PRAVYA_TECH_Proposal_System_Phase_Wise.md)

---

## 🎯 Project Vision

Build a complete Proposal Management System for PRAVYA TECH that enables:
1. **Admin Dashboard** - Create, manage, and track proposals (company profiles & project quotations)
2. **Client Viewer** - Public `/p/{token}` page for clients to view/download proposals
3. **PDF Generation** - Professional 9-page company profile and 12-page project proposal PDFs
3. **Tracking & Analytics** - View tracking, engagement metrics, and renewal management

---

## 📋 Current Status (from Phase-Wise Roadmap)

| Phase | Status | Completion |
|-------|--------|------------|
| Phase 1: Project Setup & Database Design | ✅ DONE | 100% |
| Phase 2: Backend API Development | ✅ DONE | 100% |
| Phase 3: Admin Dashboard Frontend | ✅ DONE | 95% |
| Phase 4: PDF Generation System | ✅ DONE | 90% |
| Phase 5: Client Viewer & Proposal Tracking | 🔄 IN PROGRESS | 60% |
| Phase 6: Email & Notifications | ⏳ PENDING | 0% |
| Phase 7: Advanced Features | ⏳ PENDING | 0% |
| Phase 8: Testing & QA | ⏳ PENDING | 0% |


---

## 🚀 NEXT STEPS - Immediate Priorities

### 1. Complete Phase 5: Client Viewer & Proposal Tracking (Week 1-2)

#### 1.1 Public Client-Facing Page `/p/{token}`
- [ ] Build React page at `frontend/src/pages/PublicProposalPage.tsx`
- [ ] Route: `/p/:token` (no auth required)
- [ ] Validate token against backend API
- [ ] Display proposal details (client info, project info, status)
- [ ] Embed PDF viewer (react-pdf or iframe)
- [ ] Download PDF button
- [ ] "Accept Proposal" button (updates status to `accepted`)
- [ ] Track view event on page load (POST to `/api/proposals/{id}/track-view`)

#### 1.2 Tracking Event Endpoints (Backend)
- [ ] `POST /api/proposals/{token}/track-view` - Record view event with IP, user agent
- [ ] `POST /api/proposals/{token}/track-download` - Record download event
- [ ] `POST /api/proposals/{token}/accept` - Update status to `accepted`, set `accepted_at`

#### 1.3 Engagement Analytics
- [ ] First opened timestamp
- [ ] Last opened timestamp  
- [ ] View count increment
- [ ] Unique IP tracking
- [ ] Device/Browser detection from user agent

### 2. Phase 6: Email & Notifications (Week 2-3)

#### 2.1 Email Service Setup
- [ ] Configure SMTP (SendGrid, Mailgun, or AWS SES)
- [ ] Create email templates:
  - Proposal sent notification (to client)
  - Proposal viewed notification (to admin)
  - Proposal accepted notification (to admin)
  - Renewal reminder (30 days, 7 days, 1 day before)
  - Renewal overdue notification

#### 2.2 Notification Triggers
- [ ] On PDF generation → send to client email
- [ ] On first view → notify admin
- [ ] On acceptance → notify admin + client confirmation
- [ ] Daily cron job for renewal reminders

### 3. Phase 7: Advanced Features (Week 3-4)

#### 3.1 WhatsApp Integration
- [ ] Complete `POST /api/proposals/{id}/share-whatsapp` endpoint
- [ ] Generate WhatsApp Web URL with pre-filled message
- [ ] Add WhatsApp share button in admin proposal details

#### 3.2 Proposal Templates
- [ ] Create `proposal_templates` table
- [ ] Admin UI to save/load templates
- [ ] Pre-fill common sections (services, terms, etc.)

#### 3.3 Audit Logs
- [ ] Create `audit_logs` table
- [ ] Log all CRUD operations on proposals, clients, line items
- [ ] Admin audit log viewer page

#### 3.4 Multi-Admin Roles
- [ ] Roles: Admin, Manager, Viewer
- [ ] Role-based access control (RBAC)
- [ ] Permission middleware

### 4. Phase 8: Testing & QA (Week 4-5)

#### 4.1 Backend Testing
- [ ] Unit tests for services (pytest)
- [ ] Integration tests for API endpoints
- [ ] PDF generation test cases
- [ ] Authentication/authorization tests

#### 4.2 Frontend Testing
- [ ] Component tests (React Testing Library)
- [ ] E2E tests (Playwright/Cypress)
- [ ] Critical user flows: create proposal → generate PDF → client views → accepts

#### 4.3 Performance Testing
- [ ] Load test PDF generation
- [ ] Database query optimization
- [ ] API response time benchmarks

### 5. Phase 9: Deployment & DevOps (Week 5-6)

#### 5.1 Production Deployment
- [ ] Dockerize backend and frontend
- [ ] Docker Compose for local/production
- [ ] Nginx reverse proxy configuration
- [ ] SSL/TLS certificates (Let's Encrypt)
- [ ] Environment-specific configs

#### 5.2 CI/CD Pipeline
- [ ] GitHub Actions / GitLab CI
- [ ] Automated testing on PR
- [ ] Staging deployment
- [ ] Production deployment with rollback

#### 5.3 Monitoring & Logging
- [ ] Application logging (structured JSON)
- [ ] Error tracking (Sentry)
- [ ] Uptime monitoring
- [ ] Database backup strategy

### 6. Phase 10: Documentation & Handover (Week 6)

#### 6.1 Documentation
- [ ] API documentation (OpenAPI/Swagger)
- [ ] Admin user guide
- [ ] Developer setup guide
- [ ] Database schema documentation
- [ ] Deployment runbook

#### 6.2 Handover
- [ ] Code walkthrough session
- [ ] Credentials and access transfer
- [ ] Support escalation contacts

---

## 🎯 SUCCESS CRITERIA

| Metric | Target |
|--------|--------|
| PDF Generation Time | < 3 seconds |
| API Response Time (p95) | < 200ms |
| Client Page Load Time | < 2 seconds |
| Uptime | 99.9% |
| Test Coverage | > 80% |
| Zero Critical Bugs | At launch |

---

## 🔗 TECHNICAL ARCHITECTURE SUMMARY

### Backend (FastAPI)
- **Framework:** FastAPI + Uvicorn
- **Database:** PostgreSQL 15+ with SQLAlchemy 2.0 (async)
- **Auth:** JWT (HS256), 24-hour expiry
- **PDF:** ReportLab
- **Migrations:** Alembic

### Frontend (React + Vite)
- **Framework:** React 18 + Vite
- **Styling:** Tailwind CSS
- **State:** TanStack Query + React Hook Form
- **Tables:** TanStack Table
- **Charts:** Recharts
- **Routing:** React Router v6
- **HTTP:** Axios with interceptors

### Database Schema (Core Tables)
```
proposals          - Main proposal records
proposal_views     - Tracking events (view/download)
line_items         - Quotation pricing details
admin_users        - Admin authentication
company_profile_content - Static PDF content
proposal_templates - Reusable templates (future)
audit_logs         - Activity tracking (future)
```

---

## 📝 DEVELOPMENT WORKFLOW

1. **Branch Strategy:** `main` → `develop` → `feature/*` → `release/*` → `hotfix/*`
2. **Commit Convention:** Conventional Commits (feat, fix, docs, refactor, test, chore)
3. **PR Process:** Require review + passing CI checks
4. **Release Tags:** `v1.0.0`, `v1.1.0`, etc.

---

## ⚠️ RISKS & MITIGATIONS

| Risk | Impact | Mitigation |
|------|--------|------------|
| PDF generation complexity | High | Modular page builders, thorough testing |
| Client viewer token security | High | Rate limiting, token validation, expiry |
| Email deliverability | Medium | Use reputable provider, SPF/DKIM |
| Database performance | Medium | Proper indexing, query optimization |
| Scope creep | Medium | Strict phase gates, change requests |

---

## 📅 ESTIMATED TIMELINE TO MVP

| Phase | Duration | Cumulative |
|-------|----------|------------|
| Phase 5 (Complete) | 1-2 weeks | 7-8 weeks |
| Phase 6 (Email) | 1-2 weeks | 8-10 weeks |
| Phase 7 (Advanced) | 1-2 weeks | 9-12 weeks |
| Phase 8 (Testing) | 1-2 weeks | 10-14 weeks |
| Phase 9 (Deploy) | 1 week | 11-15 weeks |
| Phase 10 (Docs) | 1 week | 12-16 weeks |

**Target MVP Launch:** 12-16 weeks from project start

---

## 🚨 CRITICAL BUGS TO FIX (Blockers)

### 1. Frontend Changes Not Persisting to Database
**Issue:** When making changes from the frontend (Company Settings, Proposal Editor, etc.), the data is not being saved to the database.

**Root Cause Investigation Needed:**
- [ ] Check API service calls (`frontend/src/api/*.ts`) - verify correct endpoints and payload structure
- [ ] Check backend API routes - verify they accept the request format and commit transactions
- [ ] Check database models - verify columns match the data being sent
- [ ] Check authentication - verify JWT token is being sent with requests
- [ ] Check CORS - verify frontend origin is allowed
- [ ] Check request/response logging - add debug logging to trace the flow

**Affected Areas:**
- Company Profile settings (CompanySettingsPage.tsx)
- Proposal creation/editing (CreateProposalPage, ProposalEditPage)
- Line items management
- Theme/configuration settings

### 2. Company Profile PDF Design Mismatch
**Issue:** Generated 9-page company profile PDF does not match the expected design.

**Reference Design:** `docs/PRV-Q1810-01.html` (converted from the target PDF)

**Requirements:**
- [ ] **Exact visual match** to PRV-Q1810-01.html - every page, layout, typography, colors
- [ ] **Page-by-page parity:**
  - Page 1: Cover page with PRAVYA TECH logo, "Company Profile" title, contact info
  - Page 2: Cover letter with founder signature, 8 key selling points
  - Page 3: Mission, Vision & 4 Core Values (Customers First, Integrity, Great Teamwork, Focus on Solutions)
  - Page 4: 16 Services in 4 categories (Design, Development, Marketing, Analytics) - 2 column layout
  - Page 5: 5-step Work Process with diagram
  - Page 6: Top BNI Clients showcase (logo grid)
  - Page 7: International Clients showcase (logo grid)
  - Page 8: Terms & Conditions / SOW (Payment terms, Timeline, Scope, AMC, Cancellation, Support, Confidentiality)
  - Page 9: Back cover with 3 branch offices (Rajkot, Gondal, California) + social links
- [ ] **Typography:** Match exact fonts, sizes, weights, letter-spacing from reference
- [ ] **Colors:** Match exact brand colors (red accent #EF2923/#FC1D23, dark text #231F20)
- [ ] **Layout:** Exact margins, spacing, alignment, page breaks
- [ ] **Images/Logos:** Embed client logos, company logo, signature image

**Technical Approach:**
- Use the HTML reference as visual specification
- Consider using `weasyprint` or `playwright` for HTML-to-PDF conversion instead of ReportLab for pixel-perfect results
- Or enhance ReportLab implementation with precise measurements from the HTML
- Store static content in database/config for easy updates

---

## 🎯 IMMEDIATE ACTION ITEMS (This Week)

1. **Fix Data Persistence Bug** - Debug and fix frontend→backend→database save flow
2. **Fix Company Profile PDF** - Match PRV-Q1810-01.html design exactly (9 pages)
3. **Complete Public Proposal Page** - `/p/{token}` frontend + backend tracking
4. **Add Accept Proposal Flow** - Client acceptance updates status, notifies admin
5. **Test End-to-End** - Create proposal → Generate PDF → Client views → Accepts

---

*This PRD is derived from the phase-wise roadmap in `PRAVYA_TECH_Proposal_System_Phase_Wise.md`. Update this document as phases are completed.*