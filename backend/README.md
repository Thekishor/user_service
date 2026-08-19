# User Service

A backend application built using node and express that provides secure authentication, authorization, role-based access control,
email based workflow and token management.

## Features

- JWT-based Authentication (Access + Refresh Token)
- Role-Based Access Control (RBAC)
- Email Verification
- Forgot Password Flow
- JWT Auth with session revocation

## Tech Stack

### Backend

- Typescript
- Node/Express
- Node mail sender (Resend)

### Security

- Cookie based Authentication
- JWT (Access Token, Refresh Token)
- Role-Based Access Control
- Custom Error handler for better error handling and debugging
- JWT Auth with session revocation
- Logout and Logout from all devices (Using tokenversion for security)

### Database

- Mongodb

### Validation

- Zod validation

### Cloud

- Cloudinary
- Profile image store
