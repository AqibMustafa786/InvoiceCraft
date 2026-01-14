
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

export const AutoRepairDetails: React.FC<{ invoice: Invoice, t: any }> = ({ invoice, t }) => {
    if (!invoice.autoRepair) return null;
    const { autoRepair } = invoice;
    
    const hasDetails = Object.values(autoRepair).some(val => val !== null && val !== '' && !(Array.isArray(val) && val.length === 0));
    
    return (
        <section className="my-4 text-xs">
            <p className="font-bold text-gray-500 mb-2 border-b">{t.vehicleInformation || 'Vehicle Information'}</p>
             {hasDetails && (
                <div className="grid grid-cols-2 md:grid-cols-3 gap-x-4 gap-y-1">
                    {autoRepair.vehicleMake && <p><span className="font-semibold text-gray-600">{(t.vehicle || 'Vehicle')}:</span> {autoRepair.vehicleMake} {autoRepair.vehicleModel} ({autoRepair.year})</p>}
                    {autoRepair.odometer && <p><span className="font-semibold text-gray-600">{(t.mileage || 'Mileage')}:</span> {autoRepair.odometer.toLocaleString()}</p>}
                    {autoRepair.vin && <p className="col-span-full"><span className="font-semibold text-gray-600">VIN:</span> {autoRepair.vin}</p>}
                    {autoRepair.licensePlate && <p><span className="font-semibold text-gray-600">{(t.licensePlate || 'Plate')}:</span> {autoRepair.licensePlate}</p>}
                    {autoRepair.laborHours && <p><span className="font-semibold text-gray-600">{(t.laborHours || 'Labor Hours')}:</span> {autoRepair.laborHours}</p>}
                    {autoRepair.laborRate && <p><span className="font-semibold text-gray-600">{(t.laborRate || 'Labor Rate')}:</span> ${autoRepair.laborRate.toFixed(2)}/hr</p>}
                    {autoRepair.diagnosticFee && <p><span className="font-semibold text-gray-600">{(t.diagnosticFee || 'Diagnostic Fee')}:</span> ${autoRepair.diagnosticFee.toFixed(2)}</p>}
                    {autoRepair.shopSupplyFee && <p><span className="font-semibold text-gray-600">{(t.shopSupplyFee || 'Shop Supply Fee')}:</span> ${autoRepair.shopSupplyFee.toFixed(2)}</p>}
                    {autoRepair.towingFee && <p><span className="font-semibold text-gray-600">{(t.towingFee || 'Towing Fee')}:</span> ${autoRepair.towingFee.toFixed(2)}</p>}
                </div>
             )}
        </section>
    );
};


