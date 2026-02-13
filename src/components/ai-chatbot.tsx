
'use client';

import { useState } from 'react';
import { Bot, X, Send, Sparkles, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { Avatar, AvatarFallback } from './ui/avatar';
import { ScrollArea } from './ui/scroll-area';
import { Input } from './ui/input';
import { usePathname } from 'next/navigation';

const suggestedPrompts = [
  "How does this app work?",
  "How to create an invoice?",
  "What is the difference between estimate and invoice?",
  "How client dashboard works?"
];

type Message = {
  id: number;
  sender: 'user' | 'ai';
  text: string;
  isLoading?: boolean;
};

export function AIChatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      sender: 'ai',
      text: 'Hello! I am your AI-powered Product Assistant. How can I help you understand InvoiceCraft today?',
    },
  ]);
  const [inputValue, setInputValue] = useState('');
  const pathname = usePathname();

  const chatbotVariants = {
    closed: {
      opacity: 0,
      y: 20,
      scale: 0.95,
      transition: { duration: 0.2, ease: 'easeOut' },
    },
    open: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: { duration: 0.3, ease: 'easeIn' },
    },
  };
  
  const handleSendMessage = (text: string) => {
    if (!text.trim()) return;

    const userMessage: Message = {
      id: Date.now(),
      sender: 'user',
      text,
    };
    const aiResponse: Message = {
      id: Date.now() + 1,
      sender: 'ai',
      text: 'Thinking...',
      isLoading: true,
    };

    setMessages(prev => [...prev, userMessage, aiResponse]);
    setInputValue('');

    // Simulate AI response
    setTimeout(() => {
        setMessages(prev => prev.map(msg => 
            msg.id === aiResponse.id 
            ? { ...msg, text: `I'm still learning! For now, I can't answer "${text}". Try another question.`, isLoading: false }
            : msg
        ));
    }, 1500);
  };

  const handleFormSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      handleSendMessage(inputValue);
  };
  
  if (pathname !== '/') {
    return null;
  }


  return (
    <>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            variants={chatbotVariants}
            initial="closed"
            animate="open"
            exit="closed"
            className="fixed bottom-24 right-5 z-50 w-full max-w-sm"
          >
            <Card className="flex h-[60vh] flex-col shadow-2xl bg-card/80 backdrop-blur-lg">
              <CardHeader className="flex flex-row items-center justify-between p-4 border-b">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-primary/10 text-primary rounded-full">
                        <Bot className="h-6 w-6" />
                    </div>
                    <CardTitle className="text-lg">Product Assistant</CardTitle>
                </div>
                <Button variant="ghost" size="icon" onClick={() => setIsOpen(false)}>
                  <X className="h-5 w-5 text-muted-foreground" />
                </Button>
              </CardHeader>
              <CardContent className="flex-1 p-0 overflow-hidden">
                <ScrollArea className="h-full p-4">
                  <div className="space-y-6">
                    {messages.map((message) => (
                      <div
                        key={message.id}
                        className={cn(
                          'flex items-start gap-3',
                          message.sender === 'user' ? 'justify-end' : ''
                        )}
                      >
                        {message.sender === 'ai' && (
                           <Avatar className="h-8 w-8">
                                <AvatarFallback className="bg-primary text-primary-foreground">
                                    <Bot className="h-5 w-5" />
                                </AvatarFallback>
                           </Avatar>
                        )}
                        <div
                          className={cn(
                            'max-w-xs rounded-lg px-4 py-2.5 text-sm',
                             message.sender === 'ai'
                              ? 'bg-muted'
                              : 'bg-primary text-primary-foreground'
                          )}
                        >
                          {message.isLoading ? (
                            <div className="flex items-center gap-2">
                                <Loader2 className="h-4 w-4 animate-spin" />
                                <span>Thinking...</span>
                            </div>
                          ) : (
                            message.text
                          )}
                        </div>
                      </div>
                    ))}
                    {messages[messages.length-1]?.sender !== 'user' && (
                     <div className="space-y-3 pt-4">
                        <div className="flex items-center gap-2">
                            <Sparkles className="h-4 w-4 text-muted-foreground" />
                            <p className="text-xs font-semibold text-muted-foreground">SUGGESTIONS</p>
                        </div>
                        <div className="flex flex-col items-start gap-2">
                            {suggestedPrompts.map((prompt) => (
                                <Button
                                    key={prompt}
                                    variant="outline"
                                    size="sm"
                                    className="h-auto py-1.5 px-3 text-xs"
                                    onClick={() => handleSendMessage(prompt)}
                                >
                                    {prompt}
                                </Button>
                            ))}
                        </div>
                    </div>
                    )}
                  </div>
                </ScrollArea>
              </CardContent>
              <CardFooter className="p-4 border-t">
                 <form onSubmit={handleFormSubmit} className="relative w-full">
                    <Input 
                        placeholder="Ask a question..." 
                        className="pr-12 h-10"
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                    />
                    <Button
                        type="submit"
                        size="icon"
                        className="absolute right-1 top-1/2 -translate-y-1/2 h-8 w-8"
                    >
                        <Send className="h-4 w-4" />
                    </Button>
                 </form>
              </CardFooter>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: 'spring', stiffness: 260, damping: 20, delay: 1 }}
        className="fixed bottom-5 right-5 z-40"
      >
        <Button
          size="icon"
          className="h-14 w-14 rounded-full shadow-2xl"
          onClick={() => setIsOpen(!isOpen)}
        >
          <motion.div
            animate={{
              scale: [1, 1.1, 1],
              opacity: [0.8, 1, 0.8],
            }}
            transition={{
              duration: 2.5,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          >
            <AnimatePresence>
              {isOpen ? (
                <motion.div key="x" initial={{ rotate: -90, scale: 0 }} animate={{ rotate: 0, scale: 1 }} exit={{ rotate: 90, scale: 0 }}>
                  <X className="h-7 w-7" />
                </motion.div>
              ) : (
                <motion.div key="bot" initial={{ rotate: 90, scale: 0 }} animate={{ rotate: 0, scale: 1 }} exit={{ rotate: -90, scale: 0 }}>
                  <Bot className="h-7 w-7" />
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </Button>
      </motion.div>
    </>
  );
}
