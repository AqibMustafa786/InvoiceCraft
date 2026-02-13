
'use client';

import React, { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import { allTemplates } from '@/lib/template-data';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';

// Select a diverse set of templates to showcase
const carouselData = allTemplates
  .filter(t => [
    'modern', 
    'minimalist',
    'elegant', 
    'creative',
    'construction-2',
    'plumbing-2',
    'it-3',
    'legal-1',
    'medical-2',
  ].includes(t.id))
  .map(t => ({
    src: t.thumbnailUrl,
    alt: t.name,
    hint: t.useCases.join(' ').toLowerCase(),
  }));

export function StackedCarousel() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prevIndex) => (prevIndex + 1) % carouselData.length);
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative h-[500px] w-full max-w-lg mx-auto">
      <AnimatePresence initial={false}>
        {carouselData.map((card, i) => {
          const position = (i - index + carouselData.length) % carouselData.length;
          
          let y = 0;
          let scale = 1;
          let zIndex = 0;
          let opacity = 0;

          if (position === 0) { // Active card
            y = 0;
            scale = 1;
            zIndex = carouselData.length;
            opacity = 1;
          } else if (position < 4) { // Cards behind
            y = position * -30;
            scale = 1 - position * 0.05;
            zIndex = carouselData.length - position;
            opacity = 1;
          } else { // Hidden cards
             y = 100;
             opacity = 0;
          }

          return (
            <motion.div
              key={card.src}
              className="absolute h-full w-full rounded-2xl shadow-2xl overflow-hidden"
              initial={{ y: 50, opacity: 0, scale: 0.9 }}
              animate={{ y, scale, zIndex, opacity }}
              exit={{ y: -50, opacity: 0, scale: 0.9 }}
              transition={{ type: 'spring', stiffness: 200, damping: 25 }}
            >
              <Image
                src={card.src}
                alt={card.alt}
                data-ai-hint={card.hint}
                fill
                priority={i < 3}
                sizes="(max-width: 768px) 100vw, 512px"
                className="object-cover object-top"
              />
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
}
