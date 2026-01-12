'use client';

import { useEffect, useCallback } from 'react';
import Image from 'next/image';
import type { Media } from '@boda/types';
import { cn, formatRelativeTime, formatFileSize } from '@boda/lib/utils';

interface LightboxProps {
  media: Media[];
  currentIndex: number;
  onClose: () => void;
  onPrevious: () => void;
  onNext: () => void;
}

export default function Lightbox({
  media,
  currentIndex,
  onClose,
  onPrevious,
  onNext,
}: LightboxProps) {
  const currentMedia = media[currentIndex];
  const hasPrevious = currentIndex > 0;
  const hasNext = currentIndex < media.length - 1;

  // Manejar teclas
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      switch (e.key) {
        case 'Escape':
          onClose();
          break;
        case 'ArrowLeft':
          if (hasPrevious) onPrevious();
          break;
        case 'ArrowRight':
          if (hasNext) onNext();
          break;
      }
    },
    [onClose, onPrevious, onNext, hasPrevious, hasNext]
  );

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown);
    document.body.style.overflow = 'hidden';

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'unset';
    };
  }, [handleKeyDown]);

  // Descargar archivo
  const handleDownload = async () => {
    try {
      const response = await fetch(currentMedia.url);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = currentMedia.originalName;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error al descargar:', error);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-charcoal/95 animate-fade-in">
      {/* Header */}
      <div className="absolute top-0 left-0 right-0 z-10 bg-gradient-to-b from-black/50 to-transparent">
        <div className="flex items-center justify-between p-4">
          {/* Contador */}
          <p className="text-white/80 font-sans text-sm">
            {currentIndex + 1} / {media.length}
          </p>

          {/* Acciones */}
          <div className="flex items-center gap-2">
            {/* Descargar */}
            <button
              onClick={handleDownload}
              className="p-2 text-white/80 hover:text-white hover:bg-white/10 rounded-full transition-all"
              title="Descargar"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
              </svg>
            </button>

            {/* Cerrar */}
            <button
              onClick={onClose}
              className="p-2 text-white/80 hover:text-white hover:bg-white/10 rounded-full transition-all"
              title="Cerrar (Esc)"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Contenido principal */}
      <div 
        className="absolute inset-0 flex items-center justify-center p-4 md:p-16"
        onClick={onClose}
      >
        <div 
          className="relative max-w-full max-h-full"
          onClick={(e) => e.stopPropagation()}
        >
          {currentMedia.type === 'photo' ? (
            <Image
              src={currentMedia.url}
              alt={currentMedia.originalName}
              width={currentMedia.width || 1200}
              height={currentMedia.height || 800}
              className="max-h-[80vh] w-auto object-contain rounded-lg"
              priority
            />
          ) : (
            <video
              src={currentMedia.url}
              controls
              autoPlay
              className="max-h-[80vh] w-auto rounded-lg"
            >
              Tu navegador no soporta videos.
            </video>
          )}
        </div>
      </div>

      {/* Botón anterior */}
      <button
        onClick={(e) => {
          e.stopPropagation();
          onPrevious();
        }}
        disabled={!hasPrevious}
        className={cn(
          'absolute left-4 top-1/2 -translate-y-1/2 z-10',
          'w-12 h-12 rounded-full bg-white/10 backdrop-blur-sm',
          'flex items-center justify-center',
          'text-white transition-all',
          hasPrevious 
            ? 'hover:bg-white/20 cursor-pointer' 
            : 'opacity-30 cursor-not-allowed'
        )}
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
      </button>

      {/* Botón siguiente */}
      <button
        onClick={(e) => {
          e.stopPropagation();
          onNext();
        }}
        disabled={!hasNext}
        className={cn(
          'absolute right-4 top-1/2 -translate-y-1/2 z-10',
          'w-12 h-12 rounded-full bg-white/10 backdrop-blur-sm',
          'flex items-center justify-center',
          'text-white transition-all',
          hasNext 
            ? 'hover:bg-white/20 cursor-pointer' 
            : 'opacity-30 cursor-not-allowed'
        )}
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </button>

      {/* Footer con info */}
      <div className="absolute bottom-0 left-0 right-0 z-10 bg-gradient-to-t from-black/50 to-transparent">
        <div className="p-4">
          {/* Tags */}
          {currentMedia.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-3">
              {currentMedia.tags.map((tag) => (
                <span
                  key={tag.id}
                  className="px-2 py-1 bg-white/20 backdrop-blur-sm rounded-full text-xs text-white"
                >
                  {tag.name}
                </span>
              ))}
            </div>
          )}

          {/* Info del archivo */}
          <div className="flex items-center justify-between text-white/70 text-sm">
            <p>{currentMedia.originalName}</p>
            <div className="flex items-center gap-4">
              <span>{formatFileSize(currentMedia.size)}</span>
              <span>{formatRelativeTime(new Date(currentMedia.uploadedAt))}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}