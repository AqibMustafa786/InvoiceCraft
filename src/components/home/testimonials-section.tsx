'use client';

import { motion } from 'framer-motion';
import { Star, MapPin, Quote } from 'lucide-react';
import Image from 'next/image';

const TESTIMONIALS = [
    {
        content: "InvoiceCraft has completely transformed how we handle billing at our agency. The template customization is incredible, and my clients essentially pay instantly now.",
        author: "Jessica Martinez",
        role: "Founder, JM Digital",
        location: "Austin, TX",
        avatar: "https://i.pravatar.cc/150?u=jessica",
        rating: 5
    },
    {
        content: "As a contractor, I need to send estimates from my truck. The mobile interface is flawless. I've won 3 big jobs this month because I could quote instantly.",
        author: "David Buckland",
        role: "Owner, Buckland Roofing",
        location: "Miami, FL",
        rating: 5
    },
    {
        content: "Finally, an invoicing tool that feels premium. It makes my small freelance business look like a Fortune 500 company. The client portal is a game changer.",
        author: "Sarah Chen",
        role: "Freelance Designer",
        location: "San Francisco, CA",
        rating: 5
    },
    {
        content: "I switched from QuickBooks because I needed something simpler but still professional. InvoiceCraft is exactly that. It does everything I need without the bloat.",
        author: "Michael Ross",
        role: "Consultant",
        location: "New York, NY",
        rating: 5
    },
    {
        content: "The ability to add legal disclaimers and insurance info directly to my quotes has saved me so much headache. Highly recommended for any service business.",
        author: "Amanda Lowery",
        role: "Event Planner",
        location: "Chicago, IL",
        rating: 5
    },
    {
        content: "Customer support is top-notch. I had a question about taxes and they answered within minutes. Plus, the automated recurring invoices save me 5 hours a week.",
        author: "James Wilson",
        role: "Web Developer",
        location: "Seattle, WA",
        rating: 5
    }
];

export function TestimonialsSection() {
    return (
        <section className="py-24 bg-secondary/5 relative overflow-hidden">
            {/* Background decoration */}
            <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-primary/20 to-transparent"></div>
            <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-primary/20 to-transparent"></div>

            <div className="container px-4 mx-auto md:px-6 relative z-10">
                <div className="text-center max-w-3xl mx-auto mb-16">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5 }}
                    >
                        <h2 className="text-4xl md:text-5xl font-bold font-headline mb-6">
                            Trusted by <span className="text-primary">American Businesses</span>
                        </h2>
                        <p className="text-xl text-muted-foreground leading-relaxed">
                            Join thousands of freelancers, contractors, and agencies across the US who trust InvoiceCraft to look professional and get paid faster.
                        </p>
                    </motion.div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {TESTIMONIALS.map((testimonial, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.1, duration: 0.5 }}
                            whileHover={{ y: -5 }}
                            className="h-full"
                        >
                            <div className="h-full bg-card border border-border/50 rounded-2xl p-8 shadow-sm hover:shadow-xl hover:shadow-primary/5 transition-all duration-300 relative group flex flex-col">
                                <Quote className="absolute top-6 right-6 h-8 w-8 text-primary/10 group-hover:text-primary/20 transition-colors" />

                                <div className="flex gap-1 mb-6 text-yellow-500">
                                    {[...Array(testimonial.rating)].map((_, i) => (
                                        <Star key={i} className="h-5 w-5 fill-current" />
                                    ))}
                                </div>

                                <p className="text-muted-foreground leading-relaxed mb-8 relative z-10 flex-grow">
                                    "{testimonial.content}"
                                </p>

                                <div className="flex items-center gap-4 mt-auto pt-6 border-t border-border/40">
                                    <div className="relative w-12 h-12 rounded-full overflow-hidden border-2 border-primary/10">
                                        <Image
                                            src={testimonial.author ? testimonial.avatar : `https://ui-avatars.com/api/?name=${testimonial.author}`}
                                            alt={testimonial.author}
                                            fill
                                            className="object-cover"
                                        />
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-foreground text-sm">{testimonial.author}</h4>
                                        <p className="text-xs text-muted-foreground">{testimonial.role}</p>
                                        <div className="flex items-center gap-1 mt-0.5 text-xs text-primary/80">
                                            <MapPin className="h-3 w-3" />
                                            {testimonial.location}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>

                <div className="mt-16 flex justify-center">
                    <div className="flex flex-col items-center gap-2">
                        <div className="flex -space-x-3">
                            {[1, 2, 3, 4, 5].map((i) => (
                                <div key={i} className="w-10 h-10 rounded-full border-2 border-background bg-muted overflow-hidden relative">
                                    <Image src={`https://i.pravatar.cc/150?u=${i + 20}`} alt="User" fill className="object-cover" />
                                </div>
                            ))}
                            <div className="w-10 h-10 rounded-full border-2 border-background bg-primary text-primary-foreground flex items-center justify-center text-xs font-bold z-10">
                                +2k
                            </div>
                        </div>
                        <p className="text-sm font-medium text-muted-foreground mt-2">Join 2,000+ happy beta users</p>
                    </div>
                </div>
            </div>
        </section>
    );
}
