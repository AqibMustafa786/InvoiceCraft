
'use client';

import { useState } from 'react';
import { Bot, X, Send, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { ScrollArea } from './ui/scroll-area';
import { Input } from './ui/input';

const suggestedPrompts = [
  "How does this app work?",
  "How to create an invoice?",
  "What is the difference between estimate and invoice?",
  "How client dashboard works?"
];

export function AIChatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: 'ai',
      text: 'Hello! I am your AI-powered Product Assistant. How can I help you understand InvoiceCraft today?',
    },
  ]);

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

  const handleSuggestionClick = (prompt: string) => {
    // In the future, this will trigger a query to the AI
    console.log("Suggestion clicked:", prompt);
  };

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
            <Card className="flex flex-col h-[60vh] shadow-2xl bg-card/80 backdrop-blur-lg">
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
              <CardContent className="flex-1 p-0">
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
                          {message.text}
                        </div>
                      </div>
                    ))}
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
                                    onClick={() => handleSuggestionClick(prompt)}
                                >
                                    {prompt}
                                </Button>
                            ))}
                        </div>
                    </div>
                  </div>
                </ScrollArea>
              </CardContent>
              <CardFooter className="p-4 border-t">
                 <div className="relative w-full">
                    <Input placeholder="Ask a question..." className="pr-12" />
                    <Button
                        type="submit"
                        size="icon"
                        className="absolute right-1 top-1/2 -translate-y-1/2 h-8 w-8"
                    >
                        <Send className="h-4 w-4" />
                    </Button>
                 </div>
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
        <Button size="icon" className="h-14 w-14 rounded-full shadow-2xl" onClick={() => setIsOpen(!isOpen)}>
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
        </Button>
      </motion.div>
    </>
  );
}
