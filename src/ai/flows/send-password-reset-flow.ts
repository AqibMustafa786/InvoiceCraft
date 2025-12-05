
'use server';
/**
 * @fileOverview A flow to send a password reset link via email.
 */

import { ai } from '@/ai/genkit';
import { z } from 'zod';
import { getFirestore, collection, addDoc } from 'firebase/firestore';
import { initializeFirebase } from '@/firebase';
import { getAuth as getAdminAuth } from 'firebase-admin/auth';
import { initializeApp, getApps, cert } from 'firebase-admin/app';

// Initialize Firebase client-side SDK for writing to 'mail' collection
const { firestore } = initializeFirebase();

// Initialize Firebase Admin SDK for generating the link
if (!getApps().length) {
    const serviceAccount = process.env.FIREBASE_SERVICE_ACCOUNT_KEY
    ? JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_KEY)
    : undefined;

    initializeApp({
        credential: serviceAccount ? cert(serviceAccount) : undefined,
    });
}


export const SendPasswordResetInputSchema = z.object({
  email: z.string().email().describe('The email address to send the reset link to.'),
});
export type SendPasswordResetInput = z.infer<typeof SendPasswordResetInputSchema>;

export const SendPasswordResetOutputSchema = z.object({
  success: z.boolean(),
  message: z.string(),
});
export type SendPasswordResetOutput = z.infer<typeof SendPasswordResetOutputSchema>;


export async function sendPasswordResetEmailFlow(input: SendPasswordResetInput): Promise<SendPasswordResetOutput> {
  return sendPasswordResetFlow(input);
}

const sendPasswordResetFlow = ai.defineFlow(
  {
    name: 'sendPasswordResetFlow',
    inputSchema: SendPasswordResetInputSchema,
    outputSchema: SendPasswordResetOutputSchema,
  },
  async ({ email }) => {
    try {
      const adminAuth = getAdminAuth();
      const link = await adminAuth.generatePasswordResetLink(email);
      
      const mailRef = collection(firestore, 'mail');
      await addDoc(mailRef, {
        to: [email],
        message: {
          subject: 'Reset your password for InvoiceCraft',
          html: `
            <p>Hello,</p>
            <p>You requested a password reset for your InvoiceCraft account.</p>
            <p>Please click the link below to set a new password:</p>
            <p><a href="${link}">Reset Password</a></p>
            <p>If you did not request this, you can safely ignore this email.</p>
            <p>Thanks,<br/>The InvoiceCraft Team</p>
          `,
        },
      });

      return { success: true, message: 'Password reset email sent successfully.' };
    } catch (error: any) {
        console.error("Error in sendPasswordResetFlow: ", error);
        // Firebase Admin SDK throws specific error codes for user-not-found
        if (error.code === 'auth/user-not-found') {
             // We return success to avoid leaking information about which emails are registered.
            return { success: true, message: 'If an account exists for this email, a reset link has been sent.' };
        }
        return { success: false, message: error.message || 'An unexpected error occurred.' };
    }
  }
);
