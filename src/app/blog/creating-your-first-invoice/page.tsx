import { PageHeader, PageHeaderDescription, PageHeaderHeading } from "@/components/page-header";
import Image from "next/image";

export default function CreatingInvoicePage() {
  return (
    <div className="container mx-auto p-4 md:p-8">
      <PageHeader>
        <PageHeaderHeading>Creating Your First Invoice</PageHeaderHeading>
        <PageHeaderDescription>A step-by-step guide to using our free online invoice generator.</PageHeaderDescription>
      </PageHeader>

      <div className="max-w-4xl mx-auto bg-card/50 backdrop-blur-lg border border-border/30 shadow-lg rounded-lg p-8">
        <div className="relative w-full h-64 mb-8 rounded-lg overflow-hidden">
            <Image src="https://picsum.photos/seed/guide1/800/400" alt="Creating an invoice" layout="fill" objectFit="cover" data-ai-hint="desk invoice" />
        </div>
        <article className="prose prose-lg max-w-none text-foreground prose-headings:text-foreground prose-a:text-primary mx-auto space-y-6">
            <p>Managing invoices don’t need to be stressful. With our <strong>free online invoice generator</strong>, freelancers, entrepreneurs, and small business owners can create professional invoices in just a few minutes. This step-by-step guide will walk you through creating your first invoice with our SaaS app.</p>

            <h2 className="text-2xl font-bold">Step-by-Step Walkthrough</h2>
            
            <h3 className="text-xl font-semibold">1. Enter Your Business Information</h3>
            <p>Add your name, company name, logo, contact details, and address. This creates a professional header for your invoice.</p>

            <h3 className="text-xl font-semibold">2. Add Client Information</h3>
            <p>Include your client’s name, company name (if applicable), email, phone number, and billing address.</p>

            <h3 className="text-xl font-semibold">3. Invoice Details</h3>
            <ul className="list-disc pl-6 space-y-2">
                <li>Invoice date</li>
                <li>Payment due date</li>
                <li>Unique invoice number for easy tracking</li>
            </ul>

            <h3 className="text-xl font-semibold">4. List Services or Products</h3>
            <p>For each item, provide a detailed description (scope of work, hours, product details), quantity or hours worked, rate (per item/hour), and the subtotal for each line item.</p>

            <h3 className="text-xl font-semibold">5. Taxes, Discounts & Extras</h3>
            <p>Easily add taxes, shipping charges, or discounts. The tool auto-calculates totals to ensure accuracy.</p>

            <h3 className="text-xl font-semibold">6. Payment Terms</h3>
            <p>Define how you want to get paid — via bank transfer, PayPal, or other methods. Clear payment terms build trust and reduce late payments.</p>
        </article>
      </div>
    </div>
  );
}
