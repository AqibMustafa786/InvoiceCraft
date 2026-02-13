

'use client';

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ScrollArea } from "@/components/ui/scroll-area";
import type { Invoice, Estimate, Quote } from '@/lib/types';
import { format } from 'date-fns';
import { toDateSafe, toNumberSafe } from "@/lib/utils";

type DocumentType = Invoice | Estimate | Quote;

interface KpiDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  documents: DocumentType[];
  currencySymbol: string;
}

const safeFormat = (date: any, formatString: string) => {
    const d = toDateSafe(date);
    return d ? format(d, formatString) : 'N/A';
}

export function KpiDetailsModal({ isOpen, onClose, title, documents, currencySymbol }: KpiDetailsModalProps) {
  const getDocInfo = (doc: DocumentType) => {
    if (doc.documentType === 'invoice') {
      const invoice = doc as Invoice;
      return {
        number: invoice.invoiceNumber,
        client: invoice.client.name,
        date: safeFormat(invoice.invoiceDate, 'MMM d, yyyy'),
        amount: invoice.summary.grandTotal
      };
    } else {
      const estimate = doc as Estimate | Quote;
      return {
        number: estimate.estimateNumber,
        client: estimate.client.name,
        date: safeFormat(estimate.estimateDate, 'MMM d, yyyy'),
        amount: estimate.summary.grandTotal
      };
    }
  };
  
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[625px] bg-card/80 backdrop-blur-sm">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>
            A detailed list of all documents contributing to this metric.
          </DialogDescription>
        </DialogHeader>
        <ScrollArea className="h-[60vh] pr-4">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Number</TableHead>
                <TableHead>Client</TableHead>
                <TableHead>Date</TableHead>
                <TableHead className="text-right">Amount</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {documents.length > 0 ? (
                documents.map((doc) => {
                  const info = getDocInfo(doc);
                  return (
                    <TableRow key={doc.id}>
                      <TableCell className="font-medium">{info.number}</TableCell>
                      <TableCell>{info.client}</TableCell>
                      <TableCell>{info.date}</TableCell>
                      <TableCell className="text-right">{currencySymbol}{toNumberSafe(info.amount).toFixed(2)}</TableCell>
                    </TableRow>
                  );
                })
              ) : (
                <TableRow>
                  <TableCell colSpan={4} className="h-24 text-center">
                    No documents to display.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}

    