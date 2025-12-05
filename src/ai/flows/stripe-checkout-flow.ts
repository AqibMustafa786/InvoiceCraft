
'use server';
/**
 * @fileOverview A Genkit flow for creating a Stripe Checkout session.
 */

import { ai } from '@/ai/genkit';
import { z } from 'zod';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_API_KEY || '', {
  apiVersion: '2024-06-20',
});

export const StripeCheckoutInputSchema = z.object({
  priceId: z.string().describe('The ID of the Stripe Price object.'),
  userId: z.string().describe('The ID of the user initiating the checkout.'),
  userEmail: z.string().email().describe('The email of the user.'),
});
export type StripeCheckoutInput = z.infer<typeof StripeCheckoutInputSchema>;

export const StripeCheckoutOutputSchema = z.object({
  sessionId: z.string().optional(),
  url: z.string().optional(),
  error: z.string().optional(),
});
export type StripeCheckoutOutput = z.infer<typeof StripeCheckoutOutputSchema>;


export async function createStripeCheckoutSession(input: StripeCheckoutInput): Promise<StripeCheckoutOutput> {
  return createStripeCheckoutSessionFlow(input);
}

const createStripeCheckoutSessionFlow = ai.defineFlow(
  {
    name: 'createStripeCheckoutSessionFlow',
    inputSchema: StripeCheckoutInputSchema,
    outputSchema: StripeCheckoutOutputSchema,
  },
  async ({ priceId, userId, userEmail }) => {
    try {
      const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:9002';
      
      const session = await stripe.checkout.sessions.create({
        payment_method_types: ['card'],
        line_items: [
          {
            price: priceId,
            quantity: 1,
          },
        ],
        mode: 'subscription',
        success_url: `${baseUrl}/dashboard?payment_success=true`,
        cancel_url: `${baseUrl}/pricing?payment_canceled=true`,
        customer_email: userEmail,
        client_reference_id: userId,
        subscription_data: {
          metadata: {
            userId: userId,
          }
        }
      });
      
      return {
        sessionId: session.id,
        url: session.url,
      };
    } catch (e: any) {
      console.error('Stripe Checkout Error:', e);
      return { error: e.message };
    }
  }
);
