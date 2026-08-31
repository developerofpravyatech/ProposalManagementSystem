# UI/UX Design Specification — PRAVYA TECH Proposal Management System

## 1. Executive Summary & Design Vision

The **PRAVYA TECH Proposal Management System (PMS)** requires two distinct, high-impact user interfaces:

1. **Admin Workspace (Protected)**: A high-efficiency, data-rich command center for PRAVYA TECH staff to create, configure, share, track, and renew proposals with zero friction.
2. **Client Proposal Portal (`/p/{token}`) (Public & Tokenized)**: A breathtaking, client-facing presentation portal that looks like a high-end luxury proposal showcase, establishing immediate trust, authority, and excitement while tracking client interactions silently in real time.

---

## 2. Design System & Aesthetics

### 2.1 Theme & Color Palette

The design follows a modern **Deep Slate & Tech Indigo** theme with crisp contrast, refined glassmorphism, and distinct status indicators.

| Role | Color Name | Hex Code | Purpose |
| :--- | :--- | :--- | :--- |
| **Primary Accent** | Electric Indigo | `#6366F1` / `#4F46E5` | Primary buttons, active tabs, links, brand focus |
| **Secondary Accent** | Cyan Glow | `#06B6D4` / `#0EA5E9` | Highlights, badges, interactive elements |
| **Background (Dark)** | Obsidian Slate | `#0B0F19` | Client portal dark mode / Admin sidebar |
| **Surface (Dark)** | Carbon Blue | `#111827` / `#1E293B` | Cards, modals, tables, floating docks |
| **Background (Light)** | Crisp Off-White | `#F8FAFC` | Admin workspace main canvas |
| **Surface (Light)** | Pure White | `#FFFFFF` | Form containers, data tables, modals |
| **Success / Accepted** | Emerald | `#10B981` | Accepted status, confirmed deals, view stats |
| **Warning / Renewal** | Amber Gold | `#F59E0B` | Expiring contracts, renewal due (<30 days) |
| **Danger / Overdue** | Crimson Red | `#EF4444` | Expired quotes, overdue contracts, delete actions |
| **Neutral Text** | Slate Muted | `#64748B` / `#94A3B8` | Helper text, metadata, labels |

### 2.2 Typography

* **Primary Sans**: `Plus Jakarta Sans` or `Inter` (Clean, geometric, highly legible at all sizes).
* **Display / Headings**: `Outfit` or `Plus Jakarta Sans (SemiBold/Bold)`.
* **Monospace / Numbers & Tokens**: `JetBrains Mono` or `Fira Code` (Used for proposal IDs, tokens, currency figures, timestamps, and IP addresses).

### 2.3 Visual Polish & Micro-Interactions

* **Glassmorphism**: Subtle backdrop blur (`backdrop-blur-md bg-white/80` or `backdrop-blur-md bg-slate-900/80`) on sticky headers, floating action docks, and modals.
* **Elevation & Shadows**: Multi-layered soft shadows (`shadow-sm`, `shadow-xl`, `shadow-indigo-500/10`).
* **Motion**: Smooth transitions (150ms–250ms ease-out) on button hovers, modal entrances, accordion expansions, and step switches.

---

## 3. Architecture & User Flows

```mermaid
graph TD
    subgraph Admin_Portal [Admin Portal - Protected]
        A[Login / Auth] --> B[Admin Dashboard]
        B --> C[Proposal Wizard - Mode A/B]
        B --> D[Proposal Management Table]
        B --> E[Renewal Tracker]
        C --> F[Generated Proposal & Unique Token]
        F --> G[1-Click WhatsApp Share Modal]
        D --> H[Real-time Engagement Analytics Modal]
    end

    subgraph Client_Portal [Client Portal - Public /p/{token}]
        I[Client Opens /p/{token}] --> J[Trigger View Logging]
        J --> K[Interactive Proposal Showcase]
        K --> L[Download PDF Event]
        K --> M[WhatsApp Direct Chat]
        K --> N[Accept & Digital Sign-off Modal]
        N --> O[Status Update: Accepted]
    end

    F -.-> I
    J -.-> H
    L -.-> H
    O -.-> D
```

---

## 4. UI Specifications: Admin Workspace

### 4.1 Navigation & Global Layout

* **Sidebar (Left, Collapsible)**:
  * Brand Logo (PRAVYA TECH) + Version tag.
  * Nav items:
    * 📊 **Dashboard** (Summary metrics, recent activity)
    * 📄 **Proposals** (Full CRUD table, search & filter)
    * ➕ **Create Proposal** (Quick launch modal/wizard)
    * 🔄 **Renewals** (Contract expiry pipeline)
    * ⚙️ **Settings / Profile** (Admin profile, default templates)
  * Bottom user profile avatar + Logout trigger.

