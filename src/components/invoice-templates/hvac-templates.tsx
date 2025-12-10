
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
                        <p className="whitespace-pre-line">{invoice.paymentInstructions}</p>
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

// Template 2: Coolant
export const HVACTemplate2: React.FC<PageProps> = (props) => {
    const { invoice, pageItems, pageIndex, totalPages, subtotal, taxAmount, balanceDue, currencySymbol, accentColor, t } = props;
    const { business, client } = invoice;
    return (
        <div className={`p-10 font-sans ${pageIndex < totalPages - 1 ? 'page-break-after' : ''}`} style={{ minHeight: '1056px', backgroundColor: '#F9FAFB', color: props.textColor }}>
            <div className="bg-white p-8 rounded-lg shadow-lg">
                <header className="flex justify-between items-center mb-10">
                    <div>
                        {business.logoUrl && <Image src={business.logoUrl} alt="Logo" width={90} height={45} className="object-contain mb-2"/>}
                        <h1 className="text-2xl font-bold">{business.name}</h1>
                        <p className="text-xs text-gray-500">{business.address}</p>
                    </div>
                    <h2 className="text-3xl font-extrabold text-gray-400">{(t.invoice || 'INVOICE').toUpperCase()}</h2>
                </header>
                <section className="grid grid-cols-2 gap-8 text-xs mb-8">
                    <div><p className="font-bold text-gray-500 mb-1">{(t.billedTo || 'Billed To')}</p><p>{client.name}<br/>{client.address}</p></div>
                    <div className="text-right"><p><span className="font-bold text-gray-500">{(t.invoiceNo || 'Invoice #')}: </span>{invoice.invoiceNumber}</p><p><span className="font-bold text-gray-500">{(t.date || 'Date')}: </span>{safeFormat(invoice.invoiceDate, 'dd/MM/yyyy')}</p></div>
                </section>
                <HvacDetails invoice={invoice} t={t} />
                <main className="flex-grow mt-4">
                    <table className="w-full text-left text-xs">
                        <thead><tr className="border-b-2 border-gray-200"><th className="py-2 font-bold w-1/2">{(t.service || 'SERVICE').toUpperCase()}</th><th className="py-2 font-bold text-center">{(t.qty || 'QTY').toUpperCase()}</th><th className="py-2 font-bold text-right">{(t.price || 'PRICE').toUpperCase()}</th><th className="py-2 font-bold text-right">{(t.amount || 'AMOUNT').toUpperCase()}</th></tr></thead>
                        <tbody>{pageItems.map(item => (<tr key={item.id} className="border-b border-gray-100"><td className="py-2">{item.name}</td><td className="py-2 text-center">{item.quantity}</td><td className="py-2 text-right">{currencySymbol}{item.unitPrice.toFixed(2)}</td><td className="py-2 text-right">{currencySymbol}{(item.quantity * item.unitPrice).toFixed(2)}</td></tr>))}</tbody>
                    </table>
                </main>
                {pageIndex === totalPages - 1 && (
                <footer className="mt-auto pt-8">
                    <div className="flex justify-end">
                        <div className="w-1/3 text-xs space-y-1">
                            <p className="flex justify-between"><span>{(t.subtotal || 'Subtotal')}:</span><span>{currencySymbol}{subtotal.toFixed(2)}</span></p>
                            <p className="flex justify-between"><span>{(t.tax || 'Tax')}:</span><span>{currencySymbol}{taxAmount.toFixed(2)}</span></p>
                            <p className="flex justify-between font-bold text-sm mt-2 pt-2 border-t border-gray-300"><span>{(t.total || 'Total')}:</span><span>{currencySymbol}{balanceDue.toFixed(2)}</span></p>
                        </div>
                    </div>
                </footer>
                )}
            </div>
        </div>
    );
};

