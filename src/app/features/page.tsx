
'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import Marquee from '@/components/marquee';
import { motion } from 'framer-motion';
import Image from 'next/image';
import {
  FileText, FilePlus, Shield, HardHat, Code, Store, Car, Camera, Building, Scale, HeartPulse,
  LayoutDashboard, Edit, Bot, Brush, Cloud, Share2, Palette, ArrowRight
} from 'lucide-react';
import React from 'react';
import { Carousel, CarouselContent, CarouselItem } from '@/components/ui/carousel';
import Autoplay from "embla-carousel-autoplay";
import { Card, CardContent } from '@/components/ui/card';
import { PageHeader, PageHeaderDescription, PageHeaderHeading } from '@/components/page-header';

const homePageFeatures = [
    {
        icon: <Edit className="h-8 w-8 text-primary" />,
        name: 'Live Preview',
        description: 'See your changes in real-time as you build your document, ensuring a perfect result.',
        className: 'md:col-span-2',
    },
    {
        icon: <LayoutDashboard className="h-8 w-8 text-primary" />,
        name: 'Cloud-Powered Dashboard',
        description: 'Securely access and manage all your documents from anywhere with our Firestore-backed dashboard.',
        className: '',
    },
    {
        icon: <Share2 className="h-8 w-8 text-primary" />,
        name: 'Share & Collaborate',
        description: 'Email documents directly to clients or share public links for online viewing and acceptance.',
        className: '',
    },
    {
        icon: <Palette className="h-8 w-8 text-primary" />,
        name: 'Deep Customization',
        description: 'Personalize documents with your logo, brand colors, and professional templates.',
        className: '',
    },
    {
        icon: <Bot className="h-8 w-8 text-primary" />,
        name: 'AI-Powered Workflow',
        description: 'Leverage Genkit AI for intelligent features like automated PDF generation for emails.',
        className: 'md:col-span-2',
    }
];

export default function FeaturesPage() {
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
        <div className="container px-4 mx-auto md:px-6">
            <PageHeader>
                <PageHeaderHeading>Features That Power Your Business</PageHeaderHeading>
                <PageHeaderDescription>
                    InvoiceCraft is packed with powerful, intuitive features designed to save you time, make you look professional, and help you get paid faster.
                </PageHeaderDescription>
            </PageHeader>
            <motion.div
                className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-6xl mx-auto"
                variants={containerVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.2 }}
            >
                {homePageFeatures.map((feature, index) => (
                    <motion.div key={index} variants={itemVariants} className={feature.className}>
                        <motion.div whileHover={{ y: -8, scale: 1.02 }} transition={{ type: "spring", stiffness: 300 }} className="h-full">
                            <Card className="border bg-card shadow-lg hover:shadow-primary/20 transition-all duration-300 h-full p-6 flex flex-col items-center text-center">
                                {feature.icon}
                                <h3 className="text-xl font-semibold mt-4 mb-2">{feature.name}</h3>
                                <p className="text-muted-foreground text-sm flex-1">{feature.description}</p>
                            </Card>
                        </motion.div>
                    </motion.div>
                ))}
            </motion.div>
        </div>
    );
}
