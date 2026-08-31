# UI/UX Specification & Design System — PRAVYA TECH PMS

## 1. Brand Identity & Color Theme
The visual design embodies **PRAVYA TECH's Official Corporate Identity**: Clean Pure White backgrounds with Deep Obsidian Black structural foundations and High-Impact Crimson Red accents.

| Palette Category | Hex Code | Purpose / UI Placement |
| :--- | :--- | :--- |
| **Canvas Background** | `#F8FAFC` & `#FFFFFF` | Main page canvas, clean cards, modal surfaces |
| **Obsidian Black** | `#0F172A` & `#09090B` | Left navigation sidebar, luxury typography, dark pills |
| **Primary Brand Red**| `#DC2626` (`brand-600`) | Primary CTA buttons, proposal glow, active highlights |
| **Accent Crimson** | `#EF4444` & `#B91C1C` | Badges, gradient headings, signature ink, logo accent |
| **Status Emerald** | `#10B981` / `#059669` | Accepted quotations, verified security shields, WhatsApp |
| **Status Amber** | `#F59E0B` / `#D97706` | Approaching contract renewals ($\le 30$ days) |
| **Borders & Dividers**| `#E2E8F0` / `#CBD5E1` | Subtle frosted glass lines, structured tables |

---

## 2. Typography Hierarchy
* **Display / Brand Headings**: `Outfit` (`500`, `700`, `900`) — high-tech, modern corporate geometry.
* **Body & Labels**: `Plus Jakarta Sans` / `Inter` (`400`, `500`, `600`, `700`) — ultra-crisp readability.
* **Financial & Telemetry Code**: `JetBrains Mono` (`500`, `700`) — proposal numbers, dates, currency amounts, IP logs.

---

## 3. Component Architecture
1. **Navigation & Sidebar (`Sidebar.jsx`)**:
   - Deep Obsidian Black background (`bg-slate-950`) with White typography.
   - Branded Monogram Insignia: `P (White) T (Crimson Red)`.
   - Active navigation item in Crimson Red (`bg-brand-600 shadow-glow-red`).
2. **Cards & Glassmorphism (`Card.jsx`, `index.css`)**:
   - Pure White frosted cards (`bg-white/92 border-slate-200 shadow-card-light`).
   - Crimson red hover focus border (`hover:border-red-500/30 hover:shadow-card-hover`).
3. **Buttons (`Button.jsx`)**:
   - `primary`: Crimson Red (`bg-brand-600 hover:bg-brand-700 text-white shadow-brand-600/25`).
   - `secondary`: Obsidian Black (`bg-slate-900 hover:bg-slate-800 text-white`).
   - `outline`: Crisp White with slate border (`bg-white hover:bg-slate-50 text-slate-800 border-slate-300`).
   - `whatsapp`: Emerald Green (`bg-emerald-600 hover:bg-emerald-500 text-white`).
4. **Client Portal (`/p/:token`)**:
   - Verified brand header with security shield.
   - Clean 9-page / 12-page presentation deck with interactive section jumpers.
   - Interactive pricing and line item breakdown.
   - Digital signature modal with custom canvas draw pad (Crimson Red ink) and celebratory multi-color confetti.
   - Sticky mobile floating action dock for 1-tap PDF & WhatsApp actions.
