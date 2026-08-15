'use client';

import React from 'react';
import Link from 'next/link';
import { useApp } from '@/lib/store';

export default function Navbar({ onToggleSidebar }) {
  const { currentUser } = useApp();

  return (
    <header className="topbar">
      <div className="topbar-left">
        <button className="mobile-menu-btn" onClick={onToggleSidebar}>
          <i className="bi bi-list"></i>
        </button>
        <span style={{ fontSize: '0.95rem', fontWeight: 600, color: '#334155' }}>
          NGO Student & Community Program
        </span>
      </div>

      <div className="topbar-right">
        {currentUser && (
          <Link href="/profile" className="user-badge" style={{ textDecoration: 'none' }}>
            <div style={{ width: 32, height: 32, borderRadius: '50%', background: '#2563eb', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: '0.85rem' }}>
              {currentUser.fullName ? currentUser.fullName[0] : 'U'}
            </div>
            <div>
              <div style={{ fontWeight: 600, color: 'var(--text-primary)', lineHeight: 1.2 }}>{currentUser.fullName}</div>
              <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
                <span className={`role-pill role-${currentUser.role}`}>{currentUser.role}</span>
              </div>
            </div>
          </Link>
        )}
      </div>
    </header>
  );
}
