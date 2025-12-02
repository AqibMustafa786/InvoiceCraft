

export interface LineItem {
  id: string;
  name: string;
  description?: string;
  quantity: number;
  unitPrice: number;
  rate?: number; // Keep for invoice compatibility
  taxable?: boolean;
}

export type DocumentStatus = 'draft' | 'sent' | 'paid' | 'overdue' | 'accepted' | 'rejected' | 'expired';

export interface Invoice {
  id: string; 
  userId: string;
  companyName: string;
  companyPhone: string;
  companyAddress: string;
  clientName: string;
  clientAddress: string;
  clientEmail: string;
  shippingAddress: string;
  invoiceNumber: string;
  poNumber: string;
  invoiceDate: Date;
  dueDate: Date;
  trackingNumber: string;
  items: LineItem[];
  tax: number;
  discount: number;
  shippingCost: number;
  amountPaid: number;
  paymentInstructions: string;
  status: DocumentStatus;
  currency: string;
  language: string;
  template: string;
  documentType: 'invoice';
  fontFamily?: string;
  fontSize?: number;
  headingColor?: string;
  textColor?: string;
}

export interface InsuranceDocument {
  id: string;
  companyName: string;
  companyPhone: string;
  companyAddress: string;

  // Insured/Policyholder Details
  insuredName: string;
  policyId: string;
  insuredAddress: string;
  insuredPhone: string;
  insuredEmail: string;

  // Claim/Incident Details
  claimNumber: string;
  dateOfLoss: string;
  typeOfClaim: string;
  incidentDescription: string;
  insuranceCompany: string;
  adjusterInfo: string;

  // Invoice-like details
  documentNumber: string;
  documentDate: Date;
  
  items: LineItem[];
  tax: number;
  discount: number;
  shippingCost: number;

  notes: string;
  
  currency: string;
  language: string;
  template: string;
  fontFamily?: string;
  fontSize?: number;
  headingColor?: string;
  textColor?: string;
}

// New refined Estimate Structure
export interface BusinessInfo {
  name: string;
  address: string;
  phone: string;
  email: string;
  website: string;
  licenseNumber: string;
  logoUrl?: string;
  ownerSignature?: {
    image: string;
    signedAt: any; // Firestore Timestamp
    signerName: string;
  }
}

export interface ClientInfo {
  name: string;
  companyName: string;
  address: string;
  phone: string;
  email: string;
}

export interface EstimateSummary {
    subtotal: number;
    taxPercentage: number;
    taxAmount: number;
    discount: number; // For simplicity, we'll use a fixed amount as discussed in implementation
    grandTotal: number;
    shippingCost: number;
}

export interface SignatureInfo {
    image: string;
    signedAt: any; // Firestore Timestamp
    signerName: string;
    signerIP?: string; // Optional, can be captured server-side
}

export interface AuditLogEntry {
    action: 'created' | 'viewed' | 'signed' | 'declined' | 'sent';
    timestamp: any; // Firestore Timestamp
    actor?: 'user' | 'client';
    details?: string;
}

export interface Estimate {
  id: string;
  userId: string;
  estimateNumber: string;
  estimateDate: Date;
  validUntilDate: Date;
  status: DocumentStatus;
  
  business: BusinessInfo;
  client: ClientInfo;
  lineItems: LineItem[];
  summary: EstimateSummary;
  
  projectTitle: string;
  referenceNumber: string;
  
  termsAndConditions: string;
  
  template: string;
  documentType: 'estimate' | 'quote';
  language: string;
  currency: string;
  isPublic?: boolean;
  
  clientSignature?: SignatureInfo;
  auditLog?: AuditLogEntry[];

  fontFamily?: string;
  fontSize?: number;
  headingColor?: string;
  textColor?: string;
}

export type Quote = Estimate & { documentType: 'quote' };
