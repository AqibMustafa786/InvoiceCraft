
'use server';

import { sendPasswordReset, PasswordResetInput } from '@/ai/flows/send-password-reset-flow';
import { sendDocumentByEmail as sendDocument, SendDocumentInput } from '@/ai/flows/send-document-flow';
import { z } from 'zod';

import { sendInvitationAction as sendInvitationFlow, InvitationSchemaType } from '@/ai/flows/send-invitation-flow';

export async function sendPasswordResetAction(email: string) {
  const result = await sendPasswordReset({ email });
  return result;
}

export async function sendDocumentByEmail(input: SendDocumentInput) {
  return await sendDocument(input);
}

export async function sendInvitationAction(input: InvitationSchemaType) {
  return await sendInvitationFlow(input);
}

// Re-export type for external use
export type { InvitationSchemaType };
