
'use client';

import React, { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import { allTemplates } from '@/lib/template-data';

// Select a diverse set of templates to showcase
const carouselData = allTemplates
  .filter(t => [
    'modern', 
    'construction-1', 
    'it-1', 
    'usa-claim-default', 
    'elegant', 
    'plumbing-1',
    'photography-1'
  ].includes(t.id))
  .map(t => ({
    src: t.thumbnailUrl,
    alt: t.name,
    hint: t.useCases.join(' ').toLowerCase(),
  }));

export function StackedCarousel() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const carouselRef = useRef<HTMLDivElement>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const updateCarousel = () => {
    if (!carouselRef.current) return;
    const cards = carouselRef.current.querySelectorAll('.carousel-card');
    
    if (cards.length === 0) return;

    cards.forEach((card, index) => {
      card.className = 'carousel-card hidden'; // Reset classes

      const totalCards = cards.length;
      if (index === currentIndex) {
        card.classList.add('active');
      } else if (index === (currentIndex - 1 + totalCards) % totalCards) {
        card.classList.add('prev');
      } else if (index === (currentIndex + 1) % totalCards) {
        card.classList.add('next');
      }
    });
  };

  const nextCard = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % carouselData.length);
  };

  const prevCard = () => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + carouselData.length) % carouselData.length);
  };

  const startAutoSlide = () => {
    stopAutoSlide(); // Clear any existing interval
    intervalRef.current = setInterval(nextCard, 4500);
  };

  const stopAutoSlide = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
  };

  useEffect(() => {
    updateCarousel();
  }, [currentIndex]);

  useEffect(() => {
    startAutoSlide();
    // Initial update in case the component re-renders
    const timer = setTimeout(updateCarousel, 10);
    
    return () => {
      stopAutoSlide();
      clearTimeout(timer);
    };
  }, []);

  return (
    <section className="template-showcase">
      <h2>Invoice Templates</h2>
      <p className="subtitle">
        Professionally designed templates for your business
      </p>

      <div 
        className="carousel" 
        ref={carouselRef}
        onMouseEnter={stopAutoSlide}
        onMouseLeave={startAutoSlide}
      >
        {carouselData.map((item, index) => (
          <div className="carousel-card" key={index}>
            <Image src={item.src} alt={item.alt} data-ai-hint={item.hint} fill priority={index < 3} sizes="(max-width: 768px) 100vw, 740px" />
          </div>
        ))}
      </div>

      <div className="controls">
        <button id="prev" onClick={prevCard}>‹</button>
        <button id="next" onClick={nextCard}>›</button>
      </div>
    </section>
  );
}
