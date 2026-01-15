
'use client';

import React from 'react';
import type { Invoice, LineItem } from '@/lib/types';
import { format, isValid } from 'date-fns';
import { CategorySpecificDetails } from './category-specific-details';

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

export const RealEstateDetails: React.FC<{ invoice: Invoice, t: any }> = ({ invoice, t }) => {
    if (!invoice.realEstate) return null;
    const { realEstate } = invoice;
    const hasDetails = Object.values(realEstate).some(val => val !== null && val !== '');
    if (!hasDetails) {
        return (
            <section className="my-4 text-xs">
                <p className="font-bold text-gray-500 mb-2 border-b">{t.propertyDetails || 'Property Details'}</p>
            </section>
        );
    }
    
    return (
        <section className="my-4 text-xs">
            <p className="font-bold text-gray-500 mb-2 border-b">{t.propertyDetails || 'Property Details'}</p>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-x-4 gap-y-1">
                {realEstate.propertyAddress && <p><span className="font-semibold text-gray-600">{t.property || 'Property'}:</span> {realEstate.propertyAddress}</p>}
                {realEstate.unitNumber && <p><span className="font-semibold text-gray-600">{t.unit || 'Unit'}:</span> {realEstate.unitNumber}</p>}
                {realEstate.leaseTerm && <p><span className="font-semibold text-gray-600">{t.leaseTerm || 'Lease Term'}:</span> {realEstate.leaseTerm}</p>}
                {realEstate.tenantName && <p><span className="font-semibold text-gray-600">{t.tenant || 'Tenant'}:</span> {realEstate.tenantName}</p>}
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
    const { invoice, pageItems, pageIndex, totalPages, subtotal, taxAmount, discountAmount, total, balanceDue, currencySymbol, t, accentColor, textColor } = props;
    const { business, client } = invoice;
    const docTitle = (t.invoice || 'INVOICE').toUpperCase();

    return (
        <div className={`p-10 font-sans ${pageIndex < totalPages - 1 ? 'page-break-after' : ''}`} style={{ minHeight: '1056px', backgroundColor: props.backgroundColor, color: textColor }}>
            <header className="flex justify-between items-start mb-8">
                {business.logoUrl ? <Image src={business.logoUrl} alt="Logo" width={100} height={100} className="object-contain" /> : <h1 className="text-3xl font-bold">{business.name}</h1>}
                <div className="text-right">
                    <h2 className="text-4xl font-bold" style={{color: accentColor}}>{docTitle.toUpperCase()}</h2>
                    <p>#{invoice.invoiceNumber}</p>
                </div>
            </header>
            <section className="grid grid-cols-2 gap-8 text-sm mb-8">
                <div>
                    <p className="font-bold text-gray-500">{(t.tenantInfo || 'Tenant Information').toUpperCase()}</p>
                    <p>{client.name}</p>
                    <p>{client.address}</p>
                </div>
                <div className="text-right">
                    <p className="font-bold text-gray-500">{(t.date || 'Date').toUpperCase()}</p>
                    <p>{safeFormat(invoice.invoiceDate, 'MMMM d, yyyy')}</p>
                </div>
            </section>
            <CategorySpecificDetails invoice={invoice} t={t} />
            <main className="flex-grow mt-4">
                <table className="w-full text-left text-sm">
                    <thead><tr className="border-b-2"><th className="pb-2 font-bold w-3/5">{(t.charges || 'Charges').toUpperCase()}</th><th className="pb-2 font-bold text-right">{(t.amount || 'Amount').toUpperCase()}</th></tr></thead>
                    <tbody>
                        {pageItems.map(item => (
                            <tr key={item.id} className="border-b">
                                <td className="py-2">{item.name}</td>
                                <td className="py-2 text-right">{currencySymbol}{(item.quantity * item.unitPrice).toFixed(2)}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </main>
            {pageIndex === totalPages - 1 && (
            <footer className="mt-auto pt-8">
                <div className="flex justify-end text-right text-sm">
                    <div className="w-1/2">
                        <p className="flex justify-between py-1"><span className="text-gray-600">{(t.totalCharges || 'Total Charges')}:</span><span>{currencySymbol}{subtotal.toFixed(2)}</span></p>
                        {discountAmount > 0 && <p className="flex justify-between py-1 text-red-500"><span>{(t.discount || 'Discount')}:</span><span>-{currencySymbol}{discountAmount.toFixed(2)}</span></p>}
                        {invoice.summary.shippingCost > 0 && <p className="flex justify-between py-1"><span>{(t.shipping || 'Other Fees')}:</span><span>{currencySymbol}{invoice.summary.shippingCost.toFixed(2)}</span></p>}
                        <p className="flex justify-between py-1"><span className="text-gray-600">{(t.tax || 'Tax')}:</span><span>{currencySymbol}{taxAmount.toFixed(2)}</span></p>
                        <p className="flex justify-between font-bold text-xl mt-2 pt-2 border-t-2">
                            <span>{(t.balanceDue || 'Balance Due')}:</span>
                            <span>{currencySymbol}{total.toFixed(2)}</span>
                        </p>
                         {(invoice.amountPaid || 0) > 0 && <p className="flex justify-between font-bold text-green-600"><span>{t.amountPaid || 'Amount Paid'}:</span><span>-{currencySymbol}{(invoice.amountPaid || 0).toFixed(2)}</span></p>}
                         <p className="flex justify-between font-bold bg-gray-100 p-2 mt-1"><span>{t.balanceDue || 'Balance Due'}:</span><span>{currencySymbol}{balanceDue.toFixed(2)}</span></p>
                    </div>
                </div>
            </footer>
            )}
        </div>
    );
}

export const RealEstateTemplate2: React.FC<PageProps> = (props) => {
    const { invoice, pageItems, pageIndex, totalPages, subtotal, taxAmount, discountAmount, total, balanceDue, currencySymbol, t, accentColor, textColor } = props;
    const { business, client } = invoice;
    const docTitle = (t.invoice || 'INVOICE').toUpperCase();
    return (
      <div className={`p-10 bg-gray-50 font-sans ${pageIndex < totalPages - 1 ? 'page-break-after' : ''}`} style={{ minHeight: '1056px', backgroundColor: props.backgroundColor, color: props.textColor }}>
        <header className="flex justify-between items-center mb-8 pb-4 border-b-2">
            <h1 className="text-2xl font-bold">{business.name}</h1>
            <h2 className="text-2xl font-light text-gray-500">{docTitle}</h2>
        </header>
        <section className="grid grid-cols-2 gap-8 text-sm mb-8">
            <div><p><strong>{t.to || 'To'}:</strong> {client.name}</p><p>{client.address}</p></div>
            <div className="text-right"><p><strong>#:</strong> {invoice.invoiceNumber}</p><p><strong>{t.date || 'Date'}:</strong> {safeFormat(invoice.invoiceDate, 'MMM dd, yyyy')}</p></div>
        </section>
        <CategorySpecificDetails invoice={invoice} t={t} />
        <main className="flex-grow mt-4">
            <table className="w-full text-left text-sm">
                <thead><tr className="bg-gray-200"><th className="p-2 w-4/5 font-bold">{t.description || 'DESCRIPTION'}</th><th className="p-2 font-bold text-right">{t.total || 'TOTAL'}</th></tr></thead>
                <tbody>{pageItems.map(item => (<tr key={item.id} className="border-b"><td className="p-2">{item.name}</td><td className="p-2 text-right">{currencySymbol}{(item.quantity * item.unitPrice).toFixed(2)}</td></tr>))}</tbody>
            </table>
        </main>
        {pageIndex === totalPages - 1 && (
        <footer className="mt-auto pt-8">
            <div className="flex justify-end text-sm">
                <div className="w-1/3">
                    <p className="flex justify-between"><span>{t.subtotal || 'Subtotal'}</span><span>{currencySymbol}{subtotal.toFixed(2)}</span></p>
                    {discountAmount > 0 && <p className="flex justify-between text-red-600"><span>{t.discount || 'Discount'}</span><span>-{currencySymbol}{discountAmount.toFixed(2)}</span></p>}
                    {invoice.summary.shippingCost > 0 && <p className="flex justify-between"><span>{t.shipping || 'Shipping'}</span><span>{currencySymbol}{invoice.summary.shippingCost.toFixed(2)}</span></p>}
                    <p className="flex justify-between border-b pb-1"><span>{t.tax || 'Tax'}</span><span>{currencySymbol}{taxAmount.toFixed(2)}</span></p>
                    <p className="flex justify-between font-bold mt-2"><span>{t.total || 'Total'}</span><span>{currencySymbol}{total.toFixed(2)}</span></p>
                    {(invoice.amountPaid || 0) > 0 && <p className="flex justify-between font-bold text-green-600"><span>{t.amountPaid || 'Amount Paid'}</span><span>-{currencySymbol}{(invoice.amountPaid || 0).toFixed(2)}</span></p>}
                    <p className="flex justify-between font-bold bg-gray-200 p-1"><span>{t.balanceDue || 'Balance Due'}</span><span>{currencySymbol}{balanceDue.toFixed(2)}</span></p>
                </div>
            </div>
        </footer>
        )}
      </div>
    );
};
export const RealEstateTemplate3: React.FC<PageProps> = (props) => {
  const { invoice, pageItems, pageIndex, totalPages, subtotal, taxAmount, discountAmount, total, balanceDue, currencySymbol, t, textColor, accentColor } = props;
  const { business, client } = invoice;
  const docTitle = (t.invoice || 'Invoice');
  return (
      <div className={`p-10 font-sans bg-white ${pageIndex < totalPages - 1 ? 'page-break-after' : ''}`} style={{ minHeight: '1056px', backgroundColor: props.backgroundColor, color: props.textColor }}>
          <header className="text-center mb-8">
              <h1 className="text-3xl font-bold">{business.name}</h1>
              <p className="text-xs text-gray-500">{business.address}</p>
          </header>
          
          <div className="w-full h-px bg-gray-200 mb-8"></div>

          <section className="grid grid-cols-2 gap-8 mb-8 text-sm">
              <div>
                  <p className="font-semibold text-gray-600">{t.billedTo || 'Billed To'}</p>
                  <p className="font-bold text-lg" style={{color: accentColor}}>{client.name}</p>
                  <p className="text-gray-500">{client.address}</p>
              </div>
              <div className="text-right">
                  <h2 className="text-2xl font-bold">{docTitle}</h2>
                  <p className="text-sm text-gray-500">#{invoice.invoiceNumber}</p>
                  <p className="text-sm mt-2"><strong>{t.date || 'Date'}:</strong> {safeFormat(invoice.invoiceDate, 'MMMM d, yyyy')}</p>
                  <p className="text-sm"><strong>{t.dueDate || 'Due'}:</strong> {safeFormat(invoice.dueDate, 'MMMM d, yyyy')}</p>
              </div>
          </section>
          
          <CategorySpecificDetails invoice={invoice} t={t} />

          <main className="flex-grow mt-4">
              <table className="w-full text-left text-sm">
                  <thead className="bg-gray-50">
                      <tr>
                          <th className="p-3 font-semibold text-gray-600">{(t.service || 'Service').toUpperCase()}</th>
                          <th className="p-3 font-semibold text-right text-gray-600">{(t.amount || 'Amount').toUpperCase()}</th>
                      </tr>
                  </thead>
                  <tbody>
                      {pageItems.map(item => (
                          <tr key={item.id} className="border-b">
                              <td className="p-3">
                                  <p className="font-medium">{item.name}</p>
                                  <p className="text-xs text-gray-500">{item.description}</p>
                              </td>
                              <td className="p-3 text-right">{currencySymbol}{(item.quantity * item.unitPrice).toFixed(2)}</td>
                          </tr>
                      ))}
                  </tbody>
              </table>
          </main>
          {pageIndex === totalPages - 1 && (
          <footer className="mt-auto pt-8">
              <div className="flex justify-end text-sm">
                  <div className="w-2/5">
                      <div className="flex justify-between py-1 text-gray-600"><span>{t.subtotal || 'Subtotal'}</span><span>{currencySymbol}{subtotal.toFixed(2)}</span></div>
                      {discountAmount > 0 && <div className="flex justify-between py-1 text-red-500"><span>{t.discount || 'Discount'}</span><span>-{currencySymbol}{discountAmount.toFixed(2)}</span></div>}
                      {invoice.summary.shippingCost > 0 && <div className="flex justify-between py-1 text-gray-600"><span>{t.shipping || 'Other Fees'}</span><span>{currencySymbol}{invoice.summary.shippingCost.toFixed(2)}</span></div>}
                      <div className="flex justify-between py-1 text-gray-600"><span>{t.tax || 'Tax'}</span><span>{currencySymbol}{taxAmount.toFixed(2)}</span></div>
                      <div className="flex justify-between font-bold text-xl mt-4 pt-2 border-t"><span>{t.totalDue || 'Total Due'}</span><span>{currencySymbol}{total.toFixed(2)}</span></div>
                      {(invoice.amountPaid || 0) > 0 && <div className="flex justify-between font-bold text-green-600"><span>{t.amountPaid || 'Amount Paid'}</span><span>-{currencySymbol}{(invoice.amountPaid || 0).toFixed(2)}</span></div>}
                      <div className="flex justify-between font-bold bg-gray-100 p-2 mt-1"><span>{t.balanceDue || 'Balance Due'}</span><span>{currencySymbol}{balanceDue.toFixed(2)}</span></div>
                  </div>
              </div>
          </footer>
          )}
      </div>
  );
};
export const RealEstateTemplate4: React.FC<PageProps> = (props) => {
    const { invoice, pageItems, pageIndex, totalPages, subtotal, taxAmount, discountAmount, total, balanceDue, currencySymbol, t, accentColor, textColor } = props;
    const { business, client } = invoice;
    const docTitle = (t.invoice || 'INVOICE').toUpperCase();

    return (
        <div className={`flex ${pageIndex < totalPages - 1 ? 'page-break-after' : ''}`} style={{ minHeight: '1056px', backgroundColor: props.backgroundColor, color: textColor }}>
            <div className="w-1/4 p-8 text-white" style={{backgroundColor: accentColor || '#047857'}}>
                <h1 className="text-3xl font-bold">{docTitle}</h1>
                <div className="mt-10 text-xs space-y-4">
                    <div><p className="opacity-70">{t.date || 'DATE'}</p><p>{safeFormat(invoice.invoiceDate, 'yyyy-MM-dd')}</p></div>
                    <div><p className="opacity-70">#</p><p>{invoice.invoiceNumber}</p></div>
                </div>
            </div>
            <div className="w-3/4 p-10">
                <header className="text-right mb-10"><h2 className="text-2xl font-bold">{business.name}</h2><p className="text-xs">{business.address}</p></header>
                <section className="mb-10 text-sm"><p><strong>{t.to || 'To'}:</strong> {client.name}</p></section>
                <CategorySpecificDetails invoice={invoice} t={t} />
                <main className="flex-grow mt-4">
                    <table className="w-full text-left text-sm">
                        <thead><tr className="bg-gray-100"><th className="p-2 font-bold w-4/5">{t.description || 'Description'}</th><th className="p-2 font-bold text-right">{t.total || 'Total'}</th></tr></thead>
                        <tbody>{pageItems.map(item => (<tr key={item.id} className="border-b"><td className="p-2">{item.name}</td><td className="p-2 text-right">{currencySymbol}{(item.quantity * item.unitPrice).toFixed(2)}</td></tr>))}</tbody>
                    </table>
                </main>
                {pageIndex === totalPages - 1 && (
                <footer className="mt-auto pt-8">
                    <div className="text-right text-2xl font-bold">{t.totalDue || 'Total Due'}: {currencySymbol}{total.toFixed(2)}</div>
                </footer>
                )}
            </div>
        </div>
    );
};
export const RealEstateTemplate5: React.FC<PageProps> = (props) => {
    const { invoice, pageItems, pageIndex, totalPages, subtotal, taxAmount, discountAmount, total, balanceDue, currencySymbol, t, accentColor, textColor } = props;
    const { business, client } = invoice;
    const docTitle = (t.invoice || 'Invoice');

    return (
        <div className={`p-10 font-serif ${pageIndex < totalPages - 1 ? 'page-break-after' : ''}`} style={{ minHeight: '1056px', backgroundColor: '#FDFBF7', color: '#5A4A42' }}>
            <header className="text-center mb-10">
                <h1 className="text-2xl font-bold">{business.name}</h1>
                <p className="text-xs">{business.address} | {business.phone}</p>
            </header>
            <h2 className="text-center text-xl mb-8">{docTitle.toUpperCase()}</h2>
            <section className="text-xs mb-8">
                <p><strong>{t.to || 'To'}:</strong> {client.name}</p>
                <p><strong>{t.no || 'No'}:</strong> {invoice.invoiceNumber}</p>
                <p><strong>{t.date || 'Date'}:</strong> {safeFormat(invoice.invoiceDate, 'MM/dd/yyyy')}</p>
            </section>
            <CategorySpecificDetails invoice={invoice} t={t} />
            <main className="flex-grow mt-4">
                <table className="w-full text-left text-xs">
                    <thead><tr><th className="py-2 border-b-2 w-3/4">{t.description || 'DESCRIPTION'}</th><th className="py-2 border-b-2 text-right">{t.amount || 'AMOUNT'}</th></tr></thead>
                    <tbody>{pageItems.map(item => (<tr key={item.id}><td className="py-2 border-b">{item.name}</td><td className="py-2 border-b text-right">{currencySymbol}{(item.quantity * item.unitPrice).toFixed(2)}</td></tr>))}</tbody>
                </table>
            </main>
            {pageIndex === totalPages - 1 && (
            <footer className="mt-auto pt-8">
                <div className="flex justify-end text-sm">
                    <div className="w-1/3">
                        <p className="flex justify-between"><span>{t.subtotal || 'Subtotal'}</span><span>{currencySymbol}{subtotal.toFixed(2)}</span></p>
                        {discountAmount > 0 && <p className="flex justify-between text-red-600"><span>{t.discount || 'Discount'}</span><span>-{currencySymbol}{discountAmount.toFixed(2)}</span></p>}
                        {invoice.summary.shippingCost > 0 && <p className="flex justify-between"><span>{t.shipping || 'Shipping'}</span><span>{currencySymbol}{invoice.summary.shippingCost.toFixed(2)}</span></p>}
                        <p className="flex justify-between"><span>{t.tax || 'Tax'}</span><span>{currencySymbol}{taxAmount.toFixed(2)}</span></p>
                        <p className="flex justify-between font-bold mt-2 pt-2 border-t"><span>{t.total || 'TOTAL'}</span><span>{currencySymbol}{total.toFixed(2)}</span></p>
                         {(invoice.amountPaid || 0) > 0 && <p className="flex justify-between font-bold text-green-600"><span>{t.amountPaid || 'Amount Paid'}</span><span>-{currencySymbol}{(invoice.amountPaid || 0).toFixed(2)}</span></p>}
                         <p className="flex justify-between font-bold bg-gray-200 p-1"><span>{t.balanceDue || 'Balance Due'}</span><span>{currencySymbol}{balanceDue.toFixed(2)}</span></p>
                    </div>
                </div>
            </footer>
            )}
        </div>
    );
};
