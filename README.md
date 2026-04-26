# 🎓 Smart College Management System

A production-grade, full-stack Academic Management platform designed for modern universities. Featuring secure QR attendance, bulk enrollment, and automated dynamic certification.

## 🚀 Key Features

### 🔐 Advanced Security & Auth
- **Role-Based Access Control (RBAC)**: Dedicated dashboards for **Admin**, **Teacher**, and **Student**.
- **Admin Guardian**: All Teacher accounts and Course proposals require manual Admin approval.
- **JWT Protection**: Secure API endpoints and rotated authenticated sessions.

### 📅 Smart QR Attendance
- **30s Dynamic QR**: Teacher-generated QR codes rotate every 30 seconds to prevent unauthorized sharing or static photos.
- **Mobile Scanner**: Native-feeling PWA scanner for students to mark attendance instantly.
- **Live Monitoring**: Real-time attendance stats visible on the Teacher's "Live session" dashboard.

### 📤 Data Management
- **Bulk Upload**: Teachers can upload student lists via **CSV** to finalize attendance for large classrooms.
- **Course Lifecycle**: From Proposal -> Admin Review -> Enrollment -> Attendance -> Completion.

### 📜 Automated Certification
- **Dynamic PDF Generation**: High-quality, uniquely identified certificates generated on-the-fly.
- **One-Click Download**: Verified students can download completion certificates directly from their dashboard.

## 🛠️ Technology Stack

- **Frontend**: React 18, Vite, Tailwind CSS (Glassmorphism UI).
- **Backend**: Node.js, Express, MongoDB (Mongoose).
- **Security**: JSON Web Tokens (JWT), BcryptJS.
- **Mobile/PWA**: `vite-plugin-pwa` for offline support and app-like installation.
- **Libraries**: `pdfkit`, `csv-parser`, `react-qr-code`, `html5-qrcode`.

## 📦 Installation & Setup

### 1. Prerequisites
- Node.js (v18+)
- MongoDB (Local or Atlas)

### 2. Environment Configuration
Create a `.env` file in the `server` directory:
```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_super_secret_key
# Optional: Nodemailer config for OTPs
# EMAIL_USER=...
# EMAIL_PASS=...
```

Create a `.env` file in the `client` directory:
```env
VITE_API_URL=http://localhost:5000/api
```

### 3. Run the Application
From the root directory:
```bash
# Install all dependencies
npm run install-all

# Start both frontend and backend in development mode
npm run dev
```

## 👥 Roles & Workflows

| Role | Responsibility |
| :--- | :--- |
| **Admin** | Approve/Reject faculty accounts and course proposals; Global analytics. |
| **Teacher** | Create courses, manage student attendance via QR or CSV, track engagement. |
| **Student** | Find courses, enroll, scan QR for attendance, download verified certificates. |

---
*Built with ❤️ for University Efficiency.*
