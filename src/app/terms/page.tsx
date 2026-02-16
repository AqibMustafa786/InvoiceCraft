'use client';

import { motion } from "framer-motion";
import { FileText, Gavel, ShieldAlert, Globe, CheckCircle2, Handshake } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function TermsPage() {
    const lastUpdated = "July 29, 2024";

    return (
        <div className="relative min-h-screen pt-20 pb-24 overflow-hidden">
            {/* Background Elements */}
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[120px] -z-10"></div>
            <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-blue-500/5 rounded-full blur-[100px] -z-10"></div>

            <div className="container mx-auto px-4 md:px-8 max-w-4xl">
                <motion.div
                    className="text-center mb-20"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.8 }}
                >
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-primary text-[10px] font-black uppercase tracking-[0.2em] mb-8">
                        <Handshake className="w-4 h-4" /> Professional User Agreement
                    </div>
                    <h1 className="text-5xl md:text-7xl font-black tracking-tighter mb-6">
                        Terms of <span className="text-primary italic">Service</span>
                    </h1>
                    <p className="text-xl text-gray-400 max-w-2xl mx-auto leading-relaxed">
                        Transparent, fair, and professional guidelines for the modern US business landscape.
                    </p>
                    <p className="mt-8 text-[10px] font-bold uppercase tracking-[0.4em] text-gray-600">Protocol ID: T-2024-CORE • Last Revision: {lastUpdated}</p>
                </motion.div>

                <motion.div
                    className="space-y-12"
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    transition={{ duration: 1 }}
                    viewport={{ once: true }}
                >
                    {/* Executive Summary Card */}
                    <div className="p-8 md:p-12 rounded-[2.5rem] bg-[#0A0A0A] border border-white/5 relative overflow-hidden group">
                        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-primary/30 to-transparent"></div>
                        <div className="flex items-center gap-6 mb-8">
                            <div className="p-4 rounded-2xl bg-white/5 text-primary">
                                <FileText className="w-8 h-8" />
                            </div>
                            <h2 className="text-3xl font-black tracking-tight">The Agreement</h2>
                        </div>
                        <p className="text-gray-400 text-lg leading-relaxed">
                            By engaging with the **InvoiceCraft ecosystem** at <a href="https://invoicecraft.app" className="text-white hover:text-primary underline-offset-8 decoration-primary/30 underline transition-all">invoicecraft.app</a>,
                            you are entering into a professional license agreement. These terms are engineered to protect both your business integrity and ours
                            within the jurisdiction of the United States.
                        </p>
                    </div>

                    <article className="prose prose-invert prose-lg max-w-none space-y-12 px-4">
                        <section className="space-y-6">
                            <h2 className="text-2xl font-black tracking-tight flex items-center gap-3">
                                <CheckCircle2 className="w-6 h-6 text-primary" /> 1. Professional Use License
                            </h2>
                            <p className="text-gray-400 leading-relaxed">
                                We grant you a non-transferable, premium license to utilize InvoiceCraft for your business operations. Under this license, you are empowered to generate professional documents but are restricted from:
                            </p>
                            <ul className="list-none space-y-4 text-gray-400 pl-0">
                                <li className="flex items-start gap-3">
                                    <div className="h-1.5 w-1.5 rounded-full bg-primary mt-2.5 flex-shrink-0"></div>
                                    <span>Reverse engineering or attempting to extract the core engine code.</span>
                                </li>
                                <li className="flex items-start gap-3">
                                    <div className="h-1.5 w-1.5 rounded-full bg-primary mt-2.5 flex-shrink-0"></div>
                                    <span>Removing official proprietary notations from generated assets.</span>
                                </li>
                                <li className="flex items-start gap-3">
                                    <div className="h-1.5 w-1.5 rounded-full bg-primary mt-2.5 flex-shrink-0"></div>
                                    <span>"Mirroring" our framework on external US-based or international servers.</span>
                                </li>
                            </ul>
                        </section>

                        <section className="space-y-6">
                            <h2 className="text-2xl font-black tracking-tight flex items-center gap-3">
                                <ShieldAlert className="w-6 h-6 text-primary" /> 2. Disclaimer & Protocol
                            </h2>
                            <p className="text-gray-400 leading-relaxed">
                                Materials on InvoiceCraft's portal are provided as a "Master-Grade" toolkit. While we strive for absolute accuracy, InvoiceCraft makes no warranties, expressed or implied, regarding the final legal standing of invoices in local US tax jurisdictions.
                            </p>
                        </section>

                        <section className="space-y-6">
                            <h2 className="text-2xl font-black tracking-tight flex items-center gap-3">
                                <Globe className="w-6 h-6 text-primary" /> 3. Strategic Limitations
                            </h2>
                            <p className="text-gray-400 leading-relaxed">
                                In no professional scenario shall InvoiceCraft or its developers be liable for consequential damages arising from the use of our generator. We provide the engine; you drive the business.
                            </p>
                        </section>

                        <section className="space-y-6">
                            <h2 className="text-2xl font-black tracking-tight flex items-center gap-3">
                                <Gavel className="w-6 h-6 text-primary" /> 4. Governing US Law
                            </h2>
                            <p className="text-gray-400 leading-relaxed">
                                These terms are governed by and construed in accordance with the laws of the United States. You irrevocably submit to the exclusive jurisdiction of the federal and state courts for all legal resolutions.
                            </p>
                        </section>
                    </article>
                </motion.div>

                {/* Support CTA */}
                <div className="mt-20 p-12 rounded-[3rem] bg-primary/5 border border-primary/20 text-center space-y-6">
                    <h3 className="text-2xl font-bold">Have Legal Questions?</h3>
                    <p className="text-gray-400 max-w-sm mx-auto">Our compliance team is available to discuss our service terms in detail.</p>
                    <a href="mailto:legal@invoicecraft.app" className="inline-block">
                        <Button size="lg" className="rounded-2xl h-14 px-10 bg-primary hover:bg-primary/90 text-white font-bold">
                            Inquire with Legal HQ
                        </Button>
                    </a>
                </div>
            </div>
        </div>
    );
}
