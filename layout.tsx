import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Patchwork',
  description: 'A place for complicated minds.',
  icons: {
    icon: '/favicon.ico',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="bg-slate-50 text-slate-900">
        {children}
      </body>
    </html>
  );
}
