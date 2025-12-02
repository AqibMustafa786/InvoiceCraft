
'use client';

import { ChangeEvent, Dispatch, SetStateAction, useState, useEffect } from 'react';
import type { Estimate, LineItem, Quote, EstimateCategory, HomeRemodelingInfo, RoofingInfo, HVACInfo, PlumbingInfo, ElectricalInfo, LandscapingInfo, CleaningInfo, AutoRepairInfo, ConstructionInfo, ITFreelanceInfo } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { DatePicker } from '@/components/ui/datepicker';
import { ImageUp, Plus, Trash2, Palette, X, Mail, Truck, Hash, Phone, Globe, Briefcase, Award, User, FileText, Building, Pencil, Type, Package, Hammer, Ruler, ListTree, CheckSquare, Sparkles, Calendar, TextQuote, Wind, Thermometer, Wrench, Zap, Trees, Droplets, Car, Code, DraftingCompass } from 'lucide-react';
import Image from 'next/image';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from '@/components/ui/checkbox';
import { SignaturePad } from './signature-pad';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { serverTimestamp } from 'firebase/firestore';
import { RadioGroup, RadioGroupItem } from './ui/radio-group';

interface DocumentFormProps {
  document: Estimate | Quote;
  setDocument: Dispatch<SetStateAction<Estimate | Quote>>;
  accentColor: string;
  setAccentColor: Dispatch<SetStateAction<string>>;
  toast: (options: { title: string; description: string; variant?: "default" | "destructive" }) => void;
  documentType: 'estimate' | 'quote';
}

const currencies = [
    { value: 'USD', label: 'USD ($)' },
    { value: 'EUR', label: 'EUR (€)' },
    { value: 'GBP', label: 'GBP (£)' },
    { value: 'JPY', label: 'JPY (¥)' },
    { value: 'PKR', label: 'PKR (₨)' },
]

const fonts = [
    { value: 'Inter', label: 'Inter' },
    { value: 'Roboto', label: 'Roboto' },
    { value: 'Lato', label: 'Lato' },
    { value: 'Merriweather', label: 'Merriweather' },
    { value: 'system-ui', label: 'System Default' },
]

const categories: EstimateCategory[] = [
    "Generic",
    "Home Remodeling / Renovation",
    "Roofing Estimate",
    "HVAC (Air Conditioning / Heating)",
    "Plumbing Estimate",
    "Electrical Estimate",
    "Landscaping Estimate",
    "Cleaning Estimate",
    "Auto Repair Estimate",
    "Construction Estimate",
    "IT / Freelance Estimate"
];

const plumbingServiceTypes = ["Leak Repair", "Installation", "Sewer Line", "Water Heater", "Drain Cleaning"];
const plumbingFixtureTypes = ["Sink", "Toilet", "Shower", "Water Heater"];
const plumbingPipeMaterials = ["Copper", "PVC", "PEX", "Galvanized"];

const hvacServiceTypes = ["Install", "Repair", "Replace", "Maintenance"];
const hvacSystemTypes = ["AC", "Furnace", "Heat Pump", "Boiler", "Ductless Mini-Split"];

const CustomSelect = ({ value, onValueChange, options, placeholder, otherValue, onOtherValueChange }: { value: string; onValueChange: (value: string) => void; options: string[]; placeholder?: string; otherValue?: string; onOtherValueChange?: (e: ChangeEvent<HTMLInputElement>) => void; }) => {
    const [isOther, setIsOther] = useState(value && !options.includes(value));

    useEffect(() => {
        setIsOther(value === 'Other' || (value && !options.includes(value)));
    }, [value, options]);

    const handleValueChange = (newValue: string) => {
        if (newValue === 'Other') {
            setIsOther(true);
            onValueChange(otherValue || '');
        } else {
            setIsOther(false);
            onValueChange(newValue);
        }
    };

    return (
        <div className="space-y-2">
            <Select value={isOther ? 'Other' : value} onValueChange={handleValueChange}>
                <SelectTrigger>
                    <SelectValue placeholder={placeholder} />
                </SelectTrigger>
                <SelectContent>
                    {options.map(option => <SelectItem key={option} value={option}>{option}</SelectItem>)}
                    <SelectItem value="Other">Other (Please specify)</SelectItem>
                </SelectContent>
            </Select>
            {isOther && onOtherValueChange && (
                <Input
                    type="text"
                    value={value}
                    onChange={onOtherValueChange}
                    placeholder="Specify other value"
                    className="mt-2"
                />
            )}
        </div>
    );
};


