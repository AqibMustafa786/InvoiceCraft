

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

const SignatureDisplay = ({ signature, label }: { signature: any, label: string }) => {
    if (!signature?.image) return null;
    return (
        <div className="mt-8">
            <Image src={signature.image} alt={label} width={150} height={75} className="border-b border-gray-400" />
            <p className="text-xs text-gray-500 pt-1 border-t-2 border-gray-700 w-[150px]">{label}</p>
        </div>
    )
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
                {autoRepair.laborRate && <p><span className="font-semibold text-gray-600">{(t.laborRate || 'Labor Rate')}:</span> ${autoRepair.laborRate.toFixed(2)}/hr</p>}
                {autoRepair.diagnosticFee && <p><span className="font-semibold text-gray-600">{(t.diagnosticFee || 'Diagnostic Fee')}:</span> ${autoRepair.diagnosticFee.toFixed(2)}</p>}
                {autoRepair.shopSupplyFee && <p><span className="font-semibold text-gray-600">{(t.shopSupplyFee || 'Shop Supply Fee')}:</span> ${autoRepair.shopSupplyFee.toFixed(2)}</p>}
                {autoRepair.towingFee && <p><span className="font-semibold text-gray-600">{(t.towingFee || 'Towing Fee')}:</span> ${autoRepair.towingFee.toFixed(2)}</p>}
            </div>
        </section>
    );
};

