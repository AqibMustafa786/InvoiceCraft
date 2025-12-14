
'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/context/auth-provider';
import { motion } from 'framer-motion';

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
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
      className="my-8 text-3xl font-semibold text-center text-foreground"
    >
      {greeting}
    </motion.div>
  );
}
