
'use client';

import React from 'react';
import type { Invoice, LineItem } from '@/lib/types';

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

export const RoofingDetails: React.FC<{ invoice: Invoice, t: any }> = ({ invoice, t }) => {
    if (!invoice.roofing) return null;
    const { roofing } = invoice;
    const hasDetails = Object.values(roofing).some(val => val !== null && val !== '');
    if (!hasDetails) {
        return (
            <section className="my-4 text-xs">
                <p className="font-bold text-gray-500 mb-2 border-b">{t.roofingSpecifications || 'Roofing Specifications'}</p>
            </section>
        );
    }
    
    return (
        <section className="my-4 text-xs">
            <p className="font-bold text-gray-500 mb-2 border-b">{t.roofingSpecifications || 'Roofing Specifications'}</p>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-4 gap-y-1">
                {roofing.roofType && <p><span className="text-gray-500">{(t.roofMaterial || 'Roof Material')}:</span> <span className="font-semibold">{roofing.roofType}</span></p>}
                {roofing.squareFootage && <p><span className="text-gray-500">{(t.roofSizeSqFt || 'Roof Size (sq ft)')}:</span> <span className="font-semibold">{roofing.squareFootage}</span></p>}
                {roofing.pitch && <p><span className="text-gray-500">{(t.roofPitch || 'Roof Pitch')}:</span> <span className="font-semibold">{roofing.pitch}</span></p>}
                {roofing.tearOffRequired && <p><span className="text-gray-500">{(t.layersToRemove || 'Layers to Remove')}:</span> <span className="font-semibold">{roofing.tearOffRequired ? 'Yes' : 'No'}</span></p>}
                {roofing.underlaymentType && <p><span className="text-gray-500">{(t.underlayment || 'Underlayment')}:</span> <span className="font-semibold">{roofing.underlaymentType}</span></p>}
                {roofing.dumpsterFee && <p><span className="text-gray-500">{(t.disposalFee || 'Disposal Fee')}:</span> <span className="font-semibold">${roofing.dumpsterFee.toFixed(2)}</span></p>}
            </div>
        </section>
    );
};
