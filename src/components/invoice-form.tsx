
'use client';

import { ChangeEvent, Dispatch, SetStateAction, useState, useEffect } from 'react';
import type { Invoice, LineItem, InvoiceCategory, ConstructionInfo, PlumbingInfo, ElectricalInfo, HVACInfo, RoofingInfo, LandscapingInfo, CleaningInfo, AutoRepairInfo, ITFreelanceInfo } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { DatePicker } from '@/components/ui/datepicker';
import { ImageUp, Plus, Trash2, Palette, X, Mail, Truck, Hash, Wallet, Phone, PaintBucket, Paintbrush, Type, Package, Hammer, Ruler, ListTree, CheckSquare, Sparkles, Calendar, TextQuote, Wind, Thermometer, Wrench, Zap, Trees, Droplets, Car, Code, DraftingCompass, Pencil } from 'lucide-react';
import Image from 'next/image';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from './ui/checkbox';
import { RadioGroup, RadioGroupItem } from './ui/radio-group';


interface InvoiceFormProps {
  invoice: Invoice;
  setInvoice: Dispatch<SetStateAction<Invoice>>;
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
]

const fonts = [
    { value: 'Inter', label: 'Inter' },
    { value: 'Roboto', label: 'Roboto' },
    { value: 'Lato', label: 'Lato' },
    { value: 'Merriweather', label: 'Merriweather' },
    { value: 'system-ui', label: 'System Default' },
]

const categories: InvoiceCategory[] = [
    "General Services",
    "Construction",
    "Plumbing",
    "Electrical Services",
    "HVAC Services",
    "Roofing",
    "Landscaping & Lawn Care",
    "Cleaning Services",
    "Freelance / Digital Services",
    "Consulting",
    "Legal Services",
    "Medical / Healthcare",
    "Auto Repair",
    "E-commerce / Online Store",
    "Rental / Property",
];

const CustomSelect = ({ value, onValueChange, options, placeholder, name }: { value: string; onValueChange: (name: string, value: string) => void; options: string[]; placeholder?: string; name: string; }) => {
    const [isOther, setIsOther] = useState(false);
    const [otherValue, setOtherValue] = useState('');

    useEffect(() => {
        const isValueInOptions = options.includes(value);
        if (value && !isValueInOptions) {
            setIsOther(true);
            setOtherValue(value);
        } else {
            setIsOther(false);
            setOtherValue('');
        }
    }, [value, options]);

    const handleSelectChange = (newValue: string) => {
        if (newValue === 'Other') {
            setIsOther(true);
            onValueChange(name, otherValue);
        } else {
            setIsOther(false);
            onValueChange(name, newValue);
        }
    };
    
    const handleOtherInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setOtherValue(e.target.value);
        onValueChange(name, e.target.value);
    }

    return (
        <div className="space-y-2">
            <Select value={isOther ? 'Other' : value} onValueChange={handleSelectChange}>
                <SelectTrigger>
                    <SelectValue placeholder={placeholder} />
                </SelectTrigger>
                <SelectContent>
                    {options.map((option, index) => <SelectItem key={`${name}-${option}-${index}`} value={option}>{option}</SelectItem>)}
                    <SelectItem value="Other">Other (Please specify)</SelectItem>
                </SelectContent>
            </Select>
            {isOther && (
                <Input
                    type="text"
                    name={name}
                    value={otherValue}
                    onChange={handleOtherInputChange}
                    placeholder="Specify other value"
                    className="mt-2"
                />
            )}
        </div>
    );
};


