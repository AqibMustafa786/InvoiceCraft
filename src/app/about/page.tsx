'use client';

import { CheckCircle, Eye, Rocket, ShieldCheck, Zap, ArrowRight, Target, Users } from 'lucide-react';
import { PageHeader, PageHeaderDescription, PageHeaderHeading } from '@/components/page-header';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

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

export default function AboutPage() {
  const whatWeOffer = [
    {
      icon: <Zap className="h-6 w-6 text-primary" />,
      title: "Smart US Billing Engine",
      description: "Automated tax calculations and compliant templates specifically for the US market."
    },
    {
      icon: <CheckCircle className="h-6 w-6 text-primary" />,
      title: "Premium Template Gallery",
      description: "High-end, customizable designs that command respect from American clients."
    },
    {
      icon: <Users className="h-6 w-6 text-primary" />,
      title: "Agency-Grade Collaboration",
      description: "Built to scale from solo freelancers to multi-member American agencies."
    },
    {
      icon: <ShieldCheck className="h-6 w-6 text-primary" />,
      title: "Bank-Level Security",
      description: "Your data stays on your device—privacy-first design for total peace of mind."
    }
  ];

  const coreValues = [
    {
      title: "USA Centric",
      description: "Every feature is tuned to the American business landscape, from taxes to terminology."
    },
    {
      title: "Zero-Latency Performance",
      description: "Our core engine runs locally in your browser, ensuring lightning-fast document generation."
    },
    {
      title: "Modern Craftsmanship",
      description: "We blend functionality with high-end aesthetics to provide a world-class user experience."
    },
    {
      title: "Unwavering Privacy",
      description: "No accounts, no storage, no trackers. Your business data is truly yours."
    }
  ];


  return (
    <div className="relative overflow-hidden pt-20 pb-24">
      {/* Background Orbs */}
      <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-primary/10 rounded-full blur-[120px] -z-10 pointer-events-none"></div>
      <div className="absolute bottom-0 right-1/4 w-[400px] h-[400px] bg-blue-500/5 rounded-full blur-[100px] -z-10 pointer-events-none"></div>

      <div className="container mx-auto px-4 md:px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <PageHeader className="items-center text-center">
            <PageHeaderHeading className="text-4xl md:text-6xl font-black tracking-tight mb-6">
              Our Mission for the <span className="text-primary italic">Modern American</span> Workforce
            </PageHeaderHeading>
            <PageHeaderDescription className="max-w-3xl text-lg text-muted-foreground leading-relaxed mx-auto">
              We started with a simple vision: To eliminate the friction of invoicing for the world's most innovative business market.
              InvoiceCraft isn't just a tool; it's a statement of professionalism.
            </PageHeaderDescription>
          </PageHeader>
        </motion.div>

        {/* Vision & Mission Grid */}
        <motion.div
          className="grid md:grid-cols-2 gap-8 mb-24 mt-12"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={containerVariants}
        >
          <motion.div
            variants={itemVariants}
            className="group relative h-full p-8 rounded-[2rem] border border-white/10 bg-white/5 backdrop-blur-xl overflow-hidden hover:border-primary/50 transition-colors"
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full blur-2xl group-hover:bg-primary/10 transition-colors -z-10"></div>
            <div className="flex items-center gap-4 mb-6">
              <div className="p-4 rounded-2xl bg-primary/10 text-primary">
                <Target className="h-8 w-8" />
              </div>
              <h2 className="text-3xl font-black tracking-tight">The Vision</h2>
            </div>
            <p className="text-gray-400 text-lg leading-relaxed">
              To be the gold standard for financial presentation in the USA. We believe that how you bill is how you're perceived, and we ensure you always look like a Tier-1 business.
            </p>
          </motion.div>

          <motion.div
            variants={itemVariants}
            className="group relative h-full p-8 rounded-[2rem] border border-white/10 bg-white/5 backdrop-blur-xl overflow-hidden hover:border-primary/50 transition-colors"
          >
            <div className="absolute bottom-0 left-0 w-32 h-32 bg-blue-500/5 rounded-full blur-2xl group-hover:bg-blue-500/10 transition-colors -z-10"></div>
            <div className="flex items-center gap-4 mb-6">
              <div className="p-4 rounded-2xl bg-primary/10 text-primary">
                <Rocket className="h-8 w-8" />
              </div>
              <h2 className="text-3xl font-black tracking-tight">The Mission</h2>
            </div>
            <p className="text-gray-400 text-lg leading-relaxed">
              Empowering US entrepreneurs with the fastest, most beautiful, and most secure invoicing experience ever built. We save you hours, so you can focus on building your legacy.
            </p>
          </motion.div>
        </motion.div>

        {/* What We Offer */}
        <div className="mb-24">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-3xl md:text-5xl font-black tracking-tight mb-4">What We <span className="text-primary">Deliver</span></h2>
            <p className="text-muted-foreground">Premium features engineered for the high-end American market.</p>
          </div>
          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={containerVariants}
          >
            {whatWeOffer.map((item, idx) => (
              <motion.div
                key={item.title}
                variants={itemVariants}
                className="group p-8 rounded-3xl border border-white/5 bg-white/5 hover:bg-white/10 transition-all hover:scale-105"
              >
                <div className="mb-6 p-4 rounded-2xl bg-white/5 w-fit group-hover:bg-primary group-hover:text-white transition-colors">
                  {item.icon}
                </div>
                <h3 className="text-xl font-bold mb-3">{item.title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{item.description}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>

        {/* Why Choose Us & CTA */}
        <div className="relative p-12 md:p-20 rounded-[3rem] border border-primary/20 bg-[#0A0A0A] overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-primary/10 via-transparent to-transparent -z-10"></div>

          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-3xl md:text-5xl font-black tracking-tight mb-8">Why the <span className="text-primary">Best</span> Choose Us</h2>
              <div className="grid sm:grid-cols-2 gap-8">
                {coreValues.map(item => (
                  <div key={item.title} className="space-y-2">
                    <h3 className="font-bold text-white flex items-center gap-2">
                      <div className="h-1.5 w-1.5 rounded-full bg-primary"></div>
                      {item.title}
                    </h3>
                    <p className="text-gray-500 text-xs leading-relaxed">{item.description}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex flex-col items-center lg:items-end justify-center gap-6">
              <div className="p-8 rounded-full bg-primary/10 border border-primary/20 animate-pulse">
                <Target className="h-16 w-16 text-primary" />
              </div>
              <p className="text-center lg:text-right max-w-xs text-gray-500">
                Ready to transform your business presentation? Join thousands of US pros today.
              </p>
              <Button asChild size="lg" className="rounded-full h-14 px-10 bg-primary hover:bg-primary/90 text-white font-bold text-lg group">
                <Link href="/signup" className="flex items-center gap-2">
                  Start Crafting <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
