

'use client';

import { useEffect, useState, useMemo } from 'react';
import { doc, updateDoc, arrayUnion, serverTimestamp } from 'firebase/firestore';
import { useFirebase, useDoc, useMemoFirebase } from '@/firebase';
import type { Quote } from '@/lib/types';
import { QuotePreview } from '@/components/quote-preview';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Check, X, Pencil } from 'lucide-react';
import Link from 'next/link';
import { DocumentAcceptanceModal } from '@/components/document-acceptance-modal';
import { useToast } from '@/hooks/use-toast';
import { Badge } from '@/components/ui/badge';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { toDateSafe } from '@/lib/utils';
import { format } from 'date-fns';

export default function PublicQuotePage({ params }: { params: { quoteId: string } }) {
    const { firestore, user } = useFirebase();
    const [accentColor, setAccentColor] = useState('hsl(var(--primary))');
    const [isAcceptanceModalOpen, setIsAcceptanceModalOpen] = useState(false);
    const [isDeclineAlertOpen, setIsDeclineAlertOpen] = useState(false);
    const { toast } = useToast();
    
    const quoteRef = useMemoFirebase(() => firestore ? doc(firestore, 'quotes', params.quoteId) : null, [firestore, params.quoteId]);
    const { data: quote, isLoading, error } = useDoc<Quote>(quoteRef);

    useEffect(() => {
        if (typeof window !== 'undefined' && document) {
            const computedColor = getComputedStyle(document.documentElement).getPropertyValue('--primary').trim();
            if (computedColor) {
                setAccentColor(`hsl(${computedColor})`);
            }
        }
    }, []);

    const loadedQuote = useMemo(() => {
        if (!quote) return null;
        const processed: any = {};
        for (const key in quote) {
            if (Object.prototype.hasOwnProperty.call(quote, key)) {
                const value = (quote as any)[key];
                processed[key] = toDateSafe(value) || value;
            }
        }
        return processed as Quote;
    }, [quote]);
    
    const isSigned = !!loadedQuote?.clientSignature;
    const isDeclined = loadedQuote?.status === 'rejected';
    const isOwner = user && loadedQuote && user.uid === loadedQuote.userId;

    const handleDecline = async () => {
        if (!quoteRef || !firestore) return;
        await updateDoc(quoteRef, {
            status: 'rejected',
            auditLog: arrayUnion({
                action: 'declined',
                timestamp: serverTimestamp(),
                actor: 'client',
            })
        });
        toast({
            title: "Quote Declined",
            description: "The sender has been notified.",
        })
        setIsDeclineAlertOpen(false);
    };

    if (isLoading) {
        return <div className="container mx-auto p-8 text-center">Loading quote...</div>;
    }

    if (error) {
        console.error(error);
        return <div className="container mx-auto p-8 text-center text-destructive">Error: Could not load quote. This link may be invalid, expired, or you may not have permission to view it.</div>;
    }

    if (!loadedQuote) {
        return <div className="container mx-auto p-8 text-center">This quote could not be found.</div>;
    }

    const getStatusVariant = (status: Quote['status']) => {
        switch(status) {
            case 'accepted': return 'success';
            case 'rejected':
            case 'expired':
                return 'destructive';
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
                         <Badge variant={getStatusVariant(loadedQuote.status)} className="text-lg px-4 py-1 capitalize">
                            {loadedQuote.status}
                        </Badge>
                        {!isSigned && !isDeclined && !isOwner && (
                            <div className="flex gap-2">
                                <Button onClick={() => setIsAcceptanceModalOpen(true)} className="bg-green-600 hover:bg-green-700">
                                    <Check className="mr-2 h-4 w-4" /> Accept Quote
                                </Button>
                                <Button variant="destructive" onClick={() => setIsDeclineAlertOpen(true)}>
                                    <X className="mr-2 h-4 w-4" /> Decline
                                </Button>
                            </div>
                        )}
                    </div>
                </div>

                <QuotePreview 
                    quote={loadedQuote} 
                    accentColor={accentColor} 
                />

                <DocumentAcceptanceModal 
                    isOpen={isAcceptanceModalOpen}
                    onClose={() => setIsAcceptanceModalOpen(false)}
                    docRef={quoteRef}
                    docType="Quote"
                />

                <AlertDialog open={isDeclineAlertOpen} onOpenChange={setIsDeclineAlertOpen}>
                    <AlertDialogContent>
                        <AlertDialogHeader>
                            <AlertDialogTitle>Are you sure you want to decline?</AlertDialogTitle>
                            <AlertDialogDescription>
                                This action cannot be undone. The sender will be notified that you have declined this quote.
                            </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction onClick={handleDecline} className="bg-destructive hover:bg-destructive/90">Decline</AlertDialogAction>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialog>

            </div>
        </div>
    );
}

    
