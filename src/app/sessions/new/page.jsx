'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useApp } from '@/lib/store';

export default function NewSessionPage() {
  const { addSession, users, currentUser } = useApp();
  const router = useRouter();

  const [formData, setFormData] = useState({
    title: '',
    date: new Date().toISOString().split('T')[0],
    startTime: '10:00',
    endTime: '11:30',
    teacherId: currentUser?.id || 1,
    location: 'Main Community Hall',
    sessionType: 'Academic',
    description: '',
    status: 'Scheduled'
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    const newSession = addSession(formData);
    router.push(`/sessions/${newSession.id}/attendance`);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px' }}>
        <Link href="/sessions" className="btn btn-outline btn-sm">
          <i className="bi bi-arrow-left"></i> Back
        </Link>
        <h1 style={{ fontSize: '1.45rem', fontWeight: 700 }}>Schedule New Class / Workshop</h1>
      </div>

      <div className="card">
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Session / Workshop Title *</label>
            <input
              type="text"
              name="title"
              className="form-control"
              placeholder="e.g. Science Lab: Circuit Building Workshop"
              value={formData.title}
              onChange={handleChange}
              required
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px' }}>
            <div className="form-group">
              <label className="form-label">Session Date *</label>
              <input
                type="date"
                name="date"
                className="form-control"
                value={formData.date}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Start Time *</label>
              <input
                type="time"
                name="startTime"
                className="form-control"
                value={formData.startTime}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">End Time *</label>
              <input
                type="time"
                name="endTime"
                className="form-control"
                value={formData.endTime}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px' }}>
            <div className="form-group">
              <label className="form-label">Assigned Teacher / Instructor</label>
              <select
                name="teacherId"
                className="form-select"
                value={formData.teacherId}
                onChange={(e) => setFormData(prev => ({ ...prev, teacherId: Number(e.target.value) }))}
              >
                {users.map(u => (
                  <option key={u.id} value={u.id}>
                    {u.fullName} ({u.role})
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Location / Room Venue</label>
              <input
                type="text"
                name="location"
                className="form-control"
                placeholder="e.g. Science Lab 1, Activity Lawn"
                value={formData.location}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Category</label>
              <select name="sessionType" className="form-select" value={formData.sessionType} onChange={handleChange}>
                <option value="Academic">Academic</option>
                <option value="Skill Workshop">Skill Workshop</option>
                <option value="Life Skills">Life Skills</option>
                <option value="Mentorship">Mentorship</option>
                <option value="Extracurricular">Extracurricular</option>
              </select>
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Session Description / Learning Objectives</label>
            <textarea
              name="description"
              className="form-control"
              rows={3}
              placeholder="Outline topics covered, materials required, target learning outcomes..."
              value={formData.description}
              onChange={handleChange}
            />
          </div>

          <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end', marginTop: '24px' }}>
            <Link href="/sessions" className="btn btn-outline">Cancel</Link>
            <button type="submit" className="btn btn-primary">
              <i className="bi bi-calendar-plus-fill"></i> Save & Open Attendance Sheet
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
