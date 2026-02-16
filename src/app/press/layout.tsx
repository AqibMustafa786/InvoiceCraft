
import type { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Press & Media Toolkit | InvoiceCraft US HQ',
    description: 'Access official InvoiceCraft brand assets, media kits, and press releases for American business publications.',
    keywords: ['InvoiceCraft Press Kit', 'US Media Assets', 'Brand Guidelines USA', 'American SaaS Media'],
};

export default function PressLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return <>{children}</>;
}
