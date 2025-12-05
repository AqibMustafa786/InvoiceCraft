
import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { initializeAdminApp } from '@/firebase/server';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2024-06-20',
});

// Initialize Firebase Admin SDK
const { db } = initializeAdminApp();

export async function POST(req: NextRequest) {
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!;
  const signature = req.headers.get('stripe-signature');
  const body = await req.text();

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(body, signature!, webhookSecret);
  } catch (err: any) {
    console.error(`Webhook signature verification failed: ${err.message}`);
    return NextResponse.json({ error: `Webhook Error: ${err.message}` }, { status: 400 });
  }

  // Handle the event
  switch (event.type) {
    case 'checkout.session.completed': {
      const session = event.data.object as Stripe.Checkout.Session;
      if (session.mode === 'subscription' && session.subscription) {
        const subscriptionId = session.subscription.toString();
        const subscription = await stripe.subscriptions.retrieve(subscriptionId);
        
        const companyId = subscription.metadata.firebaseCompanyId;
        if (companyId) {
          const companyRef = db.collection('companies').doc(companyId);
          await companyRef.update({
            subscriptionId: subscription.id,
            subscriptionStatus: subscription.status,
            plan: 'business',
          });
          
          // Also update all users within that company
          const usersSnapshot = await db.collection('users').where('companyId', '==', companyId).get();
          const batch = db.batch();
          usersSnapshot.forEach(userDoc => {
            batch.update(userDoc.ref, { plan: 'business' });
          });
          await batch.commit();
        }
      }
      break;
    }
    case 'customer.subscription.updated': {
        const subscription = event.data.object as Stripe.Subscription;
        const companyId = subscription.metadata.firebaseCompanyId;
        if (companyId) {
            const companyRef = db.collection('companies').doc(companyId);
            await companyRef.update({
                subscriptionStatus: subscription.status,
                 // If the subscription is cancelled, revert to free plan
                plan: subscription.cancel_at_period_end ? 'free' : 'business',
            });

             // Also update all users within that company
            const usersSnapshot = await db.collection('users').where('companyId', '==', companyId).get();
            const batch = db.batch();
            usersSnapshot.forEach(userDoc => {
                batch.update(userDoc.ref, { plan: subscription.cancel_at_period_end ? 'free' : 'business' });
            });
            await batch.commit();
        }
        break;
    }
    case 'customer.subscription.deleted': {
      const subscription = event.data.object as Stripe.Subscription;
      const companyId = subscription.metadata.firebaseCompanyId;
       if (companyId) {
            const companyRef = db.collection('companies').doc(companyId);
            await companyRef.update({
                subscriptionStatus: subscription.status,
                plan: 'free', // Subscription is fully deleted
            });

             // Also update all users within that company
            const usersSnapshot = await db.collection('users').where('companyId', '==', companyId).get();
            const batch = db.batch();
            usersSnapshot.forEach(userDoc => {
                batch.update(userDoc.ref, { plan: 'free' });
            });
            await batch.commit();
        }
      break;
    }
    default:
      console.log(`Unhandled event type ${event.type}`);
  }

  return NextResponse.json({ received: true });
}
