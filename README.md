# AI Interview Pilot

AI Interview Pilot is a full-stack AI-powered interview platform that helps users practice technical interviews through an interactive interview experience.

The application uses a React frontend, FastAPI backend, PostgreSQL database, and AI-powered interview functionality.

## 🚀 Live Demo

**Frontend:**  
https://interview-ai-pilot.vercel.app

**Backend API:**  
https://interview-ai-pilot-production.up.railway.app

**API Documentation:**  
https://interview-ai-pilot-production.up.railway.app/docs

---

## ✨ Features

- User registration and authentication
- Secure password hashing
- JWT-based authentication
- Protected API routes
- User profile management
- AI-powered interview experience
- Interview session management
- PostgreSQL database integration
- RESTful API architecture
- CORS configuration for production
- Dockerized backend development
- Cloud deployment
- Responsive web interface

---

## 🏗️ Architecture

```text
                         User
                           │
                           ▼
                ┌─────────────────────┐
                │   Vercel Frontend   │
                │   React Application  │
                └──────────┬──────────┘
                           │
                           │ HTTPS / REST API
                           ▼
                ┌─────────────────────┐
                │  Railway Backend    │
                │  FastAPI Application│
                └──────────┬──────────┘
                           │
                           │ SQLAlchemy
                           ▼
                ┌─────────────────────┐
                │  Neon PostgreSQL    │
                │      Database       │
                └─────────────────────┘
