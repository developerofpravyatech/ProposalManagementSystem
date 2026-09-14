# PRAVYA TECH - Quick Phase Reference Guide

## 📊 All 10 Phases at a Glance

### Phase 1: Project Setup & Database Design ✅ (Detailed)
**Duration:** 1 week | **Developer:** 1  
**What Gets Built:**
- Backend folder structure with FastAPI boilerplate
- Frontend React + Vite setup
- PostgreSQL database with 7 tables (Proposals, LineItems, Views, Acceptances, Users, AuditLogs, Declines)
- Alembic migrations configured
- Environment setup (.env, Docker Compose)
- Git repository initialized

**Key Files:**
```
backend/app/models/proposal.py      → Proposal model with status enum
backend/app/core/config.py          → Settings configuration
backend/app/main.py                 → FastAPI app initialization
frontend/vite.config.js             → Vite proxy to backend API
docker-compose.yml                  → Local dev environment
```

**Deliverable:** Running `http://localhost:8000` (backend) + `http://localhost:5173` (frontend)

---

### Phase 2: Backend Core APIs ✅ (Detailed)
**Duration:** 2 weeks | **Developer:** 1  
**What Gets Built:**
- JWT authentication (register, login, refresh)
- Password hashing with bcrypt
- Proposal CRUD operations
- List proposals with pagination & filters
- View tracking service
- Audit logging service
- Comprehensive unit tests

**Key Endpoints:**
```
POST   /api/auth/register           → User registration
POST   /api/auth/login              → User login
POST   /api/auth/refresh            → Refresh access token
GET    /api/users/me                → Get current user
POST   /api/proposals               → Create proposal
GET    /api/proposals               → List proposals (paginated)
GET    /api/proposals/{id}          → Get proposal details
PUT    /api/proposals/{id}          → Update proposal
DELETE /api/proposals/{id}          → Delete proposal
```

**Test Coverage:**
- Authentication tests
- Proposal CRUD tests
- Validation tests
- Error handling tests

**Deliverable:** All endpoints working with JWT auth, auto-generated API docs at `/docs`

---

### Phase 3: Frontend Admin Dashboard (Details Below)
**Duration:** 2 weeks | **Developer:** 1  
**What Gets Built:**
- Admin login page with JWT token storage
- Dashboard home with key metrics (cards, charts)
- Proposals list page with TanStack Table, filters, sorting, pagination
- Create proposal wizard (5-step form)
- Proposal details page with view tracking
- Renewals dashboard with overdue/due soon views
- Settings page
- Responsive Tailwind CSS styling

**Key Pages:**
```
/login                   → Login form
/dashboard              → Home with metrics
/proposals              → List view
/proposals/create       → Creation wizard
/proposals/:id          → Details view
/renewals              → Renewal management
/analytics             → Charts (Phase 9)
/settings              → Admin settings
```

**Key Components:**
- `AuthContext` → Manage login state
- `ProposalForm` → Multi-step creation
- `ProposalTable` → TanStack Table with sorting/filtering
- `MetricsCard` → Dashboard stat cards
- `Sidebar` → Navigation

**Deliverable:** Fully functional admin dashboard with CRUD operations

---

### Phase 4: PDF Generation & Storage (Details Below)
**Duration:** 2 weeks | **Developer:** 1  
**What Gets Built:**
- ReportLab PDF generator for 9-page company profile
- ReportLab PDF generator for 12-page project proposal
- PDF storage in `/data/pdfs`
- Database updates with PDF path
- PDF download endpoint
- Frontend "Generate PDF" button

**PDF Structure:**
```
COMPANY PROFILE (9 pages):
├─ Page 1: Cover page
├─ Page 2: CEO cover letter
├─ Page 3: Mission, Vision, Values
├─ Page 4: Services
├─ Page 5: Work process
├─ Page 6: BNI Client showcases
├─ Page 7: International client showcases
├─ Page 8: Terms & Conditions
└─ Page 9: Back cover with contact

PROJECT PROPOSAL (12 pages):
├─ Pages 1-2: Project cover & intro
├─ Pages 3-8: Company profile (same as above)
├─ Page 9: Project rate estimation (pricing table)
├─ Page 10: Payment methods & bank details
├─ Page 11: Quote acceptance form
└─ Page 12: Back cover with QR code
```

