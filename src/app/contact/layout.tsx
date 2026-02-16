
import type { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Direct Support | InvoiceCraft - US Business Help Desk',
    description: 'Connect with the InvoiceCraft support team. We provide premium assistance for US freelancers and agencies using our billing platform.',
    keywords: ['Contact InvoiceCraft', 'US Billing Support', 'Freelancer Help Desk', 'Customer Support USA'],
};

export default function ContactLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return <>{children}</>;
}
