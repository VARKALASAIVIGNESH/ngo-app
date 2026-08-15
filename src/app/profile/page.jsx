'use client';

import React, { useState } from 'react';
import { useApp } from '@/lib/store';

export default function ProfilePage() {
  const { currentUser, updateUser } = useApp();
  const [fullName, setFullName] = useState(currentUser?.fullName || '');
  const [email, setEmail] = useState(currentUser?.email || '');
  const [phone, setPhone] = useState(currentUser?.phone || '');
  const [newPassword, setNewPassword] = useState('');
  const [saved, setSaved] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    const updateData = { fullName, email, phone };
    if (newPassword.trim()) {
      updateData.password = newPassword.trim();
    }
    updateUser(currentUser.id, updateData);
    setSaved(true);
    setNewPassword('');
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div style={{ maxWidth: '600px', margin: '0 auto' }}>
      <h1 style={{ fontSize: '1.45rem', fontWeight: 700, marginBottom: '24px' }}>My Account Profile</h1>

      {saved && (
        <div style={{ background: '#ecfdf5', border: '1px solid #a7f3d0', color: '#065f46', padding: '12px 16px', borderRadius: '8px', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <i className="bi bi-check-circle-fill"></i> Profile & password updated successfully!
        </div>
      )}

      <div className="card">
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '24px', paddingBottom: '20px', borderBottom: '1px solid #e2e8f0' }}>
          <div style={{ width: 56, height: 56, borderRadius: '50%', background: '#2563eb', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.4rem', fontWeight: 700 }}>
            {currentUser?.fullName ? currentUser.fullName[0] : 'U'}
          </div>
          <div>
            <h2 style={{ fontSize: '1.2rem', fontWeight: 700 }}>{currentUser?.fullName}</h2>
            <div style={{ display: 'flex', gap: '8px', alignItems: 'center', marginTop: '2px' }}>
              <span style={{ color: '#64748b', fontSize: '0.88rem' }}>Username: <code>{currentUser?.username}</code></span>
              <span className={`role-pill role-${currentUser?.role}`}>{currentUser?.role}</span>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Full Name</label>
            <input
              type="text"
              className="form-control"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Email Address</label>
            <input
              type="email"
              className="form-control"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Phone Number</label>
            <input
              type="text"
              className="form-control"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
            />
          </div>

          <div className="form-group" style={{ marginTop: '20px', paddingTop: '16px', borderTop: '1px solid #e2e8f0' }}>
            <label className="form-label">Change Password (Leave blank to keep current)</label>
            <input
              type="password"
              className="form-control"
              placeholder="Enter new password..."
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
            />
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '24px' }}>
            <button type="submit" className="btn btn-primary">
              <i className="bi bi-save"></i> Save Profile Settings
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
