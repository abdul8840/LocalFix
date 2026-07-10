# 🛠️ LocalFix

> A **location-based local service finder platform** built for small towns and rural areas — connecting customers with verified electricians, plumbers, painters, carpenters, and other local workers.

[![Node.js](https://img.shields.io/badge/Node.js-20+-339933?logo=node.js&logoColor=white)]()
[![React](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=white)]()
[![Vite](https://img.shields.io/badge/Vite-6-646CFF?logo=vite&logoColor=white)]()
[![Tailwind](https://img.shields.io/badge/Tailwind-4.1-06B6D4?logo=tailwindcss&logoColor=white)]()
[![SQL Server](https://img.shields.io/badge/SQL_Server-2019+-CC2927?logo=microsoftsqlserver&logoColor=white)]()
[![License](https://img.shields.io/badge/License-MIT-yellow.svg)]()

---

## 📖 Table of Contents

- [Overview](#-overview)
- [Key Features](#-key-features)
- [Tech Stack](#-tech-stack)
- [System Architecture](#-system-architecture)
- [Project Structure](#-project-structure)
- [Prerequisites](#-prerequisites)
- [Installation & Setup](#-installation--setup)
- [Environment Variables](#-environment-variables)
- [Running the Application](#-running-the-application)
- [User Roles](#-user-roles)
- [API Endpoints](#-api-endpoints)
- [AI-Based Recommendation](#-ai-based-recommendation-system)
- [Fraud Detection](#-fraud-detection-system)
- [Screenshots & Flow](#-screenshots--flow)
- [Testing Guide](#-testing-guide)
- [Contributing](#-contributing)
- [License](#-license)

---

## 🌟 Overview

**LocalFix** solves a real problem in small towns and villages: finding a **trusted, nearby, verified worker** for everyday household needs. Big-city service apps rarely serve rural pincodes well; LocalFix is built for exactly that gap.

### Who is it for?

- 🏠 **Customers** in small towns who need reliable plumbers, electricians, painters, etc.
- 🛠️ **Local workers** who want more visibility and steady bookings.
- 👨‍💼 **Admins** who verify quality, moderate the platform, and detect fraud.

### What makes it different?

- ✅ **Manual worker verification** — every worker is reviewed before going live.
- 📍 **Pincode-first discovery** — designed for hyperlocal reach.
- 🧠 **AI-lite recommendation** — ranks workers by proximity, ratings, and reliability.
- 💵 **Offline payment flow** — pay workers directly, no gateway fees.
- 🚨 **Automated fraud detection** — protects customers from bad actors.

---

## ✨ Key Features

### 👤 For Customers
- Browse services **without logging in**
- Authenticate to send service requests
- **Location-based search** using pincode or radius
- Track job status in real time (pending → accepted → in progress → completed)
- Submit **star ratings and reviews** after job completion
- View worker profiles with full history

### 🔧 For Workers
- Register with profile details, category, experience, and ID proof
- Manage availability with a single toggle
- Accept, reject, start, and complete jobs from a clean dashboard
- Track earnings and mark offline payments
- Read customer reviews and improve reputation

### 🛡️ For Admins
- **Dedicated admin dashboard** with 5 sections
- Verify pending workers (approve/reject)
- Manage all users — search, filter, block/unblock
- Moderate reviews — flag, unflag, or delete
- **Real-time analytics** — KPIs, charts, top-workers leaderboard
- **Automated fraud detection** with one-click blocking
- View 14-day request trends and category breakdowns

### 🔐 Security & Quality
- **JWT-based authentication** with role-based access control (RBAC)
- Bcrypt password hashing (10 salt rounds)
- **Zod validation** on every input
- Helmet, CORS, rate limiting for API protection
- Centralized error handling
- Repository pattern for clean data access

---

## 🧰 Tech Stack

### Backend
| Technology | Version | Purpose |
|------------|---------|---------|
| **Node.js** | 20+ | Runtime |
| **Express.js** | 5.x | Web framework (ES Modules) |
| **MSSQL** | 11.x | SQL Server driver |
| **JWT** | 9.x | Authentication tokens |
| **bcryptjs** | 3.x | Password hashing |
| **Zod** | 3.x | Schema validation |
| **Helmet** | 8.x | Security headers |
| **Morgan** | 1.x | HTTP logging |
| **express-rate-limit** | 7.x | Rate limiting |
| **CORS** | 2.x | Cross-origin support |

### Frontend
| Technology | Version | Purpose |
|------------|---------|---------|
| **React** | 19 | UI library |
| **Vite** | 6 | Build tool & dev server |
| **Tailwind CSS** | 4.1 | Utility-first styling |
| **React Router** | 7 | Client-side routing |
| **Lucide React** | 0.469 | Icon set |
| **Native fetch** | — | HTTP client (no Axios) |

### Database
- **Microsoft SQL Server** (managed via SSMS)
- 6 tables: Users, WorkerProfiles, ServiceCategories, ServiceRequests, Reviews, FraudAlerts

---

## 🏗️ System Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                     CLIENT (React 19 + Vite)                │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌────────────┐  │
│  │ Customer │  │  Worker  │  │  Public  │  │   Admin    │  │
│  │Dashboard │  │Dashboard │  │  Pages   │  │ Dashboard  │  │
│  └──────────┘  └──────────┘  └──────────┘  └────────────┘  │
│         │            │            │              │          │
│         └────────────┴────────────┴──────────────┘          │
│                          │                                   │
│                  Native fetch + JWT                          │
└─────────────────────────┬───────────────────────────────────┘
                          │  HTTPS / REST
┌─────────────────────────▼───────────────────────────────────┐
│                    SERVER (Node + Express)                   │
│  ┌────────────────────────────────────────────────────────┐ │
│  │  Middleware: helmet · cors · rate-limit · morgan       │ │
│  ├────────────────────────────────────────────────────────┤ │
│  │  Auth: JWT verify → RBAC (protect + authorize)          │ │
│  ├────────────────────────────────────────────────────────┤ │
│  │  Routes → Controllers → Models (Repository pattern)     │ │
│  ├────────────────────────────────────────────────────────┤ │
│  │  Services: Recommendation Engine · Fraud Detection      │ │
│  └────────────────────────────────────────────────────────┘ │
└─────────────────────────┬───────────────────────────────────┘
                          │  mssql pool
┌─────────────────────────▼───────────────────────────────────┐
│              MICROSOFT SQL SERVER (via SSMS)                 │
│   Users · WorkerProfiles · ServiceCategories                 │
│   ServiceRequests · Reviews · FraudAlerts                    │
└──────────────────────────────────────────────────────────────┘
```

---

## 📁 Project Structure

```
localfix/
├── backend/
│   ├── src/
│   │   ├── config/
│   │   │   └── db.js                       # SQL Server connection pool
│   │   ├── controllers/
│   │   │   ├── auth.controller.js          # Register, login, me, logout
│   │   │   ├── category.controller.js      # List service categories
│   │   │   ├── worker.controller.js        # Discover, view, update workers
│   │   │   ├── serviceRequest.controller.js# Job lifecycle
│   │   │   ├── review.controller.js        # Customer reviews
│   │   │   ├── admin.controller.js         # Admin operations
│   │   │   └── fraud.controller.js         # Fraud alerts
│   │   ├── middleware/
│   │   │   ├── auth.middleware.js          # JWT verify + role guard
│   │   │   ├── validate.middleware.js      # Zod validation
│   │   │   └── errorHandler.js             # Centralized errors
│   │   ├── models/
│   │   │   ├── user.model.js
│   │   │   ├── workerProfile.model.js
│   │   │   ├── category.model.js
│   │   │   ├── serviceRequest.model.js
│   │   │   ├── review.model.js
│   │   │   ├── admin.model.js
│   │   │   └── fraud.model.js
│   │   ├── routes/
│   │   │   ├── health.routes.js
│   │   │   ├── auth.routes.js
│   │   │   ├── category.routes.js
│   │   │   ├── worker.routes.js
│   │   │   ├── serviceRequest.routes.js
│   │   │   ├── review.routes.js
│   │   │   ├── admin.routes.js
│   │   │   └── fraud.routes.js
│   │   ├── services/
│   │   │   └── fraudDetection.service.js   # Rule-based scanner
│   │   ├── utils/
│   │   │   ├── ApiResponse.js
│   │   │   ├── ApiError.js
│   │   │   ├── asyncHandler.js
│   │   │   ├── jwt.js
│   │   │   ├── distance.js                 # Haversine
│   │   │   └── recommendation.js           # AI-lite ranker
│   │   ├── validators/
│   │   │   ├── auth.validator.js
│   │   │   ├── worker.validator.js
│   │   │   ├── serviceRequest.validator.js
│   │   │   ├── review.validator.js
│   │   │   └── admin.validator.js
│   │   └── app.js                          # Express app entry
│   ├── database/
│   │   └── schema.sql                      # Full DB schema + seed
│   ├── scripts/
│   │   └── seedAdmin.js                    # Bootstrap admin account
│   ├── .env
│   ├── .env.example
│   ├── .gitignore
│   ├── package.json
│   └── server.js
│
└── frontend/
    ├── src/
    │   ├── api/
    │   │   ├── client.js                   # Native fetch wrapper
    │   │   ├── auth.api.js
    │   │   ├── category.api.js
    │   │   ├── worker.api.js
    │   │   ├── request.api.js
    │   │   ├── review.api.js
    │   │   ├── admin.api.js
    │   │   └── fraud.api.js
    │   ├── components/
    │   │   ├── layout/
    │   │   │   ├── Navbar.jsx
    │   │   │   └── Footer.jsx
    │   │   ├── admin/
    │   │   │   ├── AdminLayout.jsx
    │   │   │   ├── AdminSidebar.jsx
    │   │   │   ├── StatCard.jsx
    │   │   │   ├── SimpleLineChart.jsx
    │   │   │   └── SimpleBarChart.jsx
    │   │   ├── WorkerCard.jsx
    │   │   ├── StarRating.jsx
    │   │   ├── StatusBadge.jsx
    │   │   ├── ConfirmDialog.jsx
    │   │   └── ProtectedRoute.jsx
    │   ├── context/
    │   │   └── AuthContext.jsx
    │   ├── pages/
    │   │   ├── Home.jsx
    │   │   ├── About.jsx
    │   │   ├── Login.jsx
    │   │   ├── RegisterChoice.jsx
    │   │   ├── RegisterCustomer.jsx
    │   │   ├── RegisterWorker.jsx
    │   │   ├── Services.jsx
    │   │   ├── WorkerDetail.jsx
    │   │   ├── BookService.jsx
    │   │   ├── dashboards/
    │   │   │   ├── CustomerDashboard.jsx
    │   │   │   └── WorkerDashboard.jsx
    │   │   └── admin/
    │   │       ├── AdminOverview.jsx
    │   │       ├── AdminWorkers.jsx
    │   │       ├── AdminUsers.jsx
    │   │       ├── AdminReviews.jsx
    │   │       └── AdminFraud.jsx
    │   ├── App.jsx
    │   ├── main.jsx
    │   └── index.css
    ├── index.html
    ├── vite.config.js
    ├── .env
    ├── .env.example
    ├── .gitignore
    └── package.json
```

---

## 📋 Prerequisites

Before setup, make sure you have:

- **Node.js** 20.x or higher — [Download](https://nodejs.org/)
- **npm** 10.x or higher (bundled with Node)
- **Microsoft SQL Server** 2019 or higher — [Download](https://www.microsoft.com/sql-server)
- **SQL Server Management Studio (SSMS)** — [Download](https://learn.microsoft.com/sql/ssms/download-sql-server-management-studio-ssms)
- **Git** (optional) — [Download](https://git-scm.com/)

Verify installs:
```bash
node -v      # v20+
npm -v       # v10+
```

---

## 🚀 Installation & Setup

### 1. Clone the repository

```bash
git clone https://github.com/your-username/localfix.git
cd localfix
```

### 2. Set up the database

1. Open **SQL Server Management Studio (SSMS)**.
2. Connect to your local SQL Server instance.
3. Open `backend/database/schema.sql`.
4. Click **Execute** (F5).
5. Verify: you should see `LocalFixDB` in Object Explorer with 6 tables and 8 seeded categories.

### 3. Backend setup

```bash
cd backend
cp .env.example .env          # then edit with your credentials
npm install
npm run seed:admin            # creates the default admin account
npm run dev
```

Backend runs on **http://localhost:5000**

### 4. Frontend setup

Open a new terminal:

```bash
cd frontend
cp .env.example .env
npm install
npm run dev
```

Frontend runs on **http://localhost:5173**

---

## 🔐 Environment Variables

### `backend/.env`

```env
# Server
PORT=5000
NODE_ENV=development

# SQL Server
DB_USER=sa
DB_PASSWORD=YourStrongPassword123
DB_SERVER=localhost
DB_NAME=LocalFixDB
DB_PORT=1433
DB_ENCRYPT=false
DB_TRUST_CERT=true

# JWT
JWT_SECRET=change_this_super_secret_key_for_localfix_2026
JWT_EXPIRES_IN=7d

# CORS
CLIENT_URL=http://localhost:5173
```

### `frontend/.env`

```env
VITE_API_URL=http://localhost:5000/api
```

---

## ▶️ Running the Application

### Development mode

**Backend:**
```bash
cd backend
npm run dev     # Uses nodemon for auto-reload
```

**Frontend:**
```bash
cd frontend
npm run dev
```

### Production build

**Backend:**
```bash
cd backend
npm start
```

**Frontend:**
```bash
cd frontend
npm run build
npm run preview
```

### Default admin credentials

After running `npm run seed:admin`:

```
Email:    admin@localfix.com
Password: Admin@12345
```

> ⚠️ **Change this password immediately** in a production environment.

---

## 👥 User Roles

| Role | Registration | Access | Key Actions |
|------|--------------|--------|-------------|
| **Customer** | Public signup | `/customer` | Browse, book, track, review |
| **Worker** | Public signup + admin approval | `/worker` | Manage profile, accept/complete jobs |
| **Admin** | Seeded via script only | `/admin` | Verify workers, manage users, view analytics, moderate |

---

## 🌐 API Endpoints

Base URL: `http://localhost:5000/api`

### Authentication
| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| POST | `/auth/register/customer` | Public | Register a customer |
| POST | `/auth/register/worker` | Public | Register a worker (pending approval) |
| POST | `/auth/login` | Public | Login (all roles) |
| GET | `/auth/me` | Auth | Get current user |
| POST | `/auth/logout` | Auth | Logout |

### Categories
| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| GET | `/categories` | Public | List all active categories |

### Workers
| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| GET | `/workers/discover` | Public | Discover ranked workers (query: category_id, pincode, lat, lng, radius) |
| GET | `/workers/:id` | Public | View worker detail + reviews |
| GET | `/workers/me` | Worker | Get own profile |
| PATCH | `/workers/me` | Worker | Update own profile |

### Service Requests
| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| POST | `/requests` | Customer | Create a service request |
| GET | `/requests/mine` | Customer | List customer's requests |
| GET | `/requests/assigned` | Worker | List worker's assigned jobs |
| PATCH | `/requests/:id/status` | Customer/Worker | Update request status |

### Reviews
| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| POST | `/reviews` | Customer | Submit a review (after completion) |
| GET | `/reviews/worker/:userId` | Public | List reviews for a worker |

### Admin
| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| GET | `/admin/analytics` | Admin | KPIs + charts + top workers |
| GET | `/admin/workers` | Admin | List workers (filter by status) |
| PATCH | `/admin/workers/:id/verification` | Admin | Approve or reject |
| GET | `/admin/users` | Admin | List users (filter, search) |
| PATCH | `/admin/users/:id/blocked` | Admin | Block or unblock a user |
| GET | `/admin/reviews` | Admin | List all reviews (filter by flagged) |
| PATCH | `/admin/reviews/:id/flag` | Admin | Flag or unflag a review |
| DELETE | `/admin/reviews/:id` | Admin | Delete a review |

### Fraud Detection
| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| GET | `/fraud/alerts` | Admin | List fraud alerts |
| POST | `/fraud/scan` | Admin | Run detection rules |
| PATCH | `/fraud/alerts/:id/resolve` | Admin | Mark alert as resolved |

---

## 🧠 AI-Based Recommendation System

Every worker is scored on a **composite match score** (0–1), surfaced in the UI as a **% match badge**.

### Formula

```
match_score =
    0.40 × proximity_score      (closer = higher)
  + 0.35 × rating_score          (better rating = higher)
  + 0.25 × reliability_score     (more jobs & reviews = higher)
```

### Signals

| Signal | Source | Normalization |
|--------|--------|---------------|
| **Proximity** | Haversine distance from customer's lat/lng | Inverted, capped at 50km |
| **Rating** | `rating_avg` from Reviews | Linear 0–5 → 0–1 |
| **Reliability** | Blend of `jobs_completed` + `total_reviews` | 0–50 and 0–30 buckets |

### Why not a heavier model?

For a small-town scale platform, a deterministic weighted-score model is more explainable, faster, and requires no training data. It behaves like a "smart sort" that a customer can intuitively trust.

---

## 🚨 Fraud Detection System

Admins can trigger an on-demand scan that runs 4 rules and generates alerts.

| Rule | Severity | Trigger |
|------|----------|---------|
| Low average rating | 🔴 High | `rating_avg < 2.5` with `total_reviews ≥ 3` |
| High rejection rate | 🟠 Medium | `> 50%` cancelled or rejected across `≥ 4` requests |
| Repeated 1-star reviews | 🟠 Medium | `≥ 3` 1-star reviews in last 30 days |
| Dormant profile | ⚪ Low | Approved `≥ 60 days` ago with 0 completed jobs |

Alerts are **deduplicated** — the same reason won't create duplicate open alerts for the same worker. Admins can **resolve** an alert or **block the worker** directly from the alert card.

---

## 🎨 Screenshots & Flow

### Customer Flow
```
Home → Search by pincode → Browse ranked workers → View profile
     → Login/Register → Book service → Track status → Review after completion
```

### Worker Flow
```
Register with profile + category + pincode → Wait for admin approval
     → Toggle availability → Receive requests → Accept → Start → Complete (with price)
     → Read reviews and improve
```

### Admin Flow
```
Login → Overview (KPIs + charts) → Verify pending workers
     → Manage users (block/unblock) → Moderate reviews → Run fraud scans
```

---

## 🧪 Testing Guide

### End-to-end smoke test

1. **Approve testing workers** (if not testing verification):
   ```sql
   UPDATE WorkerProfiles SET verification_status = 'approved';
   ```

2. **Register a customer** at `/register/customer`

3. **Register a worker** with the same pincode as the customer

4. **Login as admin** → approve the worker

5. **Login as customer** → browse `/services` → book the worker

6. **Login as worker** → accept → start → complete (with price)

7. **Login as customer** → leave a 5-star review

8. **Login as admin** → check analytics → run fraud scan

### API quick tests (curl)

```bash
# Health check
curl http://localhost:5000/api/health

# Register a customer
curl -X POST http://localhost:5000/api/auth/register/customer \
  -H "Content-Type: application/json" \
  -d '{"name":"Test","email":"test@x.com","password":"pass123"}'

# Discover workers
curl "http://localhost:5000/api/workers/discover?pincode=211001"

# Get analytics (admin token required)
curl http://localhost:5000/api/admin/analytics \
  -H "Authorization: Bearer YOUR_TOKEN"
```

---

## 🐛 Troubleshooting

### "SQL Server connection failed"
- Verify SQL Server service is running.
- Check `DB_SERVER`, `DB_USER`, `DB_PASSWORD` in `.env`.
- Ensure SQL Server allows TCP/IP connections on port 1433 (SQL Server Configuration Manager).
- Enable Mixed Mode authentication if using `sa`.

### "Invalid or expired token"
- Clear localStorage in browser DevTools → Application → Local Storage.
- Log in again.

### Workers not appearing in search
- They must be `approved`. Run: `UPDATE WorkerProfiles SET verification_status = 'approved';`
- Their user account must not be blocked.
- Their `availability` must be `1`.

### CORS errors
- Confirm `CLIENT_URL` in backend `.env` matches your frontend URL exactly.

---

## 🤝 Contributing

Contributions welcome! Please:

1. Fork the repo
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## 📄 License

This project is licensed under the **MIT License** — see the [LICENSE](LICENSE) file for details.

---

## 🙏 Acknowledgements

- **Anthropic Claude** for assistance in architecture and code generation
- **Lucide** for the beautiful icon set
- **Tailwind CSS** for the styling foundation
- Every rural worker and customer who inspired this project

---

## 📬 Contact

- **Project Lead:** Your Name
- **Email:** your.email@example.com
- **GitHub:** [@your-username](https://github.com/your-username)

---

<p align="center">
  <b>Built with ❤️ for small towns and villages</b>
</p>
