'use client';

import React from 'react';
import type { Invoice, LineItem } from '@/lib/types';
import { format, isValid } from 'date-fns';
import Image from 'next/image';

interface PageProps {
  invoice: Invoice;
  pageItems: LineItem[];
  pageIndex: number;
  totalPages: number;
  subtotal: number;
  taxAmount: number;
  discountAmount: number;
  total: number;
  balanceDue: number;
  t: any;
  currencySymbol: string;
  accentColor: string;
  backgroundColor: string;
  textColor: string;
}

const safeFormat = (date: Date | string | number | null | undefined, formatString: string) => {
    if (!date) return "N/A";
    const d = new Date(date);
    if (!isValid(d)) return "Invalid Date";
    return format(d, formatString);
}

const SignatureDisplay = ({ signature, label }: { signature: any, label: string }) => {
    if (!signature?.image) return null;
    return (
        <div className="mt-8">
            <Image src={signature.image} alt={label} width={150} height={75} className="border-b border-gray-400" />
            <p className="text-xs text-gray-500 pt-1 border-t-2 border-gray-700 w-[150px]">{label}</p>
        </div>
    )
}

export const RoofingDetails: React.FC<{ invoice: Invoice, t: any }> = ({ invoice, t }) => {
    if (!invoice.roofing) return null;
    const { roofing } = invoice;
    return (
       <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-4 gap-y-1 text-xs">
            <p><span className="text-gray-500">{(t.roofMaterial || 'Roof Material')}:</span> <span className="font-semibold">{roofing.roofType}</span></p>
            {roofing.squareFootage && <p><span className="text-gray-500">{(t.roofSizeSqFt || 'Roof Size (sq ft)')}:</span> <span className="font-semibold">{roofing.squareFootage}</span></p>}
            <p><span className="text-gray-500">{(t.roofPitch || 'Roof Pitch')}:</span> <span className="font-semibold">{roofing.pitch}</span></p>
            <p><span className="text-gray-500">{(t.layersToRemove || 'Layers to Remove')}:</span> <span className="font-semibold">{roofing.tearOffRequired ? 'Yes' : 'No'}</span></p>
            <p><span className="text-gray-500">{(t.underlayment || 'Underlayment')}:</span> <span className="font-semibold">{roofing.underlaymentType}</span></p>
            {roofing.dumpsterFee && <p><span className="text-gray-500">{(t.disposalFee || 'Disposal Fee')}:</span> <span className="font-semibold">${roofing.dumpsterFee.toFixed(2)}</span></p>}
        </div>
    );
};
