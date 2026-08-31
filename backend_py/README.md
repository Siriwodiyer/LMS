# LMS Python FastAPI & MySQL Backend

A high-performance, asynchronous Python REST API built with **FastAPI**, **SQLAlchemy ORM**, **PyMySQL**, and **Pydantic v2** for the LMS Platform.

---

## 🌟 Key Features

- **Authentication & Security**: JWT tokens, password hashing with bcrypt, role-based access control (`student`, `mentor`, `admin`).
- **6-Reel Micro-Assessments**: Automated assessment grading, XP/points calculation, dynamic rewards (badges & discount vouchers), and mentor eligibility checks.
- **Course & Lesson Management**: Multi-module courses with vertical reels, preview lessons, enrollment tracking, and reel progress completion.
- **Quizzes & Assignments**: Auto-graded MCQ/True-False quizzes, submission pipeline with mentor grading.
- **Content Approval Pipeline**: Multi-state workflow (`submitted`, `under_review`, `changes_requested`, `approved`, `rejected`, `published`) with audit feedback history.
- **Mentor Applications**: Application submission, portfolio review, admin approval/rejection lifecycle, and student mentorship tracking.
- **Gamification & Rewards**: Badge definitions, unlocked achievements, discount vouchers, and real-time leaderboard.
- **Interactive Feedback & Social**: Course reviews, platform feedback, reel comments with moderation flags.
- **AI Tutor & Smart Insights**: Weak/strong topic detection, personalized recommendations, and contextual AI tutor chat.
- **MySQL Auto-Provisioning & Seeding**: Automatically creates `lms_db` if not exists, provisions all tables, and seeds initial data on first launch.

---

## 🚀 Quick Start

### 1. Configure MySQL in `.env`
Edit `backend_py/.env` to configure your MySQL connection:

```env
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=your_mysql_password_here
DB_NAME=lms_db
```

### 2. Install Dependencies
```bash
python -m pip install -r backend_py/requirements.txt
```

### 3. Run the Backend Server
```bash
python backend_py/run.py
```
Or directly with Uvicorn:
```bash
uvicorn backend_py.main:app --reload --port 8000
```

---

## 📚 Interactive API Documentation

Once the server is running, explore the interactive Swagger UI and OpenAPI documentation:
- **Swagger UI**: [http://localhost:8000/docs](http://localhost:8000/docs)
- **ReDoc**: [http://localhost:8000/redoc](http://localhost:8000/redoc)
- **Health Check**: [http://localhost:8000/api/health](http://localhost:8000/api/health)

---

## 📁 Project Architecture

```
backend_py/
├── config.py              # Pydantic BaseSettings & connection strings
├── database.py            # SQLAlchemy engine, session maker, DB creation
├── main.py                # FastAPI app, CORS middleware, lifespan events
├── run.py                 # Convenience server runner
├── requirements.txt       # Dependencies
├── .env                   # Local environment configuration
├── middleware/
│   └── auth.py            # JWT authentication & role-based dependencies
├── models/                # SQLAlchemy ORM database models
│   ├── user.py
│   ├── reel.py
│   ├── course.py
│   ├── quiz.py
│   ├── assignment.py
│   ├── assessment.py
│   ├── approval.py
│   ├── mentor.py
│   ├── reward.py
│   ├── feedback.py
│   ├── comment.py
│   ├── notification.py
│   ├── settings.py
│   └── progress.py
├── schemas/               # Pydantic request/response validation models
├── routers/               # 16 REST API Routers
│   ├── auth.py
│   ├── users.py
│   ├── reels.py
│   ├── courses.py
│   ├── quizzes.py
│   ├── assignments.py
│   ├── assessments.py
│   ├── approvals.py
│   ├── mentors.py
│   ├── rewards.py
│   ├── feedback.py
│   ├── comments.py
│   ├── notifications.py
│   ├── analytics.py
│   ├── settings.py
│   └── ai.py
└── seed/
    ├── initial_seed.json  # Comprehensive prototype dataset
    └── seeder.py          # Auto-seeding script
```

---

## 🧪 Testing and Database Reset

To reset and re-seed the database with demo accounts and courses at any time:
```bash
python -m backend_py.seed.seeder
```