export function InvoiceForm({ invoice, setInvoice, accentColor, setAccentColor, backgroundColor, setBackgroundColor, textColor, setTextColor, toast }: InvoiceFormProps) {
  const [bulkAddCount, setBulkAddCount] = useState(10);
  const [accentColorInput, setAccentColorInput] = useState(accentColor);
  const [bgColorInput, setBgColorInput] = useState(backgroundColor);
  const [textColorInput, setTextColorInput] = useState(textColor);
  const [logoUrl, setLogoUrl] = useState<string | null>(invoice.business.logoUrl || null);
  const [cleaningAddOns, setCleaningAddOns] = useState<string[]>(invoice.cleaning?.addOns || []);
  
  useEffect(() => {
    setAccentColorInput(accentColor);
  }, [accentColor]);

  useEffect(() => {
    setBgColorInput(backgroundColor);
  }, [backgroundColor]);
  
  useEffect(() => {
    setTextColorInput(textColor);
  }, [textColor]);

  useEffect(() => {
    if (logoUrl !== invoice.business.logoUrl) {
      setInvoice(prev => ({
          ...prev,
          business: {
              ...prev.business,
              logoUrl: logoUrl || '',
          }
      }))
    }
  }, [logoUrl, setInvoice, invoice.business.logoUrl]);

  useEffect(() => {
     setInvoice(prev => ({ ...prev, backgroundColor: backgroundColor }));
  }, [backgroundColor, setInvoice]);

  useEffect(() => {
    setInvoice(prev => ({ ...prev, textColor: textColor }));
 }, [textColor, setInvoice]);

  const handleNestedChange = (section: 'business' | 'client' | 'summary', e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setInvoice(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [name]: value
      }
    }));
  };

  const handleCategoryDataChange = (category: 'construction' | 'plumbing' | 'electrical' | 'hvac' | 'roofing' | 'landscaping' | 'cleaning' | 'autoRepair' | 'freelance', e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    const isCheckbox = type === 'checkbox';
    
    setInvoice(prev => ({
        ...prev,
        [category]: {
            ...prev[category]!,
            [name]: isCheckbox ? (e.target as HTMLInputElement).checked : value
        }
    }));
  };

   const handleCategorySelectChange = (category: 'construction' | 'plumbing' | 'electrical' | 'hvac' | 'roofing' | 'landscaping' | 'cleaning' | 'autoRepair' | 'freelance', name: string, value: string | boolean | number | null) => {
     setInvoice(prev => ({
        ...prev,
        [category]: {
            ...prev[category]!,
            [name]: value
        }
    }));
  };
  
    const handleRemodelingDateChange = (name: keyof ConstructionInfo, date: Date | undefined) => {
     setInvoice(prev => ({
        ...prev,
        construction: {
            ...prev.construction!,
            [name]: date
        }
    }));
  };

  const handleCleaningAddOnChange = (addOn: string, checked: boolean) => {
    const currentAddOns = invoice.cleaning?.addOns || [];
    const newAddOns = checked
      ? [...currentAddOns, addOn]
      : currentAddOns.filter(item => item !== addOn);
    setCleaningAddOns(newAddOns);
    setInvoice(prev => ({
      ...prev,
      cleaning: {
        ...prev.cleaning!,
        addOns: newAddOns
      }
    }));
  }

  const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setInvoice(prev => ({ ...prev, [name]: value }));
  };
  
  const handleCurrencyChange = (value: string) => {
    setInvoice(prev => ({ ...prev, currency: value }));
  }

  const handleLanguageChange = (value: string) => {
    setInvoice(prev => ({ ...prev, language: value }));
  };

  const handleNumberChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const [section, field] = name.split('.');
    if (section === 'summary') {
        setInvoice(prev => ({
        ...prev,
        [section as 'summary']: {
            ...prev[section as 'summary'],
            [field]: parseFloat(value) || 0,
        }
        }));
    } else {
        setInvoice(prev => ({ ...prev, [name]: parseFloat(value) || 0 }));
    }
  }

  const handleItemChange = (index: number, field: keyof Omit<LineItem, 'id'>, value: string | number | boolean) => {
    const newItems = [...invoice.lineItems];
    (newItems[index] as any)[field] = value;
    setInvoice(prev => ({ ...prev, lineItems: newItems }));
  };

  const addItem = () => {
     if (invoice.lineItems.length >= 50) {
       toast({
        title: "Item Limit Reached",
        description: "You cannot add more than 50 items to a single invoice.",
        variant: "destructive",
      });
      return;
    }
    setInvoice(prev => ({
      ...prev,
      lineItems: [...prev.lineItems, { id: crypto.randomUUID(), name: '', quantity: 1, unitPrice: 0, taxable: true }],
    }));
  };
  
  const handleBulkAddItem = () => {
    const count = Number(bulkAddCount);
    if (count <= 0) return;

    if (invoice.lineItems.length + count > 50) {
      toast({
        title: "Item Limit Exceeded",
        description: `You can only add ${50 - invoice.lineItems.length} more items. The maximum is 50.`,
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

    setInvoice(prev => ({
      ...prev,
      lineItems: [...prev.lineItems, ...newItems],
    }));
  };

  const removeItem = (index: number) => {
    const newItems = invoice.lineItems.filter((_, i) => i !== index);
    setInvoice(prev => ({ ...prev, lineItems: newItems }));
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
  
  const currencySymbol = currencies.find(c => c.value === invoice.currency)?.label.split(' ')[1] || '$';

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
                        value={accentColorInput} 
                        onChange={(e) => setAccentColorInput(e.target.value)}
                        onBlur={(e) => setAccentColor(e.target.value)}
                        className="pl-10"
                        placeholder="hsl(260 85% 66%)"
                    />
                    <input 
                        type="color" 
                        value={accentColor.startsWith('hsl') ? '#000000' : accentColor}
                        onChange={(e) => {
                            setAccentColor(e.target.value);
                            setAccentColorInput(e.target.value);
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
                        value={bgColorInput} 
                        onChange={(e) => setBgColorInput(e.target.value)}
                        onBlur={(e) => setBackgroundColor(e.target.value)}
                        className="pl-10"
                        placeholder="#FFFFFF"
                    />
                    <input 
                        type="color" 
                        value={backgroundColor}
                        onChange={(e) => {
                            setBackgroundColor(e.target.value);
                            setBgColorInput(e.target.value);
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
                        value={textColorInput} 
                        onChange={(e) => setTextColorInput(e.target.value)}
                        onBlur={(e) => setTextColor(e.target.value)}
                        className="pl-10"
                        placeholder="#374151"
                    />
                    <input 
                        type="color" 
                        value={textColor}
                        onChange={(e) => {
                            setTextColor(e.target.value);
                            setTextColorInput(e.target.value);
                        }}
                        className="absolute right-1 top-1/2 -translate-y-1/2 h-8 w-8 p-1 rounded-md cursor-pointer bg-transparent border-none appearance-none"
                    />
                </div>
            </div>
             <div className="space-y-2">
                <Label htmlFor="fontFamily">Font Family</Label>
                <Select value={invoice.fontFamily} onValueChange={(value) => setInvoice(p => ({...p, fontFamily: value}))}>
                    <SelectTrigger id="fontFamily">
                        <SelectValue placeholder="Select font" />
                    </SelectTrigger>
                    <SelectContent>
                        {fonts.map(font => <SelectItem key={font.value} value={font.value}>{font.label}</SelectItem>)}
                    </SelectContent>
                </Select>
            </div>
             <div className="space-y-2">
                <Label htmlFor="fontSize">Font Size</Label>
                <div className="relative flex items-center">
                    <Type className="absolute left-3 h-5 w-5 text-muted-foreground" />
                    <Input id="fontSize" name="fontSize" type="number" value={invoice.fontSize} onChange={(e) => setInvoice(p => ({...p, fontSize: Number(e.target.value) || 14}))} className="pl-10" />
                </div>
            </div>
        </CardContent>
      </Card>
      
      <Card className="bg-card/50 backdrop-blur-sm">
        <CardHeader>
          <CardTitle>Bill From</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="businessName">Business Name</Label>
            <Input id="businessName" name="name" value={invoice.business.name} onChange={(e) => handleNestedChange('business', e)} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="businessAddress">Business Address</Label>
            <Textarea id="businessAddress" name="address" value={invoice.business.address} onChange={(e) => handleNestedChange('business', e)} />
          </div>
        </CardContent>
      </Card>

      <Card className="bg-card/50 backdrop-blur-sm">
        <CardHeader>
          <CardTitle>Bill To</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="clientName">Client Name</Label>
            <Input id="clientName" name="name" value={invoice.client.name} onChange={(e) => handleNestedChange('client', e)} />
          </div>
           <div className="space-y-2">
            <Label htmlFor="clientEmail">Client Email</Label>
            <div className="relative flex items-center">
                <Mail className="absolute left-3 h-5 w-5 text-muted-foreground" />
                <Input id="clientEmail" name="email" value={invoice.client.email || ''} onChange={(e) => handleNestedChange('client', e)} className="pl-10" placeholder="client@example.com" />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="clientAddress">Billing Address</Label>
            <Textarea id="clientAddress" name="address" value={invoice.client.address} onChange={(e) => handleNestedChange('client', e)} />
          </div>
        </CardContent>
      </Card>
      
      <Card className="bg-card/50 backdrop-blur-sm">
        <CardHeader>
          <CardTitle>Invoice Details</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2 md:col-span-2">
            <Label htmlFor="category">Invoice Category</Label>
            <div className="relative flex items-center">
                <Package className="absolute left-3 h-5 w-5 text-muted-foreground z-10" />
                <Select
                    value={invoice.category}
                    onValueChange={(value: InvoiceCategory) => setInvoice(p => ({ ...p, category: value }))}
                >
                    <SelectTrigger id="category" className="pl-10">
                        <SelectValue placeholder="Select a business category" />
                    </SelectTrigger>
                    <SelectContent>
                        {categories.map((cat, index) => <SelectItem key={`${cat}-${index}`} value={cat}>{cat}</SelectItem>)}
                    </SelectContent>
                </Select>
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="invoiceNumber">Invoice Number</Label>
            <Input id="invoiceNumber" name="invoiceNumber" value={invoice.invoiceNumber} onChange={handleInputChange} />
          </div>
          <div className="space-y-2">
            <Label>Invoice Date</Label>
            <DatePicker date={invoice.invoiceDate} setDate={(date) => setInvoice(p => ({ ...p, invoiceDate: date! }))} />
          </div>
          <div className="space-y-2">
            <Label>Due Date</Label>
            <DatePicker date={invoice.dueDate} setDate={(date) => setInvoice(p => ({ ...p, dueDate: date! }))} />
          </div>
           <div className="space-y-2">
                <Label htmlFor="currency">Currency</Label>
                <Select value={invoice.currency} onValueChange={handleCurrencyChange}>
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
                <Label htmlFor="language">Invoice Language</Label>
                <Select value={invoice.language} onValueChange={handleLanguageChange}>
                    <SelectTrigger id="language">
                        <SelectValue placeholder="Select language" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="en">English</SelectItem>
                        <SelectItem value="ur">Urdu</SelectItem>
                    </SelectContent>
                </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="poNumber">PO Number</Label>
                <div className="relative flex items-center">
                  <Hash className="absolute left-3 h-5 w-5 text-muted-foreground" />
                  <Input id="poNumber" name="poNumber" value={invoice.poNumber || ''} onChange={handleInputChange} className="pl-10" />
              </div>
            </div>
        </CardContent>
      </Card>
      
        {invoice.category === "Construction" && invoice.construction && (
            <Card className="bg-card/50 backdrop-blur-sm">
                <CardHeader>
                    <CardTitle>Construction Details</CardTitle>
                </CardHeader>
                <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <Label htmlFor="projectType">Project Type</Label>
                         <Input id="projectType" name="projectType" value={invoice.construction.projectType} onChange={(e) => handleCategoryDataChange('construction', e)} placeholder="e.g. New Build, Renovation" />
                    </div>
                     <div className="space-y-2">
                        <Label htmlFor="squareFootage">Square Footage</Label>
                        <Input id="squareFootage" name="squareFootage" type="number" value={invoice.construction.squareFootage ?? ''} onChange={(e) => handleCategoryDataChange('construction', e)} />
                    </div>
                </CardContent>
            </Card>
        )}

        {invoice.category === "Plumbing" && invoice.plumbing && (
             <Card className="bg-card/50 backdrop-blur-sm">
                <CardHeader>
                    <CardTitle>Plumbing Job Details</CardTitle>
                </CardHeader>
                <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <Label>Service Type</Label>
                        <Input name="serviceType" value={invoice.plumbing.serviceType} onChange={(e) => handleCategoryDataChange('plumbing', e)} placeholder="e.g., Leak Repair, Installation" />
                    </div>
                </CardContent>
            </Card>
        )}

      <Card className="bg-card/50 backdrop-blur-sm">
        <CardHeader>
          <CardTitle>Items</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="hidden md:grid md:grid-cols-[1fr_auto_auto_auto_auto] gap-4 text-sm font-medium text-muted-foreground">
            <Label>Item Name</Label>
            <Label>Quantity</Label>
            <Label>Unit Price</Label>
            <Label>Subtotal</Label>
            <span></span>
          </div>
          {invoice.lineItems.map((item, index) => (
            <div key={item.id} className="grid grid-cols-1 md:grid-cols-[1fr_auto_auto_auto_auto] gap-4 md:gap-2 items-start border-b pb-4">
              <div className="space-y-2 md:col-span-1">
                <Label htmlFor={`itemName-${index}`} className="md:hidden">Item Name</Label>
                <Textarea id={`itemName-${index}`} value={item.name} onChange={(e) => handleItemChange(index, 'name', e.target.value)} rows={1} className="min-h-0"/>
              </div>
              <div className="grid grid-cols-2 md:contents gap-4">
                <div className="space-y-2">
                  <Label htmlFor={`itemQuantity-${index}`} className="md:hidden">Quantity</Label>
                  <Input id={`itemQuantity-${index}`} type="number" value={item.quantity} onChange={(e) => handleItemChange(index, 'quantity', parseFloat(e.target.value) || 0)} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor={`itemRate-${index}`} className="md:hidden">Unit Price</Label>
                  <Input id={`itemRate-${index}`} type="number" value={item.unitPrice || 0} onChange={(e) => handleItemChange(index, 'unitPrice', parseFloat(e.target.value) || 0)} />
                </div>
              </div>

              <div className="flex items-center h-10">
                <p className="font-medium tabular-nums text-sm">{currencySymbol}{(item.quantity * (item.unitPrice || 0)).toFixed(2)}</p>
              </div>
              <div className="flex items-center h-10 justify-end">
                <Button variant="ghost" size="icon" onClick={() => removeItem(index)}>
                  <Trash2 className="h-4 w-4 text-destructive" />
                </Button>
              </div>
            </div>
          ))}
          <div className="flex flex-wrap items-end gap-4 pt-4 border-t">
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

      <Card className="bg-card/50 backdrop-blur-sm">
        <CardHeader>
          <CardTitle>Totals &amp; Notes</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="tax">Tax (%)</Label>
              <Input id="tax" name="summary.taxPercentage" type="number" value={invoice.summary.taxPercentage} onChange={handleNumberChange} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="discount">Discount (Fixed Amount)</Label>
              <Input id="discount" name="summary.discount" type="number" value={invoice.summary.discount} onChange={handleNumberChange} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="shippingCost">Shipping Cost</Label>
              <div className="relative flex items-center">
                  <Truck className="absolute left-3 h-5 w-5 text-muted-foreground" />
                  <Input id="shippingCost" name="summary.shippingCost" type="number" value={invoice.summary.shippingCost} onChange={handleNumberChange} className="pl-10"/>
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="amountPaid">Amount Paid</Label>
                <div className="relative flex items-center">
                  <Wallet className="absolute left-3 h-5 w-5 text-muted-foreground" />
                  <Input id="amountPaid" name="amountPaid" type="number" value={invoice.amountPaid || 0} onChange={(e) => setInvoice(p => ({...p, amountPaid: parseFloat(e.target.value) || 0}))} className="pl-10"/>
              </div>
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="paymentInstructions">Payment Instructions / Notes</Label>
            <Textarea id="paymentInstructions" name="paymentInstructions" value={invoice.paymentInstructions} onChange={handleInputChange} />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
