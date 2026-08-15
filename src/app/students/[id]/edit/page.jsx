'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import { useApp } from '@/lib/store';

export default function EditStudentPage() {
  const params = useParams();
  const router = useRouter();
  const studentId = Number(params.id);
  const { students, updateStudent } = useApp();

  const student = students.find(s => s.id === studentId);

  const [formData, setFormData] = useState({
    fullName: '',
    dob: '',
    gender: 'Male',
    gradeClass: '',
    schoolName: '',
    parentName: '',
    phone: '',
    email: '',
    address: '',
    joiningDate: '',
    status: 'Active',
    notes: ''
  });

  useEffect(() => {
    if (student) {
      setFormData({
        fullName: student.fullName || '',
        dob: student.dob || '',
        gender: student.gender || 'Male',
        gradeClass: student.gradeClass || '',
        schoolName: student.schoolName || '',
        parentName: student.parentName || '',
        phone: student.phone || '',
        email: student.email || '',
        address: student.address || '',
        joiningDate: student.joiningDate || '',
        status: student.status || 'Active',
        notes: student.notes || ''
      });
    }
  }, [student]);

  if (!student) {
    return <div className="card">Student not found</div>;
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    updateStudent(student.id, formData);
    router.push(`/students/${student.id}`);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px' }}>
        <Link href={`/students/${student.id}`} className="btn btn-outline btn-sm">
          <i className="bi bi-arrow-left"></i> Cancel
        </Link>
        <h1 style={{ fontSize: '1.45rem', fontWeight: 700 }}>
          Edit Student Record: {student.fullName} ({student.studentId})
        </h1>
      </div>

      <div className="card">
        <form onSubmit={handleSubmit}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '16px' }}>
            <div className="form-group">
              <label className="form-label">Full Name *</label>
              <input
                type="text"
                name="fullName"
                className="form-control"
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
                value={formData.phone}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Email</label>
              <input
                type="email"
                name="email"
                className="form-control"
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
              value={formData.notes}
              onChange={handleChange}
            />
          </div>

          <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end', marginTop: '24px' }}>
            <Link href={`/students/${student.id}`} className="btn btn-outline">Cancel</Link>
            <button type="submit" className="btn btn-primary">
              <i className="bi bi-check-circle-fill"></i> Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
