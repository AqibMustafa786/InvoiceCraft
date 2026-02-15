
'use client';

import { useState, useMemo } from 'react';
import { allTemplates, Template } from '@/lib/template-data';
import { TemplateCard } from '@/components/templates/template-card';
import { TemplatePreview } from '@/components/templates/template-preview';
import { motion, AnimatePresence } from 'framer-motion';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search, SortAsc, Filter, Sparkles, LayoutGrid } from 'lucide-react';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

const allCategories = ["All", ...Array.from(new Set(allTemplates.map(t => t.category)))];
const toolTypes = ["All", "Invoice", "Estimate", "Quote", "Insurance"];

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
      <div className="min-h-screen bg-background relative overflow-hidden">
        {/* Background Gradients */}
        <div className="absolute top-0 left-0 w-full h-[500px] bg-gradient-to-b from-primary/5 via-primary/0 to-transparent pointer-events-none" />
        <div className="absolute -top-[200px] right-[10%] w-[500px] h-[500px] bg-blue-500/10 rounded-full blur-[100px] pointer-events-none" />
        <div className="absolute top-[100px] left-[10%] w-[300px] h-[300px] bg-purple-500/10 rounded-full blur-[80px] pointer-events-none" />

        <div className="container mx-auto px-4 md:px-6 py-12 relative z-10">
          {/* Hero Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16 space-y-4 max-w-3xl mx-auto"
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-medium mb-2 border border-primary/20 backdrop-blur-sm">
              <Sparkles className="h-3 w-3" />
              <span>Premium Collection</span>
            </div>
            <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-foreground to-foreground/70 pb-2">
              Template Library
            </h1>
            <p className="text-lg text-muted-foreground/80 leading-relaxed max-w-2xl mx-auto">
              Explore our curated collection of professionally designed templates.
              Perfect for invoices, estimates, quotes, and more—crafted to help you look your best.
            </p>
          </motion.div>

          {/* Controls & Filters */}
          <div className="space-y-8 mb-12">
            {/* Search Bar - Floating Glass */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="relative max-w-2xl mx-auto"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-purple-500/20 rounded-2xl blur-xl opacity-20" />
              <div className="relative flex items-center bg-background/60 backdrop-blur-xl border border-border/50 rounded-2xl shadow-sm focus-within:ring-2 focus-within:ring-primary/20 focus-within:border-primary/50 transition-all">
                <Search className="ml-4 h-5 w-5 text-muted-foreground" />
                <Input
                  placeholder="Search by name, category, or keyword..."
                  className="bg-transparent border-none text-base h-14 pl-3 focus-visible:ring-0 placeholder:text-muted-foreground/50"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                {/* Tool Type Segments (Desktop) */}
                <div className="hidden md:flex items-center pr-2 gap-1">
                  {toolTypes.slice(0, 4).map(tool => (
                    <button
                      key={tool}
                      onClick={() => setActiveTool(tool)}
                      className={cn(
                        "px-3 py-1.5 text-xs font-medium rounded-lg transition-all",
                        activeTool === tool
                          ? "bg-primary text-primary-foreground shadow-sm"
                          : "text-muted-foreground hover:bg-muted"
                      )}
                    >
                      {tool}
                    </button>
                  ))}
                </div>
              </div>
            </motion.div>

            {/* Categories & Sorting */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="flex flex-col md:flex-row items-center justify-between gap-6"
            >
              {/* Category Scroll */}
              <div className="w-full md:flex-1 min-w-0">
                <ScrollArea className="w-full whitespace-nowrap pb-2">
                  <div className="flex items-center gap-2 px-1">
                    {allCategories.map(category => (
                      <button
                        key={category}
                        onClick={() => setActiveCategory(category)}
                        className={cn(
                          "relative px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 border",
                          activeCategory === category
                            ? "bg-foreground text-background border-foreground text-white dark:text-black"
                            : "bg-background/50 border-border/50 text-muted-foreground hover:border-foreground/30 hover:text-foreground"
                        )}
                      >
                        {category}
                      </button>
                    ))}
                  </div>
                  <ScrollBar orientation="horizontal" className="hidden" />
                </ScrollArea>
              </div>

              {/* Sorting & Filter Actions */}
              <div className="flex items-center gap-3 w-full md:w-auto">
                {/* Mobile Tool Selector */}
                <div className="md:hidden w-full">
                  <Select value={activeTool} onValueChange={setActiveTool}>
                    <SelectTrigger className="w-full bg-background/50 backdrop-blur-sm">
                      <LayoutGrid className="mr-2 h-4 w-4" />
                      <SelectValue placeholder="Tool Type" />
                    </SelectTrigger>
                    <SelectContent>
                      {toolTypes.map(tool => (
                        <SelectItem key={tool} value={tool}>{tool}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger className="w-[180px] bg-background/50 backdrop-blur-sm">
                    <SortAsc className="mr-2 h-4 w-4" />
                    <SelectValue placeholder="Sort by..." />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="name">Name (A-Z)</SelectItem>
                    <SelectItem value="category">Category</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </motion.div>
          </div>

          {/* Template Grid */}
          <motion.div
            key={activeCategory + activeTool + searchTerm + sortBy}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-8"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            <AnimatePresence mode='popLayout'>
              {filteredTemplates.length > 0 ? (
                filteredTemplates.map((template) => (
                  <TemplateCard key={`${template.id}-${template.toolType}`} template={template} onPreview={() => handlePreview(template)} />
                ))
              ) : (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="col-span-full flex flex-col items-center justify-center py-20 text-center"
                >
                  <div className="bg-muted/30 p-6 rounded-full mb-4">
                    <Search className="h-10 w-10 text-muted-foreground/50" />
                  </div>
                  <h3 className="text-xl font-semibold text-foreground">No templates found</h3>
                  <p className="text-muted-foreground mt-2 max-w-sm">
                    We couldn't find any templates matching your criteria. Try adjusting your filters or search term.
                  </p>
                  <Button
                    variant="outline"
                    className="mt-6"
                    onClick={() => {
                      setSearchTerm('');
                      setActiveCategory('All');
                      setActiveTool('All');
                    }}
                  >
                    Clear all filters
                  </Button>
                </motion.div>
              )}
            </AnimatePresence>
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