### 4.2 Dashboard Overview (`/admin/dashboard`)

* **Top Metric Cards (KPIs)**:
  1. **Total Proposals**: Count + breakdown (Company Profile vs Quotation).
  2. **Active Engagement**: Total Views + Open Rate (% opened within 48h).
  3. **Accepted Quotations**: Total Value ($ / ₹) + Conversion rate.
  4. **Renewals Due**: Count of contracts expiring in <30 days (highlighted with amber badge).
* **Live Activity Feed**: Real-time ticker showing:
  * *"Acme Corp opened proposal #PT-2026-082 2 minutes ago (Desktop, Chrome, Mumbai)"*
  * *"Client downloaded PDF for #PT-2026-079"*
  * *"Zenith Systems accepted quotation #PT-2026-074 ($12,500)"*
* **Recent Proposals Quick Table**: Last 5 created proposals with quick copy link and status badge.

### 4.3 Proposal Creator Wizard (`/admin/proposals/create`)

A clean, step-by-step or tabbed wizard that eliminates cognitive overload:

1. **Step 1: Document Mode Selection**:
   * Card A: **Company Profile (Mode A)** — 9-page standard company presentation.
   * Card B: **Project Proposal & Quotation (Mode B)** — 12-page dynamic quotation.
2. **Step 2: Client & Project Information**:
   * Client Name, Company Name, Official Email, Phone/WhatsApp Number.
   * Project Title, Subtitle/Tagline, Scope Summary.
3. **Step 3: Commercials & Line Items (Mode B Only)**:
   * Dynamic item table (Item Name, Description, Quantity, Unit Price, Tax/Discount %, Subtotal).
   * Currency selector (`INR (₹)`, `USD ($)`, `AED (د.إ)`, `EUR (€)`, `GBP (£)`).
   * Contract Duration (e.g., 6 Months, 1 Year) & Auto-calculated Renewal Date.
   * Payment terms & milestone breakdown.
4. **Step 4: Review & Generate**:
   * Live PDF / Layout preview.
   * Button: `Generate Proposal & Private Link`.

### 4.4 Proposal Management & Data Table (`/admin/proposals`)

* **Filtering & Search Bar**:
  * Instant search by Client Name, Company, Proposal #, or Token.
  * Status Filter Pills: `All`, `Sent`, `Viewed`, `Accepted`, `Renewal Due`, `Renewed`.
  * Date range selector.
* **Columns**:
  * **Proposal #** (e.g. `PT-2026-104`) + Mode badge (`Profile` vs `Quote`).
  * **Client / Company** (with contact avatar & email/phone).
  * **Value / Currency** (for Mode B quotes).
  * **Status Badge**:
    * `Sent` (Gray outline)
    * `Viewed` (Indigo filled, shows view count e.g. `3 views`)
    * `Accepted` (Emerald filled with checkmark)
    * `Renewal Due` (Amber pulsing dot)
    * `Renewed` (Blue badge)
  * **Last Opened**: Timestamp e.g. `10m ago` or `Not opened yet`.
  * **Actions Dropdown**:
    * 🔗 Copy Client Link
    * 💬 Share on WhatsApp (opens pre-filled template modal)
    * 👁️ View Analytics Details
    * 📥 Download PDF
    * 🔄 Duplicate / Renew
    * 🗑️ Archive / Delete

### 4.5 1-Click WhatsApp Sharing Modal

* **Pre-composed message preview**:
  > *"Hello [Client Name], here is the official proposal for [Project Title] from PRAVYA TECH: [https://pms.pravyatech.com/p/{token}]. Please feel free to review the line items and reach out directly if you have any questions!"*
* Editable text area for custom notes.
* Direct button: `Send via WhatsApp Web / App` (opens `https://wa.me/{phone}?text=...`).

### 4.6 Real-Time Engagement Analytics Drawer / Modal

Displays complete forensic viewing history:

* **Summary**: Total views, Unique devices, First opened at, Last opened at, PDF downloaded (Yes/No + timestamp).
* **View Event Log (Audit Trail)**:
  * Timestamp (e.g., `Aug 31, 2026 12:15 PM`)
  * Device & Browser (e.g., `Chrome 124 on macOS Desktop`, `Safari on iPhone 15`)
  * IP Address & Approximate Location (e.g., `103.21.x.x - Bangalore, IN`)
  * Action (`Page Viewed`, `PDF Downloaded`, `Quotation Accepted`)

