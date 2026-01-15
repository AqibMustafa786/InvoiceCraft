
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

export const MedicalDetails: React.FC<{ invoice: Invoice, t: any }> = ({ invoice, t }) => {
    if (!invoice.medical) return null;
    const { medical } = invoice;
    const hasDetails = Object.values(medical).some(val => val !== null && val !== '');
    if (!hasDetails) {
        return (
            <section className="my-4 text-xs">
                <p className="font-bold text-gray-500 mb-2 border-b">{t.patientInformation || 'Patient Information'}</p>
            </section>
        );
    }

    return (
        <section className="my-4 text-xs">
            <p className="font-bold text-gray-500 mb-2 border-b">{t.patientInformation || 'Patient Information'}</p>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-x-4 gap-y-1">
                {medical.patientName && <p><span className="font-semibold text-gray-600">{t.patientName || 'Patient'}:</span> {medical.patientName}</p>}
                {medical.patientId && <p><span className="font-semibold text-gray-600">{t.patientId || 'Patient ID'}:</span> {medical.patientId}</p>}
                {medical.visitDate && <p><span className="font-semibold text-gray-600">{t.visitDate || 'Visit Date'}:</span> {safeFormat(medical.visitDate, 'MM/dd/yyyy')}</p>}
                {medical.physicianName && <p><span className="font-semibold text-gray-600">{t.physician || 'Physician'}:</span> {medical.physicianName}</p>}
                {medical.serviceType && <p><span className="font-semibold text-gray-600">{t.serviceType || 'Service Type'}:</span> {medical.serviceType}</p>}
                {medical.cptCode && <p><span className="font-semibold text-gray-600">{t.cptCode || 'CPT'}:</span> {medical.cptCode}</p>}
                {medical.icdCode && <p><span className="font-semibold text-gray-600">{t.icdCode || 'ICD-10'}:</span> {medical.icdCode}</p>}
                {medical.copayAmount && <p><span className="font-semibold text-gray-600">{t.copay || 'Copay'}:</span> ${medical.copayAmount.toFixed(2)}</p>}
                {medical.labFee && <p><span className="font-semibold text-gray-600">{t.labFee || 'Lab Fee'}:</span> ${medical.labFee.toFixed(2)}</p>}
                {medical.medicationCharges && <p><span className="font-semibold text-gray-600">{t.medication || 'Medication'}:</span> ${medical.medicationCharges.toFixed(2)}</p>}
            </div>
        </section>
    );
};

