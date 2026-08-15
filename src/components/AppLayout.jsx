'use client';

import React, { useState, useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { useApp } from '@/lib/store';
import Sidebar from './Sidebar';
import Navbar from './Navbar';

export default function AppLayout({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { currentUser, loaded } = useApp();
  const pathname = usePathname();
  const router = useRouter();

  const isLoginPage = pathname === '/login' || pathname === '/';

  useEffect(() => {
    if (loaded && !currentUser && pathname !== '/login') {
      router.push('/login');
    }
  }, [currentUser, loaded, pathname, router]);

  if (!loaded) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f8fafc' }}>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '14px' }}>
          <i className="bi bi-heart-pulse-fill" style={{ fontSize: '2.5rem', color: '#2563eb', animation: 'pulse 1.5s infinite' }}></i>
          <span style={{ fontSize: '1.1rem', fontWeight: 600, color: '#334155' }}>Loading NGO Portal...</span>
        </div>
      </div>
    );
  }

  if (isLoginPage) {
    return <main>{children}</main>;
  }

  return (
    <div className="app-container">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <div className="main-wrapper">
        <Navbar onToggleSidebar={() => setSidebarOpen(!sidebarOpen)} />
        <main className="page-content">{children}</main>
      </div>
    </div>
  );
}
