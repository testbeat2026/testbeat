'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function RedirectPrescription() {
  const router = useRouter();

  useEffect(() => {
    router.replace('/upload-prescription');
  }, [router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 text-slate-600 font-bold text-sm">
      Prescription portal load ho raha hai...
    </div>
  );
}
