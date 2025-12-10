

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

const ITFreelanceDetails: React.FC<{ invoice: Invoice, t: any }> = ({ invoice, t }) => {
    if (!invoice.freelance) return null;
    const { freelance } = invoice;
    return (
        <section className="my-4 text-xs">
            <p className="font-bold text-gray-500 mb-2 border-b">{(t.projectSpecifications || 'Project Specifications')}</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-1">
                <p><span className="font-semibold text-gray-600">{(t.projectName || 'Project Name')}:</span> {freelance.projectName}</p>
                {freelance.hourlyRate && <p><span className="font-semibold text-gray-600">{(t.hourlyRate || 'Hourly Rate')}:</span> ${freelance.hourlyRate.toFixed(2)}</p>}
                {freelance.fixedRate && <p><span className="font-semibold text-gray-600">{(t.fixedRate || 'Fixed Rate')}:</span> ${freelance.fixedRate.toFixed(2)}</p>}
                {freelance.hoursLogged && <p><span className="font-semibold text-gray-600">{(t.hoursLogged || 'Hours Logged')}:</span> {freelance.hoursLogged}</p>}
                <div className="col-span-full mt-2">
                    <p className="font-semibold text-gray-600">{(t.milestone || 'Milestone')}:</p>
                    <p className="whitespace-pre-line pl-2">{freelance.milestoneDescription}</p>
                </div>
            </div>
        </section>
    );
};


// Template 1: Tech Corporate
export const ITTemplate1: React.FC<PageProps> = (props) => {
    const { invoice, pageItems, pageIndex, totalPages, subtotal, balanceDue, currencySymbol, t } = props;
    const { business, client } = invoice;
    
    return (
        <div className={`p-10 font-sans flex flex-col ${pageIndex < totalPages - 1 ? 'page-break-after' : ''}`} style={{ minHeight: '1056px', backgroundColor: props.backgroundColor, color: props.textColor }}>
            <header className="flex justify-between items-start pb-5 mb-5">
                <div className="flex items-center gap-4">
                    {business.logoUrl ? 
                        <Image src={business.logoUrl} alt="Logo" width={50} height={50} className="object-contain" /> :
                        <div className="w-12 h-12 bg-gray-200 rounded-md"></div>
                    }
                    <div>
                        <h1 className="text-3xl font-bold">{business.name}</h1>
                        <p className="text-xs text-gray-500">{business.address} • {business.phone}</p>
                        <p className="text-xs text-blue-600">{business.email}</p>
                    </div>
                </div>
                 <div className="text-right">
                    <p className="text-2xl font-extrabold">{currencySymbol}{balanceDue.toLocaleString('en-US', {minimumFractionDigits: 2, maximumFractionDigits: 2})}</p>
                    <p className="text-sm font-bold text-gray-500 tracking-wider">{(t.totalCost || 'TOTAL COST').toUpperCase()}</p>
                </div>
            </header>

            <ITFreelanceDetails invoice={invoice} t={t} />

            <main className="flex-grow">
                 <p className="font-bold text-gray-400 tracking-widest mb-2 text-xs">{(t.costBreakdown || 'COST BREAKDOWN').toUpperCase()}</p>
                 <table className="w-full text-left text-xs">
                    <thead>
                        <tr className="border-b-2 border-gray-200">
                            <th className="py-2 font-bold w-1/2">{(t.description || 'DESCRIPTION').toUpperCase()}</th>
                            <th className="py-2 font-bold text-center">{(t.quantity || 'QUANTITY').toUpperCase()}</th>
                            <th className="py-2 font-bold text-right">{(t.unitPrice || 'UNIT PRICE').toUpperCase()}</th>
                            <th className="py-2 font-bold text-right">{(t.total || 'TOTAL').toUpperCase()}</th>
                        </tr>
                    </thead>
                    <tbody>
                        {pageItems.map(item => (
                            <tr key={item.id} className="border-b border-gray-100">
                                <td className="py-2 align-top whitespace-pre-line">{item.name}</td>
                                <td className="py-2 align-top text-center">{item.quantity}</td>
                                <td className="py-2 align-top text-right">{currencySymbol}{item.unitPrice.toFixed(2)}</td>
                                <td className="py-2 align-top text-right">{currencySymbol}{(item.quantity * item.unitPrice).toFixed(2)}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </main>
        </div>
    );
};

// All other templates will just be stubs for now, pointing to the first one.
export const ITTemplate2: React.FC<PageProps> = (props) => <ITTemplate1 {...props} />;
export const ITTemplate3: React.FC<PageProps> = (props) => <ITTemplate1 {...props} />;
export const ITTemplate4: React.FC<PageProps> = (props) => <ITTemplate1 {...props} />;
export const ITTemplate5: React.FC<PageProps> = (props) => <ITTemplate1 {...props} />;
