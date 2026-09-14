# PRAVYA TECH Proposal Management System
## Phase-Wise Development Roadmap

**Project Timeline:** 10 Phases | **Est. Duration:** 12-16 weeks  
**Tech Stack:** FastAPI (Python), React + Vite, PostgreSQL 15+, JWT Auth, ReportLab/openpyxl

---

## 📋 Executive Summary

This document breaks down the Proposal Management System into actionable phases, clearly marking:
- ✅ **CRITICAL** → Must-have features, core business logic
- ⚠️ **IMPORTANT** → High-priority, business-dependent features
- 💡 **OPTIONAL** → Nice-to-have, enhancement features
- 🔧 **TECH** → Technical implementation details

---

---

## ✅ PHASE 1: Project Setup & Database Design
**Duration:** 1 week | **Status:** Foundation  
**Objective:** Establish project infrastructure, database schema, and code structure

### 📌 What to Do

#### A. Backend Setup
- Initialize FastAPI project with Uvicorn ASGI server
- Configure async database connection with PostgreSQL 15+
- Set up SQLAlchemy 2.0 with async support (asyncpg)
- Configure Alembic for database migrations
- Set up environment variables (.env, .env.example)
- Create project folder structure:
  ```
  backend/
  ├── app/
  │   ├── core/          (config, security, jwt)
  │   ├── models/        (SQLAlchemy models)
  │   ├── schemas/       (Pydantic models)
  │   ├── api/           (route handlers)
  │   ├── services/      (business logic)
  │   ├── utils/         (helpers, pdf generation)
  │   └── db/            (database setup)
  ├── migrations/        (Alembic)
  ├── tests/
  ├── main.py
  └── requirements.txt
  ```

#### B. Frontend Setup
- Initialize React 18 + Vite project
- Configure Tailwind CSS
- Set up React Router v6
- Configure Axios for HTTP client
- Set up project structure:
  ```
  frontend/
  ├── src/
  │   ├── components/    (reusable UI components)
  │   ├── pages/         (page-level components)
  │   ├── hooks/         (custom React hooks)
  │   ├── services/      (API calls)
  │   ├── store/         (state management)
  │   ├── styles/        (global styles)
  │   └── utils/         (helpers)
  ├── public/
  └── vite.config.js
  ```

#### C. Database Schema Design

**✅ CRITICAL — Create 2 Core Tables:**

##### Table 1: `proposals`
```sql
CREATE TABLE proposals (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  type ENUM('profile_only', 'quotation_proposal') NOT NULL,
  proposal_no VARCHAR(50) UNIQUE,
  
  -- Client Information
  client_name VARCHAR(100) NOT NULL,
  company_name VARCHAR(150),
  phone VARCHAR(20),
  email VARCHAR(100) NOT NULL,
  
  -- Project Information (if quotation)
  project_title VARCHAR(200),
  project_subtitle TEXT,
  amount DECIMAL(12,2),
  currency VARCHAR(10) DEFAULT 'INR',
  contract_duration VARCHAR(50),
  
  -- System Information
  pdf_path VARCHAR(255),
  unique_token VARCHAR(50) UNIQUE NOT NULL,
  sent_at DATETIME,
  renewal_date DATE,
  status ENUM('sent', 'viewed', 'accepted', 'renewal_due', 'renewed') DEFAULT 'sent',
  
  -- Tracking
  first_opened_at DATETIME,
  last_opened_at DATETIME,
  view_count INT DEFAULT 0,
  
  -- Metadata
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  
  INDEX idx_unique_token (unique_token),
  INDEX idx_status (status),
  INDEX idx_renewal_date (renewal_date),
  INDEX idx_email (email)
);
```

##### Table 2: `proposal_views`
```sql
CREATE TABLE proposal_views (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  proposal_id BIGINT NOT NULL,
  viewed_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  ip_address VARCHAR(45),
  user_agent VARCHAR(500),
  event_type ENUM('view', 'download') DEFAULT 'view',
  
  FOREIGN KEY (proposal_id) REFERENCES proposals(id) ON DELETE CASCADE,
  INDEX idx_proposal_id (proposal_id),
  INDEX idx_viewed_at (viewed_at)
);
```

##### ⚠️ IMPORTANT — Additional Tables (Phase 2):
- `admin_users` → Admin authentication
- `line_items` → Proposal pricing details
- `proposal_templates` → Reusable templates
- `audit_logs` → Activity tracking

#### D. Core Authentication Setup
- Implement JWT token generation with `python-jose`
- Configure password hashing with `bcrypt` (passlib)
- Create authentication middleware
- Set up CORS for frontend access

#### E. Version Control & Documentation
- Initialize Git repository with `.gitignore`
- Create `README.md` with setup instructions
- Create `API_DOCUMENTATION.md` (draft)
- Set up GitHub/GitLab repository

### ✅ CRITICAL Components

- [x] PostgreSQL database with 2 core tables
- [x] SQLAlchemy ORM models matching tables
- [x] Pydantic v2 validation schemas
- [x] JWT authentication middleware
- [x] Async database connection pool
- [x] Alembic migration setup
- [x] Basic FastAPI application structure
- [x] React 18 + Vite + Tailwind setup
- [x] Project folder structures
- [x] Environment configuration

### ⚠️ IMPORTANT Components

- Database indexing for query optimization
- Connection pooling configuration
- Error handling middleware
- CORS configuration
- Request logging setup

### 💡 OPTIONAL Components

- Database backup strategy documentation
- Initial load testing configuration
- Docker setup (can be done later)
- CI/CD pipeline basics

### 🔧 Tech Implementation Details

```python
# backend/app/core/config.py
from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    DATABASE_URL: str = "postgresql+asyncpg://user:pass@localhost/pravya"
    SECRET_KEY: str = "your-secret-key"
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30
    
    class Config:
        env_file = ".env"

settings = Settings()

# backend/app/db/models.py
from sqlalchemy import Column, String, Integer, DateTime, Enum
from sqlalchemy.ext.declarative import declarative_base

Base = declarative_base()

class Proposal(Base):
    __tablename__ = "proposals"
    
    id = Column(Integer, primary_key=True)
    type = Column(Enum('profile_only', 'quotation_proposal'))
    # ... other columns
```

### 📊 Dependencies & Prerequisites

- Python 3.11+, Node.js 20+
- PostgreSQL 15+ installed and running
- Git configured
- Virtual environment (Python)
- npm/yarn package manager

### ⏱️ Estimated Timeline: 5-7 days

---

---

## ✅ PHASE 2: Backend API Development (Core Business Logic)
**Duration:** 2.5 weeks | **Status:** Backend Foundation  
**Objective:** Build all REST API endpoints for admin operations

### 📌 What to Do

#### A. Admin Authentication Endpoints

**✅ CRITICAL:**
- `POST /api/auth/register` → Create admin account
- `POST /api/auth/login` → Admin login, return JWT token
- `POST /api/auth/refresh` → Refresh JWT token
- `POST /api/auth/logout` → Admin logout
- `GET /api/auth/me` → Get current admin profile

#### B. Client Management Endpoints

**✅ CRITICAL:**
- `POST /api/clients` → Create new client
- `GET /api/clients` → List all clients (with pagination)
- `GET /api/clients/{client_id}` → Get single client
- `PUT /api/clients/{client_id}` → Update client
- `DELETE /api/clients/{client_id}` → Delete client

#### C. Proposal Management Endpoints

**✅ CRITICAL:**
- `POST /api/proposals` → Create proposal (company profile or quotation)
  - Auto-generate unique token
  - Auto-generate proposal number (PRV-2026-001)
  - Create database record
  - Return unique token
  
- `GET /api/proposals` → List proposals with filters
  - Filter by type, status, date range, client
  - Pagination support
  - Sort by creation date, renewal date, status
  
- `GET /api/proposals/{proposal_id}` → Get proposal details
  
- `PUT /api/proposals/{proposal_id}` → Update proposal (before PDF generation)
  
- `DELETE /api/proposals/{proposal_id}` → Soft delete proposal

**⚠️ IMPORTANT:**
- `GET /api/proposals/{proposal_id}/history` → View proposal version history
- `GET /api/proposals/status/{status}` → Filter by status

#### D. Line Items Management (Quotation Pricing)

**✅ CRITICAL:**
- `POST /api/proposals/{proposal_id}/line-items` → Add pricing line item
- `GET /api/proposals/{proposal_id}/line-items` → Get all line items
- `PUT /api/line-items/{line_item_id}` → Update line item
- `DELETE /api/line-items/{line_item_id}` → Delete line item
- Auto-calculate total from line items

```python
# Line Item Structure
class LineItem(Base):
    __tablename__ = "line_items"
    
    id = Column(Integer, primary_key=True)
    proposal_id = Column(Integer, ForeignKey("proposals.id"))
    description = Column(String(255))
    quantity = Column(Float)
    unit_price = Column(Decimal(12,2))
    total = Column(Decimal(12,2))  # Computed: quantity * unit_price
```

#### E. PDF Generation Endpoint

**✅ CRITICAL:**
- `POST /api/proposals/{proposal_id}/generate-pdf` → Generate PDF
  - Use ReportLab for PDF creation
  - Create company profile (9 pages) or project proposal (12 pages)
  - Store PDF path in database
  - Return PDF file
  - Update proposal status to `sent` after generation

**Workflow:**
1. Fetch proposal and related data from DB
2. Generate PDF using ReportLab template
3. Save PDF to `/pdfs/{unique_token}.pdf`
4. Store path in `proposals.pdf_path`
5. Return PDF to download

#### F. Tracking & Analytics Endpoints

**✅ CRITICAL:**
- `GET /api/proposals/{proposal_id}/views` → Get all view events
- `GET /api/proposals/{proposal_id}/downloads` → Get all download events
- `GET /api/proposals/{proposal_id}/analytics` → Get engagement summary
  - First opened, last opened, view count
  - Download count
  - Client status (not opened, viewed, accepted)

#### G. Renewal Management Endpoints

**✅ CRITICAL:**
- `GET /api/proposals/renewal/due` → List proposals with renewal_date within 30 days
- `GET /api/proposals/renewal/overdue` → List overdue renewals
- `POST /api/proposals/{proposal_id}/renew` → Create renewal proposal
  - Duplicate original proposal
  - Update renewal_date (add 1 year)
  - Create new unique token
  - Keep original proposal as reference
  - Set status to `renewed`

#### H. WhatsApp Integration Endpoint

**⚠️ IMPORTANT:**
- `POST /api/proposals/{proposal_id}/share-whatsapp` → Generate WhatsApp share link
  - Create message template
  - Return WhatsApp Web URL with encoded message
  - Format: `https://wa.me/91XXXXXXXXXX?text=Hi%20...%20https://pravyatech.com/p/{token}`

### ✅ CRITICAL Components

- Authentication middleware (JWT)
- Client CRUD operations
- Proposal CRUD operations
- Unique token generation (16-20 chars)
- Proposal number auto-generation (PRV-YYYY-001)
- Line items management
- PDF generation service (ReportLab)
- View tracking service
- Basic renewal management
- Input validation (Pydantic)

### ⚠️ IMPORTANT Components

- Database query optimization
- Error handling (custom exceptions)
- Request logging/audit trails
- Pagination (limit, offset)
- Advanced filtering and sorting
- Soft delete implementation
- Transaction management for critical operations
- Email notifications (future)

### 💡 OPTIONAL Components

- Bulk operations (bulk delete, bulk status update)
- CSV export of proposals
- Advanced search with Elasticsearch
- Multi-admin role management (admin, manager, viewer)
- Proposal templates system
- Auto-numbering format customization

### 🔧 Tech Implementation Details

```python
# backend/app/services/proposal_service.py
from app.models import Proposal, LineItem
from app.schemas import ProposalCreate
from sqlalchemy.ext.asyncio import AsyncSession
import secrets
from datetime import datetime, timedelta

class ProposalService:
    @staticmethod
    async def create_proposal(data: ProposalCreate, db: AsyncSession):
        # Generate unique token (16 chars)
        unique_token = secrets.token_urlsafe(12)
        
        # Generate proposal number
        proposal_no = await ProposalService.generate_proposal_number(db)
        
        proposal = Proposal(
            **data.dict(),
            unique_token=unique_token,
            proposal_no=proposal_no,
            status="sent"
        )
        db.add(proposal)
        await db.commit()
        await db.refresh(proposal)
        return proposal
    
    @staticmethod
    async def generate_proposal_number(db: AsyncSession) -> str:
        year = datetime.now().year
        count = await db.execute(
            f"SELECT COUNT(*) FROM proposals WHERE YEAR(created_at) = {year}"
        )
        next_num = count.scalar() + 1
        return f"PRV-{year}-{next_num:03d}"

# backend/app/utils/pdf_generator.py
from reportlab.lib.pagesizes import letter
from reportlab.lib import colors
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Table, PageBreak
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from io import BytesIO

class PDFGenerator:
    @staticmethod
    def generate_company_profile(proposal_data: dict) -> BytesIO:
        """Generate 9-page company profile PDF"""
        buffer = BytesIO()
        doc = SimpleDocTemplate(buffer, pagesize=letter)
        story = []
        
        # Page 1: Cover
        story.append(PDFGenerator._create_cover_page(proposal_data))
        story.append(PageBreak())
        
        # Page 2: Cover Letter
        story.append(PDFGenerator._create_cover_letter())
        story.append(PageBreak())
        
        # Pages 3-9: Company info, services, terms, etc.
        # ... implement remaining pages
        
        doc.build(story)
        buffer.seek(0)
        return buffer
    
    @staticmethod
    def generate_project_proposal(proposal_data: dict) -> BytesIO:
        """Generate 12-page project proposal + quotation"""
        # Similar structure with additional project-specific pages
        pass
```

### 📊 API Response Structure

```json
{
  "success": true,
  "data": {
    "id": 1,
    "proposal_no": "PRV-2026-001",
    "unique_token": "pv7x8k2m4n9q",
    "type": "quotation_proposal",
    "client_name": "Mohammad Sharif",
    "company_name": "Genie Connect",
    "project_title": "Genie - Ask, Give & Connect",
    "amount": 150000,
    "currency": "INR",
    "status": "sent",
    "created_at": "2026-09-11T10:30:00Z",
    "unique_link": "https://pravyatech.com/p/pv7x8k2m4n9q"
  },
  "message": "Proposal created successfully"
}
```

### 📊 Dependencies & Prerequisites

- ReportLab library installed
- openpyxl for Excel handling
- sqlalchemy async support
- Database populated with company profile content
- Stable FastAPI setup from Phase 1

### ⏱️ Estimated Timeline: 12-15 days

---

---

## ✅ PHASE 3: Admin Dashboard Frontend
**Duration:** 2 weeks | **Status:** Admin Interface  
**Objective:** Build complete admin dashboard for proposal management

### 📌 What to Do

#### A. Authentication Pages

**✅ CRITICAL:**
- `Login Page` → Admin login form
  - Email/Username field
  - Password field
  - Remember me checkbox
  - JWT token storage (localStorage/sessionStorage)
  - Redirect to dashboard on success
  
- `Protected Routes` → Route guards for authenticated pages
  - Redirect unauthenticated users to login

#### B. Dashboard Overview

**✅ CRITICAL:**
- `Dashboard Home Page` with:
  - Summary cards:
    - Total proposals sent
    - Proposals viewed (%) 
    - Proposals accepted
    - Pending renewals
  - Recent proposals table (last 10)
  - Quick stats charts (using Recharts)
  - Upcoming renewals widget

#### C. Proposal Management Pages

**✅ CRITICAL:**

##### 1. Proposals List Page
- Display all proposals in table format using TanStack Table
- Columns: Proposal No, Client, Type, Status, Sent Date, Views, Actions
- Filters:
  - By Type (profile, quotation)
  - By Status (sent, viewed, accepted, renewal_due, renewed)
  - By Date Range
  - By Client Name
