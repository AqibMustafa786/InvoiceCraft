'use client';

import { useState, useEffect } from 'react';
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
import { Save, Loader2, Send } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';

const inviteUserSchema = z.object({
  name: z.string().min(1, { message: "Full name is required." }),
  email: z.string().email({ message: "Invalid email format." }),
  role: z.enum(['admin', 'staff', 'viewer'], { required_error: "Please select a role." }),
  position: z.string().optional(),
  designation: z.string().optional(),
  phone: z.string().optional(),
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

  const form = useForm<InviteUserFormValues>({
    resolver: zodResolver(inviteUserSchema),
    defaultValues: {
      name: '',
      email: '',
      role: 'staff',
      position: '',
      designation: '',
      phone: '',
    }
  });

  useEffect(() => {
    if (open) {
      form.reset();
    }
  }, [open, form]);

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
        name: data.name,
        email: data.email,
        role: data.role,
        position: data.position,
        designation: data.designation,
        phone: data.phone,
        status: 'pending', // A status to indicate the user hasn't signed up yet
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
      <DialogContent className="sm:max-w-md bg-card/95 backdrop-blur-sm">
        <DialogHeader>
          <DialogTitle className="text-xl">Invite New User</DialogTitle>
          <DialogDescription>
            Enter the user's details to send them an invitation to join your company.
          </DialogDescription>
        </DialogHeader>
        
        <Form {...form}>
          <form className="space-y-4 py-4" onSubmit={form.handleSubmit(onSubmit)}>
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
          </form>
        </Form>

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