// Template 3: Ventura
export const HVACTemplate3: React.FC<PageProps> = (props) => {
    const { invoice, pageItems, pageIndex, totalPages, subtotal, taxAmount, balanceDue, currencySymbol, t, accentColor } = props;
    const { business, client } = invoice;
    return (
        <div className={`p-10 bg-white font-sans ${pageIndex < totalPages - 1 ? 'page-break-after' : ''}`} style={{ minHeight: '1056px', backgroundColor: props.backgroundColor, color: props.textColor }}>
            <div className="grid grid-cols-2 gap-10">
                <div className="space-y-4">
                    {business.logoUrl && <Image src={business.logoUrl} alt="Logo" width={100} height={50} className="object-contain" />}
                    <p className="text-xs">{business.name}<br/>{business.address}</p>
                </div>
                <div className="text-right">
                    <h1 className="text-4xl font-bold">{(t.invoice || 'INVOICE').toUpperCase()}</h1>
                    <p className="text-xs mt-2"><span className="font-bold">#</span> {invoice.invoiceNumber}</p>
                </div>
            </div>
            <div className="mt-10 mb-8 w-full h-px bg-gray-200"></div>
            <section className="grid grid-cols-2 gap-10 text-xs mb-8">
                <div><p className="font-bold text-gray-500 mb-1">{(t.billTo || 'BILL TO')}</p><p>{client.name}<br/>{client.address}</p></div>
                <div className="text-right"><p className="font-bold text-gray-500 mb-1">{(t.date || 'DATE')}</p><p>{safeFormat(invoice.invoiceDate, 'MM-dd-yyyy')}</p></div>
            </section>
            <HvacDetails invoice={invoice} t={t} />
            <main className="flex-grow mt-4">
                <table className="w-full text-left text-xs">
                    <thead><tr style={{ color: accentColor }}><th className="py-2 font-bold w-1/2">{(t.description || 'DESCRIPTION').toUpperCase()}</th><th className="py-2 font-bold text-center">{(t.hours || 'HOURS').toUpperCase()}</th><th className="py-2 font-bold text-right">{(t.rate || 'RATE').toUpperCase()}</th><th className="py-2 font-bold text-right">{(t.total || 'TOTAL').toUpperCase()}</th></tr></thead>
                    <tbody>{pageItems.map(item => (<tr key={item.id} className="border-t"><td className="py-2">{item.name}</td><td className="py-2 text-center">{item.quantity}</td><td className="py-2 text-right">{currencySymbol}{item.unitPrice.toFixed(2)}</td><td className="py-2 text-right">{currencySymbol}{(item.quantity * item.unitPrice).toFixed(2)}</td></tr>))}</tbody>
                </table>
            </main>
            {pageIndex === totalPages - 1 && (
            <footer className="mt-auto pt-8">
                <div className="flex justify-end">
                    <div className="w-2/5 text-xs space-y-1">
                        <p className="flex justify-between"><span>{(t.subtotal || 'Subtotal')}:</span><span>{currencySymbol}{subtotal.toFixed(2)}</span></p>
                        <p className="flex justify-between"><span>{(t.tax || 'Tax')}:</span><span>{currencySymbol}{taxAmount.toFixed(2)}</span></p>
                        <p className="flex justify-between font-bold text-base mt-2 pt-2 border-t"><span>{(t.balanceDue || 'Balance Due')}:</span><span>{currencySymbol}{balanceDue.toFixed(2)}</span></p>
                    </div>
                </div>
            </footer>
            )}
        </div>
    );
};

// Template 4: EcoLink
export const HVACTemplate4: React.FC<PageProps> = (props) => {
    const { invoice, pageItems, pageIndex, totalPages, subtotal, taxAmount, balanceDue, currencySymbol, t, accentColor } = props;
    const { business, client } = invoice;
    return (
        <div className={`p-10 font-sans bg-white ${pageIndex < totalPages - 1 ? 'page-break-after' : ''}`} style={{ minHeight: '1056px', backgroundColor: props.backgroundColor, color: props.textColor }}>
            <header className="flex justify-between items-start mb-8">
                <div>
                    <h1 className="text-3xl font-bold">{business.name}</h1>
                    <p className="text-xs whitespace-pre-line">{business.address}</p>
                </div>
                <div className="text-right">
                    {business.logoUrl && <Image src={business.logoUrl} alt="Logo" width={60} height={60} className="object-contain ml-auto rounded-full"/>}
                    <h2 className="text-2xl font-bold mt-2" style={{color: accentColor}}>{(t.invoice || 'INVOICE').toUpperCase()}</h2>
                    <p className="text-xs text-gray-500">#{invoice.invoiceNumber}</p>
                </div>
            </header>
            <section className="mb-8 text-xs p-4 rounded-lg" style={{backgroundColor: `${accentColor}1A`}}>
                <div className="grid grid-cols-2 gap-4">
                    <div><p className="font-bold text-gray-500">{(t.billedTo || 'Billed To')}</p><p>{client.name}<br/>{client.address}</p></div>
                    <div className="text-right"><p className="font-bold text-gray-500">{(t.invoiceDate || 'Invoice Date')}</p><p>{safeFormat(invoice.invoiceDate, 'MMM dd, yyyy')}</p></div>
                </div>
            </section>
            <HvacDetails invoice={invoice} t={t} />
            <main className="flex-grow mt-4">
                <table className="w-full text-left text-xs">
                    <thead><tr><th className="p-2 font-bold w-1/2 border-b-2">{(t.description || 'DESCRIPTION')}</th><th className="p-2 font-bold text-center border-b-2">{(t.qty || 'QTY')}</th><th className="p-2 font-bold text-right border-b-2">{(t.price || 'PRICE')}</th><th className="p-2 font-bold text-right border-b-2">{(t.total || 'TOTAL')}</th></tr></thead>
                    <tbody>{pageItems.map(item => (<tr key={item.id}><td className="p-2 border-b">{item.name}</td><td className="p-2 border-b text-center">{item.quantity}</td><td className="p-2 border-b text-right">{currencySymbol}{item.unitPrice.toFixed(2)}</td><td className="p-2 border-b text-right">{currencySymbol}{(item.quantity * item.unitPrice).toFixed(2)}</td></tr>))}</tbody>
                </table>
            </main>
            {pageIndex === totalPages - 1 && (
            <footer className="mt-auto pt-8">
                <div className="flex justify-end">
                    <div className="w-1/3 text-xs space-y-2">
                        <p className="flex justify-between"><span>{(t.subtotal || 'Subtotal')}:</span><span>{currencySymbol}{subtotal.toFixed(2)}</span></p>
                        <p className="flex justify-between"><span>{(t.tax || 'Tax')}:</span><span>{currencySymbol}{taxAmount.toFixed(2)}</span></p>
                        <p className="flex justify-between font-bold text-sm mt-2 pt-2 border-t-2" style={{borderColor: accentColor}}><span>{(t.total || 'Total')}:</span><span style={{color: accentColor}}>{currencySymbol}{balanceDue.toFixed(2)}</span></p>
                    </div>
                </div>
            </footer>
            )}
        </div>
    );
};

