Visual Link:
HireFair AI 🛡️  - https://hirefair-ai-453486149906.asia-southeast1.run.app

AI Resume Screening, Candidate Ranking & Bias Detection Platform

HireFair AI is a full-stack AI-assisted recruitment platform designed for transparent, explainable, and bias-aware resume screening.

The platform helps recruiters:

Create and manage job openings

Upload job descriptions

Upload and process multiple resumes

Extract candidate skills, experience, education, projects, and certifications

Match candidates against job-related requirements

Rank candidates using transparent scoring

Explain why a candidate received a particular score

Detect potentially biased wording in job descriptions

Enable Fair Screening Mode

Compare candidates

Shortlist, reject, or request human review

Track recruiter decisions through audit logs

Analyze recruitment and screening analytics

Important: HireFair AI is an assistive screening system. It should not make autonomous hiring decisions. Final hiring decisions remain with authorized human reviewers.

1. Problem Statement

The project addresses the hackathon problem statement:

AI-powered resume screening assistant with bias-flagging.

The system combines AI/NLP, semantic matching, transparent scoring, bias-aware screening, analytics, and human-in-the-loop review into a single web application.

2. Project Objective

Traditional resume screening can be:

Time-consuming

Inconsistent

Difficult to scale

Dependent on manual keyword searches

Difficult to explain

Vulnerable to irrelevant or potentially biased criteria

HireFair AI aims to improve the screening workflow by providing:

Automated resume information extraction

Job-relevant candidate matching

Semantic similarity analysis

Transparent candidate scoring

Explainable AI results

Bias-aware job-description analysis

Blind/Fair Screening Mode

Human-in-the-loop decisions

Recruitment analytics

Auditability

3. Core Workflow

                    ┌──────────────────────┐
                    │      RECRUITER       │
                    └──────────┬───────────┘
                               │
                               ▼
                    ┌──────────────────────┐
                    │    CREATE JOB        │
                    │  / Upload JD         │
                    └──────────┬───────────┘
                               │
                               ▼
                  ┌───────────────────────────┐
                  │ Job Requirement Extraction│
                  │ Skills / Experience /     │
                  │ Education / Qualifications│
                  └────────────┬──────────────┘
                               │
                 ┌─────────────┴─────────────┐
                 ▼                           ▼
       ┌──────────────────┐       ┌──────────────────┐
       │ Job Matching     │       │ Bias Analysis    │
       │ Requirements     │       │ Job Description  │
       └────────┬─────────┘       └────────┬─────────┘
                │                          │
                └────────────┬─────────────┘
                             ▼
                    ┌──────────────────┐
                    │ Upload Resumes   │
                    └────────┬─────────┘
                             │
                             ▼
                    ┌──────────────────┐
                    │ Resume Parser    │
                    └────────┬─────────┘
                             │
                             ▼
                  ┌───────────────────────┐
                  │ Candidate Information │
                  │ Extraction            │
                  └───────────┬───────────┘
                              │
                              ▼
                  ┌───────────────────────┐
                  │ Semantic Embeddings   │
                  └───────────┬───────────┘
                              │
                              ▼
                  ┌───────────────────────┐
                  │ Job Matching Engine   │
                  └───────────┬───────────┘
                              │
                              ▼
                  ┌───────────────────────┐
                  │ Transparent Scoring   │
                  └───────────┬───────────┘
                              │
                 ┌────────────┴────────────┐
                 ▼                         ▼
       ┌──────────────────┐      ┌──────────────────┐
       │ Candidate Rank   │      │ AI Explanation   │
       └────────┬─────────┘      └────────┬─────────┘
                │                         │
                └────────────┬────────────┘
                             ▼
                    ┌──────────────────┐
                    │ Human Review     │
                    └────────┬─────────┘
                             │
             ┌───────────────┼────────────────┐
             ▼               ▼                ▼
        ┌─────────┐     ┌──────────┐     ┌─────────┐
        │Shortlist│     │Needs     │     │ Reject  │
        │         │     │Review    │     │         │
        └────┬────┘     └─────┬────┘     └────┬────┘
             │                │               │
             └────────────────┼───────────────┘
                              ▼
                     ┌────────────────┐
                     │  Audit Logs    │
                     └────────────────┘

4. System Architecture

┌──────────────────────────────────────────────────────────────┐
│                         FRONTEND                             │
│                                                              │
│ React + TypeScript + Vite + Tailwind + shadcn/ui             │
│                                                              │
│ Dashboard | Jobs | Candidates | Compare | Bias | Analytics   │
└──────────────────────────────┬───────────────────────────────┘
                               │
                         REST / JSON API
                               │
                               ▼
