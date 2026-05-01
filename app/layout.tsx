import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import NavBar from '@/components/NavBar';

export const metadata: Metadata = {
  title: 'IEP Planner — Early Education Support',
  description: 'AI-assisted IEP planning tool for early education teachers, IDEA 2004 compliant.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Lora:ital,wght@0,400;0,600;0,700;1,400&family=DM+Sans:wght@300;400;500;600&display=swap" rel="stylesheet" />
      </head>
      <body className="bg-gray-50 min-h-screen">
        <NavBar />
        <main className="max-w-6xl mx-auto px-4 py-8">
          {children}
        </main>
        <footer className="max-w-6xl mx-auto px-4 py-6 mt-8 border-t text-center text-xs text-gray-400 no-print">
          <p className="font-medium text-gray-500">⚠️ AI-Assisted Tool — Professional Review Required</p>
          <p className="mt-1">All generated IEP content must be reviewed and approved by qualified special education professionals before use. This tool supports, but does not replace, professional judgment.</p>
        </footer>
      </body>
    </html>
  );
}
