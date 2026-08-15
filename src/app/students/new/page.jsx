'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useApp } from '@/lib/store';

export default function NewStudentPage() {
  const { addStudent, generateStudentId } = useApp();
  const router = useRouter();

  const [formData, setFormData] = useState({
    studentId: generateStudentId(),
    fullName: '',
    dob: '',
    gender: 'Male',
    gradeClass: 'Class 7',
    schoolName: '',
    parentName: '',
    phone: '',
    email: '',
    address: '',
    joiningDate: new Date().toISOString().split('T')[0],
    status: 'Active',
    notes: ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    const newStudent = addStudent(formData);
    router.push(`/students/${newStudent.id}`);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px' }}>
        <Link href="/students" className="btn btn-outline btn-sm">
          <i className="bi bi-arrow-left"></i> Back
        </Link>
        <h1 style={{ fontSize: '1.45rem', fontWeight: 700 }}>Register New Student Beneficiary</h1>
      </div>

      <div className="card">
        <form onSubmit={handleSubmit}>
          <div style={{ background: '#eff6ff', border: '1px solid #bfdbfe', padding: '14px 18px', borderRadius: '10px', marginBottom: '22px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div>
              <span style={{ fontSize: '0.85rem', color: '#1e40af', fontWeight: 600 }}>Auto-Generated Unique ID:</span>
              <div style={{ fontSize: '1.25rem', fontWeight: 700, color: '#1d4ed8' }}>{formData.studentId}</div>
            </div>
            <span className="badge badge-info">System Sequence</span>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '16px' }}>
            <div className="form-group">
              <label className="form-label">Full Name *</label>
              <input
                type="text"
                name="fullName"
                className="form-control"
                placeholder="e.g. Aarav Sharma"
                value={formData.fullName}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Date of Birth</label>
              <input
                type="date"
                name="dob"
                className="form-control"
                value={formData.dob}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Gender</label>
              <select name="gender" className="form-select" value={formData.gender} onChange={handleChange}>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Grade / Class *</label>
              <input
                type="text"
                name="gradeClass"
                className="form-control"
                placeholder="e.g. Class 7, Class 10"
                value={formData.gradeClass}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Current School Name</label>
              <input
                type="text"
                name="schoolName"
                className="form-control"
                placeholder="e.g. City Public High School"
                value={formData.schoolName}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Enrollment / Joining Date</label>
              <input
                type="date"
                name="joiningDate"
                className="form-control"
                value={formData.joiningDate}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Parent / Guardian Name</label>
              <input
                type="text"
                name="parentName"
                className="form-control"
                placeholder="e.g. Ramesh Sharma"
                value={formData.parentName}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Guardian Phone Number</label>
              <input
                type="text"
                name="phone"
                className="form-control"
                placeholder="e.g. +1 555 019 2831"
                value={formData.phone}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Email (Optional)</label>
              <input
                type="email"
                name="email"
                className="form-control"
                placeholder="e.g. student@example.com"
                value={formData.email}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Status</label>
              <select name="status" className="form-select" value={formData.status} onChange={handleChange}>
                <option value="Active">Active</option>
                <option value="On Leave">On Leave</option>
                <option value="Graduated">Graduated</option>
                <option value="Inactive">Inactive</option>
              </select>
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Residential Address</label>
            <textarea
              name="address"
              className="form-control"
              rows={2}
              placeholder="Full home or community address..."
              value={formData.address}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Special Notes / Background Observation</label>
            <textarea
              name="notes"
              className="form-control"
              rows={3}
              placeholder="Strengths, learning needs, family situation, or special interests..."
              value={formData.notes}
              onChange={handleChange}
            />
          </div>

          <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end', marginTop: '24px' }}>
            <Link href="/students" className="btn btn-outline">Cancel</Link>
            <button type="submit" className="btn btn-primary">
              <i className="bi bi-check-circle-fill"></i> Save Student Record
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
