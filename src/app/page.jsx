'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useApp } from '@/lib/store';

export default function HomePage() {
  const { currentUser, loaded } = useApp();
  const router = useRouter();

  useEffect(() => {
    if (loaded) {
      if (currentUser) {
        router.push('/dashboard');
      } else {
        router.push('/login');
      }
    }
  }, [currentUser, loaded, router]);

  return null;
}
