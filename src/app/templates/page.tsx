
'use client';

import { useState } from 'react';
import { PageHeader, PageHeaderDescription, PageHeaderHeading } from '@/components/page-header';
import { allTemplates, Template } from '@/lib/template-data';
import { TemplateCard } from '@/components/templates/template-card';
import { TemplatePreview } from '@/components/templates/template-preview';
import { motion } from 'framer-motion';

export default function TemplatesPage() {
  const [selectedTemplate, setSelectedTemplate] = useState<Template | null>(null);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);

  const handlePreview = (template: Template) => {
    setSelectedTemplate(template);
    setIsPreviewOpen(true);
  };

  const invoiceTemplates = allTemplates.filter(t => t.toolType === 'Invoice');
  const estimateTemplates = allTemplates.filter(t => t.toolType === 'Estimate');
  const quoteTemplates = allTemplates.filter(t => t.toolType === 'Quote');
  const insuranceTemplates = allTemplates.filter(t => t.toolType === 'Insurance');

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.08,
      },
    },
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

        {/* Invoice Templates */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold font-headline mb-8">Invoice Templates</h2>
          <motion.div 
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.1 }}
          >
            {invoiceTemplates.map((template) => (
              <TemplateCard key={template.id} template={template} onPreview={handlePreview} />
            ))}
          </motion.div>
        </section>

        {/* Estimate Templates */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold font-headline mb-8">Estimate Templates</h2>
           <motion.div 
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.1 }}
          >
            {estimateTemplates.map((template) => (
              <TemplateCard key={template.id} template={template} onPreview={handlePreview} />
            ))}
          </motion.div>
        </section>
        
        {/* Quote Templates */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold font-headline mb-8">Quote Templates</h2>
           <motion.div 
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.1 }}
          >
            {quoteTemplates.map((template) => (
              <TemplateCard key={template.id} template={template} onPreview={handlePreview} />
            ))}
          </motion.div>
        </section>
        
        {/* Insurance Templates */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold font-headline mb-8">Insurance Templates</h2>
           <motion.div 
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.1 }}
          >
            {insuranceTemplates.map((template) => (
              <TemplateCard key={template.id} template={template} onPreview={handlePreview} />
            ))}
          </motion.div>
        </section>
      </div>
      <TemplatePreview
        template={selectedTemplate}
        isOpen={isPreviewOpen}
        onClose={() => setIsPreviewOpen(false)}
      />
    </>
  );
}
