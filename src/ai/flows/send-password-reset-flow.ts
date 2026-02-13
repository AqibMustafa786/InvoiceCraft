
'use server';

import { z } from 'zod';
import { sendPasswordResetEmail } from 'firebase/auth';
import { getFirebase } from '@/firebase';

const sendPasswordResetEmailSchema = z.object({
  email: z.string().email(),
});

export type PasswordResetInput = z.infer<typeof sendPasswordResetEmailSchema>;

export async function sendPasswordReset(input: PasswordResetInput) {
  const { email } = input;
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
