'use client';

import { useState, useRef, useEffect } from 'react';
import { doc, getDoc } from 'firebase/firestore';
import { useFirebase } from '@/firebase';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { MessageSquare, X, Send, Loader2, Minimize2, Maximize2, Sparkles, Bot } from 'lucide-react';
import { useUserAuth } from '@/context/auth-provider';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';

interface Message {
    role: 'user' | 'model';
    text: string;
}

export function AIChatWidget() {
    const { user, userProfile } = useUserAuth();
    const { firestore } = useFirebase(); // import this
    const [isOpen, setIsOpen] = useState(false);
    const [isMinimized, setIsMinimized] = useState(false);
    const [messages, setMessages] = useState<Message[]>([]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [context, setContext] = useState(''); // Store context
    const scrollRef = useRef<HTMLDivElement>(null);

    // Use companyName from userProfile, fallback to "AI Assistant"
    const companyName = userProfile?.companyName || "AI Assistant";

    // Fetch context on load
    useEffect(() => {
        const fetchContext = async () => {
            if (!firestore || !userProfile?.companyId) return;
            try {
                const docRef = doc(firestore, 'companies', userProfile.companyId, 'knowledge_base', 'general');
                const docSnap = await getDoc(docRef);
                if (docSnap.exists()) {
                    setContext(docSnap.data().content || '');
                }
            } catch (err) {
                console.error("Failed to fetch context", err);
            }
        };
        fetchContext();
    }, [firestore, userProfile?.companyId]);

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [messages]);

    const handleSend = async () => {
        if (!input.trim() || !user) return;

        const userMessage = { role: 'user' as const, text: input };
        setMessages(prev => [...prev, userMessage]);
        setInput('');
        setIsLoading(true);

        try {
            // We pass context from client now
            const response = await fetch('/api/chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    message: userMessage.text,
                    history: messages.map(m => ({
                        role: m.role === 'user' ? 'user' : 'model',
                        parts: [{ text: m.text }]
                    })),
                    context, // Pass the fetched context
                    // No idToken needed for this simplified version, or keep it if we want to add back verify later
                }),
            });

            let data;
            try {
                data = await response.json();
            } catch (e) {
                const rawText = await response.text();
                console.error("Failed to parse JSON:", rawText);
                throw new Error(`Server Error: ${response.status} ${response.statusText}`);
            }

            if (data.error) {
                throw new Error(data.error);
            }

            setMessages(prev => [...prev, { role: 'model', text: data.text }]);
        } catch (error: any) {
            console.error(error);
            setMessages(prev => [...prev, { role: 'model', text: error.message || "Sorry, I encountered an error. Please try again later." }]);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="fixed bottom-4 right-4 z-50 flex flex-col items-end">
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: 20, scale: 0.9 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 20, scale: 0.9 }}
                        transition={{ duration: 0.2 }}
                        className={cn(
                            "mb-4 w-[350px] md:w-[400px] shadow-2xl rounded-2xl overflow-hidden border border-white/10 backdrop-blur-xl bg-card/80",
                            isMinimized ? "h-14" : "h-[500px]"
                        )}
                    >
                        <div className="bg-primary/10 p-3 border-b border-white/5 flex items-center justify-between cursor-pointer" onClick={() => setIsMinimized(!isMinimized)}>
                            <div className="flex items-center gap-2">
                                <div className="h-8 w-8 rounded-full bg-primary/20 flex items-center justify-center text-primary">
                                    <Sparkles className="h-4 w-4" />
                                </div>
                                <div>
                                    <h3 className="font-semibold text-sm">{companyName}</h3>
                                    {!isMinimized && <p className="text-[10px] text-muted-foreground">Ask me anything about the company</p>}
                                </div>
                            </div>
                            <div className="flex items-center gap-1">
                                <Button variant="ghost" size="icon" className="h-6 w-6" onClick={(e) => { e.stopPropagation(); setIsMinimized(!isMinimized); }}>
                                    {isMinimized ? <Maximize2 className="h-3 w-3" /> : <Minimize2 className="h-3 w-3" />}
                                </Button>
                                <Button variant="ghost" size="icon" className="h-6 w-6 hover:bg-destructive/20 hover:text-destructive" onClick={(e) => { e.stopPropagation(); setIsOpen(false); }}>
                                    <X className="h-3 w-3" />
                                </Button>
                            </div>
                        </div>

                        {!isMinimized && (
                            <>
                                <div className="h-[380px] p-4 overflow-y-auto" ref={scrollRef}>
                                    {messages.length === 0 ? (
                                        <div className="h-full flex flex-col items-center justify-center text-center text-muted-foreground space-y-4 opacity-50">
                                            <Bot className="h-12 w-12" />
                                            <p className="text-sm">How can I help you today?</p>
                                        </div>
                                    ) : (
                                        <div className="space-y-4">
                                            {messages.map((msg, i) => (
                                                <div key={i} className={cn("flex w-full", msg.role === 'user' ? "justify-end" : "justify-start")}>
                                                    <div className={cn(
                                                        "max-w-[80%] rounded-2xl px-4 py-2 text-sm",
                                                        msg.role === 'user'
                                                            ? "bg-primary text-primary-foreground rounded-br-none"
                                                            : "bg-muted text-foreground rounded-bl-none"
                                                    )}>
                                                        {msg.text}
                                                    </div>
                                                </div>
                                            ))}
                                            {isLoading && (
                                                <div className="flex justify-start">
                                                    <div className="bg-muted rounded-2xl rounded-bl-none px-4 py-2 flex items-center gap-1">
                                                        <span className="w-1.5 h-1.5 bg-foreground/50 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                                                        <span className="w-1.5 h-1.5 bg-foreground/50 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                                                        <span className="w-1.5 h-1.5 bg-foreground/50 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    )}
                                </div>
                                <div className="p-3 border-t border-white/5 bg-background/50 backdrop-blur-sm">
                                    <form onSubmit={(e) => { e.preventDefault(); handleSend(); }} className="flex gap-2">
                                        <Input
                                            placeholder="Type a message..."
                                            value={input}
                                            onChange={(e) => setInput(e.target.value)}
                                            className="bg-transparent border-white/10 focus-visible:ring-primary/20"
                                        />
                                        <Button type="submit" size="icon" disabled={isLoading || !input.trim()}>
                                            <Send className="h-4 w-4" />
                                        </Button>
                                    </form>
                                </div>
                            </>
                        )}
                    </motion.div>
                )}
            </AnimatePresence>

            {!isOpen && (
                <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setIsOpen(true)}
                    className="h-12 w-12 rounded-full bg-primary text-primary-foreground shadow-lg flex items-center justify-center hover:bg-primary/90 transition-colors"
                >
                    <MessageSquare className="h-6 w-6" />
                </motion.button>
            )}
        </div>
    );
}
