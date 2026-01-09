
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

export const MedicalDetails: React.FC<{ invoice: Invoice, t: any }> = ({ invoice, t }) => {
    if (!invoice.medical) return null;
    const { medical } = invoice;
    return (
        <section className="my-4 text-xs">
            <p className="font-bold text-gray-500 mb-2 border-b">{t.patientInformation || 'Patient Information'}</p>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-x-4 gap-y-1">
                <p><span className="font-semibold text-gray-600">{t.patientName || 'Patient'}:</span> {medical.patientName}</p>
                <p><span className="font-semibold text-gray-600">{t.patientId || 'Patient ID'}:</span> {medical.patientId}</p>
                <p><span className="font-semibold text-gray-600">{t.visitDate || 'Visit Date'}:</span> {safeFormat(medical.visitDate, 'MM/dd/yyyy')}</p>
                <p><span className="font-semibold text-gray-600">{t.physician || 'Physician'}:</span> {medical.physicianName}</p>
                <p><span className="font-semibold text-gray-600">{t.serviceType || 'Service Type'}:</span> {medical.serviceType}</p>
                <p><span className="font-semibold text-gray-600">{t.cptCode || 'CPT'}:</span> {medical.cptCode}</p>
                <p><span className="font-semibold text-gray-600">{t.icdCode || 'ICD-10'}:</span> {medical.icdCode}</p>
                {medical.copayAmount && <p><span className="font-semibold text-gray-600">{t.copay || 'Copay'}:</span> ${medical.copayAmount.toFixed(2)}</p>}
                {medical.labFee && <p><span className="font-semibold text-gray-600">{t.labFee || 'Lab Fee'}:</span> ${medical.labFee.toFixed(2)}</p>}
                {medical.medicationCharges && <p><span className="font-semibold text-gray-600">{t.medication || 'Medication'}:</span> ${medical.medicationCharges.toFixed(2)}</p>}
            </div>
        </section>
    );
};
