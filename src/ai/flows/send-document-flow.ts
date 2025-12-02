
'use server';
/**
 * @fileOverview A flow to send a document (estimate/quote) as a PDF attachment via email.
 *
 * - sendDocumentByEmail - A function that orchestrates fetching data, generating a PDF, and triggering an email.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';
import { getFirestore } from 'firebase-admin/firestore';
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

    // Call the generatePdf flow with the raw document data.
    const { pdfBase64 } = await generatePdf(documentData);

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
          <p><a href="${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:9002'}/${docType}/${docId}">View ${documentTypeName} ${docNumber}</a></p>
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
