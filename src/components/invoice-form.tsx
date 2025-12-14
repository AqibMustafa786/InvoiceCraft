
'use client';

import { ChangeEvent, Dispatch, SetStateAction, useState, useEffect } from 'react';
import type { Invoice, LineItem, InvoiceCategory } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { DatePicker } from '@/components/ui/datepicker';
import { ImageUp, Plus, Trash2, Palette, X, Mail, Truck, Hash, Wallet, Phone, Globe, Briefcase, Award, User, FileText, Building, Pencil, Type, Package, Hammer, Ruler, ListTree, CheckSquare, Sparkles, Calendar, TextQuote, Wind, Thermometer, Wrench, Zap, Trees, Droplets, Car, Code, DraftingCompass, PaintBucket, Paintbrush, Receipt, Scale, Hospital, HeartPulse, HardHat, Save } from 'lucide-react';
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
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger, DialogFooter, DialogClose } from './ui/dialog';
import { SignaturePad } from './signature-pad';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";


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

interface Preset {
  name: string;
  items: Omit<LineItem, 'id'>[];
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
    "Freelance / Agency",
    "Consulting",
    "Legal Services",
    "Medical / Healthcare",
    "Auto Repair",
    "E-commerce / Online Store",
    "Retail / Wholesale",
    "Photography",
    "Real Estate / Property Management",
    "Transportation / Trucking",
    "IT Services / Tech Support",
    "Rental / Property",
];

