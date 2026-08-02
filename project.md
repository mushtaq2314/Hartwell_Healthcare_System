# Hartwell Healthcare System

### An AI-Powered Multi-Agent Patient Care Coordination Platform

This document can serve as the blueprint for your project. Think of it like the Product Requirements Document (PRD) and technical architecture used before development starts.

---

# 1. Project Vision

## Problem

Healthcare data is fragmented.

A patient typically has:

* Blood reports
* MRI reports
* X-rays
* Prescriptions
* Doctor notes
* Insurance documents

These are stored in different places, making it difficult to quickly understand the patient's history.

Doctors also spend significant time reading reports instead of focusing on patient care.

---

## Solution

Hartwell Healthcare System is an AI-powered healthcare coordination platform that:

* Stores patient information
* Organizes medical history
* Reads uploaded reports
* Summarizes findings
* Detects medication conflicts
* Creates patient timelines
* Helps coordinate appointments
* Assists doctors by providing concise summaries

**Important:** The system **does not diagnose or prescribe treatment**. It assists with organization and understanding of information.

---

# 2. Objectives

The project should demonstrate:

* Full-stack development
* AI agent orchestration
* Retrieval-Augmented Generation (RAG)
* PDF understanding
* Vector databases
* LLM integration
* Workflow automation
* Modern software architecture

---

# 3. Users

## Patient

Can:

* Register
* Upload reports
* View history
* Chat with AI
* Download summaries

---

## Doctor

Can:

* View patient history
* Review AI summaries
* Add notes
* Approve AI-generated summaries

---

## Admin

Can:

* Manage users
* Monitor system
* View logs
* Manage hospitals (optional)

---

# 4. Core Features

## Patient Management

Store:

* Name
* DOB
* Gender
* Contact
* Blood group
* Allergies
* Chronic diseases

---

## Report Upload

Accept:

* PDF
* PNG
* JPG

Examples:

* Blood reports
* Prescriptions
* MRI
* CT Scan
* X-ray reports

---

## AI Report Reader

After upload:

```
PDF

↓

Extract text

↓

LLM

↓

Summary

↓

Database
```

---

## Medication Checker

Example

Patient takes:

```
Warfarin

Ibuprofen
```

System:

```
Potential interaction

Severity

Explanation

Recommendation:
Discuss with your physician.
```

---

## AI Chat

Example:

```
What does HDL mean?

Explain my blood report.

Summarize my MRI.

When was my last appointment?
```

---

## Timeline

```
2024

↓

Diabetes Diagnosis

↓

Blood Test

↓

MRI

↓

Medication Updated

↓

Follow-up
```

---

## Appointment Suggestions

Example

```
Blood glucose elevated

↓

Suggest Endocrinologist

↓

Schedule Follow-up
```

---

# 5. AI Agents

## Agent 1

### Intake Agent

Collects

```
Patient Info

Symptoms

History

Current Medications
```

Output

Structured JSON

---

## Agent 2

### Medical Record Agent

Responsibilities

* OCR
* Read PDFs
* Extract lab values
* Detect diagnoses
* Summarize

---

## Agent 3

### Medication Agent

Responsibilities

* Read medication list
* Check interactions
* Detect allergies
* Duplicate medicines

---

## Agent 4

### Timeline Agent

Creates chronological patient history.

---

## Agent 5

### Recommendation Agent

Suggests:

* Follow-up tests
* Administrative next steps
* Specialist types (not specific doctors unless integrated with scheduling)

---

## Agent 6

### Summary Agent

Produces

```
Patient Summary

Recent Reports

Important Findings

Medication Alerts

Follow-up Items
```

---

# 6. LangGraph Workflow

```
                    Upload Report
                          │
                          ▼
                 Medical Record Agent
                          │
             ┌────────────┴────────────┐
             ▼                         ▼
      Medication Agent          Timeline Agent
             │                         │
             └────────────┬────────────┘
                          ▼
               Recommendation Agent
                          │
                          ▼
                  Summary Agent
                          │
                          ▼
                     Final Response
```

The graph is deterministic for this project, making it easier to test and debug.

---

# 7. System Architecture

```
                  React Frontend
                         │
                         ▼
                  FastAPI Backend
                         │
          ┌──────────────┼──────────────┐
          ▼              ▼              ▼
      PostgreSQL      LangGraph     ChromaDB
          │              │              │
          └─────── Medical PDFs ────────┘
```

---

# 8. Folder Structure

