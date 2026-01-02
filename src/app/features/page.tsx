
'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import {
  LayoutDashboard, Edit, Bot, Brush, Cloud, Share2, Palette, ArrowRight, CheckCircle, Mail, Printer
} from 'lucide-react';
import React from 'react';
import { PageHeader, PageHeaderDescription, PageHeaderHeading } from '@/components/page-header';

const coreFeatures = [
    {
        icon: <LayoutDashboard className="h-8 w-8 text-primary" />,
        name: 'Cloud-Powered Dashboard',
        description: 'Manage all your invoices, estimates, and quotes in one central, secure location, accessible from anywhere.',
    },
    {
        icon: <Edit className="h-8 w-8 text-primary" />,
        name: 'Real-Time Live Preview',
        description: 'See your changes instantly. Craft the perfect document with a side-by-side preview that updates as you type.',
    },
    {
        icon: <Palette className="h-8 w-8 text-primary" />,
        name: 'Deep Customization',
        description: 'Tailor every document to your brand. Upload your logo, choose brand colors, and select professional fonts.',
    },
    {
        icon: <Brush className="h-8 w-8 text-primary" />,
        name: 'Industry-Specific Templates',
        description: 'Start with a professional advantage. Choose from over 20 templates designed for various industries.',
    },
];

const advancedFeatures = [
    {
        icon: <Bot className="h-8 w-8 text-primary" />,
        name: 'AI-Powered Workflows',
        description: 'Leverage Genkit AI to automate complex tasks like generating and emailing PDFs to your clients seamlessly.',
    },
    {
        icon: <Cloud className="h-8 w-8 text-primary" />,
        name: 'Secure Cloud Storage',
        description: 'Your documents are saved securely in the cloud using Firebase Firestore, ensuring they are always accessible and backed up.',
    },
     {
        icon: <Mail className="h-8 w-8 text-primary" />,
        name: 'Direct Emailing',
        description: 'Send documents directly to your clients from the dashboard as professional PDF attachments.',
    },
    {
        icon: <Printer className="h-8 w-8 text-primary" />,
        name: 'PDF Export',
        description: 'Easily download and save professional, print-ready PDF versions of any document you create.',
    },
    {
        icon: <Share2 className="h-8 w-8 text-primary" />,
        name: 'Shareable Links',
        description: 'Generate secure, public links to your estimates and quotes for easy online viewing and client acceptance.',
    },
    {
        icon: <CheckCircle className="h-8 w-8 text-primary" />,
        name: 'Digital Signatures',
        description: 'Enable clients to digitally sign and accept estimates and quotes directly through the shared link, streamlining approvals.',
    },
];

export default function FeaturesPage() {
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1,
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
        <div className="container px-4 mx-auto md:px-6 py-8">
            <PageHeader>
                <PageHeaderHeading>Features That Power Your Business</PageHeaderHeading>
                <PageHeaderDescription>
                    InvoiceCraft is packed with powerful, intuitive features designed to save you time, make you look professional, and help you get paid faster.
                </PageHeaderDescription>
            </PageHeader>

            {/* Core Features Section */}
            <motion.div
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto"
                variants={containerVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.2 }}
            >
                {coreFeatures.map((feature, index) => (
                    <motion.div key={index} variants={itemVariants} whileHover={{ y: -5 }} transition={{ type: 'spring', stiffness: 300 }} className="h-full">
                        <div className="border bg-card/50 shadow-lg hover:shadow-primary/20 transition-all duration-300 h-full p-6 flex flex-col items-center text-center rounded-xl">
                            {feature.icon}
                            <h3 className="text-xl font-semibold mt-4 mb-2">{feature.name}</h3>
                            <p className="text-muted-foreground text-sm flex-1">{feature.description}</p>
                        </div>
                    </motion.div>
                ))}
            </motion.div>

            {/* Advanced Features Section */}
            <div className="py-20 md:py-28">
                 <div className="text-center max-w-2xl mx-auto mb-12">
                    <h2 className="text-4xl md:text-5xl font-bold font-headline">Advanced & AI-Powered Tools</h2>
                    <p className="mt-4 text-muted-foreground">Go beyond basic invoicing with features that automate and accelerate your workflow.</p>
                </div>
                 <motion.div
                    className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto"
                    variants={containerVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, amount: 0.2 }}
                >
                    {advancedFeatures.map((feature, index) => (
                        <motion.div key={index} variants={itemVariants} whileHover={{ y: -5 }} transition={{ type: 'spring', stiffness: 300 }} className="h-full">
                             <div className="border bg-card/50 shadow-lg hover:shadow-primary/20 transition-all duration-300 h-full p-6 flex flex-col items-center text-center rounded-xl">
                                {feature.icon}
                                <h3 className="text-xl font-semibold mt-4 mb-2">{feature.name}</h3>
                                <p className="text-muted-foreground text-sm flex-1">{feature.description}</p>
                            </div>
                        </motion.div>
                    ))}
                </motion.div>
            </div>
            
             {/* CTA Section */}
            <section className="text-center py-20 md:py-28">
                 <h2 className="text-3xl md:text-4xl font-bold font-headline">Ready to Get Started?</h2>
                 <p className="mt-4 text-muted-foreground max-w-xl mx-auto">Stop wasting time on manual invoicing. Join thousands of freelancers and businesses streamlining their billing with InvoiceCraft.</p>
                 <motion.div className="mt-8" whileHover={{ scale: 1.05 }} transition={{ type: 'spring', stiffness: 300 }}>
                     <Button asChild size="lg">
                        <Link href="/dashboard">Create Your First Invoice <ArrowRight className="ml-2 h-5 w-5" /></Link>
                    </Button>
                 </motion.div>
            </section>
        </div>
    );
}
