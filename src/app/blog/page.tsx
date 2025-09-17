import Link from "next/link";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import Image from "next/image";
import { ArrowRight } from "lucide-react";

const blogPosts = [
  {
    slug: "streamline-your-billing",
    title: "5 Tips to Streamline Your Billing Process",
    description: "Discover five actionable tips to make your invoicing and payment collection faster and more efficient.",
    author: "Jane Doe",
    date: "2024-07-28",
    imageUrl: "https://picsum.photos/seed/blog1/600/400",
    imageHint: "office billing"
  },
  {
    slug: "professional-invoices",
    title: "How to Create Professional Invoices That Get You Paid Faster",
    description: "A deep dive into the elements of a professional invoice and how they can impact your cash flow.",
    author: "John Smith",
    date: "2024-07-25",
    imageUrl: "https://picsum.photos/seed/blog2/600/400",
    imageHint: "invoice document"
  },
  {
    slug: "freelancer-finances",
    title: "Managing Your Finances as a Freelancer: A Beginner's Guide",
    description: "Learn the basics of financial management for freelancers, from tracking income to planning for taxes.",
    author: "Alice Johnson",
    date: "2024-07-22",
    imageUrl: "https://picsum.photos/seed/blog3/600/400",
    imageHint: "desk finance"
  },
];


export default function BlogPage() {
  return (
    <div className="container mx-auto p-4 md:p-8">
      <div className="text-center max-w-2xl mx-auto mb-16">
        <h1 className="text-4xl md:text-5xl font-bold font-headline tracking-tight">
          From the InvoiceCraft Blog
        </h1>
        <p className="mt-6 text-lg md:text-xl text-muted-foreground">
          Tips, tutorials, and insights on invoicing, finance, and freelance life.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {blogPosts.map((post) => (
          <Card key={post.slug} className="flex flex-col overflow-hidden bg-background/50 backdrop-blur-lg border border-white/20 shadow-lg hover:shadow-primary/20 transition-shadow duration-300">
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
       <p className="text-xs text-center text-muted-foreground pt-12">(This is a non-functional placeholder page, blog post links will not work yet)</p>
    </div>
  );
}
