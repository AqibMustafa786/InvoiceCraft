
import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { initializeAdminApp } from '@/firebase/server';
import { FieldValue } from 'firebase-admin/firestore';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2024-04-10',
});

// Initialize Firebase Admin SDK
const { db } = initializeAdminApp();

export async function POST(req: NextRequest) {
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!;
  if (!webhookSecret) {
    console.error("STRIPE_WEBHOOK_SECRET is not set.");
    return NextResponse.json({ error: "Server configuration error." }, { status: 500 });
  }

  const signature = req.headers.get('stripe-signature');
  const body = await req.text();

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(body, signature!, webhookSecret);
  } catch (err: any) {
    console.error(`Webhook signature verification failed: ${err.message}`);
    return NextResponse.json({ error: `Webhook Error: ${err.message}` }, { status: 400 });
  }

  if (!db) {
    console.error("Firebase Admin DB is not available.");
    return NextResponse.json({ error: "Database connection error." }, { status: 500 });
  }

  // Handle the event
  try {
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
            });

            // Also update the plan for all users within that company
            const usersSnapshot = await db.collection('users').where('companyId', '==', companyId).get();
            const batch = db.batch();
            usersSnapshot.forEach(userDoc => {
              const userData = userDoc.data();
              const currentRole = userData.role;
              const updates: any = {
                plan: 'business',
                subscriptionStatus: subscription.status,
              };

              // Rule: If plan is Business, role is Owner (upgrade from free_user)
              if (currentRole === 'free_user') {
                updates.role = 'owner';
              }

              batch.update(userDoc.ref, updates);
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
          const newStatus = subscription.status;
          // If subscription is canceled, plan will be 'free' at period end.
          const newPlan = subscription.cancel_at_period_end ? 'free' : 'business';

          const companyRef = db.collection('companies').doc(companyId);
          await companyRef.update({
            subscriptionStatus: newStatus,
          });

          // Update plan for all users in the company
          const usersSnapshot = await db.collection('users').where('companyId', '==', companyId).get();
          const batch = db.batch();
          usersSnapshot.forEach(userDoc => {
            const userData = userDoc.data();
            const currentRole = userData.role;
            const updates: any = {
              plan: newPlan,
              subscriptionStatus: newStatus,
            };

            if (newPlan === 'business') {
              if (currentRole === 'free_user') updates.role = 'owner';
            } else if (newPlan === 'free') {
              if (currentRole === 'owner') updates.role = 'free_user';
            }

            batch.update(userDoc.ref, updates);
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
            subscriptionId: FieldValue.delete(),
            subscriptionStatus: 'canceled',
          });

          // Revert all users in the company to the free plan
          const usersSnapshot = await db.collection('users').where('companyId', '==', companyId).get();
          const batch = db.batch();
          usersSnapshot.forEach(userDoc => {
            const userData = userDoc.data();
            const currentRole = userData.role;
            const updates: any = {
              plan: 'free',
              subscriptionId: FieldValue.delete(),
              subscriptionStatus: 'canceled',
            };

            if (currentRole === 'owner') {
              updates.role = 'free_user';
            }

            batch.update(userDoc.ref, updates);
          });
          await batch.commit();
        }
        break;
      }
      default:
        console.log(`Unhandled event type ${event.type}`);
    }
  } catch (error: any) {
    console.error("Webhook handler error:", error.message);
    return NextResponse.json({ error: "Webhook handler failed." }, { status: 500 });
  }

  return NextResponse.json({ received: true });
}

