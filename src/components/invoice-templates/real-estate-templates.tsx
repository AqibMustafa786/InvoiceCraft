
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

const RealEstateDetails: React.FC<{ invoice: Invoice, t: any }> = ({ invoice, t }) => {
    if (!invoice.realEstate) return null;
    const { realEstate } = invoice;
    return (
        <section className="my-4 text-xs">
            <p className="font-bold text-gray-500 mb-2 border-b">{t.propertyDetails || 'Property Details'}</p>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-x-4 gap-y-1">
                <p><span className="font-semibold text-gray-600">{t.property || 'Property'}:</span> {realEstate.propertyAddress}</p>
                <p><span className="font-semibold text-gray-600">{t.unit || 'Unit'}:</span> {realEstate.unitNumber}</p>
                <p><span className="font-semibold text-gray-600">{t.leaseTerm || 'Lease Term'}:</span> {realEstate.leaseTerm}</p>
                <p><span className="font-semibold text-gray-600">{t.tenant || 'Tenant'}:</span> {realEstate.tenantName}</p>
                {realEstate.monthlyRent && <p><span className="font-semibold text-gray-600">{t.rent || 'Rent'}:</span> ${realEstate.monthlyRent.toFixed(2)}</p>}
                {realEstate.cleaningFee && <p><span className="font-semibold text-gray-600">{t.cleaningFee || 'Cleaning'}:</span> ${realEstate.cleaningFee.toFixed(2)}</p>}
                {realEstate.maintenanceFee && <p><span className="font-semibold text-gray-600">{t.maintenance || 'Maintenance'}:</span> ${realEstate.maintenanceFee.toFixed(2)}</p>}
                {realEstate.lateFee && <p><span className="font-semibold text-gray-600">{t.lateFee || 'Late Fee'}:</span> ${realEstate.lateFee.toFixed(2)}</p>}
                {realEstate.hoaCharges && <p><span className="font-semibold text-gray-600">{t.hoa || 'HOA'}:</span> ${realEstate.hoaCharges.toFixed(2)}</p>}
                {realEstate.utilityCharges && <p><span className="font-semibold text-gray-600">{t.utilities || 'Utilities'}:</span> ${realEstate.utilityCharges.toFixed(2)}</p>}
            </div>
        </section>
    );
};

