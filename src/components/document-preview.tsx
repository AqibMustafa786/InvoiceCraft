

'use client';

import { useState, useLayoutEffect, useRef, useEffect, FC } from 'react';
import type { Estimate } from '@/lib/types';
import { Card, CardContent } from '@/components/ui/card';
import Image from 'next/image';
import { format, isValid } from 'date-fns';
import { ConstructionTemplate1, ConstructionTemplate2, ConstructionTemplate3, ConstructionTemplate4, ConstructionTemplate5 } from './document-templates/construction-templates';
import { RemodelingTemplate1, RemodelingTemplate2, RemodelingTemplate3, RemodelingTemplate4, RemodelingTemplate5 } from './document-templates/remodeling-templates';
import { HVACTemplate1, HVACTemplate2, HVACTemplate3, HVACTemplate4, HVACTemplate5 } from './document-templates/hvac-templates';
import { PlumbingTemplate1, PlumbingTemplate2, PlumbingTemplate3, PlumbingTemplate4, PlumbingTemplate5 } from './document-templates/plumbing-templates';
import { ElectricalTemplate1, ElectricalTemplate2, ElectricalTemplate3, ElectricalTemplate4, ElectricalTemplate5 } from './document-templates/electrical-templates';
import { LandscapingTemplate1, LandscapingTemplate2, LandscapingTemplate3, LandscapingTemplate4, LandscapingTemplate5 } from './document-templates/landscaping-templates';
import { RoofingTemplate1, RoofingTemplate2, RoofingTemplate3, RoofingTemplate4, RoofingTemplate5 } from './document-templates/roofing-templates';
import { AutoRepairTemplate1, AutoRepairTemplate2, AutoRepairTemplate3, AutoRepairTemplate4, AutoRepairTemplate5 } from './document-templates/auto-repair-templates';
import { CleaningTemplate1, CleaningTemplate2, CleaningTemplate3, CleaningTemplate4, CleaningTemplate5 } from './document-templates/cleaning-templates';
import { ITTemplate1, ITTemplate2, ITTemplate3, ITTemplate4, ITTemplate5 } from './document-templates/it-freelance-templates';


// --- PROPS ---
interface DocumentPreviewProps {
  document: Estimate;
  accentColor: string;
  backgroundColor?: string;
  textColor?: string;
  id?: string;
  isPrint?: boolean;
}

