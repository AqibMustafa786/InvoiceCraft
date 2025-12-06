
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

const ConstructionDetails: React.FC<{ invoice: Invoice }> = ({ invoice }) => {
    if (!invoice.construction) return null;
    const { construction } = invoice;
    return (
        <section className="my-4 text-xs">
            <p className="font-bold text-gray-500 mb-2 border-b">Construction Details</p>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-x-4 gap-y-1">
                <p><span className="font-semibold text-gray-600">Job Site:</span> {construction.jobSiteAddress}</p>
                <p><span className="font-semibold text-gray-600">Permit #:</span> {construction.permitNumber}</p>
                {construction.laborRate && <p><span className="font-semibold text-gray-600">Labor Rate:</span> ${construction.laborRate}/hr</p>}
                {construction.equipmentRentalFees && <p><span className="font-semibold text-gray-600">Equipment Fees:</span> ${construction.equipmentRentalFees}</p>}
                {construction.wasteDisposalFee && <p><span className="font-semibold text-gray-600">Disposal Fee:</span> ${construction.wasteDisposalFee}</p>}
                {construction.projectStartDate && <p><span className="font-semibold text-gray-600">Start Date:</span> {safeFormat(construction.projectStartDate, 'MM/dd/yyyy')}</p>}
                {construction.projectEndDate && <p><span className="font-semibold text-gray-600">End Date:</span> {safeFormat(construction.projectEndDate, 'MM/dd/yyyy')}</p>}
            </div>
        </section>
    );
};

