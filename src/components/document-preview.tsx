
'use client';

import { useState, useLayoutEffect, useRef, useEffect } from 'react';
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

interface CommonTemplateProps {
  document: Estimate;
  accentColor: string;
}

interface PageProps extends CommonTemplateProps {
    pageItems: Estimate['lineItems'];
    pageIndex: number;
    totalPages: number;
    summary: Estimate['summary'];
    style: React.CSSProperties;
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
        <div className="mt-4" data-element="signature">
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
                    <div className="grid grid-cols-2 gap-x-8 gap-y-2 mt-4 text-xs" data-element="category-details">
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
                    <div className="grid grid-cols-2 gap-x-8 gap-y-2 mt-4 text-xs" data-element="category-details">
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
                    <div className="grid grid-cols-2 gap-x-8 gap-y-2 mt-4 text-xs" data-element="category-details">
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
                    <div className="grid grid-cols-2 gap-x-8 gap-y-2 mt-4 text-xs" data-element="category-details">
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
                    <div className="grid grid-cols-2 gap-x-8 gap-y-2 mt-4 text-xs" data-element="category-details">
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
                    <div className="grid grid-cols-2 gap-x-8 gap-y-2 mt-4 text-xs" data-element="category-details">
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
                    <div className="grid grid-cols-2 gap-x-8 gap-y-2 mt-4 text-xs" data-element="category-details">
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
                    <div className="grid grid-cols-2 gap-x-8 gap-y-2 mt-4 text-xs" data-element="category-details">
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
                    <div className="grid grid-cols-2 gap-x-8 gap-y-2 mt-4 text-xs" data-element="category-details">
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
                    <div className="grid grid-cols-2 gap-x-8 gap-y-2 mt-4 text-xs" data-element="category-details">
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

    return <div data-element="category-preview-wrapper">{renderContent()}</div>;
};