- Pagination (10, 25, 50 per page)
- Sorting by any column
- Action buttons:
  - View Details
  - Edit (before PDF generated)
  - Generate PDF
  - Share WhatsApp
  - View Tracking
  - Delete

##### 2. Create Proposal Page
- **Step 1: Choose Type**
  - Radio buttons: "Company Profile Only" vs "Project Proposal + Quotation"
  
- **Step 2: Enter Client Information** (both types)
  - Client/Contact Name (required)
  - Company Name (required)
  - Phone/WhatsApp Number (required)
  - Email Address (required)
  
- **Step 3: Project Details** (if quotation selected)
  - Project Title (required)
  - Project Subtitle/Description (optional)
  - Contract Duration (required)
  - Renewal Period (auto-calculated as 1 year)
  
- **Step 4: Add Line Items** (if quotation)
  - Add button for new line item
  - Each line item:
    - Description
    - Quantity
    - Unit Price
    - Total (auto-calculated)
  - Remove button per line item
  - Overall total amount (auto-calculated)
  
- **Step 5: Review & Generate**
  - Preview all entered data
  - Button: "Generate PDF"
  - Button: "Save Draft"
  
**Form Validation:**
- All required fields marked
- Real-time error messages
- Phone number format validation (E.164)
- Email validation
- Numeric field validation

##### 3. Proposal Details Page
- Display all proposal information
- Show PDF preview (if generated)
- Show engagement metrics:
  - View count
  - First opened date/time
  - Last opened date/time
  - Download count
  - Status
- Actions:
  - Edit (if not sent)
  - Regenerate PDF
  - Share WhatsApp
  - View Tracking Details
  - Accept Quote (admin can simulate)
  - Delete
  - Create Renewal (if eligible)

##### 4. Proposal Engagement/Tracking Page
- Timeline view of all view events:
  - Date & Time of view
  - IP Address
  - Device/Browser info
- Download events timeline
- Map of viewer location (IP geolocation - optional)
- Summary metrics
- Export tracking data (CSV, PDF)

#### D. Client Management Pages

**⚠️ IMPORTANT:**
- `Clients List Page`
  - Table with all clients
  - Columns: Name, Company, Email, Phone, Proposals Count, Last Proposal Date
  - Add, Edit, Delete actions
  - Quick search by name/company/email
  
- `Add/Edit Client Modal`
  - Form for client info
  - Validation
  - Submit & close

#### E. Renewal Management Dashboard

**✅ CRITICAL:**
- `Renewal Dashboard` page
  - Highlight contracts due for renewal in 30 days
  - List overdue renewals
  - Table columns: Client, Company, Renewal Date, Days Remaining, Status
  - Button: "Create Renewal" (1-click)
  - Renewal process:
    - Duplicate proposal
    - Update renewal_date
    - Generate new token
    - Create new proposal record
    - Show success message with new link

#### F. Navigation & Layout

**✅ CRITICAL:**
- Sidebar navigation with sections:
  - Dashboard
  - Proposals (List, Create)
  - Clients
  - Renewals
  - Analytics
  - Settings
  - Logout
  
- Top navigation bar:
  - Admin name/avatar
  - Notifications (proposal accepted, renewal due)
  - Logout button
  
- Responsive design (mobile, tablet, desktop)
- Dark/Light mode toggle (optional)

### ✅ CRITICAL Components

- React 18 functional components with hooks
- React Router v6 for page routing
- Axios for API calls with interceptors
- Form handling with custom hooks or React Hook Form
- TanStack Query for server state management
- TanStack Table for data tables
- Recharts for charts/analytics
- Tailwind CSS for styling
- React Icons for UI icons
- Protected routes/auth guards
- Local storage for JWT tokens
- Form validation (client-side)
- Loading states and error handling
- Toast notifications (react-toastify or similar)

### ⚠️ IMPORTANT Components

- Modal/Dialog components for actions
- Confirmation dialogs for destructive actions
- Dropdown menus for bulk actions
- Date picker components (date-fns, react-datepicker)
- File upload components (for future document uploads)
- Search and filter UI
- Pagination controls
- Sort indicators
- Skeleton loaders while fetching
- Error boundary components

### 💡 OPTIONAL Components

- Dark mode theme
- Customizable dashboard widgets
- Export to CSV/Excel
- Print proposal page
- Advanced analytics charts
- Admin profile management
- Activity/Audit log viewer
- Notifications system

### 🔧 Tech Implementation Details

```jsx
// frontend/src/pages/ProposalsListPage.jsx
import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useTable } from '@tanstack/react-table';
import api from '../services/api';

export default function ProposalsListPage() {
  const [filters, setFilters] = useState({
    type: null,
    status: null,
    dateFrom: null,
    dateTo: null
  });

  const { data, isLoading, error } = useQuery({
    queryKey: ['proposals', filters],
    queryFn: () => api.get('/proposals', { params: filters })
  });

  const columns = [
    { accessorKey: 'proposal_no', header: 'Proposal #' },
    { accessorKey: 'client_name', header: 'Client' },
    { accessorKey: 'type', header: 'Type' },
    { accessorKey: 'status', header: 'Status' },
    { accessorKey: 'sent_at', header: 'Sent Date' },
    { accessorKey: 'view_count', header: 'Views' },
  ];

  const table = useTable({
    data: data?.data || [],
    columns,
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
  });

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">Proposals</h1>
      
      {/* Filters */}
      <div className="mb-6 flex gap-4">
        <select 
          value={filters.type || ''}
          onChange={(e) => setFilters({...filters, type: e.target.value})}
          className="px-4 py-2 border rounded"
        >
          <option value="">All Types</option>
          <option value="profile_only">Company Profile</option>
          <option value="quotation_proposal">Project Proposal</option>
        </select>
        
        <select 
          value={filters.status || ''}
          onChange={(e) => setFilters({...filters, status: e.target.value})}
          className="px-4 py-2 border rounded"
        >
          <option value="">All Status</option>
          <option value="sent">Sent</option>
          <option value="viewed">Viewed</option>
          <option value="accepted">Accepted</option>
        </select>
      </div>
      
      {/* Table */}
      {isLoading ? (
        <p>Loading...</p>
      ) : error ? (
        <p className="text-red-500">Error: {error.message}</p>
      ) : (
        <table className="w-full border-collapse border">
          <thead>
            {table.getHeaderGroups().map(headerGroup => (
              <tr key={headerGroup.id} className="bg-gray-100">
                {headerGroup.headers.map(header => (
                  <th key={header.id} className="border p-2 text-left">
                    {header.isPlaceholder ? null : header.renderHeader()}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody>
            {table.getRowModel().rows.map(row => (
              <tr key={row.id} className="border-b hover:bg-gray-50">
                {row.getVisibleCells().map(cell => (
                  <td key={cell.id} className="border p-2">
                    {cell.renderCell()}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

// frontend/src/pages/CreateProposalPage.jsx
import React, { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import api from '../services/api';

export default function CreateProposalPage() {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    type: null,
    client_name: '',
    company_name: '',
    phone: '',
    email: '',
    project_title: '',
    contract_duration: '1 Year',
    lineItems: []
  });

  const createMutation = useMutation({
    mutationFn: (data) => api.post('/proposals', data),
    onSuccess: (response) => {
      alert('Proposal created! Token: ' + response.data.unique_token);
      // Redirect to details page
    }
  });

  const handleAddLineItem = () => {
    setFormData({
      ...formData,
      lineItems: [...formData.lineItems, { description: '', quantity: 1, unitPrice: 0 }]
    });
  };

  const handleChangeLineItem = (index, field, value) => {
    const newItems = [...formData.lineItems];
    newItems[index][field] = value;
    setFormData({ ...formData, lineItems: newItems });
  };

  const handleSubmit = async () => {
    createMutation.mutate(formData);
  };

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Create Proposal</h1>
      
      {/* Step 1: Choose Type */}
      {step === 1 && (
        <div>
          <h2 className="text-xl font-semibold mb-4">Step 1: Select Proposal Type</h2>
          <div className="space-y-4">
            <label className="flex items-center p-4 border rounded cursor-pointer hover:bg-gray-50">
              <input
                type="radio"
                value="profile_only"
                checked={formData.type === 'profile_only'}
                onChange={(e) => setFormData({...formData, type: e.target.value})}
              />
              <span className="ml-3">Company Profile Only</span>
            </label>
            
            <label className="flex items-center p-4 border rounded cursor-pointer hover:bg-gray-50">
              <input
                type="radio"
                value="quotation_proposal"
                checked={formData.type === 'quotation_proposal'}
                onChange={(e) => setFormData({...formData, type: e.target.value})}
              />
              <span className="ml-3">Project Proposal + Quotation</span>
            </label>
          </div>
        </div>
      )}
      
      {/* Step 2: Client Information */}
      {step === 2 && (
        <div>
          <h2 className="text-xl font-semibold mb-4">Step 2: Client Information</h2>
          <input
            type="text"
            placeholder="Client Name *"
            value={formData.client_name}
            onChange={(e) => setFormData({...formData, client_name: e.target.value})}
            className="w-full mb-4 px-4 py-2 border rounded"
          />
          <input
            type="text"
            placeholder="Company Name *"
            value={formData.company_name}
            onChange={(e) => setFormData({...formData, company_name: e.target.value})}
            className="w-full mb-4 px-4 py-2 border rounded"
          />
          {/* ... more fields */}
        </div>
      )}
      
      {/* Navigation */}
      <div className="mt-6 flex gap-4">
        <button
          onClick={() => setStep(step - 1)}
          disabled={step === 1}
          className="px-6 py-2 bg-gray-500 text-white rounded disabled:opacity-50"
        >
          Back
        </button>
        <button
          onClick={() => setStep(step + 1)}
          className="px-6 py-2 bg-blue-500 text-white rounded"
        >
          Next
        </button>
      </div>
    </div>
  );
}
```

### 📊 Dependencies & Prerequisites

- All backend APIs from Phase 2 must be working
- Axios client configured with auth interceptors
- React component library setup
- Tailwind CSS configured
- API documentation for all endpoints

### ⏱️ Estimated Timeline: 10-14 days

---

---

## ✅ PHASE 4: PDF Generation System (Company Profile & Project Proposal)
**Duration:** 2 weeks | **Status:** Critical Business Logic  
**Objective:** Build robust PDF generation for 9-page profiles and 12-page proposals

### 📌 What to Do

#### A. PDF Template Structure & Content Management

**✅ CRITICAL — Define PDF Content:**

1. **Company Profile Data (Static Content)**
   - Store company info in database or config file
   - Logo, brand colors, fonts
   - Mission, Vision, Core Values
   - Services list (16 services)
   - Work process (5 steps)
   - Client showcases
   - Terms & Conditions
   - Branch office details
   - Bank details (masked)

2. **Proposal Dynamic Content (From Database)**
   - Client name, company, contact
   - Project title, description
   - Line items pricing
   - Amount, currency
   - Contract duration
   - Payment terms

#### B. Company Profile PDF Generation (9 Pages)

**✅ CRITICAL:**

**Page 1: Cover Page**
- PRAVYA TECH logo (centered)
- "Company Profile" title
- Contact info (Office Address, Phone, Email)
- Professional design with brand colors
- Client name if provided

**Page 2: Profile Cover Letter**
- Founder & CEO signature
- Letterhead format
- Introduction paragraph
- 8 key selling points:
  - Website development expertise
  - Digital presence solutions
  - Customized solutions approach
  - Performance focus
  - User experience emphasis
  - Clear communication
  - Timely delivery
  - Long-term support

**Page 3: Mission, Vision & Core Values**
- **Vision Statement**
- **Mission Statement**
- **4 Core Values:**
  1. Customers First
  2. Integrity
  3. Great Teamwork
  4. Focus on Solutions

**Page 4: Services (Detailed)**
- 16 Services organized in 2 columns:
  - Design Services (4)
  - Development Services (4)
  - Marketing Services (4)
  - Analytics Services (4)
- Icons or descriptions for each

**Page 5: Work Process**
- 5-step workflow diagram:
  1. Initial Meeting & Discussion
  2. Research, Outline, Wireframe & Design
  3. Development & Validation
  4. Implementation & Testing
  5. Deployment, Maintenance & Support

**Page 6: Top Clients Showcase (BNI)**
- Logo grid of 8-12 client logos
- Professional layout

**Page 7: International Clients Showcase**
- Logo grid of 6-8 international clients

**Page 8: Terms & Conditions / SOW**
- Payment terms
- Project timeline
- Scope limitations
- AMC (Annual Maintenance Contract) info
- Cancellation policy
- Support/Maintenance terms
- Confidentiality clause

**Page 9: Back Cover**
- Branch office details:
  - **Rajkot Office:** Address, Phone, Email
  - **Gondal Office:** Address, Phone, Email (if applicable)
  - **California Office:** Address, Phone, Email
- Social media links (optional)

#### C. Project Proposal PDF Generation (12 Pages)

**✅ CRITICAL:**

**Pages 1-2: Project Cover & Introduction**
- **Page 1:**
  - Client name
  - Company name
  - Project title (e.g., "Genie - Ask, Give & Connect")
  - Project subtitle
  - Date
  - "PROPOSAL" watermark/badge
  
- **Page 2:**
  - Proposal introduction letter
  - Customized for the project
  - PRAVYA TECH value proposition
  - Project overview

**Pages 3-8: Company Profile** (Same as profile PDF)
- Mission, Vision, Values
- Services
- Work Process
- Client Showcases
- Terms & Conditions

**Page 9: Project Rate Estimation**
- Detailed pricing table:
  | Description | Qty | Unit Price | Total |
  | Android App Development | 1 | ₹50,000 | ₹50,000 |
  | iOS App Development | 1 | ₹50,000 | ₹50,000 |
  | Web Admin Panel | 1 | ₹30,000 | ₹30,000 |
  | Technical Support (6 months) | 1 | ₹10,000 | ₹10,000 |
  | Server Setup & Hosting | 1 | ₹10,000 | ₹10,000 |
  
- **Subtotal:** ₹150,000
- **Tax (if applicable):** ₹0
- **Total Amount:** ₹150,000
- **Currency:** INR

**Page 10: Payment Methods**
- Payment instructions
- Bank details (with company name)
- UPI/QR Code (generate or embed image)
- Payment gateway options (if applicable)
- Invoice example format

**Page 11: Quote Acceptance / Sign-Off**
- Client acknowledgment checkbox
- Acceptance terms:
  - Client agrees to project scope
  - Client agrees to timeline
  - Client agrees to payment terms
  - Client agrees to terms & conditions
  - Work outside scope requires separate quotation
- Client signature block:
  - Authorized by: _______________
  - Date: _______________
  - Email: _______________

**Page 12: Back Cover**
- Branch office details (same as profile)
- QR code linking to https://pravyatech.com/p/{token}
- Contact information

#### D. PDF Generation Implementation

**✅ CRITICAL - Use ReportLab:**

