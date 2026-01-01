
'use client';

import React, { useState, useEffect, useRef } from 'react';
import Image from 'next/image';

const carouselData = [
  { src: 'https://picsum.photos/seed/construction-1/740/440', alt: 'Construction Template', hint: 'construction template' },
  { src: 'https://picsum.photos/seed/it-service/740/440', alt: 'IT Service Template', hint: 'IT service' },
  { src: 'https://picsum.photos/seed/modern-invoice/740/440', alt: 'Modern Invoice Template', hint: 'modern invoice' },
  { src: 'https://picsum.photos/seed/insurance-doc/740/440', alt: 'Insurance Document Template', hint: 'insurance document' },
  { src: 'https://picsum.photos/seed/elegant-design/740/440', alt: 'Elegant Template', hint: 'elegant design' },
];

export function StackedCarousel() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const carouselRef = useRef<HTMLDivElement>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const updateCarousel = () => {
    if (!carouselRef.current) return;
    const cards = carouselRef.current.querySelectorAll('.carousel-card');

    cards.forEach((card, index) => {
      card.className = 'carousel-card hidden'; // Reset classes

      if (index === currentIndex) {
        card.classList.add('active');
      } else if (index === (currentIndex - 1 + cards.length) % cards.length) {
        card.classList.add('prev');
      } else if (index === (currentIndex + 1) % cards.length) {
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
    return () => stopAutoSlide();
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
