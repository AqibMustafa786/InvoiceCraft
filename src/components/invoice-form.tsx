'use client';

import { ChangeEvent, Dispatch, SetStateAction, useState, useEffect } from 'react';
import type { Invoice, LineItem, InvoiceCategory, CustomField } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { DatePicker } from '@/components/ui/datepicker';
import { ImageUp, Plus, Trash2, Palette, X, Mail, Truck, Hash, Wallet, Phone, Globe, Briefcase, Award, User, FileText, Building, Pencil, Type, Package, Hammer, Ruler, ListTree, CheckSquare, Sparkles, Calendar, TextQuote, Wind, Thermometer, Wrench, Zap, Trees, Droplets, Car, Code, DraftingCompass, PaintBucket, Paintbrush, Receipt, Scale, Hospital, HeartPulse, HardHat, Save, Loader2, Camera, MoreVertical, PlusCircle, Store, ChevronDown } from 'lucide-react';
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
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from './ui/collapsible';
import { CategorySpecificFormFields } from './invoice-templates/category-specific-fields';

interface InvoiceFormProps {
  invoice: Invoice;
  setInvoice: Dispatch<SetStateAction<Invoice | null>>;
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

interface CustomFieldPreset {
  name: string;
  fields: Omit<CustomField, 'id'>[];
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

  const [customFieldPresets, setCustomFieldPresets] = useState<CustomFieldPreset[]>([]);
  const [selectedCustomFieldPreset, setSelectedCustomFieldPreset] = useState<string>('');
  const [isSaveCustomFieldPresetOpen, setIsSaveCustomFieldPresetOpen] = useState(false);
  const [newCustomFieldPresetName, setNewCustomFieldPresetName] = useState('');

