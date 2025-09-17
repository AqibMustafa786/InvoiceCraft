export default function TermsPage() {
  return (
    <div className="container mx-auto p-4 md:p-8 max-w-4xl">
        <div className="text-center mb-16">
            <h1 className="text-4xl md:text-5xl font-bold font-headline tracking-tight">
            Terms of Service
            </h1>
            <p className="mt-6 text-lg md:text-xl text-muted-foreground">
            Please read these terms carefully before using our service.
            </p>
             <p className="mt-2 text-sm text-muted-foreground">Last updated: July 29, 2024</p>
        </div>

        <div className="prose prose-lg max-w-none text-foreground prose-headings:text-foreground prose-a:text-primary mx-auto space-y-6">
            <p>
                By accessing the website at <a href="https://invoicecraft.app">invoicecraft.app</a>, you are agreeing to be bound by these terms of service, all applicable laws and regulations, and agree that you are responsible for compliance with any applicable local laws.
            </p>

            <h2 className="text-2xl font-bold">1. Use License</h2>
            <p>
                Permission is granted to temporarily download one copy of the materials (information or software) on InvoiceCraft's website for personal, non-commercial transitory viewing only. This is the grant of a license, not a transfer of title, and under this license you may not:
            </p>
            <ol className="list-decimal pl-6 space-y-2">
                <li>modify or copy the materials;</li>
                <li>use the materials for any commercial purpose, or for any public display (commercial or non-commercial);</li>
                <li>attempt to decompile or reverse engineer any software contained on InvoiceCraft's website;</li>
                <li>remove any copyright or other proprietary notations from the materials; or</li>
                <li>transfer the materials to another person or "mirror" the materials on any other server.</li>
            </ol>

            <h2 className="text-2xl font-bold">2. Disclaimer</h2>
            <p>
                The materials on InvoiceCraft's website are provided on an 'as is' basis. InvoiceCraft makes no warranties, expressed or implied, and hereby disclaims and negates all other warranties including, without limitation, implied warranties or conditions of merchantability, fitness for a particular purpose, or non-infringement of intellectual property or other violation of rights.
            </p>

            <h2 className="text-2xl font-bold">3. Limitations</h2>
            <p>
                In no event shall InvoiceCraft or its suppliers be liable for any damages (including, without limitation, damages for loss of data or profit, or due to business interruption) arising out of the use or inability to use the materials on InvoiceCraft's website, even if InvoiceCraft or a InvoiceCraft authorized representative has been notified orally or in writing of the possibility of such damage.
            </p>
            
            <h2 className="text-2xl font-bold">4. Governing Law</h2>
            <p>
                These terms and conditions are governed by and construed in accordance with the laws of the jurisdiction of the website owner and you irrevocably submit to the exclusive jurisdiction of the courts in that State or location.
            </p>

        </div>
    </div>
  );
}
