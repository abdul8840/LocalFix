# 📘 LocalFix — Technical Documentation

> **Version:** 1.0.0
> **Last Updated:** 2026
> **Author:** LocalFix Team

Full technical documentation for developers, reviewers, and evaluators.

---

## 📑 Table of Contents

1. [Introduction](#1-introduction)
2. [System Requirements](#2-system-requirements)
3. [Architecture Overview](#3-architecture-overview)
4. [Database Design](#4-database-design)
5. [Backend Documentation](#5-backend-documentation)
6. [Frontend Documentation](#6-frontend-documentation)
7. [Authentication & Security](#7-authentication--security)
8. [API Reference](#8-api-reference)
9. [Recommendation Engine](#9-recommendation-engine)
10. [Fraud Detection Engine](#10-fraud-detection-engine)
11. [Deployment Guide](#11-deployment-guide)
12. [Testing](#12-testing)
13. [FAQ](#13-faq)

---

## 1. Introduction

### 1.1 Purpose

LocalFix is a full-stack web platform that connects **customers in small towns and rural areas** with **verified local service workers** — electricians, plumbers, painters, carpenters, and more. Unlike big-city apps, LocalFix is optimized for pincode-based hyperlocal discovery, manual worker vetting, and offline payments.

### 1.2 Scope

The application handles:

- User registration and authentication (Customer, Worker, Admin)
- Worker profile management with manual admin verification
- Location-based worker discovery with intelligent ranking
- Service request lifecycle (booking → tracking → completion)
- Rating and review system
- Admin operations (analytics, moderation, fraud detection)
- Offline payment tracking

### 1.3 Objectives

| Objective | How LocalFix Addresses It |
|-----------|---------------------------|
| Bring small-town workers online | Simple registration, admin verification, direct customer access |
| Build trust | Verified profiles, review system, fraud detection |
| Enable location-based discovery | Pincode search, radius filter, distance-aware ranking |
| Support offline payments | No payment gateway; workers mark payment received manually |
| Empower admins | Dedicated dashboard with analytics and moderation tools |

---

## 2. System Requirements

### 2.1 Software Requirements

| Component | Minimum | Recommended |
|-----------|---------|-------------|
| Node.js | 18.x | 20.x LTS |
| npm | 9.x | 10.x |
| SQL Server | 2017 | 2019 or newer |
| SSMS | 18.x | Latest |
| Browser | Chrome 100+, Firefox 100+, Edge 100+ | Latest |
| OS | Windows 10, macOS 12, Ubuntu 20.04 | Latest |

### 2.2 Hardware Requirements

**Development:**
- 8 GB RAM
- 10 GB free disk space
- Dual-core CPU

**Production (small scale):**
- 4 GB RAM
- 20 GB SSD
- 2 vCPU

---

## 3. Architecture Overview

### 3.1 Layered Architecture

LocalFix follows a **clean, layered architecture** on both frontend and backend for maintainability.

#### Backend Layers

```
┌─────────────────────────────────────────────────┐
│           HTTP Layer (Routes)                   │  ← Express routers
├─────────────────────────────────────────────────┤
│           Middleware Layer                      │  ← Auth, validation, errors
├─────────────────────────────────────────────────┤
│           Controller Layer                      │  ← Request handlers
├─────────────────────────────────────────────────┤
│           Service Layer                         │  ← Business logic (fraud, recommendation)
├─────────────────────────────────────────────────┤
│           Model Layer (Repository)              │  ← Data access
├─────────────────────────────────────────────────┤
│           Database Layer (MSSQL)                │  ← Persistence
└─────────────────────────────────────────────────┘
```

#### Frontend Layers

```
┌─────────────────────────────────────────────────┐
│           Pages (Route-level components)        │
├─────────────────────────────────────────────────┤
│           Components (Reusable UI)              │
├─────────────────────────────────────────────────┤
│           Context (Auth state)                  │
├─────────────────────────────────────────────────┤
│           API Modules (fetch wrappers)          │
├─────────────────────────────────────────────────┤
│           HTTP Client (native fetch + JWT)      │
└─────────────────────────────────────────────────┘
```

### 3.2 Communication Flow

```
User Action (UI)
   ↓
React Component → API Module
   ↓
fetch() with JWT Bearer token
   ↓
Express Route → Middleware (auth, validation)
   ↓
Controller
   ↓
Service (if business logic needed)
   ↓
Model (SQL query via mssql pool)
   ↓
SQL Server → Response
   ↓
JSON response back to React
   ↓
Component re-renders with new data
```

### 3.3 Design Patterns Used

| Pattern | Where | Why |
|---------|-------|-----|
| **Repository** | Backend models | Isolate SQL from business logic |
| **Middleware Chain** | Express | Composable request processing |
| **Async Handler Wrapper** | `asyncHandler.js` | Clean async error handling |
| **Context Provider** | React AuthContext | Global auth state |
| **Protected Route** | React | Declarative route guarding |
| **Custom Hook** | `useAuth` | Reusable auth access |
| **Factory Function** | `ApiResponse` | Consistent API responses |

---

## 4. Database Design

### 4.1 Entity Relationship Diagram (Text)

```
┌────────────┐        ┌──────────────────┐        ┌────────────────────┐
│   Users    │───┬────│  WorkerProfiles  │───────►│ ServiceCategories  │
│            │   │    │                  │        │                    │
│ id (PK)    │   │    │ id (PK)          │        │ id (PK)            │
│ name       │   │    │ user_id (FK)     │        │ name               │
│ email      │   │    │ category_id (FK) │        │ description        │
│ role       │   │    │ pincode          │        │ icon               │
│ is_blocked │   │    │ rating_avg       │        └────────────────────┘
└────────────┘   │    │ jobs_completed   │
       │         │    │ verification     │
       │         │    └──────────────────┘
       │         │            ▲
       │         │            │
       │         ▼            │
       │  ┌────────────────────────┐        ┌─────────────┐
       └─►│   ServiceRequests      │───────►│   Reviews   │
          │                        │        │             │
          │ id (PK)                │        │ id (PK)     │
          │ customer_id (FK)       │        │ request_id  │
          │ worker_id (FK)         │        │ rating      │
          │ category_id (FK)       │        │ comment     │
          │ status                 │        │ is_flagged  │
          │ price                  │        └─────────────┘
          │ payment_status         │
          └────────────────────────┘

       ┌────────────────────────┐
       │     FraudAlerts        │
       │                        │
       │ id (PK)                │
       │ worker_id (FK)         │
       │ reason                 │
       │ severity               │
       │ resolved               │
       └────────────────────────┘
```

### 4.2 Table Specifications

#### 4.2.1 `Users`
Central identity table for all three roles.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `id` | INT | PK, IDENTITY | Auto-generated user ID |
| `name` | NVARCHAR(150) | NOT NULL | Full name |
| `email` | NVARCHAR(150) | UNIQUE, NOT NULL | Login email |
| `phone` | NVARCHAR(20) | NULL | Contact number |
| `password_hash` | NVARCHAR(255) | NOT NULL | Bcrypt hash |
| `role` | NVARCHAR(20) | CHECK (customer/worker/admin) | Role type |
| `is_blocked` | BIT | DEFAULT 0 | Admin block flag |
| `created_at` | DATETIME2 | DEFAULT SYSUTCDATETIME() | Creation timestamp |
| `updated_at` | DATETIME2 | DEFAULT SYSUTCDATETIME() | Update timestamp |

#### 4.2.2 `WorkerProfiles`
Extended profile for users with `role = 'worker'`.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `id` | INT | PK, IDENTITY | Profile ID |
| `user_id` | INT | FK Users, UNIQUE | Owner user |
| `category_id` | INT | FK ServiceCategories | Service category |
| `experience_years` | INT | DEFAULT 0 | Years of experience |
| `bio` | NVARCHAR(1000) | NULL | Self-description |
| `pincode` | NVARCHAR(10) | NOT NULL | Primary service pincode |
| `city` | NVARCHAR(100) | NULL | City |
| `state` | NVARCHAR(100) | NULL | State |
| `latitude` | DECIMAL(9,6) | NULL | GPS latitude |
| `longitude` | DECIMAL(9,6) | NULL | GPS longitude |
| `availability` | BIT | DEFAULT 1 | Currently accepting work |
| `id_proof_url` | NVARCHAR(500) | NULL | Link to ID proof |
| `profile_image_url` | NVARCHAR(500) | NULL | Profile picture |
| `verification_status` | NVARCHAR(20) | CHECK (pending/approved/rejected) | Admin verification |
| `rating_avg` | DECIMAL(3,2) | DEFAULT 0 | Cached avg rating |
| `total_reviews` | INT | DEFAULT 0 | Cached review count |
| `jobs_completed` | INT | DEFAULT 0 | Cached completion count |

#### 4.2.3 `ServiceCategories`
Seeded category types.

| Column | Type | Constraints |
|--------|------|-------------|
| `id` | INT | PK, IDENTITY |
| `name` | NVARCHAR(100) | UNIQUE, NOT NULL |
| `description` | NVARCHAR(500) | NULL |
| `icon` | NVARCHAR(100) | NULL |
| `is_active` | BIT | DEFAULT 1 |

**Seed data:** Electrician, Plumber, Painter, Carpenter, AC Repair, Home Cleaning, Mechanic, Mason.

#### 4.2.4 `ServiceRequests`
Job lifecycle from booking to completion.

| Column | Type | Constraints |
|--------|------|-------------|
| `id` | INT | PK, IDENTITY |
| `customer_id` | INT | FK Users |
| `worker_id` | INT | FK Users |
| `category_id` | INT | FK ServiceCategories |
| `description` | NVARCHAR(1000) | NOT NULL |
| `address` | NVARCHAR(500) | NOT NULL |
| `pincode` | NVARCHAR(10) | NOT NULL |
| `scheduled_date` | DATETIME2 | NULL |
| `status` | NVARCHAR(20) | CHECK (pending/accepted/in_progress/completed/cancelled/rejected) |
| `price` | DECIMAL(10,2) | NULL |
| `payment_status` | NVARCHAR(20) | CHECK (unpaid/paid_offline) |
| `created_at` | DATETIME2 | DEFAULT SYSUTCDATETIME() |
| `completed_at` | DATETIME2 | NULL |

#### 4.2.5 `Reviews`
One review per completed service request.

| Column | Type | Constraints |
|--------|------|-------------|
| `id` | INT | PK, IDENTITY |
| `request_id` | INT | FK ServiceRequests, UNIQUE |
| `customer_id` | INT | FK Users |
| `worker_id` | INT | FK Users |
| `rating` | INT | CHECK (1-5) |
| `comment` | NVARCHAR(1000) | NULL |
| `is_flagged` | BIT | DEFAULT 0 |

#### 4.2.6 `FraudAlerts`
Auto-generated fraud detection results.

| Column | Type | Constraints |
|--------|------|-------------|
| `id` | INT | PK, IDENTITY |
| `worker_id` | INT | FK Users |
| `reason` | NVARCHAR(500) | NOT NULL |
| `severity` | NVARCHAR(20) | CHECK (low/medium/high) |
| `resolved` | BIT | DEFAULT 0 |

### 4.3 Data Integrity Rules

- **Cascading deletes:** WorkerProfiles → Users (cascade), Reviews → ServiceRequests (cascade), FraudAlerts → Users (cascade).
- **One review per request:** enforced by `UNIQUE(request_id)` on `Reviews`.
- **Status transitions:** enforced in application layer (`serviceRequest.controller.js`).
- **Denormalized cache:** `rating_avg`, `total_reviews`, `jobs_completed` are cached in `WorkerProfiles` and refreshed via `recalcStats()` after every rating/completion event.

---

## 5. Backend Documentation

### 5.1 Directory Purpose

| Folder | Purpose |
|--------|---------|
| `config/` | Environment-driven configuration (DB pool) |
| `controllers/` | HTTP request handlers |
| `middleware/` | Cross-cutting concerns (auth, validation, errors) |
| `models/` | SQL data access (repository pattern) |
| `routes/` | Express route definitions |
| `services/` | Business logic (fraud detection engine) |
| `utils/` | Helpers (JWT, distance, ranking, error classes) |
| `validators/` | Zod schemas for input validation |
| `database/` | SQL scripts |
| `scripts/` | One-time bootstrap scripts |

### 5.2 Key Modules

#### 5.2.1 Database Connection (`config/db.js`)

- Uses **connection pooling** (max 10, idle 30s).
- Exports `connectDB()`, `getPool()`, and the `sql` type helpers.
- All queries are **parameterized** to prevent SQL injection.

#### 5.2.2 Authentication (`middleware/auth.middleware.js`)

Two functions:

- **`protect`** — verifies JWT, loads user from DB, checks block status.
- **`authorize(...roles)`** — role gate; must come after `protect`.

Usage:
```js
router.get("/admin/analytics", protect, authorize("admin"), getAnalytics);
```

#### 5.2.3 Validation (`middleware/validate.middleware.js`)

Wraps Zod schemas:
```js
router.post("/reviews", validate(createReviewSchema), createReview);
```

On failure, returns HTTP 400 with all validation issues.

#### 5.2.4 Error Handling (`middleware/errorHandler.js`)

- Custom `ApiError` class carries `statusCode`.
- `asyncHandler` catches promise rejections.
- Central `errorHandler` sends JSON error responses (stack trace in dev only).

#### 5.2.5 API Response (`utils/ApiResponse.js`)

Every response uses:
```json
{ "success": true|false, "message": "...", "data": { ... } }
```

### 5.3 Package.json Scripts

```json
{
  "dev": "nodemon server.js",         // Development with auto-reload
  "start": "node server.js",          // Production
  "seed:admin": "node scripts/seedAdmin.js"
}
```

---

## 6. Frontend Documentation

### 6.1 Directory Purpose

| Folder | Purpose |
|--------|---------|
| `api/` | Native fetch wrappers per domain |
| `components/` | Reusable UI (WorkerCard, StarRating, etc.) |
| `components/layout/` | Navbar, Footer |
| `components/admin/` | Admin-specific chrome |
| `context/` | AuthContext for global auth |
| `pages/` | Route-level components |
| `pages/dashboards/` | Customer and Worker dashboards |
| `pages/admin/` | Admin panel pages |

### 6.2 State Management

- **Global state:** React Context (auth only). Kept minimal.
- **Local state:** `useState` and `useEffect` in each component.
- **No Redux / Zustand** — the app doesn't need it.

### 6.3 Routing

React Router 7 with nested routes for admin:

```
/                       → Home (public)
/services               → Discover (public)
/workers/:id            → Worker detail (public)
/book/:workerId         → Booking (customer)
/customer               → Customer dashboard
/worker                 → Worker dashboard
/admin                  → Admin layout (nested)
  ├── /                 → Overview
  ├── /workers          → Worker verification
  ├── /users            → User management
  ├── /reviews          → Review moderation
  └── /fraud            → Fraud alerts
```

### 6.4 HTTP Client (`api/client.js`)

Native **fetch** wrapper (no Axios) that:

- Reads JWT from `localStorage`
- Attaches `Authorization: Bearer <token>`
- Parses JSON responses
- Throws on non-2xx with server message

```js
export const api = {
  get:    (endpoint)       => request(endpoint),
  post:   (endpoint, body) => request(endpoint, { method: "POST", body }),
  patch:  (endpoint, body) => request(endpoint, { method: "PATCH", body }),
  delete: (endpoint)       => request(endpoint, { method: "DELETE" }),
};
```

### 6.5 Styling

- **Tailwind CSS v4.1** via `@tailwindcss/vite` plugin.
- Custom brand tokens defined in `index.css` under `@theme`.
- Fully responsive: mobile-first, breakpoints at `sm`, `md`, `lg`, `xl`.

---

## 7. Authentication & Security

### 7.1 Auth Flow

```
User submits credentials
    ↓
POST /api/auth/login
    ↓
Backend validates via Zod
    ↓
Bcrypt compares password
    ↓
Check is_blocked
    ↓
Generate JWT (7-day expiry)
    ↓
Frontend stores token in localStorage
    ↓
Every subsequent request → Authorization header
    ↓
Backend protect middleware verifies + loads user
```

### 7.2 JWT Structure

```json
{
  "id": 42,
  "role": "customer",
  "iat": 1730000000,
  "exp": 1730604800
}
```

Secret: `JWT_SECRET` in `.env`. Change this in production.

### 7.3 Password Handling

- Passwords never leave the client in plaintext (over HTTPS in production).
- Bcrypt hash with 10 salt rounds.
- Password hash never returned in API responses (`sanitizeUser()` strips it).

### 7.4 Security Measures

| Layer | Protection |
|-------|-----------|
| **HTTP headers** | Helmet (CSP, X-Frame-Options, etc.) |
| **CORS** | Restricted to `CLIENT_URL` |
| **Rate limiting** | 200 requests / 15 min per IP on `/api` |
| **SQL injection** | Parameterized queries via `mssql` inputs |
| **Password storage** | Bcrypt with salt |
| **Input validation** | Zod on every mutable endpoint |
| **Role escalation** | Admin-only signup blocked; admins seeded via script |
| **Token expiry** | JWT 7d default (configurable) |
| **Blocked users** | Denied at `protect` middleware |

### 7.5 RBAC Matrix

| Endpoint Group | Public | Customer | Worker | Admin |
|----------------|:------:|:--------:|:------:|:-----:|
| Register | ✅ | — | — | — |
| Login | ✅ | — | — | — |
| Browse workers | ✅ | ✅ | ✅ | ✅ |
| Create request | ❌ | ✅ | ❌ | ❌ |
| Accept/complete request | ❌ | ❌ | ✅ | ❌ |
| Cancel own request | ❌ | ✅ | ❌ | ❌ |
| Submit review | ❌ | ✅ | ❌ | ❌ |
| Update own profile | ❌ | ❌ | ✅ | — |
| Admin operations | ❌ | ❌ | ❌ | ✅ |

---

## 8. API Reference

*See `README.md` for the endpoint summary. Below is the detailed contract per endpoint.*

### 8.1 Standard Response Envelope

**Success:**
```json
{
  "success": true,
  "message": "Optional message",
  "data": { ... }
}
```

**Error:**
```json
{
  "success": false,
  "message": "Human-readable error"
}
```

### 8.2 Sample Request/Response

#### Register Customer

**Request:**
```http
POST /api/auth/register/customer
Content-Type: application/json

{
  "name": "Ravi Kumar",
  "email": "ravi@example.com",
  "phone": "9876543210",
  "password": "secret123"
}
```

**Response 201:**
```json
{
  "success": true,
  "message": "Customer registered successfully",
  "data": {
    "user": {
      "id": 5,
      "name": "Ravi Kumar",
      "email": "ravi@example.com",
      "phone": "9876543210",
      "role": "customer",
      "is_blocked": false,
      "created_at": "2026-01-15T10:23:45.000Z"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5..."
  }
}
```

#### Discover Workers

**Request:**
```http
GET /api/workers/discover?category_id=2&pincode=211001&lat=25.44&lng=81.85&radius=15
```

**Response 200:**
```json
{
  "success": true,
  "data": {
    "count": 3,
    "workers": [
      {
        "id": 7,
        "user_id": 12,
        "name": "Suresh Plumber",
        "category_name": "Plumber",
        "pincode": "211001",
        "city": "Prayagraj",
        "rating_avg": "4.75",
        "total_reviews": 12,
        "jobs_completed": 18,
        "distance_km": 2.1,
        "match_score": 0.8734
      }
    ]
  }
}
```

### 8.3 Error Codes

| Code | Meaning |
|------|---------|
| 400 | Bad request / validation failed |
| 401 | Not authenticated / invalid token |
| 403 | Not authorized / blocked |
| 404 | Resource not found |
| 409 | Conflict (duplicate email, duplicate review) |
| 429 | Rate limit exceeded |
| 500 | Internal server error |

---

## 9. Recommendation Engine

### 9.1 Overview

LocalFix uses a **deterministic, weighted-score recommendation** system — an "AI-lite" approach that ranks workers based on how well they match the customer's needs.

### 9.2 Signals & Weights

```js
const WEIGHTS = {
  distance: 0.40,   // Proximity is king in rural areas
  rating:   0.35,   // Quality signal from real reviews
  success:  0.25,   // Reliability from completed jobs
};
```

### 9.3 Normalization

Each raw signal is normalized to `[0, 1]`:

- **Distance:** `1 - min(distance_km, 50) / 50`
  → 0 km = 1.0, 50 km = 0.0
- **Rating:** `rating_avg / 5`
- **Success:** average of `jobs_completed / 50` and `total_reviews / 30`, both capped at 1.0

### 9.4 Final Score

```
match_score =
    0.40 × distance_score
  + 0.35 × rating_score
  + 0.25 × success_score
```

Displayed as `Math.round(match_score * 100)` % in the UI.

### 9.5 Why This Approach?

- **Explainable:** users understand why one worker ranks higher.
- **No cold-start problem:** new workers can rank via proximity alone.
- **Fast:** no ML inference latency.
- **Tunable:** weights can be adjusted based on real user feedback.

---

## 10. Fraud Detection Engine

### 10.1 Overview

Rule-based detector that admins can trigger on demand from the dashboard. Every rule scans the DB, checks for existing open alerts (deduplication), and creates new ones as needed.

### 10.2 Rules

| Rule | SQL Signal | Severity |
|------|-----------|----------|
| **Low avg rating** | `rating_avg < 2.5 AND total_reviews ≥ 3` | 🔴 High |
| **High rejection %** | `> 50%` cancelled/rejected across ≥ 4 requests | 🟠 Medium |
| **Repeated 1-stars** | ≥ 3 one-star reviews in last 30 days | 🟠 Medium |
| **Dormant profile** | Approved ≥ 60 days ago, 0 jobs completed | ⚪ Low |

### 10.3 Deduplication

Before inserting an alert, the service calls:

```js
await FraudModel.existsForWorker(worker_id, reason);
```

If an unresolved alert with the same reason already exists, the new alert is skipped.

### 10.4 Admin Actions on Alerts

- **Resolve** — mark alert as handled.
- **Block worker** — instantly restrict login and hide from discovery.

### 10.5 Extending Rules

To add a rule, edit `services/fraudDetection.service.js`:

```js
const RULES = [
  // Existing rules...
  {
    reason: "Custom rule reason",
    severity: "medium",
    sql: `SELECT worker_id FROM ... WHERE ...`,
  },
];
```

Each rule must return rows with a `worker_id` column.

---

## 11. Deployment Guide

### 11.1 Backend Deployment (Linux VPS)

```bash
# On server
sudo apt update && sudo apt install nodejs npm
git clone <repo>
cd localfix/backend
npm ci --production
cp .env.example .env
nano .env    # Edit for production

# Use PM2 for process management
npm install -g pm2
pm2 start server.js --name localfix-api
pm2 startup
pm2 save
```

### 11.2 Frontend Deployment

```bash
cd frontend
npm ci
npm run build
```

Serve the `dist/` folder via **Nginx**, **Vercel**, or **Netlify**.

### 11.3 Sample Nginx Config

```nginx
server {
  listen 80;
  server_name localfix.example.com;

  root /var/www/localfix/frontend/dist;
  index index.html;

  location / {
    try_files $uri /index.html;
  }

  location /api/ {
    proxy_pass http://localhost:5000/api/;
    proxy_set_header Host $host;
    proxy_set_header X-Real-IP $remote_addr;
  }
}
```

### 11.4 SQL Server on Production

- Enable **TCP/IP** in SQL Server Configuration Manager.
- Use a dedicated SQL user (not `sa`).
- Grant only necessary permissions on `LocalFixDB`.
- Enable regular backups.
- Set `DB_ENCRYPT=true` if server has TLS.

### 11.5 Production Checklist

- [ ] Change default admin password
- [ ] Set strong `JWT_SECRET` (min 32 random chars)
- [ ] Set `NODE_ENV=production`
- [ ] Update `CLIENT_URL` to production domain
- [ ] Configure HTTPS via Let's Encrypt
- [ ] Set up DB backups
- [ ] Configure PM2 logs rotation
- [ ] Set up server monitoring (uptime, error tracking)

---

## 12. Testing

### 12.1 Manual Testing Checklist

**Auth:**
- [ ] Customer can register
- [ ] Worker can register (goes to pending)
- [ ] Admin can log in
- [ ] Invalid credentials rejected
- [ ] Blocked user cannot log in
- [ ] Token expires after 7 days

**Discovery:**
- [ ] Only approved workers appear
- [ ] Category filter works
- [ ] Pincode filter works
- [ ] Radius filter works with lat/lng
- [ ] Match score displayed correctly

**Booking:**
- [ ] Customer must log in to book
- [ ] Request appears in customer dashboard
- [ ] Request appears in worker dashboard

**Job Lifecycle:**
- [ ] Worker can accept
- [ ] Worker can start
- [ ] Worker can complete (with price)
- [ ] Worker can reject
- [ ] Customer can cancel (before completion)
- [ ] Customer can review only after completion
- [ ] Rating updates worker's rating_avg

**Admin:**
- [ ] Analytics loads with correct KPIs
- [ ] Charts render
- [ ] Worker approval/rejection works
- [ ] User block/unblock works
- [ ] Review flag/delete works
- [ ] Fraud scan generates alerts
- [ ] Alert deduplication works

### 12.2 API Testing with cURL

Included in the [README](./README.md#-testing-guide) section.

### 12.3 Load Testing

For scale testing, tools like **Apache Bench** or **k6** work well:

```bash
ab -n 1000 -c 50 http://localhost:5000/api/health
```

---

## 13. FAQ

### Q: Why SQL Server instead of MongoDB?
The requirement specifically asked for SQL (SSMS). Relational structure also fits the entity relationships (users, workers, requests, reviews) much better than NoSQL.

### Q: Why native fetch instead of Axios?
The spec required it. Native fetch has no external dependency, works everywhere modern browsers work, and the wrapper covers all common needs.

### Q: Why offline payments?
Small-town workers often don't have UPI merchant accounts. Cash-on-completion is culturally natural and removes gateway fees.

### Q: How to add file uploads for ID proof?
Multer is already in `package.json`. You'd need to:
1. Create `middleware/upload.middleware.js` with Multer disk storage.
2. Add a `POST /api/upload` endpoint.
3. Return the URL and use it as `id_proof_url`.

### Q: Can I add email notifications?
Yes — install `nodemailer`, create a `services/email.service.js`, and trigger emails on register, request creation, and status changes.

### Q: How to scale beyond one server?
- Move SQL Server to a dedicated instance
- Add Redis for rate limiting and session cache
- Deploy multiple Node instances behind a load balancer
- Use a CDN for the built frontend

### Q: Is the recommendation engine really "AI"?
It's a weighted-score model — the kind of "AI-lite" that runs many real production systems (Yelp's early ranking, Craigslist search). It doesn't use ML, but it does automate ranking decisions in a way that's fast, tunable, and explainable — often preferable to a black-box model at this scale.

### Q: What's the license?
MIT — feel free to use, modify, and distribute.

---

## 📞 Support

- **Issues:** [GitHub Issues](https://github.com/your-username/localfix/issues)
- **Discussions:** [GitHub Discussions](https://github.com/your-username/localfix/discussions)
- **Email:** support@localfix.example.com

---

## 📄 Change Log

### v1.0.0 (2026)
- Initial release
- Full customer, worker, admin flows
- AI-lite recommendation
- Fraud detection engine
- Responsive UI

---

<p align="center">
  <b>Documentation maintained with care ❤️</b><br>
  <sub>Last updated: 2026</sub>
</p>
