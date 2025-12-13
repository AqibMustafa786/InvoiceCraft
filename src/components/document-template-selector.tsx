

'use client';

import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import Image from 'next/image';
import type { EstimateCategory, InvoiceCategory } from '@/lib/types';
import { useMemo } from 'react';

interface Template {
  id: string;
  name: string;
  thumbnailUrl: string;
  category: EstimateCategory | InvoiceCategory;
}

const templates: Template[] = [
  // General for Estimates
  { id: 'generic-1', name: 'Classic', thumbnailUrl: '/templates/generic-1.png', category: 'Generic' },
  { id: 'generic-2', name: 'Modern', thumbnailUrl: '/templates/generic-2.png', category: 'Generic' },
  { id: 'generic-3', name: 'Minimal', thumbnailUrl: '/templates/generic-3.png', category: 'Generic' },
  { id: 'generic-4', name: 'Side Accent', thumbnailUrl: '/templates/generic-4.png', category: 'Generic' },
  { id: 'generic-5', name: 'Bold Grid', thumbnailUrl: '/templates/generic-5.png', category: 'Generic' },

  // General for Invoices
  { id: 'default', name: 'Default', thumbnailUrl: '/templates/Default.png', category: 'General Services' },
  { id: 'modern', name: 'Modern', thumbnailUrl: '/templates/Modern.png', category: 'General Services' },
  { id: 'minimalist', name: 'Minimalist', thumbnailUrl: '/templates/Minimalist.png', category: 'General Services' },
  { id: 'creative', name: 'Creative', thumbnailUrl: '/templates/Creative.png', category: 'General Services' },
  { id: 'elegant', name: 'Elegant', thumbnailUrl: '/templates/Elegant.png', category: 'General Services' },
  { id: 'usa', name: 'USA', thumbnailUrl: '/templates/Usa.png', category: 'General Services' },
  
  // Construction
  { id: 'construction-1', name: 'Foundation', thumbnailUrl: '/templates/construction-1.png', category: 'Construction' },
  { id: 'construction-2', name: 'Modern Dark', thumbnailUrl: '/templates/construction-2.png', category: 'Construction' },
  { id: 'construction-3', name: 'Minimalist', thumbnailUrl: '/templates/construction-3.png', category: 'Construction' },
  { id: 'construction-4', name: 'Side Accent', thumbnailUrl: '/templates/construction-4.png', category: 'Construction' },
  { id: 'construction-5', name: 'Bold Grid', thumbnailUrl: '/templates/construction-5.png', category: 'Construction' },
  { id: 'construction-6', name: 'Classic', thumbnailUrl: '/templates/construction-6.png', category: 'Construction' },
  { id: 'construction-1', name: 'Foundation', thumbnailUrl: '/templates/construction-1.png', category: 'Construction Estimate' },
  { id: 'construction-2', name: 'Modern Dark', thumbnailUrl: '/templates/construction-2.png', category: 'Construction Estimate' },
  { id: 'construction-3', name: 'Minimalist', thumbnailUrl: '/templates/construction-3.png', category: 'Construction Estimate' },
  { id: 'construction-4', name: 'Side Accent', thumbnailUrl: '/templates/construction-4.png', category: 'Construction Estimate' },
  { id: 'construction-5', name: 'Bold Grid', thumbnailUrl: '/templates/construction-5.png', category: 'Construction Estimate' },
  
  // Remodeling
  { id: 'remodeling-1', name: 'Precision', thumbnailUrl: '/templates/remodeling-1.png', category: 'Home Remodeling / Renovation' },
  { id: 'remodeling-2', name: 'Modern Reno', thumbnailUrl: '/templates/remodeling-2.png', category: 'Home Remodeling / Renovation' },
  { id: 'remodeling-3', name: 'Blueprint', thumbnailUrl: '/templates/remodeling-3.png', category: 'Home Remodeling / Renovation'},
  { id: 'remodeling-4', name: 'Craftsman', thumbnailUrl: '/templates/remodeling-4.png', category: 'Home Remodeling / Renovation'},
  { id: 'remodeling-5', name: 'Urban Build', thumbnailUrl: '/templates/remodeling-5.png', category: 'Home Remodeling / Renovation'},

  // HVAC
  { id: 'hvac-1', name: 'Classic', thumbnailUrl: '/templates/hvac-1.png', category: 'HVAC Services' },
  { id: 'hvac-2', name: 'Coolant', thumbnailUrl: '/templates/hvac-2.png', category: 'HVAC Services' },
  { id: 'hvac-3', name: 'Grid', thumbnailUrl: '/templates/hvac-3.png', category: 'HVAC Services' },
  { id: 'hvac-4', name: 'Corporate', thumbnailUrl: '/templates/hvac-4.png', category: 'HVAC Services' },
  { id: 'hvac-5', name: 'Minimal', thumbnailUrl: '/templates/hvac-5.png', category: 'HVAC Services' },
  { id: 'hvac-6', name: 'Direct', thumbnailUrl: '/templates/hvac-6.png', category: 'HVAC Services' },
  { id: 'hvac-1', name: 'Classic', thumbnailUrl: '/templates/hvac-1.png', category: 'HVAC (Air Conditioning / Heating)' },
  { id: 'hvac-2', name: 'Coolant', thumbnailUrl: '/templates/hvac-2.png', category: 'HVAC (Air Conditioning / Heating)' },
  { id: 'hvac-3', name: 'Grid', thumbnailUrl: '/templates/hvac-3.png', category: 'HVAC (Air Conditioning / Heating)' },
  { id: 'hvac-4', name: 'Corporate', thumbnailUrl: '/templates/hvac-4.png', category: 'HVAC (Air Conditioning / Heating)' },
  { id: 'hvac-5', name: 'Minimal', thumbnailUrl: '/templates/hvac-5.png', category: 'HVAC (Air Conditioning / Heating)' },

  // Plumbing
  { id: 'plumbing-1', name: 'Classic', thumbnailUrl: '/templates/plumbing-1.png', category: 'Plumbing' },
  { id: 'plumbing-2', name: 'Modern Blue', thumbnailUrl: '/templates/plumbing-2.png', category: 'Plumbing' },
  { id: 'plumbing-3', name: 'Clean', thumbnailUrl: '/templates/plumbing-3.png', category: 'Plumbing' },
  { id: 'plumbing-4', name: 'Side Panel', thumbnailUrl: '/templates/plumbing-4.png', category: 'Plumbing' },
  { id: 'plumbing-5', name: 'Bold Grid', thumbnailUrl: '/templates/plumbing-5.png', category: 'Plumbing' },
  { id: 'plumbing-6', name: 'Direct', thumbnailUrl: '/templates/plumbing-6.png', category: 'Plumbing' },
  { id: 'plumbing-1', name: 'Classic', thumbnailUrl: '/templates/plumbing-1.png', category: 'Plumbing Estimate' },
  { id: 'plumbing-2', name: 'Modern Blue', thumbnailUrl: '/templates/plumbing-2.png', category: 'Plumbing Estimate' },
  { id: 'plumbing-3', name: 'Clean', thumbnailUrl: '/templates/plumbing-3.png', category: 'Plumbing Estimate' },
  { id: 'plumbing-4', name: 'Side Panel', thumbnailUrl: '/templates/plumbing-4.png', category: 'Plumbing Estimate' },
  { id: 'plumbing-5', name: 'Bold Grid', thumbnailUrl: '/templates/plumbing-5.png', category: 'Plumbing Estimate' },
  
  // Electrical
  { id: 'electrical-1', name: 'Voltage', thumbnailUrl: '/templates/electrical-1.png', category: 'Electrical Services' },
  { id: 'electrical-2', name: 'Circuit', thumbnailUrl: '/templates/electrical-2.png', category: 'Electrical Services' },
  { id: 'electrical-3', name: 'Spark', thumbnailUrl: '/templates/electrical-3.png', category: 'Electrical Services' },
  { id: 'electrical-4', name: 'Wired', thumbnailUrl: '/templates/electrical-4.png', category: 'Electrical Services' },
  { id: 'electrical-5', name: 'Power Grid', thumbnailUrl: '/templates/electrical-5.png', category: 'Electrical Services' },
  { id: 'electrical-6', name: 'Volt', thumbnailUrl: '/templates/electrical-6.png', category: 'Electrical Services' },
  { id: 'electrical-1', name: 'Voltage', thumbnailUrl: '/templates/electrical-1.png', category: 'Electrical Estimate' },
  { id: 'electrical-2', name: 'Circuit', thumbnailUrl: '/templates/electrical-2.png', category: 'Electrical Estimate' },
  { id: 'electrical-3', name: 'Spark', thumbnailUrl: '/templates/electrical-3.png', category: 'Electrical Estimate' },
  { id: 'electrical-4', name: 'Wired', thumbnailUrl: '/templates/electrical-4.png', category: 'Electrical Estimate' },
  { id: 'electrical-5', name: 'Power Grid', thumbnailUrl: '/templates/electrical-5.png', category: 'Electrical Estimate' },

  // Landscaping
  { id: 'landscaping-1', name: 'Classic', thumbnailUrl: '/templates/landscaping-1.png', category: 'Landscaping & Lawn Care' },
  { id: 'landscaping-2', name: 'Modern Green', thumbnailUrl: '/templates/landscaping-2.png', category: 'Landscaping & Lawn Care' },
  { id: 'landscaping-3', name: 'Side Panel', thumbnailUrl: '/templates/landscaping-3.png', category: 'Landscaping & Lawn Care' },
  { id: 'landscaping-4', name: 'Elegant', thumbnailUrl: '/templates/landscaping-4.png', category: 'Landscaping & Lawn Care' },
  { id: 'landscaping-5', name: 'Bold', thumbnailUrl: '/templates/landscaping-5.png', category: 'Landscaping & Lawn Care' },
  { id: 'landscaping-6', name: 'Eco Scape', thumbnailUrl: '/templates/landscaping-6.png', category: 'Landscaping & Lawn Care' },
  { id: 'landscaping-1', name: 'Classic', thumbnailUrl: '/templates/landscaping-1.png', category: 'Landscaping Estimate' },
  { id: 'landscaping-2', name: 'Modern Green', thumbnailUrl: '/templates/landscaping-2.png', category: 'Landscaping Estimate' },
  { id: 'landscaping-3', name: 'Side Panel', thumbnailUrl: '/templates/landscaping-3.png', category: 'Landscaping Estimate' },
  { id: 'landscaping-4', name: 'Elegant', thumbnailUrl: '/templates/landscaping-4.png', category: 'Landscaping Estimate' },
  { id: 'landscaping-5', name: 'Bold', thumbnailUrl: '/templates/landscaping-5.png', category: 'Landscaping Estimate' },

  // Roofing
  { id: 'roofing-1', name: 'USA Contractor', thumbnailUrl: '/templates/roofing-1.png', category: 'Roofing' },
  { id: 'roofing-2', name: 'Modern Roofing', thumbnailUrl: '/templates/roofing-2.png', category: 'Roofing' },
  { id: 'roofing-3', name: 'Classic Roofing', thumbnailUrl: '/templates/roofing-3.png', category: 'Roofing' },
  { id: 'roofing-4', name: 'Clean Grid', thumbnailUrl: '/templates/roofing-4.png', category: 'Roofing' },
  { id: 'roofing-5', name: 'Side Panel', thumbnailUrl: '/templates/roofing-5.png', category: 'Roofing' },
  { id: 'roofing-1', name: 'USA Contractor', thumbnailUrl: '/templates/roofing-1.png', category: 'Roofing Estimate' },
  { id: 'roofing-2', name: 'Modern Roofing', thumbnailUrl: '/templates/roofing-2.png', category: 'Roofing Estimate' },
  { id: 'roofing-3', name: 'Classic Roofing', thumbnailUrl: '/templates/roofing-3.png', category: 'Roofing Estimate' },
  { id: 'roofing-4', name: 'Clean Grid', thumbnailUrl: '/templates/roofing-4.png', category: 'Roofing Estimate' },
  { id: 'roofing-5', name: 'Side Panel', thumbnailUrl: '/templates/roofing-5.png', category: 'Roofing Estimate' },

  // Auto Repair
  { id: 'auto-repair-1', name: 'Modern Red', thumbnailUrl: '/templates/auto-repair-1.png', category: 'Auto Repair' },
  { id: 'auto-repair-2', name: 'Night Shift', thumbnailUrl: '/templates/auto-repair-2.png', category: 'Auto Repair' },
  { id: 'auto-repair-3', name: 'Classic Garage', thumbnailUrl: '/templates/auto-repair-3.png', category: 'Auto Repair' },
  { id: 'auto-repair-4', name: 'Pro Service', thumbnailUrl: '/templates/auto-repair-4.png', category: 'Auto Repair' },
  { id: 'auto-repair-5', name: 'Gridline', thumbnailUrl: '/templates/auto-repair-5.png', category: 'Auto Repair' },
  { id: 'auto-repair-6', name: 'Gold Standard', thumbnailUrl: '/templates/auto-repair-6.png', category: 'Auto Repair' },
  { id: 'auto-repair-1', name: 'Modern Red', thumbnailUrl: '/templates/auto-repair-1.png', category: 'Auto Repair Estimate' },
  { id: 'auto-repair-2', name: 'Night Shift', thumbnailUrl: '/templates/auto-repair-2.png', category: 'Auto Repair Estimate' },
  { id: 'auto-repair-3', name: 'Classic Garage', thumbnailUrl: '/templates/auto-repair-3.png', category: 'Auto Repair Estimate' },
  { id: 'auto-repair-4', name: 'Pro Service', thumbnailUrl: '/templates/auto-repair-4.png', category: 'Auto Repair Estimate' },
  { id: 'auto-repair-5', name: 'Gridline', thumbnailUrl: '/templates/auto-repair-5.png', category: 'Auto Repair Estimate' },

  // Cleaning
  { id: 'cleaning-1', name: 'Sparkle', thumbnailUrl: '/templates/cleaning-1.png', category: 'Cleaning Services' },
  { id: 'cleaning-2', name: 'Fresh', thumbnailUrl: '/templates/cleaning-2.png', category: 'Cleaning Services' },
  { id: 'cleaning-3', name: 'Pristine', thumbnailUrl: '/templates/cleaning-3.png', category: 'Cleaning Services' },
  { id: 'cleaning-4', name: 'Hygiene', thumbnailUrl: '/templates/cleaning-4.png', category: 'Cleaning Services' },
  { id: 'cleaning-5', name: 'Gleam', thumbnailUrl: '/templates/cleaning-5.png', category: 'Cleaning Services' },
  { id: 'cleaning-1', name: 'Sparkle', thumbnailUrl: '/templates/cleaning-1.png', category: 'Cleaning Estimate' },
  { id: 'cleaning-2', name: 'Fresh', thumbnailUrl: '/templates/cleaning-2.png', category: 'Cleaning Estimate' },
  { id: 'cleaning-3', name: 'Pristine', thumbnailUrl: '/templates/cleaning-3.png', category: 'Cleaning Estimate' },
  { id: 'cleaning-4', name: 'Hygiene', thumbnailUrl: '/templates/cleaning-4.png', category: 'Cleaning Estimate' },
  { id: 'cleaning-5', name: 'Gleam', thumbnailUrl: '/templates/cleaning-5.png', category: 'Cleaning Estimate' },
  
  // IT Services & Freelance
  { id: 'it-1', name: 'Tech Corporate', thumbnailUrl: '/templates/it-1.png', category: 'IT Services / Tech Support' },
  { id: 'it-2', name: 'Modern Dark', thumbnailUrl: '/templates/it-2.png', category: 'IT Services / Tech Support' },
  { id: 'it-3', name: 'Minimalist Grid', thumbnailUrl: '/templates/it-3.png', category: 'IT Services / Tech Support' },
  { id: 'it-4', name: 'Creative Blue', thumbnailUrl: '/templates/it-4.png', category: 'IT Services / Tech Support' },
  { id: 'it-5', name: 'Startup Vibe', thumbnailUrl: '/templates/it-5.png', category: 'IT Services / Tech Support' },
  { id: 'it-1', name: 'Tech Corporate', thumbnailUrl: '/templates/it-1.png', category: 'Freelance / Agency' },
  { id: 'it-2', name: 'Modern Dark', thumbnailUrl: '/templates/it-2.png', category: 'Freelance / Agency' },
  { id: 'it-3', name: 'Minimalist Grid', thumbnailUrl: '/templates/it-3.png', category: 'Freelance / Agency' },
  { id: 'it-4', name: 'Creative Blue', thumbnailUrl: '/templates/it-4.png', category: 'Freelance / Agency' },
  { id: 'it-5', name: 'Startup Vibe', thumbnailUrl: '/templates/it-5.png', category: 'Freelance / Agency' },
  { id: 'it-1', name: 'Tech Corporate', thumbnailUrl: '/templates/it-1.png', category: 'IT / Freelance Estimate' },
  { id: 'it-2', name: 'Modern Dark', thumbnailUrl: '/templates/it-2.png', category: 'IT / Freelance Estimate' },
  { id: 'it-3', name: 'Minimalist Grid', thumbnailUrl: '/templates/it-3.png', category: 'IT / Freelance Estimate' },
  { id: 'it-4', name: 'Creative Blue', thumbnailUrl: '/templates/it-4.png', category: 'IT / Freelance Estimate' },
  { id: 'it-5', name: 'Startup Vibe', thumbnailUrl: '/templates/it-5.png', category: 'IT / Freelance Estimate' },
  
  // Consulting
  { id: 'consulting-1', name: 'Executive', thumbnailUrl: '/templates/consulting-1.png', category: 'Consulting' },
  { id: 'consulting-2', name: 'Strategy', thumbnailUrl: '/templates/consulting-2.png', category: 'Consulting' },
  { id: 'consulting-3', name: 'Advisory', thumbnailUrl: '/templates/consulting-3.png', category: 'Consulting' },
  { id: 'consulting-4', name: 'Modern', thumbnailUrl: '/templates/consulting-4.png', category: 'Consulting' },
  { id: 'consulting-5', name: 'Minimal', thumbnailUrl: '/templates/consulting-5.png', category: 'Consulting' },
  
  // Legal
  { id: 'legal-1', name: 'Gavel', thumbnailUrl: '/templates/legal-1.png', category: 'Legal Services' },
  { id: 'legal-2', name: 'Advocate', thumbnailUrl: '/templates/legal-2.png', category: 'Legal Services' },
  { id: 'legal-3', name: 'Justice', thumbnailUrl: '/templates/legal-3.png', category: 'Legal Services' },
  { id: 'legal-4', name: 'Paralegal', thumbnailUrl: '/templates/legal-4.png', category: 'Legal Services' },
  { id: 'legal-5', name: 'The Firm', thumbnailUrl: '/templates/legal-5.png', category: 'Legal Services' },

  // Medical
  { id: 'medical-1', name: 'Caduceus', thumbnailUrl: '/templates/medical-1.png', category: 'Medical / Healthcare' },
  { id: 'medical-2', name: 'Vitality', thumbnailUrl: '/templates/medical-2.png', category: 'Medical / Healthcare' },
  { id: 'medical-3', name: 'Clinic', thumbnailUrl: '/templates/medical-3.png', category: 'Medical / Healthcare' },
  { id: 'medical-4', name: 'Wellness', thumbnailUrl: '/templates/medical-4.png', category: 'Medical / Healthcare' },
  { id: 'medical-5', name: 'Remedy', thumbnailUrl: '/templates/medical-5.png', category: 'Medical / Healthcare' },

  // E-commerce
  { id: 'ecommerce-1', name: 'New Collection', thumbnailUrl: '/templates/ecommerce-1.png', category: 'E-commerce / Online Store' },

  // Retail
  { id: 'retail-1', name: 'Growers', thumbnailUrl: '/templates/retail-1.png', category: 'Retail / Wholesale' },

  // Photography
  { id: 'photography-1', name: 'Lens', thumbnailUrl: '/templates/photography-1.png', category: 'Photography' },
  { id: 'photography-2', name: 'Shutter', thumbnailUrl: '/templates/photography-2.png', category: 'Photography' },
  { id: 'photography-3', name: 'Aperture', thumbnailUrl: '/templates/photography-3.png', category: 'Photography' },
  { id: 'photography-4', name: 'Golden Hour', thumbnailUrl: '/templates/photography-4.png', category: 'Photography' },
  { id: 'photography-5', name: 'Portfolio', thumbnailUrl: '/templates/photography-5.png', category: 'Photography' },


  // Real Estate
  { id: 'real-estate-1', name: 'Realty', thumbnailUrl: '/templates/real-estate-1.png', category: 'Real Estate / Property Management' },
  { id: 'real-estate-2', name: 'Property', thumbnailUrl: '/templates/real-estate-2.png', category: 'Real Estate / Property Management' },
  { id: 'real-estate-3', name: 'Keystone', thumbnailUrl: '/templates/real-estate-3.png', category: 'Real Estate / Property Management' },
  { id: 'real-estate-4', name: 'Mortgage', thumbnailUrl: '/templates/real-estate-4.png', category: 'Real Estate / Property Management' },
  { id: 'real-estate-5', name: 'Lease', thumbnailUrl: '/templates/real-estate-5.png', category: 'Real Estate / Property Management' },
  
  // Rental
  { id: 'rental-1', name: 'Realty', thumbnailUrl: '/templates/real-estate-1.png', category: 'Rental / Property' },
  { id: 'rental-2', name: 'Property', thumbnailUrl: '/templates/real-estate-2.png', category: 'Rental / Property' },
  { id: 'rental-3', name: 'Keystone', thumbnailUrl: '/templates/real-estate-3.png', category: 'Rental / Property' },
  { id: 'rental-4', name: 'Mortgage', thumbnailUrl: '/templates/real-estate-4.png', category: 'Rental / Property' },
  { id: 'rental-5', name: 'Lease', thumbnailUrl: '/templates/real-estate-5.png', category: 'Rental / Property' },

  // Transportation
  { id: 'transportation-1', name: 'Freight', thumbnailUrl: '/templates/transportation-1.png', category: 'Transportation / Trucking' },
  { id: 'transportation-2', name: 'Logistics', thumbnailUrl: '/templates/transportation-2.png', category: 'Transportation / Trucking' },
  { id: 'transportation-3', name: 'Dispatch', thumbnailUrl: '/templates/transportation-3.png', category: 'Transportation / Trucking' },
  { id: 'transportation-4', name: 'Cargo', thumbnailUrl: '/templates/transportation-4.png', category: 'Transportation / Trucking' },
  { id: 'transportation-5', name: 'Haul', thumbnailUrl: '/templates/transportation-5.png', category: 'Transportation / Trucking' },
];

