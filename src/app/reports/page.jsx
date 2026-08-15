'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useApp } from '@/lib/store';

export default function ReportsPage() {
  const { students, sessions, attendance, feedbacks, users, getStudentAttendanceStats, getStudentAverageRating, exportToCSV } = useApp();
  const [activeTab, setActiveTab] = useState('attendance'); // 'attendance' | 'students' | 'feedback'

  // Student Report Filter
  const [selectedStudentId, setSelectedStudentId] = useState(students[0]?.id || 1);
  const currentStudent = students.find(s => s.id === Number(selectedStudentId));

  // Attendance Report Filters
  const [attStudentFilter, setAttStudentFilter] = useState('All');
  const [attSessionFilter, setAttSessionFilter] = useState('All');

  const filteredAttendance = attendance.filter(a => {
    const matchesStudent = attStudentFilter === 'All' || a.studentId === Number(attStudentFilter);
    const matchesSession = attSessionFilter === 'All' || a.sessionId === Number(attSessionFilter);
    return matchesStudent && matchesSession;
  });

  // Export Handlers
  const handleExportAttendanceCSV = () => {
    const data = filteredAttendance.map(a => {
      const st = students.find(s => s.id === a.studentId);
      const sess = sessions.find(s => s.id === a.sessionId);
      return {
        'Date': sess?.date || '-',
        'Session Title': sess?.title || `Session #${a.sessionId}`,
        'Student ID': st?.studentId || '-',
        'Student Name': st?.fullName || '-',
        'Grade': st?.gradeClass || '-',
        'Attendance Status': a.status,
        'Remarks': a.remarks || '-'
      };
    });
    exportToCSV('attendance_audit_report', data);
  };

  const handleExportStudentsCSV = () => {
    const data = students.map(s => {
      const stats = getStudentAttendanceStats(s.id);
      const rating = getStudentAverageRating(s.id);
      return {
        'Student ID': s.studentId,
        'Full Name': s.fullName,
        'Grade': s.gradeClass,
        'School': s.schoolName,
        'Guardian': s.parentName,
        'Phone': s.phone,
        'Status': s.status,
        'Attendance %': `${stats.percentage}%`,
        'Present Count': stats.present,
        'Late Count': stats.late,
        'Absent Count': stats.absent,
        'Average Rating': rating
      };
    });
    exportToCSV('all_students_master_report', data);
  };

  const handleExportFeedbackCSV = () => {
    const data = feedbacks.map(f => {
      const st = students.find(s => s.id === f.studentId);
      const teacher = users.find(u => u.id === f.teacherId);
      return {
        'Date': f.feedbackDate,
        'Student ID': st?.studentId || '-',
        'Student Name': st?.fullName || '-',
        'Subject': f.subjectArea,
        'Rating (1-5)': f.rating,
        'Attendance Observation': f.attendanceObs,
        'Academic Progress': f.academicProgress,
        'Behaviour': f.behaviour,
        'Strengths': f.strengths,
        'Improvement Areas': f.improvementAreas,
        'Teacher Remarks': f.comments,
        'Evaluator': teacher?.fullName || 'Staff'
      };
    });
    exportToCSV('feedback_evaluation_history', data);
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <h1 style={{ fontSize: '1.45rem', fontWeight: 700 }}>Reports & Data Export Center</h1>
          <p style={{ color: '#64748b', fontSize: '0.88rem' }}>
            Generate printable audit reports and export structured CSV datasets.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '8px' }} className="no-print">
          <button onClick={() => window.print()} className="btn btn-outline btn-sm">
            <i className="bi bi-printer"></i> Print Report
          </button>
          {activeTab === 'attendance' && (
            <button onClick={handleExportAttendanceCSV} className="btn btn-primary btn-sm">
              <i className="bi bi-file-earmark-excel"></i> Export Attendance CSV
            </button>
          )}
          {activeTab === 'students' && (
            <button onClick={handleExportStudentsCSV} className="btn btn-primary btn-sm">
              <i className="bi bi-file-earmark-excel"></i> Export Students CSV
            </button>
          )}
          {activeTab === 'feedback' && (
            <button onClick={handleExportFeedbackCSV} className="btn btn-primary btn-sm">
              <i className="bi bi-file-earmark-excel"></i> Export Feedback CSV
            </button>
          )}
        </div>
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: '8px', marginBottom: '20px', borderBottom: '1px solid #e2e8f0', paddingBottom: '8px' }} className="no-print">
        <button
          onClick={() => setActiveTab('attendance')}
          className={`btn btn-sm ${activeTab === 'attendance' ? 'btn-primary' : 'btn-outline'}`}
        >
          <i className="bi bi-calendar-check"></i> Attendance Audit Report
        </button>
        <button
          onClick={() => setActiveTab('students')}
          className={`btn btn-sm ${activeTab === 'students' ? 'btn-primary' : 'btn-outline'}`}
        >
          <i className="bi bi-people"></i> Beneficiary Master Report
        </button>
        <button
          onClick={() => setActiveTab('feedback')}
          className={`btn btn-sm ${activeTab === 'feedback' ? 'btn-primary' : 'btn-outline'}`}
        >
          <i className="bi bi-star"></i> Feedback & Evaluations Report
        </button>
      </div>

      {/* TAB 1: Attendance Report */}
      {activeTab === 'attendance' && (
        <div>
          <div className="card no-print" style={{ padding: '16px 20px', marginBottom: '20px' }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '14px' }}>
              <div>
                <label className="form-label">Filter by Beneficiary Student:</label>
                <select
                  className="form-select"
                  value={attStudentFilter}
                  onChange={(e) => setAttStudentFilter(e.target.value)}
                >
                  <option value="All">All Students</option>
                  {students.map(s => (
                    <option key={s.id} value={s.id}>{s.fullName} ({s.studentId})</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="form-label">Filter by Workshop Session:</label>
                <select
                  className="form-select"
                  value={attSessionFilter}
                  onChange={(e) => setAttSessionFilter(e.target.value)}
                >
                  <option value="All">All Sessions</option>
                  {sessions.map(sess => (
                    <option key={sess.id} value={sess.id}>{sess.title} ({sess.date})</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          <div className="card">
            <div className="card-header">
              <h3 className="card-title">Attendance Audit Trail</h3>
              <span className="badge badge-info">{filteredAttendance.length} Records Found</span>
            </div>

            <div className="table-responsive">
              <table className="table">
                <thead>
                  <tr>
                    <th>Date</th>
                    <th>Workshop Title</th>
                    <th>Student ID</th>
                    <th>Beneficiary Name</th>
                    <th>Grade</th>
                    <th>Status</th>
                    <th>Remarks</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredAttendance.length === 0 ? (
                    <tr><td colSpan={7} style={{ textAlign: 'center', padding: '30px', color: '#94a3b8' }}>No attendance records match criteria.</td></tr>
                  ) : (
                    filteredAttendance.map(a => {
                      const st = students.find(s => s.id === a.studentId);
                      const sess = sessions.find(s => s.id === a.sessionId);
                      let badge = 'badge-success';
                      if (a.status === 'Late') badge = 'badge-warning';
                      if (a.status === 'Absent') badge = 'badge-danger';

                      return (
                        <tr key={a.id}>
                          <td>{sess?.date || '-'}</td>
                          <td style={{ fontWeight: 600 }}>{sess?.title || `Session #${a.sessionId}`}</td>
                          <td><code>{st?.studentId}</code></td>
                          <td>{st?.fullName}</td>
                          <td>{st?.gradeClass}</td>
                          <td><span className={`badge ${badge}`}>{a.status}</span></td>
                          <td style={{ color: '#64748b' }}>{a.remarks || '-'}</td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: Students Master Report */}
      {activeTab === 'students' && (
        <div className="card">
          <div className="card-header">
            <h3 className="card-title">Beneficiaries Master Directory</h3>
            <span className="badge badge-success">{students.length} Total Enrolled</span>
          </div>

          <div className="table-responsive">
            <table className="table">
              <thead>
                <tr>
                  <th>Student ID</th>
                  <th>Full Name</th>
                  <th>Grade</th>
                  <th>School</th>
                  <th>Guardian</th>
                  <th>Phone</th>
                  <th>Attendance %</th>
                  <th>Avg Rating</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {students.map(s => {
                  const stats = getStudentAttendanceStats(s.id);
                  const rating = getStudentAverageRating(s.id);
                  return (
                    <tr key={s.id}>
                      <td><code>{s.studentId}</code></td>
                      <td style={{ fontWeight: 600 }}>
                        <Link href={`/students/${s.id}`}>{s.fullName}</Link>
                      </td>
                      <td>{s.gradeClass}</td>
                      <td>{s.schoolName || '-'}</td>
                      <td>{s.parentName || '-'}</td>
                      <td>{s.phone || '-'}</td>
                      <td>
                        <span style={{ fontWeight: 600, color: stats.percentage >= 75 ? '#10b981' : '#f59e0b' }}>
                          {stats.percentage}%
                        </span>
                      </td>
                      <td>{rating > 0 ? `${rating} ★` : '-'}</td>
                      <td><span className="badge badge-success">{s.status}</span></td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 3: Feedback Report */}
      {activeTab === 'feedback' && (
        <div className="card">
          <div className="card-header">
            <h3 className="card-title">Weekly Feedback Evaluation Logs</h3>
            <span className="badge badge-info">{feedbacks.length} Evaluations Logged</span>
          </div>

          <div className="table-responsive">
            <table className="table">
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Student</th>
                  <th>Subject</th>
                  <th>Rating</th>
                  <th>Academic Progress</th>
                  <th>Behaviour</th>
                  <th>Teacher Comments</th>
                </tr>
              </thead>
              <tbody>
                {feedbacks.map(f => {
                  const st = students.find(s => s.id === f.studentId);
                  return (
                    <tr key={f.id}>
                      <td>{f.feedbackDate}</td>
                      <td style={{ fontWeight: 600 }}>{st?.fullName} ({st?.studentId})</td>
                      <td>{f.subjectArea}</td>
                      <td>
                        <span className="rating-stars">{'★'.repeat(f.rating)}</span>
                      </td>
                      <td><small>{f.academicProgress}</small></td>
                      <td><small>{f.behaviour}</small></td>
                      <td><small>{f.comments}</small></td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