```python
# backend/app/utils/pdf_generator.py
from reportlab.lib.pagesizes import letter, A4
from reportlab.lib import colors
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.units import inch, cm
from reportlab.platypus import (
    SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle,
    PageBreak, Image, Flowable
)
from reportlab.pdfgen import canvas
from datetime import datetime
from io import BytesIO

class PDFGenerator:
    PAGESIZE = A4  # or letter
    WIDTH, HEIGHT = PAGESIZE
    
    # Style constants
    BRAND_COLOR = colors.HexColor('#1F4788')  # PRAVYA TECH blue
    ACCENT_COLOR = colors.HexColor('#FF6B35')  # Orange accent
    TEXT_COLOR = colors.HexColor('#333333')
    
    @staticmethod
    def generate_company_profile(proposal_data: dict, pdf_path: str) -> bool:
        """
        Generate 9-page company profile PDF
        
        Args:
            proposal_data: Dict with client info
            pdf_path: Full path to save PDF
            
        Returns:
            True if successful, False otherwise
        """
        try:
            doc = SimpleDocTemplate(
                pdf_path,
                pagesize=PDFGenerator.PAGESIZE,
                rightMargin=20,
                leftMargin=20,
                topMargin=20,
                bottomMargin=20
            )
            
            story = []
            
            # Page 1: Cover
            story.append(PDFGenerator._create_cover_page(proposal_data))
            story.append(PageBreak())
            
            # Page 2: Cover Letter
            story.append(PDFGenerator._create_cover_letter())
            story.append(PageBreak())
            
            # Page 3: Mission, Vision, Values
            story.append(PDFGenerator._create_mission_vision_page())
            story.append(PageBreak())
            
            # Page 4: Services
            story.append(PDFGenerator._create_services_page())
            story.append(PageBreak())
            
            # Page 5: Work Process
            story.append(PDFGenerator._create_work_process_page())
            story.append(PageBreak())
            
            # Page 6: Top Clients
            story.append(PDFGenerator._create_clients_page(client_type='bni'))
            story.append(PageBreak())
            
            # Page 7: International Clients
            story.append(PDFGenerator._create_clients_page(client_type='international'))
            story.append(PageBreak())
            
            # Page 8: Terms & Conditions
            story.append(PDFGenerator._create_terms_conditions_page())
            story.append(PageBreak())
            
            # Page 9: Back Cover
            story.append(PDFGenerator._create_back_cover())
            
            # Build PDF
            doc.build(story)
            return True
            
        except Exception as e:
            print(f"Error generating PDF: {str(e)}")
            return False
    
    @staticmethod
    def generate_project_proposal(proposal_data: dict, line_items: list, pdf_path: str) -> bool:
        """
        Generate 12-page project proposal PDF
        """
        try:
            doc = SimpleDocTemplate(
                pdf_path,
                pagesize=PDFGenerator.PAGESIZE,
                rightMargin=20,
                leftMargin=20,
                topMargin=20,
                bottomMargin=20
            )
            
            story = []
            
            # Pages 1-2: Project Cover & Intro
            story.append(PDFGenerator._create_project_cover(proposal_data))
            story.append(PageBreak())
            story.append(PDFGenerator._create_project_intro(proposal_data))
            story.append(PageBreak())
            
            # Pages 3-8: Company Profile
            story.append(PDFGenerator._create_mission_vision_page())
            story.append(PageBreak())
            story.append(PDFGenerator._create_services_page())
            story.append(PageBreak())
            story.append(PDFGenerator._create_work_process_page())
            story.append(PageBreak())
            story.append(PDFGenerator._create_clients_page('bni'))
            story.append(PageBreak())
            story.append(PDFGenerator._create_clients_page('international'))
            story.append(PageBreak())
            story.append(PDFGenerator._create_terms_conditions_page())
            story.append(PageBreak())
            
            # Page 9: Project Rate Estimation
            story.append(PDFGenerator._create_rate_estimation_page(proposal_data, line_items))
            story.append(PageBreak())
            
            # Page 10: Payment Methods
            story.append(PDFGenerator._create_payment_methods_page())
            story.append(PageBreak())
            
            # Page 11: Quote Acceptance
            story.append(PDFGenerator._create_acceptance_page(proposal_data))
            story.append(PageBreak())
            
            # Page 12: Back Cover
            story.append(PDFGenerator._create_back_cover_with_qr(proposal_data))
            
            doc.build(story)
            return True
            
        except Exception as e:
            print(f"Error generating proposal PDF: {str(e)}")
            return False
    
    @staticmethod
    def _create_cover_page(proposal_data: dict) -> list:
        """Create cover page content"""
        styles = getSampleStyleSheet()
        story = []
        
        # Add logo (if available)
        # logo_path = "path/to/logo.png"
        # story.append(Image(logo_path, width=2*inch, height=1*inch))
        
        # Title
        title_style = ParagraphStyle(
            'CustomTitle',
            parent=styles['Heading1'],
            fontSize=36,
            textColor=PDFGenerator.BRAND_COLOR,
            spaceAfter=30,
            alignment=1  # Center
        )
        story.append(Spacer(1, 2*inch))
        story.append(Paragraph("COMPANY PROFILE", title_style))
        story.append(Spacer(1, 0.5*inch))
        
        # Company details
        client_info = f"""
        <font color="{PDFGenerator.TEXT_COLOR}" size="12">
        <b>PRAVYA TECH</b><br/>
        {proposal_data.get('company_name', '')}<br/>
        Rajkot, Gujarat, India<br/>
        <br/>
        <b>Contact:</b><br/>
        Phone: +91-XXXXXXXXXX<br/>
        Email: info@pravyatech.com<br/>
        Website: www.pravyatech.com
        </font>
        """
        story.append(Paragraph(client_info, styles['Normal']))
        
        return story
    
    @staticmethod
    def _create_project_cover(proposal_data: dict) -> list:
        """Create project proposal cover"""
        styles = getSampleStyleSheet()
        story = []
        
        story.append(Spacer(1, 1.5*inch))
        
        # Proposal badge
        badge_style = ParagraphStyle(
            'Badge',
            parent=styles['Normal'],
            fontSize=14,
            textColor=PDFGenerator.ACCENT_COLOR,
            spaceAfter=10
        )
        story.append(Paragraph("— PROJECT PROPOSAL —", badge_style))
        
        # Project title
        title_style = ParagraphStyle(
            'ProjectTitle',
            parent=styles['Heading1'],
            fontSize=28,
            textColor=PDFGenerator.BRAND_COLOR,
            spaceAfter=10,
            alignment=1
        )
        story.append(Paragraph(proposal_data['project_title'], title_style))
        
        # Project subtitle
        if proposal_data.get('project_subtitle'):
            subtitle_style = ParagraphStyle(
                'Subtitle',
                parent=styles['Normal'],
                fontSize=14,
                textColor=PDFGenerator.TEXT_COLOR,
                spaceAfter=20,
                alignment=1,
                italic=True
            )
            story.append(Paragraph(proposal_data['project_subtitle'], subtitle_style))
        
        story.append(Spacer(1, 1*inch))
        
        # Client info
        client_info = f"""
        <font size="12">
        <b>Client:</b> {proposal_data['client_name']}<br/>
        <b>Company:</b> {proposal_data['company_name']}<br/>
        <b>Prepared by:</b> PRAVYA TECH<br/>
        <b>Date:</b> {datetime.now().strftime('%d %B %Y')}
        </font>
        """
        story.append(Paragraph(client_info, styles['Normal']))
        
        return story
    
    @staticmethod
    def _create_rate_estimation_page(proposal_data: dict, line_items: list) -> list:
        """Create pricing/rate estimation page"""
        styles = getSampleStyleSheet()
        story = []
        
        # Title
        title_style = ParagraphStyle(
            'SectionTitle',
            parent=styles['Heading2'],
            fontSize=16,
            textColor=PDFGenerator.BRAND_COLOR,
            spaceAfter=20
        )
        story.append(Paragraph("PROJECT RATE ESTIMATION", title_style))
        
        # Pricing table
        table_data = [
            ['Description', 'Qty', 'Unit Price', 'Total']
        ]
        
        total_amount = 0
        for item in line_items:
            item_total = item['quantity'] * item['unit_price']
            total_amount += item_total
            table_data.append([
                item['description'],
                str(item['quantity']),
                f"₹{item['unit_price']:,.0f}",
                f"₹{item_total:,.0f}"
            ])
        
        # Add totals
        table_data.append(['', '', 'TOTAL:', f"₹{total_amount:,.0f}"])
        
        table = Table(table_data, colWidths=[3*inch, 1*inch, 1.5*inch, 1.5*inch])
        table.setStyle(TableStyle([
            ('BACKGROUND', (0, 0), (-1, 0), PDFGenerator.BRAND_COLOR),
            ('TEXTCOLOR', (0, 0), (-1, 0), colors.whitesmoke),
            ('ALIGN', (0, 0), (-1, -1), 'CENTER'),
            ('FONTNAME', (0, 0), (-1, 0), 'Helvetica-Bold'),
            ('FONTSIZE', (0, 0), (-1, 0), 12),
            ('BOTTOMPADDING', (0, 0), (-1, 0), 12),
            ('BACKGROUND', (0, -1), (-1, -1), colors.lightgrey),
            ('FONTNAME', (0, -1), (-1, -1), 'Helvetica-Bold'),
            ('GRID', (0, 0), (-1, -1), 1, colors.black),
            ('ROWBACKGROUNDS', (0, 1), (-1, -2), [colors.white, colors.lightgrey]),
        ]))
        
        story.append(table)
        story.append(Spacer(1, 0.3*inch))
        
        # Summary
        currency = proposal_data.get('currency', 'INR')
        summary = f"""
        <font size="11">
        <b>Project Duration:</b> {proposal_data.get('contract_duration', 'Not specified')}<br/>
        <b>Currency:</b> {currency}<br/>
        <b>Total Amount:</b> {currency} {total_amount:,.0f}
        </font>
        """
        story.append(Paragraph(summary, styles['Normal']))
        
        return story
    
    @staticmethod
    def _create_acceptance_page(proposal_data: dict) -> list:
        """Create quote acceptance page"""
        styles = getSampleStyleSheet()
        story = []
        
        title_style = ParagraphStyle(
            'SectionTitle',
            parent=styles['Heading2'],
            fontSize=16,
            textColor=PDFGenerator.BRAND_COLOR,
            spaceAfter=20
        )
        story.append(Paragraph("QUOTE ACCEPTANCE & SIGN-OFF", title_style))
        
        acceptance_text = """
        <font size="11">
        By accepting this quotation, the client acknowledges and agrees to the following:<br/>
        <br/>
        ☐ I/We agree to the project scope as defined above.<br/>
        ☐ I/We agree to the project timeline and deliverables.<br/>
        ☐ I/We agree to the payment terms and conditions.<br/>
        ☐ I/We have read and agree to the Terms & Conditions outlined in this proposal.<br/>
        ☐ I/We understand that any work outside the agreed scope may require a separate quotation.<br/>
        <br/>
        <b>Note:</b> This acceptance confirms agreement with the complete scope, timeline, and payment terms. 
        Any additional requests or changes will require a formal Change Request and revised quotation.
        </font>
        """
        story.append(Paragraph(acceptance_text, styles['Normal']))
        
        story.append(Spacer(1, 0.4*inch))
        
        # Signature blocks
        signature_table_data = [
            ['Authorized by:', '_____________________', 'Date:', '_____________________'],
            ['Name (Print):', '_____________________', 'Email:', '_____________________'],
        ]
        
        sig_table = Table(signature_table_data, colWidths=[1.2*inch, 1.8*inch, 1.2*inch, 1.8*inch])
        sig_table.setStyle(TableStyle([
            ('ALIGN', (0, 0), (-1, -1), 'LEFT'),
            ('FONTSIZE', (0, 0), (-1, -1), 10),
            ('BOTTOMPADDING', (0, 0), (-1, -1), 20),
        ]))
        
        story.append(sig_table)
        
        return story
    
    # Additional helper methods for other pages...
    # _create_cover_letter()
    # _create_mission_vision_page()
    # _create_services_page()
    # _create_work_process_page()
    # _create_clients_page()
    # _create_terms_conditions_page()
    # _create_payment_methods_page()
    # _create_back_cover()
    # _create_back_cover_with_qr()
    # etc.
```

#### E. PDF Generation Endpoint Integration

**✅ CRITICAL:**

```python
# backend/app/api/routes/proposals.py
from fastapi import APIRouter, HTTPException
from app.services.pdf_generator import PDFGenerator
from app.models import Proposal
from sqlalchemy.ext.asyncio import AsyncSession

router = APIRouter(prefix="/api/proposals", tags=["proposals"])

@router.post("/{proposal_id}/generate-pdf")
async def generate_pdf(proposal_id: int, db: AsyncSession):
    """
    Generate PDF for proposal and save to disk
    """
    try:
        # Fetch proposal from database
        proposal = await db.get(Proposal, proposal_id)
        if not proposal:
            raise HTTPException(status_code=404, detail="Proposal not found")
        
        # Prepare data
        proposal_data = {
            'client_name': proposal.client_name,
            'company_name': proposal.company_name,
            'email': proposal.email,
            'phone': proposal.phone,
            'project_title': proposal.project_title,
            'project_subtitle': proposal.project_subtitle,
            'contract_duration': proposal.contract_duration,
            'amount': float(proposal.amount),
            'currency': proposal.currency,
        }
        
        # Define PDF path
        pdf_path = f"/pdfs/{proposal.unique_token}.pdf"
        
        # Generate PDF based on type
        if proposal.type == 'profile_only':
            success = PDFGenerator.generate_company_profile(proposal_data, pdf_path)
        else:  # quotation_proposal
            # Fetch line items
            line_items = await db.execute(
                "SELECT * FROM line_items WHERE proposal_id = :id",
                {"id": proposal_id}
            )
            success = PDFGenerator.generate_project_proposal(
                proposal_data,
                line_items.mappings().all(),
                pdf_path
            )
        
        if not success:
            raise HTTPException(status_code=500, detail="PDF generation failed")
        
        # Update proposal record
        proposal.pdf_path = pdf_path
        proposal.status = 'sent'
        proposal.sent_at = datetime.now()
        await db.commit()
        
        return {
            "success": True,
            "pdf_path": pdf_path,
            "message": "PDF generated successfully"
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/{proposal_id}/download-pdf")
async def download_pdf(proposal_id: int, db: AsyncSession):
    """Download generated PDF file"""
    proposal = await db.get(Proposal, proposal_id)
    if not proposal or not proposal.pdf_path:
        raise HTTPException(status_code=404, detail="PDF not found")
    
    return FileResponse(
        path=proposal.pdf_path,
        filename=f"{proposal.proposal_no}.pdf",
        media_type="application/pdf"
    )
```

#### F. Company Profile Content Storage

**⚠️ IMPORTANT:**
- Store company profile content in database or JSON config file
- Make it editable through admin panel (future feature)
- Example structure:
```python
class CompanyProfileContent(Base):
    __tablename__ = "company_profile_content"
    
    id = Column(Integer, primary_key=True)
    section = Column(String(50))  # 'cover', 'letter', 'mission', 'services', etc.
    content = Column(JSON)  # Store section-specific data
    updated_at = Column(DateTime, default=datetime.now)
```

### ✅ CRITICAL Components

- ReportLab PDF generation library
- PDF page structure (9 pages for profile, 12 for proposal)
- Dynamic content insertion from database
- Static content management
- Line items table generation
- Professional styling and formatting
- Logo and image embedding
- QR code generation (for renewal links)
- PDF file saving to disk
- UTF-8 text encoding
- Currency formatting

### ⚠️ IMPORTANT Components

- Company profile content management
- Customizable templates
- Font management (embedded fonts for consistency)
- Color scheme management
- PDF compression
- Watermark/draft mode support
- Version control for generated PDFs

### 💡 OPTIONAL Components

- PDF digital signature support
- Encrypted PDFs
- Custom letterhead
- Multi-language support
- Background images/textures
- Professional footers with page numbers
- Table of contents
- Hyperlinks in PDF

### 📊 Dependencies & Prerequisites

- ReportLab library installed
- Company profile data populated in database
- Line items table created
- PDF file storage path configured
- Professional logo and client images available

### ⏱️ Estimated Timeline: 10-14 days

---

---

## ✅ PHASE 5: Client Viewer & Proposal Tracking
**Duration:** 1.5 weeks | **Status:** Client-Facing Feature  
**Objective:** Build public `/p/{token}` page and tracking system

### 📌 What to Do

#### A. Client-Facing Viewer Page (/p/{token})

**✅ CRITICAL:**

##### 1. Route & Access Control
- Public route: `GET /p/{token}`
- No authentication required
- Must validate token exists and is active
- Return 404 if token invalid/expired

