
import '@/ai/genkit';

import { defineFlow } from '@genkit-ai/flow';
import { z } from 'zod';
import { getFirebase } from '@/firebase';
import { doc, getDoc, collection, getDocs, query, where } from 'firebase/firestore';
import { renderToBuffer } from '@react-pdf/renderer';
import { PDFDocument } from '@/components/pdf/document-pdf';
import { sendEmail } from '@/ai/flows/send-email-flow';
import type { Estimate, Quote } from '@/lib/types';

export const SendDocumentSchema = z.object({
  docId: z.string(),
  docType: z.enum(['quote', 'estimate']),
});

async function findDocument(
  docId: string,
  docType: 'quote' | 'estimate'
): Promise<Quote | Estimate | null> {
  const { firestore } = getFirebase();
  const collectionName = docType === 'quote' ? 'quotes' : 'estimates';

  const companiesSnapshot = await getDocs(collection(firestore, 'companies'));

  for (const companyDoc of companiesSnapshot.docs) {
    const ref = doc(
      firestore,
      'companies',
      companyDoc.id,
      collectionName,
      docId
    );
    const snap = await getDoc(ref);
    if (snap.exists()) {
      return { id: snap.id, ...snap.data() } as Quote | Estimate;
    }
  }

  const q = query(
    collection(firestore, collectionName),
    where('id', '==', docId)
  );
  const snapshot = await getDocs(q);

  if (!snapshot.empty) {
    const docSnap = snapshot.docs[0];
    return { id: docSnap.id, ...docSnap.data() } as Quote | Estimate;
  }

  return null;
}

export const sendDocumentFlow = defineFlow(
  {
    name: 'sendDocumentFlow',
    inputSchema: SendDocumentSchema,
    outputSchema: z.object({
      success: z.boolean(),
      message: z.string(),
    }),
  },
  async ({ docId, docType }) => {
    try {
      const document = await findDocument(docId, docType);
      if (!document) throw new Error('Document not found');

      const pdfBuffer = await renderToBuffer(PDFDocument({ data: document }));
      const pdfBase64 = pdfBuffer.toString('base64');

      const docTypeTitle = docType === 'quote' ? 'Quote' : 'Estimate';
      const docNumber = 'estimateNumber' in document ? document.estimateNumber : 'N/A';

      await sendEmail({
        to: document.client.email,
        subject: `Your ${docTypeTitle} from ${document.business.name} (#${docNumber})`,
        html: `
          <p>Hello ${document.client.name},</p>
          <p>Please find your ${docTypeTitle} from ${document.business.name} attached to this email.</p>
          <p>You can also view it online by clicking the link below:</p>
          <p><a href="https://invoicecraft.app/${docType}/${docId}">View ${docTypeTitle} Online</a></p>
          <p>Thank you!</p>
          <p>${document.business.name}</p>
        `,
        attachments: [
          {
            filename: `${docType}_${docNumber}.pdf`,
            content: pdfBase64,
            encoding: 'base64',
            contentType: 'application/pdf',
          },
        ],
      });

      return { success: true, message: 'Email sent successfully.' };
    } catch (error: any) {
      return { success: false, message: error.message };
    }
  }
);
