
export interface Template {
  id: string;
  name: string;
  thumbnailUrl: string;
  category: string;
  toolType: 'Invoice' | 'Estimate' | 'Quote' | 'Insurance';
  description: string;
  useCases: string[];
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
    id: 'construction-1',
    name: 'Foundation',
    thumbnailUrl: '/templates/invoice_page_templates/foundation.png',
    category: 'Construction',
    toolType: 'Invoice',
    description: 'A professional and clear template designed for construction projects, with sections for detailed work descriptions.',
    useCases: ['Construction', 'Contractors', 'Building'],
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
