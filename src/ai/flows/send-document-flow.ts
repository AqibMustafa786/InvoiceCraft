'use server';
/**
 * @fileOverview A flow to send a document (estimate/quote) as a PDF attachment via email.
 *
 * - sendDocumentByEmail - A function that orchestrates fetching data, generating a PDF, and triggering an email.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';
import { getFirestore } from 'firebase-admin/firestore';
import { renderToStaticMarkup } from 'react-dom/server';
import { DocumentPreview } from '@/components/document-preview';
import { generatePdf } from './generate-pdf-flow';
import { type Estimate, type Quote } from '@/lib/types';

const firestore = getFirestore();

export const SendDocumentInputSchema = z.object({
  docId: z.string().describe('The ID of the document to send.'),
  docType: z.enum(['estimate', 'quote']).describe('The type of the document.'),
});
export type SendDocumentInput = z.infer<typeof SendDocumentInputSchema>;

export const SendDocumentOutputSchema = z.object({
  success: z.boolean(),
  message: z.string(),
});
export type SendDocumentOutput = z.infer<typeof SendDocumentOutputSchema>;

export async function sendDocumentByEmail(input: SendDocumentInput): Promise<SendDocumentOutput> {
  return sendDocumentFlow(input);
}

const sendDocumentFlow = ai.defineFlow(
  {
    name: 'sendDocumentFlow',
    inputSchema: SendDocumentInputSchema,
    outputSchema: SendDocumentOutputSchema,
  },
  async ({ docId, docType }) => {
    const collectionName = docType === 'estimate' ? 'estimates' : 'quotes';
    const docRef = firestore.collection(collectionName).doc(docId);
    const docSnap = await docRef.get();

    if (!docSnap.exists) {
      return { success: false, message: 'Document not found.' };
    }

    const documentData = docSnap.data() as Estimate | Quote;

    if (!documentData.client.email) {
      return { success: false, message: 'Client email is missing.' };
    }
    
    // This is a simplified solution. In a real app, you would pass the accentColor and other styles.
    const documentHtml = renderToStaticMarkup(
        <DocumentPreview document={documentData} accentColor="hsl(var(--primary))" isPrint />
    );

    // Inject Tailwind styles for PDF generation
    // In a real app, you would have a more robust way of including your CSS.
    const fullHtml = `
      <html>
        <head>
          <style>
            @import url('https://rsms.me/inter/inter.css');
            body { font-family: 'Inter', sans-serif; }
            /* Basic styles to make it look decent. This should be expanded. */
            .p-8 { padding: 2rem; } .bg-white { background-color: white; } .text-gray-800 { color: #1f2937; }
            .flex { display: flex; } .justify-between { justify-content: space-between; } .items-start { align-items: flex-start; }
            .mb-10 { margin-bottom: 2.5rem; } .text-3xl { font-size: 1.875rem; } .font-bold { font-weight: 700; }
            .grid { display: grid; } .grid-cols-2 { grid-template-columns: repeat(2, minmax(0, 1fr)); }
            .gap-4 { gap: 1rem; } .text-sm { font-size: 0.875rem; } .text-gray-500 { color: #6b7281; }
            .w-full { width: 100%; } .text-left { text-align: left; } .w-1/2 { width: 50%; } .p-3 { padding: 0.75rem; }
            .text-right { text-align: right; } .border-b { border-bottom-width: 1px; } .mt-8 { margin-top: 2rem; }
            .max-w-xs { max-width: 20rem; } .space-y-2 > :not([hidden]) ~ :not([hidden]) { margin-top: 0.5rem; }
            .font-medium { font-weight: 500; } .my-2 { margin-top: 0.5rem; margin-bottom: 0.5rem; }
            .items-center { align-items: center; } .text-lg { font-size: 1.125rem; } .rounded-md { border-radius: 0.375rem; }
            .mt-2 { margin-top: 0.5rem; } .whitespace-pre-line { white-space: pre-line; } .uppercase { text-transform: uppercase; }
            .text-gray-400 { color: #9ca3af; } .tracking-wider { letter-spacing: 0.05em; } .text-muted-foreground { color: #6b7281; }
            h1,h2,h3,h4,h5,h6 { font-weight: bold; }
            table { width: 100%; border-collapse: collapse; }
            th, td { border: 1px solid #e5e7eb; padding: 0.5rem; }
            th { background-color: #f3f4f6; }
          </style>
        </head>
        <body>${documentHtml}</body>
      </html>
    `;

    const { pdfBase64 } = await generatePdf({ html: fullHtml });

    const docNumber = documentData.estimateNumber;
    const companyName = documentData.business.name;
    const documentTypeName = docType.charAt(0).toUpperCase() + docType.slice(1);

    await firestore.collection('mail').add({
      to: [documentData.client.email],
      message: {
        subject: `${documentTypeName} ${docNumber} from ${companyName}`,
        html: `
          <p>Hello ${documentData.client.name},</p>
          <p>Please find your ${docType.toLowerCase()} from ${companyName} attached to this email.</p>
          <p>You can also view it online by clicking the link below:</p>
          <p><a href="${process.env.NEXT_PUBLIC_BASE_URL}/${docType}/${docId}">View ${documentTypeName} ${docNumber}</a></p>
          <p>Thank you!</p>
          <p>${companyName}</p>
        `,
        attachments: [
          {
            filename: `${docType}_${docNumber}.pdf`,
            content: pdfBase64,
            encoding: 'base64',
          },
        ],
      },
    });

    return { success: true, message: `Email with ${docType} sent successfully.` };
  }
);
