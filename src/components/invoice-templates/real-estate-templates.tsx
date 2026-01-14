
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

export const RealEstateDetails: React.FC<{ invoice: Invoice, t: any }> = ({ invoice, t }) => {
    if (!invoice.realEstate) return null;
    const { realEstate } = invoice;
    const hasDetails = Object.values(realEstate).some(val => val !== null && val !== '');
    if (!hasDetails) {
        return (
            <section className="my-4 text-xs">
                <p className="font-bold text-gray-500 mb-2 border-b">{t.propertyDetails || 'Property Details'}</p>
            </section>
        );
    }
    
    return (
        <section className="my-4 text-xs">
            <p className="font-bold text-gray-500 mb-2 border-b">{t.propertyDetails || 'Property Details'}</p>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-x-4 gap-y-1">
                {realEstate.propertyAddress && <p><span className="font-semibold text-gray-600">{t.property || 'Property'}:</span> {realEstate.propertyAddress}</p>}
                {realEstate.unitNumber && <p><span className="font-semibold text-gray-600">{t.unit || 'Unit'}:</span> {realEstate.unitNumber}</p>}
                {realEstate.leaseTerm && <p><span className="font-semibold text-gray-600">{t.leaseTerm || 'Lease Term'}:</span> {realEstate.leaseTerm}</p>}
                {realEstate.tenantName && <p><span className="font-semibold text-gray-600">{t.tenant || 'Tenant'}:</span> {realEstate.tenantName}</p>}
                {realEstate.monthlyRent && <p><span className="font-semibold text-gray-600">{t.rent || 'Rent'}:</span> ${realEstate.monthlyRent.toFixed(2)}</p>}
                {realEstate.cleaningFee && <p><span className="font-semibold text-gray-600">{t.cleaningFee || 'Cleaning'}:</span> ${realEstate.cleaningFee.toFixed(2)}</p>}
                {realEstate.maintenanceFee && <p><span className="font-semibold text-gray-600">{t.maintenance || 'Maintenance'}:</span> ${realEstate.maintenanceFee.toFixed(2)}</p>}
                {realEstate.lateFee && <p><span className="font-semibold text-gray-600">{t.lateFee || 'Late Fee'}:</span> ${realEstate.lateFee.toFixed(2)}</p>}
                {realEstate.hoaCharges && <p><span className="font-semibold text-gray-600">{t.hoa || 'HOA'}:</span> ${realEstate.hoaCharges.toFixed(2)}</p>}
                {realEstate.utilityCharges && <p><span className="font-semibold text-gray-600">{t.utilities || 'Utilities'}:</span> ${realEstate.utilityCharges.toFixed(2)}</p>}
            </div>
        </section>
    );
};
