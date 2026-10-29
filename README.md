# ACHIEVO — Student Achievement Portfolio

A full-stack MERN-style student portfolio starter with a gaming-inspired dark/neon UI.

## Requirements
- Node.js 20+ (Node.js 24 should work)
- MongoDB Community Server running locally, or a MongoDB Atlas connection string

## Project structure
- `client/` — React + Vite frontend (HTML/CSS/JavaScript)
- `server/` — Node.js + Express REST API, MongoDB/Mongoose, JWT authentication

## 1. Configure the backend
Open a terminal in `achievo/server`:

```bash
npm install
```

Copy `.env.example` to `.env` and edit it:
- `MONGODB_URI=mongodb://127.0.0.1:27017/achievo`
- `JWT_SECRET=replace_this_with_a_long_random_secret`
- `PORT=5000`
- `CLIENT_ORIGIN=http://localhost:5173`

Start MongoDB first, then run:

```bash
npm run dev
```

API health check: `http://localhost:5000/api/health`

## 2. Start the frontend
Open a second terminal in `achievo/client`:

```bash
npm install
npm run dev
```

Open the Vite URL shown in the terminal, usually `http://localhost:5173`.

## 3. Try it
1. Create an account from **Get Started**.
2. Sign in.
3. Add achievements and projects from the dashboard.
4. Refresh the page: the items are loaded from MongoDB through the API.

## Security notes
- Passwords are hashed with bcrypt before storage.
- JWTs are stored in `localStorage` for this learning/demo project. For a production deployment, prefer secure, HttpOnly cookies, rate limiting, email verification, password reset, stronger validation, HTTPS, and audit logging.
- Do not publish your `.env` file or real secrets to GitHub.
- The app is an educational starter, not a security-audited production system.

## API endpoints
- `GET /api/health`
- `POST /api/auth/register`
- `POST /api/auth/login`
- `GET /api/auth/me` (authenticated)
- `GET /api/achievements` / `POST /api/achievements`
- `DELETE /api/achievements/:id`
- `GET /api/projects` / `POST /api/projects`
- `DELETE /api/projects/:id`

All achievement and project endpoints require `Authorization: Bearer <token>`.

## Common issues
- **MongoDB connection refused:** make sure MongoDB service is running, or update `MONGODB_URI` to your Atlas URI.
- **Port already in use:** change `PORT` in server `.env` or stop the process using port 5000.
- **Frontend cannot connect:** keep the backend on port 5000 and frontend on port 5173, or update `VITE_API_URL` in `client/.env`.
