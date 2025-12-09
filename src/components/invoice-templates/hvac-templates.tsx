
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

const HvacDetails: React.FC<{ invoice: Invoice, t: any }> = ({ invoice, t }) => {
    if (!invoice.hvac) return null;
    const { hvac } = invoice;
    return (
        <section className="my-4 text-xs">
            <p className="font-bold text-gray-500 mb-2 border-b">{(t.hvacSpecifications || 'HVAC Specifications')}</p>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-x-4 gap-y-1">
                <p><span className="font-semibold text-gray-600">{(t.unitType || 'Unit Type')}:</span> {hvac.unitType}</p>
                <p><span className="font-semibold text-gray-600">{(t.modelNo || 'Model #')}:</span> {hvac.modelNumber}</p>
                <p><span className="font-semibold text-gray-600">{(t.refrigerant || 'Refrigerant')}:</span> {hvac.refrigerantType}</p>
                {hvac.maintenanceFee && <p><span className="font-semibold text-gray-600">{(t.maintenanceFee || 'Maintenance Fee')}:</span> ${hvac.maintenanceFee.toFixed(2)}</p>}
            </div>
        </section>
    );
};

// Template 1: Direct Interpretation of user image
export const HVACTemplate1: React.FC<PageProps> = (props) => {
    const { invoice, pageItems, pageIndex, totalPages, subtotal, taxAmount, balanceDue, currencySymbol, accentColor, t } = props;
    const { business, client } = invoice;

    return (
        <div className={`p-8 font-sans ${pageIndex < totalPages - 1 ? 'page-break-after' : ''}`} style={{ minHeight: '1056px', backgroundColor: props.backgroundColor, color: props.textColor }}>
            <header className="flex justify-between items-start pb-4 border-b-2" style={{ borderColor: accentColor }}>
                <div className="flex items-center gap-4">
                     {business.logoUrl && <Image src={business.logoUrl} alt="Logo" width={50} height={50} className="object-contain" />}
                    <div>
                        <h1 className="text-2xl font-bold">{business.name}</h1>
                        <p className="text-xs whitespace-pre-line">{business.address}</p>
                        <p className="text-xs">{business.email} | {business.phone}</p>
                    </div>
                </div>
                <div className="text-right">
                  <h2 className="text-2xl font-bold text-gray-700">{(t.invoice || 'INVOICE').toUpperCase()}</h2>
                  <p className="text-sm">{(t.hvacService || 'HVAC Service')}</p>
                </div>
            </header>

            <section className="grid grid-cols-2 gap-4 my-6 text-xs border-b pb-6">
                <div>
                    <p className="font-bold text-gray-500 mb-1">{(t.serviceContractor || 'SERVICE CONTRACTOR')}</p>
                    <p>{business.name}</p>
                    <p className="whitespace-pre-line">{business.address}</p>
                    <p>{business.email}</p>
                    <p>{business.phone}</p>
                </div>
                <div className="p-4 bg-gray-50 rounded-md">
                    <p className="font-bold text-gray-500 mb-1">{(t.clientInformation || 'CLIENT INFORMATION')}</p>
                    <p>{client.name}</p>
                    <p className="whitespace-pre-line">{client.address}</p>
                    <p>{client.email}</p>
                    <p>{client.phone}</p>
                </div>
            </section>
            
            <HvacDetails invoice={invoice} t={t} />

            <main className="flex-grow">
                 <table className="w-full text-left text-xs">
                    <thead>
                        <tr style={{ backgroundColor: `${accentColor}20`}}>
                            <th className="p-2 font-bold w-1/6">{(t.serviceNo || 'SERVICE NO.')}</th>
                            <th className="p-2 font-bold w-2/5">{(t.description || 'DESCRIPTION')}</th>
                            <th className="p-2 font-bold text-center">{(t.quantity || 'QUANTITY')}</th>
                            <th className="p-2 font-bold text-right">{(t.unitCost || 'UNIT COST')}</th>
                            <th className="p-2 font-bold text-right">{(t.subtotal || 'SUB-TOTAL')}</th>
                        </tr>
                    </thead>
                    <tbody>
                        {pageItems.map((item, index) => (
                            <tr key={item.id} className="border-b border-gray-200">
                                <td className="p-2 align-top">{`SRVC-${String(index + 1).padStart(4,'0')}`}</td>
                                <td className="p-2 align-top whitespace-pre-line">{item.name}</td>
                                <td className="p-2 align-top text-center">{item.quantity}</td>
                                <td className="p-2 align-top text-right">{currencySymbol}{item.unitPrice.toFixed(2)}</td>
                                <td className="p-2 align-top text-right">{currencySymbol}{(item.quantity * item.unitPrice).toFixed(2)}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </main>
            
            {pageIndex === totalPages - 1 && (
                <footer className="mt-auto pt-6 flex justify-between items-end">
                    <div className="w-1/2 text-xs">
                        <p className="font-bold mb-1" style={{ color: accentColor }}>{(t.termsAndConditions || 'TERMS & CONDITION')}:</p>
                        <p className="whitespace-pre-line">{invoice.termsAndConditions}</p>
                    </div>
                     <div className="w-2/5">
                        <div className="space-y-1 text-xs">
                            <div className="flex justify-between p-1"><span>{(t.subtotal || 'Sub-total')}:</span><span className="font-medium">{currencySymbol}{subtotal.toFixed(2)}</span></div>
                            <div className="flex justify-between p-1"><span>{(t.tax || 'Tax')} ({invoice.summary.taxPercentage}%):</span><span className="font-medium">{currencySymbol}{taxAmount.toFixed(2)}</span></div>
                            <div className="flex justify-between p-2 mt-1 border-t-2 border-gray-400 font-bold" style={{ color: accentColor }}><span className="text-base">{(t.totalCost || 'TOTAL COST')}:</span><span className="text-base">{currencySymbol}{balanceDue.toFixed(2)}</span></div>
                        </div>
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