// Template 1: Caduceus (Based on user-provided image)
export const MedicalTemplate1: React.FC<PageProps> = (props) => {
    const { invoice, pageItems, pageIndex, totalPages, subtotal, taxAmount, discountAmount, total, balanceDue, currencySymbol, t, accentColor, textColor } = props;
    const { business, client } = invoice;
    const docTitle = (t.invoice || 'INVOICE').toUpperCase();

    return (
        <div className={`p-10 font-sans relative ${pageIndex < totalPages - 1 ? 'page-break-after' : ''}`} style={{ minHeight: '1056px', backgroundColor: props.backgroundColor, color: textColor }}>
            <div className="absolute inset-0 bg-no-repeat bg-center bg-contain opacity-5" style={{backgroundImage: `url("https://storage.googleapis.com/studio-hosting-assets/invoice-template-previews/medical-watermark.svg")`}}></div>

            <div className="relative z-10">
                <header className="mb-8">
                    <div className="w-full h-2 mb-8" style={{backgroundColor: accentColor}}></div>
                    <div className="flex justify-between items-start">
                        <div>
                            {business.logoUrl ? (
                                <Image src={business.logoUrl} alt="Company Logo" width={100} height={40} className="object-contain mb-4" />
                            ) : (
                                <h1 className="text-3xl font-bold">{business.name}</h1>
                            )}
                        </div>
                        <div className="text-right">
                           <p className="font-bold text-gray-500">{t.prescribingPhysician || "Prescribing Physician's Information"}</p>
                           <p className="font-bold">{business.name}</p>
                           <p className="text-xs whitespace-pre-line">{business.address}</p>
                           <p className="text-xs">{business.phone} | {business.email}</p>
                           {business.website && <p className="text-xs">{business.website}</p>}
                           {business.licenseNumber && <p className="text-xs">Lic #: {business.licenseNumber}</p>}
                           {business.taxId && <p className="text-xs">Tax ID: {business.taxId}</p>}
                        </div>
                    </div>
                </header>

                <section className="grid grid-cols-2 gap-8 text-xs mb-8">
                    <div>
                        <p className="font-bold mb-2 border-b pb-1" style={{borderColor: accentColor}}>{t.patientInformation || 'Patient Information'}</p>
                        <p className="font-bold">{client.name}</p>
                        {client.companyName && <p>{client.companyName}</p>}
                        <p className="whitespace-pre-line">{client.address}</p>
                        <p>{client.phone}</p>
                        <p>{client.email}</p>
                        {client.shippingAddress && <p className="mt-2"><span className="font-bold">Ship To:</span><br/>{client.shippingAddress}</p>}
                    </div>
                </section>

                <section className="grid grid-cols-4 gap-4 text-xs text-center mb-8 p-3 bg-gray-100 rounded-md">
                    <div><p className="font-bold text-gray-500">{(t.invoiceNo || 'INVOICE NUMBER').toUpperCase()}</p><p className="mt-1">{invoice.invoiceNumber}</p></div>
                    <div><p className="font-bold text-gray-500">{(t.date || 'DATE').toUpperCase()}</p><p className="mt-1">{safeFormat(invoice.invoiceDate, 'dd/MM/yy')}</p></div>
                    <div><p className="font-bold text-gray-500">{(t.dueDate || 'INVOICE DUE DATE').toUpperCase()}</p><p className="mt-1">{safeFormat(invoice.dueDate, 'dd/MM/yy')}</p></div>
                    <div><p className="font-bold text-gray-500">{(t.price || 'PRICE').toUpperCase()}</p><p className="mt-1 font-bold">{currencySymbol}{total.toFixed(2)}</p></div>
                    {invoice.poNumber && <div className="col-span-full mt-2 text-left"><p><span className="font-bold">PO Number: </span>{invoice.poNumber}</p></div>}
                </section>
                
                <CategorySpecificDetails invoice={invoice} t={t} />

                <main className="flex-grow">
                    <table className="w-full text-left text-sm">
                        <thead style={{backgroundColor: accentColor}} className="text-white">
                            <tr>
                                <th className="p-2 font-bold w-1/2">{(t.item || 'ITEM').toUpperCase()}</th>
                                <th className="p-2 font-bold w-1/2">{(t.description || 'DESCRIPTION').toUpperCase()}</th>
                                <th className="p-2 font-bold text-center">{(t.quantity || 'QTY').toUpperCase()}</th>
                                <th className="p-2 font-bold text-right">{(t.unitPrice || 'PRICE').toUpperCase()}</th>
                                <th className="p-2 font-bold text-right">{(t.amount || 'AMOUNT').toUpperCase()}</th>
                            </tr>
                        </thead>
                        <tbody>
                            {pageItems.map(item => (
                                <tr key={item.id} className="border-b">
                                    <td className="p-2 text-xs font-semibold whitespace-pre-line">{item.name}</td>
                                    <td className="p-2 text-xs text-gray-600 whitespace-pre-line">{item.description}</td>
                                    <td className="p-2 text-center text-xs">{item.quantity}</td>
                                    <td className="p-2 text-right text-xs">{currencySymbol}{item.unitPrice.toFixed(2)}</td>
                                    <td className="p-2 text-right text-xs">{currencySymbol}{(item.quantity * item.unitPrice).toFixed(2)}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </main>

                {pageIndex === totalPages - 1 && (
                <footer className="mt-auto pt-8">
                    <div className="flex justify-between items-start">
                        <div className="w-1/3 text-xs p-4 bg-gray-50 rounded-md">
                            <p className="font-bold" style={{color: accentColor}}>{t.notes || 'Notes'}</p>
                            <p className="mt-1 whitespace-pre-line">{invoice.paymentInstructions}</p>
                        </div>
                        <div className="w-1/3 text-right text-xs space-y-2">
                             <p className="grid grid-cols-2"><span className="font-bold">{(t.subtotal || 'SUBTOTAL').toUpperCase()}</span> <span>{currencySymbol}{subtotal.toFixed(2)}</span></p>
                             {discountAmount > 0 && <p className="grid grid-cols-2"><span className="font-bold text-red-600">{(t.discount || 'DISCOUNT').toUpperCase()}</span> <span className="text-red-600">-{currencySymbol}{discountAmount.toFixed(2)}</span></p>}
                             {invoice.summary.shippingCost > 0 && <p className="grid grid-cols-2"><span className="font-bold">{(t.shipping || 'SHIPPING').toUpperCase()}</span> <span>{currencySymbol}{invoice.summary.shippingCost.toFixed(2)}</span></p>}
                             <p className="grid grid-cols-2"><span className="font-bold">{(t.taxRate || 'TAX RATE').toUpperCase()}</span> <span>{currencySymbol}{taxAmount.toFixed(2)}</span></p>
                             <p className="grid grid-cols-2 mt-2 pt-2 border-t-2 font-bold text-lg" style={{borderColor: accentColor}}><span style={{color: accentColor}}>{(t.total || 'TOTAL').toUpperCase()}</span> <span>{currencySymbol}{total.toFixed(2)}</span></p>
                             {(invoice.amountPaid || 0) > 0 && <p className="grid grid-cols-2 text-green-600 font-bold"><span>Amount Paid:</span> <span>-{currencySymbol}{(invoice.amountPaid || 0).toFixed(2)}</span></p>}
                            <p className="grid grid-cols-2 font-bold"><span>Balance Due:</span> <span>{currencySymbol}{balanceDue.toFixed(2)}</span></p>
                        </div>
                    </div>
                     <div className="flex justify-end mt-4">
                       {business.ownerSignature && <SignatureDisplay signature={business.ownerSignature} label="Authorized Signature" />}
                    </div>
                </footer>
                )}
            </div>
        </div>
    );
}

// Other templates...
export const MedicalTemplate2: React.FC<PageProps> = (props) => <div>Template 2 not implemented</div>;
export const MedicalTemplate3: React.FC<PageProps> = (props) => <div>Template 3 not implemented</div>;
export const MedicalTemplate4: React.FC<PageProps> = (props) => <div>Template 4 not implemented</div>;
export const MedicalTemplate5: React.FC<PageProps> = (props) => <div>Template 5 not implemented</div>;

