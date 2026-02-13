
'use client';

import { motion } from 'framer-motion';
import { FileText } from 'lucide-react';

export function SplashScreen() {
  return (
    <motion.div
      initial={{ opacity: 1 }}
      animate={{ opacity: 0 }}
      transition={{ duration: 0.5, delay: 2.5 }}
      className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-background"
    >
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: 'easeOut' }}
        className="text-center"
      >
        <motion.div
          animate={{
            scale: [1, 1.05, 1],
            textShadow: [
              '0 0 8px hsl(var(--primary) / 0.3)',
              '0 0 16px hsl(var(--primary) / 0.5)',
              '0 0 8px hsl(var(--primary) / 0.3)',
            ],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
          className="flex items-center justify-center gap-3"
        >
          <FileText className="h-12 w-12 text-primary" />
          <span className="text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent">
            InvoiceCraft
          </span>
        </motion.div>
        <p className="mt-4 text-lg text-muted-foreground">
          Smart. Fast. Professional.
        </p>
      </motion.div>
    </motion.div>
  );
}
