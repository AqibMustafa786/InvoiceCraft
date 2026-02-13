'use client';
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
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
import { useLanguage } from "@/context/language-context";

export default function GeneralSettingsPage() {
    const { userProfile, isLoading } = useUserAuth();
    const { language, setLanguage, t, languages } = useLanguage();

    if (!isLoading && !hasAccess(userProfile?.role, 'view:settings:general')) {
        redirect('/dashboard');
    }

    return (
        <div className="space-y-6">
            <div>
                <h3 className="text-lg font-medium">{t('settings.general')}</h3>
                <p className="text-sm text-muted-foreground">
                    Configure general information about your workspace.
                </p>
            </div>
            <Separator />
            <div className="space-y-4">
                <div className="grid gap-2">
                    <Label htmlFor="appName">Application Name</Label>
                    <Input id="appName" defaultValue="Invoice Craft" />
                </div>

                <div className="grid gap-2">
                    <Label htmlFor="companyName">{t('settings.companyName')}</Label>
                    <Input id="companyName" defaultValue={userProfile?.companyName || "My Company"} />
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div className="grid gap-2">
                        <Label>{t('settings.defaultLanguage')}</Label>
                        <Select value={language} onValueChange={(v: any) => setLanguage(v)}>
                            <SelectTrigger>
                                <SelectValue placeholder={t('settings.selectLanguage')} />
                            </SelectTrigger>
                            <SelectContent>
                                {languages.map((lang) => (
                                    <SelectItem key={lang.code} value={lang.code}>
                                        {lang.name}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="grid gap-2">
                        <Label>Time Zone</Label>
                        <Select defaultValue="utc">
                            <SelectTrigger>
                                <SelectValue placeholder="Select timezone" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="utc">UTC</SelectItem>
                                <SelectItem value="est">EST</SelectItem>
                                <SelectItem value="pst">PST</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </div>

                <Button>{t('settings.saveChanges')}</Button>
            </div>
        </div>
    );
}
