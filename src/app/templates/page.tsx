
'use client';

import { useState, useMemo } from 'react';
import { PageHeader, PageHeaderDescription, PageHeaderHeading } from '@/components/page-header';
import { allTemplates, Template } from '@/lib/template-data';
import { TemplateCard } from '@/components/templates/template-card';
import { TemplatePreview } from '@/components/templates/template-preview';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Search, X } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Label } from '@/components/ui/label';

type ToolType = 'All' | 'Invoice' | 'Estimate' | 'Quote' | 'Insurance';

const toolTypes: ToolType[] = ['All', 'Invoice', 'Estimate', 'Quote', 'Insurance'];
const categories = [...new Set(allTemplates.map(t => t.category))];

export default function TemplatesPage() {
  const [selectedTemplate, setSelectedTemplate] = useState<Template | null>(null);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [selectedTool, setSelectedTool] = useState<ToolType>('All');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState<'name' | 'category'>('category');

  const handlePreview = (template: Template) => {
    setSelectedTemplate(template);
    setIsPreviewOpen(true);
  };

  const filteredAndSortedTemplates = useMemo(() => {
    let templates = allTemplates;

    if (selectedTool !== 'All') {
      templates = templates.filter(t => t.toolType === selectedTool);
    }

    if (selectedCategory !== 'All') {
      templates = templates.filter(t => t.category === selectedCategory);
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
      // Default to category sort
      if (a.category < b.category) return -1;
      if (a.category > b.category) return 1;
      return a.name.localeCompare(b.name);
    });

    return templates;
  }, [selectedTool, selectedCategory, searchTerm, sortBy]);
  
  const groupedTemplates = useMemo(() => {
    return filteredAndSortedTemplates.reduce((acc, template) => {
      const key = template.toolType;
      if (!acc[key]) {
        acc[key] = [];
      }
      acc[key].push(template);
      return acc;
    }, {} as Record<string, Template[]>);
  }, [filteredAndSortedTemplates]);


  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.08,
      },
    },
  };

  const resetFilters = () => {
    setSelectedTool('All');
    setSelectedCategory('All');
    setSearchTerm('');
    setSortBy('category');
  };

  return (
    <>
      <div className="container mx-auto px-4 md:px-6">
        <PageHeader>
          <PageHeaderHeading>Explore Our Templates</PageHeaderHeading>
          <PageHeaderDescription>
            Professionally designed templates for every need. Preview our collection to find the perfect fit for your business.
          </PageHeaderDescription>
        </PageHeader>
        
        <Card className="p-4 mb-8 bg-card/50 backdrop-blur-sm shadow-lg">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 items-end">
                <div className="space-y-2">
                    <Label htmlFor="search">Search Templates</Label>
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                        <Input id="search" placeholder="e.g., Construction, Modern..." className="pl-10" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
                    </div>
                </div>
                <div className="space-y-2">
                    <Label htmlFor="tool-filter">Filter by Tool</Label>
                    <Select value={selectedTool} onValueChange={(value) => setSelectedTool(value as ToolType)}>
                        <SelectTrigger id="tool-filter"><SelectValue /></SelectTrigger>
                        <SelectContent>
                            {toolTypes.map(tool => <SelectItem key={tool} value={tool}>{tool}</SelectItem>)}
                        </SelectContent>
                    </Select>
                </div>
                <div className="space-y-2">
                    <Label htmlFor="category-filter">Filter by Category</Label>
                    <Select value={selectedCategory} onValueChange={(value) => setSelectedCategory(value)}>
                        <SelectTrigger id="category-filter"><SelectValue /></SelectTrigger>
                        <SelectContent>
                            <SelectItem value="All">All Categories</SelectItem>
                            {categories.map(cat => <SelectItem key={cat} value={cat}>{cat}</SelectItem>)}
                        </SelectContent>
                    </Select>
                </div>
                <div className="flex gap-2">
                    <div className="space-y-2 flex-1">
                        <Label htmlFor="sort-by">Sort By</Label>
                        <Select value={sortBy} onValueChange={(value) => setSortBy(value as 'name' | 'category')}>
                            <SelectTrigger id="sort-by"><SelectValue /></SelectTrigger>
                            <SelectContent>
                                <SelectItem value="category">Category</SelectItem>
                                <SelectItem value="name">Name</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                     <Button variant="ghost" size="icon" className="self-end" onClick={resetFilters}>
                        <X className="h-5 w-5" />
                        <span className="sr-only">Reset Filters</span>
                    </Button>
                </div>
            </div>
        </Card>

        {Object.keys(groupedTemplates).length > 0 ? (
           Object.entries(groupedTemplates).map(([toolType, templates]) => (
            <section key={toolType} className="mb-16">
              <h2 className="text-3xl font-bold font-headline mb-8">{toolType} Templates</h2>
              <motion.div 
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8"
                variants={containerVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.1 }}
              >
                {templates.map((template) => (
                  <TemplateCard key={template.id + template.toolType} template={template} onPreview={handlePreview} />
                ))}
              </motion.div>
            </section>
          ))
        ) : (
            <div className="text-center py-16 text-muted-foreground">
                <p className="text-lg font-semibold">No templates found.</p>
                <p>Try adjusting your search or filter criteria.</p>
            </div>
        )}
      </div>
      <TemplatePreview
        template={selectedTemplate}
        isOpen={isPreviewOpen}
        onClose={() => setIsPreviewOpen(false)}
      />
    </>
  );
}