// Template 5: ClimateControl
export const HVACTemplate5: React.FC<PageProps> = (props) => {
    const { invoice, pageItems, pageIndex, totalPages, subtotal, taxAmount, balanceDue, currencySymbol, t, accentColor } = props;
    const { business, client } = invoice;
    return (
        <div className={`p-10 font-sans ${pageIndex < totalPages - 1 ? 'page-break-after' : ''}`} style={{ minHeight: '1056px', backgroundColor: '#f3f4f6', color: props.textColor }}>
            <div className="bg-white p-8">
                <header className="flex justify-between items-center mb-8">
                    <div>
                        <h1 className="text-2xl font-bold">{business.name}</h1>
                        <p className="text-xs text-gray-500">{business.address}</p>
                    </div>
                    {business.logoUrl && <Image src={business.logoUrl} alt="Logo" width={50} height={50} className="object-contain"/>}
                </header>
                <div className="w-full h-1" style={{backgroundColor: accentColor}}></div>
                <section className="grid grid-cols-2 gap-8 text-xs my-8">
                    <div><p className="font-bold text-gray-500 mb-1">{(t.billTo || 'BILL TO')}</p><p>{client.name}<br/>{client.address}</p></div>
                    <div className="text-right"><p className="font-bold text-gray-500 mb-1">{(t.invoiceNo || 'INVOICE #')}</p><p>{invoice.invoiceNumber}</p><p className="font-bold text-gray-500 mb-1 mt-2">{(t.date || 'DATE')}</p><p>{safeFormat(invoice.invoiceDate, 'yyyy-MM-dd')}</p></div>
                </section>
                <HvacDetails invoice={invoice} t={t} />
                <main className="flex-grow mt-4">
                    <table className="w-full text-left text-xs">
                        <thead><tr className="bg-gray-100"><th className="p-2 font-bold w-1/2">{(t.item || 'ITEM').toUpperCase()}</th><th className="p-2 font-bold text-center">{(t.quantity || 'QUANTITY').toUpperCase()}</th><th className="p-2 font-bold text-right">{(t.price || 'PRICE').toUpperCase()}</th><th className="p-2 font-bold text-right">{(t.amount || 'AMOUNT').toUpperCase()}</th></tr></thead>
                        <tbody>{pageItems.map(item => (<tr key={item.id} className="border-b"><td className="p-2">{item.name}</td><td className="p-2 text-center">{item.quantity}</td><td className="p-2 text-right">{currencySymbol}{item.unitPrice.toFixed(2)}</td><td className="p-2 text-right">{currencySymbol}{(item.quantity * item.unitPrice).toFixed(2)}</td></tr>))}</tbody>
                    </table>
                </main>
                {pageIndex === totalPages - 1 && (
                <footer className="mt-auto pt-8">
                    <div className="flex justify-end">
                        <div className="w-1/3 text-xs space-y-1">
                            <p className="flex justify-between"><span>{(t.subtotal || 'Subtotal')}:</span><span>{currencySymbol}{subtotal.toFixed(2)}</span></p>
                            <p className="flex justify-between"><span>{(t.tax || 'Tax')}:</span><span>{currencySymbol}{taxAmount.toFixed(2)}</span></p>
                            <p className="flex justify-between font-bold text-sm mt-2 pt-2 border-t"><span>{(t.total || 'Total')}:</span><span>{currencySymbol}{balanceDue.toFixed(2)}</span></p>
                        </div>
                    </div>
                </footer>
                )}
            </div>
        </div>
    );
};

export const HVACTemplate6: React.FC<PageProps> = (props) => <HVACTemplate1 {...props} />;
export const HVACTemplate7: React.FC<PageProps> = (props) => <HVACTemplate2 {...props} />;
export const HVACTemplate8: React.FC<PageProps> = (props) => <HVACTemplate3 {...props} />;
export const HVACTemplate9: React.FC<PageProps> = (props) => <HVACTemplate4 {...props} />;
export const HVACTemplate10: React.FC<PageProps> = (props) => <HVACTemplate5 {...props} />;

    