┌──────────────────────────────────────────────────────────────┐
│                         BACKEND                              │
│                                                              │
│ FastAPI + Python                                              │
│                                                              │
│ Auth | Jobs | Resume | Screening | Matching | Bias | Audit   │
└──────────────┬───────────────────────┬───────────────────────┘
               │                       │
               ▼                       ▼
┌────────────────────────┐   ┌────────────────────────────────┐
│ AI / NLP ENGINE        │   │ PostgreSQL                     │
│                        │   │                                │
│ spaCy                  │   │ Users                          │
│ Sentence Transformers  │   │ Jobs                           │
│ Scikit-learn           │   │ Candidates                     │
│ Transformers           │   │ Resumes                        │
│ Embeddings             │   │ Screening Results              │
│ Semantic Matching      │   │ Bias Flags                     │
└────────────────────────┘   │ Decisions                      │
                             │ Audit Logs                     │
                             └────────────────────────────────┘

5. End-to-End Processing Architecture

Resume PDF/DOCX/TXT
        │
        ▼
┌──────────────────┐
│ Document Parser   │
│ PyMuPDF / DOCX    │
└────────┬─────────┘
         │
         ▼
┌────────────────────────┐
│ Text Cleaning           │
│ Normalization            │
└──────────┬─────────────┘
           │
           ▼
┌────────────────────────┐
│ NLP Information         │
│ Extraction              │
│ Skills / Education /    │
│ Experience / Projects   │
└──────────┬─────────────┘
           │
           ├──────────────────────┐
           ▼                      ▼
┌─────────────────────┐  ┌─────────────────────┐
│ Structured Candidate │  │ Semantic Embedding  │
│ Profile              │  │ Generation          │
└──────────┬──────────┘  └──────────┬──────────┘
           │                        │
           └────────────┬───────────┘
                        ▼
               ┌──────────────────┐
               │ Matching Engine  │
               └────────┬─────────┘
                        │
                        ▼
               ┌──────────────────┐
               │ Score Engine     │
               └────────┬─────────┘
                        │
                        ▼
               ┌──────────────────┐
               │ Explanation      │
               └────────┬─────────┘
                        │
                        ▼
               Recruiter Dashboard

6. Candidate Scoring Architecture

Default transparent scoring:

Component

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

Formula:

Overall Score =
    Required Skill Score × 0.40
  + Experience Score × 0.25
  + Semantic Match Score × 0.20
  + Education Score × 0.05
  + Preferred Skill Score × 0.10

Example:

Required Skills       95
Experience             88
Semantic Match         92
Education             100
Preferred Skills       70

Overall Score          91

The weights should be configurable by authorized administrators.

7. AI/NLP Components

Resume Parsing

Extract:

Name

Contact details

Education

Experience

Skills

Projects

Certifications

Job history

Technical skills

Languages

If information is not found, return:

Not found

Do not fabricate missing candidate information.

Semantic Matching

Use sentence embeddings to compare job requirements with resume content.

Example:

Job:
"Experience building RESTful APIs."

Resume:
"Developed backend services using FastAPI."

The semantic matching engine should recognize the relationship even if the exact keywords differ.

Recommended technology:

Sentence Transformers

Example model:

all-MiniLM-L6-v2

8. Bias Detection Architecture

Bias analysis should focus on potentially problematic hiring criteria and wording, not on making assumptions about a candidate's protected characteristics.

Job Description
       │
       ▼
Text Preprocessing
       │
       ▼
Potential Bias / Proxy Term Detection
       │
       ▼
Context Analysis
       │
       ▼
Severity Classification
       │
       ▼
Explanation
       │
       ▼
Neutral Wording Suggestion
       │
       ▼
Human Review

Example:

"young and energetic candidate"

        ↓

Potential age-related wording

        ↓

Severity: Medium

        ↓

Suggested revision:

"Motivated professional with relevant experience."

Another:

"male candidate preferred"

        ↓

Potential gender-related wording

        ↓

Severity: High

        ↓

Suggested revision:

"Candidate with relevant experience and qualifications."

The system should say:

“Potentially biased wording detected. Human review recommended.”

It should not claim that the phrase proves discriminatory intent.

9. Fair Screening Mode

HireFair AI includes:

🛡 Fair Screening Mode

When enabled, the initial screening experience focuses on job-relevant information.

Use:

Skills

Relevant experience

Education requirements

Certifications

Projects

Job-related semantic relevance

Do not use sensitive or irrelevant personal characteristics for candidate ranking.

Avoid using:

Gender

Race

Religion

Age

Sexual orientation

Marital status

Photograph

Home address

Other protected or irrelevant characteristics

The system should not infer sensitive characteristics from names, photos, addresses, or resume text.