export function DocumentForm({ document, setDocument, accentColor, setAccentColor, toast, documentType }: DocumentFormProps) {
  const [bulkAddCount, setBulkAddCount] = useState(5);
  const [colorInputValue, setColorInputValue] = useState(accentColor);
  const [logoUrl, setLogoUrl] = useState<string | null>(document.business.logoUrl || null);
  const [isSignatureDialogOpen, setIsSignatureDialogOpen] = useState(false);
  const [cleaningAddOns, setCleaningAddOns] = useState<string[]>(document.cleaning?.addOns || []);

  useEffect(() => {
    setColorInputValue(accentColor);
  }, [accentColor]);
  
  useEffect(() => {
    if (logoUrl !== document.business.logoUrl) {
      setDocument(prev => ({
          ...prev,
          business: {
              ...prev.business,
              logoUrl: logoUrl || '',
          }
      }))
    }
  }, [logoUrl, setDocument, document.business.logoUrl]);

  const handleNestedChange = (section: 'business' | 'client' | 'summary', e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setDocument(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [name]: value
      }
    }));
  };

  const handleCategoryDataChange = (category: 'homeRemodeling' | 'roofing' | 'hvac' | 'plumbing' | 'electrical' | 'landscaping' | 'cleaning' | 'autoRepair' | 'construction' | 'itFreelance', e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    const isCheckbox = type === 'checkbox';
    
    setDocument(prev => ({
        ...prev,
        [category]: {
            ...prev[category]!,
            [name]: isCheckbox ? (e.target as HTMLInputElement).checked : value
        }
    }));
  };

  const handleCategorySelectChange = (category: 'homeRemodeling' | 'roofing' | 'hvac' | 'plumbing' | 'electrical' | 'landscaping' | 'cleaning' | 'autoRepair' | 'construction' | 'itFreelance', name: string, value: string | boolean) => {
     setDocument(prev => ({
        ...prev,
        [category]: {
            ...prev[category]!,
            [name]: value
        }
    }));
  };

  const handleRemodelingDateChange = (name: keyof HomeRemodelingInfo, date: Date | undefined) => {
     setDocument(prev => ({
        ...prev,
        homeRemodeling: {
            ...prev.homeRemodeling!,
            [name]: date
        }
    }));
  };

  const handleCleaningAddOnChange = (addOn: string, checked: boolean) => {
    const currentAddOns = document.cleaning?.addOns || [];
    const newAddOns = checked
      ? [...currentAddOns, addOn]
      : currentAddOns.filter(item => item !== addOn);
    setCleaningAddOns(newAddOns);
    setDocument(prev => ({
      ...prev,
      cleaning: {
        ...prev.cleaning!,
        addOns: newAddOns
      }
    }));
  }

  const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setDocument(prev => ({ ...prev, [name]: value }));
  };

  const handleNumberChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const [section, field] = name.split('.');
     setDocument(prev => ({
      ...prev,
      [section as 'summary']: {
        ...prev[section as 'summary'],
        [field]: parseFloat(value) || 0,
      }
    }));
  };
  
  const handleCurrencyChange = (value: string) => {
    setDocument(prev => ({ ...prev, currency: value }));
  }

  const handleItemChange = (index: number, field: keyof Omit<LineItem, 'id'>, value: string | number | boolean) => {
    const newItems = [...document.lineItems];
    (newItems[index] as any)[field] = value;
    setDocument(prev => ({ ...prev, lineItems: newItems }));
  };

  const addItem = () => {
     if (document.lineItems.length >= 50) {
       toast({
        title: "Item Limit Reached",
        description: `You cannot add more than 50 items to a single ${documentType}.`,
        variant: "destructive",
      });
      return;
    }
    setDocument(prev => ({
      ...prev,
      lineItems: [...prev.lineItems, { id: crypto.randomUUID(), name: '', quantity: 1, unitPrice: 0, taxable: true }],
    }));
  };
  
  const handleBulkAddItem = () => {
    const count = Number(bulkAddCount);
    if (count <= 0) return;

    if (document.lineItems.length + count > 50) {
      toast({
        title: "Item Limit Exceeded",
        description: `You can only add ${50 - document.lineItems.length} more items. The maximum is 50.`,
        variant: "destructive",
      });
      return;
    }

    const newItems = Array.from({ length: count }, () => ({
      id: crypto.randomUUID(),
      name: '',
      quantity: 1,
      unitPrice: 0,
      taxable: true,
    }));

    setDocument(prev => ({
      ...prev,
      lineItems: [...prev.lineItems, ...newItems],
    }));
  };

  const removeItem = (index: number) => {
    const newItems = document.lineItems.filter((_, i) => i !== index);
    setDocument(prev => ({ ...prev, lineItems: newItems }));
  };

  const handleLogoUpload = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
       if (file.size > 2 * 1024 * 1024) { // 2MB limit
        toast({
          title: "Image too large",
          description: "Please upload an image smaller than 2MB.",
          variant: "destructive",
        });
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setLogoUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };
  
  const handleOwnerSignatureSave = (image: string, signerName: string) => {
    setDocument(prev => ({
        ...prev,
        business: {
            ...prev.business,
            ownerSignature: {
                image,
                signerName,
                signedAt: serverTimestamp(),
            }
        }
    }));
    setIsSignatureDialogOpen(false);
  };
  
  const currencySymbol = currencies.find(c => c.value === document.currency)?.label.split(' ')[1] || '$';
  const isSigned = !!document.clientSignature;

  const docName = documentType === 'quote' ? 'Quote' : 'Estimate';
  const docNumberName = documentType === 'quote' ? 'Quote Number' : 'Estimate Number';

  return (
    <div className="space-y-6">
      <fieldset disabled={isSigned} className="space-y-6 group">
        <Card className="bg-card/50 backdrop-blur-sm group-disabled:opacity-70">
            <CardHeader>
            <CardTitle>Branding &amp; Customization</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
                <Label>Company Logo</Label>
                <div className="flex items-center gap-4">
                    {logoUrl ? (
                        <div className="flex items-center gap-4">
                            <Image src={logoUrl} alt="Company Logo" width={80} height={40} className="rounded-md object-contain bg-muted p-1" />
                            <div className="flex items-center gap-2">
                                <Button asChild variant="outline" size="sm">
                                    <label htmlFor="logo-upload" className="cursor-pointer">Change</label>
                                </Button>
                                <Button variant="destructive" size="sm" onClick={() => setLogoUrl(null)}>
                                <X className="h-4 w-4 mr-1" /> Remove
                                </Button>
                            </div>
                        </div>
                    ) : (
                        <Button asChild variant="outline" className="w-full">
                            <label htmlFor="logo-upload" className="cursor-pointer flex items-center justify-center gap-2">
                                <ImageUp className="h-4 w-4" /> Upload Logo
                            </label>
                        </Button>
                    )}
                    <Input id="logo-upload" type="file" className="sr-only" onChange={handleLogoUpload} accept="image/png, image/jpeg, image/gif" />
                    </div>
                </div>
                <div className="space-y-2">
                    <Label htmlFor="accentColor">Accent Color</Label>
                    <div className="relative flex items-center">
                        <Palette className="absolute left-3 h-5 w-5 text-muted-foreground" />
                        <Input 
                            id="accentColor"
                            type="text" 
                            value={colorInputValue} 
                            onChange={(e) => setColorInputValue(e.target.value)}
                            onBlur={(e) => setAccentColor(e.target.value)}
                            className="pl-10"
                            placeholder="hsl(260 85% 66%)"
                        />
                        <input 
                            type="color" 
                            value={accentColor.startsWith('hsl') ? '#000000' : accentColor}
                            onChange={(e) => {
                                setAccentColor(e.target.value);
                                setColorInputValue(e.target.value);
                            }}
                            className="absolute right-1 top-1/2 -translate-y-1/2 h-8 w-8 p-1 rounded-md cursor-pointer bg-transparent border-none appearance-none"
                        />
                    </div>
                </div>
                <div className="space-y-2">
                    <Label>Document Type</Label>
                    <RadioGroup
                        value={document.documentType}
                        onValueChange={(value) => setDocument(p => ({...p, documentType: value as 'estimate' | 'quote'}))}
                        className="flex gap-4"
                    >
                        <div className="flex items-center space-x-2">
                            <RadioGroupItem value="estimate" id="type-estimate" />
                            <Label htmlFor="type-estimate">Estimate</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                            <RadioGroupItem value="quote" id="type-quote" />
                            <Label htmlFor="type-quote">Quote</Label>
                        </div>
                    </RadioGroup>
                </div>
                 <div className="space-y-2">
                    <Label htmlFor="fontFamily">Font Family</Label>
                    <Select value={document.fontFamily} onValueChange={(value) => setDocument(p => ({...p, fontFamily: value}))}>
                        <SelectTrigger id="fontFamily">
                            <SelectValue placeholder="Select font" />
                        </SelectTrigger>
                        <SelectContent>
                            {fonts.map(font => <SelectItem key={font.value} value={font.value}>{font.label}</SelectItem>)}
                        </SelectContent>
                    </Select>
                </div>
                <div className="space-y-2">
                    <Label htmlFor="textColor">Text Color</Label>
                    <Input id="textColor" name="textColor" value={document.textColor} onChange={handleInputChange} placeholder="e.g. #374151" />
                </div>
                 <div className="space-y-2">
                    <Label htmlFor="fontSize">Font Size</Label>
                    <div className="relative flex items-center">
                        <Type className="absolute left-3 h-5 w-5 text-muted-foreground" />
                        <Input id="fontSize" name="fontSize" type="number" value={document.fontSize} onChange={(e) => setDocument(p => ({...p, fontSize: Number(e.target.value) || 14}))} className="pl-10" />
                    </div>
                </div>
            </CardContent>
        </Card>
        
        <Card className="bg-card/50 backdrop-blur-sm group-disabled:opacity-70">
            <CardHeader>
            <CardTitle>Business Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="space-y-2">
                <Label htmlFor="businessName">Business Name</Label>
                <div className="relative flex items-center">
                    <Briefcase className="absolute left-3 h-5 w-5 text-muted-foreground" />
                    <Input id="businessName" name="name" value={document.business.name} onChange={(e) => handleNestedChange('business', e)} className="pl-10" />
                </div>
                </div>
                <div className="space-y-2">
                    <Label htmlFor="businessAddress">Business Address</Label>
                    <Textarea id="businessAddress" name="address" value={document.business.address} onChange={(e) => handleNestedChange('business', e)} placeholder="Street, City, State, Zip"/>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <Label htmlFor="businessPhone">Phone Number</Label>
                        <div className="relative flex items-center">
                            <Phone className="absolute left-3 h-5 w-5 text-muted-foreground" />
                            <Input id="businessPhone" name="phone" value={document.business.phone} onChange={(e) => handleNestedChange('business', e)} className="pl-10" />
                        </div>
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="businessEmail">Email Address</Label>
                        <div className="relative flex items-center">
                            <Mail className="absolute left-3 h-5 w-5 text-muted-foreground" />
                            <Input id="businessEmail" name="email" value={document.business.email} onChange={(e) => handleNestedChange('business', e)} className="pl-10" />
                        </div>
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="businessWebsite">Website (optional)</Label>
                        <div className="relative flex items-center">
                            <Globe className="absolute left-3 h-5 w-5 text-muted-foreground" />
                            <Input id="businessWebsite" name="website" value={document.business.website} onChange={(e) => handleNestedChange('business', e)} className="pl-10" />
                        </div>
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="businessLicense">License Number</Label>
                        <div className="relative flex items-center">
                            <Award className="absolute left-3 h-5 w-5 text-muted-foreground" />
                            <Input id="businessLicense" name="licenseNumber" value={document.business.licenseNumber} onChange={(e) => handleNestedChange('business', e)} className="pl-10" />
                        </div>
                    </div>
                    <div className="space-y-2 md:col-span-2">
                        <Label htmlFor="businessTaxId">EIN/Tax ID (optional)</Label>
                        <div className="relative flex items-center">
                            <Hash className="absolute left-3 h-5 w-5 text-muted-foreground" />
                            <Input id="businessTaxId" name="taxId" value={document.business.taxId} onChange={(e) => handleNestedChange('business', e)} className="pl-10" />
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>

        <Card className="bg-card/50 backdrop-blur-sm group-disabled:opacity-70">
            <CardHeader>
            <CardTitle>Client Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                <Label htmlFor="clientName">Client Full Name</Label>
                <div className="relative flex items-center">
                    <User className="absolute left-3 h-5 w-5 text-muted-foreground" />
                    <Input id="clientName" name="name" value={document.client.name} onChange={(e) => handleNestedChange('client', e)} className="pl-10" />
                    </div>
                </div>
                <div className="space-y-2">
                <Label htmlFor="clientCompanyName">Client Company Name (optional)</Label>
                <div className="relative flex items-center">
                    <Building className="absolute left-3 h-5 w-5 text-muted-foreground" />
                    <Input id="clientCompanyName" name="companyName" value={document.client.companyName} onChange={(e) => handleNestedChange('client', e)} className="pl-10" />
                    </div>
                </div>
            </div>
            <div className="space-y-2">
                <Label htmlFor="clientAddress">Client Address</Label>
                <Textarea id="clientAddress" name="address" value={document.client.address} onChange={(e) => handleNestedChange('client', e)} />
            </div>
             <div className="space-y-2">
                <Label htmlFor="projectLocation">Project Location (if different)</Label>
                <Textarea id="projectLocation" name="projectLocation" value={document.client.projectLocation} onChange={(e) => handleNestedChange('client', e)} />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                <Label htmlFor="clientEmail">Client Email</Label>
                <div className="relative flex items-center">
                    <Mail className="absolute left-3 h-5 w-5 text-muted-foreground" />
                    <Input id="clientEmail" name="email" value={document.client.email || ''} onChange={(e) => handleNestedChange('client', e)} className="pl-10" placeholder="client@example.com" />
                </div>
                </div>
                <div className="space-y-2">
                <Label htmlFor="clientPhone">Client Phone</Label>
                <div className="relative flex items-center">
                    <Phone className="absolute left-3 h-5 w-5 text-muted-foreground" />
                    <Input id="clientPhone" name="phone" value={document.client.phone || ''} onChange={(e) => handleNestedChange('client', e)} className="pl-10" />
                </div>
                </div>
            </div>
            </CardContent>
        </Card>
        
        <Card className="bg-card/50 backdrop-blur-sm group-disabled:opacity-70">
            <CardHeader>
            <CardTitle>{docName} Details</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
             <div className="space-y-2 md:col-span-2">
                <Label htmlFor="category">Estimate Category</Label>
                <div className="relative flex items-center">
                    <Package className="absolute left-3 h-5 w-5 text-muted-foreground z-10" />
                    <Select
                        value={document.category}
                        onValueChange={(value: EstimateCategory) => setDocument(p => ({ ...p, category: value }))}
                    >
                        <SelectTrigger id="category" className="pl-10">
                            <SelectValue placeholder="Select a business category" />
                        </SelectTrigger>
                        <SelectContent>
                            {categories.map(cat => <SelectItem key={cat} value={cat}>{cat}</SelectItem>)}
                        </SelectContent>
                    </Select>
                </div>
            </div>
            <div className="space-y-2">
                <Label htmlFor="estimateNumber">{docNumberName}</Label>
                <Input id="estimateNumber" name="estimateNumber" value={document.estimateNumber} onChange={handleInputChange} />
            </div>
            <div className="space-y-2">
                <Label htmlFor="projectTitle">Project / Job Title</Label>
                <div className="relative flex items-center">
                    <FileText className="absolute left-3 h-5 w-5 text-muted-foreground" />
                    <Input id="projectTitle" name="projectTitle" value={document.projectTitle} onChange={handleInputChange} className="pl-10" />
                </div>
            </div>
            <div className="space-y-2">
                <Label>Date Issued</Label>
                <DatePicker date={document.estimateDate} setDate={(date) => setDocument(p => ({ ...p, estimateDate: date! }))} />
            </div>
            <div className="space-y-2">
                <Label>Expiration Date</Label>
                <DatePicker date={document.validUntilDate} setDate={(date) => setDocument(p => ({ ...p, validUntilDate: date! }))} />
            </div>
            <div className="space-y-2">
                <Label htmlFor="referenceNumber">Reference Number (optional)</Label>
                <div className="relative flex items-center">
                    <Hash className="absolute left-3 h-5 w-5 text-muted-foreground" />
                    <Input id="referenceNumber" name="referenceNumber" value={document.referenceNumber} onChange={handleInputChange} className="pl-10" />
                </div>
            </div>
            <div className="space-y-2">
                    <Label htmlFor="currency">Currency</Label>
                    <Select value={document.currency} onValueChange={handleCurrencyChange}>
                        <SelectTrigger id="currency">
                            <SelectValue placeholder="Select currency" />
                        </SelectTrigger>
                        <SelectContent>
                            {currencies.map(c => (
                                <SelectItem key={c.value} value={c.value}>{c.label}</SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
            </CardContent>
        </Card>

        {document.category === "Home Remodeling / Renovation" && document.homeRemodeling && (
            <Card className="bg-card/50 backdrop-blur-sm group-disabled:opacity-70">
                <CardHeader>
                    <CardTitle>Home Remodeling Details</CardTitle>
                </CardHeader>
                <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <Label htmlFor="projectType">Project Type</Label>
                        <div className="relative flex items-center">
                            <Hammer className="absolute left-3 h-5 w-5 text-muted-foreground" />
                            <Input id="projectType" name="projectType" value={document.homeRemodeling.projectType} onChange={(e) => handleCategoryDataChange('homeRemodeling', e)} className="pl-10" placeholder="e.g. Kitchen, Bathroom" />
                        </div>
                    </div>
                     <div className="space-y-2">
                        <Label htmlFor="propertyType">Property Type</Label>
                         <div className="relative flex items-center">
                            <Building className="absolute left-3 h-5 w-5 text-muted-foreground" />
                            <Input id="propertyType" name="propertyType" value={document.homeRemodeling.propertyType} onChange={(e) => handleCategoryDataChange('homeRemodeling', e)} className="pl-10" placeholder="e.g. House, Apartment"/>
                        </div>
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="squareFootage">Square Footage</Label>
                        <div className="relative flex items-center">
                            <Ruler className="absolute left-3 h-5 w-5 text-muted-foreground" />
                            <Input id="squareFootage" name="squareFootage" type="number" value={document.homeRemodeling.squareFootage ?? ''} onChange={(e) => handleCategoryDataChange('homeRemodeling', e)} className="pl-10" />
                        </div>
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="roomsIncluded">Rooms Included</Label>
                         <div className="relative flex items-center">
                            <ListTree className="absolute left-3 h-5 w-5 text-muted-foreground" />
                            <Input id="roomsIncluded" name="roomsIncluded" value={document.homeRemodeling.roomsIncluded} onChange={(e) => handleCategoryDataChange('homeRemodeling', e)} className="pl-10" placeholder="e.g. Kitchen, 2 Bedrooms" />
                        </div>
                    </div>
                    <div className="space-y-2 md:col-span-2">
                        <Label>Material Grade</Label>
                        <RadioGroup
                            value={document.homeRemodeling.materialGrade}
                            onValueChange={(value) => handleCategorySelectChange('homeRemodeling', 'materialGrade', value)}
                            className="flex gap-4"
                        >
                            <div className="flex items-center space-x-2">
                                <RadioGroupItem value="Basic" id="grade-basic" />
                                <Label htmlFor="grade-basic">Basic</Label>
                            </div>
                            <div className="flex items-center space-x-2">
                                <RadioGroupItem value="Standard" id="grade-standard" />
                                <Label htmlFor="grade-standard">Standard</Label>
                            </div>
                             <div className="flex items-center space-x-2">
                                <RadioGroupItem value="Premium" id="grade-premium" />
                                <Label htmlFor="grade-premium">Premium</Label>
                            </div>
                        </RadioGroup>
                    </div>
                     <div className="flex items-center space-x-2">
                        <Checkbox id="demolitionRequired" name="demolitionRequired" checked={document.homeRemodeling.demolitionRequired} onCheckedChange={(checked) => handleCategorySelectChange('homeRemodeling', 'demolitionRequired', !!checked)} />
                        <Label htmlFor="demolitionRequired" className="flex items-center gap-2"><Sparkles className="h-4 w-4" /> Demolition Required?</Label>
                    </div>
                     <div className="flex items-center space-x-2">
                        <Checkbox id="permitRequired" name="permitRequired" checked={document.homeRemodeling.permitRequired} onCheckedChange={(checked) => handleCategorySelectChange('homeRemodeling', 'permitRequired', !!checked)} />
                        <Label htmlFor="permitRequired" className="flex items-center gap-2"><CheckSquare className="h-4 w-4" /> Permit Required?</Label>
                    </div>
                    <div className="space-y-2">
                        <Label>Expected Start Date</Label>
                        <DatePicker date={document.homeRemodeling.expectedStartDate} setDate={(date) => handleRemodelingDateChange('expectedStartDate', date)} />
                    </div>
                    <div className="space-y-2">
                        <Label>Expected Completion Date</Label>
                        <DatePicker date={document.homeRemodeling.expectedCompletionDate} setDate={(date) => handleRemodelingDateChange('expectedCompletionDate', date)} />
                    </div>
                     <div className="space-y-2 md:col-span-2">
                        <Label htmlFor="specialInstructions">Special Instructions</Label>
                        <div className="relative flex items-center">
                            <TextQuote className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
                            <Textarea id="specialInstructions" name="specialInstructions" value={document.homeRemodeling.specialInstructions} onChange={(e) => handleCategoryDataChange('homeRemodeling', e)} className="pl-10" />
                        </div>
                    </div>
                </CardContent>
            </Card>
        )}

        {document.category === "Roofing Estimate" && document.roofing && (
            <Card className="bg-card/50 backdrop-blur-sm group-disabled:opacity-70">
                <CardHeader>
                    <CardTitle>Roofing Project Details</CardTitle>
                </CardHeader>
                <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <Label>Roof Material</Label>
                        <CustomSelect
                            value={document.roofing.roofMaterial}
                            onValueChange={(value) => handleCategorySelectChange('roofing', 'roofMaterial', value)}
                            options={['Shingle', 'Metal', 'Tile', 'Flat']}
                            placeholder="Select roof material"
                            otherValue={document.roofing.roofMaterial}
                            onOtherValueChange={(e) => handleCategoryDataChange('roofing', e)}
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="roofSize">Roof Size (sq ft)</Label>
                        <Input id="roofSize" name="roofSize" type="number" value={document.roofing.roofSize ?? ''} onChange={(e) => handleCategoryDataChange('roofing', e)} />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="roofPitch">Roof Pitch/Slope</Label>
                        <Input id="roofPitch" name="roofPitch" value={document.roofing.roofPitch} onChange={(e) => handleCategoryDataChange('roofing', e)} placeholder="e.g. 4/12" />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="layersToRemove">Layers to Remove</Label>
                        <Input id="layersToRemove" name="layersToRemove" type="number" value={document.roofing.layersToRemove ?? ''} onChange={(e) => handleCategoryDataChange('roofing', e)} />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="underlaymentType">Underlayment Type</Label>
                        <Input id="underlaymentType" name="underlaymentType" value={document.roofing.underlaymentType} onChange={(e) => handleCategoryDataChange('roofing', e)} placeholder="e.g. Synthetic, Felt" />
                    </div>
                     <div className="space-y-2">
                        <Label htmlFor="ventilationSystem">Ventilation System</Label>
                        <div className="relative flex items-center">
                            <Wind className="absolute left-3 h-5 w-5 text-muted-foreground" />
                            <Input id="ventilationSystem" name="ventilationSystem" value={document.roofing.ventilationSystem} onChange={(e) => handleCategoryDataChange('roofing', e)} placeholder="e.g. Ridge Vents, Soffit Vents" />
                        </div>
                    </div>
                    <div className="flex items-center space-x-2 pt-6">
                        <Checkbox id="flashingReplacement" name="flashingReplacement" checked={document.roofing.flashingReplacement} onCheckedChange={(checked) => handleCategorySelectChange('roofing', 'flashingReplacement', !!checked)} />
                        <Label htmlFor="flashingReplacement">Flashing Replacement?</Label>
                    </div>
                    <div className="flex items-center space-x-2 pt-6">
                        <Checkbox id="gutterRepairNeeded" name="gutterRepairNeeded" checked={document.roofing.gutterRepairNeeded} onCheckedChange={(checked) => handleCategorySelectChange('roofing', 'gutterRepairNeeded', !!checked)} />
                        <Label htmlFor="gutterRepairNeeded">Gutter Repair Needed?</Label>
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="roofAge">Roof Age (years)</Label>
                        <Input id="roofAge" name="roofAge" type="number" value={document.roofing.roofAge ?? ''} onChange={(e) => handleCategoryDataChange('roofing', e)} />
                    </div>
                    <div className="flex items-center space-x-2 pt-6">
                        <Checkbox id="inspectionRequired" name="inspectionRequired" checked={document.roofing.inspectionRequired} onCheckedChange={(checked) => handleCategorySelectChange('roofing', 'inspectionRequired', !!checked)} />
                        <Label htmlFor="inspectionRequired">Inspection Required?</Label>
                    </div>
                </CardContent>
            </Card>
        )}

        {document.category === "HVAC (Air Conditioning / Heating)" && document.hvac && (
            <Card className="bg-card/50 backdrop-blur-sm group-disabled:opacity-70">
                <CardHeader>
                    <CardTitle>HVAC Project Details</CardTitle>
                </CardHeader>
                <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <Label>Service Type</Label>
                        <CustomSelect
                            value={document.hvac.serviceType}
                            onValueChange={(value) => handleCategorySelectChange('hvac', 'serviceType', value)}
                            options={hvacServiceTypes}
                            placeholder="Select service type"
                            otherValue={document.hvac.serviceType}
                            onOtherValueChange={(e) => handleCategoryDataChange('hvac', e)}
                        />
                    </div>
                     <div className="space-y-2">
                        <Label>System Type</Label>
                        <CustomSelect
                            value={document.hvac.systemType}
                            onValueChange={(value) => handleCategorySelectChange('hvac', 'systemType', value)}
                            options={hvacSystemTypes}
                            placeholder="Select system type"
                            otherValue={document.hvac.systemType}
                            onOtherValueChange={(e) => handleCategoryDataChange('hvac', e)}
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="unitSize">Unit Size (Tonnage / BTU)</Label>
                        <Input id="unitSize" name="unitSize" type="number" value={document.hvac.unitSize ?? ''} onChange={(e) => handleCategoryDataChange('hvac', e)} />
                    </div>
                     <div className="space-y-2">
                        <Label htmlFor="seerRating">SEER Rating</Label>
                        <Input id="seerRating" name="seerRating" value={document.hvac.seerRating} onChange={(e) => handleCategoryDataChange('hvac', e)} />
                    </div>
                     <div className="space-y-2">
                        <Label>Furnace Type</Label>
                        <Input name="furnaceType" value={document.hvac.furnaceType} onChange={(e) => handleCategoryDataChange('hvac', e)} placeholder="e.g. Gas, Electric, Oil" />
                    </div>
                     <div className="space-y-2">
                        <Label>Thermostat Type</Label>
                        <Input name="thermostatType" value={document.hvac.thermostatType} onChange={(e) => handleCategoryDataChange('hvac', e)} placeholder="e.g. Manual, Programmable, Smart" />
                    </div>
                    <div className="space-y-2 md:col-span-2">
                        <Label htmlFor="existingSystemCondition">Existing System Condition</Label>
                        <Input id="existingSystemCondition" name="existingSystemCondition" value={document.hvac.existingSystemCondition} onChange={(e) => handleCategoryDataChange('hvac', e)} />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="refrigerantType">Refrigerant Type</Label>
                        <Input id="refrigerantType" name="refrigerantType" value={document.hvac.refrigerantType} onChange={(e) => handleCategoryDataChange('hvac', e)} />
                    </div>
                    <div className="flex items-center space-x-2 pt-6">
                        <Checkbox id="ductworkRequired" name="ductworkRequired" checked={document.hvac.ductworkRequired} onCheckedChange={(checked) => handleCategorySelectChange('hvac', 'ductworkRequired', !!checked)} />
                        <Label htmlFor="ductworkRequired">Ductwork Required?</Label>
                    </div>
                </CardContent>
            </Card>
        )}

        {document.category === "Plumbing Estimate" && document.plumbing && (
             <Card className="bg-card/50 backdrop-blur-sm group-disabled:opacity-70">
                <CardHeader>
                    <CardTitle>Plumbing Project Details</CardTitle>
                </CardHeader>
                <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <Label>Service Type</Label>
                         <CustomSelect
                            value={document.plumbing.serviceType}
                            onValueChange={(value) => handleCategorySelectChange('plumbing', 'serviceType', value)}
                            options={plumbingServiceTypes}
                            placeholder="Select service type"
                            otherValue={document.plumbing.serviceType}
                            onOtherValueChange={(e) => handleCategoryDataChange('plumbing', e)}
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="fixtureType">Fixture Type</Label>
                        <CustomSelect
                            value={document.plumbing.fixtureType}
                            onValueChange={(value) => handleCategorySelectChange('plumbing', 'fixtureType', value)}
                            options={plumbingFixtureTypes}
                            placeholder="Select fixture type"
                            otherValue={document.plumbing.fixtureType}
                            onOtherValueChange={(e) => handleCategoryDataChange('plumbing', e)}
                        />
                    </div>
                    <div className="space-y-2">
                        <Label>Pipe Material</Label>
                        <CustomSelect
                            value={document.plumbing.pipeMaterial}
                            onValueChange={(value) => handleCategorySelectChange('plumbing', 'pipeMaterial', value)}
                            options={plumbingPipeMaterials}
                            placeholder="Select pipe material"
                            otherValue={document.plumbing.pipeMaterial}
                            onOtherValueChange={(e) => handleCategoryDataChange('plumbing', e)}
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="floorLevel">Floor Level</Label>
                        <Input id="floorLevel" name="floorLevel" value={document.plumbing.floorLevel} onChange={(e) => handleCategoryDataChange('plumbing', e)} placeholder="e.g. Basement, 1st Floor" />
                    </div>
                     <div className="space-y-2 md:col-span-2">
                        <Label htmlFor="leakLocation">Leak Location</Label>
                        <Input id="leakLocation" name="leakLocation" value={document.plumbing.leakLocation} onChange={(e) => handleCategoryDataChange('plumbing', e)} />
                    </div>
                     <div className="space-y-2">
                        <Label htmlFor="estimatedRepairTime">Estimated Repair Time</Label>
                        <Input id="estimatedRepairTime" name="estimatedRepairTime" value={document.plumbing.estimatedRepairTime} onChange={(e) => handleCategoryDataChange('plumbing', e)} placeholder="e.g. 2-3 hours" />
                    </div>
                    <div className="pt-6 flex flex-col gap-4">
                        <div className="flex items-center space-x-2">
                            <Checkbox id="emergencyService" name="emergencyService" checked={document.plumbing.emergencyService} onCheckedChange={(checked) => handleCategorySelectChange('plumbing', 'emergencyService', !!checked)} />
                            <Label htmlFor="emergencyService">Emergency Service?</Label>
                        </div>
                         <div className="flex items-center space-x-2">
                            <Checkbox id="waterPressureIssue" name="waterPressureIssue" checked={document.plumbing.waterPressureIssue} onCheckedChange={(checked) => handleCategorySelectChange('plumbing', 'waterPressureIssue', !!checked)} />
                            <Label htmlFor="waterPressureIssue">Water Pressure Issue?</Label>
                        </div>
                    </div>
                </CardContent>
            </Card>
        )}

        {document.category === "Electrical Estimate" && document.electrical && (
            <Card className="bg-card/50 backdrop-blur-sm group-disabled:opacity-70">
                <CardHeader><CardTitle>Electrical Project Details</CardTitle></CardHeader>
                <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <Label>Service Type</Label>
                        <Input name="serviceType" value={document.electrical.serviceType} onChange={(e) => handleCategoryDataChange('electrical', e)} placeholder="e.g. Install, Repair, Upgrade" />
                    </div>
                    <div className="space-y-2">
                        <Label>Wiring Type</Label>
                        <Input name="wiringType" value={document.electrical.wiringType} onChange={(e) => handleCategoryDataChange('electrical', e)} placeholder="e.g. Copper, Aluminum" />
                    </div>
                    <div className="space-y-2">
                        <Label>Panel Size</Label>
                        <Input name="panelSize" value={document.electrical.panelSize} onChange={(e) => handleCategoryDataChange('electrical', e)} placeholder="e.g. 100A, 200A" />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="outletsFixturesCount">Outlets/Fixtures Count</Label>
                        <Input id="outletsFixturesCount" name="outletsFixturesCount" type="number" value={document.electrical.outletsFixturesCount ?? ''} onChange={(e) => handleCategoryDataChange('electrical', e)} />
                    </div>
                    <div className="space-y-2 md:col-span-2">
                        <Label htmlFor="roomsInvolved">Rooms Involved</Label>
                        <Input id="roomsInvolved" name="roomsInvolved" value={document.electrical.roomsInvolved} onChange={(e) => handleCategoryDataChange('electrical', e)} placeholder="e.g., Kitchen, Living Room" />
                    </div>
                    <div className="flex items-center space-x-2 pt-6"><Checkbox id="panelUpgradeNeeded" name="panelUpgradeNeeded" checked={document.electrical.panelUpgradeNeeded} onCheckedChange={(c) => handleCategorySelectChange('electrical', 'panelUpgradeNeeded', !!c)} /><Label htmlFor="panelUpgradeNeeded">Panel Upgrade Needed?</Label></div>
                    <div className="flex items-center space-x-2 pt-6"><Checkbox id="evChargerNeeded" name="evChargerNeeded" checked={document.electrical.evChargerNeeded} onCheckedChange={(c) => handleCategorySelectChange('electrical', 'evChargerNeeded', !!c)} /><Label htmlFor="evChargerNeeded">EV Charger Needed?</Label></div>
                    <div className="flex items-center space-x-2"><Checkbox id="inspectionRequired-electrical" name="inspectionRequired" checked={document.electrical.inspectionRequired} onCheckedChange={(c) => handleCategorySelectChange('electrical', 'inspectionRequired', !!c)} /><Label htmlFor="inspectionRequired-electrical">Inspection Required?</Label></div>
                </CardContent>
            </Card>
        )}

        {document.category === "Landscaping Estimate" && document.landscaping && (
            <Card className="bg-card/50 backdrop-blur-sm group-disabled:opacity-70">
                <CardHeader><CardTitle>Landscaping Project Details</CardTitle></CardHeader>
                <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2 md:col-span-2"><Label htmlFor="serviceType-landscaping">Service Type</Label><Input id="serviceType-landscaping" name="serviceType" value={document.landscaping.serviceType} onChange={(e) => handleCategoryDataChange('landscaping', e)} placeholder="e.g., Lawn Mowing, Tree Trimming" /></div>
                    <div className="space-y-2"><Label htmlFor="propertySize">Property Size (sq ft or acres)</Label><Input id="propertySize" name="propertySize" value={document.landscaping.propertySize} onChange={(e) => handleCategoryDataChange('landscaping', e)} /></div>
                    <div className="space-y-2"><Label htmlFor="grassHeight">Grass Height</Label><Input id="grassHeight" name="grassHeight" value={document.landscaping.grassHeight} onChange={(e) => handleCategoryDataChange('landscaping', e)} /></div>
                    <div className="space-y-2"><Label htmlFor="treeCount">Tree Count</Label><Input id="treeCount" name="treeCount" type="number" value={document.landscaping.treeCount ?? ''} onChange={(e) => handleCategoryDataChange('landscaping', e)} /></div>
                    <div className="space-y-2"><Label htmlFor="fenceLengthNeeded">Fence Length Needed</Label><Input id="fenceLengthNeeded" name="fenceLengthNeeded" value={document.landscaping.fenceLengthNeeded} onChange={(e) => handleCategoryDataChange('landscaping', e)} /></div>
                    <div className="space-y-2 md:col-span-2"><Label>Yard Condition</Label><RadioGroup value={document.landscaping.yardCondition} onValueChange={(v) => handleCategorySelectChange('landscaping', 'yardCondition', v)} className="flex gap-4"><div className="flex items-center space-x-2"><RadioGroupItem value="Good" id="cond-good" /><Label htmlFor="cond-good">Good</Label></div><div className="flex items-center space-x-2"><RadioGroupItem value="Moderate" id="cond-mod" /><Label htmlFor="cond-mod">Moderate</Label></div><div className="flex items-center space-x-2"><RadioGroupItem value="Poor" id="cond-poor" /><Label htmlFor="cond-poor">Poor</Label></div></RadioGroup></div>
                </CardContent>
            </Card>
        )}

        {document.category === "Cleaning Estimate" && document.cleaning && (
            <Card className="bg-card/50 backdrop-blur-sm group-disabled:opacity-70">
                <CardHeader><CardTitle>Cleaning Job Details</CardTitle></CardHeader>
                <CardContent className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2"><Label>Cleaning Type</Label><Input name="cleaningType" value={document.cleaning.cleaningType} onChange={(e) => handleCategoryDataChange('cleaning', e)} placeholder="e.g. Standard, Deep Clean" /></div>
                        <div className="space-y-2"><Label>Frequency</Label><Input name="frequency" value={document.cleaning.frequency} onChange={(e) => handleCategoryDataChange('cleaning', e)} placeholder="e.g. One-time, Weekly" /></div>
                        <div className="space-y-2"><Label htmlFor="homeSize">Home Size (sq ft)</Label><Input id="homeSize" name="homeSize" type="number" value={document.cleaning.homeSize ?? ''} onChange={(e) => handleCategoryDataChange('cleaning', e)} /></div>
                        <div className="space-y-2"><Label>Kitchen Size</Label><Input name="kitchenSize" value={document.cleaning.kitchenSize} onChange={(e) => handleCategoryDataChange('cleaning', e)} placeholder="e.g. Small, Medium, Large" /></div>
                        <div className="space-y-2"><Label htmlFor="bedrooms">Bedrooms</Label><Input id="bedrooms" name="bedrooms" type="number" value={document.cleaning.bedrooms ?? ''} onChange={(e) => handleCategoryDataChange('cleaning', e)} /></div>
                        <div className="space-y-2"><Label htmlFor="bathrooms">Bathrooms</Label><Input id="bathrooms" name="bathrooms" type="number" value={document.cleaning.bathrooms ?? ''} onChange={(e) => handleCategoryDataChange('cleaning', e)} /></div>
                    </div>
                    <div className="flex items-center space-x-2 pt-2"><Checkbox id="hasPets" name="hasPets" checked={document.cleaning.hasPets} onCheckedChange={(c) => handleCategorySelectChange('cleaning', 'hasPets', !!c)} /><Label htmlFor="hasPets">Any Pets?</Label></div>
                    <div className="space-y-3"><Label>Add-ons</Label><div className="grid grid-cols-2 md:grid-cols-3 gap-x-4 gap-y-2">
                        {['Carpet', 'Windows', 'Fridge', 'Oven', 'Laundry', 'Walls'].map(addOn => (
                            <div key={addOn} className="flex items-center space-x-2"><Checkbox id={`addOn-${addOn}`} checked={cleaningAddOns.includes(addOn)} onCheckedChange={(c) => handleCleaningAddOnChange(addOn, !!c)} /><Label htmlFor={`addOn-${addOn}`}>{addOn}</Label></div>
                        ))}
                    </div></div>
                </CardContent>
            </Card>
        )}

        {document.category === "Auto Repair Estimate" && document.autoRepair && (
            <Card className="bg-card/50 backdrop-blur-sm group-disabled:opacity-70">
                <CardHeader><CardTitle>Auto Repair Details</CardTitle></CardHeader>
                <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2"><Label htmlFor="vehicleMake">Vehicle Make</Label><Input id="vehicleMake" name="vehicleMake" value={document.autoRepair.vehicleMake} onChange={(e) => handleCategoryDataChange('autoRepair', e)} /></div>
                    <div className="space-y-2"><Label htmlFor="vehicleModel">Vehicle Model</Label><Input id="vehicleModel" name="vehicleModel" value={document.autoRepair.vehicleModel} onChange={(e) => handleCategoryDataChange('autoRepair', e)} /></div>
                    <div className="space-y-2"><Label htmlFor="vehicleYear">Vehicle Year</Label><Input id="vehicleYear" name="vehicleYear" type="number" value={document.autoRepair.vehicleYear ?? ''} onChange={(e) => handleCategoryDataChange('autoRepair', e)} /></div>
                    <div className="space-y-2"><Label htmlFor="mileage">Mileage</Label><Input id="mileage" name="mileage" type="number" value={document.autoRepair.mileage ?? ''} onChange={(e) => handleCategoryDataChange('autoRepair', e)} /></div>
                    <div className="space-y-2 md:col-span-2"><Label htmlFor="vin">VIN</Label><Input id="vin" name="vin" value={document.autoRepair.vin} onChange={(e) => handleCategoryDataChange('autoRepair', e)} /></div>
                    <div className="space-y-2 md:col-span-2"><Label htmlFor="issueDescription">Issue Description</Label><Textarea id="issueDescription" name="issueDescription" value={document.autoRepair.issueDescription} onChange={(e) => handleCategoryDataChange('autoRepair', e)} /></div>
                    <div className="space-y-2 md:col-span-2"><Label htmlFor="partsRequired">Parts Required</Label><Textarea id="partsRequired" name="partsRequired" value={document.autoRepair.partsRequired} onChange={(e) => handleCategoryDataChange('autoRepair', e)} /></div>
                    <div className="space-y-2 md:col-span-2"><Label>Diagnostic Type</Label><RadioGroup value={document.autoRepair.diagnosticType} onValueChange={(v) => handleCategorySelectChange('autoRepair', 'diagnosticType', v)} className="flex gap-4"><div className="flex items-center space-x-2"><RadioGroupItem value="Basic" id="diag-basic" /><Label htmlFor="diag-basic">Basic</Label></div><div className="flex items-center space-x-2"><RadioGroupItem value="Advanced" id="diag-adv" /><Label htmlFor="diag-adv">Advanced</Label></div></RadioGroup></div>
                </CardContent>
            </Card>
        )}

        {document.category === 'Construction Estimate' && document.construction && (
            <Card className="bg-card/50 backdrop-blur-sm group-disabled:opacity-70">
                <CardHeader><CardTitle>Construction Project Details</CardTitle></CardHeader>
                <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2"><Label htmlFor="constructionProjectType">Project Type</Label><Input id="constructionProjectType" name="projectType" value={document.construction.projectType} onChange={(e) => handleCategoryDataChange('construction', e)} placeholder="New Home, Addition..." /></div>
                    <div className="space-y-2"><Label htmlFor="constructionSqFt">Square Footage</Label><Input id="constructionSqFt" name="squareFootage" type="number" value={document.construction.squareFootage ?? ''} onChange={(e) => handleCategoryDataChange('construction', e)} /></div>
                    <div className="space-y-2"><Label htmlFor="lotSize">Lot Size</Label><Input id="lotSize" name="lotSize" value={document.construction.lotSize} onChange={(e) => handleCategoryDataChange('construction', e)} /></div>
                    <div className="space-y-2"><Label htmlFor="buildingType">Building Type</Label><Input id="buildingType" name="buildingType" value={document.construction.buildingType} onChange={(e) => handleCategoryDataChange('construction', e)} /></div>
                    <div className="space-y-2"><Label htmlFor="soilCondition">Soil Condition</Label><Input id="soilCondition" name="soilCondition" value={document.construction.soilCondition} onChange={(e) => handleCategoryDataChange('construction', e)} /></div>
                    <div className="space-y-2"><Label htmlFor="materialPreference">Material Preference</Label><Input id="materialPreference" name="materialPreference" value={document.construction.materialPreference} onChange={(e) => handleCategoryDataChange('construction', e)} /></div>
                    <div className="flex items-center space-x-2 pt-6"><Checkbox id="constructionPermit" name="permitRequired" checked={document.construction.permitRequired} onCheckedChange={(c) => handleCategorySelectChange('construction', 'permitRequired', !!c)} /><Label htmlFor="constructionPermit">Permit Required?</Label></div>
                    <div className="flex items-center space-x-2 pt-6"><Checkbox id="architectDrawings" name="architectDrawingsProvided" checked={document.construction.architectDrawingsProvided} onCheckedChange={(c) => handleCategorySelectChange('construction', 'architectDrawingsProvided', !!c)} /><Label htmlFor="architectDrawings">Architect Drawings Provided?</Label></div>
                    <div className="flex items-center space-x-2"><Checkbox id="constructionInspection" name="inspectionRequired" checked={document.construction.inspectionRequired} onCheckedChange={(c) => handleCategorySelectChange('construction', 'inspectionRequired', !!c)} /><Label htmlFor="constructionInspection">Inspection Required?</Label></div>
                </CardContent>
            </Card>
        )}

        {document.category === 'IT / Freelance Estimate' && document.itFreelance && (
            <Card className="bg-card/50 backdrop-blur-sm group-disabled:opacity-70">
                <CardHeader><CardTitle>IT/Freelance Project Details</CardTitle></CardHeader>
                <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2"><Label htmlFor="itProjectType">Project Type</Label><Input id="itProjectType" name="projectType" value={document.itFreelance.projectType} onChange={(e) => handleCategoryDataChange('itFreelance', e)} placeholder="Website, App, Branding..." /></div>
                    <div className="space-y-2"><Label htmlFor="itDesignStyle">Design Style</Label><Input id="itDesignStyle" name="designStyle" value={document.itFreelance.designStyle} onChange={(e) => handleCategoryDataChange('itFreelance', e)} /></div>
                    <div className="space-y-2"><Label htmlFor="pagesScreensCount">Number of Pages/Screens</Label><Input id="pagesScreensCount" name="pagesScreensCount" type="number" value={document.itFreelance.pagesScreensCount ?? ''} onChange={(e) => handleCategoryDataChange('itFreelance', e)} /></div>
                    <div className="space-y-2"><Label htmlFor="revisionsIncluded">Revisions Included</Label><Input id="revisionsIncluded" name="revisionsIncluded" type="number" value={document.itFreelance.revisionsIncluded ?? ''} onChange={(e) => handleCategoryDataChange('itFreelance', e)} /></div>
                    <div className="space-y-2 md:col-span-2"><Label htmlFor="itScope">Scope of Work</Label><Textarea id="itScope" name="scopeOfWork" value={document.itFreelance.scopeOfWork} onChange={(e) => handleCategoryDataChange('itFreelance', e)} /></div>
                    <div className="space-y-2 md:col-span-2"><Label htmlFor="itFeatures">Features Needed</Label><Textarea id="itFeatures" name="featuresNeeded" value={document.itFreelance.featuresNeeded} onChange={(e) => handleCategoryDataChange('itFreelance', e)} /></div>
                    <div className="space-y-2 md:col-span-2"><Label htmlFor="itIntegrations">Integrations</Label><Textarea id="itIntegrations" name="integrations" value={document.itFreelance.integrations} onChange={(e) => handleCategoryDataChange('itFreelance', e)} placeholder="Payment, APIs, Auth..." /></div>
                    <div className="space-y-2 md:col-span-2"><Label htmlFor="itTimeline">Delivery Timeline</Label><Input id="itTimeline" name="deliveryTimeline" value={document.itFreelance.deliveryTimeline} onChange={(e) => handleCategoryDataChange('itFreelance', e)} /></div>
                </CardContent>
            </Card>
        )}

        <Card className="bg-card/50 backdrop-blur-sm group-disabled:opacity-70">
            <CardHeader>
            <CardTitle>Line Items (Services / Products)</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
            <div className="hidden md:grid md:grid-cols-12 gap-4 text-sm font-medium text-muted-foreground">
                <div className="col-span-5"><Label>Item Name / Description</Label></div>
                <div className="col-span-2"><Label>Quantity</Label></div>
                <div className="col-span-2"><Label>Unit Price</Label></div>
                <div className="col-span-1 text-center"><Label>Taxable</Label></div>
                <div className="col-span-2"><Label>Total</Label></div>
            </div>
            {document.lineItems.map((item, index) => (
                <div key={item.id} className="grid grid-cols-12 gap-2 items-start">
                <div className="col-span-12 md:col-span-5 space-y-2">
                    <Label htmlFor={`itemName-${index}`} className="md:hidden">Item Name / Description</Label>
                    <Textarea id={`itemName-${index}`} value={item.name} onChange={(e) => handleItemChange(index, 'name', e.target.value)} rows={1} className="min-h-0"/>
                </div>
                <div className="col-span-4 md:col-span-2 space-y-2">
                    <Label htmlFor={`itemQuantity-${index}`} className="md:hidden">Quantity</Label>
                    <Input id={`itemQuantity-${index}`} type="number" value={item.quantity} onChange={(e) => handleItemChange(index, 'quantity', parseFloat(e.target.value) || 0)} />
                </div>
                <div className="col-span-4 md:col-span-2 space-y-2">
                    <Label htmlFor={`itemRate-${index}`} className="md:hidden">Unit Price</Label>
                    <Input id={`itemRate-${index}`} type="number" value={item.unitPrice} onChange={(e) => handleItemChange(index, 'unitPrice', parseFloat(e.target.value) || 0)} />
                </div>
                <div className="col-span-2 md:col-span-1 flex items-center justify-center h-10">
                    <Label htmlFor={`itemTaxable-${index}`} className="md:hidden sr-only">Taxable</Label>
                    <Checkbox id={`itemTaxable-${index}`} checked={item.taxable} onCheckedChange={(checked) => handleItemChange(index, 'taxable', !!checked)} />
                </div>
                <div className="col-span-1 flex items-center h-10">
                    <p className="font-medium tabular-nums text-sm">{currencySymbol}{(item.quantity * item.unitPrice).toFixed(2)}</p>
                </div>
                <div className="col-span-1 flex items-center h-10 justify-end">
                    <Button variant="ghost" size="icon" onClick={() => removeItem(index)}>
                    <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                </div>
                </div>
            ))}
            <div className="flex flex-wrap items-end gap-4 pt-2 border-t border-border">
                <Button variant="outline" onClick={addItem}><Plus className="mr-2 h-4 w-4" /> Add Line Item</Button>
                
                <div className="flex items-end gap-2">
                    <div className="space-y-2">
                        <Label htmlFor="bulk-add-count" className="text-sm">Quantity</Label>
                        <Input 
                            id="bulk-add-count" 
                            type="number" 
                            value={bulkAddCount} 
                            onChange={(e) => setBulkAddCount(Number(e.target.value))}
                            className="w-24 h-10"
                            min="1"
                            max="50"
                        />
                    </div>
                    <Button variant="outline" onClick={handleBulkAddItem}>
                        <Plus className="mr-2 h-4 w-4" /> Add Multiple
                    </Button>
                </div>
            </div>
            </CardContent>
        </Card>

        <Card className="bg-card/50 backdrop-blur-sm group-disabled:opacity-70">
            <CardHeader>
            <CardTitle>Pricing Summary & Terms</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                <Label htmlFor="taxPercentage">Tax (%)</Label>
                <Input id="taxPercentage" name="summary.taxPercentage" type="number" value={document.summary.taxPercentage} onChange={handleNumberChange} />
                </div>
                <div className="space-y-2">
                <Label htmlFor="discount">Discount (Fixed Amount)</Label>
                <Input id="discount" name="summary.discount" type="number" value={document.summary.discount} onChange={handleNumberChange} />
                </div>
                <div className="space-y-2 col-span-2">
                <Label htmlFor="shippingCost">Shipping / Extra Costs</Label>
                <div className="relative flex items-center">
                    <Truck className="absolute left-3 h-5 w-5 text-muted-foreground" />
                    <Input id="shippingCost" name="summary.shippingCost" type="number" value={document.summary.shippingCost} onChange={handleNumberChange} className="pl-10"/>
                </div>
                </div>
            </div>
            <div className="space-y-2">
                <Label htmlFor="termsAndConditions">Terms & Conditions</Label>
                <Textarea id="termsAndConditions" name="termsAndConditions" value={document.termsAndConditions} onChange={handleInputChange} placeholder="e.g., Payment terms, validity period, warranty information..." />
            </div>
             <div className="space-y-2">
                <Label>Owner Signature</Label>
                 <Dialog open={isSignatureDialogOpen} onOpenChange={setIsSignatureDialogOpen}>
                    <DialogTrigger asChild>
                        <Button variant="outline" className="w-full">
                            <Pencil className="mr-2 h-4 w-4" />
                            {document.business.ownerSignature ? 'Edit Signature' : 'Add Signature'}
                        </Button>
                    </DialogTrigger>
                    <DialogContent>
                        <DialogHeader>
                        <DialogTitle>Owner Signature</DialogTitle>
                        </DialogHeader>
                        <SignaturePad onSave={handleOwnerSignatureSave} signerName={document.business.name} />
                    </DialogContent>
                </Dialog>

                {document.business.ownerSignature && (
                    <div className="p-4 border rounded-md bg-muted/50">
                        <Image src={document.business.ownerSignature.image} alt="Owner Signature" width={150} height={75} />
                    </div>
                )}
            </div>
            </CardContent>
        </Card>
      </fieldset>
    </div>
  );
}
