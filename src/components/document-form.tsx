
'use client';

import { ChangeEvent, Dispatch, SetStateAction, useState, useEffect } from 'react';
import type {
  Estimate, LineItem, Quote, EstimateCategory, Client, ClientInfo,
  ConstructionInfo, RoofingInfo, PlumbingInfo, ElectricalInfo, HVACInfo,
  LandscapingInfo, CleaningInfo, ITFreelanceInfo, HomeRemodelingInfo,
  AuditLogEntry
} from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { DatePicker } from '@/components/ui/datepicker';
import { ImageUp, Plus, Trash2, Palette, X, Mail, Truck, Hash, Phone, Globe, Briefcase, Award, User, FileText, Building, Pencil, Type, Package, Hammer, Ruler, ListTree, CheckSquare, Sparkles, Calendar, TextQuote, Wind, Thermometer, Wrench, Zap, Trees, Droplets, Car, Code, DraftingCompass, PaintBucket, Paintbrush, Save, Loader2, ChevronDown, ChevronsUpDown, Check } from 'lucide-react';
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
import { useUserAuth } from '@/context/auth-provider';
import { useFirebase, useCollection, useMemoFirebase } from '@/firebase';
import { collection, query } from 'firebase/firestore';
import { cn } from '@/lib/utils';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command';
import { PlusCircle, Wallet, Settings2 } from 'lucide-react';

interface DocumentFormProps {
  document: Estimate | Quote;
  setDocument: Dispatch<SetStateAction<Estimate | Quote>>;
  accentColor: string;
  setAccentColor: Dispatch<SetStateAction<string>>;
  backgroundColor: string;
  setBackgroundColor: Dispatch<SetStateAction<string>>;
  textColor: string;
  setTextColor: Dispatch<SetStateAction<string>>;
  toast: any;
  documentType: 'invoice' | 'estimate' | 'quote';
}

interface Preset {
  name: string;
  items: Omit<LineItem, 'id'>[];
}

