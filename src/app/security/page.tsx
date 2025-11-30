import { PageHeader, PageHeaderDescription, PageHeaderHeading } from "@/components/page-header";

export default function SecurityPage() {
  return (
    <div className="container mx-auto p-4 md:p-8 max-w-4xl">
        <PageHeader>
            <PageHeaderHeading>Security</PageHeaderHeading>
            <PageHeaderDescription>Our commitment to keeping your data safe and secure.</PageHeaderDescription>
        </PageHeader>

        <div className="prose prose-lg max-w-none text-foreground prose-headings:text-foreground prose-a:text-primary mx-auto space-y-6">
            <p>
                At InvoiceCraft, your security is our top priority. Since our application is designed to work entirely within your browser, we have taken specific steps to ensure a secure environment.
            </p>

            <h2 className="text-2xl font-bold">Local Data Storage</h2>
            <p>
                All data you enter, including invoice details, client information, and saved drafts, is stored directly in your browser's <strong>localStorage</strong>. This means your sensitive information never leaves your computer and is never transmitted to or stored on our servers. This design fundamentally minimizes the risk of unauthorized access through a server-side data breach.
            </p>

            <h2 className="text-2xl font-bold">No Server-Side Data Processing</h2>
            <p>
                Every calculation, template generation, and PDF export is handled on the client-side. We do not process any of your personal or financial data on our backend systems, providing an additional layer of privacy and security.
            </p>

            <h2 className="text-2xl font-bold">Secure Connections</h2>
            <p>
                Our website uses HTTPS to ensure that all communication between your browser and our site is encrypted and secure. This protects against eavesdropping and man-in-the-middle attacks.
            </p>

            <h2 className="text-2xl font-bold">Your Responsibility</h2>
            <p>
                Because your data is stored on your own device, you are responsible for securing your computer and browser. We recommend using up-to-date antivirus software, a secure browser, and practicing safe internet habits.
            </p>
        </div>
    </div>
  );
}
