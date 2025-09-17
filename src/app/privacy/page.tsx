export default function PrivacyPage() {
  return (
    <div className="container mx-auto p-4 md:p-8 max-w-4xl">
        <div className="text-center mb-16">
            <h1 className="text-4xl md:text-5xl font-bold font-headline tracking-tight">
            Privacy Policy
            </h1>
            <p className="mt-6 text-lg md:text-xl text-muted-foreground">
            Your privacy is critically important to us.
            </p>
             <p className="mt-2 text-sm text-muted-foreground">Last updated: July 29, 2024</p>
        </div>

        <div className="prose prose-lg max-w-none text-foreground prose-headings:text-foreground prose-a:text-primary mx-auto space-y-6">
            <p>
            It is InvoiceCraft's policy to respect your privacy regarding any information we may collect while operating our website. This Privacy Policy applies to <a href="https://invoicecraft.app">invoicecraft.app</a> (hereinafter, "us", "we", or "InvoiceCraft"). We respect your privacy and are committed to protecting personally identifiable information you may provide us through the Website.
            </p>

            <h2 className="text-2xl font-bold">1. No Data Storage on Our Servers</h2>
            <p>
                InvoiceCraft is designed with privacy as a core feature. We do not require you to create an account, and we do not store any of your invoice data, client information, or personal details on our servers. All data you enter into the invoice generator is processed and stored locally within your web browser's localStorage. This means your data remains on your computer and is not transmitted to us.
            </p>

            <h2 className="text-2xl font-bold">2. Website Visitors</h2>
            <p>
                Like most website operators, InvoiceCraft may collect non-personally-identifying information of the sort that web browsers and servers typically make available, such as the browser type, language preference, referring site, and the date and time of each visitor request. Our purpose in collecting non-personally identifying information is to better understand how our visitors use the website.
            </p>

            <h2 className="text-2xl font-bold">3. Security</h2>
            <p>
                The security of your information is important to us. Because we do not store your data, the risk of a data breach from our end is eliminated. The security of the data stored in your browser's localStorage is dependent on the security of your own computer and browser.
            </p>

            <h2 className="text-2xl font-bold">4. Links to External Sites</h2>
            <p>
                Our Service may contain links to external sites that are not operated by us. If you click on a third-party link, you will be directed to that third party's site. We strongly advise you to review the Privacy Policy and terms of service of every site you visit. We have no control over, and assume no responsibility for the content, privacy policies or practices of any third-party sites, products or services.
            </p>
            
            <h2 className="text-2xl font-bold">5. Privacy Policy Changes</h2>
            <p>
                Although most changes are likely to be minor, InvoiceCraft may change its Privacy Policy from time to time, and in our sole discretion. We encourage visitors to frequently check this page for any changes to its Privacy Policy. Your continued use of this site after any change in this Privacy Policy will constitute your acceptance of such change.
            </p>

        </div>
    </div>
  );
}
