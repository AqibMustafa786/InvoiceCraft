
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

export const CleaningDetails: React.FC<{ invoice: Invoice, t: any }> = ({ invoice, t }) => {
    if (!invoice.cleaning) return null;
    const { cleaning } = invoice;

    // This check is to see if there's anything to render inside the details section.
    const hasAnyDetail = Object.values(cleaning).some(val => val !== null && val !== '');
    if (!hasAnyDetail) {
         return (
            <section className="my-4 text-xs">
                <p className="font-bold border-b">{(t.cleaningSpecifics || 'Cleaning Specifics')}</p>
            </section>
        );
    }
    
    return (
        <section className="my-4 text-xs">
            <p className="font-bold border-b">{(t.cleaningSpecifics || 'Cleaning Specifics')}</p>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-x-4 gap-y-1 mt-2">
                {cleaning.cleaningType && <p><span className="font-semibold">{t.type || 'Type'}:</span> {cleaning.cleaningType}</p>}
                {cleaning.recurringSchedule && <p><span className="font-semibold">{t.schedule || 'Schedule'}:</span> {cleaning.recurringSchedule}</p>}
                {cleaning.squareFootage && <p><span className="font-semibold">{t.homeSize || 'Home Size'}:</span> {cleaning.squareFootage} sq ft</p>}
                {cleaning.numberOfRooms && <p><span className="font-semibold">{t.rooms || 'Rooms'}:</span> {cleaning.numberOfRooms}</p>}
                {cleaning.suppliesFee && <p><span className="font-semibold">{t.suppliesFee || 'Supplies Fee'}:</span> ${cleaning.suppliesFee.toFixed(2)}</p>}
            </div>
        </section>
    );
};
