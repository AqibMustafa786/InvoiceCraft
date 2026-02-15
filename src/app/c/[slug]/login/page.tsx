import { Metadata } from 'next';
import { LoginForm } from './login-form';
import { initializeAdminApp } from '@/firebase/server';
import { Company } from '@/lib/types';

// Force dynamic because we are fetching data based on slug, but we could also use generateStaticParams
// For now, let's keep it dynamic or default. 
// If we want best performance and we know slugs, static is better, but this is a SaaS so dynamic is expected.

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
    const { slug } = params;
    const { db } = initializeAdminApp();

    if (!db) {
        return {
            title: 'Login - InvoiceCraft Base',
        };
    }

    try {
        const companiesRef = db.collection('companies');
        const snapshot = await companiesRef.where('portalSettings.slug', '==', slug).limit(1).get();

        if (!snapshot.empty) {
            const company = snapshot.docs[0].data() as Company;
            return {
                title: `Login - ${company.name || 'InvoiceCraft'}`,
                description: company.portalSettings?.description || 'Client Portal Login',
            };
        }
    } catch (e) {
        console.error('Error fetching metadata:', e);
    }

    return {
        title: 'Login - InvoiceCraft',
    };
}

async function getCompany(slug: string): Promise<Company | null> {
    const { db } = initializeAdminApp();
    if (!db) return null;

    try {
        const companiesRef = db.collection('companies');
        const snapshot = await companiesRef.where('portalSettings.slug', '==', slug).limit(1).get();

        if (snapshot.empty) {
            return null;
        }

        const doc = snapshot.docs[0];
        const data = doc.data() as any; // Firestore data

        // We need to ensure we return a plain object for serialization to client component
        // Timestamp objects from firebase-admin need conversion if they exist
        // But for Company/PortalSettings usually it's strings/booleans.
        // Let's assume standard JSON compatible types for now or basic spread.

        return {
            id: doc.id,
            ...data
        } as Company;
    } catch (e) {
        console.error('Error fetching company server-side:', e);
        return null;
    }
}

export default async function LoginPage({ params }: { params: { slug: string } }) {
    const { slug } = params;
    const company = await getCompany(slug);

    return <LoginForm initialCompany={company} slug={slug} />;
}
