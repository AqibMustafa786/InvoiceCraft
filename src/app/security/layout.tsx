
import type { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Elite Data Security | InvoiceCraft US - Zero-Storage Protocol',
    description: 'Learn about our advanced zero-storage architecture. We provide bank-level security for US freelance and agency billing data.',
    keywords: ['InvoiceCraft Security', 'Secure Billing USA', 'Zero Storage Invoicing', 'PCI Compliant Tool', 'Bank Level Security'],
};

export default function SecurityLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return <>{children}</>;
}