export const AutoRepairTemplate1: React.FC<PageProps> = (props) => {
    const { invoice, pageItems, pageIndex, totalPages, subtotal, taxAmount, discountAmount, total, balanceDue, currencySymbol, t, accentColor, textColor } = props;
    const { business, client } = invoice;
    const docTitle = (t.invoice || 'INVOICE').toUpperCase();

    return (
        <div className={`p-10 font-sans text-gray-800 flex flex-col ${pageIndex < totalPages - 1 ? "page-break-after" : ""}`} style={{ fontFamily: invoice.fontFamily, fontSize: `${invoice.fontSize}pt`, minHeight: '1056px', backgroundColor: props.backgroundColor, color: textColor }}>
            <header className="flex justify-between items-start pb-4 border-b-2" style={{ borderColor: accentColor }}>
                <div>
                    {business.logoUrl ? <Image src={business.logoUrl} alt="Logo" width={120} height={50} className="object-contain mb-2"/> : <h1 className="text-4xl font-bold mb-2">{business.name}</h1>}
                    <div className="text-xs space-y-0.5" style={{ color: textColor || '#6B7280' }}>
                        <p className="whitespace-pre-line">{business.address}</p>
                        {business.phone && <p>{business.phone}</p>}
                        {business.email && <p>{business.email}</p>}
                        {business.website && <p>{business.website}</p>}
                        {business.licenseNumber && <p>Lic #: {business.licenseNumber}</p>}
                        {business.taxId && <p>Tax ID: {business.taxId}</p>}
                    </div>
                </div>
                <div className="text-right">
                    <h2 className="text-3xl font-bold">{docTitle}</h2>
                </div>
            </header>

            <section className="grid grid-cols-2 gap-8 my-8 text-sm">
                <div>
                    <p className="font-bold">{((t.billTo as string) || 'BILLED TO').toUpperCase()}</p>
                    <p className="font-bold mt-1" style={{color: accentColor}}>{client.name}</p>
                    {client.companyName && <p>{client.companyName}</p>}
                    <p className="whitespace-pre-line mt-1">{client.address}</p>
                    {client.shippingAddress && <p className="mt-2"><span className="font-bold">Ship To:</span><br/>{client.shippingAddress}</p>}
                    {client.phone && <p>{client.phone}</p>}
                    {client.email && <p>{client.email}</p>}
                </div>
                <div className="text-right">
                    <p><span className="font-bold">{t.invoiceNo || 'Invoice #'}:</span> {invoice.invoiceNumber}</p>
                    <p><span className="font-bold">{(t.date || 'Date')}:</span> {safeFormat(invoice.invoiceDate, 'MMM d, yyyy')}</p>
                    <p><span className="font-bold">{(t.dueDate || 'Due Date')}:</span> {safeFormat(invoice.dueDate, 'MMM d, yyyy')}</p>
                    {invoice.poNumber && <p><span className="font-bold">PO #:</span> {invoice.poNumber}</p>}
                </div>
            </section>
            
            <CategorySpecificDetails invoice={invoice} t={t} />
            
            <main className="flex-grow">
                 <table className="w-full text-left text-sm">
                    <thead className="border-b" style={{ borderColor: accentColor }}>
                        <tr>
                            <th className="p-2 pb-1 font-bold w-1/2">{(t.description || 'DESCRIPTION')}</th>
                            <th className="p-2 pb-1 font-bold text-right">{(t.quantity || 'QTY')}</th>
                            <th className="p-2 pb-1 font-bold text-right">{(t.price || 'PRICE')}</th>
                            <th className="p-2 pb-1 font-bold text-right">{(t.total || 'TOTAL')}</th>
                        </tr>
                    </thead>
                    <tbody>
                        {pageItems.map(item => (
                            <tr key={item.id} className="border-b border-gray-200">
                                <td className="p-2 align-top">
                                    <p className="font-medium whitespace-pre-line">{item.name}</p>
                                    {item.description && <p className="text-xs text-gray-500 whitespace-pre-line" style={{ wordBreak: 'break-all' }}>{item.description}</p>}
                                </td>
                                <td className="p-2 align-top text-right">{item.quantity}</td>
                                <td className="p-2 align-top text-right">{currencySymbol}{item.unitPrice.toFixed(2)}</td>
                                <td className="p-2 align-top text-right">{currencySymbol}{(item.quantity * item.unitPrice).toFixed(2)}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </main>
            
            {pageIndex === totalPages - 1 && (
                <footer className="mt-auto pt-8">
                     <div className="flex justify-end">
                        <div className="w-2/5 text-sm">
                            <div className="flex justify-between py-1"><span>{(t.subtotal || 'Subtotal')}:</span><span>{currencySymbol}{subtotal.toFixed(2)}</span></div>
                            {discountAmount > 0 && <div className="flex justify-between py-1 text-red-600"><span>{(t.discount || 'Discount')}:</span><span>-{currencySymbol}{discountAmount.toFixed(2)}</span></div>}
                            {invoice.summary.shippingCost > 0 && <div className="flex justify-between py-1"><span>{(t.shipping || 'Shipping/Extra')}:</span><span>{currencySymbol}{invoice.summary.shippingCost.toFixed(2)}</span></div>}
                            <div className="flex justify-between py-1"><span>{(t.tax || 'Tax')} ({invoice.summary.taxPercentage}%):</span><span>{currencySymbol}{taxAmount.toFixed(2)}</span></div>
                            <div className="flex justify-between font-bold py-2 mt-2 border-t-2 border-gray-800" style={{ color: accentColor }}><span className="text-lg">{(t.total || 'Total')}:</span><span className="text-lg">{currencySymbol}{total.toFixed(2)}</span></div>
                            {(invoice.amountPaid || 0) > 0 && <div className="flex justify-between py-1 text-green-600"><span>{(t.amountPaid || 'Amount Paid')}:</span><span>-{currencySymbol}{(invoice.amountPaid || 0).toFixed(2)}</span></div>}
                             <div className="flex justify-between font-bold text-lg mt-1 p-2 bg-gray-100"><span>{(t.balanceDue || 'Balance Due')}:</span><span>{currencySymbol}{balanceDue.toFixed(2)}</span></div>
                        </div>
                    </div>
                    <div className="mt-8 text-xs">
                        <p className="font-bold mb-1">{(t.termsAndConditions || 'Terms & Conditions')}</p>
                        <p className="whitespace-pre-line" style={{ color: textColor || '#6B7280' }}>{invoice.paymentInstructions}</p>
                    </div>
                    <div className="flex justify-between items-end mt-4">
                        <SignatureDisplay signature={business.ownerSignature} label={(t.authorizedSignature || 'Authorized Signature')} />
                    </div>
                </footer>
            )}
        </div>
    );
};
