
import { z } from 'zod';

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

export type InvoiceCategory = 
  | "General Services"
  | "Construction"
  | "Plumbing"
  | "Electrical Services"
  | "HVAC Services"
  | "Roofing"
  | "Landscaping & Lawn Care"
  | "Cleaning Services"
  | "Freelance / Agency"
  | "Consulting"
  | "Legal Services"
  | "Medical / Healthcare"
  | "Auto Repair"
  | "E-commerce / Online Store"
  | "Retail / Wholesale"
  | "Photography"
  | "Real Estate / Property Management"
  | "Transportation / Trucking"
  | "IT Services / Tech Support"
  | "Rental / Property";

export interface BusinessInfo {
  name: string;
  address: string;
  phone: string;
  email:string;
  website: string;
  licenseNumber: string;
  logoUrl?: string;
  taxId?: string; // New field for EIN/Tax ID
  ownerSignature?: {
    image: string;
    signedAt: any; // Firestore Timestamp
    signerName: string;
  }
}

export interface ClientInfo {
  name: string;
  companyName?: string;
  address: string;
  phone: string;
  email: string;
  projectLocation?: string;
  shippingAddress?: string;
}

export interface EstimateSummary {
    subtotal: number;
    taxPercentage: number;
    taxAmount: number;
    discount: number; // For simplicity, we'll use a fixed amount as discussed in implementation
    grandTotal: number;
    shippingCost: number;
}

export interface ConstructionInfo {
  jobSiteAddress: string;
  permitNumber: string;
  laborRate: number | null;
  equipmentRentalFees: number | null;
  wasteDisposalFee: number | null;
  projectStartDate: Date | null;
  projectEndDate: Date | null;
}

export interface RoofingInfo {
  roofType: string;
  squareFootage: number | null;
  pitch: string;
  tearOffRequired: boolean;
  underlaymentType: string;
  dumpsterFee: number | null;
}

export interface PlumbingInfo {
    serviceType: string;
    pipeMaterial: string;
    fixtureName: string;
    emergencyFee: number | null;
}

export interface ElectricalInfo {
    serviceType: string;
    voltage: string;
    fixtureDevice: string;
    permitCost: number | null;
}

export interface HVACInfo {
    unitType: string;
    modelNumber: string;
    refrigerantType: string;
    maintenanceFee: number | null;
}

export interface LandscapingInfo {
    lawnSquareFootage: number | null;
    serviceType: string;
    equipmentFee: number | null;
    disposalFee: number | null;
}

export interface CleaningInfo {
    cleaningType: string;
    numberOfRooms: number | null;
    squareFootage: number | null;
    suppliesFee: number | null;
    recurringSchedule: string;
}

export interface ConsultingInfo {
  consultationType: string;
  sessionHours: number | null;
  retainerFee: number | null;
}

export interface LegalInfo {
  caseName: string;
  caseNumber: string;
  serviceType: string;
  hourlyRate: number | null;
  hoursWorked: number | null;
  retainerAmount: number | null;
  courtFilingFees: number | null;
  travelTime: number | null;
  additionalDisbursements: string | null;
}

export interface MedicalInfo {
  patientName: string;
  patientId: string;
  serviceType: string;
  cptCode: string;
  icdCode: string;
  visitDate: Date | null;
  physicianName: string;
  copayAmount: number | null;
  labFee: number | null;
  medicationCharges: number | null;
}

export interface AutoRepairInfo {
    vehicleMake: string;
    vehicleModel: string;
    year: number | null;
    licensePlate: string;
    vin: string;
    odometer: number | null;
    laborHours: number | null;
    laborRate: number | null;
    diagnosticFee: number | null;
    shopSupplyFee: number | null;
    towingFee: number | null;
    parts: { name: string; partNumber: string; cost: number; }[];
}

export interface EcommerceInfo {
  orderNumber: string;
  sku: string;
  productCategory: string;
  weight: number | null;
  quantity: number | null;
  shippingCost: number | null;
  shippingCarrier: string;
  trackingId: string;
  salesTax: number | null;
  packagingFee: number | null;
}

export interface RetailInfo {
  sku: string;
  productName: string;
  productCategory: string;
  unitOfMeasure: string;
  batchNumber: string;
  stockQuantity: number | null;
  wholesalePrice: number | null;
  shippingPalletCost: number | null;
}

export interface PhotographyInfo {
  eventType: string;
  shootDate: Date | null;
  hoursOfCoverage: number | null;
  packageSelected: string;
  editedPhotosCount: number | null;
  rawFilesCost: number | null;
  travelFee: number | null;
  equipmentRentalFee: number | null;
}

