# University of Port Harcourt Academic Result Portal

Production-oriented monorepo starter implementing the supplied specification:
Next.js + TypeScript + Tailwind frontend, Express + TypeScript REST API, MongoDB/Mongoose,
JWT in HTTP-only cookies, RBAC, grading/GPA/CGPA, result workflow, audit logging,
pagination/filtering, and seed data.

## Requirements

- Node.js 20+
- MongoDB 7+ (local or Atlas)

## Setup

### Backend

```bash
cd backend
cp .env.example .env
npm install
npm run seed
npm run dev
```

### Frontend

```bash
cd frontend
cp .env.example .env.local
npm install
npm run dev
```

Frontend: http://localhost:3000
Backend: http://localhost:5000

## Demo accounts

All demo accounts use the password `Password123!`

- admin@uniport.test
- lecturer@uniport.test
- student@uniport.test

## Workflow

DRAFT -> SUBMITTED -> UNDER_REVIEW -> APPROVED -> RELEASED
SUBMITTED -> REJECTED -> DRAFT

Only administrators can approve/reject/release. Students receive released results only.

## Important

This repository contains development seed data only. Replace secrets, credentials,
CORS configuration and deployment settings before production use.

## Demo accounts

Here are the demo login details for the project:

Role Email Password
Admin admin@uniport.test Password123!
Lecturer lecturer@uniport.test Password123!
Student student@uniport.test Password123!
# GradeCore
