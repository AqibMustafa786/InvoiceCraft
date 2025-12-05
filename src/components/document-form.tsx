

'use client';

import { ChangeEvent, Dispatch, SetStateAction, useState, useEffect } from 'react';
import type { Estimate, LineItem, Quote, EstimateCategory, HomeRemodelingInfo, RoofingInfo, HVACInfo, PlumbingInfo, ElectricalInfo, LandscapingInfo, CleaningInfo, AutoRepairInfo, ConstructionInfo, ITFreelanceInfo } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { DatePicker } from '@/components/ui/datepicker';
import { ImageUp, Plus, Trash2, Palette, X, Mail, Truck, Hash, Phone, Globe, Briefcase, Award, User, FileText, Building, Pencil, Type, Package, Hammer, Ruler, ListTree, CheckSquare, Sparkles, Calendar, TextQuote, Wind, Thermometer, Wrench, Zap, Trees, Droplets, Car, Code, DraftingCompass, PaintBucket, Paintbrush, Save } from 'lucide-react';
import Image from 'next/image';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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
import { Checkbox } from '@/components/ui/checkbox';
import { SignaturePad } from './signature-pad';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogDescription,
  DialogClose,
  DialogFooter
} from "@/components/ui/dialog";
import { serverTimestamp } from 'firebase/firestore';
import { RadioGroup, RadioGroupItem } from './ui/radio-group';

