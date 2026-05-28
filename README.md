# ResumeBuilder 🚀
AI-powered Resume Analysis &amp; ATS Optimization platform built with React, Node.js, TypeScript, MongoDB, and Gemini AI. Upload resumes, compare with Job Descriptions, get ATS scores, missing keywords, AI-generated improvement suggestions, and enhanced resume bullet points.

---

## ✨ Features

- 📄 Resume Upload (PDF)
- 🤖 AI-Powered Resume Analysis
- 📊 ATS Score Calculation
- 🎯 Job Description Matching
- 🔍 Missing Keyword Detection
- ✨ AI-Generated Resume Improvements
- 🔐 JWT Authentication
- 🎨 Modern UI using shadcn/ui + TailwindCSS

---

## 🛠 Tech Stack

### Frontend
- React
- TypeScript
- Vite
- TailwindCSS
- shadcn/ui
- Zustand
- React Router

### Backend
- Node.js
- Express.js
- TypeScript
- MongoDB
- Mongoose
- Multer
- JWT Authentication

### AI
- Google Gemini API

---

## 📁 Project Structure

```bash
ResumeBuilder/
│
├── frontend/
│   ├── src/
│   ├── public/
│   └── ...
│
├── backend/
│   ├── src/
│   ├── uploads/
│   └── ...
│
└── README.md

create a .env file in /backend
DB_PASSWORD=<your value>
DB_NAME=<your value>
DB_URI=<your value>
APP_ENDPOINT=build-resume
PORT=3000
JWT_SECRET=<your value>
FRONTEND_ENDPOINT=http://localhost:5173
GEMINI_API_KEY=<your value>
GROQ_API_KEY=<your value>

Then do "npm i" in both backend and frontend