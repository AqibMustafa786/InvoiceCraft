
'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { SignaturePad } from '@/components/signature-pad';
import { useToast } from '@/hooks/use-toast';
import { DocumentReference, updateDoc, serverTimestamp, arrayUnion } from 'firebase/firestore';

interface DocumentAcceptanceModalProps {
  isOpen: boolean;
  onClose: () => void;
  docRef: DocumentReference | null;
  docType: 'Estimate' | 'Quote';
}

export function DocumentAcceptanceModal({ isOpen, onClose, docRef, docType }: DocumentAcceptanceModalProps) {
  const [signerName, setSignerName] = useState('');
  const [signatureImage, setSignatureImage] = useState<string | null>(null);
  const [hasAgreed, setHasAgreed] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const { toast } = useToast();

  const handleSaveSignature = async () => {
    if (!docRef) {
      toast({ title: "Error", description: "Document reference is not available.", variant: "destructive" });
      return;
    }
    if (!signatureImage) {
      toast({ title: "Signature Required", description: "Please provide your signature.", variant: "destructive" });
      return;
    }
    if (!signerName) {
      toast({ title: "Name Required", description: "Please type your full name.", variant: "destructive" });
      return;
    }
    if (!hasAgreed) {
      toast({ title: "Agreement Required", description: "You must agree to the terms and conditions.", variant: "destructive" });
      return;
    }

    setIsSaving(true);
    try {
      await updateDoc(docRef, {
        status: 'accepted',
        clientSignature: {
          image: signatureImage,
          signerName: signerName,
          signedAt: serverTimestamp(),
        },
        auditLog: arrayUnion({
            action: 'signed',
            timestamp: serverTimestamp(),
            actor: 'client',
        })
      });

      toast({
        title: `${docType} Accepted`,
        description: `Thank you for your signature. The ${docType.toLowerCase()} has been marked as accepted.`,
      });
      onClose();
    } catch (error) {
      console.error(`Error accepting ${docType.toLowerCase()}:`, error);
      toast({
        title: "Acceptance Failed",
        description: `There was an error while saving your signature. Please try again.`,
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Accept {docType}</DialogTitle>
        </DialogHeader>
        <div className="space-y-6 py-4">
          <div className="space-y-2">
            <Label htmlFor="signer-name">Type Your Full Name</Label>
            <Input
              id="signer-name"
              value={signerName}
              onChange={(e) => setSignerName(e.target.value)}
              placeholder="John Doe"
            />
          </div>
          <div className="space-y-2">
             <Label>Draw Your Signature Below</Label>
            <SignaturePad onSave={(image) => setSignatureImage(image)} signerName={signerName} isForClient />
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox id="terms" checked={hasAgreed} onCheckedChange={(checked) => setHasAgreed(!!checked)} />
            <label
              htmlFor="terms"
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              I agree to the terms and conditions of this {docType.toLowerCase()}.
            </label>
          </div>
        </div>
        <DialogFooter>
          <DialogClose asChild>
            <Button type="button" variant="outline">
              Cancel
            </Button>
          </DialogClose>
          <Button onClick={handleSaveSignature} disabled={!hasAgreed || isSaving}>
            {isSaving ? 'Saving...' : 'Save and Accept'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
