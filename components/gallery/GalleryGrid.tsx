'use client';

import { useState, useMemo } from 'react';
import Image from 'next/image';
import type { Media } from '@boda/types';
import { cn } from '@boda/lib/utils';
import Lightbox from './Lightbox';

interface GalleryGridProps {
  media: Media[];
}

// Patrones de tamaño para crear variación visual orgánica
type SizeVariant = 'tall' | 'wide' | 'normal' | 'featured';

// Genera un patrón de tamaños pseudo-aleatorio pero consistente basado en el índice
function getItemSize(index: number, totalItems: number): SizeVariant {
  // Cada ~8 items, uno destacado (featured)
  if (index % 8 === 0 && index < totalItems - 2) return 'featured';
  // Patrón variado para el resto
  const pattern: SizeVariant[] = ['normal', 'tall', 'normal', 'wide', 'normal', 'normal', 'tall', 'normal'];
  return pattern[index % pattern.length];
}

// Calcula el aspect ratio real o usa uno basado en el patrón
function getAspectRatio(item: Media, sizeVariant: SizeVariant): string {
  // Si tenemos dimensiones reales, las usamos para fotos normales
  if (item.width && item.height && sizeVariant === 'normal') {
    const ratio = item.width / item.height;
    if (ratio > 1.4) return 'aspect-[4/3]';
    if (ratio < 0.7) return 'aspect-[3/4]';
    return 'aspect-square';
  }
  
  // Para variantes especiales, usamos aspectos fijos para el efecto masonry
  switch (sizeVariant) {
    case 'featured': return 'aspect-[4/5]';
    case 'tall': return 'aspect-[3/4]';
    case 'wide': return 'aspect-[4/3]';
    default: return 'aspect-square';
  }
}

export default function GalleryGrid({ media }: GalleryGridProps) {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

  // Pre-calcular tamaños para consistencia
  const itemSizes = useMemo(() => 
    media.map((_, index) => getItemSize(index, media.length)),
    [media]
  );

  const openLightbox = (index: number) => {
    setSelectedIndex(index);
  };

  const closeLightbox = () => {
    setSelectedIndex(null);
  };

  const goToPrevious = () => {
    if (selectedIndex !== null && selectedIndex > 0) {
      setSelectedIndex(selectedIndex - 1);
    }
  };

  const goToNext = () => {
    if (selectedIndex !== null && selectedIndex < media.length - 1) {
      setSelectedIndex(selectedIndex + 1);
    }
  };

  return (
    <>
      {/* Masonry Grid - Collage editorial */}
      <div className="columns-2 sm:columns-3 lg:columns-4 xl:columns-5 gap-2 md:gap-3 space-y-2 md:space-y-3">
        {media.map((item, index) => {
          const sizeVariant = itemSizes[index];
          const aspectClass = getAspectRatio(item, sizeVariant);
          
          return (
            <div
              key={item.id}
              onClick={() => openLightbox(index)}
              className={cn(
                'relative break-inside-avoid mb-2 md:mb-3',
                'overflow-hidden cursor-pointer',
                'group',
                'animate-fade-in',
                // Sin bordes redondeados muy pronunciados para look editorial limpio
                'rounded-sm',
                aspectClass
              )}
              style={{ 
                animationDelay: `${(index % 15) * 40}ms`,
              }}
            >
              {item.type === 'photo' ? (
                <Image
                  src={item.url}
                  alt={item.originalName}
                  fill
                  sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"
                  className={cn(
                    'object-cover',
                    'transition-transform duration-700 ease-out',
                    'group-hover:scale-[1.03]'
                  )}
                />
              ) : (
                <div className="relative w-full h-full">
                  <video
                    src={item.url}
                    className="w-full h-full object-cover"
                    muted
                    playsInline
                    preload="metadata"
                  />
                  {/* Play icon overlay para videos */}
                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    <div className={cn(
                      'w-14 h-14 rounded-full',
                      'bg-white/90 backdrop-blur-sm',
                      'flex items-center justify-center',
                      'shadow-lg',
                      'transition-all duration-300',
                      'group-hover:scale-110 group-hover:bg-white'
                    )}>
                      <svg 
                        xmlns="http://www.w3.org/2000/svg" 
                        className="h-6 w-6 text-navy ml-1" 
                        fill="currentColor" 
                        viewBox="0 0 24 24"
                      >
                        <path d="M8 5v14l11-7z" />
                      </svg>
                    </div>
                  </div>
                </div>
              )}

              {/* Overlay sutil y elegante - solo en hover */}
              <div className={cn(
                'absolute inset-0',
                'bg-gradient-to-t from-black/40 via-transparent to-transparent',
                'opacity-0 group-hover:opacity-100',
                'transition-opacity duration-500'
              )} />

              {/* Tags discretos en hover */}
              {item.tags.length > 0 && (
                <div className={cn(
                  'absolute bottom-0 left-0 right-0 p-3',
                  'opacity-0 group-hover:opacity-100',
                  'transition-all duration-500',
                  'translate-y-2 group-hover:translate-y-0'
                )}>
                  <div className="flex flex-wrap gap-1">
                    {item.tags.slice(0, 2).map((tag) => (
                      <span 
                        key={tag.id} 
                        className="text-[10px] bg-white/25 backdrop-blur-sm text-white px-2 py-0.5 rounded-full"
                      >
                        {tag.name}
                      </span>
                    ))}
                    {item.tags.length > 2 && (
                      <span className="text-[10px] text-white/80">
                        +{item.tags.length - 2}
                      </span>
                    )}
                  </div>
                </div>
              )}

              {/* Indicador de video minimalista */}
              {item.type === 'video' && (
                <div className={cn(
                  'absolute top-3 right-3',
                  'bg-black/50 backdrop-blur-sm',
                  'text-white text-[10px] font-medium',
                  'px-2 py-1 rounded-full',
                  'flex items-center gap-1',
                  'opacity-80'
                )}>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M8 5v14l11-7z" />
                  </svg>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Lightbox - sin cambios */}
      {selectedIndex !== null && (
        <Lightbox
          media={media}
          currentIndex={selectedIndex}
          onClose={closeLightbox}
          onPrevious={goToPrevious}
          onNext={goToNext}
        />
      )}
    </>
  );
}