**Backend Endpoints:**
```
POST   /api/proposals/{id}/generate-pdf    → Generate PDF
GET    /api/proposals/{token}/download     → Download PDF
```

**Deliverable:** Professional PDFs generated on demand, stored securely

---

### Phase 5: Client Viewer & Proposal Tracking (Details Below)
**Duration:** 1.5 weeks | **Developer:** 1  
**What Gets Built:**
- Public `/p/{token}` page (no auth required)
- PDF viewer with PDF.js library
- Automatic tracking (view count, timestamps, device info)
- Quote acceptance form
- Download tracking
- WhatsApp contact button
- Responsive mobile design

**Public Page Features:**
```
/p/{unique_token}
├─ PDF Viewer (with zoom, page nav, download, print)
├─ Proposal Info (client, company, date, amount)
├─ Action Buttons:
│  ├─ Accept Quote → Acceptance form
│  ├─ Contact via WhatsApp
│  └─ Download PDF
├─ Automatic Tracking (silent, no user action needed)
└─ Mobile optimized
```

**Acceptance Flow:**
```
Client clicks "Accept Quote"
    ↓
Form appears with fields:
- Full Name (required)
- Email (required)
- Phone (required)
- Company (required)
- Job Title (optional)
- Terms checkbox
    ↓
Client clicks "Accept & Confirm"
    ↓
Proposal status: VIEWED → ACCEPTED
Email sent to admin & client
Success message displayed
```

**Tracking (Automatic, Silent):**
- View timestamp (first_opened_at, last_opened_at)
- View count incremented
- Device/browser/OS captured
- IP address logged
- Download events tracked
- Status auto-updated (SENT → VIEWED)

**Deliverable:** Fully functional public proposal viewer with engagement tracking

---

### Phase 6: WhatsApp Integration (Details Below)
**Duration:** 1 week | **Developer:** 0.5  
**What Gets Built:**
- WhatsApp link generation with pre-filled message
- One-click sharing from admin dashboard
- Share event tracking
- Copy-to-clipboard functionality
- QR code generation for mobile sharing

**Features:**
```
Admin clicks [Share via WhatsApp]
    ↓
System generates message:
"Hi Mohammad Sharif,

Please find the PRAVYA TECH company profile and proposal here:
https://pravyatech.com/p/pv7x8k2m4n9q

You can:
✅ View and download the proposal
✅ Accept the quotation
✅ Contact us directly

Let me know if you have any questions!

Best regards,
PRAVYA TECH Team"
    ↓
Opens WhatsApp Web/App with message ready
    ↓
Admin clicks Send
    ↓
System logs share event
```

**Backend Endpoints:**
```
POST   /api/proposals/{id}/share-whatsapp    → Generate WA link
POST   /api/proposals/{id}/log-share         → Log share event
```

**Frontend:**
```
<button onClick={shareWhatsApp}>
  💬 Share via WhatsApp
</button>
```

**Deliverable:** Seamless WhatsApp sharing with tracking

---

### Phase 7: Quote Acceptance & Status Management (Details Below)
**Duration:** 1 week | **Developer:** 1  
**What Gets Built:**
- Proposal status enum (sent, viewed, accepted, renewal_due, renewed, declined, expired)
- Status transition logic & validation
- Auto-status updates on view & acceptance
- Manual status override (admin)
- Decline reason recording
- Audit trail for all status changes
- Status-based UI visibility (hide/show buttons based on status)

**Status Lifecycle:**
```
┌────────────────────────────────────────────┐
│ SENT                                       │
│ (Proposal created & shared)               │
└───────────┬────────────────────────────────┘
            │ (Auto: Client opens link)
            ↓
┌────────────────────────────────────────────┐
│ VIEWED                                     │
│ (Client viewed at least once)             │
└───────────┬────────────────────────────────┘
            │ (Client accepts OR declines)
            ├→ [ACCEPTED] (Client clicked Accept)
            │   └→ (30 days before renewal)
            │   └→ [RENEWAL_DUE]
            │       └→ (Admin creates renewal)
            │       └→ [RENEWED]
            │
            └→ [DECLINED] (Client declined)
```

