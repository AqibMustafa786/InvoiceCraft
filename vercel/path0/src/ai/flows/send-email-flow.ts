
'use server';
/**
 * @fileOverview A flow for sending emails.
 *
 * This file defines a Genkit flow for sending emails using a generic email
 * sending mechanism, which in this case is Firebase's mail-trigger extension.
 *
 * - sendEmail: A flow that sends an email by writing to a Firestore collection.
 * - SendEmailSchema: The Zod schema for the input of the sendEmail flow.
 */
import '@/ai/genkit'; // Side-effect import to configure genkit
import { ai } from '@/ai/genkit';
import { getFirebase } from '@/firebase';
import { addDoc, collection } from 'firebase/firestore';
import { z } from 'zod';

export const SendEmailSchema = z.object({
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

export async function sendEmail(input: z.infer<typeof SendEmailSchema>) {
  return await sendEmailFlow(input);
}

const sendEmailFlow = ai.defineFlow(
  {
    name: 'sendEmailFlow',
    inputSchema: SendEmailSchema,
    outputSchema: z.any(),
  },
  async (emailData) => {
    const { firestore } = getFirebase();
    if (!firestore) {
      throw new Error('Firestore is not initialized.');
    }
    const mailCollection = collection(firestore, 'mail');
    await addDoc(mailCollection, {
      to: [emailData.to],
      message: {
        subject: emailData.subject,
        html: emailData.html,
      },
      attachments: emailData.attachments,
    });
    return { success: true };
  }
);
