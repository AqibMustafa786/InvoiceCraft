'use client';

import { FEATURES } from '@/lib/features';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowRight, CheckCircle2, Zap } from 'lucide-react';
import React, { useMemo } from 'react';
import { Badge } from '@/components/ui/badge';

export default function FeaturesPage() {
    // Group features by category
    const groupedFeatures = useMemo(() => {
        const groups: Record<string, typeof FEATURES> = {};
        FEATURES.forEach(feature => {
            const category = feature.category || 'Other';
            if (!groups[category]) {
                groups[category] = [];
            }
            groups[category].push(feature);
        });
        return groups;
    }, []);

    // Define category order and display names
    // Categories: Core, Editor, Client Experience, Customization, Management, Payments, Advanced, Security
    const categoryOrder = [
        { key: 'Core', label: 'Core Essentials', description: 'Everything you need to create professional documents.' },
        { key: 'Management', label: 'Business Management', description: 'Keep track of clients, income, and business health.' },
        { key: 'Client Experience', label: 'Client Portal & Experience', description: 'Impress your clients with a seamless digital experience.' },
        { key: 'Payments', label: 'Payments & Finance', description: 'Get paid faster with integrated payment solutions.' },
        { key: 'Customization', label: 'Branding & Design', description: 'Make every document uniquely yours.' },
        { key: 'Advanced', label: 'Advanced Tools & AI', description: 'Leverage the power of AI to work smarter, not harder.' },
        { key: 'Security', label: 'Security & Compliance', description: 'Enterprise-grade security for your peace of mind.' },
    ];

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
        <div className="flex flex-col min-h-screen">
            {/* Hero Section */}
            <section className="relative w-full py-20 overflow-hidden md:py-32 lg:py-40 bg-background">
                <div className="absolute inset-0 z-0">
                    <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-[100px] opacity-50"></div>
                    <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-[100px] opacity-50"></div>
                    <svg className="absolute inset-0 w-full h-full opacity-[0.03]" xmlns="http://www.w3.org/2000/svg">
                        <defs>
                            <pattern id="grid-pattern" width="40" height="40" patternUnits="userSpaceOnUse">
                                <path d="M 40 0 L 0 0 0 40" fill="none" stroke="currentColor" strokeWidth="1" />
                            </pattern>
                        </defs>
                        <rect width="100%" height="100%" fill="url(#grid-pattern)" />
                    </svg>
                </div>

                <div className="container relative z-10 px-4 mx-auto text-center md:px-6">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                    >
                        <Badge variant="outline" className="mb-6 px-4 py-1 text-sm border-primary/20 bg-primary/5 text-primary">
                            Feature Tour 2026
                        </Badge>
                        <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl md:text-6xl lg:text-7xl font-headline bg-clip-text text-transparent bg-gradient-to-r from-foreground via-foreground to-muted-foreground pb-2">
                            Power Your Business <br className="hidden md:block" /> with <span className="text-primary">InvoiceCraft</span>
                        </h1>
                        <p className="max-w-[700px] mx-auto mt-6 text-lg text-muted-foreground md:text-xl leading-relaxed">
                            We provide a comprehensive suite of tools designed specifically for US freelancers, contractors, and agencies to automate their workflow and get paid faster.
                        </p>
                        <div className="flex flex-col items-center justify-center gap-4 mt-10 sm:flex-row">
                            <Button asChild size="lg" className="h-12 px-8 text-base shadow-lg shadow-primary/25 transition-transform hover:scale-105">
                                <Link href="/signup">
                                    Start for Free <ArrowRight className="ml-2 h-5 w-5" />
                                </Link>
                            </Button>
                            <Button asChild size="lg" variant="outline" className="h-12 px-8 text-base transition-transform hover:scale-105 bg-background/50 backdrop-blur-sm">
                                <Link href="/pricing">View Pricing</Link>
                            </Button>
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* Feature Categories */}
            <div className="container px-4 mx-auto md:px-6 pb-20">
                <div className="space-y-24 md:space-y-32">
                    {categoryOrder.map((category, catIndex) => {
                        const features = groupedFeatures[category.key];
                        if (!features || features.length === 0) return null;

                        return (
                            <section key={category.key} className="scroll-mt-24" id={category.key.toLowerCase().replace(/\s+/g, '-')}>
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true, margin: "-100px" }}
                                    transition={{ duration: 0.5 }}
                                    className="mb-12 md:mb-16"
                                >
                                    <div className="flex items-center gap-4 mb-4">
                                        <div className="h-1 w-12 bg-primary rounded-full"></div>
                                        <h2 className="text-3xl font-bold tracking-tight md:text-4xl font-headline">{category.label}</h2>
                                    </div>
                                    <p className="text-lg text-muted-foreground max-w-2xl">{category.description}</p>
                                </motion.div>

                                <motion.div
                                    variants={containerVariants}
                                    initial="hidden"
                                    whileInView="visible"
                                    viewport={{ once: true, margin: "-50px" }}
                                    className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                                >
                                    {features.map((feature, index) => (
                                        <motion.div key={feature.title} variants={itemVariants} className="h-full">
                                            <div className={`group relative h-full overflow-hidden rounded-2xl border bg-card/50 p-6 transition-all duration-300 hover:shadow-xl hover:shadow-primary/5 hover:-translate-y-1 ${feature.highlight ? 'border-primary/20 bg-primary/5' : 'border-border/50'}`}>
                                                <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

                                                <div className="relative z-10 flex flex-col h-full">
                                                    <div className={`mb-4 inline-flex items-center justify-center w-12 h-12 rounded-xl ${feature.highlight ? 'bg-primary text-primary-foreground' : 'bg-muted text-foreground group-hover:bg-primary/10 group-hover:text-primary'} transition-colors duration-300`}>
                                                        <feature.icon className="h-6 w-6" />
                                                    </div>

                                                    <h3 className="text-xl font-bold mb-2 flex items-center gap-2">
                                                        {feature.title}
                                                        {feature.highlight && <Zap className="h-4 w-4 text-yellow-500 fill-yellow-500" />}
                                                    </h3>

                                                    <p className="text-muted-foreground leading-relaxed flex-grow">
                                                        {feature.description}
                                                    </p>

                                                    {feature.highlight && (
                                                        <div className="mt-4 pt-4 border-t border-primary/10 flex items-center text-xs font-medium text-primary uppercase tracking-wider">
                                                            <CheckCircle2 className="h-3.5 w-3.5 mr-1.5" /> Premium Feature
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        </motion.div>
                                    ))}
                                </motion.div>
                            </section>
                        );
                    })}
                </div>
            </div>

            {/* CTA Section */}
            <section className="relative py-20 overflow-hidden md:py-28 bg-primary/5 border-y border-primary/10">
                <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent"></div>
                <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent"></div>

                <div className="container px-4 mx-auto text-center md:px-6 relative z-10">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5 }}
                    >
                        <h2 className="text-4xl md:text-5xl font-bold font-headline mb-6">Ready to Streamline Your Workflow?</h2>
                        <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-10">
                            Join thousands of businesses that trust InvoiceCraft to look professional and get paid faster. No credit card required to start.
                        </p>
                        <div className="flex flex-col sm:flex-row justify-center gap-4">
                            <Button asChild size="lg" className="h-14 px-8 text-lg shadow-xl shadow-primary/20">
                                <Link href="/signup">Create Free Account</Link>
                            </Button>
                            <Button asChild size="lg" variant="outline" className="h-14 px-8 text-lg bg-background">
                                <Link href="/templates">Explore Templates</Link>
                            </Button>
                        </div>
                        <p className="mt-6 text-sm text-muted-foreground/60">
                            Free plan includes 5 documents/month. No hidden fees.
                        </p>
                    </motion.div>
                </div>
            </section>
        </div>
    );
}
