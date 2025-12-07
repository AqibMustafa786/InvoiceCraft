'use client';

import { useEffect, useState } from 'react';
import { doc, updateDoc, arrayUnion, serverTimestamp, getDoc } from 'firebase/firestore';
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

export default function PublicEstimatePage({ params }: { params: { estimateId: string } }) {
    const { firestore, user } = useFirebase();
    const [accentColor, setAccentColor] = useState('hsl(var(--primary))');
    const [isAcceptanceModalOpen, setIsAcceptanceModalOpen] = useState(false);
    const [isDeclineAlertOpen, setIsDeclineAlertOpen] = useState(false);
    const { toast } = useToast();
    const [estimate, setEstimate] = useState<Estimate | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<Error | null>(null);

    const estimateRef = useMemoFirebase(async () => {
        if (!firestore) return null;
        // Since companyId is not in the URL, we might need to query for the document.
        // For now, let's assume it's in a root collection for public access,
        // and security rules will handle permissions.
        // This part might need adjustment based on final data structure.
        return doc(firestore, 'estimates', params.estimateId);
    }, [firestore, params.estimateId]);
    
    useEffect(() => {
        const fetchDoc = async () => {
            if (!estimateRef) return;
            try {
                const docSnap = await getDoc(await estimateRef);
                if (docSnap.exists()) {
                    setEstimate(docSnap.data() as Estimate);
                } else {
                     setError(new Error("Estimate not found."));
                }
            } catch (e) {
                setError(e as Error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchDoc();
    }, [estimateRef]);

    useEffect(() => {
        if (typeof window !== 'undefined' && document) {
            const computedColor = getComputedStyle(document.documentElement).getPropertyValue('--primary').trim();
            if (computedColor) {
                setAccentColor(`hsl(${computedColor})`);
            }
        }
    }, []);

    const fromJSON = (key: string, value: any) => {
        if (key === 'estimateDate' || key === 'validUntilDate' || key === 'signedAt' || key === 'timestamp') {
            return value?.toDate ? value.toDate() : (value ? new Date(value) : value);
        }
        return value;
    };
    
    const loadedEstimate = estimate ? JSON.parse(JSON.stringify(estimate), fromJSON) as Estimate : null;
    const isSigned = !!loadedEstimate?.clientSignature;
    const isDeclined = loadedEstimate?.status === 'rejected';
    const isOwner = user && loadedEstimate && user.uid === loadedEstimate.userId;

    const handleDecline = async () => {
        if (!estimateRef || !firestore) return;
        const ref = await estimateRef;
        if (!ref) return;
        
        await updateDoc(ref, {
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
        setEstimate(prev => prev ? { ...prev, status: 'rejected' } : null);
    };

    if (isLoading) {
        return <div className="container mx-auto p-8 text-center">Loading estimate...</div>;
    }

    if (error) {
        console.error(error);
        return <div className="container mx-auto p-8 text-center text-destructive">Error: Could not load estimate. This link may be invalid, expired, or you may not have permission to view it.</div>;
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

                <DocumentAcceptanceModal 
                    isOpen={isAcceptanceModalOpen}
                    onClose={() => setIsAcceptanceModalOpen(false)}
                    docRef={estimateRef as any}
                    docType="Estimate"
                />

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