  // Load presets from localStorage on mount
  useEffect(() => {
    try {
      const savedPresets = localStorage.getItem('lineItemPresets');
      if (savedPresets) {
        setPresets(JSON.parse(savedPresets));
      }
      const savedCustomFieldPresets = localStorage.getItem('customFieldPresets');
      if (savedCustomFieldPresets) {
        setCustomFieldPresets(JSON.parse(savedCustomFieldPresets));
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
    setInvoice(prev => prev ? ({
      ...prev,
      [section]: {
        ...prev[section],
        [name]: value
      }
    }) : null);
  };

  const handleCategoryDataChange = (category: keyof Invoice, e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    const isCheckbox = type === 'checkbox';
    
    setInvoice(prev => prev ? ({
        ...prev,
        [category]: {
            ...(prev as any)[category],
            [name]: isCheckbox ? (e.target as HTMLInputElement).checked : (type === 'number' ? parseFloat(value) || null : value)
        }
    }) : null);
  };

   const handleCategorySelectChange = (category: keyof Invoice, name: string, value: string | boolean | number | null) => {
     setInvoice(prev => prev ? ({
        ...prev,
        [category]: {
            ...(prev as any)[category],
            [name]: value
        }
    }) : null);
  };
  
  const handleDateChange = (category: keyof Invoice, name: string, date: Date | undefined) => {
      setInvoice(prev => prev ? ({
          ...prev,
          [category]: {
              ...(prev as any)[category],
              [name]: date
          }
      }) : null);
  };


  const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setInvoice(prev => prev ? ({ ...prev, [name]: value }) : null);
  };
  
  const handleCurrencyChange = (value: string) => {
    setInvoice(prev => prev ? ({ ...prev, currency: value }) : null);
  }

  const handleLanguageChange = (value: string) => {
    setInvoice(prev => prev ? ({ ...prev, language: value }) : null);
  };

  const handleNumberChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const [section, field] = name.split('.');
    if (section === 'summary') {
        setInvoice(prev => prev ? ({
        ...prev,
        [section as 'summary']: {
            ...prev[section as 'summary'],
            [field]: parseFloat(value) || 0,
        }
        }) : null);
    } else {
        setInvoice(prev => prev ? ({ ...prev, [name]: parseFloat(value) || 0 }) : null);
    }
  }

  const handleItemChange = (index: number, field: keyof Omit<LineItem, 'id'>, value: string | number | boolean) => {
    setInvoice(prev => {
        if (!prev) return null;
        const newItems = [...prev.lineItems];
        (newItems[index] as any)[field] = value;
        return { ...prev, lineItems: newItems };
    });
  };

  const addItem = () => {
    if (!invoice) return;
     if (invoice.lineItems.length >= 50) {
       toast({
        title: "Item Limit Reached",
        description: "You cannot add more than 50 items to a single invoice.",
        variant: "destructive",
      });
      return;
    }
    setInvoice(prev => prev ? ({
      ...prev,
      lineItems: [...prev.lineItems, { id: crypto.randomUUID(), name: '', description: '', quantity: 1, unitPrice: 0, taxable: false }],
    }) : null);
  };
  
  const handleBulkAddItem = () => {
    if (!invoice) return;
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

    setInvoice(prev => prev ? ({
      ...prev,
      lineItems: [...prev.lineItems, ...newItems],
    }) : null);
  };

  const removeItem = (index: number) => {
    if (!invoice) return;
    const newItems = invoice.lineItems.filter((_, i) => i !== index);
    setInvoice(prev => prev ? ({ ...prev, lineItems: newItems }) : null);
  };

  const handleRemoveLogo = () => {
    setInvoice(prev => prev ? ({
        ...prev,
        business: {
            ...prev.business,
            logoUrl: ''
        }
    }) : null);
  };
  
  const handleOwnerSignatureSave = (image: string, signerName: string) => {
    setInvoice(prev => prev ? ({
        ...prev,
        business: {
            ...prev.business,
            ownerSignature: {
                image,
                signerName,
                signedAt: new Date(),
            }
        }
    }) : null);
    setIsSignatureDialogOpen(false);
  };
  
  const handleDeleteSignature = () => {
    if (!invoice) return;
    const { ownerSignature, ...businessRest } = invoice.business;
    setInvoice(prev => prev ? ({
      ...prev,
      business: {
        ...businessRest
      }
    }) : null);
  };

  const handleSavePreset = () => {
    if (!invoice) return;
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
    if (!invoice) return;
    if (!selectedPreset) return;
    const preset = presets.find(p => p.name === selectedPreset);
    if (preset) {
      const newItems = preset.items.map(item => ({ ...item, id: crypto.randomUUID() }));
      setInvoice(prev => prev ? ({ ...prev, lineItems: [...prev.lineItems, ...newItems] }) : null);
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

  const handleCustomFieldChange = (index: number, field: 'label' | 'value', value: string) => {
    if (!invoice) return;
    const newFields = [...(invoice.customFields || [])];
    newFields[index] = { ...newFields[index], [field]: value };
    setInvoice(prev => prev ? ({ ...prev, customFields: newFields }) : null);
  };

  const addCustomField = () => {
    setInvoice(prev => prev ? ({
      ...prev,
      customFields: [...(prev.customFields || []), { id: crypto.randomUUID(), label: '', value: '' }]
    }) : null);
  };

  const removeCustomField = (index: number) => {
    if (!invoice) return;
    setInvoice(prev => prev ? ({
      ...prev,
      customFields: (prev.customFields || []).filter((_, i) => i !== index)
    }) : null);
  };

  const handleSaveCustomFieldPreset = () => {
    if (!invoice) return;
    if (!newCustomFieldPresetName.trim()) {
      toast({ title: 'Preset Name Required', description: 'Please enter a name for the custom field preset.', variant: 'destructive' });
      return;
    }
    const newPreset: CustomFieldPreset = {
      name: newCustomFieldPresetName.trim(),
      fields: (invoice.customFields || []).map(({ id, ...field }) => field),
    };
    const updatedPresets = [...customFieldPresets, newPreset];
    setCustomFieldPresets(updatedPresets);
    localStorage.setItem('customFieldPresets', JSON.stringify(updatedPresets));
    toast({ title: 'Custom Field Preset Saved', description: `"${newPreset.name}" has been saved.` });
    setIsSaveCustomFieldPresetOpen(false);
    setNewCustomFieldPresetName('');
  };

  const handleLoadCustomFieldPreset = () => {
    if (!invoice) return;
    if (!selectedCustomFieldPreset) return;
    const preset = customFieldPresets.find(p => p.name === selectedCustomFieldPreset);
    if (preset) {
      const newFields = preset.fields.map(field => ({ ...field, id: crypto.randomUUID() }));
      setInvoice(prev => prev ? ({ ...prev, customFields: [...(prev.customFields || []), ...newFields] }) : null);
      toast({ title: 'Custom Field Preset Loaded', description: `Fields from "${selectedCustomFieldPreset}" have been added.` });
    }
  };

  const handleDeleteCustomFieldPreset = () => {
    if (!selectedCustomFieldPreset) return;
    const updatedPresets = customFieldPresets.filter(p => p.name !== selectedCustomFieldPreset);
    setCustomFieldPresets(updatedPresets);
    localStorage.setItem('customFieldPresets', JSON.stringify(updatedPresets));
    toast({ title: 'Custom Field Preset Deleted', description: `"${selectedCustomFieldPreset}" has been deleted.` });
    setSelectedCustomFieldPreset('');
  };


  const currencySymbol = currencies.find(c => c.value === invoice?.currency)?.label.split(' ')[1] || '$';

  if (!invoice) {
      return null;
  }

  return (
    <div className="space-y-6">
      <Collapsible defaultOpen>
        <Card className="bg-card/50 backdrop-blur-sm shadow-lg hover:shadow-primary/20 transition-shadow duration-300">
          <CollapsibleTrigger asChild>
            <CardHeader className="flex flex-row items-center justify-between cursor-pointer">
              <CardTitle className="text-base">Branding &amp; Customization</CardTitle>
              <ChevronDown className="h-4 w-4 shrink-0 transition-transform duration-200 group-data-[state=open]:rotate-180" />
            </CardHeader>
          </CollapsibleTrigger>
          <CollapsibleContent>
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
                                setInvoice(prev => prev ? ({...prev, backgroundColor: e.target.value }) : null);
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
                                setInvoice(prev => prev ? ({...prev, textColor: e.target.value }) : null);
                            }}
                            className="absolute right-1 top-1/2 -translate-y-1/2 h-7 w-7 p-1 rounded-md cursor-pointer bg-transparent border-none appearance-none"
                        />
                    </div>
                </div>
                <div className="space-y-2">
                    <Label htmlFor="fontFamily" className="text-xs">Font Family</Label>
                    <Select value={invoice.fontFamily} onValueChange={(value) => setInvoice(p => p ? ({...p, fontFamily: value}) : null)}>
                        <SelectTrigger id="fontFamily" className="h-9 text-xs">
                            <SelectValue placeholder="Select font" />
                        </SelectTrigger>
                        <SelectContent>
                            {fonts.map(font => <SelectItem key={font.value} value={font.value}>{font.label}</SelectItem>)}
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
              <CardTitle className="text-base">Bill From</CardTitle>
              <ChevronDown className="h-4 w-4 shrink-0 transition-transform duration-200 group-data-[state=open]:rotate-180" />
            </CardHeader>
          </CollapsibleTrigger>
          <CollapsibleContent>
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
          </CollapsibleContent>
        </Card>
      </Collapsible>

      <Collapsible defaultOpen>
        <Card className="bg-card/50 backdrop-blur-sm shadow-lg hover:shadow-primary/20 transition-shadow duration-300">
          <CollapsibleTrigger asChild>
            <CardHeader className="flex flex-row items-center justify-between cursor-pointer">
              <CardTitle className="text-base">Bill To</CardTitle>
              <ChevronDown className="h-4 w-4 shrink-0 transition-transform duration-200 group-data-[state=open]:rotate-180" />
            </CardHeader>
          </CollapsibleTrigger>
          <CollapsibleContent>
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
          </CollapsibleContent>
        </Card>
      </Collapsible>
      
      <Collapsible defaultOpen>
        <Card className="bg-card/50 backdrop-blur-sm shadow-lg hover:shadow-primary/20 transition-shadow duration-300">
          <CollapsibleTrigger asChild>
            <CardHeader className="flex flex-row items-center justify-between cursor-pointer">
              <CardTitle className="text-base">Invoice Details</CardTitle>
              <ChevronDown className="h-4 w-4 shrink-0 transition-transform duration-200 group-data-[state=open]:rotate-180" />
            </CardHeader>
          </CollapsibleTrigger>
          <CollapsibleContent>
            <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="category" className="text-xs">Invoice Category</Label>
                <div className="relative flex items-center">
                    <Package className="absolute left-3 h-4 w-4 text-muted-foreground z-10" />
                    <Select
                        value={invoice.category}
                        onValueChange={(value: InvoiceCategory) => setInvoice(p => p ? ({ ...p, category: value }) : null)}
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
                <DatePicker date={invoice.invoiceDate} setDate={(date) => setInvoice(p => p ? ({ ...p, invoiceDate: date! }) : null)} className="h-9 text-xs" />
              </div>
              <div className="space-y-2">
                <Label className="text-xs">Due Date</Label>
                <DatePicker date={invoice.dueDate} setDate={(date) => setInvoice(p => p ? ({ ...p, dueDate: date! }) : null)} className="h-9 text-xs"/>
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
          </CollapsibleContent>
        </Card>
      </Collapsible>
      
      <CategorySpecificFormFields
        invoice={invoice}
        handleCategoryDataChange={handleCategoryDataChange}
        handleCategorySelectChange={handleCategorySelectChange}
        handleDateChange={handleDateChange}
      />
      
      <Collapsible defaultOpen>
        <Card className="bg-card/50 backdrop-blur-sm shadow-lg">
          <CollapsibleTrigger asChild>
            <CardHeader className="flex flex-row items-center justify-between cursor-pointer">
              <CardTitle className="text-base">Advanced Fields</CardTitle>
              <ChevronDown className="h-4 w-4 shrink-0 transition-transform duration-200 group-data-[state=open]:rotate-180" />
            </CardHeader>
          </CollapsibleTrigger>
          <CollapsibleContent>
            <CardContent className="space-y-4">
              <div className="p-3 border rounded-lg bg-background/50 space-y-3">
                <Label className="font-semibold text-sm">Custom Field Presets</Label>
                <div className="flex flex-wrap items-end gap-2">
                  <div className="flex-grow space-y-2">
                      <Label htmlFor="cf-preset-select" className="text-xs text-muted-foreground">Load a saved group of fields</Label>
                      <Select value={selectedCustomFieldPreset} onValueChange={setSelectedCustomFieldPreset} disabled={customFieldPresets.length === 0}>
                          <SelectTrigger id="cf-preset-select" className="h-9 text-xs">
                              <SelectValue placeholder="Select a preset..." />
                          </SelectTrigger>
                          <SelectContent>
                              {customFieldPresets.map((p, index) => <SelectItem key={`${p.name}-${index}`} value={p.name}>{p.name}</SelectItem>)}
                          </SelectContent>
                      </Select>
                  </div>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                        <Button variant="secondary" size="sm" disabled={!selectedCustomFieldPreset} className="text-xs">Load Preset</Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                        <AlertDialogHeader><AlertDialogTitle>Add fields from preset?</AlertDialogTitle><AlertDialogDescription>This will add the fields to your current list.</AlertDialogDescription></AlertDialogHeader>
                        <AlertDialogFooter><AlertDialogCancel>Cancel</AlertDialogCancel><AlertDialogAction onClick={handleLoadCustomFieldPreset}>Load</AlertDialogAction></AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button variant="destructive" size="sm" disabled={!selectedCustomFieldPreset} className="text-xs"><Trash2 className="mr-2 h-3 w-3" />Delete</Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                        <AlertDialogHeader><AlertDialogTitle>Delete this preset?</AlertDialogTitle><AlertDialogDescription>This will permanently delete the "{selectedCustomFieldPreset}" preset. This action cannot be undone.</AlertDialogDescription></AlertDialogHeader>
                        <AlertDialogFooter><AlertDialogCancel>Cancel</AlertDialogCancel><AlertDialogAction onClick={handleDeleteCustomFieldPreset}>Delete</AlertDialogAction></AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                  <Dialog open={isSaveCustomFieldPresetOpen} onOpenChange={setIsSaveCustomFieldPresetOpen}>
                    <DialogTrigger asChild>
                      <Button variant="outline" size="sm" className="text-xs" disabled={(invoice.customFields || []).length === 0}><Save className="mr-2 h-3 w-3" /> Save as Preset</Button>
                    </DialogTrigger>
                    <DialogContent>
                        <DialogHeader><DialogTitle>Save Custom Field Preset</DialogTitle><DialogDescription>Save the current custom fields for future use.</DialogDescription></DialogHeader>
                        <div className="space-y-2"><Label htmlFor="cf-preset-name">Preset Name</Label><Input id="cf-preset-name" value={newCustomFieldPresetName} onChange={(e) => setNewCustomFieldPresetName(e.target.value)} placeholder="e.g., Standard Project Info"/></div>
                        <DialogFooter><DialogClose asChild><Button variant="ghost">Cancel</Button></DialogClose><Button onClick={handleSaveCustomFieldPreset}>Save Preset</Button></DialogFooter>
                    </DialogContent>
                  </Dialog>
                </div>
              </div>

              {(invoice.customFields || []).map((field, index) => (
                <div key={field.id} className="grid grid-cols-[1fr_2fr_auto] gap-2 items-center">
                    <Input 
                      placeholder="Label (e.g. 'Project ID')" 
                      value={field.label}
                      onChange={(e) => handleCustomFieldChange(index, 'label', e.target.value)}
                      className="h-9 text-xs"
                    />
                    <Input 
                      placeholder="Value" 
                      value={field.value}
                      onChange={(e) => handleCustomFieldChange(index, 'value', e.target.value)}
                      className="h-9 text-xs"
                    />
                    <Button variant="ghost" size="icon" onClick={() => removeCustomField(index)} className="h-8 w-8">
                      <Trash2 className="h-4 w-4 text-destructive"/>
                    </Button>
                </div>
              ))}
              <Button variant="outline" size="sm" onClick={addCustomField} className="text-xs">
                  <PlusCircle className="h-4 w-4 mr-2"/>
                  Add Custom Field
              </Button>
            </CardContent>
          </CollapsibleContent>
        </Card>
      </Collapsible>

      <Collapsible defaultOpen>
        <Card className="bg-card/50 backdrop-blur-sm shadow-lg hover:shadow-primary/20 transition-shadow duration-300">
          <CollapsibleTrigger asChild>
            <CardHeader className="flex flex-row items-center justify-between cursor-pointer">
              <CardTitle className="text-base">Items</CardTitle>
              <ChevronDown className="h-4 w-4 shrink-0 transition-transform duration-200 group-data-[state=open]:rotate-180" />
            </CardHeader>
          </CollapsibleTrigger>
          <CollapsibleContent>
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
                        <AlertDialogFooter><AlertDialogCancel>Cancel</AlertDialogCancel><AlertDialogAction onClick={handleLoadPreset}>Load</AlertDialogAction></AlertDialogFooter>
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
                        <AlertDialogFooter><AlertDialogCancel>Cancel</AlertDialogCancel><AlertDialogAction onClick={handleDeletePreset}>Delete</AlertDialogAction></AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>

                  <Dialog open={isSavePresetOpen} onOpenChange={setIsSavePresetOpen}>
                    <DialogTrigger asChild>
                      <Button variant="outline" size="sm" className="text-xs" disabled={invoice.lineItems.length === 0}><Save className="mr-2 h-3 w-3" /> Save as Preset</Button>
                    </DialogTrigger>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Save Line Item Preset</DialogTitle>
                            <DialogDescription>
                                Save the current set of line items for quick use in the future.
                            </DialogDescription>
                        </DialogHeader>
                        <div className="space-y-2"><Label htmlFor="preset-name">Preset Name</Label><Input id="preset-name" value={newPresetName} onChange={(e) => setNewPresetName(e.target.value)} placeholder="e.g., Standard Website Package"/></div>
                        <DialogFooter><DialogClose asChild><Button variant="ghost">Cancel</Button></DialogClose><Button onClick={handleSavePreset}>Save Preset</Button></DialogFooter>
                    </DialogContent>
                  </Dialog>
                </div>
              </div>

            <div className="hidden md:grid md:grid-cols-[1.5fr_4fr_1fr_1.5fr_1.5fr_auto] gap-x-4 text-xs font-medium text-muted-foreground items-center">
              <Label>Item</Label>
              <Label>Description</Label>
              <Label>Qty</Label>
              <Label>Unit Price</Label>
              <Label className="text-right">Subtotal</Label>
              <span></span>
            </div>
            {invoice.lineItems.map((item, index) => (
              <div key={item.id} className="grid grid-cols-1 md:grid-cols-[1.5fr_4fr_1fr_1.5fr_1.5fr_auto] gap-x-4 gap-y-2 items-start border-b pb-3">
                <div className="space-y-2">
                  <Label htmlFor={`itemName-${index}`} className="text-xs md:hidden">Item</Label>
                  <Textarea id={`itemName-${index}`} placeholder="Item" value={item.name} onChange={(e) => handleItemChange(index, 'name', e.target.value)} className="text-xs min-h-9" rows={1}/>
                </div>
                <div className="space-y-2">
                  <Label htmlFor={`itemDescription-${index}`} className="text-xs md:hidden">Description</Label>
                  <Textarea id={`itemDescription-${index}`} placeholder="Additional details" value={item.description || ''} onChange={(e) => handleItemChange(index, 'description', e.target.value)} className="text-xs min-h-9" rows={1}/>
                </div>
                <div className="grid grid-cols-2 md:contents gap-3">
                  <div className="space-y-2">
                    <Label htmlFor={`itemQuantity-${index}`} className="text-xs md:hidden">Qty</Label>
                    <Input id={`itemQuantity-${index}`} type="number" value={item.quantity} onChange={(e) => handleItemChange(index, 'quantity', parseFloat(e.target.value) || 0)} className="w-full h-9 text-xs" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor={`itemRate-${index}`} className="text-xs md:hidden">Unit Price</Label>
                    <Input id={`itemRate-${index}`} type="number" value={invoice.lineItems[index].unitPrice || 0} onChange={(e) => handleItemChange(index, 'unitPrice', parseFloat(e.target.value) || 0)} className="w-full h-9 text-xs" />
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
          </CollapsibleContent>
        </Card>
      </Collapsible>
      
      <Collapsible defaultOpen>
        <Card className="bg-card/50 backdrop-blur-sm shadow-lg hover:shadow-primary/20 transition-shadow duration-300">
          <CollapsibleTrigger asChild>
            <CardHeader className="flex flex-row items-center justify-between cursor-pointer">
              <CardTitle className="text-base">Totals &amp; Notes</CardTitle>
              <ChevronDown className="h-4 w-4 shrink-0 transition-transform duration-200 group-data-[state=open]:rotate-180" />
            </CardHeader>
          </CollapsibleTrigger>
          <CollapsibleContent>
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
                      <Input id="amountPaid" name="amountPaid" type="number" value={invoice.amountPaid || 0} onChange={(e) => setInvoice(p => p ? ({...p, amountPaid: parseFloat(e.target.value) || 0}) : null)} className="pl-9 h-9 text-xs"/>
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
          </CollapsibleContent>
        </Card>
      </Collapsible>
    </div>
  );
}
