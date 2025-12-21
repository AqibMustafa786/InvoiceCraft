
'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import Marquee from '@/components/marquee';
import { motion } from 'framer-motion';
import Image from 'next/image';
import { FileText } from 'lucide-react';

export default function HomePage() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0, 
      transition: { 
        duration: 0.5,
        ease: "easeOut"
      } 
    },
  };

  return (
    <div className="flex flex-col min-h-[calc(100vh-8rem)]">
      <main className="flex-1">
        <section className="relative w-full py-20 overflow-hidden md:py-32 lg:py-40">
          <div className="container px-4 mx-auto md:px-6">
            <div className="grid gap-12 lg:grid-cols-2 lg:gap-24 items-center">
              <motion.div 
                className="max-w-xl text-center lg:text-left"
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
                </motion.h1>
                <motion.p 
                  className="mt-6 text-lg text-muted-foreground md:text-xl"
                  variants={itemVariants}
                >
                  Generate invoices, estimates, quotes, and insurance documents. Download as PDF and track them online. The ultimate tool for freelancers and small businesses.
                </motion.p>
                <motion.div 
                  className="flex flex-col items-center justify-center gap-4 mt-8 sm:flex-row lg:justify-start"
                  variants={itemVariants}
                >
                   <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.98 }}>
                      <Button asChild size="lg" className="w-full text-lg sm:w-auto">
                          <Link href="/dashboard">Get Started Free</Link>
                      </Button>
                   </motion.div>
                   <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.98 }}>
                      <Button asChild variant="outline" size="lg" className="w-full text-lg sm:w-auto">
                          <Link href="/features">
                              Learn More
                          </Link>
                      </Button>
                  </motion.div>
                </motion.div>
              </motion.div>
              <motion.div 
                className="relative w-full h-64 lg:h-auto lg:aspect-square"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.7, ease: 'easeOut' }}
              >
                <Image 
                  src="https://picsum.photos/seed/app-interface/800/800" 
                  alt="Modern application interface for document creation"
                  fill
                  className="object-cover rounded-2xl shadow-2xl"
                  data-ai-hint="app interface"
                />
              </motion.div>
            </div>
          </div>
        </section>
        <section className="py-12 md:py-20">
          <Marquee />
        </section>
      </main>
    </div>
  );
}