**Admin Actions:**
- View all status changes in audit log
- Manually change status (with reason)
- See timestamp of each change
- Record decline reasons

**Deliverable:** Complete proposal lifecycle management with audit trail

---

### Phase 8: Renewal Management System (Details Below)
**Duration:** 1.5 weeks | **Developer:** 1  
**What Gets Built:**
- Renewal eligibility detection (30 days before expiry)
- Renewal dashboard showing:
  - Overdue renewals (red)
  - Renewals due in 30 days (yellow)
  - Days remaining counter
- One-click renewal creation:
  - Original proposal duplicated
  - New unique token generated
  - Renewal date updated (+1 year)
  - Original marked as "renewed"
  - New proposal created as "sent"
- Automated renewal reminders (email)
- Renewal analytics (renewal rate, revenue)
- Proposal lineage tracking (original → renewal → renewal)

**Renewal Dashboard:**
```
⚠️ OVERDUE RENEWALS (3)
├─ Company A - 45 days overdue [Create Renewal]
├─ Company B - 22 days overdue [Create Renewal]
└─ Company C - 15 days overdue [Create Renewal]

⏰ RENEWALS DUE IN 30 DAYS (7)
🔴 URGENT (3)
├─ Company D - 3 days [Create Renewal]
├─ Company E - 5 days [Create Renewal]
└─ Company F - 6 days [Create Renewal]

🟡 PENDING (4)
├─ Company G - 12 days [Create Renewal]
├─ Company H - 18 days [Create Renewal]
├─ Company I - 22 days [Create Renewal]
└─ Company J - 28 days [Create Renewal]
```

**Renewal Process (One-Click):**
```
Admin clicks [Create Renewal] for PRV-2025-089
        ↓
System in < 5 seconds:
1. Fetches original proposal
2. Duplicates all data
3. Generates new token (pv2x9k3m5...)
4. Updates renewal_date (+1 year)
5. Creates new proposal (PRV-2026-090)
6. Links new to old
        ↓
Result:
- New proposal created & ready to share
- Original marked as "renewed"
- Original still accessible for reference
- Admin can share new link immediately
```

**Automated Reminders:**
```
30 days before renewal:
"Subject: Contract Renewal Reminder - PRV-2025-089
Client: ABC Company
Renewal Date: 22 Sep, 2026
[Create Renewal Button]"

7 days before renewal:
"Subject: ⚠️ URGENT: Contract Renewal in 7 Days"

On renewal date:
"Subject: 🔴 OVERDUE: Contract Renewal Required"
```

**Deliverable:** Automated renewal workflow with zero missed contracts

---

### Phase 9: Analytics & Reporting (Details Below)
**Duration:** 1.5 weeks | **Developer:** 1  
**What Gets Built:**
- Analytics dashboard with key metrics
- Charts (Recharts):
  - Proposals by status (pie)
  - Proposals over time (line)
  - Engagement metrics (bar)
  - Revenue by type (area)
- Proposal-level analytics (per proposal engagement)
- Monthly PDF report generation
- Excel export of proposals
- Email digest notifications
- Audit log viewer
- Custom date range reports

**Analytics Dashboard:**
```
📊 KEY METRICS
Total: 247  Viewed: 186 (75%)  Accepted: 142 (57%)  Renewals: 89 (36%)

💰 REVENUE
Total: ₹2.45 Cr  Accepted: ₹1.82 Cr  Renewals: ₹1.15 Cr

⏱️ ENGAGEMENT
Avg Days to View: 2.3  Avg Views: 3.5x  Download Rate: 68%

📈 CHARTS
[Monthly Trend] [Status Distribution] [Revenue by Month]

📋 FILTERS
Date Range  Status  Type  Client  Search
```

**Per-Proposal Analytics:**
```
Proposal: PRV-2026-001
- View timeline (all view events)
- Download events
- Engagement score
- Acceptance path
- Device breakdown
- Time to acceptance
```

