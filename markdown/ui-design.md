# UI/UX Specification & Design System — PRAVYA TECH PMS

## 1. Brand Identity & Color Theme

The visual design embodies **PRAVYA TECH's official corporate identity**: clean pure-white backgrounds with deep obsidian-black structural foundations and high-impact crimson-red accents.

| Palette Category       | Hex Code                | Purpose / UI Placement                                             |
| ---------------------- | ----------------------- | ------------------------------------------------------------------ |
| **Canvas Background**  | `#F8FAFC` / `#FFFFFF`   | Main page canvas, clean cards, modal surfaces                      |
| **Obsidian Black**     | `#0F172A` / `#09090B`   | Left navigation sidebar, premium typography, dark pills            |
| **Primary Brand Red**  | `#DC2626` (`brand-600`) | Primary CTA buttons, proposal highlights, active navigation states |
| **Accent Crimson**     | `#EF4444` / `#B91C1C`   | Badges, gradient headings, signature ink, logo accents             |
| **Status Emerald**     | `#10B981` / `#059669`   | Accepted quotations, verified security shields, WhatsApp actions   |
| **Status Amber**       | `#F59E0B` / `#D97706`   | Approaching contract renewals (`≤ 30 days`)                        |
| **Borders & Dividers** | `#E2E8F0` / `#CBD5E1`   | Subtle frosted-glass borders, dividers, structured tables          |

---

## 2. Typography Hierarchy

### Display / Brand Headings

Use **Outfit** with the following font weights:

* `500` — Medium
* `700` — Bold
* `900` — Black

Outfit should be used for high-visibility headings, page titles, brand elements, and major dashboard metrics.

### Body & Labels

Use **Plus Jakarta Sans** or **Inter** with the following font weights:

* `400` — Regular
* `500` — Medium
* `600` — Semi-Bold
* `700` — Bold

These fonts should be used for body text, labels, navigation items, form fields, tables, buttons, and supporting UI content.

### Financial & Telemetry Data

Use **JetBrains Mono** with:

* `500` — Medium
* `700` — Bold

JetBrains Mono should be used for:

* Proposal numbers
* Proposal IDs
* Dates and timestamps
* Currency amounts
* Financial calculations
* IP addresses
* Security logs
* System telemetry
* Technical identifiers

---

## 3. Component Architecture

### 3.1 Navigation & Sidebar — `Sidebar.jsx`

The primary application navigation should use a dark, premium visual foundation.

#### Design Requirements

* Background: Deep Obsidian Black

  * `bg-slate-950`
* Primary text: White
* Secondary text: Slate/gray
* Sidebar should maintain strong contrast against the white application canvas.
* Use subtle borders/dividers where required.
* Navigation items should have consistent spacing and rounded corners.

#### Brand Monogram

Create a branded monogram insignia:

* `P` — White
* `T` — Crimson Red

Example visual treatment:

**P** **T**

The monogram should be prominently displayed at the top of the sidebar alongside the PRAVYA TECH branding.

#### Active Navigation Item

The currently selected navigation item should use:

* Background: `bg-brand-600`
* Text: White
* Optional glow: `shadow-glow-red`
* Border/radius: Consistent with the overall component system

The active state must be visually obvious without being excessively bright or distracting.

---

### 3.2 Cards & Glassmorphism — `Card.jsx` / `index.css`

Cards should follow a clean, premium, lightweight glassmorphism-inspired appearance.

#### Default Card

Use:

* Background: `bg-white/92`
* Border: `border-slate-200`
* Shadow: `shadow-card-light`
* Border radius: Consistent rounded design
* Backdrop blur where appropriate

Cards should feel clean and elevated without looking overly heavy.

#### Hover State

On interactive cards:

* Border: `hover:border-red-500/30`
* Shadow: `hover:shadow-card-hover`
* Transition: Smooth and subtle

Avoid excessive animations or large movements on hover.

#### Card Guidelines

Cards should:

* Have consistent internal padding.
* Maintain clear visual hierarchy.
* Use subtle borders instead of heavy outlines.
* Support responsive layouts.
* Preserve accessibility contrast.
* Avoid unnecessary gradients.

---

### 3.3 Buttons — `Button.jsx`

All buttons must follow a consistent variant-based component architecture.

#### Primary Button

