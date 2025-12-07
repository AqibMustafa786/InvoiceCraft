'use client';

import { useEffect, useState, useMemo } from 'react';
import { doc, updateDoc, arrayUnion, serverTimestamp, getDocs, collection, query, where, limit } from 'firebase/firestore';
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

    const estimateRef = useMemo(() => {
        if (!firestore || !params.estimateId) return null;
        // This ref is optimistic; we don't know the companyId yet.
        // We will find it via query.
        return doc(collection(firestore, 'companies'), 'dummy', 'estimates', params.estimateId);
    }, [firestore, params.estimateId]);
    
    useEffect(() => {
        const fetchDoc = async () => {
            if (!firestore || !params.estimateId) {
                setIsLoading(false);
                setError(new Error("Firestore not available"));
                return;
            };
            
            try {
                // Query across all 'estimates' sub-collections for the document
                const estimatesQuery = query(
                    collection(firestore, 'companies'),
                    // This is a collection group query placeholder. In a real scenario, you'd enable this in Firestore.
                    // For now, let's simulate it by iterating. A better production approach is a root lookup collection.
                );
                
                const companiesSnapshot = await getDocs(collection(firestore, "companies"));
                let foundDoc = null;

                for (const companyDoc of companiesSnapshot.docs) {
                    const estimateDocRef = doc(firestore, 'companies', companyDoc.id, 'estimates', params.estimateId);
                    const docSnap = await getDocs(query(collection(firestore, 'companies', companyDoc.id, 'estimates'), where('id', '==', params.estimateId), limit(1)));
                    
                    if (!docSnap.empty) {
                        foundDoc = docSnap.docs[0];
                        break;
                    }
                }

                if (foundDoc) {
                    setEstimate(foundDoc.data() as Estimate);
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
    }, [firestore, params.estimateId]);

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
        if (!estimateRef || !firestore || !loadedEstimate?.companyId) return;
        const ref = doc(firestore, 'companies', loadedEstimate.companyId, 'estimates', params.estimateId);
        
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

                 {estimateRef && loadedEstimate && (
                    <DocumentAcceptanceModal 
                        isOpen={isAcceptanceModalOpen}
                        onClose={() => setIsAcceptanceModalOpen(false)}
                        docRef={doc(firestore, 'companies', loadedEstimate.companyId, 'estimates', params.estimateId)}
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
