
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

export const LegalDetails: React.FC<{ invoice: Invoice, t: any }> = ({ invoice, t }) => {
    if (!invoice.legal) return null;
    const { legal } = invoice;
    const hasDetails = Object.values(legal).some(val => val !== null && val !== '');
    if (!hasDetails) {
        return (
            <section className="my-4 text-xs">
                <p className="font-bold text-gray-500 mb-2 border-b">{t.caseDetails || 'Case Details'}</p>
            </section>
        );
    }

    return (
        <section className="my-4 text-xs">
            <p className="font-bold text-gray-500 mb-2 border-b">{t.caseDetails || 'Case Details'}</p>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-x-4 gap-y-1">
                {legal.caseName && <p><span className="font-semibold text-gray-600">{t.caseName || 'Case Name'}:</span> {legal.caseName}</p>}
                {legal.caseNumber && <p><span className="font-semibold text-gray-600">{t.caseNumber || 'Case #'}:</span> {legal.caseNumber}</p>}
                {legal.serviceType && <p><span className="font-semibold text-gray-600">{t.serviceType || 'Service Type'}:</span> {legal.serviceType}</p>}
                {legal.hourlyRate && <p><span className="font-semibold text-gray-600">{t.hourlyRate || 'Rate'}:</span> ${legal.hourlyRate.toFixed(2)}/hr</p>}
                {legal.hoursWorked && <p><span className="font-semibold text-gray-600">{t.hoursWorked || 'Hours'}:</span> {legal.hoursWorked}</p>}
                {legal.retainerAmount && <p><span className="font-semibold text-gray-600">{t.retainer || 'Retainer'}:</span> ${legal.retainerAmount.toFixed(2)}</p>}
                {legal.courtFilingFees && <p><span className="font-semibold text-gray-600">{t.filingFees || 'Filing Fees'}:</span> ${legal.courtFilingFees.toFixed(2)}</p>}
                {legal.travelTime && <p><span className="font-semibold text-gray-600">{t.travelTime || 'Travel (hrs)'}:</span> {legal.travelTime}</p>}
                {legal.additionalDisbursements && <p className="col-span-full"><span className="font-semibold text-gray-600">{t.disbursements || 'Disbursements'}:</span> {legal.additionalDisbursements}</p>}
            </div>
        </section>
    );
};
