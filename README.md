HireFair AI 🛡️

AI Resume Screening, Candidate Ranking & Bias Detection Platform

HireFair AI is a web-based AI recruitment assistant designed to help recruiters screen resumes, match candidates against job requirements, explain candidate rankings, and identify potentially biased wording or screening criteria.

Hackathon Problem Statement: AI-powered resume screening assistant with bias-flagging.

🌐 Live Demo

Website:
https://hirefair-ai-453486149906.asia-southeast1.run.app

The live application is deployed on Google Cloud and is available for demonstration.

🎥 Project Demo Video

Video:
https://drive.google.com/file/d/1JnKo4KkLSaa4cxmbO9dStjFYimjmTIa-/view?usp=drive_link

Replace PASTE_YOUR_VIDEO_LINK_HERE with your YouTube, Google Drive, Loom, or other public video URL before submitting the project.

📌 1. Project Overview

HireFair AI is a full-stack recruitment intelligence platform that combines:

AI-assisted resume screening

Resume information extraction

Job requirement extraction

Semantic candidate matching

Transparent candidate scoring

Explainable AI

Bias-aware job-description analysis

Fair Screening Mode

Candidate comparison

Human-in-the-loop decision making

Recruitment analytics

Audit logging

The system is designed to assist recruiters, not replace human hiring decisions.

🎯 2. Problem

Manual resume screening can be:

Time-consuming

Difficult to scale

Inconsistent

Dependent on keyword matching

Difficult to explain

Vulnerable to irrelevant screening criteria

Recruiters may need to process hundreds of resumes for a single job opening.

HireFair AI provides an AI-assisted workflow that focuses on job-relevant qualifications while making the screening process more transparent.

💡 3. Solution

The platform follows this workflow:

Recruiter
    ↓
Create Job / Upload Job Description
    ↓
Extract Job Requirements
    ↓
Analyze Potential Bias
    ↓
Upload Multiple Resumes
    ↓
Parse Resumes
    ↓
Extract Candidate Information
    ↓
Semantic Matching
    ↓
Candidate Scoring
    ↓
Candidate Ranking
    ↓
Explainable AI
    ↓
Human Review
    ↓
Shortlist / Needs Review / Reject
    ↓
Audit Log
    ↓
Recruitment Analytics

🏗️ 4. System Architecture

┌───────────────────────────────────────────────┐
│                   FRONTEND                    │
│                                               │
│ React + TypeScript + Vite + Tailwind CSS      │
│ shadcn/ui + Recharts + Lucide                 │
└───────────────────────┬───────────────────────┘
                        │
                    REST API
                        │
                        ▼
┌───────────────────────────────────────────────┐
│                   BACKEND                     │
│                                               │
│ FastAPI + Python + Pydantic + SQLAlchemy      │
└───────────────┬─────────────────┬─────────────┘
                │                 │
                ▼                 ▼
      ┌─────────────────┐   ┌─────────────────┐
      │   AI / NLP      │   │   PostgreSQL    │
      │                 │   │                 │
      │ spaCy           │   │ Users           │
      │ Transformers    │   │ Jobs            │
      │ Sentence        │   │ Candidates      │
      │ Transformers    │   │ Resumes         │
      │ Scikit-learn    │   │ Screenings      │
      │ Embeddings      │   │ Bias Flags      │
      └─────────────────┘   │ Decisions       │
                            │ Audit Logs      │
                            └─────────────────┘

🔄 5. Complete Workflow

Step 1 — Recruiter Login

The recruiter logs into the HireFair AI dashboard.

Step 2 — Create a Job

The recruiter can manually enter a job description or upload a PDF/DOCX/TXT file.

Step 3 — Job Requirement Extraction

The system identifies:

Required skills

Preferred skills

Experience

Education

Qualifications

Responsibilities

Step 4 — Bias Analysis

The job description is analyzed for potentially problematic wording.

Example:

"young and energetic candidate"

        ↓

Potential age-related wording

        ↓

Review recommended

The system does not claim that a phrase proves discriminatory intent.

