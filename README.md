# NGO Management Application

A complete, full-stack, free-to-use Web Application for non-profit organizations, educational charities, community foundations, and student empowerment centers.

Built using **Python 3**, **Flask**, **SQLite**, **SQLAlchemy ORM**, **Flask-Login**, **Flask-WTF**, **Bootstrap 5.3**, and **Chart.js**.

---

## 🌟 Key Features

### 1. 🔐 Authentication & Role-Based Access Control (RBAC)
- Two distinct roles:
  - **Administrator**: Complete system control, student records, teacher/staff directory management, session scheduling, feedback audits, attendance logs, printable dossiers, and CSV exports.
  - **Teacher / Staff**: View student records, submit weekly progress evaluations (ratings 1–5), schedule sessions, mark session attendance, and view student progress reports.
- Secure password hashing using `werkzeug.security`.
- Session management and CSRF token protection on all forms via `Flask-WTF`.

### 2. 📊 Interactive Dashboard
- Real-time KPI summary cards: Total Enrolled Students, Active Beneficiaries, Active Teaching Staff, Scheduled Sessions, Overall Attendance Rate %.
- **Chart.js** dynamic data visualizer:
  - Weekly Student Rating Score Distribution (Bar Chart).
  - Overall Attendance Breakdown (Donut Chart).
- Quick Activity Feeds: Upcoming and recent workshops, latest submitted student feedbacks, and quick action shortcuts.

### 3. 🎓 Student Beneficiary Management
- **Automatic Unique Student ID Generation**: Formatted as `NGO-YYYY-XXXX` (e.g. `NGO-2026-0001`, `NGO-2026-0002`).
- Comprehensive student profiles: Full Name, Date of Birth (with dynamic age calculation), Gender, Parent/Guardian details, Contact Phone, Email, Residential Address, Enrollment Date, Grade/Class, School Name, Status (`Active`, `Inactive`, `Graduated`, `On Leave`), Profile Photo uploads, and Special Background Notes.
- Search by Name, Student ID, School, Phone, or Parent with instant Class and Status filtering.
- **Detailed Student Dossier**:
  - Live calculated Attendance Percentage and Present/Late/Absent breakdown.
  - Average feedback rating score and star rating representation.
  - Chronological Weekly Feedback history timeline with focus areas, strengths, and teacher remarks.
  - Interactive line chart visualizing the student's progress rating over time.
  - Complete Attendance log history.

### 4. 📝 Weekly Student Feedback & Evaluation
- 5-Point Rating Scale with clear standards:
  - `5` - Excellent (Outstanding performance & attitude)
  - `4` - Good (Consistently meeting goals)
  - `3` - Satisfactory (Average progress, on track)
  - `2` - Below Average (Struggling, needs extra attention)
  - `1` - Needs Improvement (Critical focus required)
- Multi-dimensional assessments: Focus Area, Attendance Observation, Academic Progress, Behaviour & Social Attitude, Participation, Key Strengths, Areas for Improvement, and Instructor Remarks.

### 5. 📅 Sessions & Interactive Attendance Roster
- Class & Workshop Scheduling: Title, Date, Start Time, End Time, Assigned Teacher, Category (`Academic`, `Skill Workshop`, `Mentorship`, `Extracurricular`, `Life Skills`, `Other`), Location, and Status.
- **Interactive Batch Attendance Sheet**:
  - Mark `Present`, `Late`, or `Absent` per student with individual remarks/notes.
  - **Quick Select Buttons**: "All Present", "All Late", "All Absent" for rapid marking of large classes.
  - Live dynamic counters updating instant Present/Late/Absent headcounts.
  - Auto-completion option to mark the session as "Completed".
  - Database unique constraints prevent duplicate attendance entries.

### 6. 📑 Reports & CSV Export Center
- **Student Performance Report**: Individual student profile with complete evaluation history, printable with `@media print` clean layout and one-click CSV export.
- **Attendance Audit Report**: Multi-parameter filter by student, session, teacher, or custom date range. Generates summary statistics and CSV exports.
- **Feedback History Report**: Filterable by rating, instructor, student, and date range with CSV exports.

---

## 🛠️ Technology Stack

| Layer | Technology |
|---|---|
| **Backend** | Python 3.12+, Flask 3.0 |
| **Database** | SQLite (zero-cost, zero cloud dependencies) |
| **ORM** | Flask-SQLAlchemy / SQLAlchemy 2.0 |
| **Authentication** | Flask-Login, Werkzeug Password Hashing |
| **Form & CSRF** | Flask-WTF, WTForms |
| **Frontend UI** | HTML5, CSS3, JavaScript, Bootstrap 5.3, Bootstrap Icons |
| **Charts** | Chart.js 4.4 |
| **Template Engine** | Jinja2 |
| **Production WSGI** | Gunicorn |

---

## 📁 Project Structure

