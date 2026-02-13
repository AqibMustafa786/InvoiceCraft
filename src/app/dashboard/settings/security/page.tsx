'use client';

import { Separator } from "@/components/ui/separator";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { useUserAuth } from "@/context/auth-provider";
import { hasAccess } from "@/lib/permissions";
import { redirect } from "next/navigation";

export default function SecuritySettingsPage() {
    const { userProfile, isLoading } = useUserAuth();

    if (!isLoading && !hasAccess(userProfile, 'view:settings:security')) {
        redirect('/dashboard');
    }

    return (
        <div className="space-y-6">
            <div>
                <h3 className="text-lg font-medium">Security</h3>
                <p className="text-sm text-muted-foreground">
                    Manage your account security settings.
                </p>
            </div>
            <Separator />

            <div className="space-y-4">
                <h4 className="text-sm font-medium">Password Policy</h4>
                <div className="grid grid-cols-2 gap-4">
                    <div className="grid gap-2">
                        <Label>Minimum Length</Label>
                        <Input type="number" defaultValue={8} />
                    </div>
                    <div className="grid gap-2">
                        <Label>Password Expiry (days)</Label>
                        <Input type="number" defaultValue={90} />
                    </div>
                </div>

                <Separator />

                <h4 className="text-sm font-medium">Two-Factor Authentication</h4>
                <div className="flex items-center justify-between space-x-2">
                    <Label htmlFor="2fa" className="flex flex-col space-y-1">
                        <span>Enable 2FA</span>
                        <span className="font-normal leading-snug text-muted-foreground">
                            Require a verification code when logging in.
                        </span>
                    </Label>
                    <Switch id="2fa" />
                </div>

                <Separator />

                <h4 className="text-sm font-medium">Session Management</h4>
                <div className="grid gap-2">
                    <Label>Session Timeout</Label>
                    <Select defaultValue="30">
                        <SelectTrigger>
                            <SelectValue placeholder="Select timeout" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="15">15 minutes</SelectItem>
                            <SelectItem value="30">30 minutes</SelectItem>
                            <SelectItem value="60">1 hour</SelectItem>
                            <SelectItem value="240">4 hours</SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                <div className="pt-4">
                    <Button variant="destructive">Log out of all devices</Button>
                </div>
            </div>
        </div>
    );
}
