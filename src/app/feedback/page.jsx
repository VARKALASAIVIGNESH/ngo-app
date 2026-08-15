'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useApp } from '@/lib/store';

export default function FeedbackListPage() {
  const { feedbacks, students, users, exportToCSV } = useApp();
  const [selectedStudent, setSelectedStudent] = useState('All');
  const [selectedRating, setSelectedRating] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');

  const filteredFeedbacks = feedbacks.filter(fb => {
    const student = students.find(s => s.id === fb.studentId);
    const matchesStudent = selectedStudent === 'All' || fb.studentId === Number(selectedStudent);
    const matchesRating = selectedRating === 'All' || fb.rating === Number(selectedRating);
    const matchesSearch =
      (student && student.fullName.toLowerCase().includes(searchTerm.toLowerCase())) ||
      fb.subjectArea.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (fb.comments && fb.comments.toLowerCase().includes(searchTerm.toLowerCase()));

    return matchesStudent && matchesRating && matchesSearch;
  }).sort((a, b) => new Date(b.feedbackDate) - new Date(a.feedbackDate));

  const handleExportCSV = () => {
    const data = filteredFeedbacks.map(fb => {
      const student = students.find(s => s.id === fb.studentId);
      const teacher = users.find(u => u.id === fb.teacherId);
      return {
        'Date': fb.feedbackDate,
        'Student ID': student?.studentId || '-',
        'Student Name': student?.fullName || '-',
        'Subject Focus': fb.subjectArea,
        'Rating': fb.rating,
        'Attendance Observation': fb.attendanceObs,
        'Academic Progress': fb.academicProgress,
        'Behaviour': fb.behaviour,
        'Strengths': fb.strengths,
        'Improvement Areas': fb.improvementAreas,
        'Teacher Remarks': fb.comments,
        'Evaluator': teacher?.fullName || 'Staff'
      };
    });
    exportToCSV('weekly_feedback_history', data);
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <h1 style={{ fontSize: '1.45rem', fontWeight: 700 }}>Weekly Student Feedback & Evaluation</h1>
          <p style={{ color: '#64748b', fontSize: '0.88rem' }}>
            Structured progress notes, 1–5 star ratings, and teacher observations.
          </p>
        </div>
        <div style={{ display: 'flex', gap: '10px' }}>
          <button onClick={handleExportCSV} className="btn btn-outline btn-sm">
            <i className="bi bi-file-earmark-excel"></i> Export CSV
          </button>
          <Link href="/feedback/new" className="btn btn-primary btn-sm">
            <i className="bi bi-plus-lg"></i> Record Evaluation
          </Link>
        </div>
      </div>

      {/* Filters */}
      <div className="card" style={{ padding: '16px 20px', marginBottom: '20px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '14px' }}>
          <div>
            <input
              type="text"
              className="form-control"
              placeholder="Search by student name or subject..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div>
            <select
              className="form-select"
              value={selectedStudent}
              onChange={(e) => setSelectedStudent(e.target.value)}
            >
              <option value="All">All Students</option>
              {students.map(s => (
                <option key={s.id} value={s.id}>{s.fullName} ({s.studentId})</option>
              ))}
            </select>
          </div>
          <div>
            <select
              className="form-select"
              value={selectedRating}
              onChange={(e) => setSelectedRating(e.target.value)}
            >
              <option value="All">All Star Ratings</option>
              <option value="5">5 Stars (Outstanding)</option>
              <option value="4">4 Stars (Good)</option>
              <option value="3">3 Stars (Satisfactory)</option>
              <option value="2">2 Stars (Needs Attention)</option>
              <option value="1">1 Star (Urgent Intervention)</option>
            </select>
          </div>
        </div>
      </div>

      {/* Feedbacks Grid List */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        {filteredFeedbacks.length === 0 ? (
          <div className="card" style={{ textAlign: 'center', padding: '48px', color: '#94a3b8' }}>
            <i className="bi bi-chat-square-text" style={{ fontSize: '2.5rem', display: 'block', marginBottom: '8px' }}></i>
            No evaluations match the search criteria.
          </div>
        ) : (
          filteredFeedbacks.map(fb => {
            const student = students.find(s => s.id === fb.studentId);
            const teacher = users.find(u => u.id === fb.teacherId);

            return (
              <div key={fb.id} className="card" style={{ marginBottom: 0, padding: '20px 24px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '12px', marginBottom: '14px', borderBottom: '1px solid #f1f5f9', paddingBottom: '12px' }}>
                  <div>
                    <Link href={`/students/${fb.studentId}`} style={{ fontSize: '1.15rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                      {student?.fullName || `Student #${fb.studentId}`}
                    </Link>
                    <span style={{ fontSize: '0.85rem', color: '#64748b', marginLeft: '8px' }}>
                      ({student?.studentId})
                    </span>
                    <div style={{ fontSize: '0.9rem', color: '#2563eb', fontWeight: 600, marginTop: '2px' }}>
                      {fb.subjectArea}
                    </div>
                  </div>

                  <div style={{ textAlign: 'right' }}>
                    <div className="rating-stars" style={{ fontSize: '1.25rem' }}>
                      {'★'.repeat(fb.rating)}{'☆'.repeat(5 - fb.rating)}
                    </div>
                    <div style={{ fontSize: '0.8rem', color: '#64748b', marginTop: '2px' }}>
                      {fb.feedbackDate} • By {teacher?.fullName || 'Educator'}
                    </div>
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '14px', fontSize: '0.88rem' }}>
                  {fb.attendanceObs && (
                    <div>
                      <strong style={{ color: '#64748b' }}>Attendance:</strong>
                      <span className="badge badge-info" style={{ marginLeft: '8px' }}>{fb.attendanceObs}</span>
                    </div>
                  )}
                  {fb.academicProgress && (
                    <div style={{ gridColumn: 'span 2' }}>
                      <strong style={{ color: '#475569' }}>Academic Progress:</strong>
                      <p style={{ marginTop: '2px', color: '#0f172a' }}>{fb.academicProgress}</p>
                    </div>
                  )}
                  {fb.behaviour && (
                    <div>
                      <strong style={{ color: '#475569' }}>Behaviour & Social:</strong>
                      <p style={{ marginTop: '2px', color: '#0f172a' }}>{fb.behaviour}</p>
                    </div>
                  )}
                  {fb.strengths && (
                    <div>
                      <strong style={{ color: '#475569' }}>Key Strengths:</strong>
                      <p style={{ marginTop: '2px', color: '#0f172a' }}>{fb.strengths}</p>
                    </div>
                  )}
                  {fb.comments && (
                    <div style={{ gridColumn: 'span 2' }}>
                      <strong style={{ color: '#475569' }}>Teacher Remarks:</strong>
                      <p style={{ marginTop: '2px', color: '#0f172a' }}>{fb.comments}</p>
                    </div>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