const PageHeader = ({ document, style }: { document: Estimate, style: React.CSSProperties }) => {
    const { business, documentType } = document;
    const documentTitle = documentType === 'quote' ? 'Quote' : 'Estimate';
    
    return (
        <header data-element="page-header" className="flex flex-col">
            <div className="flex justify-between items-start mb-8">
                <div className="w-1/2">
                    {business.logoUrl ? (
                        <Image src={business.logoUrl} alt={`${business.name} Logo`} width={100} height={100} className="object-contain" data-ai-hint="logo" />
                    ) : (
                        <h2 className="text-xl font-bold" style={{ color: style.color }}>{business.name}</h2>
                    )}
                </div>
                <div className="w-1/2 text-right">
                     <h2 className="text-3xl font-bold mb-4" style={{ color: business.logoUrl ? style.color : 'inherit' }}>{documentTitle}</h2>
                </div>
            </div>
             <div className="flex justify-between items-start text-xs">
                <div className="w-1/2 space-y-0.5">
                    {business.licenseNumber && <p>Lic #: {business.licenseNumber}</p>}
                    {business.taxId && <p>Tax ID: {business.taxId}</p>}
                    <p>{business.phone}</p>
                    <p>{business.email}</p>
                    <p className="whitespace-pre-line">{business.address}</p>
                </div>
                 <div className="w-1/2 text-right">
                    <div className="flex justify-end">
                        <span className="font-bold w-24">Estimate #</span>
                        <span className="w-24 text-left">{document.estimateNumber}</span>
                    </div>
                    <div className="flex justify-end mt-1">
                        <span className="font-bold w-24">Date</span>
                        <span className="w-24 text-left">{safeFormat(document.estimateDate, 'MM/dd/yyyy')}</span>
                    </div>
                </div>
            </div>
        </header>
    );
};

const PageClientDetails = ({ document }: { document: Estimate }) => (
     <section data-element="client-details" className="flex justify-between items-start my-8 text-xs">
        <div className="w-1/3 space-y-0.5">
            <p className="font-bold mb-1">BILL TO</p>
            <p className="font-semibold">{document.client.name}</p>
            {document.client.companyName && <p>{document.client.companyName}</p>}
            {document.client.email && <p>{document.client.email}</p>}
            {document.client.phone && <p>{document.client.phone}</p>}
            <p className="whitespace-pre-line">{document.client.address}</p>
        </div>
        <div className="w-1/3 space-y-0.5">
            {document.client.projectLocation && (
                <>
                    <p className="font-bold mb-1">PROJECT LOCATION</p>
                    <p className="whitespace-pre-line">{document.client.projectLocation}</p>
                </>
            )}
        </div>
    </section>
);


const PageFooter = ({ document, style }: { document: Estimate, style: React.CSSProperties }) => {
    const { summary } = document;
    const currencySymbol = currencySymbols[document.currency] || '$';
    const subtotalLessDiscount = summary.subtotal - (summary.discount || 0);
    const taxRate = summary.taxPercentage || 0;

    return (
        <div data-element="footer">
            <section className="flex justify-between items-start mt-6">
                <div className="w-1/2 text-xs text-gray-600">
                    <p className="font-bold mb-1">Notes</p>
                    <p className="whitespace-pre-line">{document.termsAndConditions}</p>
                    <div className="flex gap-8">
                        <SignatureDisplay signature={document.business.ownerSignature} label="Authorized Signature" />
                        <SignatureDisplay signature={document.clientSignature} label="Client Signature" />
                    </div>
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
                    <div className="flex justify-between items-center font-bold text-lg pt-2 mt-2" style={{ color: style.color }}>
                        <span className="uppercase">Estimate Total</span>
                        <span className="tabular-nums">{currencySymbol}{summary.grandTotal.toFixed(2)}</span>
                    </div>
                </div>
            </section>
        </div>
    );
};


const ModernTemplatePage = ({ document, pageItems, pageIndex, totalPages, style }: PageProps) => {
    const currencySymbol = currencySymbols[document.currency] || '$';

    return (
        <div className={`p-8 md:p-10 bg-white font-sans ${pageIndex < totalPages - 1 ? "page-break" : ""}`} style={{ color: '#374151', fontFamily: style.fontFamily, fontSize: `${style.fontSize}pt` }}>
            <PageHeader document={document} style={style} />
            <PageClientDetails document={document} />
            <CategoryPreview document={document} />
            
            <section className="mt-8">
                <table className="w-full text-left text-xs" data-element="items-table">
                    <thead style={{ backgroundColor: style.color, color: 'white' }} data-element="table-header">
                        <tr>
                            <th className="p-2 font-bold w-1/2">Item/Service Description</th>
                            <th className="p-2 font-bold text-right">Quantity</th>
                            <th className="p-2 font-bold text-right">Item Price</th>
                            <th className="p-2 font-bold text-right">Amount</th>
                        </tr>
                    </thead>
                    <tbody>
                        {pageItems.map(item => (
                            <tr key={item.id} className="border-b" data-element="table-row">
                                <td className="p-2 whitespace-pre-line">{item.name || ''}</td>
                                <td className="p-2 text-right tabular-nums">{item.quantity}</td>
                                <td className="p-2 text-right tabular-nums">{currencySymbol}{item.unitPrice.toFixed(2)}</td>
                                <td className="p-2 text-right tabular-nums">{currencySymbol}{(item.quantity * item.unitPrice).toFixed(2)}</td>
                            </tr>
                        ))}
                         {pageIndex === totalPages - 1 && [...Array(Math.max(0, 7 - pageItems.length))].map((_, i) => (
                            <tr key={`blank-${i}`} className="border-b">
                                <td className="p-2 h-6"></td><td className="p-2"></td><td className="p-2"></td><td className="p-2"></td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </section>

            {pageIndex === totalPages - 1 && <PageFooter document={document} style={style} />}
        </div>
    );
};

const templates = {
  'default': ModernTemplatePage,
  'contractor': ModernTemplatePage,
};


const PAGE_HEIGHT = 1056; // 11 inches at 96 DPI for Letter size
const PAGE_PADDING = 80; // 40px top + 40px bottom
const AVAILABLE_HEIGHT = PAGE_HEIGHT - PAGE_PADDING;


export function DocumentPreview({ document, accentColor, id = 'document-preview', isPrint = false }: DocumentPreviewProps) {
  const [paginatedItems, setPaginatedItems] = useState<Estimate['lineItems'][][]>([document.lineItems]);
  const [needsRemeasure, setNeedsRemeasure] = useState(true);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setNeedsRemeasure(true);
  }, [document]);
  

  const previewStyle = {
      color: '#374151',
      fontFamily: document.fontFamily || 'Inter, sans-serif',
      fontSize: `${document.fontSize || 10}pt`,
  } as React.CSSProperties;

  const dynamicColorStyle = {
      color: accentColor,
  }

  const TemplateComponent = templates[document.template as keyof typeof templates] || templates.default;
  
  useLayoutEffect(() => {
    if (typeof window.document === 'undefined' || !isPrint || !needsRemeasure) return;

    const measureAndPaginate = () => {
        const container = containerRef.current;
        if (!container) return;

        const tempRoot = window.document.createElement('div');
        tempRoot.style.position = 'absolute';
        tempRoot.style.left = '-9999px';
        tempRoot.style.width = `${container.clientWidth}px`;
        window.document.body.appendChild(tempRoot);

        Promise.resolve().then(() => {
            const tempContainer = container.cloneNode(true) as HTMLElement;
            
            const tableBody = tempContainer.querySelector('[data-element="items-table"] tbody');
            if (tableBody) {
                tableBody.innerHTML = document.lineItems.map(item => `
                    <tr data-element="table-row" style="border-bottom: 1px solid #E5E7EB;">
                        <td style="padding: 8px; white-space: pre-line;">${item.name || ''}</td>
                        <td style="padding: 8px; text-align: right;">${item.quantity}</td>
                        <td style="padding: 8px; text-align: right;">${currencySymbols[document.currency] || '$'}${item.unitPrice.toFixed(2)}</td>
                        <td style="padding: 8px; text-align: right;">${currencySymbols[document.currency] || '$'}${(item.quantity * item.unitPrice).toFixed(2)}</td>
                    </tr>
                `).join('');
            }
            tempRoot.appendChild(tempContainer);
            
            const pageHeader = tempContainer.querySelector('[data-element="page-header"]') as HTMLElement;
            const clientDetails = tempContainer.querySelector('[data-element="client-details"]') as HTMLElement;
            const categoryPreview = tempContainer.querySelector('[data-element="category-preview-wrapper"]') as HTMLElement;
            const tableHeader = tempContainer.querySelector('[data-element="table-header"]') as HTMLElement;
            const footer = tempContainer.querySelector('[data-element="footer"]') as HTMLElement;
            const allRows = Array.from(tempContainer.querySelectorAll('[data-element="table-row"]')) as HTMLElement[];
            
            if (!pageHeader || !tableHeader || !footer || allRows.length === 0) {
                window.document.body.removeChild(tempRoot);
                return;
            }
            
            const firstPageHeaderHeight = pageHeader.offsetHeight + clientDetails.offsetHeight + (categoryPreview ? categoryPreview.offsetHeight : 0);
            const subsequentPageHeaderHeight = 0;
            const tableHeaderHeight = tableHeader.offsetHeight;
            const footerHeight = footer.offsetHeight;

            let newPages: Estimate['lineItems'][][] = [[]];
            let currentPage = 0;
            let currentPageHeight = firstPageHeaderHeight;

            allRows.forEach((row, index) => {
                const itemHeight = row.offsetHeight;
                
                if (currentPage > 0 && newPages[currentPage].length === 0) {
                    currentPageHeight = subsequentPageHeaderHeight;
                }
                
                if (newPages[currentPage].length === 0) {
                    currentPageHeight += tableHeaderHeight;
                }

                let isLastItem = index === allRows.length - 1;
                const projectedHeight = currentPageHeight + itemHeight + (isLastItem ? footerHeight : 0);

                if (projectedHeight > AVAILABLE_HEIGHT && newPages[currentPage].length > 0) {
                    currentPage++;
                    newPages[currentPage] = [];
                    currentPageHeight = subsequentPageHeaderHeight + tableHeaderHeight;
                }
                
                newPages[currentPage].push(document.lineItems[index]);
                currentPageHeight += itemHeight;
            });

            setPaginatedItems(newPages);
            setNeedsRemeasure(false);
            window.document.body.removeChild(tempRoot);
        });
    };
    
    const timer = setTimeout(measureAndPaginate, 100);
    return () => clearTimeout(timer);

  }, [document, isPrint, needsRemeasure, TemplateComponent]);


  const commonProps: CommonTemplateProps = {
    document,
    accentColor,
  };

  if (isPrint) {
    const itemsToRender = needsRemeasure ? [document.lineItems] : paginatedItems;
    
    return (
      <div id={id} className="bg-white" ref={containerRef}>
        {itemsToRender.map((pageItems, pageIndex) => (
           <TemplateComponent
            key={pageIndex}
            {...commonProps}
            pageItems={pageItems}
            pageIndex={pageIndex}
            totalPages={itemsToRender.length}
            summary={document.summary}
            style={dynamicColorStyle}
          />
        ))}
      </div>
    );
  }

  return (
    <Card id={id} className="w-full shadow-lg rounded-xl overflow-hidden print-hide" style={previewStyle}>
      <CardContent className="p-0 bg-white dark:bg-white">
         <TemplateComponent
            {...commonProps}
            pageItems={document.lineItems}
            pageIndex={0}
            totalPages={1}
            summary={document.summary}
            style={dynamicColorStyle}
          />
      </CardContent>
    </Card>
  );
}
