
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
            <p className="font-bold text-gray-500 mb-2 border-b">{(t.shipmentDetails || 'Shipment Details')}</p>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-x-4 gap-y-1">
                <p><span className="font-semibold text-gray-600">{(t.pickup || 'Pickup')}:</span> {transportation.pickupLocation}</p>
                <p><span className="font-semibold text-gray-600">{(t.dropoff || 'Dropoff')}:</span> {transportation.dropoffLocation}</p>
                {transportation.milesDriven && <p><span className="font-semibold text-gray-600">{(t.miles || 'Miles')}:</span> {transportation.milesDriven}</p>}
                {transportation.ratePerMile && <p><span className="font-semibold text-gray-600">{(t.ratePerMile || 'Rate/Mile')}:</span> ${transportation.ratePerMile.toFixed(2)}</p>}
                {transportation.weight && <p><span className="font-semibold text-gray-600">{(t.weight || 'Weight')}:</span> {transportation.weight}</p>}
                <p><span className="font-semibold text-gray-600">{(t.loadType || 'Load Type')}:</span> {transportation.loadType}</p>
                {transportation.fuelSurcharge && <p><span className="font-semibold text-gray-600">{(t.fuelSurcharge || 'Fuel Surcharge')}:</span> ${transportation.fuelSurcharge.toFixed(2)}</p>}
                {transportation.tollCharges && <p><span className="font-semibold text-gray-600">{(t.tolls || 'Tolls')}:</span> ${transportation.tollCharges.toFixed(2)}</p>}
                {transportation.detentionFee && <p><span className="font-semibold text-gray-600">{(t.detention || 'Detention')}:</span> ${transportation.detentionFee.toFixed(2)}</p>}
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
                    <p className="text-xs">{(t.logisticsAndTransportation || 'Logistics & Transportation')}</p>
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

export const TransportationTemplate2: React.FC<PageProps> = (props) => <TransportationTemplate1 {...props} />;
export const TransportationTemplate3: React.FC<PageProps> = (props) => <TransportationTemplate1 {...props} />;
export const TransportationTemplate4: React.FC<PageProps> = (props) => <TransportationTemplate1 {...props} />;
export const TransportationTemplate5: React.FC<PageProps> = (props) => <TransportationTemplate1 {...props} />;
