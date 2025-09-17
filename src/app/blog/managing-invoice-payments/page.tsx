import { PageHeader, PageHeaderDescription, PageHeaderHeading } from "@/components/page-header";
import Image from "next/image";

export default function ManagingPaymentsPage() {
  return (
    <div className="container mx-auto p-4 md:p-8">
      <PageHeader>
        <PageHeaderHeading>Managing Invoice Payments</PageHeaderHeading>
        <PageHeaderDescription>Track payments to keep your finances organized and your cash flow healthy.</PageHeaderDescription>
      </PageHeader>

      <div className="max-w-4xl mx-auto bg-card/50 backdrop-blur-lg border border-border/30 shadow-lg rounded-lg p-8">
        <div className="relative w-full h-64 mb-8 rounded-lg overflow-hidden">
            <Image src="https://picsum.photos/seed/guide4/800/400" alt="Financial charts" layout="fill" objectFit="cover" data-ai-hint="finance chart" />
        </div>
        <article className="prose prose-lg max-w-none text-foreground prose-headings:text-foreground prose-a:text-primary mx-auto space-y-6">
            
            <h2 className="text-2xl font-bold">Marking Invoices as Paid</h2>
            <p>When you receive a payment, update the invoice status to <strong>Paid</strong>. You can also add the payment date and any private notes for your records. This helps you keep track of your income accurately.</p>

            <h2 className="text-2xl font-bold mt-8">Tracking Partial Payments</h2>
            <p>If a client pays in installments, you can easily record partial payments. The system automatically updates the outstanding balance so you always know exactly what is still due.</p>

            <h2 className="text-2xl font-bold mt-8">Cash Flow Insights</h2>
            <p>With proper payment tracking, you can forecast revenue, manage expenses, and keep your financial records accurate. This is critical for freelancers and small businesses who need to carefully manage their cash flow to succeed.</p>
        </article>
      </div>
    </div>
  );
}
