import AdminShell from '@/components/AdminShell';

// This forces ALL /admin pages to be 100% dynamic at the server level.
// Next.js will NEVER attempt static prerendering during build.
export const dynamic = 'force-dynamic';
export const dynamicParams = true;
export const revalidate = 0;

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return <AdminShell>{children}</AdminShell>;
}
