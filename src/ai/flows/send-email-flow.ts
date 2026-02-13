
'use server';

import { getFirebase } from '@/firebase';
import { addDoc, collection } from 'firebase/firestore';
import { z } from 'zod';

const SendEmailSchema = z.object({
  to: z.string(),
  subject: z.string(),
  html: z.string(),
  attachments: z
    .array(
      z.object({
        filename: z.string(),
        content: z.string(),
        encoding: z.string(),
        contentType: z.string(),
      })
    )
    .optional(),
});

export type SendEmailInput = z.infer<typeof SendEmailSchema>;

export async function sendEmail(emailData: SendEmailInput) {
  const { firestore } = getFirebase();
  if (!firestore) {
    throw new Error('Firestore is not initialized.');
  }

  const mailCollection = collection(firestore, 'mail');
  const mailDoc: any = {
    to: [emailData.to],
    message: {
      subject: emailData.subject,
      html: emailData.html,
    },
  };

  if (emailData.attachments && emailData.attachments.length > 0) {
    mailDoc.attachments = emailData.attachments;
  }

  await addDoc(mailCollection, mailDoc);
  return { success: true };
}
