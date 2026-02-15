

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
import { useUserAuth } from '@/context/auth-provider';
import { useFirebase } from '@/firebase';
import { GRANULAR_PERMISSIONS, Role, hasAccess } from '@/lib/permissions';
import { Checkbox } from '../ui/checkbox';
import { ScrollArea } from "@/components/ui/scroll-area";
import { Mail, UserPlus, Info, Check, Copy, ExternalLink, ShieldCheck, Loader2, Send, UploadCloud } from "lucide-react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { doc, getDoc, setDoc, updateDoc, serverTimestamp } from 'firebase/firestore';
import { sendInvitationAction } from '@/app/actions';


const inviteUserSchema = z.object({
  uid: z.string().optional(), // Add uid to the schema
  name: z.string().min(1, { message: "Full name is required." }),
  email: z.string().email({ message: "Invalid email format." }),
  role: z.enum(['admin', 'employee', 'viewer'], { required_error: "Please select a role." }),
  position: z.string().optional(),
  designation: z.string().optional(),
  phone: z.string().optional(),
  avatarUrl: z.string().optional(),
  permissions: z.array(z.string()).default([]),
});

type InviteUserFormValues = z.infer<typeof inviteUserSchema>;

interface InviteUserDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onUserInvited: () => void;
  user?: any; // The user object to edit
}

