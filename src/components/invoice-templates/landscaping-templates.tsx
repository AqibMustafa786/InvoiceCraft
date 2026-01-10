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

export const LandscapingDetails: React.FC<{ invoice: Invoice, t: any }> = ({ invoice, t }) => {
    if (!invoice.landscaping) return null;
    const { landscaping } = invoice;
    const hasDetails = Object.values(landscaping).some(val => val !== null && val !== '');
    if (!hasDetails) return null;

    return (
        <section className="my-4 text-xs">
            <p className="font-bold text-gray-500 mb-2 border-b">{t.landscapingSpecifics || 'Landscaping Specifics'}</p>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-x-4 gap-y-1">
                <p className="col-span-full"><span className="font-semibold text-gray-600">{(t.service || 'Service')}:</span> {landscaping.serviceType}</p>
                {landscaping.lawnSquareFootage && <p><span className="font-semibold text-gray-600">{(t.lawnSqFt || 'Lawn Sq Ft')}:</span> {landscaping.lawnSquareFootage}</p>}
                {landscaping.equipmentFee && <p><span className="font-semibold text-gray-600">{(t.equipmentFee || 'Equipment Fee')}:</span> ${landscaping.equipmentFee.toFixed(2)}</p>}
                {landscaping.disposalFee && <p><span className="font-semibold text-gray-600">{(t.disposalFee || 'Disposal Fee')}:</span> ${landscaping.disposalFee.toFixed(2)}</p>}
            </div>
        </section>
    );
};
