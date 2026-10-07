import React from 'react';

export const metadata = {
  title: 'Super Admin Console | TestBeat',
  description: 'TestBeat Healthcare Diagnostics Super Admin Management Portal',
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-[#F4F6F9] antialiased">
      {children}
    </div>
  );
}
