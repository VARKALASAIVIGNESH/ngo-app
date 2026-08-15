'use client';

import React from 'react';
import Link from 'next/link';
import { useApp } from '@/lib/store';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
} from 'chart.js';
import { Bar, Doughnut } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

export default function DashboardPage() {
  const { students, sessions, attendance, feedbacks, currentUser } = useApp();

  // Calculate KPIs
  const totalStudents = students.length;
  const activeStudents = students.filter(s => s.status === 'Active').length;
  const completedSessions = sessions.filter(s => s.status === 'Completed').length;
  const scheduledSessions = sessions.filter(s => s.status === 'Scheduled').length;

  const totalAttRecords = attendance.length;
  const presentCount = attendance.filter(a => a.status === 'Present').length;
  const lateCount = attendance.filter(a => a.status === 'Late').length;
  const absentCount = attendance.filter(a => a.status === 'Absent').length;

  const overallAttendancePct = totalAttRecords > 0
    ? Math.round(((presentCount + (0.5 * lateCount)) / totalAttRecords) * 100)
    : 0;

  const totalRatings = feedbacks.length;
  const avgRating = totalRatings > 0
    ? (feedbacks.reduce((acc, f) => acc + Number(f.rating), 0) / totalRatings).toFixed(1)
    : '0.0';

  // Chart 1: Rating Distribution (1 to 5 stars)
  const ratingCounts = [1, 2, 3, 4, 5].map(star => feedbacks.filter(f => Number(f.rating) === star).length);
  const ratingChartData = {
    labels: ['1 Star', '2 Stars', '3 Stars', '4 Stars', '5 Stars'],
    datasets: [
      {
        label: 'Evaluations Count',
        data: ratingCounts,
        backgroundColor: [
          '#ef4444',
          '#f97316',
          '#eab308',
          '#3b82f6',
          '#10b981'
        ],
        borderRadius: 6
      }
    ]
  };

  // Chart 2: Attendance Status Breakdown (Donut)
  const attendanceChartData = {
    labels: ['Present', 'Late', 'Absent'],
    datasets: [
      {
        data: [presentCount, lateCount, absentCount],
        backgroundColor: ['#10b981', '#f59e0b', '#ef4444'],
        borderWidth: 0
      }
    ]
  };

  const recentSessions = [...sessions].slice(0, 4);
  const recentFeedbacks = [...feedbacks].slice(0, 4);

  return (
    <div>
      {/* Welcome Banner */}
      <div
        style={{
          background: 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)',
          borderRadius: 'var(--radius-lg)',
          padding: '24px 28px',
          color: 'white',
          marginBottom: '28px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '16px'
        }}
      >
        <div>
          <h1 style={{ fontSize: '1.5rem', fontWeight: 700 }}>
            Welcome back, {currentUser?.fullName || 'Educator'}! 👋
          </h1>
          <p style={{ color: '#94a3b8', fontSize: '0.92rem', marginTop: '4px' }}>
            Empowering students and tracking educational impact across our community programs.
          </p>
        </div>
        <div style={{ display: 'flex', gap: '10px' }}>
          <Link href="/students/new" className="btn btn-primary btn-sm">
            <i className="bi bi-person-plus-fill"></i> New Student
          </Link>
          <Link href="/feedback/new" className="btn btn-outline btn-sm" style={{ color: 'white', borderColor: 'rgba(255,255,255,0.3)', background: 'transparent' }}>
            <i className="bi bi-star-fill"></i> Add Feedback
          </Link>
        </div>
      </div>

      {/* KPI Stats Grid */}
      <div className="stat-grid">
        <div className="stat-card">
          <div className="stat-icon" style={{ background: '#eff6ff', color: '#2563eb' }}>
            <i className="bi bi-people-fill"></i>
          </div>
          <div>
            <div className="stat-value">{totalStudents}</div>
            <div className="stat-label">Total Beneficiaries ({activeStudents} Active)</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon" style={{ background: '#ecfdf5', color: '#10b981' }}>
            <i className="bi bi-calendar-check-fill"></i>
          </div>
          <div>
            <div className="stat-value">{completedSessions}</div>
            <div className="stat-label">Completed Workshops ({scheduledSessions} Next)</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon" style={{ background: '#f0fdfa', color: '#0d9488' }}>
            <i className="bi bi-pie-chart-fill"></i>
          </div>
          <div>
            <div className="stat-value">{overallAttendancePct}%</div>
            <div className="stat-label">Overall Attendance Rate</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon" style={{ background: '#fffbeb', color: '#f59e0b' }}>
            <i className="bi bi-star-fill"></i>
          </div>
          <div>
            <div className="stat-value">{avgRating} ★</div>
            <div className="stat-label">Avg Student Rating ({totalRatings} Reviews)</div>
          </div>
        </div>
      </div>

      {/* Charts Section */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '24px', marginBottom: '28px' }}>
        <div className="card" style={{ marginBottom: 0 }}>
          <div className="card-header">
            <h3 className="card-title">
              <i className="bi bi-bar-chart-fill" style={{ color: '#2563eb' }}></i>
              Weekly Evaluation Ratings
            </h3>
            <span className="badge badge-info">{totalRatings} Total Evaluations</span>
          </div>
          <div style={{ height: '240px', position: 'relative' }}>
            <Bar
              data={ratingChartData}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                plugins: { legend: { display: false } },
                scales: { y: { beginAtZero: true, ticks: { stepSize: 1 } } }
              }}
            />
          </div>
        </div>

        <div className="card" style={{ marginBottom: 0 }}>
          <div className="card-header">
            <h3 className="card-title">
              <i className="bi bi-donut-chart" style={{ color: '#10b981' }}></i>
              Attendance Breakdown
            </h3>
            <span className="badge badge-success">{totalAttRecords} Records Logged</span>
          </div>
          <div style={{ height: '240px', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
            <Doughnut
              data={attendanceChartData}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                plugins: { legend: { position: 'bottom' } }
              }}
            />
          </div>
        </div>
      </div>

      {/* Recent Activity Sections */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '24px' }}>
        {/* Recent Workshops */}
        <div className="card" style={{ marginBottom: 0 }}>
          <div className="card-header">
            <h3 className="card-title">
              <i className="bi bi-calendar-event-fill" style={{ color: '#6366f1' }}></i>
              Recent & Upcoming Workshops
            </h3>
            <Link href="/sessions" className="btn btn-outline btn-sm">View All</Link>
          </div>
          <div className="table-responsive">
            <table className="table">
              <thead>
                <tr>
                  <th>Session Title</th>
                  <th>Date</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {recentSessions.map(sess => (
                  <tr key={sess.id}>
                    <td>
                      <div style={{ fontWeight: 600 }}>{sess.title}</div>
                      <small style={{ color: '#64748b' }}>{sess.location}</small>
                    </td>
                    <td>{sess.date}</td>
                    <td>
                      <span className={`badge ${sess.status === 'Completed' ? 'badge-success' : 'badge-warning'}`}>
                        {sess.status}
                      </span>
                    </td>
                    <td>
                      <Link href={`/sessions/${sess.id}/attendance`} className="btn btn-outline btn-sm">
                        <i className="bi bi-clipboard-check"></i> Attendance
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Recent Evaluations */}
        <div className="card" style={{ marginBottom: 0 }}>
          <div className="card-header">
            <h3 className="card-title">
              <i className="bi bi-chat-square-quote-fill" style={{ color: '#f59e0b' }}></i>
              Latest Student Feedback
            </h3>
            <Link href="/feedback" className="btn btn-outline btn-sm">View All</Link>
          </div>
          <div className="table-responsive">
            <table className="table">
              <thead>
                <tr>
                  <th>Student</th>
                  <th>Subject Focus</th>
                  <th>Rating</th>
                  <th>Date</th>
                </tr>
              </thead>
              <tbody>
                {recentFeedbacks.map(fb => {
                  const student = students.find(s => s.id === fb.studentId);
                  return (
                    <tr key={fb.id}>
                      <td>
                        <Link href={`/students/${fb.studentId}`} style={{ fontWeight: 600 }}>
                          {student?.fullName || `Student #${fb.studentId}`}
                        </Link>
                      </td>
                      <td>{fb.subjectArea}</td>
                      <td>
                        <span className="rating-stars">
                          {'★'.repeat(fb.rating)}{'☆'.repeat(5 - fb.rating)}
                        </span>
                      </td>
                      <td style={{ color: '#64748b' }}>{fb.feedbackDate}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
