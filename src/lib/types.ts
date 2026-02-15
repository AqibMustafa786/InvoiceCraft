
'use client';

import { z } from 'zod';

export interface CustomField {
  id: string;
  label: string;
  value: string;
}

export interface LineItem {
  id: string;
  name: string;
  description?: string;
  quantity: number;
  unitPrice: number;
  rate?: number; // Keep for invoice compatibility
  taxable?: boolean;
}

export interface UserProfile {
  uid: string;
  companyId?: string | null;
  plan?: string;
  role?: string;
  name?: string;
  email?: string;
  [key: string]: any;
}

export type DocumentStatus = 'draft' | 'sent' | 'paid' | 'overdue' | 'accepted' | 'rejected' | 'expired' | 'active' | 'cancelled' | 'unpaid' | 'partially-paid';

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
  email: string;
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

export interface PortalSettings {
  enabled: boolean;
  slug: string;
  title: string;
  description: string;
  logoUrl?: string;
  backgroundColor: string;
  primaryColor: string;
  loginButtonText: string;
  footerText?: string;
  // Modern Options
  glassmorphism: boolean;
  borderRadius: string; // 'none', 'sm', 'md', 'lg', 'xl', 'full'
  shadowDepth: string;   // 'none', 'sm', 'md', 'lg', 'xl'
  backgroundStyle: string; // 'solid', 'gradient', 'mesh'
  gradientColor?: string;
  fontFace: string;      // 'Inter', 'Roboto', 'Playfair Display', 'Montserrat'
  fontColor?: string;    // Custom font color
}

export interface Company {
  id: string;
  name: string;
  address: string;
  phone: string;
  website: string;
  logoUrl: string;
  ownerId: string;
  createdAt: any;
  updatedAt: any;
  portalSettings?: PortalSettings;
}

export interface ClientInfo {
  clientId?: string; // Unique identifier for the client
  name: string;
  companyName?: string;
  address: string;
  phone: string;
  email: string;
  projectLocation?: string;
  shippingAddress?: string;
}

export interface Client {
  id: string;
  companyId: string;
  name: string;
  companyName?: string;
  email: string;
  phone?: string;
  address: string;
  shippingAddress?: string;
  website?: string;
  taxId?: string;
  notes?: string;
  avatarUrl?: string;
  createdAt: any;
  updatedAt: any;
  auditLog?: AuditLogEntry[];
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
  laborRate?: number | null;
  equipmentRentalFees?: number | null;
  wasteDisposalFee?: number | null;
  projectStartDate?: Date | null;
  projectEndDate?: Date | null;
  squareFootage?: number | null;
}

export interface RoofingInfo {
  roofType: string;
  squareFootage?: number | null;
  pitch: string;
  tearOffRequired: boolean;
  underlaymentType: string;
  dumpsterFee?: number | null;
  roofMaterial?: string;
  shingleBrand?: string;
  roofSize?: string;
  layersToRemove?: number | string; // Updated to allow string if needed ("1 layer")
  roofPitch?: string;
  flashingDetails?: string;
  ventilationSystem?: string;
  gutterRepairNeeded?: boolean;
  warranty?: string;
  estimatedTimeline?: string;
  inspectionRequired?: boolean;
}

export interface PlumbingInfo {
  serviceType: string;
  fixtureType: string;
  pipeMaterial: string;
  floorLevel: string;
  emergencyService: boolean;
  waterPressureIssue: boolean;
  leakLocation: string;
  estimatedRepairTime: string;
  fixtureName?: string;
  emergencyFee?: number | null;
}

export interface ElectricalInfo {
  serviceType: string;
  wiringType?: string;
  panelUpgradeNeeded: boolean;
  panelSize: string;
  outletsFixturesCount?: number | null;
  roomsInvolved: string;
  evChargerNeeded: boolean;
  inspectionRequired: boolean;
  voltage?: string;
  fixtureDevice?: string;
  permitCost?: number | null;
}

export interface HVACInfo {
  serviceType?: string;
  systemType: string;
  unitSize?: number | null;
  seerRating: string;
  furnaceType: string;
  ductworkRequired: boolean;
  thermostatType: string;
  existingSystemCondition: string;
  refrigerantType: string;
  maintenanceFee?: number | null;
  unitType?: string;
  modelNumber?: string;
}

export interface LandscapingInfo {
  serviceType: string;
  propertySize: string;
  grassHeight: string;
  treeCount?: number | null;
  fenceLengthNeeded: string; // Changed to string to match usage
  yardCondition: string;
  lawnSquareFootage?: number | null;
  equipmentFee?: number | null;
  disposalFee?: number | null;
}

