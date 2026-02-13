import '@/ai/genkit'; // side-effect import

import { defineFlow } from '@genkit-ai/flow';
import { z } from 'zod';
import { sendPasswordResetEmail } from 'firebase/auth';
import { getFirebase } from '@/firebase';

export const sendPasswordResetEmailSchema = z.object({
  email: z.string().email(),
});

export const sendPasswordResetEmailFlow = defineFlow(
  {
    name: 'sendPasswordResetEmailFlow',
    inputSchema: sendPasswordResetEmailSchema,
    outputSchema: z.object({
      success: z.boolean(),
      message: z.string(),
    }),
  },
  async ({ email }) => {
    try {
      const { auth } = getFirebase();
      await sendPasswordResetEmail(auth, email);

      return {
        success: true,
        message: 'Password reset email sent successfully.',
      };
    } catch (error) {
      console.error('Password reset error:', error);

      // Security best practice
      return {
        success: true,
        message:
          'If an account with that email exists, a reset link has been sent.',
      };
    }
  }
);
