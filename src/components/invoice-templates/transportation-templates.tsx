
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

const TransportationDetails: React.FC<{ invoice: Invoice, t: any }> = ({ invoice, t }) => {
    if (!invoice.transportation) return null;
    const { transportation } = invoice;
    return (
        <section className="my-4 text-xs">
            <p className="font-bold text-gray-500 mb-2 border-b">{t.shipmentDetails || 'Shipment Details'}</p>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-x-4 gap-y-1">
                <p><span className="font-semibold text-gray-600">{t.pickup || 'Pickup'}:</span> {transportation.pickupLocation}</p>
                <p><span className="font-semibold text-gray-600">{t.dropoff || 'Dropoff'}:</span> {transportation.dropoffLocation}</p>
                {transportation.milesDriven && <p><span className="font-semibold text-gray-600">{t.miles || 'Miles'}:</span> {transportation.milesDriven}</p>}
                {transportation.ratePerMile && <p><span className="font-semibold text-gray-600">{t.ratePerMile || 'Rate/Mile'}:</span> ${transportation.ratePerMile.toFixed(2)}</p>}
                {transportation.weight && <p><span className="font-semibold text-gray-600">{t.weight || 'Weight'}:</span> {transportation.weight}</p>}
                <p><span className="font-semibold text-gray-600">{t.loadType || 'Load Type'}:</span> {transportation.loadType}</p>
                {transportation.fuelSurcharge && <p><span className="font-semibold text-gray-600">{t.fuelSurcharge || 'Fuel Surcharge'}:</span> ${transportation.fuelSurcharge.toFixed(2)}</p>}
                {transportation.tollCharges && <p><span className="font-semibold text-gray-600">{t.tolls || 'Tolls'}:</span> ${transportation.tollCharges.toFixed(2)}</p>}
                {transportation.detentionFee && <p><span className="font-semibold text-gray-600">{t.detention || 'Detention'}:</span> ${transportation.detentionFee.toFixed(2)}</p>}
            </div>
        </section>
    );
};

export const TransportationTemplate1: React.FC<PageProps> = (props) => {
    const { invoice, pageItems, pageIndex, totalPages, balanceDue, currencySymbol, t, accentColor } = props;
    const { business, client } = invoice;

    return (
        <div className={`p-8 font-sans ${pageIndex < totalPages - 1 ? 'page-break-after' : ''}`} style={{ minHeight: '1056px', backgroundColor: props.backgroundColor, color: props.textColor }}>
            <header className="flex justify-between items-start mb-8">
                <div>
                    <h1 className="text-3xl font-bold">{business.name}</h1>
                </div>
                <h2 className="text-4xl font-bold text-gray-400">{(t.invoice || 'INVOICE').toUpperCase()}</h2>
            </header>
            <section className="grid grid-cols-3 gap-4 text-xs mb-8">
                <div className="p-2 bg-gray-100"><p className="font-bold">{(t.invoiceTo || 'Invoice To')}:</p><p>{client.name}</p><p>{client.address}</p></div>
                <div className="p-2 bg-gray-100"><p className="font-bold">{(t.shipTo || 'Ship To')}:</p><p>{client.shippingAddress || client.address}</p></div>
                <div className="p-2 bg-gray-100 text-right"><p><strong>#:</strong> {invoice.invoiceNumber}</p><p><strong>{(t.date || 'Date')}:</strong> {safeFormat(invoice.invoiceDate, 'yyyy-MM-dd')}</p></div>
            </section>
            <TransportationDetails invoice={invoice} t={t} />
            <main className="flex-grow mt-4">
                <table className="w-full text-left text-sm">
                    <thead><tr style={{backgroundColor: accentColor, color: 'white'}}><th className="p-2 font-bold w-3/5">{(t.description || 'Description')}</th><th className="p-2 font-bold text-right">{(t.amount || 'Amount')}</th></tr></thead>
                    <tbody>{pageItems.map(item => (<tr key={item.id} className="border-b"><td className="p-2">{item.name}</td><td className="p-2 text-right">{currencySymbol}{(item.quantity * item.unitPrice).toFixed(2)}</td></tr>))}</tbody>
                </table>
            </main>
            {pageIndex === totalPages - 1 && (
            <footer className="mt-auto pt-8">
                <div className="flex justify-end text-right text-sm">
                    <div className="w-1/2">
                        <p className="flex justify-between font-bold text-2xl mt-2 pt-2 border-t-2"><span>{(t.total || 'TOTAL')}:</span><span>{currencySymbol}{balanceDue.toFixed(2)}</span></p>
                    </div>
                </div>
            </footer>
            )}
        </div>
    );
}