interface DocumentFormProps {
  document: Estimate | Quote;
  setDocument: Dispatch<SetStateAction<Estimate | Quote>>;
  accentColor: string;
  setAccentColor: Dispatch<SetStateAction<string>>;
  backgroundColor: string;
  setBackgroundColor: Dispatch<SetStateAction<string>>;
  textColor: string;
  setTextColor: Dispatch<SetStateAction<string>>;
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

const roofMaterials = [
    "Asphalt Shingle", "Architectural Shingle", "3-Tab Shingle", "Metal Roofing – Standing Seam", 
    "Metal – Corrugated Panels", "Metal Shingles", "Clay Tile", "Concrete Tile", "Slate", 
    "Synthetic Slate", "Wood Shingles / Shakes", "TPO", "EPDM", "PVC", "Modified Bitumen", 
    "Built-Up (BUR)", "Stone-Coated Steel"
];

const shingleBrands = ["GAF", "Owens Corning", "CertainTeed", "Tamko", "IKO", "Atlas", "Malarkey"];
const underlaymentTypes = ["Synthetic Underlayment", "15# Felt", "30# Felt", "Ice & Water Shield (Full Roof)", "Ice & Water Shield (Eaves Only)"];

interface Preset {
  name: string;
  items: Omit<LineItem, 'id'>[];
}

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


export function DocumentForm({ document, setDocument, accentColor, setAccentColor, backgroundColor, setBackgroundColor, textColor, setTextColor, toast, documentType }: DocumentFormProps) {
  const [bulkAddCount, setBulkAddCount] = useState(5);
  const [accentColorInput, setAccentColorInput] = useState(accentColor);
  const [bgColorInput, setBgColorInput] = useState(backgroundColor);
  const [textColorInput, setTextColorInput] = useState(textColor);
  const [logoUrl, setLogoUrl] = useState<string | null>(document.business.logoUrl || null);
  const [isSignatureDialogOpen, setIsSignatureDialogOpen] = useState(false);
  const [cleaningAddOns, setCleaningAddOns] = useState<string[]>(document.cleaning?.addOns || []);
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

  useEffect(() => {
     setDocument(prev => ({ ...prev, backgroundColor: backgroundColor }));
  }, [backgroundColor, setDocument]);

  useEffect(() => {
    setDocument(prev => ({ ...prev, textColor: textColor }));
 }, [textColor, setDocument]);


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

  const handleCategorySelectChange = (category: 'homeRemodeling' | 'roofing' | 'hvac' | 'plumbing' | 'electrical' | 'landscaping' | 'cleaning' | 'autoRepair' | 'construction' | 'itFreelance', name: string, value: string | boolean | number | null) => {
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
  
  const handleDeleteSignature = () => {
    const { ownerSignature, ...businessRest } = document.business;
    setDocument(prev => ({
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
      items: document.lineItems.map(({ id, ...item }) => item), // Exclude IDs
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
      setDocument(prev => ({ ...prev, lineItems: [...prev.lineItems, ...newItems] }));
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
                            {fonts.map((font, index) => <SelectItem key={`${font.value}-${index}`} value={font.value}>{font.label}</SelectItem>)}
                        </SelectContent>
                    </Select>
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
                            <Input id="businessTaxId" name="taxId" value={document.business.taxId ?? ''} onChange={(e) => handleNestedChange('business', e)} className="pl-10" />
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
                <Textarea id="projectLocation" name="projectLocation" value={document.client.projectLocation ?? ''} onChange={(e) => handleNestedChange('client', e)} />
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
                            {categories.map((cat, index) => <SelectItem key={`${cat}-${index}`} value={cat}>{cat}</SelectItem>)}
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
                            {currencies.map((c, index) => <SelectItem key={`${c.value}-${index}`} value={c.value}>{c.label}</SelectItem>)}
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
                <CardHeader><CardTitle>Roofing Project Details</CardTitle></CardHeader>
                <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2"><Label>Roof Material</Label><CustomSelect name="roofMaterial" value={document.roofing.roofMaterial} onValueChange={(name, value) => handleCategorySelectChange('roofing', name, value)} options={roofMaterials} placeholder="Select material" /></div>
                    <div className="space-y-2"><Label>Shingle/Material Brand</Label><CustomSelect name="shingleBrand" value={document.roofing.shingleBrand} onValueChange={(name, value) => handleCategorySelectChange('roofing', name, value)} options={shingleBrands} placeholder="Select a brand" /></div>
                    <div className="space-y-2"><Label>Roof Size (sq ft)</Label><Input name="roofSize" type="number" value={document.roofing.roofSize ?? ''} onChange={(e) => handleCategorySelectChange('roofing', 'roofSize', e.target.value ? parseFloat(e.target.value) : null)} /></div>
                    <div className="space-y-2"><Label>Number of layers to remove</Label><CustomSelect name="layersToRemove" value={document.roofing.layersToRemove} onValueChange={(name, value) => handleCategorySelectChange('roofing', name, value)} options={['1 layer', '2 layers', '3+ layers']} placeholder="Select layers" /></div>
                    <div className="space-y-2"><Label>Roof Pitch</Label><CustomSelect name="roofPitch" value={document.roofing.roofPitch} onValueChange={(name, value) => handleCategorySelectChange('roofing', name, value)} options={['Low (1/12 - 4/12)', 'Medium (5/12 – 7/12)', 'Steep (8/12+)']} placeholder="Select pitch" /></div>
                    <div className="space-y-2"><Label>Underlayment Type</Label><CustomSelect name="underlaymentType" value={document.roofing.underlaymentType} onValueChange={(name, value) => handleCategorySelectChange('roofing', name, value)} options={underlaymentTypes} placeholder="Select underlayment" /></div>
                    <div className="space-y-2"><Label>Flashing Details</Label><Input name="flashingDetails" value={document.roofing.flashingDetails} onChange={(e) => handleCategoryDataChange('roofing', e)} placeholder="e.g., Step, Counter, Apron" /></div>
                    <div className="space-y-2"><Label>Ventilation Details</Label><Input name="ventilationSystem" value={document.roofing.ventilationSystem} onChange={(e) => handleCategoryDataChange('roofing', e)} placeholder="e.g., Ridge vent, Soffit vents" /></div>
                    <div className="space-y-2"><Label>Warranty</Label><Input name="warranty" value={document.roofing.warranty} onChange={(e) => handleCategoryDataChange('roofing', e)} placeholder="e.g. 5 Year Workmanship" /></div>
                    <div className="space-y-2"><Label>Estimated Timeline</Label><Input name="estimatedTimeline" value={document.roofing.estimatedTimeline} onChange={(e) => handleCategoryDataChange('roofing', e)} placeholder="e.g. 2-3 days, weather permitting" /></div>
                    <div className="space-y-2"><Label>Gutter Repair/Replacement</Label><RadioGroup value={document.roofing.gutterRepairNeeded ? 'Yes' : 'No'} onValueChange={(v) => handleCategorySelectChange('roofing', 'gutterRepairNeeded', v === 'Yes')} className="flex gap-4 pt-2"><div className="flex items-center space-x-2"><RadioGroupItem value="Yes" id="gutter-yes" /><Label htmlFor="gutter-yes">Yes</Label></div><div className="flex items-center space-x-2"><RadioGroupItem value="No" id="gutter-no" /><Label htmlFor="gutter-no">No</Label></div></RadioGroup></div>
                    <div className="space-y-2"><Label>Inspection Required</Label><RadioGroup value={document.roofing.inspectionRequired} onValueChange={(v) => handleCategorySelectChange('roofing', 'inspectionRequired', v)} className="flex gap-4 pt-2"><div className="flex items-center space-x-2"><RadioGroupItem value="Yes" id="inspection-yes-roofing" /><Label htmlFor="inspection-yes-roofing">Yes</Label></div><div className="flex items-center space-x-2"><RadioGroupItem value="No" id="inspection-no-roofing" /><Label htmlFor="inspection-no-roofing">No</Label></div></RadioGroup></div>
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
                        <Select value={document.hvac.serviceType} onValueChange={(value) => handleCategorySelectChange('hvac', 'serviceType', value)}>
                            <SelectTrigger><SelectValue placeholder="Select service type" /></SelectTrigger>
                            <SelectContent>
                                {hvacServiceTypes.map((o, i) => <SelectItem key={`${o}-${i}`} value={o}>{o}</SelectItem>)}
                            </SelectContent>
                        </Select>
                    </div>
                     <div className="space-y-2">
                        <Label>System Type</Label>
                         <Select value={document.hvac.systemType} onValueChange={(value) => handleCategorySelectChange('hvac', 'systemType', value)}>
                            <SelectTrigger><SelectValue placeholder="Select system type" /></SelectTrigger>
                            <SelectContent>
                                {hvacSystemTypes.map((o, i) => <SelectItem key={`${o}-${i}`} value={o}>{o}</SelectItem>)}
                            </SelectContent>
                        </Select>
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
                        <div className="relative flex items-center">
                            <Wind className="absolute left-3 h-5 w-5 text-muted-foreground" />
                            <Input id="refrigerantType" name="refrigerantType" value={document.hvac.refrigerantType} onChange={(e) => handleCategoryDataChange('hvac', e)} className="pl-10" />
                        </div>
                    </div>
                    <div className="flex items-center space-x-2 pt-6">
                        <Checkbox id="ductworkRequired" name="ductworkRequired" checked={document.hvac.ductworkRequired} onCheckedChange={(checked) => handleCategorySelectChange('hvac', 'ductworkRequired', !!checked)} />
                        <Label htmlFor="ductworkRequired" className="flex items-center gap-2"><Thermometer className="h-4 w-4" /> Ductwork Required?</Label>
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
                        <Select value={document.plumbing.serviceType} onValueChange={(value) => handleCategorySelectChange('plumbing', 'serviceType', value)}>
                            <SelectTrigger><SelectValue placeholder="Select service type" /></SelectTrigger>
                            <SelectContent>
                                {plumbingServiceTypes.map((o, i) => <SelectItem key={`${o}-${i}`} value={o}>{o}</SelectItem>)}
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="fixtureType">Fixture Type</Label>
                         <Select value={document.plumbing.fixtureType} onValueChange={(value) => handleCategorySelectChange('plumbing', 'fixtureType', value)}>
                            <SelectTrigger><SelectValue placeholder="Select fixture type" /></SelectTrigger>
                            <SelectContent>
                                {plumbingFixtureTypes.map((o, i) => <SelectItem key={`${o}-${i}`} value={o}>{o}</SelectItem>)}
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="space-y-2">
                        <Label>Pipe Material</Label>
                         <Select value={document.plumbing.pipeMaterial} onValueChange={(value) => handleCategorySelectChange('plumbing', 'pipeMaterial', value)}>
                            <SelectTrigger><SelectValue placeholder="Select pipe material" /></SelectTrigger>
                            <SelectContent>
                                {plumbingPipeMaterials.map((o, i) => <SelectItem key={`${o}-${i}`} value={o}>{o}</SelectItem>)}
                            </SelectContent>
                        </Select>
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
                            <Label htmlFor="emergencyService" className="flex items-center gap-2"><Wrench className="h-4 w-4" /> Emergency Service?</Label>
                        </div>
                         <div className="flex items-center space-x-2">
                            <Checkbox id="waterPressureIssue" name="waterPressureIssue" checked={document.plumbing.waterPressureIssue} onCheckedChange={(checked) => handleCategorySelectChange('plumbing', 'waterPressureIssue', !!checked)} />
                            <Label htmlFor="waterPressureIssue" className="flex items-center gap-2"><Droplets className="h-4 w-4" />Water Pressure Issue?</Label>
                        </div>
                    </div>
                </CardContent>
            </Card>
        )}

        {document.category === "Electrical Estimate" && document.electrical && (
            <Card className="bg-card/50 backdrop-blur-sm group-disabled:opacity-70">
                <CardHeader><CardTitle>Electrical Project Details</CardTitle></CardHeader>
                <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2"><Label>Service Type</Label><Input name="serviceType" value={document.electrical.serviceType} onChange={(e) => handleCategoryDataChange('electrical', e)} placeholder="e.g. Install, Repair, Upgrade" /></div>
                    <div className="space-y-2"><Label>Wiring Type</Label><Input name="wiringType" value={document.electrical.wiringType} onChange={(e) => handleCategoryDataChange('electrical', e)} placeholder="e.g. Copper, Aluminum" /></div>
                    <div className="space-y-2"><Label>Panel Size</Label><Input name="panelSize" value={document.electrical.panelSize} onChange={(e) => handleCategoryDataChange('electrical', e)} placeholder="e.g. 100A, 200A" /></div>
                    <div className="space-y-2"><Label htmlFor="outletsFixturesCount">Outlets/Fixtures Count</Label><Input id="outletsFixturesCount" name="outletsFixturesCount" type="number" value={document.electrical.outletsFixturesCount ?? ''} onChange={(e) => handleCategoryDataChange('electrical', e)} /></div>
                    <div className="space-y-2 md:col-span-2"><Label htmlFor="roomsInvolved">Rooms Involved</Label><Input id="roomsInvolved" name="roomsInvolved" value={document.electrical.roomsInvolved} onChange={(e) => handleCategoryDataChange('electrical', e)} placeholder="e.g., Kitchen, Living Room" /></div>
                    <div className="flex items-center space-x-2 pt-6"><Checkbox id="panelUpgradeNeeded" name="panelUpgradeNeeded" checked={document.electrical.panelUpgradeNeeded} onCheckedChange={(c) => handleCategorySelectChange('electrical', 'panelUpgradeNeeded', !!c)} /><Label htmlFor="panelUpgradeNeeded" className="flex items-center gap-2"><Zap className="h-4 w-4" /> Panel Upgrade Needed?</Label></div>
                    <div className="flex items-center space-x-2 pt-6"><Checkbox id="evChargerNeeded" name="evChargerNeeded" checked={document.electrical.evChargerNeeded} onCheckedChange={(c) => handleCategorySelectChange('electrical', 'evChargerNeeded', !!c)} /><Label htmlFor="evChargerNeeded" className="flex items-center gap-2"><Car className="h-4 w-4" /> EV Charger Needed?</Label></div>
                    <div className="flex items-center space-x-2"><Checkbox id="inspectionRequired-electrical" name="inspectionRequired" checked={document.electrical.inspectionRequired} onCheckedChange={(c) => handleCategorySelectChange('electrical', 'inspectionRequired', !!c)} /><Label htmlFor="inspectionRequired-electrical" className="flex items-center gap-2"><CheckSquare className="h-4 w-4" /> Inspection Required?</Label></div>
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
                    <div className="space-y-2 md:col-span-2"><Label>Yard Condition</Label><RadioGroup value={document.landscaping.yardCondition} onValueChange={(v) => handleCategorySelectChange('landscaping', 'yardCondition', v)} className="flex gap-4"><div className="flex items-center space-x-2"><RadioGroupItem value="Good" id="cond-good" /><Label htmlFor="cond-good" className="flex items-center gap-2"><Trees className="h-4 w-4" /> Good</Label></div><div className="flex items-center space-x-2"><RadioGroupItem value="Moderate" id="cond-mod" /><Label htmlFor="cond-mod">Moderate</Label></div><div className="flex items-center space-x-2"><RadioGroupItem value="Poor" id="cond-poor" /><Label htmlFor="cond-poor">Poor</Label></div></RadioGroup></div>
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
                        {['Carpet', 'Windows', 'Fridge', 'Oven', 'Laundry', 'Walls'].map((addOn, i) => (
                            <div key={`${addOn}-${i}`} className="flex items-center space-x-2"><Checkbox id={`addOn-${addOn}`} checked={cleaningAddOns.includes(addOn)} onCheckedChange={(c) => handleCleaningAddOnChange(addOn, !!c)} /><Label htmlFor={`addOn-${addOn}`}>{addOn}</Label></div>
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
                    <div className="flex items-center space-x-2 pt-6"><Checkbox id="constructionPermit" name="permitRequired" checked={document.construction.permitRequired} onCheckedChange={(c) => handleCategorySelectChange('construction', 'permitRequired', !!c)} /><Label htmlFor="constructionPermit" className="flex items-center gap-2"><DraftingCompass className="h-4 w-4" /> Permit Required?</Label></div>
                    <div className="flex items-center space-x-2 pt-6"><Checkbox id="architectDrawings" name="architectDrawingsProvided" checked={document.construction.architectDrawingsProvided} onCheckedChange={(c) => handleCategorySelectChange('construction', 'architectDrawingsProvided', !!c)} /><Label htmlFor="architectDrawings" className="flex items-center gap-2"><Pencil className="h-4 w-4" /> Architect Drawings Provided?</Label></div>
                    <div className="flex items-center space-x-2"><Checkbox id="constructionInspection" name="inspectionRequired" checked={document.construction.inspectionRequired} onCheckedChange={(c) => handleCategorySelectChange('construction', 'inspectionRequired', !!c)} /><Label htmlFor="constructionInspection" className="flex items-center gap-2"><CheckSquare className="h-4 w-4" /> Inspection Required?</Label></div>
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
                          <Input id="preset-name" value={newPresetName} onChange={(e) => setNewPresetName(e.target.value)} placeholder="e.g., Standard Roof Repair"/>
                      </div>
                      <DialogFooter>
                          <DialogClose asChild><Button variant="ghost">Cancel</Button></DialogClose>
                          <Button onClick={handleSavePreset}>Save Preset</Button>
                      </DialogFooter>
                  </DialogContent>
                </Dialog>
              </div>
            </div>

            <div className="hidden md:grid md:grid-cols-[5fr_2fr_2fr_1fr_2fr_1fr] gap-4 text-sm font-medium text-muted-foreground pt-4">
                <Label>Item Name / Description</Label>
                <Label>Quantity</Label>
                <Label>Unit Price</Label>
                <Label className="text-center">Taxable</Label>
                <Label>Total</Label>
                <span></span>
            </div>
            {document.lineItems.map((item, index) => (
                <div key={item.id} className="grid grid-cols-1 md:grid-cols-[5fr_2fr_2fr_1fr_2fr_1fr] gap-4 items-start">
                    <div className="md:col-span-1 space-y-2">
                        <Label htmlFor={`itemName-${index}`} className="md:hidden">Item Name / Description</Label>
                        <Textarea id={`itemName-${index}`} value={item.name} onChange={(e) => handleItemChange(index, 'name', e.target.value)} rows={1} className="min-h-0"/>
                    </div>
                    <div className="col-span-6 sm:col-span-3 md:col-span-1 space-y-2">
                        <Label htmlFor={`itemQuantity-${index}`} className="md:hidden">Quantity</Label>
                        <Input id={`itemQuantity-${index}`} type="number" value={item.quantity} onChange={(e) => handleItemChange(index, 'quantity', parseFloat(e.target.value) || 0)} />
                    </div>
                    <div className="col-span-6 sm:col-span-3 md:col-span-1 space-y-2">
                        <Label htmlFor={`itemRate-${index}`} className="md:hidden">Unit Price</Label>
                        <Input id={`itemRate-${index}`} type="number" value={item.unitPrice} onChange={(e) => handleItemChange(index, 'unitPrice', parseFloat(e.target.value) || 0)} />
                    </div>
                    <div className="col-span-2 sm:col-span-1 flex items-center justify-center h-10">
                        <Checkbox id={`itemTaxable-${index}`} checked={item.taxable} onCheckedChange={(checked) => handleItemChange(index, 'taxable', !!checked)} />
                    </div>
                    <div className="col-span-4 sm:col-span-2 flex items-center h-10">
                        <p className="font-medium tabular-nums text-sm">{currencySymbol}{(item.quantity * item.unitPrice).toFixed(2)}</p>
                    </div>
                    <div className="col-span-2 sm:col-span-1 flex items-center h-10 justify-end">
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
            <CardTitle>Pricing Summary &amp; Terms</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                <Label htmlFor="taxPercentage">Tax (%)</Label>
                <Input id="taxPercentage" name="summary.taxPercentage" type="number" value={document.summary.taxPercentage} onChange={handleNumberChange} />
                </div>
                <div className="space-y-2">
                <Label htmlFor="discount">Discount (Fixed Amount)</Label>
                <Input id="discount" name="summary.discount" type="number" value={document.summary.discount} onChange={handleNumberChange} />
                </div>
                <div className="space-y-2 col-span-1 sm:col-span-2">
                <Label htmlFor="shippingCost">Shipping / Extra Costs</Label>
                <div className="relative flex items-center">
                    <Truck className="absolute left-3 h-5 w-5 text-muted-foreground" />
                    <Input id="shippingCost" name="summary.shippingCost" type="number" value={document.summary.shippingCost} onChange={handleNumberChange} className="pl-10"/>
                </div>
                </div>
            </div>
            <div className="space-y-2">
                <Label htmlFor="termsAndConditions">Terms &amp; Conditions</Label>
                <Textarea id="termsAndConditions" name="termsAndConditions" value={document.termsAndConditions} onChange={handleInputChange} placeholder="e.g., Payment terms, validity period, warranty information..." />
            </div>
             <div className="space-y-2">
                <Label>Owner Signature</Label>
                <div className="flex gap-2">
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
                                <DialogDescription>
                                    Draw your signature below. This will be saved with the document.
                                </DialogDescription>
                            </DialogHeader>
                            <SignaturePad onSave={handleOwnerSignatureSave} signerName={document.business.name} />
                        </DialogContent>
                    </Dialog>
                    {document.business.ownerSignature && (
                      <Button variant="destructive" onClick={handleDeleteSignature}>
                          <Trash2 className="mr-2 h-4 w-4" />
                          Delete
                      </Button>
                    )}
                </div>

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
