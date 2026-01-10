
'use client';

import React from 'react';
import type { Invoice, LineItem } from '@/lib/types';
import { format, isValid } from 'date-fns';

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

export const PhotographyDetails: React.FC<{ invoice: Invoice, t: any }> = ({ invoice, t }) => {
    if (!invoice.photography) return null;
    const hasDetails = Object.values(invoice.photography).some(val => val !== null && val !== '');
    if (!hasDetails) {
        return (
            <section className="my-4 text-xs">
                <p className="font-bold text-gray-400 mb-2 border-b border-gray-600">{(t.sessionDetails || 'SESSION DETAILS').toUpperCase()}</p>
            </section>
        );
    }
    
    return (
        <section className="my-4 text-xs">
            <p className="font-bold text-gray-400 mb-2 border-b border-gray-600">{(t.sessionDetails || 'SESSION DETAILS').toUpperCase()}</p>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-x-4 gap-y-1">
                {invoice.photography.eventType && <p><span className="font-semibold text-gray-300">{(t.eventType || 'Event')}:</span> {invoice.photography.eventType}</p>}
                {invoice.photography.shootDate && <p><span className="font-semibold text-gray-300">{(t.shootDate || 'Date')}:</span> {safeFormat(invoice.photography.shootDate, 'MM/dd/yyyy')}</p>}
                {invoice.photography.hoursOfCoverage && <p><span className="font-semibold text-gray-300">{(t.coverage || 'Coverage')}:</span> {invoice.photography.hoursOfCoverage} hrs</p>}
                {invoice.photography.packageSelected && <p><span className="font-semibold text-gray-300">{(t.package || 'Package')}:</span> {invoice.photography.packageSelected}</p>}
                {invoice.photography.editedPhotosCount && <p><span className="font-semibold text-gray-300">{(t.editedPhotos || 'Edits')}:</span> {invoice.photography.editedPhotosCount}</p>}
                {invoice.photography.rawFilesCost && <p><span className="font-semibold text-gray-300">{(t.rawFiles || 'RAWs')}:</span> ${invoice.photography.rawFilesCost.toFixed(2)}</p>}
            </div>
        </section>
    );
};
