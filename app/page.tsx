'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@boda/lib/store';
import { EVENT_CONFIG } from '@boda/types';

// Componente de flores frondosas
function FloralCorner({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 300 300" fill="none" className={className}>
      {/* Ramas principales */}
      <path d="M0 0 Q 80 50, 120 130 Q 150 200, 200 280" stroke="#8faabe" strokeWidth="2" fill="none"/>
      <path d="M40 0 Q 100 70, 140 160 Q 170 230, 220 300" stroke="#a8c0d0" strokeWidth="1.5" fill="none"/>
      <path d="M0 40 Q 50 80, 90 150 Q 120 200, 160 260" stroke="#6b8fc5" strokeWidth="1.5" fill="none"/>
      <path d="M80 0 Q 110 60, 150 120" stroke="#a8c0d0" strokeWidth="1" fill="none"/>
      
      {/* Hojas grandes - eucalipto */}
      <ellipse cx="60" cy="45" rx="22" ry="10" fill="#8faabe" opacity="0.7" transform="rotate(35 60 45)"/>
      <ellipse cx="45" cy="75" rx="20" ry="9" fill="#a8c0d0" opacity="0.6" transform="rotate(45 45 75)"/>
      <ellipse cx="75" cy="95" rx="18" ry="8" fill="#6b8fc5" opacity="0.5" transform="rotate(40 75 95)"/>
      <ellipse cx="55" cy="120" rx="20" ry="9" fill="#8faabe" opacity="0.6" transform="rotate(50 55 120)"/>
      <ellipse cx="90" cy="130" rx="16" ry="7" fill="#a8c0d0" opacity="0.5" transform="rotate(35 90 130)"/>
      <ellipse cx="70" cy="160" rx="22" ry="10" fill="#6b8fc5" opacity="0.6" transform="rotate(55 70 160)"/>
      <ellipse cx="100" cy="175" rx="18" ry="8" fill="#8faabe" opacity="0.5" transform="rotate(45 100 175)"/>
      <ellipse cx="85" cy="205" rx="20" ry="9" fill="#a8c0d0" opacity="0.6" transform="rotate(60 85 205)"/>
      <ellipse cx="115" cy="220" rx="16" ry="7" fill="#6b8fc5" opacity="0.5" transform="rotate(50 115 220)"/>
      <ellipse cx="130" cy="250" rx="18" ry="8" fill="#8faabe" opacity="0.6" transform="rotate(65 130 250)"/>
      
      {/* Hojas del otro lado de las ramas */}
      <ellipse cx="85" cy="60" rx="16" ry="7" fill="#a8c0d0" opacity="0.5" transform="rotate(-30 85 60)"/>
      <ellipse cx="100" cy="100" rx="14" ry="6" fill="#8faabe" opacity="0.6" transform="rotate(-35 100 100)"/>
      <ellipse cx="115" cy="145" rx="18" ry="8" fill="#6b8fc5" opacity="0.5" transform="rotate(-40 115 145)"/>
      <ellipse cx="135" cy="190" rx="15" ry="7" fill="#a8c0d0" opacity="0.6" transform="rotate(-45 135 190)"/>
      <ellipse cx="155" cy="235" rx="16" ry="7" fill="#8faabe" opacity="0.5" transform="rotate(-50 155 235)"/>
      
      {/* Rosa/Peonía grande principal */}
      <g transform="translate(35, 35)">
        {/* Pétalos exteriores */}
        <ellipse cx="-15" cy="5" rx="14" ry="10" fill="#e8eef3" opacity="0.9" transform="rotate(-20 -15 5)"/>
        <ellipse cx="15" cy="5" rx="14" ry="10" fill="#dce6ed" opacity="0.9" transform="rotate(20 15 5)"/>
        <ellipse cx="-10" cy="-12" rx="12" ry="9" fill="#e8eef3" opacity="0.85" transform="rotate(-40 -10 -12)"/>
        <ellipse cx="10" cy="-12" rx="12" ry="9" fill="#dce6ed" opacity="0.85" transform="rotate(40 10 -12)"/>
        <ellipse cx="0" cy="15" rx="13" ry="9" fill="#e8eef3" opacity="0.9"/>
        {/* Pétalos medios */}
        <ellipse cx="-8" cy="2" rx="10" ry="7" fill="#d4e0ea" opacity="0.9" transform="rotate(-15 -8 2)"/>
        <ellipse cx="8" cy="2" rx="10" ry="7" fill="#cdd9e5" opacity="0.9" transform="rotate(15 8 2)"/>
        <ellipse cx="0" cy="-8" rx="9" ry="6" fill="#d4e0ea" opacity="0.85"/>
        <ellipse cx="0" cy="10" rx="9" ry="6" fill="#cdd9e5" opacity="0.9"/>
        {/* Centro */}
        <circle cx="0" cy="0" r="8" fill="#c0d4e4" opacity="0.9"/>
        <circle cx="0" cy="0" r="5" fill="#a8c0d0" opacity="0.9"/>
        <circle cx="0" cy="0" r="2.5" fill="#6b8fc5"/>
      </g>
      
      {/* Rosa mediana */}
      <g transform="translate(110, 90)">
        <ellipse cx="-10" cy="3" rx="11" ry="8" fill="#e8eef3" opacity="0.9" transform="rotate(-25 -10 3)"/>
        <ellipse cx="10" cy="3" rx="11" ry="8" fill="#dce6ed" opacity="0.9" transform="rotate(25 10 3)"/>
        <ellipse cx="0" cy="-10" rx="10" ry="7" fill="#e8eef3" opacity="0.85"/>
        <ellipse cx="0" cy="12" rx="10" ry="7" fill="#dce6ed" opacity="0.9"/>
        <ellipse cx="-5" cy="0" rx="7" ry="5" fill="#d4e0ea" opacity="0.9"/>
        <ellipse cx="5" cy="0" rx="7" ry="5" fill="#cdd9e5" opacity="0.9"/>
        <circle cx="0" cy="0" r="6" fill="#c0d4e4" opacity="0.9"/>
        <circle cx="0" cy="0" r="3.5" fill="#8faabe"/>
      </g>
      
      {/* Rosa pequeña 1 */}
      <g transform="translate(55, 140)">
        <ellipse cx="-6" cy="2" rx="8" ry="6" fill="#e8eef3" opacity="0.9" transform="rotate(-20 -6 2)"/>
        <ellipse cx="6" cy="2" rx="8" ry="6" fill="#dce6ed" opacity="0.9" transform="rotate(20 6 2)"/>
        <ellipse cx="0" cy="-6" rx="7" ry="5" fill="#e8eef3" opacity="0.85"/>
        <circle cx="0" cy="0" r="5" fill="#d4e0ea" opacity="0.9"/>
        <circle cx="0" cy="0" r="3" fill="#a8c0d0"/>
      </g>
      
      {/* Rosa pequeña 2 */}
      <g transform="translate(140, 170)">
        <ellipse cx="-5" cy="2" rx="7" ry="5" fill="#e8eef3" opacity="0.9" transform="rotate(-15 -5 2)"/>
        <ellipse cx="5" cy="2" rx="7" ry="5" fill="#dce6ed" opacity="0.9" transform="rotate(15 5 2)"/>
        <circle cx="0" cy="0" r="5" fill="#d4e0ea" opacity="0.9"/>
        <circle cx="0" cy="0" r="2.5" fill="#8faabe"/>
      </g>
      
      {/* Rosa pequeña 3 */}
      <g transform="translate(95, 220)">
        <ellipse cx="-5" cy="2" rx="7" ry="5" fill="#e8eef3" opacity="0.9" transform="rotate(-20 -5 2)"/>
        <ellipse cx="5" cy="2" rx="7" ry="5" fill="#dce6ed" opacity="0.9" transform="rotate(20 5 2)"/>
        <circle cx="0" cy="0" r="4" fill="#d4e0ea" opacity="0.9"/>
        <circle cx="0" cy="0" r="2" fill="#6b8fc5"/>
      </g>
      
      {/* Flores muy pequeñas / capullos */}
      <g transform="translate(25, 100)">
        <circle cx="0" cy="0" r="6" fill="#e8eef3" opacity="0.8"/>
        <circle cx="0" cy="0" r="3" fill="#c0d4e4"/>
      </g>
      <g transform="translate(150, 130)">
        <circle cx="0" cy="0" r="5" fill="#e8eef3" opacity="0.8"/>
        <circle cx="0" cy="0" r="2.5" fill="#a8c0d0"/>
      </g>
      <g transform="translate(70, 190)">
        <circle cx="0" cy="0" r="5" fill="#e8eef3" opacity="0.8"/>
        <circle cx="0" cy="0" r="2.5" fill="#8faabe"/>
      </g>
      <g transform="translate(165, 210)">
        <circle cx="0" cy="0" r="4" fill="#e8eef3" opacity="0.8"/>
        <circle cx="0" cy="0" r="2" fill="#6b8fc5"/>
      </g>
      <g transform="translate(120, 260)">
        <circle cx="0" cy="0" r="5" fill="#e8eef3" opacity="0.8"/>
        <circle cx="0" cy="0" r="2.5" fill="#a8c0d0"/>
      </g>
      
      {/* Bayas / detalles */}
      <circle cx="40" cy="60" r="3" fill="#6b8fc5" opacity="0.7"/>
      <circle cx="95" cy="75" r="2.5" fill="#8faabe" opacity="0.6"/>
      <circle cx="65" cy="105" r="2" fill="#6b8fc5" opacity="0.7"/>
      <circle cx="125" cy="115" r="3" fill="#a8c0d0" opacity="0.6"/>
      <circle cx="45" cy="150" r="2.5" fill="#8faabe" opacity="0.7"/>
      <circle cx="110" cy="160" r="2" fill="#6b8fc5" opacity="0.6"/>
      <circle cx="80" cy="180" r="2.5" fill="#a8c0d0" opacity="0.7"/>
      <circle cx="150" cy="195" r="2" fill="#8faabe" opacity="0.6"/>
      <circle cx="105" cy="235" r="2.5" fill="#6b8fc5" opacity="0.7"/>
      <circle cx="145" cy="255" r="2" fill="#a8c0d0" opacity="0.6"/>
      
      {/* Hojas pequeñas adicionales */}
      <ellipse cx="30" cy="85" rx="8" ry="4" fill="#8faabe" opacity="0.4" transform="rotate(30 30 85)"/>
      <ellipse cx="130" cy="105" rx="7" ry="3" fill="#a8c0d0" opacity="0.4" transform="rotate(-25 130 105)"/>
      <ellipse cx="50" cy="175" rx="8" ry="4" fill="#6b8fc5" opacity="0.4" transform="rotate(40 50 175)"/>
      <ellipse cx="160" cy="180" rx="7" ry="3" fill="#8faabe" opacity="0.4" transform="rotate(-30 160 180)"/>
      <ellipse cx="75" cy="240" rx="8" ry="4" fill="#a8c0d0" opacity="0.4" transform="rotate(50 75 240)"/>
    </svg>
  );
}

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
      router.push('/galeria');
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

          {/* Monograma NK */}
          <div className="my-6 flex justify-center">
            <div className="relative">
              <span className="font-serif text-2xl text-navy tracking-widest">
                {EVENT_CONFIG.monogram}
              </span>
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