interface CommonTemplateProps {
  document: Estimate;
  accentColor: string;
  backgroundColor?: string;
  textColor?: string;
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
                        <div><span className="font-bold">Project Type:</span> {homeRemodeling.projectType}</div>
                        <div><span className="font-bold">Property Type:</span> {homeRemodeling.propertyType}</div>
                        {homeRemodeling.squareFootage && <div><span className="font-bold">Sq. Footage:</span> {homeRemodeling.squareFootage} sq ft</div>}
                        <div className="col-span-2"><span className="font-bold">Rooms:</span> {homeRemodeling.roomsIncluded}</div>
                        <div><span className="font-bold">Material Grade:</span> {homeRemodeling.materialGrade}</div>
                        <div><span className="font-bold">Demolition:</span> {homeRemodeling.demolitionRequired ? 'Yes' : 'No'}</div>
                        <div><span className="font-bold">Permit:</span> {homeRemodeling.permitRequired ? 'Yes' : 'No'}</div>
                        {homeRemodeling.expectedStartDate && <div><span className="font-bold">Starts:</span> {safeFormat(homeRemodeling.expectedStartDate, 'MMM d, yyyy')}</div>}
                        {homeRemodeling.expectedCompletionDate && <div><span className="font-bold">Ends:</span> {safeFormat(homeRemodeling.expectedCompletionDate, 'MMM d, yyyy')}</div>}
                        {homeRemodeling.specialInstructions && <div className="col-span-2"><span className="font-bold">Instructions:</span> <span className="whitespace-pre-line">{homeRemodeling.specialInstructions}</span></div>}
                    </div>
                );
            case "Roofing Estimate":
                 if (!roofing) return null;
                 return (
                    <div className="grid grid-cols-2 gap-x-8 gap-y-2 mt-4 text-xs" data-element="category-details">
                        <div><span className="font-bold">Roof Material:</span> {roofing.roofMaterial}</div>
                        <div><span className="font-bold">Shingle Brand:</span> {roofing.shingleBrand}</div>
                        {roofing.roofSize && <div><span className="font-bold">Roof Size:</span> {roofing.roofSize} sq ft</div>}
                        <div><span className="font-bold">Layers to Remove:</span> {roofing.layersToRemove}</div>
                        <div><span className="font-bold">Roof Pitch:</span> {roofing.roofPitch}</div>
                        <div><span className="font-bold">Underlayment:</span> {roofing.underlaymentType}</div>
                        <div><span className="font-bold">Flashing Replacement:</span> {roofing.flashingDetails}</div>
                        <div><span className="font-bold">Ventilation:</span> {roofing.ventilationSystem}</div>
                        <div><span className="font-bold">Gutter Repair:</span> {roofing.gutterRepairNeeded}</div>
                        <div><span className="font-bold">Warranty:</span> {roofing.warranty}</div>
                        <div className="col-span-2"><span className="font-bold">Timeline:</span> {roofing.estimatedTimeline}</div>
                        <div><span className="font-bold">Inspection Required:</span> {roofing.inspectionRequired}</div>
                    </div>
                );
            case "HVAC (Air Conditioning / Heating)":
                if (!hvac) return null;
                return (
                    <div className="grid grid-cols-2 gap-x-8 gap-y-2 mt-4 text-xs" data-element="category-details">
                        <div><span className="font-bold">Service Type:</span> {hvac.serviceType}</div>
                        <div><span className="font-bold">System Type:</span> {hvac.systemType}</div>
                        {hvac.unitSize && <div><span className="font-bold">Unit Size:</span> {hvac.unitSize} {hvac.systemType === 'AC' ? 'Tons' : 'BTU'}</div>}
                        {hvac.seerRating && <div><span className="font-bold">SEER Rating:</span> {hvac.seerRating}</div>}
                        <div><span className="font-bold">Furnace Type:</span> {hvac.furnaceType}</div>
                        <div><span className="font-bold">Thermostat:</span> {hvac.thermostatType}</div>
                        <div><span className="font-bold">Ductwork:</span> {hvac.ductworkRequired ? 'Required' : 'Not Required'}</div>
                        {hvac.refrigerantType && <div><span className="font-bold">Refrigerant:</span> {hvac.refrigerantType}</div>}
                        {hvac.existingSystemCondition && <div className="col-span-2"><span className="font-bold">Existing System:</span> {hvac.existingSystemCondition}</div>}
                    </div>
                );
            case "Plumbing Estimate":
                 if (!plumbing) return null;
                return (
                    <div className="grid grid-cols-2 gap-x-8 gap-y-2 mt-4 text-xs" data-element="category-details">
                        <div><span className="font-bold">Service Type:</span> {plumbing.serviceType}</div>
                        <div><span className="font-bold">Fixture:</span> {plumbing.fixtureType}</div>
                        <div><span className="font-bold">Pipe Material:</span> {plumbing.pipeMaterial}</div>
                        <div><span className="font-bold">Floor Level:</span> {plumbing.floorLevel}</div>
                        <div><span className="font-bold">Emergency:</span> {plumbing.emergencyService ? 'Yes' : 'No'}</div>
                        <div><span className="font-bold">Pressure Issue:</span> {plumbing.waterPressureIssue ? 'Yes' : 'No'}</div>
                        {plumbing.leakLocation && <div className="col-span-2"><span className="font-bold">Leak Location:</span> {plumbing.leakLocation}</div>}
                        {plumbing.estimatedRepairTime && <div><span className="font-bold">Est. Time:</span> {plumbing.estimatedRepairTime}</div>}
                    </div>
                );
            case "Electrical Estimate":
                if (!electrical) return null;
                return (
                    <div className="grid grid-cols-2 gap-x-8 gap-y-2 mt-4 text-xs" data-element="category-details">
                        <div><span className="font-bold">Service:</span> {electrical.serviceType}</div>
                        <div><span className="font-bold">Wiring:</span> {electrical.wiringType}</div>
                        <div><span className="font-bold">Panel Upgrade:</span> {electrical.panelUpgradeNeeded ? 'Yes' : 'No'}</div>
                        <div><span className="font-bold">Panel Size:</span> {electrical.panelSize}</div>
                        {electrical.outletsFixturesCount && <div><span className="font-bold">Outlets/Fixtures:</span> {electrical.outletsFixturesCount}</div>}
                        <div><span className="font-bold">Rooms:</span> {electrical.roomsInvolved}</div>
                        <div><span className="font-bold">EV Charger:</span> {electrical.evChargerNeeded ? 'Yes' : 'No'}</div>
                        <div><span className="font-bold">Inspection:</span> {electrical.inspectionRequired ? 'Yes' : 'No'}</div>
                    </div>
                );
            case "Landscaping Estimate":
                if (!landscaping) return null;
                return (
                    <div className="grid grid-cols-2 gap-x-8 gap-y-2 mt-4 text-xs" data-element="category-details">
                        <div className="col-span-2"><span className="font-bold">Service Type:</span> {landscaping.serviceType}</div>
                        <div><span className="font-bold">Property Size:</span> {landscaping.propertySize}</div>
                        <div><span className="font-bold">Yard Condition:</span> {landscaping.yardCondition}</div>
                        {landscaping.grassHeight && <div><span className="font-bold">Grass Height:</span> {landscaping.grassHeight}</div>}
                        {landscaping.treeCount && <div><span className="font-bold">Tree Count:</span> {landscaping.treeCount}</div>}
                        {landscaping.fenceLengthNeeded && <div className="col-span-2"><span className="font-bold">Fence Length:</span> {landscaping.fenceLengthNeeded}</div>}
                    </div>
                );
            case "Cleaning Estimate":
                if (!cleaning) return null;
                return (
                    <div className="grid grid-cols-2 gap-x-8 gap-y-2 mt-4 text-xs" data-element="category-details">
                        <div><span className="font-bold">Cleaning Type:</span> {cleaning.cleaningType}</div>
                        <div><span className="font-bold">Frequency:</span> {cleaning.frequency}</div>
                        {cleaning.homeSize && <div><span className="font-bold">Home Size:</span> {cleaning.homeSize} sq ft</div>}
                        {cleaning.bedrooms && <div><span className="font-bold">Bedrooms:</span> {cleaning.bedrooms}</div>}
                        {cleaning.bathrooms && <div><span className="font-bold">Bathrooms:</span> {cleaning.bathrooms}</div>}
                        <div><span className="font-bold">Kitchen Size:</span> {cleaning.kitchenSize}</div>
                        <div><span className="font-bold">Has Pets:</span> {cleaning.hasPets ? 'Yes' : 'No'}</div>
                        {cleaning.addOns.length > 0 && <div className="col-span-2"><span className="font-bold">Add-ons:</span> {cleaning.addOns.join(', ')}</div>}
                    </div>
                );
            case "Auto Repair Estimate":
                if (!autoRepair) return null;
                return (
                    <div className="grid grid-cols-2 gap-x-8 gap-y-2 mt-4 text-xs" data-element="category-details">
                        <div><span className="font-bold">Vehicle:</span> {autoRepair.vehicleMake} {autoRepair.vehicleModel} ({autoRepair.vehicleYear})</div>
                        {autoRepair.mileage && <div><span className="font-bold">Mileage:</span> {autoRepair.mileage.toLocaleString()}</div>}
                        <div className="col-span-2"><span className="font-bold">VIN:</span> {autoRepair.vin}</div>
                        <div className="col-span-2"><span className="font-bold">Issue:</span> {autoRepair.issueDescription}</div>
                        <div className="col-span-2"><span className="font-bold">Parts Required:</span> {autoRepair.partsRequired}</div>
                        <div><span className="font-bold">Diagnostic:</span> {autoRepair.diagnosticType}</div>
                    </div>
                );
             case "Construction Estimate":
                if (!construction) return null;
                return (
                    <div className="grid grid-cols-2 gap-x-8 gap-y-2 mt-4 text-xs" data-element="category-details">
                        <div><span className="font-bold">Project Type:</span> {construction.projectType}</div>
                        {construction.squareFootage && <div><span className="font-bold">Sq. Footage:</span> {construction.squareFootage} sq ft</div>}
                        <div><span className="font-bold">Lot Size:</span> {construction.lotSize}</div>
                        <div><span className="font-bold">Building Type:</span> {construction.buildingType}</div>
                        <div><span className="font-bold">Permit:</span> {construction.permitRequired ? 'Yes' : 'No'}</div>
                        <div><span className="font-bold">Drawings:</span> {construction.architectDrawingsProvided ? 'Provided' : 'Not Provided'}</div>
                        <div><span className="font-bold">Inspection:</span> {construction.inspectionRequired ? 'Yes' : 'No'}</div>
                        <div className="col-span-2"><span className="font-bold">Material Pref:</span> {construction.materialPreference}</div>
                    </div>
                );
            case "IT / Freelance Estimate":
                if (!itFreelance) return null;
                return (
                    <div className="grid grid-cols-2 gap-x-8 gap-y-2 mt-4 text-xs" data-element="category-details">
                        <div><span className="font-bold">Project Type:</span> {itFreelance.projectType}</div>
                        <div><span className="font-bold">Design Style:</span> {itFreelance.designStyle}</div>
                        {itFreelance.pagesScreensCount && <div><span className="font-bold">Pages/Screens:</span> {itFreelance.pagesScreensCount}</div>}
                        {itFreelance.revisionsIncluded && <div><span className="font-bold">Revisions:</span> {itFreelance.revisionsIncluded}</div>}
                        <div className="col-span-2"><span className="font-bold">Timeline:</span> {itFreelance.deliveryTimeline}</div>
                        <div className="col-span-2"><span className="font-bold">Scope:</span> <span className="whitespace-pre-line">{itFreelance.scopeOfWork}</span></div>
                        <div className="col-span-2"><span className="font-bold">Features:</span> <span className="whitespace-pre-line">{itFreelance.featuresNeeded}</span></div>
                        <div className="col-span-2"><span className="font-bold">Integrations:</span> <span className="whitespace-pre-line">{itFreelance.integrations}</span></div>
                    </div>
                );
            default:
                return null;
        }
    };

    return <div data-element="category-preview-wrapper">{renderContent()}</div>;
};

