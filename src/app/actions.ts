'use server';

import { sendPasswordResetEmailFlow } from '@/ai/flows/send-password-reset-flow';
import { sendDocumentFlow } from '@/ai/flows/send-document-flow';
import { z } from 'zod';
import { SendDocumentSchema } from '@/ai/flows/send-document-flow';

export async function sendPasswordReset(email: string) {
  const result = await sendPasswordResetEmailFlow({ email });
  return result;
}

export async function sendDocumentByEmail(input: z.infer<typeof SendDocumentSchema>) {
    return await sendDocumentFlow(input);
}
