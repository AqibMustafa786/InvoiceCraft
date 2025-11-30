'use client';

import { ChangeEvent, Dispatch, SetStateAction, useState, useEffect } from 'react';
import type { InsuranceDocument, LineItem } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { DatePicker } from '@/components/ui/datepicker';
import { ImageUp, Plus, Trash2, Palette, X, Mail, Phone, Hash, ShieldCheck, User, FolderArchive, FileText, Calendar, AlertTriangle } from 'lucide-react';
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
  logoUrl: string | null;
  setLogoUrl: Dispatch<SetStateAction<string | null>>;
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

export function InsuranceForm({ document: doc, setDocument: setDoc, logoUrl, setLogoUrl, accentColor, setAccentColor, toast }: InsuranceFormProps) {
  const [colorInputValue, setColorInputValue] = useState(accentColor);

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
      items: [...prev.items, { id: crypto.randomUUID(), name: '', quantity: 1, rate: 0 }],
    }));
  };

  const removeItem = (index: number) => {
    const newItems = doc.items.filter((_, i) => i !== index);
    setDoc(prev => ({ ...prev, items: newItems }));
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
  
  const currencySymbol = currencies.find(c => c.value === doc.currency)?.label.split(' ')[1] || '$';

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Branding &amp; Document Details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                    <Label>Your Logo</Label>
                    <div className="flex items-center gap-4">
                        {logoUrl ? (
                            <div className="flex items-center gap-4">
                                <Image src={logoUrl} alt="Company Logo" width={80} height={40} className="rounded-md object-contain bg-muted p-1" />
                                <Button asChild variant="outline" size="sm">
                                    <label htmlFor="logo-upload" className="cursor-pointer">Change</label>
                                </Button>
                                <Button variant="destructive" size="sm" onClick={() => setLogoUrl(null)}><X className="h-4 w-4 mr-1" /> Remove</Button>
                            </div>
                        ) : (
                            <Button asChild variant="outline" className="w-full">
                                <label htmlFor="logo-upload" className="cursor-pointer flex items-center justify-center gap-2"><ImageUp className="h-4 w-4" /> Upload Logo</label>
                            </Button>
                        )}
                        <Input id="logo-upload" type="file" className="sr-only" onChange={handleLogoUpload} accept="image/png, image/jpeg, image/gif" />
                    </div>
                </div>
                <div className="space-y-2">
                    <Label htmlFor="accentColor">Accent Color</Label>
                    <div className="relative flex items-center">
                        <Palette className="absolute left-3 h-5 w-5 text-muted-foreground" />
                        <Input id="accentColor" type="text" value={colorInputValue} onChange={(e) => setColorInputValue(e.target.value)} onBlur={(e) => setAccentColor(e.target.value)} className="pl-10" placeholder="hsl(260 85% 66%)" />
                        <input type="color" value={accentColor.startsWith('hsl') ? '#000000' : accentColor} onChange={(e) => { setAccentColor(e.target.value); setColorInputValue(e.target.value); }} className="absolute right-1 top-1/2 -translate-y-1/2 h-8 w-8 p-1 rounded-md cursor-pointer bg-transparent border-none appearance-none"/>
                    </div>
                </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                    <Label htmlFor="documentNumber">Document Number</Label>
                    <Input id="documentNumber" name="documentNumber" value={doc.documentNumber} onChange={handleInputChange} />
                </div>
                 <div className="space-y-2">
                    <Label>Document Date</Label>
                    <DatePicker date={doc.documentDate} setDate={(date) => setDoc(p => ({ ...p, documentDate: date! }))} />
                </div>
            </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>Your Details (Provider/Company)</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="companyName">Company Name</Label>
              <Input id="companyName" name="companyName" value={doc.companyName} onChange={handleInputChange} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="companyPhone">Phone #</Label>
              <div className="relative flex items-center">
                  <Phone className="absolute left-3 h-5 w-5 text-muted-foreground" />
                  <Input id="companyPhone" name="companyPhone" value={doc.companyPhone} onChange={handleInputChange} className="pl-10" />
              </div>
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="companyAddress">Company Address</Label>
            <Textarea id="companyAddress" name="companyAddress" value={doc.companyAddress} onChange={handleInputChange} />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Policyholder / Insured Details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="insuredName">Insured Name</Label>
               <div className="relative flex items-center">
                <User className="absolute left-3 h-5 w-5 text-muted-foreground" />
                <Input id="insuredName" name="insuredName" value={doc.insuredName} onChange={handleInputChange} className="pl-10" />
              </div>
            </div>
             <div className="space-y-2">
              <Label htmlFor="policyId">Policy ID / Group Number</Label>
              <div className="relative flex items-center">
                <ShieldCheck className="absolute left-3 h-5 w-5 text-muted-foreground" />
                <Input id="policyId" name="policyId" value={doc.policyId} onChange={handleInputChange} className="pl-10" />
              </div>
            </div>
          </div>
           <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
             <div className="space-y-2">
                <Label htmlFor="insuredEmail">Insured Email</Label>
                <div className="relative flex items-center">
                    <Mail className="absolute left-3 h-5 w-5 text-muted-foreground" />
                    <Input id="insuredEmail" name="insuredEmail" value={doc.insuredEmail} onChange={handleInputChange} className="pl-10" placeholder="insured@example.com" />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="insuredPhone">Insured Phone</Label>
                <div className="relative flex items-center">
                    <Phone className="absolute left-3 h-5 w-5 text-muted-foreground" />
                    <Input id="insuredPhone" name="insuredPhone" value={doc.insuredPhone} onChange={handleInputChange} className="pl-10" />
                </div>
              </div>
           </div>
          <div className="space-y-2">
            <Label htmlFor="insuredAddress">Insured Address</Label>
            <Textarea id="insuredAddress" name="insuredAddress" value={doc.insuredAddress} onChange={handleInputChange} />
          </div>
        </CardContent>
      </Card>

       <Card>
        <CardHeader>
          <CardTitle>Claim &amp; Incident Details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="claimNumber">Claim Number</Label>
              <div className="relative flex items-center">
                <FolderArchive className="absolute left-3 h-5 w-5 text-muted-foreground" />
                <Input id="claimNumber" name="claimNumber" value={doc.claimNumber} onChange={handleInputChange} className="pl-10" />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="dateOfLoss">Date of Loss / Incident</Label>
              <div className="relative flex items-center">
                <Calendar className="absolute left-3 h-5 w-5 text-muted-foreground" />
                <Input id="dateOfLoss" name="dateOfLoss" type="date" value={doc.dateOfLoss} onChange={handleInputChange} className="pl-10"/>
              </div>
            </div>
          </div>
           <div className="space-y-2">
              <Label htmlFor="typeOfClaim">Type of Claim / Incident</Label>
              <div className="relative flex items-center">
                <AlertTriangle className="absolute left-3 h-5 w-5 text-muted-foreground" />
                <Input id="typeOfClaim" name="typeOfClaim" value={doc.typeOfClaim} onChange={handleInputChange} className="pl-10" />
              </div>
            </div>
          <div className="space-y-2">
            <Label htmlFor="incidentDescription">Description of Incident / Damage</Label>
            <Textarea id="incidentDescription" name="incidentDescription" value={doc.incidentDescription} onChange={handleInputChange} />
          </div>
        </CardContent>
      </Card>


      <Card>
        <CardHeader>
          <CardTitle>Services / Items</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="hidden md:grid md:grid-cols-12 gap-4 text-sm font-medium text-muted-foreground">
            <div className="col-span-5"><Label>Service / Item Name</Label></div>
            <div className="col-span-2"><Label>Quantity</Label></div>
            <div className="col-span-2"><Label>Rate</Label></div>
            <div className="col-span-2"><Label>Subtotal</Label></div>
            <div className="col-span-1"></div>
          </div>
          {doc.items.map((item, index) => (
            <div key={item.id} className="grid grid-cols-12 gap-2 items-center">
              <div className="col-span-12 md:col-span-5 space-y-2">
                <Label htmlFor={`itemName-${index}`} className="md:hidden">Item Name</Label>
                <Textarea id={`itemName-${index}`} value={item.name} onChange={(e) => handleItemChange(index, 'name', e.target.value)} rows={1} className="min-h-0"/>
              </div>
              <div className="col-span-4 md:col-span-2 space-y-2">
                 <Label htmlFor={`itemQuantity-${index}`} className="md:hidden">Quantity</Label>
                <Input id={`itemQuantity-${index}`} type="number" value={item.quantity} onChange={(e) => handleItemChange(index, 'quantity', parseFloat(e.target.value) || 0)} />
              </div>
              <div className="col-span-4 md:col-span-2 space-y-2">
                <Label htmlFor={`itemRate-${index}`} className="md:hidden">Rate</Label>
                <Input id={`itemRate-${index}`} type="number" value={item.rate} onChange={(e) => handleItemChange(index, 'rate', parseFloat(e.target.value) || 0)} />
              </div>
              <div className="col-span-3 md:col-span-2 flex items-center h-10">
                <p className="font-medium tabular-nums">{currencySymbol}{(item.quantity * item.rate).toFixed(2)}</p>
              </div>
              <div className="col-span-1 flex items-center h-10">
                <Button variant="ghost" size="icon" onClick={() => removeItem(index)}>
                  <Trash2 className="h-4 w-4 text-destructive" />
                </Button>
              </div>
            </div>
          ))}
          <div className="flex flex-wrap items-end gap-4">
            <Button variant="outline" onClick={addItem}><Plus className="mr-2 h-4 w-4" /> Add Item</Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Totals &amp; Notes</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="tax">Tax (%)</Label>
              <Input id="tax" name="tax" type="number" value={doc.tax} onChange={handleNumberChange} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="discount">Discount (%)</Label>
              <Input id="discount" name="discount" type="number" value={doc.discount} onChange={handleNumberChange} />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="notes">Notes / Additional Information</Label>
            <Textarea id="notes" name="notes" value={doc.notes} onChange={handleInputChange} />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
