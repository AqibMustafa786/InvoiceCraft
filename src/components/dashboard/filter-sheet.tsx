import type { Dispatch, SetStateAction } from 'react';
import type { InvoiceStatus } from '@/lib/types';
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

export interface DashboardFilters {
    clientName: string;
    status: InvoiceStatus | null;
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

export function FilterSheet({ open, onOpenChange, filters, onFiltersChange, onReset }: FilterSheetProps) {
    const handleReset = () => {
        onReset();
        onOpenChange(false);
    }
    
    return (
        <Sheet open={open} onOpenChange={onOpenChange}>
            <SheetContent>
                <SheetHeader>
                    <SheetTitle>Filter Invoices</SheetTitle>
                    <SheetDescription>
                        Refine the list of invoices using multiple criteria.
                    </SheetDescription>
                </SheetHeader>
                <div className="grid gap-6 py-6">
                    <div className="space-y-2">
                        <Label htmlFor="filter-clientName">Client Name</Label>
                        <Input
                            id="filter-clientName"
                            value={filters.clientName}
                            onChange={(e) => onFiltersChange(f => ({ ...f, clientName: e.target.value }))}
                            placeholder="Search by client name..."
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="filter-status">Status</Label>
                        <Select
                            value={filters.status ?? ''}
                            onValueChange={(value) => onFiltersChange(f => ({ ...f, status: value as InvoiceStatus | null }))}
                        >
                            <SelectTrigger id="filter-status">
                                <SelectValue placeholder="Any Status" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="">Any Status</SelectItem>
                                <SelectItem value="draft">Draft</SelectItem>
                                <SelectItem value="sent">Sent</SelectItem>
                                <SelectItem value="paid">Paid</SelectItem>
                                <SelectItem value="overdue">Overdue</SelectItem>
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
                <SheetFooter className="mt-auto">
                    <Button variant="outline" onClick={handleReset}>Reset Filters</Button>
                    <SheetClose asChild>
                        <Button>Apply</Button>
                    </SheetClose>
                </SheetFooter>
            </SheetContent>
        </Sheet>
    )
}
