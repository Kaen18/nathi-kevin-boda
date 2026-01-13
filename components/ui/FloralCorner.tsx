'use client';

// Componente de flores frondosas - Tonos Navy
export default function FloralCorner({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 300 300" fill="none" className={className}>
      {/* Ramas principales */}
      <path d="M0 0 Q 80 50, 120 130 Q 150 200, 200 280" stroke="#1e3a5f" strokeWidth="2" fill="none"/>
      <path d="M40 0 Q 100 70, 140 160 Q 170 230, 220 300" stroke="#2c5282" strokeWidth="1.5" fill="none"/>
      <path d="M0 40 Q 50 80, 90 150 Q 120 200, 160 260" stroke="#1a365d" strokeWidth="1.5" fill="none"/>
      <path d="M80 0 Q 110 60, 150 120" stroke="#2c5282" strokeWidth="1" fill="none"/>
      
      {/* Hojas grandes - eucalipto */}
      <ellipse cx="60" cy="45" rx="22" ry="10" fill="#1e3a5f" opacity="0.7" transform="rotate(35 60 45)"/>
      <ellipse cx="45" cy="75" rx="20" ry="9" fill="#2c5282" opacity="0.6" transform="rotate(45 45 75)"/>
      <ellipse cx="75" cy="95" rx="18" ry="8" fill="#1a365d" opacity="0.5" transform="rotate(40 75 95)"/>
      <ellipse cx="55" cy="120" rx="20" ry="9" fill="#1e3a5f" opacity="0.6" transform="rotate(50 55 120)"/>
      <ellipse cx="90" cy="130" rx="16" ry="7" fill="#2c5282" opacity="0.5" transform="rotate(35 90 130)"/>
      <ellipse cx="70" cy="160" rx="22" ry="10" fill="#1a365d" opacity="0.6" transform="rotate(55 70 160)"/>
      <ellipse cx="100" cy="175" rx="18" ry="8" fill="#1e3a5f" opacity="0.5" transform="rotate(45 100 175)"/>
      <ellipse cx="85" cy="205" rx="20" ry="9" fill="#2c5282" opacity="0.6" transform="rotate(60 85 205)"/>
      <ellipse cx="115" cy="220" rx="16" ry="7" fill="#1a365d" opacity="0.5" transform="rotate(50 115 220)"/>
      <ellipse cx="130" cy="250" rx="18" ry="8" fill="#1e3a5f" opacity="0.6" transform="rotate(65 130 250)"/>
      
      {/* Hojas del otro lado de las ramas */}
      <ellipse cx="85" cy="60" rx="16" ry="7" fill="#2c5282" opacity="0.5" transform="rotate(-30 85 60)"/>
      <ellipse cx="100" cy="100" rx="14" ry="6" fill="#1e3a5f" opacity="0.6" transform="rotate(-35 100 100)"/>
      <ellipse cx="115" cy="145" rx="18" ry="8" fill="#1a365d" opacity="0.5" transform="rotate(-40 115 145)"/>
      <ellipse cx="135" cy="190" rx="15" ry="7" fill="#2c5282" opacity="0.6" transform="rotate(-45 135 190)"/>
      <ellipse cx="155" cy="235" rx="16" ry="7" fill="#1e3a5f" opacity="0.5" transform="rotate(-50 155 235)"/>
      
      {/* Rosa/Peonía grande principal */}
      <g transform="translate(35, 35)">
        {/* Pétalos exteriores */}
        <ellipse cx="-15" cy="5" rx="14" ry="10" fill="#c3dafe" opacity="0.9" transform="rotate(-20 -15 5)"/>
        <ellipse cx="15" cy="5" rx="14" ry="10" fill="#a3bffa" opacity="0.9" transform="rotate(20 15 5)"/>
        <ellipse cx="-10" cy="-12" rx="12" ry="9" fill="#c3dafe" opacity="0.85" transform="rotate(-40 -10 -12)"/>
        <ellipse cx="10" cy="-12" rx="12" ry="9" fill="#a3bffa" opacity="0.85" transform="rotate(40 10 -12)"/>
        <ellipse cx="0" cy="15" rx="13" ry="9" fill="#c3dafe" opacity="0.9"/>
        {/* Pétalos medios */}
        <ellipse cx="-8" cy="2" rx="10" ry="7" fill="#7f9cf5" opacity="0.9" transform="rotate(-15 -8 2)"/>
        <ellipse cx="8" cy="2" rx="10" ry="7" fill="#667eea" opacity="0.9" transform="rotate(15 8 2)"/>
        <ellipse cx="0" cy="-8" rx="9" ry="6" fill="#7f9cf5" opacity="0.85"/>
        <ellipse cx="0" cy="10" rx="9" ry="6" fill="#667eea" opacity="0.9"/>
        {/* Centro */}
        <circle cx="0" cy="0" r="8" fill="#5a67d8" opacity="0.9"/>
        <circle cx="0" cy="0" r="5" fill="#4c51bf" opacity="0.9"/>
        <circle cx="0" cy="0" r="2.5" fill="#1a365d"/>
      </g>
      
      {/* Rosa mediana */}
      <g transform="translate(110, 90)">
        <ellipse cx="-10" cy="3" rx="11" ry="8" fill="#c3dafe" opacity="0.9" transform="rotate(-25 -10 3)"/>
        <ellipse cx="10" cy="3" rx="11" ry="8" fill="#a3bffa" opacity="0.9" transform="rotate(25 10 3)"/>
        <ellipse cx="0" cy="-10" rx="10" ry="7" fill="#c3dafe" opacity="0.85"/>
        <ellipse cx="0" cy="12" rx="10" ry="7" fill="#a3bffa" opacity="0.9"/>
        <ellipse cx="-5" cy="0" rx="7" ry="5" fill="#7f9cf5" opacity="0.9"/>
        <ellipse cx="5" cy="0" rx="7" ry="5" fill="#667eea" opacity="0.9"/>
        <circle cx="0" cy="0" r="6" fill="#5a67d8" opacity="0.9"/>
        <circle cx="0" cy="0" r="3.5" fill="#1e3a5f"/>
      </g>
      
      {/* Rosa pequeña 1 */}
      <g transform="translate(55, 140)">
        <ellipse cx="-6" cy="2" rx="8" ry="6" fill="#c3dafe" opacity="0.9" transform="rotate(-20 -6 2)"/>
        <ellipse cx="6" cy="2" rx="8" ry="6" fill="#a3bffa" opacity="0.9" transform="rotate(20 6 2)"/>
        <ellipse cx="0" cy="-6" rx="7" ry="5" fill="#c3dafe" opacity="0.85"/>
        <circle cx="0" cy="0" r="5" fill="#7f9cf5" opacity="0.9"/>
        <circle cx="0" cy="0" r="3" fill="#2c5282"/>
      </g>
      
      {/* Rosa pequeña 2 */}
      <g transform="translate(140, 170)">
        <ellipse cx="-5" cy="2" rx="7" ry="5" fill="#c3dafe" opacity="0.9" transform="rotate(-15 -5 2)"/>
        <ellipse cx="5" cy="2" rx="7" ry="5" fill="#a3bffa" opacity="0.9" transform="rotate(15 5 2)"/>
        <circle cx="0" cy="0" r="5" fill="#7f9cf5" opacity="0.9"/>
        <circle cx="0" cy="0" r="2.5" fill="#1e3a5f"/>
      </g>
      
      {/* Rosa pequeña 3 */}
      <g transform="translate(95, 220)">
        <ellipse cx="-5" cy="2" rx="7" ry="5" fill="#c3dafe" opacity="0.9" transform="rotate(-20 -5 2)"/>
        <ellipse cx="5" cy="2" rx="7" ry="5" fill="#a3bffa" opacity="0.9" transform="rotate(20 5 2)"/>
        <circle cx="0" cy="0" r="4" fill="#7f9cf5" opacity="0.9"/>
        <circle cx="0" cy="0" r="2" fill="#1a365d"/>
      </g>
      
      {/* Flores muy pequeñas / capullos */}
      <g transform="translate(25, 100)">
        <circle cx="0" cy="0" r="6" fill="#c3dafe" opacity="0.8"/>
        <circle cx="0" cy="0" r="3" fill="#5a67d8"/>
      </g>
      <g transform="translate(150, 130)">
        <circle cx="0" cy="0" r="5" fill="#c3dafe" opacity="0.8"/>
        <circle cx="0" cy="0" r="2.5" fill="#2c5282"/>
      </g>
      <g transform="translate(70, 190)">
        <circle cx="0" cy="0" r="5" fill="#c3dafe" opacity="0.8"/>
        <circle cx="0" cy="0" r="2.5" fill="#1e3a5f"/>
      </g>
      <g transform="translate(165, 210)">
        <circle cx="0" cy="0" r="4" fill="#c3dafe" opacity="0.8"/>
        <circle cx="0" cy="0" r="2" fill="#1a365d"/>
      </g>
      <g transform="translate(120, 260)">
        <circle cx="0" cy="0" r="5" fill="#c3dafe" opacity="0.8"/>
        <circle cx="0" cy="0" r="2.5" fill="#2c5282"/>
      </g>
      
      {/* Bayas / detalles */}
      <circle cx="40" cy="60" r="3" fill="#1a365d" opacity="0.7"/>
      <circle cx="95" cy="75" r="2.5" fill="#1e3a5f" opacity="0.6"/>
      <circle cx="65" cy="105" r="2" fill="#1a365d" opacity="0.7"/>
      <circle cx="125" cy="115" r="3" fill="#2c5282" opacity="0.6"/>
      <circle cx="45" cy="150" r="2.5" fill="#1e3a5f" opacity="0.7"/>
      <circle cx="110" cy="160" r="2" fill="#1a365d" opacity="0.6"/>
      <circle cx="80" cy="180" r="2.5" fill="#2c5282" opacity="0.7"/>
      <circle cx="150" cy="195" r="2" fill="#1e3a5f" opacity="0.6"/>
      <circle cx="105" cy="235" r="2.5" fill="#1a365d" opacity="0.7"/>
      <circle cx="145" cy="255" r="2" fill="#2c5282" opacity="0.6"/>
      
      {/* Hojas pequeñas adicionales */}
      <ellipse cx="30" cy="85" rx="8" ry="4" fill="#1e3a5f" opacity="0.4" transform="rotate(30 30 85)"/>
      <ellipse cx="130" cy="105" rx="7" ry="3" fill="#2c5282" opacity="0.4" transform="rotate(-25 130 105)"/>
      <ellipse cx="50" cy="175" rx="8" ry="4" fill="#1a365d" opacity="0.4" transform="rotate(40 50 175)"/>
      <ellipse cx="160" cy="180" rx="7" ry="3" fill="#1e3a5f" opacity="0.4" transform="rotate(-30 160 180)"/>
      <ellipse cx="75" cy="240" rx="8" ry="4" fill="#2c5282" opacity="0.4" transform="rotate(50 75 240)"/>
    </svg>
  );
}
