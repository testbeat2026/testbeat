'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';

export default function VisitorTracker() {
  const pathname = usePathname();

  useEffect(() => {
    // Only track public routes (ignore internal admin paths)
    if (pathname.startsWith('/admin') || pathname.startsWith('/login')) return;

    fetch('/api/tracker', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ page: pathname })
    }).catch(() => {});
  }, [pathname]);

  return null;
}
