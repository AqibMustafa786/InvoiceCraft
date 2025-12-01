


export interface LineItem {
  id: string;
  name: string;
  description?: string;
  quantity: number;
  unitPrice: number;
}

export type DocumentStatus = 'draft' | 'sent' | 'paid' | 'overdue' | 'accepted' | 'rejected';

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
    discount: number; // Can be percentage or fixed amount
    grandTotal: number;
    shippingCost: number;
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
  attachments?: string[];
  signatureRequired?: boolean;

  template: string;
  documentType: 'estimate';
  language: string;
  currency: string;
}

export type Quote = Estimate;
