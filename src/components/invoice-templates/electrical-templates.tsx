

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

const ElectricalDetails: React.FC<{ invoice: Invoice, t: any }> = ({ invoice, t }) => {
    if (!invoice.electrical) return null;
    const { electrical } = invoice;
    return (
        <section className="my-4 text-xs">
            <p className="font-bold text-gray-500 mb-2 border-b">{(t.electricalServiceDetails || 'Electrical Service Details')}</p>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-x-4 gap-y-1">
                <p><span className="font-semibold text-gray-600">{(t.serviceType || 'Service Type')}:</span> {electrical.serviceType}</p>
                <p><span className="font-semibold text-gray-600">{(t.voltage || 'Voltage')}:</span> {electrical.voltage}</p>
                <p><span className="font-semibold text-gray-600">{(t.fixtureDevice || 'Fixture/Device')}:</span> {electrical.fixtureDevice}</p>
                {electrical.permitCost && <p><span className="font-semibold text-gray-600">{(t.permitCost || 'Permit Cost')}:</span> ${electrical.permitCost.toFixed(2)}</p>}
            </div>
        </section>
    );
};

// Template 1: Direct Interpretation
export const ElectricalTemplate1: React.FC<PageProps> = (props) => {
    const { invoice, pageItems, pageIndex, totalPages, subtotal, taxAmount, balanceDue, currencySymbol, accentColor, t } = props;
    const { business, client } = invoice;

    return (
        <div className={`p-8 font-sans ${pageIndex < totalPages - 1 ? 'page-break-after' : ''}`} style={{ minHeight: '1056px', backgroundColor: props.backgroundColor, color: props.textColor }}>
            <header className="mb-8 p-4" style={{ backgroundColor: '#2d3748', color: 'white' }}>
                 <div className="flex justify-between items-center">
                    <div>
                        <h1 className="text-3xl font-bold" style={{color: accentColor || '#FBBF24'}}>{(t.invoice || 'INVOICE').toUpperCase()}</h1>
                        <p className="text-sm">{(t.electricalService || 'ELECTRICAL SERVICE')}</p>
                    </div>
                    <p className="text-lg">Nº {invoice.invoiceNumber}</p>
                </div>
            </header>

            <section className="grid grid-cols-2 gap-8 text-xs mb-8">
                <div>
                    <p className="font-bold mb-1" style={{color: accentColor || '#FBBF24'}}>{(t.billTo || 'BILL TO').toUpperCase()}</p>
                    <p>{client.name}</p>
                    <p className="whitespace-pre-line">{client.address}</p>
                    <p>{client.phone}</p>
                </div>
                <div>
                    <p className="font-bold mb-1" style={{color: accentColor || '#FBBF24'}}>{(t.billFrom || 'BILL FROM').toUpperCase()}</p>
                    <p>{business.name}</p>
                    <p className="whitespace-pre-line">{business.address}</p>
                    <p>{business.phone}</p>
                </div>
            </section>

            <ElectricalDetails invoice={invoice} t={t} />
            
            <main className="flex-grow">
                 <table className="w-full text-left text-xs">
                    <thead>
                        <tr className="rounded-md" style={{ backgroundColor: accentColor || '#FBBF24', color: '#2d3748' }}>
                            <th className="p-2 font-bold w-1/2 rounded-l-md">{(t.description || 'DESCRIPTION').toUpperCase()}</th>
                            <th className="p-2 font-bold text-center">{(t.quantity || 'QTY').toUpperCase()}</th>
                            <th className="p-2 font-bold text-right">{(t.unitCost || 'UNIT COST').toUpperCase()}</th>
                            <th className="p-2 font-bold text-right rounded-r-md">{(t.subtotal || 'SUBTOTAL').toUpperCase()}</th>
                        </tr>
                    </thead>
                    <tbody>
                        {pageItems.map(item => (
                            <tr key={item.id} className="border-b bg-gray-50">
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
                <footer className="mt-auto pt-8">
                    <div className="flex justify-between items-start">
                        <div className="text-xs w-1/2">
                            <p className="font-bold mb-1" style={{color: accentColor || '#FBBF24'}}>{(t.paymentInfo || 'PAYMENT INFO').toUpperCase()}</p>
                            <p className="whitespace-pre-line">{invoice.paymentInstructions}</p>
                        </div>
                        <div className="w-1/3 text-xs space-y-1 text-right">
                            <p className="grid grid-cols-2"><span className="font-bold" style={{color: accentColor || '#FBBF24'}}>{(t.subtotal || 'SUBTOTAL').toUpperCase()}:</span> <span>{currencySymbol}{subtotal.toFixed(2)}</span></p>
                            <p className="grid grid-cols-2"><span className="font-bold" style={{color: accentColor || '#FBBF24'}}>{(t.tax || 'TAX').toUpperCase()}:</span> <span>{currencySymbol}{taxAmount.toFixed(2)}</span></p>
                            <p className="grid grid-cols-2 mt-2 pt-2 border-t font-bold text-sm"><span style={{color: accentColor || '#FBBF24'}}>{(t.total || 'TOTAL').toUpperCase()}:</span> <span>{currencySymbol}{balanceDue.toFixed(2)}</span></p>
                        </div>
                    </div>
                     <div className="text-xs mt-8">
                        <p className="font-bold" style={{color: accentColor || '#FBBF24'}}>{(t.termsAndConditions || 'TERMS AND CONDITIONS').toUpperCase()}</p>
                        <p className="text-gray-600 whitespace-pre-line">{invoice.termsAndConditions}</p>
                    </div>
                </footer>
            )}
        </div>
    );
}

// All other templates will just be stubs for now, pointing to the first one.
export const ElectricalTemplate2: React.FC<PageProps> = (props) => <ElectricalTemplate1 {...props} />;
export const ElectricalTemplate3: React.FC<PageProps> = (props) => <ElectricalTemplate1 {...props} />;
export const ElectricalTemplate4: React.FC<PageProps> = (props) => <ElectricalTemplate1 {...props} />;
export const ElectricalTemplate5: React.FC<PageProps> = (props) => <ElectricalTemplate1 {...props} />;
export const ElectricalTemplate6: React.FC<PageProps> = (props) => <ElectricalTemplate1 {...props} />;
export const ElectricalTemplate7: React.FC<PageProps> = (props) => <ElectricalTemplate1 {...props} />;
export const ElectricalTemplate8: React.FC<PageProps> = (props) => <ElectricalTemplate1 {...props} />;
export const ElectricalTemplate9: React.FC<PageProps> = (props) => <ElectricalTemplate1 {...props} />;
export const ElectricalTemplate10: React.FC<PageProps> = (props) => <ElectricalTemplate1 {...props} />;
