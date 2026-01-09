'use client';

import React from 'react';
import type { Invoice, LineItem } from '@/lib/types';
import { format, isValid } from 'date-fns';
import Image from 'next/image';
import { CategorySpecificDetails } from './category-specific-details';

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

export const ConstructionDetails: React.FC<{ invoice: Invoice, t: any }> = ({ invoice, t }) => {
    if (!invoice.construction) return null;
    const { construction } = invoice;
    return (
        <section className="my-4 text-xs">
            <p className="font-bold text-gray-500 mb-2 border-b">{t.constructionDetails || 'Construction Details'}</p>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-x-4 gap-y-1">
                <p><span className="font-semibold text-gray-600">{t.jobSite || 'Job Site'}:</span> {construction.jobSiteAddress}</p>
                <p><span className="font-semibold text-gray-600">{t.permitNumber || 'Permit #'}:</span> {construction.permitNumber}</p>
                {construction.laborRate && <p><span className="font-semibold text-gray-600">{t.laborRate || 'Labor Rate'}:</span> ${construction.laborRate}/hr</p>}
                {construction.equipmentRentalFees && <p><span className="font-semibold text-gray-600">{t.equipmentFees || 'Equipment Fees'}:</span> ${construction.equipmentRentalFees}</p>}
                {construction.wasteDisposalFee && <p><span className="font-semibold text-gray-600">{t.disposalFee || 'Disposal Fee'}:</span> ${construction.wasteDisposalFee}</p>}
                {construction.projectStartDate && <p><span className="font-semibold text-gray-600">{t.startDate || 'Start Date'}:</span> {safeFormat(construction.projectStartDate, 'MM/dd/yyyy')}</p>}
                {construction.projectEndDate && <p><span className="font-semibold text-gray-600">{t.endDate || 'End Date'}:</span> {safeFormat(construction.projectEndDate, 'MM/dd/yyyy')}</p>}
            </div>
        </section>
    );
};