Step 5 — Resume Upload

Recruiters can upload multiple resumes.

Supported formats:

PDF

DOCX

TXT

Step 6 — Resume Parsing

The system extracts:

Skills

Experience

Education

Projects

Certifications

Job history

Technical skills

Step 7 — Semantic Matching

The system compares job requirements with candidate experience using semantic similarity.

Example:

Job:
"Experience building RESTful APIs"

Resume:
"Developed backend services using FastAPI"

The system can recognize that these are related even when the exact wording differs.

Step 8 — Candidate Scoring

Candidates receive a transparent job-relevance score.

Default weighting:

Category

Weight

Required Skills

40%

Relevant Experience

25%

Semantic Job Match

20%

Education

5%

Preferred Skills

10%

Step 9 — Candidate Ranking

Candidates are ranked according to job-related criteria.

Step 10 — Explainable AI

The system explains why a candidate received their score.

Step 11 — Human Review

The recruiter reviews the AI recommendation.

Available actions:

Shortlist

Needs Review

Reject

Step 12 — Audit

Recruiter actions are recorded for traceability.

Step 13 — Analytics

Recruiters can view screening and recruitment analytics.

🧠 6. AI Architecture

                    RESUME
                       │
                       ▼
              Document Processing
                       │
                       ▼
                 Text Extraction
                       │
                       ▼
               NLP Information
                  Extraction
                       │
              ┌────────┴────────┐
              ▼                 ▼
      Structured Profile    Embeddings
              │                 │
              └────────┬────────┘
                       ▼
                Matching Engine
                       │
                       ▼
                 Score Engine
                       │
                       ▼
              Explainable Result
                       │
                       ▼
              Recruiter Dashboard

🔍 7. Resume Screening

The system extracts candidate information and converts it into a structured profile.

Example:

Candidate: A102

Skills:
Python
FastAPI
SQL
Docker

Experience:
3.2 years

Education:
Computer Science

Projects:
Backend API
Fraud Detection System

If information is not found, the system displays:

Not Found

It should not invent missing information.

📊 8. Candidate Scoring

Example:

Required Skills       95%
Relevant Experience   88%
Semantic Match        92%
Education            100%
Preferred Skills       70%

Overall Match         91%

The scoring method is transparent and configurable.

🔎 9. Explainable AI

For every candidate, HireFair AI can show why the candidate received their score.

Example:

WHY THIS CANDIDATE MATCHED

Python
██████████████████ 95%

FastAPI
█████████████████  90%

SQL
██████████████████ 94%

Docker
████████████       70%

Evidence:

✓ Python experience identified
✓ FastAPI experience identified
✓ SQL experience identified
✓ REST API experience identified

If a skill is not identified:

AWS — Not found in submitted resume

This does not mean the candidate definitely lacks that skill.

🛡️ 10. Bias Detection

Bias analysis focuses on potentially problematic hiring wording and criteria.

Examples:

Age-related wording

"young and energetic"

Potential issue:
Age-related wording

Recommendation:
Review and consider neutral job-related wording.

Gender-related wording

"male candidate preferred"

Potential issue:
Gender-related preference

Recommendation:
Use job-related qualifications instead.

Language/nationality-related wording

"native English speaker"

Potential issue:
Potential nationality/language-related criterion

Recommendation:
"Strong English communication skills"

The system should flag potential concerns for human review rather than automatically label a recruiter or candidate as biased.

🛡️ 11. Fair Screening Mode

HireFair AI includes:

Fair Screening Mode

When enabled, the initial screening focuses on job-relevant information.

The ranking should use:

Required skills

Relevant experience

Job-related education

Certifications

Projects

Semantic job relevance

The ranking should not use sensitive or irrelevant characteristics such as:

Gender

Race

Religion

Age

Sexual orientation

Marital status

Photograph

Home address

The system should not infer sensitive characteristics from candidate names, photos, addresses, or resume text.

👥 12. Human-in-the-Loop

HireFair AI does not automatically make final hiring decisions.

AI Screening
      ↓
AI Recommendation
      ↓
