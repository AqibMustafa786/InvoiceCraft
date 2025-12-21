
'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import Marquee from '@/components/marquee';
import { motion } from 'framer-motion';
import Image from 'next/image';
import { FileText, FilePlus, Shield, Receipt, Hammer, PenTool, Store } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

const tools = [
  {
    href: '/create-invoice',
    label: 'Invoice',
    icon: <Receipt className="h-10 w-10 text-primary" />,
  },
  {
    href: '/create-estimate',
    label: 'Estimate',
    icon: <FilePlus className="h-10 w-10 text-primary" />,
  },
  {
    href: '/create-quote',
    label: 'Quote',
    icon: <FileText className="h-10 w-10 text-primary" />,
  },
  {
    href: '/create-insurance',
    label: 'Insurance',
    icon: <Shield className="h-10 w-10 text-primary" />,
  },
];

const featuredTemplates = [
  {
    name: "Construction",
    count: 6,
    imageUrl: "https://picsum.photos/seed/construction-template/600/800",
    imageHint: "construction site",
    icon: <Hammer />,
  },
  {
    name: "Freelance",
    count: 5,
    imageUrl: "https://picsum.photos/seed/freelance-desk/600/800",
    imageHint: "creative desk",
    icon: <PenTool />,
  },
  {
    name: "Retail",
    count: 3,
    imageUrl: "https://picsum.photos/seed/retail-store/600/800",
    imageHint: "retail store",
    icon: <Store />,
  }
];

export default function HomePage() {
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
  
    const cardHoverVariants = {
    hover: {
      y: -8,
      scale: 1.05,
      transition: {
        type: "spring",
        stiffness: 300,
      },
    },
  };


  return (
    <div className="flex flex-col min-h-[calc(100vh-8rem)]">
      <main className="flex-1">
        <section className="relative w-full py-20 overflow-hidden md:py-32 lg:py-40">
          <div className="container px-4 mx-auto md:px-6">
            <div className="grid gap-12 lg:grid-cols-2 lg:gap-24 items-center">
              <motion.div 
                className="max-w-xl text-center lg:text-left"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
              >
                <motion.h1 
                  className="text-5xl font-bold tracking-tight md:text-6xl lg:text-7xl font-headline"
                  variants={itemVariants}
                >
                  <span>Create Professional </span>
                  <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                    Documents
                  </span>
                  <span> in Seconds</span>
                </motion.h1>
                <motion.p 
                  className="mt-6 text-lg text-muted-foreground md:text-xl"
                  variants={itemVariants}
                >
                  Generate invoices, estimates, quotes, and insurance documents. Download as PDF and track them online. The ultimate tool for freelancers and small businesses.
                </motion.p>
                <motion.div 
                  className="flex flex-col items-center justify-center gap-4 mt-8 sm:flex-row lg:justify-start"
                  variants={itemVariants}
                >
                   <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.98 }}>
                      <Button asChild size="lg" className="w-full text-lg sm:w-auto">
                          <Link href="/dashboard">Get Started Free</Link>
                      </Button>
                   </motion.div>
                   <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.98 }}>
                      <Button asChild variant="outline" size="lg" className="w-full text-lg sm:w-auto">
                          <Link href="/features">
                              Learn More
                          </Link>
                      </Button>
                  </motion.div>
                </motion.div>
              </motion.div>
              <motion.div 
                className="relative w-full h-64 lg:h-auto lg:aspect-square"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.7, ease: 'easeOut' }}
              >
                 <motion.div
                  className="relative w-full h-full"
                  animate={{ rotateY: 360 }}
                  transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
                >
                  <Image 
                    src="https://picsum.photos/seed/app-interface/800/800" 
                    alt="Modern application interface for document creation"
                    fill
                    className="object-cover rounded-2xl shadow-2xl"
                    data-ai-hint="app interface"
                  />
                </motion.div>
              </motion.div>
            </div>
          </div>
        </section>

        <section className="py-20 md:py-28">
            <div className="container px-4 mx-auto md:px-6">
                <div className="text-center max-w-2xl mx-auto mb-12">
                    <h2 className="text-4xl md:text-5xl font-bold font-headline">A Tool for Every Need</h2>
                    <p className="mt-4 text-muted-foreground">Whether you're billing a client, estimating a project, or quoting a price, we have you covered.</p>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                    {tools.map((tool) => (
                        <Link href={tool.href} key={tool.href}>
                            <motion.div whileHover={{ y: -8, scale: 1.05 }} transition={{ type: "spring", stiffness: 300 }}>
                                <Card className="bg-card/50 backdrop-blur-sm shadow-lg hover:shadow-primary/20 transition-all duration-300">
                                    <CardContent className="flex flex-col items-center justify-center p-6 text-center gap-4">
                                        {tool.icon}
                                        <p className="font-semibold text-lg">{tool.label}</p>
                                    </CardContent>
                                </Card>
                            </motion.div>
                        </Link>
                    ))}
                </div>
            </div>
        </section>

         <section className="py-20 md:py-28">
          <div className="container px-4 mx-auto md:px-6">
            <div className="text-center max-w-2xl mx-auto mb-12">
              <h2 className="text-4xl md:text-5xl font-bold font-headline">Explore Our Modern Templates</h2>
              <p className="mt-4 text-muted-foreground">Professionally designed templates for any industry. Customizable to fit your brand.</p>
            </div>
             <motion.div 
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8"
              variants={containerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.2 }}
            >
              {featuredTemplates.map((template) => (
                <motion.div
                  key={template.name}
                  className="relative overflow-hidden rounded-xl shadow-lg group"
                  variants={itemVariants}
                  whileHover="hover"
                >
                  <Image 
                    src={template.imageUrl}
                    alt={`${template.name} template`}
                    width={600}
                    height={800}
                    className="w-full h-full object-cover transition-transform duration-500 ease-in-out group-hover:scale-110"
                    data-ai-hint={template.imageHint}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent"></div>
                  <motion.div 
                    className="absolute bottom-0 left-0 p-6 text-white"
                    variants={cardHoverVariants}
                  >
                     <div className="flex items-center gap-3 mb-2 opacity-80">
                      {React.cloneElement(template.icon, { className: "h-5 w-5" })}
                      <span className="text-sm font-medium tracking-wider uppercase">{template.count} Templates</span>
                    </div>
                    <h3 className="text-3xl font-bold font-headline">{template.name}</h3>
                  </motion.div>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>

        <section className="py-12 md:py-20">
          <Marquee />
        </section>
      </main>
    </div>
  );
}
