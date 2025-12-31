
'use client';

import { useState, useMemo } from 'react';
import { PageHeader, PageHeaderDescription, PageHeaderHeading } from '@/components/page-header';
import { allTemplates, Template } from '@/lib/template-data';
import { TemplatePreview } from '@/components/templates/template-preview';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import Image from 'next/image';
import { Eye, CheckCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

const categories = ["All", ...new Set(allTemplates.map(t => t.category))];

const featurePoints = ["Easy to Customize", "Fully Responsive", "Semantic Code"];

export default function TemplatesPage() {
  const [selectedTemplate, setSelectedTemplate] = useState<Template | null>(null);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [activeCategory, setActiveCategory] = useState('All');

  const handlePreview = (template: Template) => {
    setSelectedTemplate(template);
    setIsPreviewOpen(true);
  };

  const filteredTemplates = useMemo(() => {
    if (activeCategory === 'All') {
      return allTemplates;
    }
    return allTemplates.filter(t => t.category === activeCategory);
  }, [activeCategory]);
  
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, scale: 0.95, y: 10 },
    visible: { opacity: 1, scale: 1, y: 0 },
    exit: { opacity: 0, scale: 0.95, y: -10 },
  };

  return (
    <>
      <div className="w-full py-20 md:py-28 bg-gradient-to-br from-[#2c1a3b] to-[#1a1a2e] text-white overflow-hidden">
        <div className="container mx-auto px-4 md:px-6">
           <div className="flex items-center justify-center gap-4 md:gap-8 text-sm md:text-base">
            {featurePoints.map(point => (
                 <div key={point} className="flex items-center gap-2">
                    <CheckCircle className="h-5 w-5 text-primary" />
                    <span>{point}</span>
                 </div>
            ))}
           </div>
          <div className="relative mt-12 flex items-center justify-center">
            {/* Background stacked cards */}
            <motion.div 
                initial={{ opacity: 0, y: 50, scale: 0.8 }}
                animate={{ opacity: 1, y: 0, scale: 0.8 }}
                transition={{ duration: 0.5, delay: 0.3 }}
                className="absolute w-full max-w-5xl h-[600px] bg-card/80 rounded-2xl shadow-2xl transform -rotate-3"
            />
            <motion.div 
                 initial={{ opacity: 0, y: 50, scale: 0.9 }}
                animate={{ opacity: 1, y: 0, scale: 0.9 }}
                transition={{ duration: 0.5, delay: 0.15 }}
                className="absolute w-full max-w-5xl h-[600px] bg-card/90 rounded-2xl shadow-2xl transform rotate-2"
            />

            {/* Main content card */}
            <motion.div
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="relative w-full max-w-5xl bg-card text-card-foreground rounded-2xl shadow-2xl z-10"
            >
              <CardContent className="p-6 md:p-8">
                <div className="text-center mb-8">
                  <h2 className="text-sm font-semibold tracking-wider uppercase text-muted-foreground">OUR PORTFOLIO</h2>
                  <div className="mt-4 flex items-center justify-center gap-4 md:gap-8 border-b pb-4">
                    {categories.map(category => (
                      <Button
                        key={category}
                        variant="ghost"
                        onClick={() => setActiveCategory(category)}
                        className={cn(
                          "relative text-sm font-medium transition-colors",
                          activeCategory === category ? "text-primary" : "text-muted-foreground hover:text-primary"
                        )}
                      >
                        {category}
                         {activeCategory === category && (
                          <motion.div
                            className="absolute -bottom-4 left-0 right-0 h-0.5 bg-primary"
                            layoutId="active-category-underline"
                          />
                        )}
                      </Button>
                    ))}
                  </div>
                </div>

                <motion.div
                  key={activeCategory} // This key is crucial for AnimatePresence to detect changes
                  className="columns-2 md:columns-3 lg:columns-4 gap-4"
                  variants={containerVariants}
                  initial="hidden"
                  animate="visible"
                >
                  <AnimatePresence mode="popLayout">
                    {filteredTemplates.map((template, index) => (
                      <motion.div
                        key={template.id + template.toolType}
                        variants={itemVariants}
                        layout
                        className="mb-4 break-inside-avoid group relative"
                      >
                        <div className="relative overflow-hidden rounded-lg shadow-md">
                          <Image
                            src={template.thumbnailUrl}
                            alt={`Preview of ${template.name}`}
                            width={500}
                            height={700}
                            className="w-full h-auto object-cover transition-transform duration-300 ease-in-out group-hover:scale-105"
                          />
                           <div className="absolute inset-0 bg-black/50 opacity-0 transition-opacity group-hover:opacity-100 flex flex-col items-center justify-center p-4 text-center">
                              <h3 className="font-bold text-white">{template.name}</h3>
                              <Button variant="secondary" size="sm" className="mt-2" onClick={() => handlePreview(template)}>
                                <Eye className="mr-2 h-4 w-4" /> View
                              </Button>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </motion.div>
              </CardContent>
            </motion.div>
          </div>
        </div>
      </div>
      <TemplatePreview
        template={selectedTemplate}
        isOpen={isPreviewOpen}
        onClose={() => setIsPreviewOpen(false)}
      />
    </>
  );
}