const plumbingServiceTypes = ["Leak Repair", "Installation", "Sewer Line", "Water Heater", "Drain Cleaning"];
const hvacServiceTypes = ["Install", "Repair", "Replace", "Maintenance"];
const roofMaterials = ["Shingle", "Metal", "Tile", "Flat Roof"];

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
  const [isSignatureDialogOpen, setIsSignatureDialogOpen] = useState(false);
  const [presets, setPresets] = useState<Preset[]>([]);
  const [selectedPreset, setSelectedPreset] = useState<string>('');
  const [isSavePresetOpen, setIsSavePresetOpen] = useState(false);
  const [newPresetName, setNewPresetName] = useState('');

  // Load presets from localStorage on mount
  useEffect(() => {
    try {
      const savedPresets = localStorage.getItem('lineItemPresets');
      if (savedPresets) {
        setPresets(JSON.parse(savedPresets));
      }
    } catch (error) {
      console.error("Could not load presets from localStorage", error);
    }
  }, []);
  
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

  const handleCategoryDataChange = (category: keyof Invoice, e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    const isCheckbox = type === 'checkbox';
    
    setInvoice(prev => ({
        ...prev,
        [category]: {
            ...(prev as any)[category],
            [name]: isCheckbox ? (e.target as HTMLInputElement).checked : (type === 'number' ? parseFloat(value) || null : value)
        }
    }));
  };

   const handleCategorySelectChange = (category: keyof Invoice, name: string, value: string | boolean | number | null) => {
     setInvoice(prev => ({
        ...prev,
        [category]: {
            ...(prev as any)[category],
            [name]: value
        }
    }));
  };
  
  const handleDateChange = (category: keyof Invoice, name: string, date: Date | undefined) => {
      setInvoice(prev => ({
          ...prev,
          [category]: {
              ...(prev as any)[category],
              [name]: date
          }
      }));
  };


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
      lineItems: [...prev.lineItems, { id: crypto.randomUUID(), name: '', quantity: 1, unitPrice: 0, taxable: false }],
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
      taxable: false,
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
  
  const handleOwnerSignatureSave = (image: string, signerName: string) => {
    setInvoice(prev => ({
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
    const { ownerSignature, ...businessRest } = invoice.business;
    setInvoice(prev => ({
      ...prev,
      business: {
        ...businessRest
      }
    }));
  };

  const handleSavePreset = () => {
    if (!newPresetName.trim()) {
      toast({ title: 'Preset Name Required', description: 'Please enter a name for your preset.', variant: 'destructive' });
      return;
    }
    const newPreset: Preset = {
      name: newPresetName.trim(),
      items: invoice.lineItems.map(({ id, ...item }) => item), // Exclude IDs
    };
    const updatedPresets = [...presets, newPreset];
    setPresets(updatedPresets);
    localStorage.setItem('lineItemPresets', JSON.stringify(updatedPresets));
    toast({ title: 'Preset Saved', description: `"${newPreset.name}" has been saved.` });
    setIsSavePresetOpen(false);
    setNewPresetName('');
  };

  const handleLoadPreset = () => {
    if (!selectedPreset) return;
    const preset = presets.find(p => p.name === selectedPreset);
    if (preset) {
      const newItems = preset.items.map(item => ({ ...item, id: crypto.randomUUID() }));
      setInvoice(prev => ({ ...prev, lineItems: [...prev.lineItems, ...newItems] }));
      toast({ title: 'Preset Loaded', description: `Items from "${preset.name}" have been added.` });
    }
  };

  const handleDeletePreset = () => {
    if (!selectedPreset) return;
    const updatedPresets = presets.filter(p => p.name !== selectedPreset);
    setPresets(updatedPresets);
    localStorage.setItem('lineItemPresets', JSON.stringify(updatedPresets));
    toast({ title: 'Preset Deleted', description: `"${selectedPreset}" has been deleted.` });
    setSelectedPreset(''); // Clear selection
  };

  const currencySymbol = currencies.find(c => c.value === invoice.currency)?.label.split(' ')[1] || '$';

  return (
    <div className="space-y-6">
      <Card className="bg-card/50 backdrop-blur-sm shadow-lg hover:shadow-primary/20 transition-shadow duration-300">
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
        </CardContent>
      </Card>
      
      <Card className="bg-card/50 backdrop-blur-sm shadow-lg hover:shadow-primary/20 transition-shadow duration-300">
        <CardHeader>
          <CardTitle>Bill From</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="businessName">Business Name</Label>
              <div className="relative flex items-center">
                  <Briefcase className="absolute left-3 h-5 w-5 text-muted-foreground" />
                  <Input id="businessName" name="name" autoComplete="off" value={invoice.business.name} onChange={(e) => handleNestedChange('business', e)} className="pl-10" />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="businessAddress">Business Address</Label>
              <Textarea id="businessAddress" name="address" autoComplete="off" value={invoice.business.address} onChange={(e) => handleNestedChange('business', e)} placeholder="Street, City, State, Zip"/>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                 <div className="space-y-2">
                    <Label htmlFor="businessPhone">Phone Number</Label>
                    <div className="relative flex items-center">
                        <Phone className="absolute left-3 h-5 w-5 text-muted-foreground" />
                        <Input id="businessPhone" name="phone" autoComplete="off" value={invoice.business.phone} onChange={(e) => handleNestedChange('business', e)} className="pl-10" />
                    </div>
                </div>
                <div className="space-y-2">
                    <Label htmlFor="businessEmail">Email Address</Label>
                    <div className="relative flex items-center">
                        <Mail className="absolute left-3 h-5 w-5 text-muted-foreground" />
                        <Input id="businessEmail" name="email" autoComplete="off" value={invoice.business.email} onChange={(e) => handleNestedChange('business', e)} className="pl-10" />
                    </div>
                </div>
                 <div className="space-y-2">
                    <Label htmlFor="businessWebsite">Website (optional)</Label>
                    <div className="relative flex items-center">
                        <Globe className="absolute left-3 h-5 w-5 text-muted-foreground" />
                        <Input id="businessWebsite" name="website" autoComplete="off" value={invoice.business.website} onChange={(e) => handleNestedChange('business', e)} className="pl-10" />
                    </div>
                </div>
                 <div className="space-y-2">
                    <Label htmlFor="businessLicense">License Number (optional)</Label>
                     <div className="relative flex items-center">
                        <Award className="absolute left-3 h-5 w-5 text-muted-foreground" />
                        <Input id="businessLicense" name="licenseNumber" autoComplete="off" value={invoice.business.licenseNumber} onChange={(e) => handleNestedChange('business', e)} className="pl-10" />
                    </div>
                </div>
                <div className="space-y-2 md:col-span-2">
                    <Label htmlFor="businessTaxId">Tax ID / EIN (optional)</Label>
                     <div className="relative flex items-center">
                        <Hash className="absolute left-3 h-5 w-5 text-muted-foreground" />
                        <Input id="businessTaxId" name="taxId" autoComplete="off" value={invoice.business.taxId ?? ''} onChange={(e) => handleNestedChange('business', e)} className="pl-10" />
                    </div>
                </div>
            </div>
        </CardContent>
      </Card>

      <Card className="bg-card/50 backdrop-blur-sm shadow-lg hover:shadow-primary/20 transition-shadow duration-300">
        <CardHeader>
          <CardTitle>Bill To</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="clientName">Client Name</Label>
             <div className="relative flex items-center">
                <User className="absolute left-3 h-5 w-5 text-muted-foreground" />
                <Input id="clientName" name="name" value={invoice.client.name} onChange={(e) => handleNestedChange('client', e)} className="pl-10" />
            </div>
          </div>
           <div className="space-y-2">
            <Label htmlFor="clientEmail">Client Email</Label>
            <div className="relative flex items-center">
                <Mail className="absolute left-3 h-5 w-5 text-muted-foreground" />
                <Input id="clientEmail" name="email" value={invoice.client.email || ''} onChange={(e) => handleNestedChange('client', e)} className="pl-10" placeholder="client@example.com" />
            </div>
          </div>
           <div className="space-y-2">
                <Label htmlFor="clientPhone">Client Phone</Label>
                <div className="relative flex items-center">
                    <Phone className="absolute left-3 h-5 w-5 text-muted-foreground" />
                    <Input id="clientPhone" name="phone" value={invoice.client.phone || ''} onChange={(e) => handleNestedChange('client', e)} className="pl-10" />
                </div>
            </div>
          <div className="space-y-2">
            <Label htmlFor="clientAddress">Billing Address</Label>
            <Textarea id="clientAddress" name="address" value={invoice.client.address} onChange={(e) => handleNestedChange('client', e)} />
          </div>
           <div className="space-y-2">
            <Label htmlFor="shippingAddress">Shipping Address (if different)</Label>
            <Textarea id="shippingAddress" name="shippingAddress" value={invoice.client.shippingAddress || ''} onChange={(e) => handleNestedChange('client', e)} />
          </div>
        </CardContent>
      </Card>
      
      <Card className="bg-card/50 backdrop-blur-sm shadow-lg hover:shadow-primary/20 transition-shadow duration-300">
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
                        {languages.map(lang => (
                            <SelectItem key={lang.value} value={lang.value}>{lang.label}</SelectItem>
                        ))}
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
            <Card className="bg-card/50 backdrop-blur-sm shadow-lg hover:shadow-primary/20 transition-shadow duration-300">
                <CardHeader><CardTitle>Construction Details</CardTitle></CardHeader>
                <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2 md:col-span-2"><Label>Job Site Address</Label><Input name="jobSiteAddress" value={invoice.construction.jobSiteAddress || ''} onChange={(e) => handleCategoryDataChange('construction', e)}/></div>
                    <div className="space-y-2"><Label>Permit #</Label><Input name="permitNumber" value={invoice.construction.permitNumber || ''} onChange={(e) => handleCategoryDataChange('construction', e)}/></div>
                    <div className="space-y-2"><Label>Labor Rate (/hr)</Label><Input type="number" name="laborRate" value={invoice.construction.laborRate || ''} onChange={(e) => handleCategoryDataChange('construction', e)}/></div>
                    <div className="space-y-2"><Label>Equipment Rental Fees</Label><Input type="number" name="equipmentRentalFees" value={invoice.construction.equipmentRentalFees || ''} onChange={(e) => handleCategoryDataChange('construction', e)}/></div>
                    <div className="space-y-2"><Label>Waste Disposal Fee</Label><Input type="number" name="wasteDisposalFee" value={invoice.construction.wasteDisposalFee || ''} onChange={(e) => handleCategoryDataChange('construction', e)}/></div>
                    <div className="space-y-2"><Label>Project Start Date</Label><DatePicker date={invoice.construction.projectStartDate} setDate={(date) => handleDateChange('construction', 'projectStartDate', date)} /></div>
                    <div className="space-y-2"><Label>Project End Date</Label><DatePicker date={invoice.construction.projectEndDate} setDate={(date) => handleDateChange('construction', 'projectEndDate', date)} /></div>
                </CardContent>
            </Card>
        )}
        
        {invoice.category === "Roofing" && invoice.roofing && (
            <Card className="bg-card/50 backdrop-blur-sm shadow-lg hover:shadow-primary/20 transition-shadow duration-300">
                <CardHeader><CardTitle>Roofing Job Details</CardTitle></CardHeader>
                <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2"><Label>Roof Type</Label><CustomSelect name="roofType" value={invoice.roofing.roofType || ''} onValueChange={(name, value) => handleCategorySelectChange('roofing', name, value)} options={roofMaterials} placeholder="Select roof type"/></div>
                    <div className="space-y-2"><Label>Square Footage</Label><Input name="squareFootage" type="number" value={invoice.roofing.squareFootage || ''} onChange={(e) => handleCategoryDataChange('roofing', e)}/></div>
                    <div className="space-y-2"><Label>Pitch / Slope</Label><Input name="pitch" value={invoice.roofing.pitch || ''} onChange={(e) => handleCategoryDataChange('roofing', e)}/></div>
                    <div className="space-y-2"><Label>Underlayment Type</Label><Input name="underlaymentType" value={invoice.roofing.underlaymentType || ''} onChange={(e) => handleCategoryDataChange('roofing', e)}/></div>
                    <div className="space-y-2"><Label>Dumpster / Cleanup Fee</Label><Input name="dumpsterFee" type="number" value={invoice.roofing.dumpsterFee || ''} onChange={(e) => handleCategoryDataChange('roofing', e)}/></div>
                    <div className="flex items-center space-x-2 pt-6"><Checkbox id="tearOffRequired" name="tearOffRequired" checked={invoice.roofing.tearOffRequired} onCheckedChange={(c) => handleCategorySelectChange('roofing', 'tearOffRequired', !!c)} /><Label htmlFor="tearOffRequired">Tear-off Required?</Label></div>
                </CardContent>
            </Card>
        )}

        {invoice.category === "Plumbing" && invoice.plumbing && (
            <Card className="bg-card/50 backdrop-blur-sm shadow-lg hover:shadow-primary/20 transition-shadow duration-300">
                <CardHeader><CardTitle>Plumbing Job Details</CardTitle></CardHeader>
                <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2"><Label>Service Type</Label><CustomSelect name="serviceType" value={invoice.plumbing.serviceType || ''} onValueChange={(name, value) => handleCategorySelectChange('plumbing', name, value)} options={plumbingServiceTypes} placeholder="Select service type"/></div>
                    <div className="space-y-2"><Label>Pipe Material</Label><Input name="pipeMaterial" value={invoice.plumbing.pipeMaterial || ''} onChange={(e) => handleCategoryDataChange('plumbing', e)} placeholder="e.g., PVC, Copper"/></div>
                    <div className="space-y-2"><Label>Fixture Name</Label><Input name="fixtureName" value={invoice.plumbing.fixtureName || ''} onChange={(e) => handleCategoryDataChange('plumbing', e)} placeholder="e.g., Kitchen Sink"/></div>
                    <div className="space-y-2"><Label>Emergency Fee</Label><Input name="emergencyFee" type="number" value={invoice.plumbing.emergencyFee || ''} onChange={(e) => handleCategoryDataChange('plumbing', e)}/></div>
                </CardContent>
            </Card>
        )}

        {invoice.category === "Electrical Services" && invoice.electrical && (
            <Card className="bg-card/50 backdrop-blur-sm shadow-lg hover:shadow-primary/20 transition-shadow duration-300">
                <CardHeader><CardTitle>Electrical Job Details</CardTitle></CardHeader>
                <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2"><Label>Service Type</Label><Input name="serviceType" value={invoice.electrical.serviceType || ''} onChange={(e) => handleCategoryDataChange('electrical', e)} placeholder="e.g., Wiring, Panel Upgrade"/></div>
                    <div className="space-y-2"><Label>Voltage/Amperage</Label><Input name="voltage" value={invoice.electrical.voltage || ''} onChange={(e) => handleCategoryDataChange('electrical', e)} placeholder="e.g., 120V/20A"/></div>
                    <div className="space-y-2"><Label>Fixture/Device Installed</Label><Input name="fixtureDevice" value={invoice.electrical.fixtureDevice || ''} onChange={(e) => handleCategoryDataChange('electrical', e)}/></div>
                    <div className="space-y-2"><Label>Permit Cost</Label><Input name="permitCost" type="number" value={invoice.electrical.permitCost || ''} onChange={(e) => handleCategoryDataChange('electrical', e)}/></div>
                </CardContent>
            </Card>
        )}

        {invoice.category === "HVAC Services" && invoice.hvac && (
            <Card className="bg-card/50 backdrop-blur-sm shadow-lg hover:shadow-primary/20 transition-shadow duration-300">
                <CardHeader><CardTitle>HVAC Service Details</CardTitle></CardHeader>
                <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2"><Label>Unit Type</Label><CustomSelect name="unitType" value={invoice.hvac.unitType || ''} onValueChange={(name, value) => handleCategorySelectChange('hvac', name, value)} options={hvacServiceTypes} placeholder="Select unit type"/></div>
                    <div className="space-y-2"><Label>Model Number</Label><Input name="modelNumber" value={invoice.hvac.modelNumber || ''} onChange={(e) => handleCategoryDataChange('hvac', e)}/></div>
                    <div className="space-y-2"><Label>Refrigerant Type</Label><Input name="refrigerantType" value={invoice.hvac.refrigerantType || ''} onChange={(e) => handleCategoryDataChange('hvac', e)}/></div>
                    <div className="space-y-2"><Label>Seasonal Maintenance Fee</Label><Input name="maintenanceFee" type="number" value={invoice.hvac.maintenanceFee || ''} onChange={(e) => handleCategoryDataChange('hvac', e)}/></div>
                </CardContent>
            </Card>
        )}

        {invoice.category === "Landscaping & Lawn Care" && invoice.landscaping && (
            <Card className="bg-card/50 backdrop-blur-sm shadow-lg hover:shadow-primary/20 transition-shadow duration-300">
                <CardHeader><CardTitle>Landscaping Service Details</CardTitle></CardHeader>
                <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2"><Label>Lawn Square Footage</Label><Input name="lawnSquareFootage" type="number" value={invoice.landscaping.lawnSquareFootage || ''} onChange={(e) => handleCategoryDataChange('landscaping', e)}/></div>
                    <div className="space-y-2"><Label>Service Type</Label><Input name="serviceType" value={invoice.landscaping.serviceType || ''} onChange={(e) => handleCategoryDataChange('landscaping', e)} placeholder="e.g., Mowing, Fertilizing"/></div>
                    <div className="space-y-2"><Label>Equipment Fee</Label><Input name="equipmentFee" type="number" value={invoice.landscaping.equipmentFee || ''} onChange={(e) => handleCategoryDataChange('landscaping', e)}/></div>
                    <div className="space-y-2"><Label>Disposal/Hauling Fee</Label><Input name="disposalFee" type="number" value={invoice.landscaping.disposalFee || ''} onChange={(e) => handleCategoryDataChange('landscaping', e)}/></div>
                </CardContent>
            </Card>
        )}

        {invoice.category === "Cleaning Services" && invoice.cleaning && (
            <Card className="bg-card/50 backdrop-blur-sm shadow-lg hover:shadow-primary/20 transition-shadow duration-300">
                <CardHeader><CardTitle>Cleaning Service Details</CardTitle></CardHeader>
                <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2"><Label>Cleaning Type</Label><Input name="cleaningType" value={invoice.cleaning.cleaningType || ''} onChange={(e) => handleCategoryDataChange('cleaning', e)} placeholder="e.g., Home, Office"/></div>
                    <div className="space-y-2"><Label>Number of Rooms</Label><Input name="numberOfRooms" type="number" value={invoice.cleaning.numberOfRooms || ''} onChange={(e) => handleCategoryDataChange('cleaning', e)}/></div>
                    <div className="space-y-2"><Label>Square Footage</Label><Input name="squareFootage" type="number" value={invoice.cleaning.squareFootage || ''} onChange={(e) => handleCategoryDataChange('cleaning', e)}/></div>
                    <div className="space-y-2"><Label>Supplies Fee</Label><Input name="suppliesFee" type="number" value={invoice.cleaning.suppliesFee || ''} onChange={(e) => handleCategoryDataChange('cleaning', e)}/></div>
                    <div className="space-y-2"><Label>Recurring Schedule</Label><Input name="recurringSchedule" value={invoice.cleaning.recurringSchedule || ''} onChange={(e) => handleCategoryDataChange('cleaning', e)} placeholder="e.g., Weekly, Monthly"/></div>
                </CardContent>
            </Card>
        )}

        {invoice.category === "Freelance / Agency" && invoice.freelance && (
            <Card className="bg-card/50 backdrop-blur-sm shadow-lg hover:shadow-primary/20 transition-shadow duration-300">
                <CardHeader><CardTitle>Freelance Project Details</CardTitle></CardHeader>
                <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2"><Label>Project Name</Label><Input name="projectName" value={invoice.freelance.projectName || ''} onChange={(e) => handleCategoryDataChange('freelance', e)}/></div>
                    <div className="space-y-2"><Label>Hourly Rate</Label><Input name="hourlyRate" type="number" value={invoice.freelance.hourlyRate || ''} onChange={(e) => handleCategoryDataChange('freelance', e)}/></div>
                    <div className="space-y-2"><Label>Fixed Rate</Label><Input name="fixedRate" type="number" value={invoice.freelance.fixedRate || ''} onChange={(e) => handleCategoryDataChange('freelance', e)}/></div>
                    <div className="space-y-2"><Label>Hours Logged</Label><Input name="hoursLogged" type="number" value={invoice.freelance.hoursLogged || ''} onChange={(e) => handleCategoryDataChange('freelance', e)}/></div>
                    <div className="md:col-span-2 space-y-2"><Label>Milestone/Task Description</Label><Textarea name="milestoneDescription" value={invoice.freelance.milestoneDescription || ''} onChange={(e) => handleCategoryDataChange('freelance', e)}/></div>
                </CardContent>
            </Card>
        )}

        {invoice.category === "Consulting" && invoice.consulting && (
            <Card className="bg-card/50 backdrop-blur-sm shadow-lg hover:shadow-primary/20 transition-shadow duration-300">
                <CardHeader><CardTitle>Consulting Details</CardTitle></CardHeader>
                <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2"><Label>Consultation Type</Label><Input name="consultationType" value={invoice.consulting.consultationType || ''} onChange={(e) => handleCategoryDataChange('consulting', e)}/></div>
                    <div className="space-y-2"><Label>Session Hours</Label><Input name="sessionHours" type="number" value={invoice.consulting.sessionHours || ''} onChange={(e) => handleCategoryDataChange('consulting', e)}/></div>
                    <div className="space-y-2"><Label>Retainer Fee</Label><Input name="retainerFee" type="number" value={invoice.consulting.retainerFee || ''} onChange={(e) => handleCategoryDataChange('consulting', e)}/></div>
                </CardContent>
            </Card>
        )}

        {invoice.category === 'Legal Services' && invoice.legal && (
            <Card className="bg-card/50 backdrop-blur-sm shadow-lg hover:shadow-primary/20 transition-shadow duration-300"><CardHeader><CardTitle>Legal Service Details</CardTitle></CardHeader>
                <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2"><Label>Case Name</Label><Input name="caseName" value={invoice.legal.caseName || ''} onChange={(e) => handleCategoryDataChange('legal', e)} /></div>
                    <div className="space-y-2"><Label>Case Number</Label><Input name="caseNumber" value={invoice.legal.caseNumber || ''} onChange={(e) => handleCategoryDataChange('legal', e)} /></div>
                    <div className="space-y-2"><Label>Service Type</Label><Input name="serviceType" value={invoice.legal.serviceType || ''} onChange={(e) => handleCategoryDataChange('legal', e)} /></div>
                    <div className="space-y-2"><Label>Hourly Rate</Label><Input type="number" name="hourlyRate" value={invoice.legal.hourlyRate ?? ''} onChange={(e) => handleCategoryDataChange('legal', e)} /></div>
                    <div className="space-y-2"><Label>Hours Worked</Label><Input type="number" name="hoursWorked" value={invoice.legal.hoursWorked ?? ''} onChange={(e) => handleCategoryDataChange('legal', e)} /></div>
                    <div className="space-y-2"><Label>Retainer Amount</Label><Input type="number" name="retainerAmount" value={invoice.legal.retainerAmount ?? ''} onChange={(e) => handleCategoryDataChange('legal', e)} /></div>
                    <div className="space-y-2"><Label>Court Filing Fees</Label><Input type="number" name="courtFilingFees" value={invoice.legal.courtFilingFees ?? ''} onChange={(e) => handleCategoryDataChange('legal', e)} /></div>
                    <div className="space-y-2"><Label>Travel Time (hours)</Label><Input type="number" name="travelTime" value={invoice.legal.travelTime ?? ''} onChange={(e) => handleCategoryDataChange('legal', e)} /></div>
                    <div className="md:col-span-2 space-y-2"><Label>Additional Disbursements</Label><Textarea name="additionalDisbursements" value={invoice.legal.additionalDisbursements || ''} onChange={(e) => handleCategoryDataChange('legal', e)} /></div>
                </CardContent>
            </Card>
        )}

        {invoice.category === 'Medical / Healthcare' && invoice.medical && (
            <Card className="bg-card/50 backdrop-blur-sm shadow-lg hover:shadow-primary/20 transition-shadow duration-300"><CardHeader><CardTitle>Medical Billing Details</CardTitle></CardHeader>
                <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2"><Label>Patient Name</Label><Input name="patientName" value={invoice.medical.patientName || ''} onChange={(e) => handleCategoryDataChange('medical', e)} /></div>
                    <div className="space-y-2"><Label>Patient ID / Chart #</Label><Input name="patientId" value={invoice.medical.patientId || ''} onChange={(e) => handleCategoryDataChange('medical', e)} /></div>
                    <div className="space-y-2"><Label>Service Type</Label><Input name="serviceType" value={invoice.medical.serviceType || ''} onChange={(e) => handleCategoryDataChange('medical', e)} /></div>
                    <div className="space-y-2"><Label>CPT Code</Label><Input name="cptCode" value={invoice.medical.cptCode || ''} onChange={(e) => handleCategoryDataChange('medical', e)} /></div>
                    <div className="space-y-2"><Label>ICD-10 Code</Label><Input name="icdCode" value={invoice.medical.icdCode || ''} onChange={(e) => handleCategoryDataChange('medical', e)} /></div>
                    <div className="space-y-2"><Label>Visit Date</Label><DatePicker date={invoice.medical.visitDate} setDate={(date) => handleDateChange('medical', 'visitDate', date)} /></div>
                    <div className="space-y-2"><Label>Physician Name</Label><Input name="physicianName" value={invoice.medical.physicianName || ''} onChange={(e) => handleCategoryDataChange('medical', e)} /></div>
                    <div className="space-y-2"><Label>Copay Amount</Label><Input type="number" name="copayAmount" value={invoice.medical.copayAmount ?? ''} onChange={(e) => handleCategoryDataChange('medical', e)} /></div>
                    <div className="space-y-2"><Label>Lab Fee</Label><Input type="number" name="labFee" value={invoice.medical.labFee ?? ''} onChange={(e) => handleCategoryDataChange('medical', e)} /></div>
                    <div className="space-y-2"><Label>Medication Charges</Label><Input type="number" name="medicationCharges" value={invoice.medical.medicationCharges ?? ''} onChange={(e) => handleCategoryDataChange('medical', e)} /></div>
                </CardContent>
            </Card>
        )}

        {invoice.category === "Auto Repair" && invoice.autoRepair && (
            <Card className="bg-card/50 backdrop-blur-sm shadow-lg hover:shadow-primary/20 transition-shadow duration-300">
                <CardHeader><CardTitle>Auto Repair Details</CardTitle></CardHeader>
                <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2"><Label>Vehicle Make</Label><Input name="vehicleMake" value={invoice.autoRepair.vehicleMake || ''} onChange={(e) => handleCategoryDataChange('autoRepair', e)}/></div>
                    <div className="space-y-2"><Label>Vehicle Model</Label><Input name="vehicleModel" value={invoice.autoRepair.vehicleModel || ''} onChange={(e) => handleCategoryDataChange('autoRepair', e)}/></div>
                    <div className="space-y-2"><Label>Year</Label><Input type="number" name="year" value={invoice.autoRepair.year || ''} onChange={(e) => handleCategoryDataChange('autoRepair', e)}/></div>
                    <div className="space-y-2"><Label>License Plate</Label><Input name="licensePlate" value={invoice.autoRepair.licensePlate || ''} onChange={(e) => handleCategoryDataChange('autoRepair', e)}/></div>
                    <div className="space-y-2"><Label>VIN</Label><Input name="vin" value={invoice.autoRepair.vin || ''} onChange={(e) => handleCategoryDataChange('autoRepair', e)}/></div>
                    <div className="space-y-2"><Label>Odometer</Label><Input type="number" name="odometer" value={invoice.autoRepair.odometer || ''} onChange={(e) => handleCategoryDataChange('autoRepair', e)}/></div>
                    <div className="space-y-2"><Label>Labor Hours</Label><Input type="number" name="laborHours" value={invoice.autoRepair.laborHours || ''} onChange={(e) => handleCategoryDataChange('autoRepair', e)}/></div>
                    <div className="space-y-2"><Label>Labor Rate (/hr)</Label><Input type="number" name="laborRate" value={invoice.autoRepair.laborRate || ''} onChange={(e) => handleCategoryDataChange('autoRepair', e)}/></div>
                    <div className="space-y-2"><Label>Diagnostic Fee</Label><Input type="number" name="diagnosticFee" value={invoice.autoRepair.diagnosticFee || ''} onChange={(e) => handleCategoryDataChange('autoRepair', e)}/></div>
                    <div className="space-y-2"><Label>Shop Supply Fee</Label><Input type="number" name="shopSupplyFee" value={invoice.autoRepair.shopSupplyFee || ''} onChange={(e) => handleCategoryDataChange('autoRepair', e)}/></div>
                    <div className="space-y-2"><Label>Towing Fee</Label><Input type="number" name="towingFee" value={invoice.autoRepair.towingFee || ''} onChange={(e) => handleCategoryDataChange('autoRepair', e)}/></div>
                </CardContent>
            </Card>
        )}

        {invoice.category === 'E-commerce / Online Store' && invoice.ecommerce && (
            <Card className="bg-card/50 backdrop-blur-sm shadow-lg hover:shadow-primary/20 transition-shadow duration-300"><CardHeader><CardTitle>E-commerce Order Details</CardTitle></CardHeader>
                <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2"><Label>Order Number</Label><Input name="orderNumber" value={invoice.ecommerce.orderNumber || ''} onChange={(e) => handleCategoryDataChange('ecommerce', e)} /></div>
                    <div className="space-y-2"><Label>SKU</Label><Input name="sku" value={invoice.ecommerce.sku || ''} onChange={(e) => handleCategoryDataChange('ecommerce', e)} /></div>
                    <div className="space-y-2"><Label>Product Category</Label><Input name="productCategory" value={invoice.ecommerce.productCategory || ''} onChange={(e) => handleCategoryDataChange('ecommerce', e)} /></div>
                    <div className="space-y-2"><Label>Weight</Label><Input type="number" name="weight" value={invoice.ecommerce.weight ?? ''} onChange={(e) => handleCategoryDataChange('ecommerce', e)} /></div>
                    <div className="space-y-2"><Label>Shipping Carrier</Label><Input name="shippingCarrier" value={invoice.ecommerce.shippingCarrier || ''} onChange={(e) => handleCategoryDataChange('ecommerce', e)} /></div>
                    <div className="space-y-2"><Label>Tracking ID</Label><Input name="trackingId" value={invoice.ecommerce.trackingId || ''} onChange={(e) => handleCategoryDataChange('ecommerce', e)} /></div>
                    <div className="space-y-2"><Label>Packaging Fee</Label><Input type="number" name="packagingFee" value={invoice.ecommerce.packagingFee ?? ''} onChange={(e) => handleCategoryDataChange('ecommerce', e)} /></div>
                </CardContent>
            </Card>
        )}

        {invoice.category === 'Retail / Wholesale' && invoice.retail && (
            <Card className="bg-card/50 backdrop-blur-sm shadow-lg hover:shadow-primary/20 transition-shadow duration-300"><CardHeader><CardTitle>Retail/Wholesale Details</CardTitle></CardHeader>
                <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2"><Label>SKU</Label><Input name="sku" value={invoice.retail.sku || ''} onChange={(e) => handleCategoryDataChange('retail', e)} /></div>
                    <div className="space-y-2"><Label>Product Category</Label><Input name="productCategory" value={invoice.retail.productCategory || ''} onChange={(e) => handleCategoryDataChange('retail', e)} /></div>
                    <div className="space-y-2"><Label>Unit of Measure</Label><Input name="unitOfMeasure" value={invoice.retail.unitOfMeasure || ''} onChange={(e) => handleCategoryDataChange('retail', e)} /></div>
                    <div className="space-y-2"><Label>Batch/Lot Number</Label><Input name="batchNumber" value={invoice.retail.batchNumber || ''} onChange={(e) => handleCategoryDataChange('retail', e)} /></div>
                    <div className="space-y-2"><Label>Stock Quantity</Label><Input type="number" name="stockQuantity" value={invoice.retail.stockQuantity ?? ''} onChange={(e) => handleCategoryDataChange('retail', e)} /></div>
                    <div className="space-y-2"><Label>Wholesale Price</Label><Input type="number" name="wholesalePrice" value={invoice.retail.wholesalePrice ?? ''} onChange={(e) => handleCategoryDataChange('retail', e)} /></div>
                    <div className="space-y-2"><Label>Shipping/Pallet Cost</Label><Input type="number" name="shippingPalletCost" value={invoice.retail.shippingPalletCost ?? ''} onChange={(e) => handleCategoryDataChange('retail', e)} /></div>
                </CardContent>
            </Card>
        )}

        {invoice.category === 'Photography' && invoice.photography && (
            <Card className="bg-card/50 backdrop-blur-sm shadow-lg hover:shadow-primary/20 transition-shadow duration-300"><CardHeader><CardTitle>Photography Service Details</CardTitle></CardHeader>
                <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2"><Label>Event Type</Label><Input name="eventType" value={invoice.photography.eventType || ''} onChange={(e) => handleCategoryDataChange('photography', e)} /></div>
                    <div className="space-y-2"><Label>Shoot Date</Label><DatePicker date={invoice.photography.shootDate} setDate={(date) => handleDateChange('photography', 'shootDate', date)} /></div>
                    <div className="space-y-2"><Label>Hours of Coverage</Label><Input type="number" name="hoursOfCoverage" value={invoice.photography.hoursOfCoverage ?? ''} onChange={(e) => handleCategoryDataChange('photography', e)} /></div>
                    <div className="space-y-2"><Label>Package Selected</Label><Input name="packageSelected" value={invoice.photography.packageSelected || ''} onChange={(e) => handleCategoryDataChange('photography', e)} /></div>
                    <div className="space-y-2"><Label>Edited Photos Count</Label><Input type="number" name="editedPhotosCount" value={invoice.photography.editedPhotosCount ?? ''} onChange={(e) => handleCategoryDataChange('photography', e)} /></div>
                    <div className="space-y-2"><Label>Raw Files Cost</Label><Input type="number" name="rawFilesCost" value={invoice.photography.rawFilesCost ?? ''} onChange={(e) => handleCategoryDataChange('photography', e)} /></div>
                    <div className="space-y-2"><Label>Travel Fee</Label><Input type="number" name="travelFee" value={invoice.photography.travelFee ?? ''} onChange={(e) => handleCategoryDataChange('photography', e)} /></div>
                    <div className="space-y-2"><Label>Equipment Rental Fee</Label><Input type="number" name="equipmentRentalFee" value={invoice.photography.equipmentRentalFee ?? ''} onChange={(e) => handleCategoryDataChange('photography', e)} /></div>
                </CardContent>
            </Card>
        )}

        {invoice.category === 'Real Estate / Property Management' && invoice.realEstate && (
            <Card className="bg-card/50 backdrop-blur-sm shadow-lg hover:shadow-primary/20 transition-shadow duration-300"><CardHeader><CardTitle>Real Estate Details</CardTitle></CardHeader>
                <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="md:col-span-2 space-y-2"><Label>Property Address</Label><Input name="propertyAddress" value={invoice.realEstate.propertyAddress || ''} onChange={(e) => handleCategoryDataChange('realEstate', e)} /></div>
                    <div className="space-y-2"><Label>Unit Number</Label><Input name="unitNumber" value={invoice.realEstate.unitNumber || ''} onChange={(e) => handleCategoryDataChange('realEstate', e)} /></div>
                    <div className="space-y-2"><Label>Lease Term</Label><Input name="leaseTerm" value={invoice.realEstate.leaseTerm || ''} onChange={(e) => handleCategoryDataChange('realEstate', e)} /></div>
                    <div className="space-y-2"><Label>Tenant Name</Label><Input name="tenantName" value={invoice.realEstate.tenantName || ''} onChange={(e) => handleCategoryDataChange('realEstate', e)} /></div>
                    <div className="space-y-2"><Label>Monthly Rent</Label><Input type="number" name="monthlyRent" value={invoice.realEstate.monthlyRent ?? ''} onChange={(e) => handleCategoryDataChange('realEstate', e)} /></div>
                    <div className="space-y-2"><Label>Cleaning Fee</Label><Input type="number" name="cleaningFee" value={invoice.realEstate.cleaningFee ?? ''} onChange={(e) => handleCategoryDataChange('realEstate', e)} /></div>
                    <div className="space-y-2"><Label>Maintenance Fee</Label><Input type="number" name="maintenanceFee" value={invoice.realEstate.maintenanceFee ?? ''} onChange={(e) => handleCategoryDataChange('realEstate', e)} /></div>
                    <div className="space-y-2"><Label>Late Fee</Label><Input type="number" name="lateFee" value={invoice.realEstate.lateFee ?? ''} onChange={(e) => handleCategoryDataChange('realEstate', e)} /></div>
                    <div className="space-y-2"><Label>HOA Charges</Label><Input type="number" name="hoaCharges" value={invoice.realEstate.hoaCharges ?? ''} onChange={(e) => handleCategoryDataChange('realEstate', e)} /></div>
                    <div className="space-y-2"><Label>Utility Charges</Label><Input type="number" name="utilityCharges" value={invoice.realEstate.utilityCharges ?? ''} onChange={(e) => handleCategoryDataChange('realEstate', e)} /></div>
                </CardContent>
            </Card>
        )}

        {invoice.category === 'Transportation / Trucking' && invoice.transportation && (
            <Card className="bg-card/50 backdrop-blur-sm shadow-lg hover:shadow-primary/20 transition-shadow duration-300"><CardHeader><CardTitle>Transportation Details</CardTitle></CardHeader>
                <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2"><Label>Pickup Location</Label><Input name="pickupLocation" value={invoice.transportation.pickupLocation || ''} onChange={(e) => handleCategoryDataChange('transportation', e)} /></div>
                    <div className="space-y-2"><Label>Drop-off Location</Label><Input name="dropoffLocation" value={invoice.transportation.dropoffLocation || ''} onChange={(e) => handleCategoryDataChange('transportation', e)} /></div>
                    <div className="space-y-2"><Label>Miles Driven</Label><Input type="number" name="milesDriven" value={invoice.transportation.milesDriven ?? ''} onChange={(e) => handleCategoryDataChange('transportation', e)} /></div>
                    <div className="space-y-2"><Label>Rate per Mile</Label><Input type="number" name="ratePerMile" value={invoice.transportation.ratePerMile ?? ''} onChange={(e) => handleCategoryDataChange('transportation', e)} /></div>
                    <div className="space-y-2"><Label>Weight (lbs/tons)</Label><Input type="number" name="weight" value={invoice.transportation.weight ?? ''} onChange={(e) => handleCategoryDataChange('transportation', e)} /></div>
                    <div className="space-y-2"><Label>Load Type</Label><Input name="loadType" value={invoice.transportation.loadType || ''} onChange={(e) => handleCategoryDataChange('transportation', e)} /></div>
                    <div className="space-y-2"><Label>Fuel Surcharge</Label><Input type="number" name="fuelSurcharge" value={invoice.transportation.fuelSurcharge ?? ''} onChange={(e) => handleCategoryDataChange('transportation', e)} /></div>
                    <div className="space-y-2"><Label>Toll Charges</Label><Input type="number" name="tollCharges" value={invoice.transportation.tollCharges ?? ''} onChange={(e) => handleCategoryDataChange('transportation', e)} /></div>
                    <div className="space-y-2"><Label>Detention Fee</Label><Input type="number" name="detentionFee" value={invoice.transportation.detentionFee ?? ''} onChange={(e) => handleCategoryDataChange('transportation', e)} /></div>
                </CardContent>
            </Card>
        )}

        {invoice.category === 'IT Services / Tech Support' && invoice.itServices && (
            <Card className="bg-card/50 backdrop-blur-sm shadow-lg hover:shadow-primary/20 transition-shadow duration-300"><CardHeader><CardTitle>IT Service Details</CardTitle></CardHeader>
                <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2"><Label>Service Type</Label><Input name="serviceType" value={invoice.itServices.serviceType || ''} onChange={(e) => handleCategoryDataChange('itServices', e)} /></div>
                    <div className="space-y-2"><Label>Hourly Rate</Label><Input type="number" name="hourlyRate" value={invoice.itServices.hourlyRate ?? ''} onChange={(e) => handleCategoryDataChange('itServices', e)} /></div>
                    <div className="space-y-2"><Label>Hours Worked</Label><Input type="number" name="hoursWorked" value={invoice.itServices.hoursWorked ?? ''} onChange={(e) => handleCategoryDataChange('itServices', e)} /></div>
                    <div className="space-y-2"><Label>Device/Server Type</Label><Input name="deviceType" value={invoice.itServices.deviceType || ''} onChange={(e) => handleCategoryDataChange('itServices', e)} /></div>
                    <div className="space-y-2"><Label>Serial Number</Label><Input name="serialNumber" value={invoice.itServices.serialNumber || ''} onChange={(e) => handleCategoryDataChange('itServices', e)} /></div>
                    <div className="space-y-2"><Label>Hardware Replacement Cost</Label><Input type="number" name="hardwareReplacementCost" value={invoice.itServices.hardwareReplacementCost ?? ''} onChange={(e) => handleCategoryDataChange('itServices', e)} /></div>
                    <div className="space-y-2"><Label>Monthly Maintenance Fee</Label><Input type="number" name="monthlyMaintenanceFee" value={invoice.itServices.monthlyMaintenanceFee ?? ''} onChange={(e) => handleCategoryDataChange('itServices', e)} /></div>
                </CardContent>
            </Card>
        )}

        {invoice.category === 'Rental / Property' && invoice.rental && (
            <Card className="bg-card/50 backdrop-blur-sm shadow-lg hover:shadow-primary/20 transition-shadow duration-300"><CardHeader><CardTitle>Rental Details</CardTitle></CardHeader>
                <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="md:col-span-2 space-y-2"><Label>Rental Item Name</Label><Input name="rentalItemName" value={invoice.rental.rentalItemName || ''} onChange={(e) => handleCategoryDataChange('rental', e)} /></div>
                    <div className="space-y-2"><Label>Rental Start Date</Label><DatePicker date={invoice.rental.rentalStartDate} setDate={(date) => handleDateChange('rental', 'rentalStartDate', date)} /></div>
                    <div className="space-y-2"><Label>Rental End Date</Label><DatePicker date={invoice.rental.rentalEndDate} setDate={(date) => handleDateChange('rental', 'rentalEndDate', date)} /></div>
                    <div className="space-y-2"><Label>Daily Rate</Label><Input type="number" name="dailyRate" value={invoice.rental.dailyRate ?? ''} onChange={(e) => handleCategoryDataChange('rental', e)} /></div>
                    <div className="space-y-2"><Label>Hourly Rate</Label><Input type="number" name="hourlyRate" value={invoice.rental.hourlyRate ?? ''} onChange={(e) => handleCategoryDataChange('rental', e)} /></div>
                    <div className="space-y-2"><Label>Number of Days</Label><Input type="number" name="numberOfDays" value={invoice.rental.numberOfDays ?? ''} onChange={(e) => handleCategoryDataChange('rental', e)} /></div>
                    <div className="space-y-2"><Label>Number of Hours</Label><Input type="number" name="numberOfHours" value={invoice.rental.numberOfHours ?? ''} onChange={(e) => handleCategoryDataChange('rental', e)} /></div>
                    <div className="space-y-2"><Label>Security Deposit</Label><Input type="number" name="securityDeposit" value={invoice.rental.securityDeposit ?? ''} onChange={(e) => handleCategoryDataChange('rental', e)} /></div>
                    <div className="space-y-2"><Label>Damage Charges</Label><Input type="number" name="damageCharges" value={invoice.rental.damageCharges ?? ''} onChange={(e) => handleCategoryDataChange('rental', e)} /></div>
                    <div className="space-y-2"><Label>Delivery Fee</Label><Input type="number" name="deliveryFee" value={invoice.rental.deliveryFee ?? ''} onChange={(e) => handleCategoryDataChange('rental', e)} /></div>
                    <div className="space-y-2"><Label>Pickup Fee</Label><Input type="number" name="pickupFee" value={invoice.rental.pickupFee ?? ''} onChange={(e) => handleCategoryDataChange('rental', e)} /></div>
                </CardContent>
            </Card>
        )}
      
      
      <Card className="bg-card/50 backdrop-blur-sm shadow-lg hover:shadow-primary/20 transition-shadow duration-300">
        <CardHeader>
          <CardTitle>Items</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
           {/* Presets UI */}
            <div className="p-4 border rounded-lg bg-background/50 space-y-4">
              <Label className="font-semibold">Line Item Presets</Label>
              <div className="flex flex-wrap items-end gap-2">
                <div className="flex-grow space-y-2">
                    <Label htmlFor="preset-select" className="text-xs text-muted-foreground">Load a saved group of items</Label>
                    <Select value={selectedPreset} onValueChange={setSelectedPreset} disabled={presets.length === 0}>
                        <SelectTrigger id="preset-select">
                            <SelectValue placeholder="Select a preset..." />
                        </SelectTrigger>
                        <SelectContent>
                            {presets.map((p, index) => <SelectItem key={`${p.name}-${index}`} value={p.name}>{p.name}</SelectItem>)}
                        </SelectContent>
                    </Select>
                </div>
                
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                      <Button variant="secondary" disabled={!selectedPreset}>Load Preset</Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                      <AlertDialogHeader>
                          <AlertDialogTitle>Add items from preset?</AlertDialogTitle>
                          <AlertDialogDescription>
                              This will add the items from the preset to your current list, not replace them.
                          </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction onClick={handleLoadPreset}>Load</AlertDialogAction>
                      </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>

                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="destructive" disabled={!selectedPreset}><Trash2 className="mr-2 h-4 w-4" />Delete Preset</Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                      <AlertDialogHeader>
                          <AlertDialogTitle>Delete this preset?</AlertDialogTitle>
                          <AlertDialogDescription>
                              This will permanently delete the "{selectedPreset}" preset. This action cannot be undone.
                          </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction onClick={handleDeletePreset}>Delete</AlertDialogAction>
                      </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>

                <Dialog open={isSavePresetOpen} onOpenChange={setIsSavePresetOpen}>
                  <DialogTrigger asChild>
                    <Button variant="outline"><Save className="mr-2 h-4 w-4" /> Save as Preset</Button>
                  </DialogTrigger>
                  <DialogContent>
                      <DialogHeader>
                          <DialogTitle>Save Line Item Preset</DialogTitle>
                          <DialogDescription>
                              Save the current set of line items for quick use in the future.
                          </DialogDescription>
                      </DialogHeader>
                      <div className="space-y-2">
                          <Label htmlFor="preset-name">Preset Name</Label>
                          <Input id="preset-name" value={newPresetName} onChange={(e) => setNewPresetName(e.target.value)} placeholder="e.g., Standard Website Package"/>
                      </div>
                      <DialogFooter>
                          <DialogClose asChild><Button variant="ghost">Cancel</Button></DialogClose>
                          <Button onClick={handleSavePreset}>Save Preset</Button>
                      </DialogFooter>
                  </DialogContent>
                </Dialog>
              </div>
            </div>

          <div className="hidden md:grid md:grid-cols-[2fr_100px_120px_120px_auto] gap-x-4 text-sm font-medium text-muted-foreground">
            <Label>Item Name</Label>
            <Label>Quantity</Label>
            <Label>Unit Price</Label>
            <Label>Subtotal</Label>
            <span></span>
          </div>
          {invoice.lineItems.map((item, index) => (
            <div key={item.id} className="grid grid-cols-1 md:grid-cols-[2fr_100px_120px_120px_auto] gap-x-4 gap-y-2 items-start border-b pb-4">
              <div className="space-y-2 md:col-span-1">
                <Label htmlFor={`itemName-${index}`} className="md:hidden">Item Name</Label>
                <Textarea id={`itemName-${index}`} value={item.name} onChange={(e) => handleItemChange(index, 'name', e.target.value)} rows={1} className="min-h-0"/>
              </div>
              <div className="grid grid-cols-3 md:contents gap-4">
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

      <Card className="bg-card/50 backdrop-blur-sm shadow-lg hover:shadow-primary/20 transition-shadow duration-300">
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
          <div className="space-y-2">
            <Label>Owner Signature</Label>
            <div className="flex gap-2">
                <Dialog open={isSignatureDialogOpen} onOpenChange={setIsSignatureDialogOpen}>
                    <DialogTrigger asChild>
                        <Button variant="outline" className="w-full">
                            <Pencil className="mr-2 h-4 w-4" />
                            {invoice.business.ownerSignature ? 'Edit Signature' : 'Add Signature'}
                        </Button>
                    </DialogTrigger>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Owner Signature</DialogTitle>
                            <DialogDescription>
                                Draw your signature below. This will be saved with the document.
                            </DialogDescription>
                        </DialogHeader>
                        <SignaturePad onSave={handleOwnerSignatureSave} signerName={invoice.business.name} />
                    </DialogContent>
                </Dialog>
                {invoice.business.ownerSignature && (
                    <Button variant="destructive" onClick={handleDeleteSignature}>
                        <Trash2 className="mr-2 h-4 w-4" />
                        Delete
                    </Button>
                )}
            </div>
            {invoice.business.ownerSignature && (
                <div className="p-4 border rounded-md bg-muted/50">
                    <Image src={invoice.business.ownerSignature.image} alt="Owner Signature" width={150} height={75} />
                </div>
            )}
        </div>
        </CardContent>
      </Card>
    </div>
  );
}