```
Hartwell Healthcare System/

│
├── hartwell_frontend/
│
├── hartwell_backend/
│
│   ├── app/
│   │
│   ├── api/
│   │
│   ├── agents/
│   │
│   ├── graph/
│   │
│   ├── database/
│   │
│   ├── models/
│   │
│   ├── schemas/
│   │
│   ├── services/
│   │
│   ├── uploads/
│   │
│   ├── chroma_db/
│   │
│   └── main.py
│
└── docs/
```

---

# 9. Database Design

### Patient

```
id

name

dob

gender

phone

email

blood_group

allergies
```

---

### Reports

```
id

patient_id

report_type

upload_date

file_path

summary
```

---

### Visits

```
id

patient_id

doctor

date

notes
```

---

### Medications

```
id

patient_id

medicine

dosage

frequency
```

---

### Timeline

```
id

patient_id

event

date
```

---

# 10. API Design

### Patients

```
POST /patients

GET /patients

GET /patients/{id}

PUT /patients/{id}

DELETE /patients/{id}
```

---

### Reports

```
POST /reports/upload

GET /reports/{id}

GET /reports/patient/{patient_id}
```

---

### Chat

```
POST /chat
```

---

### Timeline

```
GET /timeline/{patient_id}
```

---

### Summary

```
GET /summary/{patient_id}
```

---

# 11. React Pages

```
Login

Dashboard

Patients

Patient Details

Upload Reports

Timeline

AI Chat

Settings
```

---

# 12. Dashboard

```
------------------------------------

Patients

Recent Reports

Pending Follow-ups

Medication Alerts

Upcoming Appointments

------------------------------------
```

---

# 13. AI Chat Flow

```
User

↓

Chat API

↓

LangGraph

↓

RAG

↓

LLM

↓

Response
```

---

# 14. RAG

Knowledge Base

```
Drug Information

Medical Terminology

Hospital Protocols

Patient Education Materials
```

When asked:

```
Explain HDL
```

The retrieval system fetches relevant information, and the LLM answers using that context.

---

# 15. Development Roadmap

### Phase 1 — Foundation

* Project setup
* FastAPI
* React
* PostgreSQL
* Patient CRUD
* Authentication (optional initially)

---

### Phase 2 — Reports

* Upload PDFs
* OCR (if needed)
* Extract text
* Store metadata

---

### Phase 3 — AI

* LLM summaries
* Chat interface
* Basic RAG

---

### Phase 4 — Multi-Agent

* LangGraph orchestration
* Medical Record Agent
* Medication Agent
* Timeline Agent
* Recommendation Agent
* Summary Agent

---

### Phase 5 — Polish

* Dashboard
* Timeline visualization
* Role-based access
* Logging
* Docker
* Deployment

---

# 16. Stretch Goals

* Voice input/output
* FHIR-compatible data model
* Audit trail for AI outputs
* Human approval workflow
* Email reminders
* Mobile-responsive UI
* Analytics dashboard

---

# 17. Non-Functional Requirements

* **Performance:** Report summaries generated within ~10–15 seconds for typical documents.
* **Security:** Encrypt sensitive data at rest where appropriate, use HTTPS in deployment, hash passwords, validate uploads.
* **Scalability:** Separate frontend, backend, and AI orchestration so components can scale independently.
* **Reliability:** Log agent execution, handle failures gracefully, and provide clear error messages.
* **Maintainability:** Modular code with tests for API endpoints and agent workflows.

---

# 18. Suggested Git Workflow

```
main
│
├── feature/patient-crud
├── feature/report-upload
├── feature/pdf-parser
├── feature/llm-summary
├── feature/langgraph-workflow
├── feature/chat
└── feature/dashboard
```

Merge completed features into `main` through pull requests, even if you're working alone. This demonstrates familiarity with collaborative development practices.

---

# 19. Milestones

| Milestone | Outcome                                |
| --------- | -------------------------------------- |
| 1         | React + FastAPI connected              |
| 2         | Patient CRUD complete                  |
| 3         | Report upload and storage              |
| 4         | Text extraction from reports           |
| 5         | AI-generated report summaries          |
| 6         | LangGraph multi-agent workflow         |
| 7         | RAG-powered chat                       |
| 8         | Timeline and medication alerts         |
| 9         | Dockerized deployment                  |
| 10        | Documentation, testing, and demo video |

---

## A note on scope

This project can become very large. To keep it manageable while still impressive for a portfolio, treat it as an **incremental build**:

* **Version 1:** Patient management, report upload, and AI summaries.
* **Version 2:** Multi-agent workflow with LangGraph and RAG.
* **Version 3:** Doctor review workflow, richer dashboards, and production-ready deployment.

Each version is a complete, demonstrable application, allowing you to showcase progress while continuously adding more advanced AI capabilities.
