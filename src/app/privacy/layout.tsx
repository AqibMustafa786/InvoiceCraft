
import type { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Privacy Shield & Data Policy | InvoiceCraft US',
    description: 'Our commitment to data privacy for US businesses. Learn how InvoiceCraft protects your billing information with zero-storage architecture.',
    keywords: ['InvoiceCraft Privacy Policy', 'US Data Protection', 'Zero Storage Billing', 'Secure Invoicing USA'],
};

export default function PrivacyLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return <>{children}</>;
}
