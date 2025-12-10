
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

const AutoRepairDetails: React.FC<{ invoice: Invoice, t: any }> = ({ invoice, t }) => {
    if (!invoice.autoRepair) return null;
    const { autoRepair } = invoice;
    return (
        <section className="my-4 text-xs">
            <p className="font-bold text-gray-500 mb-2 border-b">{(t.vehicleInformation || 'Vehicle Information')}</p>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-x-4 gap-y-1">
                <p><span className="font-semibold text-gray-600">{(t.vehicle || 'Vehicle')}:</span> {autoRepair.vehicleMake} {autoRepair.vehicleModel} ({autoRepair.year})</p>
                {autoRepair.odometer && <p><span className="font-semibold text-gray-600">{(t.mileage || 'Mileage')}:</span> {autoRepair.odometer.toLocaleString()}</p>}
                <p className="col-span-full"><span className="font-semibold text-gray-600">VIN:</span> {autoRepair.vin}</p>
                <p><span className="font-semibold text-gray-600">{(t.licensePlate || 'Plate')}:</span> {autoRepair.licensePlate}</p>
                {autoRepair.laborHours && <p><span className="font-semibold text-gray-600">{(t.laborHours || 'Labor Hours')}:</span> {autoRepair.laborHours}</p>}
                {autoRepair.laborRate && <p><span className="font-semibold text-gray-600">{(t.laborRate || 'Labor Rate')}:</span> ${autoRepair.laborRate}/hr</p>}
                {autoRepair.diagnosticFee && <p><span className="font-semibold text-gray-600">{(t.diagnosticFee || 'Diagnostic Fee')}:</span> ${autoRepair.diagnosticFee.toFixed(2)}</p>}
                {autoRepair.shopSupplyFee && <p><span className="font-semibold text-gray-600">{(t.shopSupplyFee || 'Shop Supply Fee')}:</span> ${autoRepair.shopSupplyFee.toFixed(2)}</p>}
                {autoRepair.towingFee && <p><span className="font-semibold text-gray-600">{(t.towingFee || 'Towing Fee')}:</span> ${autoRepair.towingFee.toFixed(2)}</p>}
            </div>
        </section>
    );
};

// Template 1: Gold Standard
export const AutoRepairTemplate1: React.FC<PageProps> = (props) => {
    const { invoice, pageItems, pageIndex, totalPages, subtotal, taxAmount, balanceDue, currencySymbol, accentColor, t } = props;
    const { business, client } = invoice;

    return (
        <div className={`p-8 font-sans ${pageIndex < totalPages - 1 ? 'page-break-after' : ''}`} style={{ minHeight: '1056px', backgroundColor: props.backgroundColor, color: props.textColor }}>
            <header className="mb-8 p-4 bg-gray-100 rounded-md">
                <div className="flex justify-between items-center">
                    <div>
                         {business.logoUrl ? (
                            <Image src={business.logoUrl} alt={`${business.name} Logo`} width={120} height={50} className="object-contain" />
                         ) : (
                            <h1 className="text-3xl font-bold">{business.name}</h1>
                         )}
                        <p className="text-xs whitespace-pre-line">{business.address}</p>
                    </div>
                    <h2 className="text-2xl font-extrabold" style={{ color: accentColor }}>{(t.invoice || 'INVOICE').toUpperCase()}</h2>
                </div>
            </header>

            <section className="grid grid-cols-2 gap-4 text-xs mb-8">
                <div>
                    <p className="font-bold">{(t.customer || 'CUSTOMER').toUpperCase()}</p>
                    <p>{client.name}</p>
                    <p>{client.address}</p>
                </div>
                <div className="text-right">
                    <p><span className="font-bold">{(t.invoiceNo || 'INVOICE #')}:</span> {invoice.invoiceNumber}</p>
                    <p><span className="font-bold">{(t.date || 'DATE')}:</span> {safeFormat(invoice.invoiceDate, 'MM/dd/yyyy')}</p>
                </div>
            </section>

            <AutoRepairDetails invoice={invoice} t={t} />

            <main className="flex-grow">
                <table className="w-full text-left text-xs">
                    <thead>
                        <tr style={{ backgroundColor: accentColor, color: 'white' }}>
                            <th className="p-2 font-bold w-1/2">{(t.description || 'DESCRIPTION').toUpperCase()}</th>
                            <th className="p-2 font-bold text-center">{(t.quantity || 'QTY').toUpperCase()}</th>
                            <th className="p-2 font-bold text-right">{(t.unitPrice || 'UNIT PRICE').toUpperCase()}</th>
                            <th className="p-2 font-bold text-right">{(t.total || 'TOTAL').toUpperCase()}</th>
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
                        <div className="w-2/5 text-xs space-y-1">
                            <p className="grid grid-cols-2"><span>{(t.subtotal || 'Subtotal')}:</span><span className="text-right">{currencySymbol}{subtotal.toFixed(2)}</span></p>
                            <p className="grid grid-cols-2"><span>{(t.tax || 'Tax')} ({invoice.summary.taxPercentage}%):</span><span className="text-right">{currencySymbol}{taxAmount.toFixed(2)}</span></p>
                            <p className="grid grid-cols-2 mt-2 pt-2 border-t font-bold text-sm"><span>{(t.total || 'Total')}:</span><span className="text-right">{currencySymbol}{balanceDue.toFixed(2)}</span></p>
                        </div>
                    </div>
                </footer>
            )}
        </div>
    );
};

// All other templates will just be stubs for now, pointing to the first one.
export const AutoRepairTemplate2: React.FC<PageProps> = (props) => <AutoRepairTemplate1 {...props} />;
export const AutoRepairTemplate3: React.FC<PageProps> = (props) => <AutoRepairTemplate1 {...props} />;
export const AutoRepairTemplate4: React.FC<PageProps> = (props) => <AutoRepairTemplate1 {...props} />;
export const AutoRepairTemplate5: React.FC<PageProps> = (props) => <AutoRepairTemplate1 {...props} />;
