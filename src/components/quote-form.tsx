
'use client';

import { ChangeEvent, Dispatch, SetStateAction, useState, useEffect } from 'react';
import type { Quote, LineItem } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { DatePicker } from '@/components/ui/datepicker';
import { ImageUp, Plus, Trash2, Palette, X, Mail, Truck, Hash, Phone, Globe, Briefcase, Award, User, FileText, Building } from 'lucide-react';
import Image from 'next/image';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from '@/components/ui/checkbox';

interface QuoteFormProps {
  quote: Quote;
  setQuote: Dispatch<SetStateAction<Quote>>;
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
]

export function QuoteForm({ quote, setQuote, accentColor, setAccentColor, toast }: QuoteFormProps) {
  const [bulkAddCount, setBulkAddCount] = useState(5);
  const [colorInputValue, setColorInputValue] = useState(accentColor);
  const [logoUrl, setLogoUrl] = useState<string | null>(quote.business.logoUrl || null);

  useEffect(() => {
    setColorInputValue(accentColor);
  }, [accentColor]);
  
  useEffect(() => {
    setQuote(prev => ({
        ...prev,
        business: {
            ...prev.business,
            logoUrl: logoUrl || '',
        }
    }))
  }, [logoUrl, setQuote]);

  const handleNestedChange = (section: 'business' | 'client' | 'summary', e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setQuote(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [name]: value
      }
    }));
  };

  const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setQuote(prev => ({ ...prev, [name]: value }));
  };

  const handleNumberChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const [section, field] = name.split('.');
     setQuote(prev => ({
      ...prev,
      [section as 'summary']: {
        ...prev[section as 'summary'],
        [field]: parseFloat(value) || 0,
      }
    }));
  };
  
  const handleCurrencyChange = (value: string) => {
    setQuote(prev => ({ ...prev, currency: value }));
  }

  const handleLanguageChange = (value: string) => {
    setQuote(prev => ({ ...prev, language: value }));
  };

  const handleItemChange = (index: number, field: keyof Omit<LineItem, 'id'>, value: string | number | boolean) => {
    const newItems = [...quote.lineItems];
    (newItems[index] as any)[field] = value;
    setQuote(prev => ({ ...prev, lineItems: newItems }));
  };

  const addItem = () => {
     if (quote.lineItems.length >= 50) {
       toast({
        title: "Item Limit Reached",
        description: "You cannot add more than 50 items to a single quote.",
        variant: "destructive",
      });
      return;
    }
    setQuote(prev => ({
      ...prev,
      lineItems: [...prev.lineItems, { id: crypto.randomUUID(), name: '', quantity: 1, unitPrice: 0, taxable: true }],
    }));
  };
  
  const handleBulkAddItem = () => {
    const count = Number(bulkAddCount);
    if (count <= 0) return;

    if (quote.lineItems.length + count > 50) {
      toast({
        title: "Item Limit Exceeded",
        description: `You can only add ${50 - quote.lineItems.length} more items. The maximum is 50.`,
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

    setQuote(prev => ({
      ...prev,
      lineItems: [...prev.lineItems, ...newItems],
    }));
  };

  const removeItem = (index: number) => {
    const newItems = quote.lineItems.filter((_, i) => i !== index);
    setQuote(prev => ({ ...prev, lineItems: newItems }));
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
  
  const currencySymbol = currencies.find(c => c.value === quote.currency)?.label.split(' ')[1] || '$';

  return (
    <div className="space-y-6">
      <Card className="bg-card/50 backdrop-blur-sm">
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
        </CardContent>
      </Card>
      
      <Card className="bg-card/50 backdrop-blur-sm">
        <CardHeader>
          <CardTitle>Business Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="businessName">Business Name</Label>
              <div className="relative flex items-center">
                <Briefcase className="absolute left-3 h-5 w-5 text-muted-foreground" />
                <Input id="businessName" name="name" value={quote.business.name} onChange={(e) => handleNestedChange('business', e)} className="pl-10" />
              </div>
            </div>
            <div className="space-y-2">
                <Label htmlFor="businessAddress">Business Address</Label>
                <Textarea id="businessAddress" name="address" value={quote.business.address} onChange={(e) => handleNestedChange('business', e)} placeholder="Street, City, State, Zip"/>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                    <Label htmlFor="businessPhone">Phone Number</Label>
                    <div className="relative flex items-center">
                        <Phone className="absolute left-3 h-5 w-5 text-muted-foreground" />
                        <Input id="businessPhone" name="phone" value={quote.business.phone} onChange={(e) => handleNestedChange('business', e)} className="pl-10" />
                    </div>
                </div>
                <div className="space-y-2">
                    <Label htmlFor="businessEmail">Email Address</Label>
                    <div className="relative flex items-center">
                        <Mail className="absolute left-3 h-5 w-5 text-muted-foreground" />
                        <Input id="businessEmail" name="email" value={quote.business.email} onChange={(e) => handleNestedChange('business', e)} className="pl-10" />
                    </div>
                </div>
                <div className="space-y-2">
                    <Label htmlFor="businessWebsite">Website (optional)</Label>
                    <div className="relative flex items-center">
                        <Globe className="absolute left-3 h-5 w-5 text-muted-foreground" />
                        <Input id="businessWebsite" name="website" value={quote.business.website} onChange={(e) => handleNestedChange('business', e)} className="pl-10" />
                    </div>
                </div>
                <div className="space-y-2">
                    <Label htmlFor="businessLicense">License Number (optional)</Label>
                    <div className="relative flex items-center">
                        <Award className="absolute left-3 h-5 w-5 text-muted-foreground" />
                        <Input id="businessLicense" name="licenseNumber" value={quote.business.licenseNumber} onChange={(e) => handleNestedChange('business', e)} className="pl-10" />
                    </div>
                </div>
            </div>
        </CardContent>
      </Card>

      <Card className="bg-card/50 backdrop-blur-sm">
        <CardHeader>
          <CardTitle>Client Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="clientName">Client Full Name</Label>
               <div className="relative flex items-center">
                  <User className="absolute left-3 h-5 w-5 text-muted-foreground" />
                  <Input id="clientName" name="name" value={quote.client.name} onChange={(e) => handleNestedChange('client', e)} className="pl-10" />
                </div>
            </div>
             <div className="space-y-2">
              <Label htmlFor="clientCompanyName">Client Company Name (optional)</Label>
               <div className="relative flex items-center">
                  <Building className="absolute left-3 h-5 w-5 text-muted-foreground" />
                  <Input id="clientCompanyName" name="companyName" value={quote.client.companyName} onChange={(e) => handleNestedChange('client', e)} className="pl-10" />
                </div>
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="clientAddress">Client Address</Label>
            <Textarea id="clientAddress" name="address" value={quote.client.address} onChange={(e) => handleNestedChange('client', e)} />
          </div>
           <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="clientEmail">Client Email</Label>
              <div className="relative flex items-center">
                  <Mail className="absolute left-3 h-5 w-5 text-muted-foreground" />
                  <Input id="clientEmail" name="email" value={quote.client.email || ''} onChange={(e) => handleNestedChange('client', e)} className="pl-10" placeholder="client@example.com" />
              </div>
            </div>
             <div className="space-y-2">
              <Label htmlFor="clientPhone">Client Phone</Label>
              <div className="relative flex items-center">
                  <Phone className="absolute left-3 h-5 w-5 text-muted-foreground" />
                  <Input id="clientPhone" name="phone" value={quote.client.phone || ''} onChange={(e) => handleNestedChange('client', e)} className="pl-10" />
              </div>
            </div>
           </div>
        </CardContent>
      </Card>
      
      <Card className="bg-card/50 backdrop-blur-sm">
        <CardHeader>
          <CardTitle>Quote Details</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="quoteNumber">Quote Number</Label>
            <Input id="quoteNumber" name="estimateNumber" value={quote.estimateNumber} onChange={handleInputChange} />
          </div>
           <div className="space-y-2">
            <Label htmlFor="projectTitle">Project / Job Title</Label>
            <div className="relative flex items-center">
                <FileText className="absolute left-3 h-5 w-5 text-muted-foreground" />
                <Input id="projectTitle" name="projectTitle" value={quote.projectTitle} onChange={handleInputChange} className="pl-10" />
            </div>
          </div>
          <div className="space-y-2">
            <Label>Date Issued</Label>
            <DatePicker date={quote.estimateDate} setDate={(date) => setQuote(p => ({ ...p, estimateDate: date! }))} />
          </div>
          <div className="space-y-2">
            <Label>Expiration Date</Label>
            <DatePicker date={quote.validUntilDate} setDate={(date) => setQuote(p => ({ ...p, validUntilDate: date! }))} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="referenceNumber">Reference Number (optional)</Label>
            <div className="relative flex items-center">
                <Hash className="absolute left-3 h-5 w-5 text-muted-foreground" />
                <Input id="referenceNumber" name="referenceNumber" value={quote.referenceNumber} onChange={handleInputChange} className="pl-10" />
            </div>
          </div>
           <div className="space-y-2">
                <Label htmlFor="currency">Currency</Label>
                <Select value={quote.currency} onValueChange={handleCurrencyChange}>
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

      <Card className="bg-card/50 backdrop-blur-sm">
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
          {quote.lineItems.map((item, index) => (
            <div key={item.id} className="grid grid-cols-12 gap-2 items-center">
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

      <Card className="bg-card/50 backdrop-blur-sm">
        <CardHeader>
          <CardTitle>Pricing Summary & Terms</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="taxPercentage">Tax (%)</Label>
              <Input id="taxPercentage" name="summary.taxPercentage" type="number" value={quote.summary.taxPercentage} onChange={handleNumberChange} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="discount">Discount (Fixed Amount)</Label>
              <Input id="discount" name="summary.discount" type="number" value={quote.summary.discount} onChange={handleNumberChange} />
            </div>
             <div className="space-y-2 col-span-2">
              <Label htmlFor="shippingCost">Shipping / Extra Costs</Label>
              <div className="relative flex items-center">
                  <Truck className="absolute left-3 h-5 w-5 text-muted-foreground" />
                  <Input id="shippingCost" name="summary.shippingCost" type="number" value={quote.summary.shippingCost} onChange={handleNumberChange} className="pl-10"/>
              </div>
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="termsAndConditions">Terms & Conditions</Label>
            <Textarea id="termsAndConditions" name="termsAndConditions" value={quote.termsAndConditions} onChange={handleInputChange} placeholder="e.g., Payment terms, validity period, warranty information..." />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
