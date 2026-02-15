'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import {
  FileText, FilePlus, Shield,
  LayoutDashboard, Edit, Bot, Share2, Palette, ArrowRight, XCircle, Clock, AlertCircle, CheckCircle, Search, FileClock, ChevronLeft, ChevronRight, Star
} from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { useTheme } from 'next-themes';
import dynamic from 'next/dynamic';
import { Badge } from '@/components/ui/badge';
import { TemplateShowcase } from '@/components/templates/stacked-carousel';
import { TestimonialsSection } from '@/components/home/testimonials-section';

const AIChatbot = dynamic(() => import('@/components/ai-chatbot').then(mod => mod.AIChatbot), { ssr: false });


import { FEATURES, TOOLS } from '@/lib/features';

const problems = [
  { text: "Manual, repetitive invoicing takes hours", icon: <Clock className="h-5 w-5 text-destructive" /> },
  { text: "Inconsistent and unprofessional document branding", icon: <AlertCircle className="h-5 w-5 text-destructive" /> },
  { text: "No central place to track document history", icon: <Search className="h-5 w-5 text-destructive" /> },
  { text: "Client confusion from unclear line items", icon: <XCircle className="h-5 w-5 text-destructive" /> },
];

const solutions = [
  { text: "Automated creation with reusable templates", icon: <CheckCircle className="h-5 w-5 text-primary" /> },
  { text: "Deep customization for professional branding", icon: <CheckCircle className="h-5 w-5 text-primary" /> },
  { text: "A full, versioned audit trail for every document", icon: <FileClock className="h-5 w-5 text-primary" /> },
  { text: "Clear, itemized billing for faster payments", icon: <CheckCircle className="h-5 w-5 text-primary" /> },
];

// Testimonials data removed in favor of dedicated component


