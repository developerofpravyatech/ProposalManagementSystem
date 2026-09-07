# PRAVYA TECH — Proposal Management System

## Purpose of the Project

The **PRAVYA TECH Proposal Management System (PMS)** is a web-based system designed to help PRAVYA TECH manage, generate, share, track, and renew company profiles and project proposals/quotations from a single admin dashboard.

The main goal is to make the proposal-sharing process simple and professional while allowing the admin to know whether a client has opened, viewed, downloaded, or accepted a proposal.

---

uvicorn app.main:app --reload --port 8000
npm run dev

## Setup

### Prerequisites
- Python 3.9+
- Node.js and npm

### Backend
```powershell
cd backend
pip install -r requirements.txt
uvicorn app.main:app --reload --port 8000
```

### Frontend
```powershell
cd frontend
npm install
npm run dev
```

The backend API will be available at `http://localhost:8000` and the frontend dev server will be available at `http://localhost:5173`.
---

## What the System Does

The system provides two main types of documents:

### 1. Company Profile

A standard **9-page PRAVYA TECH company profile** used for introducing the company to new clients or leads.

It contains:

* Company introduction
* Founder/CEO cover letter
* Mission and vision
* Core values
* Services
* Work process
* Client showcases
* General terms and conditions
* Branch/contact information

### 2. Project Proposal & Quotation

A customized **12-page proposal package** created for a specific client and project.

It contains:

* Client information
* Project title and details
* Custom cover and cover letter
* PRAVYA TECH company profile
* Client case studies
* Project pricing and line items
* Payment information
* Quote acceptance/sign-off
* Contact information

---

## Main Purpose

The system should allow an admin to:

* Create a company profile proposal
* Create a custom project quotation
* Enter client and company details
* Add project information
* Add pricing and line items
* Generate the final proposal
* Create a unique private proposal link
* Share the proposal through WhatsApp
* Track client activity
* Know when the client opened the proposal
* Know how many times the proposal was viewed
* Know when the PDF was downloaded
* Allow the client to accept the quotation
* Track quotation renewal dates
* Quickly create renewal proposals

---

## Client Experience

The client receives a private proposal link such as:

`pravyatech.com/p/{token}`

The client can open the link without needing to log in.

Inside the proposal viewer, the client can:

* View the proposal
* Download the PDF
* Contact PRAVYA TECH through WhatsApp
* Accept the quotation when applicable

The system records the client's proposal activity so the admin can monitor engagement.

---

## Proposal Tracking

One of the most important features is **client engagement tracking**.

The admin should be able to see:

* Whether the client has opened the proposal
* When it was first opened
* When it was last opened
* How many times it was viewed
* Device/browser information
* When the PDF was downloaded

This helps the sales team understand whether a client has actually reviewed the proposal and whether a follow-up may be required.

---

## WhatsApp Sharing

The system provides a **one-click WhatsApp sharing option**.

After generating a proposal, the admin can share a ready-made WhatsApp message containing the private proposal link.

This removes the need to manually create and copy proposal messages for every client.

---

## Quote Acceptance

For project quotations, the client can optionally accept the quotation directly from the proposal viewer.

The system can then update the proposal status to indicate that the quote has been accepted.

---

## Renewal Management

For quotations that have a contract or renewal period, the system tracks the renewal date.

The admin should be able to identify:

* Contracts approaching expiry
* Contracts expiring within 30 days
* Overdue renewals

The system provides a quick renewal workflow where the existing quotation can be duplicated, dates can be updated, and a new renewal proposal/link can be generated.

---

## Overall Workflow

```text
Admin
  ↓
Create Company Profile / Project Proposal
  ↓
Enter Client & Project Information
  ↓
Add Pricing (if quotation)
  ↓
Generate Proposal
  ↓
Create Private Link
  ↓
Share via WhatsApp
  ↓
Client Opens Proposal
  ↓
System Tracks Activity
  ↓
Client Downloads / Accepts
  ↓
Admin Monitors Proposal
  ↓
Renewal Reminder
  ↓
Create Renewal Proposal
```

---

## Expected Outcome

The final system should give PRAVYA TECH a **single place to manage the complete proposal lifecycle**:

**Create → Generate → Share → Track → Accept → Renew**

The system is intended to replace a manual proposal-sharing process with a simple, trackable, and professional digital proposal management workflow.
