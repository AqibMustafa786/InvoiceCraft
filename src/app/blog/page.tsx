
'use client';
import Link from "next/link";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { PageHeader, PageHeaderDescription, PageHeaderHeading } from "@/components/page-header";
import { motion } from 'framer-motion';

const blogPosts = [
  {
    slug: "creating-your-first-invoice",
    title: "How to Create Your First Invoice – Step-by-Step Guide for Beginners",
    description: "Learn how to create your first invoice with our step-by-step guide. Perfect for freelancers & small businesses who want professional invoices and faster payments.",
    author: "InvoiceCraft Team",
    date: "2024-07-30",
    imageUrl: "https://picsum.photos/seed/guide1/600/400",
    imageHint: "desk invoice"
  },
  {
    slug: "writing-effective-descriptions",
    title: "Writing Effective Invoice Descriptions – Clear Communication Tips",
    description: "Discover proven tips to write clear, effective invoice descriptions. Improve client communication, reduce disputes, and get paid faster with professional invoices.",
    author: "InvoiceCraft Team",
    date: "2024-07-29",
    imageUrl: "https://picsum.photos/seed/guide2/600/400",
    imageHint: "writing notes"
  },
  {
    slug: "sending-invoices-best-practices",
    title: "Best Practices for Sending Invoices – Get Paid Faster",
    description: "Learn the best practices for sending invoices professionally. Discover tips to improve client trust, avoid delays, and ensure faster payments.",
    author: "InvoiceCraft Team",
    date: "2024-07-28",
    imageUrl: "https://picsum.photos/seed/guide3/600/400",
    imageHint: "email laptop"
  },
  {
    slug: "managing-invoice-payments",
    title: "Managing Invoice Payments – How to Track & Organize Payments",
    description: "A complete guide on managing invoice payments. Learn how to track, organize, and automate payments to improve your cash flow.",
    author: "InvoiceCraft Team",
    date: "2024-07-27",
    imageUrl: "https://picsum.photos/seed/guide4/600/400",
    imageHint: "finance chart"
  },
  {
    slug: "why-use-an-invoice-generator",
    title: "Why Use an Invoice Generator – Benefits, Features & Tips",
    description: "Wondering why you should use an invoice generator? Discover key benefits, features, and best practices for freelancers & businesses.",
    author: "InvoiceCraft Team",
    date: "2024-07-26",
    imageUrl: "https://picsum.photos/seed/guide5/600/400",
    imageHint: "business meeting"
  },
];


const containerVariants = {
  hidden: { opacity: 1 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const cardVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
        duration: 0.5,
        ease: 'easeOut'
    }
  }
};


export default function BlogPage() {
  return (
    <div className="container mx-auto p-4 md:p-8">
      <PageHeader>
        <PageHeaderHeading>From the InvoiceCraft Blog</PageHeaderHeading>
        <PageHeaderDescription>Tips, tutorials, and insights on invoicing, finance, and freelance life.</PageHeaderDescription>
      </PageHeader>

      <motion.div
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {blogPosts.map((post) => (
          <motion.div key={post.slug} variants={cardVariants} whileHover={{ y: -5, scale: 1.02 }} transition={{ duration: 0.2 }}>
            <Card className="flex flex-col overflow-hidden bg-card/50 backdrop-blur-sm shadow-lg hover:shadow-primary/20 transition-shadow duration-300 h-full">
              <div className="relative w-full h-48">
                 <Image 
                  src={post.imageUrl} 
                  alt={post.title} 
                  fill 
                  className="object-cover" 
                  data-ai-hint={post.imageHint}
                />
              </div>
              <CardHeader>
                <CardTitle className="text-xl">{post.title}</CardTitle>
                <CardDescription>
                  by {post.author} on {new Date(post.date).toLocaleDateString()}
                </CardDescription>
              </CardHeader>
              <CardContent className="flex-1">
                <p className="text-muted-foreground">{post.description}</p>
              </CardContent>
              <CardFooter>
                <Link href={`/blog/${post.slug}`} className="font-semibold text-primary hover:underline flex items-center gap-2">
                  Read More <ArrowRight className="h-4 w-4" />
                </Link>
              </CardFooter>
            </Card>
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
}
