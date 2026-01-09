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

export const ITServiceDetails: React.FC<{ invoice: Invoice, t: any }> = ({ invoice, t }) => {
    if (!invoice.itServices) return null;
    const { itServices } = invoice;
    return (
        <section className="my-4 text-xs">
            <p className="font-bold text-gray-500 mb-2 border-b">{t.itServiceDetails || 'IT Service Details'}</p>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-x-4 gap-y-1">
                <p><span className="font-semibold text-gray-600">{t.serviceType || 'Service Type'}:</span> {itServices.serviceType}</p>
                {itServices.hourlyRate && <p><span className="font-semibold text-gray-600">{t.hourlyRate || 'Hourly Rate'}:</span> ${itServices.hourlyRate.toFixed(2)}</p>}
                {itServices.hoursWorked && <p><span className="font-semibold text-gray-600">{t.hoursWorked || 'Hours Worked'}:</span> {itServices.hoursWorked}</p>}
                <p><span className="font-semibold text-gray-600">{t.deviceType || 'Device Type'}:</span> {itServices.deviceType}</p>
                <p><span className="font-semibold text-gray-600">{t.serialNumber || 'Serial #'}:</span> {itServices.serialNumber}</p>
                {itServices.hardwareReplacementCost && <p><span className="font-semibold text-gray-600">{t.hardwareCost || 'Hardware Cost'}:</span> ${itServices.hardwareReplacementCost.toFixed(2)}</p>}
                {itServices.monthlyMaintenanceFee && <p><span className="font-semibold text-gray-600">{t.maintenanceFee || 'Maintenance Fee'}:</span> ${itServices.monthlyMaintenanceFee.toFixed(2)}</p>}
            </div>
        </section>
    );
};
