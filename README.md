## Todo Tasks (JWT + RBAC) Full-Stack Assignment

This project provides a Node.js/Express backend with JWT authentication (bcrypt password hashing) and role-based access control, plus a simple React frontend for task CRUD.

## Tech Stack

- Backend: Node.js + Express.js, MongoDB (Mongoose), JWT (jsonwebtoken), Validation (Joi)
- API Docs: Swagger UI
- Frontend: React (CRA) + Axios

## Setup Instructions

### Backend
1. Create environment variables from the template:
   - Copy `.env.example` -> `.env` (do not commit secrets)
   - Required keys:
   - `MONGO_URI`
   - `JWT_SECRET`
   - `PORT` (optional)
2. Install dependencies:
   - `cd backend`
   - `npm install`
3. Start the server:
   - `npm run dev`

### Create an `admin` user (local/dev)

Registration always creates `role: "user"`, so promote/create an admin with the helper script:

- Set `ADMIN_EMAIL` + `ADMIN_PASSWORD` in your root `.env` (optional `ADMIN_NAME`), then run:
  - `cd backend && npm run create-admin`

Or pass flags (no need to edit `.env`):

- `cd backend && npm run create-admin -- --email=admin@example.com --password='StrongPassw0rd!' --name=Admin`

Backend base URL:
- `http://localhost:5000/api/v1`
- Swagger UI: `http://localhost:5000/api-docs`

### Frontend
1. Install dependencies:
   - `cd frontend`
   - `npm install`
2. (Optional) Copy `frontend/.env.example` to `frontend/.env` and set `REACT_APP_API` to point to the backend.
3. Start:
   - `npm start`

## Testing

- Backend: `cd backend && npm test`
- Frontend: `cd frontend && CI=true npm test -- --watchAll=false`

## Authentication Flow

1. `POST /api/v1/auth/register`
   - Hashes passwords with `bcryptjs` (handled by the `User` model).
   - Returns `{ token, user }`.
2. `POST /api/v1/auth/login`
   - Verifies email + password.
   - Returns a new JWT `{ token, user }`.
3. Protected endpoints require:
   - `Authorization: Bearer <token>`

## Role-Based Access Control (RBAC)

- Roles:
  - `user`: can manage only their own tasks
  - `admin`: can view/update/delete any task
- Ownership checks are enforced in the task controller.

## API Endpoints

### Auth
- `POST /api/v1/auth/register`
- `POST /api/v1/auth/login`

### Tasks (JWT protected)
- `POST /api/v1/tasks` Create task
- `GET /api/v1/tasks` Get all tasks (admin sees all, user sees own)
- `GET /api/v1/tasks/:id` Get single task
- `PUT /api/v1/tasks/:id` Update task
- `DELETE /api/v1/tasks/:id` Delete task

## Database Schema (MongoDB)

- `User`
  - `name`, `email`, `password` (hashed), `role` (`user` | `admin`)
- `Task`
  - `title`, `description`, `status`, `priority`, `dueDate`, `user` (owner reference)

## Scalability Notes (Expected in README)

- Horizontal scaling: run multiple Node/Express instances behind a load balancer.
- Load balancing: distribute requests across replicas.
- Microservices (optional future): split auth/tasks into separate services.
- Caching (optional): add Redis for frequently read data or rate-limit counters.
- Database indexing: tasks schema includes an index on `{ user: 1, status: 1 }` to speed up common queries.

## Security Practices

- Password hashing: `bcryptjs`
- JWT: expires using `JWT_EXPIRES_IN` (default `1h`)
- Validation: all inputs are validated with Joi schemas
- Centralized error handling with consistent JSON responses
- Rate limiting: enabled on the API routes

