import './globals.css';
import VisitorTracker from '@/components/VisitorTracker';

export const metadata = {
  title: 'TestBeat | Diagnostic Aggregator',
  description: 'Compare Redcliffe, Dr Lal & Thyrocare lab tests with free home sample pickup.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="antialiased font-sans">
        <VisitorTracker />
        {children}
      </body>
    </html>
  );
}
