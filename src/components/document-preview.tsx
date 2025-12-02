

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

const safeFormat = (date: Date | string | number | undefined | null, formatString: string) => {
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

const HomeRemodelingPreview = ({ data }: { data: Estimate['homeRemodeling'] }) => {
    if (!data) return null;
    return (
        <div className="grid grid-cols-2 gap-x-8 gap-y-2 mt-4 text-xs">
            <div><span className="font-bold text-gray-600">Project Type:</span> {data.projectType}</div>
            <div><span className="font-bold text-gray-600">Property Type:</span> {data.propertyType}</div>
            {data.squareFootage && <div><span className="font-bold text-gray-600">Sq. Footage:</span> {data.squareFootage} sq ft</div>}
            <div className="col-span-2"><span className="font-bold text-gray-600">Rooms:</span> {data.roomsIncluded}</div>
            <div><span className="font-bold text-gray-600">Material Grade:</span> {data.materialGrade}</div>
            <div><span className="font-bold text-gray-600">Demolition:</span> {data.demolitionRequired ? 'Yes' : 'No'}</div>
            <div><span className="font-bold text-gray-600">Permit:</span> {data.permitRequired ? 'Yes' : 'No'}</div>
            {data.expectedStartDate && <div><span className="font-bold text-gray-600">Starts:</span> {safeFormat(data.expectedStartDate, 'MMM d, yyyy')}</div>}
            {data.expectedCompletionDate && <div><span className="font-bold text-gray-600">Ends:</span> {safeFormat(data.expectedCompletionDate, 'MMM d, yyyy')}</div>}
            {data.specialInstructions && <div className="col-span-2"><span className="font-bold text-gray-600">Instructions:</span> <span className="whitespace-pre-line">{data.specialInstructions}</span></div>}
        </div>
    )
}

const RoofingPreview = ({ data }: { data: Estimate['roofing'] }) => {
    if (!data) return null;
    return (
        <div className="grid grid-cols-2 gap-x-8 gap-y-2 mt-4 text-xs">
            <div><span className="font-bold text-gray-600">Roof Material:</span> {data.roofMaterial}</div>
            {data.roofSize && <div><span className="font-bold text-gray-600">Roof Size:</span> {data.roofSize} sq ft</div>}
            <div><span className="font-bold text-gray-600">Roof Pitch:</span> {data.roofPitch}</div>
            {data.layersToRemove && <div><span className="font-bold text-gray-600">Layers to Remove:</span> {data.layersToRemove}</div>}
            <div><span className="font-bold text-gray-600">Underlayment:</span> {data.underlaymentType}</div>
            <div><span className="font-bold text-gray-600">Ventilation:</span> {data.ventilationSystem}</div>
            {data.roofAge && <div><span className="font-bold text-gray-600">Roof Age:</span> {data.roofAge} years</div>}
            <div><span className="font-bold text-gray-600">Flashing Replacement:</span> {data.flashingReplacement ? 'Yes' : 'No'}</div>
            <div><span className="font-bold text-gray-600">Gutter Repair:</span> {data.gutterRepairNeeded ? 'Yes' : 'No'}</div>
            <div><span className="font-bold text-gray-600">Inspection Required:</span> {data.inspectionRequired ? 'Yes' : 'No'}</div>
        </div>
    )
}

const HvacPreview = ({ data }: { data: Estimate['hvac'] }) => {
    if (!data) return null;
    return (
        <div className="grid grid-cols-2 gap-x-8 gap-y-2 mt-4 text-xs">
            <div><span className="font-bold text-gray-600">Service Type:</span> {data.serviceType}</div>
            <div><span className="font-bold text-gray-600">System Type:</span> {data.systemType}</div>
            {data.unitSize && <div><span className="font-bold text-gray-600">Unit Size:</span> {data.unitSize} {data.systemType === 'AC' ? 'Tons' : 'BTU'}</div>}
            {data.seerRating && <div><span className="font-bold text-gray-600">SEER Rating:</span> {data.seerRating}</div>}
            <div><span className="font-bold text-gray-600">Furnace Type:</span> {data.furnaceType}</div>
            <div><span className="font-bold text-gray-600">Thermostat:</span> {data.thermostatType}</div>
            <div><span className="font-bold text-gray-600">Ductwork:</span> {data.ductworkRequired ? 'Required' : 'Not Required'}</div>
            {data.refrigerantType && <div><span className="font-bold text-gray-600">Refrigerant:</span> {data.refrigerantType}</div>}
            {data.existingSystemCondition && <div className="col-span-2"><span className="font-bold text-gray-600">Existing System:</span> {data.existingSystemCondition}</div>}
        </div>
    )
}

const PlumbingPreview = ({ data }: { data: Estimate['plumbing'] }) => {
    if (!data) return null;
    return (
        <div className="grid grid-cols-2 gap-x-8 gap-y-2 mt-4 text-xs">
            <div><span className="font-bold text-gray-600">Service Type:</span> {data.serviceType}</div>
            <div><span className="font-bold text-gray-600">Fixture:</span> {data.fixtureType}</div>
            <div><span className="font-bold text-gray-600">Pipe Material:</span> {data.pipeMaterial}</div>
            <div><span className="font-bold text-gray-600">Floor Level:</span> {data.floorLevel}</div>
            <div><span className="font-bold text-gray-600">Emergency:</span> {data.emergencyService ? 'Yes' : 'No'}</div>
            <div><span className="font-bold text-gray-600">Pressure Issue:</span> {data.waterPressureIssue ? 'Yes' : 'No'}</div>
            {data.leakLocation && <div className="col-span-2"><span className="font-bold text-gray-600">Leak Location:</span> {data.leakLocation}</div>}
            {data.estimatedRepairTime && <div><span className="font-bold text-gray-600">Est. Time:</span> {data.estimatedRepairTime}</div>}
        </div>
    )
}

export const ModernTemplate = ({ document }: { document: Estimate }) => {
    const { business, client, lineItems, summary, currency, documentType, category, homeRemodeling, roofing, hvac, plumbing } = document;
    const currencySymbol = currencySymbols[currency] || '$';

    const documentTitle = category === 'Generic' ? (documentType === 'quote' ? 'Quote' : 'Estimate') : category;
    const subtotalLessDiscount = summary.subtotal - (summary.discount || 0);
    const taxRate = summary.taxPercentage || 0;

    return (
        <div className="p-8 md:p-10 bg-white text-gray-800 font-sans text-[10pt]">
            <header className="flex justify-between items-start mb-8">
                <div className="w-1/2">
                     {business.logoUrl ? (
                        <Image src={business.logoUrl} alt={`${business.name} Logo`} width={100} height={100} className="object-contain" data-ai-hint="logo" />
                    ) : (
                        <h2 className="text-xl font-bold">{business.name}</h2>
                    )}
                </div>
                <div className="w-1/2 text-right">
                    <h2 className="text-3xl font-bold mb-4">{documentTitle}</h2>
                    <div className="space-y-0.5 text-xs">
                        <p className="font-bold">{business.name}</p>
                        {business.licenseNumber && <p>Lic #: {business.licenseNumber}</p>}
                        {business.taxId && <p>Tax ID: {business.taxId}</p>}
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
                <div className="w-1/3 space-y-0.5">
                    {client.projectLocation && (
                        <>
                            <p className="font-bold mb-1">PROJECT LOCATION</p>
                            <p className="whitespace-pre-line">{client.projectLocation}</p>
                        </>
                    )}
                </div>
                <div className="w-1/3 text-right">
                    <div className="flex justify-end">
                        <span className="font-bold w-24">Estimate #</span>
                        <span className="w-24 text-left">{document.estimateNumber}</span>
                    </div>
                    <div className="flex justify-end mt-1">
                        <span className="font-bold w-24">Date</span>
                        <span className="w-24 text-left">{safeFormat(document.estimateDate, 'MM/dd/yyyy')}</span>
                    </div>
                </div>
            </section>
            
            {category === "Home Remodeling / Renovation" && <HomeRemodelingPreview data={homeRemodeling} />}
            {category === "Roofing Estimate" && <RoofingPreview data={roofing} />}
            {category === "HVAC (Air Conditioning / Heating)" && <HvacPreview data={hvac} />}
            {category === "Plumbing Estimate" && <PlumbingPreview data={plumbing} />}
            
            <section className="mt-8">
                <table className="w-full text-left text-xs">
                    <thead className="bg-gray-100 text-gray-700">
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
