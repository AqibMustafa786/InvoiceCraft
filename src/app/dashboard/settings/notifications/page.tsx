'use client';

import { Separator } from "@/components/ui/separator";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { useUserAuth } from "@/context/auth-provider";
import { hasAccess } from "@/lib/permissions";
import { redirect } from "next/navigation";

export default function NotificationsSettingsPage() {
    const { userProfile, isLoading } = useUserAuth();

    if (!isLoading && !hasAccess(userProfile, 'view:settings:notifications')) {
        redirect('/dashboard');
    }

    return (
        <div className="space-y-6">
            <div>
                <h3 className="text-lg font-medium">Notifications</h3>
                <p className="text-sm text-muted-foreground">
                    Configure how you receive notifications.
                </p>
            </div>
            <Separator />
            <div className="space-y-4">
                <h4 className="text-sm font-medium">Email Notifications</h4>
                <div className="grid gap-4">
                    <div className="flex items-center justify-between space-x-2">
                        <Label htmlFor="marketing_emails" className="flex flex-col space-y-1">
                            <span>Marketing emails</span>
                            <span className="font-normal leading-snug text-muted-foreground">
                                Receive emails about new products, features, and more.
                            </span>
                        </Label>
                        <Switch id="marketing_emails" />
                    </div>
                    <div className="flex items-center justify-between space-x-2">
                        <Label htmlFor="social_emails" className="flex flex-col space-y-1">
                            <span>Social emails</span>
                            <span className="font-normal leading-snug text-muted-foreground">
                                Receive emails for friend requests, follows, and more.
                            </span>
                        </Label>
                        <Switch id="social_emails" defaultChecked />
                    </div>
                    <div className="flex items-center justify-between space-x-2">
                        <Label htmlFor="security_emails" className="flex flex-col space-y-1">
                            <span>Security emails</span>
                            <span className="font-normal leading-snug text-muted-foreground">
                                Receive emails about your account activity and security.
                            </span>
                        </Label>
                        <Switch id="security_emails" defaultChecked disabled />
                    </div>
                </div>

                <Separator />

                <h4 className="text-sm font-medium">Push Notifications</h4>
                <div className="grid gap-4">
                    <div className="flex items-center justify-between space-x-2">
                        <Label htmlFor="new_messages" className="flex flex-col space-y-1">
                            <span>New messages</span>
                            <span className="font-normal leading-snug text-muted-foreground">
                                Get notified when you receive a new message.
                            </span>
                        </Label>
                        <Switch id="new_messages" defaultChecked />
                    </div>
                    <div className="flex items-center justify-between space-x-2">
                        <Label htmlFor="new_mentions" className="flex flex-col space-y-1">
                            <span>New mentions</span>
                            <span className="font-normal leading-snug text-muted-foreground">
                                Get notified when you are mentioned.
                            </span>
                        </Label>
                        <Switch id="new_mentions" defaultChecked />
                    </div>
                </div>

                <Button>Save Preferences</Button>
            </div>
        </div>
    );
}
