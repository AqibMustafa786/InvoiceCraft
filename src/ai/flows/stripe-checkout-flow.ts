
'use server';
/**
 * @fileOverview A Genkit flow for creating a Stripe Checkout session.
 */

import { ai } from '@/ai/genkit';
import Stripe from 'stripe';
import { StripeCheckoutInputSchema, StripeCheckoutOutputSchema, type StripeCheckoutInput, type StripeCheckoutOutput } from '@/lib/types';

const stripe = new Stripe(process.env.STRIPE_API_KEY || '', {
  apiVersion: '2024-06-20',
});

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
