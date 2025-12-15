
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

const ConsultingDetails: React.FC<{ invoice: Invoice, t: any }> = ({ invoice, t }) => {
    if (!invoice.consulting) return null;
    const { consulting } = invoice;
    return (
        <section className="my-4 text-xs">
            <p className="font-bold text-gray-500 mb-2 border-b">{t.consultingDetails || 'Consulting Details'}</p>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-x-4 gap-y-1">
                <p><span className="font-semibold text-gray-600">{(t.consultationType || 'Type')}:</span> {consulting.consultationType}</p>
                {consulting.sessionHours && <p><span className="font-semibold text-gray-600">{(t.sessionHours || 'Hours')}:</span> {consulting.sessionHours}</p>}
                {consulting.retainerFee && <p><span className="font-semibold text-gray-600">{(t.retainerFee || 'Retainer')}:</span> ${consulting.retainerFee.toFixed(2)}</p>}
            </div>
        </section>
    );
};

// Template 1: Based on User Image - REBUILT
export const ConsultingTemplate1: React.FC<PageProps> = (props) => {
    const { invoice, pageItems, pageIndex, totalPages, balanceDue, currencySymbol, t, accentColor, subtotal, taxAmount, discountAmount, total } = props;
    const { business, client } = invoice;

    return (
        <div className={`p-10 font-sans ${pageIndex < totalPages - 1 ? 'page-break-after' : ''}`} style={{ minHeight: '1056px', backgroundColor: props.backgroundColor, color: props.textColor }}>
            {/* Header */}
            <header className="flex justify-between items-start mb-10">
                <div>
                    <h1 className="text-2xl font-bold">{business.name || 'Your Company'}</h1>
                    <p className="text-xs text-gray-600 whitespace-pre-line">{business.address || '123 Main St, Anytown, USA 12345'}</p>
                    <p className="text-xs text-gray-600">{business.phone}</p>
                    <p className="text-xs text-gray-600">{business.email}</p>
                    {business.website && <p className="text-xs text-gray-600">{business.website}</p>}
                    {business.licenseNumber && <p className="text-xs text-gray-600">Lic#: {business.licenseNumber}</p>}
                    {business.taxId && <p className="text-xs text-gray-600">Tax ID: {business.taxId}</p>}
                </div>
                {business.logoUrl && (
                    <Image src={business.logoUrl} alt="Company Logo" width={80} height={80} className="object-cover rounded-md" />
                )}
            </header>

            {/* Title */}
            <div className="text-left my-8">
                <h2 className="text-3xl font-bold tracking-wider">CONSULTANT INVOICE</h2>
            </div>
            
            {/* Bill To and Invoice Details */}
            <section className="grid grid-cols-2 gap-8 text-xs mb-8">
                <div>
                    <p className="font-bold text-gray-500 mb-1">BILL TO</p>
                    <p>{client.name}</p>
                    <p className="whitespace-pre-line">{client.address}</p>
                    <p>{client.email}</p>
                    <p>{client.phone}</p>
                    {client.shippingAddress && <p className="mt-2"><span className="font-bold">Ship To:</span><br/>{client.shippingAddress}</p>}
                    {client.projectLocation && <p className="mt-2"><span className="font-bold">Project Location:</span><br/>{client.projectLocation}</p>}
                </div>
                <div className="text-right space-y-1">
                    <p><span className="font-bold">Invoice #:</span> {invoice.invoiceNumber}</p>
                    <p><span className="font-bold">Invoice Date:</span> {safeFormat(invoice.invoiceDate, 'MM-dd-yyyy')}</p>
                    <p><span className="font-bold">Due Date:</span> {safeFormat(invoice.dueDate, 'MM-dd-yyyy')}</p>
                    {invoice.poNumber && <p><span className="font-bold">PO #:</span> {invoice.poNumber}</p>}
                </div>
            </section>

            <ConsultingDetails invoice={invoice} t={t} />
            
            {/* Items Table */}
            <main className="flex-grow mt-4">
                <table className="w-full text-left text-xs">
                    <thead>
                        <tr className="bg-gray-800 text-white">
                            <th className="p-2 font-bold w-[10%]">QTY</th>
                            <th className="p-2 font-bold w-[50%]">DESCRIPTION</th>
                            <th className="p-2 font-bold text-right">UNIT PRICE</th>
                            <th className="p-2 font-bold text-right">AMOUNT</th>
                        </tr>
                    </thead>
                    <tbody>
                        {pageItems.map(item => (
                            <tr key={item.id} className="border-b">
                                <td className="p-2 text-center">{item.quantity}</td>
                                <td className="p-2 whitespace-pre-line">{item.name}</td>
                                <td className="p-2 text-right">{currencySymbol}{item.unitPrice.toFixed(2)}</td>
                                <td className="p-2 text-right">{currencySymbol}{(item.quantity * item.unitPrice).toFixed(2)}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </main>

            {pageIndex === totalPages - 1 && (
            <footer className="mt-auto pt-8">
                {/* Totals Summary */}
                <div className="flex justify-end text-sm mb-8">
                    <div className="w-2/5 space-y-2">
                        <p className="flex justify-between"><span>Subtotal:</span><span>{currencySymbol}{subtotal.toFixed(2)}</span></p>
                        {discountAmount > 0 && <p className="flex justify-between text-red-600"><span>Discount:</span><span>-{currencySymbol}{discountAmount.toFixed(2)}</span></p>}
                        {invoice.summary.shippingCost > 0 && <p className="flex justify-between"><span>Shipping:</span><span>{currencySymbol}{invoice.summary.shippingCost.toFixed(2)}</span></p>}
                        <p className="flex justify-between"><span>Tax ({invoice.summary.taxPercentage}%):</span><span>{currencySymbol}{taxAmount.toFixed(2)}</span></p>
                        <p className="flex justify-between font-bold"><span>Total:</span><span>{currencySymbol}{total.toFixed(2)}</span></p>
                         {(invoice.amountPaid || 0) > 0 && <p className="flex justify-between text-green-600"><span>Amount Paid:</span><span>-{currencySymbol}{(invoice.amountPaid || 0).toFixed(2)}</span></p>}
                        <p className="flex justify-between font-bold text-base mt-2 pt-2 border-t"><span>Balance Due:</span><span>{currencySymbol}{balanceDue.toFixed(2)}</span></p>
                    </div>
                </div>

                {/* Terms and Conditions */}
                <div className="text-xs">
                    <p className="font-bold">Terms and Conditions</p>
                    <p className="text-gray-600 whitespace-pre-line">{invoice.paymentInstructions || 'Thank you for your business. Please make payment to the account specified below.'}</p>
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


export const ConsultingTemplate2: React.FC<PageProps> = (props) => {
  const {
    invoice,
    pageItems,
    pageIndex,
    totalPages,
    subtotal,
    taxAmount,
    discountAmount,
    total,
    balanceDue,
    currencySymbol,
    t,
    accentColor,
  } = props;

  const { business, client } = invoice;

  return (
    <div
      className={`font-sans ${pageIndex < totalPages - 1 ? 'page-break-after' : ''}`}
      style={{
        minHeight: '1056px',
        backgroundColor: props.backgroundColor,
        color: props.textColor,
      }}
    >
      <div
        style={{ backgroundColor: accentColor, color: 'white' }}
        className="p-8 rounded-t-lg"
      >
        <header className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold">{business.name}</h1>
            <p className="text-xs opacity-80 whitespace-pre-line">
              {business.address}
            </p>
          </div>
          <div className="text-right">
            <h2 className="text-2xl font-bold">INVOICE</h2>
            <p>#{invoice.invoiceNumber}</p>
          </div>
        </header>
      </div>

      <div className="p-8 bg-white shadow-lg rounded-b-lg border">
        <section className="grid grid-cols-2 gap-8 text-xs mb-8">
          <div>
            <p className="font-bold mb-1">Bill To:</p>
            <p>{client.name}</p>
            <p className="whitespace-pre-line">{client.address}</p>
            <p>{client.email}</p>
            <p>{client.phone}</p>
            {client.shippingAddress && <p className="mt-2"><span className="font-bold">Ship To:</span><br/>{client.shippingAddress}</p>}
            {client.projectLocation && <p className="mt-2"><span className="font-bold">Project Location:</span><br/>{client.projectLocation}</p>}
          </div>
          <div className="text-right">
            <p className="font-bold">Date:</p>
            <p>{safeFormat(invoice.invoiceDate, 'MMM d, yyyy')}</p>
            <p className="font-bold mt-2">Due Date:</p>
            <p>{safeFormat(invoice.dueDate, 'MMM d, yyyy')}</p>
            {invoice.poNumber && <p className="mt-2 font-bold">PO #: {invoice.poNumber}</p>}
          </div>
        </section>

        <ConsultingDetails invoice={invoice} t={t} />

        <table className="w-full text-left text-xs mt-4">
          <thead>
            <tr className="border-b">
              <th className="pb-2 font-semibold w-3/5">Service</th>
              <th className="pb-2 font-semibold text-right">Amount</th>
            </tr>
          </thead>
          <tbody>
            {pageItems.map((item) => (
              <tr key={item.id} className="border-b">
                <td className="py-2">{item.name}</td>
                <td className="py-2 text-right">
                  {currencySymbol}
                  {(item.quantity * item.unitPrice).toFixed(2)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {pageIndex === totalPages - 1 && (
          <footer className="mt-8 pt-8 border-t">
            <div className="flex justify-end text-sm">
              <div className="w-1/2">
                <p className="flex justify-between">
                  <span>Subtotal:</span>
                  <span>{currencySymbol}{subtotal.toFixed(2)}</span>
                </p>
                 {discountAmount > 0 && <p className="flex justify-between text-red-600"><span>Discount:</span><span>-{currencySymbol}{discountAmount.toFixed(2)}</span></p>}
                {invoice.summary.shippingCost > 0 && <p className="flex justify-between"><span>Shipping:</span><span>{currencySymbol}{invoice.summary.shippingCost.toFixed(2)}</span></p>}
                <p className="flex justify-between">
                  <span>Tax:</span>
                  <span>{currencySymbol}{taxAmount.toFixed(2)}</span>
                </p>
                <p className="flex justify-between font-bold text-lg mt-4">
                  <span>Total:</span>
                  <span>{currencySymbol}{total.toFixed(2)}</span>
                </p>
                 {(invoice.amountPaid || 0) > 0 && <p className="flex justify-between text-green-600"><span>Amount Paid:</span><span>-{currencySymbol}{(invoice.amountPaid || 0).toFixed(2)}</span></p>}
                <p className="flex justify-between font-bold mt-2 pt-2 border-t">
                  <span>Balance Due:</span>
                  <span>{currencySymbol}{balanceDue.toFixed(2)}</span>
                </p>
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
    </div>
  );
};
// Template 3: Advisory
export const ConsultingTemplate3: React.FC<PageProps> = (props) => {
    const { invoice, pageItems, pageIndex, totalPages, subtotal, taxAmount, discountAmount, total, balanceDue, currencySymbol, t } = props;
    const { business, client } = invoice;
    return (
        <div className={`p-10 font-sans bg-gray-50 ${pageIndex < totalPages - 1 ? 'page-break-after' : ''}`} style={{ minHeight: '1056px', backgroundColor: props.backgroundColor, color: props.textColor }}>
            <div className="bg-white p-8 shadow-lg">
                <header className="flex justify-between items-start mb-8">
                    <div>
                        {business.logoUrl && <Image src={business.logoUrl} alt="Logo" width={90} height={45} className="object-contain mb-2"/>}
                        <h1 className="text-2xl font-bold">{business.name}</h1>
                        <p className="text-xs text-gray-500 whitespace-pre-line">{business.address}</p>
                    </div>
                    <div className="text-right">
                        <h2 className="text-3xl font-extrabold text-gray-400">INVOICE</h2>
                        <p># {invoice.invoiceNumber}</p>
                    </div>
                </header>
                <section className="grid grid-cols-2 gap-8 text-xs mb-8">
                    <div>
                        <p className="font-bold text-gray-500 mb-1">Billed To</p>
                        <p>{client.name}<br/>{client.address}<br/>{client.email}<br/>{client.phone}</p>
                        {client.shippingAddress && <p className="mt-2"><span className="font-bold">Ship To:</span><br/>{client.shippingAddress}</p>}
                        {client.projectLocation && <p className="mt-2"><span className="font-bold">Project Location:</span><br/>{client.projectLocation}</p>}
                    </div>
                    <div className="text-right">
                        <p><span className="font-bold text-gray-500">Date: </span>{safeFormat(invoice.invoiceDate, 'dd-MMM-yyyy')}</p>
                        <p><span className="font-bold text-gray-500">Due Date: </span>{safeFormat(invoice.dueDate, 'dd-MMM-yyyy')}</p>
                        {invoice.poNumber && <p><span className="font-bold text-gray-500">PO #: </span>{invoice.poNumber}</p>}
                    </div>
                </section>
                <ConsultingDetails invoice={invoice} t={t} />
                <main className="flex-grow mt-4">
                    <table className="w-full text-left text-xs">
                        <thead><tr className="bg-gray-100"><th className="p-2 font-bold w-4/5">Service Description</th><th className="p-2 font-bold text-right">Fee</th></tr></thead>
                        <tbody>{pageItems.map(item => (<tr key={item.id} className="border-b"><td className="p-2">{item.name}</td><td className="p-2 text-right">{currencySymbol}{(item.quantity * item.unitPrice).toFixed(2)}</td></tr>))}</tbody>
                    </table>
                </main>
                {pageIndex === totalPages - 1 && (
                <footer className="mt-auto pt-8">
                    <div className="flex justify-end text-sm">
                        <div className="w-1/3 space-y-1">
                            <p className="flex justify-between"><span>Subtotal:</span><span>{currencySymbol}{subtotal.toFixed(2)}</span></p>
                            {discountAmount > 0 && <p className="flex justify-between text-red-500"><span>Discount:</span><span>-{currencySymbol}{discountAmount.toFixed(2)}</span></p>}
                            {invoice.summary.shippingCost > 0 && <p className="flex justify-between"><span>Other Fees:</span><span>{currencySymbol}{invoice.summary.shippingCost.toFixed(2)}</span></p>}
                            <p className="flex justify-between"><span>Tax:</span><span>{currencySymbol}{taxAmount.toFixed(2)}</span></p>
                            <p className="flex justify-between font-bold"><span>Total:</span><span>{currencySymbol}{total.toFixed(2)}</span></p>
                            {(invoice.amountPaid || 0) > 0 && <p className="flex justify-between text-green-600"><span>Paid:</span><span>-{currencySymbol}{(invoice.amountPaid || 0).toFixed(2)}</span></p>}
                            <p className="flex justify-between font-bold text-sm mt-2 pt-2 border-t border-gray-300"><span>Balance Due:</span><span>{currencySymbol}{balanceDue.toFixed(2)}</span></p>
                        </div>
                    </div>
                    <div className="flex justify-between mt-8">
                      <SignatureDisplay signature={business.ownerSignature} label="Authorized Signature" />
                      <SignatureDisplay signature={invoice.clientSignature} label="Client Signature" />
                    </div>
                </footer>
                )}
            </div>
        </div>
    );
};
// Template 4: Modern
export const ConsultingTemplate4: React.FC<PageProps> = (props) => {
    const { invoice, pageItems, pageIndex, totalPages, total, balanceDue, currencySymbol, t, accentColor } = props;
    const { business, client } = invoice;
    return (
        <div className={`font-sans ${pageIndex < totalPages - 1 ? 'page-break-after' : ''}`} style={{ minHeight: '1056px', backgroundColor: props.backgroundColor, color: props.textColor }}>
            <header style={{ backgroundColor: accentColor }} className="text-white p-10 flex justify-between items-center">
                <h1 className="text-3xl font-bold">{business.name}</h1>
                <h2 className="text-xl">Invoice #{invoice.invoiceNumber}</h2>
            </header>
            <div className="p-10">
                <section className="grid grid-cols-2 gap-10 text-sm mb-10">
                    <div>
                        <p className="font-bold mb-1">Billed To</p>
                        <p>{client.name}</p>
                        <p>{client.address}</p>
                        <p>{client.email}</p>
                        <p>{client.phone}</p>
                    </div>
                    <div className="text-right">
                        <p><strong>Date:</strong> {safeFormat(invoice.invoiceDate, 'MM/dd/yyyy')}</p>
                        <p><strong>Due Date:</strong> {safeFormat(invoice.dueDate, 'MM/dd/yyyy')}</p>
                        {invoice.poNumber && <p><strong>PO #:</strong> {invoice.poNumber}</p>}
                    </div>
                </section>
                <ConsultingDetails invoice={invoice} t={t} />
                <main className="flex-grow mt-4">
                    <table className="w-full text-left text-sm">
                        <thead><tr className="bg-gray-100"><th className="p-3 font-bold w-3/5">Service Provided</th><th className="p-3 font-bold text-right">Fee</th></tr></thead>
                        <tbody>{pageItems.map(item => (<tr key={item.id} className="border-b"><td className="p-3">{item.name}</td><td className="p-3 text-right">{currencySymbol}{(item.quantity * item.unitPrice).toFixed(2)}</td></tr>))}</tbody>
                    </table>
                </main>
                {pageIndex === totalPages - 1 && (
                <footer className="mt-10 pt-10 border-t">
                    <div className="flex justify-end text-sm">
                        <div className="w-1/3">
                            <p className="flex justify-between py-1"><span>Total:</span><span>{currencySymbol}{total.toFixed(2)}</span></p>
                            {(invoice.amountPaid || 0) > 0 && <p className="flex justify-between py-1 text-green-600"><span>Paid:</span><span>-{currencySymbol}{(invoice.amountPaid || 0).toFixed(2)}</span></p>}
                            <p className="flex justify-between font-bold text-lg mt-2"><span>Balance Due:</span><span>{currencySymbol}{balanceDue.toFixed(2)}</span></p>
                        </div>
                    </div>
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
// Template 5: Minimal
export const ConsultingTemplate5: React.FC<PageProps> = (props) => {
    const { invoice, pageItems, pageIndex, totalPages, subtotal, taxAmount, balanceDue, currencySymbol, t, accentColor } = props;
    const { business, client } = invoice;
    return (
        <div className={`p-10 font-mono text-sm ${pageIndex < totalPages - 1 ? 'page-break-after' : ''}`} style={{ minHeight: '1056px', backgroundColor: props.backgroundColor, color: props.textColor }}>
            <header className="mb-10">
                <h1 className="text-xl font-bold">{business.name} // INVOICE</h1>
                <p className="text-xs whitespace-pre-line">{business.address}</p>
            </header>
            <section className="mb-10">
                <p>To: {client.name}</p>
                <p>Date: {safeFormat(invoice.invoiceDate, 'yyyy-MM-dd')}</p>
                <p>Ref: {invoice.invoiceNumber}</p>
            </section>
            <ConsultingDetails invoice={invoice} t={t} />
            <main className="flex-grow mt-4">
                <table className="w-full text-left text-xs">
                    <thead><tr><th className="pt-2 pb-2 border-t border-b border-dashed w-4/5">Description</th><th className="pt-2 pb-2 border-t border-b border-dashed text-right">Cost</th></tr></thead>
                    <tbody>{pageItems.map(item => (<tr key={item.id}><td className="py-1">{item.name}</td><td className="py-1 text-right">{currencySymbol}{(item.quantity * item.unitPrice).toFixed(2)}</td></tr>))}</tbody>
                </table>
            </main>
            {pageIndex === totalPages - 1 && (
            <footer className="mt-auto pt-8">
                <div className="flex justify-end text-xs">
                    <div className="w-1/2">
                        <p className="flex justify-between border-t border-dashed pt-2"><span>Subtotal</span><span>{currencySymbol}{subtotal.toFixed(2)}</span></p>
                        <p className="flex justify-between"><span>Tax</span><span>{currencySymbol}{taxAmount.toFixed(2)}</span></p>
                        {(invoice.amountPaid || 0) > 0 && <p className="flex justify-between text-green-600"><span>Paid</span><span>-{currencySymbol}{(invoice.amountPaid || 0).toFixed(2)}</span></p>}
                        <p className="flex justify-between font-bold text-sm mt-2 pt-2 border-t-2 border-black"><span>Total</span><span>{currencySymbol}{balanceDue.toFixed(2)}</span></p>
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
