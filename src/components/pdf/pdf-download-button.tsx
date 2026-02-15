'use client';

import { useState, useEffect } from 'react';
import { PDFDownloadLink } from '@react-pdf/renderer';
import { Download, Loader2 } from 'lucide-react';
import { PDFDocument } from './document-pdf';
import type { Invoice, Estimate, Quote } from '@/lib/types';

import { useLanguage } from '@/context/language-context';
import { useUserAuth } from '@/context/auth-provider';

interface PDFDownloadButtonProps {
    document: Invoice | Estimate | Quote;
    fileName: string;
}

export function PDFDownloadButton({ document, fileName }: PDFDownloadButtonProps) {
    const [isMounted, setIsMounted] = useState(false);
    const { language } = useLanguage();
    const { userProfile } = useUserAuth();

    useEffect(() => {
        setIsMounted(true);
    }, []);

    if (!isMounted) {
        return (
            <div className="flex items-center w-full text-muted-foreground">
                <Loader2 className="mr-2 h-3.5 w-3.5 animate-spin" />
                <span className="text-xs">Loading PDF...</span>
            </div>
        );
    }

    return (
        <PDFDownloadLink
            document={<PDFDocument data={document} language={language} plan={userProfile?.plan || 'free'} />}
            fileName={fileName}
            className="flex items-center w-full"
        >
            {/* @ts-ignore */}
            {({ loading }: { loading: boolean }) => (
                <>
                    {loading ? <Loader2 className="mr-2 h-3.5 w-3.5 animate-spin" /> : <Download className="mr-2 h-3.5 w-3.5" />}
                    <span className="text-xs">{loading ? 'Preparing...' : 'Download PDF'}</span>
                </>
            )}
        </PDFDownloadLink>
    );
}
