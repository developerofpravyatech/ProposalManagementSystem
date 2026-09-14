# PRAVYA TECH - Phase-Wise Development Plan
## Instructions & Development Guidelines (No Code Snippets)

**Total Duration:** 16-20 weeks  
**Team Size:** 2-3 developers (1 backend, 1 frontend, optional QA)

---

## 📋 TABLE OF CONTENTS

1. [Overview & Phases](#overview--phases)
2. [Pre-Development Setup](#pre-development-setup)
3. [Phase 1: Project Setup](#phase-1-project-setup)
4. [Phase 2: Backend Core APIs](#phase-2-backend-core-apis)
5. [Phase 3: Frontend Dashboard](#phase-3-frontend-dashboard)
6. [Phase 4: PDF Generation](#phase-4-pdf-generation)
7. [Phase 5: Client Viewer & Tracking](#phase-5-client-viewer--tracking)
8. [Phase 6: WhatsApp Integration](#phase-6-whatsapp-integration)
9. [Phase 7: Quote Acceptance & Status](#phase-7-quote-acceptance--status)
10. [Phase 8: Renewal Management](#phase-8-renewal-management)
11. [Phase 9: Analytics & Reporting](#phase-9-analytics--reporting)
12. [Phase 10: Testing & Deployment](#phase-10-testing--deployment)
13. [Cross-Cutting Concerns](#cross-cutting-concerns)

---

## 📊 OVERVIEW & PHASES

### Phase Timeline

```
Week  1  → Phase 1: Setup
Week  2-3 → Phase 2: Backend APIs
Week  4-5 → Phase 3: Frontend Dashboard (parallel with Phase 2)
Week  6-7 → Phase 4: PDF Generation
Week  8   → Phase 5: Client Viewer (early, needs Phase 4 PDFs)
Week  9   → Phase 6: WhatsApp (quick, low dependency)
Week 10   → Phase 7: Status Management
Week 11-12 → Phase 8: Renewals
Week 12-13 → Phase 9: Analytics
Week 14-15 → Phase 10: Testing & Optimization
Week 16   → Deployment & Launch
```

### Parallel Work Opportunities

- **Phase 2 & 3 can run in parallel** once backend structure is ready
- **Phase 4 & 5 overlap** (PDF generation needed before client viewer)
- **Phase 6 is independent** and can start as soon as Phase 2 endpoints exist
- **Phase 9 can start earlier** if using sample data

### Critical Dependencies

```
Phase 1 ← Phase 2 ← Phase 3
                  ← Phase 4
                  ← Phase 5 (needs Phase 4)
                  ← Phase 6 (needs Phase 2)
                  ← Phase 7 (needs Phase 2)
                  ← Phase 8 (needs Phase 2, 7)
                  ← Phase 9 (needs Phase 2)
Phase 10 (needs all phases complete)
```

---

## 🔧 PRE-DEVELOPMENT SETUP

### Environment Preparation

**Before writing any code, ensure:**

1. **Version Control**
   - Initialize Git repository
   - Set up `.gitignore` (Python, Node, IDE-specific)
   - Create `develop` and `staging` branches
   - Define commit message convention

2. **Development Environment**
   - Python 3.11+ installed
   - Node.js 20+ installed
   - PostgreSQL 15+ installed & running
   - Docker & Docker Compose installed
   - Code editor configured (VSCode recommended)

3. **Local Configuration**
   - Create `.env.example` in backend & frontend
   - Document required environment variables
   - Set up local database with default credentials
   - Configure IDE with proper linting (pylint, eslint)

4. **Team Communication**
   - Establish communication channels (Slack, Discord)
   - Set up daily standup schedule
   - Define PR review process
   - Create project tracking (GitHub Projects, Jira)

5. **Documentation**
   - Create `docs/` folder structure
   - Set up API documentation process
   - Plan database schema documentation
   - Define naming conventions for all code

### Dependencies Management

**Backend:**
- Pin exact versions in `requirements.txt` (no `>=`)
- Document why each dependency is used
- Keep dependencies minimal (security & maintenance)
- Review dependencies monthly for updates

**Frontend:**
- Lock versions in `package-lock.json`
- Document npm scripts for common tasks
- Keep `node_modules` out of git
- Regular security audits with `npm audit`

### Testing Framework Setup

**Backend (pytest):**
- Create `tests/conftest.py` with common fixtures
- Set up test database (separate from dev)
- Configure pytest with coverage reporting
- Define minimum coverage threshold (70%)

**Frontend (Vitest/React Testing Library):**
- Set up component testing framework
- Create test utilities and helpers
- Define testing best practices
- Plan E2E testing (Playwright or Cypress)

---

## ✅ PHASE 1: PROJECT SETUP

**Duration:** 1 week | **Team:** 1 backend + 1 frontend  
**Deliverables:** Working dev environment, database ready, empty project structure

### Backend Setup Tasks

#### 1.1 Initialize Project Structure
- Create `backend/` directory with exact structure from `project_detail.md`
- Create all subdirectories (even if empty)
- Add `__init__.py` files in all packages
- Create placeholder files in each module folder

**Things to Care About:**
- Ensure folder hierarchy matches module names exactly
- Consistency across naming (snake_case for files)
- All modules have same internal structure (router.py, services.py, schemas.py, models.py)
- No files outside expected locations

#### 1.2 Create Core Infrastructure
- Set up `app/core/` modules:
  - `config.py` → Settings from environment, validation
  - `database.py` → Connection pool, session factory
  - `security.py` → JWT utilities, password hashing stubs
  - `permissions.py` → RBAC infrastructure (placeholder)
  - `email.py` → ZeptoMail SMTP setup (stub)
  - `dependencies.py` → FastAPI dependency injection

**Things to Care About:**
- Configuration should NOT have hardcoded values
- Database connection should support async
- Session factory properly closed on app shutdown
- Security utilities available to all modules
- Dependencies injectable without circular imports

#### 1.3 Initialize Database Models
- Create base model class with common fields (id, created_at, updated_at)
- Define all 7 models (Proposal, LineItem, ProposalView, etc.)
- Add proper relationships & foreign keys
- Set up indexes on frequently-queried fields

**Things to Care About:**
- Use Enum for status/type fields (not strings)
- UUID fields for external identifiers
- Timestamps with UTC timezone
- Soft deletes NOT needed initially
- Relationships properly defined (ForeignKey, cascade)
- Database constraints match business rules

#### 1.4 Set Up Alembic Migrations
- Initialize Alembic with async template
- Create first migration from models
- Test migration up & down
- Document migration process

**Things to Care About:**
- Keep migrations small & reversible
- Never edit migration files after applied
- Test rollback functionality
- Database should be clean after migration
- Version control migrations (part of git)

#### 1.5 Create FastAPI App Entry Point
- Initialize FastAPI app in `app/main.py`
- Set up middleware (CORS, security headers, gzip)
- Add lifespan context (startup/shutdown)
- Include health check endpoint

**Things to Care About:**
- CORS should NOT allow all origins (only frontend URL)
- Security headers: X-Content-Type-Options, X-Frame-Options, etc.
- Middleware order matters (security first)
- Graceful shutdown (close DB connections)
- Health check doesn't require authentication

#### 1.6 Configure Development Server
- Set up `alembic.ini` for async database
- Create `requirements.txt` with all dependencies pinned
- Document Python version requirement (3.11+)
- Add development scripts (migrations, seed data)

**Things to Care About:**
- Requirements must include dev dependencies (pytest, etc.)
- Document setup instructions in README
- Create `.env.example` with all variables
- Test requirements.txt installs cleanly

### Frontend Setup Tasks

#### 1.7 Initialize React + Vite Project
- Create `frontend/` directory with exact structure
- Initialize Vite with React template
- Install all dependencies from plan (TanStack Query, Axios, etc.)
- Set up folder structure (components, pages, hooks, etc.)

**Things to Care About:**
- Folder structure must match backend modules
- All folders created even if empty initially
- `index.html` properly references `main.jsx`
- Vite config has correct proxy to backend API
- Node modules in .gitignore

#### 1.8 Set Up Tailwind CSS
- Install Tailwind CSS, PostCSS, Autoprefixer
- Generate `tailwind.config.js` with proper content paths
- Create `postcss.config.js`
- Add Tailwind directives to `index.css`

**Things to Care About:**
- `content` paths must match actual component locations
- JIT mode enabled for file-based purging
- Dark mode configuration decided (class vs media)
- Color palette defined or using defaults

#### 1.9 Configure Vite Proxy
- Set up API proxy in `vite.config.js`
- Proxy `/api` requests to backend
- Proxy `/p` requests to backend (for public viewer)
- Ensure CORS headers work correctly

**Things to Care About:**
- Proxy target must match backend URL (http://localhost:8000)
- Rewrite rules correct (no double `/api/api`)
- Authentication headers passed through proxy
- Dev server hot reload configured

#### 1.10 Create App Structure & Routing
- Set up main `App.jsx` with React Router
- Create route definitions (auth, proposals, etc.)
- Create main layout component (Sidebar + Navbar)
- Add placeholder pages for each route

**Things to Care About:**
- Routes organized by module
- Auth routes protected (require login)
- Public routes identified (/login, /p/{token})
- Layout component reusable
- Route hierarchy clear

### Database Setup Tasks

#### 1.11 Initialize PostgreSQL Database
- Create database: `pravya_db`
- Create user: `pravya_user` with password
- Grant permissions to user
- Document credentials in `.env.example`

**Things to Care About:**
- User permissions minimal (should NOT be superuser)
- Database name matches config
- Password strong & stored in .env only
- Connection tested before proceeding
- Backup strategy documented

#### 1.12 Create Docker Compose
- Set up PostgreSQL service in docker-compose.yml
- Add Elasticsearch service (optional for Phase 9)
- Configure networks and volumes
- Add health checks for services

**Things to Care About:**
- Volumes persist data between restarts
- Services can communicate by hostname
- Environment variables not hardcoded
- Container names match config
- Port mappings documented

### Documentation Setup

#### 1.13 Create Documentation Framework
- Create `docs/` with all required markdown files
- Fill in `tech-stack.md` with chosen technologies
- Create `modules.md` with module descriptions
- Add `workflow.md` with user journeys

**Things to Care About:**
- Documentation kept in sync with code
- Examples provided for key concepts
- Architecture decisions documented
- Diagrams/visuals used where helpful

### Testing Setup

#### 1.14 Set Up Testing Framework
- Create `backend/tests/conftest.py` with fixtures
- Set up test database (isolated from dev)
- Create test utilities & helpers
- Configure pytest with coverage

**Things to Care About:**
- Tests use separate database
- Fixtures reusable across tests
- Database cleaned after each test
- Coverage reporting configured
- Test discovery works correctly

#### 1.15 Git Repository Setup
- Initialize git if not done
- Create `.gitignore` for Python & Node
- Create initial commit with structure
- Document git workflow in README

**Things to Care About:**
- `.gitignore` comprehensive (no accidental commits)
- Initial commit includes ALL structure
- Branch protection rules set (for main/staging)
- Commit message convention documented

### Phase 1 Verification Checklist

- [ ] Backend folder structure complete with all subdirectories
- [ ] Frontend folder structure complete with all subdirectories
- [ ] PostgreSQL database created & accessible
- [ ] Alembic migrations working (up & down)
- [ ] FastAPI app starts without errors
- [ ] React app builds without warnings
- [ ] Frontend can access backend via proxy
- [ ] Health check endpoint working
- [ ] `.env.example` created with all variables
- [ ] README with setup instructions
- [ ] Git repository initialized & initial commit
- [ ] Docker Compose services start successfully
- [ ] All team members can run project locally
- [ ] Documentation framework created

---

## 🔐 PHASE 2: BACKEND CORE APIs

**Duration:** 2 weeks | **Team:** 1 backend developer  
**Deliverables:** All API endpoints functional, JWT auth working, tests passing

### Core Infrastructure Implementation

#### 2.1 Implement Authentication System
- Implement JWT token generation & validation
- Implement password hashing with bcrypt
- Create token refresh mechanism
- Set up token expiration & refresh logic

**Things to Care About:**
- Tokens signed with SECRET_KEY from environment
- Refresh tokens longer-lived than access tokens
- Token payload includes user_id & token type
- Expiration times configurable
- Token validation happens on every protected endpoint

#### 2.2 Create Auth Module Routes
- POST `/auth/register` → User registration
- POST `/auth/login` → User login
- POST `/auth/refresh` → Token refresh
- POST `/auth/logout` → Session invalidation (optional)

**Things to Care About:**
- Email validation before registration
- Duplicate email check
- Strong password requirement
- Successful login returns both tokens
- Refresh endpoint validates refresh token

#### 2.3 Implement RBAC Framework
- Set up role-based permission checking
- Create permission decorators/dependencies
- Implement role hierarchy
- Add audit logging for sensitive operations

**Things to Care About:**
- Admin users can do everything
- Manager & Viewer have limited permissions
- Permission check happens before business logic
- Permissions logged in audit trail
- Graceful denial (return 403 not 500)

### Proposals Module

#### 2.4 Implement Proposal Service Layer
- Create proposal creation logic
- Implement proposal retrieval (single & list)
- Set up filtering & pagination
- Create proposal update logic
- Implement proposal deletion (soft delete considerations)

**Things to Care About:**
- Unique token generation (random, no collisions)
- Proposal number format: PRV-YYYY-XXX
- Renewal date calculated based on contract duration
- Status automatically set to SENT on creation
- List endpoint supports sorting & filtering

#### 2.5 Create Proposal Routes
- POST `/proposals` → Create proposal
- GET `/proposals` → List with pagination/filters
- GET `/proposals/{id}` → Get details
- PUT `/proposals/{id}` → Update proposal
- DELETE `/proposals/{id}` → Delete proposal
- POST `/proposals/{id}/generate-pdf` → Generate PDF (stub for Phase 4)

**Things to Care About:**
- All endpoints require authentication
- Creator stored in audit log
- Validation of input data
- Proper HTTP status codes (201 for create, 200 for get, 204 for delete)
- Error messages helpful (not generic)

#### 2.6 Implement Line Items Management
- Create line items for quotation type proposals
- Calculate totals automatically (quantity × unit_price)
- Support add/edit/delete line items
- Validate line item data

**Things to Care About:**
- Line items only for quotation proposals
- Total amount calculated from line items
- Line items cannot exist without proposal
- Deletion cascades properly
- Decimal precision for currency

### Tracking Module

#### 2.7 Implement View Tracking Service
- Record view events with timestamp
- Update proposal first_opened_at on first view
- Update last_opened_at on every view
- Increment view_count
- Capture device/browser/OS info

**Things to Care About:**
- Views tracked automatically (not manual)
- User agent string parsed for device info
- IP address captured
- First view auto-updates proposal status (SENT → VIEWED)
- Tracking doesn't fail if parsing fails (graceful degradation)

#### 2.8 Create Tracking Endpoints
- POST `/proposals/{id}/log-view` → Log view event
- POST `/proposals/{id}/log-download` → Log download
- GET `/proposals/{id}/events` → Get all events for proposal
- GET `/proposals/{id}/analytics` → Get engagement stats

**Things to Care About:**
- Endpoints can be called multiple times
- Idempotent operations (replaying safe)
- Rate limiting to prevent abuse
- No authentication needed for view logging (client initiates)

### Acceptance Module (Stub for Phase 7)

#### 2.9 Create Acceptance Schemas & Models
- Define AcceptanceRecord model
- Create acceptance schemas
- Set up database table
- Plan acceptance workflow

**Things to Care About:**
- Model ready but endpoints stub for now
- Schema validates email/phone format
- Audit trail for acceptance
- Only one acceptance per proposal

### Renewals Module (Stub for Phase 8)

#### 2.10 Create Renewal Detection Service
- Write query to find proposals due for renewal (30 days)
- Find overdue proposals
- Plan renewal creation logic

**Things to Care About:**
- Queries efficient (use indexes)
- Renewal date comparison timezone-aware
- Logic separate from other modules

### Testing

#### 2.11 Write Comprehensive Tests
- Auth tests (register, login, refresh, invalid credentials)
- Proposal CRUD tests (create, read, update, delete)
- Pagination & filter tests
- Permission tests (admin vs viewer)
- Error handling tests (validation, not found, unauthorized)

**Things to Care About:**
- Use test database fixtures
- Create test data factories
- Test edge cases (empty list, invalid IDs)
- Mock external services if any
- Tests independent & no test order dependency

#### 2.12 Set Up API Documentation
- Ensure all endpoints documented with docstrings
- Verify Swagger docs at `/docs` complete
- Document request/response schemas
- Include example requests/responses

**Things to Care About:**
- Docstrings follow convention (description, parameters, returns)
- Examples realistic & correct
- Authentication requirements documented
- Error responses documented
- Pagination documented

### Phase 2 Verification Checklist

- [ ] All auth endpoints working (register, login, refresh)
- [ ] JWT tokens properly generated & validated
- [ ] Password hashing implemented
- [ ] All proposal CRUD endpoints working
- [ ] Pagination & filtering working
- [ ] Line items management working
- [ ] View tracking working
- [ ] Audit logs created for important actions
- [ ] RBAC working (admin, manager, viewer)
- [ ] All endpoints return consistent response format
- [ ] Error handling comprehensive
- [ ] Tests passing (min 70% coverage)
- [ ] API docs complete at `/docs`
- [ ] No security vulnerabilities

---

## 🎨 PHASE 3: FRONTEND DASHBOARD

**Duration:** 2 weeks | **Team:** 1 frontend developer (can run parallel with Phase 2)  
**Deliverables:** Complete admin dashboard, all pages functional

### Authentication Pages

#### 3.1 Implement Login Page
- Create login form (email, password)
- Implement form validation (client-side)
- Handle login submission
- Store JWT tokens in localStorage/sessionStorage
- Redirect to dashboard on success
- Show error messages on failure

**Things to Care About:**
- Form fields clear & labeled
- Password field masked
- Submit button disabled while loading
- Error messages helpful & specific
- "Remember me" consideration
- Redirect to previous page after login (if available)

#### 3.2 Implement Protected Routes
- Create route guards/middleware
- Redirect unauthenticated users to login
- Restore auth state from tokens on app load
- Handle token expiration gracefully

**Things to Care About:**
- Auth state persisted across page refreshes
- Logout clears tokens
- Protected routes not accessible without auth
- Public route (/p/{token}) not blocked

### Dashboard Pages

#### 3.3 Create Dashboard Home
- Display key metrics cards (total, viewed, accepted, renewals)
- Show recent proposals list
- Display quick actions
- Show upcoming renewals alert
- Create charts placeholder

**Things to Care About:**
- Metrics calculated from API data
- Real-time updates when proposals change
- Loading states while fetching
- Responsive grid layout
- Empty state messaging

#### 3.4 Build Proposals List Page
- Create proposals table (TanStack Table)
- Implement columns (proposal #, client, status, views, actions)
- Add sorting by all columns
- Add filtering (status, type, date range)
- Add pagination controls
- Add action buttons (view, edit, delete)

**Things to Care About:**
- Table loading state
- Sorting indicators
- Pagination maintains filters
- Bulk actions consideration (optional Phase 1)
- Mobile responsive (horizontal scroll or stack)
- Empty state messaging

#### 3.5 Build Create Proposal Wizard
- Implement 5-step wizard:
  - Step 1: Select type (profile/quotation)
  - Step 2: Client information
  - Step 3: Project details
  - Step 4: Line items (if quotation)
  - Step 5: Review & create
- Form validation on each step
- Previous/Next navigation
- Progress indicator

**Things to Care About:**
- Form state persisted across steps
- Validation prevents moving forward
- Clear explanations for each field
- Error messages on submission
- Success redirect to details page
- Unsaved changes warning

#### 3.6 Build Proposal Details Page
- Display proposal information
- Show proposal status badge
- Show engagement metrics (views, downloads)
- Show PDF preview (placeholder for Phase 4)
- Add action buttons (edit, generate PDF, share WhatsApp, delete)
- Show acceptance status if applicable

**Things to Care About:**
- Data fetched from API
- Refresh button for latest data
- Status-based action visibility
- Edit button only if not sent
- Proper access control (own proposals only)

#### 3.7 Build Renewals Dashboard
- List overdue renewals (red)
- List renewals due in 30 days (yellow)
- Show days remaining counter
- Add "Create Renewal" button per proposal
- Show renewal status in list

**Things to Care About:**
- Separate sections for overdue/due soon
- Color coding for urgency
- One-click renewal creation
- Confirmation dialog before creating
- Success message after creation

### Layout & Navigation

#### 3.8 Create Main Layout
- Implement Sidebar with navigation items
- Implement Top Navbar with user menu
- Add logout functionality
- Add responsive mobile menu

**Things to Care About:**
- Sidebar collapsible on mobile
- Active route highlighted
- User dropdown in navbar
- Logout clears tokens
- Consistent styling across pages

### API Integration

#### 3.9 Set Up API Client & Hooks
- Create Axios instance with JWT interceptors
- Implement token refresh on 401
- Create custom hooks for proposals, renewals, etc.
- Use TanStack Query for caching

**Things to Care About:**
- JWT token attached to all requests
- Refresh token used when access token expires
- API errors handled gracefully
- Loading/error states in components
- Retry logic for failed requests

#### 3.10 Implement Error Handling
- Show toast notifications for errors
- Display error boundary for crashes
- Implement 404 page
- Implement 403 (forbidden) page
- Generic error handling

**Things to Care About:**
- User-friendly error messages
- Don't expose backend errors to users
- Error logging for debugging
- Retry option for transient errors

### Forms & Validation

#### 3.11 Implement Form Validation
- Client-side validation (real-time feedback)
- Use libraries for complex validations
- Show field-level errors
- Disable submit until valid

**Things to Care About:**
- Validation matches backend
- Error messages helpful
- Async validation for email/unique fields
- Debounce async validation

### Styling & UX

#### 3.12 Apply Tailwind CSS Styling
- Consistent color scheme
- Responsive design (mobile-first)
- Loading skeletons/spinners
- Empty states
- Proper spacing & typography

**Things to Care About:**
- Mobile responsive (test on devices)
- Accessibility (ARIA labels, keyboard nav)
- Color contrast (WCAG compliance)
- Consistent component sizing
- Print-friendly styles (optional)

### Phase 3 Verification Checklist

- [ ] Login page working
- [ ] Protected routes working
- [ ] Dashboard home displaying metrics
- [ ] Proposals list table functional
- [ ] Create proposal wizard working (all 5 steps)
- [ ] Proposal details page showing info
- [ ] Renewals dashboard displaying correctly
- [ ] Sidebar navigation working
- [ ] API integration working
- [ ] Error handling displaying properly
- [ ] Form validation working
- [ ] Mobile responsive
- [ ] No console errors
- [ ] Loading states showing

---

## 📄 PHASE 4: PDF GENERATION

**Duration:** 2 weeks | **Team:** 1 backend developer  
**Deliverables:** PDF generation working, both profile & proposal templates

### PDF Generation Service

#### 4.1 Study PDF Requirements
- Understand company profile structure (9 pages)
  - Page 1: Cover page
  - Page 2: CEO cover letter
  - Page 3-9: Various company info
- Understand project proposal structure (12 pages)
  - Pages 1-2: Project cover & intro
  - Pages 3-8: Company profile (embed)
  - Pages 9-11: Project details & pricing
  - Page 12: Back cover

**Things to Care About:**
- Page layout requirements defined
- Content placeholders identified
- Company logo & branding consistent
- Font selection consistent
- Color scheme follows company brand

#### 4.2 Set Up PDF Generation Infrastructure
- Choose PDF library (ReportLab selected)
- Set up PDF storage location (/data/pdfs/)
- Create PDF utilities module
- Set up image handling for logos

**Things to Care About:**
- PDF storage secure & accessible
- File naming convention (use unique_token)
- PDF cleanup policy (delete old drafts?)
- Storage capacity monitored
- Backup strategy for PDFs

#### 4.3 Create Company Profile PDF Template
- Implement 9-page profile generation
- Use template approach (content + layout)
- Load company info from database
- Generate dynamically based on proposal data

**Things to Care About:**
- Template modular (pages can be reused)
- Text wrapping handles long content
- Images handled properly
- Font consistency
- Quality tested (view at different zoom levels)

#### 4.4 Create Project Proposal PDF Template
- Implement 12-page proposal generation
- Embed company profile pages (DRY)
- Add project-specific pages
- Include pricing table from line items
- Add QR code linking to public viewer

**Things to Care About:**
- Pricing table properly formatted
- Line items correctly calculated
- QR code generation & embedding
- Page breaks at logical points
- Signature blocks formatted correctly

#### 4.5 Implement PDF Download Endpoint
- Create endpoint to download generated PDF
- Serve PDF with proper content-type headers
- Handle PDF not found
- Log PDF downloads

**Things to Care About:**
- Correct MIME type (application/pdf)
- Filename descriptive (PRV-2026-001.pdf)
- Content-Disposition header set
- Streaming for large files
- Access control (owner only)

### Testing & Quality

#### 4.6 Test PDF Output
- Generate sample PDFs
- Manual review for:
  - Layout correctness
  - Text formatting
  - Image quality
  - Page breaks
  - Consistency

**Things to Care About:**
- Test with various data lengths
- Test with special characters
- Test with missing optional data
- Verify on different viewers (Adobe, browser, etc.)

#### 4.7 Performance Optimization
- Profile PDF generation time
- Optimize for quick generation (target: < 2 seconds)
- Consider caching generated PDFs
- Monitor storage usage

**Things to Care About:**
- Generation should not block API
- Consider async generation for large batches
- Cache PDFs (regenerate only on changes)
- Clean up old/unused PDFs periodically

### Frontend Integration

#### 4.8 Add PDF Generation Button
- Create button to generate PDF in proposal details
- Show loading state during generation
- Handle success (show download link)
- Handle errors (show error message)
- Refresh proposal status when complete

**Things to Care About:**
- Button disabled until proposal ready
- Loading indicator while generating
- Success message with download link
- Error handling with retry option

#### 4.9 Add PDF Viewer (Frontend)
- Integrate PDF.js or similar library
- Create PDF viewer component
- Add controls (zoom, page nav, download, print)
- Make mobile responsive

**Things to Care About:**
- Responsive design for different screen sizes
- Zoom controls smooth & responsive
- Page navigation intuitive
- Download button prominent
- Print functionality working

### Phase 4 Verification Checklist

- [ ] Company profile PDF generating correctly
- [ ] Project proposal PDF generating correctly
- [ ] PDFs stored in correct location
- [ ] PDF download endpoint working
- [ ] PDF quality acceptable
- [ ] Generation time < 2 seconds
- [ ] Error handling working
- [ ] Frontend PDF viewer working
- [ ] PDF buttons integrated in UI
- [ ] No memory leaks during generation
- [ ] PDFs render on different devices
- [ ] Filename matches proposal number

---

## 👁️ PHASE 5: CLIENT VIEWER & TRACKING

**Duration:** 1.5 weeks | **Team:** 1 backend + 1 frontend  
**Deliverables:** Public proposal viewer working, tracking working

### Backend Implementation

#### 5.1 Create Public Viewer Endpoint
- Create public endpoint `/p/{token}` (no auth required)
- Validate token exists
- Load proposal & PDF path
- Return proposal info + PDF content

**Things to Care About:**
- Token validation (check exists, not expired)
- Return 404 if token invalid
- Cache response for performance
- Rate limiting to prevent abuse

#### 5.2 Implement Automatic View Tracking
- Intercept public page request
- Extract client IP & user-agent
- Create view event record
- Update proposal tracking fields (first_opened_at, last_opened_at, view_count)
- Auto-update status (SENT → VIEWED)

**Things to Care About:**
- Tracking is automatic (no client action)
- User-agent parsing for device info
- First view marked specially
- Status change logged in audit
- Tracking failure doesn't block page load

#### 5.3 Create PDF Download Tracking
- Create endpoint for download logging
- Track downloads separately from views
- Update download counter

**Things to Care About:**
- Download tracked when client clicks download
- Separate count from views
- Timestamp recorded

### Frontend Implementation

#### 5.4 Build Public Viewer Page
- Create component at `/p/{token}` route
- Display proposal info (client, company, date, amount)
- Embed PDF viewer (using PDF.js)
- Add viewer controls (zoom, page nav, download, print)
- Make fully responsive

**Things to Care About:**
- Page loads without auth
- PDF viewer responsive to screen size
- Controls intuitive & accessible
- Mobile-friendly (touch controls)
- Print layout correct

#### 5.5 Implement Silent Tracking
- Capture view event automatically
- Send to backend (no user action)
- Handle tracking failures gracefully
- Display no tracking indicators to client

**Things to Care About:**
- Tracking request sent on page load
- No user notification of tracking
- Client's action not blocked by tracking
- Retry if tracking fails

### Acceptance Workflow (Phase 7 will complete this)

#### 5.6 Create Acceptance Form Component
- Create form for quote acceptance
- Fields: name, email, phone, company, job title
- Terms checkbox
- Submit button

**Things to Care About:**
- Form validation
- Mobile responsive
- Clear submit instructions
- Success message after submission

#### 5.7 Create Acceptance Result Handling
- Handle successful acceptance
- Update proposal status
- Send confirmation email to client & admin
- Show success message

**Things to Care About:**
- Success message clear
- Email delivery confirmation
- Graceful error handling

### Phase 5 Verification Checklist

- [ ] Public viewer page accessible
- [ ] Token validation working
- [ ] PDF displays in viewer
- [ ] View tracking working
- [ ] Status updates (SENT → VIEWED)
- [ ] First opened time captured
- [ ] Device info captured
- [ ] Download tracking working
- [ ] Viewer responsive on mobile
- [ ] PDF controls working
- [ ] No auth required for public page
- [ ] Tracking doesn't break page load
- [ ] Acceptance form displays
- [ ] Success page after acceptance

---

## 💬 PHASE 6: WHATSAPP INTEGRATION

**Duration:** 1 week | **Team:** 1 backend + 1 frontend  
**Deliverables:** WhatsApp sharing functional

### Backend Implementation

#### 6.1 Create WhatsApp Link Generation
- Generate WhatsApp share URL
- Pre-fill message with proposal link
- Format message professionally
- Include client name, company, etc.

**Things to Care About:**
- URL encoding for message
- Message length within limits
- Special characters handled
- Link clickable in message

#### 6.2 Create Share Endpoint
- POST `/proposals/{id}/share-whatsapp` endpoint
- Generate WhatsApp URL
- Log share event
- Return message preview

**Things to Care About:**
- Share event logged
- Message customizable (optional)
- Phone number optional validation
- Response includes shareable URL

### Frontend Implementation

#### 6.3 Add WhatsApp Share Button
- Create share button in proposals list
- Create share button in proposal details
- Show message preview
- Open WhatsApp on click

**Things to Care About:**
- Button clearly labeled
- Works on desktop & mobile
- Opens WhatsApp Web/App appropriately
- Message copied to clipboard option
- Share confirmation

#### 6.4 Implement Share Tracking
- Log when share button clicked
- Optional: Track if link actually opened

**Things to Care About:**
- Share event sent to backend
- No blocking of UI for share logging

### Phase 6 Verification Checklist

- [ ] WhatsApp link generation working
- [ ] Message preview accurate
- [ ] Share button in UI
- [ ] WhatsApp opens correctly
- [ ] Share events logged
- [ ] Phone number formatting correct
- [ ] Works on mobile & desktop

---

## ✅ PHASE 7: QUOTE ACCEPTANCE & STATUS

**Duration:** 1 week | **Team:** 1 backend + 1 frontend  
**Deliverables:** Acceptance workflow complete, status management working

### Backend Implementation

#### 7.1 Implement Acceptance Recording
- Create endpoint to accept quote
- Validate proposal status
- Record acceptance details (name, email, company, etc.)
- Update proposal status (→ ACCEPTED)
- Log in audit trail

**Things to Care About:**
- Only once per proposal
- Cannot accept if declined
- Client details stored
- Email validation
- Status transition logged

#### 7.2 Implement Decline Recording
- Create endpoint to decline quote
- Record decline reason
- Update proposal status (→ DECLINED)
- Log in audit trail

**Things to Care About:**
- Cannot re-accept after decline
- Reason captured but optional
- Permanent (cannot undo)

#### 7.3 Implement Status Management
- Create service for status transitions
- Define valid transitions (SENT → VIEWED → ACCEPTED)
- Prevent invalid transitions
- Log all transitions
- Auto-transitions (view → status VIEWED)

**Things to Care About:**
- Status enum used everywhere
- Transitions immutable
- Admin can manually override with logging
- Transitions cannot go backwards (except renew)

#### 7.4 Create Acceptance Email Service
- Send confirmation email to client on acceptance
- Send notification email to admin
- Email contains next steps
- Email includes proposal details

**Things to Care About:**
- Email templates professional
- Emails sent asynchronously
- Delivery failures logged
- Email content matches proposal data

### Frontend Implementation

#### 7.5 Add Acceptance Form to Public Viewer
- Show "Accept Quote" button on public page
- Create modal/page with acceptance form
- Form validation
- Submit handling

**Things to Care About:**
- Form only shown if status allows
- Form fields match backend requirements
- Error messages clear
- Success page encouraging

#### 7.6 Add Status Indicator to Admin Pages
- Show status badge on proposal cards
- Color-code status (green=accepted, yellow=pending, red=declined)
- Show status on details page
- Show in list view

**Things to Care About:**
- Status color consistent everywhere
- Status badges clear & obvious
- Status-based action visibility

#### 7.7 Add Decline Functionality
- Option to decline (admin option)
- Optional confirmation dialog
- Decline reason input
- Status updated

**Things to Care About:**
- Clear this is permanent
- Confirmation required
- Reason captured for analysis

### Phase 7 Verification Checklist

- [ ] Acceptance endpoint working
- [ ] Status transitions working
- [ ] Decline endpoint working
- [ ] Status stored correctly
- [ ] Acceptance emails sent
- [ ] Admin notified of acceptance
- [ ] Status badges displaying
- [ ] Status-based UI visibility working
- [ ] Audit logs recording transitions
- [ ] No invalid transitions possible

---

## 🔄 PHASE 8: RENEWAL MANAGEMENT

**Duration:** 1.5 weeks | **Team:** 1 backend + 1 frontend  
**Deliverables:** Renewal workflow complete, automation working

### Backend Implementation

#### 8.1 Implement Renewal Detection Service
- Query proposals due for renewal (renewal_date within 30 days)
- Query overdue renewals
- Create service to find renewals

**Things to Care About:**
- Efficient queries with indexes
- Timezone-aware date comparison
- Renewal date clearly defined
- Edge cases handled

#### 8.2 Implement One-Click Renewal Creation
- Create endpoint to generate renewal
- Duplicate original proposal
- Generate new unique token
- Update renewal_date (+1 year)
- Create new line items copy
- Link new to original
- Mark original as "renewed"

**Things to Care About:**
- Transaction (all or nothing)
- Original proposal read-only after renewal
- New proposal ready to share immediately
- Lineage properly linked
- Renewal date calculated correctly

#### 8.3 Create Renewal Endpoints
- GET `/renewals/due` → Due for renewal in 30 days
- GET `/renewals/overdue` → Past renewal date
- POST `/renewals/{id}/create` → Create renewal
- GET `/renewals/analytics` → Renewal stats

**Things to Care About:**
- Efficient queries
- Proper pagination
- Clear response format

#### 8.4 Implement Renewal Email Reminders
- 30 days before renewal: Send reminder
- 7 days before renewal: Send urgent reminder
- On renewal date: Send overdue notice
- Use APScheduler for background jobs

**Things to Care About:**
- Scheduler configured correctly
- Emails professional & clear
- Timezones handled correctly
- No duplicate emails sent
- Job logs for debugging

#### 8.5 Create Renewal Analytics
- Calculate renewal rate (% of accepted renewed)
- Track renewal revenue
- Trend analysis

**Things to Care About:**
- Calculations correct
- Efficient queries
- Business insight extracted

### Frontend Implementation

#### 8.6 Build Renewals Dashboard
- List overdue renewals (red)
- List renewals due in 30 days (yellow)
- Sort by urgency (days remaining)
- "Create Renewal" button per proposal

**Things to Care About:**
- Color coding clear
- Days remaining counter accurate
- One-click renewal working
- Confirmation before action
- Success feedback after creation

#### 8.7 Add Renewal Notifications
- Show badge on sidebar for due renewals
- Optional: Toast notification on login if overdue
- Link to renewals dashboard

**Things to Care About:**
- Notification not annoying
- Counts accurate
- Links functional

### Phase 8 Verification Checklist

- [ ] Renewal detection queries working
- [ ] One-click renewal creation working
- [ ] New proposal has new token
- [ ] Renewal date updated (+1 year)
- [ ] Original marked as renewed
- [ ] Lineage properly linked
- [ ] Email reminders sending on schedule
- [ ] Renewals dashboard showing correctly
- [ ] Color coding obvious
- [ ] Create renewal button working
- [ ] Analytics calculating correctly
- [ ] No duplicate renewals created

---

## 📊 PHASE 9: ANALYTICS & REPORTING

**Duration:** 1.5 weeks | **Team:** 1 backend + 1 frontend  
**Deliverables:** Analytics dashboard complete, reports working

### Backend Implementation

#### 9.1 Implement Analytics Service
- Create service to calculate key metrics
- Dashboard metrics (total, viewed, accepted, renewals)
- Per-proposal engagement stats
- Monthly trends
- Revenue analysis

**Things to Care About:**
- Efficient aggregation queries
- Accurate calculations
- Timezone awareness
- Edge cases (no data, filters)

#### 9.2 Create Analytics Endpoints
- GET `/analytics/dashboard` → Key metrics
- GET `/analytics/proposals/{id}` → Per-proposal stats
- GET `/analytics/monthly` → Monthly trends
- GET `/analytics/export` → Export data

**Things to Care About:**
- Fast response times
- Pagination for large datasets
- Optional caching for heavy queries

#### 9.3 Implement Report Generation
- PDF report generation (using ReportLab)
- Excel export (using openpyxl)
- Custom date range support
- Filter support

**Things to Care About:**
- Reports include key findings
- Excel file properly formatted
- Headers & formatting professional
- Large datasets handled

#### 9.4 Create Email Digest Service
- Daily digest email with stats
- Email sent at consistent time
- Include key metrics & alerts
- Customizable content

**Things to Care About:**
- Email template professional
- Content relevant & concise
- Delivery reliable
- Unsubscribe option (optional)

### Frontend Implementation

#### 9.5 Build Analytics Dashboard
- Key metrics cards (total, viewed, accepted, renewals)
- Charts (Recharts library):
  - Proposals by status (pie)
  - Proposals over time (line)
  - Engagement metrics (bar)
  - Revenue trends (area)

**Things to Care About:**
- Charts responsive
- Tooltips informative
- Color scheme consistent
- Mobile readable

#### 9.6 Build Per-Proposal Analytics
- Proposal details show engagement stats
- View timeline
- Download events
- Engagement score calculation

**Things to Care About:**
- Data visual & clear
- Timeline intuitive
- All events shown

#### 9.7 Build Report Page
- Generate monthly report (PDF)
- Export to Excel
- Custom date range
- Filters (status, type, client)

**Things to Care About:**
- Report generation shows progress
- Download link appears
- Excel properly formatted
- Filters work correctly

### Phase 9 Verification Checklist

- [ ] Dashboard metrics calculating correctly
- [ ] Charts rendering properly
- [ ] Per-proposal analytics showing
- [ ] PDF report generation working
- [ ] Excel export working
- [ ] Email digest sending
- [ ] Date filtering working
- [ ] Charts responsive
- [ ] All data accurate
- [ ] Reports include business insights

---

## 🧪 PHASE 10: TESTING & DEPLOYMENT

**Duration:** 2 weeks | **Team:** 1-2 developers + QA  
**Deliverables:** System tested, optimized, deployed to production

### Testing

#### 10.1 Comprehensive Unit Testing
- Backend: Minimum 70% code coverage
- Frontend: Component tests for all components
- Test all utilities & services
- Test error scenarios

**Things to Care About:**
- Tests independent (no order dependency)
- Fixtures reusable
- Mock external services
- Coverage meaningful (not just lines)

#### 10.2 Integration Testing
- Auth flow (register → login → API call)
- Proposal creation → PDF generation → sharing
- View tracking integration
- Email sending integration
- Renewal creation end-to-end

**Things to Care About:**
- Use test database
- Clean up after tests
- Real API calls tested
- Error paths tested

#### 10.3 E2E Testing (Optional)
- Critical user journeys tested
- Create proposal → Share → View → Accept
- Renewal flow
- Login & navigation
- Using Playwright or Cypress

**Things to Care About:**
- Tests against staging environment
- Parallel execution possible
- Reports clear & helpful

#### 10.4 Performance Testing
- API response times (target: < 200ms)
- PDF generation time (target: < 2s)
- Page load times (target: < 3s)
- Database query times

**Things to Care About:**
- Load testing with realistic data
- Identify bottlenecks
- Optimize before deployment
- Monitor in production

#### 10.5 Security Testing
- Authentication bypasses attempted
- Authorization flaws checked
- SQL injection tested
- XSS tested
- CSRF tested
- Rate limiting verified

**Things to Care About:**
- Penetration testing considered
- Security headers verified
- HTTPS enforced
- Secrets not exposed

### Optimization

#### 10.6 Backend Optimization
- Database indexes verified
- Query efficiency reviewed
- Connection pooling configured
- Async operations verified
- Caching implemented where beneficial

**Things to Care About:**
- No N+1 queries
- Large datasets paginated
- Slow queries identified & fixed
- Connection pool sized correctly

#### 10.7 Frontend Optimization
- Code splitting by route
- Lazy loading components
- Image optimization
- CSS minification
- Bundle size < 200KB (gzipped)

**Things to Care About:**
- Web Vitals optimized
- Lighthouse score > 90
- Images compressed
- Unused code removed

#### 10.8 Database Optimization
- Backup strategy tested
- Restoration process documented
- Migration rollback tested
- Disk space monitored

**Things to Care About:**
- Backups automated
- Backups tested for restoration
- Point-in-time recovery possible

### Documentation

#### 10.9 Complete Documentation
- API documentation finalized
- Database schema documented
- Architecture diagrams created
- Deployment runbook created
- Troubleshooting guide created

**Things to Care About:**
- Docs kept in sync with code
- Examples accurate & tested
- Diagrams clear & helpful
- Runbook step-by-step

#### 10.10 Create Knowledge Transfer
- Team trained on system
- Common tasks documented
- Troubleshooting guide created
- Maintenance procedures documented

**Things to Care About:**
- Training clear & accessible
- Q&A document created
- Video walkthroughs (optional)

### Deployment Preparation

#### 10.11 Set Up Production Environment
- Production database configured
- Backups automated & tested
- Email service configured (ZeptoMail)
- Storage location configured
- SSL certificates ready (Let's Encrypt)
- Nginx configuration ready
- Environment variables configured

**Things to Care About:**
- Separate prod database
- Database credentials secure
- Backups isolated
- Monitoring configured

#### 10.12 Create Deployment Pipeline
- CI/CD configured (GitHub Actions, etc.)
- Automated tests run on push
- Automated deployment on merge to main
- Rollback procedure documented
- Canary deployment considered

**Things to Care About:**
- Zero-downtime deployment possible
- Database migrations run automatically
- Secrets managed safely
- Deployment logs stored

#### 10.13 Set Up Monitoring & Alerts
- API uptime monitoring
- Error rate monitoring
- Database connectivity monitoring
- Disk space monitoring
- Email delivery monitoring

**Things to Care About:**
- Alerts sent to team
- Alert thresholds reasonable
- On-call procedure documented
- Incident response plan

### Final Testing

#### 10.14 Staging Deployment
- Deploy to staging environment
- Run all tests
- Manual QA testing
- Performance testing
- Load testing with realistic data

**Things to Care About:**
- Staging identical to production
- Data sanitized in staging
- Test accounts available
- All features verified

#### 10.15 Go-Live Checklist
- All tests passing ✅
- Performance acceptable ✅
- Security audit passed ✅
- Documentation complete ✅
- Deployment plan ready ✅
- Team trained ✅
- Monitoring active ✅
- Rollback procedure tested ✅
- Backup verified ✅
- Support process ready ✅

### Phase 10 Verification Checklist

- [ ] All tests passing (unit, integration, E2E)
- [ ] Code coverage > 70%
- [ ] Performance benchmarks met
- [ ] Security audit passed
- [ ] No security vulnerabilities
- [ ] API response times < 200ms
- [ ] Page load times < 3s
- [ ] Production environment ready
- [ ] Monitoring configured
- [ ] Backups automated & tested
- [ ] Documentation complete
- [ ] Team trained
- [ ] Deployment pipeline working
- [ ] Staging deployment successful
- [ ] Go-live checklist complete

---

## 🔗 CROSS-CUTTING CONCERNS

### Error Handling Strategy

**Backend:**
- All endpoints return consistent format
- Validation errors return 400 with details
- Auth errors return 401
- Permission errors return 403
- Not found returns 404
- Server errors return 500 with request ID
- Error messages user-friendly (not technical)

**Frontend:**
- API errors caught & displayed
- Network errors handled gracefully
- Form validation errors displayed per-field
- Toast notifications for non-blocking errors
- Error boundaries catch React crashes
- Retry logic for transient errors

**Things to Care About:**
- Error messages helpful but not exposing internals
- User doesn't see stack traces
- Logging for debugging
- Request IDs for support reference

### Logging Strategy

**Backend:**
- All important actions logged
- Log level: DEBUG, INFO, WARNING, ERROR
- Structured logging (JSON format beneficial)
- Sensitive data NOT logged (passwords, tokens)
- Request IDs passed through logs
- Log rotation & retention

**Frontend:**
- Console errors logged
- API errors logged
- User actions logged (optional)
- Debug mode for development only
- Error tracking service (Sentry optional)

**Things to Care About:**
- Logs don't contain secrets
- Log files rotated to prevent disk fill
- Log storage & retention policy
- Log searching/analysis tools

### Testing Throughout Development

**Unit Tests:**
- Written as features implemented
- Minimum 70% coverage
- Fast execution
- Independent of other tests

**Integration Tests:**
- Test module interactions
- Use test database
- Clean up after each test

**E2E Tests:**
- Only for critical paths
- Run against staging
- Slower but comprehensive

**Things to Care About:**
- Tests catch regressions
- False positives avoided
- Test maintenance planned
- Tools chosen early

### Database Migrations

**Strategy:**
- One migration per logical change
- Migrations backwards compatible (if possible)
- Rollback tested
- Zero-downtime migrations when possible
- Schema changes versioned

**Things to Care About:**
- Migration reversibility
- No data loss
- Performance impact assessed
- Large table changes tested on test database first

### Code Quality

**Backend:**
- Type hints everywhere
- Docstrings on functions
- PEP 8 compliance
- DRY principle
- SOLID principles
- Async/await used correctly
- No globals
- No hardcoded values

**Frontend:**
- Components small & focused
- Props well-defined
- No prop drilling
- Custom hooks extracted
- Constants in separate files
- Consistent naming

**Things to Care About:**
- Linting enforced (pre-commit hooks)
- Code review required
- Refactoring scheduled
- Technical debt tracked

### Security Throughout

**Development:**
- Environment variables for secrets
- No secrets in git history
- Dependencies scanned for vulnerabilities
- Security headers configured
- CORS properly set
- Rate limiting where needed
- Input validation everywhere
- SQL injection prevention (ORM)
- XSS prevention (React)

**Things to Care About:**
- Security not afterthought
- Regular security audits
- Vulnerability response plan
- Dependencies kept updated

### Performance Considerations

**Throughout Development:**
- Monitor query times (target: < 100ms)
- Profile code regularly
- Optimize before premature optimization
- Caching strategy thought out
- Database indexing done correctly
- Frontend bundle size monitored
- Images optimized
- API response times tracked

**Things to Care About:**
- Identify bottlenecks early
- Don't over-optimize
- Performance metrics tracked
- Regressions caught quickly

---

## 📋 FINAL REMINDERS

### Daily Development Practices

1. **Start with tests** (TDD mindset)
2. **Small, focused commits** (revertible)
3. **Code review** (minimum 1 reviewer)
4. **Document as you go** (not after)
5. **Run full test suite** before pushing
6. **Keep modules decoupled** (no circular imports)
7. **Follow established patterns** (consistency)
8. **Ask before implementing** (clarify requirements)
9. **Refactor frequently** (not just at end)
10. **Share knowledge** (pair programming, docs)

### Meeting Cadence

- **Daily standup** (15 min) → Status, blockers
- **Weekly planning** (1 hour) → Tasks for week
- **Weekly demo** (30 min) → Show progress
- **Bi-weekly retro** (30 min) → What went well, what to improve

### Risk Management

- **Identify risks early** (technical, timeline, scope)
- **Mitigate proactively** (don't wait for problems)
- **Have contingency plans** (what if X fails?)
- **Track dependencies** (prevent bottlenecks)
- **Over-communicate** (better too much than too little)

### Go-Live Readiness

- **Backups tested** (actually restore from them)
- **Monitoring active** (before going live)
- **Team trained** (not just technical)
- **Support process ready** (who handles issues?)
- **Rollback plan** (if things go wrong)
- **Communication plan** (notify stakeholders)
- **Post-launch review** (what we learned)

---

**Status:** Ready to Start Development  
**Last Updated:** September 2026  
**Version:** 1.0
