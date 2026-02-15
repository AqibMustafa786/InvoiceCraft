'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { allTemplates } from '@/lib/template-data';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';

// Select 3 specific diverse templates
const initialTemplates = [
  allTemplates.find(t => t.id === 'legal-1')!,        // 0
  allTemplates.find(t => t.id === 'modern')!,         // 1 (Initially Center)
  allTemplates.find(t => t.id === 'construction-2')!, // 2
];

export function TemplateShowcase() {
  const [items, setItems] = useState(initialTemplates);
  const [activeIndex, setActiveIndex] = useState(1); // Start with middle item active

  const handleCardClick = (index: number) => {
    setActiveIndex(index);
  };

  const getPositionVariant = (index: number) => {
    if (index === activeIndex) {
      return {
        zIndex: 30,
        x: 0,
        y: 0,
        scale: 1.1, // Made central card slightly larger
        rotate: 0,
        opacity: 1,
        filter: 'blur(0px)',
      };
    } else if (index === (activeIndex - 1 + items.length) % items.length) {
      // Left position
      return {
        zIndex: 20,
        x: -140, // More separation
        y: 40,
        scale: 0.85,
        rotate: -15,
        opacity: 0.8,
        filter: 'blur(1px)', // Slight focus pull to center
      };
    } else {
      // Right position
      return {
        zIndex: 20,
        x: 140, // More separation
        y: 40,
        scale: 0.85,
        rotate: 15,
        opacity: 0.8,
        filter: 'blur(1px)',
      };
    }
  };

  return (
    <div className="relative h-[500px] w-full max-w-4xl mx-auto flex items-center justify-center">
      <div className="relative w-full h-full flex items-center justify-center">
        {items.map((template, index) => {
          const isCenter = index === activeIndex;

          return (
            <motion.div
              key={template.id}
              className={cn(
                "absolute w-[280px] md:w-[320px] aspect-[210/297] rounded-xl shadow-2xl border border-white/10 overflow-hidden cursor-pointer transition-shadow duration-300",
                isCenter ? "shadow-[0_20px_50px_rgba(0,0,0,0.5)] border-primary/20" : "hover:brightness-110"
              )}
              initial={false}
              animate={getPositionVariant(index)}
              transition={{
                type: 'spring',
                stiffness: 260,
                damping: 20,
              }}
              onClick={() => handleCardClick(index)}
              whileHover={isCenter ? {} : { scale: 0.9, y: 30 }} // Subtle hover effect for non-active cards
            >
              <Image
                src={template.thumbnailUrl}
                alt={template.name}
                fill
                className="object-cover object-top"
                priority={isCenter}
              />
              {/* Overlay Gradient */}
              <div className={cn(
                "absolute inset-0 bg-gradient-to-t transition-opacity duration-300",
                isCenter ? "from-black/60 via-transparent to-transparent opacity-40" : "from-black/80 via-transparent to-transparent opacity-60"
              )}></div>

              {/* Text Content */}
              <div className="absolute bottom-6 left-6 text-white transform transition-transform duration-300">
                {isCenter && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-primary/20 backdrop-blur-md px-3 py-1 rounded-full text-xs font-semibold text-primary-foreground mb-2 w-fit border border-primary/30"
                  >
                    Active Selection
                  </motion.div>
                )}
                <p className={cn("font-bold transition-all duration-300", isCenter ? "text-xl" : "text-base")}>
                  {template.name}
                </p>
                <p className="text-xs sm:text-sm text-gray-300">
                  {template.category}
                </p>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}

// Export with alias for backward compatibility
export { TemplateShowcase as StackedCarousel };