export default function HomePage() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const heroImageSrc = '/home/invocie.png';

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
    },
  };


  return (
    <div className="flex flex-col min-h-dvh">
      <main className="flex-1">
        <section className="relative w-full py-20 overflow-hidden md:py-24 lg:py-32">
          <div
            aria-hidden="true"
            className="absolute inset-0 z-0"
          >
            <svg className="absolute -right-40 top-0 w-[150%] h-[150%] sm:w-full sm:h-full" viewBox="0 0 1440 892" fill="none" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid slice">
              <path d="M1440 892V0H0V892H1440Z" className="fill-background"></path>
              <path d="M1665 829C1665 829 1320.5 1013 1075.5 829C830.5 645 915 214.5 649.5 214.5C384 214.5 319 481 107.5 481C-104 481 -178.5 233 -178.5 233" className="stroke-primary/10" strokeWidth="2"></path>
              <path d="M1665 754C1665 754 1320.5 938 1075.5 754C830.5 570 864.967 167.319 630.5 162.5C396.033 157.681 319 481 107.5 481C-104 481 -178.5 233 -178.5 233" className="stroke-primary/20" strokeWidth="2"></path>
            </svg>
          </div>
          <div className="container px-4 mx-auto md:px-6 relative z-10">
            <div className="grid gap-12 lg:grid-cols-2 lg:gap-16 items-center">
              <motion.div
                className="max-w-xl text-center lg:text-left mx-auto"
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, ease: 'easeOut' }}
              >
                <motion.p
                  className="mb-2 text-sm font-bold tracking-wider uppercase text-primary"
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.2 }}
                >
                  Welcome to InvoiceCraft
                </motion.p>
                <motion.h1
                  className="text-3xl font-bold tracking-tight md:text-4xl lg:text-5xl font-headline"
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.3 }}
                >
                  Let's Control Your Business With{' '}
                  <span className="relative inline-block">
                    InvoiceCraft
                    <svg className="absolute -bottom-1.5 left-0 w-full" viewBox="0 0 240 10" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M2 8C52.0019 3.66667 157.005 -2.00001 238 4" stroke="hsl(var(--primary))" strokeWidth="4" strokeLinecap="round" />
                    </svg>
                  </span>
                </motion.h1>
                <motion.p
                  className="mt-6 text-base text-muted-foreground md:text-lg"
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.4 }}
                >
                  We provide the ultimate toolkit for US freelancers and agencies to look professional, save time, and automate billing.
                  Built for desktop, tablet, and mobile.
                </motion.p>
                <motion.div
                  className="flex flex-col items-center justify-center gap-4 mt-8 sm:flex-row lg:justify-start"
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.5 }}
                >
                  <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.98 }}>
                    <Button asChild size="lg" className="w-full sm:w-auto">
                      <Link href="/dashboard">Get Started</Link>
                    </Button>
                  </motion.div>
                </motion.div>
              </motion.div>
              <div className="relative w-full h-80 lg:h-auto lg:aspect-[4/3]">
                <Image
                  src={heroImageSrc}
                  alt="Illustration of a person working on a laptop"
                  fill
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  priority
                  className="object-contain"
                  data-ai-hint="workspace illustration"
                />
              </div>
            </div>
          </div>
        </section>

        <section className="py-20 md:py-28 bg-primary/5 rounded-3xl">
          <div className="container px-4 mx-auto md:px-6">
            <div className="text-center max-w-2xl mx-auto mb-12">
              <h2 className="text-4xl md:text-5xl font-bold font-headline">Everything You Need to Run Your Business</h2>
              <p className="mt-4 text-muted-foreground text-lg">From invoices to insurance, we provide the essential tools for modern contractors and freelancers.</p>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {TOOLS.map((tool) => (
                <Link href={tool.href} key={tool.href} className="group">
                  <motion.div whileHover={{ y: -8, scale: 1.05 }} transition={{ type: "spring", stiffness: 300 }} className="h-full">
                    <div className="bg-card/50 backdrop-blur-sm shadow-lg group-hover:shadow-primary/20 transition-all duration-300 rounded-xl p-6 flex flex-col items-center text-center gap-4 h-full border border-border/50">
                      <div className="p-3 bg-primary/10 rounded-full">
                        <tool.icon className="h-8 w-8 text-primary" />
                      </div>
                      <div>
                        <p className="font-bold text-lg mb-1">{tool.label}</p>
                        <p className="text-sm text-muted-foreground">{tool.description}</p>
                      </div>
                    </div>
                  </motion.div>
                </Link>
              ))}
            </div>
          </div>
        </section>

        <section className="py-20 md:py-28 text-foreground">
          <div className="container px-4 mx-auto md:px-6">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <motion.div
                className="max-w-md"
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, ease: 'easeOut' }}
                viewport={{ once: true, amount: 0.3 }}
              >
                <h2 className="text-4xl md:text-5xl font-bold font-headline">Enterprise-Grade Features for Everyone</h2>
                <p className="mt-4 text-muted-foreground text-lg">
                  InvoiceCraft is packed with powerful, intuitive features designed to save you time, make you look professional, and help you get paid faster.
                  Join thousands of US businesses streamlining their finances.
                </p>
                <div className="flex gap-4 mt-8">
                  <Button asChild size="lg" className="shadow-lg shadow-primary/20">
                    <Link href="/signup">
                      Start for Free <ArrowRight className="ml-2 h-5 w-5" />
                    </Link>
                  </Button>
                  <Button asChild size="lg" variant="outline">
                    <Link href="/pricing">View Pricing</Link>
                  </Button>
                </div>
              </motion.div>
              <motion.div
                className="grid grid-cols-1 sm:grid-cols-2 gap-6"
                variants={containerVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.2 }}
              >
                {FEATURES.map((feature, index) => (
                  <motion.div key={index} variants={itemVariants}>
                    <div className={`border bg-card/80 backdrop-blur-sm shadow-sm hover:shadow-lg hover:shadow-primary/10 transition-all duration-300 h-full p-6 flex flex-col rounded-xl ${feature.highlight ? 'border-primary/50 bg-primary/5' : 'border-border/50'}`}>
                      <div className="flex items-center gap-3 mb-3">
                        <div className={`p-2 rounded-lg ${feature.highlight ? 'bg-primary text-primary-foreground' : 'bg-muted text-foreground'}`}>
                          <feature.icon className="h-5 w-5" />
                        </div>
                        <h3 className="text-lg font-bold">{feature.title}</h3>
                      </div>
                      <p className="text-muted-foreground text-sm flex-1 leading-relaxed">{feature.description}</p>
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            </div>
          </div>
        </section>

        <section className="py-20 md:py-28">
          <div className="container px-4 mx-auto md:px-6">
            <div className="text-center max-w-3xl mx-auto mb-16">
              <h2 className="text-4xl md:text-5xl font-bold font-headline">Tired of Invoicing Headaches? We've Got the Solution.</h2>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-5xl mx-auto">
              {/* Problems Card */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, amount: 0.5 }}
                transition={{ duration: 0.5, ease: "easeOut" }}
              >
                <div className="h-full bg-destructive/5 border-destructive/20 border shadow-lg p-8 rounded-xl">
                  <h3 className="text-2xl font-bold font-headline mb-6 text-destructive/30">The Problems</h3>
                  <ul className="space-y-4">
                    {problems.map((item, index) => (
                      <li key={index} className="flex items-start gap-3">
                        {item.icon}
                        <span className="text-muted-foreground pt-0.5">{item.text}</span>
                      </li>
                    ))}
                  </ul>
                  <div className="mt-6">
                    <Badge variant="destructive" className="bg-destructive/10 text-destructive-foreground hover:bg-destructive/20">Before InvoiceCraft</Badge>
                  </div>
                </div>
              </motion.div>

              {/* Solutions Card */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, amount: 0.5 }}
                transition={{ duration: 0.5, ease: "easeOut" }}
              >
                <div className="h-full bg-primary/5 border-primary/20 border shadow-lg p-8 rounded-xl">
                  <h3 className="text-2xl font-bold font-headline mb-6 text-primary">The Solutions</h3>
                  <ul className="space-y-4">
                    {solutions.map((item, index) => (
                      <li key={index} className="flex items-start gap-3">
                        {item.icon}
                        <span className="text-muted-foreground pt-0.5">{item.text}</span>
                      </li>
                    ))}
                  </ul>
                  <div className="mt-6">
                    <Badge variant="secondary" className="bg-primary/10 text-primary hover:bg-primary/20">With InvoiceCraft</Badge>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        <section className="relative overflow-hidden py-24 md:py-32 bg-[#0A0A0A] text-white">
          {/* Ambient Background */}
          <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-primary/20 rounded-full blur-[120px] opacity-30 pointer-events-none"></div>
          <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-blue-500/20 rounded-full blur-[120px] opacity-30 pointer-events-none"></div>

          <div className="container relative z-10 px-4 mx-auto md:px-6">
            <div className="grid lg:grid-cols-2 gap-16 items-center">
              {/* Left Content */}
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, ease: "easeOut" }}
                className="max-w-xl"
              >
                <Badge variant="outline" className="mb-6 px-4 py-1.5 text-sm font-medium border-primary/30 text-primary bg-primary/10 backdrop-blur-md">
                  Professional Identity
                </Badge>

                <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold font-headline leading-tight mb-6">
                  Craft Your <br />
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-white to-gray-400">
                    Business Legacy.
                  </span>
                </h2>

                <p className="text-lg text-gray-400 leading-relaxed mb-8">
                  In the competitive US market, perception is reality. Stop settling for generic, uninspired invoices.
                  <strong className="text-white"> InvoiceCraft</strong> empowers you to build a cohesive brand identity with legally compliant,
                  designer-grade templates that command respect and ensure you get paid on time.
                </p>

                <div className="flex flex-col sm:flex-row gap-4">
                  <Button size="lg" asChild className="h-14 px-8 text-base bg-white text-black hover:bg-gray-200 border-none shadow-[0_0_20px_rgba(255,255,255,0.3)] transition-all hover:scale-105">
                    <Link href="/templates">
                      Explore Template Gallery
                    </Link>
                  </Button>
                  <Button size="lg" variant="outline" className="h-14 px-8 text-base border-white/20 text-white hover:bg-white/10 hover:text-white bg-transparent backdrop-blur-sm">
                    How It Works
                  </Button>
                </div>

                <div className="mt-10 flex items-center gap-6 text-sm text-gray-500">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-primary" />
                    <span>US Tax Compliant</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-primary" />
                    <span>Mobile Optimized</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-primary" />
                    <span>PDF & Web View</span>
                  </div>
                </div>
              </motion.div>

              {/* Right Showcase */}
              <div className="relative">
                {/* Decorative Elements */}
                <div className="absolute inset-0 bg-gradient-to-tr from-primary/10 to-transparent rounded-full blur-3xl -z-10"></div>

                <div className="relative z-10 p-8 rounded-3xl border border-white/10 bg-white/5 backdrop-blur-2xl shadow-2xl">
                  <div className="absolute -top-6 -right-6 bg-background/80 backdrop-blur-md border border-border/50 p-4 rounded-xl shadow-xl animate-bounce duration-[3000ms]">
                    <div className="flex items-center gap-3">
                      <div className="h-3 w-3 rounded-full bg-green-500"></div>
                      <span className="text-sm font-medium">Invoice #1024 Paid</span>
                    </div>
                  </div>

                  <TemplateShowcase />
                </div>
              </div>
            </div>
          </div>
        </section>

        <TestimonialsSection />

        <AIChatbot />
      </main>
    </div>
  );
}
