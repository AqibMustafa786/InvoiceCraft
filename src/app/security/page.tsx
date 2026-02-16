'use client';

import { PageHeader, PageHeaderDescription, PageHeaderHeading } from "@/components/page-header";
import { motion } from "framer-motion";
import { ShieldCheck, Lock, Fingerprint, Database, Zap, ArrowRight, ShieldAlert, Cpu } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

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
        transition: {
            duration: 0.5,
        },
    },
};

export default function SecurityPage() {
    return (
        <div className="relative min-h-screen pt-20 pb-24 overflow-hidden">
            {/* Dynamic Security Grid Background */}
            <div className="absolute top-0 left-0 w-full h-full opacity-[0.02] pointer-events-none -z-10 bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:32px_32px]"></div>
            <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-primary/10 rounded-full blur-[150px] -z-10 animate-pulse"></div>

            <div className="container mx-auto px-4 md:px-8 max-w-6xl">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                >
                    <PageHeader className="items-center text-center">
                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-primary text-[10px] font-black uppercase tracking-[0.2em] mb-8">
                            <ShieldCheck className="w-4 h-4" /> Bank-Level Protocol
                        </div>
                        <PageHeaderHeading className="text-4xl md:text-7xl font-black tracking-tighter mb-6">
                            Security is our <span className="text-primary italic">DNA</span>
                        </PageHeaderHeading>
                        <PageHeaderDescription className="max-w-3xl text-lg text-muted-foreground leading-relaxed mx-auto">
                            In an era of high-frequency data breaches, we've built the most secure invoicing platform for the American market.
                            Our zero-storage architecture ensures your business data never leaves your command.
                        </PageHeaderDescription>
                    </PageHeader>
                </motion.div>

                {/* Core Security Pillars */}
                <div className="grid md:grid-cols-3 gap-8 mt-20">
                    {[
                        {
                            icon: <Lock className="w-8 h-8" />,
                            title: "Zero-Storage",
                            description: "We don't just secure your data—we don't even see it. Your files live only in your encrypted browser sandbox.",
                            status: "Active"
                        },
                        {
                            icon: <Cpu className="w-8 h-8" />,
                            title: "Local Synthesis",
                            description: "PDF generation and tax calculations happen 100% on your device, powered by our high-performance local engine.",
                            status: "Enabled"
                        },
                        {
                            icon: <ShieldAlert className="w-8 h-8" />,
                            title: "Threat Immunity",
                            description: "By eliminating server-side storage, we've wiped out the primary risk factor for enterprise-level data leaks.",
                            status: "Certified"
                        }
                    ].map((pillar, idx) => (
                        <motion.div
                            key={pillar.title}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ delay: idx * 0.1 }}
                            viewport={{ once: true }}
                            className="p-8 rounded-[2rem] border border-white/10 bg-white/5 backdrop-blur-xl group hover:border-primary/50 transition-all"
                        >
                            <div className="flex justify-between items-start mb-6">
                                <div className="p-4 rounded-2xl bg-primary/10 text-primary group-hover:bg-primary group-hover:text-white transition-all">
                                    {pillar.icon}
                                </div>
                                <span className="text-[10px] font-black uppercase tracking-widest text-green-500 bg-green-500/10 px-3 py-1 rounded-full border border-green-500/20">
                                    {pillar.status}
                                </span>
                            </div>
                            <h3 className="text-2xl font-bold mb-3">{pillar.title}</h3>
                            <p className="text-gray-400 text-sm leading-relaxed">{pillar.description}</p>
                        </motion.div>
                    ))}
                </div>

                {/* Detailed Compliance Section */}
                <motion.div
                    className="mt-20 p-12 md:p-20 rounded-[3.5rem] bg-[#0A0A0A] border border-white/5 relative overflow-hidden"
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    transition={{ duration: 1 }}
                    viewport={{ once: true }}
                >
                    <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-primary/5 rounded-full blur-[100px] -z-10"></div>

                    <div className="grid lg:grid-cols-2 gap-16 items-center">
                        <div className="space-y-8">
                            <div className="space-y-4">
                                <h2 className="text-3xl md:text-5xl font-black tracking-tight">The <span className="text-primary italic">USA</span> Standard</h2>
                                <p className="text-gray-400 text-lg leading-relaxed">
                                    We've engineered InvoiceCraft to exceed the security requirements of modern US business operations.
                                    From SSL/TLS encryption to PCI-compliant architecture, every layer is built for trust.
                                </p>
                            </div>

                            <div className="space-y-6">
                                {[
                                    "End-to-end SSL/TLS 1.3 Encryption",
                                    "No Server-Side Session Tracking",
                                    "Advanced Browser Sandboxing",
                                    "Regular Security Audits & Protocol Updates"
                                ].map((feature) => (
                                    <div key={feature} className="flex items-center gap-4 group">
                                        <div className="h-6 w-6 rounded-full bg-green-500/10 border border-green-500/20 flex items-center justify-center group-hover:bg-green-500 group-hover:text-white transition-all">
                                            <CheckCircle2 className="w-3.5 h-3.5" />
                                        </div>
                                        <span className="text-gray-300 font-medium">{feature}</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="relative flex justify-center lg:justify-end">
                            <div className="relative p-12 rounded-full border border-white/5 bg-white/2 animate-spin-slow">
                                <div className="p-8 rounded-full border border-primary/20 bg-primary/5">
                                    <div className="p-4 rounded-full bg-primary/10">
                                        <Fingerprint className="w-24 h-24 text-primary opacity-50" />
                                    </div>
                                </div>
                            </div>
                            <div className="absolute inset-0 flex items-center justify-center">
                                <div className="h-20 w-20 bg-primary rounded-full blur-3xl opacity-20 animate-pulse"></div>
                                <Database className="w-12 h-12 text-white" />
                            </div>
                        </div>
                    </div>
                </motion.div>

                {/* Security Alert CTA */}
                <div className="mt-20 text-center space-y-8">
                    <p className="text-xs font-black uppercase tracking-[0.5em] text-gray-500">Your security is our unwavering commitment</p>
                    <div className="flex flex-col items-center gap-4">
                        <Link href="/audit">
                            <Button size="lg" className="rounded-2xl h-16 px-12 bg-white text-black hover:bg-gray-200 font-black text-lg transition-transform hover:scale-105">
                                View Complete Security Audit
                            </Button>
                        </Link>
                        <p className="text-gray-500 text-sm">Need a custom security briefing? <a href="mailto:security@invoicecraft.app" className="text-primary font-bold hover:underline">Contact our CISO</a></p>
                    </div>
                </div>
            </div>
        </div>
    );
}

function CheckCircle2({ className }: { className?: string }) {
    return (
        <svg
            className={className}
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <path d="M20 6 9 17l-5-5" />
        </svg>
    );
}
