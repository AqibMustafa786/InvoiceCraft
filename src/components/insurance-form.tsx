
'use client';

import { ChangeEvent, Dispatch, SetStateAction, useState, useEffect } from 'react';
import type { InsuranceDocument, LineItem, InsuranceCategory, DocumentStatus, Attachment } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { DatePicker } from '@/components/ui/datepicker';
import { ImageUp, Plus, Trash2, Palette, X, Mail, Phone, Hash, ShieldCheck, User, FolderArchive, FileText, Calendar, AlertTriangle, Building, UserCircle, Loader2, Globe, Award, Key, Heart, Car, Home, UploadCloud, File, Pencil, MessageSquare, PaintBucket, Paintbrush, ChevronDown } from 'lucide-react';
import Image from 'next/image';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from './ui/radio-group';
import { Checkbox } from './ui/checkbox';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { SignaturePad } from './signature-pad';
import { Collapsible, CollapsibleTrigger, CollapsibleContent } from '@/components/ui/collapsible';

interface InsuranceFormProps {
  document: InsuranceDocument;
  setDocument: Dispatch<SetStateAction<InsuranceDocument>>;
  accentColor: string;
  setAccentColor: Dispatch<SetStateAction<string>>;
  backgroundColor: string;
  setBackgroundColor: Dispatch<SetStateAction<string>>;
  textColor: string;
  setTextColor: Dispatch<SetStateAction<string>>;
  toast: (options: { title: string; description: string; variant?: "default" | "destructive" }) => void;
}

const currencies = [
    { value: 'USD', label: 'USD ($)' },
    { value: 'EUR', label: 'EUR (€)' },
    { value: 'GBP', label: 'GBP (£)' },
    { value: 'JPY', label: 'JPY (¥)' },
    { value: 'PKR', label: 'PKR (₨)' },
];

const languages = [
    { value: 'en', label: 'English' },
    { value: 'ur', label: 'Urdu' },
    { value: 'es', label: 'Spanish' },
    { value: 'fr', label: 'French' },
    { value: 'de', label: 'German' },
    { value: 'it', label: 'Italian' },
    { value: 'pt', label: 'Portuguese' },
    { value: 'nl', label: 'Dutch' },
    { value: 'ru', label: 'Russian' },
    { value: 'zh', label: 'Chinese' },
];

const fonts = [
    { value: 'Inter', label: 'Inter' },
    { value: 'Roboto', label: 'Roboto' },
    { value: 'Lato', label: 'Lato' },
    { value: 'Merriweather', label: 'Merriweather' },
    { value: 'system-ui', label: 'System Default' },
]

const insuranceCategories: InsuranceCategory[] = ['Vehicle', 'Health', 'Property', 'Life', 'Business', 'Travel', 'Other'];
const policyTypes = ['Comprehensive', 'Third-Party', 'Basic', 'Premium'];
const policyStatuses: DocumentStatus[] = ['draft', 'active', 'expired', 'cancelled'];
const paymentFrequencies: InsuranceDocument['paymentFrequency'][] = ['Monthly', 'Quarterly', 'Yearly', 'One-time'];
const paymentMethods: InsuranceDocument['paymentMethod'][] = ['Cash', 'Bank Transfer', 'Online'];
const paymentStatuses: InsuranceDocument['paymentStatus'][] = ['Unpaid', 'Partially Paid', 'Paid'];

