
'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import Image from 'next/image';
import {
  FileText, FilePlus, Shield,
  LayoutDashboard, Edit, Bot, Share2, Palette, ArrowRight, XCircle, Clock, AlertCircle, CheckCircle, Search, FileClock
} from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { useTheme } from 'next-themes';
import dynamic from 'next/dynamic';
import { StackedCarousel } from '@/components/templates/stacked-carousel';
import { Badge } from '@/components/ui/badge';

const AIChatbot = dynamic(() => import('@/components/ai-chatbot').then(mod => mod.AIChatbot), { ssr: false });


const tools = [
  {
    href: '/create-invoice',
    label: 'Invoice',
    icon: <FileText className="h-10 w-10 text-primary" />,
  },
  {
    href: '/create-estimate',
    label: 'Estimate',
    icon: <FilePlus className="h-10 w-10 text-primary" />,
  },
  {
    href: '/create-quote',
    label: 'Quote',
    icon: <FileText className="h-10 w-10 text-primary" />,
  },
  {
    href: '/create-insurance',
    label: 'Insurance',
    icon: <Shield className="h-10 w-10 text-primary" />,
  },
];

const homePageFeatures = [
    {
        icon: <Edit className="h-8 w-8 text-primary" />,
        name: 'Live Preview',
        description: 'See your changes in real-time as you build your document, ensuring a perfect result.',
    },
    {
        icon: <LayoutDashboard className="h-8 w-8 text-primary" />,
        name: 'Cloud Dashboard',
        description: 'Securely access and manage all your documents from anywhere.',
    },
    {
        icon: <Share2 className="h-8 w-8 text-primary" />,
        name: 'Share & Collaborate',
        description: 'Email documents directly to clients or share public links for online viewing and acceptance.',
    },
    {
        icon: <Palette className="h-8 w-8 text-primary" />,
        name: 'Deep Customization',
        description: 'Personalize documents with your logo, brand colors, and professional templates.',
    },
    {
        icon: <Bot className="h-8 w-8 text-primary" />,
        name: 'AI-Powered Workflow',
        description: 'Leverage Genkit AI for intelligent features like automated PDF generation for emails.',
    }
];

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


export default function HomePage() {
  const [mounted, setMounted] = useState(false);
  const { theme } = useTheme();

  useEffect(() => {
    setMounted(true);
  }, []);

  const heroImageSrc = '/home/invocie.png';

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
                className="max-w-xl text-center lg:text-left"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, ease: 'easeOut' }}
              >
                <motion.p 
                  className="mb-2 text-sm font-bold tracking-wider uppercase text-primary"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.2 }}
                >
                  Welcome to InvoiceCraft
                </motion.p>
                <motion.h1 
                  className="text-3xl font-bold tracking-tight md:text-4xl lg:text-5xl font-headline"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.3 }}
                >
                  Let's Control Your Business With{' '}
                  <span className="relative inline-block">
                    InvoiceCraft
                     <svg className="absolute -bottom-1.5 left-0 w-full" viewBox="0 0 240 10" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M2 8C52.0019 3.66667 157.005 -2.00001 238 4" stroke="hsl(var(--primary))" strokeWidth="4" strokeLinecap="round"/>
                    </svg>
                  </span>
                </motion.h1>
                <motion.p 
                  className="mt-6 text-base text-muted-foreground md:text-lg"
                   initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.4 }}
                >
                  We develop beautiful and functional documents for desktop, tablet,
                  and mobile.
                </motion.p>
                <motion.div 
                  className="flex flex-col items-center justify-center gap-4 mt-8 sm:flex-row lg:justify-start"
                   initial={{ opacity: 0 }}
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
              <div className="relative w-full h-80 lg:h-auto lg:aspect-[4/3] animate-flip">
                 <Image
                    key={heroImageSrc} // Key changes to force re-render on theme switch
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
                    <h2 className="text-4xl md:text-5xl font-bold font-headline">A Tool for Every Need</h2>
                    <p className="mt-4 text-muted-foreground">Whether you're billing a client, estimating a project, or quoting a price, we have you covered.</p>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                    {tools.map((tool) => (
                        <Link href={tool.href} key={tool.href} className="group">
                            <motion.div whileHover={{ y: -8, scale: 1.05 }} transition={{ type: "spring", stiffness: 300 }} className="h-full">
                                <div className="bg-card/50 backdrop-blur-sm shadow-lg group-hover:shadow-primary/20 transition-all duration-300 rounded-xl p-6 flex flex-col items-center text-center gap-4 h-full">
                                    {React.cloneElement(tool.icon, { className: "h-10 w-10 text-primary" })}
                                    <p className="font-semibold text-lg">{tool.label}</p>
                                </div>
                            </motion.div>
                        </Link>
                    ))}
                </div>
            </div>
        </section>
        
         <section className="py-20 md:py-28 text-foreground">
             <div className="container px-4 mx-auto md:px-6">
                <div className="text-center max-w-2xl mx-auto mb-12">
                    <h2 className="text-4xl md:text-5xl font-bold font-headline">Features That Power Your Business</h2>
                    <p className="mt-4 text-muted-foreground">InvoiceCraft is packed with powerful, intuitive features designed to save you time, make you look professional, and help you get paid faster.</p>
                </div>
                 <div 
                    className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto"
                  >
                    {homePageFeatures.map((feature, index) => (
                        <div key={index}>
                             <motion.div whileHover={{ y: -8, scale: 1.02 }} transition={{ type: "spring", stiffness: 300 }} className="h-full">
                                <div className="border bg-card/80 shadow-lg hover:shadow-primary/20 transition-all duration-300 h-full p-6 flex flex-col items-center text-center rounded-xl">
                                    {React.cloneElement(feature.icon, { className: "h-8 w-8 text-primary" })}
                                    <h3 className="text-xl font-semibold mt-4 mb-2">{feature.name}</h3>
                                    <p className="text-muted-foreground text-sm flex-1">{feature.description}</p>
                                </div>
                            </motion.div>
                        </div>
                    ))}
                </div>
                <div className="text-center mt-12">
                    <Button asChild size="lg">
                        <Link href="/features">
                            Explore More Features <ArrowRight className="ml-2 h-5 w-5" />
                        </Link>
                    </Button>
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

        <StackedCarousel />

        <AIChatbot />
      </main>
    </div>
  );
}