**Reports:**
```
Monthly Report (PDF):
- Summary metrics
- Status distribution
- Revenue analysis
- Top clients
- Renewal status

Excel Export:
- All proposals
- All line items
- All views
- Filterable & sortable
```

**Email Digest (Daily 9 AM):**
```
Subject: 📊 Daily Summary - 15 Sep, 2026

New Proposals: 5
Proposals Viewed: 8
Quotes Accepted: 2
Renewals Created: 1
```

**Deliverable:** Complete business intelligence & reporting system

---

### Phase 10: Testing, Optimization & Deployment (Details Below)
**Duration:** 2 weeks | **Developer:** 1-2  
**What Gets Built:**
- Unit tests (backend + frontend)
- Integration tests
- E2E tests (critical flows)
- Performance optimization
- Security audit & hardening
- Docker containerization
- Nginx reverse proxy setup
- SSL/HTTPS configuration
- Database backup strategy
- Monitoring & logging
- Deployment to production

**Testing:**
```
Backend Tests:
- Auth tests (register, login, refresh)
- Proposal CRUD tests
- PDF generation tests
- View tracking tests
- Acceptance tests
- Renewal tests

Frontend Tests:
- Component tests (React)
- Routing tests
- API integration tests
- Form validation tests

E2E Tests:
- Complete flow: Create → Share → View → Accept → Renew
- Error scenarios
- Edge cases
```

**Performance Optimization:**
```
Backend:
- Database indexing (status, email, renewal_date, token)
- Query optimization (select only needed columns)
- Connection pooling
- Caching for company profile
- Async operations throughout

Frontend:
- Code splitting (lazy load routes)
- Image optimization
- CSS minification
- Tree shaking
- Bundle size < 200KB
```

**Security Hardening:**
```
✅ SQL Injection Prevention (SQLAlchemy ORM)
✅ XSS Prevention (React escaping)
✅ CSRF Protection (SameSite cookies)
✅ Rate Limiting (auth endpoints)
✅ Password Policy (strong requirements)
✅ JWT Expiration (30 min access, 7 day refresh)
✅ HTTPS Only (SSL/TLS)
✅ CORS Proper Configuration
✅ Sensitive Data Not Logged
✅ Input Validation (Pydantic)
```

**Docker & Deployment:**
```
Docker Setup:
- Backend: Python 3.11 + FastAPI
- Frontend: Node 20 + Vite
- PostgreSQL 15
- Elasticsearch 8

Docker Compose (local):
- All services with networking
- Health checks
- Volume persistence
- Environment variables

Production Deployment:
- Nginx reverse proxy
- SSL certificate (Let's Encrypt)
- Docker swarm or K8s (optional)
- Backup strategy (pg_dump daily)
- Monitoring (health checks, logs)
```

**Monitoring & Logging:**
```
Logging:
- Application logs → /logs/app.log
- Rotation (10MB, 10 files)
- Structured logging (JSON)
- Log levels: DEBUG, INFO, WARNING, ERROR

Monitoring:
- Health check endpoint
- Database connection pool
- API response times
- Error rate tracking
- PDF storage usage
```

**Deliverable:** Production-ready, secure, scalable system deployed to production

---

## 🎯 IMPLEMENTATION CHECKLIST

### Before Starting
- [ ] All dependencies installed (requirements.txt + package.json)
- [ ] PostgreSQL running & database created
- [ ] Elasticsearch running (or skip for Phase 1-7)
- [ ] ZeptoMail API key obtained
- [ ] Google Stitch design reviewed
- [ ] Team aligned on architecture

### Phase 1
- [ ] Backend folder structure created
- [ ] Database models defined (7 tables)
- [ ] Frontend React project initialized
- [ ] Environment configuration set up
- [ ] Docker Compose ready
- [ ] Database migrations working
- [ ] Git repository initialized

### Phase 2
- [ ] JWT authentication working
- [ ] User registration & login endpoints
- [ ] Proposal CRUD endpoints
- [ ] List with pagination & filters
- [ ] Tests written and passing
- [ ] API documentation generated

