# Finance Backend

A RESTful API backend for a personal finance management application. Built with Node.js, Express, and MongoDB, it handles user authentication, role-based access control, financial record management, and dashboard summaries.

---

## Table of Contents

- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [Environment Variables](#environment-variables)
- [API Reference](#api-reference)
- [Roles and Permissions](#roles-and-permissions)
- [Data Models](#data-models)

---

## Tech Stack

- **Runtime:** Node.js
- **Framework:** Express v5
- **Database:** MongoDB (via Mongoose)
- **Authentication:** JSON Web Tokens (JWT)
- **Password Hashing:** bcryptjs
- **Dev Tool:** Nodemon

---

## Project Structure

```
finance-backend/
├── config/
│   └── db.js                  # MongoDB connection
├── controllers/
│   ├── authController.js      # Register and login logic
│   ├── recordController.js    # CRUD for financial records
│   └── dashboardController.js # Aggregated summary
├── middleware/
│   └── authMiddleware.js      # JWT protection and role authorization
├── models/
│   ├── User.js                # User schema with role and password hashing
│   └── Record.js              # Financial record schema
├── routes/
│   ├── authRoutes.js          # /api/auth
│   ├── recordRoutes.js        # /api/records
│   └── dashboardRoutes.js     # /api/dashboard
├── server.js                  # Entry point
└── package.json
```

---

## Getting Started

**Prerequisites:** Node.js and a running MongoDB instance (local or Atlas).

```bash
# Clone the repository
git clone https://github.com/mandloi15/finance-backend.git
cd finance-backend

# Install dependencies
npm install

# Create a .env file (see Environment Variables below)

# Run in development mode
npm run dev

# Run in production
npm start
```

The server starts on port `5000` by default. A `GET /` request returns `API Running...` to confirm the server is up.

---

## Environment Variables

Create a `.env` file in the root directory with the following keys:

```env
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
PORT=5000
```

---

## API Reference

### Authentication

| Method | Endpoint            | Description         | Auth Required |
|--------|---------------------|---------------------|---------------|
| POST   | /api/auth/register  | Register a new user | No            |
| POST   | /api/auth/login     | Login and get token | No            |

**Register request body:**
```json
{
  "name": "Jane Doe",
  "email": "jane@example.com",
  "password": "yourpassword",
  "role": "viewer"
}
```

**Login request body:**
```json
{
  "email": "jane@example.com",
  "password": "yourpassword"
}
```

**Login response:**
```json
{
  "token": "<jwt_token>"
}
```

All protected routes require the token in the `Authorization` header:
```
Authorization: Bearer <token>
```

---

### Records

All record routes require authentication. Create and delete actions are restricted to the `admin` role.

| Method | Endpoint          | Description                         | Roles Allowed              |
|--------|-------------------|-------------------------------------|----------------------------|
| POST   | /api/records      | Create a new financial record       | admin                      |
| GET    | /api/records      | Get records (with filters and pagination) | admin, analyst, viewer |
| DELETE | /api/records/:id  | Delete a record by ID               | admin                      |

**Create record request body:**
```json
{
  "amount": 1500,
  "type": "income",
  "category": "Salary",
  "date": "2024-04-01",
  "note": "April salary"
}
```

**GET /api/records query parameters:**

| Parameter  | Type   | Description                              |
|------------|--------|------------------------------------------|
| type       | string | Filter by `income` or `expense`          |
| category   | string | Filter by category name                  |
| startDate  | string | Start of date range (ISO 8601)           |
| endDate    | string | End of date range (ISO 8601)             |
| page       | number | Page number for pagination (default: 1)  |

Results are paginated at 5 records per page.

---

### Dashboard

| Method | Endpoint       | Description                                      | Auth Required |
|--------|----------------|--------------------------------------------------|---------------|
| GET    | /api/dashboard | Get total income and expense summary (aggregated) | Yes          |

**Response example:**
```json
[
  { "_id": "income", "total": 5000 },
  { "_id": "expense", "total": 3200 }
]
```

---

## Roles and Permissions

Users are assigned one of three roles at registration. The default role is `viewer`.

| Role     | Create Record | Read Records | Delete Record | View Dashboard |
|----------|---------------|--------------|---------------|----------------|
| admin    | Yes           | Yes          | Yes           | Yes            |
| analyst  | No            | Yes          | No            | Yes            |
| viewer   | No            | Yes          | No            | Yes            |

---

## Data Models

### User

| Field    | Type    | Description                              |
|----------|---------|------------------------------------------|
| name     | String  | Full name                                |
| email    | String  | Email address                            |
| password | String  | Hashed with bcryptjs (salt rounds: 10)   |
| role     | String  | One of: `viewer`, `analyst`, `admin`     |
| isActive | Boolean | Account status (default: `true`)         |

### Record

| Field    | Type   | Description                              |
|----------|--------|------------------------------------------|
| amount   | Number | Transaction amount (required)            |
| type     | String | One of: `income`, `expense`              |
| category | String | Category label                           |
| date     | Date   | Transaction date (default: now)          |
| note     | String | Optional description                     |
