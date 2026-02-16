'use client';

import { PageHeader, PageHeaderDescription, PageHeaderHeading } from "@/components/page-header";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Download, ExternalLink, Image as ImageIcon, FileText, Share2, Sparkles, Newspaper } from "lucide-react";
import { motion } from "framer-motion";

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
    hidden: { opacity: 0, scale: 0.95 },
    visible: {
        opacity: 1,
        scale: 1,
        transition: {
            duration: 0.5,
        },
    },
};

export default function PressPage() {
    const assets = [
        {
            title: "Core Brand Identity",
            description: "Official logos in high-resolution PNG, SVG, and vector formats for light and dark backgrounds.",
            icon: <ImageIcon className="w-6 h-6" />,
            type: "Vector Kit"
        },
        {
            title: "Product Showcase",
            description: "Premium screenshots of the InvoiceCraft dashboard and mobile app in high-fidelity.",
            icon: <Share2 className="w-6 h-6" />,
            type: "4K Screenshots"
        },
        {
            title: "Founder's Briefing",
            description: "A comprehensive document covering our history, US mission, and technological architecture.",
            icon: <FileText className="w-6 h-6" />,
            type: "PDF Manifesto"
        }
    ];

    return (
        <div className="relative min-h-screen pt-20 pb-24 overflow-hidden">
            {/* Mesh Background */}
            <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_50%_0%,rgba(0,102,255,0.05)_0%,transparent_50%)] -z-10"></div>
            <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[120px] -z-10"></div>

            <div className="container mx-auto px-4 md:px-6">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                >
                    <PageHeader className="items-center text-center">
                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-xs font-bold uppercase tracking-widest mb-6">
                            <Newspaper className="w-4 h-4 text-primary" /> Official Media Hub
                        </div>
                        <PageHeaderHeading className="text-4xl md:text-7xl font-black tracking-tighter mb-6">
                            The <span className="text-primary italic">Media</span> Toolkit
                        </PageHeaderHeading>
                        <PageHeaderDescription className="max-w-3xl text-lg text-muted-foreground leading-relaxed mx-auto">
                            Welcome to the InvoiceCraft Press Center. We provide high-fidelity assets and resources
                            for journalists, creators, and business analysts covering the US fintech landscape.
                        </PageHeaderDescription>
                    </PageHeader>
                </motion.div>

                {/* Assets Showcase */}
                <div className="mt-20">
                    <motion.div
                        className="grid grid-cols-1 md:grid-cols-3 gap-8"
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                        variants={containerVariants}
                    >
                        {assets.map((asset) => (
                            <motion.div key={asset.title} variants={itemVariants}>
                                <Card className="h-full border-white/10 bg-white/5 backdrop-blur-3xl group hover:border-primary/50 transition-all duration-500 rounded-[2rem] overflow-hidden">
                                    <CardHeader className="p-8">
                                        <div className="flex justify-between items-start mb-6">
                                            <div className="p-4 rounded-2xl bg-white/5 text-primary group-hover:bg-primary group-hover:text-white transition-all">
                                                {asset.icon}
                                            </div>
                                            <span className="text-[10px] font-black uppercase tracking-widest text-gray-500 bg-white/5 px-3 py-1 rounded-full">
                                                {asset.type}
                                            </span>
                                        </div>
                                        <CardTitle className="text-2xl font-bold mb-2">{asset.title}</CardTitle>
                                        <CardDescription className="text-gray-400 text-sm leading-relaxed">
                                            {asset.description}
                                        </CardDescription>
                                    </CardHeader>
                                    <CardContent className="p-8 pt-0">
                                        <Button className="w-full h-14 rounded-2xl bg-white/5 border border-white/10 hover:bg-primary hover:border-primary text-white font-bold group">
                                            Download Assets <Download className="w-4 h-4 ml-2 group-hover:translate-y-1 transition-transform" />
                                        </Button>
                                    </CardContent>
                                </Card>
                            </motion.div>
                        ))}
                    </motion.div>
                </div>

                {/* Media Contact Section */}
                <motion.div
                    className="mt-20 p-12 md:p-20 rounded-[3rem] bg-[#0A0A0A] border border-white/5 relative overflow-hidden"
                    initial={{ opacity: 0, scale: 0.98 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.8 }}
                    viewport={{ once: true }}
                >
                    <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 rounded-full blur-[80px] -z-10"></div>

                    <div className="grid lg:grid-cols-2 gap-16 items-center">
                        <div className="space-y-6">
                            <h2 className="text-3xl md:text-5xl font-black tracking-tight">Need More <span className="text-primary italic">Context?</span></h2>
                            <p className="text-gray-400 text-lg leading-relaxed">
                                For exclusive interviews, deep-dive data analysis on US invoicing trends,
                                or high-res custom assets, our media relations team is available 24/7.
                            </p>
                            <div className="flex flex-wrap gap-4 pt-4">
                                <Button variant="outline" className="h-14 px-8 rounded-2xl border-white/10 bg-white/5 hover:bg-white/10">
                                    <ExternalLink className="w-4 h-4 mr-2" /> View Brand Guidelines
                                </Button>
                                <Button variant="ghost" className="h-14 px-8 rounded-2xl text-gray-400 hover:text-white">
                                    Request custom Assets
                                </Button>
                            </div>
                        </div>

                        <div className="flex flex-col items-center lg:items-end gap-6">
                            <div className="p-8 rounded-full bg-primary/5 border border-primary/20">
                                <Sparkles className="w-16 h-16 text-primary animate-pulse" />
                            </div>
                            <div className="text-center lg:text-right">
                                <p className="text-xs font-black uppercase tracking-[0.3em] text-gray-500 mb-2">Primary Media Contact</p>
                                <a href="mailto:press@invoicecraft.app" className="text-2xl md:text-3xl font-black text-white hover:text-primary transition-colors">
                                    press@invoicecraft.app
                                </a>
                            </div>
                        </div>
                    </div>
                </motion.div>

                {/* Social Proof Bar */}
                <div className="mt-20 py-12 border-t border-white/5 flex flex-wrap justify-between items-center gap-12 opacity-30 saturate-0">
                    <span className="text-sm font-black uppercase tracking-[0.4em]">TechCrunch</span>
                    <span className="text-sm font-black uppercase tracking-[0.4em]">The Verge</span>
                    <span className="text-sm font-black uppercase tracking-[0.4em]">Product Hunt</span>
                    <span className="text-sm font-black uppercase tracking-[0.4em]">Vogue Business</span>
                    <span className="text-sm font-black uppercase tracking-[0.4em]">Fast Company</span>
                </div>
            </div>
        </div>
    );
}