##### 2. Viewer UI Components

**PDF Display:**
- Embed PDF in browser using:
  - PDF.js library (Mozilla)
  - Or embed tag: `<embed src="..." type="application/pdf">`
  - Or iframe: `<iframe src="..." />`
- Full-screen option
- Zoom in/out controls
- Page navigation (prev/next)
- Go to page number
- Responsive design (mobile, tablet, desktop)
- Download button
- Print button

**Proposal Information:**
- Client name
- Company name
- Project title (if quotation)
- Proposal date
- Proposal number
- Valid until date (if contract has expiry)

**Action Buttons:**
- ✅ **CRITICAL:**
  - "Download PDF" button → Logs download event
  - "Accept Quote" button → Links to acceptance page
  - "Contact via WhatsApp" button → Opens WhatsApp chat
  
- ⚠️ **IMPORTANT:**
  - "Send Feedback" form
  - "Schedule a Call" button (optional)

##### 3. Acceptance Flow

**Quote Acceptance Page:**
- Display before acceptance:
  - Proposal summary
  - Total amount
  - Terms & conditions (summary)
  - Checklist:
    - ☐ I agree with the project scope
    - ☐ I agree with the timeline
    - ☐ I agree with the payment terms
    - ☐ I agree with the terms & conditions
  
- Form fields:
  - Full Name (required)
  - Email (required)
  - Phone (required)
  - Company (required)
  - Job Title (optional)
  - Accept checkbox (required)
  - "Accept & Confirm" button

- On submission:
  - Validate all fields
  - Store acceptance record in database
  - Update proposal status to `accepted`
  - Send confirmation email to client & admin
  - Display success message
  - Show proposal as "Accepted" in viewer
  - Disable "Accept Quote" button

```python
# Create acceptance_records table
class AcceptanceRecord(Base):
    __tablename__ = "acceptance_records"
    
    id = Column(Integer, primary_key=True)
    proposal_id = Column(Integer, ForeignKey("proposals.id"))
    client_name = Column(String(100))
    client_email = Column(String(100))
    client_phone = Column(String(20))
    company = Column(String(150))
    job_title = Column(String(100))
    accepted_at = Column(DateTime, default=datetime.now)
    ip_address = Column(String(45))
    user_agent = Column(String(500))
```

#### B. Tracking System

**✅ CRITICAL — Automatic View Tracking:**

1. **View Event Recording**
   - When `/p/{token}` is accessed:
     - Extract client IP address
     - Get user-agent (device, browser)
     - Record in `proposal_views` table
     - Update proposal record:
       - If first view: Set `first_opened_at`
       - Set/update `last_opened_at`
       - Increment `view_count`
       - Update status to `viewed`

