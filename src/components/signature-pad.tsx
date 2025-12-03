
'use client';

import { useRef, useState, useEffect } from 'react';
import SignatureCanvas from 'react-signature-canvas';
import { Button } from './ui/button';
import { cn } from '@/lib/utils';
import { Input } from './ui/input';
import { Label } from './ui/label';

interface SignaturePadProps {
  onSave: (image: string, signerName: string) => void;
  signerName?: string;
  isForClient?: boolean;
}

export function SignaturePad({ onSave, signerName: initialSignerName = '', isForClient = false }: SignaturePadProps) {
  const sigPad = useRef<SignatureCanvas>(null);
  const [signerName, setSignerName] = useState(initialSignerName);
  const [isEmpty, setIsEmpty] = useState(true);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);
  
  useEffect(() => {
    if(!isForClient){
      setSignerName(initialSignerName);
    }
  }, [initialSignerName, isForClient]);

  const clear = () => {
    sigPad.current?.clear();
    setIsEmpty(true);
  };

  const handleSave = () => {
    if (sigPad.current) {
      if (sigPad.current.isEmpty()) {
        // Handle empty signature case, maybe show an alert
        return;
      }
      const dataUrl = sigPad.current.getTrimmedCanvas().toDataURL('image/png');
      onSave(dataUrl, signerName);
    }
  };

  if (!isClient) {
    return <div className="h-56 w-full rounded-md border border-input bg-muted"></div>
  }

  return (
    <div className="space-y-4">
      <div className={cn("rounded-md border border-input", isForClient ? "bg-background" : "bg-muted")}>
        <SignatureCanvas
          ref={sigPad}
          penColor="black"
          canvasProps={{ className: 'w-full h-40' }}
          onBegin={() => setIsEmpty(false)}
        />
      </div>
       {isForClient && (
         <div className="space-y-2">
            <Label htmlFor="signerName" className="sr-only">Signer Name</Label>
            <Input 
                id="signerName"
                placeholder="Type your name"
                value={signerName}
                onChange={(e) => setSignerName(e.target.value)}
            />
         </div>
       )}
      <div className="flex justify-end gap-2">
        <Button variant="outline" onClick={clear}>Clear</Button>
        {!isForClient && <Button onClick={handleSave} disabled={isEmpty}>Save Signature</Button>}
      </div>
    </div>
  );
}