### Phase 3
- [ ] Login page
- [ ] Dashboard with metrics
- [ ] Proposals list table
- [ ] Create proposal wizard (5 steps)
- [ ] Proposal details page
- [ ] Tailwind CSS styling complete
- [ ] Responsive on mobile/tablet/desktop

### Phase 4
- [ ] PDF generation for company profile (9 pages)
- [ ] PDF generation for project proposal (12 pages)
- [ ] PDF storage configured
- [ ] PDF download endpoint working
- [ ] Frontend "Generate PDF" button
- [ ] PDFs look professional

### Phase 5
- [ ] Public `/p/{token}` page created
- [ ] PDF viewer with zoom/navigation
- [ ] Automatic view tracking working
- [ ] Acceptance form working
- [ ] Quote accepted → Status updated
- [ ] Email sent on acceptance
- [ ] Mobile responsive

### Phase 6
- [ ] WhatsApp link generation
- [ ] One-click sharing from dashboard
- [ ] Share events logged
- [ ] QR code generation
- [ ] Copy to clipboard button

### Phase 7
- [ ] Status enum with all 7 statuses
- [ ] Auto-status updates on view & acceptance
- [ ] Manual status override for admin
- [ ] Status-based UI visibility
- [ ] Audit log for all changes
- [ ] Decline reason recording

### Phase 8
- [ ] Renewal dashboard created
- [ ] Overdue/Due soon views working
- [ ] One-click renewal creation
- [ ] Renewal date auto-updated (+1 year)
- [ ] Email reminders set up
- [ ] Proposal lineage tracking
- [ ] Renewal analytics

### Phase 9
- [ ] Analytics dashboard with metrics
- [ ] Charts created (Recharts)
- [ ] Per-proposal analytics
- [ ] PDF report generation
- [ ] Excel export
- [ ] Email digest working
- [ ] Audit log viewer

### Phase 10
- [ ] All tests passing (unit + integration)
- [ ] Performance benchmarks met
- [ ] Security audit completed
- [ ] Docker images built
- [ ] Nginx configured
- [ ] SSL/HTTPS enabled
- [ ] Database backups tested
- [ ] Deployed to production
- [ ] Monitoring set up

---

## ⏱️ TOTAL TIMELINE SUMMARY

| Phase | Name | Duration | Dev | Cumulative |
|-------|------|----------|-----|------------|
| 1 | Setup & Database | 1 week | 1 | 1 week |
| 2 | Backend APIs | 2 weeks | 1 | 3 weeks |
| 3 | Frontend Dashboard | 2 weeks | 1 | 5 weeks |
| 4 | PDF Generation | 2 weeks | 1 | 7 weeks |
| 5 | Client Viewer | 1.5 weeks | 1 | 8.5 weeks |
| 6 | WhatsApp | 1 week | 0.5 | 9.5 weeks |
| 7 | Status Management | 1 week | 1 | 10.5 weeks |
| 8 | Renewals | 1.5 weeks | 1 | 12 weeks |
| 9 | Analytics | 1.5 weeks | 1 | 13.5 weeks |
| 10 | Testing & Deploy | 2 weeks | 1-2 | 15.5 weeks |

**Total:** 15.5 - 16.5 weeks (4 months)  
**Team:** 2-3 developers (1 backend, 1 frontend, optional QA)

---

## 🚀 QUICK START COMMAND

```bash
# Backend
cd backend
source venv/bin/activate
python -m uvicorn app.main:app --reload

# Frontend (new terminal)
cd frontend
npm run dev

# Or with Docker
docker-compose up -d
```

Backend: `http://localhost:8000`  
Frontend: `http://localhost:5173`  
API Docs: `http://localhost:8000/docs`

---

## 📝 NEXT STEPS

1. **Start Phase 1** → Follow detailed guide in main document
2. **Complete database setup** → Run migrations
3. **Set up local environment** → Docker Compose or manual
4. **Start Phase 2** → Backend authentication & APIs
5. **Request detailed guides** for specific phases as needed

---

**Document Version:** 1.0  
**Last Updated:** September 2026  
**Status:** Ready to Start Implementation

Need detailed guide for specific phase? Just ask! 🚀
