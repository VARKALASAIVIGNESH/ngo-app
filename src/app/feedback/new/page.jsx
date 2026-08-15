'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { useApp } from '@/lib/store';

export default function NewFeedbackPage() {
  const { students, addFeedback, currentUser } = useApp();
  const router = useRouter();
  const searchParams = useSearchParams();
  const preselectedStudentId = searchParams.get('studentId');

  const [formData, setFormData] = useState({
    studentId: preselectedStudentId ? Number(preselectedStudentId) : (students[0]?.id || 1),
    teacherId: currentUser?.id || 1,
    feedbackDate: new Date().toISOString().split('T')[0],
    subjectArea: 'Mathematics & Numeracy',
    attendanceObs: 'Regular & Punctual',
    rating: 5,
    academicProgress: '',
    behaviour: '',
    participation: '',
    strengths: '',
    improvementAreas: '',
    comments: ''
  });

  useEffect(() => {
    if (preselectedStudentId) {
      setFormData(prev => ({ ...prev, studentId: Number(preselectedStudentId) }));
    }
  }, [preselectedStudentId]);

  const handleSubmit = (e) => {
    e.preventDefault();
    addFeedback(formData);
    router.push(`/students/${formData.studentId}`);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const ratingDescriptions = {
    1: '1 Star - Requires Urgent Intervention & 1-on-1 Remediation',
    2: '2 Stars - Needs Improvement & Guided Attention',
    3: '3 Stars - Satisfactory / Steady Progress',
    4: '4 Stars - Good Grasp & High Active Engagement',
    5: '5 Stars - Outstanding Mastery & Exemplary Leadership'
  };

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px' }}>
        <Link href="/feedback" className="btn btn-outline btn-sm">
          <i className="bi bi-arrow-left"></i> Back
        </Link>
        <h1 style={{ fontSize: '1.45rem', fontWeight: 700 }}>Record Weekly Student Evaluation</h1>
      </div>

      <div className="card">
        <form onSubmit={handleSubmit}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '16px' }}>
            <div className="form-group">
              <label className="form-label">Beneficiary Student *</label>
              <select
                name="studentId"
                className="form-select"
                value={formData.studentId}
                onChange={(e) => setFormData(prev => ({ ...prev, studentId: Number(e.target.value) }))}
                required
              >
                {students.map(s => (
                  <option key={s.id} value={s.id}>
                    {s.fullName} ({s.studentId} - {s.gradeClass})
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Evaluation Date *</label>
              <input
                type="date"
                name="feedbackDate"
                className="form-control"
                value={formData.feedbackDate}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Subject / Workshop Focus *</label>
              <input
                type="text"
                name="subjectArea"
                className="form-control"
                placeholder="e.g. Mathematics, Science Lab, English Writing"
                value={formData.subjectArea}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Attendance Observation</label>
              <select name="attendanceObs" className="form-select" value={formData.attendanceObs} onChange={handleChange}>
                <option value="Regular & Punctual">Regular & Punctual</option>
                <option value="Mostly Regular">Mostly Regular</option>
                <option value="Frequently Late">Frequently Late</option>
                <option value="Irregular / Absenteeism Risk">Irregular / Absenteeism Risk</option>
              </select>
            </div>
          </div>

          {/* Interactive Star Rating Selector */}
          <div className="form-group" style={{ background: '#f8fafc', padding: '18px', borderRadius: '10px', border: '1px solid #e2e8f0', margin: '20px 0' }}>
            <label className="form-label" style={{ marginBottom: '10px' }}>
              Overall Weekly Performance Rating (1–5 Stars) *
            </label>
            <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setFormData(prev => ({ ...prev, rating: star }))}
                  style={{
                    background: 'none',
                    border: 'none',
                    fontSize: '2rem',
                    cursor: 'pointer',
                    color: star <= formData.rating ? '#f59e0b' : '#cbd5e1',
                    transition: 'transform 0.15s ease'
                  }}
                  title={`${star} Stars`}
                >
                  ★
                </button>
              ))}
              <span style={{ marginLeft: '12px', fontWeight: 600, color: '#334155', fontSize: '0.92rem' }}>
                {ratingDescriptions[formData.rating]}
              </span>
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Academic & Skill Progress</label>
            <textarea
              name="academicProgress"
              className="form-control"
              rows={2}
              placeholder="What concepts were mastered? How was homework and classwork completion?"
              value={formData.academicProgress}
              onChange={handleChange}
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '16px' }}>
            <div className="form-group">
              <label className="form-label">Behaviour & Attitude</label>
              <textarea
                name="behaviour"
                className="form-control"
                rows={2}
                placeholder="Discipline, peer collaboration, respect..."
                value={formData.behaviour}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Participation & Curiosity</label>
              <textarea
                name="participation"
                className="form-control"
                rows={2}
                placeholder="Question asking, volunteering, focus..."
                value={formData.participation}
                onChange={handleChange}
              />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '16px' }}>
            <div className="form-group">
              <label className="form-label">Key Strengths Demonstrated</label>
              <textarea
                name="strengths"
                className="form-control"
                rows={2}
                placeholder="What did the student excel at this week?"
                value={formData.strengths}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Areas for Improvement / Next Steps</label>
              <textarea
                name="improvementAreas"
                className="form-control"
                rows={2}
                placeholder="What should be the focus for next week's session?"
                value={formData.improvementAreas}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Teacher / Mentor Remarks & Action Items</label>
            <textarea
              name="comments"
              className="form-control"
              rows={3}
              placeholder="General observations, guardian follow-up notes, special commendations..."
              value={formData.comments}
              onChange={handleChange}
            />
          </div>

          <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end', marginTop: '24px' }}>
            <Link href="/feedback" className="btn btn-outline">Cancel</Link>
            <button type="submit" className="btn btn-primary">
              <i className="bi bi-check-circle-fill"></i> Save Evaluation
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