export interface CleaningInfo {
  cleaningType: string;
  homeSize?: number | null;
  bedrooms?: number | null;
  bathrooms?: number | null;
  kitchenSize: string;
  hasPets: boolean;
  addOns: string[];
  frequency: string;
  numberOfRooms?: number | null;
  squareFootage?: number | null;
  suppliesFee?: number | null;
  recurringSchedule?: string;
}

export interface ITFreelanceInfo {
  projectType: string;
  scopeOfWork: string;
  pagesScreensCount?: number | null;
  designStyle: string;
  featuresNeeded: string;
  integrations: string;
  revisionsIncluded?: number | null;
  deliveryTimeline: string;
  projectName?: string;
  hourlyRate?: number | null;
  fixedRate?: number | null;
  hoursLogged?: number | null;
  milestoneDescription?: string;
}

export interface AuditLogEntry {
  id: string;
  action: 'created' | 'updated' | 'viewed' | 'signed' | 'declined' | 'sent';
  timestamp: any;
  user: any;
  version: number;
  changes?: string[];
}

export interface Invoice {
  id: string;
  userId: string;
  companyId: string;
  clientId?: string;
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
  accentColor?: string;
  createdAt?: any;
  updatedAt?: any;
  amountPaid?: number;
  poNumber: string;
  auditLog: AuditLogEntry[];
  customFields?: CustomField[];

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

export interface HomeRemodelingInfo {
  projectType: string;
  propertyType: string;
  squareFootage: number | null;
  roomsIncluded: string;
  materialGrade: 'Basic' | 'Standard' | 'Premium';
  demolitionRequired: boolean;
  permitRequired: boolean;
  specialInstructions: string;
  expectedStartDate: Date | null;
  expectedCompletionDate: Date | null;
}

export interface Estimate {
  id: string;
  userId: string;
  companyId: string;
  clientId?: string;
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
  auditLog: AuditLogEntry[];
  customFields?: CustomField[];

  fontFamily?: string;
  fontSize?: number;
  backgroundColor?: string;
  textColor?: string;
  accentColor?: string;
  createdAt?: any;
  updatedAt?: any;

  // Category specific data
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
  photography?: PhotographyInfo;
  transportation?: TransportationInfo;
  medical?: MedicalInfo;
  legal?: LegalInfo;
  consulting?: ConsultingInfo;
  retail?: RetailInfo;
  rental?: RentalInfo;
  realEstate?: RealEstateInfo;
  itServices?: ITServiceInfo;
  ecommerce?: EcommerceInfo;
}

export type Quote = Estimate & { documentType: 'quote' };

export interface ConsultingInfo {
  consultationType: string;
  sessionHours?: number | null;
  retainerFee?: number | null;
}

export interface LegalInfo {
  caseName: string;
  caseNumber: string;
  serviceType: string;
  hourlyRate?: number | null;
  hoursWorked?: number | null;
  retainerAmount?: number | null;
  courtFilingFees?: number | null;
  travelTime?: number | null;
  additionalDisbursements?: string | null;
}

export interface MedicalInfo {
  patientName: string;
  patientId: string;
  serviceType: string;
  cptCode: string;
  icdCode: string;
  visitDate?: Date | null;
  physicianName: string;
  copayAmount?: number | null;
  labFee?: number | null;
  medicationCharges?: number | null;
}

export interface AutoRepairInfo {
  vehicleMake: string;
  vehicleModel: string;
  year?: number | null;
  vehicleYear?: number;
  licensePlate: string;
  vin: string;
  odometer?: number | null;
  mileage?: number;
  laborHours?: number | null;
  laborRate?: number | null;
  diagnosticFee?: number | null;
  shopSupplyFee?: number | null;
  towingFee?: number | null;
  parts: { name: string; partNumber: string; cost: number; }[];
  issueDescription?: string;
  partsRequired?: string;
  diagnosticType?: string;
}

export interface EcommerceInfo {
  orderNumber: string;
  sku: string;
  productCategory: string;
  weight?: number | null;
  quantity?: number | null;
  shippingCost?: number | null;
  shippingCarrier: string;
  trackingId: string;
  salesTax?: number | null;
  packagingFee?: number | null;
}

export interface RetailInfo {
  sku: string;
  productName: string;
  productCategory: string;
  unitOfMeasure: string;
  batchNumber: string;
  stockQuantity?: number | null;
  wholesalePrice?: number | null;
  shippingPalletCost?: number | null;
}

export interface PhotographyInfo {
  eventType: string;
  shootDate?: Date | null;
  hoursOfCoverage?: number | null;
  packageSelected: string;
  editedPhotosCount?: number | null;
  rawFilesCost?: number | null;
  travelFee?: number;
  equipmentRentalFee?: number;
}

export interface RealEstateInfo {
  propertyAddress: string;
  unitNumber: string;
  leaseTerm: string;
  tenantName: string;
  monthlyRent?: number | null;
  cleaningFee?: number | null;
  maintenanceFee?: number | null;
  lateFee?: number | null;
  hoaCharges?: number | null;
  utilityCharges?: number | null;
}

export interface TransportationInfo {
  pickupLocation: string;
  dropoffLocation: string;
  milesDriven?: number | null;
  ratePerMile?: number | null;
  weight?: number | null;
  loadType: string;
  fuelSurcharge?: number | null;
  tollCharges?: number | null;
  detentionFee?: number | null;
}

export interface ITServiceInfo {
  serviceType: string;
  hourlyRate?: number | null;
  hardwareReplacementCost?: number | null;
  monthlyMaintenanceFee?: number | null;
  deviceType: string;
  serialNumber: string;
  hoursWorked?: number | null;
}

export interface RentalInfo {
  rentalItemName: string;
  rentalStartDate?: Date | null;
  rentalEndDate?: Date | null;
  dailyRate?: number | null;
  hourlyRate?: number | null;
  numberOfDays?: number | null;
  numberOfHours?: number | null;
  securityDeposit?: number | null;
  damageCharges?: number | null;
  deliveryFee?: number | null;
  pickupFee?: number | null;
}


export interface PolicyHolderInfo {
  clientId?: string;
  name: string;
  companyName?: string;
  address: string;
  phone: string;
  email: string;
  identificationNumber?: string; // CNIC, Passport, etc.
}

export type InsuranceCategory = 'Health' | 'Vehicle' | 'Property' | 'Life' | 'Business' | 'Travel' | 'Other';

export interface HealthInsuranceInfo {
  insuredPersonName: string;
  dateOfBirth: Date | null;
  gender: 'Male' | 'Female' | 'Other';
}

export interface VehicleInsuranceInfo {
  vehicleMake: string;
  model: string;
  registrationNumber: string;
  engineNumber: string;
  chassisNumber: string;
}

export interface PropertyInsuranceInfo {
  propertyAddress: string;
  propertyType: 'Residential' | 'Commercial';
  estimatedValue: number | null;
}

export interface Attachment {
  name: string;
  url: string;
  type: 'id_proof' | 'property_doc' | 'medical_report' | 'other';
}

export interface InsuranceDocument {
  id: string;
  userId: string;
  companyId: string;
  logoUrl?: string;
  business: BusinessInfo;

