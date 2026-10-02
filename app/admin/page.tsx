'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function AdminRedirect() {
  const router = useRouter();
  useEffect(() => {
    router.replace('/portal/login');
  }, [router]);

  return (
    <div className="min-h-screen bg-[#002B49] flex items-center justify-center text-white">
      <div className="text-center">
        <div className="w-8 h-8 border-2 border-[#FF5A00] border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
        <p className="text-xs text-slate-300">Redirecting to Secure Workplace Portal...</p>
      </div>
    </div>
  );
}