```python
# backend/app/api/routes/client_viewer.py
from fastapi import APIRouter, Request
from fastapi.responses import HTMLResponse, FileResponse
from app.models import Proposal, ProposalView
from sqlalchemy.ext.asyncio import AsyncSession
from datetime import datetime

router = APIRouter(tags=["client"])

@router.get("/p/{token}")
async def view_proposal(token: str, request: Request, db: AsyncSession):
    """
    Client-facing proposal viewer with automatic tracking
    """
    # Validate token
    proposal = await db.execute(
        "SELECT * FROM proposals WHERE unique_token = :token",
        {"token": token}
    )
    proposal = proposal.scalar_one_or_none()
    
    if not proposal:
        return {"error": "Proposal not found"}, 404
    
    # Record view event
    view_event = ProposalView(
        proposal_id=proposal.id,
        viewed_at=datetime.now(),
        ip_address=request.client.host,
        user_agent=request.headers.get("User-Agent"),
        event_type="view"
    )
    db.add(view_event)
    
    # Update proposal tracking
    if not proposal.first_opened_at:
        proposal.first_opened_at = datetime.now()
    
    proposal.last_opened_at = datetime.now()
    proposal.view_count += 1
    
    if proposal.status == 'sent':
        proposal.status = 'viewed'
    
    await db.commit()
    
    # Return HTML page with embedded PDF viewer
    html_content = f"""
    <!DOCTYPE html>
    <html>
    <head>
        <title>Proposal - {proposal.proposal_no}</title>
        <script src="https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js"></script>
        <style>
            * {{ margin: 0; padding: 0; box-sizing: border-box; }}
            body {{ font-family: Arial, sans-serif; background: #f5f5f5; }}
            .container {{ max-width: 1200px; margin: 0 auto; padding: 20px; }}
            .viewer-header {{ background: white; padding: 20px; border-radius: 8px; margin-bottom: 20px; box-shadow: 0 2px 4px rgba(0,0,0,0.1); }}
            .proposal-info {{ display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 20px; margin-bottom: 20px; }}
            .info-block {{ background: white; padding: 15px; border-radius: 8px; }}
            .info-label {{ font-size: 12px; color: #666; text-transform: uppercase; }}
            .info-value {{ font-size: 16px; font-weight: bold; color: #333; }}
            .viewer-container {{ background: white; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 8px rgba(0,0,0,0.1); }}
            #pdf-viewer {{ width: 100%; height: 800px; border: none; }}
            .viewer-controls {{ padding: 15px; background: #f9f9f9; border-bottom: 1px solid #ddd; display: flex; gap: 10px; align-items: center; }}
            .btn {{ padding: 10px 20px; background: #1F4788; color: white; border: none; border-radius: 4px; cursor: pointer; font-size: 14px; }}
            .btn:hover {{ background: #163a5f; }}
            .btn-secondary {{ background: #6c757d; }}
            .btn-secondary:hover {{ background: #5a6268; }}
            .action-buttons {{ display: flex; gap: 10px; margin-top: 20px; flex-wrap: wrap; }}
        </style>
    </head>
    <body>
        <div class="container">
            <div class="viewer-header">
                <h1>{proposal.project_title or 'Company Profile'}</h1>
                <p style="color: #666; margin-top: 5px;">Proposal #: {proposal.proposal_no}</p>
            </div>
            
            <div class="proposal-info">
                <div class="info-block">
                    <div class="info-label">Client</div>
                    <div class="info-value">{proposal.client_name}</div>
                </div>
                <div class="info-block">
                    <div class="info-label">Company</div>
                    <div class="info-value">{proposal.company_name}</div>
                </div>
                {f'<div class="info-block"><div class="info-label">Project Amount</div><div class="info-value">{proposal.currency} {proposal.amount:,.0f}</div></div>' if proposal.amount else ''}
                <div class="info-block">
                    <div class="info-label">Sent Date</div>
                    <div class="info-value">{proposal.sent_at.strftime('%d %b %Y')}</div>
                </div>
            </div>
            
            <div class="viewer-container">
                <div class="viewer-controls">
                    <button class="btn" id="prev-page">← Previous</button>
                    <input type="number" id="page-num" value="1" min="1" style="width: 50px; padding: 8px; border: 1px solid #ddd; border-radius: 4px;">
                    <span id="page-info">of <span id="total-pages">0</span></span>
                    <button class="btn" id="next-page">Next →</button>
                    <button class="btn" id="zoom-in">Zoom +</button>
                    <button class="btn" id="zoom-out">Zoom -</button>
                    <button class="btn btn-secondary" id="download-btn">📥 Download PDF</button>
                    <button class="btn btn-secondary" id="print-btn">🖨️ Print</button>
                </div>
                
                <canvas id="pdf-canvas" style="width: 100%; display: block;"></canvas>
            </div>
            
            <div class="action-buttons">
                <button class="btn" id="accept-btn">✅ Accept Quote</button>
                <button class="btn btn-secondary" id="whatsapp-btn">💬 Contact via WhatsApp</button>
                <button class="btn btn-secondary" id="feedback-btn">💭 Send Feedback</button>
            </div>
        </div>
        
        <script>
            const token = '{token}';
            const pdfUrl = `/api/proposals/pdf/${{token}}/download`;
            let pdfDoc = null;
            let pageNum = 1;
            let scale = 1.5;
            
            const canvas = document.getElementById('pdf-canvas');
            const ctx = canvas.getContext('2d');
            const pageNumInput = document.getElementById('page-num');
            const totalPagesSpan = document.getElementById('total-pages');
            
            // Load PDF
            pdfjsLib.getDocument(pdfUrl).promise.then(pdf => {{
                pdfDoc = pdf;
                totalPagesSpan.textContent = pdf.numPages;
                renderPage(pageNum);
            }});
            
            function renderPage(num) {{
                pdfDoc.getPage(num).then(page => {{
                    const viewport = page.getViewport({{ scale }});
                    canvas.height = viewport.height;
                    canvas.width = viewport.width;
                    
                    page.render({{
                        canvasContext: ctx,
                        viewport: viewport
                    }});
                    
                    pageNumInput.value = num;
                    pageNum = num;
                }});
            }}
            
            document.getElementById('prev-page').addEventListener('click', () => {{
                if (pageNum > 1) renderPage(--pageNum);
            }});
            
            document.getElementById('next-page').addEventListener('click', () => {{
                if (pageNum < pdfDoc.numPages) renderPage(++pageNum);
            }});
            
            document.getElementById('zoom-in').addEventListener('click', () => {{
                scale += 0.2;
                renderPage(pageNum);
            }});
            
            document.getElementById('zoom-out').addEventListener('click', () => {{
                if (scale > 0.5) {{
                    scale -= 0.2;
                    renderPage(pageNum);
                }}
            }});
            
            document.getElementById('download-btn').addEventListener('click', () => {{
                // Log download event
                fetch(`/api/proposals/{{token}}/log-download`, {{ method: 'POST' }});
                
                // Download PDF
                const a = document.createElement('a');
                a.href = pdfUrl;
                a.download = 'proposal.pdf';
                a.click();
            }});
            
            document.getElementById('accept-btn').addEventListener('click', () => {{
                window.location.href = `/p/{{token}}/accept`;
            }});
            
            document.getElementById('whatsapp-btn').addEventListener('click', () => {{
                window.open(`https://wa.me/?text=I am interested in this proposal: https://pravyatech.com/p/{{token}}`, '_blank');
            }});
        </script>
    </body>
    </html>
    """
    
    return HTMLResponse(content=html_content)

@router.post("/p/{token}/log-download")
async def log_download(token: str, request: Request, db: AsyncSession):
    """Log PDF download event"""
    proposal = await db.execute(
        "SELECT * FROM proposals WHERE unique_token = :token",
        {"token": token}
    )
    proposal = proposal.scalar_one_or_none()
    
    if proposal:
        view_event = ProposalView(
            proposal_id=proposal.id,
            viewed_at=datetime.now(),
            ip_address=request.client.host,
            user_agent=request.headers.get("User-Agent"),
            event_type="download"
        )
        db.add(view_event)
        await db.commit()
    
    return {"success": True}

@router.get("/p/{token}/accept")
async def acceptance_form(token: str, db: AsyncSession):
    """Display quote acceptance form"""
    proposal = await db.execute(
        "SELECT * FROM proposals WHERE unique_token = :token",
        {"token": token}
    )
    proposal = proposal.scalar_one_or_none()
    
    if not proposal:
        return {"error": "Proposal not found"}, 404
    
    # Return HTML form
    html_content = f"""
    <!DOCTYPE html>
    <html>
    <head>
        <title>Accept Quote - {proposal.proposal_no}</title>
        <style>
            * {{ margin: 0; padding: 0; box-sizing: border-box; }}
            body {{ font-family: Arial, sans-serif; background: #f5f5f5; }}
            .container {{ max-width: 600px; margin: 40px auto; padding: 20px; }}
            .form-container {{ background: white; padding: 30px; border-radius: 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.1); }}
            h1 {{ color: #1F4788; margin-bottom: 20px; }}
            .form-group {{ margin-bottom: 20px; }}
            label {{ display: block; margin-bottom: 5px; font-weight: bold; color: #333; }}
            input, textarea {{ width: 100%; padding: 10px; border: 1px solid #ddd; border-radius: 4px; font-family: Arial; }}
            input:focus, textarea:focus {{ outline: none; border-color: #1F4788; }}
            .checkbox-group {{ display: flex; align-items: center; margin-bottom: 15px; }}
            input[type="checkbox"] {{ margin-right: 10px; width: auto; }}
            .terms {{ margin: 20px 0; padding: 15px; background: #f9f9f9; border-left: 4px solid #1F4788; }}
            .terms h3 {{ margin-bottom: 10px; }}
            .btn {{ width: 100%; padding: 12px; background: #1F4788; color: white; border: none; border-radius: 4px; font-size: 16px; font-weight: bold; cursor: pointer; }}
            .btn:hover {{ background: #163a5f; }}
            .success {{ display: none; padding: 15px; background: #d4edda; color: #155724; border-radius: 4px; margin-bottom: 20px; }}
        </style>
    </head>
    <body>
        <div class="container">
            <div class="form-container">
                <h1>✅ Accept Quotation</h1>
                
                <div class="success" id="success-message">
                    <strong>Thank you!</strong> Your acceptance has been recorded. We will contact you soon.
                </div>
                
                <form id="acceptance-form">
                    <div class="form-group">
                        <label>Full Name *</label>
                        <input type="text" name="client_name" required>
                    </div>
                    
                    <div class="form-group">
                        <label>Email *</label>
                        <input type="email" name="client_email" required>
                    </div>
                    
                    <div class="form-group">
                        <label>Phone *</label>
                        <input type="tel" name="client_phone" required>
                    </div>
                    
                    <div class="form-group">
                        <label>Company *</label>
                        <input type="text" name="company" required>
                    </div>
                    
                    <div class="form-group">
                        <label>Job Title (Optional)</label>
                        <input type="text" name="job_title">
                    </div>
                    
                    <div class="terms">
                        <h3>Terms & Conditions</h3>
                        <p>By clicking Accept, you agree to:</p>
                        <ul style="margin-left: 20px; margin-top: 10px;">
                            <li>The project scope as defined</li>
                            <li>The proposed timeline</li>
                            <li>The payment terms and conditions</li>
                            <li>All terms & conditions in this proposal</li>
                        </ul>
                    </div>
                    
                    <div class="checkbox-group">
                        <input type="checkbox" id="accept-checkbox" required>
                        <label for="accept-checkbox" style="margin: 0;">
                            I agree to all terms and conditions
                        </label>
                    </div>
                    
                    <button type="submit" class="btn">Accept & Confirm</button>
                </form>
            </div>
        </div>
        
        <script>
            document.getElementById('acceptance-form').addEventListener('submit', async (e) => {{
                e.preventDefault();
                
                const formData = {{
                    proposal_id: {proposal.id},
                    client_name: document.querySelector('[name="client_name"]').value,
                    client_email: document.querySelector('[name="client_email"]').value,
                    client_phone: document.querySelector('[name="client_phone"]').value,
                    company: document.querySelector('[name="company"]').value,
                    job_title: document.querySelector('[name="job_title"]').value,
                }};
                
                const response = await fetch('/api/proposals/{token}/accept', {{
                    method: 'POST',
                    headers: {{ 'Content-Type': 'application/json' }},
                    body: JSON.stringify(formData)
                }});
                
                if (response.ok) {{
                    document.getElementById('acceptance-form').style.display = 'none';
                    document.getElementById('success-message').style.display = 'block';
                }} else {{
                    alert('Error recording acceptance. Please try again.');
                }}
            }});
        </script>
    </body>
    </html>
    """
    
    return HTMLResponse(content=html_content)
```

#### C. Download PDF Endpoint

**✅ CRITICAL:**

```python
@router.get("/api/proposals/pdf/{token}/download")
async def download_proposal_pdf(token: str, db: AsyncSession):
    """Download proposal PDF (public access)"""
    proposal = await db.execute(
        "SELECT * FROM proposals WHERE unique_token = :token",
        {"token": token}
    )
    proposal = proposal.scalar_one_or_none()
    
    if not proposal or not proposal.pdf_path:
        raise HTTPException(status_code=404, detail="PDF not found")
    
    # Log download
    view_event = ProposalView(
        proposal_id=proposal.id,
        viewed_at=datetime.now(),
        event_type="download"
    )
    db.add(view_event)
    await db.commit()
    
    return FileResponse(
        path=proposal.pdf_path,
        filename=f"{proposal.proposal_no}.pdf",
        media_type="application/pdf"
    )
```

#### D. Acceptance Recording Endpoint

**✅ CRITICAL:**

```python
@router.post("/api/proposals/{token}/accept")
async def accept_proposal(token: str, acceptance: AcceptanceCreate, request: Request, db: AsyncSession):
    """Record quote acceptance"""
    proposal = await db.execute(
        "SELECT * FROM proposals WHERE unique_token = :token",
        {"token": token}
    )
    proposal = proposal.scalar_one_or_none()
    
    if not proposal:
        raise HTTPException(status_code=404, detail="Proposal not found")
    
    # Create acceptance record
    acceptance_record = AcceptanceRecord(
        proposal_id=proposal.id,
        client_name=acceptance.client_name,
        client_email=acceptance.client_email,
        client_phone=acceptance.client_phone,
        company=acceptance.company,
        job_title=acceptance.job_title,
        accepted_at=datetime.now(),
        ip_address=request.client.host,
        user_agent=request.headers.get("User-Agent")
    )
    db.add(acceptance_record)
    
    # Update proposal status
    proposal.status = 'accepted'
    await db.commit()
    
    # Send notification email to admin (future phase)
    # send_acceptance_email(proposal, acceptance_record)
    
    return {
        "success": True,
        "message": "Quote accepted successfully",
        "acceptance_id": acceptance_record.id
    }
```

### ✅ CRITICAL Components

- Public `/p/{token}` route with token validation
- PDF viewer (PDF.js)
- Automatic view tracking (IP, user-agent, timestamp)
- Proposal status update on first view
- Quote acceptance form
- Acceptance record storage
- Download tracking
- Responsive design
- WhatsApp share button
- Error handling for invalid tokens

### ⚠️ IMPORTANT Components

- Page-by-page PDF navigation
- Zoom functionality
- Print capability
- Form validation
- Success/error messages
- IP geolocation (optional for tracking)
- Email notifications on acceptance
- PDF preview thumbnails

### 💡 OPTIONAL Components

- Comments/annotations on PDF
- Comparison tool (side-by-side)
- Digital signature capture
- Multi-language viewer
- Dark mode for viewer
- Accessibility features (screen reader support)
- Feedback survey form

### 🔧 Tech Implementation Details

- PDF.js library for client-side rendering
- Canvas for PDF display
- LocalStorage for viewer preferences
- Geolocation API (optional)
- Service Worker for offline PDF viewing (optional)

### 📊 Dependencies & Prerequisites

- PDF files generated and stored
- Valid proposal records with tokens
- Database migrations for acceptance_records table
- Frontend framework configured
- PDF.js library available
- CORS configured for public access

### ⏱️ Estimated Timeline: 7-10 days

---

---

## ⚠️ PHASE 6: WhatsApp Integration & Sharing Features
**Duration:** 1 week | **Status:** Communication Feature  
**Objective:** Enable seamless WhatsApp sharing of proposal links

### 📌 What to Do

#### A. WhatsApp Share Link Generation

**✅ CRITICAL:**

```python
# backend/app/api/routes/proposals.py

@router.post("/api/proposals/{proposal_id}/generate-whatsapp-link")
async def generate_whatsapp_link(proposal_id: int, db: AsyncSession):
    """Generate WhatsApp share link for proposal"""
    
    proposal = await db.get(Proposal, proposal_id)
    if not proposal:
        raise HTTPException(status_code=404, detail="Proposal not found")
    
    # WhatsApp message template
    message = f"""
Hi {proposal.client_name},

Please find the PRAVYA TECH {proposal.type.replace('_', ' ').title()} here:

https://pravyatech.com/p/{proposal.unique_token}

You can:
✅ View and download the proposal
✅ Accept the quotation
✅ Contact us via WhatsApp

Let me know if you have any questions!

Best regards,
PRAVYA TECH Team
""".strip()
    
    # URL encode the message
    import urllib.parse
    encoded_message = urllib.parse.quote(message)
    
    # WhatsApp Web/App URL
    whatsapp_url = f"https://wa.me/?text={encoded_message}"
    
    # Alternative for specific number (if available)
    if proposal.phone:
        # Clean phone number (remove +, spaces, etc.)
        clean_phone = ''.join(filter(str.isdigit, proposal.phone))
        whatsapp_url = f"https://wa.me/{clean_phone}?text={encoded_message}"
    
    return {
        "success": True,
        "whatsapp_url": whatsapp_url,
        "proposal_link": f"https://pravyatech.com/p/{proposal.unique_token}",
        "message_preview": message
    }
```

#### B. Frontend WhatsApp Integration

**✅ CRITICAL:**

```jsx
// frontend/src/components/ProposalActions.jsx

export function ShareWhatsApp({ proposalId, clientName, clientPhone }) {
  const [loading, setLoading] = useState(false);
  
  const handleShareWhatsApp = async () => {
    setLoading(true);
    
    try {
      const response = await api.post(
        `/proposals/${proposalId}/generate-whatsapp-link`
      );
      
      if (response.data.success) {
        // Open WhatsApp in new window
        window.open(response.data.whatsapp_url, '_blank');
        
        // Show success toast
        toast.success('WhatsApp link opened!');
      }
    } catch (error) {
      toast.error('Failed to generate WhatsApp link');
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <button
      onClick={handleShareWhatsApp}
      disabled={loading}
      className="btn btn-whatsapp"
    >
      {loading ? 'Generating...' : '💬 Share via WhatsApp'}
    </button>
  );
}
```

#### C. Share Link Tracking

**⚠️ IMPORTANT:**
- Track when WhatsApp link is generated
- Track if proposal was accessed from WhatsApp source
- Record in analytics

```python
# backend/app/models.py
class ShareEvent(Base):
    __tablename__ = "share_events"
    
    id = Column(Integer, primary_key=True)
    proposal_id = Column(Integer, ForeignKey("proposals.id"))
    channel = Column(String(50))  # 'whatsapp', 'email', 'direct'
    shared_at = Column(DateTime, default=datetime.now)
    recipient_number = Column(String(20), nullable=True)
    status = Column(String(20), default='pending')  # pending, opened, ignored
```

#### D. Copy Link Feature

**⚠️ IMPORTANT:**
- One-click copy to clipboard
- Show visual feedback
- Copy proposal link: `https://pravyatech.com/p/{token}`

```jsx
// frontend/src/components/CopyLink.jsx
import { useState } from 'react';

export function CopyProposalLink({ token }) {
  const [copied, setCopied] = useState(false);
  
  const handleCopy = async () => {
    const link = `https://pravyatech.com/p/${token}`;
    
    try {
      await navigator.clipboard.writeText(link);
      setCopied(true);
      
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      alert('Failed to copy link');
    }
  };
  
  return (
    <div className="copy-link">
      <input 
        type="text" 
        value={`https://pravyatech.com/p/${token}`}
        readOnly 
        className="link-input"
      />
      <button onClick={handleCopy} className="btn">
        {copied ? '✅ Copied!' : '📋 Copy'}
      </button>
    </div>
  );
}
```

#### E. Send Email Feature (Future Enhancement)

**💡 OPTIONAL (Phase 8+):**
- Send proposal link via email
- Email template
- Email delivery tracking
- Requires email service (SendGrid, AWS SES, etc.)

### ✅ CRITICAL Components

- WhatsApp URL generation with encoded message
- WhatsApp Web/App link
- Phone number validation and formatting
- Message preview
- Copy to clipboard functionality
- Share event tracking
- Response handling

### ⚠️ IMPORTANT Components

- Share analytics
- Multiple language support for message
- Customizable message templates
- Schedule share (future)
- Share history tracking
- Bulk share capability

### 💡 OPTIONAL Components

- Email sharing
- SMS sharing
- QR code generation
- Social media sharing
- Custom message templates
- Share analytics dashboard
- Automated follow-up reminders

### 🔧 Tech Implementation Details

- URL encoding for message (urllib.parse)
- WhatsApp Web API (no API key needed)
- Client-side clipboard API
- Share event persistence
- Message template management

### 📊 Dependencies & Prerequisites

- Valid proposal records with tokens
- Client phone numbers (optional but recommended)
- Frontend button component library
- Toast notification library

### ⏱️ Estimated Timeline: 5-7 days

---

---

## ✅ PHASE 7: Quote Acceptance & Proposal Status Management
**Duration:** 1 week | **Status:** Critical Business Logic  
**Objective:** Implement quote acceptance workflows and proposal lifecycle management

### 📌 What to Do

#### A. Quote Acceptance System (Admin-side & Client-side)

**✅ CRITICAL — Already partially implemented in Phase 5**

**Admin Dashboard View:**
- Show acceptance status on proposal cards
- Display accepted proposals differently (green badge)
- Show acceptance details (who accepted, when, from where)
- Ability to view acceptance record with all client details

```python
# backend/app/api/routes/admin.py

@router.get("/api/proposals/{proposal_id}/acceptance-details")
async def get_acceptance_details(proposal_id: int, db: AsyncSession):
    """Get quote acceptance details (admin only)"""
    
    # Fetch acceptance record
    acceptance = await db.execute(
        """
        SELECT * FROM acceptance_records 
        WHERE proposal_id = :id 
        ORDER BY accepted_at DESC LIMIT 1
        """,
        {"id": proposal_id}
    )
    acceptance = acceptance.scalar_one_or_none()
    
    if not acceptance:
        return {"accepted": False, "message": "Proposal not yet accepted"}
    
    return {
        "accepted": True,
        "details": {
            "client_name": acceptance.client_name,
            "client_email": acceptance.client_email,
            "client_phone": acceptance.client_phone,
            "company": acceptance.company,
            "job_title": acceptance.job_title,
            "accepted_at": acceptance.accepted_at,
            "from_ip": acceptance.ip_address,
            "from_device": acceptance.user_agent
        }
    }
```

#### B. Proposal Status Lifecycle Management

**✅ CRITICAL:**

Status transitions:
```
sent → viewed → accepted → (renewal_due) → renewed
             ↓                              ↓
          (no action)              (creates new proposal)
```

**Implementation:**

```python
# backend/app/services/status_service.py

from enum import Enum
from datetime import datetime, timedelta

class ProposalStatus(str, Enum):
    SENT = "sent"
    VIEWED = "viewed"
    ACCEPTED = "accepted"
    RENEWAL_DUE = "renewal_due"
    RENEWED = "renewed"
    DECLINED = "declined"
    EXPIRED = "expired"

class StatusService:
    @staticmethod
    async def update_status_on_view(proposal_id: int, db: AsyncSession):
        """Auto-update status to 'viewed' on first view"""
        proposal = await db.get(Proposal, proposal_id)
        if proposal and proposal.status == ProposalStatus.SENT:
            proposal.status = ProposalStatus.VIEWED
            await db.commit()
    
    @staticmethod
    async def update_status_on_acceptance(proposal_id: int, db: AsyncSession):
        """Auto-update status to 'accepted' on acceptance"""
        proposal = await db.get(Proposal, proposal_id)
        if proposal:
            proposal.status = ProposalStatus.ACCEPTED
            await db.commit()
    
    @staticmethod
    async def check_renewal_dates(db: AsyncSession):
        """Check and update renewal status for proposals"""
        today = datetime.now().date()
        thirty_days = today + timedelta(days=30)
        
        # Find proposals with renewal_date in next 30 days
        proposals = await db.execute(
            """
            SELECT * FROM proposals 
            WHERE renewal_date BETWEEN :today AND :thirty_days
            AND status != :renewed
            """,
            {
                "today": today,
                "thirty_days": thirty_days,
                "renewed": ProposalStatus.RENEWED
            }
        )
        
        for proposal in proposals.scalars():
            proposal.status = ProposalStatus.RENEWAL_DUE
        
        await db.commit()
    
    @staticmethod
    async def mark_expired(proposal_id: int, db: AsyncSession):
        """Mark proposal as expired"""
        proposal = await db.get(Proposal, proposal_id)
        if proposal:
            proposal.status = ProposalStatus.EXPIRED
            await db.commit()
```

#### C. Status Dashboard View (Admin)

**⚠️ IMPORTANT:**

Add status filter and color coding in admin dashboard:

```jsx
// frontend/src/pages/ProposalsListPage.jsx

const statusColors = {
  sent: '#FFA500',      // Orange
  viewed: '#4169E1',    // Blue
  accepted: '#28A745',  // Green
  renewal_due: '#FF6347', // Red
  renewed: '#9370DB',   // Purple
  declined: '#DC143C',  // Crimson
  expired: '#808080'    // Gray
};

const statusBadges = {
  sent: '📤 Sent',
  viewed: '👀 Viewed',
  accepted: '✅ Accepted',
  renewal_due: '⚠️ Renewal Due',
  renewed: '🔄 Renewed',
  declined: '❌ Declined',
  expired: '⏰ Expired'
};

export function ProposalStatusBadge({ status }) {
  return (
    <span 
      style={{
        backgroundColor: statusColors[status],
        color: 'white',
        padding: '5px 10px',
        borderRadius: '4px',
        fontSize: '12px',
        fontWeight: 'bold'
      }}
    >
      {statusBadges[status]}
    </span>
  );
}
```

#### D. Proposal Decline Feature

**⚠️ IMPORTANT:**
- Add "Decline" button for client
- Record decline reason
- Update status to "declined"
- Notify admin

```python
@router.post("/api/proposals/{token}/decline")
async def decline_proposal(token: str, decline_data: dict, request: Request, db: AsyncSession):
    """Client declines quotation"""
    proposal = await db.execute(
        "SELECT * FROM proposals WHERE unique_token = :token",
        {"token": token}
    )
    proposal = proposal.scalar_one_or_none()
    
    if not proposal:
        raise HTTPException(status_code=404, detail="Proposal not found")
    
    # Record decline
    decline_record = DeclineRecord(
        proposal_id=proposal.id,
        reason=decline_data.get('reason'),
        declined_at=datetime.now(),
        ip_address=request.client.host
    )
    db.add(decline_record)
    
    # Update proposal status
    proposal.status = ProposalStatus.DECLINED
    await db.commit()
    
    return {"success": True, "message": "Proposal declined"}
```

#### E. Manual Status Override (Admin)

**⚠️ IMPORTANT:**
- Admin can manually change status
- Log the change for audit trail
- Validate transitions

```python
@router.put("/api/proposals/{proposal_id}/status")
async def update_proposal_status(
    proposal_id: int, 
    status_update: StatusUpdateRequest,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = None
):
    """Admin manually updates proposal status"""
    
    proposal = await db.get(Proposal, proposal_id)
    if not proposal:
        raise HTTPException(status_code=404, detail="Proposal not found")
    
    old_status = proposal.status
    new_status = status_update.status
    
    # Validate transition
    valid_transitions = {
        'sent': ['viewed', 'declined'],
        'viewed': ['accepted', 'declined'],
        'accepted': ['renewal_due'],
        'renewal_due': ['renewed', 'declined'],
        'renewed': []
    }
    
    if new_status not in valid_transitions.get(old_status, []):
        raise HTTPException(
            status_code=400, 
            detail=f"Cannot transition from {old_status} to {new_status}"
        )
    
    # Update status
    proposal.status = new_status
    
    # Log audit trail
    audit_log = AuditLog(
        proposal_id=proposal_id,
        action="status_update",
        old_value=old_status,
        new_value=new_status,
        changed_by=current_user.id,
        changed_at=datetime.now()
    )
    db.add(audit_log)
    await db.commit()
    
    return {"success": True, "new_status": new_status}
```

#### F. Status-based Actions

**⚠️ IMPORTANT:**
- Show different actions based on status
- Hide acceptance form if already accepted
- Show renewal button if renewal_due

```jsx
// frontend/src/components/ProposalActions.jsx

export function ProposalActionBar({ proposal, onRenew }) {
  const canAccept = proposal.status === 'sent' || proposal.status === 'viewed';
  const canDecline = proposal.status === 'sent' || proposal.status === 'viewed';
  const canRenew = proposal.status === 'renewal_due';
  
  return (
    <div className="action-bar">
      {proposal.status === 'accepted' && (
        <div className="alert alert-success">
          ✅ This proposal has been accepted by the client.
        </div>
      )}
      
      {canAccept && (
        <button className="btn btn-primary">✅ Accept Quote</button>
      )}
      
      {canDecline && (
        <button className="btn btn-secondary">❌ Decline Quote</button>
      )}
      
      {canRenew && (
        <button className="btn btn-warning" onClick={onRenew}>
          🔄 Create Renewal
        </button>
      )}
      
      {proposal.status === 'renewed' && (
        <div className="alert alert-info">
          This proposal has been renewed. View the new proposal.
        </div>
      )}
    </div>
  );
}
```

#### G. Database Schema Updates

**✅ CRITICAL:**

```python
# Add to proposal model
class Proposal(Base):
    # ... existing fields ...
    status = Column(
        Enum(*[s.value for s in ProposalStatus]),
        default=ProposalStatus.SENT
    )

# Create DeclineRecord table
class DeclineRecord(Base):
    __tablename__ = "decline_records"
    
    id = Column(Integer, primary_key=True)
    proposal_id = Column(Integer, ForeignKey("proposals.id"))
    reason = Column(String(500))
    declined_at = Column(DateTime)
    ip_address = Column(String(45))

# Create AuditLog table
class AuditLog(Base):
    __tablename__ = "audit_logs"
    
    id = Column(Integer, primary_key=True)
    proposal_id = Column(Integer, ForeignKey("proposals.id"))
    action = Column(String(50))
    old_value = Column(String(100))
    new_value = Column(String(100))
    changed_by = Column(Integer, ForeignKey("admin_users.id"))
    changed_at = Column(DateTime, default=datetime.now)
```

### ✅ CRITICAL Components

- Proposal status enum (sent, viewed, accepted, renewal_due, renewed, declined, expired)
- Status transition logic
- Auto-status updates on view and acceptance
- Status-based action visibility
- Manual status override (admin)
- Audit trail for status changes

### ⚠️ IMPORTANT Components

- Client decline functionality
- Decline reason recording
- Status color coding in UI
- Status filter in proposals list
- Status-based notifications
- Email alerts on status change
- Status history/timeline view

### 💡 OPTIONAL Components

- Custom status workflows
- Conditional actions based on status
- Automated status transitions
- Status expiration rules
- Status-based access control
- Status-based analytics

### 🔧 Tech Implementation Details

- Enum-based status validation
- Transition matrix for valid status changes
- Audit trail with user tracking
- Event-driven status updates
- Background job for renewal date checking

### 📊 Dependencies & Prerequisites

- Acceptance system from Phase 5
- Database migrations
- Admin user system
- Email notification setup

### ⏱️ Estimated Timeline: 5-7 days

---

---

## ✅ PHASE 8: Renewal Management System
**Duration:** 1.5 weeks | **Status:** Contract Lifecycle Management  
**Objective:** Implement comprehensive contract renewal workflow

### 📌 What to Do

#### A. Renewal Eligibility & Detection

**✅ CRITICAL:**

```python
# backend/app/services/renewal_service.py

from datetime import datetime, timedelta
from sqlalchemy.ext.asyncio import AsyncSession

class RenewalService:
    @staticmethod
    async def get_renewals_due(db: AsyncSession, days_ahead: int = 30):
        """Get proposals due for renewal within N days"""
        today = datetime.now().date()
        renewal_cutoff = today + timedelta(days=days_ahead)
        
        renewals = await db.execute(
            """
            SELECT p.*, a.client_name, a.company
            FROM proposals p
            LEFT JOIN acceptance_records a ON p.id = a.proposal_id
            WHERE p.renewal_date BETWEEN :today AND :cutoff
            AND p.status != 'renewed'
            AND p.type = 'quotation_proposal'
            ORDER BY p.renewal_date ASC
            """,
            {"today": today, "cutoff": renewal_cutoff}
        )
        
        return renewals.mappings().all()
    
    @staticmethod
    async def get_overdue_renewals(db: AsyncSession):
        """Get proposals past renewal date"""
        today = datetime.now().date()
        
        overdue = await db.execute(
            """
            SELECT p.*, a.client_name
            FROM proposals p
            LEFT JOIN acceptance_records a ON p.id = a.proposal_id
            WHERE p.renewal_date < :today
            AND p.status != 'renewed'
            AND p.type = 'quotation_proposal'
            ORDER BY p.renewal_date DESC
            """,
            {"today": today}
        )
        
        return overdue.mappings().all()
    
    @staticmethod
    async def calculate_days_to_renewal(renewal_date):
        """Calculate days remaining until renewal"""
        today = datetime.now().date()
        delta = renewal_date - today
        return delta.days
```

#### B. Renewal Dashboard (Admin)

**✅ CRITICAL:**

```jsx
// frontend/src/pages/RenewalDashboardPage.jsx

import React, { useEffect, useState } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import api from '../services/api';

export default function RenewalDashboardPage() {
  const { data: renewalsDue, isLoading: loadingDue } = useQuery({
    queryKey: ['renewals-due'],
    queryFn: () => api.get('/renewals/due')
  });
  
  const { data: overdueRenewals, isLoading: loadingOverdue } = useQuery({
    queryKey: ['renewals-overdue'],
    queryFn: () => api.get('/renewals/overdue')
  });
  
  const createRenewalMutation = useMutation({
    mutationFn: (proposalId) => api.post(`/proposals/${proposalId}/renew`),
    onSuccess: () => {
      queryClient.invalidateQueries(['renewals-due']);
      toast.success('Renewal created successfully!');
    }
  });
  
  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">Contract Renewals</h1>
      
      {/* Overdue Renewals */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold mb-4 text-red-600">
          ⚠️ Overdue Renewals ({overdueRenewals?.data?.length || 0})
        </h2>
        
        {overdueRenewals?.data?.length > 0 ? (
          <table className="w-full border-collapse border">
            <thead>
              <tr className="bg-red-100">
                <th className="border p-3">Client</th>
                <th className="border p-3">Company</th>
                <th className="border p-3">Renewal Date</th>
                <th className="border p-3">Days Overdue</th>
                <th className="border p-3">Action</th>
              </tr>
            </thead>
            <tbody>
              {overdueRenewals.data.map(renewal => (
                <tr key={renewal.id} className="border-b hover:bg-red-50">
                  <td className="border p-3">{renewal.client_name}</td>
                  <td className="border p-3">{renewal.company}</td>
                  <td className="border p-3">{renewal.renewal_date}</td>
                  <td className="border p-3 font-bold">
                    {Math.abs(calculateDays(renewal.renewal_date))} days
                  </td>
                  <td className="border p-3">
                    <button
                      onClick={() => createRenewalMutation.mutate(renewal.id)}
                      className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
                    >
                      Create Renewal
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p className="text-green-600">✅ No overdue renewals</p>
        )}
      </div>
      
      {/* Renewals Due in 30 Days */}
      <div>
        <h2 className="text-2xl font-bold mb-4 text-orange-600">
          ⏰ Renewals Due in 30 Days ({renewalsDue?.data?.length || 0})
        </h2>
        
        {renewalsDue?.data?.length > 0 ? (
          <table className="w-full border-collapse border">
            <thead>
              <tr className="bg-orange-100">
                <th className="border p-3">Client</th>
                <th className="border p-3">Company</th>
                <th className="border p-3">Renewal Date</th>
                <th className="border p-3">Days Remaining</th>
                <th className="border p-3">Status</th>
                <th className="border p-3">Action</th>
              </tr>
            </thead>
            <tbody>
              {renewalsDue.data.map(renewal => {
                const daysRemaining = calculateDays(renewal.renewal_date);
                const isUrgent = daysRemaining <= 7;
                
                return (
                  <tr 
                    key={renewal.id}
                    className={`border-b ${isUrgent ? 'bg-yellow-50' : 'hover:bg-orange-50'}`}
                  >
                    <td className="border p-3">{renewal.client_name}</td>
                    <td className="border p-3">{renewal.company}</td>
                    <td className="border p-3">{renewal.renewal_date}</td>
                    <td className="border p-3 font-bold">
                      {daysRemaining} days {isUrgent && '🔴'}
                    </td>
                    <td className="border p-3">
                      <span className={`px-3 py-1 rounded text-white ${
                        isUrgent ? 'bg-red-600' : 'bg-orange-600'
                      }`}>
                        {isUrgent ? 'URGENT' : 'PENDING'}
                      </span>
                    </td>
                    <td className="border p-3">
                      <button
                        onClick={() => createRenewalMutation.mutate(renewal.id)}
                        disabled={createRenewalMutation.isPending}
                        className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
                      >
                        {createRenewalMutation.isPending ? 'Creating...' : '🔄 Renew'}
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        ) : (
          <p className="text-green-600">✅ No renewals due soon</p>
        )}
      </div>
    </div>
  );
}

function calculateDays(renewalDate) {
  const today = new Date();
  const renewal = new Date(renewalDate);
  const diff = renewal - today;
  return Math.ceil(diff / (1000 * 60 * 60 * 24));
}
```

#### C. One-Click Renewal Creation

**✅ CRITICAL:**

```python
# backend/app/api/routes/renewals.py

@router.post("/api/proposals/{proposal_id}/renew")
async def create_renewal(
    proposal_id: int,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = None
):
    """
    Create renewal proposal (one-click)
    1. Duplicate original proposal
    2. Update dates
    3. Generate new token
    4. Create new proposal record
    5. Preserve original as reference
    """
    
    # Fetch original proposal
    original = await db.get(Proposal, proposal_id)
    if not original:
        raise HTTPException(status_code=404, detail="Proposal not found")
    
    # Fetch line items if quotation
    line_items = []
    if original.type == 'quotation_proposal':
        result = await db.execute(
            "SELECT * FROM line_items WHERE proposal_id = :id",
            {"id": proposal_id}
        )
        line_items = result.scalars().all()
    
    # Create new proposal (renewal)
    import secrets
    new_token = secrets.token_urlsafe(12)
    
    # Calculate new renewal date (add contract duration to old renewal date)
    # For simplicity, add 1 year
    new_renewal_date = original.renewal_date + timedelta(days=365)
    
    renewal_proposal = Proposal(
        type=original.type,
        proposal_no=await ProposalService.generate_proposal_number(db),
        client_name=original.client_name,
        company_name=original.company_name,
        phone=original.phone,
        email=original.email,
        project_title=original.project_title,
        project_subtitle=original.project_subtitle,
        amount=original.amount,
        currency=original.currency,
        contract_duration=original.contract_duration,
        unique_token=new_token,
        renewal_date=new_renewal_date,
        status='sent',
        created_at=datetime.now()
    )
    
    db.add(renewal_proposal)
    await db.flush()  # Get the new proposal ID
    
    # Duplicate line items
    if line_items:
        for item in line_items:
            new_item = LineItem(
                proposal_id=renewal_proposal.id,
                description=item.description,
                quantity=item.quantity,
                unit_price=item.unit_price,
                total=item.total
            )
            db.add(new_item)
    
    # Mark original as having a renewal
    original.status = 'renewed'
    
    # Link renewal to original (optional: add renewal_proposal_id to proposals table)
    # This helps track proposal history
    
    await db.commit()
    await db.refresh(renewal_proposal)
    
    return {
        "success": True,
        "message": "Renewal proposal created successfully",
        "renewal_proposal": {
            "id": renewal_proposal.id,
            "proposal_no": renewal_proposal.proposal_no,
            "unique_token": renewal_proposal.unique_token,
            "renewal_link": f"https://pravyatech.com/p/{renewal_proposal.unique_token}",
            "renewal_date": renewal_proposal.renewal_date
        }
    }
```

#### D. Renewal History & Lineage

**⚠️ IMPORTANT:**
- Track proposal lineage (original → renewal → renewal)
- Show all versions in proposal details
- Allow admin to view all versions

```python
# Add to proposals table
class Proposal(Base):
    # ... existing fields ...
    previous_proposal_id = Column(Integer, ForeignKey("proposals.id"), nullable=True)
    renewal_of_id = Column(Integer, ForeignKey("proposals.id"), nullable=True)

# View all proposals in a line
@router.get("/api/proposals/{proposal_id}/lineage")
async def get_proposal_lineage(proposal_id: int, db: AsyncSession):
    """Get all related proposals (original, renewals, etc.)"""
    
    # Find the root proposal
    proposal = await db.get(Proposal, proposal_id)
    
    lineage = []
    current_id = proposal.previous_proposal_id or proposal_id
    
    # Walk backwards to find root
    while current_id:
        current = await db.get(Proposal, current_id)
        if not current:
            break
        current_id = current.previous_proposal_id
    
    # Now walk forward from root
    current_id = current_id or proposal_id
    while True:
        current = await db.get(Proposal, current_id)
        if not current:
            break
        
        lineage.append({
            "id": current.id,
            "proposal_no": current.proposal_no,
            "status": current.status,
            "created_at": current.created_at,
            "renewal_date": current.renewal_date
        })
        
        # Find next renewal
        result = await db.execute(
            "SELECT id FROM proposals WHERE renewal_of_id = :id",
            {"id": current.id}
        )
        next_id = result.scalar_one_or_none()
        if not next_id:
            break
        current_id = next_id
    
    return {"lineage": lineage}
```

#### E. Automated Renewal Reminders

**⚠️ IMPORTANT:**
- Send email 30 days before renewal
- Send reminder 7 days before
- Send urgent notification on day of renewal

```python
# backend/app/tasks/renewal_reminders.py

from apscheduler.schedulers.asyncio import AsyncIOScheduler
from datetime import datetime, timedelta

class RenewalReminders:
    @staticmethod
    async def send_renewal_reminders(db: AsyncSession):
        """Scheduled task to send renewal reminders"""
        
        today = datetime.now().date()
        
        # 30 days reminder
        date_30_days = today + timedelta(days=30)
        renewals_30 = await RenewalService.get_renewals_at_date(db, date_30_days)
        for renewal in renewals_30:
            await send_email(
                to=renewal.email,
                subject=f"Contract Renewal Reminder - {renewal.proposal_no}",
                template="renewal_reminder_30days",
                data={"renewal": renewal}
            )
        
        # 7 days reminder
        date_7_days = today + timedelta(days=7)
        renewals_7 = await RenewalService.get_renewals_at_date(db, date_7_days)
        for renewal in renewals_7:
            await send_email(
                to=renewal.email,
                subject=f"⚠️ Urgent: Contract Renewal in 7 Days - {renewal.proposal_no}",
                template="renewal_reminder_7days",
                data={"renewal": renewal}
            )
        
        # Overdue reminders
        overdue = await RenewalService.get_overdue_renewals(db)
        for renewal in overdue:
            await send_email(
                to=renewal.email,
                subject=f"🔴 OVERDUE: Contract Renewal Required - {renewal.proposal_no}",
                template="renewal_overdue",
                data={"renewal": renewal}
            )

# Schedule the task (run daily)
scheduler = AsyncIOScheduler()
scheduler.add_job(RenewalReminders.send_renewal_reminders, 'cron', hour=9, minute=0)
```

#### F. Renewal Analytics

**⚠️ IMPORTANT:**
- Track renewal rate (% of proposals renewed)
- Identify proposals not renewed
- Revenue impact of renewals

```python
@router.get("/api/analytics/renewals")
async def get_renewal_analytics(db: AsyncSession):
    """Get renewal statistics"""
    
    # Total quotations sent
    total_quotations = await db.execute(
        "SELECT COUNT(*) FROM proposals WHERE type = 'quotation_proposal'"
    )
    total = total_quotations.scalar()
    
    # Accepted quotations
    accepted = await db.execute(
        "SELECT COUNT(*) FROM proposals WHERE type = 'quotation_proposal' AND status = 'accepted'"
    )
    accepted_count = accepted.scalar()
    
    # Renewed quotations
    renewed = await db.execute(
        "SELECT COUNT(*) FROM proposals WHERE type = 'quotation_proposal' AND status = 'renewed'"
    )
    renewed_count = renewed.scalar()
    
    # Revenue from renewals
    renewal_revenue = await db.execute(
        """
        SELECT SUM(amount) FROM proposals 
        WHERE type = 'quotation_proposal' AND status = 'renewed'
        """
    )
    revenue = renewal_revenue.scalar() or 0
    
    return {
        "total_quotations": total,
        "accepted_count": accepted_count,
        "renewed_count": renewed_count,
        "acceptance_rate": f"{(accepted_count/total*100):.1f}%" if total > 0 else "0%",
        "renewal_rate": f"{(renewed_count/total*100):.1f}%" if total > 0 else "0%",
        "renewal_revenue": float(revenue)
    }
```

### ✅ CRITICAL Components

- Renewal eligibility detection
- One-click renewal creation
- Original proposal duplication
- New token generation
- Renewal date calculation
- Status update to `renewed`
- Preserve proposal lineage/history
- Renewal dashboard with overdue/due soon views

### ⚠️ IMPORTANT Components

- Renewal reminders (30/7/0 days)
- Proposal version history tracking
- Automated renewal check (daily job)
- Email notifications
- Renewal analytics
- Renewal revenue tracking
- Bulk renewal operations

### 💡 OPTIONAL Components

- Renewal rate visualization
- Revenue forecasting
- Churn analysis
- Renewal success prediction
- Automatic renewal scheduling
- Client renewal preferences

### 🔧 Tech Implementation Details

- APScheduler for background jobs
- Email service integration
- Proposal lineage tracking
- Date arithmetic (timedelta)
- Aggregate analytics queries
- Email template management

### 📊 Dependencies & Prerequisites

- Backend APIs from Phase 7
- Email service configured
- APScheduler library
- Frontend pages from Phase 3
- Proposal history tracking

### ⏱️ Estimated Timeline: 7-10 days

---

---

## 💡 PHASE 9: Analytics, Reporting & Admin Enhancements
**Duration:** 1.5 weeks | **Status:** Business Intelligence  
**Objective:** Build comprehensive analytics and reporting system

### 📌 What to Do

#### A. Proposal Analytics Dashboard

**⚠️ IMPORTANT:**

```jsx
// frontend/src/pages/AnalyticsDashboardPage.jsx

export default function AnalyticsDashboardPage() {
  const { data: analytics } = useQuery({
    queryKey: ['analytics'],
    queryFn: () => api.get('/analytics/dashboard')
  });
  
  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">Analytics & Reports</h1>
      
      {/* Key Metrics */}
      <div className="grid grid-cols-4 gap-4 mb-6">
        <MetricCard
          title="Total Proposals"
          value={analytics?.total_proposals}
          icon="📊"
        />
        <MetricCard
          title="Acceptance Rate"
          value={analytics?.acceptance_rate}
          icon="✅"
        />
        <MetricCard
          title="Revenue"
          value={`₹${analytics?.total_revenue?.toLocaleString()}`}
          icon="💰"
        />
        <MetricCard
          title="Avg Response Time"
          value={analytics?.avg_response_time}
          icon="⏱️"
        />
      </div>
      
      {/* Charts */}
      <div className="grid grid-cols-2 gap-6 mb-6">
        <ChartCard title="Proposals by Status">
          <StatusChart data={analytics?.status_distribution} />
        </ChartCard>
        
        <ChartCard title="Proposals Over Time">
          <TrendChart data={analytics?.monthly_proposals} />
        </ChartCard>
      </div>
      
      <div className="grid grid-cols-2 gap-6">
        <ChartCard title="Client Engagement">
          <EngagementChart data={analytics?.engagement_metrics} />
        </ChartCard>
        
        <ChartCard title="Revenue by Type">
          <RevenueChart data={analytics?.revenue_by_type} />
        </ChartCard>
      </div>
    </div>
  );
}

function MetricCard({ title, value, icon }) {
  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <div className="text-3xl mb-2">{icon}</div>
      <div className="text-gray-600 text-sm">{title}</div>
      <div className="text-2xl font-bold">{value || '—'}</div>
    </div>
  );
}
```

#### B. Backend Analytics Endpoints

**⚠️ IMPORTANT:**

```python
# backend/app/api/routes/analytics.py

@router.get("/api/analytics/dashboard")
async def get_dashboard_analytics(db: AsyncSession):
    """Get complete analytics dashboard data"""
    
    # Total proposals
    total = await db.execute("SELECT COUNT(*) FROM proposals")
    total_proposals = total.scalar()
    
    # Acceptance rate
    accepted = await db.execute(
        "SELECT COUNT(*) FROM proposals WHERE status = 'accepted'"
    )
    accepted_count = accepted.scalar()
    
    # Revenue
    revenue = await db.execute(
        "SELECT SUM(amount) FROM proposals WHERE status = 'accepted'"
    )
    total_revenue = revenue.scalar() or 0
    
    # Status distribution
    status_dist = await db.execute(
        """
        SELECT status, COUNT(*) as count 
        FROM proposals 
        GROUP BY status
        """
    )
    status_distribution = {row[0]: row[1] for row in status_dist}
    
    # Monthly proposals
    monthly = await db.execute(
        """
        SELECT DATE_TRUNC('month', created_at) as month, COUNT(*) as count
        FROM proposals
        GROUP BY month
        ORDER BY month
        """
    )
    monthly_proposals = [
        {"month": row[0].strftime('%b %Y'), "count": row[1]} 
        for row in monthly
    ]
    
    # Average response time (days to view)
    avg_response = await db.execute(
        """
        SELECT AVG(DATEDIFF(first_opened_at, sent_at)) as days
        FROM proposals
        WHERE first_opened_at IS NOT NULL
        """
    )
    avg_days = avg_response.scalar() or 0
    
    # Top clients by proposals
    top_clients = await db.execute(
        """
        SELECT company_name, COUNT(*) as count
        FROM proposals
        GROUP BY company_name
        ORDER BY count DESC
        LIMIT 10
        """
    )
    
    # View rate (proposals viewed / total)
    view_rate = (
        sum(1 for p in status_distribution.values() 
            if p != 'sent') / total_proposals * 100
        if total_proposals > 0 else 0
    )
    
    return {
        "total_proposals": total_proposals,
        "accepted_count": accepted_count,
        "acceptance_rate": f"{(accepted_count/total_proposals*100):.1f}%" if total_proposals > 0 else "0%",
        "view_rate": f"{view_rate:.1f}%",
        "total_revenue": float(total_revenue),
        "avg_response_time": f"{int(avg_days)} days",
        "status_distribution": status_distribution,
        "monthly_proposals": monthly_proposals,
        "top_clients": [{"name": row[0], "count": row[1]} for row in top_clients]
    }

@router.get("/api/analytics/proposals/{proposal_id}")
async def get_proposal_analytics(proposal_id: int, db: AsyncSession):
    """Get detailed analytics for single proposal"""
    
    proposal = await db.get(Proposal, proposal_id)
    
    # View events
    views = await db.execute(
        "SELECT viewed_at, ip_address, user_agent FROM proposal_views WHERE proposal_id = :id ORDER BY viewed_at DESC",
        {"id": proposal_id}
    )
    view_events = [
        {
            "timestamp": row[0],
            "ip": row[1],
            "device": row[2]
        }
        for row in views
    ]
    
    # Time to first view
    days_to_view = None
    if proposal.first_opened_at:
        delta = proposal.first_opened_at - proposal.sent_at
        days_to_view = delta.days
    
    return {
        "proposal_no": proposal.proposal_no,
        "sent_at": proposal.sent_at,
        "first_opened_at": proposal.first_opened_at,
        "last_opened_at": proposal.last_opened_at,
        "view_count": proposal.view_count,
        "days_to_first_view": days_to_view,
        "view_events": view_events,
        "acceptance_status": proposal.status == 'accepted'
    }
```

#### C. Report Generation

**⚠️ IMPORTANT:**
- Generate PDF reports
- Export to Excel
- Schedule reports (email)

```python
# backend/app/utils/report_generator.py

class ReportGenerator:
    @staticmethod
    async def generate_monthly_report(month: str, db: AsyncSession) -> BytesIO:
        """Generate PDF monthly report"""
        
        from reportlab.lib.pagesizes import letter
        from reportlab.platypus import SimpleDocTemplate, Table, Paragraph
        
        buffer = BytesIO()
        doc = SimpleDocTemplate(buffer, pagesize=letter)
        story = []
        
        # Get data for month
        data = await get_monthly_data(month, db)
        
        # Build report
        story.append(Paragraph(f"Monthly Report - {month}", styles['Title']))
        
        # Summary table
        summary_data = [
            ['Metric', 'Value'],
            ['Total Proposals', str(data['total'])],
            ['Accepted', f"{data['accepted']} ({data['acceptance_rate']:.1f}%)"],
            ['Revenue', f"₹{data['revenue']:,.0f}"],
            ['Avg Response Time', f"{data['avg_response']:.0f} days"],
        ]
        
        table = Table(summary_data)
        story.append(table)
        
        doc.build(story)
        buffer.seek(0)
        return buffer
    
    @staticmethod
    async def export_to_excel(proposals: list) -> BytesIO:
        """Export proposals to Excel"""
        
        from openpyxl import Workbook
        from openpyxl.styles import Font, PatternFill
        
        wb = Workbook()
        ws = wb.active
        ws.title = "Proposals"
        
        # Headers
        headers = ['No.', 'Proposal #', 'Client', 'Company', 'Type', 'Amount', 'Status', 'Views', 'Created']
        for col, header in enumerate(headers, 1):
            cell = ws.cell(row=1, column=col)
            cell.value = header
            cell.font = Font(bold=True)
            cell.fill = PatternFill(start_color="1F4788", end_color="1F4788", fill_type="solid")
            cell.font = Font(bold=True, color="FFFFFF")
        
        # Data rows
        for row, proposal in enumerate(proposals, 2):
            ws.cell(row=row, column=1).value = row - 1
            ws.cell(row=row, column=2).value = proposal.proposal_no
            ws.cell(row=row, column=3).value = proposal.client_name
            ws.cell(row=row, column=4).value = proposal.company_name
            ws.cell(row=row, column=5).value = proposal.type
            ws.cell(row=row, column=6).value = proposal.amount
            ws.cell(row=row, column=7).value = proposal.status
            ws.cell(row=row, column=8).value = proposal.view_count
            ws.cell(row=row, column=9).value = proposal.created_at.date()
        
        buffer = BytesIO()
        wb.save(buffer)
        buffer.seek(0)
        return buffer

@router.get("/api/reports/monthly/{month}")
async def get_monthly_report(month: str, db: AsyncSession):
    """Download monthly PDF report"""
    report = await ReportGenerator.generate_monthly_report(month, db)
    return StreamingResponse(report, media_type="application/pdf", filename=f"Report-{month}.pdf")

@router.get("/api/reports/export-excel")
async def export_proposals_excel(db: AsyncSession):
    """Export all proposals to Excel"""
    proposals = await db.execute("SELECT * FROM proposals")
    export = await ReportGenerator.export_to_excel(proposals.scalars())
    return StreamingResponse(export, media_type="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", filename="Proposals.xlsx")
```

#### D. Audit Logs & Activity Timeline

**⚠️ IMPORTANT:**

```jsx
// frontend/src/pages/AuditLogPage.jsx

export default function AuditLogPage() {
  const { data: logs } = useQuery({
    queryKey: ['audit-logs'],
    queryFn: () => api.get('/admin/audit-logs')
  });
  
  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">Activity Audit Log</h1>
      
      <div className="space-y-4">
        {logs?.data?.map(log => (
          <div key={log.id} className="bg-white p-4 rounded-lg shadow border-l-4 border-blue-500">
            <div className="flex justify-between items-start">
              <div>
                <p className="font-semibold">{log.action}</p>
                <p className="text-sm text-gray-600">{log.description}</p>
                <p className="text-xs text-gray-500 mt-1">
                  Proposal: {log.proposal_no} | Admin: {log.admin_name}
                </p>
              </div>
              <div className="text-right">
                <p className="text-sm text-gray-700">{log.timestamp}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
```

#### E. Email Digest & Notifications

**⚠️ IMPORTANT:**

```python
# backend/app/services/notifications.py

class NotificationService:
    @staticmethod
    async def send_daily_digest(admin_email: str, db: AsyncSession):
        """Send daily digest email to admin"""
        
        today = datetime.now().date()
        
        # Get today's stats
        new_proposals = await db.execute(
            "SELECT COUNT(*) FROM proposals WHERE DATE(created_at) = :date",
            {"date": today}
        )
        
        new_views = await db.execute(
            "SELECT COUNT(*) FROM proposal_views WHERE DATE(viewed_at) = :date",
            {"date": today}
        )
        
        acceptances = await db.execute(
            "SELECT COUNT(*) FROM acceptance_records WHERE DATE(accepted_at) = :date",
            {"date": today}
        )
        
        upcoming_renewals = await db.execute(
            "SELECT COUNT(*) FROM proposals WHERE renewal_date = DATE_ADD(:date, INTERVAL 7 DAY)",
            {"date": today}
        )
        
        email_body = f"""
        <h2>📊 Daily Digest - {today.strftime('%d %B %Y')}</h2>
        
        <p>Good morning! Here's your daily summary:</p>
        
        <ul>
          <li><b>New Proposals:</b> {new_proposals.scalar()}</li>
          <li><b>Proposal Views:</b> {new_views.scalar()}</li>
          <li><b>Acceptances:</b> {acceptances.scalar()}</li>
          <li><b>Renewals Due Soon (7 days):</b> {upcoming_renewals.scalar()}</li>
        </ul>
        """
        
        await send_email(
            to=admin_email,
            subject=f"📊 Daily Digest - {today.strftime('%d %B %Y')}",
            html_content=email_body
        )
```

#### F. Client Engagement Heatmap

**💡 OPTIONAL:**

```jsx
// Show engagement metrics by client
export function ClientEngagementHeatmap({ clients }) {
  const [heatmapData, setHeatmapData] = useState([]);
  
  useEffect(() => {
    // Fetch engagement data and calculate heatmap
    const data = clients.map(client => ({
      name: client.name,
      proposals_sent: client.proposal_count,
      acceptance_rate: client.acceptance_rate,
      avg_views: client.avg_views,
      response_time: client.avg_response_time
    }));
    setHeatmapData(data);
  }, [clients]);
  
  return (
    <div className="heatmap">
      {/* Visualization of client engagement */}
    </div>
  );
}
```

### ✅ CRITICAL Components

- Proposal analytics dashboard
- Key metrics (total, acceptance rate, revenue)
- Status distribution charts
- Monthly trend charts
- Proposal-level analytics

### ⚠️ IMPORTANT Components

- Audit logging for all actions
- Activity timeline
- Monthly/custom period reports
- Excel export functionality
- Email digest notifications
- Client engagement metrics
- Response time analytics
- Revenue analytics

### 💡 OPTIONAL Components

- Advanced data visualization
- Custom report builder
- Predictive analytics
- Churn prediction
- Client lifetime value
- Seasonal trends
- Comparative analysis

### 🔧 Tech Implementation Details

- Recharts for charts
- ReportLab for PDF reports
- openpyxl for Excel export
- Aggregate SQL queries
- Date grouping and filtering
- Email template system

### 📊 Dependencies & Prerequisites

- Charting library (Recharts, Chart.js)
- Report generation libraries
- Email service configured
- Analytics data available
- Admin dashboard from Phase 3

### ⏱️ Estimated Timeline: 7-10 days

---

---

## ✅ PHASE 10: Testing, Optimization, Deployment & Post-Launch Support
**Duration:** 2 weeks | **Status:** Final Phase  
**Objective:** Test, optimize, deploy to production, and ensure system stability

### 📌 What to Do

#### A. Backend Testing

**✅ CRITICAL:**

```python
# backend/tests/test_proposals.py
import pytest
from httpx import AsyncClient
from app.main import app

@pytest.mark.asyncio
async def test_create_proposal():
    """Test creating a proposal"""
    async with AsyncClient(app=app, base_url="http://test") as client:
        response = await client.post("/api/proposals", json={
            "type": "quotation_proposal",
            "client_name": "Test Client",
            "company_name": "Test Company",
            "email": "test@example.com",
            "phone": "1234567890",
            "project_title": "Test Project",
            "amount": 50000,
            "currency": "INR"
        })
        
        assert response.status_code == 200
        assert response.json()["success"] == True
        assert "unique_token" in response.json()["data"]

@pytest.mark.asyncio
async def test_generate_pdf():
    """Test PDF generation"""
    # Create proposal first
    proposal = await create_test_proposal()
    
    async with AsyncClient(app=app, base_url="http://test") as client:
        response = await client.post(
            f"/api/proposals/{proposal.id}/generate-pdf",
            headers={"Authorization": f"Bearer {test_token}"}
        )
        
        assert response.status_code == 200
        assert response.json()["success"] == True
        assert response.json()["pdf_path"] is not None

@pytest.mark.asyncio
async def test_proposal_tracking():
    """Test proposal view tracking"""
    proposal = await create_test_proposal()
    
    async with AsyncClient(app=app, base_url="http://test") as client:
        # Access proposal public page
        response = await client.get(f"/p/{proposal.unique_token}")
        
        assert response.status_code == 200
        
        # Verify view was recorded
        proposal_db = await db.get(Proposal, proposal.id)
        assert proposal_db.view_count == 1
        assert proposal_db.status == 'viewed'

@pytest.mark.asyncio
async def test_quote_acceptance():
    """Test quote acceptance flow"""
    proposal = await create_test_proposal()
    
    async with AsyncClient(app=app, base_url="http://test") as client:
        response = await client.post(
            f"/api/proposals/{proposal.unique_token}/accept",
            json={
                "client_name": "John Doe",
                "client_email": "john@example.com",
                "client_phone": "1234567890",
                "company": "Test Company"
            }
        )
        
        assert response.status_code == 200
        assert response.json()["success"] == True
        
        # Verify acceptance was recorded
        proposal_db = await db.get(Proposal, proposal.id)
        assert proposal_db.status == 'accepted'

@pytest.mark.asyncio
async def test_renewal_creation():
    """Test one-click renewal"""
    proposal = await create_test_proposal(status='accepted')
    
    async with AsyncClient(app=app, base_url="http://test") as client:
        response = await client.post(
            f"/api/proposals/{proposal.id}/renew",
            headers={"Authorization": f"Bearer {test_token}"}
        )
        
        assert response.status_code == 200
        assert response.json()["success"] == True
        assert "renewal_proposal" in response.json()
        
        # Verify original marked as renewed
        original = await db.get(Proposal, proposal.id)
        assert original.status == 'renewed'
```

#### B. Frontend Testing

**⚠️ IMPORTANT:**

```jsx
// frontend/src/__tests__/pages/ProposalsListPage.test.jsx
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import ProposalsListPage from '../../pages/ProposalsListPage';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

describe('ProposalsListPage', () => {
  it('should render proposals list', async () => {
    const queryClient = new QueryClient();
    
    render(
      <QueryClientProvider client={queryClient}>
        <ProposalsListPage />
      </QueryClientProvider>
    );
    
    await waitFor(() => {
      expect(screen.getByText(/proposals/i)).toBeInTheDocument();
    });
  });
  
  it('should filter proposals by status', async () => {
    render(
      <QueryClientProvider client={queryClient}>
        <ProposalsListPage />
      </QueryClientProvider>
    );
    
    const statusSelect = screen.getByDisplayValue('All Status');
    await userEvent.selectOptions(statusSelect, 'accepted');
    
    await waitFor(() => {
      expect(screen.getByText(/accepted/i)).toBeInTheDocument();
    });
  });
});
```

#### C. Performance Optimization

**⚠️ IMPORTANT:**

##### Database Optimization:
```python
# Add proper indexes
CREATE INDEX idx_proposals_status ON proposals(status);
CREATE INDEX idx_proposals_renewal_date ON proposals(renewal_date);
CREATE INDEX idx_proposals_email ON proposals(email);
CREATE INDEX idx_proposal_views_proposal ON proposal_views(proposal_id);
CREATE INDEX idx_acceptance_records_proposal ON acceptance_records(proposal_id);
```

##### Query Optimization:
```python
# Use select() for only needed columns
from sqlalchemy import select

# Instead of full row
proposals = await db.execute(
    select(Proposal.id, Proposal.proposal_no, Proposal.status)
    .where(Proposal.status == 'sent')
)

# Add caching for frequently accessed data
from functools import lru_cache

@lru_cache(maxsize=128)
async def get_company_profile_content():
    """Cache company profile content"""
    pass
```

##### Frontend Optimization:
- Code splitting
- Lazy loading components
- Image optimization
- CSS minification
- Tree shaking unused code

#### D. Security Audit

**✅ CRITICAL:**

```python
# backend/app/security/audit.py

class SecurityAudit:
    checks = [
        "SQL Injection prevention (SQLAlchemy ORM)",
        "XSS prevention (HTML escaping)",
        "CSRF protection (if form-based)",
        "Rate limiting on auth endpoints",
        "Password complexity requirements",
        "JWT token expiration",
        "HTTPS enforcement",
        "CORS properly configured",
        "Sensitive data not logged",
        "Input validation on all endpoints"
    ]

# Security headers
from fastapi.middleware import CORSMiddleware

app.add_middleware(
    CORSMiddleware,
    allow_origins=["https://pravyatech.com"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Add security headers
@app.middleware("http")
async def add_security_headers(request, call_next):
    response = await call_next(request)
    response.headers["X-Content-Type-Options"] = "nosniff"
    response.headers["X-Frame-Options"] = "DENY"
    response.headers["X-XSS-Protection"] = "1; mode=block"
    return response
```

#### E. Deployment Setup

**✅ CRITICAL:**

##### Docker Setup:
```dockerfile
# backend/Dockerfile
FROM python:3.11-slim

WORKDIR /app

COPY requirements.txt .
RUN pip install -r requirements.txt

COPY . .

CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]

# frontend/Dockerfile
FROM node:20-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .
RUN npm run build

EXPOSE 3000
CMD ["npm", "run", "preview"]
```

##### Docker Compose:
```yaml
# docker-compose.yml
version: '3.8'

services:
  postgres:
    image: postgres:15-alpine
    environment:
      POSTGRES_DB: pravya_db
      POSTGRES_USER: pravya_user
      POSTGRES_PASSWORD: ${DB_PASSWORD}
    volumes:
      - postgres_data:/var/lib/postgresql/data

  backend:
    build: ./backend
    ports:
      - "8000:8000"
    environment:
      DATABASE_URL: postgresql+asyncpg://pravya_user:${DB_PASSWORD}@postgres/pravya_db
      SECRET_KEY: ${SECRET_KEY}
    depends_on:
      - postgres
    volumes:
      - ./backend:/app

  frontend:
    build: ./frontend
    ports:
      - "3000:3000"
    depends_on:
      - backend

volumes:
  postgres_data:
```

##### Environment Configuration:
```bash
# .env.example
DATABASE_URL=postgresql+asyncpg://user:pass@localhost/pravya_db
SECRET_KEY=your-secret-key-here
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30
DEBUG=False
```

##### Nginx Configuration:
```nginx
# nginx.conf
upstream backend {
    server backend:8000;
}

upstream frontend {
    server frontend:3000;
}

server {
    listen 80;
    server_name pravyatech.com www.pravyatech.com;

    # Redirect HTTP to HTTPS
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name pravyatech.com www.pravyatech.com;

    ssl_certificate /etc/letsencrypt/live/pravyatech.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/pravyatech.com/privkey.pem;

    # Frontend
    location / {
        proxy_pass http://frontend;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }

    # Backend API
    location /api/ {
        proxy_pass http://backend;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    # Public PDF viewer
    location /p/ {
        proxy_pass http://backend;
        proxy_set_header Host $host;
    }
}
```

#### F. Database Migration Strategy

**⚠️ IMPORTANT:**

```bash
# Run migrations before deployment
alembic upgrade head

# Backup production database
pg_dump pravya_db > backup_$(date +%Y%m%d).sql

# Rollback if needed
alembic downgrade -1
```

#### G. Monitoring & Logging

**⚠️ IMPORTANT:**

```python
# backend/app/core/logging.py
import logging
from logging.handlers import RotatingFileHandler

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
    handlers=[
        RotatingFileHandler('logs/app.log', maxBytes=10MB, backupCount=10),
        logging.StreamHandler()
    ]
)

logger = logging.getLogger(__name__)

# Log important events
logger.info(f"Proposal created: {proposal.proposal_no}")
logger.error(f"PDF generation failed for proposal {proposal_id}")
logger.warning(f"Renewal date approaching for proposal {proposal.proposal_no}")

# Health check endpoint
@router.get("/health")
async def health_check():
    """API health check"""
    return {"status": "healthy", "timestamp": datetime.now()}
```

#### H. Backup & Recovery Plan

**⚠️ IMPORTANT:**

```bash
#!/bin/bash
# backup.sh - Daily database backup

BACKUP_DIR="/backups/pravya"
DB_NAME="pravya_db"
TIMESTAMP=$(date +%Y%m%d_%H%M%S)

# Create backup
pg_dump -U pravya_user $DB_NAME | gzip > $BACKUP_DIR/backup_$TIMESTAMP.sql.gz

# Keep last 30 days only
find $BACKUP_DIR -name "backup_*.sql.gz" -mtime +30 -delete

# Upload to S3 (optional)
aws s3 cp $BACKUP_DIR/backup_$TIMESTAMP.sql.gz s3://pravya-backups/

echo "Backup completed: backup_$TIMESTAMP.sql.gz"
```

#### I. Load Testing

**💡 OPTIONAL:**

```python
# tests/load_test.py
from locust import HttpUser, task, between

class ProposalUser(HttpUser):
    wait_time = between(1, 3)
    
    @task(3)
    def view_proposals(self):
        self.client.get("/api/proposals", headers={"Authorization": f"Bearer {token}"})
    
    @task(1)
    def create_proposal(self):
        self.client.post(
            "/api/proposals",
            json={"client_name": "Test", "company_name": "Test Co"},
            headers={"Authorization": f"Bearer {token}"}
        )
    
    @task(2)
    def view_proposal_public(self):
        self.client.get("/p/pv7x8k2m4n9q")

# Run with: locust -f tests/load_test.py --host=http://localhost:8000
```

#### J. Post-Launch Monitoring & Support

**⚠️ IMPORTANT:**

- Daily health check monitoring
- Error rate tracking
- Database backup verification
- User support channel setup
- Bug fix process
- Feature request collection

### ✅ CRITICAL Components

- Unit tests for core functions
- Integration tests for API endpoints
- Security audit checklist
- Database optimization & indexing
- Docker containerization
- Environment configuration
- HTTPS/SSL setup
- Backup & recovery procedure
- Health monitoring endpoints
- Deployment checklist

### ⚠️ IMPORTANT Components

- E2E tests for critical flows
- Performance benchmarking
- Load testing
- Security headers
- Logging & monitoring
- Error tracking (Sentry)
- Database migration strategy
- Documentation updates
- Deployment runbook
- Incident response plan

### 💡 OPTIONAL Components

- Automated testing pipeline
- Continuous deployment (CI/CD)
- Advanced monitoring (Datadog, New Relic)
- APM (Application Performance Monitoring)
- Chaos engineering tests
- Analytics & telemetry
- Cost optimization
- Multi-region deployment

### 🔧 Tech Implementation Details

- pytest for Python testing
- React Testing Library for frontend
- Locust for load testing
- Docker for containerization
- Nginx for reverse proxy
- PostgreSQL backup strategy
- Monitoring dashboards

### 📊 Pre-Launch Checklist

- [ ] All tests passing
- [ ] Security audit completed
- [ ] Performance benchmarks met
- [ ] Database optimized
- [ ] Backup strategy verified
- [ ] Monitoring configured
- [ ] Documentation complete
- [ ] Team trained
- [ ] Client communication plan
- [ ] Support process established

### ⏱️ Estimated Timeline: 10-14 days

---

---

## 📊 COMPLETE PROJECT TIMELINE

| Phase | Name | Duration | Status |
|-------|------|----------|--------|
| **1** | Project Setup & Database Design | 1 week | Foundation |
| **2** | Backend API Development | 2.5 weeks | Core |
| **3** | Admin Dashboard Frontend | 2 weeks | Admin UI |
| **4** | PDF Generation System | 2 weeks | Critical Feature |
| **5** | Client Viewer & Tracking | 1.5 weeks | Client-Facing |
| **6** | WhatsApp Integration | 1 week | Communication |
| **7** | Quote Acceptance & Status Mgmt | 1 week | Business Logic |
| **8** | Renewal Management System | 1.5 weeks | Contract Mgmt |
| **9** | Analytics & Reporting | 1.5 weeks | BI & Insights |
| **10** | Testing, Optimization & Deployment | 2 weeks | Final Phase |

**Total Estimated Duration:** 16-18 weeks (4 months)

---

## 🎯 Critical Path (Must-Do in Order)

1. **Phase 1** → Database foundation
2. **Phase 2** → Backend APIs
3. **Phase 4** → PDF generation (core business feature)
4. **Phase 3** → Admin UI (can be parallel with Phase 2-4)
5. **Phase 5** → Client viewer (public feature)
6. **Phase 7** → Status management (foundation for renewals)
7. **Phase 8** → Renewals (business requirement)
8. **Phase 6/9** → Can be parallel (share/analytics)
9. **Phase 10** → Testing & deployment

---

## 💰 Resource Estimation

- **Backend Developer:** 16-18 weeks (1 full-time)
- **Frontend Developer:** 12-14 weeks (1 full-time)
- **QA/Testing:** 2-3 weeks (parallel)
- **DevOps/Deployment:** 1-2 weeks

**Team Size:** 2-3 developers (1 backend, 1 frontend, optional QA)

---

## 🚀 Quick Start Commands

```bash
# Clone repository
git clone <repo-url>
cd pravya-proposal-system

# Backend setup
cd backend
python -m venv venv
source venv/bin/activate  # or venv\Scripts\activate on Windows
pip install -r requirements.txt
alembic upgrade head
uvicorn app.main:app --reload

# Frontend setup (new terminal)
cd frontend
npm install
npm run dev

# Docker setup
docker-compose up -d
```

---

## 📚 Documentation References

- [API Documentation](./API_DOCUMENTATION.md) - All endpoints
- [Database Schema](./DATABASE_SCHEMA.md) - Full DB structure
- [Deployment Guide](./DEPLOYMENT.md) - Production setup
- [Testing Guide](./TESTING.md) - Test strategies
- [Admin Manual](./ADMIN_MANUAL.md) - User guide

---

---

**Document Version:** 1.0  
**Last Updated:** 2026-09-11  
**Prepared by:** Vrut (Development Lead)  
**Status:** Ready for Implementation
