'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { useAuthStore } from '@boda/lib/store';
import { EVENT_CONFIG } from '@boda/types';
import FloralCorner from '@boda/components/ui/FloralCorner';

export default function LoginPage() {
  const router = useRouter();
  const { isAuthenticated, isLoading, error, login } = useAuthStore();
  const [code, setCode] = useState('');
  const [showError, setShowError] = useState(false);

  useEffect(() => {
    if (isAuthenticated) {
      router.push('/gallery');
    }
  }, [isAuthenticated, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setShowError(false);
    
    const success = await login(code.trim());
    
    if (success) {
      router.push('/gallery');
    } else {
      setShowError(true);
    }
  };

  return (
    <main className="relative min-h-screen flex items-center justify-center overflow-hidden px-4">
      
      {/* Flores esquina superior izquierda */}
      <FloralCorner className="absolute top-0 left-0 w-48 h-48 md:w-72 md:h-72 lg:w-80 lg:h-80 opacity-90" />
      
      {/* Flores esquina superior derecha */}
      <FloralCorner className="absolute top-0 right-0 w-48 h-48 md:w-72 md:h-72 lg:w-80 lg:h-80 opacity-90 -scale-x-100" />
      
      {/* Flores esquina inferior izquierda */}
      <FloralCorner className="absolute bottom-0 left-0 w-52 h-52 md:w-80 md:h-80 lg:w-96 lg:h-96 opacity-90 -scale-y-100" />
      
      {/* Flores esquina inferior derecha */}
      <FloralCorner className="absolute bottom-0 right-0 w-52 h-52 md:w-80 md:h-80 lg:w-96 lg:h-96 opacity-90 scale-x-[-1] scale-y-[-1]" />

      {/* Contenido central */}
      <div className="relative z-10 w-full max-w-md animate-fade-in">
        <div className="card-glass px-8 py-12 text-center">
          
          {/* "¡NOS CASAMOS!" */}
          <p className="text-spaced text-floral mb-6">
            ¡Nos casamos!
          </p>
          
          {/* Nombres */}
          <h1 className="title-script text-6xl md:text-7xl leading-tight">
            {EVENT_CONFIG.names.partner1}
          </h1>
          <span className="title-script text-4xl md:text-5xl text-floral">&</span>
          <h1 className="title-script text-6xl md:text-7xl leading-tight">
            {EVENT_CONFIG.names.partner2}
          </h1>

          {/* Monograma personalizado */}
          <div className="my-6 flex justify-center">
            <div className="relative">
              <Image
                src="/images/monogram.svg"
                alt={EVENT_CONFIG.monogram}
                width={80}
                height={80}
                className="w-16 h-16 md:w-20 md:h-20"
              />
              <svg className="absolute -top-2 left-1/2 -translate-x-1/2 w-3 h-3 text-gold" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
              </svg>
            </div>
          </div>

          {/* Línea dorada */}
          <div className="line-gold w-32 mx-auto mb-6"></div>

          {/* Fecha */}
          <div className="frame-date inline-block mb-8">
            <p className="font-serif text-2xl text-navy tracking-wider">
              {EVENT_CONFIG.date}
            </p>
          </div>

          {/* Mensaje */}
          <p className="font-sans text-sm text-charcoal/60 mb-6">
            Ingresa el código del evento para<br />acceder a la galería de fotos
          </p>

          {/* Formulario */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              type="text"
              placeholder="Código del evento"
              value={code}
              onChange={(e) => {
                setCode(e.target.value);
                setShowError(false);
              }}
              className="input-elegant text-center tracking-widest uppercase"
            />

            {showError && error && (
              <p className="text-red-500 text-sm animate-fade-in">
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={!code.trim() || isLoading}
              className="btn-primary w-full"
            >
              {isLoading ? 'Verificando...' : 'Ingresar'}
            </button>
          </form>

          <p className="mt-8 font-sans text-xs text-charcoal/40">
            Comparte tus fotos y videos de nuestra celebración ✨
          </p>
        </div>
      </div>
    </main>
  );
}