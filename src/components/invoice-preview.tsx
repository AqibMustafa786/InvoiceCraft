
'use client';

import { useState, useEffect, FC } from 'react';
import type { Invoice, LineItem } from '@/lib/types';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import Image from 'next/image';
import { format, isValid } from 'date-fns';
import locales from '@/lib/locales';

// --- PROPS ---
interface InvoicePreviewProps {
  invoice: Invoice;
  logoUrl: string | null;
  accentColor: string;
  id?: string;
  isPrint?: boolean;
}

interface CommonTemplateProps {
  invoice: Invoice;
  logoUrl: string | null;
  accentColor: string;
  t: any;
  currencySymbol: string;
}

interface PageProps extends CommonTemplateProps {
    pageItems: LineItem[];
    pageIndex: number;
    totalPages: number;
    subtotal: number;
    taxAmount: number;
    discountAmount: number;
    total: number;
    balanceDue: number;
}

const currencySymbols: { [key: string]: string } = {
    USD: '$',
    EUR: '€',
    GBP: '£',
    JPY: '¥',
    PKR: '₨',
};

const safeFormat = (date: Date | string | number, formatString: string) => {
    const d = new Date(date || new Date());
    if (!isValid(d)) return "Invalid Date";
    return format(d, formatString);
}

// --- SHARED COMPONENTS ---
const InvoiceHeader = ({ invoice, logoUrl, accentColor, t }: CommonTemplateProps) => (
    <header className="flex justify-between items-start mb-10" data-element="header">
        <div>
            {logoUrl ? (
                <Image src={logoUrl} alt={`${invoice.companyName} Logo`} width={120} height={40} className="object-contain" data-ai-hint="logo" />
            ) : (
                <h1 className="text-3xl font-bold font-headline" style={{ color: accentColor }}>{invoice.companyName}</h1>
            )}
            <div className="text-muted-foreground text-sm mt-2 space-y-1">
              <p className="whitespace-pre-line">{invoice.companyAddress}</p>
              {invoice.companyPhone && <p>{invoice.companyPhone}</p>}
            </div>
        </div>
        <div className="text-right">
            <h2 className="text-3xl font-bold text-gray-400 uppercase tracking-wider">{t.invoice}</h2>
            <p className="text-muted-foreground mt-1">{invoice.invoiceNumber}</p>
        </div>
    </header>
);

const ClientDetails = ({ invoice, t }: { invoice: Invoice, t: any }) => (
     <section className="flex justify-between mb-10" data-element="client-details">
        <div className="space-y-1">
            <p className="text-sm font-semibold text-gray-500">{t.billTo}</p>
            <p className="font-bold">{invoice.clientName}</p>
            <p className="text-muted-foreground text-sm whitespace-pre-line">{invoice.clientAddress}</p>
        </div>
        <div className="text-right space-y-1">
            <p className="text-sm font-semibold text-gray-500">{t.invoiceDate}</p>
            <p>{safeFormat(new Date(invoice.invoiceDate || new Date()), 'MMMM d, yyyy')}</p>
            <p className="text-sm font-semibold text-gray-500 mt-2">{t.dueDate}</p>
            <p>{safeFormat(new Date(invoice.dueDate || new Date()), 'MMMM d, yyyy')}</p>
        </div>
    </section>
);

const ItemsTable: FC<{ items: LineItem[], t: any, currencySymbol: string, accentColor?: string }> = ({ items, t, currencySymbol, accentColor }) => (
    <section>
        <table className="w-full text-left">
            <thead style={accentColor ? {backgroundColor: accentColor, color: 'white'} : {}} className={accentColor ? '' : "bg-gray-50"} data-element="table-header">
            <tr>
                <th className="p-3 text-sm font-semibold w-1/2">{t.item}</th>
                <th className="p-3 text-sm font-semibold text-center">{t.quantity}</th>
                <th className="p-3 text-sm font-semibold text-right">{t.rate}</th>
                <th className="p-3 text-sm font-semibold text-right">{t.subtotal}</th>
            </tr>
            </thead>
            <tbody>
            {items.map(item => (
                <tr key={item.id} className="border-b" data-element="table-row">
                <td className="p-3 whitespace-pre-line">{item.name || <span className="text-gray-400">{t.itemDescription}</span>}</td>
                <td className="p-3 text-center tabular-nums">{item.quantity}</td>
                <td className="p-3 text-right tabular-nums">{currencySymbol}{(item as any).rate ? (item as any).rate.toFixed(2) : (item as any).unitPrice.toFixed(2)}</td>
                <td className="p-3 text-right tabular-nums font-medium">{currencySymbol}{(item.quantity * ((item as any).rate || (item as any).unitPrice)).toFixed(2)}</td>
                </tr>
            ))}
            </tbody>
        </table>
    </section>
);

