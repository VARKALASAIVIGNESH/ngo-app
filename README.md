# NGO Management Application

A full-stack **Next.js** web application designed for non-profit organizations and community learning centers to manage student beneficiaries, monitor weekly academic & behavioral progress, schedule workshops, record batch attendance, generate printable dossiers, and export data as CSV.

---

## 🚀 Key Modules & Features

1. **Role-Based Authentication & User Management**:
   - **Administrator**: Full privileges (Director / Admin).
   - **Teacher / Staff**: Beneficiary records, weekly evaluations, attendance marking, and reports.
   - Profile settings and password updates.

2. **Real-time Dashboard & Analytics**:
   - Live KPI cards (Total Beneficiaries, Active Students, Completed Workshops, Overall Attendance Rate %, Avg Student Rating).
   - **Chart.js** Weekly Rating Distribution Bar Chart (1–5 Stars) and Attendance Status Donut Chart.
   - Quick action shortcuts and recent activity feed.

3. **Student Beneficiary Directory & Profile Dossier**:
   - **Automatic Unique ID Generation**: Formatted sequentially as `NGO-YYYY-XXXX` (e.g. `NGO-2026-0001`).
   - Dynamic search by student name, ID, or school; multi-parameter filtering by grade and enrollment status.
   - Comprehensive student profile dossiers with calculated attendance percentages, average ratings, and academic progress trend line chart.

4. **Weekly Feedback & 5-Star Evaluations**:
   - Structured evaluations with 1 to 5 star rating badges.
   - Multi-rubric fields: Subject Focus, Attendance Observation, Academic Progress, Behaviour, Strengths, Improvement Areas, and Teacher Remarks.

5. **Sessions & Interactive Batch Attendance**:
   - Workshop scheduling with category, venue, and assigned educator.
   - **Interactive Batch Attendance Sheet**: Quick **"Mark All Present"**, **"Mark All Late"**, and **"Mark All Absent"** buttons with live dynamic counters.

6. **Reports & Data Export Center**:
   - Printable `@media print` optimized student performance dossiers and audit logs.
   - **1-Click CSV Exports**:
     - Beneficiary Master Directory (`.csv`)
     - Attendance Audit Trail (`.csv`)
     - Feedback & Evaluation History (`.csv`)

---

## 🛠️ Tech Stack

- **Framework**: Next.js 14 (React 18)
- **Local Dev Server**: `npm run dev` (`http://localhost:3000`)
- **Data Store**: Unified reactive state with LocalStorage persistence and instant reset
- **Visualization**: Chart.js & React-Chartjs-2
- **Icons**: Bootstrap Icons
- **Deployment**: 1-Click Native Vercel Deployment

---

## 💻 Local Setup Instructions

### 1. Install Dependencies
```bash
npm install
```

### 2. Start the Development Server
```bash
npm run dev
```

Open your browser and navigate to:
👉 **`http://localhost:3000`**

---

## 🔑 Default Login Credentials

| Role | Username | Password | Full Name |
|---|---|---|---|
| **Administrator** | `srinivas` | `srinivasngo` | Srinivas (Director) |
| **Teacher / Staff** | `teacher` | `srinivasngo` | Staff Teacher |
| **Teacher / Staff** | `david.kumar` | `srinivasngo` | David Kumar |

> 💡 *Click the "Autofill" button on the login screen for instant 1-click demo access.*

---

## ☁️ 1-Click Vercel Deployment

1. Push this repository to GitHub:
   ```bash
   git add .
   git commit -m "Deploy Next.js NGO app"
   git push origin main
   ```
2. Go to **[vercel.com/dashboard](https://vercel.com/dashboard)**.
3. Import your **`ngo-app`** repository.
4. Click **Deploy** &mdash; Vercel automatically detects Next.js and deploys in under 1 minute with 100% native compatibility!
