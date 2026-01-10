
'use client';

import type { Invoice, CustomField } from '@/lib/types';
import { FC } from 'react';

// Import all the detail components
import { ConstructionDetails } from './construction-templates';
import { PlumbingDetails } from './plumbing-templates';
import { ElectricalDetails } from './electrical-templates';
import { HvacDetails } from './hvac-templates';
import { RoofingDetails } from './roofing-templates';
import { LandscapingDetails } from './landscaping-templates';
import { CleaningDetails } from './cleaning-templates';
import { AutoRepairDetails } from './auto-repair-templates';
import { ITServiceDetails } from './it-freelance-templates';
import { ConsultingDetails } from './consulting-templates';
import { LegalDetails } from './legal-templates';
import { MedicalDetails } from './medical-templates';
import { EcommerceDetails } from './ecommerce-templates';
import { RetailDetails } from './retail-templates';
import { PhotographyDetails } from './photography-templates';
import { RealEstateDetails } from './real-estate-templates';
import { TransportationDetails } from './transportation-templates';
import { RentalDetails } from './rental-templates';

// This is the preview for custom fields, now conditionally rendered
const CustomFieldsPreview: FC<{ fields?: CustomField[], textColor?: string, showHeading: boolean }> = ({ fields, textColor, showHeading }) => {
  const validFields = fields?.filter(f => f.label && f.value) || [];
  if (validFields.length === 0) return null;

  return (
    <section className="my-4 text-xs" style={{ color: textColor }}>
      {showHeading && <p className="font-bold text-gray-500 mb-2 border-b">Additional Information</p>}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-x-4 gap-y-1">
        {validFields.map(field => (
          <p key={field.id}>
            <span className="font-semibold text-gray-600">{field.label}:</span> {field.value}
          </p>
        ))}
      </div>
    </section>
  );
}

/**
 * A central component that dynamically renders the correct details
 * based on the invoice's category property.
 */
export const CategorySpecificDetails: FC<{ invoice: Invoice, t: any }> = ({ invoice, t }) => {
    const category = invoice.category;
    const commonProps = { invoice, t };

    // A helper function to render the category details and the custom fields without a heading
    const renderDetailsWithCustomFields = (DetailsComponent: React.FC<any>) => (
        <>
            <DetailsComponent {...commonProps} />
            <CustomFieldsPreview fields={invoice.customFields} textColor={invoice.textColor} showHeading={false} />
        </>
    );

    switch(category) {
        case 'Construction': 
            return invoice.construction ? renderDetailsWithCustomFields(ConstructionDetails) : null;
        case 'Plumbing': 
            return invoice.plumbing ? renderDetailsWithCustomFields(PlumbingDetails) : null;
        case 'Electrical Services': 
            return invoice.electrical ? renderDetailsWithCustomFields(ElectricalDetails) : null;
        case 'HVAC Services': 
            return invoice.hvac ? renderDetailsWithCustomFields(HvacDetails) : null;
        case 'Roofing': 
            return invoice.roofing ? renderDetailsWithCustomFields(RoofingDetails) : null;
        case 'Landscaping & Lawn Care': 
            return invoice.landscaping ? renderDetailsWithCustomFields(LandscapingDetails) : null;
        case 'Cleaning Services': 
            return invoice.cleaning ? renderDetailsWithCustomFields(CleaningDetails) : null;
        case 'Auto Repair': 
            return invoice.autoRepair ? renderDetailsWithCustomFields(AutoRepairDetails) : null;
        case 'IT Services / Tech Support': 
        case 'Freelance / Agency': 
            return (invoice.itServices || invoice.freelance) ? renderDetailsWithCustomFields(ITServiceDetails) : null;
        case 'Consulting': 
            return invoice.consulting ? renderDetailsWithCustomFields(ConsultingDetails) : null;
        case 'Legal Services': 
            return invoice.legal ? renderDetailsWithCustomFields(LegalDetails) : null;
        case 'Medical / Healthcare': 
            return invoice.medical ? renderDetailsWithCustomFields(MedicalDetails) : null;
        case 'E-commerce / Online Store': 
            return invoice.ecommerce ? renderDetailsWithCustomFields(EcommerceDetails) : null;
        case 'Retail / Wholesale': 
            return invoice.retail ? renderDetailsWithCustomFields(RetailDetails) : null;
        case 'Photography': 
            return invoice.photography ? renderDetailsWithCustomFields(PhotographyDetails) : null;
        case 'Real Estate / Property Management': 
            return invoice.realEstate ? renderDetailsWithCustomFields(RealEstateDetails) : null;
        case 'Transportation / Trucking': 
            return invoice.transportation ? renderDetailsWithCustomFields(TransportationDetails) : null;
        case 'Rental / Property': 
            return invoice.rental ? renderDetailsWithCustomFields(RentalDetails) : null;
        case 'General Services':
             return <CustomFieldsPreview fields={invoice.customFields} textColor={invoice.textColor} showHeading={true} />;
        default: 
            return <CustomFieldsPreview fields={invoice.customFields} textColor={invoice.textColor} showHeading={true} />;
    }
}
