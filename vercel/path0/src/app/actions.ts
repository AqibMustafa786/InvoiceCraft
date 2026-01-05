'use server';

import { sendPasswordResetEmailFlow } from '@/ai/flows/send-password-reset-flow';
import { sendDocumentFlow } from '@/ai/flows/send-document-flow';

export async function sendPasswordReset(email: string) {
  return await sendPasswordResetEmailFlow.run({ email });
}

export async function sendDocumentByEmail(input: {
  docId: string;
  docType: 'quote' | 'estimate';
}) {
  return await sendDocumentFlow.run(input);
}
