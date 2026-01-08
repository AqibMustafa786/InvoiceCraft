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
        <div className="mt-4">
            <p className="text-xs text-gray-500 mb-1">{label}</p>
            <Image src={signature.image} alt={label} width={150} height={75} className="border-b border-gray-400" />
            <p className="text-xs text-gray-600 mt-1">({signature.signerName})</p>
        </div>
    )
}

export const CleaningDetails: React.FC<{ invoice: Invoice, t: any }> = ({ invoice, t }) => {
    if (!invoice.cleaning) return null;
    const { cleaning } = invoice;
    return (
        <section className="my-4 text-xs">
            <p className="font-bold border-b" >{(t.cleaningSpecifics || 'Cleaning Specifics')}</p>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-x-4 gap-y-1 mt-2">
                <p><span className="font-semibold">{t.type || 'Type'}:</span> {cleaning.cleaningType}</p>
                <p><span className="font-semibold">{t.schedule || 'Schedule'}:</span> {cleaning.recurringSchedule}</p>
                {cleaning.squareFootage && <p><span className="font-semibold">{t.homeSize || 'Home Size'}:</span> {cleaning.squareFootage} sq ft</p>}
                {cleaning.numberOfRooms && <p><span className="font-semibold">{t.rooms || 'Rooms'}:</span> {cleaning.numberOfRooms}</p>}
                {cleaning.suppliesFee && <p><span className="font-semibold">{t.suppliesFee || 'Supplies Fee'}:</span> ${cleaning.suppliesFee.toFixed(2)}</p>}
            </div>
        </section>
    );
};
