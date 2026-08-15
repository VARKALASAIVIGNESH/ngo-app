'use client';

import React from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { useApp } from '@/lib/store';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';
import { Line } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

export default function StudentDetailPage() {
  const params = useParams();
  const router = useRouter();
  const studentId = Number(params.id);
  const { students, sessions, feedbacks, getStudentAttendanceStats, getStudentAverageRating, deleteStudent, exportToCSV } = useApp();

  const student = students.find(s => s.id === studentId);

  if (!student) {
    return (
      <div className="card" style={{ textAlign: 'center', padding: '48px' }}>
        <h2>Student Not Found</h2>
        <p style={{ color: '#64748b', marginTop: '8px' }}>The requested student record does not exist or has been removed.</p>
        <Link href="/students" className="btn btn-primary" style={{ marginTop: '16px' }}>
          Back to Students Directory
        </Link>
      </div>
    );
  }

  const attStats = getStudentAttendanceStats(student.id);
  const avgRating = getStudentAverageRating(student.id);
  const studentFeedbacks = feedbacks.filter(f => f.studentId === student.id).sort((a, b) => new Date(a.feedbackDate) - new Date(b.feedbackDate));

  // Progress Trend Chart data
  const chartLabels = studentFeedbacks.map(f => f.feedbackDate);
  const chartRatings = studentFeedbacks.map(f => f.rating);

  const trendChartData = {
    labels: chartLabels.length > 0 ? chartLabels : ['No evaluations'],
    datasets: [
      {
        label: 'Weekly Rating (1-5 Stars)',
        data: chartRatings.length > 0 ? chartRatings : [0],
        borderColor: '#2563eb',
        backgroundColor: 'rgba(37, 99, 235, 0.1)',
        fill: true,
        tension: 0.3,
        pointBackgroundColor: '#2563eb',
        pointRadius: 5
      }
    ]
  };

  const handleDelete = () => {
    if (confirm(`Are you sure you want to delete ${student.fullName}? This will also remove their attendance and feedback logs.`)) {
      deleteStudent(student.id);
      router.push('/students');
    }
  };

  const handleExportCSV = () => {
    const data = studentFeedbacks.map(f => ({
      'Date': f.feedbackDate,
      'Subject': f.subjectArea,
      'Rating': f.rating,
      'Attendance Obs': f.attendanceObs,
      'Academic Progress': f.academicProgress,
      'Behaviour': f.behaviour,
      'Teacher Comments': f.comments
    }));
    exportToCSV(`${student.studentId}_performance_report`, data);
  };

  return (
    <div>
      {/* Top Action Bar */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', flexWrap: 'wrap', gap: '12px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <Link href="/students" className="btn btn-outline btn-sm no-print">
            <i className="bi bi-arrow-left"></i> Directory
          </Link>
          <h1 style={{ fontSize: '1.45rem', fontWeight: 700 }}>
            {student.fullName}
            <span style={{ fontSize: '0.95rem', fontWeight: 600, color: '#2563eb', marginLeft: '10px' }}>
              ({student.studentId})
            </span>
          </h1>
        </div>

        <div style={{ display: 'flex', gap: '8px' }} className="no-print">
          <button onClick={() => window.print()} className="btn btn-outline btn-sm">
            <i className="bi bi-printer"></i> Print Dossier
          </button>
          <button onClick={handleExportCSV} className="btn btn-outline btn-sm">
            <i className="bi bi-file-earmark-excel"></i> Export CSV
          </button>
          <Link href={`/feedback/new?studentId=${student.id}`} className="btn btn-success btn-sm">
            <i className="bi bi-star-fill"></i> Add Feedback
          </Link>
          <Link href={`/students/${student.id}/edit`} className="btn btn-primary btn-sm">
            <i className="bi bi-pencil"></i> Edit
          </Link>
          <button onClick={handleDelete} className="btn btn-danger btn-sm">
            <i className="bi bi-trash"></i>
          </button>
        </div>
      </div>

      {/* Profile Overview Card */}
      <div className="card" style={{ marginBottom: '24px' }}>
        <div style={{ display: 'flex', gap: '24px', flexWrap: 'wrap', alignItems: 'center' }}>
          <div
            style={{
              width: '72px',
              height: '72px',
              borderRadius: '50%',
              background: 'linear-gradient(135deg, #3b82f6, #6366f1)',
              color: 'white',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '1.8rem',
              fontWeight: 700,
              boxShadow: '0 8px 16px rgba(59, 130, 246, 0.3)'
            }}
          >
            {student.fullName ? student.fullName[0] : 'S'}
          </div>

          <div style={{ flex: 1, minWidth: '240px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
              <h2 style={{ fontSize: '1.25rem', fontWeight: 700 }}>{student.fullName}</h2>
              <span className="badge badge-success">{student.status}</span>
              <span className="badge badge-info">{student.gradeClass}</span>
            </div>
            <p style={{ color: '#64748b', fontSize: '0.88rem', marginTop: '4px' }}>
              {student.schoolName || 'Enrolled in Community School'} • Joined {student.joiningDate}
            </p>
          </div>

          {/* Quick Metrics */}
          <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap' }}>
            <div style={{ background: '#f8fafc', padding: '12px 18px', borderRadius: '10px', textAlign: 'center', border: '1px solid #e2e8f0' }}>
              <div style={{ fontSize: '1.35rem', fontWeight: 700, color: attStats.percentage >= 75 ? '#10b981' : '#f59e0b' }}>
                {attStats.percentage}%
              </div>
              <div style={{ fontSize: '0.78rem', color: '#64748b', fontWeight: 600 }}>Attendance</div>
            </div>

            <div style={{ background: '#f8fafc', padding: '12px 18px', borderRadius: '10px', textAlign: 'center', border: '1px solid #e2e8f0' }}>
              <div style={{ fontSize: '1.35rem', fontWeight: 700, color: '#f59e0b' }}>
                {avgRating > 0 ? `${avgRating} ★` : 'N/A'}
              </div>
              <div style={{ fontSize: '0.78rem', color: '#64748b', fontWeight: 600 }}>Avg Rating</div>
            </div>

            <div style={{ background: '#f8fafc', padding: '12px 18px', borderRadius: '10px', textAlign: 'center', border: '1px solid #e2e8f0' }}>
              <div style={{ fontSize: '1.35rem', fontWeight: 700, color: '#2563eb' }}>
                {studentFeedbacks.length}
              </div>
              <div style={{ fontSize: '0.78rem', color: '#64748b', fontWeight: 600 }}>Reviews</div>
            </div>
          </div>
        </div>

        {/* Detailed Info Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px', marginTop: '24px', paddingTop: '20px', borderTop: '1px solid #e2e8f0' }}>
          <div>
            <span style={{ fontSize: '0.78rem', color: '#64748b', fontWeight: 600, textTransform: 'uppercase' }}>Parent / Guardian</span>
            <div style={{ fontWeight: 600, marginTop: '2px' }}>{student.parentName || '-'}</div>
          </div>
          <div>
            <span style={{ fontSize: '0.78rem', color: '#64748b', fontWeight: 600, textTransform: 'uppercase' }}>Contact Phone</span>
            <div style={{ fontWeight: 600, marginTop: '2px' }}>{student.phone || '-'}</div>
          </div>
          <div>
            <span style={{ fontSize: '0.78rem', color: '#64748b', fontWeight: 600, textTransform: 'uppercase' }}>Date of Birth</span>
            <div style={{ fontWeight: 600, marginTop: '2px' }}>{student.dob || '-'}</div>
          </div>
          <div>
            <span style={{ fontSize: '0.78rem', color: '#64748b', fontWeight: 600, textTransform: 'uppercase' }}>Gender</span>
            <div style={{ fontWeight: 600, marginTop: '2px' }}>{student.gender || '-'}</div>
          </div>
          <div style={{ gridColumn: 'span 2' }}>
            <span style={{ fontSize: '0.78rem', color: '#64748b', fontWeight: 600, textTransform: 'uppercase' }}>Address</span>
            <div style={{ fontWeight: 500, marginTop: '2px', color: '#334155' }}>{student.address || '-'}</div>
          </div>
          {student.notes && (
            <div style={{ gridColumn: 'span 2' }}>
              <span style={{ fontSize: '0.78rem', color: '#64748b', fontWeight: 600, textTransform: 'uppercase' }}>Background & Special Notes</span>
              <div style={{ marginTop: '4px', background: '#fffbeb', border: '1px solid #fef3c7', padding: '10px 14px', borderRadius: '8px', fontSize: '0.88rem', color: '#92400e' }}>
                {student.notes}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Progress Chart & Attendance Breakdown */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '24px', marginBottom: '24px' }}>
        <div className="card" style={{ marginBottom: 0 }}>
          <div className="card-header">
            <h3 className="card-title">
              <i className="bi bi-graph-up-arrow" style={{ color: '#2563eb' }}></i>
              Academic & Skill Progress Timeline
            </h3>
          </div>
          <div style={{ height: '220px' }}>
            <Line
              data={trendChartData}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                scales: { y: { min: 0, max: 5, ticks: { stepSize: 1 } } }
              }}
            />
          </div>
        </div>

        <div className="card" style={{ marginBottom: 0 }}>
          <div className="card-header">
            <h3 className="card-title">
              <i className="bi bi-calendar3" style={{ color: '#10b981' }}></i>
              Attendance History ({attStats.records.length} Sessions)
            </h3>
          </div>
          <div className="table-responsive" style={{ maxHeight: '220px', overflowY: 'auto' }}>
            <table className="table">
              <thead>
                <tr>
                  <th>Session</th>
                  <th>Date</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {attStats.records.length === 0 ? (
                  <tr><td colSpan={3} style={{ textAlign: 'center', color: '#94a3b8' }}>No attendance recorded yet.</td></tr>
                ) : (
                  attStats.records.map(r => {
                    const sess = sessions.find(s => s.id === r.sessionId);
                    let badgeClass = 'badge-success';
                    if (r.status === 'Late') badgeClass = 'badge-warning';
                    if (r.status === 'Absent') badgeClass = 'badge-danger';
                    return (
                      <tr key={r.id}>
                        <td>{sess?.title || `Session #${r.sessionId}`}</td>
                        <td>{sess?.date || '-'}</td>
                        <td><span className={`badge ${badgeClass}`}>{r.status}</span></td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Weekly Evaluations History */}
      <div className="card">
        <div className="card-header">
          <h3 className="card-title">
            <i className="bi bi-chat-square-quote-fill" style={{ color: '#f59e0b' }}></i>
            Weekly Feedback & Evaluation Logs
          </h3>
          <Link href={`/feedback/new?studentId=${student.id}`} className="btn btn-primary btn-sm no-print">
            <i className="bi bi-plus-lg"></i> Add New Evaluation
          </Link>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {studentFeedbacks.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '36px', color: '#94a3b8' }}>
              No weekly evaluations submitted for this student yet.
            </div>
          ) : (
            studentFeedbacks.map(fb => (
              <div key={fb.id} style={{ border: '1px solid #e2e8f0', borderRadius: '10px', padding: '16px 20px', background: '#fafbfc' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px', flexWrap: 'wrap', gap: '8px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <span style={{ fontWeight: 700, fontSize: '1rem', color: '#1e293b' }}>{fb.subjectArea}</span>
                    <span className="rating-stars" style={{ fontSize: '1.05rem' }}>
                      {'★'.repeat(fb.rating)}{'☆'.repeat(5 - fb.rating)}
                    </span>
                  </div>
                  <div style={{ fontSize: '0.85rem', color: '#64748b' }}>
                    <i className="bi bi-calendar-event me-1"></i> {fb.feedbackDate}
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '12px', fontSize: '0.88rem' }}>
                  {fb.academicProgress && (
                    <div>
                      <strong style={{ color: '#475569' }}>Academic Progress:</strong>
                      <p style={{ marginTop: '2px', color: '#1e293b' }}>{fb.academicProgress}</p>
                    </div>
                  )}
                  {fb.behaviour && (
                    <div>
                      <strong style={{ color: '#475569' }}>Behaviour & Discipline:</strong>
                      <p style={{ marginTop: '2px', color: '#1e293b' }}>{fb.behaviour}</p>
                    </div>
                  )}
                  {fb.strengths && (
                    <div>
                      <strong style={{ color: '#475569' }}>Key Strengths:</strong>
                      <p style={{ marginTop: '2px', color: '#1e293b' }}>{fb.strengths}</p>
                    </div>
                  )}
                  {fb.comments && (
                    <div>
                      <strong style={{ color: '#475569' }}>Teacher Remarks:</strong>
                      <p style={{ marginTop: '2px', color: '#1e293b' }}>{fb.comments}</p>
                    </div>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
