

'use client';

import { useState, useEffect } from 'react';
import { useUserAuth } from '@/context/auth-provider';
import { motion } from 'framer-motion';

export function Greeting() {
  const { user, userProfile } = useUserAuth();
  const [greeting, setGreeting] = useState('');

  useEffect(() => {
    if (!user) return;

    const getGreetingMessage = () => {
      const hour = new Date().getHours();
      const name = userProfile?.name?.split(' ')[0] || user.displayName?.split(' ')[0] || 'User';

      if (hour < 12 && hour >= 6) {
        return `Good Morning, ${name}`;
      }
      if (hour < 19 && hour >= 12) {
        return `Good Afternoon, ${name}`;
      }
      return `Good Evening, ${name}`;
    };

    setGreeting(getGreetingMessage());
  }, [user, userProfile]);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05,
      },
    },
  };

  const wordVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: 'spring',
        stiffness: 100,
        damping: 10,
      },
    },
  };

  if (!greeting) {
    return null;
  }

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="text-lg font-semibold flex items-center"
    >
      {greeting.split(' ').map((word, index) => (
        <motion.span
          key={index}
          variants={wordVariants}
          className="mr-1.5"
        >
          {word}
        </motion.span>
      ))}
    </motion.div>
  );
}
