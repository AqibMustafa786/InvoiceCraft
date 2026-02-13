'use server';

import { z } from 'zod';
import { sendEmail } from '@/ai/flows/send-email-flow';

const InvitationSchema = z.object({
  email: z.string().email(),
  name: z.string(),
  companyName: z.string(),
  senderName: z.string(),
  companyId: z.string(),
  portalSlug: z.string().optional(),
});

export async function sendInvitationAction(input: InvitationSchemaType) {
  const { email, name, companyName, senderName, companyId, portalSlug } = input;
  try {
    const origin = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
    const inviteLink = portalSlug
      ? `${origin}/c/${portalSlug}/login?email=${encodeURIComponent(email)}&companyId=${encodeURIComponent(companyId)}`
      : `${origin}/signup?email=${encodeURIComponent(email)}&companyId=${encodeURIComponent(companyId)}`;

    await sendEmail({
      to: email,
      subject: `You've been invited to join ${companyName} on InvoiceCraft`,
      html: `
          <div style="font-family: 'Inter', sans-serif; line-height: 1.6; color: #1a1a1a; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e5e7eb; border-radius: 12px;">
            <div style="text-align: center; margin-bottom: 24px;">
              <h1 style="color: #9333ea; margin: 0;">InvoiceCraft</h1>
            </div>
            <p>Hello <strong>${name}</strong>,</p>
            <p><strong>${senderName}</strong> has invited you to join the team at <strong>${companyName}</strong> on InvoiceCraft.</p>
            <p>InvoiceCraft is a powerful platform for managing invoices, estimates, and team collaboration.</p>
            <div style="text-align: center; margin: 32px 0;">
              <a href="${inviteLink}" style="background-color: #9333ea; color: white; padding: 12px 24px; text-decoration: none; border-radius: 9999px; font-weight: 600; display: inline-block;">
                Accept Invitation & Join Team
              </a>
            </div>
            <p style="font-size: 14px; color: #6b7280;">If the button above doesn't work, copy and paste the following link into your browser:</p>
            <p style="font-size: 14px; color: #6b7280; word-break: break-all;">${inviteLink}</p>
            <hr style="border: 0; border-top: 1px solid #e5e7eb; margin: 24px 0;" />
            <p style="font-size: 12px; color: #9ca3af; text-align: center;">Sent by InvoiceCraft Team</p>
          </div>
        `,
    });

    return { success: true, message: 'Invitation email sent successfully.' };
  } catch (error: any) {
    console.error('Failed to send invitation email:', error);
    return { success: false, message: error.message || 'An unknown error occurred.' };
  }
}

export type InvitationSchemaType = z.infer<typeof InvitationSchema>;