Human Review
      ↓
┌─────────────┬──────────────┬──────────┐
│  Shortlist  │ Needs Review │  Reject  │
└─────────────┴──────────────┴──────────┘
      ↓
Audit Log

The application should clearly communicate:

AI provides recommendations. Final hiring decisions remain with authorized human reviewers.

🖥️ 13. Main Modules

Dashboard

Active jobs

Total candidates

Shortlisted candidates

Bias flags

Average match score

Recruitment pipeline

Recent activity

Job Management

Create jobs

Edit jobs

Upload job descriptions

Extract requirements

Configure skills

Resume Management

Upload resumes

Parse resumes

View candidate profiles

Track processing status

AI Screening

Skill matching

Experience matching

Semantic matching

Candidate scoring

Candidate ranking

Explainable AI

Score breakdown

Matching evidence

Missing/not-found skills

Ranking explanation

Bias Analysis

Potential bias flags

Severity

Explanation

Suggested wording

Human review

Candidate Comparison

Compare up to three candidates based on job-related criteria.

Analytics

Applications

Screening statistics

Match scores

Shortlist rate

Bias flags

Recruiter decisions

Audit Logs

Track:

Resume uploads

Screening events

Bias analysis

Recruiter decisions

Configuration changes

👤 14. User Roles

Recruiter

Can:

Create jobs

Upload resumes

Run screening

View rankings

Review explanations

Compare candidates

Shortlist candidates

Reject candidates

View analytics

Hiring Manager

Can:

View jobs

View candidates

Compare candidates

Review screening results

Provide decisions

Admin

Can:

Manage users

Manage jobs

Configure settings

View model performance

View analytics

View audit logs

🛠️ 15. Technology Stack

Frontend

React

TypeScript

Vite

Tailwind CSS

shadcn/ui

Lucide React

Recharts

Axios

Backend

Python

FastAPI

Pydantic

SQLAlchemy

AI / NLP

Python

spaCy

Sentence Transformers

Transformers

Scikit-learn

NumPy

Pandas

Document Processing

PyMuPDF

python-docx

Optional OCR

Database

PostgreSQL

Authentication

JWT

Deployment

Docker

Docker Compose

Nginx

Google Cloud / Cloud Run

🗄️ 16. Database Architecture

Main entities:

Users
  │
  ├── Jobs
  │     │
  │     ├── Job Requirements
  │     ├── Candidates
  │     │      │
  │     │      ├── Resumes
  │     │      ├── Candidate Profiles
  │     │      ├── Screening Results
  │     │      └── Decisions
  │     │
  │     └── Bias Flags
  │
  └── Audit Logs

Recommended tables:

users
jobs
job_requirements
candidates
resumes
candidate_profiles
screenings
screening_scores
bias_flags
decisions
audit_logs
notifications
settings

📁 17. Project Structure

hirefair-ai/
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── layouts/
│   │   ├── charts/
│   │   ├── services/
│   │   ├── hooks/
│   │   └── App.tsx
│   │
│   └── package.json
│
├── backend/
│   ├── app/
│   │   ├── api/
│   │   ├── models/
│   │   ├── schemas/
│   │   ├── services/
│   │   ├── database/
│   │   ├── auth/
│   │   ├── ai/
│   │   ├── screening/
│   │   ├── matching/
│   │   ├── bias/
│   │   └── main.py
│   │
│   └── requirements.txt
│
├── ml/
│   ├── preprocessing/
│   ├── embeddings/
│   ├── ranking/
│   ├── evaluation/
│   └── models/
│
├── data/
│   ├── resumes/
│   └── jobs/
│
├── docker-compose.yml
├── .env.example
├── .gitignore
└── README.md

🔌 18. API Architecture

Recommended API endpoints:

POST /api/auth/login

POST /api/jobs
GET  /api/jobs
GET  /api/jobs/{job_id}

POST /api/jobs/{job_id}/resumes

POST /api/screening/start
GET  /api/screening/{job_id}

GET  /api/candidates
GET  /api/candidates/{candidate_id}

