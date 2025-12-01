export interface LineItem {
  id: string;
  name: string;
  quantity: number;
  rate: number;
}

export type InvoiceStatus = 'draft' | 'sent' | 'paid' | 'overdue';

export interface Invoice {
  id: string; 
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
  status: InvoiceStatus;
  currency: string;
  language: string;
  template: string;
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

export interface Estimate {
  id: string;
  companyName: string;
  companyPhone: string;
  companyAddress: string;
  clientName: string;
  clientAddress: string;
  clientEmail: string;
  estimateNumber: string;
  estimateDate: Date;
  validUntilDate: Date;
  items: LineItem[];
  tax: number;
  discount: number;
  shippingCost: number;
  notes: string;
  currency: string;
  language: string;
  template: string;
}
