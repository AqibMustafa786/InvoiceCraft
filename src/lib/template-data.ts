
export interface Template {
  id: string;
  name: string;
  thumbnailUrl: string;
  category: string;
  toolType: 'Invoice' | 'Estimate' | 'Quote' | 'Insurance';
  description: string;
  useCases: string[];
  isPro?: boolean;
}

export const allTemplates: Template[] = [
  // --- INVOICE TEMPLATES ---
  {
    id: 'default',
    name: 'Classic',
    thumbnailUrl: '/templates/Default.png',
    category: 'General Services',
    toolType: 'Invoice',
    description: 'A timeless and universally professional design suitable for any business. Clear, concise, and easy to read.',
    useCases: ['Any Business', 'Startups', 'Consultants'],
  },
  {
    id: 'modern',
    name: 'Modern',
    thumbnailUrl: '/templates/Modern.png',
    category: 'General Services',
    toolType: 'Invoice',
    description: 'A clean, contemporary design with a strong visual hierarchy. Perfect for tech companies and creative agencies.',
    useCases: ['Tech', 'Creative Agencies', 'Marketing'],
  },
  {
    id: 'minimalist',
    name: 'Minimalist',
    thumbnailUrl: '/templates/Minimalist.png',
    category: 'General Services',
    toolType: 'Invoice',
    description: 'A simple, elegant layout that focuses on the essentials. Ideal for freelancers and designers who value clarity.',
    useCases: ['Freelancers', 'Designers', 'Minimalists'],
  },
  {
    id: 'creative',
    name: 'Creative',
    thumbnailUrl: '/templates/Creative.png',
    category: 'General Services',
    toolType: 'Invoice',
    description: 'A stylish template with a unique layout and color accents, designed to make your brand stand out.',
    useCases: ['Artists', 'Photographers', 'Boutiques'],
  },
  {
    id: 'elegant',
    name: 'Elegant',
    thumbnailUrl: '/templates/Elegant.png',
    category: 'General Services',
    toolType: 'Invoice',
    description: 'A sophisticated design with a touch of class, perfect for high-end services and luxury goods.',
    useCases: ['Consultants', 'Luxury Brands', 'High-End Services'],
  },
  {
    id: 'usa',
    name: 'USA',
    thumbnailUrl: '/templates/Usa.png',
    category: 'General Services',
    toolType: 'Invoice',
    description: 'A professional and compliant template designed specifically for US-based businesses.',
    useCases: ['US Businesses', 'Contractors', 'Service Providers'],
  },
   {
    id: 'construction-2',
    name: 'Modern Dark',
    thumbnailUrl: '/templates/invoicepagetemplates/Moderndark.png',
    category: 'Construction',
    toolType: 'Invoice',
    description: 'A sleek, dark-themed template for construction companies wanting a modern and bold look.',
    useCases: ['Modern Builders', 'Design-Build Firms', 'Architects'],
  },
  {
    id: 'construction-3',
    name: 'Minimalist',
    thumbnailUrl: '/templates/invoicepagetemplates/Minimalist.png',
    category: 'Construction',
    toolType: 'Invoice',
    description: 'A clean and minimal design that focuses on the core details of the construction job.',
    useCases: ['Subcontractors', 'Small Firms', 'Renovators'],
  },
  {
    id: 'construction-4',
    name: 'Side Accent',
    thumbnailUrl: '/templates/invoicepagetemplates/SideAccent.png',
    category: 'Construction',
    toolType: 'Invoice',
    description: 'Features a colored side panel for a touch of branding while keeping the main content area clean.',
    useCases: ['General Contractors', 'Commercial Construction'],
  },

  // --- ESTIMATE & QUOTE TEMPLATES ---
  {
    id: 'generic-1',
    name: 'Classic Estimate',
    thumbnailUrl: '/templates/generic-1.png',
    category: 'Generic',
    toolType: 'Estimate',
    description: 'A timeless and professional estimate layout suitable for any industry. Clear, organized, and easy for clients to understand.',
    useCases: ['Any Business', 'General Quotes', 'Proposals'],
  },
  {
    id: 'generic-2',
    name: 'Modern Estimate',
    thumbnailUrl: '/templates/generic-2.png',
    category: 'Generic',
    toolType: 'Estimate',
    description: 'A sleek, contemporary design that puts your brand front and center. Ideal for modern businesses and creative professionals.',
    useCases: ['Agencies', 'Tech Startups', 'Consultants'],
  },
   {
    id: 'generic-1',
    name: 'Classic Quote',
    thumbnailUrl: '/templates/generic-1.png',
    category: 'Generic',
    toolType: 'Quote',
    description: 'A timeless and professional quote layout suitable for any industry. Clear, organized, and easy for clients to understand.',
    useCases: ['Any Business', 'General Quotes', 'Proposals'],
  },
  {
    id: 'generic-2',
    name: 'Modern Quote',
    thumbnailUrl: '/templates/generic-2.png',
    category: 'Generic',
    toolType: 'Quote',
    description: 'A sleek, contemporary design that puts your brand front and center. Ideal for modern businesses and creative professionals.',
    useCases: ['Agencies', 'Tech Startups', 'Consultants'],
  },
   {
    id: 'construction-1-est',
    name: 'Foundation Estimate',
    thumbnailUrl: '/templates/construction-1.png',
    category: 'Construction Estimate',
    toolType: 'Estimate',
    description: 'A detailed estimate template for construction work.',
    useCases: ['Construction', 'Building', 'Contracting'],
  },
  {
    id: 'construction-2-est',
    name: 'Modern Dark Estimate',
    thumbnailUrl: '/templates/construction-2.png',
    category: 'Construction Estimate',
    toolType: 'Estimate',
    description: 'A dark, modern estimate for construction projects.',
    useCases: ['Construction', 'Building', 'Contracting'],
  },
  {
    id: 'construction-3-est',
    name: 'Minimalist Estimate',
    thumbnailUrl: '/templates/construction-3.png',
    category: 'Construction Estimate',
    toolType: 'Estimate',
    description: 'A clean, minimal estimate for construction services.',
    useCases: ['Construction', 'Building', 'Contracting'],
  },
  {
    id: 'construction-4-est',
    name: 'Side Accent Estimate',
    thumbnailUrl: '/templates/construction-4.png',
    category: 'Construction Estimate',
    toolType: 'Estimate',
    description: 'A construction estimate with a colored side accent panel.',
    useCases: ['Construction', 'Building', 'Contracting'],
  },
  {
    id: 'construction-5-est',
    name: 'Bold Grid Estimate',
    thumbnailUrl: '/templates/construction-5.png',
    category: 'Construction Estimate',
    toolType: 'Estimate',
    description: 'A grid-based layout for clear construction estimates.',
    useCases: ['Construction', 'Building', 'Contracting'],
  },
 
  // --- INSURANCE TEMPLATES ---
  {
    id: 'usa-claim-default',
    name: 'USA Claim Form',
    thumbnailUrl: '/templates/Usa-insurance.png',
    category: 'Claims',
    toolType: 'Insurance',
    description: 'A standard, comprehensive claim form template suitable for various insurance types in the USA.',
    useCases: ['Claims Processing', 'Damage Reports', 'Vehicle Insurance'],
  },
  {
    id: 'usa-service',
    name: 'USA Service',
    thumbnailUrl: '/templates/Usa-service.png',
    category: 'Policy',
    toolType: 'Insurance',
    description: 'A professional template for outlining insurance policy details, coverage, and terms for US-based clients.',
    useCases: ['Policy Issuance', 'Coverage Summary', 'Certificates'],
  },
];
