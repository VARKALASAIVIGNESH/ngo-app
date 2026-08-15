'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useApp } from '@/lib/store';

export default function StudentsPage() {
  const { students, getStudentAttendanceStats, getStudentAverageRating, exportToCSV } = useApp();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [gradeFilter, setGradeFilter] = useState('All');

  const grades = Array.from(new Set(students.map(s => s.gradeClass).filter(Boolean))).sort();

  const filteredStudents = students.filter(s => {
    const matchesSearch =
      s.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.studentId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (s.schoolName && s.schoolName.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesStatus = statusFilter === 'All' || s.status === statusFilter;
    const matchesGrade = gradeFilter === 'All' || s.gradeClass === gradeFilter;

    return matchesSearch && matchesStatus && matchesGrade;
  });

  const handleExportCSV = () => {
    const exportData = filteredStudents.map(s => {
      const stats = getStudentAttendanceStats(s.id);
      const rating = getStudentAverageRating(s.id);
      return {
        'Student ID': s.studentId,
        'Full Name': s.fullName,
        'Grade / Class': s.gradeClass,
        'School': s.schoolName,
        'Parent / Guardian': s.parentName,
        'Phone': s.phone,
        'Status': s.status,
        'Joining Date': s.joiningDate,
        'Attendance %': `${stats.percentage}%`,
        'Avg Rating': rating
      };
    });
    exportToCSV('students_directory', exportData);
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <h1 style={{ fontSize: '1.45rem', fontWeight: 700 }}>Student Beneficiaries</h1>
          <p style={{ color: '#64748b', fontSize: '0.88rem' }}>
            Manage registered students, track attendance, and inspect learning progress.
          </p>
        </div>
        <div style={{ display: 'flex', gap: '10px' }}>
          <button onClick={handleExportCSV} className="btn btn-outline btn-sm">
            <i className="bi bi-file-earmark-excel"></i> Export CSV
          </button>
          <Link href="/students/new" className="btn btn-primary btn-sm">
            <i className="bi bi-person-plus-fill"></i> Register Student
          </Link>
        </div>
      </div>

      {/* Filters Bar */}
      <div className="card" style={{ padding: '16px 20px', marginBottom: '20px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '14px' }}>
          <div>
            <input
              type="text"
              className="form-control"
              placeholder="Search by name, ID or school..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div>
            <select
              className="form-select"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="All">All Statuses</option>
              <option value="Active">Active</option>
              <option value="On Leave">On Leave</option>
              <option value="Graduated">Graduated</option>
              <option value="Inactive">Inactive</option>
            </select>
          </div>
          <div>
            <select
              className="form-select"
              value={gradeFilter}
              onChange={(e) => setGradeFilter(e.target.value)}
            >
              <option value="All">All Grades / Classes</option>
              {grades.map(g => (
                <option key={g} value={g}>{g}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Students Table */}
      <div className="card">
        <div className="table-responsive">
          <table className="table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Student Name</th>
                <th>Grade / School</th>
                <th>Guardian Contact</th>
                <th>Attendance</th>
                <th>Avg Rating</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredStudents.length === 0 ? (
                <tr>
                  <td colSpan={8} style={{ textAlign: 'center', padding: '36px', color: '#94a3b8' }}>
                    <i className="bi bi-inbox" style={{ fontSize: '2rem', display: 'block', marginBottom: '8px' }}></i>
                    No student beneficiaries match the selected filters.
                  </td>
                </tr>
              ) : (
                filteredStudents.map(student => {
                  const stats = getStudentAttendanceStats(student.id);
                  const avgRating = getStudentAverageRating(student.id);

                  let statusBadge = 'badge-success';
                  if (student.status === 'On Leave') statusBadge = 'badge-warning';
                  if (student.status === 'Graduated') statusBadge = 'badge-info';
                  if (student.status === 'Inactive') statusBadge = 'badge-danger';

                  return (
                    <tr key={student.id}>
                      <td>
                        <code style={{ color: '#2563eb', fontWeight: 600 }}>{student.studentId}</code>
                      </td>
                      <td>
                        <Link href={`/students/${student.id}`} style={{ fontWeight: 600, color: 'var(--text-primary)' }}>
                          {student.fullName}
                        </Link>
                        <div style={{ fontSize: '0.78rem', color: '#64748b' }}>
                          Joined: {student.joiningDate}
                        </div>
                      </td>
                      <td>
                        <div>{student.gradeClass || 'N/A'}</div>
                        <small style={{ color: '#64748b' }}>{student.schoolName || '-'}</small>
                      </td>
                      <td>
                        <div>{student.parentName || '-'}</div>
                        <small style={{ color: '#64748b' }}>{student.phone || '-'}</small>
                      </td>
                      <td>
                        <div style={{ fontWeight: 600, color: stats.percentage >= 75 ? '#10b981' : '#f59e0b' }}>
                          {stats.percentage}%
                        </div>
                        <small style={{ color: '#64748b' }}>{stats.present}P / {stats.late}L / {stats.absent}A</small>
                      </td>
                      <td>
                        {avgRating > 0 ? (
                          <span style={{ fontWeight: 600, color: '#f59e0b' }}>
                            {avgRating} ★
                          </span>
                        ) : (
                          <span style={{ color: '#94a3b8' }}>-</span>
                        )}
                      </td>
                      <td>
                        <span className={`badge ${statusBadge}`}>{student.status}</span>
                      </td>
                      <td>
                        <div style={{ display: 'flex', gap: '6px' }}>
                          <Link href={`/students/${student.id}`} className="btn btn-outline btn-sm" title="View Profile">
                            <i className="bi bi-eye"></i>
                          </Link>
                          <Link href={`/students/${student.id}/edit`} className="btn btn-outline btn-sm" title="Edit">
                            <i className="bi bi-pencil"></i>
                          </Link>
                        </div>
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
