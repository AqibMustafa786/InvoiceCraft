

'use client';

import { ChangeEvent, Dispatch, SetStateAction, useState, useEffect } from 'react';
import type { Invoice, LineItem, InvoiceCategory } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { DatePicker } from '@/components/ui/datepicker';
import { ImageUp, Plus, Trash2, Palette, X, Mail, Truck, Hash, Wallet, Phone, Globe, Briefcase, Award, User, FileText, Building, Pencil, Type, Package, Hammer, Ruler, ListTree, CheckSquare, Sparkles, Calendar, TextQuote, Wind, Thermometer, Wrench, Zap, Trees, Droplets, Car, Code, DraftingCompass, PaintBucket, Paintbrush, Receipt, Scale, Hospital, HeartPulse, HardHat, Save, Loader2, Camera } from 'lucide-react';
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
  setInvoice: Dispatch<React.SetStateAction<Invoice>>;
  accentColor: string;
  setAccentColor: Dispatch<SetStateAction<string>>;
  backgroundColor: string;
  setBackgroundColor: Dispatch<SetStateAction<string>>;
  textColor: string;
  setTextColor: Dispatch<SetStateAction<string>>;
  toast: (options: { title: string; description: string; variant?: "default" | "destructive" }) => void;
  onLogoUpload: (e: ChangeEvent<HTMLInputElement>) => void;
  isUploading: boolean;
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