```
NGO/
├── app/
│   ├── __init__.py          # Flask application factory with Jinja filters
│   ├── extensions.py        # SQLAlchemy, LoginManager, CSRFProtect
│   ├── models.py            # User, Student, Session, Attendance, Feedback
│   ├── utils.py             # ID generator (NGO-YYYY-XXXX), decorators, photo helper
│   ├── auth/                # Login, logout, profile & password change
│   │   ├── __init__.py
│   │   ├── forms.py
│   │   └── routes.py
│   ├── users/               # Admin User Management (Teachers/Staff)
│   │   ├── __init__.py
│   │   ├── forms.py
│   │   └── routes.py
│   ├── main/                # Dashboard & KPI summaries
│   │   ├── __init__.py
│   │   └── routes.py
│   ├── students/            # Student beneficiary CRUD & profiles
│   │   ├── __init__.py
│   │   ├── forms.py
│   │   └── routes.py
│   ├── feedback/            # Weekly student evaluation & ratings
│   │   ├── __init__.py
│   │   ├── forms.py
│   │   └── routes.py
│   ├── sessions/            # Session management & batch attendance sheets
│   │   ├── __init__.py
│   │   ├── forms.py
│   │   └── routes.py
│   ├── reports/             # Reports & CSV exports
│   │   ├── __init__.py
│   │   └── routes.py
│   ├── static/
│   │   ├── css/
│   │   │   └── style.css    # Custom styling & print CSS
│   │   ├── js/
│   │   │   └── app.js       # Client helpers & attendance scripts
│   │   └── uploads/         # Student profile images
│   └── templates/           # Jinja2 HTML templates
│       ├── base.html
│       ├── login.html
│       ├── profile.html
│       ├── dashboard.html
│       ├── errors/
│       ├── users/
│       ├── students/
│       ├── feedback/
│       ├── sessions/
│       └── reports/
├── instance/
│   └── ngo.db               # SQLite local database
├── tests/
│   └── test_app.py          # Automated unit & integration test suite
├── app.py                   # Main application entry point
├── config.py                # Configuration classes (Dev, Testing, Prod)
├── seed.py                  # Database initialization & rich sample seed script
├── requirements.txt         # Python package dependencies
├── Procfile                 # Production WSGI startup command
├── .env.example             # Environment variables template
├── .gitignore               # Git ignore rules
└── README.md                # Documentation
```

---

## 🚀 Quick Start (Local Setup)

### 1. Prerequisites
- Python 3.10+ installed on your system.

### 2. Clone / Open Project
Navigate to the project root directory:
```bash
cd NGO
```

### 3. Create & Activate Virtual Environment

**On Windows (PowerShell / Command Prompt):**
```powershell
python -m venv venv
.\venv\Scripts\activate
```

**On macOS / Linux:**
```bash
python3 -m venv venv
source venv/bin/activate
```

### 4. Install Dependencies
```bash
pip install -r requirements.txt
```

### 5. Initialize & Seed Database
Run the seed script to create the SQLite database tables and populate sample students, teachers, workshops, feedback, and attendance data:
```bash
python seed.py
```

### 6. Run the Application
```bash
python app.py
```

Open your browser and navigate to:
👉 **[http://127.0.0.1:5000](http://127.0.0.1:5000)**

---

## 🔑 Default Login Credentials

| Role | Username | Password | Full Name |
|---|---|---|---|
| **Administrator** | `srinivas` | `srinivasngo` | Srinivas (Director) |
| **Teacher / Staff** | `teacher` | `srinivasngo` | Staff Teacher |

> 💡 *To change your password after signing in, click your profile icon in the top right and select "My Profile & Password".*

---

## 🧪 Running Automated Tests

Run the built-in test suite:
```bash
python -m unittest tests/test_app.py
```

---

## 🔄 Resetting the Database

To clear and re-populate the database with clean demo data at any time:
```bash
python seed.py
```

---

## 🌐 Free Cloud Deployment Guide

The application is structured to easily deploy to free hosting platforms such as **Render**, **Railway**, or **PythonAnywhere**.

### Deploying to Render / Railway:
1. Push this repository to GitHub.
2. In Render / Railway, create a new **Web Service** pointing to your repository.
3. Set the **Build Command**:
   ```bash
   pip install -r requirements.txt
   ```
4. Set the **Start Command**:
   ```bash
   gunicorn "app:create_app()"
   ```
5. Set Environment Variables:
   - `SECRET_KEY`: A secure random secret key.
   - `FLASK_ENV`: `production`

> ⚠️ *Note on SQLite*: SQLite works out of the box locally and on persistent disk mounts. If deploying on ephemeral cloud containers (e.g. Render free tier without persistent disks), changes made in SQLite will reset on service restart. For persistent production cloud use, connect a PostgreSQL database URL by setting `DATABASE_URL=postgresql://user:pass@host/dbname` in the environment variables.

---

## 🛡️ License & Educational Use
This project is completely free and open-source under the MIT License. Created for colleges, students, and non-profit organizations.
