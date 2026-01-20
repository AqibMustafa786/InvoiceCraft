
'use server';

import { sendPasswordReset } from '@/ai/flows/send-password-reset-flow';
import { sendDocumentByEmail as sendDocument } from '@/ai/flows/send-document-flow';
import { z } from 'zod';
import { SendDocumentSchema } from '@/ai/flows/send-document-flow';

export async function sendPasswordResetAction(email: string) {
  const result = await sendPasswordReset({ email });
  return result;
}

export async function sendDocumentByEmail(input: z.infer<typeof SendDocumentSchema>) {
    return await sendDocument(input);
}
