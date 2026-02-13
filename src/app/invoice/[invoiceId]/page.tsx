

'use client';

import { useEffect, useState, useMemo } from 'react';
import { doc, getDocs, collectionGroup, query, where, Firestore } from 'firebase/firestore';
import { useFirebase } from '@/firebase';
import type { Invoice } from '@/lib/types';
import { ClientInvoicePreview } from '@/components/invoice-preview';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { toDateSafe } from '@/lib/utils';

async function findInvoice(firestore: Firestore, invoiceId: string): Promise<{ data: Invoice, ref: any } | null> {
    const q = query(collectionGroup(firestore, 'invoices'), where('id', '==', invoiceId));
    const querySnapshot = await getDocs(q);

    if (!querySnapshot.empty) {
        const docSnap = querySnapshot.docs[0];
        return { 
            data: { id: docSnap.id, ...docSnap.data() } as Invoice,
            ref: docSnap.ref
        };
    }
    
    return null;
}

export default function PublicInvoicePage({ params }: { params: { invoiceId: string } }) {
    const { firestore, user } = useFirebase();
    const [accentColor, setAccentColor] = useState('hsl(var(--primary))');
    const [invoice, setInvoice] = useState<Invoice | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<Error | null>(null);

     useEffect(() => {
        if (typeof window !== 'undefined' && document) {
            const computedColor = getComputedStyle(document.documentElement).getPropertyValue('--primary').trim();
            if (computedColor) {
                setAccentColor(`hsl(${computedColor})`);
            }
        }

        const fetchInvoice = async () => {
            if (!firestore || !params.invoiceId) {
                setIsLoading(false);
                return;
            };
            try {
                const foundInvoiceResult = await findInvoice(firestore, params.invoiceId);
                if (foundInvoiceResult) {
                    setInvoice(foundInvoiceResult.data);
                } else {
                    setError(new Error('Invoice not found.'));
                }
            } catch (err: any) {
                setError(err);
            } finally {
                setIsLoading(false);
            }
        };
        fetchInvoice();

    }, [firestore, params.invoiceId]);


    const loadedInvoice = useMemo(() => {
        if (!invoice) return null;
        const processed: any = {};
        for (const key in invoice) {
            if (Object.prototype.hasOwnProperty.call(invoice, key)) {
                const value = (invoice as any)[key];
                processed[key] = toDateSafe(value) || value;
            }
        }
        return processed as Invoice;
    }, [invoice]);
    
    const isOwner = user && loadedInvoice && user.uid === loadedInvoice.userId;

    if (isLoading) {
        return (
            <div className="container mx-auto p-8">
                <div className="max-w-4xl mx-auto">
                    <Skeleton className="h-10 w-48 mb-8" />
                    <Skeleton className="w-full h-[800px]" />
                </div>
            </div>
        );
    }

    if (error) {
        console.error(error);
        return <div className="container mx-auto p-8 text-center text-destructive">Error: Could not load invoice. This link may be invalid or you may not have permission.</div>;
    }

    if (!loadedInvoice) {
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
                         <Badge variant={getStatusVariant(loadedInvoice.status)} className="text-lg px-4 py-1 capitalize">
                            {loadedInvoice.status}
                        </Badge>
                    </div>
                </div>

                <ClientInvoicePreview 
                    invoice={loadedInvoice}
                    accentColor={accentColor} 
                    backgroundColor={loadedInvoice.backgroundColor || '#FFFFFF'} 
                    textColor={loadedInvoice.textColor || '#374151'}
                />
            </div>
        </div>
    );
}
