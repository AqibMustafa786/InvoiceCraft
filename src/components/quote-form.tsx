'use client';

import { ChangeEvent, Dispatch, SetStateAction, useState, useEffect } from 'react';
import type { Quote, LineItem } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { DatePicker } from '@/components/ui/datepicker';
import { ImageUp, Plus, Trash2, Palette, X, Mail, Truck, Hash, Phone } from 'lucide-react';
import Image from 'next/image';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface QuoteFormProps {
  quote: Quote;
  setQuote: Dispatch<SetStateAction<Quote>>;
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
]

export function QuoteForm({ quote, setQuote, logoUrl, setLogoUrl, accentColor, setAccentColor, toast }: QuoteFormProps) {
  const [bulkAddCount, setBulkAddCount] = useState(5);
  const [colorInputValue, setColorInputValue] = useState(accentColor);

  useEffect(() => {
    setColorInputValue(accentColor);
  }, [accentColor]);

  const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setQuote(prev => ({ ...prev, [name]: value }));
  };
  
  const handleCurrencyChange = (value: string) => {
    setQuote(prev => ({ ...prev, currency: value }));
  }

  const handleLanguageChange = (value: string) => {
    setQuote(prev => ({ ...prev, language: value }));
  };

  const handleNumberChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setQuote(prev => ({ ...prev, [name]: parseFloat(value) || 0 }));
  }

  const handleItemChange = (index: number, field: keyof LineItem, value: string | number) => {
    const newItems = [...quote.items];
    (newItems[index] as any)[field] = value;
    setQuote(prev => ({ ...prev, items: newItems }));
  };

  const addItem = () => {
     if (quote.items.length >= 50) {
       toast({
        title: "Item Limit Reached",
        description: "You cannot add more than 50 items to a single quote.",
        variant: "destructive",
      });
      return;
    }
    setQuote(prev => ({
      ...prev,
      items: [...prev.items, { id: crypto.randomUUID(), name: '', quantity: 1, rate: 0 }],
    }));
  };
  
  const handleBulkAddItem = () => {
    const count = Number(bulkAddCount);
    if (count <= 0) return;

    if (quote.items.length + count > 50) {
      toast({
        title: "Item Limit Exceeded",
        description: `You can only add ${50 - quote.items.length} more items. The maximum is 50.`,
        variant: "destructive",
      });
      return;
    }

    const newItems = Array.from({ length: count }, () => ({
      id: crypto.randomUUID(),
      name: '',
      quantity: 1,
      rate: 0,
    }));

    setQuote(prev => ({
      ...prev,
      items: [...prev.items, ...newItems],
    }));
  };

  const removeItem = (index: number) => {
    const newItems = quote.items.filter((_, i) => i !== index);
    setQuote(prev => ({ ...prev, items: newItems }));
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
      <Card className="bg-card/50 backdrop-blur-lg border border-border/30">
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
      
      <Card className="bg-card/50 backdrop-blur-lg border border-border/30">
        <CardHeader>
          <CardTitle>Your Details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="companyName">Company Name</Label>
              <Input id="companyName" name="companyName" value={quote.companyName} onChange={handleInputChange} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="companyPhone">Phone #</Label>
              <div className="relative flex items-center">
                  <Phone className="absolute left-3 h-5 w-5 text-muted-foreground" />
                  <Input id="companyPhone" name="companyPhone" value={quote.companyPhone} onChange={handleInputChange} className="pl-10" />
              </div>
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="companyAddress">Company Address</Label>
            <Textarea id="companyAddress" name="companyAddress" value={quote.companyAddress} onChange={handleInputChange} />
          </div>
        </CardContent>
      </Card>

      <Card className="bg-card/50 backdrop-blur-lg border border-border/30">
        <CardHeader>
          <CardTitle>Client Details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="clientName">Client Name</Label>
            <Input id="clientName" name="clientName" value={quote.clientName} onChange={handleInputChange} />
          </div>
           <div className="space-y-2">
            <Label htmlFor="clientEmail">Client Email</Label>
            <div className="relative flex items-center">
                <Mail className="absolute left-3 h-5 w-5 text-muted-foreground" />
                <Input id="clientEmail" name="clientEmail" value={quote.clientEmail || ''} onChange={handleInputChange} className="pl-10" placeholder="client@example.com" />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="clientAddress">Client Address</Label>
            <Textarea id="clientAddress" name="clientAddress" value={quote.clientAddress} onChange={handleInputChange} />
          </div>
        </CardContent>
      </Card>
      
      <Card className="bg-card/50 backdrop-blur-lg border border-border/30">
        <CardHeader>
          <CardTitle>Quote Details</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="quoteNumber">Quote Number</Label>
            <Input id="quoteNumber" name="quoteNumber" value={quote.quoteNumber} onChange={handleInputChange} />
          </div>
          <div className="space-y-2">
            <Label>Quote Date</Label>
            <DatePicker date={quote.quoteDate} setDate={(date) => setQuote(p => ({ ...p, quoteDate: date! }))} />
          </div>
          <div className="space-y-2">
            <Label>Valid Until</Label>
            <DatePicker date={quote.validUntilDate} setDate={(date) => setQuote(p => ({ ...p, validUntilDate: date! }))} />
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
            <div className="space-y-2">
                <Label htmlFor="language">Language</Label>
                <Select value={quote.language} onValueChange={handleLanguageChange}>
                    <SelectTrigger id="language">
                        <SelectValue placeholder="Select language" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="en">English</SelectItem>
                        <SelectItem value="es">Español (Spanish)</SelectItem>
                        <SelectItem value="fr">Français (French)</SelectItem>
                        <SelectItem value="de">Deutsch (German)</SelectItem>
                        <SelectItem value="ar">العربية (Arabic)</SelectItem>
                        <SelectItem value="zh">中文 (Chinese)</SelectItem>
                    </SelectContent>
                </Select>
            </div>
        </CardContent>
      </Card>

      <Card className="bg-card/50 backdrop-blur-lg border border-border/30">
        <CardHeader>
          <CardTitle>Items / Services</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="hidden md:grid md:grid-cols-12 gap-4 text-sm font-medium text-muted-foreground">
            <div className="col-span-5"><Label>Item Name</Label></div>
            <div className="col-span-2"><Label>Quantity</Label></div>
            <div className="col-span-2"><Label>Rate</Label></div>
            <div className="col-span-2"><Label>Subtotal</Label></div>
            <div className="col-span-1"></div>
          </div>
          {quote.items.map((item, index) => (
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

      <Card className="bg-card/50 backdrop-blur-lg border border-border/30">
        <CardHeader>
          <CardTitle>Totals & Notes</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="tax">Tax (%)</Label>
              <Input id="tax" name="tax" type="number" value={quote.tax} onChange={handleNumberChange} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="discount">Discount (%)</Label>
              <Input id="discount" name="discount" type="number" value={quote.discount} onChange={handleNumberChange} />
            </div>
             <div className="space-y-2 col-span-2">
              <Label htmlFor="shippingCost">Shipping / Extra Costs</Label>
              <div className="relative flex items-center">
                  <Truck className="absolute left-3 h-5 w-5 text-muted-foreground" />
                  <Input id="shippingCost" name="shippingCost" type="number" value={quote.shippingCost} onChange={handleNumberChange} className="pl-10"/>
              </div>
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="notes">Notes / Terms & Conditions</Label>
            <Textarea id="notes" name="notes" value={quote.notes} onChange={handleInputChange} />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