export interface RealEstateInfo {
  propertyAddress: string;
  unitNumber: string;
  leaseTerm: string;
  tenantName: string;
  monthlyRent: number | null;
  cleaningFee: number | null;
  maintenanceFee: number | null;
  lateFee: number | null;
  hoaCharges: number | null;
  utilityCharges: number | null;
}

export interface TransportationInfo {
  pickupLocation: string;
  dropoffLocation: string;
  milesDriven: number | null;
  ratePerMile: number | null;
  weight: number | null;
  loadType: string;
  fuelSurcharge: number | null;
  tollCharges: number | null;
  detentionFee: number | null;
}

export interface ITServiceInfo {
  serviceType: string;
  hourlyRate: number | null;
  hardwareReplacementCost: number | null;
  monthlyMaintenanceFee: number | null;
  deviceType: string;
  serialNumber: string;
  hoursWorked: number | null;
}

export interface RentalInfo {
  rentalItemName: string;
  rentalStartDate: Date | null;
  rentalEndDate: Date | null;
  dailyRate: number | null;
  hourlyRate: number | null;
  numberOfDays: number | null;
  numberOfHours: number | null;
  securityDeposit: number | null;
  damageCharges: number | null;
  deliveryFee: number | null;
  pickupFee: number | null;
}


export interface ITFreelanceInfo {
  projectName: string;
  hourlyRate: number | null;
  fixedRate: number | null;
  hoursLogged: number | null;
  milestoneDescription: string;
}

export interface Invoice {
  id: string; 
  userId: string;
  business: BusinessInfo;
  client: ClientInfo;
  invoiceNumber: string;
  invoiceDate: Date;
  dueDate: Date;
  lineItems: LineItem[];
  summary: EstimateSummary;
  paymentInstructions: string;
  status: DocumentStatus;
  currency: string;
  language: string;
  template: string;
  documentType: 'invoice';
  category: InvoiceCategory;
  fontFamily?: string;
  fontSize?: number;
  backgroundColor?: string;
  textColor?: string;
  createdAt?: any;
  updatedAt?: any;
  poNumber?: string;
  amountPaid?: number;
  trackingNumber?: string;

  // Category specific data
  construction?: ConstructionInfo;
  plumbing?: PlumbingInfo;
  electrical?: ElectricalInfo;
  hvac?: HVACInfo;
  roofing?: RoofingInfo;
  landscaping?: LandscapingInfo;
  cleaning?: CleaningInfo;
  freelance?: ITFreelanceInfo;
  consulting?: ConsultingInfo;
  legal?: LegalInfo;
  medical?: MedicalInfo;
  autoRepair?: AutoRepairInfo;
  ecommerce?: EcommerceInfo;
  rental?: RentalInfo;
  retail?: RetailInfo;
  photography?: PhotographyInfo;
  realEstate?: RealEstateInfo;
  transportation?: TransportationInfo;
  itServices?: ITServiceInfo;
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

export type EstimateCategory = 
  | "Generic"
  | "Home Remodeling / Renovation"
  | "Roofing Estimate"
  | "HVAC (Air Conditioning / Heating)"
  | "Plumbing Estimate"
  | "Electrical Estimate"
  | "Landscaping Estimate"
  | "Cleaning Estimate"
  | "Auto Repair Estimate"
  | "Construction Estimate"
  | "IT / Freelance Estimate";

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
  category: EstimateCategory;
  documentType: 'estimate' | 'quote';
  language: string;
  currency: string;
  isPublic: boolean;
  
  clientSignature?: SignatureInfo;
  auditLog?: AuditLogEntry[];

  fontFamily?: string;
  fontSize?: number;
  backgroundColor?: string;
  textColor?: string;
  createdAt?: any;
  updatedAt?: any;

  // Category specific data
  homeRemodeling?: HomeRemodelingInfo;
  roofing?: RoofingInfo;
  hvac?: HVACInfo;
  plumbing?: PlumbingInfo;
  electrical?: ElectricalInfo;
  landscaping?: LandscapingInfo;
  cleaning?: CleaningInfo;
  autoRepair?: AutoRepairInfo;
  construction?: ConstructionInfo;
  itFreelance?: ITFreelanceInfo;
}

export type Quote = Estimate & { documentType: 'quote' };

// Stripe Checkout Types
export const StripeCheckoutInputSchema = z.object({
  userId: z.string(),
  userEmail: z.string().email(),
  companyId: z.string(),
  plan: z.enum(['monthly', 'yearly']),
});
export type StripeCheckoutInput = z.infer<typeof StripeCheckoutInputSchema>;

export const StripeCheckoutOutputSchema = z.object({
  sessionId: z.string().optional(),
  url: z.string().url().optional(),
  error: z.string().optional(),
});
export type StripeCheckoutOutput = z.infer<typeof StripeCheckoutOutputSchema>;
