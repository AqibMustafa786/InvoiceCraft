
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

const RoofingDetails: React.FC<{ invoice: Invoice, t: any }> = ({ invoice, t }) => {
    if (!invoice.roofing) return null;
    const { roofing } = invoice;
    return (
        <section className="my-4 text-xs">
            <p className="font-bold text-gray-500 mb-2 border-b">{(t.roofingDetails || 'Roofing Details')}</p>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-x-4 gap-y-1">
                <p><span className="font-semibold text-gray-600">{(t.roofType || 'Roof Type')}:</span> {roofing.roofType}</p>
                {roofing.squareFootage && <p><span className="font-semibold text-gray-600">{(t.sqFt || 'Sq Ft')}:</span> {roofing.squareFootage}</p>}
                <p><span className="font-semibold text-gray-600">{(t.pitch || 'Pitch')}:</span> {roofing.pitch}</p>
                <p><span className="font-semibold text-gray-600">{(t.tearOff || 'Tear-off')}:</span> {roofing.tearOffRequired ? 'Yes' : 'No'}</p>
                <p><span className="font-semibold text-gray-600">{(t.underlayment || 'Underlayment')}:</span> {roofing.underlaymentType}</p>
                {roofing.dumpsterFee && <p><span className="font-semibold text-gray-600">{(t.disposalFee || 'Disposal Fee')}:</span> ${roofing.dumpsterFee.toFixed(2)}</p>}
            </div>
        </section>
    );
};

// Template 1: Direct Interpretation from Image
export const RoofingTemplate1: React.FC<PageProps> = (props) => {
    const { invoice, pageItems, pageIndex, totalPages, subtotal, taxAmount, balanceDue, currencySymbol, t } = props;
    const { business, client } = invoice;

    return (
        <div className={`p-8 font-sans ${pageIndex < totalPages - 1 ? 'page-break-after' : ''}`} style={{ minHeight: '1056px', backgroundColor: props.backgroundColor, color: props.textColor }}>
            <header className="mb-4 text-center relative p-4 bg-gray-800 text-white">
                 <div style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    backgroundImage: `url("data:image/svg+xml,%3Csvg width='80' height='80' viewBox='0 0 80 80' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Cpath d='M50 50c0-5.523 4.477-10 10-10s10 4.477 10 10-4.477 10-10 10c0 5.523-4.477 10-10 10s-10-4.477-10-10 4.477-10 10-10zM10 10c0-5.523 4.477-10 10-10s10 4.477 10 10-4.477 10-10 10c0 5.523-4.477 10-10 10S0 25.523 0 20s4.477-10 10-10z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
                    opacity: 0.2
                 }}></div>
                <div className="relative">
                    <h1 className="text-4xl font-extrabold">{business.name}</h1>
                    <p className="text-sm">{(t.roofingServices || 'Residential & Commercial Roofing')}</p>
                </div>
            </header>

            <section className="grid grid-cols-2 gap-4 text-xs mb-4">
                <div className="p-2 border">
                    <p className="font-bold">{(t.customer || 'CUSTOMER')}</p>
                    <p>{client.name}</p>
                    <p>{client.address}</p>
                </div>
                 <div className="p-2 border text-right">
                    <p className="font-bold">{(t.invoice || 'INVOICE').toUpperCase()}</p>
                    <p>#{invoice.invoiceNumber}</p>
                    <p>{(t.date || 'Date')}: {safeFormat(invoice.invoiceDate, 'MM/dd/yyyy')}</p>
                </div>
            </section>
            
            <RoofingDetails invoice={invoice} t={t} />
            
            <main className="flex-grow mt-4">
                 <table className="w-full text-left text-xs border">
                    <thead>
                        <tr className="bg-gray-800 text-white">
                            <th className="p-1 font-bold w-1/2 border-r">{(t.materialJobDescription || 'MATERIAL & JOB DESCRIPTION')}</th>
                            <th className="p-1 font-bold text-center border-r">{(t.quantity || 'QTY').toUpperCase()}</th>
                            <th className="p-1 font-bold text-right border-r">{(t.cost || 'COST').toUpperCase()}</th>
                            <th className="p-1 font-bold text-right">{(t.total || 'TOTAL').toUpperCase()}</th>
                        </tr>
                    </thead>
                    <tbody>
                        {pageItems.map(item => (
                            <tr key={item.id} className="border-b">
                                <td className="p-1 border-r">{item.name}</td>
                                <td className="p-1 text-center border-r">{item.quantity}</td>
                                <td className="p-1 text-right border-r">{currencySymbol}{item.unitPrice.toFixed(2)}</td>
                                <td className="p-1 text-right">{currencySymbol}{(item.quantity * item.unitPrice).toFixed(2)}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </main>
            
            {pageIndex === totalPages - 1 && (
                <footer className="mt-auto pt-4 text-xs">
                    <div className="flex justify-end">
                        <div className="w-1/3">
                            <p className="flex justify-between p-1 border-b"><span>{(t.subtotal || 'SUBTOTAL').toUpperCase()}</span> <span>{currencySymbol}{subtotal.toFixed(2)}</span></p>
                            <p className="flex justify-between p-1 border-b"><span>{(t.tax || 'TAX').toUpperCase()}</span> <span>{currencySymbol}{taxAmount.toFixed(2)}</span></p>
                            <p className="flex justify-between p-1 font-bold text-sm"><span>{(t.totalDue || 'TOTAL DUE').toUpperCase()}</span> <span>{currencySymbol}{balanceDue.toFixed(2)}</span></p>
                        </div>
                    </div>
                    <div className="mt-4 border-t pt-2">
                        <p className="italic text-gray-600">{invoice.termsAndConditions}</p>
                        <div className="flex justify-between mt-8">
                            <div><p className="border-t pt-1">{(t.customerSignature || 'Customer Signature')}</p></div>
                            <div><p className="border-t pt-1">{(t.date || 'Date')}</p></div>
                        </div>
                    </div>
                </footer>
            )}
        </div>
    );
}

// All other templates will just be stubs for now, pointing to the first one.
export const RoofingTemplate2: React.FC<PageProps> = (props) => <RoofingTemplate1 {...props} />;
export const RoofingTemplate3: React.FC<PageProps> = (props) => <RoofingTemplate1 {...props} />;
export const RoofingTemplate4: React.FC<PageProps> = (props) => <RoofingTemplate1 {...props} />;
export const RoofingTemplate5: React.FC<PageProps> = (props) => <RoofingTemplate1 {...props} />;
export const RoofingTemplate6: React.FC<PageProps> = (props) => <RoofingTemplate1 {...props} />;
export const RoofingTemplate7: React.FC<PageProps> = (props) => <RoofingTemplate1 {...props} />;
export const RoofingTemplate8: React.FC<PageProps> = (props) => <RoofingTemplate1 {...props} />;
export const RoofingTemplate9: React.FC<PageProps> = (props) => <RoofingTemplate1 {...props} />;
export const RoofingTemplate10: React.FC<PageProps> = (props) => <RoofingTemplate1 {...props} />;