export const ConstructionTemplate1: React.FC<PageProps> = (props) => {
    const { invoice, pageItems, pageIndex, totalPages, subtotal, taxAmount, discountAmount, balanceDue, t, currencySymbol, accentColor } = props;
    const { business, client } = invoice;
    const totalLabor = pageItems.filter(i => i.name.toLowerCase().includes('labor')).reduce((acc, i) => acc + (i.quantity * i.unitPrice), 0);
    const totalMaterials = pageItems.filter(i => !i.name.toLowerCase().includes('labor')).reduce((acc, i) => acc + (i.quantity * i.unitPrice), 0);

    return (
        <div className={`p-8 font-sans ${pageIndex < totalPages - 1 ? 'page-break-after' : ''}`} style={{ minHeight: '1056px', backgroundColor: props.backgroundColor, color: props.textColor }}>
            <header className="flex justify-between items-start mb-8">
                <div>
                    <h1 className="text-2xl font-bold">{business.name}</h1>
                    <p className="text-xs whitespace-pre-line">{business.address}</p>
                    <p className="text-xs">{business.phone}</p>
                    <p className="text-xs">{business.email}</p>
                </div>
                <h2 className="text-3xl font-bold text-gray-400">CONSTRUCTION INVOICE</h2>
            </header>
            
            <section className="grid grid-cols-2 gap-8 text-xs mb-8">
                <div>
                    <p className="font-bold">Client</p>
                    <p>{client.name}</p>
                    <p className="whitespace-pre-line">{client.address}</p>
                </div>
                <div className="bg-gray-100 p-2 rounded">
                    <p className="grid grid-cols-2"><span className="font-bold">Date of Invoice:</span> <span>{safeFormat(invoice.invoiceDate, 'MM-dd-yyyy')}</span></p>
                    <p className="grid grid-cols-2"><span className="font-bold">Invoice No:</span> <span>{invoice.invoiceNumber}</span></p>
                    {invoice.construction?.projectStartDate && <p className="grid grid-cols-2"><span className="font-bold">Work Start Date:</span> <span>{safeFormat(invoice.construction.projectStartDate, 'MM-dd-yyyy')}</span></p>}
                    {invoice.construction?.projectEndDate && <p className="grid grid-cols-2"><span className="font-bold">Work End Date:</span> <span>{safeFormat(invoice.construction.projectEndDate, 'MM-dd-yyyy')}</span></p>}
                    <p className="grid grid-cols-2"><span className="font-bold">Due Date:</span> <span>{safeFormat(invoice.dueDate, 'MM-dd-yyyy')}</span></p>
                </div>
            </section>
            
            <ConstructionDetails invoice={invoice} />
            
            <main className="grid grid-cols-2 gap-8 flex-grow">
                 {/* Materials Table */}
                <div className="space-y-4">
                    <table className="w-full text-left text-xs">
                        <thead><tr className="bg-gray-200"><th className="p-1 font-bold w-1/4">QTY</th><th className="p-1 font-bold w-1/2">MATERIAL</th><th className="p-1 font-bold text-right w-1/4">TOTAL</th></tr></thead>
                        <tbody>
                            {pageItems.filter(i => !i.name.toLowerCase().includes('labor')).map(item => (
                                <tr key={item.id} className="border-b"><td className="p-1">{item.quantity}</td><td className="p-1">{item.name}</td><td className="p-1 text-right">{currencySymbol}{(item.quantity * item.unitPrice).toFixed(2)}</td></tr>
                            ))}
                        </tbody>
                        <tfoot><tr><td colSpan={2} className="p-1 text-right font-bold">TOTAL MATERIALS</td><td className="p-1 text-right font-bold">{currencySymbol}{totalMaterials.toFixed(2)}</td></tr></tfoot>
                    </table>
                </div>

                {/* Labor & Totals Table */}
                <div className="space-y-4">
                     <table className="w-full text-left text-xs">
                        <thead><tr className="bg-gray-200"><th className="p-1 font-bold w-1/2">LABOR</th><th className="p-1 font-bold text-right w-1/4">HRS</th><th className="p-1 font-bold text-right w-1/4">AMOUNT</th></tr></thead>
                        <tbody>
                            {pageItems.filter(i => i.name.toLowerCase().includes('labor')).map(item => (
                                <tr key={item.id} className="border-b"><td className="p-1">{item.name}</td><td className="p-1 text-right">{item.quantity}</td><td className="p-1 text-right">{currencySymbol}{(item.quantity * item.unitPrice).toFixed(2)}</td></tr>
                            ))}
                        </tbody>
                        <tfoot><tr><td colSpan={2} className="p-1 text-right font-bold">TOTAL LABOR</td><td className="p-1 text-right font-bold">{currencySymbol}{totalLabor.toFixed(2)}</td></tr></tfoot>
                    </table>
                     {pageIndex === totalPages - 1 && (
                         <div className="flex justify-end">
                            <div className="w-full text-xs space-y-1">
                                <p className="grid grid-cols-2"><span className="font-bold">SUBTOTAL:</span> <span className="text-right">{currencySymbol}{subtotal.toFixed(2)}</span></p>
                                <p className="grid grid-cols-2"><span className="font-bold">TAX ({invoice.summary.taxPercentage}%):</span> <span className="text-right">{currencySymbol}{taxAmount.toFixed(2)}</span></p>
                                <p className="grid grid-cols-2 bg-gray-200 p-1 font-bold text-sm"><span className="">GRAND TOTAL:</span> <span className="text-right">{currencySymbol}{balanceDue.toFixed(2)}</span></p>
                            </div>
                        </div>
                     )}
                </div>
            </main>
            {pageIndex === totalPages - 1 && (
                <footer className="mt-8 text-xs pt-4 border-t">
                    <p><span className="font-bold">Payment Terms:</span> {invoice.paymentInstructions}</p>
                </footer>
            )}
        </div>
    );
}

// All other templates will just be stubs for now, pointing to the first one.
export const ConstructionTemplate2: React.FC<PageProps> = (props) => <ConstructionTemplate1 {...props} />;
export const ConstructionTemplate3: React.FC<PageProps> = (props) => <ConstructionTemplate1 {...props} />;
export const ConstructionTemplate4: React.FC<PageProps> = (props) => <ConstructionTemplate1 {...props} />;
export const ConstructionTemplate5: React.FC<PageProps> = (props) => <ConstructionTemplate1 {...props} />;
export const ConstructionTemplate6: React.FC<PageProps> = (props) => <ConstructionTemplate1 {...props} />;
export const ConstructionTemplate7: React.FC<PageProps> = (props) => <ConstructionTemplate1 {...props} />;
export const ConstructionTemplate8: React.FC<PageProps> = (props) => <ConstructionTemplate1 {...props} />;
export const ConstructionTemplate9: React.FC<PageProps> = (props) => <ConstructionTemplate1 {...props} />;
export const ConstructionTemplate10: React.FC<PageProps> = (props) => <ConstructionTemplate1 {...props} />;
