'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useApp } from '@/lib/store';

export default function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login, currentUser } = useApp();
  const router = useRouter();

  useEffect(() => {
    if (currentUser) {
      router.push('/dashboard');
    }
  }, [currentUser, router]);

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const res = login(username.trim(), password);
    if (res.success) {
      router.push('/dashboard');
    } else {
      setError(res.message || 'Invalid credentials');
      setLoading(false);
    }
  };

  const handleFill = (u, p) => {
    setUsername(u);
    setPassword(p);
    setError('');
  };

  return (
    <div className="login-page">
      <div className="login-card">
        <div style={{ textAlign: 'center', marginBottom: '28px' }}>
          <div
            style={{
              width: '56px',
              height: '56px',
              background: 'linear-gradient(135deg, #2563eb, #4f46e5)',
              borderRadius: '14px',
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'white',
              fontSize: '26px',
              boxShadow: '0 8px 16px rgba(37, 99, 235, 0.25)',
              marginBottom: '12px'
            }}
          >
            <i className="bi bi-heart-pulse-fill"></i>
          </div>
          <h1 style={{ fontSize: '1.45rem', fontWeight: 700, color: 'var(--text-primary)' }}>NGO Portal Login</h1>
          <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)', marginTop: '4px' }}>
            Beneficiary, Attendance & Evaluation Management
          </p>
        </div>

        {error && (
          <div style={{ background: '#fef2f2', border: '1px solid #fecaca', color: '#991b1b', padding: '10px 14px', borderRadius: '8px', fontSize: '0.88rem', marginBottom: '18px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <i className="bi bi-exclamation-triangle-fill"></i>
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Username or Email</label>
            <div style={{ position: 'relative' }}>
              <input
                type="text"
                className="form-control"
                placeholder="e.g. srinivas or teacher"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                autoFocus
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Password</label>
            <input
              type="password"
              className="form-control"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button
            type="submit"
            className="btn btn-primary"
            style={{ width: '100%', padding: '11px', fontWeight: 600, fontSize: '0.98rem', marginTop: '6px' }}
            disabled={loading}
          >
            {loading ? 'Signing In...' : <><i className="bi bi-box-arrow-in-right"></i> Sign In to Portal</>}
          </button>
        </form>

        {/* Demo Credentials Quick Fill Accordion */}
        <div style={{ marginTop: '24px', paddingTop: '18px', borderTop: '1px solid var(--border-color)' }}>
          <div style={{ background: '#f8fafc', padding: '14px', borderRadius: '10px', fontSize: '0.85rem', border: '1px solid #e2e8f0' }}>
            <div style={{ fontWeight: 600, color: '#334155', marginBottom: '10px', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <i className="bi bi-key-fill text-warning"></i> Demo Login Accounts:
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <strong>Admin:</strong> <code>srinivas</code> / <code>srinivasngo</code>
                </div>
                <button
                  type="button"
                  onClick={() => handleFill('srinivas', 'srinivasngo')}
                  className="btn btn-outline btn-sm"
                  style={{ padding: '2px 8px', fontSize: '0.78rem' }}
                >
                  Autofill
                </button>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <strong>Teacher:</strong> <code>teacher</code> / <code>srinivasngo</code>
                </div>
                <button
                  type="button"
                  onClick={() => handleFill('teacher', 'srinivasngo')}
                  className="btn btn-outline btn-sm"
                  style={{ padding: '2px 8px', fontSize: '0.78rem' }}
                >
                  Autofill
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
