import { PageHeader, PageHeaderDescription, PageHeaderHeading } from "@/components/page-header";
import Image from "next/image";
import Link from "next/link";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const faqs = [
  {
    question: "Do I need a business license to send invoices?",
    answer: "Not always, but check your local regulations. Freelancers can invoice under their personal name."
  },
  {
    question: "Can I create invoices without accounting software?",
    answer: "Yes! Free online invoice generators are designed for this exact purpose."
  },
  {
    question: "How long should I give clients to pay?",
    answer: "Industry standard is 14–30 days, but it depends on your agreement."
  },
  {
    question: "Should I charge late fees?",
    answer: "Yes, late fees encourage clients to pay on time. Just make sure you state this clearly in your terms."
  },
  {
    question: "Can invoices be used for tax purposes?",
    answer: "Absolutely. Keep copies of all your invoices for your tax records."
  },
]

export default function CreatingInvoicePage() {
  return (
    <div className="container mx-auto p-4 md:p-8">
      <PageHeader>
        <PageHeaderHeading>Creating Your First Invoice – A Complete Step-by-Step Guide</PageHeaderHeading>
        <PageHeaderDescription>Learn how to create your first professional invoice with this step-by-step guide. Perfect for freelancers, consultants, and small businesses who want to get paid faster and maintain accurate records.</PageHeaderDescription>
      </PageHeader>

      <div className="max-w-4xl mx-auto bg-card/50 backdrop-blur-lg border border-border/30 shadow-lg rounded-lg p-8">
        <div className="relative w-full h-64 md:h-96 mb-8 rounded-lg overflow-hidden">
            <Image src="https://picsum.photos/seed/guide1/1200/600" alt="Creating an invoice guide" fill style={{objectFit: 'cover'}} data-ai-hint="desk paperwork" />
        </div>
        <article className="prose prose-lg max-w-none text-foreground prose-headings:text-foreground prose-headings:font-headline prose-a:text-primary prose-strong:text-foreground mx-auto space-y-6">
            
            <p>If you’re a freelancer or small business owner, creating invoices is one of the most important parts of running your business. An invoice is more than just a request for payment—it’s a professional document that builds trust with your clients, helps you get paid on time, and keeps your financial records organized.</p>
            <p>But if you’ve never created one before, the process can feel overwhelming. What details should you include? How do you format it? What’s the right way to send it?</p>
            <p>In this guide, we’ll walk you step by step through <strong>creating your very first invoice</strong> using a free online invoice generator. By the end, you’ll know exactly what information to include, how to present it professionally, and how to streamline the process so you get paid faster.</p>

            <h2 className="text-3xl font-bold">What is an Invoice and Why Does It Matter?</h2>
            <p>An <strong>invoice</strong> is a formal document sent by a seller (you) to a buyer (your client) that lists the products or services provided, along with the amount due. It serves three key purposes:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li><strong>Payment Request</strong> – It tells the client how much they owe and when payment is due.</li>
              <li><strong>Legal Record</strong> – It acts as proof of the transaction for tax and compliance purposes.</li>
              <li><strong>Professional Branding</strong> – A well-designed invoice makes you look credible and reliable.</li>
            </ul>
            <p>For freelancers, consultants, and small business owners, invoices are not optional—they are <strong>essential tools for managing cash flow</strong> and ensuring smooth client relationships.</p>

            <h2 className="text-3xl font-bold">Before You Start: What You Need</h2>
            <p>Before creating your first invoice, make sure you have these details ready:</p>
            <ul className="list-disc pl-6 space-y-2">
                <li>Your business information: Name, logo, contact details, and address.</li>
                <li>Client information: Name, company name (if applicable), email, and billing address.</li>
                <li>Invoice details: Invoice number, issue date, and due date.</li>
                <li>List of services/products: Descriptions, rates, and quantities.</li>
                <li>Taxes and discounts: If applicable, include relevant charges.</li>
                <li>Payment terms: How and when you expect to be paid.</li>
            </ul>

            <h2 className="text-3xl font-bold">Step 1: Add Your Business Details</h2>
            <p>At the top of your invoice, include your business name or your personal name if you’re a freelancer. Adding a logo makes your invoice look more professional and helps with brand recognition.</p>
            <div className="bg-card/50 border rounded-lg p-4 my-4 not-prose">
                <p className="font-bold">Aqib Mustafa – Freelance Web Developer</p>
                <p>📍 Address: Larkana, Sindh, Pakistan</p>
                <p>📧 Email: aqib@example.com</p>
                <p>📞 Phone: +92-300-XXXXXXX</p>
            </div>

            <h2 className="text-3xl font-bold">Step 2: Add Client Information</h2>
            <p>Next, add your client’s details. This makes the invoice personalized and avoids confusion.</p>
             <div className="bg-card/50 border rounded-lg p-4 my-4 not-prose">
                <p><span className="font-semibold">Client Name:</span> John Doe</p>
                <p><span className="font-semibold">Company:</span> Bright Marketing Agency</p>
                <p>📍 <span className="font-semibold">Address:</span> 123 Main Street, New York, USA</p>
                <p>📧 <span className="font-semibold">Email:</span> john@brightmarketing.com</p>
            </div>

            <h2 className="text-3xl font-bold">Step 3: Define Invoice Details</h2>
            <p>This section ensures the invoice is easy to track for both you and your client. Include:</p>
            <ul className="list-disc pl-6 space-y-2">
                <li><strong>Invoice Number</strong> (unique, e.g., INV-001)</li>
                <li><strong>Invoice Date</strong> (the date you create it)</li>
                <li><strong>Payment Due Date</strong> (e.g., 14 days after invoice date)</li>
            </ul>
            <p>Having unique invoice numbers helps you track payments and follow up if a client is late.</p>

            <h2 className="text-3xl font-bold">Step 4: List Services or Products</h2>
            <p>This is the most important part of your invoice. Each service or product should be itemized clearly.</p>
            <div className="overflow-x-auto my-4 not-prose">
                <table className="w-full text-left border-collapse">
                    <thead className="bg-card/50">
                        <tr>
                            <th className="p-3 border">Description</th>
                            <th className="p-3 border text-center">Quantity</th>
                            <th className="p-3 border text-right">Rate ($)</th>
                            <th className="p-3 border text-right">Total ($)</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr className="border-b">
                            <td className="p-3 border">Website Design (Homepage)</td>
                            <td className="p-3 border text-center">1</td>
                            <td className="p-3 border text-right">500.00</td>
                            <td className="p-3 border text-right">500.00</td>
                        </tr>
                        <tr className="border-b">
                            <td className="p-3 border">SEO Optimization</td>
                            <td className="p-3 border text-center">10 hrs</td>
                            <td className="p-3 border text-right">30.00</td>
                            <td className="p-3 border text-right">300.00</td>
                        </tr>
                        <tr className="border-b">
                            <td className="p-3 border">Hosting (1 Year)</td>
                            <td className="p-3 border text-center">1</td>
                            <td className="p-3 border text-right">100.00</td>
                            <td className="p-3 border text-right">100.00</td>
                        </tr>
                    </tbody>
                    <tfoot className="font-bold">
                        <tr>
                            <td colSpan={3} className="p-3 border text-right">Subtotal</td>
                            <td className="p-3 border text-right">$900.00</td>
                        </tr>
                         <tr>
                            <td colSpan={3} className="p-3 border text-right">Tax (5%)</td>
                            <td className="p-3 border text-right">$45.00</td>
                        </tr>
                         <tr>
                            <td colSpan={3} className="p-3 border text-right">Total Due</td>
                            <td className="p-3 border text-right">$945.00</td>
                        </tr>
                    </tfoot>
                </table>
            </div>

             <h2 className="text-3xl font-bold">Step 5: Add Taxes, Discounts & Extras</h2>
            <p>Depending on your region, you may need to add sales tax or VAT. Some freelancers also apply discounts for loyal clients or bulk projects.</p>
             <ul className="list-disc pl-6 space-y-2">
                <li><strong>Tax Example:</strong> 10% VAT = $100</li>
                <li><strong>Discount Example:</strong> 5% loyalty discount = -$50</li>
            </ul>

            <h2 className="text-3xl font-bold">Step 6: Customize Payment Terms</h2>
            <p>Clear payment terms protect you from late payments. Examples include:</p>
            <ul className="list-disc pl-6 space-y-2">
                <li><strong>Payment Due:</strong> 14 days from invoice date</li>
                <li><strong>Accepted Methods:</strong> Bank transfer, PayPal, Stripe</li>
                <li><strong>Late Payment Penalty:</strong> 2% added after 7 days overdue</li>
            </ul>
            <p>Adding these terms upfront ensures there are no misunderstandings.</p>

            <h2 className="text-3xl font-bold">Tips for Writing Effective Service Descriptions</h2>
             <ul className="list-disc pl-6 space-y-2">
                <li><strong>Be Detailed:</strong> Instead of “Web Design,” write “Responsive Web Design for Homepage & Contact Page.”</li>
                <li><strong>Use Professional Language:</strong> Avoid slang. Keep it business-friendly.</li>
                <li><strong>Highlight Deliverables:</strong> Clients should understand what they’re paying for. "Logo Design – Includes 3 concepts and 2 rounds of revisions." is a great example.</li>
            </ul>

            <h2 className="text-3xl font-bold">Sending Your Invoice</h2>
            <p>Once your invoice is ready, it’s time to send it.</p>
            <h3 className="text-2xl font-semibold">Best Practices:</h3>
            <ol className="list-decimal pl-6 space-y-2">
                <li><strong>Preview First</strong> – Check spelling, numbers, and formatting.</li>
                <li><strong>Send by Email</strong> – Most clients prefer receiving invoices via email.</li>
                <li><strong>Attach as PDF</strong> – Always send invoices in PDF to maintain formatting.</li>
                <li><strong>Add a Personal Note</strong> – “Thanks for your business, looking forward to future projects.”</li>
            </ol>

            <h2 className="text-3xl font-bold">Common Mistakes to Avoid</h2>
            <ol className="list-decimal pl-6 space-y-2">
                <li>Forgetting to include due date</li>
                <li>Using vague descriptions like “Work completed”</li>
                <li>Not numbering invoices properly</li>
                <li>Failing to add taxes or discounts</li>
                <li>Sending invoices in editable formats like Word instead of PDF</li>
            </ol>

            <h2 className="text-3xl font-bold">FAQs</h2>
             <div className="not-prose">
                <Accordion type="single" collapsible className="w-full">
                    {faqs.map((item, index) => (
                        <AccordionItem value={`item-${index}`} key={item.question}>
                        <AccordionTrigger className="text-left font-semibold text-lg hover:no-underline p-4 text-foreground">
                            {item.question}
                        </AccordionTrigger>
                        <AccordionContent className="p-4 pt-0">
                            <p className="text-muted-foreground">
                            {item.answer}
                            </p>
                        </AccordionContent>
                        </AccordionItem>
                    ))}
                </Accordion>
             </div>

            <h2 className="text-3xl font-bold">Conclusion</h2>
            <p>Creating your first invoice doesn’t have to be complicated. With the right structure and tools, you can generate professional invoices in minutes. By including accurate details, clear descriptions, and proper payment terms, you’ll not only look professional but also <strong>get paid faster</strong>.</p>
            <p>If you’re ready to simplify your invoicing, try our <Link href="/create"><strong>free online invoice generator</strong></Link> today.</p>
        </article>
      </div>
    </div>
  );
}