const PageHeader = ({ document, style, pageIndex }: { document: Estimate, style: React.CSSProperties, pageIndex: number }) => {
    const { business } = document;
    const documentTitle = document.documentType === 'quote' ? 'Quote' : 'Estimate';
    
    return (
        <div data-element="page-header-content" className="flex flex-col">
            {pageIndex === 0 && (
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
            )}
             <div className="flex justify-between items-start text-xs">
                <div className="w-1/2 space-y-0.5">
                    {pageIndex === 0 && (
                        <>
                            {business.licenseNumber && <p>Lic #: {business.licenseNumber}</p>}
                            {business.taxId && <p>Tax ID: {business.taxId}</p>}
                            <p>{business.phone}</p>
                            <p>{business.email}</p>
                            <p className="whitespace-pre-line">{business.address}</p>
                        </>
                    )}
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
        </div>
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
        <div data-element="footer" className="avoid-page-break">
            <section className="flex justify-between items-start mt-6">
                <div className="w-1/2 text-xs">
                    <p className="font-bold mb-1">Notes</p>
                    <p className="whitespace-pre-line">{document.termsAndConditions}</p>
                    <div className="flex gap-8">
                        <SignatureDisplay signature={document.business.ownerSignature} label="Authorized Signature" />
                        <SignatureDisplay signature={document.clientSignature} label="Client Signature" />
                    </div>
                </div>
                <div className="w-2/5 space-y-1 text-xs">
                    <div className="flex justify-between">
                        <span>Estimated Subtotal</span>
                        <span className="font-medium tabular-nums">{currencySymbol}{summary.subtotal.toFixed(2)}</span>
                    </div>
                     {summary.discount > 0 && (
                        <div className="flex justify-between">
                            <span>Discount</span>
                            <span className="font-medium tabular-nums">-{currencySymbol}{summary.discount.toFixed(2)}</span>
                        </div>
                    )}
                    <div className="flex justify-between font-bold border-b pb-1 mb-1">
                        <span>Subtotal less discount</span>
                        <span className="tabular-nums">{currencySymbol}{subtotalLessDiscount.toFixed(2)}</span>
                    </div>
                    {taxRate > 0 && (
                         <div className="flex justify-between">
                            <span>Tax Rate</span>
                            <span className="tabular-nums">{taxRate.toFixed(2)}%</span>
                        </div>
                    )}
                    <div className="flex justify-between">
                        <span>Total tax</span>
                        <span className="font-medium tabular-nums">{currencySymbol}{summary.taxAmount.toFixed(2)}</span>
                    </div>
                     {summary.shippingCost > 0 && (
                        <div className="flex justify-between">
                            <span>Shipping/Handling</span>
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


const ModernTemplatePage: FC<PageProps> = ({ document, pageItems, pageIndex, totalPages, style }) => {
    const currencySymbol = currencySymbols[document.currency] || '$';

    return (
        <div className={`p-8 md:p-10 font-sans flex flex-col ${pageIndex < totalPages - 1 ? "page-break-after" : ""}`} style={{ color: document.textColor, fontFamily: style.fontFamily, fontSize: `${style.fontSize}pt`, backgroundColor: document.backgroundColor, minHeight: '1056px' }}>
            <div data-element="page-header">
                <PageHeader document={document} style={style} pageIndex={pageIndex}/>
                {(pageIndex === 0) && (
                    <>
                        <PageClientDetails document={document} />
                        <CategoryPreview document={document} />
                    </>
                )}
            </div>
            
            <section className="mt-8 flex-grow">
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
                    </tbody>
                </table>
            </section>

            {pageIndex === totalPages - 1 && <PageFooter document={document} style={style} />}
        </div>
    );
};

const templates: { [key: string]: FC<PageProps> } = {
  'default': ModernTemplatePage,
  'construction-1': ConstructionTemplate1,
  'construction-2': ConstructionTemplate2,
  'construction-3': ConstructionTemplate3,
  'construction-4': ConstructionTemplate4,
  'construction-5': ConstructionTemplate5,
  'remodeling-1': RemodelingTemplate1,
  'remodeling-2': RemodelingTemplate2,
  'remodeling-3': RemodelingTemplate3,
  'remodeling-4': RemodelingTemplate4,
  'remodeling-5': RemodelingTemplate5,
  'hvac-1': HVACTemplate1,
  'hvac-2': HVACTemplate2,
  'hvac-3': HVACTemplate3,
  'hvac-4': HVACTemplate4,
  'hvac-5': HVACTemplate5,
  'plumbing-1': PlumbingTemplate1,
  'plumbing-2': PlumbingTemplate2,
  'plumbing-3': PlumbingTemplate3,
  'plumbing-4': PlumbingTemplate4,
  'plumbing-5': PlumbingTemplate5,
  'electrical-1': ElectricalTemplate1,
  'electrical-2': ElectricalTemplate2,
  'electrical-3': ElectricalTemplate3,
  'electrical-4': ElectricalTemplate4,
  'electrical-5': ElectricalTemplate5,
  'landscaping-1': LandscapingTemplate1,
  'landscaping-2': LandscapingTemplate2,
  'landscaping-3': LandscapingTemplate3,
  'landscaping-4': LandscapingTemplate4,
  'landscaping-5': LandscapingTemplate5,
  'roofing-1': RoofingTemplate1,
  'roofing-2': RoofingTemplate2,
  'roofing-3': RoofingTemplate3,
  'roofing-4': RoofingTemplate4,
  'roofing-5': RoofingTemplate5,
  'auto-repair-1': AutoRepairTemplate1,
  'auto-repair-2': AutoRepairTemplate2,
  'auto-repair-3': AutoRepairTemplate3,
  'auto-repair-4': AutoRepairTemplate4,
  'auto-repair-5': AutoRepairTemplate5,
  'cleaning-1': CleaningTemplate1,
  'cleaning-2': CleaningTemplate2,
  'cleaning-3': CleaningTemplate3,
  'cleaning-4': CleaningTemplate4,
  'cleaning-5': CleaningTemplate5,
  'it-1': ITTemplate1,
  'it-2': ITTemplate2,
  'it-3': ITTemplate3,
  'it-4': ITTemplate4,
  'it-5': ITTemplate5,
};


const PAGE_HEIGHT = 1056; // 11 inches at 96 DPI for Letter size
const PAGE_PADDING = 80; // 40px top + 40px bottom
const AVAILABLE_HEIGHT = PAGE_HEIGHT - PAGE_PADDING;


const DocumentPreviewInternal: FC<DocumentPreviewProps> = ({ document, accentColor, backgroundColor, textColor, id = 'document-preview', isPrint = false }) => {
  const [paginatedItems, setPaginatedItems] = useState<Estimate['lineItems'][][]>(document ? [document.lineItems] : [[]]);
  const [needsRemeasure, setNeedsRemeasure] = useState(true);
  const containerRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    setNeedsRemeasure(true);
  }, [document]);
  
  const previewStyle = {
      color: document?.textColor || '#374151',
      fontFamily: document?.fontFamily || 'Inter, sans-serif',
      fontSize: `${document?.fontSize || 10}pt`,
      backgroundColor: document?.backgroundColor || '#FFFFFF',
  } as React.CSSProperties;

  const dynamicColorStyle = {
      color: accentColor,
  }

  const TemplateComponent = templates[document.template] || templates.default;
  
  useLayoutEffect(() => {
    if (!document || !isPrint || !needsRemeasure || !TemplateComponent) return;

    const measureAndPaginate = async () => {
        if (typeof window.document === 'undefined') return;
        const container = containerRef.current;
        if (!container) return;

        const tempRoot = window.document.createElement('div');
        tempRoot.style.position = 'absolute';
        tempRoot.style.left = '-9999px';
        tempRoot.style.width = `${container.clientWidth}px`;
        window.document.body.appendChild(tempRoot);

        try {
            const tempContainer = container.cloneNode(true) as HTMLElement;
            tempRoot.appendChild(tempContainer);
            
            await new Promise(resolve => setTimeout(resolve, 0));

            const headerContentEl = tempContainer.querySelector('[data-element="page-header-content"]') as HTMLElement;
            const clientDetailsEl = tempContainer.querySelector('[data-element="client-details"]') as HTMLElement;
            const categoryEl = tempContainer.querySelector('[data-element="category-preview-wrapper"]') as HTMLElement;
            const tableHeaderEl = tempContainer.querySelector('[data-element="table-header"]') as HTMLElement;
            const footerEl = tempContainer.querySelector('[data-element="footer"]') as HTMLElement;
            const allRows = Array.from(tempContainer.querySelectorAll('[data-element="table-row"]')) as HTMLElement[];

            if (!headerContentEl || !tableHeaderEl || !footerEl || allRows.length === 0) {
                setPaginatedItems([document.lineItems]);
                setNeedsRemeasure(false);
                window.document.body.removeChild(tempRoot);
                return;
            }
            
            const firstPageHeaderHeight = headerContentEl.offsetHeight + (clientDetailsEl?.offsetHeight || 0) + (categoryEl?.offsetHeight || 0);
            const subsequentPageHeaderHeight = headerContentEl.offsetHeight;
            const tableHeaderHeight = tableHeaderEl.offsetHeight;
            const footerHeight = footerEl.offsetHeight;

            const pages: Estimate['lineItems'][][] = [];
            let currentPageItems: Estimate['lineItems'][] = [];
            let currentPageHeight = 0;

            for (let i = 0; i < document.lineItems.length; i++) {
                const item = document.lineItems[i];
                const rowHeight = allRows[i] ? allRows[i].offsetHeight : 20;
                
                const isFirstPage = pages.length === 0;
                const isFirstItemOnNewPage = currentPageItems.length === 0;

                let usedHeight = currentPageHeight;
                if (isFirstItemOnNewPage) {
                    usedHeight += isFirstPage ? firstPageHeaderHeight + tableHeaderHeight : subsequentPageHeaderHeight + tableHeaderHeight;
                }
                
                const isLastItem = i === document.lineItems.length - 1;
                const spaceNeeded = rowHeight + (isLastItem ? footerHeight : 0);

                if (usedHeight + spaceNeeded > AVAILABLE_HEIGHT) {
                    pages.push(currentPageItems);
                    currentPageItems = [item];
                    currentPageHeight = rowHeight;
                } else {
                    currentPageItems.push(item);
                    currentPageHeight += rowHeight;
                }
            }

            if (currentPageItems.length > 0) {
                pages.push(currentPageItems);
            }
            
            if (pages.length === 0 && document.lineItems.length > 0) {
                pages.push(document.lineItems);
            } else if (pages.length === 0) {
                pages.push([]);
            }

            setPaginatedItems(pages);
            setNeedsRemeasure(false);

        } finally {
            if (window.document.body.contains(tempRoot)) {
                window.document.body.removeChild(tempRoot);
            }
        }
    };
    
    const timer = setTimeout(measureAndPaginate, 100);
    return () => clearTimeout(timer);

  }, [document, isPrint, needsRemeasure, TemplateComponent]);


  if (!document || !TemplateComponent) {
    return (
      <Card id={id} className="w-full shadow-lg rounded-xl overflow-hidden print-hide">
        <CardContent className="p-8 text-center text-muted-foreground">
          Loading Preview...
        </CardContent>
      </Card>
    );
  }

  const commonProps: CommonTemplateProps = {
    document,
    accentColor,
    backgroundColor: backgroundColor || '#FFFFFF',
    textColor: textColor || '#374151',
  };

  if (isPrint) {
    const itemsToRender = needsRemeasure ? [document.lineItems] : paginatedItems;
    
    return (
      <div id={id} style={{backgroundColor: backgroundColor}} ref={containerRef}>
        <div style={{ position: 'absolute', left: '-9999px' }}>
             <PageHeader document={document} style={dynamicColorStyle} pageIndex={0}/>
             <PageClientDetails document={document} />
             <CategoryPreview document={document} />
             <PageFooter document={document} style={dynamicColorStyle} />
        </div>
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
      <CardContent className="p-0" style={{backgroundColor: backgroundColor}}>
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

export const ClientDocumentPreview: FC<DocumentPreviewProps> = (props) => {
  const [isClient, setIsClient] = useState(false);
  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) {
    return (
        <Card id={props.id} className="w-full shadow-lg rounded-xl overflow-hidden print-hide">
            <CardContent className="p-8 text-center text-muted-foreground">
            Loading Preview...
            </CardContent>
        </Card>
    );
  }
  return <DocumentPreviewInternal {...props} />;
};

export { DocumentPreviewInternal as DocumentPreview };
