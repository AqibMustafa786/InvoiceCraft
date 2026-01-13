
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
import { AutoRepairDetails } from './auto-repair-templates';

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

    const hasCustomFields = (invoice.customFields || []).filter(f => f.label && f.value).length > 0;

    const renderDetailsWithCustomFields = (DetailsComponent: React.FC<any> | null) => {
      const categoryKey = category.split(' ')[0].toLowerCase().replace('&', '') as keyof Invoice;
      const categoryData = invoice[categoryKey];
      const hasCategoryData = categoryData && typeof categoryData === 'object' && Object.values(categoryData).some(val => val !== null && val !== '');
      
      return (
        <>
            {DetailsComponent && hasCategoryData ? <DetailsComponent {...commonProps} /> : null}
            <CustomFieldsPreview fields={invoice.customFields} textColor={invoice.textColor} showHeading={!hasCategoryData && hasCustomFields} />
        </>
      );
    };

    switch(category) {
        case 'Construction': 
            return renderDetailsWithCustomFields(ConstructionDetails);
        case 'Plumbing': 
            return renderDetailsWithCustomFields(PlumbingDetails);
        case 'Electrical Services': 
            return renderDetailsWithCustomFields(ElectricalDetails);
        case 'HVAC Services': 
            return renderDetailsWithCustomFields(HvacDetails);
        case 'Roofing': 
            return renderDetailsWithCustomFields(RoofingDetails);
        case 'Landscaping & Lawn Care': 
            return renderDetailsWithCustomFields(LandscapingDetails);
        case 'Cleaning Services': 
            return renderDetailsWithCustomFields(CleaningDetails);
        case 'Auto Repair': 
            return renderDetailsWithCustomFields(AutoRepairDetails);
        case 'IT Services / Tech Support': 
        case 'Freelance / Agency': 
            return renderDetailsWithCustomFields(ITServiceDetails);
        case 'Consulting': 
            return renderDetailsWithCustomFields(ConsultingDetails);
        case 'Legal Services': 
            return renderDetailsWithCustomFields(LegalDetails);
        case 'Medical / Healthcare': 
            return renderDetailsWithCustomFields(MedicalDetails);
        case 'E-commerce / Online Store': 
            return renderDetailsWithCustomFields(EcommerceDetails);
        case 'Retail / Wholesale': 
            return renderDetailsWithCustomFields(RetailDetails);
        case 'Photography': 
            return renderDetailsWithCustomFields(PhotographyDetails);
        case 'Real Estate / Property Management': 
            return renderDetailsWithCustomFields(RealEstateDetails);
        case 'Transportation / Trucking': 
            return renderDetailsWithCustomFields(TransportationDetails);
        case 'Rental / Property': 
            return renderDetailsWithCustomFields(RentalDetails);
        case 'General Services':
             return <CustomFieldsPreview fields={invoice.customFields} textColor={invoice.textColor} showHeading={true} />;
        default: 
            return <CustomFieldsPreview fields={invoice.customFields} textColor={invoice.textColor} showHeading={true} />;
    }
}
