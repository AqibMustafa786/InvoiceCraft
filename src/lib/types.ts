

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
  backgroundColor?: string;
  textColor?: string;
  createdAt?: any;
  updatedAt?: any;
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
  textColor?: string;
  createdAt?: any;
  updatedAt?: any;
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
  taxId?: string; // New field for EIN/Tax ID
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
  projectLocation?: string; // New field for project location
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

export interface RoofingInfo {
  roofMaterial: string;
  shingleBrand: string;
  roofSize: number | null;
  layersToRemove: string;
  roofPitch: string;
  underlaymentType: string;
  flashingDetails: string;
  ventilationSystem: string;
  gutterRepairNeeded: boolean;
  warranty: string;
  estimatedTimeline: string;
  inspectionRequired: 'Yes' | 'No';
}

export interface HVACInfo {
    serviceType: string;
    systemType: string;
    unitSize: number | null; // Tonnage or BTU
    seerRating: string;
    furnaceType: string;
    ductworkRequired: boolean;
    thermostatType: string;
    existingSystemCondition: string;
    refrigerantType: string;
}

export interface PlumbingInfo {
    serviceType: string;
    fixtureType: string; // e.g., Sink, Toilet, Shower, Water Heater
    pipeMaterial: string;
    floorLevel: string;
    emergencyService: boolean;
    waterPressureIssue: boolean;
    leakLocation: string;
    estimatedRepairTime: string;
}

export interface ElectricalInfo {
    serviceType: string;
    wiringType: string;
    panelUpgradeNeeded: boolean;
    panelSize: string;
    outletsFixturesCount: number | null;
    roomsInvolved: string;
    evChargerNeeded: boolean;
    inspectionRequired: boolean;
}

export interface LandscapingInfo {
    serviceType: string;
    propertySize: string;
    grassHeight: string;
    treeCount: number | null;
    fenceLengthNeeded: string;
    yardCondition: 'Good' | 'Moderate' | 'Poor';
}

export interface CleaningInfo {
    cleaningType: string;
    homeSize: number | null;
    bedrooms: number | null;
    bathrooms: number | null;
    kitchenSize: string;
    hasPets: boolean;
    addOns: string[];
    frequency: string;
}

export interface AutoRepairInfo {
    vehicleMake: string;
    vehicleModel: string;
    vehicleYear: number | null;
    vin: string;
    mileage: number | null;
    issueDescription: string;
    partsRequired: string;
    diagnosticType: 'Basic' | 'Advanced';
}

export interface ConstructionInfo {
  projectType: string;
  squareFootage: number | null;
  lotSize: string;
  buildingType: string;
  permitRequired: boolean;
  architectDrawingsProvided: boolean;
  soilCondition: string;
  materialPreference: string;
  inspectionRequired: boolean;
}

export interface ITFreelanceInfo {
  projectType: string;
  scopeOfWork: string;
  pagesScreensCount: number | null;
  designStyle: string;
  featuresNeeded: string;
  integrations: string;
  revisionsIncluded: number | null;
  deliveryTimeline: string;
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
  roofing: RoofingInfo;
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
