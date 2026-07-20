# 🎓 CertGen — Certificate Generator SaaS

A production-ready Certificate Generator SaaS for generating, managing, and verifying professional internship certificates.

## Tech Stack

| Layer | Technology |
|-------|-----------|
| **Frontend** | Next.js 14 (App Router), TypeScript, TailwindCSS, Shadcn UI |
| **Backend** | Node.js, Express, TypeScript |
| **Database** | PostgreSQL, Prisma ORM |
| **PDF** | Puppeteer (Chromium-based rendering) |
| **Auth** | JWT (JSON Web Tokens) |

## Features

- ✅ Admin authentication (JWT)
- ✅ Company settings (logo, signature, details)
- ✅ Certificate generation with 3 templates (Classic, Modern, Elegant)
- ✅ Rich text editor for custom descriptions
- ✅ Live certificate preview before generation
- ✅ Pixel-perfect PDF generation (A4 Landscape)
- ✅ QR code verification on every certificate
- ✅ Public verification page (`/verify/:certificateId`)
- ✅ Unique certificate IDs (`PREFIX-YEAR-SEQUENCE`)
- ✅ Bulk generation via Excel upload
- ✅ Email certificates as PDF attachments
- ✅ Admin dashboard with statistics
- ✅ Certificate analytics & trends
- ✅ Activity logs
- ✅ Search & filters
- ✅ Duplicate detection
- ✅ Dark mode
- ✅ Docker support
- ✅ Responsive design

## Quick Start

### Prerequisites

- Node.js 18+
- PostgreSQL (running on port 5432)
- npm

### 1. Clone & Install

```bash
# Install backend dependencies
cd backend
npm install

# Install frontend dependencies
cd ../frontend
npm install
```

### 2. Configure Environment

```bash
# Backend — edit backend/.env
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/certificate_generator?schema=public"
JWT_SECRET="your-secret-key"
FRONTEND_URL=http://localhost:3000

# Frontend — edit frontend/.env
NEXT_PUBLIC_API_URL=http://localhost:5000/api
```

### 3. Setup Database

```bash
cd backend

# Generate Prisma client
npx prisma generate

# Push schema to database
npx prisma db push

# Seed default data
npm run seed
```

### 4. Start Development Servers

```bash
# Terminal 1 — Backend
cd backend
npm run dev

# Terminal 2 — Frontend
cd frontend
npm run dev
```

### 5. Login

Open [http://localhost:3000](http://localhost:3000)

| Field | Value |
|-------|-------|
| Email | `admin@certgen.com` |
| Password | `admin123` |

## Docker Setup

```bash
docker-compose up -d
```

This starts PostgreSQL, Backend, and Frontend. Access at `http://localhost:3000`.

## Project Structure

```
├── backend/
│   ├── prisma/
│   │   ├── schema.prisma          # Database models
│   │   └── seed.ts                # Seed script
│   ├── src/
│   │   ├── controllers/           # Request handlers
│   │   ├── middleware/             # Auth, upload, validation
│   │   ├── routes/                # API routes
│   │   ├── services/              # Business logic
│   │   ├── utils/                 # Helpers & templates
│   │   │   └── templates/         # Certificate HTML templates
│   │   ├── lib/                   # Prisma client
│   │   └── index.ts               # Express server
│   ├── uploads/                   # Local file storage
│   └── Dockerfile
│
├── frontend/
│   ├── src/
│   │   ├── app/
│   │   │   ├── login/             # Login page
│   │   │   ├── dashboard/         # Protected dashboard pages
│   │   │   │   ├── certificates/  # Certificate CRUD
│   │   │   │   ├── settings/      # Company settings
│   │   │   │   ├── analytics/     # Certificate analytics
│   │   │   │   └── activity/      # Activity logs
│   │   │   └── verify/            # Public verification
│   │   ├── components/            # Reusable UI components
│   │   ├── hooks/                 # Auth & theme hooks
│   │   ├── lib/                   # API client & utilities
│   │   └── types/                 # TypeScript definitions
│   └── Dockerfile
│
├── docker-compose.yml
├── .env.example
└── README.md
```

## API Endpoints

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| POST | `/api/auth/login` | Admin login | ❌ |
| GET | `/api/auth/me` | Get current admin | ✅ |
| GET | `/api/company` | Get company settings | ✅ |
| PUT | `/api/company` | Update company settings | ✅ |
| POST | `/api/company/logo` | Upload company logo | ✅ |
| POST | `/api/company/signature` | Upload director signature | ✅ |
| POST | `/api/certificate` | Generate certificate | ✅ |
| GET | `/api/certificates` | List certificates | ✅ |
| GET | `/api/certificate/:id` | Get certificate details | ✅ |
| GET | `/api/certificate/download/:id` | Download PDF | ✅ |
| DELETE | `/api/certificate/:id` | Revoke certificate | ✅ |
| POST | `/api/certificate/:id/email` | Email certificate | ✅ |
| POST | `/api/certificate/bulk` | Bulk generate from Excel | ✅ |
| POST | `/api/certificate/preview` | Preview certificate HTML | ✅ |
| GET | `/api/certificates/stats` | Dashboard statistics | ✅ |
| GET | `/api/certificates/template` | Download Excel template | ✅ |
| GET | `/api/verify/:certificateId` | Verify certificate | ❌ |
| GET | `/api/activity` | Activity logs | ✅ |

## Certificate Templates

| Template | Style |
|----------|-------|
| **Classic** | Formal with decorative borders, serif fonts, and gold accents |
| **Modern** | Clean split-panel design with gradient accents |
| **Elegant** | Gold ornamental borders with calligraphy fonts |

## License

MIT
