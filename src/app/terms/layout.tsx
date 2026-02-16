
import type { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Service Terms & User Agreement | InvoiceCraft Global',
    description: 'Understand the standard service terms for InvoiceCraft users. Professional guidelines for US-based freelancers and agencies using our billing toolkit.',
    keywords: ['InvoiceCraft Terms of Service', 'User Agreement USA', 'Legal Billing Terms', 'Service Protocol InvoiceCraft'],
};

export default function TermsLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return <>{children}</>;
}
