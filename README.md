# THE-FALCONS Backend + Frontend

## Overview

This project now has:

- **Frontend**: React + Vite app in the `Frontend` folder.
- **Backend**: Python Flask API in the `backend` folder (no Django).
- **AI Chat**: Gemini 2.5 Flash powered chatbot endpoint exposed from the Flask backend.

The frontend talks to the backend via REST under the `/api` prefix.

Key backend routes used by the frontend:

- **Auth**
  - `POST /api/auth/login`
  - `POST /api/auth/signup`
- **Inventory**
  - `GET /api/inventory`
  - `GET /api/inventory/:id`
  - `POST /api/inventory`
  - `PUT /api/inventory/:id`
  - `DELETE /api/inventory/:id`
- **Analytics**
  - `GET /api/analytics/dashboard`
  - `GET /api/analytics/trends`
  - `GET /api/analytics/loss`
  - `GET /api/analytics/consumer`
- **Sensors**
  - `GET /api/sensors/readings`
  - `GET /api/sensors/alerts`
  - `GET /api/sensors/silos`
  - `PUT /api/sensors/alerts/:id/acknowledge`
- **Chatbot (Gemini)**
  - `POST /api/chat`

All non‑auth data is currently backed by in‑memory mock data aligned with the existing `mockData.js` so you can demo the app without a real database.

## Backend Setup (Flask + Gemini 2.5 Flash)

1. **Create and activate a virtual environment (recommended)**

   ```bash
   cd backend
   python -m venv .venv
   .venv\Scripts\activate  # Windows PowerShell / CMD
   # source .venv/bin/activate  # macOS / Linux
   ```

2. **Install Python dependencies**

   ```bash
   pip install -r requirements.txt
   ```

3. **Configure environment variables**

   - Copy `.env.example` to `.env` in the `backend` folder.
   - Set your Gemini API key:

   ```bash
   # In backend/.env
   GOOGLE_API_KEY=your_gemini_api_key_here
   ```

   You can also set `SECRET_KEY` and `PORT` if you like, otherwise defaults are used.

4. **Run the Flask backend**

   ```bash
   cd backend
   python app.py
   ```

   The server will start on `http://localhost:5000` and expose routes under `/api`.

5. **Quick health check**

   Open in your browser or via curl:

   ```bash
   curl http://localhost:5000/api/health
   ```

   You should see a small JSON with `status: "ok"`.

## Frontend Setup (React + Vite)

1. **Install dependencies**

   ```bash
   cd Frontend
   npm install
   ```

2. **Configure API URL (optional)**

   By default, the frontend `api.js` uses:

   ```text
   VITE_API_URL || http://localhost:5000/api
   ```

   If you want to customize the backend URL, create `Frontend/.env`:

   ```bash
   VITE_API_URL=http://localhost:5000/api
   ```

3. **Run the frontend**

   ```bash
   cd Frontend
   npm run dev
   ```

   The app will usually be available at `http://localhost:5173`.

## Chatbot Flow (Gemini 2.5 Flash)

- The React `Chatbot` component now calls the Flask endpoint:

  - `POST /api/chat`
  - Body: `{ message: string, history: [{ role: 'user' | 'assistant', content: string }] }`
  - Response: `{ reply: string }`

- The backend uses the `google-genai` Python SDK and the `gemini-2.5-flash` model to generate responses using the AgroVault system prompt.

Make sure the backend is running **before** using the chatbot in the frontend.