GET  /api/candidates/{candidate_id}/explanation

POST /api/bias/analyze
GET  /api/bias/{job_id}

POST /api/candidates/{candidate_id}/shortlist
POST /api/candidates/{candidate_id}/reject
POST /api/candidates/{candidate_id}/review

GET /api/analytics/dashboard

GET /api/model/performance

GET /api/audit-logs

🎬 19. Hackathon Demo Flow

The recommended demonstration:

LOGIN
  ↓
OPEN SENIOR PYTHON DEVELOPER JOB
  ↓
SHOW JOB REQUIREMENTS
  ↓
RUN BIAS ANALYSIS
  ↓
ENABLE FAIR SCREENING MODE
  ↓
UPLOAD RESUMES
  ↓
START AI SCREENING
  ↓
SHOW PROCESSING
  ↓
DISPLAY CANDIDATE RANKING
  ↓
OPEN TOP CANDIDATE
  ↓
SHOW MATCH SCORE
  ↓
SHOW AI EXPLANATION
  ↓
COMPARE CANDIDATES
  ↓
SHORTLIST CANDIDATE
  ↓
SHOW AUDIT LOG
  ↓
OPEN ANALYTICS

This demonstrates:

AI + NLP + semantic matching + explainability + bias monitoring + human review + full-stack software.

🏆 20. Key Differentiators

HireFair AI is more than a resume parser.

AI Resume Parsing

Extracts structured candidate information.

Semantic Matching

Understands meaning instead of relying only on exact keywords.

Transparent Scoring

Shows how candidate scores are calculated.

Explainable AI

Explains why candidates match the role.

Bias Monitoring

Identifies potentially problematic hiring wording.

Fair Screening Mode

Focuses initial screening on job-relevant qualifications.

Human-in-the-Loop

Recruiters remain responsible for final decisions.

Auditability

Important actions are logged.

Analytics

Provides recruitment insights.

🚀 21. Future Enhancements

Multi-language resume processing

Advanced skill taxonomy

Vector database

Advanced semantic search

AI recruitment assistant

Interview question generation

Interview scheduling

Candidate feedback analysis

Email notifications

SSO

Advanced fairness evaluation

Model monitoring

Human feedback loops

Enterprise integrations

⚠️ 22. Limitations

HireFair AI cannot guarantee unbiased hiring.

AI results can be affected by:

Resume quality

Missing information

Job-description quality

NLP extraction errors

Semantic matching errors

Training data limitations

Therefore, AI output should always be reviewed by qualified human decision-makers.

🔐 23. Security & Privacy

The application should implement:

Authentication

Role-based authorization

Protected routes

Password hashing

File validation

File size limits

Secure resume storage

Input validation

API validation

Environment variables

Database access controls

Never commit:

API keys

Database passwords

Secret tokens

Production credentials

📋 24. Demo Job

Senior Python Backend Developer

Required skills:

Python
FastAPI
REST APIs
SQL
Git

Preferred skills:

Docker
AWS
React

Experience:

2–5 years

Education:

Computer Science or related field

📈 25. Project Impact

HireFair AI aims to:

Reduce repetitive resume-screening work

Improve screening consistency

Make AI recommendations understandable

Identify potentially problematic hiring language

Encourage job-relevant candidate evaluation

Improve recruiter productivity

Keep humans responsible for final decisions

🏁 26. Conclusion

HireFair AI combines:

AI Resume Processing
        +
Semantic Job Matching
        +
Transparent Candidate Scoring
        +
Explainable AI
        +
Bias Monitoring
        +
Fair Screening
        +
Human Review
        +
Analytics

The final goal is:

AI handles repetitive analysis, explains its recommendations, monitors potentially problematic screening criteria, and helps recruiters make better-informed decisions — while humans remain responsible for the final hiring decision.

📄 License

Add an appropriate project-specific or open-source license before public distribution.

⚖️ Disclaimer

HireFair AI is a hackathon/prototype system. It should not be used as an autonomous employment decision-making system without appropriate legal, privacy, security, fairness, and human-review controls.
