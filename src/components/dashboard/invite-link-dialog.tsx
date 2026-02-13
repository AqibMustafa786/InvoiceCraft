'use client';

import React from 'react';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from '../ui/dialog';
import { Button } from '../ui/button';
import { toast } from '@/hooks/use-toast';
import { Copy, Mail, Send } from 'lucide-react';

interface InviteLinkDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    email: string;
    name: string;
    companyName: string;
    companyId: string;
    portalSlug?: string | null;
}

export function InviteLinkDialog({
    open,
    onOpenChange,
    email,
    name,
    companyName,
    companyId,
    portalSlug,
}: InviteLinkDialogProps) {
    const origin = typeof window !== 'undefined' ? window.location.origin : '';

    // Use branded portal link if slug is available, fallback to generic signup
    const inviteLink = portalSlug
        ? `${origin}/c/${portalSlug}/login?email=${encodeURIComponent(email)}&companyId=${encodeURIComponent(companyId)}`
        : `${origin}/signup?email=${encodeURIComponent(email)}&companyId=${encodeURIComponent(companyId)}`;

    const handleCopy = async () => {
        try {
            await navigator.clipboard.writeText(inviteLink);
            toast({
                title: "Copied!",
                description: "Invite link copied to clipboard.",
            });
        } catch (err) {
            console.error("Clipboard error:", err);
            toast({
                title: "Failed",
                description: "Please copy the link above manually.",
                variant: "destructive",
            });
        }
    };

    const handleMailTo = () => {
        const subject = `Invitation to join ${companyName} on InvoiceCraft`;
        const body = `Hello ${name},\n\nYou've been invited to join the team at ${companyName} on InvoiceCraft.\n\nAccept your invitation here:\n${inviteLink}\n\nSee you there!`;
        window.location.href = `mailto:${email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-md bg-card/95 backdrop-blur-sm border-primary/20">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        <Send className="h-5 w-5 text-primary" />
                        Invitation Details
                    </DialogTitle>
                    <DialogDescription>
                        Use these options to manually share the invitation with {name}.
                    </DialogDescription>
                </DialogHeader>

                <div className="space-y-6 py-4">
                    <div className="space-y-2">
                        <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                            Manual Invite Link
                        </label>
                        <div className="relative group">
                            <div className="p-3 bg-primary/5 rounded-xl border border-primary/10 font-mono text-xs break-all pr-12 select-all">
                                {inviteLink}
                            </div>
                            <Button
                                size="icon"
                                variant="ghost"
                                className="absolute right-2 top-1/2 -translate-y-1/2 h-8 w-8 hover:bg-primary/10"
                                onClick={handleCopy}
                            >
                                <Copy className="h-4 w-4" />
                            </Button>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                        <Button
                            variant="outline"
                            className="rounded-full border-primary/20 hover:bg-primary/5 h-10"
                            onClick={handleCopy}
                        >
                            <Copy className="mr-2 h-4 w-4" />
                            Copy Link
                        </Button>
                        <Button
                            className="rounded-full shadow-lg h-10"
                            onClick={handleMailTo}
                        >
                            <Mail className="mr-2 h-4 w-4" />
                            Open Email App
                        </Button>
                    </div>
                </div>

                <DialogFooter className="sm:justify-center">
                    <Button variant="ghost" onClick={() => onOpenChange(false)}>
                        Close
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}