  policyHolder: PolicyHolderInfo;

  policyId: string;
  claimNumber: string;
  dateOfLoss: string;
  typeOfClaim: string;

  insuranceCompany: {
    name: string;
    address: string;
    phone: string;
    email: string;
    agentName: string;
    agentLicenseNumber: string;
  }

  policyNumber: string;
  documentType: 'insurance';
  documentDate: Date;

  items: LineItem[];
  tax: number;
  discount: number;
  shippingCost: number;

  termsAndConditions: string;
  internalNotes?: string;

  currency: string;
  language: string;
  template: string;
  createdAt: any;
  updatedAt: any;
  textColor: string;
  backgroundColor: string;
  fontFamily: string;

  // Insured Entity Details
  insuranceCategory: InsuranceCategory;
  insuredItemDescription: string;
  coveragePurpose: string;
  coverageAmount: number;
  deductibleAmount: number;
  coverageScope: string;
  includedRisks: string;
  excludedRisks: string;

  health?: HealthInsuranceInfo;
  vehicle?: VehicleInsuranceInfo;
  property?: PropertyInsuranceInfo;

  // New Policy Information
  policyType: 'Comprehensive' | 'Third-Party' | 'Basic' | 'Premium';
  policyStartDate: Date;
  policyEndDate: Date;
  renewalOption: boolean;
  status: DocumentStatus;

  // Premium & Payment
  paymentFrequency: 'Monthly' | 'Quarterly' | 'Yearly' | 'One-time';
  paymentMethod: 'Cash' | 'Bank Transfer' | 'Online';
  paymentStatus: 'Unpaid' | 'Partially Paid' | 'Paid';

  attachments?: Attachment[];
  auditLog: AuditLogEntry[];
}


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

export interface Subtask {
  id: string;
  title: string;
  completed: boolean;
}

export interface TaskComment {
  id: string;
  text: string;
  userId: string;
  userName?: string;
  createdAt: any;
}

export interface Task {
  id: string;
  title: string;
  description: string;
  status: 'todo' | 'in-progress' | 'done';
  priority: 'low' | 'medium' | 'high';
  assigneeId?: string;
  assigneeName?: string;
  dueDate?: Date | null;
  createdBy: string;
  companyId: string;
  createdAt: any;
  updatedAt: any;
  subtasks?: Subtask[];
  comments?: TaskComment[];
}

export type TaskStatus = 'todo' | 'in-progress' | 'done';
export type TaskPriority = 'low' | 'medium' | 'high';
