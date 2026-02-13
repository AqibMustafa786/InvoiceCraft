
'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useUserAuth } from '@/context/auth-provider';
import { useFirebase } from '@/firebase';
import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Save } from 'lucide-react';
import { hasAccess } from '@/lib/permissions';
import { useRouter } from 'next/navigation';

export default function KnowledgeBasePage() {
    const { userProfile, isLoading: isAuthLoading } = useUserAuth();
    const { firestore } = useFirebase();
    const { toast } = useToast();
    const router = useRouter();
    const [content, setContent] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);

    useEffect(() => {
        if (isAuthLoading) return;
        if (!userProfile || !firestore) return;

        if (!hasAccess(userProfile, 'manage:settings')) {
            router.push('/dashboard');
            return;
        }

        const fetchKnowledgeBase = async () => {
            try {
                const docRef = doc(firestore, 'companies', userProfile.companyId, 'knowledge_base', 'general');
                const docSnap = await getDoc(docRef);
                if (docSnap.exists()) {
                    setContent(docSnap.data().content || '');
                }
            } catch (error) {
                console.error("Error fetching knowledge base:", error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchKnowledgeBase();
    }, [userProfile, firestore, isAuthLoading, router]);

    const handleSave = async () => {
        if (!firestore || !userProfile) return;
        setIsSaving(true);
        try {
            const docRef = doc(firestore, 'companies', userProfile.companyId, 'knowledge_base', 'general');
            await setDoc(docRef, {
                content,
                updatedAt: serverTimestamp(),
                updatedBy: userProfile.uid
            }, { merge: true });

            toast({
                title: "Knowledge Base Updated",
                description: "The AI assistant will now use this information to answer questions.",
            });
        } catch (error) {
            console.error("Error saving knowledge base:", error);
            toast({
                title: "Error",
                description: "Could not save changes.",
                variant: "destructive",
            });
        } finally {
            setIsSaving(false);
        }
    };

    if (isLoading) {
        return <div className="flex justify-center p-10"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>;
    }

    return (
        <div className="space-y-6">
            <div>
                <h3 className="text-lg font-medium">AI Knowledge Base</h3>
                <p className="text-sm text-muted-foreground">
                    Teach your AI assistant about your company. Add policies, wifi passwords, FAQs, or any other information employees might ask about.
                </p>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>General Knowledge</CardTitle>
                    <CardDescription>
                        This text will be used as context for the AI Chat.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <Textarea
                        className="min-h-[400px] font-mono text-sm"
                        placeholder="e.g. \nWifi Password: Guest123\nOffice Hours: 9am - 5pm\nHoliday Policy: ..."
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                    />
                    <div className="mt-4 flex justify-end">
                        <Button onClick={handleSave} disabled={isSaving}>
                            {isSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            <Save className="mr-2 h-4 w-4" />
                            Save Changes
                        </Button>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
