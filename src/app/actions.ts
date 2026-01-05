'use server';

import { sendPasswordResetEmailFlow } from '@/ai/flows/send-password-reset-flow';
import { sendDocumentFlow, SendDocumentSchema } from '@/ai/flows/send-document-flow';
import { z } from 'zod';

export async function sendPasswordReset(email: string) {
  const result = await sendPasswordResetEmailFlow.run({ email });
  return result;
}

export async function sendDocument(input: z.infer<typeof SendDocumentSchema>) {
    const result = await sendDocumentFlow.run(input);
    return result;
}
