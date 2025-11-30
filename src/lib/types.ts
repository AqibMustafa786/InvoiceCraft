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
  // New Insurance Fields
  insuredName?: string;
  claimNumber?: string;
  dateOfLoss?: string;
  insuranceCompany?: string;
}
