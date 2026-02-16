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
        <section className="relative w-full py-24 overflow-hidden md:py-32 lg:py-40">
          {/* Advanced Background Mesh */}
          <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
            <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/20 rounded-full blur-[120px] animate-pulse transition-all duration-[10000ms]"></div>
            <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-blue-500/10 rounded-full blur-[150px] animate-pulse delay-700"></div>
            <svg className="absolute inset-0 w-full h-full opacity-[0.03] dark:opacity-[0.05]" viewBox="0 0 100 100" preserveAspectRatio="none">
              <defs>
                <pattern id="grid" width="10" height="10" patternUnits="userSpaceOnUse">
                  <path d="M 10 0 L 0 0 0 10" fill="none" stroke="currentColor" strokeWidth="0.5" />
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#grid)" />
            </svg>
          </div>

          <div className="container px-4 mx-auto md:px-6 relative z-10">
            <div className="grid gap-16 lg:grid-cols-2 lg:gap-24 items-center">
              <motion.div
                className="max-w-2xl text-center lg:text-left mx-auto lg:mx-0"
                initial="hidden"
                animate="visible"
                variants={containerVariants}
              >
                <motion.div variants={itemVariants} className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 mb-6 group cursor-default">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
                  </span>
                  <span className="text-xs font-bold tracking-wider uppercase text-primary">New: v2.0 AI-Powered Billing</span>
                </motion.div>

                <motion.h1
                  variants={itemVariants}
                  className="text-4xl font-extrabold tracking-tight md:text-6xl lg:text-7xl font-headline leading-[1.1]"
                >
                  Master Your <br />
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-blue-500 to-primary bg-[length:200%_auto] animate-gradient-x">
                    Business Workflow
                  </span>
                </motion.h1>

                <motion.p
                  variants={itemVariants}
                  className="mt-8 text-lg text-muted-foreground md:text-xl max-w-lg leading-relaxed mx-auto lg:mx-0"
                >
                  The professional toolkit for US freelancers and agencies.
                  Automate billing, command respect, and get paid faster than ever before.
                </motion.p>

                <motion.div
                  variants={itemVariants}
                  className="flex flex-col items-center justify-center gap-4 mt-10 sm:flex-row lg:justify-start"
                >
                  <Button asChild size="lg" className="h-14 px-8 text-base rounded-full shadow-2xl shadow-primary/20 hover:scale-105 transition-all duration-300">
                    <Link href="/dashboard" className="flex items-center gap-2">
                      Get Started Free <ArrowRight className="h-4 w-4" />
                    </Link>
                  </Button>
                  <Button asChild size="lg" variant="outline" className="h-14 px-8 text-base rounded-full border-2 hover:bg-secondary/50 transition-all">
                    <Link href="/templates">Explore Templates</Link>
                  </Button>
                </motion.div>

                <motion.div
                  variants={itemVariants}
                  className="mt-12 flex items-center justify-center lg:justify-start gap-8 opacity-60 grayscale hover:grayscale-0 transition-all duration-500"
                >
                  <div className="flex flex-col items-center lg:items-start">
                    <span className="text-2xl font-bold font-headline">2k+</span>
                    <span className="text-[10px] uppercase tracking-widest font-bold">Active Users</span>
                  </div>
                  <div className="h-8 w-px bg-border/50"></div>
                  <div className="flex flex-col items-center lg:items-start">
                    <span className="text-2xl font-bold font-headline">10k+</span>
                    <span className="text-[10px] uppercase tracking-widest font-bold">Invoices Sent</span>
                  </div>
                </motion.div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, scale: 0.9, x: 20 }}
                animate={{ opacity: 1, scale: 1, x: 0 }}
                transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
                className="relative lg:block"
              >
                {/* Glassmorphic Illustration Container */}
                <div className="relative group">
                  <motion.div
                    animate={{ y: [0, -15, 0] }}
                    transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
                    className="relative z-10 w-full h-[400px] md:h-[500px] lg:h-[600px] rounded-3xl overflow-hidden border border-white/10 shadow-2xl backdrop-blur-sm bg-white/5"
                  >
                    <Image
                      src={heroImageSrc}
                      alt="InvoiceCraft Professional Dashboard"
                      fill
                      priority
                      className="object-cover transition-transform duration-700 group-hover:scale-105"
                      sizes="(max-width: 1024px) 100vw, 50vw"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-background/20 via-transparent to-transparent pointer-events-none"></div>
                  </motion.div>

                  {/* Decorative Glass Elements */}
                  <motion.div
                    animate={{ y: [0, 20, 0], x: [0, 10, 0] }}
                    transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
                    className="absolute -top-10 -left-10 w-40 h-40 bg-primary/20 backdrop-blur-xl rounded-full border border-white/10 -z-10"
                  ></motion.div>
                  <motion.div
                    animate={{ y: [0, -25, 0], x: [0, -15, 0] }}
                    transition={{ duration: 7, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                    className="absolute -bottom-10 -right-10 w-56 h-56 bg-blue-500/10 backdrop-blur-xl rounded-full border border-white/10 -z-10"
                  ></motion.div>
                </div>

                {/* Performance Badge Floating */}
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1, duration: 0.5 }}
                  className="absolute -bottom-6 -left-6 md:left-12 bg-card/90 backdrop-blur-md border border-border/50 p-4 rounded-2xl shadow-2xl z-20 flex items-center gap-4"
                >
                  <div className="h-10 w-10 rounded-full bg-green-500/20 flex items-center justify-center">
                    <CheckCircle className="h-6 w-6 text-green-500" />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground font-medium">Auto-Calculations</p>
                    <p className="text-sm font-bold">100% Accuracy</p>
                  </div>
                </motion.div>
              </motion.div>
            </div>
          </div>
        </section>

        <motion.section
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="py-24 md:py-32 bg-primary/5 rounded-[3rem] mx-4 md:mx-8 border border-primary/10 relative overflow-hidden"
        >
          {/* Section Background Decoration */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl pointer-events-none"></div>

          <div className="container px-4 mx-auto md:px-6 relative z-10">
            <div className="text-center max-w-2xl mx-auto mb-16">
              <motion.h2
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="text-4xl md:text-6xl font-extrabold font-headline leading-tight"
              >
                Everything You Need <br /> To <span className="text-primary">Scale Faster</span>
              </motion.h2>
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                viewport={{ once: true }}
                className="mt-6 text-muted-foreground text-lg italic"
              >
                "The essential toolkit for modern contractors, freelancers, and growing American agencies."
              </motion.p>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {TOOLS.map((tool, idx) => (
                <Link href={tool.href} key={tool.href} className="group">
                  <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.1 }}
                    viewport={{ once: true }}
                    whileHover={{ y: -10, scale: 1.02 }}
                    className="h-full"
                  >
                    <div className="bg-card/50 backdrop-blur-md shadow-[0_8px_30px_rgb(0,0,0,0.04)] group-hover:shadow-[0_8px_30px_rgb(var(--primary-rgb),0.1)] transition-all duration-500 rounded-3xl p-8 flex flex-col items-center text-center gap-6 h-full border border-border/50 group-hover:border-primary/20">
                      <div className="p-4 bg-primary/5 rounded-2xl group-hover:bg-primary/10 transition-colors">
                        <tool.icon className="h-10 w-10 text-primary transition-transform duration-500 group-hover:scale-110" />
                      </div>
                      <div>
                        <p className="font-bold text-xl mb-2 group-hover:text-primary transition-colors">{tool.label}</p>
                        <p className="text-sm text-muted-foreground leading-relaxed">{tool.description}</p>
                      </div>
                    </div>
                  </motion.div>
                </Link>
              ))}
            </div>
          </div>
        </motion.section>

        <section className="py-24 md:py-32 text-foreground overflow-hidden">
          <div className="container px-4 mx-auto md:px-6">
            <div className="grid lg:grid-cols-2 gap-20 items-center">
              <motion.div
                className="max-w-2xl px-4 lg:px-0"
                initial={{ opacity: 0, x: -50 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, ease: 'easeOut' }}
                viewport={{ once: true, amount: 0.3 }}
              >
                <Badge className="mb-6 bg-primary/10 text-primary border-primary/20 hover:bg-primary/20 px-4 py-1">Enterprise Grade</Badge>
                <h2 className="text-4xl md:text-6xl font-extrabold font-headline leading-[1.1] mb-8">
                  Powerful Features <br />
                  <span className="text-muted-foreground/50">Simplified for You.</span>
                </h2>
                <p className="text-xl text-muted-foreground leading-relaxed mb-10">
                  InvoiceCraft is packed with intuitive features designed to save you time, make you look professional, and help you get paid faster.
                  Join thousands of US businesses streamlining their finances.
                </p>
                <div className="flex flex-wrap gap-6 items-center">
                  <Button asChild size="lg" className="h-14 px-8 rounded-full shadow-xl shadow-primary/20 group">
                    <Link href="/signup">
                      Start for Free <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                    </Link>
                  </Button>
                  <Link href="/pricing" className="text-sm font-bold border-b-2 border-primary/30 hover:border-primary transition-colors">View Pricing Plans</Link>
                </div>
              </motion.div>

              <motion.div
                className="grid grid-cols-1 sm:grid-cols-2 gap-6 relative"
                variants={containerVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.2 }}
              >
                {/* Decorative background for features grid */}
                <div className="absolute inset-0 bg-primary/5 blur-3xl rounded-full -z-10 animate-pulse"></div>

                {FEATURES.map((feature, index) => (
                  <motion.div key={index} variants={itemVariants}>
                    <div className={`border p-8 backdrop-blur-xl transition-all duration-500 h-full flex flex-col rounded-3xl group cursor-default shadow-sm hover:shadow-2xl hover:-translate-y-2 ${feature.highlight ? 'border-primary/30 bg-primary/5 ring-1 ring-primary/10' : 'border-border/50 bg-card/60'}`}>
                      <div className="flex items-center gap-4 mb-4">
                        <div className={`p-3 rounded-2xl transition-all duration-500 group-hover:scale-110 ${feature.highlight ? 'bg-primary text-primary-foreground shadow-lg shadow-primary/20' : 'bg-muted text-foreground'}`}>
                          <feature.icon className="h-6 w-6" />
                        </div>
                        <h3 className="text-xl font-bold font-headline">{feature.title}</h3>
                      </div>
                      <p className="text-muted-foreground text-sm flex-1 leading-relaxed">{feature.description}</p>
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            </div>
          </div>
        </section>

        <motion.section
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="py-24 md:py-32 bg-[#0A0A0A] dark:bg-black rounded-[3rem] mx-4 md:mx-8 mb-24 relative overflow-hidden text-white"
        >
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-primary/5 animate-pulse blur-[150px]"></div>

          <div className="container px-4 mx-auto md:px-6 relative z-10">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center max-w-3xl mx-auto mb-20"
            >
              <h2 className="text-4xl md:text-6xl font-extrabold font-headline text-white mb-6">Stop The Invoicing Headache.</h2>
              <p className="text-gray-400 text-lg">We've identified the core hurdles and built the ultimate solution.</p>
            </motion.div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 max-w-6xl mx-auto">
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className="group h-full bg-white/5 border-white/10 border backdrop-blur-xl shadow-inner-white p-10 rounded-[2.5rem] relative overflow-hidden"
              >
                <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:opacity-20 transition-opacity">
                  <Clock className="w-32 h-32" />
                </div>
                <h3 className="text-3xl font-bold font-headline mb-8 text-white/40">The Old Way</h3>
                <ul className="space-y-6">
                  {problems.map((item, index) => (
                    <motion.li
                      key={index}
                      initial={{ opacity: 0, x: -10 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="flex items-center gap-4 text-gray-400"
                    >
                      <div className="h-2 w-2 rounded-full bg-destructive/50"></div>
                      <span>{item.text}</span>
                    </motion.li>
                  ))}
                </ul>
                <div className="mt-10 border-t border-white/5 pt-8">
                  <p className="text-xs uppercase tracking-[0.2em] font-black text-gray-600">Standard Business Process</p>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.1 }}
                className="group h-full bg-primary/10 border-primary/30 border backdrop-blur-xl shadow-2xl p-10 rounded-[2.5rem] relative overflow-hidden"
              >
                <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:opacity-20 transition-opacity">
                  <CheckCircle className="w-32 h-32" />
                </div>
                <h3 className="text-3xl font-bold font-headline mb-8 text-primary">The InvoiceCraft Way</h3>
                <ul className="space-y-6">
                  {solutions.map((item, index) => (
                    <motion.li
                      key={index}
                      initial={{ opacity: 0, x: 10 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="flex items-center gap-4 text-white"
                    >
                      <CheckCircle className="h-5 w-5 text-primary" />
                      <span>{item.text}</span>
                    </motion.li>
                  ))}
                </ul>
                <div className="mt-10 border-t border-white/5 pt-8">
                  <p className="text-xs uppercase tracking-[0.2em] font-black text-primary/60">Optimized Workflow 2024</p>
                </div>
              </motion.div>
            </div>
          </div>
        </motion.section>

        <motion.section
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1 }}
          className="relative overflow-hidden py-24 md:py-32 bg-[#0A0A0A] text-white"
        >
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
        </motion.section>

        <TestimonialsSection />

        <AIChatbot />
      </main>
    </div>
  );
}
