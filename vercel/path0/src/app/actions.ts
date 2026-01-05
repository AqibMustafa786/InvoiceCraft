'use server';

import { sendPasswordResetEmailFlow } from '@/ai/flows/send-password-reset-flow';

export async function sendPasswordReset(email: string) {
  return await sendPasswordResetEmailFlow.run({ email });
}
