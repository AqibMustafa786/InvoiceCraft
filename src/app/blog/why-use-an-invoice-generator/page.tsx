import { PageHeader, PageHeaderDescription, PageHeaderHeading } from "@/components/page-header";
import Image from "next/image";

export default function WhyUseGeneratorPage() {
  return (
    <div className="container mx-auto p-4 md:p-8">
      <PageHeader>
        <PageHeaderHeading>Why Use Our SaaS Invoice Generator?</PageHeaderHeading>
        <PageHeaderDescription>Discover the benefits of using a dedicated tool for your invoicing needs.</PageHeaderDescription>
      </PageHeader>

      <div className="max-w-4xl mx-auto bg-card/50 backdrop-blur-lg border border-border/30 shadow-lg rounded-lg p-8">
         <div className="relative w-full h-64 mb-8 rounded-lg overflow-hidden">
            <Image src="https://picsum.photos/seed/guide5/800/400" alt="Business meeting" layout="fill" objectFit="cover" data-ai-hint="business meeting" />
        </div>
        <article className="prose prose-lg max-w-none text-foreground prose-headings:text-foreground prose-a:text-primary mx-auto space-y-6">
            <p>With our <strong>SaaS invoice generator app</strong>, invoicing becomes simple, fast, and stress-free. Here’s why it’s the right choice for your business.</p>

            <ul className="list-disc pl-6 space-y-4">
                <li>
                    <strong>100% Free:</strong> Create unlimited invoices with no hidden fees or subscriptions. Our core features are available to everyone.
                </li>
                <li>
                    <strong>Professional Templates:</strong> Choose from a range of templates designed to impress clients and build trust in your brand.
                </li>
                <li>
                    <strong>Cloud-Based & Secure:</strong> Access your invoices anytime, anywhere, from any device. Your data's security is our priority.
                </li>
                <li>
                    <strong>For Freelancers & Small Businesses:</strong> Our tool is specifically tailored to meet the needs of independent professionals and growing businesses.
                </li>
            </ul>

            <h2 className="text-2xl font-bold mt-8">Final Thoughts</h2>
            <p>Spend less time on paperwork and more time building your business. Whether you’re a freelancer, consultant, or entrepreneur, our tool ensures you get paid faster and look professional every time.</p>
        </article>
      </div>
    </div>
  );
}
