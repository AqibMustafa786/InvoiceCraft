

'use client';
export const dynamic = 'force-dynamic';

import { useEffect, useState } from 'react';
import { doc } from 'firebase/firestore';
import { useFirebase, useDoc, useMemoFirebase } from '@/firebase';
import type { Invoice } from '@/lib/types';
import { ClientInvoicePreview } from '@/components/invoice-preview';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { Badge } from '@/components/ui/badge';
import { isValid } from 'date-fns';

export default function PublicInvoicePage({ params }: { params: { invoiceId: string } }) {
    const { firestore, user } = useFirebase();
    const [logoUrl, setLogoUrl] = useState<string | null>(null);
    const [accentColor, setAccentColor] = useState('hsl(var(--primary))');

    const invoiceRef = useMemoFirebase(() => firestore ? doc(firestore, 'invoices', params.invoiceId) : null, [firestore, params.invoiceId]);
    const { data: invoiceData, isLoading, error } = useDoc<Invoice>(invoiceRef);

    useEffect(() => {
        if (typeof window !== 'undefined' && document) {
            const computedColor = getComputedStyle(document.documentElement).getPropertyValue('--primary').trim();
            if (computedColor) {
                setAccentColor(`hsl(${computedColor})`);
            }
        }
    }, []);

    const fromJSON = (key: string, value: any) => {
        if (['invoiceDate', 'dueDate', 'createdAt', 'updatedAt'].includes(key) && value) {
            return value?.toDate ? value.toDate() : (isValid(new Date(value)) ? new Date(value) : value);
        }
        return value;
    };
    
    const invoice = invoiceData ? JSON.parse(JSON.stringify(invoiceData), fromJSON) as Invoice : null;
    const isOwner = user && invoice && user.uid === invoice.userId;

    if (isLoading) {
        return <div className="container mx-auto p-8 text-center">Loading invoice...</div>;
    }

    if (error) {
        console.error(error);
        return <div className="container mx-auto p-8 text-center text-destructive">Error: Could not load invoice. This link may be invalid or you may not have permission.</div>;
    }

    if (!invoice) {
        return <div className="container mx-auto p-8 text-center">This invoice could not be found.</div>;
    }
    
    const getStatusVariant = (status: Invoice['status']) => {
        switch(status) {
            case 'paid': return 'success';
            case 'overdue': return 'destructive';
            case 'sent': return 'secondary';
            default: return 'outline';
        }
    }

    return (
        <div className="container mx-auto p-4 md:p-8">
             <div className="max-w-4xl mx-auto">
                <div className="mb-8 flex flex-wrap justify-between items-center gap-4">
                    {isOwner ? (
                         <Button asChild variant="outline">
                            <Link href="/dashboard">
                                <ArrowLeft className="mr-2 h-4 w-4" />
                                Back to Dashboard
                            </Link>
                        </Button>
                    ) : <div></div>}
                   
                    <div className="flex items-center gap-4">
                         <Badge variant={getStatusVariant(invoice.status)} className="text-lg px-4 py-1 capitalize">
                            {invoice.status}
                        </Badge>
                    </div>
                </div>

                <ClientInvoicePreview 
                    invoice={invoice}
                    accentColor={accentColor} 
                    backgroundColor={invoice.backgroundColor || '#FFFFFF'} 
                    textColor={invoice.textColor || '#374151'}
                />
            </div>
        </div>
    );
}

    