const fonts = [
  { value: 'Inter', label: 'Inter' },
  { value: 'Roboto', label: 'Roboto' },
  { value: 'Lato', label: 'Lato' },
  { value: 'Merriweather', label: 'Merriweather' },
  { value: 'system-ui', label: 'System Default' },
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

const currencies = [
  { value: 'USD', label: 'USD ($)' },
  { value: 'EUR', label: 'EUR (€)' },
  { value: 'GBP', label: 'GBP (£)' },
  { value: 'JPY', label: 'JPY (¥)' },
  { value: 'PKR', label: 'PKR (₨)' },
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
  "IT / Freelance Estimate",
];


export function DocumentForm({ document, setDocument, accentColor, setAccentColor, backgroundColor, setBackgroundColor, textColor, setTextColor, toast, documentType }: DocumentFormProps) {
  const [bulkAddCount, setBulkAddCount] = useState(5);
  const [accentColorInput, setAccentColorInput] = useState(accentColor);
  const [bgColorInput, setBgColorInput] = useState(backgroundColor);
  const [textColorInput, setTextColorInput] = useState(textColor);
  const [isSignatureDialogOpen, setIsSignatureDialogOpen] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [cleaningAddOns, setCleaningAddOns] = useState<string[]>([]);

  const [presets, setPresets] = useState<Preset[]>([]);
  const [selectedPreset, setSelectedPreset] = useState<string>('');
  const [isSavePresetOpen, setIsSavePresetOpen] = useState(false);
  const [newPresetName, setNewPresetName] = useState('');

  const { userProfile } = useUserAuth();
  const { firestore } = useFirebase();
  const [isClientPopoverOpen, setIsClientPopoverOpen] = useState(false);

  const companyId = userProfile?.companyId;

  const getInitialClientInfo = (): ClientInfo => ({
    name: '',
    address: '',
    phone: '',
    email: '',
    companyName: '',
  });

  const clientsQuery = useMemoFirebase(() => {
    if (!firestore || !companyId) return null;
    return query(collection(firestore, 'companies', companyId, 'clients'));
  }, [firestore, companyId]);

  const { data: clients } = useCollection<Client>(clientsQuery);

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

  useEffect(() => {
    setDocument(prev => ({ ...prev, accentColor: accentColor }));
  }, [accentColor, setDocument]);


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
                    <Input id="logo-upload" type="file" className="sr-only" onChange={handleLogoUpload} accept="image/png, image/jpeg, image/gif" disabled={isUploading} />
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
                      onBlur={(e) => {
                        setAccentColor(e.target.value);
                        setDocument(prev => ({ ...prev, accentColor: e.target.value }));
                      }}
                      className="pl-9 h-9 text-xs"
                      placeholder="hsl(260 85% 66%)"
                    />
                    <input
                      type="color"
                      value={accentColor.startsWith('hsl') ? '#000000' : accentColor}
                      onChange={(e) => {
                        setAccentColor(e.target.value);
                        setAccentColorInput(e.target.value);
                        setDocument(prev => ({ ...prev, accentColor: e.target.value }));
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
                        setDocument(prev => ({ ...prev, backgroundColor: e.target.value }));
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
                        setDocument(prev => ({ ...prev, textColor: e.target.value }));
                      }}
                      className="absolute right-1 top-1/2 -translate-y-1/2 h-7 w-7 p-1 rounded-md cursor-pointer bg-transparent border-none appearance-none"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="fontFamily" className="text-xs">Font Family</Label>
                  <Select value={document.fontFamily} onValueChange={(value) => setDocument(p => ({ ...p, fontFamily: value }))}>
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
                  <Textarea id="businessAddress" name="address" value={document.business.address} onChange={(e) => handleNestedChange('business', e)} placeholder="Street, City, State, Zip" className="text-xs min-h-[60px]" />
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
                    <Label className="text-xs">Client</Label>
                    <Popover open={isClientPopoverOpen} onOpenChange={setIsClientPopoverOpen}>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          role="combobox"
                          aria-expanded={isClientPopoverOpen}
                          className="w-full justify-between h-9 text-xs font-normal"
                        >
                          <span className="truncate">{document.client.name || "Select client..."}</span>
                          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-[--radix-popover-trigger-width] p-0">
                        <Command
                          filter={(value, search) => {
                            if (clients?.find(c => c.name.toLowerCase() === value)?.name.toLowerCase().includes(search.toLowerCase())) return 1
                            return 0
                          }}
                        >
                          <CommandInput
                            placeholder="Search or create new client..."
                            value={document.client.name}
                            onValueChange={(search) => {
                              setDocument(prev => ({
                                ...prev,
                                client: {
                                  ...getInitialClientInfo(),
                                  name: search,
                                }
                              }));
                            }}
                          />
                          <CommandList>
                            <CommandEmpty>No client found.</CommandEmpty>
                            <CommandGroup>
                              {clients?.map((c) => (
                                <CommandItem
                                  key={c.id}
                                  value={c.name}
                                  onSelect={() => {
                                    setDocument(prev => ({
                                      ...prev,
                                      client: {
                                        ...prev.client,
                                        clientId: c.id,
                                        name: c.name,
                                        companyName: c.companyName || '',
                                        address: c.address,
                                        phone: c.phone || '',
                                        email: c.email,
                                      }
                                    }));
                                    setIsClientPopoverOpen(false);
                                  }}
                                >
                                  <Check
                                    className={cn(
                                      "mr-2 h-4 w-4",
                                      document.client.clientId === c.id ? "opacity-100" : "opacity-0"
                                    )}
                                  />
                                  {c.name}
                                </CommandItem>
                              ))}
                            </CommandGroup>
                          </CommandList>
                        </Command>
                      </PopoverContent>
                    </Popover>
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
                  <Input id="estimateNumber" name="estimateNumber" value={document.estimateNumber} onChange={handleInputChange} className="text-xs h-9" />
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
                  <DatePicker date={document.validUntilDate} setDate={(date) => setDocument(p => ({ ...p, validUntilDate: date! }))} className="h-9 text-xs" />
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

        <Collapsible defaultOpen>
          <Card className="bg-card/50 backdrop-blur-sm shadow-lg hover:shadow-primary/20 transition-shadow duration-300 group-disabled:opacity-70">
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
                        <Button variant="outline" size="sm" className="text-xs" disabled={document.lineItems.length === 0}><Save className="mr-2 h-3 w-3" /> Save as Preset</Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Save Line Item Preset</DialogTitle>
                          <DialogDescription>
                            Save the current set of line items for quick use in the future.
                          </DialogDescription>
                        </DialogHeader>
                        <div className="space-y-2"><Label htmlFor="preset-name">Preset Name</Label><Input id="preset-name" value={newPresetName} onChange={(e) => setNewPresetName(e.target.value)} placeholder="e.g., Standard Website Package" /></div>
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
                {document.lineItems.map((item, index) => (
                  <div key={item.id} className="grid grid-cols-1 md:grid-cols-[1.5fr_4fr_1fr_1.5fr_1.5fr_auto] gap-x-4 gap-y-2 items-start border-b pb-3">
                    <div className="space-y-2">
                      <Label htmlFor={`itemName-${index}`} className="text-xs md:hidden">Item</Label>
                      <Textarea id={`itemName-${index}`} placeholder="Item" value={item.name} onChange={(e) => handleItemChange(index, 'name', e.target.value)} className="text-xs min-h-9" rows={1} />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor={`itemDescription-${index}`} className="text-xs md:hidden">Description</Label>
                      <Textarea id={`itemDescription-${index}`} placeholder="Additional details" value={item.description || ''} onChange={(e) => handleItemChange(index, 'description', e.target.value)} className="text-xs min-h-9" rows={1} />
                    </div>
                    <div className="grid grid-cols-2 md:contents gap-3">
                      <div className="space-y-2">
                        <Label htmlFor={`itemQuantity-${index}`} className="text-xs md:hidden">Qty</Label>
                        <Input id={`itemQuantity-${index}`} type="number" value={item.quantity} onChange={(e) => handleItemChange(index, 'quantity', parseFloat(e.target.value) || 0)} className="w-full h-9 text-xs" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor={`itemRate-${index}`} className="text-xs md:hidden">Unit Price</Label>
                        <Input id={`itemRate-${index}`} type="number" value={document.lineItems[index].unitPrice || 0} onChange={(e) => handleItemChange(index, 'unitPrice', parseFloat(e.target.value) || 0)} className="w-full h-9 text-xs" />
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
          <Card className="bg-card/50 backdrop-blur-sm shadow-lg hover:shadow-primary/20 transition-shadow duration-300 group-disabled:opacity-70">
            <CollapsibleTrigger asChild>
              <CardHeader className="flex flex-row items-center justify-between cursor-pointer">
                <CardTitle className="text-base">Advanced Fields</CardTitle>
                <ChevronDown className="h-4 w-4 shrink-0 transition-transform duration-200 group-data-[state=open]:rotate-180" />
              </CardHeader>
            </CollapsibleTrigger>
            <CollapsibleContent>
              <CardContent className="space-y-4">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <Label className="text-xs font-semibold">Custom Fields</Label>
                  <Button variant="outline" size="sm" onClick={() => {
                    const newFields = [...(document.customFields || []), { id: crypto.randomUUID(), label: '', value: '' }];
                    setDocument(prev => ({ ...prev, customFields: newFields }));
                  }} className="text-xs h-7">
                    <Plus className="mr-2 h-3 w-3" /> Add Field
                  </Button>
                </div>

                {(document.customFields || []).map((field, index) => (
                  <div key={field.id} className="grid grid-cols-[1fr_2fr_auto] gap-2 items-center">
                    <Input
                      placeholder="Label"
                      value={field.label}
                      onChange={(e) => {
                        const newFields = [...(document.customFields || [])];
                        newFields[index].label = e.target.value;
                        setDocument(prev => ({ ...prev, customFields: newFields }));
                      }}
                      className="h-9 text-xs"
                    />
                    <Input
                      placeholder="Value"
                      value={field.value}
                      onChange={(e) => {
                        const newFields = [...(document.customFields || [])];
                        newFields[index].value = e.target.value;
                        setDocument(prev => ({ ...prev, customFields: newFields }));
                      }}
                      className="h-9 text-xs"
                    />
                    <Button variant="ghost" size="icon" onClick={() => {
                      const newFields = (document.customFields || []).filter((_, i) => i !== index);
                      setDocument(prev => ({ ...prev, customFields: newFields }));
                    }} className="h-8 w-8 text-destructive">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </CardContent>
            </CollapsibleContent>
          </Card>
        </Collapsible>

        <Collapsible defaultOpen>
          <Card className="bg-card/50 backdrop-blur-sm shadow-lg hover:shadow-primary/20 transition-shadow duration-300 group-disabled:opacity-70">
            <CollapsibleTrigger asChild>
              <CardHeader className="flex flex-row items-center justify-between cursor-pointer">
                <CardTitle className="text-base">Totals &amp; Signature</CardTitle>
                <ChevronDown className="h-4 w-4 shrink-0 transition-transform duration-200 group-data-[state=open]:rotate-180" />
              </CardHeader>
            </CollapsibleTrigger>
            <CollapsibleContent>
              <CardContent className="space-y-3">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div className="space-y-2">
                    <Label htmlFor="tax" className="text-xs">Tax (%)</Label>
                    <Input id="tax" name="summary.taxPercentage" type="number" value={document.summary.taxPercentage} onChange={handleNumberChange} className="h-9 text-xs" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="discount" className="text-xs">Discount (Fixed Amount)</Label>
                    <Input id="discount" name="summary.discount" type="number" value={document.summary.discount} onChange={handleNumberChange} className="h-9 text-xs" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="shippingCost" className="text-xs">Shipping Cost</Label>
                    <div className="relative flex items-center">
                      <Truck className="absolute left-3 h-4 w-4 text-muted-foreground" />
                      <Input id="shippingCost" name="summary.shippingCost" type="number" value={document.summary.shippingCost} onChange={handleNumberChange} className="pl-9 h-9 text-xs" />
                    </div>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="termsAndConditions" className="text-xs">Terms and Conditions / Notes</Label>
                  <Textarea id="termsAndConditions" name="termsAndConditions" value={document.termsAndConditions} onChange={handleInputChange} className="text-xs" />
                </div>
                <div className="space-y-2">
                  <Label className="text-xs">Authorized Signature</Label>
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
