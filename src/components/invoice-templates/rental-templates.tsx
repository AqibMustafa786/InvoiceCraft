
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

const RentalDetails: React.FC<{ invoice: Invoice, t: any }> = ({ invoice, t }) => {
    if (!invoice.rental) return null;
    const { rental } = invoice;
    return (
        <section className="my-4 text-xs">
            <p className="font-bold text-gray-500 mb-2 border-b">{t.rentalDetails || 'Rental Details'}</p>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-x-4 gap-y-1">
                <p className="col-span-full"><span className="font-semibold text-gray-600">{t.itemRented || 'Item'}:</span> {rental.rentalItemName}</p>
                <p><span className="font-semibold text-gray-600">{t.rentalStart || 'Start'}:</span> {safeFormat(rental.rentalStartDate, 'MM/dd/yyyy')}</p>
                <p><span className="font-semibold text-gray-600">{t.rentalEnd || 'End'}:</span> {safeFormat(rental.rentalEndDate, 'MM/dd/yyyy')}</p>
                {rental.dailyRate && <p><span className="font-semibold text-gray-600">{t.dailyRate || 'Daily Rate'}:</span> ${rental.dailyRate.toFixed(2)}</p>}
                {rental.hourlyRate && <p><span className="font-semibold text-gray-600">{t.hourlyRate || 'Hourly Rate'}:</span> ${rental.hourlyRate.toFixed(2)}</p>}
                {rental.numberOfDays && <p><span className="font-semibold text-gray-600">{t.days || 'Days'}:</span> {rental.numberOfDays}</p>}
                {rental.numberOfHours && <p><span className="font-semibold text-gray-600">{t.hours || 'Hours'}:</span> {rental.numberOfHours}</p>}
                {rental.securityDeposit && <p><span className="font-semibold text-gray-600">{t.securityDeposit || 'Deposit'}:</span> ${rental.securityDeposit.toFixed(2)}</p>}
                {rental.damageCharges && <p><span className="font-semibold text-gray-600">{t.damageCharges || 'Damages'}:</span> ${rental.damageCharges.toFixed(2)}</p>}
                {rental.deliveryFee && <p><span className="font-semibold text-gray-600">{t.deliveryFee || 'Delivery'}:</span> ${rental.deliveryFee.toFixed(2)}</p>}
                {rental.pickupFee && <p><span className="font-semibold text-gray-600">{t.pickupFee || 'Pickup'}:</span> ${rental.pickupFee.toFixed(2)}</p>}
            </div>
        </section>
    );
};

export const RentalTemplate1: React.FC<PageProps> = (props) => {
    const { invoice, pageItems, pageIndex, totalPages, balanceDue, currencySymbol, t, accentColor } = props;
    const { business, client } = invoice;

    return (
        <div className={`p-10 font-sans ${pageIndex < totalPages - 1 ? 'page-break-after' : ''}`} style={{ minHeight: '1056px', backgroundColor: props.backgroundColor, color: props.textColor }}>
            <header className="flex justify-between items-center mb-8">
                {business.logoUrl ? <Image src={business.logoUrl} alt="Logo" width={100} height={100} className="object-contain" /> : <h1 className="text-3xl font-bold">{business.name}</h1>}
                <div className="text-right">
                    <h2 className="text-4xl font-bold" style={{color: accentColor}}>{(t.rentalInvoice || 'RENTAL INVOICE').toUpperCase()}</h2>
                    <p>#{invoice.invoiceNumber}</p>
                </div>
            </header>
            <section className="grid grid-cols-2 gap-8 text-sm mb-8">
                <div><p className="font-bold text-gray-500">{(t.renter || 'Renter').toUpperCase()}</p><p>{client.name}</p><p>{client.address}</p></div>
                <div className="text-right"><p className="font-bold text-gray-500">{(t.date || 'Date').toUpperCase()}</p><p>{safeFormat(invoice.invoiceDate, 'MMMM d, yyyy')}</p></div>
            </section>
            <RentalDetails invoice={invoice} t={t} />
            <main className="flex-grow mt-4">
                <table className="w-full text-left text-sm">
                    <thead><tr className="border-b-2"><th className="pb-2 font-bold w-3/5">{(t.item || 'Item').toUpperCase()}</th><th className="pb-2 font-bold text-right">{(t.total || 'Total').toUpperCase()}</th></tr></thead>
                    <tbody>{pageItems.map(item => (<tr key={item.id}><td className="py-2">{item.name}</td><td className="py-2 text-right">{currencySymbol}{(item.quantity * item.unitPrice).toFixed(2)}</td></tr>))}</tbody>
                </table>
            </main>
            {pageIndex === totalPages - 1 && (
            <footer className="mt-auto pt-8">
                <div className="flex justify-end text-right text-sm">
                    <div className="w-1/2">
                        <p className="flex justify-between font-bold text-2xl mt-2 pt-2 border-t-2"><span>{(t.totalDue || 'Total Due').toUpperCase()}:</span><span>{currencySymbol}{balanceDue.toFixed(2)}</span></p>
                    </div>
                </div>
            </footer>
            )}
        </div>
    );
}

export const RentalTemplate2: React.FC<PageProps> = (props) => <RentalTemplate1 {...props} />;
export const RentalTemplate3: React.FC<PageProps> = (props) => <RentalTemplate1 {...props} />;
export const RentalTemplate4: React.FC<PageProps> = (props) => <RentalTemplate1 {...props} />;
export const RentalTemplate5: React.FC<PageProps> = (props) => <RentalTemplate1 {...props} />;
