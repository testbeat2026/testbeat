import React from 'react';

export const metadata = {
  title: 'TestBeat Cloud Console | Multi-Lab Diagnostic Aggregator',
  description: 'Enterprise Administrative Command Engine',
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="fixed inset-0 z-[99999] bg-[#F4F7F9] overflow-hidden flex flex-col font-sans select-none antialiased">
      {children}
    </div>
  );
}
