import { PageHeader, PageHeaderDescription, PageHeaderHeading } from "@/components/page-header";

export default function CookiesPage() {
  return (
    <div className="container mx-auto p-4 md:p-8 max-w-4xl">
        <PageHeader>
            <PageHeaderHeading>Cookie Policy</PageHeaderHeading>
            <PageHeaderDescription>Information about how we use cookies on InvoiceCraft.</PageHeaderDescription>
        </PageHeader>

        <div className="prose prose-lg max-w-none text-foreground prose-headings:text-foreground prose-a:text-primary mx-auto space-y-6">
            <p>
                This is the Cookie Policy for InvoiceCraft, accessible from https://invoicecraft.app.
            </p>

            <h2 className="text-2xl font-bold">What Are Cookies</h2>
            <p>
                As is common practice with almost all professional websites, this site uses cookies, which are tiny files that are downloaded to your computer, to improve your experience. This page describes what information they gather, how we use it, and why we sometimes need to store these cookies.
            </p>

            <h2 className="text-2xl font-bold">How We Use Cookies</h2>
            <p>
                We use cookies for a variety of reasons detailed below. Unfortunately, in most cases, there are no industry standard options for disabling cookies without completely disabling the functionality and features they add to this site.
            </p>
             <ul className="list-disc pl-6 space-y-2">
                <li>
                    <strong>Theme Preferences:</strong> We use cookies to store your preferred theme (light or dark mode) so that it persists across your sessions.
                </li>
             </ul>

            <h2 className="text-2xl font-bold">Disabling Cookies</h2>
            <p>
                You can prevent the setting of cookies by adjusting the settings on your browser (see your browser Help for how to do this). Be aware that disabling cookies may affect the functionality of this and many other websites that you visit. Disabling cookies will usually result in also disabling certain functionality and features of this site.
            </p>
            
        </div>
    </div>
  );
}
