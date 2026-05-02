'use client';

import { useEffect } from 'react';
import Link from 'next/link';

export default function Error({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="max-w-md w-full text-center">
        <div className="text-6xl mb-4">😔</div>
        <h1 className="text-2xl font-bold text-gray-900 mb-2" style={{ fontFamily: 'Georgia, serif' }}>
          Something went wrong
        </h1>
        <p className="text-gray-500 mb-8 leading-relaxed">
          An unexpected error occurred. Your data is safe — this is a temporary issue with the app.
        </p>
        <div className="flex gap-3 justify-center flex-wrap">
          <button
            onClick={reset}
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-2.5 rounded-lg transition-colors"
          >
            Try again
          </button>
          <Link href="/dashboard" className="border border-gray-200 hover:bg-gray-50 text-gray-700 font-semibold px-6 py-2.5 rounded-lg transition-colors">
            Go to dashboard
          </Link>
        </div>
        {error.digest && (
          <p className="text-xs text-gray-300 mt-8">Error ID: {error.digest}</p>
        )}
        <p className="text-xs text-gray-400 mt-4">
          If this keeps happening, email <a href="mailto:hello@smartiep.co" className="text-blue-400 hover:underline">hello@smartiep.co</a>
        </p>
      </div>
    </div>
  );
}
