# AI Lost & Found Assistant

An AI-powered Lost & Found web application built for university campuses and organizations. Users can securely register, report lost or found items with descriptions and photos, and automatically receive real-time AI vector similarity matches complete with confidence scores and email notifications.

---

## 🌟 Key Features

- **JWT Authentication & Roles**: User registration, login, bcrypt password hashing, and role-based authorization (`USER` & `ADMIN`).
- **Lost & Found Reporting**: Create detailed lost or found item reports with multi-field metadata, dates, campus locations, and optional photo uploads.
- **Multi-Modal AI Text & Image Matching**:
  - **Text Matching**: `sentence-transformers/all-MiniLM-L6-v2` semantic vector embeddings.
  - **Visual Matching**: `OpenCLIP` (ViT-B-32) visual feature comparison.
  - **Vector Similarity Search**: `FAISS` inner-product vector indexing.
- **Weighted Confidence Scoring**:
  - Combined scoring based on Text Similarity (40%), Image Similarity (30%), Category (15%), Location (10%), and Date (5%). Dynamic weight redistribution when images are omitted.
  - Categorized into High (≥75%), Medium (50-74%), and Low (<50%) confidence levels.
- **Automatic Matching Pipeline**: Triggers vector similarity calculation upon creation of any new report, storing non-duplicate matches in SQLite.
- **SMTP Email Alerts**: Automatically emails lost item owners when high-confidence matches are detected. Gracefully degrades to simulation log mode if SMTP credentials are omitted.
- **Interactive Dashboards**:
  - **User Dashboard**: Real-time stats, my lost reports, my found reports, potential match cards, and confidence breakdowns.
  - **Admin Module**: Campus office view to verify potential matches and mark items as collected/resolved.

---

## 📁 Project Structure

```text
AI-Lost-Found-Assistant/
├── backend/
│   ├── app/
│   │   ├── ai/
│   │   │   ├── faiss_indexer.py      # FAISS vector similarity search
│   │   │   ├── image_engine.py       # OpenCLIP image feature extraction
│   │   │   ├── matching_engine.py    # Weighted confidence calculation
│   │   │   └── text_engine.py        # Sentence-Transformers text embedding
│   │   ├── models/                   # SQLAlchemy models (User, Item, Match)
│   │   ├── routes/                   # FastAPI API routes (auth, items, matches, admin)
│   │   ├── schemas/                  # Pydantic validation schemas
│   │   ├── services/                 # Matching orchestration & email dispatch
│   │   ├── utils/                    # Auth helpers & email service
│   │   ├── config.py                 # Settings & scoring weights
│   │   ├── database.py               # SQLite engine & sessions
│   │   └── main.py                   # FastAPI app entrypoint & CORS
│   ├── uploads/                      # Safe local storage for item photos
│   ├── requirements.txt              # Python backend dependencies
│   └── seed_data.py                  # Demo script for initial users & items
├── frontend/
│   ├── src/
│   │   ├── components/               # Navbar, MatchCard, ProtectedRoute
│   │   ├── context/                  # AuthContext (JWT state)
│   │   ├── pages/                    # Landing, Login, Register, Dashboards
│   │   ├── services/                 # Axios API service layer
│   │   ├── App.jsx                   # React Router configuration
│   │   └── index.css                 # Tailwind CSS directives
│   ├── package.json
│   └── vite.config.js                # Vite dev server & API proxying
├── .env.example                      # Environment variables template
└── README.md
```

---

## 🚀 Installation & Setup

### Prerequisites
- **Python**: 3.11+
- **Node.js**: v18+ and npm

### 1. Environment Configuration
Copy the template file to `.env` inside the `backend/` directory:
```bash
cp .env.example backend/.env
```
*(Optionally provide your SMTP credentials in `.env` if real email delivery is desired).*

---

## ⚙️ Running the Backend

1. Navigate to the `backend/` folder:
```bash
cd backend
```

2. Install Python dependencies:
```bash
pip install -r requirements.txt
```

3. (Optional) Populate demo data & test AI matching:
```bash
python seed_data.py
```

4. Start the FastAPI server:
```bash
python -m uvicorn app.main:app --host 127.0.0.1 --port 8000 --reload
```
- API Endpoint: `http://127.0.0.1:8000`
- Interactive Swagger Documentation: `http://127.0.0.1:8000/docs`

---

## 💻 Running the Frontend

1. Navigate to the `frontend/` folder:
```bash
cd frontend
```

2. Install Node dependencies:
```bash
npm install
```

3. Launch the Vite development server:
```bash
npm run dev
```
- Frontend Application URL: `http://localhost:3000` (or `http://localhost:5173`)

---

## 🔑 Demo Login Accounts

If you executed `python seed_data.py`, the following demo accounts are available:

- **Admin Account**:
  - Email: `admin@lostfound.edu`
  - Password: `Admin123!`
  - Role: `ADMIN`

- **Standard Student Accounts**:
  - Email: `alice@student.edu` | Password: `Password123!`
  - Email: `bob@student.edu`   | Password: `Password123!`

---

## 🧪 AI Model Details & Architecture

- **Text Embeddings**: `all-MiniLM-L6-v2` produces 384-dimensional dense vectors capturing conceptual meaning (e.g. recognizing that "bifold pocket wallet" matches "leather billfold holder").
- **Visual Embeddings**: `OpenCLIP` (`ViT-B-32` trained on `laion2b_s34b_b79k`) yields 512-dimensional image vectors for image similarity.
- **FAISS Indexing**: `faiss.IndexFlatIP` computes inner-product cosine similarity over normalized embeddings.
