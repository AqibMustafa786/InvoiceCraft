
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
      const toolType = activeTool === 'Estimate' ? ['Estimate', 'Quote'] : [activeTool];
      templates = templates.filter(t => toolType.includes(t.toolType));
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

        <div className="space-y-6">
            {/* Filter Controls */}
            <div className="flex flex-col md:flex-row items-center gap-4">
                <div className="relative w-full md:flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input 
                        placeholder="Search templates..." 
                        className="pl-10 h-9" 
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                 <div className="flex w-full md:w-auto items-center gap-2">
                    <ToggleGroup 
                      type="single" 
                      defaultValue="All"
                      value={activeTool}
                      onValueChange={(value) => setActiveTool(value || 'All')}
                      className="justify-start border rounded-md p-0.5 h-9"
                    >
                      {toolTypes.map(tool => (
                        <ToggleGroupItem key={tool} value={tool} aria-label={`Filter by ${tool}`} className="flex gap-2 px-3 py-1.5 h-full text-xs data-[state=on]:bg-background data-[state=on]:shadow-sm border-none">
                           {toolIcons[tool]} {tool}
                        </ToggleGroupItem>
                      ))}
                    </ToggleGroup>
                     <Select value={sortBy} onValueChange={setSortBy}>
                        <SelectTrigger className="w-auto h-9 text-xs gap-2">
                            <SortAsc className="h-4 w-4" />
                            <SelectValue placeholder="Sort by..." />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="name">Sort by Name</SelectItem>
                            <SelectItem value="category">Sort by Category</SelectItem>
                        </SelectContent>
                    </Select>
                 </div>
            </div>

            {/* Category Filters */}
            <div className="relative">
                <ScrollArea className="w-full whitespace-nowrap">
                    <div className="flex items-center gap-2 pb-2">
                        {allCategories.map(category => (
                        <Button
                            key={category}
                            variant="ghost"
                            size="sm"
                            onClick={() => setActiveCategory(category)}
                            className={cn(
                                "relative text-sm font-medium transition-colors h-8 px-3",
                                activeCategory === category ? "text-primary" : "text-muted-foreground hover:text-primary hover:bg-transparent"
                            )}
                        >
                            {category}
                            {activeCategory === category && (
                            <motion.div
                                className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary"
                                layoutId="active-category-underline"
                            />
                            )}
                        </Button>
                        ))}
                    </div>
                    <ScrollBar orientation="horizontal" />
                </ScrollArea>
                <div className="absolute top-0 bottom-2 w-full border-b -z-10"></div>
            </div>


            {/* Template Grid */}
            <motion.div
                key={activeCategory + activeTool + searchTerm + sortBy} // Re-trigger animation on filter change
                className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
            >
                {filteredTemplates.length > 0 ? (
                    filteredTemplates.map((template) => (
                        <TemplateCard key={`${template.id}-${template.toolType}`} template={template} onPreview={() => handlePreview(template)} />
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
    
