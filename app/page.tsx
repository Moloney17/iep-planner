import LandingPage from './landing/page';

// Serve the landing content directly at the root path instead of redirecting
// to /landing. Logged-in users are still sent to /dashboard by middleware.ts
// before this ever renders; this change only affects anonymous visitors and
// crawlers, so smartiep.co returns a 200 with real content instead of a 307,
// which matters for Google's OAuth branding verification crawler.
export default function Home() {
  return <LandingPage />;
}
