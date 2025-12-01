'use client';

import { useEffect, useState } from 'react';
import { doc } from 'firebase/firestore';
import { useFirebase, useDoc } from '@/firebase';
import type { Quote } from '@/lib/types';
import { QuotePreview } from '@/components/quote-preview';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function PublicQuotePage({ params }: { params: { quoteId: string } }) {
    const { firestore } = useFirebase();
    const [accentColor, setAccentColor] = useState('hsl(var(--primary))');
    
    const quoteRef = doc(firestore, 'quotes', params.quoteId);
    const { data: quote, isLoading, error } = useDoc<Quote>(quoteRef);

    useEffect(() => {
        if (typeof window !== 'undefined' && document) {
            const computedColor = getComputedStyle(document.documentElement).getPropertyValue('--primary').trim();
            if (computedColor) {
                setAccentColor(`hsl(${computedColor})`);
            }
        }
    }, []);

    const fromJSON = (key: string, value: any) => {
        if (key === 'quoteDate' || key === 'validUntilDate') {
            return value?.toDate ? value.toDate() : (value ? new Date(value) : value);
        }
        return value;
    };
    
    const loadedQuote = quote ? JSON.parse(JSON.stringify(quote), fromJSON) as Quote : null;

    if (isLoading) {
        return <div className="container mx-auto p-8 text-center">Loading quote...</div>;
    }

    if (error) {
        return <div className="container mx-auto p-8 text-center text-destructive">Error: Could not load quote. This link may be invalid or expired.</div>;
    }

    if (!loadedQuote) {
        return <div className="container mx-auto p-8 text-center">This quote could not be found.</div>;
    }
    
    return (
        <div className="container mx-auto p-4 md:p-8">
             <div className="max-w-4xl mx-auto">
                <Button asChild variant="outline" className="mb-8">
                    <Link href="/dashboard">
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        Back to Dashboard
                    </Link>
                </Button>
                <QuotePreview 
                    quote={loadedQuote} 
                    logoUrl={null} // We don't have a secure way to fetch logos for public pages yet
                    accentColor={accentColor} 
                />
            </div>
        </div>
    );
}
