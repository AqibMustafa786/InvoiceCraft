

'use client';

import { ChangeEvent, Dispatch, SetStateAction, useState, useEffect } from 'react';
import type { InsuranceDocument, LineItem } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { DatePicker } from '@/components/ui/datepicker';
import { ImageUp, Plus, Trash2, Palette, X, Mail, Phone, Hash, ShieldCheck, User, FolderArchive, FileText, Calendar, AlertTriangle, Building, UserCircle, Loader2, Globe, Award } from 'lucide-react';
import Image from 'next/image';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface InsuranceFormProps {
  document: InsuranceDocument;
  setDocument: Dispatch<SetStateAction<InsuranceDocument>>;
  accentColor: string;
  setAccentColor: Dispatch<SetStateAction<string>>;
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

export function InsuranceForm({ document: doc, setDocument: setDoc, accentColor, setAccentColor, toast }: InsuranceFormProps) {
  const [colorInputValue, setColorInputValue] = useState(accentColor);
  const [isUploading, setIsUploading] = useState(false);

  useEffect(() => {
    setColorInputValue(accentColor);
  }, [accentColor]);

  const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setDoc(prev => ({ ...prev, [name]: value }));
  };
  
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

  const addItem = () => {
     if (doc.items.length >= 50) {
       toast({
        title: "Item Limit Reached",
        description: "You cannot add more than 50 items.",
        variant: "destructive",
      });
      return;
    }
    setDoc(prev => ({
      ...prev,
      items: [...prev.items, { id: crypto.randomUUID(), name: '', quantity: 1, rate: 0, unitPrice: 0 }],
    }));
  };

  const removeItem = (index: number) => {
    const newItems = doc.items.filter((_, i) => i !== index);
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

  const removeLogo = () => {
      setDoc(prev => ({...prev, logoUrl: ''}));
  }
  
  const currencySymbol = currencies.find(c => c.value === doc.currency)?.label.split(' ')[1] || '$';

  return (
    <div className="space-y-6">
      <Card className="bg-card/50 backdrop-blur-sm shadow-lg hover:shadow-primary/20 transition-shadow duration-300">
        <CardHeader>
          <CardTitle>Your Details (Issuer)</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
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
            <Label htmlFor="companyName">Company Name</Label>
            <Input id="companyName" name="companyName" value={doc.companyName} onChange={handleInputChange} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="companyAddress">Company Address</Label>
            <Textarea id="companyAddress" name="companyAddress" value={doc.companyAddress} onChange={handleInputChange} />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
             <div className="space-y-2">
              <Label htmlFor="companyPhone">Phone #</Label>
              <div className="relative flex items-center">
                  <Phone className="absolute left-3 h-5 w-5 text-muted-foreground" />
                  <Input id="companyPhone" name="companyPhone" value={doc.companyPhone} onChange={handleInputChange} className="pl-10" />
              </div>
            </div>
             <div className="space-y-2">
                <Label htmlFor="companyEmail">Email</Label>
                <div className="relative flex items-center">
                    <Mail className="absolute left-3 h-5 w-5 text-muted-foreground" />
                    <Input id="companyEmail" name="companyEmail" value={doc.companyEmail} onChange={handleInputChange} className="pl-10" />
                </div>
              </div>
               <div className="space-y-2">
                <Label htmlFor="companyWebsite">Website</Label>
                <div className="relative flex items-center">
                    <Globe className="absolute left-3 h-5 w-5 text-muted-foreground" />
                    <Input id="companyWebsite" name="companyWebsite" value={doc.companyWebsite} onChange={handleInputChange} className="pl-10" />
                </div>
              </div>
               <div className="space-y-2">
                <Label htmlFor="licenseNumber">License / Reg. No.</Label>
                <div className="relative flex items-center">
                    <Award className="absolute left-3 h-5 w-5 text-muted-foreground" />
                    <Input id="licenseNumber" name="licenseNumber" value={doc.licenseNumber} onChange={handleInputChange} className="pl-10" />
                </div>
              </div>
              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="taxId">Tax ID / VAT No.</Label>
                <div className="relative flex items-center">
                    <Hash className="absolute left-3 h-5 w-5 text-muted-foreground" />
                    <Input id="taxId" name="taxId" value={doc.taxId} onChange={handleInputChange} className="pl-10" />
                </div>
              </div>
          </div>
        </CardContent>
      </Card>
      <Card className="bg-card/50 backdrop-blur-sm shadow-lg hover:shadow-primary/20 transition-shadow duration-300">
        <CardHeader>
          <CardTitle>Insurance Provider Details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="insuranceCompanyName">Insurance Company Name</Label>
            <Input id="insuranceCompanyName" name="insuranceCompanyName" value={doc.insuranceCompanyName} onChange={handleInputChange} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="insuranceCompanyAddress">Company Address</Label>
            <Textarea id="insuranceCompanyAddress" name="insuranceCompanyAddress" value={doc.insuranceCompanyAddress} onChange={handleInputChange} />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
             <div className="space-y-2">
              <Label htmlFor="insuranceCompanyPhone">Company Phone #</Label>
              <div className="relative flex items-center">
                  <Phone className="absolute left-3 h-5 w-5 text-muted-foreground" />
                  <Input id="insuranceCompanyPhone" name="insuranceCompanyPhone" value={doc.insuranceCompanyPhone} onChange={handleInputChange} className="pl-10" />
              </div>
            </div>
             <div className="space-y-2">
                <Label htmlFor="insuranceCompanyEmail">Company Email</Label>
                <div className="relative flex items-center">
                    <Mail className="absolute left-3 h-5 w-5 text-muted-foreground" />
                    <Input id="insuranceCompanyEmail" name="insuranceCompanyEmail" value={doc.insuranceCompanyEmail} onChange={handleInputChange} className="pl-10" />
                </div>
              </div>
               <div className="space-y-2">
                <Label htmlFor="agentName">Agent Name</Label>
                <div className="relative flex items-center">
                    <UserCircle className="absolute left-3 h-5 w-5 text-muted-foreground" />
                    <Input id="agentName" name="agentName" value={doc.agentName} onChange={handleInputChange} className="pl-10" />
                </div>
              </div>
               <div className="space-y-2">
                <Label htmlFor="agentLicenseNumber">Agent License No.</Label>
                <div className="relative flex items-center">
                    <Award className="absolute left-3 h-5 w-5 text-muted-foreground" />
                    <Input id="agentLicenseNumber" name="agentLicenseNumber" value={doc.agentLicenseNumber} onChange={handleInputChange} className="pl-10" />
                </div>
              </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
