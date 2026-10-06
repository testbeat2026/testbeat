import './globals.css';

export const metadata = {
  title: "TestBeat | India's Trusted Multi-Lab Platform",
  description: "Compare NABL accredited labs, book home sample pickup across India.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
