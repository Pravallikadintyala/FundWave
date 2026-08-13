# FundWave

FundWave is a full-stack personal finance tracker.

## Docker Deployment

This project includes a production-ready Docker setup using `docker-compose`.

### Prerequisites
- Docker and Docker Compose installed.
- MongoDB Atlas (or another MongoDB provider).

### Environment Variables
1. **Backend**: Create `.env` in the `backend/` directory using `backend/.env.example` as a template.
   - You MUST set `MONGODB_URI` and `JWT_SECRET`.
   - Optionally set `GEMINI_API_KEY` for AI insights.
2. **Frontend**: Create `.env` in the `frontend/` directory using `frontend/.env.example` as a template.
   - `VITE_API_URL` is a **build-time** variable. It must be set before building the image. For local docker-compose testing, use `http://localhost:4000/api`.

### Building and Running
To build and start the containers, run from the root directory:
```bash
docker-compose up --build -d
```

### URLs
- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:4000
- **Backend Health Check**: http://localhost:4000/api/health

### Stopping the Application
To stop the running containers:
```bash
docker-compose down
```
