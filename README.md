# Security Agency Management & Workforce Allocation Platform

A full-stack, production-ready enterprise web application for **Security Agency Management & Workforce Allocation**. Built with **React, TypeScript, Vite, Tailwind CSS** on the frontend, **Node.js, Express, TypeScript, Mongoose, JWT, bcrypt** on the backend, and **MongoDB** as the database layer.

---

## 🌟 Key Features

### 🏢 1. Public Portal
- **Hero Section**: Tagline *"Trusted Security. Professional Protection."*, key call-to-actions, live statistics.
- **About Us**: Company background, 10+ years experience, background verification standards.
- **12 Security Service Categories**: School, Corporate, Apartment, Residential, Industrial, Hospital, Event, Warehouse, Mall, Office, Night Patrol, CCTV.
- **Partner Organizations Portfolio**: Searchable directory of client organizations served.
- **Verified Reviews & Ratings**: Testimonial grid with review submission modal for logged-in clients.
- **Contact & Proposal Request**: Form storing quotes directly in MongoDB.
- **Public Navigation**: Dashboard links are **strictly hidden** from public navbar & footer.

### 🔑 2. Multi-Role Authentication
- **Role Types**: `ADMIN`, `WORKER`, `COMPANY`, `CUSTOMER`.
- **BCrypt Password Hashing**: Passwords encrypted securely.
- **JWT Authorization**: Token-based protection with server-side role verification middleware (`protect`, `authorizeRoles`).
- **Google OAuth Login**: Backend endpoint `POST /api/auth/google` with fallback token handler.
- **Role-Based Redirects**:
  - `ADMIN` $\rightarrow$ `/admin/dashboard`
  - `WORKER` $\rightarrow$ `/worker/dashboard`
  - `COMPANY` $\rightarrow$ `/company/dashboard`
  - `CUSTOMER` $\rightarrow$ `/`

### 👑 3. Admin Command Portal (`/admin/*`)
- **Dashboard Overview**: Real-time stats (Total/Active Workers, Active Companies, Today's Attendance, Deployments, Salary Expense) + Recharts visual analytics.
- **Worker Management**: Full CRUD, registration modal, skill tags, base salary structure, active status toggle.
- **Company Management**: Full CRUD, organization type, required security personnel count.
- **Allocation & Transfer Engine**: Assign worker to company/shift with position. Conflict checks prevent overlapping active postings. Preserves assignment history and notifies the guard.
- **Attendance Monitor**: Date-based log inspector for duty check-in/out timestamps and total working hours.
- **Salary & Payroll**: Monthly paystub calculator (`Net = Basic + Allowances + Overtime - Deductions`) and status toggle.
- **Worker Notifications**: Send targeted push alerts or broadcast announcements.
- **Review Moderation**: Approve, reject, or delete client reviews.
- **Quote Lead Management**: Action table to advance quote leads (`NEW` $\rightarrow$ `CONTACTED` $\rightarrow$ `RESOLVED`).
- **Reports & Export**: Filterable operational datasets with 1-click **CSV Export**.

### 👮 4. Worker Portal (`/worker/*`)
- **Active Duty Console**: 1-Click **Check-In** and **Check-Out** logging exact timestamps and automatically computing `totalHours`.
- **Assignment Card**: Current stationed company name, address, position, shift hours.
- **Attendance History**: Monthly tabular log with status badges.
- **Salary Statements**: Detailed paystubs showing Basic, Allowances, Overtime, Deductions, and Net Pay.
- **Notifications Feed**: Real-time dispatch alerts with "Mark as Read".

### 🏢 5. Company Portal (`/company/*`)
- **Dashboard**: Active assigned guards count, present today count, required shift capacity.
- **Assigned Guards Roster**: Photo, name, designation, shift, phone, joining date (zero access to private worker data).
- **Attendance Logs**: Daily attendance records of guards stationed at their property.
- **Submit Testimonial**: Submit verified client ratings for agency services.

---

## 🛠️ Technology Stack

- **Frontend**: React 18, TypeScript, Vite, Tailwind CSS, Lucide React, React Router DOM, Axios, Recharts.
- **Backend**: Node.js, Express, TypeScript, Mongoose ODM, JWT, bcryptjs, Helmet, CORS, Morgan.
- **Database**: MongoDB (Local instance or MongoDB Atlas), compatible with **MongoDB Compass**.

---

## 🚀 Quick Setup & Installation

### Prerequisites
1. **Node.js** (v18+ recommended)
2. **MongoDB** running locally on port `27017` (e.g. `mongodb://127.0.0.1:27017/security_agency`)

### 1. Install Dependencies
Run from project root:
```bash
# Install root, backend, and frontend dependencies
npm run setup
```

Or manually:
```bash
cd backend && npm install
cd ../frontend && npm install
```

### 2. Seed Database
Populate MongoDB with default Admin, Workers, Companies, Shifts, Assignments, Attendance, Salaries, Reviews, and Inquiries:
```bash
npm run seed
```

### 3. Start Development Servers

Start Backend API (`http://localhost:5000`):
```bash
npm run dev:backend
```

Start Frontend Vite App (`http://localhost:5173`):
```bash
npm run dev:frontend
```

---

## 🔑 Default Credentials for Testing

| Role | Email | Password | Portal Dashboard |
|---|---|---|---|
| **ADMIN** | `admin@securityagency.com` | `Password@123` | `/admin/dashboard` |
| **WORKER** | `worker1@securityagency.com` | `Worker@123` | `/worker/dashboard` |
| **COMPANY** | `contact@abcschool.org` | `Company@123` | `/company/dashboard` |

---

## 🍃 MongoDB Compass Inspection

Connect **MongoDB Compass** using the connection URI:
```text
mongodb://127.0.0.1:27017/security_agency
```

You will see the following collections:
- `users`
- `workers`
- `companies`
- `shifts`
- `assignments`
- `attendances`
- `salaries`
- `notifications`
- `reviews`
- `contactinquiries`

---

## 📜 API Architecture Overview

```text
POST /api/auth/register       - Register account
POST /api/auth/login          - Email/password login
POST /api/auth/google         - Google OAuth login
GET  /api/auth/me             - Current user profile

GET    /api/workers           - List workers (Admin)
POST   /api/workers           - Create worker (Admin)
PUT    /api/workers/:id       - Update worker (Admin)
DELETE /api/workers/:id       - Delete worker (Admin)

GET    /api/companies         - List companies (Admin)
POST   /api/companies         - Create company (Admin)
PUT    /api/companies/:id     - Update company (Admin)
DELETE /api/companies/:id     - Delete company (Admin)

GET  /api/assignments         - List assignments
POST /api/assignments         - Assign / Transfer worker (Admin)

POST /api/attendance/check-in - Duty start (Worker)
POST /api/attendance/check-out- Duty finish (Worker)
GET  /api/attendance          - Get attendance logs

GET  /api/salaries            - Get salary paystubs
POST /api/salaries            - Generate salary record (Admin)

GET  /api/reviews             - Public approved reviews
POST /api/reviews             - Submit review
PUT  /api/reviews/:id         - Moderate review (Admin)

POST /api/contact             - Submit quote inquiry
GET  /api/contact             - List quote leads (Admin)
```
