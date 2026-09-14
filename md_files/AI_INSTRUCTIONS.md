# AI INSTRUCTIONS
## How to Work with AI Assistant on PRAVYA TECH Project

**This file explains how to use AI (like Claude) effectively for developing PRAVYA TECH Proposal Management System.**

---

## 📖 TABLE OF CONTENTS

1. [Quick Start](#quick-start)
2. [Markdown Files Overview](#markdown-files-overview)
3. [Reading Sequence (IMPORTANT)](#reading-sequence-important)
4. [How to Ask Questions](#how-to-ask-questions)
5. [Good vs Bad Requests](#good-vs-bad-requests)
6. [Templates for Common Tasks](#templates-for-common-tasks)
7. [Phase-by-Phase Instructions](#phase-by-phase-instructions)
8. [Troubleshooting](#troubleshooting)

---

## 🚀 QUICK START

### **First Time Using AI Assistant? Do This:**

```
1. Copy all markdown files from markdowns/ folder
2. Paste them in your message to AI
3. Say: "I'm starting PRAVYA TECH development. Here are my markdown files."
4. Give AI a specific task
5. AI will reference your markdown files to help
```

### **Every Time Before Asking AI:**

- [ ] Identify which markdown file is relevant
- [ ] Know which phase/module you're working on
- [ ] Have your specific error or blocker ready
- [ ] Know what you've already tried

---

## 📁 MARKDOWN FILES OVERVIEW

### **File 1: tech-stack.md**
**Purpose:** Technology choices and setup  
**Read When:** Starting project, confused about tooling  
**Contains:** FastAPI, React, PostgreSQL, Docker config, all dependencies  
**Size:** Small (reference document)

### **File 2: modules.md**
**Purpose:** Backend module structure and responsibilities  
**Read When:** Building any backend feature  
**Contains:** 7 modules (auth, proposals, tracking, acceptance, renewals, analytics, settings)  
**Size:** Medium (reference document)

### **File 3: database-schema.md**
**Purpose:** Database design and relationships  
**Read When:** Writing database queries, designing models  
**Contains:** 8 tables, relationships, indexes, constraints  
**Size:** Medium (reference document)

### **File 4: api-structure.md**
**Purpose:** API design conventions  
**Read When:** Building API endpoints  
**Contains:** REST conventions, response format, error handling, pagination  
**Size:** Medium (reference document)

### **File 5: roles-permissions.md**
**Purpose:** Authentication and authorization rules  
**Read When:** Implementing auth, setting permissions  
**Contains:** RBAC matrix, user roles, permission rules  
**Size:** Small (reference document)

### **File 6: workflow.md**
**Purpose:** User journeys and business processes  
**Read When:** Confused about how a feature should work  
**Contains:** Step-by-step workflows, state transitions, user journeys  
**Size:** Medium (reference document)

---

## 📚 READING SEQUENCE (IMPORTANT!)

### **MANDATORY ORDER - Always Read in This Sequence:**

```
START HERE
    ↓
1. tech-stack.md (understand the technologies)
    ↓
2. modules.md (understand module structure)
    ↓
3. database-schema.md (understand database)
    ↓
4. [Choose based on what you're building]
    ├─ Building API? → api-structure.md
    ├─ Building Auth? → roles-permissions.md
    └─ Confused about flow? → workflow.md
    ↓
THEN: Ask AI with context
```

### **For Backend Developer:**

**Before Any Backend Task:**
```
1. tech-stack.md (FastAPI, SQLAlchemy, PostgreSQL)
2. modules.md (which backend module?)
3. database-schema.md (what tables involved?)
4. api-structure.md (API conventions)
5. roles-permissions.md (auth needed?)
```

### **For Frontend Developer:**

**Before Any Frontend Task:**
```
1. tech-stack.md (React, Vite, TanStack Query)
2. modules.md (which module structure?)
3. api-structure.md (what endpoints to call?)
4. roles-permissions.md (what UI visibility rules?)
5. workflow.md (user journey?)
```

### **For Full-Stack Developer:**

**Before Any Task:**
```
1. tech-stack.md
2. modules.md
3. database-schema.md
4. api-structure.md
5. roles-permissions.md
6. workflow.md (all of them!)
```

### **For Questions About Specific Features:**

```
If building: User Registration
├─ Read: tech-stack.md → JWT
├─ Read: modules.md → auth module
├─ Read: database-schema.md → users table
├─ Read: api-structure.md → POST /auth/register
├─ Read: roles-permissions.md → RBAC rules
└─ Then ask AI for help

If building: Proposal PDF Generation
├─ Read: modules.md → proposals module
├─ Read: database-schema.md → proposals table
├─ Read: api-structure.md → PDF endpoints
├─ Read: workflow.md → how proposals flow
└─ Then ask AI for help
```

---

## 💬 HOW TO ASK QUESTIONS

### **Step 1: Prepare Your Question**

- [ ] Know which markdown file is relevant
- [ ] Know what phase/task you're on
- [ ] Have your error message ready
- [ ] Have tried at least one solution

### **Step 2: Include These Details**

```
Phase: [NUMBER] (e.g., Phase 2)
Feature: [NAME] (e.g., User Registration)
Module: [NAME] (e.g., auth)
Task: [DESCRIPTION] (e.g., Implement POST /api/auth/register)

Markdown read: [WHICH ONES]
(e.g., "I read: tech-stack.md, modules.md, api-structure.md")

Error/Blocker:
[DESCRIBE PROBLEM]

Code/Context:
[RELEVANT CODE SNIPPET if applicable]

What I tried:
[WHAT YOU'VE ALREADY ATTEMPTED]

Question:
[SPECIFIC QUESTION]
```

### **Step 3: Copy Relevant Markdown Content**

If you want AI to have exact reference:

```
AI, I'm working on Phase 2, Backend APIs, auth module.

From modules.md (auth module section):
[PASTE THE RELEVANT SECTION FROM modules.md]

From api-structure.md (auth endpoints):
[PASTE THE RELEVANT SECTION FROM api-structure.md]

My question: [YOUR SPECIFIC QUESTION]
```

---

## ✅ GOOD vs ❌ BAD REQUESTS

### **GOOD REQUEST (What AI Loves):**

```
Phase: 2
Feature: User Registration
Module: auth
Read: tech-stack.md, modules.md, api-structure.md

Task: Implement POST /api/auth/register endpoint

I read that:
- Tech stack is FastAPI + Pydantic v2 + bcrypt
- Auth module should have router.py with registration logic
- API structure uses consistent response format

My code (router.py):
[CODE SNIPPET]

Error:
Pydantic validation not working for email field

What I tried:
- Checked Pydantic v2 docs
- Added EmailStr validator
- Still getting validation error

Question:
How should I properly validate email in Pydantic v2 for this endpoint?
```

**Why this is good:**
✅ Specific phase & task  
✅ Referenced markdown files  
✅ Showed code  
✅ Explained error  
✅ Showed what was tried  
✅ Clear specific question  

---

### **BAD REQUEST (What AI struggles with):**

```
How do I create an API endpoint?
```

**Why this is bad:**
❌ No context  
❌ No markdown reference  
❌ Too vague  
❌ No specific problem  
❌ No code shown  

---

### **ANOTHER GOOD REQUEST:**

```
I'm starting Phase 1 setup.

I've read:
✓ tech-stack.md
✓ modules.md

Following phase_wise_plan.md Phase 1 tasks.

Current task: Initialize FastAPI project structure

I need to:
1. Create backend folder structure exactly as documented
2. Set up virtual environment
3. Install requirements.txt
4. Initialize PostgreSQL database

Can you help me with the exact commands and verify I create the right folder structure?
```

---

### **ANOTHER BAD REQUEST:**

```
I'm stuck. Help me.
```

---

## 📝 TEMPLATES FOR COMMON TASKS

### **Template 1: Implementing a New Endpoint**

```
Phase: [X]
Feature: [FEATURE NAME]
Module: [MODULE NAME]
Endpoint: [METHOD] [PATH]

From api-structure.md:
[PASTE RELEVANT API STRUCTURE SECTION]

From modules.md:
[PASTE MODULE RESPONSIBILITIES]

From database-schema.md:
[PASTE RELEVANT TABLE STRUCTURE]

Current code:
[CODE SNIPPET]

Error: [ERROR MESSAGE]

Question: [SPECIFIC QUESTION]
```

### **Template 2: Database Query Help**

```
Phase: [X]
Feature: [FEATURE]
Module: [MODULE]

From database-schema.md:
[PASTE TABLE STRUCTURE & RELATIONSHIPS]

From api-structure.md:
[PASTE API ENDPOINT DEFINITION]

My query attempt:
[SQLALCHEMY CODE]

Expected result: [WHAT SHOULD HAPPEN]
Actual result: [WHAT'S HAPPENING]

Question: [SPECIFIC QUESTION]
```

### **Template 3: Frontend Component Help**

```
Phase: [X]
Feature: [FEATURE]
Module: [MODULE]

From modules.md:
[PASTE MODULE STRUCTURE]

From api-structure.md:
[PASTE API ENDPOINT STRUCTURE]

From workflow.md:
[PASTE USER JOURNEY]

Component I'm building:
[COMPONENT NAME]

My code:
[REACT CODE]

Error: [ERROR MESSAGE]

Question: [SPECIFIC QUESTION]
```

### **Template 4: Permission/Auth Help**

```
Phase: [X]
Feature: [FEATURE]
Module: [MODULE]

From roles-permissions.md:
[PASTE PERMISSION MATRIX/RULES]

My implementation:
[AUTH CODE]

Expected behavior: [WHAT SHOULD HAPPEN]
Actual behavior: [WHAT'S HAPPENING]

Question: [SPECIFIC QUESTION]
```

---

## 📋 PHASE-BY-PHASE INSTRUCTIONS

### **Phase 1: Project Setup**

**Before starting:**
- Read all markdown files
- Understand tech stack
- Understand folder structure

**When asking AI:**
```
Phase: 1
Task: [SPECIFIC SETUP TASK]
(e.g., "Initialize FastAPI project", "Set up PostgreSQL", etc.)

Completed so far: [WHAT'S DONE]
Current blocker: [WHAT'S STUCK]
```

---

### **Phase 2: Backend APIs**

**Before starting:**
- Read: tech-stack.md, modules.md, database-schema.md, api-structure.md

**When asking AI:**
```
Phase: 2
Module: [auth/proposals/etc]
Endpoint: [METHOD] [PATH]

From modules.md:
[PASTE MODULE SECTION]

From api-structure.md:
[PASTE API CONVENTION SECTION]

My code:
[CODE SNIPPET]

Error: [ERROR/BLOCKER]
Tried: [WHAT YOU TRIED]

Question: [SPECIFIC QUESTION]
```

---

### **Phase 3: Frontend Dashboard**

**Before starting:**
- Read: tech-stack.md, modules.md, api-structure.md, workflow.md

**When asking AI:**
```
Phase: 3
Page: [PAGE NAME]
Feature: [FEATURE NAME]

From workflow.md:
[PASTE USER JOURNEY]

From api-structure.md:
[PASTE ENDPOINTS THIS PAGE CALLS]

My component:
[REACT CODE]

Expected: [WHAT SHOULD HAPPEN]
Actual: [WHAT'S HAPPENING]

Question: [SPECIFIC QUESTION]
```

---

### **Phase 4+: Other Phases**

**Before starting:**
- Read all relevant markdown files
- Understand what phase builds on
- Know dependencies from previous phases

**When asking AI:**
```
Phase: [X]
Task: [SPECIFIC TASK]

Dependencies (must be done first):
- Phase [X-1]: [STATUS]
- Phase [X-2]: [STATUS]

From [RELEVANT MARKDOWN]:
[PASTE RELEVANT SECTION]

Current code:
[SNIPPET IF APPLICABLE]

Blocker:
[PROBLEM DESCRIPTION]

Question:
[SPECIFIC QUESTION]
```

---

## 🔧 TROUBLESHOOTING

### **If AI Seems Confused:**

1. **Paste the relevant markdown section**
   ```
   From modules.md (auth module section):
   [PASTE THE TEXT]
   ```

2. **Be more specific about what phase/task**
   ```
   "Phase 2, Task 2.1, implementing auth registration"
   NOT "Building auth"
   ```

3. **Show your actual code**
   ```
   [ACTUAL CODE SNIPPET]
   NOT "something like this"
   ```

4. **Include the error message**
   ```
   Error: [FULL ERROR MESSAGE]
   NOT "It doesn't work"
   ```

---

### **If AI Gives Generic Answer:**

1. Remind it which markdown files apply
   ```
   "Remember, this is for Phase 2 according to phase_wise_plan.md"
   ```

2. Paste exact markdown content
   ```
   "Here's the exact API structure from api-structure.md:
   [PASTE IT]"
   ```

3. Show what you need specifically
   ```
   "I don't need general advice, I need code for this specific endpoint"
   ```

---

### **If AI Doesn't Know Project Context:**

On your first question, paste this:

```
CONTEXT: I'm developing PRAVYA TECH Proposal Management System.

Here's my project structure:

Markdown files (in markdowns/ folder):
1. tech-stack.md - Technology choices
2. modules.md - Backend module structure
3. database-schema.md - Database design
4. api-structure.md - API conventions
5. roles-permissions.md - RBAC rules
6. workflow.md - User journeys

Folder structure:
backend/
├── app/
│   ├── core/ (config, database, security, etc.)
│   └── modules/ (auth, proposals, etc.)
├── requirements.txt
└── ...

frontend/
├── src/
│   ├── pages/
│   ├── components/
│   ├── hooks/
│   ├── api/
│   └── ...
└── package.json

I'll be asking questions throughout development. For context, I'll include:
- Which phase I'm in
- Which markdown file is relevant
- My specific code/error
- What I've tried

Ready to help?
```

---

## 🎯 QUICK REFERENCE: WHEN TO READ WHAT

| I Need Help With | Read This | Then | Then |
|------------------|-----------|------|------|
| Backend endpoint | modules.md | api-structure.md | database-schema.md |
| Frontend page | modules.md | workflow.md | api-structure.md |
| Database query | database-schema.md | modules.md | api-structure.md |
| Authentication | roles-permissions.md | tech-stack.md | modules.md |
| Understanding flow | workflow.md | modules.md | database-schema.md |
| Technology setup | tech-stack.md | modules.md | - |
| User permissions | roles-permissions.md | api-structure.md | modules.md |

---

## 💡 PRO TIPS

### **Tip 1: Copy Markdown When Asking Questions**
More context = Better answers

```
From modules.md (proposals module):
[PASTE RELEVANT SECTION]

My question: ...
```

### **Tip 2: Show Your Code**
AI can't help without seeing what you wrote

```
My current code:
[ACTUAL CODE SNIPPET]

Error: [ACTUAL ERROR]
```

### **Tip 3: Be Specific About Phase**
Not "I'm building proposals" but "Phase 2, task 2.4, proposals service"

```
Phase: 2
Task: 2.4
Module: proposals
Specific: Implementing create_proposal() service method
```

### **Tip 4: Include Error Messages**
Full error stack, not just "it broke"

```
Error:
Traceback (most recent call last):
  File "..." 
  ...
ValueError: invalid literal for int()...
```

### **Tip 5: Tell What You Tried**
Saves time, avoids same suggestions

```
I tried:
- Changed variable name
- Checked type hints
- Reviewed Pydantic docs

Still not working
```

---

## ✅ BEFORE ASKING AI

### **Pre-Question Checklist:**

- [ ] Identified which markdown file is relevant
- [ ] Know exactly which phase/task I'm on
- [ ] Have actual code to show
- [ ] Have full error message
- [ ] Know what I've tried
- [ ] Have specific question ready

**If even ONE of these is missing, go back and prepare it.**

---

## 📞 EXAMPLE INTERACTIONS

### **Example 1: Good Interaction**

**Your message:**
```
Phase: 2
Task: 2.1
Module: auth
Feature: User registration

From modules.md (auth module):
Auth module responsibilities:
- POST /api/auth/register → user registration
- POST /api/auth/login → user login
- POST /api/auth/refresh → token refresh

From api-structure.md (response format):
All endpoints return:
{
  "success": true/false,
  "data": {...},
  "message": "..."
}

From tech-stack.md:
Auth uses: JWT (HS256), bcrypt, Pydantic v2

My code (app/modules/auth/router.py):
[YOUR CODE SNIPPET]

Error:
Pydantic validation error on email field

What I tried:
- Added EmailStr type
- Checked Pydantic v2 docs
- Still getting validation error

Question:
How should I properly validate email in Pydantic v2?
```

**AI Response Quality:** ⭐⭐⭐⭐⭐ Excellent
(AI has context, code, error, effort shown)

---

### **Example 2: Poor Interaction**

**Your message:**
```
How do I validate email?
```

**AI Response Quality:** ⭐ Poor
(No context, no code, too vague)

---

## 🎬 YOU'RE READY!

**When starting development, copy this whole file and reference it.**

**When asking AI, use the templates and follow the reading sequence.**

**When stuck, paste relevant markdown and be specific.**

---

## 📝 QUICK CHECKLIST BEFORE ASKING AI

```
[ ] I identified the relevant markdown file(s)
[ ] I know which phase I'm in (e.g., Phase 2)
[ ] I know which module I'm working on (e.g., auth)
[ ] I have my actual code to show
[ ] I have my full error message
[ ] I know what I've already tried
[ ] I have a specific question
[ ] I'm following the reading sequence
```

---

**Last Updated:** September 2026  
**Version:** 1.0  
**Status:** Ready to use

**Happy coding! 🚀**