interface DocumentTemplateSelectorProps {
  selectedTemplate: string;
  onSelectTemplate: (templateId: string) => void;
  documentType: 'invoice' | 'estimate' | 'quote';
  category?: EstimateCategory | InvoiceCategory;
}


export function DocumentTemplateSelector({ selectedTemplate, onSelectTemplate, documentType, category }: DocumentTemplateSelectorProps) {
  
  const filteredTemplates = useMemo(() => {
    let generalCategory: EstimateCategory | InvoiceCategory = documentType === 'invoice' ? 'General Services' : 'Generic';
    let currentCategory = category;

    if (documentType === 'estimate' && category) {
      // Map invoice category to estimate category if needed
      const categoryMap: { [key in InvoiceCategory]?: EstimateCategory } = {
        'Construction': 'Construction Estimate',
        'Plumbing': 'Plumbing Estimate',
        'Electrical Services': 'Electrical Estimate',
        'HVAC Services': 'HVAC (Air Conditioning / Heating)',
        'Roofing': 'Roofing Estimate',
        'Landscaping & Lawn Care': 'Landscaping Estimate',
        'Cleaning Services': 'Cleaning Estimate',
        'Freelance / Agency': 'IT / Freelance Estimate',
        'Auto Repair': 'Auto Repair Estimate',
      };
      currentCategory = categoryMap[category as InvoiceCategory] || category;
    }
    
    if (!currentCategory || currentCategory === 'General Services' && documentType !== 'invoice') {
        currentCategory = 'Generic';
    }

    if (currentCategory === 'General Services' && documentType === 'invoice') {
        return templates.filter(t => t.category === "General Services");
    }

    if (currentCategory === 'Generic') {
        return templates.filter(t => t.category === "Generic");
    }
    
    return templates.filter(t => t.category === currentCategory);

  }, [category, documentType]);

  const docTypeLabel = documentType === 'invoice' ? 'Invoice' : (documentType === 'quote' ? 'Quote' : 'Estimate');
  
  return (
    <div className="grid grid-cols-2 gap-6">
      {filteredTemplates.map((template) => {
        return (
            <div
            key={template.id}
            onClick={() => onSelectTemplate(template.id)}
            className="cursor-pointer group"
            >
            <div
                className={cn(
                'relative rounded-lg border-2 transition-all overflow-hidden aspect-[3/4] shadow-md mx-auto',
                selectedTemplate === template.id
                    ? 'border-primary ring-4 ring-primary/20'
                    : 'border-border',
                'hover:border-primary/50'
                )}
                style={{ width: '188px' }}
            >
                <Image
                src={template.thumbnailUrl}
                alt={`${template.name} ${docTypeLabel} template`}
                width={188}
                height={250}
                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <span className="text-white font-bold text-lg">Select</span>
                </div>
            </div>
            <p className="text-center text-sm font-semibold p-3">{template.name}</p>
            </div>
        )
      })}
    </div>
  );
}
