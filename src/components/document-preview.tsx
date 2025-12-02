

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

const CategoryPreview = ({ document }: { document: Estimate }) => {
    const { category, homeRemodeling, roofing, hvac, plumbing, electrical, landscaping, cleaning, autoRepair, construction, itFreelance } = document;
    if (category === 'Generic') return null;

    const renderContent = () => {
        switch (category) {
            case "Home Remodeling / Renovation":
                if (!homeRemodeling) return null;
                return (
                    <div className="grid grid-cols-2 gap-x-8 gap-y-2 mt-4 text-xs">
                        <div><span className="font-bold text-gray-600">Project Type:</span> {homeRemodeling.projectType}</div>
                        <div><span className="font-bold text-gray-600">Property Type:</span> {homeRemodeling.propertyType}</div>
                        {homeRemodeling.squareFootage && <div><span className="font-bold text-gray-600">Sq. Footage:</span> {homeRemodeling.squareFootage} sq ft</div>}
                        <div className="col-span-2"><span className="font-bold text-gray-600">Rooms:</span> {homeRemodeling.roomsIncluded}</div>
                        <div><span className="font-bold text-gray-600">Material Grade:</span> {homeRemodeling.materialGrade}</div>
                        <div><span className="font-bold text-gray-600">Demolition:</span> {homeRemodeling.demolitionRequired ? 'Yes' : 'No'}</div>
                        <div><span className="font-bold text-gray-600">Permit:</span> {homeRemodeling.permitRequired ? 'Yes' : 'No'}</div>
                        {homeRemodeling.expectedStartDate && <div><span className="font-bold text-gray-600">Starts:</span> {safeFormat(homeRemodeling.expectedStartDate, 'MMM d, yyyy')}</div>}
                        {homeRemodeling.expectedCompletionDate && <div><span className="font-bold text-gray-600">Ends:</span> {safeFormat(homeRemodeling.expectedCompletionDate, 'MMM d, yyyy')}</div>}
                        {homeRemodeling.specialInstructions && <div className="col-span-2"><span className="font-bold text-gray-600">Instructions:</span> <span className="whitespace-pre-line">{homeRemodeling.specialInstructions}</span></div>}
                    </div>
                );
            case "Roofing Estimate":
                if (!roofing) return null;
                 return (
                    <div className="grid grid-cols-2 gap-x-8 gap-y-2 mt-4 text-xs">
                        <div><span className="font-bold text-gray-600">Roof Material:</span> {roofing.roofMaterial}</div>
                        {roofing.roofSize && <div><span className="font-bold text-gray-600">Roof Size:</span> {roofing.roofSize} sq ft</div>}
                        <div><span className="font-bold text-gray-600">Roof Pitch:</span> {roofing.roofPitch}</div>
                        {roofing.layersToRemove && <div><span className="font-bold text-gray-600">Layers to Remove:</span> {roofing.layersToRemove}</div>}
                        <div><span className="font-bold text-gray-600">Underlayment:</span> {roofing.underlaymentType}</div>
                        <div><span className="font-bold text-gray-600">Ventilation:</span> {roofing.ventilationSystem}</div>
                        {roofing.roofAge && <div><span className="font-bold text-gray-600">Roof Age:</span> {roofing.roofAge} years</div>}
                        <div><span className="font-bold text-gray-600">Flashing Replacement:</span> {roofing.flashingReplacement ? 'Yes' : 'No'}</div>
                        <div><span className="font-bold text-gray-600">Gutter Repair:</span> {roofing.gutterRepairNeeded ? 'Yes' : 'No'}</div>
                        <div><span className="font-bold text-gray-600">Inspection Required:</span> {roofing.inspectionRequired ? 'Yes' : 'No'}</div>
                    </div>
                );
            case "HVAC (Air Conditioning / Heating)":
                if (!hvac) return null;
                return (
                    <div className="grid grid-cols-2 gap-x-8 gap-y-2 mt-4 text-xs">
                        <div><span className="font-bold text-gray-600">Service Type:</span> {hvac.serviceType}</div>
                        <div><span className="font-bold text-gray-600">System Type:</span> {hvac.systemType}</div>
                        {hvac.unitSize && <div><span className="font-bold text-gray-600">Unit Size:</span> {hvac.unitSize} {hvac.systemType === 'AC' ? 'Tons' : 'BTU'}</div>}
                        {hvac.seerRating && <div><span className="font-bold text-gray-600">SEER Rating:</span> {hvac.seerRating}</div>}
                        <div><span className="font-bold text-gray-600">Furnace Type:</span> {hvac.furnaceType}</div>
                        <div><span className="font-bold text-gray-600">Thermostat:</span> {hvac.thermostatType}</div>
                        <div><span className="font-bold text-gray-600">Ductwork:</span> {hvac.ductworkRequired ? 'Required' : 'Not Required'}</div>
                        {hvac.refrigerantType && <div><span className="font-bold text-gray-600">Refrigerant:</span> {hvac.refrigerantType}</div>}
                        {hvac.existingSystemCondition && <div className="col-span-2"><span className="font-bold text-gray-600">Existing System:</span> {hvac.existingSystemCondition}</div>}
                    </div>
                );
            case "Plumbing Estimate":
                 if (!plumbing) return null;
                return (
                    <div className="grid grid-cols-2 gap-x-8 gap-y-2 mt-4 text-xs">
                        <div><span className="font-bold text-gray-600">Service Type:</span> {plumbing.serviceType}</div>
                        <div><span className="font-bold text-gray-600">Fixture:</span> {plumbing.fixtureType}</div>
                        <div><span className="font-bold text-gray-600">Pipe Material:</span> {plumbing.pipeMaterial}</div>
                        <div><span className="font-bold text-gray-600">Floor Level:</span> {plumbing.floorLevel}</div>
                        <div><span className="font-bold text-gray-600">Emergency:</span> {plumbing.emergencyService ? 'Yes' : 'No'}</div>
                        <div><span className="font-bold text-gray-600">Pressure Issue:</span> {plumbing.waterPressureIssue ? 'Yes' : 'No'}</div>
                        {plumbing.leakLocation && <div className="col-span-2"><span className="font-bold text-gray-600">Leak Location:</span> {plumbing.leakLocation}</div>}
                        {plumbing.estimatedRepairTime && <div><span className="font-bold text-gray-600">Est. Time:</span> {plumbing.estimatedRepairTime}</div>}
                    </div>
                );
            case "Electrical Estimate":
                if (!electrical) return null;
                return (
                    <div className="grid grid-cols-2 gap-x-8 gap-y-2 mt-4 text-xs">
                        <div><span className="font-bold text-gray-600">Service:</span> {electrical.serviceType}</div>
                        <div><span className="font-bold text-gray-600">Wiring:</span> {electrical.wiringType}</div>
                        <div><span className="font-bold text-gray-600">Panel Upgrade:</span> {electrical.panelUpgradeNeeded ? 'Yes' : 'No'}</div>
                        <div><span className="font-bold text-gray-600">Panel Size:</span> {electrical.panelSize}</div>
                        {electrical.outletsFixturesCount && <div><span className="font-bold text-gray-600">Outlets/Fixtures:</span> {electrical.outletsFixturesCount}</div>}
                        <div><span className="font-bold text-gray-600">Rooms:</span> {electrical.roomsInvolved}</div>
                        <div><span className="font-bold text-gray-600">EV Charger:</span> {electrical.evChargerNeeded ? 'Yes' : 'No'}</div>
                        <div><span className="font-bold text-gray-600">Inspection:</span> {electrical.inspectionRequired ? 'Yes' : 'No'}</div>
                    </div>
                );
            case "Landscaping Estimate":
                if (!landscaping) return null;
                return (
                    <div className="grid grid-cols-2 gap-x-8 gap-y-2 mt-4 text-xs">
                        <div className="col-span-2"><span className="font-bold text-gray-600">Service Type:</span> {landscaping.serviceType}</div>
                        <div><span className="font-bold text-gray-600">Property Size:</span> {landscaping.propertySize}</div>
                        <div><span className="font-bold text-gray-600">Yard Condition:</span> {landscaping.yardCondition}</div>
                        {landscaping.grassHeight && <div><span className="font-bold text-gray-600">Grass Height:</span> {landscaping.grassHeight}</div>}
                        {landscaping.treeCount && <div><span className="font-bold text-gray-600">Tree Count:</span> {landscaping.treeCount}</div>}
                        {landscaping.fenceLengthNeeded && <div className="col-span-2"><span className="font-bold text-gray-600">Fence Length:</span> {landscaping.fenceLengthNeeded}</div>}
                    </div>
                );
            case "Cleaning Estimate":
                if (!cleaning) return null;
                return (
                    <div className="grid grid-cols-2 gap-x-8 gap-y-2 mt-4 text-xs">
                        <div><span className="font-bold text-gray-600">Cleaning Type:</span> {cleaning.cleaningType}</div>
                        <div><span className="font-bold text-gray-600">Frequency:</span> {cleaning.frequency}</div>
                        {cleaning.homeSize && <div><span className="font-bold text-gray-600">Home Size:</span> {cleaning.homeSize} sq ft</div>}
                        {cleaning.bedrooms && <div><span className="font-bold text-gray-600">Bedrooms:</span> {cleaning.bedrooms}</div>}
                        {cleaning.bathrooms && <div><span className="font-bold text-gray-600">Bathrooms:</span> {cleaning.bathrooms}</div>}
                        <div><span className="font-bold text-gray-600">Kitchen Size:</span> {cleaning.kitchenSize}</div>
                        <div><span className="font-bold text-gray-600">Has Pets:</span> {cleaning.hasPets ? 'Yes' : 'No'}</div>
                        {cleaning.addOns.length > 0 && <div className="col-span-2"><span className="font-bold text-gray-600">Add-ons:</span> {cleaning.addOns.join(', ')}</div>}
                    </div>
                );
            case "Auto Repair Estimate":
                if (!autoRepair) return null;
                return (
                    <div className="grid grid-cols-2 gap-x-8 gap-y-2 mt-4 text-xs">
                        <div><span className="font-bold text-gray-600">Vehicle:</span> {autoRepair.vehicleMake} {autoRepair.vehicleModel} ({autoRepair.vehicleYear})</div>
                        {autoRepair.mileage && <div><span className="font-bold text-gray-600">Mileage:</span> {autoRepair.mileage.toLocaleString()}</div>}
                        <div className="col-span-2"><span className="font-bold text-gray-600">VIN:</span> {autoRepair.vin}</div>
                        <div className="col-span-2"><span className="font-bold text-gray-600">Issue:</span> {autoRepair.issueDescription}</div>
                        <div className="col-span-2"><span className="font-bold text-gray-600">Parts Required:</span> {autoRepair.partsRequired}</div>
                        <div><span className="font-bold text-gray-600">Diagnostic:</span> {autoRepair.diagnosticType}</div>
                    </div>
                );
             case "Construction Estimate":
                if (!construction) return null;
                return (
                    <div className="grid grid-cols-2 gap-x-8 gap-y-2 mt-4 text-xs">
                        <div><span className="font-bold text-gray-600">Project Type:</span> {construction.projectType}</div>
                        {construction.squareFootage && <div><span className="font-bold text-gray-600">Sq. Footage:</span> {construction.squareFootage} sq ft</div>}
                        <div><span className="font-bold text-gray-600">Lot Size:</span> {construction.lotSize}</div>
                        <div><span className="font-bold text-gray-600">Building Type:</span> {construction.buildingType}</div>
                        <div><span className="font-bold text-gray-600">Permit:</span> {construction.permitRequired ? 'Yes' : 'No'}</div>
                        <div><span className="font-bold text-gray-600">Drawings:</span> {construction.architectDrawingsProvided ? 'Provided' : 'Not Provided'}</div>
                        <div><span className="font-bold text-gray-600">Inspection:</span> {construction.inspectionRequired ? 'Yes' : 'No'}</div>
                        <div className="col-span-2"><span className="font-bold text-gray-600">Material Pref:</span> {construction.materialPreference}</div>
                    </div>
                );
            case "IT / Freelance Estimate":
                if (!itFreelance) return null;
                return (
                    <div className="grid grid-cols-2 gap-x-8 gap-y-2 mt-4 text-xs">
                        <div><span className="font-bold text-gray-600">Project Type:</span> {itFreelance.projectType}</div>
                        <div><span className="font-bold text-gray-600">Design Style:</span> {itFreelance.designStyle}</div>
                        {itFreelance.pagesScreensCount && <div><span className="font-bold text-gray-600">Pages/Screens:</span> {itFreelance.pagesScreensCount}</div>}
                        {itFreelance.revisionsIncluded && <div><span className="font-bold text-gray-600">Revisions:</span> {itFreelance.revisionsIncluded}</div>}
                        <div className="col-span-2"><span className="font-bold text-gray-600">Timeline:</span> {itFreelance.deliveryTimeline}</div>
                        <div className="col-span-2"><span className="font-bold text-gray-600">Scope:</span> <span className="whitespace-pre-line">{itFreelance.scopeOfWork}</span></div>
                        <div className="col-span-2"><span className="font-bold text-gray-600">Features:</span> <span className="whitespace-pre-line">{itFreelance.featuresNeeded}</span></div>
                        <div className="col-span-2"><span className="font-bold text-gray-600">Integrations:</span> <span className="whitespace-pre-line">{itFreelance.integrations}</span></div>
                    </div>
                );
            default:
                return null;
        }
    };

    return renderContent();
};

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
            
            <CategoryPreview document={document} />
            
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