export const RealEstateTemplate1: React.FC<PageProps> = (props) => {
    const { invoice, pageItems, pageIndex, totalPages, balanceDue, currencySymbol, t, accentColor, total } = props;
    const { business, client } = invoice;
    const docTitle = (t.invoice || 'INVOICE').toUpperCase();

    return (
        <div className={`p-10 font-sans ${pageIndex < totalPages - 1 ? 'page-break-after' : ''}`} style={{ minHeight: '1056px', backgroundColor: props.backgroundColor, color: props.textColor }}>
            <header className="flex justify-between items-start mb-8">
                <div>
                    {business.logoUrl && <Image src={business.logoUrl} alt="Logo" width={150} height={75} className="object-contain" />}
                    <h1 className="text-xl font-bold mt-2">{business.name}</h1>
                    <p className="text-xs">{business.address}</p>
                </div>
                <div className="text-right">
                    <h2 className="text-4xl font-bold">{docTitle}</h2>
                    <p className="text-sm mt-1">#{invoice.invoiceNumber}</p>
                </div>
            </header>
            <section className="grid grid-cols-2 gap-8 text-xs mb-8">
                <div>
                    <p className="font-bold text-gray-500 mb-1">{t.tenantInfo || 'Tenant Information'}</p>
                    <p>{client.name}</p>
                    <p>{client.address}</p>
                </div>
                <div className="text-right">
                    <p className="font-bold text-gray-500">{t.date || 'Date'}: {safeFormat(invoice.invoiceDate, 'yyyy-MM-dd')}</p>
                    <p className="font-bold text-gray-500">{t.dueDate || 'Due Date'}: {safeFormat(invoice.dueDate, 'yyyy-MM-dd')}</p>
                </div>
            </section>
            <RealEstateDetails invoice={invoice} t={t} />
            <main className="flex-grow mt-4">
                <table className="w-full text-left text-sm">
                    <thead style={{backgroundColor: accentColor, color: 'white'}}>
                        <tr className="rounded-lg">
                            <th className="p-2 font-bold w-3/5">{t.charges || 'Charges'}</th>
                            <th className="p-2 font-bold text-right">{t.amount || 'Amount'}</th>
                        </tr>
                    </thead>
                    <tbody>
                        {pageItems.map(item => (
                            <tr key={item.id} className="border-b">
                                <td className="p-2">{item.name}</td>
                                <td className="p-2 text-right">{currencySymbol}{(item.quantity * item.unitPrice).toFixed(2)}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </main>
            {pageIndex === totalPages - 1 && (
            <footer className="mt-auto pt-8">
                <div className="flex justify-end text-right text-sm">
                    <div className="w-1/2">
                        <p className="flex justify-between py-1"><span className="text-gray-600">{t.totalCharges || 'Total Charges'}:</span><span>{currencySymbol}{total.toFixed(2)}</span></p>
                        <p className="flex justify-between py-1"><span className="text-gray-600">{t.amountPaid || 'Amount Paid'}:</span><span>- {currencySymbol}{(invoice.amountPaid || 0).toFixed(2)}</span></p>
                        <p className="flex justify-between font-bold text-xl mt-2 pt-2 border-t-2">
                            <span>{t.balanceDue || 'Balance Due'}:</span>
                            <span>{currencySymbol}{balanceDue.toFixed(2)}</span>
                        </p>
                    </div>
                </div>
            </footer>
            )}
        </div>
    );
}

export const RealEstateTemplate2: React.FC<PageProps> = (props) => {
    const { invoice, pageItems, pageIndex, totalPages, subtotal, taxAmount, balanceDue, currencySymbol, t, accentColor } = props;
    const { business, client } = invoice;
    const docTitle = (t.invoice || 'Invoice').toUpperCase();
    return (
      <div className={`p-10 bg-gray-50 font-sans ${pageIndex < totalPages - 1 ? 'page-break-after' : ''}`} style={{ minHeight: '1056px', backgroundColor: props.backgroundColor, color: props.textColor }}>
        <header className="flex justify-between items-center mb-8 pb-4 border-b-2">
            <h1 className="text-2xl font-bold">{business.name}</h1>
            <h2 className="text-2xl font-light text-gray-500">{docTitle}</h2>
        </header>
        <section className="grid grid-cols-2 gap-8 text-sm mb-8">
            <div><p><strong>To:</strong> {client.name}</p><p>{client.address}</p></div>
            <div className="text-right"><p><strong>#:</strong> {invoice.invoiceNumber}</p><p><strong>Date:</strong> {safeFormat(invoice.invoiceDate, 'MMM dd, yyyy')}</p></div>
        </section>
        <RealEstateDetails invoice={invoice} t={t} />
        <main className="flex-grow mt-4">
            <table className="w-full text-left text-sm">
                <thead><tr className="bg-gray-200"><th className="p-2 w-4/5 font-bold">DESCRIPTION</th><th className="p-2 font-bold text-right">TOTAL</th></tr></thead>
                <tbody>{pageItems.map(item => (<tr key={item.id} className="border-b"><td className="p-2">{item.name}</td><td className="p-2 text-right">{currencySymbol}{(item.quantity * item.unitPrice).toFixed(2)}</td></tr>))}</tbody>
            </table>
        </main>
        {pageIndex === totalPages - 1 && (
        <footer className="mt-auto pt-8">
            <div className="flex justify-end text-sm">
                <div className="w-1/3">
                    <p className="flex justify-between"><span>Subtotal</span><span>{currencySymbol}{subtotal.toFixed(2)}</span></p>
                    <p className="flex justify-between border-b pb-1"><span>Tax</span><span>{currencySymbol}{taxAmount.toFixed(2)}</span></p>
                    <p className="flex justify-between font-bold mt-2"><span>Total</span><span>{currencySymbol}{balanceDue.toFixed(2)}</span></p>
                </div>
            </div>
        </footer>
        )}
      </div>
    );
};
export const RealEstateTemplate3: React.FC<PageProps> = (props) => {
    const { invoice, pageItems, pageIndex, totalPages, subtotal, taxAmount, balanceDue, currencySymbol, t, accentColor } = props;
    const { business, client } = invoice;
    const docTitle = (t.invoice || 'Invoice');
    return (
      <div className={`p-10 font-serif bg-white ${pageIndex < totalPages - 1 ? 'page-break-after' : ''}`} style={{ minHeight: '1056px', backgroundColor: props.backgroundColor, color: props.textColor }}>
        <header className="text-center mb-10">
            <h1 className="text-4xl font-bold">{business.name}</h1>
            <p className="text-sm">Real Estate & Property Management</p>
        </header>
        <div className="w-full h-px bg-gray-300 mb-8"></div>
        <section className="grid grid-cols-2 gap-8 mb-8 text-sm">
            <div><p><strong>Billed For:</strong> {client.name}</p></div>
            <div className="text-right"><p><strong>{docTitle} #:</strong> {invoice.invoiceNumber}</p><p><strong>Date:</strong> {safeFormat(invoice.invoiceDate, 'MMMM d, yyyy')}</p></div>
        </section>
        <RealEstateDetails invoice={invoice} t={t} />
        <main className="flex-grow mt-4">
            <table className="w-full text-left text-sm">
                <thead><tr className="border-b-2 border-t-2"><th className="py-2 w-3/5">Professional Services Rendered</th><th className="py-2 text-right">Amount</th></tr></thead>
                <tbody>{pageItems.map(item => (<tr key={item.id} className="border-b"><td className="py-2">{item.name}</td><td className="py-2 text-right">{currencySymbol}{(item.quantity * item.unitPrice).toFixed(2)}</td></tr>))}</tbody>
            </table>
        </main>
        {pageIndex === totalPages - 1 && (
        <footer className="mt-auto pt-8">
            <div className="flex justify-end text-sm">
                <div className="w-1/3">
                    <p className="flex justify-between py-1"><span>Total:</span><span>{currencySymbol}{subtotal.toFixed(2)}</span></p>
                    <p className="flex justify-between font-bold text-xl mt-2 pt-2 border-t-2"><span>Balance Due:</span><span>{currencySymbol}{balanceDue.toFixed(2)}</span></p>
                </div>
            </div>
        </footer>
        )}
      </div>
    );
};
export const RealEstateTemplate4: React.FC<PageProps> = (props) => {
    const { invoice, pageItems, pageIndex, totalPages, balanceDue, currencySymbol, t, accentColor } = props;
    const { business, client } = invoice;
    return (
        <div className={`flex ${pageIndex < totalPages - 1 ? 'page-break-after' : ''}`} style={{ minHeight: '1056px', backgroundColor: props.backgroundColor, color: props.textColor }}>
            <div className="w-1/4 p-8 text-white" style={{backgroundColor: accentColor || '#047857'}}>
                <h1 className="text-3xl font-bold">INVOICE</h1>
                <div className="mt-10 text-xs space-y-4">
                    <div><p className="opacity-70">DATE</p><p>{safeFormat(invoice.invoiceDate, 'yyyy-MM-dd')}</p></div>
                    <div><p className="opacity-70">INVOICE #</p><p>{invoice.invoiceNumber}</p></div>
                </div>
            </div>
            <div className="w-3/4 p-10">
                <header className="text-right mb-10"><h2 className="text-2xl font-bold">{business.name}</h2><p className="text-xs">{business.address}</p></header>
                <section className="mb-10 text-sm"><p><strong>To:</strong> {client.name}</p></section>
                <RealEstateDetails invoice={invoice} t={t} />
                <main className="flex-grow mt-4">
                    <table className="w-full text-left text-sm">
                        <thead><tr className="bg-gray-100"><th className="p-2 font-bold w-4/5">Description</th><th className="p-2 font-bold text-right">Total</th></tr></thead>
                        <tbody>{pageItems.map(item => (<tr key={item.id} className="border-b"><td className="p-2">{item.name}</td><td className="p-2 text-right">{currencySymbol}{(item.quantity * item.unitPrice).toFixed(2)}</td></tr>))}</tbody>
                    </table>
                </main>
                {pageIndex === totalPages - 1 && (
                <footer className="mt-auto pt-8">
                    <div className="text-right text-2xl font-bold">Total Due: {currencySymbol}{balanceDue.toFixed(2)}</div>
                </footer>
                )}
            </div>
        </div>
    );
};
export const RealEstateTemplate5: React.FC<PageProps> = (props) => {
    const { invoice, pageItems, pageIndex, totalPages, subtotal, taxAmount, balanceDue, currencySymbol, t } = props;
    const { business, client } = invoice;
    return (
        <div className={`p-10 font-serif ${pageIndex < totalPages - 1 ? 'page-break-after' : ''}`} style={{ minHeight: '1056px', backgroundColor: '#FDFBF7', color: '#5A4A42' }}>
            <header className="text-center mb-10">
                <h1 className="text-2xl font-bold">{business.name}</h1>
                <p className="text-xs">{business.address}</p>
            </header>
            <h2 className="text-center text-xl mb-8">INVOICE</h2>
            <section className="grid grid-cols-2 gap-4 text-xs mb-8">
                <div><p><strong>TO:</strong> {client.name}</p></div>
                <div className="text-right"><p><strong>DATE:</strong> {safeFormat(invoice.invoiceDate, 'MM/dd/yyyy')}</p><p><strong>INVOICE #:</strong> {invoice.invoiceNumber}</p></div>
            </section>
            <RealEstateDetails invoice={invoice} t={t} />
            <main className="flex-grow mt-4">
                <table className="w-full text-left text-xs">
                    <thead><tr><th className="py-2 border-b-2 w-3/4">DESCRIPTION</th><th className="py-2 border-b-2 text-right">AMOUNT</th></tr></thead>
                    <tbody>{pageItems.map(item => (<tr key={item.id}><td className="py-2 border-b">{item.name}</td><td className="py-2 border-b text-right">{currencySymbol}{(item.quantity * item.unitPrice).toFixed(2)}</td></tr>))}</tbody>
                </table>
            </main>
            {pageIndex === totalPages - 1 && (
            <footer className="mt-auto pt-8">
                <div className="flex justify-end text-sm">
                    <div className="w-1/3">
                        <p className="flex justify-between"><span>Subtotal</span><span>{currencySymbol}{subtotal.toFixed(2)}</span></p>
                        <p className="flex justify-between"><span>Tax</span><span>{currencySymbol}{taxAmount.toFixed(2)}</span></p>
                        <p className="flex justify-between font-bold mt-2 pt-2 border-t"><span>TOTAL</span><span>{currencySymbol}{balanceDue.toFixed(2)}</span></p>
                    </div>
                </div>
            </footer>
            )}
        </div>
    );
};
