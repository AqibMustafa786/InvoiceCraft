

'use client';

import { useEffect, useState } from 'react';
import { doc } from 'firebase/firestore';
import { useFirebase, useDoc, useMemoFirebase } from '@/firebase';
import type { Estimate } from '@/lib/types';
import { EstimatePreview } from '@/components/estimate-preview';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function PublicEstimatePage({ params }: { params: { estimateId: string } }) {
    const { firestore } = useFirebase();
    const [accentColor, setAccentColor] = useState('hsl(var(--primary))');
    
    const estimateRef = useMemoFirebase(() => firestore ? doc(firestore, 'estimates', params.estimateId) : null, [firestore, params.estimateId]);
    const { data: estimate, isLoading, error } = useDoc<Estimate>(estimateRef);

    useEffect(() => {
        if (typeof window !== 'undefined' && document) {
            const computedColor = getComputedStyle(document.documentElement).getPropertyValue('--primary').trim();
            if (computedColor) {
                setAccentColor(`hsl(${computedColor})`);
            }
        }
    }, []);

    const fromJSON = (key: string, value: any) => {
        if (key === 'estimateDate' || key === 'validUntilDate') {
            return value?.toDate ? value.toDate() : (value ? new Date(value) : value);
        }
        return value;
    };
    
    const loadedEstimate = estimate ? JSON.parse(JSON.stringify(estimate), fromJSON) as Estimate : null;

    if (isLoading) {
        return <div className="container mx-auto p-8 text-center">Loading estimate...</div>;
    }

    if (error) {
        return <div className="container mx-auto p-8 text-center text-destructive">Error: Could not load estimate. This link may be invalid or expired.</div>;
    }

    if (!loadedEstimate) {
        return <div className="container mx-auto p-8 text-center">This estimate could not be found.</div>;
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
                <EstimatePreview 
                    estimate={loadedEstimate} 
                    accentColor={accentColor} 
                />
            </div>
        </div>
    );
}
