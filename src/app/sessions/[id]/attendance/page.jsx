'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { useApp } from '@/lib/store';

export default function SessionAttendancePage() {
  const params = useParams();
  const router = useRouter();
  const sessionId = Number(params.id);
  const { sessions, students, attendance, saveBatchAttendance, currentUser } = useApp();

  const session = sessions.find(s => s.id === sessionId);
  const activeStudents = students.filter(s => s.status === 'Active');

  const [attMap, setAttMap] = useState({});

  useEffect(() => {
    if (session && activeStudents.length > 0) {
      const initialMap = {};
      activeStudents.forEach(st => {
        const existing = attendance.find(a => a.sessionId === sessionId && a.studentId === st.id);
        initialMap[st.id] = {
          status: existing ? existing.status : 'Present',
          remarks: existing ? existing.remarks || '' : ''
        };
      });
      setAttMap(initialMap);
    }
  }, [session, attendance, sessionId]);

  if (!session) {
    return <div className="card">Session not found.</div>;
  }

  // Quick Batch Helpers
  const handleMarkAll = (status) => {
    setAttMap(prev => {
      const updated = { ...prev };
      Object.keys(updated).forEach(stId => {
        updated[stId] = { ...updated[stId], status };
      });
      return updated;
    });
  };

  const handleStatusChange = (studentId, status) => {
    setAttMap(prev => ({
      ...prev,
      [studentId]: { ...prev[studentId], status }
    }));
  };

  const handleRemarksChange = (studentId, remarks) => {
    setAttMap(prev => ({
      ...prev,
      [studentId]: { ...prev[studentId], remarks }
    }));
  };

  const handleSave = (e) => {
    e.preventDefault();
    saveBatchAttendance(sessionId, attMap, currentUser?.id);
    alert('Attendance successfully recorded and saved!');
    router.push('/sessions');
  };

  // Compute live counters
  const studentIds = Object.keys(attMap);
  const totalCount = studentIds.length;
  const presentCount = studentIds.filter(id => attMap[id]?.status === 'Present').length;
  const lateCount = studentIds.filter(id => attMap[id]?.status === 'Late').length;
  const absentCount = studentIds.filter(id => attMap[id]?.status === 'Absent').length;

  return (
    <div>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', flexWrap: 'wrap', gap: '12px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <Link href="/sessions" className="btn btn-outline btn-sm">
            <i className="bi bi-arrow-left"></i> Sessions
          </Link>
          <div>
            <h1 style={{ fontSize: '1.45rem', fontWeight: 700 }}>Interactive Attendance Sheet</h1>
            <div style={{ color: '#64748b', fontSize: '0.88rem' }}>
              {session.title} • {session.date} ({session.startTime} - {session.endTime}) • {session.location}
            </div>
          </div>
        </div>

        <button onClick={handleSave} className="btn btn-primary">
          <i className="bi bi-check-all"></i> Save Attendance & Complete
        </button>
      </div>

      {/* Quick Action Buttons & Live Counters */}
      <div className="card" style={{ padding: '16px 20px', marginBottom: '20px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
          {/* Quick Mark All Buttons */}
          <div style={{ display: 'flex', gap: '8px', alignItems: 'center', flexWrap: 'wrap' }}>
            <span style={{ fontSize: '0.85rem', fontWeight: 600, color: '#475569', marginRight: '4px' }}>Quick Select:</span>
            <button
              type="button"
              onClick={() => handleMarkAll('Present')}
              className="btn btn-success btn-sm"
            >
              <i className="bi bi-check-circle"></i> Mark All Present
            </button>
            <button
              type="button"
              onClick={() => handleMarkAll('Late')}
              className="btn btn-warning btn-sm"
              style={{ background: '#f59e0b', color: 'white', borderColor: '#f59e0b' }}
            >
              <i className="bi bi-clock"></i> Mark All Late
            </button>
            <button
              type="button"
              onClick={() => handleMarkAll('Absent')}
              className="btn btn-danger btn-sm"
            >
              <i className="bi bi-x-circle"></i> Mark All Absent
            </button>
          </div>

          {/* Dynamic Live Counters */}
          <div style={{ display: 'flex', gap: '12px', alignItems: 'center', flexWrap: 'wrap' }}>
            <span className="badge badge-success" style={{ padding: '6px 12px', fontSize: '0.85rem' }}>
              Present: {presentCount}
            </span>
            <span className="badge badge-warning" style={{ padding: '6px 12px', fontSize: '0.85rem' }}>
              Late: {lateCount}
            </span>
            <span className="badge badge-danger" style={{ padding: '6px 12px', fontSize: '0.85rem' }}>
              Absent: {absentCount}
            </span>
            <span className="badge badge-info" style={{ padding: '6px 12px', fontSize: '0.85rem' }}>
              Total: {totalCount}
            </span>
          </div>
        </div>
      </div>

      {/* Attendance Sheet Table */}
      <form onSubmit={handleSave}>
        <div className="card">
          <div className="table-responsive">
            <table className="table">
              <thead>
                <tr>
                  <th style={{ width: '15%' }}>Student ID</th>
                  <th style={{ width: '25%' }}>Beneficiary Name</th>
                  <th style={{ width: '15%' }}>Grade / Class</th>
                  <th style={{ width: '25%' }}>Status (Click to toggle)</th>
                  <th style={{ width: '20%' }}>Remarks / Notes</th>
                </tr>
              </thead>
              <tbody>
                {activeStudents.map(student => {
                  const currentStatus = attMap[student.id]?.status || 'Present';
                  const currentRemarks = attMap[student.id]?.remarks || '';

                  return (
                    <tr key={student.id}>
                      <td>
                        <code style={{ color: '#2563eb', fontWeight: 600 }}>{student.studentId}</code>
                      </td>
                      <td>
                        <Link href={`/students/${student.id}`} style={{ fontWeight: 600, color: 'var(--text-primary)' }}>
                          {student.fullName}
                        </Link>
                      </td>
                      <td>{student.gradeClass}</td>
                      <td>
                        <div style={{ display: 'flex', gap: '6px' }}>
                          <button
                            type="button"
                            onClick={() => handleStatusChange(student.id, 'Present')}
                            className={`btn btn-sm ${currentStatus === 'Present' ? 'btn-success' : 'btn-outline'}`}
                            style={{ padding: '4px 10px' }}
                          >
                            <i className="bi bi-check"></i> Present
                          </button>
                          <button
                            type="button"
                            onClick={() => handleStatusChange(student.id, 'Late')}
                            className={`btn btn-sm ${currentStatus === 'Late' ? 'btn-warning' : 'btn-outline'}`}
                            style={{ padding: '4px 10px', background: currentStatus === 'Late' ? '#f59e0b' : '', color: currentStatus === 'Late' ? 'white' : '' }}
                          >
                            <i className="bi bi-clock"></i> Late
                          </button>
                          <button
                            type="button"
                            onClick={() => handleStatusChange(student.id, 'Absent')}
                            className={`btn btn-sm ${currentStatus === 'Absent' ? 'btn-danger' : 'btn-outline'}`}
                            style={{ padding: '4px 10px' }}
                          >
                            <i className="bi bi-x"></i> Absent
                          </button>
                        </div>
                      </td>
                      <td>
                        <input
                          type="text"
                          className="form-control"
                          placeholder="e.g. Bus delay, Sick"
                          value={currentRemarks}
                          onChange={(e) => handleRemarksChange(student.id, e.target.value)}
                          style={{ padding: '4px 8px', fontSize: '0.85rem' }}
                        />
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '20px', paddingTop: '16px', borderTop: '1px solid #e2e8f0' }}>
            <Link href="/sessions" className="btn btn-outline">Cancel</Link>
            <button type="submit" className="btn btn-primary">
              <i className="bi bi-check2-circle"></i> Save Attendance & Complete Session
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
