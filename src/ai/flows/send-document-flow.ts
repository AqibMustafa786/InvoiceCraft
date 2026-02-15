'use server';

import { z } from 'zod';
import { getFirebase } from '@/firebase';
import { doc, getDoc, collection, query, where, getDocs } from 'firebase/firestore';
import { PDFDocument } from '@/components/pdf/document-pdf';
import { renderToBuffer } from '@react-pdf/renderer';
import { sendEmail } from '@/ai/flows/send-email-flow';
import type { Estimate, Quote, Invoice } from '@/lib/types';
import { logAuditAction } from '@/services/audit-service';

const SendDocumentSchema = z.object({
  docId: z.string(),
  docType: z.enum(['quote', 'estimate', 'invoice']),
});

export type SendDocumentInput = z.infer<typeof SendDocumentSchema>;

async function findDocument(docId: string, docType: 'quote' | 'estimate' | 'invoice'): Promise<Quote | Estimate | Invoice | null> {
  const { firestore } = getFirebase();
  const collectionName = docType === 'quote' ? 'quotes' : docType === 'estimate' ? 'estimates' : 'invoices';

  const companiesRef = collection(firestore, 'companies');
  const companiesSnapshot = await getDocs(companiesRef);

  for (const companyDoc of companiesSnapshot.docs) {
    const docRef = doc(firestore, 'companies', companyDoc.id, collectionName, docId);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      return { id: docSnap.id, ...docSnap.data() } as Quote | Estimate | Invoice;
    }
  }

  const collectionGroupRef = collection(firestore, collectionName);
  const q = query(collectionGroupRef, where('id', '==', docId));
  const querySnapshot = await getDocs(q);

  if (!querySnapshot.empty) {
    const docSnap = querySnapshot.docs[0];
    return { id: docSnap.id, ...docSnap.data() } as Quote | Estimate | Invoice;
  }

  return null;
}

export async function sendDocumentByEmail(input: SendDocumentInput) {
  const { docId, docType } = input;
  try {
    const document = await findDocument(docId, docType);

    if (!document) {
      throw new Error(`Document with ID ${docId} not found.`);
    }

    const pdfBuffer = await renderToBuffer(PDFDocument({ data: document, language: (document as any).language || 'en' }));
    const pdfBase64 = pdfBuffer.toString('base64');

    const docTypeTitle = docType.charAt(0).toUpperCase() + docType.slice(1);
    const docNumber = 'estimateNumber' in document ? document.estimateNumber : 'invoiceNumber' in document ? (document as Invoice).invoiceNumber : 'N/A';

    await sendEmail({
      to: document.client.email,
      subject: `Your ${docTypeTitle} from ${document.business.name} (#${docNumber})`,
      html: `
          <div style="font-family: Arial, sans-serif; line-height: 1.6;">
            <p>Hello ${document.client.name},</p>
            <p>Please find your ${docTypeTitle.toLowerCase()} from <strong>${document.business.name}</strong> attached to this email.</p>
            <p>You can also view it online by clicking the link below:</p>
            <p style="margin: 20px 0;">
              <a href="https://invoicecraft.app/${docType}/${docId}" style="background-color: #007bff; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">
                View ${docTypeTitle} Online
              </a>
            </p>
            <p>Thank you!</p>
            <p><em>${document.business.name}</em></p>
          </div>
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

    // Log the action
    await logAuditAction({
      action: 'Document Sent',
      status: 'Success',
      details: {
        docId: document.id,
        docType: docType,
        recipient: document.client.email,
        docNumber: docNumber,
      },
      user: {
        uid: (document as any).business.userId || 'unknown', // Assuming business object has userId
        name: document.business.name || 'Unknown',
        email: document.business.email || 'unknown@example.com', // Assuming business object has email
      },
    });

    return { success: true, message: 'Email sent successfully.' };
  } catch (error: any) {
    console.error('Failed to send document email:', error);
    return { success: false, message: error.message || 'An unknown error occurred.' };
  }
}
