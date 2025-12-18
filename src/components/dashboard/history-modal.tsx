

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
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "../ui/collapsible";
import { Button } from "../ui/button";
import { ChevronsUpDown } from "lucide-react";

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

const getActionVariant = (action: AuditLogEntry['action']) => {
    switch (action) {
        case 'created': return 'success';
        case 'updated': return 'secondary';
        case 'sent': return 'default';
        case 'viewed': return 'outline';
        case 'signed': return 'success';
        case 'declined': return 'destructive';
        default: return 'outline';
    }
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
            <div className="absolute left-10 top-2 bottom-2 w-0.5 bg-border -translate-x-1/2"></div>
            
            {sortedLog.length > 0 ? (
                sortedLog.map((entry, index) => (
                    <div key={entry.id || `${entry.version}-${index}`} className="pl-20 relative">
                       <div className="absolute left-10 top-1 w-4 h-4 rounded-full bg-primary -translate-x-1/2 border-4 border-background"></div>
                       <div className="flex items-start justify-between">
                            <div>
                               <p className="font-semibold">Version {entry.version}</p>
                               <p className="text-xs text-muted-foreground">
                                   {safeFormat(entry.timestamp, "MMM d, yyyy 'at' h:mm a")} by {getUserDisplay(entry.user)}
                               </p>
                            </div>
                           <Badge variant={getActionVariant(entry.action)} className="capitalize h-6 justify-center">
                                {entry.action}
                            </Badge>
                       </div>
                        
                        {entry.changes && entry.changes.length > 0 && (
                            <Collapsible className="mt-2">
                                <CollapsibleTrigger asChild>
                                    <Button variant="ghost" size="sm" className="text-xs h-7">
                                        <ChevronsUpDown className="h-3 w-3 mr-1" />
                                        View {entry.changes.length} change(s)
                                    </Button>
                                </CollapsibleTrigger>
                                <CollapsibleContent>
                                    <div className="mt-2 text-xs p-3 bg-muted/50 rounded-md border">
                                        <p className="font-semibold mb-1">Changes:</p>
                                        <ul className="list-disc pl-4 text-muted-foreground space-y-1">
                                            {entry.changes.map((change, i) => (
                                                <li key={i} className="break-words">{change}</li>
                                            ))}
                                        </ul>
                                    </div>
                                </CollapsibleContent>
                            </Collapsible>
                        )}
                    </div>
                ))
            ) : (
                <div className="text-center text-muted-foreground py-10">
                    No history recorded for this document yet.
                </div>
            )}
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
