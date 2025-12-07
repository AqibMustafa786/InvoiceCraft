
'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import Marquee from '@/components/marquee';
import { motion } from 'framer-motion';

export default function HomePage() {
  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  };

  return (
    <div className="flex flex-col min-h-[calc(100vh-4rem)]">
      <main className="flex-1">
        <section className="relative w-full py-20 overflow-hidden text-center md:py-32 lg:py-40">
          <div className="container px-4 mx-auto md:px-6">
            <motion.div 
              className="max-w-4xl mx-auto"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
            >
              <motion.h1 
                className="text-5xl font-bold tracking-tight md:text-6xl lg:text-7xl font-headline"
                variants={itemVariants}
              >
                <span>Create Professional </span>
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent">
                  Documents
                </span>
                <span> in Seconds </span>
                <span className="inline-block origin-bottom-right animate-wave">⚡️</span>
              </motion.h1>
              <motion.p 
                className="mt-6 text-lg text-muted-foreground md:text-xl max-w-2xl mx-auto"
                variants={itemVariants}
              >
                Generate invoices, estimates, quotes, and insurance documents. Download as PDF and track them online. The ultimate tool for freelancers and small businesses.
              </motion.p>
              <motion.div 
                className="flex flex-col items-center justify-center gap-4 mt-8 sm:flex-row"
                variants={itemVariants}
              >
                <Button asChild size="lg" className="w-full text-lg sm:w-auto">
                  <Link href="/create-invoice">Create Free Invoice</Link>
                </Button>
                <Button asChild variant="outline" size="lg" className="w-full text-lg sm:w-auto">
                  <Link href="/features">
                    Learn More
                  </Link>
                </Button>
              </motion.div>
            </motion.div>
          </div>
        </section>
        <section className="py-12 md:py-20">
          <Marquee />
        </section>
      </main>
    </div>
  );
}
