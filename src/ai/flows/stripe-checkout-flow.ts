
'use server';
/**
 * @fileOverview A Genkit flow for creating and managing Stripe subscriptions.
 */

import Stripe from 'stripe';
import { initializeAdminApp } from '@/firebase/server';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
  apiVersion: '2024-06-20',
});

// Initialize Firebase Admin SDK
const { db } = initializeAdminApp();


/**
 * Creates a Stripe Checkout session for a user to purchase a subscription.
 * @param {object} input - The user ID, email, and desired plan.
 * @returns {Promise<{ url: string } | { error: string }>} The session URL or an error.
 */
export async function createStripeCheckoutSession(input: {
  userId: string;
  userEmail: string;
  companyId: string;
  plan: 'monthly' | 'yearly';
}): Promise<{ url: string } | { error: string }> {
  const { userId, userEmail, companyId, plan } = input;

  if (!userId || !userEmail || !companyId || !plan) {
    return { error: 'Missing required parameters: userId, userEmail, companyId, and plan.' };
  }

  const priceId =
    plan === 'monthly'
      ? process.env.STRIPE_PRICE_MONTHLY
      : process.env.STRIPE_PRICE_YEARLY;

  if (!priceId) {
    return { error: 'Stripe price ID for the selected plan is not configured.' };
  }
  if (!db) {
     return { error: 'Firebase Admin SDK is not initialized. Check server environment variables.' };
  }

  try {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:9002';
    const companyRef = db.collection('companies').doc(companyId);
    const companyDoc = await companyRef.get();
    const companyData = companyDoc.data();

    let stripeCustomerId = companyData?.stripeCustomerId;

    // Create a new Stripe customer if one doesn't exist for the company
    if (!stripeCustomerId) {
      const customer = await stripe.customers.create({
        email: userEmail,
        name: companyData?.name,
        metadata: {
          firebaseCompanyId: companyId,
        },
      });
      stripeCustomerId = customer.id;
      await companyRef.update({ stripeCustomerId });
    }

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      mode: 'subscription',
      customer: stripeCustomerId,
      line_items: [{ price: priceId, quantity: 1 }],
      success_url: `${baseUrl}/billing/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${baseUrl}/billing/cancel`,
      subscription_data: {
        metadata: {
          firebaseCompanyId: companyId,
          firebaseUserId: userId,
        },
      },
    });
    
    if (!session.url) {
        return { error: "Could not create Stripe session." };
    }

    return { url: session.url };

  } catch (e: any) {
    console.error('Stripe Checkout Error:', e);
    return { error: e.message };
  }
}

/**
 * Creates a Stripe Customer Portal session for a user to manage their subscription.
 * @param {string} companyId - The Firebase company ID.
 * @returns {Promise<{ url: string } | { error: string }>} The portal URL or an error.
 */
export async function createCustomerPortalSession({
  companyId,
}: {
  companyId: string;
}): Promise<{ url: string } | { error: string }> {
  if (!db) {
     return { error: 'Firebase Admin SDK is not initialized. Check server environment variables.' };
  }
  try {
    const companyDoc = await db.collection('companies').doc(companyId).get();
    const stripeCustomerId = companyDoc.data()?.stripeCustomerId;

    if (!stripeCustomerId) {
      return { error: 'Stripe customer ID not found for this company.' };
    }

    const portalSession = await stripe.billingPortal.sessions.create({
      customer: stripeCustomerId,
      return_url: `${process.env.NEXT_PUBLIC_BASE_URL}/dashboard`,
    });

    return { url: portalSession.url };
  } catch (e: any) {
    console.error('Stripe Portal Error:', e);
    return { error: e.message };
  }
}

    