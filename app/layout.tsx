import type { Metadata } from 'next';
import './globals.css';
import NavBar from '@/components/NavBar';

export const metadata: Metadata = {
  title: 'SmartIEP — AI-Assisted IEP Planning',
  description: 'AI-assisted IEP planning tool for special education teachers. Generate IDEA 2004 compliant IEP drafts in minutes.',
  icons: {
    icon: 'data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><text y=%22.9em%22 font-size=%2290%22>💡</text></svg>',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
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
