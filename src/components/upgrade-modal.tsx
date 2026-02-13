'use client';

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Check, Sparkles, Zap } from "lucide-react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";

interface UpgradeModalProps {
    isOpen: boolean;
    onClose: () => void;
    featureName?: string;
}

export function UpgradeModal({ isOpen, onClose, featureName = "this feature" }: UpgradeModalProps) {
    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[425px] overflow-hidden border-0 p-0">
                <div className="absolute top-0 w-full h-32 bg-gradient-to-br from-primary/20 via-primary/10 to-background z-0" />

                <DialogHeader className="p-6 pb-0 relative z-10">
                    <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 ring-8 ring-primary/5">
                        <Sparkles className="h-8 w-8 text-primary fill-primary/20" />
                    </div>
                    <DialogTitle className="text-center text-2xl font-bold font-headline">Unlock Unlimited Access</DialogTitle>
                    <DialogDescription className="text-center pt-2 text-base">
                        You've reached the free limit for <span className="font-semibold text-foreground">{featureName}</span>.
                        Upgrade to Business Plan to remove all restrictions.
                    </DialogDescription>
                </DialogHeader>

                <div className="p-6 relative z-10">
                    <div className="bg-card/50 border rounded-xl p-4 space-y-3">
                        <h4 className="font-semibold text-sm text-muted-foreground uppercase tracking-wider mb-2">What you get with Business:</h4>
                        <ul className="space-y-2.5">
                            <li className="flex items-start gap-2.5 text-sm">
                                <div className="mt-0.5 rounded-full bg-primary/20 p-0.5"><Check className="h-3 w-3 text-primary" /></div>
                                <span><strong>Unlimited</strong> Invoices, Estimates & Clients</span>
                            </li>
                            <li className="flex items-start gap-2.5 text-sm">
                                <div className="mt-0.5 rounded-full bg-primary/20 p-0.5"><Check className="h-3 w-3 text-primary" /></div>
                                <span><strong>Team Access</strong> (Add Employees)</span>
                            </li>
                            <li className="flex items-start gap-2.5 text-sm">
                                <div className="mt-0.5 rounded-full bg-primary/20 p-0.5"><Check className="h-3 w-3 text-primary" /></div>
                                <span><strong>White-label</strong> (Remove Watermark)</span>
                            </li>
                            <li className="flex items-start gap-2.5 text-sm">
                                <div className="mt-0.5 rounded-full bg-primary/20 p-0.5"><Check className="h-3 w-3 text-primary" /></div>
                                <span><strong>AI Features</strong> & Premium Templates</span>
                            </li>
                        </ul>
                    </div>
                </div>

                <DialogFooter className="p-6 pt-0 flex-col gap-2 sm:flex-col relative z-10">
                    <Button asChild size="lg" className="w-full gap-2 text-base font-semibold shadow-xl shadow-primary/20 hover:shadow-primary/30 transition-all">
                        <Link href="/billing">
                            <Zap className="h-4 w-4 fill-current" /> Upgrade Now
                        </Link>
                    </Button>
                    <Button variant="ghost" onClick={onClose} className="w-full">
                        Maybe Later
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
