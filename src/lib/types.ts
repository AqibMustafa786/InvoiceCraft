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
  companyAddress: string;
  clientName: string;
  clientAddress: string;
  clientEmail: string;
  invoiceNumber: string;
  invoiceDate: Date;
  dueDate: Date;
  items: LineItem[];
  tax: number;
  discount: number;
  notes: string;
  status: InvoiceStatus;
  currency: string;
  language: string;
  template: string;
}
