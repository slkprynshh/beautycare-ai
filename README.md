# VertOps — BeautyCare AI

> **"Never lose a customer because you forgot to follow up."**
> 
> Production-grade, WhatsApp-native automated revenue-recovery platform and salon management system designed for salons, spas, and aesthetic clinics.

---

## 🌟 Key Features

1. **Staff & Service Calendar**: Daily, 7-day weekly horizon, and agenda list views with staff lane management, collision prevention, and instant booking drawer.
2. **Deterministic 24-Hour WhatsApp Reminders**: Automated appointment confirmations with quiet hours (`21:30` - `09:30` IST) and client opt-out guardrails.
3. **No-Show Recovery Engine**: Automatic missed appointment detection with instant WhatsApp reschedule prompts.
4. **Service-Interval Due Nudges**: AI-driven re-engagement for overdue client return cycles with 14-day anti-spam cooldowns.
5. **Two-Way WhatsApp Inbox & AI Assistant**: Integrated conversation thread management with intent classification (`RESCHEDULE`, `BOOKING_REQUEST`, `CANCELLATION`, `COMPLAINT`) and entity extraction.
6. **Transparent Revenue Recovery Analytics**: 3-tier attribution model distinguishing *Estimated*, *Booked*, and *Confirmed* realized revenue in Indian Rupees (`₹`).
7. **Multi-Tenant SaaS Architecture**: Strict tenant isolation across salons, users, customers, services, and staff memberships.

---

## 🛠️ Technology Stack

### Frontend
- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS, Vanilla CSS Design System, Custom Apple Palette
- **State Management**: Zustand
- **Animations & Icons**: Framer Motion, Lucide React
- **Analytics Charts**: Recharts

### Backend
- **Framework**: FastAPI (Python 3.9+)
- **ORM & Database**: SQLAlchemy 2.0 (Async) + SQLite / PostgreSQL
- **Validation**: Pydantic v2
- **Authentication**: Phone OTP + JWT (Access & Refresh Tokens) with pure-python fallback security
- **Background Tasks**: Async scheduler worker & rule-based automation engine
- **API Documentation**: Interactive OpenAPI Swagger UI (`/api/docs`) and ReDoc (`/api/redoc`)

---

## 🚀 Quick Start Guide

### 1. Prerequisites
- Node.js (v18+)
- Python (v3.9+)
- Git

### 2. Frontend Setup
```bash
# Install dependencies
npm install

# Start development server (http://localhost:3000)
npm run dev
```

### 3. Backend Setup
```bash
# Navigate to backend directory
cd backend

# Install Python dependencies
pip install -r requirements.txt

# Run database migrations and seed realistic demo dataset
python scripts/seed.py

# Start FastAPI server (http://localhost:8000)
python -m uvicorn app.main:app --host 0.0.0.0 --port 8000
```

### 4. Running Backend Tests
```bash
cd backend
python -m pytest tests -v
```

---

## 📁 Repository Structure

```
├── backend/
│   ├── app/
│   │   ├── api/v1/          # 35 REST API endpoints (Auth, Appointments, AI, Recovery, etc.)
│   │   ├── core/            # Config, security, database, exceptions, middleware
│   │   ├── models/          # 15 SQLAlchemy multi-tenant domain models
│   │   ├── schemas/         # Pydantic v2 request/response contracts
│   │   ├── services/        # Business logic (Automation, Recovery, AI, Messaging)
│   │   └── workers/         # Periodic automation scheduler & queue workers
│   ├── scripts/             # Database initialization & seed script
│   └── tests/               # Pytest automated test suites
├── src/
│   ├── app/                 # Next.js 14 App Router pages & layouts
│   ├── components/          # Apple-inspired UI components, drawers, modals
│   ├── store/               # Zustand application store
│   ├── types/               # TypeScript domain interfaces
│   └── lib/                 # Utility helpers, INR currency formatters, mock data
├── package.json
└── README.md
```

---

## 🔒 Security & Privacy
- Zero plaintext password storage (bcrypt / PBKDF2).
- Tenant-scoped database queries preventing cross-tenant leakage.
- Quiet-hours enforcement to comply with messaging etiquette.
- Rate limiting and idempotency key support.

---

## 📄 License
MIT License. Built for modern salons, spas, and wellness clinics.
