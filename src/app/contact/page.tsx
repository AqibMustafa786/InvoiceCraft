'use client';

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Mail, Clock, Github, Twitter, Linkedin, Send, MapPin, MessageCircle, Sparkles, ShieldCheck } from "lucide-react";
import Link from "next/link";
import { PageHeader, PageHeaderDescription, PageHeaderHeading } from "@/components/page-header";
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
    hidden: { opacity: 0, x: -20 },
    visible: {
        opacity: 1,
        x: 0,
        transition: {
            duration: 0.5,
        },
    },
};

export default function ContactPage() {
    return (
        <div className="relative min-h-screen pt-20 pb-24 overflow-hidden">
            {/* Dynamic Background Elements */}
            <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-primary/5 rounded-full blur-[150px] -z-10 animate-pulse"></div>
            <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-blue-500/5 rounded-full blur-[120px] -z-10"></div>

            <div className="container mx-auto px-4 md:px-6">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                >
                    <PageHeader className="items-center text-center">
                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-bold uppercase tracking-widest mb-6">
                            <Sparkles className="w-4 h-4" /> Global Support HQ
                        </div>
                        <PageHeaderHeading className="text-4xl md:text-6xl font-black tracking-tight mb-6">
                            Let's Scale Your <span className="text-primary italic">Invoicing</span> Together
                        </PageHeaderHeading>
                        <PageHeaderDescription className="max-w-3xl text-lg text-muted-foreground leading-relaxed mx-auto">
                            Our support team is dedicated to the success of the American freelancer.
                            Whether you have a feature request or need help with a custom template, we're here to help you command the market.
                        </PageHeaderDescription>
                    </PageHeader>
                </motion.div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 mt-16 max-w-7xl mx-auto">

                    {/* Contact Information & Channels */}
                    <motion.div
                        className="lg:col-span-5 space-y-8"
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                        variants={containerVariants}
                    >
                        <motion.div variants={itemVariants}>
                            <Card className="border-white/10 bg-white/5 backdrop-blur-2xl overflow-hidden group">
                                <CardHeader className="pb-4">
                                    <div className="flex items-center gap-4">
                                        <div className="p-3 rounded-2xl bg-primary/10 text-primary group-hover:bg-primary group-hover:text-white transition-all duration-500">
                                            <Mail className="h-6 w-6" />
                                        </div>
                                        <CardTitle className="text-2xl font-bold">Email Support</CardTitle>
                                    </div>
                                </CardHeader>
                                <CardContent>
                                    <p className="text-gray-400 mb-4 leading-relaxed">Our average response time for US-based queries is under 4 hours.</p>
                                    <a href="mailto:support@invoicecraft.app" className="text-xl font-bold text-white hover:text-primary transition-colors flex items-center gap-2">
                                        support@invoicecraft.app
                                    </a>
                                </CardContent>
                            </Card>
                        </motion.div>

                        <motion.div variants={itemVariants}>
                            <Card className="border-white/10 bg-white/5 backdrop-blur-2xl overflow-hidden group">
                                <CardHeader className="pb-4">
                                    <div className="flex items-center gap-4">
                                        <div className="p-3 rounded-2xl bg-primary/10 text-primary group-hover:bg-primary group-hover:text-white transition-all duration-500">
                                            <Clock className="h-6 w-6" />
                                        </div>
                                        <CardTitle className="text-2xl font-bold">Hours of Operation</CardTitle>
                                    </div>
                                </CardHeader>
                                <CardContent>
                                    <p className="text-gray-400 leading-relaxed">
                                        Monday – Saturday: 9:00 AM – 8:00 PM EST<br />
                                        <span className="text-xs text-gray-500 font-medium">Closed on major US holidays.</span>
                                    </p>
                                </CardContent>
                            </Card>
                        </motion.div>

                        <motion.div variants={itemVariants} className="pt-4">
                            <h3 className="text-xs font-black uppercase tracking-[0.3em] text-gray-500 mb-6">Join the Community</h3>
                            <div className="flex gap-4">
                                {[
                                    { icon: Twitter, label: 'Twitter' },
                                    { icon: Github, label: 'GitHub' },
                                    { icon: Linkedin, label: 'LinkedIn' },
                                    { icon: MessageCircle, label: 'Discord' }
                                ].map((social) => (
                                    <Button key={social.label} variant="outline" size="lg" className="h-14 w-14 rounded-2xl border-white/10 bg-white/5 hover:bg-primary/20 hover:border-primary/40 transition-all">
                                        <social.icon className="h-6 w-6" />
                                    </Button>
                                ))}
                            </div>
                        </motion.div>
                    </motion.div>

                    {/* Premium Contact Form */}
                    <motion.div
                        className="lg:col-span-7"
                        initial={{ opacity: 0, x: 30 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.8 }}
                        viewport={{ once: true }}
                    >
                        <Card className="border-primary/20 bg-[#0A0A0A] p-2 rounded-[2.5rem] shadow-2xl relative overflow-hidden">
                            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-primary/50 to-transparent"></div>
                            <CardHeader className="p-8 md:p-12">
                                <CardTitle className="text-3xl md:text-4xl font-black tracking-tight mb-2">Send an Official <span className="text-primary">Inquiry</span></CardTitle>
                                <CardDescription className="text-gray-400 text-lg">Use the encrypted channel below for direct communication with our core team.</CardDescription>
                            </CardHeader>
                            <CardContent className="p-8 md:p-12 pt-0 md:pt-0">
                                <form className="space-y-8">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                        <div className="space-y-3">
                                            <Label htmlFor="name" className="text-xs font-black uppercase tracking-widest text-gray-500 ml-1">Full Identity</Label>
                                            <Input id="name" placeholder="John Doe" className="h-14 rounded-2xl bg-white/5 border-white/10 focus:ring-primary px-6 text-white placeholder:text-gray-600" />
                                        </div>
                                        <div className="space-y-3">
                                            <Label htmlFor="email" className="text-xs font-black uppercase tracking-widest text-gray-500 ml-1">Business Email</Label>
                                            <Input id="email" type="email" placeholder="name@company.com" className="h-14 rounded-2xl bg-white/5 border-white/10 focus:ring-primary px-6 text-white placeholder:text-gray-600" />
                                        </div>
                                    </div>
                                    <div className="space-y-3">
                                        <Label htmlFor="subject" className="text-xs font-black uppercase tracking-widest text-gray-500 ml-1">Subject of Discussion</Label>
                                        <Input id="subject" placeholder="Feature Optimization Request" className="h-14 rounded-2xl bg-white/5 border-white/10 focus:ring-primary px-6 text-white placeholder:text-gray-600" />
                                    </div>
                                    <div className="space-y-3">
                                        <Label htmlFor="message" className="text-xs font-black uppercase tracking-widest text-gray-500 ml-1">Detailed Brief</Label>
                                        <Textarea id="message" placeholder="How can we help your business thrive today?" className="min-h-[180px] rounded-3xl bg-white/5 border-white/10 focus:ring-primary p-6 text-white placeholder:text-gray-600" />
                                    </div>
                                    <Button type="submit" className="w-full h-16 rounded-2xl bg-primary hover:bg-primary/90 text-white font-black text-lg tracking-tight group transition-all">
                                        Dispatch Message <Send className="w-5 h-5 ml-2 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                                    </Button>
                                </form>
                                <p className="text-[10px] text-center text-gray-600 uppercase tracking-[0.2em] font-bold mt-8">
                                    <ShieldCheck className="w-3 h-3 inline mr-1 mb-0.5" /> End-to-end encrypted dispatch • Secure US Server
                                </p>
                            </CardContent>
                        </Card>
                    </motion.div>
                </div>
            </div>
        </div>
    );
}
