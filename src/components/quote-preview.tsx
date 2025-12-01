
'use client';

import type { Quote } from '@/lib/types';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import Image from 'next/image';
import { format } from 'date-fns';

// --- PROPS ---
interface QuotePreviewProps {
  quote: Quote;
  accentColor: string;
  id?: string;
  isPrint?: boolean;
}

const currencySymbols: { [key: string]: string } = {
    USD: '$',
    EUR: '€',
    GBP: '£',
    JPY: '¥',
    PKR: '₨',
};

const DefaultQuoteTemplate = ({ quote, accentColor }: { quote: Quote, accentColor: string }) => {
    const { business, client, lineItems, summary, currency } = quote;
    const currencySymbol = currencySymbols[currency] || '$';

    return (
        <div className="p-8 md:p-10 font-sans text-gray-800">
            <header className="flex justify-between items-start mb-10">
                <div>
                    {business.logoUrl ? (
                        <Image src={business.logoUrl} alt={`${business.name} Logo`} width={120} height={40} className="object-contain" data-ai-hint="logo" />
                    ) : (
                        <h1 className="text-3xl font-bold font-headline" style={{ color: accentColor }}>{business.name}</h1>
                    )}
                    <div className="text-muted-foreground text-sm mt-2 space-y-1">
                        <p className="whitespace-pre-line">{business.address}</p>
                        {business.phone && <p>{business.phone}</p>}
                        {business.email && <p>{business.email}</p>}
                        {business.website && <p>{business.website}</p>}
                        {business.licenseNumber && <p>License #: {business.licenseNumber}</p>}
                    </div>
                </div>
                <div className="text-right">
                    <h2 className="text-3xl font-bold text-gray-400 uppercase tracking-wider">Quote</h2>
                    <p className="text-muted-foreground mt-1">{quote.quoteNumber}</p>
                </div>
            </header>

            <section className="grid grid-cols-2 gap-4 mb-10">
                <div className="space-y-1">
                    <p className="text-sm font-semibold text-gray-500">QUOTE FOR</p>
                    <p className="font-bold">{client.name}</p>
                    {client.companyName && <p className="text-sm text-gray-600">{client.companyName}</p>}
                    <p className="text-muted-foreground text-sm whitespace-pre-line">{client.address}</p>
                    {client.phone && <p className="text-muted-foreground text-sm">{client.phone}</p>}
                    {client.email && <p className="text-muted-foreground text-sm">{client.email}</p>}
                </div>
                <div className="text-right space-y-1">
                     <div className="space-y-1">
                        <p className="text-sm font-semibold text-gray-500">Project / Job Title</p>
                        <p>{quote.projectTitle}</p>
                    </div>
                    <div className="space-y-1 mt-2">
                        <p className="text-sm font-semibold text-gray-500">Quote Date</p>
                        <p>{format(quote.quoteDate, 'MMMM d, yyyy')}</p>
                    </div>
                    <div className="space-y-1 mt-2">
                        <p className="text-sm font-semibold text-gray-500">Valid Until</p>
                        <p>{format(quote.validUntilDate, 'MMMM d, yyyy')}</p>
                    </div>
                    {quote.referenceNumber && (
                        <div className="space-y-1 mt-2">
                            <p className="text-sm font-semibold text-gray-500">Reference #</p>
                            <p>{quote.referenceNumber}</p>
                        </div>
                    )}
                </div>
            </section>
            
            <section>
                <table className="w-full text-left">
                    <thead style={{ backgroundColor: accentColor, color: 'white' }}>
                        <tr>
                            <th className="p-3 text-sm font-semibold w-1/2">Description</th>
                            <th className="p-3 text-sm font-semibold text-center">Qty</th>
                            <th className="p-3 text-sm font-semibold text-right">Rate</th>
                            <th className="p-3 text-sm font-semibold text-right">Total</th>
                        </tr>
                    </thead>
                    <tbody>
                        {lineItems.map(item => (
                            <tr key={item.id} className="border-b">
                                <td className="p-3 whitespace-pre-line">{item.name || <span className="text-gray-400">Item description</span>}</td>
                                <td className="p-3 text-center tabular-nums">{item.quantity}</td>
                                <td className="p-3 text-right tabular-nums">{currencySymbol}{item.unitPrice.toFixed(2)}</td>
                                <td className="p-3 text-right tabular-nums font-medium">{currencySymbol}{(item.quantity * item.unitPrice).toFixed(2)}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </section>

             <section className="flex justify-end mt-8">
                <div className="w-full max-w-xs space-y-2">
                    <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Subtotal</span>
                        <span className="font-medium tabular-nums">{currencySymbol}{summary.subtotal.toFixed(2)}</span>
                    </div>
                    {summary.discount > 0 && (
                        <div className="flex justify-between text-sm">
                            <span className="text-muted-foreground">Discount</span>
                            <span className="font-medium text-destructive tabular-nums">-{currencySymbol}{summary.discount.toFixed(2)}</span>
                        </div>
                    )}
                    {summary.shippingCost > 0 && (
                        <div className="flex justify-between text-sm">
                            <span className="text-muted-foreground">Shipping/Extra</span>
                            <span className="font-medium tabular-nums">{currencySymbol}{summary.shippingCost.toFixed(2)}</span>
                        </div>
                    )}
                    {summary.taxPercentage > 0 && (
                        <div className="flex justify-between text-sm">
                            <span className="text-muted-foreground">Tax ({summary.taxPercentage}%)</span>
                            <span className="font-medium tabular-nums">{currencySymbol}{summary.taxAmount.toFixed(2)}</span>
                        </div>
                    )}
                    <Separator className="my-2" />
                    <div className="flex justify-between items-center font-bold text-lg p-3 mt-2 rounded-md" style={{ backgroundColor: accentColor, color: 'white' }}>
                        <span>Quote Total</span>
                        <span className="tabular-nums">{currencySymbol}{summary.grandTotal.toFixed(2)}</span>
                    </div>
                </div>
            </section>
            
            {quote.termsAndConditions && (
                <footer className="mt-10">
                    <p className="text-sm font-semibold text-gray-500">Terms & Conditions</p>
                    <p className="text-sm text-muted-foreground mt-1 whitespace-pre-line">{quote.termsAndConditions}</p>
                </footer>
            )}
        </div>
    );
};

const ContractorQuoteTemplate = ({ quote, accentColor }: { quote: Quote, accentColor: string }) => {
    const { business, client, lineItems, summary, currency } = quote;
    const currencySymbol = currencySymbols[currency] || '$';

    return (
        <div className="p-8 font-sans text-gray-800 border-t-8" style={{ borderTopColor: accentColor }}>
            <header className="grid grid-cols-2 gap-10 mb-12">
                <div>
                    {business.logoUrl ? (
                        <Image src={business.logoUrl} alt={`${business.name} Logo`} width={160} height={80} className="object-contain" data-ai-hint="logo" />
                    ) : (
                        <h1 className="text-4xl font-bold">{business.name}</h1>
                    )}
                     <div className="text-xs text-gray-500 whitespace-pre-line mt-2">
                        <p>{business.address}</p>
                        <p>{business.phone}</p>
                        {business.licenseNumber && <p>Lic #: {business.licenseNumber}</p>}
                     </div>
                </div>
                 <div className="text-right">
                    <h2 className="text-5xl font-light uppercase text-gray-400 tracking-wider">Quote</h2>
                    <div className="mt-4 text-xs space-y-1">
                        <p><span className="font-bold text-gray-500">Quote #:</span> {quote.quoteNumber}</p>
                        <p><span className="font-bold text-gray-500">Date:</span> {format(quote.quoteDate, 'M/d/yyyy')}</p>
                        <p><span className="font-bold text-gray-500">Valid Until:</span> {format(quote.validUntilDate, 'M/d/yyyy')}</p>
                    </div>
                </div>
            </header>

            <section className="mb-10 bg-gray-50 p-4 rounded-md">
                 <h3 className="font-bold text-sm uppercase text-gray-600 mb-2">Project For:</h3>
                 <p className="font-bold text-lg">{client.name}</p>
                 <p className="text-sm text-gray-600 whitespace-pre-line">{client.address}</p>
            </section>
            
             <main>
                <table className="w-full text-left">
                    <thead>
                        <tr className="border-b-2 border-gray-300">
                            <th className="p-2 pb-3 text-sm font-bold uppercase text-gray-500 w-full">Description of Work</th>
                            <th className="p-2 pb-3 text-sm font-bold uppercase text-gray-500 text-right">Cost</th>
                        </tr>
                    </thead>
                    <tbody>
                        {lineItems.map(item => (
                            <tr key={item.id} className="border-b">
                                <td className="p-2 py-3">
                                    <p className="font-semibold whitespace-pre-line">{item.name}</p>
                                    {item.quantity > 1 && <p className="text-xs text-gray-500">{item.quantity} units</p>}
                                </td>
                                <td className="p-2 py-3 text-right font-semibold tabular-nums">{currencySymbol}{(item.quantity * item.unitPrice).toFixed(2)}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </main>

            <section className="flex justify-end mt-6">
                <div className="w-full max-w-sm space-y-2 text-sm">
                    <div className="flex justify-between">
                        <span className="text-gray-600">Subtotal</span>
                        <span className="font-medium tabular-nums">{currencySymbol}{summary.subtotal.toFixed(2)}</span>
                    </div>
                    {summary.discount > 0 && (
                        <div className="flex justify-between">
                            <span className="text-gray-600">Discount</span>
                            <span className="font-medium text-red-600 tabular-nums">-{currencySymbol}{summary.discount.toFixed(2)}</span>
                        </div>
                    )}
                     {summary.taxPercentage > 0 && (
                        <div className="flex justify-between">
                            <span className="text-gray-600">Tax ({summary.taxPercentage}%)</span>
                            <span className="font-medium tabular-nums">{currencySymbol}{summary.taxAmount.toFixed(2)}</span>
                        </div>
                    )}
                     <div className="flex justify-between border-t pt-2 mt-2 font-bold text-xl">
                        <span>Project Total</span>
                        <span className="tabular-nums">{currencySymbol}{summary.grandTotal.toFixed(2)}</span>
                    </div>
                </div>
            </section>
            
            {quote.termsAndConditions && (
                <footer className="mt-12 border-t pt-6 text-xs text-gray-500">
                    <h4 className="font-bold text-sm text-gray-600 mb-2">Terms & Conditions</h4>
                    <p className="whitespace-pre-line">{quote.termsAndConditions}</p>
                </footer>
            )}
            
            <div className="mt-16 text-xs text-gray-500 text-center">
                <p>Thank you for the opportunity to quote this project.</p>
                <p className="mt-4 font-bold">Client Signature: _________________________ Date: __________</p>
            </div>
        </div>
    );
};


const templates = {
  'default': DefaultQuoteTemplate,
  'contractor': ContractorQuoteTemplate,
};

export function QuotePreview({ quote, accentColor, id = 'quote-preview', isPrint = false }: QuotePreviewProps) {
  if (!quote) {
    return null;
  }

  const previewStyle = {
      '--primary-hsl': accentColor,
      '--primary': accentColor
  } as React.CSSProperties;

  const TemplateComponent = templates[quote.template as keyof typeof templates] || templates.default;

  const renderContent = () => (
    <TemplateComponent
      quote={quote}
      accentColor={accentColor}
    />
  );
  
  if (isPrint) {
    return (
      <div id={id} className="bg-white text-gray-800" style={previewStyle}>
        {renderContent()}
      </div>
    );
  }

  return (
    <Card id={id} className="w-full shadow-lg rounded-xl overflow-hidden print-hide bg-card/50 backdrop-blur-lg border border-border/30" style={previewStyle}>
      <CardContent className="p-0">
        {renderContent()}
      </CardContent>
    </Card>
  );
}
