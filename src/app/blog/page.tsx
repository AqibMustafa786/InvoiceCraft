import Link from "next/link";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { PageHeader, PageHeaderDescription, PageHeaderHeading } from "@/components/page-header";

const blogPosts = [
  {
    slug: "creating-your-first-invoice",
    title: "Creating Your First Invoice: A Step-by-Step Guide",
    description: "Learn how to create a professional invoice from scratch, from entering business details to adding line items and calculating totals.",
    author: "InvoiceCraft Team",
    date: "2024-07-30",
    imageUrl: "https://picsum.photos/seed/guide1/600/400",
    imageHint: "desk invoice"
  },
  {
    slug: "writing-effective-descriptions",
    title: "How to Write Effective Invoice Descriptions",
    description: "Clear descriptions avoid client disputes and ensure you get paid on time. Learn how to write with clarity and professionalism.",
    author: "InvoiceCraft Team",
    date: "2024-07-29",
    imageUrl: "https://picsum.photos/seed/guide2/600/400",
    imageHint: "writing notes"
  },
  {
    slug: "sending-invoices-best-practices",
    title: "Best Practices for Sending Invoices to Clients",
    description: "Discover the best ways to send invoices, including email tips, PDF attachments, and using automated reminders to prevent late payments.",
    author: "InvoiceCraft Team",
    date: "2024-07-28",
    imageUrl: "https://picsum.photos/seed/guide3/600/400",
    imageHint: "email laptop"
  },
  {
    slug: "managing-invoice-payments",
    title: "Effectively Managing and Tracking Invoice Payments",
    description: "From marking invoices as paid to handling partial payments, learn how to manage your cash flow with our powerful tools.",
    author: "InvoiceCraft Team",
    date: "2024-07-27",
    imageUrl: "https://picsum.photos/seed/guide4/600/400",
    imageHint: "finance chart"
  },
  {
    slug: "why-use-an-invoice-generator",
    title: "Why Use a SaaS Invoice Generator for Your Business?",
    description: "Explore the benefits of using a dedicated invoice generator, from saving time to maintaining a professional image and securing your data.",
    author: "InvoiceCraft Team",
    date: "2024-07-26",
    imageUrl: "https://picsum.photos/seed/guide5/600/400",
    imageHint: "business meeting"
  },
];


export default function BlogPage() {
  return (
    <div className="container mx-auto p-4 md:p-8">
      <PageHeader>
        <PageHeaderHeading>From the InvoiceCraft Blog</PageHeaderHeading>
        <PageHeaderDescription>Tips, tutorials, and insights on invoicing, finance, and freelance life.</PageHeaderDescription>
      </PageHeader>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {blogPosts.map((post) => (
          <Card key={post.slug} className="flex flex-col overflow-hidden bg-card/50 backdrop-blur-lg border border-border/30 shadow-lg hover:shadow-primary/20 transition-shadow duration-300">
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
        ))}
      </div>
    </div>
  );
}
