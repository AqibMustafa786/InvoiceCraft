
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
            <p className="font-bold text-gray-400 mb-2 border-b border-gray-600">{(t.sessionDetails || 'Session Details')}</p>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-x-4 gap-y-1">
                <p><span className="font-semibold text-gray-300">{(t.eventType || 'Event')}:</span> {photography.eventType}</p>
                <p><span className="font-semibold text-gray-300">{(t.shootDate || 'Date')}:</span> {safeFormat(photography.shootDate, 'MM/dd/yyyy')}</p>
                {photography.hoursOfCoverage && <p><span className="font-semibold text-gray-300">{(t.coverage || 'Coverage')}:</span> {photography.hoursOfCoverage} hrs</p>}
                <p><span className="font-semibold text-gray-300">{(t.package || 'Package')}:</span> {photography.packageSelected}</p>
                {photography.editedPhotosCount && <p><span className="font-semibold text-gray-300">{(t.editedPhotos || 'Edits')}:</span> {photography.editedPhotosCount}</p>}
                {photography.rawFilesCost && <p><span className="font-semibold text-gray-300">{(t.rawFiles || 'RAWs')}:</span> ${photography.rawFilesCost.toFixed(2)}</p>}
                {photography.travelFee && <p><span className="font-semibold text-gray-300">{(t.travelFee || 'Travel')}:</span> ${photography.travelFee.toFixed(2)}</p>}
                {photography.equipmentRentalFee && <p><span className="font-semibold text-gray-300">{(t.equipmentFee || 'Gear')}:</span> ${photography.equipmentRentalFee.toFixed(2)}</p>}
            </div>
        </section>
    );
};

// Template 1: Dark, elegant theme based on user image
export const PhotographyTemplate1: React.FC<PageProps> = (props) => {
    const { invoice, pageItems, pageIndex, totalPages, balanceDue, subtotal, taxAmount, currencySymbol, t } = props;
    const { business, client } = invoice;
    const accentTextColor = "#D4AF37"; // A gold-like color for accents

    return (
        <div className={`font-serif bg-[#333333] text-white flex flex-col ${pageIndex < totalPages - 1 ? 'page-break-after' : ''}`} style={{ minHeight: '1056px' }}>
            <header className="relative h-48 w-full">
                <Image src="https://picsum.photos/seed/camera-lens/800/200" layout="fill" objectFit="cover" alt="Camera" data-ai-hint="camera lens" />
            </header>
            
            <div className="p-10 flex-grow flex flex-col">
                <section className="grid grid-cols-2 gap-8 mb-8">
                    <div>
                        <h1 className="text-4xl tracking-wider">INVOICE</h1>
                        <p className="text-sm mt-2">No. {invoice.invoiceNumber}</p>
                        <p className="text-sm">{safeFormat(invoice.invoiceDate, 'MMMM d, yyyy')}</p>
                    </div>
                    <div className="text-right">
                        <p className="text-sm">Invoice to:</p>
                        <p className="text-xl font-bold">{client.name}</p>
                    </div>
                </section>

                <main className="flex-grow">
                    <table className="w-full text-left text-sm">
                        <thead>
                            <tr className="border-b" style={{borderColor: accentTextColor}}>
                                <th className="py-2 font-normal w-3/5" style={{color: accentTextColor}}>Description</th>
                                <th className="py-2 font-normal text-right" style={{color: accentTextColor}}>Price</th>
                                <th className="py-2 font-normal text-center" style={{color: accentTextColor}}>Qty</th>
                                <th className="py-2 font-normal text-right" style={{color: accentTextColor}}>Total</th>
                            </tr>
                        </thead>
                        <tbody>
                            {pageItems.map(item => (
                                <tr key={item.id} className="border-b border-gray-600">
                                    <td className="py-3">{item.name}</td>
                                    <td className="py-3 text-right">{currencySymbol}{item.unitPrice.toFixed(2)}</td>
                                    <td className="py-3 text-center">{item.quantity}</td>
                                    <td className="py-3 text-right">{currencySymbol}{(item.quantity * item.unitPrice).toFixed(2)}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </main>

                {pageIndex === totalPages - 1 && (
                <footer className="mt-auto pt-8">
                    <div className="flex justify-between items-start">
                        <div className="text-sm">
                            <p style={{color: accentTextColor}}>Send Payments To:</p>
                            <p>{business.name}</p>
                            <p>{business.email}</p>
                        </div>
                        <div className="w-1/3 text-sm space-y-2 text-right">
                            <p className="flex justify-between"><span>Total Amount</span><span>{currencySymbol}{subtotal.toFixed(2)}</span></p>
                            <p className="flex justify-between"><span>Tax</span><span>{currencySymbol}{taxAmount.toFixed(2)}</span></p>
                            <p className="flex justify-between font-bold text-base mt-2 pt-2" style={{color: accentTextColor}}><span>Amount due</span><span>{currencySymbol}{balanceDue.toFixed(2)}</span></p>
                        </div>
                    </div>
                </footer>
                )}
            </div>
            
            <div className="bg-gray-200 text-gray-700 p-4 text-xs text-center flex justify-center items-center gap-4">
                <span>{business.address}</span>
                <span>•</span>
                <span>{business.website}</span>
                 <span>•</span>
                <span>{business.email}</span>
            </div>
        </div>
    );
}