export function InvoiceForm({ invoice, setInvoice, accentColor, setAccentColor, backgroundColor, setBackgroundColor, textColor, setTextColor, toast, onLogoUpload, isUploading }: InvoiceFormProps) {
  const [bulkAddCount, setBulkAddCount] = useState(10);
  const [accentColorInput, setAccentColorInput] = useState(accentColor);
  const [bgColorInput, setBgColorInput] = useState(backgroundColor);
  const [textColorInput, setTextColorInput] = useState(textColor);
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
      lineItems: [...prev.lineItems, { id: crypto.randomUUID(), name: '', description: '', quantity: 1, unitPrice: 0, taxable: false }],
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
      description: '',
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

  const handleRemoveLogo = () => {
    setInvoice(prev => ({
        ...prev,
        business: {
            ...prev.business,
            logoUrl: ''
        }
    }));
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
      toast({ title: 'Preset Loaded', description: `Items from "${selectedPreset}" have been added.` });
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
          <CardTitle className="text-base">Branding &amp; Customization</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-3">
           <div className="space-y-2">
              <Label className="text-xs">Company Logo</Label>
               <div className="flex items-center gap-2">
                {invoice.business.logoUrl ? (
                    <div className="flex items-center gap-2">
                        <Image src={invoice.business.logoUrl} alt="Company Logo" width={60} height={30} className="rounded-md object-contain bg-muted p-1" />
                        <div className="flex items-center gap-1">
                            <Button asChild variant="outline" size="sm" disabled={isUploading} className="text-xs h-9">
                                <label htmlFor="logo-upload" className="cursor-pointer">Change</label>
                            </Button>
                            <Button variant="destructive" size="sm" onClick={handleRemoveLogo} disabled={isUploading} className="text-xs h-9">
                               <X className="h-3 w-3 mr-1" /> Remove
                            </Button>
                        </div>
                    </div>
                ) : (
                    <Button asChild variant="outline" size="sm" className="w-full text-xs h-9" disabled={isUploading}>
                        <label htmlFor="logo-upload" className="cursor-pointer flex items-center justify-center gap-2">
                           {isUploading ? <Loader2 className="h-4 w-4 animate-spin" /> : <ImageUp className="h-4 w-4" />}
                           {isUploading ? 'Uploading...' : 'Upload Logo'}
                        </label>
                    </Button>
                )}
                 <Input id="logo-upload" type="file" className="sr-only" onChange={onLogoUpload} accept="image/png, image/jpeg, image/gif" disabled={isUploading}/>
                </div>
            </div>
            <div className="space-y-2">
                <Label htmlFor="accentColor" className="text-xs">Accent Color</Label>
                <div className="relative flex items-center">
                    <Palette className="absolute left-3 h-4 w-4 text-muted-foreground" />
                    <Input 
                        id="accentColor"
                        type="text" 
                        value={accentColorInput} 
                        onChange={(e) => setAccentColorInput(e.target.value)}
                        onBlur={(e) => setAccentColor(e.target.value)}
                        className="pl-9 h-9 text-xs"
                        placeholder="hsl(260 85% 66%)"
                    />
                    <input 
                        type="color" 
                        value={accentColor.startsWith('hsl') ? '#000000' : accentColor}
                        onChange={(e) => {
                            setAccentColor(e.target.value);
                            setAccentColorInput(e.target.value);
                        }}
                        className="absolute right-1 top-1/2 -translate-y-1/2 h-7 w-7 p-1 rounded-md cursor-pointer bg-transparent border-none appearance-none"
                    />
                </div>
            </div>
             <div className="space-y-2">
                <Label htmlFor="backgroundColor" className="text-xs">Background Color</Label>
                <div className="relative flex items-center">
                    <PaintBucket className="absolute left-3 h-4 w-4 text-muted-foreground" />
                    <Input 
                        id="backgroundColor"
                        type="text" 
                        value={bgColorInput} 
                        onChange={(e) => setBgColorInput(e.target.value)}
                        onBlur={(e) => setBackgroundColor(e.target.value)}
                        className="pl-9 h-9 text-xs"
                        placeholder="#FFFFFF"
                    />
                    <input 
                        type="color" 
                        value={backgroundColor}
                        onChange={(e) => {
                            setBackgroundColor(e.target.value);
                            setInvoice(prev => ({...prev, backgroundColor: e.target.value }));
                        }}
                        className="absolute right-1 top-1/2 -translate-y-1/2 h-7 w-7 p-1 rounded-md cursor-pointer bg-transparent border-none appearance-none"
                    />
                </div>
            </div>
             <div className="space-y-2">
                <Label htmlFor="textColor" className="text-xs">Text Color</Label>
                <div className="relative flex items-center">
                    <Paintbrush className="absolute left-3 h-4 w-4 text-muted-foreground" />
                    <Input 
                        id="textColor"
                        type="text" 
                        value={textColorInput} 
                        onChange={(e) => setTextColorInput(e.target.value)}
                        onBlur={(e) => setTextColor(e.target.value)}
                        className="pl-9 h-9 text-xs"
                        placeholder="#374151"
                    />
                    <input 
                        type="color" 
                        value={textColor}
                        onChange={(e) => {
                            setTextColor(e.target.value);
                            setInvoice(prev => ({...prev, textColor: e.target.value }));
                        }}
                        className="absolute right-1 top-1/2 -translate-y-1/2 h-7 w-7 p-1 rounded-md cursor-pointer bg-transparent border-none appearance-none"
                    />
                </div>
            </div>
             <div className="space-y-2">
                <Label htmlFor="fontFamily" className="text-xs">Font Family</Label>
                <Select value={invoice.fontFamily} onValueChange={(value) => setInvoice(p => ({...p, fontFamily: value}))}>
                    <SelectTrigger id="fontFamily" className="h-9 text-xs">
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
          <CardTitle className="text-base">Bill From</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
            <div className="space-y-2">
              <Label htmlFor="businessName" className="text-xs">Business Name</Label>
              <div className="relative flex items-center">
                  <Briefcase className="absolute left-3 h-4 w-4 text-muted-foreground" />
                  <Input id="businessName" name="name" autoComplete="off" value={invoice.business.name} onChange={(e) => handleNestedChange('business', e)} className="pl-9 text-xs h-9" />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="businessAddress" className="text-xs">Business Address</Label>
              <Textarea id="businessAddress" name="address" autoComplete="off" value={invoice.business.address} onChange={(e) => handleNestedChange('business', e)} placeholder="Street, City, State, Zip" className="text-xs min-h-[60px]"/>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                 <div className="space-y-2">
                    <Label htmlFor="businessPhone" className="text-xs">Phone Number</Label>
                    <div className="relative flex items-center">
                        <Phone className="absolute left-3 h-4 w-4 text-muted-foreground" />
                        <Input id="businessPhone" name="phone" autoComplete="off" value={invoice.business.phone} onChange={(e) => handleNestedChange('business', e)} className="pl-9 text-xs h-9" />
                    </div>
                </div>
                <div className="space-y-2">
                    <Label htmlFor="businessEmail" className="text-xs">Email Address</Label>
                    <div className="relative flex items-center">
                        <Mail className="absolute left-3 h-4 w-4 text-muted-foreground" />
                        <Input id="businessEmail" name="email" autoComplete="off" value={invoice.business.email} onChange={(e) => handleNestedChange('business', e)} className="pl-9 text-xs h-9" />
                    </div>
                </div>
                 <div className="space-y-2">
                    <Label htmlFor="businessWebsite" className="text-xs">Website (optional)</Label>
                    <div className="relative flex items-center">
                        <Globe className="absolute left-3 h-4 w-4 text-muted-foreground" />
                        <Input id="businessWebsite" name="website" autoComplete="off" value={invoice.business.website || ''} onChange={(e) => handleNestedChange('business', e)} className="pl-9 text-xs h-9" />
                    </div>
                </div>
                 <div className="space-y-2">
                    <Label htmlFor="businessLicense" className="text-xs">License Number (optional)</Label>
                     <div className="relative flex items-center">
                        <Award className="absolute left-3 h-4 w-4 text-muted-foreground" />
                        <Input id="businessLicense" name="licenseNumber" autoComplete="off" value={invoice.business.licenseNumber} onChange={(e) => handleNestedChange('business', e)} className="pl-9 text-xs h-9" />
                    </div>
                </div>
                <div className="space-y-2 md:col-span-2">
                    <Label htmlFor="businessTaxId" className="text-xs">Tax ID / EIN (optional)</Label>
                     <div className="relative flex items-center">
                        <Hash className="absolute left-3 h-4 w-4 text-muted-foreground" />
                        <Input id="businessTaxId" name="taxId" autoComplete="off" value={invoice.business.taxId ?? ''} onChange={(e) => handleNestedChange('business', e)} className="pl-9 text-xs h-9" />
                    </div>
                </div>
            </div>
        </CardContent>
      </Card>

      <Card className="bg-card/50 backdrop-blur-sm shadow-lg hover:shadow-primary/20 transition-shadow duration-300">
        <CardHeader>
          <CardTitle className="text-base">Bill To</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div className="space-y-2">
              <Label htmlFor="clientName" className="text-xs">Client Name</Label>
              <div className="relative flex items-center">
                  <User className="absolute left-3 h-4 w-4 text-muted-foreground" />
                  <Input id="clientName" name="name" value={invoice.client.name} onChange={(e) => handleNestedChange('client', e)} className="pl-9 text-xs h-9" />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="clientCompanyName" className="text-xs">Client Company Name (optional)</Label>
              <div className="relative flex items-center">
                  <Building className="absolute left-3 h-4 w-4 text-muted-foreground" />
                  <Input id="clientCompanyName" name="companyName" value={invoice.client.companyName || ''} onChange={(e) => handleNestedChange('client', e)} className="pl-9 text-xs h-9" />
              </div>
            </div>
          </div>
           <div className="space-y-2">
            <Label htmlFor="clientEmail" className="text-xs">Client Email</Label>
            <div className="relative flex items-center">
                <Mail className="absolute left-3 h-4 w-4 text-muted-foreground" />
                <Input id="clientEmail" name="email" value={invoice.client.email || ''} onChange={(e) => handleNestedChange('client', e)} className="pl-9 text-xs h-9" placeholder="client@example.com" />
            </div>
          </div>
           <div className="space-y-2">
                <Label htmlFor="clientPhone" className="text-xs">Client Phone</Label>
                <div className="relative flex items-center">
                    <Phone className="absolute left-3 h-4 w-4 text-muted-foreground" />
                    <Input id="clientPhone" name="phone" value={invoice.client.phone || ''} onChange={(e) => handleNestedChange('client', e)} className="pl-9 text-xs h-9" />
                </div>
            </div>
          <div className="space-y-2">
            <Label htmlFor="clientAddress" className="text-xs">Billing Address</Label>
            <Textarea id="clientAddress" name="address" value={invoice.client.address} onChange={(e) => handleNestedChange('client', e)} className="text-xs min-h-[60px]" />
          </div>
           <div className="space-y-2">
            <Label htmlFor="shippingAddress" className="text-xs">Shipping Address (if different)</Label>
            <Textarea id="shippingAddress" name="shippingAddress" value={invoice.client.shippingAddress || ''} onChange={(e) => handleNestedChange('client', e)} className="text-xs min-h-[60px]" />
          </div>
        </CardContent>
      </Card>
      
      <Card className="bg-card/50 backdrop-blur-sm shadow-lg hover:shadow-primary/20 transition-shadow duration-300">
        <CardHeader>
          <CardTitle className="text-base">Invoice Details</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div className="space-y-2 md:col-span-2">
            <Label htmlFor="category" className="text-xs">Invoice Category</Label>
            <div className="relative flex items-center">
                <Package className="absolute left-3 h-4 w-4 text-muted-foreground z-10" />
                <Select
                    value={invoice.category}
                    onValueChange={(value: InvoiceCategory) => setInvoice(p => ({ ...p, category: value }))}
                >
                    <SelectTrigger id="category" className="pl-9 h-9 text-xs">
                        <SelectValue placeholder="Select a business category" />
                    </SelectTrigger>
                    <SelectContent>
                        {categories.map((cat, index) => <SelectItem key={`${cat}-${index}`} value={cat}>{cat}</SelectItem>)}
                    </SelectContent>
                </Select>
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="invoiceNumber" className="text-xs">Invoice Number</Label>
            <Input id="invoiceNumber" name="invoiceNumber" value={invoice.invoiceNumber} onChange={handleInputChange} className="h-9 text-xs" />
          </div>
          <div className="space-y-2">
            <Label className="text-xs">Invoice Date</Label>
            <DatePicker date={invoice.invoiceDate} setDate={(date) => setInvoice(p => ({ ...p, invoiceDate: date! }))} className="h-9 text-xs" />
          </div>
          <div className="space-y-2">
            <Label className="text-xs">Due Date</Label>
            <DatePicker date={invoice.dueDate} setDate={(date) => setInvoice(p => ({ ...p, dueDate: date! }))} className="h-9 text-xs"/>
          </div>
           <div className="space-y-2">
                <Label htmlFor="currency" className="text-xs">Currency</Label>
                <Select value={invoice.currency} onValueChange={handleCurrencyChange}>
                    <SelectTrigger id="currency" className="h-9 text-xs">
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
                <Label htmlFor="language" className="text-xs">Invoice Language</Label>
                <Select value={invoice.language} onValueChange={handleLanguageChange}>
                    <SelectTrigger id="language" className="h-9 text-xs">
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
              <Label htmlFor="poNumber" className="text-xs">PO Number</Label>
                <div className="relative flex items-center">
                  <Hash className="absolute left-3 h-4 w-4 text-muted-foreground" />
                  <Input id="poNumber" name="poNumber" value={invoice.poNumber || ''} onChange={handleInputChange} className="pl-9 h-9 text-xs" />
              </div>
            </div>
        </CardContent>
      </Card>
      
      {invoice.category === "Construction" && invoice.construction && (
          <Card className="bg-card/50 backdrop-blur-sm shadow-lg hover:shadow-primary/20 transition-shadow duration-300">
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
      )}

       {invoice.category === "Plumbing" && invoice.plumbing && (
          <Card className="bg-card/50 backdrop-blur-sm shadow-lg hover:shadow-primary/20 transition-shadow duration-300">
            <CardHeader><CardTitle className="text-base flex items-center gap-2"><Wrench className="h-4 w-4" />Plumbing Details</CardTitle></CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div className="space-y-2">
                    <Label className="text-xs">Service Type</Label>
                    <CustomSelect name="serviceType" value={invoice.plumbing.serviceType} onValueChange={(name, value) => handleCategorySelectChange('plumbing', name, value)} options={plumbingServiceTypes} placeholder="Select service type" />
                </div>
                <div className="space-y-2"><Label className="text-xs">Pipe Material</Label><Input name="pipeMaterial" value={invoice.plumbing.pipeMaterial} onChange={(e) => handleCategoryDataChange('plumbing', e)} className="text-xs h-9"/></div>
                <div className="space-y-2"><Label className="text-xs">Fixture Name</Label><Input name="fixtureName" value={invoice.plumbing.fixtureName} onChange={(e) => handleCategoryDataChange('plumbing', e)} className="text-xs h-9"/></div>
                <div className="space-y-2"><Label className="text-xs">Emergency Fee</Label><Input name="emergencyFee" type="number" value={invoice.plumbing.emergencyFee ?? ''} onChange={(e) => handleCategoryDataChange('plumbing', e)} className="text-xs h-9"/></div>
            </CardContent>
          </Card>
      )}

      {invoice.category === "Electrical Services" && invoice.electrical && (
          <Card className="bg-card/50 backdrop-blur-sm shadow-lg hover:shadow-primary/20 transition-shadow duration-300">
              <CardHeader><CardTitle className="text-base flex items-center gap-2"><Zap className="h-4 w-4" />Electrical Service Details</CardTitle></CardHeader>
              <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div className="space-y-2"><Label className="text-xs">Service Type</Label><Input name="serviceType" value={invoice.electrical.serviceType} onChange={(e) => handleCategoryDataChange('electrical', e)} className="text-xs h-9"/></div>
                  <div className="space-y-2"><Label className="text-xs">Voltage</Label><Input name="voltage" value={invoice.electrical.voltage} onChange={(e) => handleCategoryDataChange('electrical', e)} className="text-xs h-9"/></div>
                  <div className="space-y-2"><Label className="text-xs">Fixture/Device</Label><Input name="fixtureDevice" value={invoice.electrical.fixtureDevice} onChange={(e) => handleCategoryDataChange('electrical', e)} className="text-xs h-9"/></div>
                  <div className="space-y-2"><Label className="text-xs">Permit Cost</Label><Input name="permitCost" type="number" value={invoice.electrical.permitCost ?? ''} onChange={(e) => handleCategoryDataChange('electrical', e)} className="text-xs h-9"/></div>
              </CardContent>
          </Card>
      )}

      {invoice.category === "HVAC Services" && invoice.hvac && (
          <Card className="bg-card/50 backdrop-blur-sm shadow-lg hover:shadow-primary/20 transition-shadow duration-300">
              <CardHeader><CardTitle className="text-base flex items-center gap-2"><Wind className="h-4 w-4" />HVAC Service Details</CardTitle></CardHeader>
              <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div className="space-y-2"><Label className="text-xs">Unit Type</Label><CustomSelect name="unitType" value={invoice.hvac.unitType} onValueChange={(name, value) => handleCategorySelectChange('hvac', name, value)} options={hvacServiceTypes} placeholder="Select unit type" /></div>
                  <div className="space-y-2"><Label className="text-xs">Model Number</Label><Input name="modelNumber" value={invoice.hvac.modelNumber} onChange={(e) => handleCategoryDataChange('hvac', e)} className="text-xs h-9"/></div>
                  <div className="space-y-2"><Label className="text-xs">Refrigerant Type</Label><Input name="refrigerantType" value={invoice.hvac.refrigerantType} onChange={(e) => handleCategoryDataChange('hvac', e)} className="text-xs h-9"/></div>
                  <div className="space-y-2"><Label className="text-xs">Maintenance Fee</Label><Input name="maintenanceFee" type="number" value={invoice.hvac.maintenanceFee ?? ''} onChange={(e) => handleCategoryDataChange('hvac', e)} className="text-xs h-9"/></div>
              </CardContent>
          </Card>
      )}

      {invoice.category === "Roofing" && invoice.roofing && (
          <Card className="bg-card/50 backdrop-blur-sm shadow-lg hover:shadow-primary/20 transition-shadow duration-300">
              <CardHeader><CardTitle className="text-base flex items-center gap-2"><Hammer className="h-4 w-4" />Roofing Details</CardTitle></CardHeader>
              <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div className="space-y-2"><Label className="text-xs">Roof Type</Label><CustomSelect name="roofType" value={invoice.roofing.roofType} onValueChange={(name, value) => handleCategorySelectChange('roofing', name, value)} options={roofMaterials} placeholder="Select roof type" /></div>
                  <div className="space-y-2"><Label className="text-xs">Square Footage</Label><Input name="squareFootage" type="number" value={invoice.roofing.squareFootage ?? ''} onChange={(e) => handleCategoryDataChange('roofing', e)} className="text-xs h-9"/></div>
                  <div className="space-y-2"><Label className="text-xs">Pitch</Label><Input name="pitch" value={invoice.roofing.pitch} onChange={(e) => handleCategoryDataChange('roofing', e)} className="text-xs h-9"/></div>
                  <div className="space-y-2"><Label className="text-xs">Underlayment Type</Label><Input name="underlaymentType" value={invoice.roofing.underlaymentType} onChange={(e) => handleCategoryDataChange('roofing', e)} className="text-xs h-9"/></div>
                  <div className="space-y-2"><Label className="text-xs">Dumpster Fee</Label><Input name="dumpsterFee" type="number" value={invoice.roofing.dumpsterFee ?? ''} onChange={(e) => handleCategoryDataChange('roofing', e)} className="text-xs h-9"/></div>
                  <div className="flex items-center space-x-2 pt-6"><Checkbox id="tearOffRequired" name="tearOffRequired" checked={invoice.roofing.tearOffRequired} onCheckedChange={(checked) => handleCategorySelectChange('roofing', 'tearOffRequired', !!checked)} /><Label htmlFor="tearOffRequired" className="text-xs">Tear Off Required</Label></div>
              </CardContent>
          </Card>
      )}

       {invoice.category === "Landscaping & Lawn Care" && invoice.landscaping && (
          <Card className="bg-card/50 backdrop-blur-sm shadow-lg hover:shadow-primary/20 transition-shadow duration-300">
              <CardHeader><CardTitle className="text-base flex items-center gap-2"><Trees className="h-4 w-4" />Landscaping Details</CardTitle></CardHeader>
              <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div className="space-y-2"><Label className="text-xs">Lawn Square Footage</Label><Input name="lawnSquareFootage" type="number" value={invoice.landscaping.lawnSquareFootage ?? ''} onChange={(e) => handleCategoryDataChange('landscaping', e)} className="text-xs h-9"/></div>
                  <div className="space-y-2"><Label className="text-xs">Service Type</Label><Input name="serviceType" value={invoice.landscaping.serviceType} onChange={(e) => handleCategoryDataChange('landscaping', e)} className="text-xs h-9"/></div>
                  <div className="space-y-2"><Label className="text-xs">Equipment Fee</Label><Input name="equipmentFee" type="number" value={invoice.landscaping.equipmentFee ?? ''} onChange={(e) => handleCategoryDataChange('landscaping', e)} className="text-xs h-9"/></div>
                  <div className="space-y-2"><Label className="text-xs">Disposal Fee</Label><Input name="disposalFee" type="number" value={invoice.landscaping.disposalFee ?? ''} onChange={(e) => handleCategoryDataChange('landscaping', e)} className="text-xs h-9"/></div>
              </CardContent>
          </Card>
      )}

      {invoice.category === "Cleaning Services" && invoice.cleaning && (
          <Card className="bg-card/50 backdrop-blur-sm shadow-lg hover:shadow-primary/20 transition-shadow duration-300">
              <CardHeader><CardTitle className="text-base flex items-center gap-2"><Sparkles className="h-4 w-4" />Cleaning Service Details</CardTitle></CardHeader>
              <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div className="space-y-2"><Label className="text-xs">Cleaning Type</Label><Input name="cleaningType" value={invoice.cleaning.cleaningType} onChange={(e) => handleCategoryDataChange('cleaning', e)} className="text-xs h-9"/></div>
                  <div className="space-y-2"><Label className="text-xs">Number of Rooms</Label><Input name="numberOfRooms" type="number" value={invoice.cleaning.numberOfRooms ?? ''} onChange={(e) => handleCategoryDataChange('cleaning', e)} className="text-xs h-9"/></div>
                  <div className="space-y-2"><Label className="text-xs">Square Footage</Label><Input name="squareFootage" type="number" value={invoice.cleaning.squareFootage ?? ''} onChange={(e) => handleCategoryDataChange('cleaning', e)} className="text-xs h-9"/></div>
                  <div className="space-y-2"><Label className="text-xs">Supplies Fee</Label><Input name="suppliesFee" type="number" value={invoice.cleaning.suppliesFee ?? ''} onChange={(e) => handleCategoryDataChange('cleaning', e)} className="text-xs h-9"/></div>
                  <div className="space-y-2"><Label className="text-xs">Recurring Schedule</Label><Input name="recurringSchedule" value={invoice.cleaning.recurringSchedule} onChange={(e) => handleCategoryDataChange('cleaning', e)} className="text-xs h-9"/></div>
              </CardContent>
          </Card>
      )}
      
       {invoice.category === "Freelance / Agency" && invoice.freelance && (
          <Card className="bg-card/50 backdrop-blur-sm shadow-lg hover:shadow-primary/20 transition-shadow duration-300">
              <CardHeader><CardTitle className="text-base flex items-center gap-2"><Code className="h-4 w-4" />Freelance / Agency Details</CardTitle></CardHeader>
              <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div className="space-y-2 md:col-span-2"><Label className="text-xs">Project Name</Label><Input name="projectName" value={invoice.freelance.projectName} onChange={(e) => handleCategoryDataChange('freelance', e)} className="text-xs h-9"/></div>
                  <div className="space-y-2"><Label className="text-xs">Hourly Rate</Label><Input name="hourlyRate" type="number" value={invoice.freelance.hourlyRate ?? ''} onChange={(e) => handleCategoryDataChange('freelance', e)} className="text-xs h-9"/></div>
                  <div className="space-y-2"><Label className="text-xs">Fixed Rate</Label><Input name="fixedRate" type="number" value={invoice.freelance.fixedRate ?? ''} onChange={(e) => handleCategoryDataChange('freelance', e)} className="text-xs h-9"/></div>
                  <div className="space-y-2"><Label className="text-xs">Hours Logged</Label><Input name="hoursLogged" type="number" value={invoice.freelance.hoursLogged ?? ''} onChange={(e) => handleCategoryDataChange('freelance', e)} className="text-xs h-9"/></div>
                  <div className="space-y-2 md:col-span-2"><Label className="text-xs">Milestone Description</Label><Textarea name="milestoneDescription" value={invoice.freelance.milestoneDescription} onChange={(e) => handleCategoryDataChange('freelance', e)} className="text-xs h-20"/></div>
              </CardContent>
          </Card>
      )}

      {invoice.category === "Consulting" && invoice.consulting && (
          <Card className="bg-card/50 backdrop-blur-sm shadow-lg hover:shadow-primary/20 transition-shadow duration-300">
              <CardHeader><CardTitle className="text-base flex items-center gap-2"><Briefcase className="h-4 w-4" />Consulting Details</CardTitle></CardHeader>
              <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div className="space-y-2"><Label className="text-xs">Consultation Type</Label><Input name="consultationType" value={invoice.consulting.consultationType} onChange={(e) => handleCategoryDataChange('consulting', e)} className="text-xs h-9"/></div>
                  <div className="space-y-2"><Label className="text-xs">Session Hours</Label><Input name="sessionHours" type="number" value={invoice.consulting.sessionHours ?? ''} onChange={(e) => handleCategoryDataChange('consulting', e)} className="text-xs h-9"/></div>
                  <div className="space-y-2"><Label className="text-xs">Retainer Fee</Label><Input name="retainerFee" type="number" value={invoice.consulting.retainerFee ?? ''} onChange={(e) => handleCategoryDataChange('consulting', e)} className="text-xs h-9"/></div>
              </CardContent>
          </Card>
      )}

      {invoice.category === "Legal Services" && invoice.legal && (
          <Card className="bg-card/50 backdrop-blur-sm shadow-lg hover:shadow-primary/20 transition-shadow duration-300">
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
      )}

      {invoice.category === "Medical / Healthcare" && invoice.medical && (
          <Card className="bg-card/50 backdrop-blur-sm shadow-lg hover:shadow-primary/20 transition-shadow duration-300">
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
      )}

      {invoice.category === "Auto Repair" && invoice.autoRepair && (
          <Card className="bg-card/50 backdrop-blur-sm shadow-lg hover:shadow-primary/20 transition-shadow duration-300">
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
      )}

      {invoice.category === "Photography" && invoice.photography && (
          <Card className="bg-card/50 backdrop-blur-sm shadow-lg hover:shadow-primary/20 transition-shadow duration-300">
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
      )}

      {invoice.category === "Real Estate / Property Management" && invoice.realEstate && (
          <Card className="bg-card/50 backdrop-blur-sm shadow-lg hover:shadow-primary/20 transition-shadow duration-300">
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
      )}

      {invoice.category === "Transportation / Trucking" && invoice.transportation && (
          <Card className="bg-card/50 backdrop-blur-sm shadow-lg hover:shadow-primary/20 transition-shadow duration-300">
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
      )}

      {invoice.category === "IT Services / Tech Support" && invoice.itServices && (
          <Card className="bg-card/50 backdrop-blur-sm shadow-lg hover:shadow-primary/20 transition-shadow duration-300">
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
      )}

      {invoice.category === "Rental / Property" && invoice.rental && (
          <Card className="bg-card/50 backdrop-blur-sm shadow-lg hover:shadow-primary/20 transition-shadow duration-300">
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
      )}
      
      <Card className="bg-card/50 backdrop-blur-sm shadow-lg hover:shadow-primary/20 transition-shadow duration-300">
        <CardHeader>
          <CardTitle className="text-base">Items</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
           {/* Presets UI */}
            <div className="p-3 border rounded-lg bg-background/50 space-y-3">
              <Label className="font-semibold text-sm">Line Item Presets</Label>
              <div className="flex flex-wrap items-end gap-2">
                <div className="flex-grow space-y-2">
                    <Label htmlFor="preset-select" className="text-xs text-muted-foreground">Load a saved group of items</Label>
                    <Select value={selectedPreset} onValueChange={setSelectedPreset} disabled={presets.length === 0}>
                        <SelectTrigger id="preset-select" className="h-9 text-xs">
                            <SelectValue placeholder="Select a preset..." />
                        </SelectTrigger>
                        <SelectContent>
                            {presets.map((p, index) => <SelectItem key={`${p.name}-${index}`} value={p.name}>{p.name}</SelectItem>)}
                        </SelectContent>
                    </Select>
                </div>
                
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                      <Button variant="secondary" size="sm" disabled={!selectedPreset} className="text-xs">Load Preset</Button>
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
                    <Button variant="destructive" size="sm" disabled={!selectedPreset} className="text-xs"><Trash2 className="mr-2 h-3 w-3" />Delete</Button>
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
                    <Button variant="outline" size="sm" className="text-xs"><Save className="mr-2 h-3 w-3" /> Save as Preset</Button>
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

          <div className="hidden md:grid md:grid-cols-[1fr_1.5fr_60px_100px_100px_auto] gap-x-4 text-xs font-medium text-muted-foreground items-center">
            <Label>Item</Label>
            <Label>Description</Label>
            <Label>Qty</Label>
            <Label>Unit Price</Label>
            <Label className="text-right">Subtotal</Label>
            <span></span>
          </div>
          {invoice.lineItems.map((item, index) => (
            <div key={item.id} className="grid grid-cols-1 md:grid-cols-[1fr_1.5fr_60px_100px_100px_auto] gap-x-4 gap-y-2 items-start border-b pb-3">
              <div className="space-y-2">
                 <Label htmlFor={`itemName-${index}`} className="text-xs md:hidden">Item</Label>
                <Input id={`itemName-${index}`} placeholder="Item" value={item.name} onChange={(e) => handleItemChange(index, 'name', e.target.value)} className="h-9 text-xs"/>
              </div>
              <div className="space-y-2">
                <Label htmlFor={`itemDescription-${index}`} className="text-xs md:hidden">Description</Label>
                <Textarea id={`itemDescription-${index}`} placeholder="Additional details" value={item.description} onChange={(e) => handleItemChange(index, 'description', e.target.value)} className="h-9 min-h-9 text-xs"/>
              </div>
              <div className="grid grid-cols-2 md:contents gap-3">
                <div className="space-y-2">
                  <Label htmlFor={`itemQuantity-${index}`} className="text-xs md:hidden">Qty</Label>
                  <Input id={`itemQuantity-${index}`} type="number" value={item.quantity} onChange={(e) => handleItemChange(index, 'quantity', parseFloat(e.target.value) || 0)} className="w-full h-9 text-xs" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor={`itemRate-${index}`} className="text-xs md:hidden">Unit Price</Label>
                  <Input id={`itemRate-${index}`} type="number" value={item.unitPrice || 0} onChange={(e) => handleItemChange(index, 'unitPrice', parseFloat(e.target.value) || 0)} className="w-full h-9 text-xs" />
                </div>
              </div>

              <div className="flex items-center h-9 justify-end">
                <p className="font-medium tabular-nums text-sm">{currencySymbol}{(item.quantity * (item.unitPrice || 0)).toFixed(2)}</p>
              </div>
              <div className="flex items-center h-9 justify-end">
                <Button variant="ghost" size="icon" onClick={() => removeItem(index)} className="h-8 w-8">
                  <Trash2 className="h-4 w-4 text-destructive" />
                </Button>
              </div>
            </div>
          ))}
          <div className="flex flex-wrap items-end gap-2 pt-3 border-t">
            <Button variant="outline" size="sm" onClick={addItem} className="text-xs"><Plus className="mr-2 h-3 w-3" /> Add Item</Button>
            <div className="flex items-end gap-2">
                <div className="space-y-2">
                    <Label htmlFor="bulk-add-count" className="text-xs">Quantity</Label>
                    <Input 
                        id="bulk-add-count" 
                        type="number" 
                        value={bulkAddCount} 
                        onChange={(e) => setBulkAddCount(Number(e.target.value))}
                        className="w-20 h-9 text-xs"
                        min="1"
                        max="50"
                    />
                </div>
                <Button variant="outline" size="sm" onClick={handleBulkAddItem} className="text-xs">
                    <Plus className="mr-2 h-3 w-3" /> Add Multiple
                </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-card/50 backdrop-blur-sm shadow-lg hover:shadow-primary/20 transition-shadow duration-300">
        <CardHeader>
          <CardTitle className="text-base">Totals &amp; Notes</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div className="space-y-2">
              <Label htmlFor="tax" className="text-xs">Tax (%)</Label>
              <Input id="tax" name="summary.taxPercentage" type="number" value={invoice.summary.taxPercentage} onChange={handleNumberChange} className="h-9 text-xs" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="discount" className="text-xs">Discount (Fixed Amount)</Label>
              <Input id="discount" name="summary.discount" type="number" value={invoice.summary.discount} onChange={handleNumberChange} className="h-9 text-xs" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="shippingCost" className="text-xs">Shipping Cost</Label>
                <div className="relative flex items-center">
                  <Truck className="absolute left-3 h-4 w-4 text-muted-foreground" />
                  <Input id="shippingCost" name="summary.shippingCost" type="number" value={invoice.summary.shippingCost} onChange={handleNumberChange} className="pl-9 h-9 text-xs"/>
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="amountPaid" className="text-xs">Amount Paid</Label>
                <div className="relative flex items-center">
                  <Wallet className="absolute left-3 h-4 w-4 text-muted-foreground" />
                  <Input id="amountPaid" name="amountPaid" type="number" value={invoice.amountPaid || 0} onChange={(e) => setInvoice(p => ({...p, amountPaid: parseFloat(e.target.value) || 0}))} className="pl-9 h-9 text-xs"/>
              </div>
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="paymentInstructions" className="text-xs">Payment Instructions / Notes</Label>
            <Textarea id="paymentInstructions" name="paymentInstructions" value={invoice.paymentInstructions} onChange={handleInputChange} className="text-xs" />
          </div>
          <div className="space-y-2">
            <Label className="text-xs">Authorized Signature</Label>
            <div className="flex gap-2">
                <Dialog open={isSignatureDialogOpen} onOpenChange={setIsSignatureDialogOpen}>
                    <DialogTrigger asChild>
                        <Button variant="outline" className="w-full text-xs h-9">
                            <Pencil className="mr-2 h-3 w-3" />
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
                    <Button variant="destructive" size="sm" onClick={handleDeleteSignature} className="text-xs h-9">
                        <Trash2 className="mr-2 h-3 w-3" />
                        Delete
                    </Button>
                )}
            </div>
            {invoice.business.ownerSignature && (
                <div className="p-2 border rounded-md bg-muted/50">
                    <Image src={invoice.business.ownerSignature.image} alt="Owner Signature" width={100} height={50} />
                </div>
            )}
        </div>
        </CardContent>
      </Card>
    </div>
  );
}
