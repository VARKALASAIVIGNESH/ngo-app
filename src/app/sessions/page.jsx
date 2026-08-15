'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useApp } from '@/lib/store';

export default function SessionsListPage() {
  const { sessions, users, attendance, exportToCSV } = useApp();
  const [statusFilter, setStatusFilter] = useState('All');
  const [typeFilter, setTypeFilter] = useState('All');

  const filteredSessions = sessions.filter(s => {
    const matchesStatus = statusFilter === 'All' || s.status === statusFilter;
    const matchesType = typeFilter === 'All' || s.sessionType === typeFilter;
    return matchesStatus && matchesType;
  }).sort((a, b) => new Date(b.date) - new Date(a.date));

  const handleExportCSV = () => {
    const data = filteredSessions.map(s => {
      const teacher = users.find(u => u.id === s.teacherId);
      const sessionAtt = attendance.filter(a => a.sessionId === s.id);
      const present = sessionAtt.filter(a => a.status === 'Present').length;
      return {
        'ID': s.id,
        'Title': s.title,
        'Date': s.date,
        'Timing': `${s.startTime} - ${s.endTime}`,
        'Type': s.sessionType,
        'Location': s.location,
        'Instructor': teacher?.fullName || 'Staff',
        'Status': s.status,
        'Attendance Count': `${present} Present / ${sessionAtt.length} Logged`
      };
    });
    exportToCSV('sessions_and_workshops', data);
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <h1 style={{ fontSize: '1.45rem', fontWeight: 700 }}>Sessions & Interactive Attendance</h1>
          <p style={{ color: '#64748b', fontSize: '0.88rem' }}>
            Schedule education workshops, mark batch attendance, and track participation.
          </p>
        </div>
        <div style={{ display: 'flex', gap: '10px' }}>
          <button onClick={handleExportCSV} className="btn btn-outline btn-sm">
            <i className="bi bi-file-earmark-excel"></i> Export CSV
          </button>
          <Link href="/sessions/new" className="btn btn-primary btn-sm">
            <i className="bi bi-plus-lg"></i> Schedule Session
          </Link>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="card" style={{ padding: '16px 20px', marginBottom: '20px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '14px' }}>
          <div>
            <select
              className="form-select"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="All">All Statuses</option>
              <option value="Completed">Completed</option>
              <option value="Scheduled">Scheduled</option>
              <option value="Cancelled">Cancelled</option>
            </select>
          </div>
          <div>
            <select
              className="form-select"
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
            >
              <option value="All">All Session Types</option>
              <option value="Academic">Academic</option>
              <option value="Skill Workshop">Skill Workshop</option>
              <option value="Life Skills">Life Skills</option>
              <option value="Mentorship">Mentorship</option>
              <option value="Extracurricular">Extracurricular</option>
            </select>
          </div>
        </div>
      </div>

      {/* Sessions Table */}
      <div className="card">
        <div className="table-responsive">
          <table className="table">
            <thead>
              <tr>
                <th>Title & Topic</th>
                <th>Date & Time</th>
                <th>Category</th>
                <th>Instructor & Venue</th>
                <th>Attendance Record</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredSessions.length === 0 ? (
                <tr>
                  <td colSpan={7} style={{ textAlign: 'center', padding: '36px', color: '#94a3b8' }}>
                    No sessions match the selected filters.
                  </td>
                </tr>
              ) : (
                filteredSessions.map(sess => {
                  const teacher = users.find(u => u.id === sess.teacherId);
                  const sessAtt = attendance.filter(a => a.sessionId === sess.id);
                  const presentCount = sessAtt.filter(a => a.status === 'Present').length;

                  return (
                    <tr key={sess.id}>
                      <td>
                        <div style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{sess.title}</div>
                        <small style={{ color: '#64748b' }}>{sess.description}</small>
                      </td>
                      <td>
                        <div>{sess.date}</div>
                        <small style={{ color: '#64748b' }}>{sess.startTime} – {sess.endTime}</small>
                      </td>
                      <td>
                        <span className="badge badge-info">{sess.sessionType}</span>
                      </td>
                      <td>
                        <div>{teacher?.fullName || 'Staff Member'}</div>
                        <small style={{ color: '#64748b' }}>{sess.location}</small>
                      </td>
                      <td>
                        {sessAtt.length > 0 ? (
                          <div>
                            <span style={{ fontWeight: 600, color: '#10b981' }}>{presentCount}</span> / {sessAtt.length} marked
                          </div>
                        ) : (
                          <span style={{ color: '#94a3b8' }}>Not marked yet</span>
                        )}
                      </td>
                      <td>
                        <span className={`badge ${sess.status === 'Completed' ? 'badge-success' : 'badge-warning'}`}>
                          {sess.status}
                        </span>
                      </td>
                      <td>
                        <Link
                          href={`/sessions/${sess.id}/attendance`}
                          className={`btn btn-sm ${sess.status === 'Completed' ? 'btn-outline' : 'btn-primary'}`}
                        >
                          <i className="bi bi-clipboard-check"></i> {sess.status === 'Completed' ? 'Edit Sheet' : 'Mark Attendance'}
                        </Link>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
