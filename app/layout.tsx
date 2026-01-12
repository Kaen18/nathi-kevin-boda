import type { Metadata } from 'next';
import { 
  Great_Vibes, 
  Sacramento, 
  Cormorant_Garamond, 
  Lato, 
  Montserrat 
} from 'next/font/google';
import './globals.css';

// Fuente script para "Nathi & Kevin"
const greatVibes = Great_Vibes({
  weight: '400',
  subsets: ['latin'],
  variable: '--font-great-vibes',
  display: 'swap',
});

// Fuente script para "Evento Religioso", "Recepción y brindis"
const sacramento = Sacramento({
  weight: '400',
  subsets: ['latin'],
  variable: '--font-sacramento',
  display: 'swap',
});

// Fuente serif elegante para la fecha
const cormorant = Cormorant_Garamond({
  weight: ['300', '400', '500', '600'],
  subsets: ['latin'],
  variable: '--font-cormorant',
  display: 'swap',
});

// Fuente sans para texto de cuerpo
const lato = Lato({
  weight: ['300', '400', '700'],
  subsets: ['latin'],
  variable: '--font-lato',
  display: 'swap',
});

// Fuente display para botones y títulos uppercase
const montserrat = Montserrat({
  weight: ['300', '400', '500', '600'],
  subsets: ['latin'],
  variable: '--font-montserrat',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Nathi & Kevin | 07-02-26',
  description: '¡Nos satisface! Comparte tus fotos y videos de nuestra boda.',
  openGraph: {
    title: 'Nathi & Kevin - Nuestra Boda',
    description: 'Comparte tus fotos y videos de nuestra celebración',
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es">
      <body
        className={`
          ${greatVibes.variable} 
          ${sacramento.variable} 
          ${cormorant.variable} 
          ${lato.variable}
          ${montserrat.variable}
          font-sans 
          antialiased
        `}
      >
        {children}
      </body>
    </html>
  );
}