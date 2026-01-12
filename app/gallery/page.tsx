'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore, useGalleryStore, useUploadStore } from '@boda/lib/store';
import { EVENT_CONFIG } from '@boda/types';
import UploadModal from '@boda/components/upload/UploadModal';
import GalleryGrid from '@boda/components/gallery/GalleryGrid';
import FilterTags from '@boda/components/gallery/FilterTags';

export default function GaleriaPage() {
  const router = useRouter();
  const { isAuthenticated } = useAuthStore();
  const { media, tags, isLoading, fetchMedia, fetchTags } = useGalleryStore();
  const { showModal, setShowModal } = useUploadStore();
  const [mediaCount, setMediaCount] = useState(0);

  // Proteger ruta - redirigir si no está autenticado
  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/');
    }
  }, [isAuthenticated, router]);

  // Cargar datos iniciales
  useEffect(() => {
    if (isAuthenticated) {
      fetchMedia(true);
      fetchTags();
    }
  }, [isAuthenticated, fetchMedia, fetchTags]);

  // Actualizar contador
  useEffect(() => {
    setMediaCount(media.length);
  }, [media]);

  if (!isAuthenticated) {
    return null;
  }

  return (
    <main className="min-h-screen bg-cream">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-cream/80 backdrop-blur-md border-b border-floral-light/30">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            {/* Logo / Nombres */}
            <div className="flex items-center gap-3">
              <h1 className="title-script text-3xl md:text-4xl">
                {EVENT_CONFIG.names.partner1}
                <span className="text-floral mx-1">&</span>
                {EVENT_CONFIG.names.partner2}
              </h1>
            </div>

            {/* Contador y botón subir */}
            <div className="flex items-center gap-4">
              <div className="hidden sm:block text-right">
                <p className="text-xs text-charcoal/50 uppercase tracking-wider">Recuerdos</p>
                <p className="font-serif text-xl text-navy">{mediaCount}</p>
              </div>
              
              <button
                onClick={() => setShowModal(true)}
                className="btn-primary flex items-center gap-2"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                <span className="hidden sm:inline">Subir</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Filtros */}
      <section className="max-w-7xl mx-auto px-4 py-6">
        <FilterTags tags={tags} />
      </section>

      {/* Galería */}
      <section className="max-w-7xl mx-auto px-4 pb-12">
        {isLoading && media.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="w-12 h-12 border-4 border-floral-light border-t-navy rounded-full animate-spin"></div>
            <p className="mt-4 text-charcoal/60 font-sans">Cargando recuerdos...</p>
          </div>
        ) : media.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="w-24 h-24 mb-6 text-floral-light">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <h2 className="font-serif text-2xl text-navy mb-2">Aún no hay fotos</h2>
            <p className="text-charcoal/60 font-sans mb-6">¡Sé el primero en compartir un recuerdo!</p>
            <button
              onClick={() => setShowModal(true)}
              className="btn-secondary"
            >
              Subir primera foto
            </button>
          </div>
        ) : (
          <GalleryGrid media={media} />
        )}
      </section>

      {/* Botón flotante para subir (mobile) */}
      <button
        onClick={() => setShowModal(true)}
        className="fixed bottom-6 right-6 sm:hidden w-14 h-14 bg-navy text-cream rounded-full shadow-elegant flex items-center justify-center hover:bg-navy-light transition-all active:scale-95"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
        </svg>
      </button>

      {/* Modal de subida */}
      <UploadModal 
        isOpen={showModal} 
        onClose={() => setShowModal(false)} 
      />
    </main>
  );
}