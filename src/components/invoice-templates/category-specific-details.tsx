'use client';

import type { Invoice } from '@/lib/types';
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

/**
 * A central component that dynamically renders the correct details
 * based on the invoice's category property.
 */
export const CategorySpecificDetails: FC<{ invoice: Invoice, t: any }> = ({ invoice, t }) => {
    const category = invoice.category;

    switch(category) {
        case 'Construction': return <ConstructionDetails invoice={invoice} t={t} />;
        case 'Plumbing': return <PlumbingDetails invoice={invoice} t={t} />;
        case 'Electrical Services': return <ElectricalDetails invoice={invoice} t={t} />;
        case 'HVAC Services': return <HvacDetails invoice={invoice} t={t} />;
        case 'Roofing': return <RoofingDetails invoice={invoice} t={t} />;
        case 'Landscaping & Lawn Care': return <LandscapingDetails invoice={invoice} t={t} />;
        case 'Cleaning Services': return <CleaningDetails invoice={invoice} t={t} />;
        case 'Auto Repair': return <AutoRepairDetails invoice={invoice} t={t} />;
        case 'IT Services / Tech Support': return <ITServiceDetails invoice={invoice} t={t} />;
        case 'Freelance / Agency': return <ITServiceDetails invoice={invoice} t={t} />;
        case 'Consulting': return <ConsultingDetails invoice={invoice} t={t} />;
        case 'Legal Services': return <LegalDetails invoice={invoice} t={t} />;
        case 'Medical / Healthcare': return <MedicalDetails invoice={invoice} t={t} />;
        case 'E-commerce / Online Store': return <EcommerceDetails invoice={invoice} t={t} />;
        case 'Retail / Wholesale': return <RetailDetails invoice={invoice} t={t} />;
        case 'Photography': return <PhotographyDetails invoice={invoice} t={t} />;
        case 'Real Estate / Property Management': return <RealEstateDetails invoice={invoice} t={t} />;
        case 'Transportation / Trucking': return <TransportationDetails invoice={invoice} t={t} />;
        case 'Rental / Property': return <RentalDetails invoice={invoice} t={t} />;
        default: return null;
    }
}
