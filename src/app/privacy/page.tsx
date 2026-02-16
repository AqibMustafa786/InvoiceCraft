'use client';

import { motion } from "framer-motion";
import { ShieldCheck, Lock, EyeOff, Scale, Info, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function PrivacyPage() {
    const lastUpdated = "July 29, 2024";

    return (
        <div className="relative min-h-screen pt-20 pb-24 overflow-hidden">
            {/* Cryptographic Background Pattern */}
            <div className="absolute top-0 left-0 w-full h-full opacity-[0.03] pointer-events-none -z-10 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]"></div>
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full bg-[radial-gradient(circle_at_50%_0%,rgba(0,102,255,0.05)_0%,transparent_50%)] -z-10"></div>

            <div className="container mx-auto px-4 md:px-8 max-w-4xl">
                <motion.div
                    className="text-center mb-20"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                >
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-green-500/10 border border-green-500/20 text-green-500 text-[10px] font-black uppercase tracking-[0.2em] mb-8">
                        <ShieldCheck className="w-4 h-4" /> US Privacy Shield Certified
                    </div>
                    <h1 className="text-5xl md:text-7xl font-black tracking-tighter mb-6">
                        Privacy <span className="text-primary italic">Statement</span>
                    </h1>
                    <p className="text-xl text-gray-400 max-w-2xl mx-auto leading-relaxed">
                        We believe privacy is a fundamental right, not a feature. Our "Private-by-Design" architecture ensures your business stays your business.
                    </p>
                    <p className="mt-8 text-[10px] font-bold uppercase tracking-[0.4em] text-gray-600">Document Protocol: 2024-SEC-PRV • Last Revision: {lastUpdated}</p>
                </motion.div>

                <motion.div
                    className="space-y-12"
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    transition={{ duration: 1, delay: 0.2 }}
                    viewport={{ once: true }}
                >
                    {/* Highlight Section */}
                    <div className="p-8 md:p-12 rounded-[2.5rem] bg-white/5 border border-white/10 backdrop-blur-xl relative overflow-hidden group hover:border-primary/30 transition-all duration-700">
                        <div className="absolute -top-12 -right-12 w-48 h-48 bg-primary/10 rounded-full blur-3xl group-hover:bg-primary/20 transition-all"></div>
                        <div className="flex items-center gap-6 mb-8">
                            <div className="p-4 rounded-2xl bg-primary/10 text-primary">
                                <EyeOff className="w-8 h-8" />
                            </div>
                            <h2 className="text-3xl font-black tracking-tight">Zero-Storage Protocol</h2>
                        </div>
                        <p className="text-gray-400 text-lg leading-relaxed mb-6">
                            Designed specifically for high-security US businesses, InvoiceCraft operates under a strict **Zero-Storage architecture**.
                            Unlike legacy providers, we do not require accounts, and we never touch your data.
                            All invoice generation happens in your local browser sandbox.
                        </p>
                        <div className="flex flex-wrap gap-4">
                            <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-green-500/10 text-green-500 text-[10px] font-bold uppercase tracking-widest border border-green-500/20">
                                <Lock className="w-3 h-3" /> Local Execution
                            </div>
                            <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-blue-500/10 text-blue-500 text-[10px] font-bold uppercase tracking-widest border border-blue-500/20">
                                <ShieldCheck className="w-3 h-3" /> Encrypted Sandbox
                            </div>
                        </div>
                    </div>

                    <article className="prose prose-invert prose-lg max-w-none space-y-10 px-4">
                        <section className="space-y-4">
                            <h2 className="text-2xl font-black tracking-tight flex items-center gap-3">
                                <Scale className="w-6 h-6 text-primary" /> 1. US Compliance & Standards
                            </h2>
                            <p className="text-gray-400 leading-relaxed">
                                Our policy adheres to the highest standards of digital transparency in the United States. We respect the privacy of every American freelancer and agency using our hub. This statement applies to the <a href="https://invoicecraft.app" className="text-primary hover:underline">invoicecraft.app</a> ecosystem.
                            </p>
                        </section>

                        <section className="space-y-4">
                            <h2 className="text-2xl font-black tracking-tight flex items-center gap-3">
                                <Sparkles className="w-6 h-6 text-primary" /> 2. Information Architecture
                            </h2>
                            <p className="text-gray-400 leading-relaxed">
                                To better understand US business needs, we may collect non-personally-identifying metrics, such as browser type and language preferences. This data is distilled to improve our US-targeted billing templates and is never tied to your identity.
                            </p>
                        </section>

                        <section className="space-y-4">
                            <h2 className="text-2xl font-black tracking-tight flex items-center gap-3">
                                <Lock className="w-6 h-6 text-primary" /> 3. Strategic Security
                            </h2>
                            <p className="text-gray-400 leading-relaxed">
                                Security is our obsession. By eliminating server-side storage, we've removed the primary attack vector for data breaches. You command your data; we simply provide the craft.
                            </p>
                        </section>

                        <section className="space-y-4">
                            <h2 className="text-2xl font-black tracking-tight flex items-center gap-3">
                                <Info className="w-6 h-6 text-primary" /> 4. Protocol Updates
                            </h2>
                            <p className="text-gray-400 leading-relaxed">
                                As US digital laws evolve, InvoiceCraft reserves the right to refine this protocol. We encourage our US partners to check this encrypted statement frequently for updates.
                            </p>
                        </section>
                    </article>
                </motion.div>

                {/* Call to Action for Security */}
                <div className="mt-20 p-8 rounded-3xl border border-white/5 bg-gradient-to-r from-primary/5 to-transparent flex flex-col md:flex-row items-center justify-between gap-8">
                    <div className="space-y-2">
                        <h3 className="text-xl font-bold">Have a Compliance Question?</h3>
                        <p className="text-gray-500 text-sm italic">Our US legal team is ready to provide clarity.</p>
                    </div>
                    <a href="mailto:privacy@invoicecraft.app">
                        <Button variant="outline" className="rounded-xl h-12 px-6 border-white/10 hover:border-primary/50 text-xs font-bold uppercase tracking-widest">
                            Contact Privacy Desk
                        </Button>
                    </a>
                </div>
            </div>
        </div>
    );
}
