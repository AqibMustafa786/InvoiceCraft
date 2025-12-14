
'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/context/auth-provider';

export function Greeting() {
  const { user, userProfile } = useAuth();
  const [greeting, setGreeting] = useState('');

  useEffect(() => {
    if (!user) return;

    const getGreetingMessage = () => {
      const hour = new Date().getHours();
      const name = userProfile?.name?.split(' ')[0] || user.displayName?.split(' ')[0] || 'Sir';

      if (hour < 12 && hour >= 6) {
        return `Good Morning Sir @${name}`;
      }
      if (hour < 19 && hour >= 12) {
        return `Good Afternoon Sir @${name}`;
      }
      return `Good Night Sir @${name}`;
    };

    setGreeting(getGreetingMessage());
  }, [user, userProfile]);

  if (!greeting) {
    return null;
  }

  return (
    <div className="mb-4 text-3xl font-semibold text-muted-foreground text-center">
      {greeting}
    </div>
  );
}
