'use client';

import React, { useState } from 'react';
import { useApp } from '@/lib/store';

export default function UsersPage() {
  const { users, currentUser, addUser, deleteUser } = useApp();
  const [showAddForm, setShowAddForm] = useState(false);
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    fullName: '',
    email: '',
    phone: '',
    role: 'teacher'
  });

  if (currentUser?.role !== 'admin') {
    return (
      <div className="card" style={{ textAlign: 'center', padding: '48px' }}>
        <i className="bi bi-shield-lock-fill" style={{ fontSize: '2.5rem', color: '#ef4444', marginBottom: '12px', display: 'block' }}></i>
        <h2 style={{ fontSize: '1.35rem', fontWeight: 700 }}>Administrator Access Required</h2>
        <p style={{ color: '#64748b', marginTop: '8px' }}>
          Only system administrators have permission to manage staff and teacher user accounts.
        </p>
      </div>
    );
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.username || !formData.password || !formData.fullName) {
      alert('Please fill all required fields.');
      return;
    }
    addUser(formData);
    setFormData({
      username: '',
      password: '',
      fullName: '',
      email: '',
      phone: '',
      role: 'teacher'
    });
    setShowAddForm(false);
  };

  const handleDelete = (user) => {
    if (user.id === currentUser.id) {
      alert('You cannot delete your own active administrator account.');
      return;
    }
    if (confirm(`Are you sure you want to delete user ${user.fullName} (${user.username})?`)) {
      deleteUser(user.id);
    }
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <h1 style={{ fontSize: '1.45rem', fontWeight: 700 }}>Staff & User Accounts</h1>
          <p style={{ color: '#64748b', fontSize: '0.88rem' }}>
            Manage teachers, educators, and administrator login credentials.
          </p>
        </div>

        <button onClick={() => setShowAddForm(!showAddForm)} className="btn btn-primary btn-sm">
          <i className={`bi ${showAddForm ? 'bi-x-lg' : 'bi-person-plus-fill'}`}></i>
          {showAddForm ? 'Close Form' : 'Create User Account'}
        </button>
      </div>

      {showAddForm && (
        <div className="card" style={{ marginBottom: '24px', background: '#f8fafc' }}>
          <div className="card-header">
            <h3 className="card-title">New Staff Account Registration</h3>
          </div>
          <form onSubmit={handleSubmit}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px' }}>
              <div className="form-group">
                <label className="form-label">Full Name *</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="e.g. David Kumar"
                  value={formData.fullName}
                  onChange={(e) => setFormData(prev => ({ ...prev, fullName: e.target.value }))}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Username *</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="e.g. david.kumar"
                  value={formData.username}
                  onChange={(e) => setFormData(prev => ({ ...prev, username: e.target.value }))}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Password *</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Enter password"
                  value={formData.password}
                  onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Role</label>
                <select
                  className="form-select"
                  value={formData.role}
                  onChange={(e) => setFormData(prev => ({ ...prev, role: e.target.value }))}
                >
                  <option value="teacher">Teacher / Staff</option>
                  <option value="admin">Administrator</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Email</label>
                <input
                  type="email"
                  className="form-control"
                  placeholder="e.g. david.kumar@ngo.org"
                  value={formData.email}
                  onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Phone Number</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="e.g. +1 555 017 4488"
                  value={formData.phone}
                  onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                />
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '16px' }}>
              <button type="button" onClick={() => setShowAddForm(false)} className="btn btn-outline">Cancel</button>
              <button type="submit" className="btn btn-primary">Create Account</button>
            </div>
          </form>
        </div>
      )}

      {/* Users Table */}
      <div className="card">
        <div className="table-responsive">
          <table className="table">
            <thead>
              <tr>
                <th>Full Name</th>
                <th>Username</th>
                <th>Role</th>
                <th>Email</th>
                <th>Phone</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {users.map(u => (
                <tr key={u.id}>
                  <td>
                    <div style={{ fontWeight: 600 }}>{u.fullName}</div>
                    {u.id === currentUser.id && (
                      <span className="badge badge-info" style={{ fontSize: '0.7rem' }}>Current Session</span>
                    )}
                  </td>
                  <td><code>{u.username}</code></td>
                  <td>
                    <span className={`role-pill role-${u.role}`}>{u.role}</span>
                  </td>
                  <td>{u.email || '-'}</td>
                  <td>{u.phone || '-'}</td>
                  <td>
                    {u.id !== currentUser.id ? (
                      <button onClick={() => handleDelete(u)} className="btn btn-danger btn-sm" title="Delete User">
                        <i className="bi bi-trash"></i>
                      </button>
                    ) : (
                      <span style={{ color: '#94a3b8', fontSize: '0.82rem' }}>Protected</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
