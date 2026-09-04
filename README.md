# User Service & Authentication Portal

A production-ready full-stack user authentication system. This application consists of a **React + Vite + Tailwind CSS (v4)** frontend and a **Node.js + Express + TypeScript + MongoDB** backend.

---

## Key Features

### Security & Authentication

- **Dual JWT Token Authentication**: Uses brief Access Tokens and longer-lived Refresh Tokens.
- **Secure Cookie Storage**: Refresh Tokens are stored in secure `httpOnly` and `sameSite` cookies to reduce the risk of token theft.
- **Session Revocation**: Tracks token versions (`tokenVersion`) allowing users to log out from a single device or revoke access from all active devices.
- **Role-Based Access Control (RBAC)**: Middleware handles standard user vs. administrator routes.
- **Zod Data Validation**: Incoming requests on the backend and user inputs on the frontend are validated using Zod.
- **Global API Rate Limiting**: Protects the API from excessive requests, abuse, and basic denial-of-service attacks.
- **Route-Specific Rate Limiting**: Applies stricter limits to sensitive endpoints such as login and registration to help prevent brute-force attacks.
- **Redis-Based Rate Limiting**: Uses Redis as a shared rate-limit store for consistent rate limiting across server instances.
- **Helmet Security**: Uses Helmet to add security-related HTTP headers and improve the application's security posture.
- **CORS Protection**: Restricts API access to trusted origins and helps prevent unauthorized cross-origin requests.
- **Token Blacklisted**: Access token blacklisted in redis cloud till expiry.

### Email Workflows

- **Email Verification**: Ensures users confirm their email addresses upon sign-up.
- **Forgot & Reset Password**: Secure token-based password recovery flows.
- **Resend Integration**: Send transactional emails via Resend.

### Profile Management

- **Cloudinary Integration**: Users can upload and update their profile pictures, securely stored in the cloud.

### Logs & Monitoring

- **Structured Winston Logger**: Daily rotating transport files for robust server activity logging and error tracing.

---

## Project Structure

```
user-service/
├── backend/                # Express & TypeScript Backend
│   ├── src/
│   │   ├── config/         # Database connection, Winston logger, Env configuration
│   │   ├── controllers/    # Route controllers (Auth, Admin, Profile, etc.)
│   │   ├── middleware/     # Auth checks, RBAC verification, Error handlers
│   │   ├── models/         # Mongoose User and Session schemas
│   │   ├── routes/         # API routes definitions
│   │   ├── schema/         # Zod request validation schemas
│   │   ├── services/       # Cloudinary, Email, and Token operations
│   │   ├── utils/          # Formatting and custom helper utilities
│   │   ├── types/          # TypeScript type definitions
│   │   ├── app.ts          # Express App configuration
│   │   └── server.ts       # Server bootstrapper & DB connection hook
│   ├── .env.local          # Template environment configuration
│   └── tsconfig.json       # TypeScript configuration
│
└── frontend/               # React & Vite Frontend
    ├── src/
    │   ├── assets/         # Images, icons, and static visual files
    │   ├── components/     # Reusable components (e.g., ProtectedRoute)
    │   ├── context/        # React Auth Context for state tracking
    │   ├── layouts/        # Layout wrappers (MainLayout, DashboardLayout)
    │   ├── pages/          # Auth, Reset, Dashboard, and public pages
    │   ├── schema/         # Zod schemas for form validations
    │   ├── services/       # Axios client and API wrappers
    │   ├── utils/          # Helper utilities
    │   ├── App.jsx         # Router routes setup
    │   └── main.jsx        # App entry point
    └── vite.config.js      # Vite compilation setup
```

---

## Tech Stack

### Backend

- **Runtime**: Node.js
- **Framework**: Express (with TypeScript compilation via `tsx`)
- **Database**: MongoDB (via Mongoose ORM), Redis Cloud
- **File Storage**: Cloudinary
- **Emails**: Resend API
- **Logging**: Winston & Winston Daily Rotate File

### Frontend

- **Framework**: React 19 (Vite bundler)
- **Styling**: Tailwind CSS v4
- **Form Handling**: React Hook Form
- **Validation**: Zod
- **Routing**: React Router DOM
- **UI Feedback**: Sonner (toasts)
- **HTTP Client**: Axios

---

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (v18 or higher recommended)
- [MongoDB](https://www.mongodb.com/) (Local instance or Atlas cloud URI)
- [Cloudinary](https://cloudinary.com/) Account (for profile image uploads)
- [Resend](https://resend.com/) API Key
- [Redis Cloud](https://redis.io/cloud/) Redis Cloud

---

### Backend Setup

1. Navigate to the backend directory:

   ```bash
   cd backend
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Configure environment variables. Duplicate the template file and fill in your keys:

   ```bash
   cp .env.local .env
   ```

   **Required environment variables (`.env`):**

   ```env
   NODE_ENV=development
   PORT=5000
   APP_URL=http://localhost:5000
   FRONTEND_URL=http://localhost:5173
   MONGO_URI="mongodb+srv://<username>:<password>@<cluster>/<database>"
   
   # Redis cloud config
   REDIS_URL="redis://default:<password>@<host>:<port>"

   JWT_ACCESS_SECRET=your_jwt_access_token_secret
   JWT_REFRESH_SECRET=your_jwt_refresh_token_secret
   COOKIE_REFRESH_MAX_AGE=""

   # cloudinary config
   CLOUDINARY_CLOUD_NAME=""
   CLOUDINARY_API_KEY=""
   CLOUDINARY_API_SECRET=""

   # resend api key/ domain
   RESEND_API_KEY=""
   DOMAIN=""
   ```

4. Start the backend in development mode (with hot reloading):

   ```bash
   npm run dev
   ```

5. Build for production:
   ```bash
   npm run build
   npm run start
   ```

---

### Frontend Setup

1. Navigate to the frontend directory:

   ```bash
   cd ../frontend
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Start the development server:

   ```bash
   npm run dev
   ```

   The UI will be accessible by default at [http://localhost:5173](http://localhost:5173).

4. Build the application for production:
   ```bash
   npm run build
   ```

---

## Security Details

- **Token Rotation**: On refresh requests, the backend reissues a short-lived access token, preventing session hijacking.
- **Revocation**: The server stores a `tokenVersion` counter inside the user's DB model. Every time a refresh token is verified, its encoded version is compared against the database. Incrementing this counter automatically invalidates all existing refresh tokens.
- **Input Validation**: Strict Zod rules validate types, lengths, and patterns for registration, logins, and settings updates to protect against injection.
