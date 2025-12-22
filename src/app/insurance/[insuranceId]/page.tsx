
'use client';

import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { doc, getDocs, collectionGroup, query, where, Firestore } from 'firebase/firestore';
import { useFirebase } from '@/firebase';
import type { InsuranceDocument } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Printer, Download } from 'lucide-react';
import Link from 'next/link';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { CertificateOfInsurance } from '@/components/certificate-of-insurance';
import { Card, CardContent } from '@/components/ui/card';

async function findInsuranceDoc(firestore: Firestore, insuranceId: string): Promise<{ data: InsuranceDocument, ref: any } | null> {
    const q = query(collectionGroup(firestore, 'insurance'), where('id', '==', insuranceId));
    const querySnapshot = await getDocs(q);

    if (!querySnapshot.empty) {
        const docSnap = querySnapshot.docs[0];
        return { 
            data: { id: docSnap.id, ...docSnap.data() } as InsuranceDocument,
            ref: docSnap.ref
        };
    }
    
    return null;
}

function PrintableCOI({ doc }: { doc: InsuranceDocument }) {
    const [container, setContainer] = useState<HTMLElement | null>(null);

    useEffect(() => {
        const el = document.getElementById('print-container');
        if (el) {
            setContainer(el);
        }
    }, []);

    if (!container) {
        return null;
    }

    return createPortal(
        <CertificateOfInsurance document={doc} />,
        container
    );
}


export default function PublicCOIPage({ params }: { params: { insuranceId: string } }) {
    const { firestore, user } = useFirebase();
    const [document, setDocument] = useState<InsuranceDocument | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<Error | null>(null);

    useEffect(() => {
        const fetchDocument = async () => {
            if (!firestore || !params.insuranceId) {
                setIsLoading(false);
                return;
            };
            try {
                const foundDocResult = await findInsuranceDoc(firestore, params.insuranceId);
                if (foundDocResult) {
                    setDocument(foundDocResult.data);
                } else {
                    setError(new Error('Certificate of Insurance not found.'));
                }
            } catch (err: any) {
                setError(err);
            } finally {
                setIsLoading(false);
            }
        };
        fetchDocument();

    }, [firestore, params.insuranceId]);

    const isOwner = user && document && user.uid === document.userId;
    
    const handlePrint = () => {
        window.print();
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

    if (!document) {
        return <div className="container mx-auto p-8 text-center">This Certificate of Insurance could not be found.</div>;
    }

    const getStatusVariant = (status: InsuranceDocument['status']) => {
        switch(status) {
            case 'active': return 'success';
            case 'expired':
            case 'cancelled':
                return 'destructive';
            case 'draft': return 'secondary';
            default: return 'outline';
        }
    }

    return (
         <div className="container mx-auto p-4 md:p-8 bg-muted/20">
             <div className="max-w-4xl mx-auto">
                <div className="mb-8 flex flex-wrap justify-between items-center gap-4 print-hide">
                     {isOwner ? (
                         <Button asChild variant="outline">
                            <Link href="/dashboard?tab=insurance">
                                <ArrowLeft className="mr-2 h-4 w-4" />
                                Back to Dashboard
                            </Link>
                        </Button>
                    ) : <div></div>}
                   
                    <div className="flex items-center gap-4">
                         <Badge variant={getStatusVariant(document.status)} className="text-lg px-4 py-1 capitalize">
                            {document.status}
                        </Badge>
                        <Button onClick={handlePrint} variant="outline">
                            <Download className="mr-2 h-4 w-4" />
                            Download PDF
                        </Button>
                    </div>
                </div>
                <Card id="coi-preview" className="shadow-lg">
                    <CardContent className="p-0">
                        <CertificateOfInsurance document={document} />
                    </CardContent>
                </Card>
                {document && <PrintableCOI doc={document} />}
            </div>
        </div>
    );
}

