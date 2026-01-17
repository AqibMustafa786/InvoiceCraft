'use client';

import { ChangeEvent, Dispatch, SetStateAction, useState, useEffect } from 'react';
import type { Estimate, LineItem, Quote, EstimateCategory, HomeRemodelingInfo, RoofingInfo, HVACInfo, PlumbingInfo, ElectricalInfo, LandscapingInfo, CleaningInfo, AutoRepairInfo, ConstructionInfo, ITFreelanceInfo } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { DatePicker } from '@/components/ui/datepicker';
import { ImageUp, Plus, Trash2, Palette, X, Mail, Truck, Hash, Phone, Globe, Briefcase, Award, User, FileText, Building, Pencil, Type, Package, Hammer, Ruler, ListTree, CheckSquare, Sparkles, Calendar, TextQuote, Wind, Thermometer, Wrench, Zap, Trees, Droplets, Car, Code, DraftingCompass, PaintBucket, Paintbrush, Save, Loader2, ChevronDown } from 'lucide-react';
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
import { Collapsible, CollapsibleTrigger, CollapsibleContent } from '@/components/ui/collapsible';

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
            // Don't call onValueChange here immediately, let the input do it
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
            <Select value={isOther ? 'Other' : (value || '')} onValueChange={handleSelectChange}>
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
  const [isUploading, setIsUploading] = useState(false);
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

    const handleLanguageChange = (value: string) => {
    setDocument(prev => ({ ...prev, language: value }));
  };

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
      lineItems: [...prev.lineItems, { id: crypto.randomUUID(), name: '', description: '', quantity: 1, unitPrice: 0, taxable: false }],
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
      description: '',
      quantity: 1,
      unitPrice: 0,
      taxable: false,
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
        setDocument(prev => ({
            ...prev,
            business: {
                ...prev.business,
                logoUrl: url
            }
        }));
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

  const handleRemoveLogo = () => {
    setDocument(prev => ({
        ...prev,
        business: {
            ...prev.business,
            logoUrl: ''
        }
    }));
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

  const currencySymbol = currencies.find(c => c.value === document.currency)?.label.split(' ')[1] || '$';
  const isSigned = !!document.clientSignature;

  const docName = documentType === 'quote' ? 'Quote' : 'Estimate';
  const docNumberName = documentType === 'quote' ? 'Quote Number' : 'Estimate Number';

  return (
    <>
      <fieldset disabled={isSigned} className="space-y-6 group">
        <Collapsible defaultOpen>
          <Card className="bg-card/50 backdrop-blur-sm shadow-lg hover:shadow-primary/20 transition-shadow duration-300 group-disabled:opacity-70">
            <CollapsibleTrigger asChild>
              <CardHeader className="flex flex-row items-center justify-between cursor-pointer">
                <CardTitle className="text-base">Branding &amp; Customization</CardTitle>
                <ChevronDown className="h-4 w-4 shrink-0 transition-transform duration-200 group-data-[state=open]:rotate-180" />
              </CardHeader>
            </CollapsibleTrigger>
            <CollapsibleContent>
              <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                  <Label className="text-xs">Company Logo</Label>
                  <div className="flex items-center gap-4">
                      {document.business.logoUrl ? (
                          <div className="flex items-center gap-2">
                              <Image src={document.business.logoUrl} alt="Company Logo" width={60} height={30} className="rounded-md object-contain bg-muted p-1" />
                              <div className="flex items-center gap-1">
                                  <Button asChild variant="outline" size="sm" disabled={isUploading}>
                                      <label htmlFor="logo-upload" className="cursor-pointer text-xs">Change</label>
                                  </Button>
                                  <Button variant="destructive" size="sm" onClick={handleRemoveLogo} disabled={isUploading} className="text-xs">
                                  <X className="h-3 w-3 mr-1" /> Remove
                                  </Button>
                              </div>
                          </div>
                      ) : (
                          <Button asChild variant="outline" size="sm" className="w-full text-xs" disabled={isUploading}>
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
                                  setDocument(prev => ({...prev, backgroundColor: e.target.value }));
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
                                  setDocument(prev => ({...prev, textColor: e.target.value }));
                              }}
                              className="absolute right-1 top-1/2 -translate-y-1/2 h-7 w-7 p-1 rounded-md cursor-pointer bg-transparent border-none appearance-none"
                          />
                      </div>
                  </div>
                  <div className="space-y-2">
                      <Label htmlFor="fontFamily" className="text-xs">Font Family</Label>
                      <Select value={document.fontFamily} onValueChange={(value) => setDocument(p => ({...p, fontFamily: value}))}>
                          <SelectTrigger id="fontFamily" className="h-9 text-xs">
                              <SelectValue placeholder="Select font" />
                          </SelectTrigger>
                          <SelectContent>
                              {fonts.map((font, index) => <SelectItem key={`${font.value}-${index}`} value={font.value}>{font.label}</SelectItem>)}
                          </SelectContent>
                      </Select>
                  </div>
                  <div className="space-y-2">
                      <Label htmlFor="language" className="text-xs">Language</Label>
                      <Select value={document.language} onValueChange={handleLanguageChange}>
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
              </CardContent>
            </CollapsibleContent>
          </Card>
        </Collapsible>
        
        <Collapsible defaultOpen>
          <Card className="bg-card/50 backdrop-blur-sm shadow-lg hover:shadow-primary/20 transition-shadow duration-300 group-disabled:opacity-70">
            <CollapsibleTrigger asChild>
              <CardHeader className="flex flex-row items-center justify-between cursor-pointer">
                <CardTitle className="text-base">Business Information</CardTitle>
                <ChevronDown className="h-4 w-4 shrink-0 transition-transform duration-200 group-data-[state=open]:rotate-180" />
              </CardHeader>
            </CollapsibleTrigger>
            <CollapsibleContent>
              <CardContent className="space-y-3">
                  <div className="space-y-2">
                  <Label htmlFor="businessName" className="text-xs">Business Name</Label>
                  <div className="relative flex items-center">
                      <Briefcase className="absolute left-3 h-4 w-4 text-muted-foreground" />
                      <Input id="businessName" name="name" value={document.business.name} onChange={(e) => handleNestedChange('business', e)} className="pl-9 text-xs h-9" />
                  </div>
                  </div>
                  <div className="space-y-2">
                      <Label htmlFor="businessAddress" className="text-xs">Business Address</Label>
                      <Textarea id="businessAddress" name="address" value={document.business.address} onChange={(e) => handleNestedChange('business', e)} placeholder="Street, City, State, Zip" className="text-xs min-h-[60px]"/>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <div className="space-y-2">
                          <Label htmlFor="businessPhone" className="text-xs">Phone Number</Label>
                          <div className="relative flex items-center">
                              <Phone className="absolute left-3 h-4 w-4 text-muted-foreground" />
                              <Input id="businessPhone" name="phone" value={document.business.phone} onChange={(e) => handleNestedChange('business', e)} className="pl-9 text-xs h-9" />
                          </div>
                      </div>
                      <div className="space-y-2">
                          <Label htmlFor="businessEmail" className="text-xs">Email Address</Label>
                          <div className="relative flex items-center">
                              <Mail className="absolute left-3 h-4 w-4 text-muted-foreground" />
                              <Input id="businessEmail" name="email" value={document.business.email} onChange={(e) => handleNestedChange('business', e)} className="pl-9 text-xs h-9" />
                          </div>
                      </div>
                      <div className="space-y-2">
                          <Label htmlFor="businessWebsite" className="text-xs">Website (optional)</Label>
                          <div className="relative flex items-center">
                              <Globe className="absolute left-3 h-4 w-4 text-muted-foreground" />
                              <Input id="businessWebsite" name="website" value={document.business.website || ''} onChange={(e) => handleNestedChange('business', e)} className="pl-9 text-xs h-9" />
                          </div>
                      </div>
                      <div className="space-y-2">
                          <Label htmlFor="businessLicense" className="text-xs">License Number</Label>
                          <div className="relative flex items-center">
                              <Award className="absolute left-3 h-4 w-4 text-muted-foreground" />
                              <Input id="businessLicense" name="licenseNumber" value={document.business.licenseNumber} onChange={(e) => handleNestedChange('business', e)} className="pl-9 text-xs h-9" />
                          </div>
                      </div>
                      <div className="space-y-2 md:col-span-2">
                          <Label htmlFor="businessTaxId" className="text-xs">EIN/Tax ID (optional)</Label>
                          <div className="relative flex items-center">
                              <Hash className="absolute left-3 h-4 w-4 text-muted-foreground" />
                              <Input id="businessTaxId" name="taxId" value={document.business.taxId ?? ''} onChange={(e) => handleNestedChange('business', e)} className="pl-9 text-xs h-9" />
                          </div>
                      </div>
                  </div>
              </CardContent>
            </CollapsibleContent>
          </Card>
        </Collapsible>

        <Collapsible defaultOpen>
          <Card className="bg-card/50 backdrop-blur-sm shadow-lg hover:shadow-primary/20 transition-shadow duration-300 group-disabled:opacity-70">
             <CollapsibleTrigger asChild>
              <CardHeader className="flex flex-row items-center justify-between cursor-pointer">
                <CardTitle className="text-base">Client Information</CardTitle>
                 <ChevronDown className="h-4 w-4 shrink-0 transition-transform duration-200 group-data-[state=open]:rotate-180" />
              </CardHeader>
            </CollapsibleTrigger>
            <CollapsibleContent>
              <CardContent className="space-y-3">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div className="space-y-2">
                  <Label htmlFor="clientName" className="text-xs">Client Full Name</Label>
                  <div className="relative flex items-center">
                      <User className="absolute left-3 h-4 w-4 text-muted-foreground" />
                      <Input id="clientName" name="name" value={document.client.name} onChange={(e) => handleNestedChange('client', e)} className="pl-9 text-xs h-9" />
                      </div>
                  </div>
                  <div className="space-y-2">
                  <Label htmlFor="clientCompanyName" className="text-xs">Client Company Name (optional)</Label>
                  <div className="relative flex items-center">
                      <Building className="absolute left-3 h-4 w-4 text-muted-foreground" />
                      <Input id="clientCompanyName" name="companyName" value={document.client.companyName || ''} onChange={(e) => handleNestedChange('client', e)} className="pl-9 text-xs h-9" />
                      </div>
                  </div>
              </div>
              <div className="space-y-2">
                  <Label htmlFor="clientAddress" className="text-xs">Client Address</Label>
                  <Textarea id="clientAddress" name="address" value={document.client.address} onChange={(e) => handleNestedChange('client', e)} className="text-xs min-h-[60px]" />
              </div>
              <div className="space-y-2">
                  <Label htmlFor="projectLocation" className="text-xs">Project Location (if different)</Label>
                  <Textarea id="projectLocation" name="projectLocation" value={document.client.projectLocation ?? ''} onChange={(e) => handleNestedChange('client', e)} className="text-xs min-h-[60px]" />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div className="space-y-2">
                  <Label htmlFor="clientEmail" className="text-xs">Client Email</Label>
                  <div className="relative flex items-center">
                      <Mail className="absolute left-3 h-4 w-4 text-muted-foreground" />
                      <Input id="clientEmail" name="email" value={document.client.email || ''} onChange={(e) => handleNestedChange('client', e)} className="pl-9 text-xs h-9" placeholder="client@example.com" />
                  </div>
                  </div>
                  <div className="space-y-2">
                  <Label htmlFor="clientPhone" className="text-xs">Client Phone</Label>
                  <div className="relative flex items-center">
                      <Phone className="absolute left-3 h-4 w-4 text-muted-foreground" />
                      <Input id="clientPhone" name="phone" value={document.client.phone || ''} onChange={(e) => handleNestedChange('client', e)} className="pl-9 text-xs h-9" />
                  </div>
                  </div>
              </div>
              </CardContent>
            </CollapsibleContent>
          </Card>
        </Collapsible>
        
        <Collapsible defaultOpen>
          <Card className="bg-card/50 backdrop-blur-sm shadow-lg hover:shadow-primary/20 transition-shadow duration-300 group-disabled:opacity-70">
             <CollapsibleTrigger asChild>
              <CardHeader className="flex flex-row items-center justify-between cursor-pointer">
                <CardTitle className="text-base">{docName} Details</CardTitle>
                 <ChevronDown className="h-4 w-4 shrink-0 transition-transform duration-200 group-data-[state=open]:rotate-180" />
              </CardHeader>
            </CollapsibleTrigger>
            <CollapsibleContent>
              <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="category" className="text-xs">Estimate Category</Label>
                  <div className="relative flex items-center">
                      <Package className="absolute left-3 h-4 w-4 text-muted-foreground z-10" />
                      <Select
                          value={document.category}
                          onValueChange={(value: EstimateCategory) => setDocument(p => ({ ...p, category: value }))}
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
                  <Label htmlFor="estimateNumber" className="text-xs">{docNumberName}</Label>
                  <Input id="estimateNumber" name="estimateNumber" value={document.estimateNumber} onChange={handleInputChange} className="text-xs h-9"/>
              </div>
              <div className="space-y-2">
                  <Label htmlFor="projectTitle" className="text-xs">Project / Job Title</Label>
                  <div className="relative flex items-center">
                      <FileText className="absolute left-3 h-4 w-4 text-muted-foreground" />
                      <Input id="projectTitle" name="projectTitle" value={document.projectTitle} onChange={handleInputChange} className="pl-9 text-xs h-9" />
                  </div>
              </div>
              <div className="space-y-2">
                  <Label className="text-xs">Date Issued</Label>
                  <DatePicker date={document.estimateDate} setDate={(date) => setDocument(p => ({ ...p, estimateDate: date! }))} className="h-9 text-xs" />
              </div>
              <div className="space-y-2">
                  <Label className="text-xs">Expiration Date</Label>
                  <DatePicker date={document.validUntilDate} setDate={(date) => setDocument(p => ({ ...p, validUntilDate: date! }))} className="h-9 text-xs"/>
              </div>
              <div className="space-y-2">
                  <Label htmlFor="referenceNumber" className="text-xs">Reference Number (optional)</Label>
                  <div className="relative flex items-center">
                      <Hash className="absolute left-3 h-4 w-4 text-muted-foreground" />
                      <Input id="referenceNumber" name="referenceNumber" value={document.referenceNumber} onChange={handleInputChange} className="pl-9 text-xs h-9" />
                  </div>
              </div>
              <div className="space-y-2">
                      <Label htmlFor="currency" className="text-xs">Currency</Label>
                      <Select value={document.currency} onValueChange={handleCurrencyChange}>
                          <SelectTrigger id="currency" className="h-9 text-xs">
                              <SelectValue placeholder="Select currency" />
                          </SelectTrigger>
                          <SelectContent>
                              {currencies.map((c, index) => <SelectItem key={`${c.value}-${index}`} value={c.value}>{c.label}</SelectItem>)}
                          </SelectContent>
                      </Select>
                  </div>
              </CardContent>
            </CollapsibleContent>
          </Card>
        </Collapsible>

        {document.category === "Home Remodeling / Renovation" && document.homeRemodeling && (
            <Collapsible defaultOpen>
              <Card className="bg-card/50 backdrop-blur-sm shadow-lg hover:shadow-primary/20 transition-shadow duration-300 group-disabled:opacity-70">
                   <CollapsibleTrigger asChild>
                    <CardHeader className="flex flex-row items-center justify-between cursor-pointer">
                      <CardTitle className="text-base">Home Remodeling Details</CardTitle>
                       <ChevronDown className="h-4 w-4 shrink-0 transition-transform duration-200 group-data-[state=open]:rotate-180" />
                    </CardHeader>
                  </CollapsibleTrigger>
                  <CollapsibleContent>
                    <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        <div className="space-y-2">
                            <Label htmlFor="projectType" className="text-xs">Project Type</Label>
                            <div className="relative flex items-center">
                                <Hammer className="absolute left-3 h-4 w-4 text-muted-foreground" />
                                <Input id="projectType" name="projectType" value={document.homeRemodeling.projectType} onChange={(e) => handleCategoryDataChange('homeRemodeling', e)} className="pl-9 text-xs h-9" placeholder="e.g. Kitchen, Bathroom" />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="propertyType" className="text-xs">Property Type</Label>
                            <div className="relative flex items-center">
                                <Building className="absolute left-3 h-4 w-4 text-muted-foreground" />
                                <Input id="propertyType" name="propertyType" value={document.homeRemodeling.propertyType} onChange={(e) => handleCategoryDataChange('homeRemodeling', e)} className="pl-9 text-xs h-9" placeholder="e.g. House, Apartment"/>
                            </div>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="squareFootage" className="text-xs">Square Footage</Label>
                            <div className="relative flex items-center">
                                <Ruler className="absolute left-3 h-4 w-4 text-muted-foreground" />
                                <Input id="squareFootage" name="squareFootage" type="number" value={document.homeRemodeling.squareFootage ?? ''} onChange={(e) => handleCategoryDataChange('homeRemodeling', e)} className="pl-9 text-xs h-9" />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="roomsIncluded" className="text-xs">Rooms Included</Label>
                            <div className="relative flex items-center">
                                <ListTree className="absolute left-3 h-4 w-4 text-muted-foreground" />
                                <Input id="roomsIncluded" name="roomsIncluded" value={document.homeRemodeling.roomsIncluded} onChange={(e) => handleCategoryDataChange('homeRemodeling', e)} className="pl-9 text-xs h-9" placeholder="e.g. Kitchen, 2 Bedrooms" />
                            </div>
                        </div>
                        <div className="space-y-2 md:col-span-2">
                            <Label className="text-xs">Material Grade</Label>
                            <RadioGroup
                                value={document.homeRemodeling.materialGrade}
                                onValueChange={(value) => handleCategorySelectChange('homeRemodeling', 'materialGrade', value)}
                                className="flex gap-4"
                            >
                                <div className="flex items-center space-x-2">
                                    <RadioGroupItem value="Basic" id="grade-basic" />
                                    <Label htmlFor="grade-basic" className="text-xs">Basic</Label>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <RadioGroupItem value="Standard" id="grade-standard" />
                                    <Label htmlFor="grade-standard" className="text-xs">Standard</Label>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <RadioGroupItem value="Premium" id="grade-premium" />
                                    <Label htmlFor="grade-premium" className="text-xs">Premium</Label>
                                </div>
                            </RadioGroup>
                        </div>
                        <div className="flex items-center space-x-2">
                            <Checkbox id="demolitionRequired" name="demolitionRequired" checked={document.homeRemodeling.demolitionRequired} onCheckedChange={(checked) => handleCategorySelectChange('homeRemodeling', 'demolitionRequired', !!checked)} />
                            <Label htmlFor="demolitionRequired" className="flex items-center gap-2 text-xs"><Sparkles className="h-3 w-3" /> Demolition Required?</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                            <Checkbox id="permitRequired" name="permitRequired" checked={document.homeRemodeling.permitRequired} onCheckedChange={(checked) => handleCategorySelectChange('homeRemodeling', 'permitRequired', !!checked)} />
                            <Label htmlFor="permitRequired" className="flex items-center gap-2 text-xs"><CheckSquare className="h-3 w-3" /> Permit Required?</Label>
                        </div>
                        <div className="space-y-2">
                            <Label className="text-xs">Expected Start Date</Label>
                            <DatePicker date={document.homeRemodeling.expectedStartDate} setDate={(date) => handleRemodelingDateChange('expectedStartDate', date)} className="text-xs h-9" />
                        </div>
                        <div className="space-y-2">
                            <Label className="text-xs">Expected Completion Date</Label>
                            <DatePicker date={document.homeRemodeling.expectedCompletionDate} setDate={(date) => handleRemodelingDateChange('expectedCompletionDate', date)} className="text-xs h-9" />
                        </div>
                        <div className="space-y-2 md:col-span-2">
                            <Label htmlFor="specialInstructions" className="text-xs">Special Instructions</Label>
                            <div className="relative flex items-center">
                                <TextQuote className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                <Textarea id="specialInstructions" name="specialInstructions" value={document.homeRemodeling.specialInstructions} onChange={(e) => handleCategoryDataChange('homeRemodeling', e)} className="pl-9 text-xs" />
                            </div>
                        </div>
                    </CardContent>
                  </CollapsibleContent>
              </Card>
            </Collapsible>
        )}

        {document.category === "Roofing Estimate" && document.roofing && (
           <Collapsible defaultOpen>
            <Card className="bg-card/50 backdrop-blur-sm shadow-lg hover:shadow-primary/20 transition-shadow duration-300 group-disabled:opacity-70">
              <CollapsibleTrigger asChild>
                <CardHeader className="flex flex-row items-center justify-between cursor-pointer">
                  <CardTitle className="text-base">Roofing Project Details</CardTitle>
                  <ChevronDown className="h-4 w-4 shrink-0 transition-transform duration-200 group-data-[state=open]:rotate-180" />
                </CardHeader>
              </CollapsibleTrigger>
              <CollapsibleContent>
                <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div className="space-y-2"><Label className="text-xs">Roof Material</Label><CustomSelect name="roofMaterial" value={document.roofing.roofMaterial} onValueChange={(name, value) => handleCategorySelectChange('roofing', name, value)} options={roofMaterials} placeholder="Select material" /></div>
                    <div className="space-y-2"><Label className="text-xs">Shingle/Material Brand</Label><CustomSelect name="shingleBrand" value={document.roofing.shingleBrand} onValueChange={(name, value) => handleCategorySelectChange('roofing', name, value)} options={shingleBrands} placeholder="Select a brand" /></div>
                    <div className="space-y-2"><Label className="text-xs">Roof Size (sq ft)</Label><Input name="roofSize" type="number" value={document.roofing.roofSize ?? ''} onChange={(e) => handleCategorySelectChange('roofing', 'roofSize', e.target.value ? parseFloat(e.target.value) : null)} className="h-9 text-xs" /></div>
                    <div className="space-y-2"><Label className="text-xs">Number of layers to remove</Label><CustomSelect name="layersToRemove" value={document.roofing.layersToRemove} onValueChange={(name, value) => handleCategorySelectChange('roofing', name, value)} options={['1 layer', '2 layers', '3+ layers']} placeholder="Select layers" /></div>
                    <div className="space-y-2"><Label className="text-xs">Roof Pitch</Label><CustomSelect name="roofPitch" value={document.roofing.roofPitch} onValueChange={(name, value) => handleCategorySelectChange('roofing', name, value)} options={['Low (1/12 - 4/12)', 'Medium (5/12 – 7/12)', 'Steep (8/12+)']} placeholder="Select pitch" /></div>
                    <div className="space-y-2"><Label className="text-xs">Underlayment Type</Label><CustomSelect name="underlaymentType" value={document.roofing.underlaymentType} onValueChange={(name, value) => handleCategorySelectChange('roofing', name, value)} options={underlaymentTypes} placeholder="Select underlayment" /></div>
                    <div className="space-y-2"><Label className="text-xs">Flashing Details</Label><Input name="flashingDetails" value={document.roofing.flashingDetails} onChange={(e) => handleCategoryDataChange('roofing', e)} placeholder="e.g., Step, Counter, Apron" className="h-9 text-xs" /></div>
                    <div className="space-y-2"><Label className="text-xs">Ventilation Details</Label><Input name="ventilationSystem" value={document.roofing.ventilationSystem} onChange={(e) => handleCategoryDataChange('roofing', e)} placeholder="e.g., Ridge vent, Soffit vents" className="h-9 text-xs" /></div>
                    <div className="space-y-2"><Label className="text-xs">Warranty</Label><Input name="warranty" value={document.roofing.warranty} onChange={(e) => handleCategoryDataChange('roofing', e)} placeholder="e.g. 5 Year Workmanship" className="h-9 text-xs" /></div>
                    <div className="space-y-2"><Label className="text-xs">Estimated Timeline</Label><Input name="estimatedTimeline" value={document.roofing.estimatedTimeline} onChange={(e) => handleCategoryDataChange('roofing', e)} placeholder="e.g. 2-3 days, weather permitting" className="h-9 text-xs" /></div>
                    <div className="space-y-2"><Label className="text-xs">Gutter Repair/Replacement</Label><RadioGroup value={document.roofing.gutterRepairNeeded ? 'Yes' : 'No'} onValueChange={(v) => handleCategorySelectChange('roofing', 'gutterRepairNeeded', v === 'Yes')} className="flex gap-4 pt-2"><div className="flex items-center space-x-2"><RadioGroupItem value="Yes" id="gutter-yes" /><Label htmlFor="gutter-yes" className="text-xs">Yes</Label></div><div className="flex items-center space-x-2"><RadioGroupItem value="No" id="gutter-no" /><Label htmlFor="gutter-no" className="text-xs">No</Label></div></RadioGroup></div>
                    <div className="space-y-2"><Label className="text-xs">Inspection Required</Label><RadioGroup value={document.roofing.inspectionRequired} onValueChange={(v) => handleCategorySelectChange('roofing', 'inspectionRequired', v)} className="flex gap-4 pt-2"><div className="flex items-center space-x-2"><RadioGroupItem value="Yes" id="inspection-yes-roofing" /><Label htmlFor="inspection-yes-roofing" className="text-xs">Yes</Label></div><div className="flex items-center space-x-2"><RadioGroupItem value="No" id="inspection-no-roofing" /><Label htmlFor="inspection-no-roofing" className="text-xs">No</Label></div></RadioGroup></div>
                </CardContent>
              </CollapsibleContent>
            </Card>
           </Collapsible>
        )}

        {document.category === "HVAC (Air Conditioning / Heating)" && document.hvac && (
            <Collapsible defaultOpen>
              <Card className="bg-card/50 backdrop-blur-sm shadow-lg hover:shadow-primary/20 transition-shadow duration-300 group-disabled:opacity-70">
                 <CollapsibleTrigger asChild>
                  <CardHeader className="flex flex-row items-center justify-between cursor-pointer">
                    <CardTitle className="text-base">HVAC Project Details</CardTitle>
                     <ChevronDown className="h-4 w-4 shrink-0 transition-transform duration-200 group-data-[state=open]:rotate-180" />
                  </CardHeader>
                </CollapsibleTrigger>
                <CollapsibleContent>
                  <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <div className="space-y-2">
                          <Label className="text-xs">Service Type</Label>
                          <Select value={document.hvac.serviceType} onValueChange={(value) => handleCategorySelectChange('hvac', 'serviceType', value)}>
                              <SelectTrigger className="h-9 text-xs"><SelectValue placeholder="Select service type" /></SelectTrigger>
                              <SelectContent>
                                  {hvacServiceTypes.map((o, i) => <SelectItem key={`${o}-${i}`} value={o}>{o}</SelectItem>)}
                              </SelectContent>
                          </Select>
                      </div>
                      <div className="space-y-2">
                          <Label className="text-xs">System Type</Label>
                          <Select value={document.hvac.systemType} onValueChange={(value) => handleCategorySelectChange('hvac', 'systemType', value)}>
                              <SelectTrigger className="h-9 text-xs"><SelectValue placeholder="Select system type" /></SelectTrigger>
                              <SelectContent>
                                  {hvacSystemTypes.map((o, i) => <SelectItem key={`${o}-${i}`} value={o}>{o}</SelectItem>)}
                              </SelectContent>
                          </Select>
                      </div>
                      <div className="space-y-2">
                          <Label htmlFor="unitSize" className="text-xs">Unit Size (Tonnage / BTU)</Label>
                          <Input id="unitSize" name="unitSize" type="number" value={document.hvac.unitSize ?? ''} onChange={(e) => handleCategoryDataChange('hvac', e)} className="h-9 text-xs" />
                      </div>
                      <div className="space-y-2">
                          <Label htmlFor="seerRating" className="text-xs">SEER Rating</Label>
                          <Input id="seerRating" name="seerRating" value={document.hvac.seerRating} onChange={(e) => handleCategoryDataChange('hvac', e)} className="h-9 text-xs" />
                      </div>
                      <div className="space-y-2">
                          <Label className="text-xs">Furnace Type</Label>
                          <Input name="furnaceType" value={document.hvac.furnaceType} onChange={(e) => handleCategoryDataChange('hvac', e)} placeholder="e.g. Gas, Electric, Oil" className="h-9 text-xs" />
                      </div>
                      <div className="space-y-2">
                          <Label className="text-xs">Thermostat Type</Label>
                          <Input name="thermostatType" value={document.hvac.thermostatType} onChange={(e) => handleCategoryDataChange('hvac', e)} placeholder="e.g. Manual, Programmable, Smart" className="h-9 text-xs" />
                      </div>
                      <div className="space-y-2 md:col-span-2">
                          <Label htmlFor="existingSystemCondition" className="text-xs">Existing System Condition</Label>
                          <Input id="existingSystemCondition" name="existingSystemCondition" value={document.hvac.existingSystemCondition} onChange={(e) => handleCategoryDataChange('hvac', e)} className="h-9 text-xs" />
                      </div>
                      <div className="space-y-2">
                          <Label htmlFor="refrigerantType" className="text-xs">Refrigerant Type</Label>
                          <div className="relative flex items-center">
                              <Wind className="absolute left-3 h-4 w-4 text-muted-foreground" />
                              <Input id="refrigerantType" name="refrigerantType" value={document.hvac.refrigerantType} onChange={(e) => handleCategoryDataChange('hvac', e)} className="pl-9 h-9 text-xs" />
                          </div>
                      </div>
                      <div className="flex items-center space-x-2 pt-6">
                          <Checkbox id="ductworkRequired" name="ductworkRequired" checked={document.hvac.ductworkRequired} onCheckedChange={(checked) => handleCategorySelectChange('hvac', 'ductworkRequired', !!checked)} />
                          <Label htmlFor="ductworkRequired" className="flex items-center gap-2 text-xs"><Thermometer className="h-3 w-3" /> Ductwork Required?</Label>
                      </div>
                  </CardContent>
                </CollapsibleContent>
              </Card>
            </Collapsible>
        )}

        {document.category === "Plumbing Estimate" && document.plumbing && (
            <Collapsible defaultOpen>
             <Card className="bg-card/50 backdrop-blur-sm shadow-lg hover:shadow-primary/20 transition-shadow duration-300 group-disabled:opacity-70">
                 <CollapsibleTrigger asChild>
                  <CardHeader className="flex flex-row items-center justify-between cursor-pointer">
                    <CardTitle className="text-base">Plumbing Project Details</CardTitle>
                    <ChevronDown className="h-4 w-4 shrink-0 transition-transform duration-200 group-data-[state=open]:rotate-180" />
                  </CardHeader>
                </CollapsibleTrigger>
                <CollapsibleContent>
                  <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <div className="space-y-2">
                          <Label className="text-xs">Service Type</Label>
                          <Select value={document.plumbing.serviceType} onValueChange={(value) => handleCategorySelectChange('plumbing', 'serviceType', value)}>
                              <SelectTrigger className="h-9 text-xs"><SelectValue placeholder="Select service type" /></SelectTrigger>
                              <SelectContent>
                                  {plumbingServiceTypes.map((o, i) => <SelectItem key={`${o}-${i}`} value={o}>{o}</SelectItem>)}
                              </SelectContent>
                          </Select>
                      </div>
                      <div className="space-y-2">
                          <Label htmlFor="fixtureType" className="text-xs">Fixture Type</Label>
                          <Select value={document.plumbing.fixtureType} onValueChange={(value) => handleCategorySelectChange('plumbing', 'fixtureType', value)}>
                              <SelectTrigger className="h-9 text-xs"><SelectValue placeholder="Select fixture type" /></SelectTrigger>
                              <SelectContent>
                                  {plumbingFixtureTypes.map((o, i) => <SelectItem key={`${o}-${i}`} value={o}>{o}</SelectItem>)}
                              </SelectContent>
                          </Select>
                      </div>
                      <div className="space-y-2">
                          <Label className="text-xs">Pipe Material</Label>
                          <Select value={document.plumbing.pipeMaterial} onValueChange={(value) => handleCategorySelectChange('plumbing', 'pipeMaterial', value)}>
                              <SelectTrigger className="h-9 text-xs"><SelectValue placeholder="Select pipe material" /></SelectTrigger>
                              <SelectContent>
                                  {plumbingPipeMaterials.map((o, i) => <SelectItem key={`${o}-${i}`} value={o}>{o}</SelectItem>)}
                              </SelectContent>
                          </Select>
                      </div>
                      <div className="space-y-2">
                          <Label htmlFor="floorLevel" className="text-xs">Floor Level</Label>
                          <Input id="floorLevel" name="floorLevel" value={document.plumbing.floorLevel} onChange={(e) => handleCategoryDataChange('plumbing', e)} placeholder="e.g. Basement, 1st Floor" className="h-9 text-xs" />
                      </div>
                      <div className="space-y-2 md:col-span-2">
                          <Label htmlFor="leakLocation" className="text-xs">Leak Location</Label>
                          <Input id="leakLocation" name="leakLocation" value={document.plumbing.leakLocation} onChange={(e) => handleCategoryDataChange('plumbing', e)} className="h-9 text-xs" />
                      </div>
                      <div className="space-y-2">
                          <Label htmlFor="estimatedRepairTime" className="text-xs">Estimated Repair Time</Label>
                          <Input id="estimatedRepairTime" name="estimatedRepairTime" value={document.plumbing.estimatedRepairTime} onChange={(e) => handleCategoryDataChange('plumbing', e)} placeholder="e.g. 2-3 hours" className="h-9 text-xs" />
                      </div>
                      <div className="pt-6 flex flex-col gap-4">
                          <div className="flex items-center space-x-2">
                              <Checkbox id="emergencyService" name="emergencyService" checked={document.plumbing.emergencyService} onCheckedChange={(checked) => handleCategorySelectChange('plumbing', 'emergencyService', !!checked)} />
                              <Label htmlFor="emergencyService" className="flex items-center gap-2 text-xs"><Wrench className="h-3 w-3" /> Emergency Service?</Label>
                          </div>
                          <div className="flex items-center space-x-2">
                              <Checkbox id="waterPressureIssue" name="waterPressureIssue" checked={document.plumbing.waterPressureIssue} onCheckedChange={(checked) => handleCategorySelectChange('plumbing', 'waterPressureIssue', !!checked)} />
                              <Label htmlFor="waterPressureIssue" className="flex items-center gap-2 text-xs"><Droplets className="h-3 w-3" />Water Pressure Issue?</Label>
                          </div>
                      </div>
                  </CardContent>
                </CollapsibleContent>
              </Card>
            </Collapsible>
        )}

        {document.category === "Electrical Estimate" && document.electrical && (
            <Collapsible defaultOpen>
              <Card className="bg-card/50 backdrop-blur-sm shadow-lg hover:shadow-primary/20 transition-shadow duration-300 group-disabled:opacity-70">
                <CollapsibleTrigger asChild>
                  <CardHeader className="flex flex-row items-center justify-between cursor-pointer">
                    <CardTitle className="text-base">Electrical Project Details</CardTitle>
                    <ChevronDown className="h-4 w-4 shrink-0 transition-transform duration-200 group-data-[state=open]:rotate-180" />
                  </CardHeader>
                </CollapsibleTrigger>
                <CollapsibleContent>
                  <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <div className="space-y-2"><Label className="text-xs">Service Type</Label><Input name="serviceType" value={document.electrical.serviceType} onChange={(e) => handleCategoryDataChange('electrical', e)} placeholder="e.g. Install, Repair, Upgrade" className="h-9 text-xs" /></div>
                      <div className="space-y-2"><Label className="text-xs">Wiring Type</Label><Input name="wiringType" value={document.electrical.wiringType} onChange={(e) => handleCategoryDataChange('electrical', e)} placeholder="e.g. Copper, Aluminum" className="h-9 text-xs" /></div>
                      <div className="space-y-2"><Label className="text-xs">Panel Size</Label><Input name="panelSize" value={document.electrical.panelSize} onChange={(e) => handleCategoryDataChange('electrical', e)} placeholder="e.g. 100A, 200A" className="h-9 text-xs" /></div>
                      <div className="space-y-2"><Label htmlFor="outletsFixturesCount" className="text-xs">Outlets/Fixtures Count</Label><Input id="outletsFixturesCount" name="outletsFixturesCount" type="number" value={document.electrical.outletsFixturesCount ?? ''} onChange={(e) => handleCategoryDataChange('electrical', e)} className="h-9 text-xs" /></div>
                      <div className="space-y-2 md:col-span-2"><Label htmlFor="roomsInvolved" className="text-xs">Rooms Involved</Label><Input id="roomsInvolved" name="roomsInvolved" value={document.electrical.roomsInvolved} onChange={(e) => handleCategoryDataChange('electrical', e)} placeholder="e.g., Kitchen, Living Room" className="h-9 text-xs" /></div>
                      <div className="flex items-center space-x-2 pt-6"><Checkbox id="panelUpgradeNeeded" name="panelUpgradeNeeded" checked={document.electrical.panelUpgradeNeeded} onCheckedChange={(c) => handleCategorySelectChange('electrical', 'panelUpgradeNeeded', !!c)} /><Label htmlFor="panelUpgradeNeeded" className="flex items-center gap-2 text-xs"><Zap className="h-3 w-3" /> Panel Upgrade Needed?</Label></div>
                      <div className="flex items-center space-x-2 pt-6"><Checkbox id="evChargerNeeded" name="evChargerNeeded" checked={document.electrical.evChargerNeeded} onCheckedChange={(c) => handleCategorySelectChange('electrical', 'evChargerNeeded', !!c)} /><Label htmlFor="evChargerNeeded" className="flex items-center gap-2 text-xs"><Car className="h-3 w-3" /> EV Charger Needed?</Label></div>
                      <div className="flex items-center space-x-2"><Checkbox id="inspectionRequired-electrical" name="inspectionRequired" checked={document.electrical.inspectionRequired} onCheckedChange={(c) => handleCategorySelectChange('electrical', 'inspectionRequired', !!c)} /><Label htmlFor="inspectionRequired-electrical" className="flex items-center gap-2 text-xs"><CheckSquare className="h-3 w-3" /> Inspection Required?</Label></div>
                  </CardContent>
                </CollapsibleContent>
              </Card>
            </Collapsible>
        )}

        {document.category === "Landscaping Estimate" && document.landscaping && (
            <Collapsible defaultOpen>
              <Card className="bg-card/50 backdrop-blur-sm shadow-lg hover:shadow-primary/20 transition-shadow duration-300 group-disabled:opacity-70">
                 <CollapsibleTrigger asChild>
                  <CardHeader className="flex flex-row items-center justify-between cursor-pointer">
                    <CardTitle className="text-base">Landscaping Project Details</CardTitle>
                    <ChevronDown className="h-4 w-4 shrink-0 transition-transform duration-200 group-data-[state=open]:rotate-180" />
                  </CardHeader>
                </CollapsibleTrigger>
                <CollapsibleContent>
                  <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <div className="space-y-2 md:col-span-2"><Label htmlFor="serviceType-landscaping" className="text-xs">Service Type</Label><Input id="serviceType-landscaping" name="serviceType" value={document.landscaping.serviceType} onChange={(e) => handleCategoryDataChange('landscaping', e)} placeholder="e.g., Lawn Mowing, Tree Trimming" className="h-9 text-xs" /></div>
                      <div className="space-y-2"><Label htmlFor="propertySize" className="text-xs">Property Size (sq ft or acres)</Label><Input id="propertySize" name="propertySize" value={document.landscaping.propertySize} onChange={(e) => handleCategoryDataChange('landscaping', e)} className="h-9 text-xs" /></div>
                      <div className="space-y-2"><Label htmlFor="grassHeight" className="text-xs">Grass Height</Label><Input id="grassHeight" name="grassHeight" value={document.landscaping.grassHeight} onChange={(e) => handleCategoryDataChange('landscaping', e)} className="h-9 text-xs" /></div>
                      <div className="space-y-2"><Label htmlFor="treeCount" className="text-xs">Tree Count</Label><Input id="treeCount" name="treeCount" type="number" value={document.landscaping.treeCount ?? ''} onChange={(e) => handleCategoryDataChange('landscaping', e)} className="h-9 text-xs" /></div>
                      <div className="space-y-2"><Label htmlFor="fenceLengthNeeded" className="text-xs">Fence Length Needed</Label><Input id="fenceLengthNeeded" name="fenceLengthNeeded" value={document.landscaping.fenceLengthNeeded} onChange={(e) => handleCategoryDataChange('landscaping', e)} className="h-9 text-xs" /></div>
                      <div className="space-y-2 md:col-span-2"><Label className="text-xs">Yard Condition</Label><RadioGroup value={document.landscaping.yardCondition} onValueChange={(v) => handleCategorySelectChange('landscaping', 'yardCondition', v)} className="flex gap-4"><div className="flex items-center space-x-2"><RadioGroupItem value="Good" id="cond-good" /><Label htmlFor="cond-good" className="flex items-center gap-2 text-xs"><Trees className="h-3 w-3" /> Good</Label></div><div className="flex items-center space-x-2"><RadioGroupItem value="Moderate" id="cond-mod" /><Label htmlFor="cond-mod" className="text-xs">Moderate</Label></div><div className="flex items-center space-x-2"><RadioGroupItem value="Poor" id="cond-poor" /><Label htmlFor="cond-poor" className="text-xs">Poor</Label></div></RadioGroup></div>
                  </CardContent>
                </CollapsibleContent>
              </Card>
            </Collapsible>
        )}

        {document.category === "Cleaning Estimate" && document.cleaning && (
            <Collapsible defaultOpen>
              <Card className="bg-card/50 backdrop-blur-sm shadow-lg hover:shadow-primary/20 transition-shadow duration-300 group-disabled:opacity-70">
                <CollapsibleTrigger asChild>
                  <CardHeader className="flex flex-row items-center justify-between cursor-pointer">
                    <CardTitle className="text-base">Cleaning Job Details</CardTitle>
                    <ChevronDown className="h-4 w-4 shrink-0 transition-transform duration-200 group-data-[state=open]:rotate-180" />
                  </CardHeader>
                </CollapsibleTrigger>
                <CollapsibleContent>
                  <CardContent className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                          <div className="space-y-2"><Label className="text-xs">Cleaning Type</Label><Input name="cleaningType" value={document.cleaning.cleaningType} onChange={(e) => handleCategoryDataChange('cleaning', e)} placeholder="e.g. Standard, Deep Clean" className="h-9 text-xs" /></div>
                          <div className="space-y-2"><Label className="text-xs">Frequency</Label><Input name="frequency" value={document.cleaning.frequency} onChange={(e) => handleCategoryDataChange('cleaning', e)} placeholder="e.g. One-time, Weekly" className="h-9 text-xs" /></div>
                          <div className="space-y-2"><Label htmlFor="homeSize" className="text-xs">Home Size (sq ft)</Label><Input id="homeSize" name="homeSize" type="number" value={document.cleaning.homeSize ?? ''} onChange={(e) => handleCategoryDataChange('cleaning', e)} className="h-9 text-xs" /></div>
                          <div className="space-y-2"><Label className="text-xs">Kitchen Size</Label><Input name="kitchenSize" value={document.cleaning.kitchenSize} onChange={(e) => handleCategoryDataChange('cleaning', e)} placeholder="e.g. Small, Medium, Large" className="h-9 text-xs" /></div>
                          <div className="space-y-2"><Label htmlFor="bedrooms" className="text-xs">Bedrooms</Label><Input id="bedrooms" name="bedrooms" type="number" value={document.cleaning.bedrooms ?? ''} onChange={(e) => handleCategoryDataChange('cleaning', e)} className="h-9 text-xs" /></div>
                          <div className="space-y-2"><Label htmlFor="bathrooms" className="text-xs">Bathrooms</Label><Input id="bathrooms" name="bathrooms" type="number" value={document.cleaning.bathrooms ?? ''} onChange={(e) => handleCategoryDataChange('cleaning', e)} className="h-9 text-xs" /></div>
                      </div>
                      <div className="flex items-center space-x-2 pt-2"><Checkbox id="hasPets" name="hasPets" checked={document.cleaning.hasPets} onCheckedChange={(c) => handleCategorySelectChange('cleaning', 'hasPets', !!c)} /><Label htmlFor="hasPets" className="text-xs">Any Pets?</Label></div>
                      <div className="space-y-3"><Label className="text-xs">Add-ons</Label><div className="grid grid-cols-2 md:grid-cols-3 gap-x-4 gap-y-2">
                          {['Carpet', 'Windows', 'Fridge', 'Oven', 'Laundry', 'Walls'].map((addOn, i) => (
                              <div key={`${addOn}-${i}`} className="flex items-center space-x-2"><Checkbox id={`addOn-${addOn}`} checked={cleaningAddOns.includes(addOn)} onCheckedChange={(c) => handleCleaningAddOnChange(addOn, !!c)} /><Label htmlFor={`addOn-${addOn}`} className="text-xs">{addOn}</Label></div>
                          ))}
                      </div></div>
                  </CardContent>
                </CollapsibleContent>
              </Card>
            </Collapsible>
        )}

        {document.category === "Auto Repair Estimate" && document.autoRepair && (
            <Collapsible defaultOpen>
              <Card className="bg-card/50 backdrop-blur-sm shadow-lg hover:shadow-primary/20 transition-shadow duration-300 group-disabled:opacity-70">
                <CollapsibleTrigger asChild>
                  <CardHeader className="flex flex-row items-center justify-between cursor-pointer">
                    <CardTitle className="text-base">Auto Repair Details</CardTitle>
                    <ChevronDown className="h-4 w-4 shrink-0 transition-transform duration-200 group-data-[state=open]:rotate-180" />
                  </CardHeader>
                </CollapsibleTrigger>
                <CollapsibleContent>
                  <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <div className="space-y-2"><Label htmlFor="vehicleMake" className="text-xs">Vehicle Make</Label><Input id="vehicleMake" name="vehicleMake" value={document.autoRepair.vehicleMake} onChange={(e) => handleCategoryDataChange('autoRepair', e)} className="h-9 text-xs" /></div>
                      <div className="space-y-2"><Label htmlFor="vehicleModel" className="text-xs">Vehicle Model</Label><Input id="vehicleModel" name="vehicleModel" value={document.autoRepair.vehicleModel} onChange={(e) => handleCategoryDataChange('autoRepair', e)} className="h-9 text-xs" /></div>
                      <div className="space-y-2"><Label htmlFor="vehicleYear" className="text-xs">Vehicle Year</Label><Input id="vehicleYear" name="vehicleYear" type="number" value={document.autoRepair.vehicleYear ?? ''} onChange={(e) => handleCategoryDataChange('autoRepair', e)} className="h-9 text-xs" /></div>
                      <div className="space-y-2"><Label htmlFor="mileage" className="text-xs">Mileage</Label><Input id="mileage" name="mileage" type="number" value={document.autoRepair.mileage ?? ''} onChange={(e) => handleCategoryDataChange('autoRepair', e)} className="h-9 text-xs" /></div>
                      <div className="space-y-2 md:col-span-2"><Label htmlFor="vin" className="text-xs">VIN</Label><Input id="vin" name="vin" value={document.autoRepair.vin} onChange={(e) => handleCategoryDataChange('autoRepair', e)} className="h-9 text-xs" /></div>
                      <div className="space-y-2 md:col-span-2"><Label htmlFor="issueDescription" className="text-xs">Issue Description</Label><Textarea id="issueDescription" name="issueDescription" value={document.autoRepair.issueDescription} onChange={(e) => handleCategoryDataChange('autoRepair', e)} className="text-xs min-h-[60px]" /></div>
                      <div className="space-y-2 md:col-span-2"><Label htmlFor="partsRequired" className="text-xs">Parts Required</Label><Textarea id="partsRequired" name="partsRequired" value={document.autoRepair.partsRequired} onChange={(e) => handleCategoryDataChange('autoRepair', e)} className="text-xs min-h-[60px]" /></div>
                      <div className="space-y-2 md:col-span-2"><Label className="text-xs">Diagnostic Type</Label><RadioGroup value={document.autoRepair.diagnosticType} onValueChange={(v) => handleCategorySelectChange('autoRepair', 'diagnosticType', v)} className="flex gap-4"><div className="flex items-center space-x-2"><RadioGroupItem value="Basic" id="diag-basic" /><Label htmlFor="diag-basic" className="text-xs">Basic</Label></div><div className="flex items-center space-x-2"><RadioGroupItem value="Advanced" id="diag-adv" /><Label htmlFor="diag-adv" className="text-xs">Advanced</Label></div></RadioGroup></div>
                  </CardContent>
                </CollapsibleContent>
              </Card>
            </Collapsible>
        )}

        {document.category === 'Construction Estimate' && document.construction && (
            <Collapsible defaultOpen>
              <Card className="bg-card/50 backdrop-blur-sm shadow-lg hover:shadow-primary/20 transition-shadow duration-300 group-disabled:opacity-70">
                 <CollapsibleTrigger asChild>
                  <CardHeader className="flex flex-row items-center justify-between cursor-pointer">
                    <CardTitle className="text-base">Construction Project Details</CardTitle>
                    <ChevronDown className="h-4 w-4 shrink-0 transition-transform duration-200 group-data-[state=open]:rotate-180" />
                  </CardHeader>
                </CollapsibleTrigger>
                <CollapsibleContent>
                  <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <div className="space-y-2"><Label htmlFor="constructionProjectType" className="text-xs">Project Type</Label><Input id="constructionProjectType" name="projectType" value={document.construction.projectType} onChange={(e) => handleCategoryDataChange('construction', e)} placeholder="New Home, Addition..." className="h-9 text-xs" /></div>
                      <div className="space-y-2"><Label htmlFor="constructionSqFt" className="text-xs">Square Footage</Label><Input id="constructionSqFt" name="squareFootage" type="number" value={document.construction.squareFootage ?? ''} onChange={(e) => handleCategoryDataChange('construction', e)} className="h-9 text-xs" /></div>
                      <div className="space-y-2"><Label htmlFor="lotSize" className="text-xs">Lot Size</Label><Input id="lotSize" name="lotSize" value={document.construction.lotSize} onChange={(e) => handleCategoryDataChange('construction', e)} className="h-9 text-xs" /></div>
                      <div className="space-y-2"><Label htmlFor="buildingType" className="text-xs">Building Type</Label><Input id="buildingType" name="buildingType" value={document.construction.buildingType} onChange={(e) => handleCategoryDataChange('construction', e)} className="h-9 text-xs" /></div>
                      <div className="space-y-2"><Label htmlFor="soilCondition" className="text-xs">Soil Condition</Label><Input id="soilCondition" name="soilCondition" value={document.construction.soilCondition} onChange={(e) => handleCategoryDataChange('construction', e)} className="h-9 text-xs" /></div>
                      <div className="space-y-2"><Label htmlFor="materialPreference" className="text-xs">Material Preference</Label><Input id="materialPreference" name="materialPreference" value={document.construction.materialPreference} onChange={(e) => handleCategoryDataChange('construction', e)} className="h-9 text-xs" /></div>
                      <div className="flex items-center space-x-2 pt-6"><Checkbox id="constructionPermit" name="permitRequired" checked={document.construction.permitRequired} onCheckedChange={(c) => handleCategorySelectChange('construction', 'permitRequired', !!c)} /><Label htmlFor="constructionPermit" className="flex items-center gap-2 text-xs"><DraftingCompass className="h-3 w-3" /> Permit Required?</Label></div>
                      <div className="flex items-center space-x-2 pt-6"><Checkbox id="architectDrawings" name="architectDrawingsProvided" checked={document.construction.architectDrawingsProvided} onCheckedChange={(c) => handleCategorySelectChange('construction', 'architectDrawingsProvided', !!c)} /><Label htmlFor="architectDrawings" className="flex items-center gap-2 text-xs"><Pencil className="h-3 w-3" /> Architect Drawings Provided?</Label></div>
                      <div className="flex items-center space-x-2"><Checkbox id="constructionInspection" name="inspectionRequired" checked={document.construction.inspectionRequired} onCheckedChange={(c) => handleCategorySelectChange('construction', 'inspectionRequired', !!c)} /><Label htmlFor="constructionInspection" className="flex items-center gap-2 text-xs"><CheckSquare className="h-3 w-3" /> Inspection Required?</Label></div>
                  </CardContent>
                </CollapsibleContent>
              </Card>
            </Collapsible>
        )}

        {document.category === 'IT / Freelance Estimate' && document.itFreelance && (
            <Collapsible defaultOpen>
              <Card className="bg-card/50 backdrop-blur-sm shadow-lg hover:shadow-primary/20 transition-shadow duration-300 group-disabled:opacity-70">
                 <CollapsibleTrigger asChild>
                  <CardHeader className="flex flex-row items-center justify-between cursor-pointer">
                    <CardTitle className="text-base">IT/Freelance Project Details</CardTitle>
                    <ChevronDown className="h-4 w-4 shrink-0 transition-transform duration-200 group-data-[state=open]:rotate-180" />
                  </CardHeader>
                </CollapsibleTrigger>
                <CollapsibleContent>
                  <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <div className="space-y-2"><Label htmlFor="itProjectType" className="text-xs">Project Type</Label><Input id="itProjectType" name="projectType" value={document.itFreelance.projectType} onChange={(e) => handleCategoryDataChange('itFreelance', e)} placeholder="Website, App, Branding..." className="h-9 text-xs" /></div>
                      <div className="space-y-2"><Label htmlFor="itDesignStyle" className="text-xs">Design Style</Label><Input id="itDesignStyle" name="designStyle" value={document.itFreelance.designStyle} onChange={(e) => handleCategoryDataChange('itFreelance', e)} className="h-9 text-xs" /></div>
                      <div className="space-y-2"><Label htmlFor="pagesScreensCount" className="text-xs">Number of Pages/Screens</Label><Input id="pagesScreensCount" name="pagesScreensCount" type="number" value={document.itFreelance.pagesScreensCount ?? ''} onChange={(e) => handleCategoryDataChange('itFreelance', e)} className="h-9 text-xs" /></div>
                      <div className="space-y-2"><Label htmlFor="revisionsIncluded" className="text-xs">Revisions Included</Label><Input id="revisionsIncluded" name="revisionsIncluded" type="number" value={document.itFreelance.revisionsIncluded ?? ''} onChange={(e) => handleCategoryDataChange('itFreelance', e)} className="h-9 text-xs" /></div>
                      <div className="space-y-2 md:col-span-2"><Label htmlFor="itScope" className="text-xs">Scope of Work</Label><Textarea id="itScope" name="scopeOfWork" value={document.itFreelance.scopeOfWork} onChange={(e) => handleCategoryDataChange('itFreelance', e)} className="text-xs min-h-[60px]" /></div>
                      <div className="space-y-2 md:col-span-2"><Label htmlFor="itFeatures" className="text-xs">Features Needed</Label><Textarea id="itFeatures" name="featuresNeeded" value={document.itFreelance.featuresNeeded} onChange={(e) => handleCategoryDataChange('itFreelance', e)} className="text-xs min-h-[60px]" /></div>
                      <div className="space-y-2 md:col-span-2"><Label htmlFor="itIntegrations" className="text-xs">Integrations</Label><Textarea id="itIntegrations" name="integrations" value={document.itFreelance.integrations} onChange={(e) => handleCategoryDataChange('itFreelance', e)} placeholder="Payment, APIs, Auth..." className="text-xs min-h-[60px]" /></div>
                      <div className="space-y-2 md:col-span-2"><Label htmlFor="itTimeline" className="text-xs">Delivery Timeline</Label><Input id="itTimeline" name="deliveryTimeline" value={document.itFreelance.deliveryTimeline} onChange={(e) => handleCategoryDataChange('itFreelance', e)} className="h-9 text-xs" /></div>
                  </CardContent>
                </CollapsibleContent>
              </Card>
            </Collapsible>
        )}

        <Collapsible defaultOpen>
          <Card className="bg-card/50 backdrop-blur-sm shadow-lg hover:shadow-primary/20 transition-shadow duration-300 group-disabled:opacity-70">
            <CollapsibleTrigger asChild>
              <CardHeader className="flex flex-row items-center justify-between cursor-pointer">
                <CardTitle className="text-base">Line Items (Services / Products)</CardTitle>
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
                      <Button variant="outline" size="sm" className="text-xs" disabled={document.lineItems.length === 0}><Save className="mr-2 h-3 w-3" /> Save as Preset</Button>
                    </DialogTrigger>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Save Line Item Preset</DialogTitle>
                            <DialogDescription>
                                Save the current set of line items for quick use in the future.
                            </DialogDescription>
                        </DialogHeader>
                        <div className="space-y-2"><Label htmlFor="preset-name">Preset Name</Label><Input id="preset-name" value={newPresetName} onChange={(e) => setNewPresetName(e.target.value)} placeholder="e.g., Standard Roof Repair"/></div>
                        <DialogFooter><DialogClose asChild><Button variant="ghost">Cancel</Button></DialogClose><Button onClick={handleSavePreset}>Save Preset</Button></DialogFooter>
                    </DialogContent>
                  </Dialog>
                </div>
              </div>

              <div className="hidden md:grid md:grid-cols-[2fr_3fr_1fr_1.5fr_0.5fr_1.5fr_auto] gap-x-4 text-xs font-medium text-muted-foreground items-center">
                  <Label>Item</Label>
                  <Label>Description</Label>
                  <Label>Qty</Label>
                  <Label>Unit Price</Label>
                  <Label className="text-center">Tax</Label>
                  <Label className="text-right">Subtotal</Label>
                  <span></span>
              </div>
              {document.lineItems.map((item, index) => (
                  <div key={item.id} className="grid grid-cols-1 md:grid-cols-[2fr_3fr_1fr_1.5fr_0.5fr_1.5fr_auto] gap-x-4 gap-y-2 items-start border-b pb-3">
                      <div className="space-y-2">
                          <Label htmlFor={`itemName-${index}`} className="text-xs md:hidden">Item</Label>
                          <Textarea id={`itemName-${index}`} placeholder="Item" value={item.name} onChange={(e) => handleItemChange(index, 'name', e.target.value)} className="text-xs min-h-9" rows={1}/>
                      </div>
                      <div className="space-y-2">
                          <Label htmlFor={`itemDescription-${index}`} className="text-xs md:hidden">Description</Label>
                          <Textarea id={`itemDescription-${index}`} placeholder="Additional details" value={item.description || ''} onChange={(e) => handleItemChange(index, 'description', e.target.value)} className="text-xs min-h-9" rows={1}/>
                      </div>
                      <div className="grid grid-cols-3 md:contents gap-3">
                          <div className="space-y-2">
                              <Label htmlFor={`itemQuantity-${index}`} className="text-xs md:hidden">Qty</Label>
                              <Input id={`itemQuantity-${index}`} type="number" value={item.quantity} onChange={(e) => handleItemChange(index, 'quantity', parseFloat(e.target.value) || 0)} className="w-full h-9 text-xs" />
                          </div>
                          <div className="space-y-2">
                              <Label htmlFor={`itemRate-${index}`} className="text-xs md:hidden">Unit Price</Label>
                              <Input id={`itemRate-${index}`} type="number" value={item.unitPrice} onChange={(e) => handleItemChange(index, 'unitPrice', parseFloat(e.target.value) || 0)} className="w-full h-9 text-xs" />
                          </div>
                          <div className="flex items-center justify-center h-9">
                              <Checkbox id={`itemTaxable-${index}`} checked={item.taxable} onCheckedChange={(checked) => handleItemChange(index, 'taxable', !!checked)} />
                          </div>
                      </div>

                      <div className="flex items-center h-9 justify-end">
                          <p className="font-medium tabular-nums text-sm">{currencySymbol}{(item.quantity * item.unitPrice).toFixed(2)}</p>
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
          <Card className="bg-card/50 backdrop-blur-sm shadow-lg hover:shadow-primary/20 transition-shadow duration-300 group-disabled:opacity-70">
             <CollapsibleTrigger asChild>
              <CardHeader className="flex flex-row items-center justify-between cursor-pointer">
                <CardTitle className="text-base">Pricing Summary &amp; Terms</CardTitle>
                <ChevronDown className="h-4 w-4 shrink-0 transition-transform duration-200 group-data-[state=open]:rotate-180" />
              </CardHeader>
            </CollapsibleTrigger>
            <CollapsibleContent>
              <CardContent className="space-y-3">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="space-y-2">
                  <Label htmlFor="taxPercentage" className="text-xs">Tax (%)</Label>
                  <Input id="taxPercentage" name="summary.taxPercentage" type="number" value={document.summary.taxPercentage} onChange={handleNumberChange} className="h-9 text-xs" />
                  </div>
                  <div className="space-y-2">
                  <Label htmlFor="discount" className="text-xs">Discount (Fixed Amount)</Label>
                  <Input id="discount" name="summary.discount" type="number" value={document.summary.discount} onChange={handleNumberChange} className="h-9 text-xs" />
                  </div>
                  <div className="space-y-2 col-span-1 sm:col-span-2">
                  <Label htmlFor="shippingCost" className="text-xs">Shipping / Extra Costs</Label>
                  <div className="relative flex items-center">
                      <Truck className="absolute left-3 h-4 w-4 text-muted-foreground" />
                      <Input id="shippingCost" name="summary.shippingCost" type="number" value={document.summary.shippingCost} onChange={handleNumberChange} className="pl-9 h-9 text-xs"/>
                  </div>
                  </div>
              </div>
              <div className="space-y-2">
                  <Label htmlFor="termsAndConditions" className="text-xs">Terms &amp; Conditions</Label>
                  <Textarea id="termsAndConditions" name="termsAndConditions" value={document.termsAndConditions.replace('{docType}', document.documentType)} onChange={handleInputChange} placeholder="e.g., Payment terms, validity period, warranty information..." className="text-xs min-h-[60px]" />
              </div>
              <div className="space-y-2">
                  <Label className="text-xs">Owner Signature</Label>
                  <div className="flex gap-2">
                      <Dialog open={isSignatureDialogOpen} onOpenChange={setIsSignatureDialogOpen}>
                          <DialogTrigger asChild>
                              <Button variant="outline" className="w-full text-xs h-9">
                                  <Pencil className="mr-2 h-3 w-3" />
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
                        <Button variant="destructive" size="sm" onClick={handleDeleteSignature} className="text-xs h-9">
                            <Trash2 className="mr-2 h-3 w-3" />
                            Delete
                        </Button>
                      )}
                  </div>

                  {document.business.ownerSignature && (
                      <div className="p-2 border rounded-md bg-muted/50">
                          <Image src={document.business.ownerSignature.image} alt="Owner Signature" width={100} height={50} />
                      </div>
                  )}
              </div>
              </CardContent>
            </CollapsibleContent>
          </Card>
        </Collapsible>
      </fieldset>
    </>
  );
}
