
'use client';

import { useState, useEffect, ChangeEvent } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogClose } from "@/components/ui/dialog";
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/context/auth-provider';
import { useFirebase } from '@/firebase';
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';
import { Save, Loader2, Send, UploadCloud } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { ScrollArea } from '../ui/scroll-area';
import { Label } from '../ui/label';


const inviteUserSchema = z.object({
  name: z.string().min(1, { message: "Full name is required." }),
  email: z.string().email({ message: "Invalid email format." }),
  role: z.enum(['admin', 'staff', 'viewer'], { required_error: "Please select a role." }),
  position: z.string().optional(),
  designation: z.string().optional(),
  phone: z.string().optional(),
  avatarUrl: z.string().optional(),
});

type InviteUserFormValues = z.infer<typeof inviteUserSchema>;

interface InviteUserDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onUserInvited: () => void;
}

export function InviteUserDialog({ open, onOpenChange, onUserInvited }: InviteUserDialogProps) {
  const { userProfile } = useAuth();
  const { firestore } = useFirebase();
  const { toast } = useToast();
  const [isSaving, setIsSaving] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [avatarPreview, setAvatarPreview] = useState<string | undefined>(undefined);

  const form = useForm<InviteUserFormValues>({
    resolver: zodResolver(inviteUserSchema),
    defaultValues: {
      name: '',
      email: '',
      role: 'staff',
      position: '',
      designation: '',
      phone: '',
      avatarUrl: '',
    }
  });

  useEffect(() => {
    if (open) {
      form.reset();
      setAvatarPreview(undefined);
    }
  }, [open, form]);

  const handleAvatarUpload = async (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      if (file.size > 4 * 1024 * 1024) { // 4MB limit
        toast({ title: "Image too large", description: "Please upload an image smaller than 4MB.", variant: "destructive" });
        return;
      }

      setIsUploading(true);
      const formData = new FormData();
      formData.append('file', file);

      try {
        const response = await fetch('/api/upload', { method: 'POST', body: formData });
        if (!response.ok) throw new Error('Upload failed');
        
        const { url } = await response.json();
        setAvatarPreview(url);
        form.setValue('avatarUrl', url);
        toast({ title: "Avatar Uploaded", description: "The new avatar has been set." });
      } catch (error) {
        console.error("Upload error:", error);
        toast({ title: "Upload Failed", description: "Could not upload the image.", variant: "destructive" });
      } finally {
        setIsUploading(false);
      }
    }
  };

  const onSubmit = async (data: InviteUserFormValues) => {
    setIsSaving(true);
    if (!firestore || !userProfile?.companyId) {
      toast({ title: "Error", description: "Cannot invite user. Company not identified.", variant: "destructive" });
      setIsSaving(false);
      return;
    }

    try {
      // In a real app, this would trigger a backend function to send an invite email.
      // For now, we'll simulate by creating a placeholder user document.
      // The user would then sign up with this email and be associated with the company.
      
      const newUserId = `invited_${data.email.replace(/[^a-zA-Z0-9]/g, '')}`;
      const newUserRef = doc(firestore, 'companies', userProfile.companyId, 'users', newUserId);

      await setDoc(newUserRef, {
        ...data,
        avatarUrl: avatarPreview || '',
        status: 'pending_invitation', // A status to indicate the user hasn't signed up yet
        createdAt: serverTimestamp(),
      });

      toast({
        title: "Invitation Sent (Simulated)",
        description: `${data.name} has been invited to join your company.`,
      });
      onUserInvited();
      onOpenChange(false);
    } catch (error) {
      console.error("Error inviting user: ", error);
      toast({ title: "Error", description: "Failed to send invitation.", variant: "destructive" });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-xl bg-card/95 backdrop-blur-sm">
        <DialogHeader>
          <DialogTitle className="text-xl">Invite New Employee</DialogTitle>
          <DialogDescription>
            Enter the employee's details to send them an invitation to join your company.
          </DialogDescription>
        </DialogHeader>
        
        <ScrollArea className="max-h-[65vh] pr-6 -mr-6">
        <Form {...form}>
          <form className="space-y-4 px-1" onSubmit={form.handleSubmit(onSubmit)}>
            <div className="flex items-center gap-4">
                  <Avatar className="h-20 w-20">
                    <AvatarImage src={avatarPreview || ''} />
                    <AvatarFallback>{form.watch('name')?.charAt(0) || 'E'}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1 space-y-2">
                    <Label>Profile Picture</Label>
                    <Button asChild variant="outline" className="w-full">
                       <label htmlFor="avatar-upload" className="cursor-pointer">
                         {isUploading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <UploadCloud className="mr-2 h-4 w-4" />}
                         {isUploading ? 'Uploading...' : 'Upload Picture'}
                       </label>
                    </Button>
                    <Input id="avatar-upload" type="file" className="sr-only" onChange={handleAvatarUpload} accept="image/*" />
                  </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField control={form.control} name="name" render={({ field }) => (
                  <FormItem><FormLabel>Full Name</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                )} />
                <FormField control={form.control} name="email" render={({ field }) => (
                  <FormItem><FormLabel>Email Address</FormLabel><FormControl><Input type="email" {...field} /></FormControl><FormMessage /></FormItem>
                )} />
                 <FormField control={form.control} name="phone" render={({ field }) => (
                  <FormItem><FormLabel>Phone</FormLabel><FormControl><Input type="tel" {...field} /></FormControl><FormMessage /></FormItem>
                )} />
                <FormField control={form.control} name="position" render={({ field }) => (
                  <FormItem><FormLabel>Position</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                )} />
                 <FormField control={form.control} name="designation" render={({ field }) => (
                  <FormItem><FormLabel>Designation</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                )} />
                 <FormField control={form.control} name="role" render={({ field }) => (
                  <FormItem>
                    <FormLabel>App Role</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a role for the user" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="admin">Admin (Full Access)</SelectItem>
                        <SelectItem value="staff">Staff (Create & Edit)</SelectItem>
                        <SelectItem value="viewer">Viewer (Read-only)</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )} />
            </div>
          </form>
        </Form>
        </ScrollArea>

        <DialogFooter className="mt-auto pt-4 gap-2">
          <DialogClose asChild>
            <Button type="button" variant="outline">Cancel</Button>
          </DialogClose>
          <Button type="submit" disabled={isSaving} onClick={form.handleSubmit(onSubmit)}>
            {isSaving ? <Loader2 className="mr-2 h-4 w-4 animate-spin"/> : <Send className="mr-2 h-4 w-4" />}
            {isSaving ? 'Sending...' : 'Send Invitation'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