// Template 1: Custom design based on user image
export const AutoRepairTemplate1: React.FC<PageProps> = (props) => {
    const { invoice, pageItems, pageIndex, totalPages, balanceDue, subtotal, taxAmount, discountAmount, total, currencySymbol, t, accentColor } = props;
    const { business, client } = invoice;
    const secondaryColor = '#4A5568'; // A dark slate gray from the image

    return (
        <div className={`p-0 font-sans ${pageIndex < totalPages - 1 ? 'page-break-after' : ''}`} style={{ minHeight: '1056px', backgroundColor: props.backgroundColor, color: props.textColor }}>
            <header className="relative h-48">
                 <div className="absolute top-0 left-0 w-full h-full">
                     <svg className="w-full h-full" viewBox="0 0 800 200" preserveAspectRatio="none">
                        <path d={`M0 0 L800 0 L800 100 L400 0 Z`} style={{fill: accentColor || '#DC2626'}}/>
                        <path d={`M0 0 L400 0 L0 100 Z`} style={{fill: secondaryColor}}/>
                     </svg>
                 </div>
                 <div className="absolute top-8 left-8 text-white">
                    <h1 className="text-3xl font-bold">{business.name}</h1>
                    <p className="text-xs whitespace-pre-line">{business.address}</p>
                 </div>
            </header>
            <div className="p-8">
                <h2 className="text-2xl font-bold mb-6">Auto Repair Invoice</h2>
                <section className="grid grid-cols-2 gap-8 text-xs mb-8">
                    <div>
                        <p className="font-bold mb-1">Invoice Details:</p>
                        <ul>
                            <li><span className="font-semibold">Invoice Number:</span> {invoice.invoiceNumber}</li>
                            <li><span className="font-semibold">Invoice Date:</span> {safeFormat(invoice.invoiceDate, 'MMMM d, yyyy')}</li>
                            <li><span className="font-semibold">Due Date:</span> {safeFormat(invoice.dueDate, 'MMMM d, yyyy')}</li>
                            {invoice.poNumber && <li><span className="font-semibold">PO #:</span> {invoice.poNumber}</li>}
                        </ul>
                    </div>
                     <div>
                        <p className="font-bold mb-1">Billed To:</p>
                        <ul>
                            <li><span className="font-semibold">Customer:</span> {client.name}</li>
                            {client.companyName && <li><span className="font-semibold">Company:</span> {client.companyName}</li>}
                            <li className="whitespace-pre-line"><span className="font-semibold">Address:</span> {client.address}</li>
                            <li><span className="font-semibold">Phone:</span> {client.phone}</li>
                            <li><span className="font-semibold">Email:</span> {client.email}</li>
                            {client.shippingAddress && <li className="whitespace-pre-line mt-1"><span className="font-semibold">Ship To:</span> {client.shippingAddress}</li>}
                        </ul>
                    </div>
                </section>
                <AutoRepairDetails invoice={invoice} t={t} />
                <main className="flex-grow">
                    <table className="w-full text-left text-xs">
                        <thead><tr className="bg-gray-100"><th className="p-2 font-bold w-[50%]">Description</th><th className="p-2 font-bold w-[15%]">Quantity</th><th className="p-2 font-bold w-[15%]">Rate</th><th className="p-2 font-bold w-[20%] text-right">Amount</th></tr></thead>
                        <tbody>{pageItems.map(item => (<tr key={item.id} className="border-b"><td className="p-2">{item.name}</td><td className="p-2">{item.quantity}</td><td className="p-2">{currencySymbol}{item.unitPrice.toFixed(2)}</td><td className="p-2 text-right">{currencySymbol}{(item.quantity * item.unitPrice).toFixed(2)}</td></tr>))}</tbody>
                    </table>
                </main>
                {pageIndex === totalPages - 1 && (
                <footer className="mt-auto pt-4">
                    <div className="flex justify-end text-xs">
                        <div className="w-1/3 space-y-1">
                            <p className="flex justify-between p-1"><span>Subtotal</span><span>{currencySymbol}{subtotal.toFixed(2)}</span></p>
                            {discountAmount > 0 && <p className="flex justify-between p-1 text-red-500"><span>Discount</span><span>-{currencySymbol}{discountAmount.toFixed(2)}</span></p>}
                            {invoice.summary.shippingCost > 0 && <p className="flex justify-between p-1"><span>Shipping</span><span>{currencySymbol}{invoice.summary.shippingCost.toFixed(2)}</span></p>}
                            <p className="flex justify-between p-1"><span>Tax ({invoice.summary.taxPercentage}%)</span><span>{currencySymbol}{taxAmount.toFixed(2)}</span></p>
                            <p className="flex justify-between p-1 font-bold text-sm"><span>Total</span><span>{currencySymbol}{total.toFixed(2)}</span></p>
                            {(invoice.amountPaid || 0) > 0 && <p className="flex justify-between p-1 text-green-600"><span>Paid</span><span>-{currencySymbol}{(invoice.amountPaid || 0).toFixed(2)}</span></p>}
                            <p className="flex justify-between p-1 font-bold text-sm mt-1 border-t"><span>Balance Due</span><span>{currencySymbol}{balanceDue.toFixed(2)}</span></p>
                        </div>
                    </div>
                    {business.ownerSignature && (
                        <div className="mt-8">
                            <p className="text-xs font-bold">Signature:</p>
                            <SignatureDisplay signature={business.ownerSignature} label="Authorized Signature" />
                        </div>
                    )}
                </footer>
                )}
            </div>
        </div>
    );
};


// Template 2: Night Shift
export const AutoRepairTemplate2: React.FC<PageProps> = (props) => {
    const { invoice, pageItems, pageIndex, totalPages, subtotal, taxAmount, discountAmount, total, balanceDue, currencySymbol, t, accentColor } = props;
    const { business, client } = invoice;

    return (
        <div className={`p-8 font-mono bg-gray-900 text-white ${pageIndex < totalPages - 1 ? 'page-break-after' : ''}`} style={{ minHeight: '1056px', backgroundColor: '#1A202C', color: '#E2E8F0' }}>
            <header className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-3xl font-bold" style={{ color: accentColor || '#FBBF24' }}>{business.name}</h1>
                </div>
                <div className="text-right">
                    <h2 className="text-2xl font-bold">INVOICE</h2>
                    <p className="text-xs"># {invoice.invoiceNumber}</p>
                </div>
            </header>
            <section className="grid grid-cols-2 gap-8 text-xs mb-8">
                <div>
                  <p className="font-bold text-gray-400">BILLED TO</p>
                  <p>{client.name}</p>
                  {client.companyName && <p>{client.companyName}</p>}
                  <p className="whitespace-pre-line">{client.address}</p>
                </div>
                <div className="text-right">
                  <p className="font-bold text-gray-400">DATE</p>
                  <p>{safeFormat(invoice.invoiceDate, 'yyyy-MM-dd')}</p>
                   <p className="font-bold text-gray-400 mt-2">DUE DATE</p>
                  <p>{safeFormat(invoice.dueDate, 'yyyy-MM-dd')}</p>
                </div>
            </section>
            <AutoRepairDetails invoice={invoice} t={t} />
            <main className="flex-grow mt-4">
                <table className="w-full text-left text-sm">
                    <thead><tr><th className="py-2 w-3/5">SERVICE</th><th className="py-2 text-center">HOURS</th><th className="py-2 text-right">RATE</th><th className="py-2 text-right">TOTAL</th></tr></thead>
                    <tbody className="text-xs">{pageItems.map(item => (<tr key={item.id} className="border-t border-gray-700"><td className="py-2">{item.name}</td><td className="py-2 text-center">{item.quantity}</td><td className="py-2 text-right">{currencySymbol}{item.unitPrice.toFixed(2)}</td><td className="py-2 text-right">{currencySymbol}{(item.quantity * item.unitPrice).toFixed(2)}</td></tr>))}</tbody>
                </table>
            </main>
            {pageIndex === totalPages - 1 && (
            <footer className="mt-auto pt-8">
                <div className="flex justify-end text-sm">
                    <div className="w-2/5">
                        <p className="flex justify-between py-1"><span>Subtotal:</span><span>{currencySymbol}{subtotal.toFixed(2)}</span></p>
                        {discountAmount > 0 && <p className="flex justify-between py-1 text-red-400"><span>Discount:</span><span>-{currencySymbol}{discountAmount.toFixed(2)}</span></p>}
                        {invoice.summary.shippingCost > 0 && <p className="flex justify-between py-1"><span>Shipping:</span><span>{currencySymbol}{invoice.summary.shippingCost.toFixed(2)}</span></p>}
                        <p className="flex justify-between py-1"><span>Tax:</span><span>{currencySymbol}{taxAmount.toFixed(2)}</span></p>
                        <p className="flex justify-between font-bold mt-2"><span>Total:</span><span>{currencySymbol}{total.toFixed(2)}</span></p>
                        {(invoice.amountPaid || 0) > 0 && <p className="flex justify-between text-green-400"><span>Paid:</span><span>-{currencySymbol}{(invoice.amountPaid || 0).toFixed(2)}</span></p>}
                        <p className="flex justify-between font-bold text-xl mt-4 pt-4 border-t border-gray-600"><span>Balance Due:</span><span style={{color: accentColor || '#FBBF24'}}>{currencySymbol}{balanceDue.toFixed(2)}</span></p>
                    </div>
                </div>
                 {business.ownerSignature && (
                    <div className="mt-8">
                        <SignatureDisplay signature={business.ownerSignature} label="Authorized Signature" />
                    </div>
                )}
            </footer>
            )}
        </div>
    );
};

// Template 3: Classic Garage
export const AutoRepairTemplate3: React.FC<PageProps> = (props) => {
    const { invoice, pageItems, pageIndex, totalPages, subtotal, taxAmount, discountAmount, total, balanceDue, currencySymbol, t } = props;
    const { business, client } = invoice;
    return (
        <div className={`p-10 font-serif bg-orange-50 ${pageIndex < totalPages - 1 ? 'page-break-after' : ''}`} style={{ minHeight: '1056px', backgroundColor: '#FFF7ED', color: '#4A5568' }}>
            <header className="text-center mb-8">
                <h1 className="text-4xl font-bold">{business.name}</h1>
                <p className="text-sm">Quality Auto Repair Since 1985</p>
                <p className="text-xs whitespace-pre-line">{business.address} | {business.phone}</p>
            </header>
            <div className="w-full h-px bg-black mb-8"></div>
            <section className="grid grid-cols-2 gap-8 text-xs mb-8">
                <div>
                  <p className="font-bold">Customer</p>
                  <p>{client.name}</p>
                  {client.companyName && <p>{client.companyName}</p>}
                  <p>{client.address}</p>
                  <p>{client.email}</p>
                  <p>{client.phone}</p>
                </div>
                <div className="text-right">
                  <p><strong>INVOICE #:</strong> {invoice.invoiceNumber}</p>
                  <p><strong>DATE:</strong> {safeFormat(invoice.invoiceDate, 'MMMM d, yyyy')}</p>
                  <p><strong>DUE:</strong> {safeFormat(invoice.dueDate, 'MMMM d, yyyy')}</p>
                  {invoice.poNumber && <p><strong>PO #:</strong> {invoice.poNumber}</p>}
                </div>
            </section>
            <AutoRepairDetails invoice={invoice} t={t} />
            <main className="flex-grow mt-4">
                <table className="w-full text-left text-sm">
                    <thead><tr className="border-b-2 border-t-2 border-black"><th className="py-1">Description</th><th className="py-1 text-right">Amount</th></tr></thead>
                    <tbody>{pageItems.map(item => (<tr key={item.id} className="border-b"><td className="py-1">{item.name}</td><td className="py-1 text-right">{currencySymbol}{(item.quantity * item.unitPrice).toFixed(2)}</td></tr>))}</tbody>
                </table>
            </main>
            {pageIndex === totalPages - 1 && (
            <footer className="mt-auto pt-8">
                <div className="flex justify-end text-sm">
                    <div className="w-1/3">
                        <p className="flex justify-between"><span>Subtotal</span><span>{currencySymbol}{subtotal.toFixed(2)}</span></p>
                        {discountAmount > 0 && <p className="flex justify-between text-red-600"><span>Discount</span><span>-{currencySymbol}{discountAmount.toFixed(2)}</span></p>}
                        {invoice.summary.shippingCost > 0 && <p className="flex justify-between"><span>Shipping</span><span>{currencySymbol}{invoice.summary.shippingCost.toFixed(2)}</span></p>}
                        <p className="flex justify-between border-b pb-1"><span>Tax</span><span>{currencySymbol}{taxAmount.toFixed(2)}</span></p>
                        <p className="flex justify-between font-bold mt-2"><span>Total</span><span>{currencySymbol}{total.toFixed(2)}</span></p>
                        {(invoice.amountPaid || 0) > 0 && <p className="flex justify-between text-green-600"><span>Paid</span><span>-{currencySymbol}{(invoice.amountPaid || 0).toFixed(2)}</span></p>}
                        <p className="flex justify-between font-bold mt-2 pt-2 border-t"><span>Balance Due</span><span>{currencySymbol}{balanceDue.toFixed(2)}</span></p>
                    </div>
                </div>
                 {business.ownerSignature && (
                    <div className="mt-8">
                        <SignatureDisplay signature={business.ownerSignature} label="Authorized Signature" />
                    </div>
                )}
            </footer>
            )}
        </div>
    );
};

// Template 4: Pro Service
export const AutoRepairTemplate4: React.FC<PageProps> = (props) => {
    const { invoice, pageItems, pageIndex, totalPages, balanceDue, currencySymbol, t, accentColor } = props;
    const { business, client } = invoice;
    return (
        <div className={`flex ${pageIndex < totalPages - 1 ? 'page-break-after' : ''}`} style={{ minHeight: '1056px', backgroundColor: props.backgroundColor, color: props.textColor }}>
            <div className="w-1/3 p-8 text-white flex flex-col" style={{backgroundColor: accentColor || '#b91c1c'}}>
                <h2 className="text-3xl font-bold">INVOICE</h2>
                 <p className="text-xs"># {invoice.invoiceNumber}</p>
                <div className="mt-auto text-xs">
                    <p className="font-bold opacity-80 mb-2">TOTAL DUE</p>
                    <p className="text-4xl font-extrabold">{currencySymbol}{balanceDue.toFixed(2)}</p>
                </div>
            </div>
            <div className="w-2/3 p-8">
                <header className="text-right mb-8">
                    <h1 className="text-2xl font-bold">{business.name}</h1>
                    <p className="text-xs whitespace-pre-line">{business.address}</p>
                </header>
                <section className="grid grid-cols-2 gap-4 text-xs mb-8">
                    <div>
                      <p className="font-bold">Billed To</p>
                      <p>{client.name}</p>
                      {client.companyName && <p>{client.companyName}</p>}
                      <p>{client.address}</p>
                      <p>{client.email}</p>
                      <p>{client.phone}</p>
                    </div>
                    <div className="text-right">
                      <p><strong>Date:</strong> {safeFormat(invoice.invoiceDate, 'yyyy-MM-dd')}</p>
                      <p><strong>Due:</strong> {safeFormat(invoice.dueDate, 'yyyy-MM-dd')}</p>
                      {invoice.poNumber && <p><strong>PO #:</strong> {invoice.poNumber}</p>}
                    </div>
                </section>
                <AutoRepairDetails invoice={invoice} t={t} />
                <main className="flex-grow mt-4">
                    <table className="w-full text-left text-xs">
                        <thead><tr className="bg-gray-100"><th className="p-2 font-bold w-4/5">Description</th><th className="p-2 font-bold text-right">Amount</th></tr></thead>
                        <tbody>{pageItems.map(item => (<tr key={item.id} className="border-b"><td className="p-2">{item.name}</td><td className="p-2 text-right">{currencySymbol}{(item.quantity * item.unitPrice).toFixed(2)}</td></tr>))}</tbody>
                    </table>
                </main>
                {pageIndex === totalPages - 1 && (
                <footer className="mt-auto pt-8">
                     {business.ownerSignature && (
                        <div className="mt-8 flex justify-end">
                            <SignatureDisplay signature={business.ownerSignature} label="Authorized Signature" />
                        </div>
                    )}
                </footer>
                )}
            </div>
        </div>
    );
};

// Template 5: Gridline
export const AutoRepairTemplate5: React.FC<PageProps> = (props) => {
    const { invoice, pageItems, pageIndex, totalPages, subtotal, taxAmount, discountAmount, balanceDue, currencySymbol, t, accentColor } = props;
    const { business, client } = invoice;
    return (
        <div className={`p-10 font-sans ${pageIndex < totalPages - 1 ? 'page-break-after' : ''}`} style={{ minHeight: '1056px', backgroundColor: '#F9FAFB', color: '#374151' }}>
            <header className="flex justify-between items-center mb-8">
                <h1 className="text-4xl font-extrabold">{business.name}</h1>
                <h2 className="text-xl font-light">Invoice / Receipt</h2>
            </header>
            <section className="grid grid-cols-2 gap-4 text-xs p-4 border rounded mb-8">
                <div>
                  <p><strong>Billed To:</strong> {client.name}</p>
                  {client.companyName && <p><strong>Company:</strong> {client.companyName}</p>}
                  <p><strong>Address:</strong> {client.address}</p>
                </div>
                <div className="text-right">
                  <p><strong>Invoice #:</strong> {invoice.invoiceNumber}</p>
                  <p><strong>Date:</strong> {safeFormat(invoice.invoiceDate, 'yyyy-MM-dd')}</p>
                </div>
            </section>
            <AutoRepairDetails invoice={invoice} t={t} />
            <main className="flex-grow mt-4">
                <table className="w-full text-left text-xs">
                    <thead><tr className="bg-gray-200"><th className="p-2 font-bold w-[60%]">Description</th><th className="p-2 font-bold text-center">Quantity</th><th className="p-2 font-bold text-right">Rate</th><th className="p-2 font-bold text-right">Total</th></tr></thead>
                    <tbody>{pageItems.map(item => (<tr key={item.id} className="border-b"><td className="p-2">{item.name}</td><td className="p-2 text-center">{item.quantity}</td><td className="p-2 text-right">{currencySymbol}{item.unitPrice.toFixed(2)}</td><td className="p-2 text-right">{currencySymbol}{(item.quantity * item.unitPrice).toFixed(2)}</td></tr>))}</tbody>
                </table>
            </main>
            {pageIndex === totalPages - 1 && (
            <footer className="mt-auto pt-8">
                <div className="flex justify-end">
                    <div className="w-1/3 text-xs space-y-1">
                        <p className="flex justify-between"><span>Subtotal</span><span>{currencySymbol}{subtotal.toFixed(2)}</span></p>
                        {discountAmount > 0 && <p className="flex justify-between text-red-500"><span>Discount</span><span>-{currencySymbol}{discountAmount.toFixed(2)}</span></p>}
                        {invoice.summary.shippingCost > 0 && <p className="flex justify-between"><span>Shipping</span><span>{currencySymbol}{invoice.summary.shippingCost.toFixed(2)}</span></p>}
                        <p className="flex justify-between"><span>Tax</span><span>{currencySymbol}{taxAmount.toFixed(2)}</span></p>
                         {(invoice.amountPaid || 0) > 0 && <p className="flex justify-between text-green-600"><span>Paid</span><span>-{currencySymbol}{(invoice.amountPaid || 0).toFixed(2)}</span></p>}
                        <p className="flex justify-between font-bold text-base mt-2 pt-2 border-t"><span>Total</span><span>{currencySymbol}{balanceDue.toFixed(2)}</span></p>
                    </div>
                </div>
                 {business.ownerSignature && (
                    <div className="mt-8 flex justify-start">
                        <SignatureDisplay signature={business.ownerSignature} label="Authorized Signature" />
                    </div>
                )}
            </footer>
            )}
        </div>
    );
};

export const AutoRepairTemplate6: React.FC<PageProps> = (props) => <AutoRepairTemplate1 {...props} />;
