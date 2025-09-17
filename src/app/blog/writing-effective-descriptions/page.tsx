import { PageHeader, PageHeaderDescription, PageHeaderHeading } from "@/components/page-header";
import Image from "next/image";

export default function DescriptionsPage() {
  return (
    <div className="container mx-auto p-4 md:p-8">
      <PageHeader>
        <PageHeaderHeading>Writing Effective Invoice Descriptions</PageHeaderHeading>
        <PageHeaderDescription>Clear descriptions make your invoice easier to understand and avoid client disputes.</PageHeaderDescription>
      </PageHeader>

       <div className="max-w-4xl mx-auto bg-card/50 backdrop-blur-lg border border-border/30 shadow-lg rounded-lg p-8">
         <div className="relative w-full h-64 mb-8 rounded-lg overflow-hidden">
            <Image src="https://picsum.photos/seed/guide2/800/400" alt="Writing notes" layout="fill" objectFit="cover" data-ai-hint="writing notes" />
        </div>
        <article className="prose prose-lg max-w-none text-foreground prose-headings:text-foreground prose-a:text-primary mx-auto space-y-6">
            
            <h2 className="text-2xl font-bold">Why Clear Descriptions Matter</h2>
            <p>Clear descriptions make your invoice easier to understand and help avoid client disputes. When a client knows exactly what they are paying for, they are more likely to pay on time.</p>

            <h3 className="text-xl font-semibold">Be Specific</h3>
            <p>Instead of “Design Work,” write “Website Homepage Redesign – Phase 1.” The more specific you are, the better.</p>
            
            <h3 className="text-xl font-semibold">Use Plain Language</h3>
            <p>Avoid jargon your client might not understand. Keep your language professional but simple and easy to read.</p>

            <h3 className="text-xl font-semibold">Highlight Deliverables</h3>
            <p>Ensure your client knows exactly what they are paying for by listing out the key deliverables associated with the cost.</p>
        </article>
      </div>
    </div>
  );
}
