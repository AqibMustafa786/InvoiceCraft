
'use client';

import React from 'react';
import type { Estimate, LineItem } from '@/lib/types';
import { format, isValid } from 'date-fns';
import Image from 'next/image';

interface TemplateProps {
  document: Estimate;
  pageItems: LineItem[];
  pageIndex: number;
  totalPages: number;
  style: React.CSSProperties;
  t: any;
}

const currencySymbols: { [key: string]: string } = { USD: '$', EUR: '€', GBP: '£', JPY: '¥', PKR: '₨' };

const safeFormat = (date: Date | string | number | undefined | null, formatString: string) => {
    if (!date) return 'N/A';
    const d = new Date(date);
    if (!isValid(d)) return "Invalid Date";
    return format(d, formatString);
}

const SignatureDisplay = ({ signature, label }: { signature: any, label: string }) => {
    if (!signature?.image) return null;
    return (
        <div className="mt-8">
            <Image src={signature.image} alt={label} width={150} height={75} className="border-b border-gray-400" />
            <p className="text-xs text-gray-500 pt-1 border-t-2 border-gray-700 w-[150px]">{label}</p>
        </div>
    )
}

const RentalDetails: React.FC<{ document: Estimate, t: any }> = ({ document, t }) => {
    if (!document.rental) return null;
    const { rental } = document;
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

export const RentalTemplate1: React.FC<TemplateProps> = ({ document, pageItems, pageIndex, totalPages, style, t }) => {
    const { business, client, summary, currency, textColor } = document;
    const currencySymbol = currencySymbols[currency] || '$';
    const docTitle = document.documentType === 'quote' ? (t.quote || 'Rental Quote') : (t.estimate || 'Rental Estimate');

    return (
        <div className={`p-10 font-sans ${pageIndex < totalPages - 1 ? 'page-break-after' : ''}`} style={{ minHeight: '1056px', backgroundColor: document.backgroundColor, color: textColor }}>
            <header className="flex justify-between items-start mb-8">
                {business.logoUrl ? <Image src={business.logoUrl} alt="Logo" width={100} height={100} className="object-contain" /> : <h1 className="text-3xl font-bold">{business.name}</h1>}
                <div className="text-right">
                    <h2 className="text-4xl font-bold" style={{color: style.color}}>{docTitle.toUpperCase()}</h2>
                    <p>#{document.estimateNumber}</p>
                </div>
            </header>
            <section className="grid grid-cols-2 gap-8 text-sm mb-8">
                <div><p className="font-bold text-gray-500">{(t.renter || 'Renter').toUpperCase()}</p><p>{client.name}</p><p>{client.address}</p></div>
                <div className="text-right"><p className="font-bold text-gray-500">{(t.date || 'Date').toUpperCase()}</p><p>{safeFormat(document.estimateDate, 'MMMM d, yyyy')}</p></div>
            </section>
            <RentalDetails document={document} t={t} />
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
                        <p className="flex justify-between font-bold text-2xl mt-2 pt-2 border-t-2"><span>{(t.totalDue || 'Total Due').toUpperCase()}:</span><span>{currencySymbol}{summary.grandTotal.toFixed(2)}</span></p>
                    </div>
                </div>
                 <div className="flex justify-between mt-8">
                    <SignatureDisplay signature={document.business.ownerSignature} label="Authorized Signature" />
                    <SignatureDisplay signature={document.clientSignature} label="Client Signature" />
                </div>
            </footer>
            )}
        </div>
    );
}

