
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

// Template 1: Voltage
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
                    {business.logoUrl && <Image src={business.logoUrl} alt="Logo" width={80} height={40} className="object-contain mb-2"/>}
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
                </footer>
            )}
        </div>
    );
}

// Template 2: Circuit
export const ElectricalTemplate2: React.FC<PageProps> = (props) => {
    const { invoice, pageItems, pageIndex, totalPages, subtotal, taxAmount, balanceDue, currencySymbol, accentColor, t } = props;
    const { business, client } = invoice;
    return (
        <div className={`p-10 bg-white font-sans text-gray-800 flex flex-col ${pageIndex < totalPages - 1 ? 'page-break-after' : ''}`} style={{ minHeight: '1056px', backgroundColor: props.backgroundColor, color: props.textColor }}>
            <header className="flex justify-between items-start pb-4 border-b-4" style={{ borderColor: accentColor }}>
                <div>
                    <h1 className="text-3xl font-bold" style={{color: accentColor}}>{business.name}</h1>
                    <p className="text-xs whitespace-pre-line text-gray-500">{business.address}</p>
                </div>
                <div className="text-right">
                    <h2 className="text-3xl font-bold text-gray-400">{(t.invoice || 'INVOICE').toUpperCase()}</h2>
                </div>
            </header>

            <section className="grid grid-cols-2 gap-8 my-8 text-sm">
                <div>
                    <p className="font-bold text-gray-500 mb-1">{(t.billTo || 'BILL TO')}</p>
                    <p>{client.name}</p>
                    <p>{client.address}</p>
                </div>
                <div className="text-right">
                    <p><span className="font-bold text-gray-500">{(t.invoiceNo || 'Invoice #')}:</span> {invoice.invoiceNumber}</p>
                    <p><span className="font-bold text-gray-500">{(t.date || 'Date')}:</span> {safeFormat(invoice.invoiceDate, 'MMM d, yyyy')}</p>
                </div>
            </section>
            
            <ElectricalDetails invoice={invoice} t={t} />

            <main className="flex-grow mt-4">
                 <table className="w-full text-left text-sm">
                    <thead>
                        <tr style={{ backgroundColor: accentColor }} className="text-white">
                            <th className="p-2 font-bold w-1/2 rounded-l-md">{(t.description || 'DESCRIPTION').toUpperCase()}</th>
                            <th className="p-2 font-bold text-center">{(t.quantity || 'QTY').toUpperCase()}</th>
                            <th className="p-2 font-bold text-right">{(t.unitPrice || 'UNIT PRICE').toUpperCase()}</th>
                            <th className="p-2 font-bold text-right rounded-r-md">{(t.total || 'TOTAL').toUpperCase()}</th>
                        </tr>
                    </thead>
                    <tbody>
                        {pageItems.map(item => (
                            <tr key={item.id} className="border-b">
                                <td className="p-2">{item.name}</td>
                                <td className="p-2 text-center">{item.quantity}</td>
                                <td className="p-2 text-right">{currencySymbol}{item.unitPrice.toFixed(2)}</td>
                                <td className="p-2 text-right">{currencySymbol}{(item.quantity * item.unitPrice).toFixed(2)}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </main>
            
            {pageIndex === totalPages - 1 && (
                <footer className="mt-auto pt-8">
                    <div className="flex justify-end">
                        <div className="w-1/3 text-sm space-y-1">
                             <div className="flex justify-between p-1"><span className="text-gray-600">{(t.subtotal || 'Subtotal')}:</span><span className="font-medium">{currencySymbol}{subtotal.toFixed(2)}</span></div>
                            <div className="flex justify-between p-1"><span className="text-gray-600">{(t.tax || 'Tax')}:</span><span className="font-medium">{currencySymbol}{taxAmount.toFixed(2)}</span></div>
                            <div className="flex justify-between font-bold text-base mt-2 pt-2 border-t-2" style={{ borderColor: accentColor }}><span style={{ color: accentColor }}>{(t.total || 'Total')}:</span><span>{currencySymbol}{balanceDue.toFixed(2)}</span></div>
                        </div>
                    </div>
                </footer>
            )}
        </div>
    );
};

// Template 3: Spark
export const ElectricalTemplate3: React.FC<PageProps> = (props) => {
    const { invoice, pageItems, pageIndex, totalPages, subtotal, taxAmount, balanceDue, currencySymbol, t } = props;
    const { business, client } = invoice;
    return (
        <div className={`p-12 bg-white font-['Helvetica'] text-gray-700 flex flex-col ${pageIndex < totalPages - 1 ? "page-break-after" : ""}`} style={{ minHeight: '1056px', backgroundColor: props.backgroundColor, color: props.textColor }}>
            <header className="flex justify-between items-start mb-12 text-center">
                <div className="text-left">
                    <h1 className="text-4xl font-bold">{business.name}</h1>
                    <p className="text-xs">{business.address}</p>
                </div>
                <div className="text-right">
                    <h2 className="text-3xl font-light tracking-widest">{(t.invoice || 'INVOICE').toUpperCase()}</h2>
                    <p className="text-sm text-gray-500 mt-2">{(t.electricalService || 'Electrical Service')}</p>
                </div>
            </header>
            
            <ElectricalDetails invoice={invoice} t={t} />

            <main className="flex-grow mt-8">
                <table className="w-full text-left text-xs">
                    <thead>
                        <tr>
                            <th className="p-2 font-semibold w-1/2 border-b-2 border-gray-300">{(t.service || 'Service').toUpperCase()}</th>
                            <th className="p-2 font-semibold text-center border-b-2 border-gray-300">{(t.quantity || 'Quantity').toUpperCase()}</th>
                            <th className="p-2 font-semibold text-right border-b-2 border-gray-300">{(t.rate || 'Rate').toUpperCase()}</th>
                            <th className="p-2 font-semibold text-right border-b-2 border-gray-300">{(t.amount || 'Amount').toUpperCase()}</th>
                        </tr>
                    </thead>
                    <tbody>
                        {pageItems.map(item => (
                            <tr key={item.id}>
                                <td className="p-2 border-b border-gray-200 whitespace-pre-line">{item.name}</td>
                                <td className="p-2 border-b border-gray-200 text-center">{item.quantity}</td>
                                <td className="p-2 border-b border-gray-200 text-right">{currencySymbol}{item.unitPrice.toFixed(2)}</td>
                                <td className="p-2 border-b border-gray-200 text-right">{currencySymbol}{(item.quantity * item.unitPrice).toFixed(2)}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </main>
            
            {pageIndex === totalPages - 1 && (
                <footer className="mt-auto pt-8">
                    <div className="flex justify-end">
                        <table className="w-1/3 text-xs">
                             <tbody>
                                <tr><td className="py-1 text-gray-500">{(t.subtotal || 'Subtotal')}</td><td className="text-right">{currencySymbol}{subtotal.toFixed(2)}</td></tr>
                                <tr><td className="py-1 text-gray-500">{(t.salesTax || 'Sales Tax')}</td><td className="text-right">{currencySymbol}{taxAmount.toFixed(2)}</td></tr>
                                <tr className="font-bold text-base border-t-2 border-black"><td className="pt-2">{(t.total || 'TOTAL').toUpperCase()}</td><td className="pt-2 text-right">{currencySymbol}{balanceDue.toFixed(2)}</td></tr>
                            </tbody>
                        </table>
                    </div>
                </footer>
            )}
        </div>
    );
};

// Template 4: Wired
export const ElectricalTemplate4: React.FC<PageProps> = (props) => {
    const { invoice, pageItems, pageIndex, totalPages, subtotal, taxAmount, balanceDue, currencySymbol, t } = props;
    const { business, client } = invoice;

    return (
        <div className={`bg-white font-sans text-gray-800 flex ${pageIndex < totalPages - 1 ? "page-break-after" : ""}`} style={{ minHeight: '1056px', backgroundColor: props.backgroundColor, color: props.textColor }}>
            <div className="w-10" style={{ backgroundColor: props.accentColor }}></div>
            <div className="p-10 flex-grow flex flex-col">
                <header className="flex justify-between items-start mb-10">
                    <div>
                        <h1 className="text-3xl font-bold">{business.name}</h1>
                        <p className="text-xs">{business.address}</p>
                    </div>
                    <div className="text-right">
                        <h2 className="text-2xl font-bold text-gray-400">{(t.invoice || 'INVOICE').toUpperCase()}</h2>
                        <p className="text-xs text-gray-400">{(t.electricalService || 'Electrical Service')}</p>
                    </div>
                </header>

                <ElectricalDetails invoice={invoice} t={t} />

                <main className="flex-grow mt-8">
                    <table className="w-full text-left text-sm">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="p-2 font-bold w-3/5">{(t.service || 'SERVICE').toUpperCase()}</th>
                                <th className="p-2 font-bold text-center">{(t.quantity || 'QTY').toUpperCase()}</th>
                                <th className="p-2 font-bold text-right">{(t.rate || 'RATE').toUpperCase()}</th>
                                <th className="p-2 font-bold text-right">{(t.total || 'TOTAL').toUpperCase()}</th>
                            </tr>
                        </thead>
                        <tbody>
                            {pageItems.map(item => (
                                <tr key={item.id} className="border-b border-gray-100">
                                    <td className="p-2 align-top whitespace-pre-line">{item.name}</td>
                                    <td className="p-2 align-top text-center">{item.quantity}</td>
                                    <td className="p-2 align-top text-right">{currencySymbol}{item.unitPrice.toFixed(2)}</td>
                                    <td className="p-2 align-top text-right font-medium">{currencySymbol}{(item.quantity * item.unitPrice).toFixed(2)}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </main>
                {pageIndex === totalPages - 1 && (
                    <footer className="mt-auto pt-8">
                        <div className="flex justify-end">
                            <div className="w-2/5 text-sm space-y-2">
                                <div className="flex justify-between"><span>{(t.subtotal || 'Subtotal')}:</span><span>{currencySymbol}{subtotal.toFixed(2)}</span></div>
                                <div className="flex justify-between"><span>{(t.tax || 'Tax')}:</span><span>{currencySymbol}{taxAmount.toFixed(2)}</span></div>
                                <div className="flex justify-between font-bold text-lg mt-2 pt-2 border-t-2 border-black"><span>{(t.total || 'Total')}:</span><span>{currencySymbol}{balanceDue.toFixed(2)}</span></div>
                            </div>
                        </div>
                    </footer>
                )}
            </div>
        </div>
    );
};

// Template 5: Power Grid
export const ElectricalTemplate5: React.FC<PageProps> = (props) => {
    const { invoice, pageItems, pageIndex, totalPages, subtotal, taxAmount, balanceDue, currencySymbol, t } = props;
    const { business, client } = invoice;

    return (
        <div className={`p-10 bg-gray-50 font-['Roboto'] text-gray-900 flex flex-col ${pageIndex < totalPages - 1 ? "page-break-after" : ""}`} style={{ minHeight: '1056px', backgroundColor: props.backgroundColor, color: props.textColor }}>
            <header className="grid grid-cols-2 gap-4 mb-10">
                <div>
                    <h1 className="text-4xl font-extrabold" style={{color: props.accentColor}}>{business.name}</h1>
                    <p className="text-xs">{business.address}</p>
                </div>
                 <div className="text-right">
                     <p className="text-3xl font-bold">{(t.invoice || 'Invoice')}</p>
                    <p className="text-xs text-gray-500">{(t.electricalService || 'Electrical Service')}</p>
                </div>
            </header>

            <section className="mb-8 p-4 bg-white shadow-sm rounded-md text-xs">
                 <p className="font-bold text-gray-500 mb-2">{(t.projectFor || 'PROJECT FOR').toUpperCase()}: {client.name}</p>
                 <p className="font-semibold">{invoice.poNumber || 'N/A'}</p>
                 <p>{client.address}</p>
            </section>
            
            <ElectricalDetails invoice={invoice} t={t} />

            <main className="flex-grow bg-white p-4 rounded-md shadow-sm mt-4">
                <table className="w-full text-left text-xs">
                    <thead>
                        <tr className="border-b-2 border-gray-200">
                            <th className="py-2 font-bold w-[60%]">{(t.descriptionOfWork || 'Description of Work').toUpperCase()}</th>
                            <th className="py-2 font-bold text-center">{(t.qty || 'Qty').toUpperCase()}</th>
                            <th className="py-2 font-bold text-right">{(t.cost || 'Cost').toUpperCase()}</th>
                            <th className="py-2 font-bold text-right">{(t.total || 'Total').toUpperCase()}</th>
                        </tr>
                    </thead>
                    <tbody>
                        {pageItems.map(item => (
                            <tr key={item.id} className="border-b border-gray-100">
                                <td className="py-2 align-top whitespace-pre-line">{item.name}</td>
                                <td className="py-2 align-top text-center">{item.quantity}</td>
                                <td className="py-2 align-top text-right">{currencySymbol}{item.unitPrice.toFixed(2)}</td>
                                <td className="py-2 align-top text-right font-semibold">{currencySymbol}{(item.quantity * item.unitPrice).toFixed(2)}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </main>
            
            {pageIndex === totalPages - 1 && (
                <footer className="mt-auto pt-8">
                     <div className="flex justify-end">
                        <div className="w-1/3 text-sm space-y-1">
                             <div className="flex justify-between p-1"><span>{(t.subtotal || 'Subtotal')}</span><span>{currencySymbol}{subtotal.toFixed(2)}</span></div>
                             <div className="flex justify-between p-1"><span>{(t.tax || 'Tax')}</span><span>{currencySymbol}{taxAmount.toFixed(2)}</span></div>
                             <div className="flex justify-between p-2 mt-2 border-t-2 border-black font-bold text-lg"><span>{(t.total || 'Total')}</span><span>{currencySymbol}{balanceDue.toFixed(2)}</span></div>
                        </div>
                    </div>
                </footer>
            )}
        </div>
    );
};

export const ElectricalTemplate6: React.FC<PageProps> = (props) => <ElectricalTemplate1 {...props} />;
export const ElectricalTemplate7: React.FC<PageProps> = (props) => <ElectricalTemplate2 {...props} />;
export const ElectricalTemplate8: React.FC<PageProps> = (props) => <ElectricalTemplate3 {...props} />;
export const ElectricalTemplate9: React.FC<PageProps> = (props) => <ElectricalTemplate4 {...props} />;
export const ElectricalTemplate10: React.FC<PageProps> = (props) => <ElectricalTemplate5 {...props} />;
