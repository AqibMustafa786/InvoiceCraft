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

export const PlumbingDetails: React.FC<{ invoice: Invoice, t: any }> = ({ invoice, t }) => {
    if (!invoice.plumbing) return null;
    const { plumbing } = invoice;
    const hasDetails = Object.values(plumbing).some(val => val !== null && val !== '');
    if (!hasDetails) return null;
    
    return (
        <section className="my-4 text-xs">
            <p className="font-bold text-gray-500 mb-2 border-b">{t.plumbingDetails || 'Plumbing Details'}</p>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-x-4 gap-y-1">
                {plumbing.serviceType && <p><span className="font-semibold text-gray-600">{t.serviceType || 'Service Type'}:</span> {plumbing.serviceType}</p>}
                {plumbing.pipeMaterial && <p><span className="font-semibold text-gray-600">{t.pipeMaterial || 'Pipe Material'}:</span> {plumbing.pipeMaterial}</p>}
                {plumbing.fixtureName && <p><span className="font-semibold text-gray-600">{t.fixture || 'Fixture'}:</span> {plumbing.fixtureName}</p>}
                {plumbing.emergencyFee && <p><span className="font-semibold text-gray-600">{t.emergencyFee || 'Emergency Fee'}:</span> ${plumbing.emergencyFee.toFixed(2)}</p>}
            </div>
        </section>
    );
};
