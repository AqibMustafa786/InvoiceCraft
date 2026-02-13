

import type { Dispatch, SetStateAction } from 'react';
import type { DocumentStatus } from '@/lib/types';
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetFooter,
  SheetClose,
} from "@/components/ui/sheet";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { DatePicker } from "@/components/ui/datepicker";
import { Search, X } from 'lucide-react';

export interface DashboardFilters {
    clientName: string;
    status: DocumentStatus | null;
    amountMin: number | null;
    amountMax: number | null;
    dateFrom: Date | null;
    dateTo: Date | null;
}

interface FilterSheetProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    filters: DashboardFilters;
    onFiltersChange: Dispatch<SetStateAction<DashboardFilters>>;
    onReset: () => void;
}

const STATUS_OPTIONS: DocumentStatus[] = ['draft', 'sent', 'paid', 'overdue', 'accepted', 'rejected', 'expired'];


export function FilterSheet({ open, onOpenChange, filters, onFiltersChange, onReset }: FilterSheetProps) {
    const handleReset = () => {
        onReset();
        onOpenChange(false);
    }
    
    return (
        <Sheet open={open} onOpenChange={onOpenChange}>
            <SheetContent className="flex flex-col w-full max-w-md bg-card/95 backdrop-blur-sm">
                 <SheetHeader className="pr-12">
                    <SheetTitle>Filter Documents</SheetTitle>
                    <SheetDescription>
                        Refine the list of invoices and quotes using multiple criteria.
                    </SheetDescription>
                </SheetHeader>

                <div className="relative mt-6">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                    <Input placeholder="Search..." className="pl-10 text-base" />
                </div>
                
                <div className="grid gap-6 py-6 flex-1 overflow-y-auto pr-4 -mr-4">
                    <div className="space-y-2">
                        <Label htmlFor="filter-clientName">
                            Client Name
                        </Label>
                        <Input
                            id="filter-clientName"
                            value={filters.clientName}
                            onChange={(e) => onFiltersChange(f => ({ ...f, clientName: e.target.value }))}
                            placeholder="Search by client name..."
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="filter-status">
                            Status
                        </Label>
                        <Select
                            value={filters.status ?? 'all'}
                            onValueChange={(value) => onFiltersChange(f => ({ ...f, status: value === 'all' ? null : value as DocumentStatus }))}
                        >
                            <SelectTrigger id="filter-status">
                                <SelectValue placeholder="Any Status" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">Any Status</SelectItem>
                                {STATUS_OPTIONS.map(status => (
                                    <SelectItem key={status} value={status} className="capitalize">{status}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="filter-amountMin">Min Amount</Label>
                            <Input
                                id="filter-amountMin"
                                type="number"
                                value={filters.amountMin ?? ''}
                                onChange={(e) => onFiltersChange(f => ({ ...f, amountMin: e.target.value ? parseFloat(e.target.value) : null }))}
                                placeholder="$0"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="filter-amountMax">Max Amount</Label>
                            <Input
                                id="filter-amountMax"
                                type="number"
                                value={filters.amountMax ?? ''}
                                onChange={(e) => onFiltersChange(f => ({ ...f, amountMax: e.target.value ? parseFloat(e.target.value) : null }))}
                                placeholder="$1000"
                            />
                        </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label>From Date</Label>
                            <DatePicker
                                date={filters.dateFrom ?? undefined}
                                setDate={(date) => onFiltersChange(f => ({...f, dateFrom: date || null}))}
                            />
                        </div>
                         <div className="space-y-2">
                            <Label>To Date</Label>
                             <DatePicker
                                date={filters.dateTo ?? undefined}
                                setDate={(date) => onFiltersChange(f => ({...f, dateTo: date || null}))}
                            />
                        </div>
                    </div>

                </div>
                <SheetFooter className="mt-auto pt-4 border-t gap-2">
                    <Button variant="outline" onClick={handleReset} className="w-full sm:w-auto">Reset Filters</Button>
                    <SheetClose asChild>
                        <Button className="w-full sm:w-auto">Apply</Button>
                    </SheetClose>
                </SheetFooter>
            </SheetContent>
        </Sheet>
    )
}

    