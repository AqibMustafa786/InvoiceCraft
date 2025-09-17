import { PageHeader, PageHeaderDescription, PageHeaderHeading } from "@/components/page-header";
import Image from "next/image";

export default function SendingInvoicesPage() {
  return (
    <div className="container mx-auto p-4 md:p-8">
      <PageHeader>
        <PageHeaderHeading>Best Practices for Sending Invoices</PageHeaderHeading>
        <PageHeaderDescription>Ensure your invoices are received, understood, and paid on time.</PageHeaderDescription>
      </PageHeader>

      <div className="max-w-4xl mx-auto bg-card/50 backdrop-blur-lg border border-border/30 shadow-lg rounded-lg p-8">
         <div className="relative w-full h-64 mb-8 rounded-lg overflow-hidden">
            <Image src="https://picsum.photos/seed/guide3/800/400" alt="Sending an email" layout="fill" objectFit="cover" data-ai-hint="email laptop" />
        </div>
        <article className="prose prose-lg max-w-none text-foreground prose-headings:text-foreground prose-a:text-primary mx-auto space-y-6">
            
            <h2 className="text-2xl font-bold">Best Practices for Sending</h2>
            
            <h3 className="text-xl font-semibold">Preview First</h3>
            <p>Always double-check all the information on your invoice before sending it. A simple typo can cause delays and confusion.</p>

            <h3 className="text-xl font-semibold">Send via Email or PDF</h3>
            <p>You can email invoices directly from our app or download them as a PDF to send manually. PDFs are professional and universally accessible.</p>

            <h3 className="text-xl font-semibold">Add a Personal Touch</h3>
            <p>Include a friendly, professional message in your email. A simple "Thank you for your business!" can strengthen your client relationships.</p>

            <h2 className="text-2xl font-bold mt-8">Automated Reminders</h2>
            <p>Late payments are frustrating. Our app allows you to schedule <strong>automated reminders</strong> (e.g., 7 days or 14 days past due) so you never have to chase payments manually. This feature saves you time and maintains a professional tone in your follow-ups.</p>
        </article>
      </div>
    </div>
  );
}