Use for the most important actions.

```text
Background: bg-brand-600
Hover: bg-brand-700
Text: text-white
Shadow: shadow-brand-600/25
```

Typical usage:

* Create Proposal
* Send Proposal
* Generate PDF
* Save Changes
* Submit
* Approve

---

#### Secondary Button

Use for important secondary actions.

```text
Background: bg-slate-900
Hover: bg-slate-800
Text: text-white
```

Typical usage:

* Preview
* Manage
* View Details
* Export

---

#### Outline Button

Use for neutral or tertiary actions.

```text
Background: bg-white
Hover: bg-slate-50
Text: text-slate-800
Border: border-slate-300
```

Typical usage:

* Cancel
* Back
* Close
* Filter
* Reset

---

#### WhatsApp Button

Use for WhatsApp communication actions.

```text
Background: bg-emerald-600
Hover: bg-emerald-500
Text: text-white
```

Typical usage:

* Send via WhatsApp
* Contact Client
* Share Proposal via WhatsApp

The emerald treatment should clearly communicate a successful communication/action state.

---

## 4. Client Portal — `/p/:token`

The Client Portal is the public-facing proposal experience and should feel significantly more polished and presentation-oriented than the internal administration dashboard.

### 4.1 Secure Brand Header

The portal should begin with a branded header containing:

* PRAVYA TECH branding
* Proposal/client information
* Verified security indicator
* Security shield icon
* Clear trust messaging
* Responsive mobile layout

The security indicator should use the **Status Emerald** color palette.

Example:

```text
✓ Verified Proposal
```

The security indicator should communicate that the proposal link is secure and verified without making unsupported security claims.

---

### 4.2 Proposal Presentation Deck

The Client Portal should support a presentation-style proposal experience.

Supported presentation lengths:

* 9-page proposal
* 12-page proposal

The presentation should contain clearly separated sections with smooth navigation.

#### Section Navigation

Provide interactive section jumpers that allow the client to quickly navigate between major proposal sections.

Possible sections include:

1. Cover
2. Introduction
3. Project Overview
4. Scope of Work
5. Deliverables
6. Timeline
7. Pricing
8. Terms & Conditions
9. Approval / Signature

Additional sections may be included for the 12-page proposal format.

---

### 4.3 Interactive Pricing

Pricing should be presented clearly and professionally.

The portal should support:

* Total project price
* Individual line items
* Quantity
* Unit price
* Subtotal
* Discounts
* Taxes, where applicable
* Final total
* Optional items
* Included/excluded indicators

Financial values should use **JetBrains Mono** for improved numerical alignment and readability.

Example structure:

| Item            | Qty | Unit Price |       Total |
| --------------- | --: | ---------: | ----------: |
| UI/UX Design    |   1 |    ₹XX,XXX |     ₹XX,XXX |
| Development     |   1 |    ₹XX,XXX |     ₹XX,XXX |
| Testing         |   1 |    ₹XX,XXX |     ₹XX,XXX |
| **Grand Total** |     |            | **₹XX,XXX** |

---

### 4.4 Digital Signature

The Client Portal must include a digital signature workflow.

#### Signature Modal

The signature modal should include:

* Client name
* Signature canvas
* Clear/Reset button
* Save Signature button
* Cancel button
* Confirmation state

#### Signature Canvas

The signature should be drawn using:

* Crimson Red ink
* Smooth stroke rendering
* Responsive canvas sizing
* Mouse support
* Touch support
* Pen/stylus support where available

Suggested signature color:

```text
#DC2626
```

#### Signature Confirmation

After a successful signature:

1. Save the signature.
2. Display a confirmation state.
3. Show a subtle celebratory animation.
4. Trigger multi-color confetti.
5. Clearly communicate that the signature has been successfully captured.

The celebration should be polished and brief rather than distracting.

---

## 5. Client Portal Mobile Experience

The Client Portal must be fully responsive and optimized for mobile devices.

### Sticky Floating Action Dock

On mobile screens, provide a sticky floating action dock for the most important client actions.

Primary actions:

* **Download PDF**
* **Send via WhatsApp**

The dock should:

* Remain easily accessible while scrolling.
* Avoid covering important proposal content.
* Respect mobile safe-area insets.
* Use large touch-friendly controls.
* Maintain the PRAVYA TECH color system.

