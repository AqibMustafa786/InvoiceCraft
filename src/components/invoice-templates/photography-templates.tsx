
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

const PhotographyDetails: React.FC<{ invoice: Invoice, t: any }> = ({ invoice, t }) => {
    if (!invoice.photography) return null;
    const { photography } = invoice;
    return (
        <section className="my-4 text-xs">
            <p className="font-bold text-gray-500 mb-2 border-b">{(t.sessionDetails || 'Session Details')}</p>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-x-4 gap-y-1">
                <p><span className="font-semibold text-gray-600">{(t.eventType || 'Event')}:</span> {photography.eventType}</p>
                <p><span className="font-semibold text-gray-600">{(t.shootDate || 'Date')}:</span> {safeFormat(photography.shootDate, 'MM/dd/yyyy')}</p>
                {photography.hoursOfCoverage && <p><span className="font-semibold text-gray-600">{(t.coverage || 'Coverage')}:</span> {photography.hoursOfCoverage} hrs</p>}
                <p><span className="font-semibold text-gray-600">{(t.package || 'Package')}:</span> {photography.packageSelected}</p>
                {photography.editedPhotosCount && <p><span className="font-semibold text-gray-600">{(t.editedPhotos || 'Edits')}:</span> {photography.editedPhotosCount}</p>}
                {photography.rawFilesCost && <p><span className="font-semibold text-gray-600">{(t.rawFiles || 'RAWs')}:</span> ${photography.rawFilesCost.toFixed(2)}</p>}
                {photography.travelFee && <p><span className="font-semibold text-gray-600">{(t.travelFee || 'Travel')}:</span> ${photography.travelFee.toFixed(2)}</p>}
                {photography.equipmentRentalFee && <p><span className="font-semibold text-gray-600">{(t.equipmentFee || 'Gear')}:</span> ${photography.equipmentRentalFee.toFixed(2)}</p>}
            </div>
        </section>
    );
};

export const PhotographyTemplate1: React.FC<PageProps> = (props) => {
    const { invoice, pageItems, pageIndex, totalPages, balanceDue, currencySymbol, t, accentColor } = props;
    const { business, client } = invoice;

    return (
        <div className={`p-10 font-sans ${pageIndex < totalPages - 1 ? 'page-break-after' : ''}`} style={{ minHeight: '1056px', backgroundColor: props.backgroundColor, color: props.textColor }}>
            <header className="flex justify-between items-start mb-8 text-center">
                <div className="text-left w-1/3">
                    <h1 className="text-2xl font-bold">{business.name}</h1>
                    <p className="text-xs">{business.address}</p>
                </div>
                <h2 className="text-4xl font-thin tracking-[0.3em] w-1/3">{(t.invoice || 'INVOICE').toUpperCase()}</h2>
                <div className="text-right w-1/3 text-xs">
                    <p>#{invoice.invoiceNumber}</p>
                    <p>{safeFormat(invoice.invoiceDate, 'yyyy.MM.dd')}</p>
                </div>
            </header>
            <section className="text-center text-xs mb-8"><p>{t.forProfessionalPhotographyServices || 'For Professional Photography Services'}</p></section>
            <section className="text-center mb-8"><p className="text-sm">{(t.client || 'CLIENT')}: {client.name}</p></section>
            <PhotographyDetails invoice={invoice} t={t} />
            <main className="flex-grow mt-4">
                <table className="w-full text-left text-xs">
                    <thead><tr className="border-y"><th className="py-2 w-3/5">{(t.description || 'Description')}</th><th className="py-2 text-right">{(t.amount || 'Amount')}</th></tr></thead>
                    <tbody>{pageItems.map(item => (<tr key={item.id} className="border-b"><td className="py-2">{item.name}</td><td className="py-2 text-right">{currencySymbol}{(item.quantity * item.unitPrice).toFixed(2)}</td></tr>))}</tbody>
                </table>
            </main>
            {pageIndex === totalPages - 1 && (
            <footer className="mt-auto pt-8">
                <div className="flex justify-end text-right text-sm">
                    <div className="w-2/5">
                        <p className="flex justify-between py-1"><span className="text-gray-600">{(t.total || 'Total')}:</span><span>{currencySymbol}{props.total.toFixed(2)}</span></p>
                        <p className="flex justify-between py-1"><span className="text-gray-600">{(t.amountPaid || 'Amount Paid')}:</span><span>- {currencySymbol}{(invoice.amountPaid || 0).toFixed(2)}</span></p>
                        <p className="flex justify-between font-bold text-lg mt-2 pt-2 border-t-2 border-black"><span>{(t.balanceDue || 'Balance Due')}:</span><span>{currencySymbol}{balanceDue.toFixed(2)}</span></p>
                    </div>
                </div>
            </footer>
            )}
        </div>
    );
}

export const PhotographyTemplate2: React.FC<PageProps> = (props) => <PhotographyTemplate1 {...props} />;
export const PhotographyTemplate3: React.FC<PageProps> = (props) => <PhotographyTemplate1 {...props} />;
export const PhotographyTemplate4: React.FC<PageProps> = (props) => <PhotographyTemplate1 {...props} />;
export const PhotographyTemplate5: React.FC<PageProps> = (props) => <PhotographyTemplate1 {...props} />;
