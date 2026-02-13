'use client';

import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { useUserAuth } from "@/context/auth-provider";
import { hasAccess } from "@/lib/permissions";
import { redirect } from "next/navigation";
import { Switch } from "@/components/ui/switch";
import Image from "next/image";

interface IntegrationCardProps {
    name: string;
    description: string;
    icon: string; // Using string for now, could be a component
    connected: boolean;
}

function IntegrationCard({ name, description, connected }: IntegrationCardProps) {
    return (
        <div className="flex items-center justify-between rounded-lg border p-4">
            <div className="flex items-center space-x-4">

                <div className="space-y-1">
                    <h4 className="text-sm font-semibold">{name}</h4>
                    <p className="text-sm text-muted-foreground">
                        {description}
                    </p>
                </div>
            </div>
            <div className="flex items-center space-x-4">
                <span className="text-sm text-muted-foreground">
                    {connected ? "Connected" : "Disconnected"}
                </span>
                <Switch checked={connected} />
            </div>
        </div>
    )
}

export default function IntegrationsSettingsPage() {
    const { userProfile, isLoading } = useUserAuth();

    if (!isLoading && !hasAccess(userProfile, 'view:settings:integrations')) {
        redirect('/dashboard');
    }

    return (
        <div className="space-y-6">
            <div>
                <h3 className="text-lg font-medium">Integrations</h3>
                <p className="text-sm text-muted-foreground">
                    Connect your workspace with third-party tools.
                </p>
            </div>
            <Separator />

            <div className="grid gap-6">
                <IntegrationCard
                    name="Stripe"
                    description="Accept payments directly via Stripe."
                    icon="stripe"
                    connected={true}
                />
                <IntegrationCard
                    name="PayPal"
                    description="Connect your PayPal business account."
                    icon="paypal"
                    connected={false}
                />
                <IntegrationCard
                    name="Slack"
                    description="Send notifications to your Slack workspace."
                    icon="slack"
                    connected={false}
                />
                <IntegrationCard
                    name="Google Analytics"
                    description="Track visitor traffic and behavior."
                    icon="analytics"
                    connected={true}
                />
                <IntegrationCard
                    name="SendGrid"
                    description="Send transactional emails via SendGrid."
                    icon="sendgrid"
                    connected={false}
                />
            </div>
        </div>
    );
}
