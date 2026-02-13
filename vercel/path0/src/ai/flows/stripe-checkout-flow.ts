
'use server';

import '@/ai/genkit'; // Side-effect import to configure genkit
import { ai } from '@/ai/genkit';
import { z } from 'genkit';
import Stripe from 'stripe';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { initializeAdminApp } from '@/firebase/server';
import { StripeCheckoutInputSchema, StripeCheckoutOutputSchema } from '@/lib/types';

// Initialize Stripe with the secret key from environment variables.
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2024-06-20',
});

const { db } = initializeAdminApp();

async function getOrCreateStripeCustomer(userId: string, email: string, companyId: string): Promise<string> {
  if (!db) {
    throw new Error("Firebase Admin DB is not initialized.");
  }
  
  const companyRef = doc(db, 'companies', companyId);
  const companySnap = await getDoc(companyRef);
  const companyData = companySnap.data();

  if (companyData?.stripeCustomerId) {
    return companyData.stripeCustomerId;
  }
  
  const customer = await stripe.customers.create({
    email: email,
    metadata: {
      firebaseUID: userId,
      firebaseCompanyId: companyId,
    },
  });

  await updateDoc(companyRef, { stripeCustomerId: customer.id });
  
  return customer.id;
}


export const createStripeCheckoutSession = ai.defineFlow(
  {
    name: 'createStripeCheckoutSession',
    inputSchema: StripeCheckoutInputSchema,
    outputSchema: StripeCheckoutOutputSchema,
  },
  async ({ userId, userEmail, companyId, plan }) => {
    try {
        const customerId = await getOrCreateStripeCustomer(userId, userEmail, companyId);

        const priceId = plan === 'monthly' 
            ? process.env.STRIPE_PRICE_MONTHLY
            : process.env.STRIPE_PRICE_YEARLY;

        if (!priceId) {
            throw new Error(`Price ID for ${plan} plan is not configured.`);
        }
        
        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            customer: customerId,
            line_items: [
                {
                    price: priceId,
                    quantity: 1,
                },
            ],
            mode: 'subscription',
            success_url: `${process.env.NEXT_PUBLIC_BASE_URL}/billing/success`,
            cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL}/billing/cancel`,
            subscription_data: {
                metadata: {
                    firebaseCompanyId: companyId,
                }
            }
        });

        return { sessionId: session.id, url: session.url };

    } catch (e: any) {
        console.error("Stripe Checkout Flow Error:", e);
        return { error: e.message };
    }
  }
);
