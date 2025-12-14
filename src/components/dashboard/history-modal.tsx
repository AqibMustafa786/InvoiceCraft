
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
import { format } from 'date-fns';
import { Badge } from "../ui/badge";

interface HistoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  auditLog: AuditLogEntry[];
}

const safeFormat = (date: any, formatString: string) => {
    if (!date) return 'N/A';
    try {
        const d = date.toDate ? date.toDate() : new Date(date);
        return format(d, formatString);
    } catch (e) {
        return "Invalid Date";
    }
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

export function HistoryModal({ isOpen, onClose, auditLog = [] }: HistoryModalProps) {
  const sortedLog = [...auditLog].sort((a, b) => b.version - a.version);

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
          <div className="space-y-6">
            {sortedLog.length > 0 ? (
                sortedLog.map((entry, index) => (
                    <div key={index} className="flex gap-4">
                       <div className="flex flex-col items-center">
                            <Badge variant={getActionVariant(entry.action)} className="capitalize h-6 w-20 justify-center">
                                {entry.action}
                            </Badge>
                            <div className="h-full w-px bg-border my-1"></div>
                       </div>
                       <div className="pb-6">
                           <p className="font-semibold">Version {entry.version}</p>
                           <p className="text-xs text-muted-foreground">
                                {safeFormat(entry.timestamp, "MMM d, yyyy 'at' h:mm a")}
                           </p>
                            {entry.user && <p className="text-xs text-muted-foreground">by {entry.user}</p>}
                       </div>
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