const InvoiceFooter: FC<{
    invoice: Invoice, t: any, subtotal: number, taxAmount: number, discountAmount: number, total: number, currencySymbol: string, accentColor: string, balanceDue: number
}> = ({ invoice, t, subtotal, taxAmount, discountAmount, total, currencySymbol, accentColor, balanceDue }) => (
    <div className="avoid-page-break">
        <section className="flex justify-end mt-8">
            <div className="w-full max-w-xs space-y-2">
                <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">{t.subtotal}</span>
                <span className="font-medium tabular-nums">{currencySymbol}{subtotal.toFixed(2)}</span>
                </div>
                {invoice.discount > 0 && (
                    <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">{t.discount} ({invoice.discount}%)</span>
                        <span className="font-medium text-destructive tabular-nums">-{currencySymbol}{discountAmount.toFixed(2)}</span>
                    </div>
                )}
                {invoice.shippingCost > 0 && (
                     <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Shipping Cost</span>
                        <span className="font-medium tabular-nums">{currencySymbol}{invoice.shippingCost.toFixed(2)}</span>
                    </div>
                )}
                {invoice.tax > 0 && (
                <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">{t.tax} ({invoice.tax}%)</span>
                <span className="font-medium tabular-nums">{currencySymbol}{taxAmount.toFixed(2)}</span>
                </div>
                )}
                <Separator className="my-2" />
                <div className="flex justify-between items-center font-bold text-lg">
                <span>{t.total}</span>
                <span className="tabular-nums">{currencySymbol}{total.toFixed(2)}</span>
                </div>
                 {invoice.amountPaid > 0 && (
                    <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Amount Paid</span>
                        <span className="font-medium tabular-nums">-{currencySymbol}{invoice.amountPaid.toFixed(2)}</span>
                    </div>
                )}
                <div className="flex justify-between items-center font-bold text-lg p-3 mt-2 rounded-md" style={{backgroundColor: accentColor, color: 'white'}}>
                    <span>Balance Due</span>
                    <span className="tabular-nums">{currencySymbol}{balanceDue.toFixed(2)}</span>
                </div>
            </div>
        </section>

        {invoice.paymentInstructions && (
            <footer className="mt-10" data-element="footer">
                <p className="text-sm font-semibold text-gray-500">{t.notes}</p>
                <p className="text-sm text-muted-foreground mt-1 whitespace-pre-line">{invoice.paymentInstructions}</p>
            </footer>
        )}
    </div>
);


const InvoicePreviewInternal: FC<InvoicePreviewProps> = ({ invoice, logoUrl, accentColor, id = 'invoice-preview', isPrint = false }) => {
  const t = locales[invoice.language as keyof typeof locales] || locales.en;
  
  const subtotal = invoice.items.reduce((acc, item) => acc + item.quantity * ((item as any).rate || (item as any).unitPrice), 0);
  const taxAmount = (subtotal * invoice.tax) / 100;
  const discountAmount = (subtotal * invoice.discount) / 100;
  const total = subtotal + taxAmount - discountAmount + (invoice.shippingCost || 0);
  const balanceDue = total - (invoice.amountPaid || 0);
  const currencySymbol = currencySymbols[invoice.currency] || '$';


  const previewStyle = {
      '--primary-hsl': accentColor,
      '--primary': accentColor
  } as React.CSSProperties;

  const commonProps = {
    invoice,
    logoUrl,
    accentColor,
    t,
    currencySymbol,
    subtotal,
    taxAmount,
    discountAmount,
    total,
    balanceDue
  };

  return (
    <Card id={id} className="w-full shadow-lg rounded-xl overflow-hidden print-hide" style={previewStyle}>
      <CardContent className="p-0 bg-white text-gray-800 dark:bg-white dark:text-gray-800">
          <ItemsTable items={invoice.items} {...commonProps} />
          <div className="p-8 md:p-10">
            <InvoiceFooter {...commonProps} />
          </div>
      </CardContent>
    </Card>
  );
}

export const ClientInvoicePreview: FC<InvoicePreviewProps> = (props) => {
    const [isClient, setIsClient] = useState(false);
    useEffect(() => {
        setIsClient(true);
    }, []);

    if (!isClient || !props.invoice) {
        return (
            <Card id={props.id} className="w-full shadow-lg rounded-xl overflow-hidden print-hide">
                <CardContent className="p-8 text-center text-muted-foreground">
                    Loading Preview...
                </CardContent>
            </Card>
        );
    }
    return <InvoicePreviewInternal {...props} />;
}


export { InvoicePreviewInternal as InvoicePreview };