10. Human-in-the-Loop Architecture

The AI should never autonomously make the final hiring decision.

AI Screening
      │
      ▼
AI Recommendation
      │
      ▼
Human Review
      │
      ├── Shortlist
      ├── Needs Review
      └── Reject
      │
      ▼
Audit Log

The application should display:

“HireFair AI provides assistive recommendations. Final hiring decisions are made by authorized human reviewers.”

11. Main Features

Authentication

Login

Logout

JWT authentication

Role-based access

Job Management

Create job

Edit job

Delete/archive job

Upload job description

Extract requirements

Configure required/preferred skills

Resume Management

Upload PDF/DOCX/TXT

Multiple resume upload

Resume processing status

Resume parsing

Candidate profile extraction

AI Screening

Skill matching

Experience matching

Semantic matching

Transparent candidate scoring

Candidate ranking

Explainable AI

Score breakdown

Matching evidence

Missing/not-found skills

Explanation of ranking

Bias Detection

Job description analysis

Potential bias flags

Severity levels

Neutral wording suggestions

Screening criteria audit

Fair Screening

Blind initial screening

Job-relevant ranking

Sensitive information exclusion

Candidate Management

Candidate profiles

Candidate comparison

Shortlist

Reject

Needs review

Recruiter notes

Analytics

Applications

Screening statistics

Match scores

Shortlist rate

Bias flags

Recruiter overrides

AI vs human decisions

Audit

Upload events

Screening events

Bias analysis events

Recruiter decisions

Configuration changes

12. Main Pages

/login

/dashboard

/jobs

/jobs/create

/jobs/:id

/jobs/:id/candidates

/candidates

/candidates/:id

/compare

/bias-analysis

/analytics

/model-performance

/audit-logs

/settings

13. Dashboard

The main dashboard contains:

Active Jobs

Total Candidates

Shortlisted Candidates

Bias Flags

Average Match Score

Screening Time

Recruitment Pipeline

Recent Jobs

Recent Candidate Activity

Recent Bias Alerts

14. Candidate Ranking

Candidate table:

Rank | Candidate | Skills | Experience | Semantic | Overall | Status
---------------------------------------------------------------------
1    | A102      | 95%    | 88%        | 92%      | 91%     | Strong
2    | A109      | 90%    | 85%        | 89%      | 88%     | Strong
3    | A117      | 86%    | 84%        | 88%      | 86%     | Good

Important:

“Not found in resume” must not automatically mean the candidate lacks that skill.

15. Candidate Comparison

Allow up to three candidates.

Compare:

Required skills

Relevant experience

Semantic match

Education

Preferred skills

Projects

Certifications

Overall score

Generate an AI-assisted summary based only on job-related information.

16. Analytics

Charts:

Applications over time

Candidate pipeline

Average match score

Shortlist rate

Screening time

Skill demand

Bias flags over time

Recruiter overrides

AI vs human decisions

Filters:

Date

Job

Department

Recruiter

17. Model Performance

Display actual evaluation metrics when a trained model is connected:

Precision

Recall

F1 Score

ROC-AUC

Confusion Matrix

Semantic Matching Metrics

Do not hard-code fabricated model performance.

If no model is connected:

Model metrics unavailable.
Connect a trained model to display evaluation results.

18. Suggested Technology Stack

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

Cloud deployment as required

19. Backend Service Architecture

Recommended services:

Auth Service
    │
Job Service
    │
Resume Processing Service
    │
Candidate Service
    │
Screening Service
    │
Matching Service
    │
Bias Analysis Service
    │
Analytics Service
    │
Audit Service
    │
Notification Service
    │
AI/NLP Service

Each service should have a clear responsibility.

20. API Architecture

Recommended endpoints:

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

21. Database Architecture

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

22. Recommended Project Structure

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
│   │   ├── types/
│   │   └── App.tsx
│   │
│   ├── package.json
│   └── vite.config.ts
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
│   ├── requirements.txt
│   └── Dockerfile
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

23. Demo Data

For development/demo mode, create:

5 fictional jobs

30 fictional candidates

100+ screening records

10+ potential bias flags

20+ recruiter decisions

50+ audit events

Use fictional data only.

The application should clearly distinguish demo/mock data from real production data.

24. Recommended Demo Job

Senior Python Backend Developer

Required:

Python
FastAPI
REST APIs
SQL
Git

Preferred:

Docker
AWS
React

Experience:

2–5 years

Education:

Computer Science or related field

25. Hackathon Demo Workflow

Use this exact flow during the presentation:

LOGIN
  ↓
OPEN JOB
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

26. Example AI Screening Result

Candidate A102