Example:

```text
┌──────────────────────────────────┐
│  📄 Download PDF   │  WhatsApp   │
└──────────────────────────────────┘
```

---

## 6. Responsive Design

The entire PMS interface must be responsive across:

* Desktop
* Laptop
* Tablet
* Mobile

### Desktop

Use the full sidebar navigation and spacious dashboard layouts.

### Tablet

Adapt:

* Sidebar width
* Grid columns
* Card sizes
* Table layouts
* Form layouts

### Mobile

The application should:

* Collapse or replace the desktop sidebar with mobile navigation.
* Convert multi-column layouts into stacked layouts.
* Make buttons touch-friendly.
* Convert wide tables into horizontally scrollable containers or mobile-friendly card layouts.
* Keep critical actions accessible.
* Prevent horizontal page overflow.

---

## 7. Visual Design Principles

The PRAVYA TECH PMS should consistently communicate:

* Premium
* Corporate
* Modern
* Trustworthy
* High-tech
* Minimal
* Professional

### Avoid

Do not use:

* Excessive gradients
* Excessive glass effects
* Oversaturated colors
* Heavy shadows
* Excessive animations
* Cartoon-style UI
* Unnecessary decorative elements
* Inconsistent border radii
* Random colors outside the defined design system

### Prefer

Use:

* Strong typography
* Generous whitespace
* Clean alignment
* Subtle shadows
* Thin borders
* Consistent spacing
* Crimson accent states
* Obsidian structural elements
* White content surfaces
* Clear visual hierarchy

---

## 8. Color Usage Rules

The color system should communicate hierarchy and state consistently.

### Crimson Red

Use for:

* Primary CTAs
* Active navigation
* Important highlights
* Proposal emphasis
* Signature ink
* Critical interactive states

### Obsidian Black

Use for:

* Sidebar
* Secondary buttons
* Premium headings
* Dark badges/pills
* Structural UI elements

### Emerald

Use for:

* Successful states
* Accepted quotations
* Verified indicators
* WhatsApp actions
* Positive confirmation states

### Amber

Use for:

* Warnings
* Upcoming renewals
* Approaching deadlines
* Attention-required states

### Slate

Use for:

* Borders
* Secondary text
* Neutral backgrounds
* Dividers
* Disabled states

---

## 9. Design Tokens

Recommended core design tokens:

```css
:root {
  /* Brand */
  --brand-600: #DC2626;
  --brand-500: #EF4444;
  --brand-700: #B91C1C;

  /* Obsidian */
  --obsidian-950: #09090B;
  --obsidian-900: #0F172A;

  /* Canvas */
  --canvas: #F8FAFC;
  --surface: #FFFFFF;

  /* Status */
  --success-600: #059669;
  --success-500: #10B981;

  --warning-600: #D97706;
  --warning-500: #F59E0B;

  /* Borders */
  --border-light: #E2E8F0;
  --border-medium: #CBD5E1;
}
```

---

## 10. Font System

Recommended font configuration:

```css
:root {
  --font-display: "Outfit", sans-serif;
  --font-body: "Plus Jakarta Sans", "Inter", sans-serif;
  --font-mono: "JetBrains Mono", monospace;
}
```

### Usage

```text
Outfit
→ Brand names
→ Page headings
→ Dashboard titles
→ Major metrics

Plus Jakarta Sans / Inter
→ Body text
→ Labels
→ Navigation
→ Forms
→ Buttons
→ Tables

JetBrains Mono
→ Proposal IDs
→ Dates
→ Currency
→ Technical data
→ IP addresses
→ System logs
```

---

## 11. Overall UX Direction

The PRAVYA TECH PMS should feel like a **premium enterprise proposal-management platform**, combining:

* Obsidian-black structural navigation
* Clean white application surfaces
* Crimson-red brand interactions
* Emerald success states
* Amber warning states
* Modern geometric typography
* Minimal glassmorphism
* Responsive layouts
* Presentation-quality client proposals
* Frictionless digital approval and signature workflows

The internal PMS should prioritize **efficiency and data management**, while the Client Portal should prioritize **trust, presentation quality, readability, and conversion to approval**.

The final implementation should maintain a consistent design language across every screen, component, modal, table, form, dashboard, proposal page, and client-facing interaction.
