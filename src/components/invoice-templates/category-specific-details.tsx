
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
        case 'Construction': 
            return invoice.construction ? <ConstructionDetails invoice={invoice} t={t} /> : null;
        case 'Plumbing': 
            return invoice.plumbing ? <PlumbingDetails invoice={invoice} t={t} /> : null;
        case 'Electrical Services': 
            return invoice.electrical ? <ElectricalDetails invoice={invoice} t={t} /> : null;
        case 'HVAC Services': 
            return invoice.hvac ? <HvacDetails invoice={invoice} t={t} /> : null;
        case 'Roofing': 
            return invoice.roofing ? <RoofingDetails invoice={invoice} t={t} /> : null;
        case 'Landscaping & Lawn Care': 
            return invoice.landscaping ? <LandscapingDetails invoice={invoice} t={t} /> : null;
        case 'Cleaning Services': 
            return invoice.cleaning ? <CleaningDetails invoice={invoice} t={t} /> : null;
        case 'Auto Repair': 
            return invoice.autoRepair ? <AutoRepairDetails invoice={invoice} t={t} /> : null;
        case 'IT Services / Tech Support': 
            return invoice.itServices ? <ITServiceDetails invoice={invoice} t={t} /> : null;
        case 'Freelance / Agency': 
            return invoice.freelance ? <ITServiceDetails invoice={invoice} t={t} /> : null;
        case 'Consulting': 
            return invoice.consulting ? <ConsultingDetails invoice={invoice} t={t} /> : null;
        case 'Legal Services': 
            return invoice.legal ? <LegalDetails invoice={invoice} t={t} /> : null;
        case 'Medical / Healthcare': 
            return invoice.medical ? <MedicalDetails invoice={invoice} t={t} /> : null;
        case 'E-commerce / Online Store': 
            return invoice.ecommerce ? <EcommerceDetails invoice={invoice} t={t} /> : null;
        case 'Retail / Wholesale': 
            return invoice.retail ? <RetailDetails invoice={invoice} t={t} /> : null;
        case 'Photography': 
            return invoice.photography ? <PhotographyDetails invoice={invoice} t={t} /> : null;
        case 'Real Estate / Property Management': 
            return invoice.realEstate ? <RealEstateDetails invoice={invoice} t={t} /> : null;
        case 'Transportation / Trucking': 
            return invoice.transportation ? <TransportationDetails invoice={invoice} t={t} /> : null;
        case 'Rental / Property': 
            return invoice.rental ? <RentalDetails invoice={invoice} t={t} /> : null;
        default: return null;
    }
}