Overall Match: 91%

Required Skills: 95%
Experience: 88%
Semantic Match: 92%
Education: 100%
Preferred Skills: 70%

Recommendation:
Strong Match

Evidence:
✓ Python
✓ FastAPI
✓ SQL
✓ REST API
✓ Git
✓ Docker

Not Found:
AWS
React

27. Example Bias Alert

Potential Bias Flag

Category:
Age-related wording

Detected:
"young and energetic candidate"

Severity:
Medium

Recommendation:
Review wording.

Suggested alternative:
"Motivated professional with relevant experience."

28. Security Requirements

Implement:

Authentication

Authorization

Protected routes

Password hashing

File validation

File size limits

Secure file storage

Input validation

API validation

Environment variables

Database access controls

Never expose API keys or database credentials in frontend code.

29. Privacy Principles

Resumes may contain personal information.

The system should:

Minimize unnecessary data exposure

Restrict access by role

Avoid using sensitive characteristics for ranking

Avoid inferring protected attributes

Keep audit records

Allow secure deletion where implemented

Protect uploaded resume files

30. Key Differentiators

HireFair AI is different from a basic resume parser because it combines:

1. AI Resume Parsing

Automatically extracts candidate information.

2. Semantic Matching

Understands meaning rather than only exact keywords.

3. Transparent Scoring

Shows how candidate scores are calculated.

4. Explainable AI

Shows why a candidate matched the role.

5. Bias Monitoring

Flags potentially problematic hiring language and criteria.

6. Fair Screening Mode

Focuses screening on job-relevant qualifications.

7. Human-in-the-Loop

Recruiters retain final decision authority.

8. Auditability

Recruiter actions and AI screening events are recorded.

9. Analytics

Provides recruitment and screening insights.

31. Future Enhancements

Possible future features:

Multi-language resume support

More advanced skill taxonomy

Vector database

Advanced semantic search

Candidate recommendation assistant

Interview question generation

Interview scheduling

Candidate feedback analysis

Recruitment CRM integration

Email notifications

SSO

Advanced fairness evaluation

Model monitoring

Human feedback loops

Cloud object storage

Enterprise deployment

32. Limitations

HireFair AI should not be presented as a system that can guarantee unbiased hiring.

AI models can inherit limitations from:

Training data

Resume quality

Job-description quality

Skill extraction errors

Semantic matching errors

Incomplete candidate information

Therefore:

AI output should always be reviewed by qualified humans.

33. Hackathon Value Proposition

Problem

Recruiters may need to screen large numbers of resumes while maintaining consistency and job relevance.

Solution

HireFair AI provides an AI-assisted platform for:

Resume Processing
       +
Job Matching
       +
Explainable Ranking
       +
Bias Monitoring
       +
Fair Screening
       +
Human Review

Impact

The system aims to:

Reduce repetitive screening work

Improve consistency

Make AI recommendations easier to understand

Identify potentially problematic hiring criteria

Encourage job-relevant evaluation

Keep humans responsible for final decisions

34. Quick Start

Frontend

cd frontend

npm install

npm run dev

Backend

cd backend

python -m venv venv

# Windows
venv\Scripts\activate

# Linux/macOS
source venv/bin/activate

pip install -r requirements.txt

uvicorn app.main:app --reload

Database

Configure PostgreSQL using environment variables.

Example:

DATABASE_URL=postgresql://username:password@localhost:5432/hirefair
SECRET_KEY=your_secret_key
AI_API_KEY=your_api_key

Never commit real credentials.

35. Project Goal

The final application should demonstrate a complete workflow:

JOB CREATION
      ↓
JOB REQUIREMENT EXTRACTION
      ↓
BIAS ANALYSIS
      ↓
RESUME UPLOAD
      ↓
RESUME PARSING
      ↓
SKILL EXTRACTION
      ↓
SEMANTIC MATCHING
      ↓
TRANSPARENT SCORING
      ↓
CANDIDATE RANKING
      ↓
EXPLAINABLE AI
      ↓
FAIR SCREENING
      ↓
HUMAN REVIEW
      ↓
SHORTLIST / REVIEW / REJECT
      ↓
AUDIT LOG
      ↓
ANALYTICS

36. Final Vision

HireFair AI should become a transparent recruitment intelligence platform where:

AI handles repetitive analysis, explains its recommendations, monitors potentially problematic screening criteria, and helps recruiters make better-informed decisions — while humans remain responsible for the final hiring decision.

License

Add an appropriate open-source or project-specific license before public distribution.

Disclaimer

This project is intended as a hackathon/prototype system and should not be used as an autonomous employment decision-making system without appropriate legal, privacy, security, fairness, and human-review controls.
