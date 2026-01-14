
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

export const ITServiceDetails: React.FC<{ invoice: Invoice, t: any }> = ({ invoice, t }) => {
    if (!invoice.itServices && !invoice.freelance) return null;
    
    if (invoice.category === 'IT Services / Tech Support' && invoice.itServices) {
        const hasDetails = Object.values(invoice.itServices).some(val => val !== null && val !== '');
        if (!hasDetails) {
            return (
                <section className="my-4 text-xs">
                    <p className="font-bold text-gray-500 mb-2 border-b">{t.itServiceDetails || 'IT Service Details'}</p>
                </section>
            );
        }

        return (
            <section className="my-4 text-xs">
                <p className="font-bold text-gray-500 mb-2 border-b">{t.itServiceDetails || 'IT Service Details'}</p>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-x-4 gap-y-1">
                    {invoice.itServices.serviceType && <p><span className="font-semibold text-gray-600">{t.serviceType || 'Service Type'}:</span> {invoice.itServices.serviceType}</p>}
                    {invoice.itServices.hourlyRate && <p><span className="font-semibold text-gray-600">{t.hourlyRate || 'Hourly Rate'}:</span> ${invoice.itServices.hourlyRate.toFixed(2)}</p>}
                    {invoice.itServices.hoursWorked && <p><span className="font-semibold text-gray-600">{t.hoursWorked || 'Hours Worked'}:</span> {invoice.itServices.hoursWorked}</p>}
                    {invoice.itServices.deviceType && <p><span className="font-semibold text-gray-600">{t.deviceType || 'Device Type'}:</span> {invoice.itServices.deviceType}</p>}
                    {invoice.itServices.serialNumber && <p><span className="font-semibold text-gray-600">{t.serialNumber || 'Serial #'}:</span> {invoice.itServices.serialNumber}</p>}
                    {invoice.itServices.hardwareReplacementCost && <p><span className="font-semibold text-gray-600">{t.hardwareCost || 'Hardware Cost'}:</span> ${invoice.itServices.hardwareReplacementCost.toFixed(2)}</p>}
                    {invoice.itServices.monthlyMaintenanceFee && <p><span className="font-semibold text-gray-600">{t.maintenanceFee || 'Maintenance Fee'}:</span> ${invoice.itServices.monthlyMaintenanceFee.toFixed(2)}</p>}
                </div>
            </section>
        );
    }

    if (invoice.category === 'Freelance / Agency' && invoice.freelance) {
         const hasDetails = Object.values(invoice.freelance).some(val => val !== null && val !== '');
         if (!hasDetails) {
            return (
                <section className="my-4 text-xs">
                    <p className="font-bold text-gray-500 mb-2 border-b">{t.projectSpecifications || 'Project Specifications'}</p>
                </section>
            );
         }

         return (
            <section className="my-4 text-xs">
                <p className="font-bold text-gray-500 mb-2 border-b">{t.projectSpecifications || 'Project Specifications'}</p>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-x-4 gap-y-1">
                    {invoice.freelance.projectName && <p className="col-span-full"><span className="font-semibold text-gray-600">{t.projectName || 'Project'}:</span> {invoice.freelance.projectName}</p>}
                    {invoice.freelance.hourlyRate && <p><span className="font-semibold text-gray-600">{t.hourlyRate || 'Hourly Rate'}:</span> ${invoice.freelance.hourlyRate.toFixed(2)}</p>}
                    {invoice.freelance.fixedRate && <p><span className="font-semibold text-gray-600">{t.fixedRate || 'Fixed Rate'}:</span> ${invoice.freelance.fixedRate.toFixed(2)}</p>}
                    {invoice.freelance.hoursLogged && <p><span className="font-semibold text-gray-600">{t.hoursLogged || 'Hours Logged'}:</span> {invoice.freelance.hoursLogged}</p>}
                    {invoice.freelance.milestoneDescription && <p className="col-span-full"><span className="font-semibold text-gray-600">{t.milestone || 'Milestone'}:</span> {invoice.freelance.milestoneDescription}</p>}
                </div>
            </section>
        );
    }
    
    return null;
};