---

## 5. UI Specifications: Client Proposal Portal (`/p/{token}`)

The client viewer is the public face of PRAVYA TECH. It must be blisteringly fast, responsive, and visually stunning.

```text
+-----------------------------------------------------------------------------+
|  [PRAVYA TECH LOGO]       Proposal #PT-2026-104       [Accepted Badge]       |
|  Actions: [ 📥 Download PDF ]  [ 💬 Chat on WhatsApp ]  [ ✍️ Accept Quote ]  |
+-----------------------------------------------------------------------------+
|                                                                             |
|  [ Cover Page / Dynamic Hero ]                                              |
|  Project: "Next-Gen Enterprise ERP & Cloud Migration"                       |
|  Prepared for: "Acme Global Industries"                                     |
|                                                                             |
|  +-----------------------------------------------------------------------+  |
|  | Document Navigation: [ Cover | Profile | Scope | Quotation | Terms ]  |  |
|  +-----------------------------------------------------------------------+  |
|                                                                             |
|  [ Interactive Proposal Document / Clean Paginated Cards ]                  |
|  - High-resolution typography, structured tables                            |
|  - Transparent line-item pricing with currency formatting                   |
|  - PRAVYA TECH Team, Case Studies, and Deliverables                         |
|                                                                             |
|  +-----------------------------------------------------------------------+  |
|  |  TOTAL INVESTMENT:  $14,500 USD                                       |  |
|  |  [ Accept & Sign Proposal Now ]                                       |  |
|  +-----------------------------------------------------------------------+  |
+-----------------------------------------------------------------------------+
|  Mobile Floating Dock: [ 📥 PDF ]   [ 💬 WhatsApp ]   [ ✍️ Accept ($14.5k) ] |
+-----------------------------------------------------------------------------+
```

### 5.1 Key Client UI Features

1. **Zero Login Barrier**: Instantly accessible via private secure token (`/p/{token}`).
2. **Sticky Header Bar**:
   * PRAVYA TECH logo and verified authenticity badge.
   * Document status (e.g., `Valid until Sept 30, 2026`).
   * Desktop CTAs: `Download PDF`, `Ask via WhatsApp`, `Accept Quotation`.
3. **Interactive Document Viewer**:
   * Mode A: 9-page smooth scrollable presentation with sticky index navigator.
   * Mode B: 12-page comprehensive quotation with interactive pricing tables, project timeline, and milestones.
4. **Digital Acceptance & Sign-off Flow**:
   * Clicking `Accept Quotation` opens a modal:
     * Signer Name & Job Title verification.
     * Digital Signature canvas (Draw signature or Type name).
     * Terms acceptance checkbox.
     * `Confirm Acceptance` button → instantly records timestamp/signature, updates DB status to `accepted`, triggers confetti animation, and notifies admin.
5. **Mobile Floating Action Dock**:
   * On mobile viewports (<768px), a sleek bottom glass bar keeps `PDF Download`, `WhatsApp`, and `Accept` accessible with single-thumb reach.
6. **Silent Tracking Integration**:
   * On component mount, sends asynchronous beacon to `/api/public/proposals/{token}/view` recording IP, User Agent, and timestamp without disrupting the client's browsing experience.

---

## 6. Responsive Breakpoint & Performance Standards

* **Mobile (< 640px)**: Single column stack, full-width buttons, sticky bottom floating action dock.
* **Tablet (640px - 1024px)**: 2-column metric cards, collapsable sidebar to icon dock.
* **Desktop (> 1024px)**: Full multi-column layout, sticky navigation sidebar, split view proposal creator.
* **Performance Budget**:
  * Client viewer first contentful paint (FCP) < 1.0s.
  * Zero external heavy dependencies on the public client viewer.
  * Mobile touch-friendly targets (minimum 44px x 44px tap targets).

---

## 7. Summary Checklist of UI States

| State | Visual Treatment |
| :--- | :--- |
| **Loading State** | Skeleton shimmer placeholders matching card and table layouts |
| **Empty State** | Modern SVG illustration + "No proposals found" + "Create your first proposal" CTA |
| **Error State** | Non-intrusive red toast notification + inline input validation indicators |
| **Accepted State** | Vibrant green banner, animated celebration confetti, and locked acceptance button |
| **Invalid/Expired Token** | Friendly 404/410 page: "Proposal Link Expired or Invalid — Contact PRAVYA TECH" |
