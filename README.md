# FundWave

FundWave is a modern, full-stack personal finance tracker designed to help you take control of your financial life. Built with a MERN stack (MongoDB, Express, React, Node.js) and enhanced with TypeScript and Vite, FundWave offers intuitive expense tracking, AI-powered insights, and goal management.

## Features

- **Dashboard**: Get a bird's-eye view of your finances with visual charts and recent transaction logs.
- **Transaction Management**: Easily add, edit, or delete incomes and expenses.
- **Savings Goals**: Set up financial goals, track your progress, and visualize how close you are to achieving them.
- **AI-Powered Insights**: Get personalized financial advice and analysis based on your spending habits (powered by Google Gemini).
- **Secure Authentication**: Robust user authentication featuring JWT (JSON Web Tokens) and Google OAuth integration.
- **Responsive Design**: A sleek, modern UI built with Tailwind CSS that works beautifully on both desktop and mobile devices.

## Technology Stack

**Frontend**
- React 19
- Vite
- TypeScript
- Tailwind CSS
- React Router DOM
- Recharts (for data visualization)
- Axios

**Backend**
- Node.js & Express.js
- TypeScript
- MongoDB with Mongoose
- Google Gemini API (for AI Insights)
- JWT for authentication
- Nodemailer

##  Getting Started (Local Development)

### Prerequisites
- Node.js (v22 LTS recommended)
- MongoDB Atlas account (or a local MongoDB instance)
- Google Cloud Console account (for Google OAuth)
- Google Gemini API Key

### 1. Clone the repository
```bash
git clone https://github.com/Pravallikadintyala/FundWave.git
cd FundWave
```

### 2. Environment Setup
You will need to configure environment variables for both the backend and frontend.

**Backend Configuration:**
Navigate to the `backend` directory and copy the template:
```bash
cd backend
cp .env.example .env
```
Fill in the following essential variables in `backend/.env`:
- `MONGODB_URI`: Your MongoDB connection string.
- `JWT_SECRET`: A secure random string for signing JWTs.
- `GEMINI_API_KEY`: Your Google Gemini API key.
- `GOOGLE_CLIENT_ID` & `GOOGLE_CLIENT_SECRET`: For Google OAuth.

**Frontend Configuration:**
Navigate to the `frontend` directory and copy the template:
```bash
cd frontend
cp .env.example .env
```
Ensure `VITE_API_URL` is pointing to your backend (e.g., `http://localhost:4000/api`).

### 3. Install Dependencies & Run

**Start the Backend:**
```bash
cd backend
npm install
npm run dev
```

**Start the Frontend:**
```bash
cd frontend
npm install
npm run dev
```

The frontend will be available at `http://localhost:5173` and the backend at `http://localhost:4000`.

## Docker Deployment

This project includes a production-ready Docker setup using `docker-compose`.

### Prerequisites
- Docker and Docker Compose installed.
- MongoDB Atlas (or another MongoDB provider).

### Environment Variables
1. **Backend**: Make sure you have created `.env` in the `backend/` directory using `backend/.env.example` as a template.
2. **Frontend**: Make sure you have created `.env` in the `frontend/` directory using `frontend/.env.example` as a template. `VITE_API_URL` is a **build-time** variable; it must be set before building the image. For local docker-compose testing, use `http://localhost:4000/api`.

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

##  Project Structure

```
FundWave/
├── backend/                  # Express.js REST API
│   ├── src/
│   │   ├── config/           # Database and Env configurations
│   │   ├── controllers/      # Route controllers
│   │   ├── middleware/       # Express middlewares (Auth, Error handling)
│   │   ├── models/           # Mongoose schemas
│   │   ├── routes/           # API routes definition
│   │   ├── services/         # Business logic and external API calls
│   │   └── server.ts         # Application entry point
│   └── Dockerfile
├── frontend/                 # React frontend application
│   ├── src/
│   │   ├── api/              # Axios API client setup
│   │   ├── components/       # Reusable UI components
│   │   ├── context/          # React contexts (Auth, Theme)
│   │   ├── hooks/            # Custom React hooks
│   │   ├── pages/            # Main application pages
│   │   └── routes/           # Application routing (Protected/Public routes)
│   ├── nginx.conf            # Nginx configuration for production
│   └── Dockerfile
└── docker-compose.yml        # Multi-container Docker orchestration
```

## License

This project is licensed under the ISC License.
