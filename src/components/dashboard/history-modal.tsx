

'use client';

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import type { AuditLogEntry } from '@/lib/types';
import { format, isValid } from 'date-fns';
import { Badge } from "../ui/badge";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "../ui/accordion";

interface HistoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  auditLog: AuditLogEntry[];
}

const safeFormat = (date: any, formatString: string) => {
    if (!date) return 'N/A';
    const d = (date instanceof Date) ? date : date.toDate ? date.toDate() : new Date(date);
    if (!isValid(d)) {
        return "Invalid Date";
    }
    return format(d, formatString);
}

const getUserDisplay = (user: any) => {
    if (!user) return 'Unknown';
    if (typeof user === 'string') return user;
    if (typeof user === 'object' && user !== null) {
        return user.name || user.email || 'Unknown';
    }
    return 'Unknown';
}

export function HistoryModal({ isOpen, onClose, auditLog }: HistoryModalProps) {
  const sortedLog = Array.isArray(auditLog)
    ? [...auditLog].sort((a, b) => (b.version || 0) - (a.version || 0))
    : [];

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md bg-card/80 backdrop-blur-sm">
        <DialogHeader>
          <DialogTitle>Document History</DialogTitle>
          <DialogDescription>
            View the complete version history of this document.
          </DialogDescription>
        </DialogHeader>
        <ScrollArea className="h-96 pr-4">
          <div className="relative space-y-6">
            {/* Vertical timeline bar */}
            <div className="absolute left-5 top-0 bottom-0 w-0.5 bg-border -translate-x-1/2"></div>
            
            {sortedLog.length > 0 ? (
                sortedLog.map((entry, index) => (
                    <div key={entry.id || `${entry.version}-${index}`} className="pl-12 relative">
                       <div className="absolute left-5 top-1 w-4 h-4 rounded-full bg-primary -translate-x-1/2 border-4 border-background"></div>
                       <div className="min-w-0">
                         <div className="flex items-center gap-2">
                            <h4 className="font-semibold text-base">Version {entry.version}</h4>
                            {index === 0 && <Badge variant="secondary">Latest</Badge>}
                         </div>
                         <p className="mt-1 text-xs text-muted-foreground">
                            {safeFormat(entry.timestamp, "MMM d, yyyy '•' h:mm a")} by {getUserDisplay(entry.user)}
                         </p>

                        {entry.changes && entry.changes.length > 0 && (
                             <Accordion type="single" collapsible className="w-full mt-2">
                                <AccordionItem value="item-1" className="border-b-0">
                                    <AccordionTrigger className="text-sm py-1 hover:no-underline">
                                        View {entry.changes.length} change(s)
                                    </AccordionTrigger>
                                    <AccordionContent>
                                        <div className="mt-2 text-xs p-3 bg-muted/50 rounded-md border max-w-full overflow-hidden">
                                            <ul className="list-disc pl-4 text-muted-foreground space-y-1">
                                                {entry.changes.map((change, i) => (
                                                    <li key={i} className="break-all">{change}</li>
                                                ))}
                                            </ul>
                                        </div>
                                    </AccordionContent>
                                </AccordionItem>
                            </Accordion>
                        )}
                       </div>
                    </div>
                ))
            ) : (
                <div className="text-center text-muted-foreground py-10 pl-12">
                    No history recorded for this document yet.
                </div>
            )}
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
