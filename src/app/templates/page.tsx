
'use client';

import { useState, useMemo } from 'react';
import { PageHeader, PageHeaderDescription, PageHeaderHeading } from '@/components/page-header';
import { allTemplates, Template } from '@/lib/template-data';
import { TemplateCard } from '@/components/templates/template-card';
import { TemplatePreview } from '@/components/templates/template-preview';
import { motion, AnimatePresence } from 'framer-motion';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search, List, SortAsc, FileText, DraftingCompass, FileQuestion, Shield } from 'lucide-react';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

const allCategories = ["All", ...Array.from(new Set(allTemplates.map(t => t.category)))];
const toolTypes = ["All", "Invoice", "Estimate", "Quote", "Insurance"];

const toolIcons: Record<string, React.ReactNode> = {
    "All": <List className="h-4 w-4" />,
    "Invoice": <FileText className="h-4 w-4" />,
    "Estimate": <DraftingCompass className="h-4 w-4" />,
    "Quote": <FileQuestion className="h-4 w-4" />,
    "Insurance": <Shield className="h-4 w-4" />,
}

export default function TemplatesPage() {
  const [selectedTemplate, setSelectedTemplate] = useState<Template | null>(null);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  
  const [activeCategory, setActiveCategory] = useState('All');
  const [activeTool, setActiveTool] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('name');

  const handlePreview = (template: Template) => {
    setSelectedTemplate(template);
    setIsPreviewOpen(true);
  };

  const filteredTemplates = useMemo(() => {
    let templates = allTemplates;

    if (activeCategory !== 'All') {
      templates = templates.filter(t => t.category === activeCategory);
    }
    
    if (activeTool !== 'All') {
      templates = templates.filter(t => t.toolType === activeTool);
    }
    
    if (searchTerm) {
        templates = templates.filter(t => 
            t.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            t.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
            t.useCases.some(uc => uc.toLowerCase().includes(searchTerm.toLowerCase()))
        );
    }

    templates.sort((a, b) => {
        if (sortBy === 'name') {
            return a.name.localeCompare(b.name);
        }
        if (sortBy === 'category') {
            return a.category.localeCompare(b.category);
        }
        return 0;
    });

    return templates;
  }, [activeCategory, activeTool, searchTerm, sortBy]);
  
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05,
      },
    },
  };

  return (
    <>
      <div className="container mx-auto px-4 md:px-6">
        <PageHeader className="mb-8">
            <PageHeaderHeading>Our Template Library</PageHeaderHeading>
            <PageHeaderDescription>
                Browse our collection of professionally designed templates for every industry. 
                Find the perfect starting point for your next document.
            </PageHeaderDescription>
        </PageHeader>

        <div className="space-y-8">
            {/* Filter Controls */}
            <div className="bg-card/50 backdrop-blur-sm p-4 border rounded-lg flex flex-col md:flex-row items-center gap-4">
                <div className="relative w-full md:flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                    <Input 
                        placeholder="Search templates..." 
                        className="pl-10 text-base" 
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                 <div className="flex w-full md:w-auto items-center gap-4">
                    <ToggleGroup 
                      type="single" 
                      value={activeTool}
                      onValueChange={(value) => setActiveTool(value || 'All')}
                      className="justify-start"
                    >
                      {toolTypes.map(tool => (
                        <ToggleGroupItem key={tool} value={tool} aria-label={`Filter by ${tool}`} className="flex gap-2">
                           {toolIcons[tool]} {tool}
                        </ToggleGroupItem>
                      ))}
                    </ToggleGroup>
                     <Select value={sortBy} onValueChange={setSortBy}>
                        <SelectTrigger className="w-[180px]">
                            <div className="flex items-center gap-2">
                                <SortAsc className="h-4 w-4" />
                                <SelectValue placeholder="Sort by..." />
                            </div>
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="name">Sort by Name</SelectItem>
                            <SelectItem value="category">Sort by Category</SelectItem>
                        </SelectContent>
                    </Select>
                 </div>
            </div>

            {/* Category Filters */}
            <ScrollArea className="w-full">
              <div className="flex items-center gap-4 border-b pb-2">
                {allCategories.map(category => (
                  <Button
                    key={category}
                    variant="ghost"
                    onClick={() => setActiveCategory(category)}
                    className={cn(
                      "relative text-sm font-medium transition-colors whitespace-nowrap",
                      activeCategory === category ? "text-primary" : "text-muted-foreground hover:text-primary"
                    )}
                  >
                    {category}
                    {activeCategory === category && (
                      <motion.div
                        className="absolute -bottom-2.5 left-0 right-0 h-0.5 bg-primary"
                        layoutId="active-category-underline"
                      />
                    )}
                  </Button>
                ))}
              </div>
              <ScrollBar orientation="horizontal" />
            </ScrollArea>

            {/* Template Grid */}
            <motion.div
                key={activeCategory + activeTool + searchTerm + sortBy} // Re-trigger animation on filter change
                className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
            >
                {filteredTemplates.length > 0 ? (
                    filteredTemplates.map((template) => (
                        <TemplateCard key={template.id + template.toolType} template={template} onPreview={handlePreview} />
                    ))
                ) : (
                    <div className="col-span-full text-center py-16 text-muted-foreground">
                        <p className="text-lg font-semibold">No templates found.</p>
                        <p>Try adjusting your filters to find what you're looking for.</p>
                    </div>
                )}
            </motion.div>
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

