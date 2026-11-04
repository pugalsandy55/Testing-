# AI-Powered ATS Resume Builder Platform

A production-ready, enterprise-grade AI Resume Builder and Applicant Tracking System (ATS) optimization platform.

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![Python](https://img.shields.io/badge/backend-FastAPI%20%7C%20Python%203.11+-green.svg)
![React](https://img.shields.io/badge/frontend-React%2018%20%7C%20TypeScript%20%7C%20Tailwind%20CSS-blueviolet.svg)
![Templates](https://img.shields.io/badge/templates-1000%2B%20Architected%20Layouts-orange.svg)

---

## 🚀 Key Highlights & Capabilities

- **1,000+ Modular Resume Templates**: Genuine programmatic combinatorial template engine across 21+ industries, layout architectures, color palettes, and typographic pairings.
- **Multiformat Resume Parsing**: Extract comprehensive profile data from PDF, DOCX, DOC, and TXT documents with intelligent structure mapping and OCR fallback.
- **Live Visual Drag-and-Drop Resume Editor**: Real-time multi-column editing, section reordering, custom typography, spacing controls, live preview, and autosave.
- **ATS Compatibility Scoring Engine**: Transparent scoring algorithm analyzing keyword density, section taxonomy, structural hierarchy, and formatting compliance.
- **AI-Powered Optimization**: Context-aware bullet point rewriting, action verb enhancement, skill gap detection, and measurable achievement phrasing (OpenAI compatible).
- **Targeted Job Description Analyzer**: Side-by-side job matching, missing keywords extraction, and truthful tailoring suggestions.
- **Instant Cover Letter Generator**: Professional cover letters dynamically synthesized from resume history and target job descriptions.
- **Multi-Format Export**: Pixel-perfect ATS-compliant PDF rendering and structured DOCX export.
- **Enterprise SaaS Architecture**: Role-based access control, subscription tiers (Free, Pro, Enterprise), user management, and admin oversight.

---

## 🏗️ Architecture Overview

```
Testing- (ats-resume-builder)/
├── frontend/                 # React 18, TypeScript, Tailwind CSS, Zustand, Vite
│   ├── src/
│   │   ├── components/       # UI library, Navbar, Editor, Preview, ATS Gauge
│   │   ├── pages/            # 21 Complete Platform Pages
│   │   ├── services/         # API clients (Axios, Auth, Resume, Templates)
│   │   ├── store/            # State management (Zustand)
│   │   └── types/            # TypeScript interfaces & models
├── backend/                  # Python FastAPI Backend
│   ├── app/
│   │   ├── api/v1/           # Modular REST API endpoints
│   │   ├── core/             # Security, config, database session
│   │   ├── models/           # SQLAlchemy ORM models
│   │   ├── schemas/          # Pydantic v2 validation schemas
│   │   └── services/         # Business logic layer
├── ai-engine/                # AI Provider abstraction & prompts
├── document-processing/      # PDF/DOCX/TXT parsers, OCR, and document generators
├── template-engine/          # 1,000+ Template database generator & layout matrices
├── database/                 # Database migrations and seed utilities
├── docker/                   # Multi-stage Dockerfiles
├── tests/                    # End-to-end and unit test suites
└── docs/                     # Technical specifications & API manuals
```

---

## ⚡ Quick Start (Local Development)

### Prerequisites
- Node.js 18+ and npm
- Python 3.10+
- PostgreSQL (or SQLite for quick zero-dependency local dev)

### 1. Clone & Configure
```bash
git clone https://github.com/pugalsandy55/Testing-.git
cd Testing-
cp .env.example .env
```

### 2. Backend Setup
```bash
cd backend
python -m venv venv
# On Windows:
.\venv\Scripts\activate
# On Linux/macOS:
source venv/bin/activate

pip install -r requirements.txt
uvicorn main:app --reload --port 8000
```
Backend API interactive documentation is available at `http://localhost:8000/docs`.

### 3. Frontend Setup
```bash
cd ../frontend
npm install
npm run dev
```
Open `http://localhost:5173` in your browser.

---

## 🐳 Docker Deployment
```bash
docker-compose up --build
```

---

## 🧪 Testing
```bash
pytest tests/ -v
```

---

## 📄 License
This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