export const TransportationTemplate2: React.FC<PageProps> = (props) => {
    const { invoice, pageItems, pageIndex, totalPages, subtotal, taxAmount, balanceDue, currencySymbol, t, accentColor } = props;
    const { business, client } = invoice;
    const docTitle = (t.invoice || 'INVOICE').toUpperCase();

    return (
        <div className={`p-10 bg-white font-sans ${pageIndex < totalPages - 1 ? 'page-break-after' : ''}`} style={{ minHeight: '1056px', backgroundColor: props.backgroundColor, color: props.textColor }}>
            <header className="flex justify-between items-center mb-8 pb-4 border-b-2" style={{ borderColor: accentColor }}>
                <div>
                    {business.logoUrl && <Image src={business.logoUrl} alt="Logo" width={120} height={40} className="object-contain" />}
                    <h1 className="text-2xl font-bold mt-2">{business.name}</h1>
                </div>
                <h2 className="text-3xl font-bold text-gray-400">{docTitle}</h2>
            </header>
            <section className="grid grid-cols-2 gap-8 text-xs mb-8">
                <div><p className="font-bold">Bill To:</p><p>{client.name}<br/>{client.address}</p></div>
                <div className="text-right"><p><strong>#:</strong> {invoice.invoiceNumber}</p><p><strong>Date:</strong> {safeFormat(invoice.invoiceDate, 'MMM dd, yyyy')}</p></div>
            </section>
            <TransportationDetails invoice={invoice} t={t} />
            <main className="flex-grow mt-4">
                <table className="w-full text-left text-sm">
                    <thead className="bg-gray-100">
                        <tr>
                            <th className="p-2 w-4/5 font-bold">DESCRIPTION</th>
                            <th className="p-2 font-bold text-right">TOTAL</th>
                        </tr>
                    </thead>
                    <tbody>
                        {pageItems.map(item => (
                            <tr key={item.id} className="border-b"><td className="p-2">{item.name}</td><td className="p-2 text-right">{currencySymbol}{(item.quantity * item.unitPrice).toFixed(2)}</td></tr>
                        ))}
                    </tbody>
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
export const TransportationTemplate3: React.FC<PageProps> = (props) => {
    const { invoice, pageItems, pageIndex, totalPages, subtotal, taxAmount, balanceDue, currencySymbol, t, accentColor } = props;
    const { business, client } = invoice;
    const docTitle = (t.invoice || 'INVOICE').toUpperCase();

    return (
        <div className={`font-sans ${pageIndex < totalPages - 1 ? 'page-break-after' : ''}`} style={{ minHeight: '1056px', backgroundColor: props.backgroundColor, color: props.textColor }}>
            <div className="p-10">
                <header className="flex justify-between items-start mb-10">
                    <h1 className="text-4xl font-black tracking-tighter">{business.name}</h1>
                    <div className="text-right">
                        <h2 className="text-xl font-bold">{docTitle}</h2>
                        <p className="text-xs text-gray-500">#{invoice.invoiceNumber}</p>
                    </div>
                </header>
                <section className="grid grid-cols-3 gap-4 text-xs mb-8">
                    <div><p className="font-bold text-gray-500">From:</p><p>{business.address}</p></div>
                    <div><p className="font-bold text-gray-500">To:</p><p>{client.name}, {client.address}</p></div>
                    <div className="text-right"><p className="font-bold text-gray-500">Date:</p><p>{safeFormat(invoice.invoiceDate, 'yyyy-MM-dd')}</p></div>
                </section>
                <TransportationDetails invoice={invoice} t={t} />
                <main className="flex-grow mt-4">
                    <table className="w-full text-left text-xs">
                        <thead><tr className="border-b"><th className="pb-2 font-bold w-4/5">Shipment</th><th className="pb-2 font-bold text-right">Cost</th></tr></thead>
                        <tbody>{pageItems.map(item => (<tr key={item.id} className="border-b"><td className="py-2">{item.name}</td><td className="py-2 text-right">{currencySymbol}{(item.quantity * item.unitPrice).toFixed(2)}</td></tr>))}</tbody>
                    </table>
                </main>
                {pageIndex === totalPages - 1 && (
                <footer className="mt-auto pt-8">
                    <div className="flex justify-end">
                        <div className="w-1/3 text-sm">
                            <p className="flex justify-between"><span>Total Cost:</span><span>{currencySymbol}{subtotal.toFixed(2)}</span></p>
                            <p className="flex justify-between font-bold text-xl mt-2 pt-2 border-t-2" style={{borderColor: accentColor}}><span>Amount Due:</span><span>{currencySymbol}{balanceDue.toFixed(2)}</span></p>
                        </div>
                    </div>
                </footer>
                )}
            </div>
        </div>
    );
};
export const TransportationTemplate4: React.FC<PageProps> = (props) => {
    const { invoice, pageItems, pageIndex, totalPages, subtotal, taxAmount, balanceDue, currencySymbol, t, accentColor } = props;
    const { business, client } = invoice;
    const docTitle = (t.invoice || 'INVOICE').toUpperCase();
    
    return (
        <div className={`p-10 font-sans text-white ${pageIndex < totalPages - 1 ? 'page-break-after' : ''}`} style={{ minHeight: '1056px', backgroundColor: '#333' }}>
            <header className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-bold">{business.name}</h1>
                <div className="text-right"><p className="text-lg">#{invoice.invoiceNumber}</p><p className="text-xs">{safeFormat(invoice.invoiceDate, 'MMM dd, yyyy')}</p></div>
            </header>
            <section className="mb-8">
                <h2 className="text-2xl font-semibold mb-2" style={{color: accentColor}}>{docTitle}</h2>
                <p className="text-sm">For: {client.name}</p>
            </section>
            <TransportationDetails invoice={invoice} t={t} />
            <main className="flex-grow mt-4">
                <table className="w-full text-left text-sm">
                    <thead><tr className="border-b border-gray-600"><th className="py-2 font-bold w-4/5">Description</th><th className="py-2 font-bold text-right">Amount</th></tr></thead>
                    <tbody>{pageItems.map(item => (<tr key={item.id} className="border-b border-gray-700"><td className="py-2">{item.name}</td><td className="py-2 text-right">{currencySymbol}{(item.quantity * item.unitPrice).toFixed(2)}</td></tr>))}</tbody>
                </table>
            </main>
            {pageIndex === totalPages - 1 && (
            <footer className="mt-auto pt-8">
                <div className="flex justify-end text-sm">
                    <div className="w-1/3">
                        <p className="flex justify-between"><span>Subtotal:</span><span>{currencySymbol}{subtotal.toFixed(2)}</span></p>
                        <p className="flex justify-between"><span>Tax:</span><span>{currencySymbol}{taxAmount.toFixed(2)}</span></p>
                        <p className="flex justify-between font-bold mt-2 pt-2 border-t border-gray-500"><span>Total:</span><span>{currencySymbol}{balanceDue.toFixed(2)}</span></p>
                    </div>
                </div>
            </footer>
            )}
        </div>
    );
};
export const TransportationTemplate5: React.FC<PageProps> = (props) => {
    const { invoice, pageItems, pageIndex, totalPages, balanceDue, currencySymbol, t } = props;
    const { business, client } = invoice;
    const docTitle = (t.invoice || 'INVOICE').toUpperCase();

    return (
        <div className={`p-12 font-serif text-gray-800 ${pageIndex < totalPages - 1 ? 'page-break-after' : ''}`} style={{ minHeight: '1056px', backgroundColor: props.backgroundColor, color: props.textColor }}>
            <header className="text-center mb-10">
                <h1 className="text-3xl font-bold">{business.name}</h1>
                <p className="text-xs">{business.address} | {business.phone}</p>
            </header>
            <h2 className="text-2xl font-bold text-center mb-8">{docTitle}</h2>
            <section className="text-xs mb-8">
                <p><strong>To:</strong> {client.name}</p>
                <p><strong>Invoice No:</strong> {invoice.invoiceNumber}</p>
                <p><strong>Date:</strong> {safeFormat(invoice.invoiceDate, 'MM/dd/yyyy')}</p>
            </section>
            <TransportationDetails invoice={invoice} t={t} />
            <main className="flex-grow mt-4">
                <table className="w-full text-left text-xs">
                    <thead><tr className="bg-gray-100"><th className="p-2 font-bold w-4/5">Description</th><th className="p-2 font-bold text-right">Amount</th></tr></thead>
                    <tbody>{pageItems.map(item => (<tr key={item.id} className="border-b"><td className="p-2">{item.name}</td><td className="p-2 text-right">{currencySymbol}{(item.quantity * item.unitPrice).toFixed(2)}</td></tr>))}</tbody>
                </table>
            </main>
            {pageIndex === totalPages - 1 && (
            <footer className="mt-auto pt-8">
                <div className="flex justify-end text-lg font-bold">
                    <p>Total Due: {currencySymbol}{balanceDue.toFixed(2)}</p>
                </div>
            </footer>
            )}
        </div>
    );
};
