
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

export const HvacDetails: React.FC<{ invoice: Invoice, t: any }> = ({ invoice, t }) => {
    if (!invoice.hvac) return null;
    const { hvac } = invoice;
    return (
        <section className="my-4 text-xs">
            <p className="font-bold text-gray-500 mb-2 border-b">{t.hvacSpecifications || 'HVAC Specifications'}</p>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-x-4 gap-y-1">
                <p><span className="font-semibold text-gray-600">{t.unitType || 'Unit Type'}:</span> {hvac.unitType}</p>
                <p><span className="font-semibold text-gray-600">{t.modelNo || 'Model #'}:</span> {hvac.modelNumber}</p>
                <p><span className="font-semibold text-gray-600">{t.refrigerant || 'Refrigerant'}:</span> {hvac.refrigerantType}</p>
                {hvac.maintenanceFee && <p><span className="font-semibold text-gray-600">{t.maintenanceFee || 'Maintenance Fee'}:</span> ${hvac.maintenanceFee.toFixed(2)}</p>}
            </div>
        </section>
    );
};
