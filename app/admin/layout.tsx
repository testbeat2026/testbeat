import React from 'react';

export const metadata = {
  title: 'TestBeat Operations & Control Cloud',
  description: 'Enterprise Diagnostic Aggregator Command Center',
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="fixed inset-0 z-[9999] bg-[#F4F6F9] overflow-hidden flex flex-col font-sans">
      {children}
    </div>
  );
}
