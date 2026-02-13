
'use client';

import { useState, useEffect, ReactNode } from 'react';
import { SplashScreen } from '@/components/splash-screen';
import { usePathname } from 'next/navigation';

export function SplashScreenProvider({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const [isLoading, setIsLoading] = useState(true);

  // This effect runs only once on initial mount on the client.
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 3000); // The total duration of the splash screen (animation + delay)

    return () => clearTimeout(timer);
  }, []); // Empty dependency array ensures it runs only once.

  // We use a key on the children div to force a re-mount of the main app
  // content when the splash screen is done. This can help with certain
  // hydration issues and ensures a clean transition.
  // We only want the splash screen on the very first load of the homepage.
  if (isLoading && pathname === '/') {
    return <SplashScreen />;
  }

  return <>{children}</>;
}
