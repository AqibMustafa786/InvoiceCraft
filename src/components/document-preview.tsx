

'use client';

import type { Estimate } from '@/lib/types';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import Image from 'next/image';
import { format, isValid } from 'date-fns';
import { Badge } from './ui/badge';

// --- PROPS ---
interface DocumentPreviewProps {
  document: Estimate;
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

const safeFormat = (date: Date | string | number | undefined, formatString: string) => {
    if (!date) return 'N/A';
    const d = new Date(date);
    if (!isValid(d)) return "Invalid Date";
    return format(d, formatString);
}

const SignatureDisplay = ({ signature, label }: { signature: any, label: string }) => {
    if (!signature?.image) return null;
    return (
        <div className="mt-4">
            <p className="text-xs text-gray-500">{label}</p>
            <Image src={signature.image} alt="Signature" width={150} height={75} className="mt-1 border-b" />
            <p className="text-xs text-gray-600 mt-1">Signed by: {signature.signerName}</p>
            <p className="text-xs text-gray-500">Date: {safeFormat(signature.signedAt, 'MMM d, yyyy, h:mm a')}</p>
        </div>
    )
}

export const ModernTemplate = ({ document }: { document: Estimate }) => {
    const { business, client, lineItems, summary, currency, documentType } = document;
    const currencySymbol = currencySymbols[currency] || '$';

    const documentTitle = documentType === 'quote' ? 'Quote' : 'Estimate';
    const subtotalLessDiscount = summary.subtotal - (summary.discount || 0);
    const taxRate = summary.taxPercentage || 0;

    return (
        <div className="p-8 md:p-10 bg-white text-gray-800 font-sans text-[10pt]">
            <header className="flex justify-between items-start mb-8">
                <div className="w-1/2">
                     {business.logoUrl ? (
                        <Image src={business.logoUrl} alt={`${business.name} Logo`} width={100} height={100} className="rounded-full object-contain bg-orange-400 p-2" data-ai-hint="logo" />
                    ) : (
                        <div className="w-24 h-24 rounded-full bg-orange-400 flex items-center justify-center text-white font-bold text-center text-xs">
                            YOUR BUSINESS LOGO
                        </div>
                    )}
                </div>
                <div className="w-1/2 text-right">
                    <h2 className="text-3xl font-bold mb-4">{documentTitle}</h2>
                    <div className="space-y-0.5 text-xs">
                        <p className="font-bold">{business.name}</p>
                        {business.licenseNumber && <p>{business.licenseNumber}</p>}
                        <p>{business.phone}</p>
                        <p>{business.email}</p>
                        <p className="whitespace-pre-line">{business.address}</p>
                    </div>
                </div>
            </header>

            <section className="flex justify-between items-start mb-8 text-xs">
                 <div className="w-1/3 space-y-0.5">
                    <p className="font-bold mb-1">BILL TO</p>
                    <p className="font-semibold">{client.name}</p>
                    {client.companyName && <p>{client.companyName}</p>}
                    {client.email && <p>{client.email}</p>}
                    {client.phone && <p>{client.phone}</p>}
                    <p className="whitespace-pre-line">{client.address}</p>
                </div>
                <div className="w-1/3 text-right">
                    <div className="flex justify-end">
                        <span className="font-bold w-20">Estimate #</span>
                        <span className="w-24 text-left">{document.estimateNumber}</span>
                    </div>
                    <div className="flex justify-end mt-1">
                        <span className="font-bold w-20">Date</span>
                        <span className="w-24 text-left">{safeFormat(document.estimateDate, 'MM/dd/yyyy')}</span>
                    </div>
                </div>
            </section>
            
            <section>
                <table className="w-full text-left text-xs">
                    <thead className="bg-blue-100 text-gray-700">
                        <tr>
                            <th className="p-2 font-bold w-1/2">Item/Service Description</th>
                            <th className="p-2 font-bold text-right">Quantity</th>
                            <th className="p-2 font-bold text-right">Item Price</th>
                            <th className="p-2 font-bold text-right">Amount</th>
                        </tr>
                    </thead>
                    <tbody>
                        {lineItems.map(item => (
                            <tr key={item.id} className="border-b">
                                <td className="p-2 whitespace-pre-line">{item.name || ''}</td>
                                <td className="p-2 text-right tabular-nums">{item.quantity}</td>
                                <td className="p-2 text-right tabular-nums">{currencySymbol}{item.unitPrice.toFixed(2)}</td>
                                <td className="p-2 text-right tabular-nums">{currencySymbol}{(item.quantity * item.unitPrice).toFixed(2)}</td>
                            </tr>
                        ))}
                         {[...Array(Math.max(0, 7 - lineItems.length))].map((_, i) => (
                            <tr key={`blank-${i}`} className="border-b">
                                <td className="p-2 h-6"></td>
                                <td className="p-2"></td>
                                <td className="p-2"></td>
                                <td className="p-2"></td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </section>

             <section className="flex justify-between items-end mt-6">
                <div className="w-1/2 text-xs text-gray-600">
                    <p className="font-bold mb-1">Notes</p>
                    <p className="whitespace-pre-line">{document.termsAndConditions}</p>
                </div>
                <div className="w-2/5 space-y-1 text-xs">
                    <div className="flex justify-between">
                        <span className="text-gray-600">Estimated Subtotal</span>
                        <span className="font-medium tabular-nums">{currencySymbol}{summary.subtotal.toFixed(2)}</span>
                    </div>
                     {summary.discount > 0 && (
                        <div className="flex justify-between">
                            <span className="text-gray-600">Discount</span>
                            <span className="font-medium tabular-nums">-{currencySymbol}{summary.discount.toFixed(2)}</span>
                        </div>
                    )}
                    <div className="flex justify-between font-bold border-b pb-1 mb-1">
                        <span className="text-gray-800">Subtotal less discount</span>
                        <span className="tabular-nums">{currencySymbol}{subtotalLessDiscount.toFixed(2)}</span>
                    </div>
                    {taxRate > 0 && (
                         <div className="flex justify-between">
                            <span className="text-gray-600">Tax Rate</span>
                            <span className="tabular-nums">{taxRate.toFixed(2)}%</span>
                        </div>
                    )}
                    <div className="flex justify-between">
                        <span className="text-gray-600">Total tax</span>
                        <span className="font-medium tabular-nums">{currencySymbol}{summary.taxAmount.toFixed(2)}</span>
                    </div>
                     {summary.shippingCost > 0 && (
                        <div className="flex justify-between">
                            <span className="text-gray-600">Shipping/Handling</span>
                            <span className="font-medium tabular-nums">{currencySymbol}{summary.shippingCost.toFixed(2)}</span>
                        </div>
                    )}
                    <div className="flex justify-between items-center font-bold text-lg pt-2 mt-2">
                        <span className="uppercase">Estimate Total</span>
                        <span className="tabular-nums">{currencySymbol}{summary.grandTotal.toFixed(2)}</span>
                    </div>
                </div>
            </section>
        </div>
    );
};


const templates = {
  'default': ModernTemplate,
  'contractor': ModernTemplate, // Fallback to new template
};

export function DocumentPreview({ document, accentColor, id = 'document-preview', isPrint = false }: DocumentPreviewProps) {
  if (!document) {
    return null;
  }

  const previewStyle = {
      '--primary-hsl': accentColor,
      '--primary': accentColor
  } as React.CSSProperties;

  // Always use the new ModernTemplate, but keep the structure for potential future templates.
  const TemplateComponent = templates['default'];

  const renderContent = () => (
    <TemplateComponent
      document={document}
    />
  );
  
  if (isPrint) {
    return (
      <div id={id} className="bg-white text-gray-800">
        {renderContent()}
      </div>
    );
  }

  return (
    <Card id={id} className="w-full shadow-lg rounded-xl overflow-hidden print-hide">
      <CardContent className="p-0 bg-white text-gray-800" style={previewStyle}>
        {renderContent()}
      </CardContent>
    </Card>
  );
}
