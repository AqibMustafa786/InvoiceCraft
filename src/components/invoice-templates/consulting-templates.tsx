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

export const ConsultingDetails: React.FC<{ invoice: Invoice, t: any }> = ({ invoice, t }) => {
    if (!invoice.consulting) return null;
    const { consulting } = invoice;
    const hasDetails = Object.values(consulting).some(val => val !== null && val !== '');
    if (!hasDetails) return null;

    return (
        <section className="my-4 text-xs">
            <p className="font-bold text-gray-500 mb-2 border-b">{t.consultingDetails || 'Consulting Details'}</p>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-x-4 gap-y-1">
                {consulting.consultationType && <p><span className="font-semibold text-gray-600">{t.consultationType || 'Type'}:</span> {consulting.consultationType}</p>}
                {consulting.sessionHours && <p><span className="font-semibold text-gray-600">{t.sessionHours || 'Hours'}:</span> {consulting.sessionHours}</p>}
                {consulting.retainerFee && <p><span className="font-semibold text-gray-600">{t.retainerFee || 'Retainer'}:</span> ${consulting.retainerFee.toFixed(2)}</p>}
            </div>
        </section>
    );
};