export const RentalTemplate2: React.FC<TemplateProps> = ({ document, pageItems, pageIndex, totalPages, style, t }) => {
    const { business, client, summary, currency, textColor, category } = document;
    const currencySymbol = currencySymbols[currency] || '$';
    const docTitle = document.documentType === 'quote' ? (t.quote || 'QUOTE') : (t.estimate || 'ESTIMATE');

    return (
      <div className={`p-10 bg-gray-50 font-sans ${pageIndex < totalPages - 1 ? 'page-break-after' : ''}`} style={{ minHeight: '1056px', backgroundColor: document.backgroundColor, color: textColor }}>
        <header className="flex justify-between items-center mb-8 pb-4 border-b-2">
            <h1 className="text-2xl font-bold">{business.name}</h1>
            <h2 className="text-2xl font-light text-gray-500">{docTitle}</h2>
        </header>
        <section className="grid grid-cols-2 gap-8 text-sm mb-8">
            <div><p><strong>To:</strong> {client.name}</p><p>{client.address}</p></div>
            <div className="text-right"><p><strong>#:</strong> {document.estimateNumber}</p><p><strong>Date:</strong> {safeFormat(document.estimateDate, 'MMM dd, yyyy')}</p></div>
        </section>
        <RentalDetails document={document} t={t} />
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
                    <p className="flex justify-between"><span>Subtotal</span><span>{currencySymbol}{summary.subtotal.toFixed(2)}</span></p>
                    <p className="flex justify-between border-b pb-1"><span>Tax</span><span>{currencySymbol}{summary.taxAmount.toFixed(2)}</span></p>
                    <p className="flex justify-between font-bold mt-2"><span>Total</span><span>{currencySymbol}{summary.grandTotal.toFixed(2)}</span></p>
                </div>
            </div>
             <div className="flex justify-between mt-8">
                <SignatureDisplay signature={document.business.ownerSignature} label="Authorized Signature" />
                <SignatureDisplay signature={document.clientSignature} label="Client Signature" />
            </div>
        </footer>
        )}
      </div>
    );
};
export const RentalTemplate3: React.FC<TemplateProps> = ({ document, pageItems, pageIndex, totalPages, style, t }) => {
    const { business, client, summary, currency, textColor, category } = document;
    const currencySymbol = currencySymbols[currency] || '$';
    const docTitle = document.documentType === 'quote' ? (t.quote || 'Quote') : (t.estimate || 'Estimate');
    return (
      <div className={`p-10 font-serif bg-white ${pageIndex < totalPages - 1 ? 'page-break-after' : ''}`} style={{ minHeight: '1056px', backgroundColor: document.backgroundColor, color: textColor }}>
        <header className="text-center mb-10">
            <h1 className="text-4xl font-bold">{business.name}</h1>
        </header>
        <div className="w-full h-px bg-gray-300 mb-8"></div>
        <section className="grid grid-cols-2 gap-8 mb-8 text-sm">
            <div><p><strong>Billed For:</strong> {client.name}</p></div>
            <div className="text-right"><p><strong>{docTitle} #:</strong> {document.estimateNumber}</p><p><strong>Date:</strong> {safeFormat(document.estimateDate, 'MMMM d, yyyy')}</p></div>
        </section>
        <RentalDetails document={document} t={t} />
        <main className="flex-grow mt-4">
            <table className="w-full text-left text-sm">
                <thead><tr className="border-b-2 border-t-2"><th className="py-2 w-3/5">Rental Charges</th><th className="py-2 text-right">Amount</th></tr></thead>
                <tbody>{pageItems.map(item => (<tr key={item.id} className="border-b"><td className="py-2">{item.name}</td><td className="py-2 text-right">{currencySymbol}{(item.quantity * item.unitPrice).toFixed(2)}</td></tr>))}</tbody>
            </table>
        </main>
        {pageIndex === totalPages - 1 && (
        <footer className="mt-auto pt-8">
            <div className="flex justify-end text-sm">
                <div className="w-1/3">
                    <p className="flex justify-between py-1"><span>Total:</span><span>{currencySymbol}{summary.subtotal.toFixed(2)}</span></p>
                    <p className="flex justify-between font-bold text-xl mt-2 pt-2 border-t-2"><span>Balance Due:</span><span>{currencySymbol}{summary.grandTotal.toFixed(2)}</span></p>
                </div>
            </div>
             <div className="flex justify-between mt-8">
                <SignatureDisplay signature={document.business.ownerSignature} label="Authorized Signature" />
                <SignatureDisplay signature={document.clientSignature} label="Client Signature" />
            </div>
        </footer>
        )}
      </div>
    );
};
export const RentalTemplate4: React.FC<TemplateProps> = ({ document, pageItems, pageIndex, totalPages, style, t }) => {
    const { business, client, summary, currency, textColor, category } = document;
    const currencySymbol = currencySymbols[currency] || '$';
    const docTitle = document.documentType === 'quote' ? (t.quote || 'QUOTE') : (t.estimate || 'ESTIMATE');
    return (
        <div className={`flex ${pageIndex < totalPages - 1 ? 'page-break-after' : ''}`} style={{ minHeight: '1056px', backgroundColor: document.backgroundColor, color: textColor }}>
            <div className="w-1/4 p-8 text-white" style={{backgroundColor: style.color || '#be123c'}}>
                <h1 className="text-3xl font-bold">{docTitle}</h1>
                <div className="mt-10 text-xs space-y-4">
                    <div><p className="opacity-70">DATE</p><p>{safeFormat(document.estimateDate, 'yyyy-MM-dd')}</p></div>
                    <div><p className="opacity-70">{(document.documentType === 'quote' ? t.quoteNo : t.estimateNo) || 'Number #'}</p><p>{document.estimateNumber}</p></div>
                </div>
            </div>
            <div className="w-3/4 p-10">
                <header className="text-right mb-10"><h2 className="text-2xl font-bold">{business.name}</h2><p className="text-xs">{business.address}</p></header>
                <section className="mb-10 text-sm"><p><strong>To:</strong> {client.name}</p></section>
                <RentalDetails document={document} t={t} />
                <main className="flex-grow mt-4">
                    <table className="w-full text-left text-sm">
                        <thead><tr className="bg-gray-100"><th className="p-2 font-bold w-4/5">Description</th><th className="p-2 font-bold text-right">Total</th></tr></thead>
                        <tbody>{pageItems.map(item => (<tr key={item.id} className="border-b"><td className="p-2">{item.name}</td><td className="p-2 text-right">{currencySymbol}{(item.quantity * item.unitPrice).toFixed(2)}</td></tr>))}</tbody>
                    </table>
                </main>
                {pageIndex === totalPages - 1 && (
                <footer className="mt-auto pt-8">
                    <div className="text-right text-2xl font-bold">Total Due: {currencySymbol}{summary.grandTotal.toFixed(2)}</div>
                    <div className="flex justify-between mt-8">
                        <SignatureDisplay signature={document.business.ownerSignature} label="Authorized Signature" />
                        <SignatureDisplay signature={document.clientSignature} label="Client Signature" />
                    </div>
                </footer>
                )}
            </div>
        </div>
    );
};
export const RentalTemplate5: React.FC<TemplateProps> = ({ document, pageItems, pageIndex, totalPages, style, t }) => {
    const { business, client, summary, currency, textColor, category } = document;
    const currencySymbol = currencySymbols[currency] || '$';
    const docTitle = document.documentType === 'quote' ? (t.quote || 'Quote') : (t.estimate || 'Estimate');
    return (
        <div className={`p-10 font-serif ${pageIndex < totalPages - 1 ? 'page-break-after' : ''}`} style={{ minHeight: '1056px', backgroundColor: '#FDFBF7', color: '#5A4A42' }}>
            <header className="text-center mb-10">
                <h1 className="text-2xl font-bold">{business.name}</h1>
                <p className="text-xs">{business.address} | {business.phone}</p>
            </header>
            <h2 className="text-center text-xl mb-8">{docTitle}</h2>
            <section className="text-xs mb-8">
                <p><strong>To:</strong> {client.name}</p>
                <p><strong>{(document.documentType === 'quote' ? t.quoteNo : t.estimateNo) || 'Number #'}:</strong> {document.estimateNumber}</p>
                <p><strong>Date:</strong> {safeFormat(document.estimateDate, 'MM/dd/yyyy')}</p>
            </section>
            <RentalDetails document={document} t={t} />
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
                        <p className="flex justify-between"><span>Subtotal</span><span>{currencySymbol}{summary.subtotal.toFixed(2)}</span></p>
                        <p className="flex justify-between"><span>Tax</span><span>{currencySymbol}{summary.taxAmount.toFixed(2)}</span></p>
                        <p className="flex justify-between font-bold mt-2 pt-2 border-t"><span>TOTAL</span><span>{currencySymbol}{summary.grandTotal.toFixed(2)}</span></p>
                    </div>
                </div>
                 <div className="flex justify-between mt-8">
                    <SignatureDisplay signature={document.business.ownerSignature} label="Authorized Signature" />
                    <SignatureDisplay signature={document.clientSignature} label="Client Signature" />
                </div>
            </footer>
            )}
        </div>
    );
};
