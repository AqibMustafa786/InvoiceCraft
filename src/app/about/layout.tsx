
import type { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Our Mission & Vision | InvoiceCraft - Built for US Success',
    description: 'Discover how InvoiceCraft is empowering the modern American workforce with smart, automated, and professional invoicing solutions.',
    keywords: ['About InvoiceCraft', 'US Freelancer Mission', 'Invoicing Vision', 'American Billing Software'],
};

export default function AboutLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return <>{children}</>;
}