export function InviteUserDialog({ open, onOpenChange, onUserInvited, user: editingUser }: InviteUserDialogProps) {
  const { userProfile } = useUserAuth();
  const { firestore } = useFirebase();
  const { toast } = useToast();
  const [isSaving, setIsSaving] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [avatarPreview, setAvatarPreview] = useState<string | undefined>(editingUser?.avatarUrl);
  const [inviteLink, setInviteLink] = useState<string | null>(null); // New state for manual link
  const [portalSlug, setPortalSlug] = useState<string | null>(null);

  const isNewUser = !editingUser;

  const form = useForm<InviteUserFormValues>({
    resolver: zodResolver(inviteUserSchema),
    defaultValues: {
      name: '',
      email: '',
      role: 'employee',
      position: '',
      designation: '',
      phone: '',
      avatarUrl: '',
      permissions: ['view:dashboard', 'view:invoices', 'create:invoice', 'view:estimates', 'create:estimate', 'view:quotes', 'create:quote', 'view:insurance', 'create:insurance', 'view:clients', 'create:client'],
    }
  });

  useEffect(() => {
    if (open) {
      if (editingUser) {
        form.reset({
          ...editingUser,
          permissions: editingUser.permissions || [],
        });
        setAvatarPreview(editingUser.avatarUrl);
      } else {
        form.reset({
          uid: undefined,
          name: '',
          email: '',
          role: 'employee',
          position: '',
          designation: '',
          phone: '',
          avatarUrl: '',
          permissions: ['view:dashboard', 'view:invoices', 'create:invoice', 'view:estimates', 'create:estimate', 'view:quotes', 'create:quote', 'view:insurance', 'create:insurance', 'view:clients', 'create:client'],
        });
        setAvatarPreview(undefined);
        setInviteLink(null); // Reset link on open
      }
    }
  }, [editingUser, open, form]);

  // Handle role-based default permissions
  useEffect(() => {
    const subscription = form.watch((value, { name }) => {
      if (name === 'role') {
        const role = value.role;
        if (role === 'admin') {
          form.setValue('permissions', GRANULAR_PERMISSIONS.map(p => p.id));
        } else if (role === 'employee') {
          form.setValue('permissions', ['view:dashboard', 'view:invoices', 'create:invoice', 'view:estimates', 'create:estimate', 'view:quotes', 'create:quote', 'view:insurance', 'create:insurance', 'view:clients', 'create:client']);
        } else if (role === 'viewer') {
          form.setValue('permissions', ['view:dashboard', 'view:invoices', 'view:estimates', 'view:quotes', 'view:insurance', 'view:clients', 'view:analytics']);
        }
      }
    });
    return () => subscription.unsubscribe();
  }, [form]);

  useEffect(() => {
    const fetchPortalSlug = async () => {
      if (open && firestore && userProfile?.companyId) {
        try {
          const companyRef = doc(firestore, 'companies', userProfile.companyId);
          const snap = await getDoc(companyRef);
          if (snap.exists()) {
            const data = snap.data();
            if (data?.portalSettings?.enabled && data?.portalSettings?.slug) {
              setPortalSlug(data.portalSettings.slug);
            } else {
              setPortalSlug(null);
            }
          }
        } catch (error) {
          console.error("Error fetching portal slug:", error);
        }
      }
    }
    fetchPortalSlug();
  }, [open, firestore, userProfile?.companyId]);

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
    const companyId = userProfile?.companyId;

    if (!firestore || !companyId || companyId === 'undefined') {
      console.error("[InviteUser] Invalid state:", { firestore: !!firestore, companyId, userProfile });
      toast({
        title: "Error",
        description: "Cannot save employee. Your company profile is not fully loaded. Please try refreshing the page.",
        variant: "destructive"
      });
      setIsSaving(false);
      return;
    }
    if (!hasAccess(userProfile, 'manage:employees')) {
      toast({
        title: "Unauthorized",
        description: "You do not have permission to manage employees.",
        variant: "destructive"
      });
      setIsSaving(false);
      return;
    }

    try {
      if (isNewUser) {
        const emailLower = data.email.toLowerCase();
        const newUserId = `invited_${emailLower.replace(/[^a-zA-Z0-9]/g, '')}`;
        const newUserRef = doc(firestore, 'companies', companyId, 'users', newUserId);

        await setDoc(newUserRef, {
          ...data,
          email: emailLower,
          uid: newUserId,
          avatarUrl: avatarPreview || '',
          status: 'pending_invitation',
          createdAt: serverTimestamp(),
        });

        // Trigger invitation email
        try {
          console.log("[InviteUser] Sending invitation with:", { email: data.email, companyId, portalSlug });
          const result = await sendInvitationAction({
            email: data.email,
            name: data.name,
            companyName: userProfile.companyName || 'Your Company',
            senderName: userProfile.name || 'Your Team Lead',
            companyId: companyId,
            portalSlug: portalSlug || undefined,
          });

          if (result.success) {
            toast({
              title: "Invitation Sent",
              description: `We've sent an invitation email to ${data.email}.`,
            });
          } else {
            throw new Error(result.message);
          }
        } catch (emailError: any) {
          console.error("Email error:", emailError);
          toast({
            title: "Employee Added",
            description: `${data.name} has been added. ${emailError.message || 'Please share the link manually as the automated email failed.'}`,
            variant: "default",
          });
        }

        // Generate manual link as fallback
        const origin = window.location.origin;
        const link = portalSlug
          ? `${origin}/c/${portalSlug}/login?email=${encodeURIComponent(data.email)}&companyId=${encodeURIComponent(companyId)}`
          : `${origin}/signup?email=${encodeURIComponent(data.email)}&companyId=${encodeURIComponent(companyId)}`;
        setInviteLink(link);

        onUserInvited();
        // We don't close the dialog here because we want to show the inviteLink view
      } else {
        // This is an existing user, so we update their document
        if (!editingUser?.uid) {
          throw new Error("Cannot update employee without a User ID.");
        }
        const userRef = doc(firestore, 'companies', companyId, 'users', editingUser.uid);
        // Exclude uid and email from the update payload
        const { uid, email, ...updateData } = data;

        const payloadToUpdate = {
          ...updateData,
          avatarUrl: avatarPreview || '',
          position: updateData.position || '',
          designation: updateData.designation || '',
          phone: updateData.phone || '',
        };

        // Update BOTH company-user doc and root-user doc
        await updateDoc(userRef, payloadToUpdate);

        const rootUserRef = doc(firestore, 'users', editingUser.uid);
        await updateDoc(rootUserRef, {
          role: payloadToUpdate.role,
          permissions: payloadToUpdate.permissions,
          name: payloadToUpdate.name,
          phone: payloadToUpdate.phone,
          avatarUrl: payloadToUpdate.avatarUrl,
        });

        toast({
          title: "Employee Updated",
          description: `${data.name}'s details have been updated.`,
        });

        onUserInvited();
        onOpenChange(false);
      }
    } catch (error: any) {
      console.error("Error saving user: ", error);
      toast({
        title: "Error",
        description: error.message || `Failed to ${isNewUser ? 'send invitation' : 'update employee'}.`,
        variant: "destructive"
      });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl bg-card/95 backdrop-blur-sm">
        <DialogHeader>
          <DialogTitle className="text-xl">
            {inviteLink ? 'Invitation Link' : (isNewUser ? 'Invite New Employee' : `Edit ${editingUser?.name}`)}
          </DialogTitle>
          <DialogDescription>
            {inviteLink
              ? 'Share this link with the employee to allow them to join your company.'
              : (isNewUser ? 'Enter the employee\'s details and set their permissions.' : 'Update the details and permissions for this employee.')}
          </DialogDescription>
        </DialogHeader>

        {inviteLink ? (
          <div className="space-y-4 py-4">
            <div className="p-4 bg-muted rounded-md border text-center break-all">
              <p className="text-sm text-muted-foreground mb-2">Manual Invite Link</p>
              <code className="text-sm font-mono select-all bg-background p-2 rounded border block">
                {inviteLink}
              </code>
            </div>
            <div className="flex justify-center gap-3">
              <Button
                variant="outline"
                className="rounded-full"
                onClick={async () => {
                  try {
                    await navigator.clipboard.writeText(inviteLink);
                    toast({ title: "Copied!", description: "Link copied to clipboard." });
                  } catch (err) {
                    console.error("Clipboard error:", err);
                    toast({ title: "Failed", description: "Please copy it manually from above.", variant: "destructive" });
                  }
                }}>
                <Send className="mr-2 h-4 w-4" /> Copy Link
              </Button>
              <Button
                className="rounded-full"
                onClick={() => {
                  const inviteLinkWithHint = `${inviteLink}&companyId=${encodeURIComponent(userProfile?.companyId || '')}`;
                  const subject = `Invitation to join ${userProfile?.companyName || 'our company'} on InvoiceCraft`;
                  const body = `Hello ${form.getValues('name')},\n\nYou've been invited to join the team at ${userProfile?.companyName || 'our company'} on InvoiceCraft.\n\nAccept your invitation here:\n${inviteLinkWithHint}\n\nSee you there!`;
                  window.location.href = `mailto:${form.getValues('email')}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
                }}
              >
                <Mail className="mr-2 h-4 w-4" /> Open Email App
              </Button>
            </div>
            <div className="text-center">
              <Button variant="ghost" onClick={() => onOpenChange(false)}>Close</Button>
            </div>
          </div>
        ) : (
          <ScrollArea className="max-h-[70vh] pr-6 -mr-6">
            <Form {...form}>
              <form className="space-y-6 px-1" onSubmit={form.handleSubmit(onSubmit)}>
                {/* Hidden UID field */}
                <input type="hidden" {...form.register('uid')} />

                <div className="flex items-center gap-4 py-2 border-b border-white/10">
                  <Avatar className="h-16 w-16">
                    <AvatarImage src={avatarPreview || ''} />
                    <AvatarFallback>{form.watch('name')?.charAt(0) || 'E'}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1 space-y-1">
                    <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Profile Picture</Label>
                    <div className="flex gap-2">
                      <Button asChild variant="outline" size="sm" className="h-8">
                        <label htmlFor="avatar-upload" className="cursor-pointer">
                          {isUploading ? <Loader2 className="mr-2 h-3 w-3 animate-spin" /> : <UploadCloud className="mr-2 h-3 w-3" />}
                          {isUploading ? 'Uploading...' : 'Upload'}
                        </label>
                      </Button>
                      <Input id="avatar-upload" type="file" className="sr-only" onChange={handleAvatarUpload} accept="image/*" />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-4">
                  <FormField control={form.control} name="name" render={({ field }) => (
                    <FormItem><FormLabel>Full Name</FormLabel><FormControl><Input placeholder="John Doe" {...field} /></FormControl><FormMessage /></FormItem>
                  )} />
                  <FormField control={form.control} name="email" render={({ field }) => (
                    <FormItem><FormLabel>Email Address</FormLabel><FormControl><Input placeholder="john@example.com" type="email" {...field} disabled={!isNewUser} /></FormControl><FormMessage /></FormItem>
                  )} />
                  <FormField control={form.control} name="phone" render={({ field }) => (
                    <FormItem><FormLabel>Phone (Optional)</FormLabel><FormControl><Input placeholder="+1 234 567 890" type="tel" {...field} /></FormControl><FormMessage /></FormItem>
                  )} />
                  <FormField control={form.control} name="role" render={({ field }) => (
                    <FormItem>
                      <FormLabel>App Role</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select a role for the employee" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="admin">Admin (Full Access)</SelectItem>
                          <SelectItem value="employee">Staff (Create & Edit)</SelectItem>
                          <SelectItem value="viewer">Viewer (Read-only)</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )} />
                </div>

                <div className="space-y-4 pt-4 border-t border-white/10">
                  <div className="flex items-center justify-between">
                    <Label className="text-sm font-bold flex items-center gap-2">
                      <ShieldCheck className="h-4 w-4 text-primary" />
                      Granular Permissions
                    </Label>
                    <span className="text-[10px] uppercase font-bold text-muted-foreground bg-muted px-2 py-0.5 rounded-full">Override Default Role Access</span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-muted/30 p-4 rounded-xl border border-white/5">
                    <FormField
                      control={form.control}
                      name="permissions"
                      render={() => (
                        <FormItem className="col-span-full">
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-4 gap-x-6">
                            {GRANULAR_PERMISSIONS.map((permission) => (
                              <FormField
                                key={permission.id}
                                control={form.control}
                                name="permissions"
                                render={({ field }) => {
                                  return (
                                    <FormItem
                                      key={permission.id}
                                      className="flex flex-row items-start space-x-3 space-y-0"
                                    >
                                      <FormControl>
                                        <Checkbox
                                          checked={field.value?.includes(permission.id)}
                                          onCheckedChange={(checked) => {
                                            return checked
                                              ? field.onChange([...field.value, permission.id])
                                              : field.onChange(
                                                field.value?.filter(
                                                  (value) => value !== permission.id
                                                )
                                              )
                                          }}
                                        />
                                      </FormControl>
                                      <div className="space-y-1 leading-none">
                                        <FormLabel className="text-sm font-medium">
                                          {permission.label}
                                        </FormLabel>
                                        <p className="text-[10px] text-muted-foreground">
                                          {permission.description}
                                        </p>
                                      </div>
                                    </FormItem>
                                  )
                                }}
                              />
                            ))}
                          </div>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>
              </form>
            </Form>
          </ScrollArea>
        )}

        {!inviteLink && (
          <DialogFooter className="mt-auto pt-4 gap-2">
            <DialogClose asChild>
              <Button type="button" variant="outline">Cancel</Button>
            </DialogClose>
            <Button type="submit" disabled={isSaving} onClick={form.handleSubmit(onSubmit)}>
              {isSaving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Send className="mr-2 h-4 w-4" />}
              {isSaving ? (isNewUser ? 'Sending...' : 'Saving...') : (isNewUser ? 'Send Invitation' : 'Save Changes')}
            </Button>
          </DialogFooter>
        )}
      </DialogContent>
    </Dialog>
  );
}

