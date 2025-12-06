
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

const HvacDetails: React.FC<{ invoice: Invoice }> = ({ invoice }) => {
    if (!invoice.hvac) return null;
    const { hvac } = invoice;
    return (
        <section className="my-4 text-xs">
            <p className="font-bold text-gray-500 mb-2 border-b">HVAC Service Details</p>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-x-4 gap-y-1">
                <p><span className="font-semibold text-gray-600">Unit Type:</span> {hvac.unitType}</p>
                <p><span className="font-semibold text-gray-600">Model #:</span> {hvac.modelNumber}</p>
                <p><span className="font-semibold text-gray-600">Refrigerant:</span> {hvac.refrigerantType}</p>
                {hvac.maintenanceFee && <p><span className="font-semibold text-gray-600">Maintenance Fee:</span> ${hvac.maintenanceFee.toFixed(2)}</p>}
            </div>
        </section>
    );
};

// Template 1: Direct Interpretation of user image
export const HVACTemplate1: React.FC<PageProps> = (props) => {
    const { invoice, pageItems, pageIndex, totalPages, subtotal, taxAmount, balanceDue, currencySymbol, accentColor } = props;
    const { business, client } = invoice;

    return (
        <div className={`p-8 font-sans ${pageIndex < totalPages - 1 ? 'page-break-after' : ''}`} style={{ minHeight: '1056px', backgroundColor: props.backgroundColor, color: props.textColor }}>
            <header className="flex justify-between items-start mb-8">
                <div className="flex items-center gap-4">
                    {business.logoUrl && <Image src={business.logoUrl} alt="Logo" width={60} height={60} className="object-contain" />}
                    <div>
                        <h1 className="text-2xl font-bold">{business.name}</h1>
                        <p className="text-xs whitespace-pre-line">{business.address}</p>
                        <p className="text-xs">{business.phone} | {business.email}</p>
                    </div>
                </div>
                <h2 className="text-3xl font-bold text-gray-400">INVOICE</h2>
            </header>
            
            <section className="grid grid-cols-2 gap-8 text-xs mb-8">
                <div>
                    <p className="font-bold text-gray-500 mb-1">RECIPIENT:</p>
                    <p className="font-bold">{client.name}</p>
                    <p className="whitespace-pre-line">{client.address}</p>
                </div>
                <div className="p-4 rounded-md" style={{backgroundColor: `${accentColor}1A`}}>
                    <div className="grid grid-cols-2 gap-1">
                        <span className="font-bold">Invoice #</span><span className="text-right">{invoice.invoiceNumber}</span>
                        <span className="font-bold">Issued</span><span className="text-right">{safeFormat(invoice.invoiceDate, 'MMM d, yyyy')}</span>
                        <span className="font-bold">Due</span><span className="text-right">{safeFormat(invoice.dueDate, 'MMM d, yyyy')}</span>
                        {invoice.poNumber && <><span className="font-bold">PO#</span><span className="text-right">{invoice.poNumber}</span></>}
                        <div className="col-span-2 mt-2 pt-2 border-t" style={{borderColor: accentColor}}>
                           <p className="flex justify-between font-bold text-base"><span style={{color: accentColor}}>Total</span> <span style={{color: accentColor}}>{currencySymbol}{balanceDue.toFixed(2)}</span></p>
                        </div>
                    </div>
                </div>
            </section>
            
            <HvacDetails invoice={invoice} />
            
            <main className="flex-grow mt-4">
                 <p className="font-bold mb-2" style={{color: accentColor}}>For Services Rendered</p>
                 <table className="w-full text-left text-xs">
                    <thead className="text-white" style={{backgroundColor: accentColor}}>
                        <tr>
                            <th className="p-2 font-bold w-1/2">PRODUCT / SERVICE</th>
                            <th className="p-2 font-bold w-1/4">DESCRIPTION</th>
                            <th className="p-2 font-bold text-center">QTY</th>
                            <th className="p-2 font-bold text-right">UNIT PRICE</th>
                            <th className="p-2 font-bold text-right">TOTAL</th>
                        </tr>
                    </thead>
                    <tbody>
                        {pageItems.map(item => (
                            <tr key={item.id} className="border-b">
                                <td className="p-2 align-top font-semibold">{item.name}</td>
                                <td className="p-2 align-top whitespace-pre-line text-gray-600">{item.description}</td>
                                <td className="p-2 align-top text-center">{item.quantity}</td>
                                <td className="p-2 align-top text-right">{currencySymbol}{item.unitPrice.toFixed(2)}</td>
                                <td className="p-2 align-top text-right font-medium">{currencySymbol}{(item.quantity * item.unitPrice).toFixed(2)}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </main>
            
            {pageIndex === totalPages - 1 && (
                <footer className="mt-auto pt-8 flex justify-between items-end">
                    <div className="text-xs text-gray-500 w-1/2">
                        <p>{invoice.paymentInstructions}</p>
                        <p className="mt-2">{invoice.termsAndConditions}</p>
                    </div>
                     <div className="w-1/3 text-xs space-y-1">
                        <p className="flex justify-between"><span>Subtotal</span> <span>{currencySymbol}{subtotal.toFixed(2)}</span></p>
                        <p className="flex justify-between"><span>GST ({invoice.summary.taxPercentage}%)</span> <span>{currencySymbol}{taxAmount.toFixed(2)}</span></p>
                        <p className="flex justify-between font-bold text-sm mt-2 pt-2 border-t"><span>Total</span> <span>{currencySymbol}{props.total.toFixed(2)}</span></p>
                        <p className="flex justify-between font-bold"><span>Account balance</span> <span>{currencySymbol}{balanceDue.toFixed(2)}</span></p>
                    </div>
                </footer>
            )}
        </div>
    );
}

// All other templates will just be stubs for now, pointing to the first one.
export const HVACTemplate2: React.FC<PageProps> = (props) => <HVACTemplate1 {...props} />;
export const HVACTemplate3: React.FC<PageProps> = (props) => <HVACTemplate1 {...props} />;
export const HVACTemplate4: React.FC<PageProps> = (props) => <HVACTemplate1 {...props} />;
export const HVACTemplate5: React.FC<PageProps> = (props) => <HVACTemplate1 {...props} />;
export const HVACTemplate6: React.FC<PageProps> = (props) => <HVACTemplate1 {...props} />;
export const HVACTemplate7: React.FC<PageProps> = (props) => <HVACTemplate1 {...props} />;
export const HVACTemplate8: React.FC<PageProps> = (props) => <HVACTemplate1 {...props} />;
export const HVACTemplate9: React.FC<PageProps> = (props) => <HVACTemplate1 {...props} />;
export const HVACTemplate10: React.FC<PageProps> = (props) => <HVACTemplate1 {...props} />;
