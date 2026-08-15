'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useApp } from '@/lib/store';

export default function Sidebar({ isOpen, onClose }) {
  const pathname = usePathname();
  const { currentUser, logout, resetDemoData } = useApp();

  const navItems = [
    { name: 'Dashboard', href: '/dashboard', icon: 'bi-grid-1x2-fill' },
    { name: 'Students', href: '/students', icon: 'bi-people-fill' },
    { name: 'Weekly Feedback', href: '/feedback', icon: 'bi-star-half' },
    { name: 'Sessions & Attendance', href: '/sessions', icon: 'bi-calendar-check-fill' },
    { name: 'Reports & Export', href: '/reports', icon: 'bi-file-earmark-bar-graph-fill' }
  ];

  if (currentUser?.role === 'admin') {
    navItems.push({ name: 'Staff & Users', href: '/users', icon: 'bi-person-badge-fill' });
  }

  const handleReset = () => {
    if (confirm('Reset all demo data back to default initial records?')) {
      resetDemoData();
      alert('Demo data has been reset to defaults!');
    }
  };

  return (
    <aside className={`sidebar ${isOpen ? 'open' : ''}`}>
      <div className="sidebar-header">
        <div className="sidebar-logo">
          <i className="bi bi-heart-pulse-fill"></i>
        </div>
        <div>
          <h2 style={{ fontSize: '1.05rem', fontWeight: 700, color: '#ffffff' }}>Hope NGO</h2>
          <span style={{ fontSize: '0.75rem', color: '#94a3b8' }}>Management System</span>
        </div>
      </div>

      <nav className="sidebar-nav">
        {navItems.map((item) => {
          const isActive = pathname === item.href || (item.href !== '/dashboard' && pathname.startsWith(item.href));
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={onClose}
              className={`nav-link ${isActive ? 'active' : ''}`}
            >
              <i className={`bi ${item.icon}`}></i>
              <span>{item.name}</span>
            </Link>
          );
        })}
      </nav>

      <div className="sidebar-footer">
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <button
            onClick={handleReset}
            className="btn btn-outline btn-sm"
            style={{ width: '100%', borderColor: 'rgba(255,255,255,0.15)', color: '#cbd5e1', background: 'transparent' }}
          >
            <i className="bi bi-arrow-counterclockwise"></i> Reset Demo Data
          </button>
          <button
            onClick={logout}
            className="btn btn-danger btn-sm"
            style={{ width: '100%' }}
          >
            <i className="bi bi-box-arrow-right"></i> Sign Out
          </button>
        </div>
      </div>
    </aside>
  );
}
