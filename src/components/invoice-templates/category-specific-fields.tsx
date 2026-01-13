
'use client';

import { ChangeEvent } from 'react';
import type { Invoice } from '@/lib/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Textarea } from '@/components/ui/textarea';
import { DatePicker } from '@/components/ui/datepicker';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { HardHat, Wrench, Zap, Wind, Hammer, Trees, Sparkles, Code, Briefcase, Scale, HeartPulse, Car, Store, Camera, Building, Truck } from 'lucide-react';

interface CategoryFormFieldsProps {
  invoice: Invoice;
  handleCategoryDataChange: (category: keyof Invoice, e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  handleCategorySelectChange: (category: keyof Invoice, name: string, value: string | boolean | number | null) => void;
  handleDateChange: (category: keyof Invoice, name: string, date: Date | undefined) => void;
}

const plumbingServiceTypes = ["Leak Repair", "Installation", "Sewer Line", "Water Heater", "Drain Cleaning"];
const hvacServiceTypes = ["Install", "Repair", "Replace", "Maintenance"];
const roofMaterials = ["Shingle", "Metal", "Tile", "Flat Roof"];

const CustomSelect = ({ value, onValueChange, options, placeholder, name }: { value: string; onValueChange: (name: string, value: string) => void; options: string[]; placeholder?: string; name: string; }) => {
    // This component remains the same as in your original invoice-form.tsx
    return null; // Placeholder to avoid duplication, assuming it exists elsewhere
};


export const CategorySpecificFormFields: React.FC<CategoryFormFieldsProps> = ({ invoice, handleCategoryDataChange, handleCategorySelectChange, handleDateChange }) => {
    switch (invoice.category) {
        case "Construction":
            return invoice.construction ? (
                <Card className="bg-card/50 backdrop-blur-sm shadow-lg">
                    <CardHeader><CardTitle className="text-base flex items-center gap-2"><HardHat className="h-4 w-4" />Construction Details</CardTitle></CardHeader>
                    <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        <div className="space-y-2"><Label className="text-xs">Job Site Address</Label><Input name="jobSiteAddress" value={invoice.construction.jobSiteAddress} onChange={(e) => handleCategoryDataChange('construction', e)} className="text-xs h-9"/></div>
                        <div className="space-y-2"><Label className="text-xs">Permit Number</Label><Input name="permitNumber" value={invoice.construction.permitNumber} onChange={(e) => handleCategoryDataChange('construction', e)} className="text-xs h-9"/></div>
                        <div className="space-y-2"><Label className="text-xs">Labor Rate (/hr)</Label><Input name="laborRate" type="number" value={invoice.construction.laborRate ?? ''} onChange={(e) => handleCategoryDataChange('construction', e)} className="text-xs h-9"/></div>
                        <div className="space-y-2"><Label className="text-xs">Equipment Rental Fees</Label><Input name="equipmentRentalFees" type="number" value={invoice.construction.equipmentRentalFees ?? ''} onChange={(e) => handleCategoryDataChange('construction', e)} className="text-xs h-9"/></div>
                        <div className="space-y-2"><Label className="text-xs">Waste Disposal Fee</Label><Input name="wasteDisposalFee" type="number" value={invoice.construction.wasteDisposalFee ?? ''} onChange={(e) => handleCategoryDataChange('construction', e)} className="text-xs h-9"/></div>
                        <div className="space-y-2"><Label className="text-xs">Project Start Date</Label><DatePicker date={invoice.construction.projectStartDate} setDate={(date) => handleDateChange('construction', 'projectStartDate', date)} className="h-9 text-xs"/></div>
                        <div className="space-y-2"><Label className="text-xs">Project End Date</Label><DatePicker date={invoice.construction.projectEndDate} setDate={(date) => handleDateChange('construction', 'projectEndDate', date)} className="h-9 text-xs"/></div>
                    </CardContent>
                </Card>
            ) : null;
        case "Plumbing":
            return invoice.plumbing ? (
                <Card className="bg-card/50 backdrop-blur-sm shadow-lg">
                    <CardHeader><CardTitle className="text-base flex items-center gap-2"><Wrench className="h-4 w-4" />Plumbing Details</CardTitle></CardHeader>
                    <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        <div className="space-y-2"><Label className="text-xs">Service Type</Label><Select name="serviceType" value={invoice.plumbing.serviceType} onValueChange={(value) => handleCategorySelectChange('plumbing', 'serviceType', value)}><SelectTrigger className="h-9 text-xs"><SelectValue placeholder="Select service type" /></SelectTrigger><SelectContent>{plumbingServiceTypes.map(o => <SelectItem key={o} value={o}>{o}</SelectItem>)}</SelectContent></Select></div>
                        <div className="space-y-2"><Label className="text-xs">Pipe Material</Label><Input name="pipeMaterial" value={invoice.plumbing.pipeMaterial} onChange={(e) => handleCategoryDataChange('plumbing', e)} className="text-xs h-9"/></div>
                        <div className="space-y-2"><Label className="text-xs">Fixture Name</Label><Input name="fixtureName" value={invoice.plumbing.fixtureName} onChange={(e) => handleCategoryDataChange('plumbing', e)} className="text-xs h-9"/></div>
                        <div className="space-y-2"><Label className="text-xs">Emergency Fee</Label><Input name="emergencyFee" type="number" value={invoice.plumbing.emergencyFee ?? ''} onChange={(e) => handleCategoryDataChange('plumbing', e)} className="text-xs h-9"/></div>
                    </CardContent>
                </Card>
            ) : null;
        case "Electrical Services":
            return invoice.electrical ? (
                <Card className="bg-card/50 backdrop-blur-sm shadow-lg">
                    <CardHeader><CardTitle className="text-base flex items-center gap-2"><Zap className="h-4 w-4" />Electrical Service Details</CardTitle></CardHeader>
                    <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        <div className="space-y-2"><Label className="text-xs">Service Type</Label><Input name="serviceType" value={invoice.electrical.serviceType} onChange={(e) => handleCategoryDataChange('electrical', e)} className="text-xs h-9"/></div>
                        <div className="space-y-2"><Label className="text-xs">Voltage</Label><Input name="voltage" value={invoice.electrical.voltage} onChange={(e) => handleCategoryDataChange('electrical', e)} className="text-xs h-9"/></div>
                        <div className="space-y-2"><Label className="text-xs">Fixture/Device</Label><Input name="fixtureDevice" value={invoice.electrical.fixtureDevice} onChange={(e) => handleCategoryDataChange('electrical', e)} className="text-xs h-9"/></div>
                        <div className="space-y-2"><Label className="text-xs">Permit Cost</Label><Input name="permitCost" type="number" value={invoice.electrical.permitCost ?? ''} onChange={(e) => handleCategoryDataChange('electrical', e)} className="text-xs h-9"/></div>
                    </CardContent>
                </Card>
            ) : null;
        case "HVAC Services":
            return invoice.hvac ? (
                 <Card className="bg-card/50 backdrop-blur-sm shadow-lg">
                    <CardHeader><CardTitle className="text-base flex items-center gap-2"><Wind className="h-4 w-4" />HVAC Service Details</CardTitle></CardHeader>
                    <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        <div className="space-y-2"><Label className="text-xs">Unit Type</Label><Select name="unitType" value={invoice.hvac.unitType} onValueChange={(value) => handleCategorySelectChange('hvac', 'unitType', value)}><SelectTrigger className="h-9 text-xs"><SelectValue placeholder="Select unit type" /></SelectTrigger><SelectContent>{hvacServiceTypes.map(o => <SelectItem key={o} value={o}>{o}</SelectItem>)}</SelectContent></Select></div>
                        <div className="space-y-2"><Label className="text-xs">Model Number</Label><Input name="modelNumber" value={invoice.hvac.modelNumber} onChange={(e) => handleCategoryDataChange('hvac', e)} className="text-xs h-9"/></div>
                        <div className="space-y-2"><Label className="text-xs">Refrigerant Type</Label><Input name="refrigerantType" value={invoice.hvac.refrigerantType} onChange={(e) => handleCategoryDataChange('hvac', e)} className="text-xs h-9"/></div>
                        <div className="space-y-2"><Label className="text-xs">Maintenance Fee</Label><Input name="maintenanceFee" type="number" value={invoice.hvac.maintenanceFee ?? ''} onChange={(e) => handleCategoryDataChange('hvac', e)} className="text-xs h-9"/></div>
                    </CardContent>
                </Card>
            ) : null;
        case "Roofing":
             return invoice.roofing ? (
                <Card className="bg-card/50 backdrop-blur-sm shadow-lg">
                    <CardHeader><CardTitle className="text-base flex items-center gap-2"><Hammer className="h-4 w-4" />Roofing Details</CardTitle></CardHeader>
                    <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        <div className="space-y-2"><Label className="text-xs">Roof Type</Label><Select name="roofType" value={invoice.roofing.roofType} onValueChange={(value) => handleCategorySelectChange('roofing', 'roofType', value)}><SelectTrigger className="h-9 text-xs"><SelectValue placeholder="Select roof type" /></SelectTrigger><SelectContent>{roofMaterials.map(o => <SelectItem key={o} value={o}>{o}</SelectItem>)}</SelectContent></Select></div>
                        <div className="space-y-2"><Label className="text-xs">Square Footage</Label><Input name="squareFootage" type="number" value={invoice.roofing.squareFootage ?? ''} onChange={(e) => handleCategoryDataChange('roofing', e)} className="text-xs h-9"/></div>
                        <div className="space-y-2"><Label className="text-xs">Pitch</Label><Input name="pitch" value={invoice.roofing.pitch} onChange={(e) => handleCategoryDataChange('roofing', e)} className="text-xs h-9"/></div>
                        <div className="space-y-2"><Label className="text-xs">Underlayment Type</Label><Input name="underlaymentType" value={invoice.roofing.underlaymentType} onChange={(e) => handleCategoryDataChange('roofing', e)} className="text-xs h-9"/></div>
                        <div className="space-y-2"><Label className="text-xs">Dumpster Fee</Label><Input name="dumpsterFee" type="number" value={invoice.roofing.dumpsterFee ?? ''} onChange={(e) => handleCategoryDataChange('roofing', e)} className="text-xs h-9"/></div>
                        <div className="flex items-center space-x-2 pt-6"><Checkbox id="tearOffRequired" name="tearOffRequired" checked={invoice.roofing.tearOffRequired} onCheckedChange={(checked) => handleCategorySelectChange('roofing', 'tearOffRequired', !!checked)} /><Label htmlFor="tearOffRequired" className="text-xs">Tear Off Required</Label></div>
                    </CardContent>
                </Card>
            ) : null;
        case "Landscaping & Lawn Care":
            return invoice.landscaping ? (
                <Card className="bg-card/50 backdrop-blur-sm shadow-lg">
                    <CardHeader><CardTitle className="text-base flex items-center gap-2"><Trees className="h-4 w-4" />Landscaping Details</CardTitle></CardHeader>
                    <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        <div className="space-y-2"><Label className="text-xs">Lawn Square Footage</Label><Input name="lawnSquareFootage" type="number" value={invoice.landscaping.lawnSquareFootage ?? ''} onChange={(e) => handleCategoryDataChange('landscaping', e)} className="text-xs h-9"/></div>
                        <div className="space-y-2"><Label className="text-xs">Service Type</Label><Input name="serviceType" value={invoice.landscaping.serviceType} onChange={(e) => handleCategoryDataChange('landscaping', e)} className="text-xs h-9"/></div>
                        <div className="space-y-2"><Label className="text-xs">Equipment Fee</Label><Input name="equipmentFee" type="number" value={invoice.landscaping.equipmentFee ?? ''} onChange={(e) => handleCategoryDataChange('landscaping', e)} className="text-xs h-9"/></div>
                        <div className="space-y-2"><Label className="text-xs">Disposal Fee</Label><Input name="disposalFee" type="number" value={invoice.landscaping.disposalFee ?? ''} onChange={(e) => handleCategoryDataChange('landscaping', e)} className="text-xs h-9"/></div>
                    </CardContent>
                </Card>
            ) : null;
        case "Cleaning Services":
             return invoice.cleaning ? (
                <Card className="bg-card/50 backdrop-blur-sm shadow-lg">
                    <CardHeader><CardTitle className="text-base flex items-center gap-2"><Sparkles className="h-4 w-4" />Cleaning Service Details</CardTitle></CardHeader>
                    <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        <div className="space-y-2"><Label className="text-xs">Cleaning Type</Label><Input name="cleaningType" value={invoice.cleaning.cleaningType} onChange={(e) => handleCategoryDataChange('cleaning', e)} className="text-xs h-9"/></div>
                        <div className="space-y-2"><Label className="text-xs">Number of Rooms</Label><Input name="numberOfRooms" type="number" value={invoice.cleaning.numberOfRooms ?? ''} onChange={(e) => handleCategoryDataChange('cleaning', e)} className="text-xs h-9"/></div>
                        <div className="space-y-2"><Label className="text-xs">Square Footage</Label><Input name="squareFootage" type="number" value={invoice.cleaning.squareFootage ?? ''} onChange={(e) => handleCategoryDataChange('cleaning', e)} className="text-xs h-9"/></div>
                        <div className="space-y-2"><Label className="text-xs">Supplies Fee</Label><Input name="suppliesFee" type="number" value={invoice.cleaning.suppliesFee ?? ''} onChange={(e) => handleCategoryDataChange('cleaning', e)} className="text-xs h-9"/></div>
                        <div className="space-y-2"><Label className="text-xs">Recurring Schedule</Label><Input name="recurringSchedule" value={invoice.cleaning.recurringSchedule} onChange={(e) => handleCategoryDataChange('cleaning', e)} className="text-xs h-9"/></div>
                    </CardContent>
                </Card>
            ) : null;
        case "Freelance / Agency":
            return invoice.freelance ? (
                <Card className="bg-card/50 backdrop-blur-sm shadow-lg">
                    <CardHeader><CardTitle className="text-base flex items-center gap-2"><Code className="h-4 w-4" />Freelance / Agency Details</CardTitle></CardHeader>
                    <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        <div className="space-y-2 md:col-span-2"><Label className="text-xs">Project Name</Label><Input name="projectName" value={invoice.freelance.projectName} onChange={(e) => handleCategoryDataChange('freelance', e)} className="text-xs h-9"/></div>
                        <div className="space-y-2"><Label className="text-xs">Hourly Rate</Label><Input name="hourlyRate" type="number" value={invoice.freelance.hourlyRate ?? ''} onChange={(e) => handleCategoryDataChange('freelance', e)} className="text-xs h-9"/></div>
                        <div className="space-y-2"><Label className="text-xs">Fixed Rate</Label><Input name="fixedRate" type="number" value={invoice.freelance.fixedRate ?? ''} onChange={(e) => handleCategoryDataChange('freelance', e)} className="text-xs h-9"/></div>
                        <div className="space-y-2"><Label className="text-xs">Hours Logged</Label><Input name="hoursLogged" type="number" value={invoice.freelance.hoursLogged ?? ''} onChange={(e) => handleCategoryDataChange('freelance', e)} className="text-xs h-9"/></div>
                        <div className="space-y-2 md:col-span-2"><Label className="text-xs">Milestone Description</Label><Textarea name="milestoneDescription" value={invoice.freelance.milestoneDescription} onChange={(e) => handleCategoryDataChange('freelance', e)} className="text-xs h-20"/></div>
                    </CardContent>
                </Card>
            ) : null;
        case "Consulting":
             return invoice.consulting ? (
                <Card className="bg-card/50 backdrop-blur-sm shadow-lg">
                    <CardHeader><CardTitle className="text-base flex items-center gap-2"><Briefcase className="h-4 w-4" />Consulting Details</CardTitle></CardHeader>
                    <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        <div className="space-y-2"><Label className="text-xs">Consultation Type</Label><Input name="consultationType" value={invoice.consulting.consultationType} onChange={(e) => handleCategoryDataChange('consulting', e)} className="text-xs h-9"/></div>
                        <div className="space-y-2"><Label className="text-xs">Session Hours</Label><Input name="sessionHours" type="number" value={invoice.consulting.sessionHours ?? ''} onChange={(e) => handleCategoryDataChange('consulting', e)} className="text-xs h-9"/></div>
                        <div className="space-y-2"><Label className="text-xs">Retainer Fee</Label><Input name="retainerFee" type="number" value={invoice.consulting.retainerFee ?? ''} onChange={(e) => handleCategoryDataChange('consulting', e)} className="text-xs h-9"/></div>
                    </CardContent>
                </Card>
            ) : null;
        case "Legal Services":
             return invoice.legal ? (
                <Card className="bg-card/50 backdrop-blur-sm shadow-lg">
                    <CardHeader><CardTitle className="text-base flex items-center gap-2"><Scale className="h-4 w-4" />Legal Service Details</CardTitle></CardHeader>
                    <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        <div className="space-y-2"><Label className="text-xs">Case Name</Label><Input name="caseName" value={invoice.legal.caseName} onChange={(e) => handleCategoryDataChange('legal', e)} className="text-xs h-9"/></div>
                        <div className="space-y-2"><Label className="text-xs">Case Number</Label><Input name="caseNumber" value={invoice.legal.caseNumber} onChange={(e) => handleCategoryDataChange('legal', e)} className="text-xs h-9"/></div>
                        <div className="space-y-2"><Label className="text-xs">Service Type</Label><Input name="serviceType" value={invoice.legal.serviceType} onChange={(e) => handleCategoryDataChange('legal', e)} className="text-xs h-9"/></div>
                        <div className="space-y-2"><Label className="text-xs">Hourly Rate</Label><Input name="hourlyRate" type="number" value={invoice.legal.hourlyRate ?? ''} onChange={(e) => handleCategoryDataChange('legal', e)} className="text-xs h-9"/></div>
                        <div className="space-y-2"><Label className="text-xs">Hours Worked</Label><Input name="hoursWorked" type="number" value={invoice.legal.hoursWorked ?? ''} onChange={(e) => handleCategoryDataChange('legal', e)} className="text-xs h-9"/></div>
                        <div className="space-y-2"><Label className="text-xs">Retainer Amount</Label><Input name="retainerAmount" type="number" value={invoice.legal.retainerAmount ?? ''} onChange={(e) => handleCategoryDataChange('legal', e)} className="text-xs h-9"/></div>
                        <div className="space-y-2"><Label className="text-xs">Court Filing Fees</Label><Input name="courtFilingFees" type="number" value={invoice.legal.courtFilingFees ?? ''} onChange={(e) => handleCategoryDataChange('legal', e)} className="text-xs h-9"/></div>
                        <div className="space-y-2"><Label className="text-xs">Travel Time (hrs)</Label><Input name="travelTime" type="number" value={invoice.legal.travelTime ?? ''} onChange={(e) => handleCategoryDataChange('legal', e)} className="text-xs h-9"/></div>
                        <div className="space-y-2 md:col-span-2"><Label className="text-xs">Additional Disbursements</Label><Input name="additionalDisbursements" value={invoice.legal.additionalDisbursements ?? ''} onChange={(e) => handleCategoryDataChange('legal', e)} className="text-xs h-9"/></div>
                    </CardContent>
                </Card>
            ) : null;
        case "Medical / Healthcare":
            return invoice.medical ? (
                <Card className="bg-card/50 backdrop-blur-sm shadow-lg">
                    <CardHeader><CardTitle className="text-base flex items-center gap-2"><HeartPulse className="h-4 w-4" />Medical Details</CardTitle></CardHeader>
                    <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        <div className="space-y-2"><Label className="text-xs">Patient Name</Label><Input name="patientName" value={invoice.medical.patientName} onChange={(e) => handleCategoryDataChange('medical', e)} className="text-xs h-9"/></div>
                        <div className="space-y-2"><Label className="text-xs">Patient ID</Label><Input name="patientId" value={invoice.medical.patientId} onChange={(e) => handleCategoryDataChange('medical', e)} className="text-xs h-9"/></div>
                        <div className="space-y-2"><Label className="text-xs">Service Type</Label><Input name="serviceType" value={invoice.medical.serviceType} onChange={(e) => handleCategoryDataChange('medical', e)} className="text-xs h-9"/></div>
                        <div className="space-y-2"><Label className="text-xs">CPT Code</Label><Input name="cptCode" value={invoice.medical.cptCode} onChange={(e) => handleCategoryDataChange('medical', e)} className="text-xs h-9"/></div>
                        <div className="space-y-2"><Label className="text-xs">ICD Code</Label><Input name="icdCode" value={invoice.medical.icdCode} onChange={(e) => handleCategoryDataChange('medical', e)} className="text-xs h-9"/></div>
                        <div className="space-y-2"><Label className="text-xs">Visit Date</Label><DatePicker date={invoice.medical.visitDate} setDate={(date) => handleDateChange('medical', 'visitDate', date)} className="h-9 text-xs"/></div>
                        <div className="space-y-2"><Label className="text-xs">Physician Name</Label><Input name="physicianName" value={invoice.medical.physicianName} onChange={(e) => handleCategoryDataChange('medical', e)} className="text-xs h-9"/></div>
                        <div className="space-y-2"><Label className="text-xs">Copay Amount</Label><Input name="copayAmount" type="number" value={invoice.medical.copayAmount ?? ''} onChange={(e) => handleCategoryDataChange('medical', e)} className="text-xs h-9"/></div>
                        <div className="space-y-2"><Label className="text-xs">Lab Fee</Label><Input name="labFee" type="number" value={invoice.medical.labFee ?? ''} onChange={(e) => handleCategoryDataChange('medical', e)} className="text-xs h-9"/></div>
                        <div className="space-y-2"><Label className="text-xs">Medication Charges</Label><Input name="medicationCharges" type="number" value={invoice.medical.medicationCharges ?? ''} onChange={(e) => handleCategoryDataChange('medical', e)} className="text-xs h-9"/></div>
                    </CardContent>
                </Card>
            ) : null;
        case "Auto Repair":
             return invoice.autoRepair ? (
                <Card className="bg-card/50 backdrop-blur-sm shadow-lg">
                    <CardHeader><CardTitle className="text-base flex items-center gap-2"><Car className="h-4 w-4" />Auto Repair Details</CardTitle></CardHeader>
                    <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        <div className="space-y-2"><Label className="text-xs">Vehicle Make</Label><Input name="vehicleMake" value={invoice.autoRepair.vehicleMake} onChange={(e) => handleCategoryDataChange('autoRepair', e)} className="text-xs h-9"/></div>
                        <div className="space-y-2"><Label className="text-xs">Vehicle Model</Label><Input name="vehicleModel" value={invoice.autoRepair.vehicleModel} onChange={(e) => handleCategoryDataChange('autoRepair', e)} className="text-xs h-9"/></div>
                        <div className="space-y-2"><Label className="text-xs">Vehicle Year</Label><Input name="year" type="number" value={invoice.autoRepair.year ?? ''} onChange={(e) => handleCategoryDataChange('autoRepair', e)} className="text-xs h-9"/></div>
                        <div className="space-y-2"><Label className="text-xs">License Plate</Label><Input name="licensePlate" value={invoice.autoRepair.licensePlate} onChange={(e) => handleCategoryDataChange('autoRepair', e)} className="text-xs h-9"/></div>
                        <div className="space-y-2"><Label className="text-xs">VIN</Label><Input name="vin" value={invoice.autoRepair.vin} onChange={(e) => handleCategoryDataChange('autoRepair', e)} className="text-xs h-9"/></div>
                        <div className="space-y-2"><Label className="text-xs">Odometer</Label><Input name="odometer" type="number" value={invoice.autoRepair.odometer ?? ''} onChange={(e) => handleCategoryDataChange('autoRepair', e)} className="text-xs h-9"/></div>
                        <div className="space-y-2"><Label className="text-xs">Labor Hours</Label><Input name="laborHours" type="number" value={invoice.autoRepair.laborHours ?? ''} onChange={(e) => handleCategoryDataChange('autoRepair', e)} className="text-xs h-9"/></div>
                        <div className="space-y-2"><Label className="text-xs">Labor Rate (/hr)</Label><Input name="laborRate" type="number" value={invoice.autoRepair.laborRate ?? ''} onChange={(e) => handleCategoryDataChange('autoRepair', e)} className="text-xs h-9"/></div>
                        <div className="space-y-2"><Label className="text-xs">Diagnostic Fee</Label><Input name="diagnosticFee" type="number" value={invoice.autoRepair.diagnosticFee ?? ''} onChange={(e) => handleCategoryDataChange('autoRepair', e)} className="text-xs h-9"/></div>
                        <div className="space-y-2"><Label className="text-xs">Shop Supply Fee</Label><Input name="shopSupplyFee" type="number" value={invoice.autoRepair.shopSupplyFee ?? ''} onChange={(e) => handleCategoryDataChange('autoRepair', e)} className="text-xs h-9"/></div>
                        <div className="space-y-2"><Label className="text-xs">Towing Fee</Label><Input name="towingFee" type="number" value={invoice.autoRepair.towingFee ?? ''} onChange={(e) => handleCategoryDataChange('autoRepair', e)} className="text-xs h-9"/></div>
                    </CardContent>
                </Card>
            ) : null;
        case "Retail / Wholesale":
            return invoice.retail ? (
                <Card className="bg-card/50 backdrop-blur-sm shadow-lg">
                    <CardHeader><CardTitle className="text-base flex items-center gap-2"><Store className="h-4 w-4" />Retail / Wholesale Details</CardTitle></CardHeader>
                    <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        <div className="space-y-2"><Label className="text-xs">SKU</Label><Input name="sku" value={invoice.retail.sku} onChange={(e) => handleCategoryDataChange('retail', e)} className="text-xs h-9"/></div>
                        <div className="space-y-2"><Label className="text-xs">Product Name</Label><Input name="productName" value={invoice.retail.productName} onChange={(e) => handleCategoryDataChange('retail', e)} className="text-xs h-9"/></div>
                        <div className="space-y-2"><Label className="text-xs">Product Category</Label><Input name="productCategory" value={invoice.retail.productCategory} onChange={(e) => handleCategoryDataChange('retail', e)} className="text-xs h-9"/></div>
                        <div className="space-y-2"><Label className="text-xs">Unit of Measure</Label><Input name="unitOfMeasure" value={invoice.retail.unitOfMeasure} onChange={(e) => handleCategoryDataChange('retail', e)} className="text-xs h-9"/></div>
                        <div className="space-y-2"><Label className="text-xs">Batch Number</Label><Input name="batchNumber" value={invoice.retail.batchNumber} onChange={(e) => handleCategoryDataChange('retail', e)} className="text-xs h-9"/></div>
                        <div className="space-y-2"><Label className="text-xs">Stock Quantity</Label><Input name="stockQuantity" type="number" value={invoice.retail.stockQuantity ?? ''} onChange={(e) => handleCategoryDataChange('retail', e)} className="text-xs h-9"/></div>
                        <div className="space-y-2"><Label className="text-xs">Wholesale Price</Label><Input name="wholesalePrice" type="number" value={invoice.retail.wholesalePrice ?? ''} onChange={(e) => handleCategoryDataChange('retail', e)} className="text-xs h-9"/></div>
                        <div className="space-y-2"><Label className="text-xs">Shipping Pallet Cost</Label><Input name="shippingPalletCost" type="number" value={invoice.retail.shippingPalletCost ?? ''} onChange={(e) => handleCategoryDataChange('retail', e)} className="text-xs h-9"/></div>
                    </CardContent>
                </Card>
            ) : null;
        case "E-commerce / Online Store":
            return invoice.ecommerce ? (
                <Card className="bg-card/50 backdrop-blur-sm shadow-lg">
                    <CardHeader><CardTitle className="text-base flex items-center gap-2"><Store className="h-4 w-4" />E-commerce Details</CardTitle></CardHeader>
                    <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        <div className="space-y-2"><Label className="text-xs">Order Number</Label><Input name="orderNumber" value={invoice.ecommerce.orderNumber} onChange={(e) => handleCategoryDataChange('ecommerce', e)} className="text-xs h-9"/></div>
                        <div className="space-y-2"><Label className="text-xs">SKU</Label><Input name="sku" value={invoice.ecommerce.sku} onChange={(e) => handleCategoryDataChange('ecommerce', e)} className="text-xs h-9"/></div>
                        <div className="space-y-2"><Label className="text-xs">Shipping Carrier</Label><Input name="shippingCarrier" value={invoice.ecommerce.shippingCarrier} onChange={(e) => handleCategoryDataChange('ecommerce', e)} className="text-xs h-9"/></div>
                        <div className="space-y-2"><Label className="text-xs">Tracking ID</Label><Input name="trackingId" value={invoice.ecommerce.trackingId} onChange={(e) => handleCategoryDataChange('ecommerce', e)} className="text-xs h-9"/></div>
                    </CardContent>
                </Card>
            ) : null;
        case "Photography":
            return invoice.photography ? (
                <Card className="bg-card/50 backdrop-blur-sm shadow-lg">
                    <CardHeader><CardTitle className="text-base flex items-center gap-2"><Camera className="h-4 w-4" />Photography Details</CardTitle></CardHeader>
                    <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        <div className="space-y-2"><Label className="text-xs">Event Type</Label><Input name="eventType" value={invoice.photography.eventType} onChange={(e) => handleCategoryDataChange('photography', e)} className="text-xs h-9"/></div>
                        <div className="space-y-2"><Label className="text-xs">Shoot Date</Label><DatePicker date={invoice.photography.shootDate} setDate={(date) => handleDateChange('photography', 'shootDate', date)} className="h-9 text-xs"/></div>
                        <div className="space-y-2"><Label className="text-xs">Hours of Coverage</Label><Input name="hoursOfCoverage" type="number" value={invoice.photography.hoursOfCoverage ?? ''} onChange={(e) => handleCategoryDataChange('photography', e)} className="text-xs h-9"/></div>
                        <div className="space-y-2"><Label className="text-xs">Package Selected</Label><Input name="packageSelected" value={invoice.photography.packageSelected} onChange={(e) => handleCategoryDataChange('photography', e)} className="text-xs h-9"/></div>
                        <div className="space-y-2"><Label className="text-xs">Edited Photos Count</Label><Input name="editedPhotosCount" type="number" value={invoice.photography.editedPhotosCount ?? ''} onChange={(e) => handleCategoryDataChange('photography', e)} className="text-xs h-9"/></div>
                        <div className="space-y-2"><Label className="text-xs">RAW Files Cost</Label><Input name="rawFilesCost" type="number" value={invoice.photography.rawFilesCost ?? ''} onChange={(e) => handleCategoryDataChange('photography', e)} className="text-xs h-9"/></div>
                    </CardContent>
                </Card>
            ) : null;
        case "Real Estate / Property Management":
             return invoice.realEstate ? (
                <Card className="bg-card/50 backdrop-blur-sm shadow-lg">
                    <CardHeader><CardTitle className="text-base flex items-center gap-2"><Building className="h-4 w-4" />Real Estate Details</CardTitle></CardHeader>
                    <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        <div className="space-y-2"><Label className="text-xs">Property Address</Label><Input name="propertyAddress" value={invoice.realEstate.propertyAddress} onChange={(e) => handleCategoryDataChange('realEstate', e)} className="text-xs h-9"/></div>
                        <div className="space-y-2"><Label className="text-xs">Unit Number</Label><Input name="unitNumber" value={invoice.realEstate.unitNumber} onChange={(e) => handleCategoryDataChange('realEstate', e)} className="text-xs h-9"/></div>
                        <div className="space-y-2"><Label className="text-xs">Lease Term</Label><Input name="leaseTerm" value={invoice.realEstate.leaseTerm} onChange={(e) => handleCategoryDataChange('realEstate', e)} className="text-xs h-9"/></div>
                        <div className="space-y-2"><Label className="text-xs">Tenant Name</Label><Input name="tenantName" value={invoice.realEstate.tenantName} onChange={(e) => handleCategoryDataChange('realEstate', e)} className="text-xs h-9"/></div>
                        <div className="space-y-2"><Label className="text-xs">Monthly Rent</Label><Input name="monthlyRent" type="number" value={invoice.realEstate.monthlyRent ?? ''} onChange={(e) => handleCategoryDataChange('realEstate', e)} className="text-xs h-9"/></div>
                        <div className="space-y-2"><Label className="text-xs">Cleaning Fee</Label><Input name="cleaningFee" type="number" value={invoice.realEstate.cleaningFee ?? ''} onChange={(e) => handleCategoryDataChange('realEstate', e)} className="text-xs h-9"/></div>
                        <div className="space-y-2"><Label className="text-xs">Maintenance Fee</Label><Input name="maintenanceFee" type="number" value={invoice.realEstate.maintenanceFee ?? ''} onChange={(e) => handleCategoryDataChange('realEstate', e)} className="text-xs h-9"/></div>
                        <div className="space-y-2"><Label className="text-xs">Late Fee</Label><Input name="lateFee" type="number" value={invoice.realEstate.lateFee ?? ''} onChange={(e) => handleCategoryDataChange('realEstate', e)} className="text-xs h-9"/></div>
                        <div className="space-y-2"><Label className="text-xs">HOA Charges</Label><Input name="hoaCharges" type="number" value={invoice.realEstate.hoaCharges ?? ''} onChange={(e) => handleCategoryDataChange('realEstate', e)} className="text-xs h-9"/></div>
                        <div className="space-y-2"><Label className="text-xs">Utility Charges</Label><Input name="utilityCharges" type="number" value={invoice.realEstate.utilityCharges ?? ''} onChange={(e) => handleCategoryDataChange('realEstate', e)} className="text-xs h-9"/></div>
                    </CardContent>
                </Card>
            ) : null;
        case "Transportation / Trucking":
             return invoice.transportation ? (
                <Card className="bg-card/50 backdrop-blur-sm shadow-lg">
                    <CardHeader><CardTitle className="text-base flex items-center gap-2"><Truck className="h-4 w-4" />Transportation Details</CardTitle></CardHeader>
                    <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        <div className="space-y-2"><Label className="text-xs">Pickup Location</Label><Input name="pickupLocation" value={invoice.transportation.pickupLocation} onChange={(e) => handleCategoryDataChange('transportation', e)} className="text-xs h-9"/></div>
                        <div className="space-y-2"><Label className="text-xs">Dropoff Location</Label><Input name="dropoffLocation" value={invoice.transportation.dropoffLocation} onChange={(e) => handleCategoryDataChange('transportation', e)} className="text-xs h-9"/></div>
                        <div className="space-y-2"><Label className="text-xs">Miles Driven</Label><Input name="milesDriven" type="number" value={invoice.transportation.milesDriven ?? ''} onChange={(e) => handleCategoryDataChange('transportation', e)} className="text-xs h-9"/></div>
                        <div className="space-y-2"><Label className="text-xs">Rate per Mile</Label><Input name="ratePerMile" type="number" value={invoice.transportation.ratePerMile ?? ''} onChange={(e) => handleCategoryDataChange('transportation', e)} className="text-xs h-9"/></div>
                        <div className="space-y-2"><Label className="text-xs">Weight</Label><Input name="weight" type="number" value={invoice.transportation.weight ?? ''} onChange={(e) => handleCategoryDataChange('transportation', e)} className="text-xs h-9"/></div>
                        <div className="space-y-2"><Label className="text-xs">Load Type</Label><Input name="loadType" value={invoice.transportation.loadType} onChange={(e) => handleCategoryDataChange('transportation', e)} className="text-xs h-9"/></div>
                        <div className="space-y-2"><Label className="text-xs">Fuel Surcharge</Label><Input name="fuelSurcharge" type="number" value={invoice.transportation.fuelSurcharge ?? ''} onChange={(e) => handleCategoryDataChange('transportation', e)} className="text-xs h-9"/></div>
                        <div className="space-y-2"><Label className="text-xs">Toll Charges</Label><Input name="tollCharges" type="number" value={invoice.transportation.tollCharges ?? ''} onChange={(e) => handleCategoryDataChange('transportation', e)} className="text-xs h-9"/></div>
                        <div className="space-y-2"><Label className="text-xs">Detention Fee</Label><Input name="detentionFee" type="number" value={invoice.transportation.detentionFee ?? ''} onChange={(e) => handleCategoryDataChange('transportation', e)} className="text-xs h-9"/></div>
                    </CardContent>
                </Card>
            ) : null;
        case "IT Services / Tech Support":
             return invoice.itServices ? (
                <Card className="bg-card/50 backdrop-blur-sm shadow-lg">
                    <CardHeader><CardTitle className="text-base flex items-center gap-2"><Code className="h-4 w-4" />IT Service Details</CardTitle></CardHeader>
                    <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        <div className="space-y-2"><Label className="text-xs">Service Type</Label><Input name="serviceType" value={invoice.itServices.serviceType} onChange={(e) => handleCategoryDataChange('itServices', e)} className="text-xs h-9"/></div>
                        <div className="space-y-2"><Label className="text-xs">Hourly Rate</Label><Input name="hourlyRate" type="number" value={invoice.itServices.hourlyRate ?? ''} onChange={(e) => handleCategoryDataChange('itServices', e)} className="text-xs h-9"/></div>
                        <div className="space-y-2"><Label className="text-xs">Hours Worked</Label><Input name="hoursWorked" type="number" value={invoice.itServices.hoursWorked ?? ''} onChange={(e) => handleCategoryDataChange('itServices', e)} className="text-xs h-9"/></div>
                        <div className="space-y-2"><Label className="text-xs">Device Type</Label><Input name="deviceType" value={invoice.itServices.deviceType} onChange={(e) => handleCategoryDataChange('itServices', e)} className="text-xs h-9"/></div>
                        <div className="space-y-2"><Label className="text-xs">Serial Number</Label><Input name="serialNumber" value={invoice.itServices.serialNumber} onChange={(e) => handleCategoryDataChange('itServices', e)} className="text-xs h-9"/></div>
                        <div className="space-y-2"><Label className="text-xs">Hardware Replacement Cost</Label><Input name="hardwareReplacementCost" type="number" value={invoice.itServices.hardwareReplacementCost ?? ''} onChange={(e) => handleCategoryDataChange('itServices', e)} className="text-xs h-9"/></div>
                        <div className="space-y-2"><Label className="text-xs">Monthly Maintenance Fee</Label><Input name="monthlyMaintenanceFee" type="number" value={invoice.itServices.monthlyMaintenanceFee ?? ''} onChange={(e) => handleCategoryDataChange('itServices', e)} className="text-xs h-9"/></div>
                    </CardContent>
                </Card>
            ) : null;
        case "Rental / Property":
             return invoice.rental ? (
                <Card className="bg-card/50 backdrop-blur-sm shadow-lg">
                    <CardHeader><CardTitle className="text-base flex items-center gap-2"><Building className="h-4 w-4" />Rental Details</CardTitle></CardHeader>
                    <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        <div className="space-y-2 md:col-span-2"><Label className="text-xs">Rental Item Name</Label><Input name="rentalItemName" value={invoice.rental.rentalItemName} onChange={(e) => handleCategoryDataChange('rental', e)} className="text-xs h-9"/></div>
                        <div className="space-y-2"><Label className="text-xs">Rental Start Date</Label><DatePicker date={invoice.rental.rentalStartDate} setDate={(date) => handleDateChange('rental', 'rentalStartDate', date)} className="h-9 text-xs"/></div>
                        <div className="space-y-2"><Label className="text-xs">Rental End Date</Label><DatePicker date={invoice.rental.rentalEndDate} setDate={(date) => handleDateChange('rental', 'rentalEndDate', date)} className="h-9 text-xs"/></div>
                        <div className="space-y-2"><Label className="text-xs">Daily Rate</Label><Input name="dailyRate" type="number" value={invoice.rental.dailyRate ?? ''} onChange={(e) => handleCategoryDataChange('rental', e)} className="text-xs h-9"/></div>
                        <div className="space-y-2"><Label className="text-xs">Hourly Rate</Label><Input name="hourlyRate" type="number" value={invoice.rental.hourlyRate ?? ''} onChange={(e) => handleCategoryDataChange('rental', e)} className="text-xs h-9"/></div>
                        <div className="space-y-2"><Label className="text-xs">Number of Days</Label><Input name="numberOfDays" type="number" value={invoice.rental.numberOfDays ?? ''} onChange={(e) => handleCategoryDataChange('rental', e)} className="text-xs h-9"/></div>
                        <div className="space-y-2"><Label className="text-xs">Number of Hours</Label><Input name="numberOfHours" type="number" value={invoice.rental.numberOfHours ?? ''} onChange={(e) => handleCategoryDataChange('rental', e)} className="text-xs h-9"/></div>
                        <div className="space-y-2"><Label className="text-xs">Security Deposit</Label><Input name="securityDeposit" type="number" value={invoice.rental.securityDeposit ?? ''} onChange={(e) => handleCategoryDataChange('rental', e)} className="text-xs h-9"/></div>
                        <div className="space-y-2"><Label className="text-xs">Damage Charges</Label><Input name="damageCharges" type="number" value={invoice.rental.damageCharges ?? ''} onChange={(e) => handleCategoryDataChange('rental', e)} className="text-xs h-9"/></div>
                        <div className="space-y-2"><Label className="text-xs">Delivery Fee</Label><Input name="deliveryFee" type="number" value={invoice.rental.deliveryFee ?? ''} onChange={(e) => handleCategoryDataChange('rental', e)} className="text-xs h-9"/></div>
                        <div className="space-y-2"><Label className="text-xs">Pickup Fee</Label><Input name="pickupFee" type="number" value={invoice.rental.pickupFee ?? ''} onChange={(e) => handleCategoryDataChange('rental', e)} className="text-xs h-9"/></div>
                    </CardContent>
                </Card>
            ) : null;
        default:
            return null;
    }
};