export function InsuranceForm({ document: doc, setDocument: setDoc, accentColor, setAccentColor, backgroundColor, setBackgroundColor, textColor, setTextColor, toast }: InsuranceFormProps) {
  const [accentColorInputValue, setAccentColorInputValue] = useState(accentColor);
  const [bgColorInputValue, setBgColorInputValue] = useState(backgroundColor);
  const [textColorInputValue, setTextColorInputValue] = useState(textColor);
  const [isUploading, setIsUploading] = useState(false);
  const [isUploadingAttachment, setIsUploadingAttachment] = useState<Record<string, boolean>>({});
  const [isSignatureDialogOpen, setIsSignatureDialogOpen] = useState(false);

  useEffect(() => {
    setAccentColorInputValue(accentColor);
  }, [accentColor]);

  useEffect(() => {
    setBgColorInputValue(backgroundColor);
  }, [backgroundColor]);
  
  useEffect(() => {
    setTextColorInputValue(textColor);
  }, [textColor]);


  const handleNestedChange = (section: 'business' | 'insuranceCompany' | 'policyHolder' | 'vehicle' | 'property' | 'health', e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setDoc(prev => ({
      ...prev,
      [section]: {
        ...(prev as any)[section],
        [name]: value
      }
    }));
  };

  const handleCategoryDataChange = (category: 'vehicle' | 'property' | 'health', name: string, value: string | number | null | Date | boolean) => {
    setDoc(prev => ({
        ...prev,
        [category]: {
            ...(prev as any)[category],
            [name]: value
        }
    }));
  };

  const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
     setDoc(prev => ({ ...prev, [name]: type === 'number' ? parseFloat(value) || 0 : value }));
  };

  const handleSwitchChange = (name: string, checked: boolean) => {
      setDoc(prev => ({...prev, [name]: checked}))
  }
  
  const handleCurrencyChange = (value: string) => {
    setDoc(prev => ({ ...prev, currency: value }));
  }

  const handleLanguageChange = (value: string) => {
    setDoc(prev => ({ ...prev, language: value }));
  };

  const handleNumberChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setDoc(prev => ({ ...prev, [name]: parseFloat(value) || 0 }));
  }

  const handleItemChange = (index: number, field: keyof LineItem, value: string | number) => {
    const newItems = [...doc.items];
    (newItems[index] as any)[field] = value;
    setDoc(prev => ({ ...prev, items: newItems }));
  };

  const handleLogoUpload = async (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      if (file.size > 4 * 1024 * 1024) { // 4MB limit
        toast({
          title: "Image too large",
          description: "Please upload an image smaller than 4MB.",
          variant: "destructive",
        });
        return;
      }

      setIsUploading(true);
      const formData = new FormData();
      formData.append('file', file);

      try {
        const response = await fetch('/api/upload', {
          method: 'POST',
          body: formData,
        });

        if (!response.ok) {
          throw new Error('Upload failed');
        }

        const { url } = await response.json();
        setDoc(prev => ({ ...prev, logoUrl: url }));
        toast({
          title: "Logo Uploaded",
          description: "Your logo has been successfully uploaded.",
        });
      } catch (error) {
        console.error("Upload error:", error);
        toast({
          title: "Upload Failed",
          description: "Could not upload the logo. Please try again.",
          variant: "destructive",
        });
      } finally {
        setIsUploading(false);
      }
    }
  };
  
    const handleOwnerSignatureSave = (image: string, signerName: string) => {
    setDoc(prev => ({
        ...prev,
        business: {
            ...prev.business,
            ownerSignature: {
                image,
                signerName,
                signedAt: new Date(),
            }
        }
    }));
    setIsSignatureDialogOpen(false);
  };
  
  const handleDeleteSignature = () => {
    const { ownerSignature, ...businessRest } = doc.business;
    setDoc(prev => ({
      ...prev,
      business: {
        ...businessRest
      }
    }));
  };

  const handleAttachmentUpload = async (e: ChangeEvent<HTMLInputElement>, type: Attachment['type']) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const fieldName = e.target.name;

      setIsUploadingAttachment(prev => ({ ...prev, [fieldName]: true }));
      const formData = new FormData();
      formData.append('file', file);

      try {
        const response = await fetch('/api/upload', {
          method: 'POST',
          body: formData,
        });

        if (!response.ok) throw new Error('Upload failed');

        const { url } = await response.json();
        const newAttachment: Attachment = { name: file.name, url, type };
        setDoc(prev => ({ ...prev, attachments: [...(prev.attachments || []), newAttachment] }));
        toast({ title: "Attachment Uploaded", description: `${file.name} has been uploaded.` });
      } catch (error) {
        toast({ title: "Upload Failed", description: "Could not upload the file.", variant: "destructive" });
      } finally {
        setIsUploadingAttachment(prev => ({ ...prev, [fieldName]: false }));
      }
    }
  };

  const removeAttachment = (url: string) => {
      setDoc(prev => ({ ...prev, attachments: prev.attachments?.filter(att => att.url !== url)}));
  }

  const removeLogo = () => {
      setDoc(prev => ({...prev, logoUrl: ''}));
  }
  
  const currencySymbol = currencies.find(c => c.value === doc.currency)?.label.split(' ')[1] || '$';

  return (
    <div className="space-y-6">
      <Collapsible defaultOpen>
        <Card className="bg-card/50 backdrop-blur-sm shadow-lg hover:shadow-primary/20 transition-shadow duration-300">
          <CollapsibleTrigger asChild>
            <CardHeader className="flex flex-row items-center justify-between cursor-pointer">
              <CardTitle>Branding &amp; Customization</CardTitle>
              <ChevronDown className="h-4 w-4 shrink-0 transition-transform duration-200 group-data-[state=open]:rotate-180" />
            </CardHeader>
          </CollapsibleTrigger>
          <CollapsibleContent>
            <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                  <Label>Company Logo</Label>
                  <div className="flex items-center gap-4">
                    {doc.logoUrl ? (
                        <div className="flex items-center gap-4">
                            <Image src={doc.logoUrl} alt="Company Logo" width={80} height={40} className="rounded-md object-contain bg-muted p-1" />
                            <div className="flex items-center gap-2">
                                <Button asChild variant="outline" size="sm" disabled={isUploading}>
                                    <label htmlFor="logo-upload" className="cursor-pointer">Change</label>
                                </Button>
                                <Button variant="destructive" size="sm" onClick={removeLogo} disabled={isUploading}>
                                  <X className="h-4 w-4 mr-1" /> Remove
                                </Button>
                            </div>
                        </div>
                    ) : (
                        <Button asChild variant="outline" className="w-full" disabled={isUploading}>
                            <label htmlFor="logo-upload" className="cursor-pointer flex items-center justify-center gap-2">
                              {isUploading ? <Loader2 className="h-4 w-4 animate-spin" /> : <ImageUp className="h-4 w-4" />}
                              {isUploading ? 'Uploading...' : 'Upload Logo'}
                            </label>
                        </Button>
                    )}
                    <Input id="logo-upload" type="file" className="sr-only" onChange={handleLogoUpload} accept="image/png, image/jpeg, image/gif" disabled={isUploading}/>
                    </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="accentColor">Accent Color</Label>
                  <div className="relative flex items-center">
                      <Palette className="absolute left-3 h-5 w-5 text-muted-foreground" />
                      <Input 
                          id="accentColor"
                          type="text" 
                          value={accentColorInputValue} 
                          onChange={(e) => setAccentColorInputValue(e.target.value)}
                          onBlur={(e) => setAccentColor(e.target.value)}
                          className="pl-10"
                          placeholder="hsl(260 85% 66%)"
                      />
                      <input 
                          type="color" 
                          value={accentColor.startsWith('hsl') ? '#000000' : accentColor}
                          onChange={(e) => {
                              setAccentColor(e.target.value);
                              setAccentColorInputValue(e.target.value);
                          }}
                          className="absolute right-1 top-1/2 -translate-y-1/2 h-8 w-8 p-1 rounded-md cursor-pointer bg-transparent border-none appearance-none"
                      />
                  </div>
                </div>
                <div className="space-y-2">
                    <Label htmlFor="backgroundColor">Background Color</Label>
                    <div className="relative flex items-center">
                        <PaintBucket className="absolute left-3 h-5 w-5 text-muted-foreground" />
                        <Input 
                            id="backgroundColor"
                            type="text" 
                            value={bgColorInputValue} 
                            onChange={(e) => setBgColorInputValue(e.target.value)}
                            onBlur={(e) => setBackgroundColor(e.target.value)}
                            className="pl-10"
                            placeholder="#FFFFFF"
                        />
                        <input 
                            type="color" 
                            value={backgroundColor}
                            onChange={(e) => {
                                setBackgroundColor(e.target.value);
                            }}
                            className="absolute right-1 top-1/2 -translate-y-1/2 h-8 w-8 p-1 rounded-md cursor-pointer bg-transparent border-none appearance-none"
                        />
                    </div>
                </div>
                <div className="space-y-2">
                    <Label htmlFor="textColor">Text Color</Label>
                    <div className="relative flex items-center">
                        <Paintbrush className="absolute left-3 h-5 w-5 text-muted-foreground" />
                        <Input 
                            id="textColor"
                            type="text" 
                            value={textColorInputValue} 
                            onChange={(e) => setTextColorInputValue(e.target.value)}
                            onBlur={(e) => setTextColor(e.target.value)}
                            className="pl-10"
                            placeholder="#374151"
                        />
                        <input 
                            type="color" 
                            value={textColor}
                            onChange={(e) => {
                                setTextColor(e.target.value);
                            }}
                            className="absolute right-1 top-1/2 -translate-y-1/2 h-8 w-8 p-1 rounded-md cursor-pointer bg-transparent border-none appearance-none"
                        />
                    </div>
                </div>
                <div className="space-y-2">
                    <Label htmlFor="fontFamily">Font Family</Label>
                    <Select value={doc.fontFamily} onValueChange={(value) => setDoc(p => ({...p, fontFamily: value}))}>
                        <SelectTrigger id="fontFamily">
                            <SelectValue placeholder="Select font" />
                        </SelectTrigger>
                        <SelectContent>
                            {fonts.map(font => <SelectItem key={font.value} value={font.value}>{font.label}</SelectItem>)}
                        </SelectContent>
                    </Select>
                </div>
              <div className="space-y-2">
                <Label htmlFor="language">Language</Label>
                <Select value={doc.language} onValueChange={handleLanguageChange}>
                    <SelectTrigger id="language">
                        <SelectValue placeholder="Select language" />
                    </SelectTrigger>
                    <SelectContent>
                        {languages.map(lang => (
                            <SelectItem key={lang.value} value={lang.value}>{lang.label}</SelectItem>
                        ))}
                    </SelectContent>
                </Select>
              </div>
            </CardContent>
          </CollapsibleContent>
        </Card>
      </Collapsible>
      <Collapsible defaultOpen>
        <Card className="bg-card/50 backdrop-blur-sm shadow-lg hover:shadow-primary/20 transition-shadow duration-300">
          <CollapsibleTrigger asChild>
            <CardHeader className="flex flex-row items-center justify-between cursor-pointer">
              <CardTitle>Your Details (Issuer)</CardTitle>
              <ChevronDown className="h-4 w-4 shrink-0 transition-transform duration-200 group-data-[state=open]:rotate-180" />
            </CardHeader>
          </CollapsibleTrigger>
          <CollapsibleContent>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="companyName">Company Name</Label>
                <Input id="companyName" name="name" value={doc.business.name} onChange={(e) => handleNestedChange('business', e)} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="companyAddress">Company Address</Label>
                <Textarea id="companyAddress" name="address" value={doc.business.address} onChange={(e) => handleNestedChange('business', e)} />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="companyPhone">Phone #</Label>
                  <div className="relative flex items-center">
                      <Phone className="absolute left-3 h-5 w-5 text-muted-foreground" />
                      <Input id="companyPhone" name="phone" value={doc.business.phone} onChange={(e) => handleNestedChange('business', e)} className="pl-10" />
                  </div>
                </div>
                <div className="space-y-2">
                    <Label htmlFor="companyEmail">Email</Label>
                    <div className="relative flex items-center">
                        <Mail className="absolute left-3 h-5 w-5 text-muted-foreground" />
                        <Input id="companyEmail" name="email" value={doc.business.email} onChange={(e) => handleNestedChange('business', e)} className="pl-10" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="companyWebsite">Website</Label>
                    <div className="relative flex items-center">
                        <Globe className="absolute left-3 h-5 w-5 text-muted-foreground" />
                        <Input id="companyWebsite" name="website" value={doc.business.website} onChange={(e) => handleNestedChange('business', e)} className="pl-10" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="licenseNumber">License / Reg. No.</Label>
                    <div className="relative flex items-center">
                        <Award className="absolute left-3 h-5 w-5 text-muted-foreground" />
                        <Input id="licenseNumber" name="licenseNumber" value={doc.business.licenseNumber} onChange={(e) => handleNestedChange('business', e)} className="pl-10" />
                    </div>
                  </div>
                  <div className="space-y-2 md:col-span-2">
                    <Label htmlFor="taxId">Tax ID / VAT No.</Label>
                    <div className="relative flex items-center">
                        <Hash className="absolute left-3 h-5 w-5 text-muted-foreground" />
                        <Input id="taxId" name="taxId" value={doc.business.taxId || ''} onChange={(e) => handleNestedChange('business', e)} className="pl-10" />
                    </div>
                  </div>
              </div>
            </CardContent>
          </CollapsibleContent>
        </Card>
      </Collapsible>
      <Collapsible defaultOpen>
        <Card className="bg-card/50 backdrop-blur-sm shadow-lg hover:shadow-primary/20 transition-shadow duration-300">
          <CollapsibleTrigger asChild>
            <CardHeader className="flex flex-row items-center justify-between cursor-pointer">
              <CardTitle>Insurance Provider Details</CardTitle>
              <ChevronDown className="h-4 w-4 shrink-0 transition-transform duration-200 group-data-[state=open]:rotate-180" />
            </CardHeader>
          </CollapsibleTrigger>
          <CollapsibleContent>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="insuranceCompanyName">Insurance Company Name</Label>
                <Input id="insuranceCompanyName" name="name" value={doc.insuranceCompany.name} onChange={(e) => handleNestedChange('insuranceCompany', e)} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="insuranceCompanyAddress">Company Address</Label>
                <Textarea id="insuranceCompanyAddress" name="address" value={doc.insuranceCompany.address} onChange={(e) => handleNestedChange('insuranceCompany', e)} />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="insuranceCompanyPhone">Company Phone #</Label>
                  <div className="relative flex items-center">
                      <Phone className="absolute left-3 h-5 w-5 text-muted-foreground" />
                      <Input id="insuranceCompanyPhone" name="phone" value={doc.insuranceCompany.phone} onChange={(e) => handleNestedChange('insuranceCompany', e)} className="pl-10" />
                  </div>
                </div>
                <div className="space-y-2">
                    <Label htmlFor="insuranceCompanyEmail">Company Email</Label>
                    <div className="relative flex items-center">
                        <Mail className="absolute left-3 h-5 w-5 text-muted-foreground" />
                        <Input id="insuranceCompanyEmail" name="email" value={doc.insuranceCompany.email} onChange={(e) => handleNestedChange('insuranceCompany', e)} className="pl-10" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="agentName">Agent Name</Label>
                    <div className="relative flex items-center">
                        <UserCircle className="absolute left-3 h-5 w-5 text-muted-foreground" />
                        <Input id="agentName" name="agentName" value={doc.insuranceCompany.agentName} onChange={(e) => handleNestedChange('insuranceCompany', e)} className="pl-10" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="agentLicenseNumber">Agent License No.</Label>
                    <div className="relative flex items-center">
                        <Award className="absolute left-3 h-5 w-5 text-muted-foreground" />
                        <Input id="agentLicenseNumber" name="agentLicenseNumber" value={doc.insuranceCompany.agentLicenseNumber} onChange={(e) => handleNestedChange('insuranceCompany', e)} className="pl-10" />
                    </div>
                  </div>
              </div>
            </CardContent>
          </CollapsibleContent>
        </Card>
      </Collapsible>
      <Collapsible defaultOpen>
        <Card className="bg-card/50 backdrop-blur-sm shadow-lg hover:shadow-primary/20 transition-shadow duration-300">
          <CollapsibleTrigger asChild>
            <CardHeader className="flex flex-row items-center justify-between cursor-pointer">
              <CardTitle>Policy Holder Information</CardTitle>
              <ChevronDown className="h-4 w-4 shrink-0 transition-transform duration-200 group-data-[state=open]:rotate-180" />
            </CardHeader>
          </CollapsibleTrigger>
          <CollapsibleContent>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                    <Label htmlFor="policyHolderName">Client Name</Label>
                    <Input id="policyHolderName" name="name" value={doc.policyHolder.name} onChange={(e) => handleNestedChange('policyHolder', e)} />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="policyHolderCompanyName">Company Name (optional)</Label>
                    <Input id="policyHolderCompanyName" name="companyName" value={doc.policyHolder.companyName || ''} onChange={(e) => handleNestedChange('policyHolder', e)} />
                </div>
              </div>
              <div className="space-y-2">
                    <Label htmlFor="policyHolderAddress">Address</Label>
                    <Textarea id="policyHolderAddress" name="address" value={doc.policyHolder.address} onChange={(e) => handleNestedChange('policyHolder', e)} />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <Label htmlFor="policyHolderEmail">Email</Label>
                        <Input id="policyHolderEmail" name="email" type="email" value={doc.policyHolder.email} onChange={(e) => handleNestedChange('policyHolder', e)} />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="policyHolderPhone">Phone</Label>
                        <Input id="policyHolderPhone" name="phone" value={doc.policyHolder.phone} onChange={(e) => handleNestedChange('policyHolder', e)} />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="policyId">Policy ID</Label>
                        <div className="relative flex items-center">
                            <Key className="absolute left-3 h-5 w-5 text-muted-foreground" />
                            <Input id="policyId" name="policyId" value={doc.policyId} onChange={handleInputChange} className="pl-10" />
                        </div>
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="identificationNumber">Identification Number (CNIC, etc.)</Label>
                        <div className="relative flex items-center">
                            <UserCircle className="absolute left-3 h-5 w-5 text-muted-foreground" />
                            <Input id="identificationNumber" name="identificationNumber" value={doc.policyHolder.identificationNumber || ''} onChange={(e) => handleNestedChange('policyHolder', e)} className="pl-10" />
                        </div>
                    </div>
                </div>
            </CardContent>
          </CollapsibleContent>
        </Card>
      </Collapsible>

      <Collapsible defaultOpen>
        <Card className="bg-card/50 backdrop-blur-sm shadow-lg hover:shadow-primary/20 transition-shadow duration-300">
          <CollapsibleTrigger asChild>
            <CardHeader className="flex flex-row items-center justify-between cursor-pointer">
              <CardTitle>Policy Information</CardTitle>
              <ChevronDown className="h-4 w-4 shrink-0 transition-transform duration-200 group-data-[state=open]:rotate-180" />
            </CardHeader>
          </CollapsibleTrigger>
          <CollapsibleContent>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="policyNumber">Policy Number</Label>
                  <Input id="policyNumber" name="policyNumber" value={doc.policyNumber} onChange={handleInputChange} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="policyType">Policy Type</Label>
                  <Select value={doc.policyType} onValueChange={(value: any) => setDoc(p => ({ ...p, policyType: value }))}>
                    <SelectTrigger id="policyType"><SelectValue placeholder="Select a type" /></SelectTrigger>
                    <SelectContent>
                      {policyTypes.map(type => <SelectItem key={type} value={type}>{type}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Policy Start Date</Label>
                  <DatePicker date={doc.policyStartDate} setDate={(date) => setDoc(p => ({ ...p, policyStartDate: date! }))} />
                </div>
                <div className="space-y-2">
                  <Label>Policy End Date</Label>
                  <DatePicker date={doc.policyEndDate} setDate={(date) => setDoc(p => ({ ...p, policyEndDate: date! }))} />
                </div>
                <div className="space-y-2">
                  <Label>Status</Label>
                  <Select value={doc.status} onValueChange={(value: any) => setDoc(p => ({ ...p, status: value }))}>
                    <SelectTrigger id="status"><SelectValue placeholder="Select a status" /></SelectTrigger>
                    <SelectContent>
                      {policyStatuses.map(s => <SelectItem key={s} value={s} className="capitalize">{s}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex items-center space-x-2 pt-6">
                    <Checkbox id="renewalOption" name="renewalOption" checked={doc.renewalOption} onCheckedChange={(checked) => handleSwitchChange('renewalOption', !!checked)} />
                    <Label htmlFor="renewalOption">Auto-Renewal</Label>
                </div>
              </div>
            </CardContent>
          </CollapsibleContent>
        </Card>
      </Collapsible>
      
      <Collapsible defaultOpen>
        <Card className="bg-card/50 backdrop-blur-sm shadow-lg hover:shadow-primary/20 transition-shadow duration-300">
          <CollapsibleTrigger asChild>
            <CardHeader className="flex flex-row items-center justify-between cursor-pointer">
              <CardTitle>Insured Entity Details</CardTitle>
              <ChevronDown className="h-4 w-4 shrink-0 transition-transform duration-200 group-data-[state=open]:rotate-180" />
            </CardHeader>
          </CollapsibleTrigger>
          <CollapsibleContent>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="insuranceCategory">Insurance Category</Label>
                <Select value={doc.insuranceCategory} onValueChange={(value: InsuranceCategory) => setDoc(p => ({ ...p, insuranceCategory: value }))}>
                  <SelectTrigger id="insuranceCategory"><SelectValue placeholder="Select a category" /></SelectTrigger>
                  <SelectContent>
                    {insuranceCategories.map(cat => <SelectItem key={cat} value={cat}>{cat}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="insuredItemDescription">Description of Insured Item/Service</Label>
                <Textarea id="insuredItemDescription" name="insuredItemDescription" value={doc.insuredItemDescription} onChange={handleInputChange} />
              </div>

              {doc.insuranceCategory === 'Vehicle' && doc.vehicle && (
                <div className="p-4 border rounded-md space-y-4">
                  <h4 className="font-semibold flex items-center gap-2"><Car className="h-5 w-5" /> Vehicle Details</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2"><Label>Make</Label><Input name="vehicleMake" value={doc.vehicle.vehicleMake} onChange={e => handleNestedChange('vehicle', e)} /></div>
                    <div className="space-y-2"><Label>Model</Label><Input name="model" value={doc.vehicle.model} onChange={e => handleNestedChange('vehicle', e)} /></div>
                    <div className="space-y-2"><Label>Registration Number</Label><Input name="registrationNumber" value={doc.vehicle.registrationNumber} onChange={e => handleNestedChange('vehicle', e)} /></div>
                    <div className="space-y-2"><Label>Engine / Chassis Number</Label><Input name="chassisNumber" value={doc.vehicle.chassisNumber} onChange={e => handleNestedChange('vehicle', e)} /></div>
                  </div>
                </div>
              )}

              {doc.insuranceCategory === 'Property' && doc.property && (
                <div className="p-4 border rounded-md space-y-4">
                  <h4 className="font-semibold flex items-center gap-2"><Home className="h-5 w-5" /> Property Details</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="md:col-span-2 space-y-2"><Label>Property Address</Label><Input name="propertyAddress" value={doc.property.propertyAddress} onChange={e => handleNestedChange('property', e)} /></div>
                    <div className="space-y-2"><Label>Property Type</Label>
                      <RadioGroup name="propertyType" value={doc.property.propertyType} onValueChange={(value) => handleCategoryDataChange('property', 'propertyType', value)} className="flex gap-4">
                        <div className="flex items-center space-x-2"><RadioGroupItem value="Residential" id="res" /><Label htmlFor="res">Residential</Label></div>
                        <div className="flex items-center space-x-2"><RadioGroupItem value="Commercial" id="com" /><Label htmlFor="com">Commercial</Label></div>
                      </RadioGroup>
                    </div>
                    <div className="space-y-2"><Label>Estimated Value</Label><Input name="estimatedValue" type="number" value={doc.property.estimatedValue ?? ''} onChange={e => handleNestedChange('property', e)} /></div>
                  </div>
                </div>
              )}

              {doc.insuranceCategory === 'Health' && doc.health && (
                <div className="p-4 border rounded-md space-y-4">
                  <h4 className="font-semibold flex items-center gap-2"><Heart className="h-5 w-5" /> Health Details</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2"><Label>Insured Person's Name</Label><Input name="insuredPersonName" value={doc.health.insuredPersonName} onChange={e => handleNestedChange('health', e)} /></div>
                    <div className="space-y-2"><Label>Date of Birth</Label><DatePicker date={doc.health.dateOfBirth} setDate={(date) => handleCategoryDataChange('health', 'dateOfBirth', date!)} /></div>
                    <div className="space-y-2"><Label>Gender</Label>
                      <RadioGroup name="gender" value={doc.health.gender} onValueChange={(value) => handleCategoryDataChange('health', 'gender', value)} className="flex gap-4">
                        <div className="flex items-center space-x-2"><RadioGroupItem value="Male" id="male" /><Label htmlFor="male">Male</Label></div>
                        <div className="flex items-center space-x-2"><RadioGroupItem value="Female" id="female" /><Label htmlFor="female">Female</Label></div>
                        <div className="flex items-center space-x-2"><RadioGroupItem value="Other" id="other" /><Label htmlFor="other">Other</Label></div>
                      </RadioGroup>
                    </div>
                  </div>
                </div>
              )}

            </CardContent>
          </CollapsibleContent>
        </Card>
      </Collapsible>
      <Collapsible defaultOpen>
        <Card className="bg-card/50 backdrop-blur-sm shadow-lg hover:shadow-primary/20 transition-shadow duration-300">
          <CollapsibleTrigger asChild>
            <CardHeader className="flex flex-row items-center justify-between cursor-pointer">
              <CardTitle>Coverage Details</CardTitle>
              <ChevronDown className="h-4 w-4 shrink-0 transition-transform duration-200 group-data-[state=open]:rotate-180" />
            </CardHeader>
          </CollapsibleTrigger>
          <CollapsibleContent>
            <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <Label htmlFor="coverageAmount">Coverage Amount / Sum Insured</Label>
                        <Input id="coverageAmount" name="coverageAmount" type="number" value={doc.coverageAmount} onChange={handleInputChange} />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="deductibleAmount">Deductible / Excess Amount</Label>
                        <Input id="deductibleAmount" name="deductibleAmount" type="number" value={doc.deductibleAmount} onChange={handleInputChange} />
                    </div>
                </div>
                <div className="space-y-2">
                    <Label htmlFor="coverageScope">Coverage Scope</Label>
                    <Textarea id="coverageScope" name="coverageScope" value={doc.coverageScope} onChange={handleInputChange} placeholder="Describe the overall scope of the coverage..." />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="includedRisks">Included Risks</Label>
                    <Textarea id="includedRisks" name="includedRisks" value={doc.includedRisks} onChange={handleInputChange} placeholder="List what is covered, e.g., using bullet points." />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="excludedRisks">Excluded Risks</Label>
                    <Textarea id="excludedRisks" name="excludedRisks" value={doc.excludedRisks} onChange={handleInputChange} placeholder="List what is NOT covered." />
                </div>
            </CardContent>
          </CollapsibleContent>
        </Card>
      </Collapsible>
      <Collapsible defaultOpen>
        <Card className="bg-card/50 backdrop-blur-sm shadow-lg hover:shadow-primary/20 transition-shadow duration-300">
          <CollapsibleTrigger asChild>
            <CardHeader className="flex flex-row items-center justify-between cursor-pointer">
              <CardTitle>Premium &amp; Payment Information</CardTitle>
              <ChevronDown className="h-4 w-4 shrink-0 transition-transform duration-200 group-data-[state=open]:rotate-180" />
            </CardHeader>
          </CollapsibleTrigger>
          <CollapsibleContent>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="premiumAmount">Premium Amount</Label>
                <div className="relative flex items-center">
                  <span className="absolute left-3 text-muted-foreground">{currencySymbol}</span>
                  <Input
                    id="premiumAmount"
                    type="number"
                    value={doc.items[0]?.unitPrice || 0}
                    onChange={(e) => handleItemChange(0, 'unitPrice', parseFloat(e.target.value) || 0)}
                    className="pl-8"
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="tax">Tax (%)</Label>
                  <Input id="tax" name="tax" type="number" value={doc.tax} onChange={handleNumberChange} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="discount">Discount (%)</Label>
                  <Input id="discount" name="discount" type="number" value={doc.discount} onChange={handleNumberChange} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="paymentFrequency">Payment Frequency</Label>
                  <Select value={doc.paymentFrequency} onValueChange={(value: any) => setDoc(p => ({...p, paymentFrequency: value}))}>
                    <SelectTrigger id="paymentFrequency"><SelectValue /></SelectTrigger>
                    <SelectContent>{paymentFrequencies.map(f => <SelectItem key={f} value={f}>{f}</SelectItem>)}</SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="paymentMethod">Payment Method</Label>
                  <Select value={doc.paymentMethod} onValueChange={(value: any) => setDoc(p => ({...p, paymentMethod: value}))}>
                    <SelectTrigger id="paymentMethod"><SelectValue /></SelectTrigger>
                    <SelectContent>{paymentMethods.map(m => <SelectItem key={m} value={m}>{m}</SelectItem>)}</SelectContent>
                  </Select>
                </div>
                <div className="md:col-span-2 space-y-2">
                  <Label htmlFor="paymentStatus">Payment Status</Label>
                  <Select value={doc.paymentStatus} onValueChange={(value: any) => setDoc(p => ({...p, paymentStatus: value}))}>
                    <SelectTrigger id="paymentStatus"><SelectValue /></SelectTrigger>
                    <SelectContent>{paymentStatuses.map(s => <SelectItem key={s} value={s} className="capitalize">{s}</SelectItem>)}</SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </CollapsibleContent>
        </Card>
      </Collapsible>
      <Collapsible defaultOpen>
        <Card className="bg-card/50 backdrop-blur-sm shadow-lg hover:shadow-primary/20 transition-shadow duration-300">
          <CollapsibleTrigger asChild>
            <CardHeader className="flex flex-row items-center justify-between cursor-pointer">
              <CardTitle>Terms &amp; Conditions</CardTitle>
              <ChevronDown className="h-4 w-4 shrink-0 transition-transform duration-200 group-data-[state=open]:rotate-180" />
            </CardHeader>
          </CollapsibleTrigger>
          <CollapsibleContent>
            <CardContent>
              <Textarea 
                name="termsAndConditions"
                value={doc.termsAndConditions} 
                onChange={handleInputChange}
                placeholder="Enter policy terms, conditions, jurisdiction, etc."
                rows={6}
              />
            </CardContent>
          </CollapsibleContent>
        </Card>
      </Collapsible>
      <Collapsible defaultOpen>
        <Card className="bg-card/50 backdrop-blur-sm shadow-lg hover:shadow-primary/20 transition-shadow duration-300">
          <CollapsibleTrigger asChild>
            <CardHeader className="flex flex-row items-center justify-between cursor-pointer">
              <CardTitle>Notes &amp; Internal Remarks</CardTitle>
              <ChevronDown className="h-4 w-4 shrink-0 transition-transform duration-200 group-data-[state=open]:rotate-180" />
            </CardHeader>
          </CollapsibleTrigger>
          <CollapsibleContent>
            <CardContent>
              <Textarea 
                name="internalNotes"
                value={doc.internalNotes || ''} 
                onChange={handleInputChange}
                placeholder="Internal notes, not visible to client..."
                rows={4}
              />
            </CardContent>
          </CollapsibleContent>
        </Card>
      </Collapsible>
      <Collapsible defaultOpen>
        <Card className="bg-card/50 backdrop-blur-sm shadow-lg hover:shadow-primary/20 transition-shadow duration-300">
          <CollapsibleTrigger asChild>
            <CardHeader className="flex flex-row items-center justify-between cursor-pointer">
              <CardTitle>Signature &amp; Authorization</CardTitle>
              <ChevronDown className="h-4 w-4 shrink-0 transition-transform duration-200 group-data-[state=open]:rotate-180" />
            </CardHeader>
          </CollapsibleTrigger>
          <CollapsibleContent>
            <CardContent>
                <div className="space-y-2">
                    <Label>Authorized Person Signature</Label>
                    <div className="flex gap-2">
                        <Dialog open={isSignatureDialogOpen} onOpenChange={setIsSignatureDialogOpen}>
                            <DialogTrigger asChild>
                                <Button variant="outline" className="w-full">
                                    <Pencil className="mr-2 h-4 w-4" />
                                    {doc.business.ownerSignature ? 'Edit Signature' : 'Add Signature'}
                                </Button>
                            </DialogTrigger>
                            <DialogContent>
                                <DialogHeader>
                                    <DialogTitle>Authorized Signature</DialogTitle>
                                    <DialogDescription>
                                        Draw your signature below. This will appear on the document.
                                    </DialogDescription>
                                </DialogHeader>
                                <SignaturePad onSave={handleOwnerSignatureSave} signerName={doc.business.name} />
                            </DialogContent>
                        </Dialog>
                        {doc.business.ownerSignature && (
                          <Button variant="destructive" onClick={handleDeleteSignature}>
                              <Trash2 className="mr-2 h-4 w-4" />
                              Delete
                          </Button>
                        )}
                    </div>
                    {doc.business.ownerSignature && (
                        <div className="p-4 border rounded-md bg-muted/50">
                            <Image src={doc.business.ownerSignature.image} alt="Owner Signature" width={150} height={75} />
                        </div>
                    )}
                </div>
            </CardContent>
          </CollapsibleContent>
        </Card>
      </Collapsible>
      <Collapsible defaultOpen>
        <Card className="bg-card/50 backdrop-blur-sm shadow-lg hover:shadow-primary/20 transition-shadow duration-300">
          <CollapsibleTrigger asChild>
            <CardHeader className="flex flex-row items-center justify-between cursor-pointer">
              <CardTitle>Attachments &amp; Documents</CardTitle>
              <ChevronDown className="h-4 w-4 shrink-0 transition-transform duration-200 group-data-[state=open]:rotate-180" />
            </CardHeader>
          </CollapsibleTrigger>
          <CollapsibleContent>
            <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <Label htmlFor="id-proof-upload">ID Proof</Label>
                        <Button asChild variant="outline" className="w-full">
                            <label htmlFor="id-proof-upload" className="cursor-pointer flex items-center justify-center gap-2">
                                {isUploadingAttachment['id_proof'] ? <Loader2 className="h-4 w-4 animate-spin" /> : <UploadCloud className="h-4 w-4" />}
                                Upload ID
                            </label>
                        </Button>
                        <Input id="id-proof-upload" name="id_proof" type="file" className="sr-only" onChange={(e) => handleAttachmentUpload(e, 'id_proof')} />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="property-doc-upload">Property/Vehicle Documents</Label>
                        <Button asChild variant="outline" className="w-full">
                            <label htmlFor="property-doc-upload" className="cursor-pointer flex items-center justify-center gap-2">
                              {isUploadingAttachment['property_doc'] ? <Loader2 className="h-4 w-4 animate-spin" /> : <UploadCloud className="h-4 w-4" />}
                                Upload Documents
                            </label>
                        </Button>
                        <Input id="property-doc-upload" name="property_doc" type="file" className="sr-only" onChange={(e) => handleAttachmentUpload(e, 'property_doc')} />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="medical-report-upload">Medical Reports</Label>
                        <Button asChild variant="outline" className="w-full">
                            <label htmlFor="medical-report-upload" className="cursor-pointer flex items-center justify-center gap-2">
                                {isUploadingAttachment['medical_report'] ? <Loader2 className="h-4 w-4 animate-spin" /> : <UploadCloud className="h-4 w-4" />}
                                Upload Reports
                            </label>
                        </Button>
                        <Input id="medical-report-upload" name="medical_report" type="file" className="sr-only" onChange={(e) => handleAttachmentUpload(e, 'medical_report')} />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="other-upload">Other Supporting Files</Label>
                        <Button asChild variant="outline" className="w-full">
                            <label htmlFor="other-upload" className="cursor-pointer flex items-center justify-center gap-2">
                              {isUploadingAttachment['other'] ? <Loader2 className="h-4 w-4 animate-spin" /> : <UploadCloud className="h-4 w-4" />}
                                Upload File
                            </label>
                        </Button>
                        <Input id="other-upload" name="other" type="file" className="sr-only" onChange={(e) => handleAttachmentUpload(e, 'other')} />
                    </div>
                </div>
                  {doc.attachments && doc.attachments.length > 0 && (
                    <div className="space-y-2 pt-4 border-t">
                        <Label>Uploaded Files</Label>
                        <ul className="space-y-2">
                            {doc.attachments.map((att, index) => (
                                <li key={index} className="flex items-center justify-between text-sm bg-muted/50 p-2 rounded-md">
                                    <a href={att.url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 hover:underline text-primary">
                                        <File className="h-4 w-4"/>
                                        <span className="truncate">{att.name}</span>
                                    </a>
                                    <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => removeAttachment(att.url)}>
                                        <X className="h-4 w-4 text-destructive"/>
                                    </Button>
                                </li>
                            ))}
                        </ul>
                    </div>
                )}
            </CardContent>
          </CollapsibleContent>
        </Card>
      </Collapsible>
    </div>
  );
}
