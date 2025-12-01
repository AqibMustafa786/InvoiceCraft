
'use client';

import { useState, useLayoutEffect, useRef, useEffect } from 'react';
import type { Estimate, LineItem } from '@/lib/types';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import Image from 'next/image';
import { format, isValid } from 'date-fns';
import locales from '@/lib/locales';

// --- PROPS ---
interface EstimatePreviewProps {
  estimate: Estimate;
  logoUrl: string | null;
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

const safeFormat = (date: Date | string | number, formatString: string) => {
    const d = new Date(date || new Date());
    if (!isValid(d)) return "Invalid Date";
    return format(d, formatString);
}

const DefaultEstimateTemplate = ({ estimate, logoUrl, accentColor }: { estimate: Estimate, logoUrl: string | null, accentColor: string }) => {
    const subtotal = estimate.items.reduce((acc, item) => acc + item.quantity * item.rate, 0);
    const taxAmount = (subtotal * estimate.tax) / 100;
    const discountAmount = (subtotal * estimate.discount) / 100;
    const total = subtotal + taxAmount - discountAmount + (estimate.shippingCost || 0);
    const currencySymbol = currencySymbols[estimate.currency] || '$';

    return (
        <div className="p-8 md:p-10 font-sans text-gray-800">
            <header className="flex justify-between items-start mb-10">
                <div>
                    {logoUrl ? (
                        <Image src={logoUrl} alt={`${estimate.companyName} Logo`} width={120} height={40} className="object-contain" data-ai-hint="logo" />
                    ) : (
                        <h1 className="text-3xl font-bold font-headline" style={{ color: accentColor }}>{estimate.companyName}</h1>
                    )}
                    <div className="text-muted-foreground text-sm mt-2 space-y-1">
                        <p className="whitespace-pre-line">{estimate.companyAddress}</p>
                        {estimate.companyPhone && <p>{estimate.companyPhone}</p>}
                    </div>
                </div>
                <div className="text-right">
                    <h2 className="text-3xl font-bold text-gray-400 uppercase tracking-wider">Estimate</h2>
                    <p className="text-muted-foreground mt-1">{estimate.estimateNumber}</p>
                </div>
            </header>

            <section className="flex justify-between mb-10">
                <div className="space-y-1">
                    <p className="text-sm font-semibold text-gray-500">ESTIMATE FOR</p>
                    <p className="font-bold">{estimate.clientName}</p>
                    <p className="text-muted-foreground text-sm whitespace-pre-line">{estimate.clientAddress}</p>
                </div>
                <div className="text-right space-y-1">
                    <p className="text-sm font-semibold text-gray-500">Estimate Date</p>
                    <p>{safeFormat(new Date(estimate.estimateDate || new Date()), 'MMMM d, yyyy')}</p>
                    <p className="text-sm font-semibold text-gray-500 mt-2">Valid Until</p>
                    <p>{safeFormat(new Date(estimate.validUntilDate || new Date()), 'MMMM d, yyyy')}</p>
                </div>
            </section>
            
            <section>
                <table className="w-full text-left">
                    <thead style={{ backgroundColor: accentColor, color: 'white' }}>
                        <tr>
                            <th className="p-3 text-sm font-semibold w-1/2">Description</th>
                            <th className="p-3 text-sm font-semibold text-center">Qty</th>
                            <th className="p-3 text-sm font-semibold text-right">Rate</th>
                            <th className="p-3 text-sm font-semibold text-right">Subtotal</th>
                        </tr>
                    </thead>
                    <tbody>
                        {estimate.items.map(item => (
                            <tr key={item.id} className="border-b">
                                <td className="p-3 whitespace-pre-line">{item.name || <span className="text-gray-400">Item description</span>}</td>
                                <td className="p-3 text-center tabular-nums">{item.quantity}</td>
                                <td className="p-3 text-right tabular-nums">{currencySymbol}{item.rate.toFixed(2)}</td>
                                <td className="p-3 text-right tabular-nums font-medium">{currencySymbol}{(item.quantity * item.rate).toFixed(2)}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </section>

             <section className="flex justify-end mt-8">
                <div className="w-full max-w-xs space-y-2">
                    <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Subtotal</span>
                        <span className="font-medium tabular-nums">{currencySymbol}{subtotal.toFixed(2)}</span>
                    </div>
                    {estimate.discount > 0 && (
                        <div className="flex justify-between text-sm">
                            <span className="text-muted-foreground">Discount ({estimate.discount}%)</span>
                            <span className="font-medium text-destructive tabular-nums">-{currencySymbol}{discountAmount.toFixed(2)}</span>
                        </div>
                    )}
                    {estimate.shippingCost > 0 && (
                        <div className="flex justify-between text-sm">
                            <span className="text-muted-foreground">Shipping/Extra</span>
                            <span className="font-medium tabular-nums">{currencySymbol}{estimate.shippingCost.toFixed(2)}</span>
                        </div>
                    )}
                    {estimate.tax > 0 && (
                        <div className="flex justify-between text-sm">
                            <span className="text-muted-foreground">Tax ({estimate.tax}%)</span>
                            <span className="font-medium tabular-nums">{currencySymbol}{taxAmount.toFixed(2)}</span>
                        </div>
                    )}
                    <Separator className="my-2" />
                    <div className="flex justify-between items-center font-bold text-lg p-3 mt-2 rounded-md" style={{ backgroundColor: accentColor, color: 'white' }}>
                        <span>Estimate Total</span>
                        <span className="tabular-nums">{currencySymbol}{total.toFixed(2)}</span>
                    </div>
                </div>
            </section>
            
            {estimate.notes && (
                <footer className="mt-10">
                    <p className="text-sm font-semibold text-gray-500">Notes / Terms</p>
                    <p className="text-sm text-muted-foreground mt-1 whitespace-pre-line">{estimate.notes}</p>
                </footer>
            )}
        </div>
    );
};

const ContractorEstimateTemplate = ({ estimate, logoUrl, accentColor }: { estimate: Estimate, logoUrl: string | null, accentColor: string }) => {
    const subtotal = estimate.items.reduce((acc, item) => acc + item.quantity * item.rate, 0);
    const taxAmount = (subtotal * estimate.tax) / 100;
    const discountAmount = (subtotal * estimate.discount) / 100;
    const total = subtotal + taxAmount - discountAmount + (estimate.shippingCost || 0);
    const currencySymbol = currencySymbols[estimate.currency] || '$';

    return (
        <div className="p-8 font-sans text-gray-800 border-t-8" style={{ borderTopColor: accentColor }}>
            <header className="grid grid-cols-2 gap-10 mb-12">
                <div>
                    {logoUrl ? (
                        <Image src={logoUrl} alt={`${estimate.companyName} Logo`} width={160} height={80} className="object-contain" data-ai-hint="logo" />
                    ) : (
                        <h1 className="text-4xl font-bold">{estimate.companyName}</h1>
                    )}
                     <p className="text-xs text-gray-500 whitespace-pre-line mt-2">{estimate.companyAddress}</p>
                     <p className="text-xs text-gray-500">{estimate.companyPhone}</p>
                </div>
                 <div className="text-right">
                    <h2 className="text-5xl font-light uppercase text-gray-400 tracking-wider">Estimate</h2>
                    <div className="mt-4 text-xs space-y-1">
                        <p><span className="font-bold text-gray-500">Estimate #:</span> {estimate.estimateNumber}</p>
                        <p><span className="font-bold text-gray-500">Date:</span> {safeFormat(new Date(estimate.estimateDate || new Date()), 'M/d/yyyy')}</p>
                        <p><span className="font-bold text-gray-500">Valid Until:</span> {safeFormat(new Date(estimate.validUntilDate || new Date()), 'M/d/yyyy')}</p>
                    </div>
                </div>
            </header>

            <section className="mb-10 bg-gray-50 p-4 rounded-md">
                 <h3 className="font-bold text-sm uppercase text-gray-600 mb-2">Project For:</h3>
                 <p className="font-bold text-lg">{estimate.clientName}</p>
                 <p className="text-sm text-gray-600 whitespace-pre-line">{estimate.clientAddress}</p>
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
                        {estimate.items.map(item => (
                            <tr key={item.id} className="border-b">
                                <td className="p-2 py-3">
                                    <p className="font-semibold">{item.name}</p>
                                    <p className="text-xs text-gray-500">{item.quantity > 1 ? `${item.quantity} units` : ''}</p>
                                </td>
                                <td className="p-2 py-3 text-right font-semibold tabular-nums">{currencySymbol}{(item.quantity * item.rate).toFixed(2)}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </main>

            <section className="flex justify-end mt-6">
                <div className="w-full max-w-sm space-y-2 text-sm">
                    <div className="flex justify-between">
                        <span className="text-gray-600">Subtotal</span>
                        <span className="font-medium tabular-nums">{currencySymbol}{subtotal.toFixed(2)}</span>
                    </div>
                    {estimate.discount > 0 && (
                        <div className="flex justify-between">
                            <span className="text-gray-600">Discount ({estimate.discount}%)</span>
                            <span className="font-medium text-red-600 tabular-nums">-{currencySymbol}{discountAmount.toFixed(2)}</span>
                        </div>
                    )}
                     {estimate.tax > 0 && (
                        <div className="flex justify-between">
                            <span className="text-gray-600">Tax ({estimate.tax}%)</span>
                            <span className="font-medium tabular-nums">{currencySymbol}{taxAmount.toFixed(2)}</span>
                        </div>
                    )}
                     <div className="flex justify-between border-t pt-2 mt-2 font-bold text-xl">
                        <span>Project Total</span>
                        <span className="tabular-nums">{currencySymbol}{total.toFixed(2)}</span>
                    </div>
                </div>
            </section>
            
            {estimate.notes && (
                <footer className="mt-12 border-t pt-6 text-xs text-gray-500">
                    <h4 className="font-bold text-sm text-gray-600 mb-2">Terms & Conditions</h4>
                    <p className="whitespace-pre-line">{estimate.notes}</p>
                </footer>
            )}
        </div>
    );
};


const templates = {
  'default': DefaultEstimateTemplate,
  'contractor': ContractorEstimateTemplate,
};

export function EstimatePreview({ estimate, logoUrl, accentColor, id = 'estimate-preview', isPrint = false }: EstimatePreviewProps) {
  if (!estimate) {
    return null;
  }

  const previewStyle = {
      '--primary-hsl': accentColor,
      '--primary': accentColor
  } as React.CSSProperties;

  const TemplateComponent = templates[estimate.template as keyof typeof templates] || templates.default;

  const renderContent = () => (
    <TemplateComponent
      estimate={estimate}
      logoUrl={logoUrl}
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
    <Card id={id} className="w-full shadow-lg rounded-xl overflow-hidden print-hide bg-card" style={previewStyle}>
      <CardContent className="p-0">
        {renderContent()}
      </CardContent>
    </Card>
  );
}

    