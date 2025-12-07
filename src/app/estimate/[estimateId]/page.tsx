
'use client';

import { useEffect, useState } from 'react';
import { doc, updateDoc, arrayUnion, serverTimestamp } from 'firebase/firestore';
import { useFirebase, useDoc, useMemoFirebase } from '@/firebase';
import type { Estimate } from '@/lib/types';
import { EstimatePreview } from '@/components/estimate-preview';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Check, X } from 'lucide-react';
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
} from "@/components/ui/alert-dialog"
import { Skeleton } from '@/components/ui/skeleton';

export default function PublicEstimatePage({ params }: { params: { estimateId: string } }) {
    const { firestore, user } = useFirebase();
    const [accentColor, setAccentColor] = useState('hsl(var(--primary))');
    const [isAcceptanceModalOpen, setIsAcceptanceModalOpen] = useState(false);
    const [isDeclineAlertOpen, setIsDeclineAlertOpen] = useState(false);
    const { toast } = useToast();
    
    const docRef = useMemoFirebase(() => {
      if (!firestore || !params.estimateId) return null;
      return doc(firestore, 'estimates', params.estimateId);
    }, [firestore, params.estimateId]);
    
    const { data: estimate, isLoading, error } = useDoc<Estimate>(docRef);

    useEffect(() => {
        if (typeof window !== 'undefined' && document) {
            const computedColor = getComputedStyle(document.documentElement).getPropertyValue('--primary').trim();
            if (computedColor) {
                setAccentColor(`hsl(${computedColor})`);
            }
        }
    }, []);

    const fromJSON = (key: string, value: any) => {
        if (['estimateDate', 'validUntilDate', 'signedAt', 'timestamp'].includes(key) && value) {
            return value?.toDate ? value.toDate() : (value ? new Date(value) : value);
        }
        return value;
    };
    
    const loadedEstimate = estimate ? JSON.parse(JSON.stringify(estimate), fromJSON) as Estimate : null;
    const isSigned = !!loadedEstimate?.clientSignature;
    const isDeclined = loadedEstimate?.status === 'rejected';
    const isOwner = user && loadedEstimate && user.uid === loadedEstimate.userId;

    const handleDecline = async () => {
        if (!docRef) return;
        
        await updateDoc(docRef, {
            status: 'rejected',
            auditLog: arrayUnion({
                action: 'declined',
                timestamp: serverTimestamp(),
                actor: 'client',
            })
        });
        toast({
            title: "Estimate Declined",
            description: "The sender has been notified.",
        })
        setIsDeclineAlertOpen(false);
    };

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
        return <div className="container mx-auto p-8 text-center text-destructive">Error: {error.message}</div>;
    }

    if (!loadedEstimate) {
        return <div className="container mx-auto p-8 text-center">This estimate could not be found.</div>;
    }

    const getStatusVariant = (status: Estimate['status']) => {
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
                         <Badge variant={getStatusVariant(loadedEstimate.status)} className="text-lg px-4 py-1 capitalize">
                            {loadedEstimate.status}
                        </Badge>
                        {!isSigned && !isDeclined && !isOwner && (
                            <div className="flex gap-2">
                                <Button onClick={() => setIsAcceptanceModalOpen(true)} className="bg-green-600 hover:bg-green-700">
                                    <Check className="mr-2 h-4 w-4" /> Accept Estimate
                                </Button>
                                <Button variant="destructive" onClick={() => setIsDeclineAlertOpen(true)}>
                                    <X className="mr-2 h-4 w-4" /> Decline
                                </Button>
                            </div>
                        )}
                    </div>
                </div>

                <EstimatePreview 
                    estimate={loadedEstimate} 
                    accentColor={accentColor} 
                />

                 {docRef && (
                    <DocumentAcceptanceModal 
                        isOpen={isAcceptanceModalOpen}
                        onClose={() => setIsAcceptanceModalOpen(false)}
                        docRef={docRef}
                        docType="Estimate"
                    />
                )}

                <AlertDialog open={isDeclineAlertOpen} onOpenChange={setIsDeclineAlertOpen}>
                    <AlertDialogContent>
                        <AlertDialogHeader>
                            <AlertDialogTitle>Are you sure you want to decline?</AlertDialogTitle>
                            <AlertDialogDescription>
                                This action cannot be undone. The sender will be notified that you have declined this estimate.
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
