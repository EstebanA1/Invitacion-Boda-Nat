import React from "react";
import { MapPin, Navigation } from "lucide-react";

export default function LocationCards() {
  return (
    <section id="locations-section" className="relative w-full py-14 sm:py-20 px-4 bg-[#8ea1b0] text-[#333] overflow-hidden scroll-mt-8">
      
      {/* Background Soft Glow */}
      <div 
        className="absolute inset-0 pointer-events-none opacity-20"
        style={{
          background: "radial-gradient(circle at 80% 50%, rgba(255,255,255,0.4) 0%, transparent 60%)"
        }}
      ></div>

      {/* Main Container */}
      <div className="relative z-10 max-w-sm sm:max-w-md w-full mx-auto space-y-8">
        
        {/* Card 1: Ceremonia */}
        <div className="relative w-full rounded-2xl bg-[#fdfcf9] p-6 sm:p-8 shadow-xl border border-[#ece4d8] text-center transform hover:scale-[1.01] transition-transform duration-300">
          
          {/* Filigree Corner Accents */}
          <div className="absolute top-2.5 left-2.5 text-[#baa894] opacity-60">
            <svg width="18" height="18" viewBox="0 0 40 40" fill="none" stroke="currentColor" strokeWidth="1.2">
              <path d="M4,4 Q18,4 18,18" />
              <path d="M4,4 Q4,18 18,18" />
            </svg>
          </div>
          <div className="absolute top-2.5 right-2.5 text-[#baa894] opacity-60">
            <svg width="18" height="18" viewBox="0 0 40 40" fill="none" stroke="currentColor" strokeWidth="1.2">
              <path d="M36,4 Q22,4 22,18" />
              <path d="M36,4 Q36,18 22,18" />
            </svg>
          </div>
          <div className="absolute bottom-2.5 left-2.5 text-[#baa894] opacity-60">
            <svg width="18" height="18" viewBox="0 0 40 40" fill="none" stroke="currentColor" strokeWidth="1.2">
              <path d="M4,36 Q18,36 18,22" />
              <path d="M4,36 Q4,22 18,22" />
            </svg>
          </div>
          <div className="absolute bottom-2.5 right-2.5 text-[#baa894] opacity-60">
            <svg width="18" height="18" viewBox="0 0 40 40" fill="none" stroke="currentColor" strokeWidth="1.2">
              <path d="M36,36 Q22,36 22,22" />
              <path d="M36,36 Q36,22 22,22" />
            </svg>
          </div>

          <h3 
            className="text-4xl text-[#78614e] font-normal mb-2"
            style={{ fontFamily: '"Pinyon Script", "Alex Brush", cursive' }}
          >
            Ceremonia
          </h3>

          <p className="text-xs font-semibold text-[#8a725e] uppercase tracking-wider mb-1 font-serif">
            Hora: 14:30 pm
          </p>

          <p className="text-sm sm:text-base font-medium text-[#5c4a3b] font-serif">
            “IEP Coronel Tropezón 284”
          </p>
          <p className="text-xs text-[#8c7a6b] font-sans mb-6">
            Yobilo 1, Coronel
          </p>

          {/* Ver Ubicacion Pill Button */}
          <a
            href="https://www.google.com/maps/search/?api=1&query=IEP+Coronel+tropezon+284+Yobilo+1"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 px-6 py-2 rounded-full border border-[#cfbeab] bg-[#fbf9f4] hover:bg-[#eee5d8] text-[#78614e] text-xs font-medium tracking-wider transition-colors shadow-2xs select-none"
          >
            <MapPin className="w-3.5 h-3.5 text-[#8a725e]" />
            Ver ubicación
          </a>
        </div>

        {/* Card 2: Recepción */}
        <div className="relative w-full rounded-2xl bg-[#fdfcf9] p-6 sm:p-8 shadow-xl border border-[#ece4d8] text-center transform hover:scale-[1.01] transition-transform duration-300">
          
          {/* Filigree Corner Accents */}
          <div className="absolute top-2.5 left-2.5 text-[#baa894] opacity-60">
            <svg width="18" height="18" viewBox="0 0 40 40" fill="none" stroke="currentColor" strokeWidth="1.2">
              <path d="M4,4 Q18,4 18,18" />
              <path d="M4,4 Q4,18 18,18" />
            </svg>
          </div>
          <div className="absolute top-2.5 right-2.5 text-[#baa894] opacity-60">
            <svg width="18" height="18" viewBox="0 0 40 40" fill="none" stroke="currentColor" strokeWidth="1.2">
              <path d="M36,4 Q22,4 22,18" />
              <path d="M36,4 Q36,18 22,18" />
            </svg>
          </div>
          <div className="absolute bottom-2.5 left-2.5 text-[#baa894] opacity-60">
            <svg width="18" height="18" viewBox="0 0 40 40" fill="none" stroke="currentColor" strokeWidth="1.2">
              <path d="M4,36 Q18,36 18,22" />
              <path d="M4,36 Q4,22 18,22" />
            </svg>
          </div>
          <div className="absolute bottom-2.5 right-2.5 text-[#baa894] opacity-60">
            <svg width="18" height="18" viewBox="0 0 40 40" fill="none" stroke="currentColor" strokeWidth="1.2">
              <path d="M36,36 Q22,36 22,22" />
              <path d="M36,36 Q36,22 22,22" />
            </svg>
          </div>

          <h3 
            className="text-4xl text-[#78614e] font-normal mb-2"
            style={{ fontFamily: '"Pinyon Script", "Alex Brush", cursive' }}
          >
            Recepción
          </h3>

          <p className="text-xs font-semibold text-[#8a725e] uppercase tracking-wider mb-1 font-serif">
            Hora: 16:30 pm
          </p>

          <p className="text-sm sm:text-base font-medium text-[#5c4a3b] font-serif">
            “Verde Ocaso Lounge”
          </p>
          <p className="text-xs text-[#8c7a6b] font-sans mb-6">
            Coronel
          </p>

          {/* Ver Ubicacion Pill Button */}
          <a
            href="https://www.google.com/maps/search/?api=1&query=Verde+ocaso+lounge"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 px-6 py-2 rounded-full border border-[#cfbeab] bg-[#fbf9f4] hover:bg-[#eee5d8] text-[#78614e] text-xs font-medium tracking-wider transition-colors shadow-2xs select-none"
          >
            <Navigation className="w-3.5 h-3.5 text-[#8a725e]" />
            Ver ubicación
          </a>
        </div>

      </div>

      {/* Floating White Calla Lilies on Right Side */}
      <div className="absolute right-0 top-1/2 -translate-y-1/2 w-28 sm:w-36 pointer-events-none opacity-90 z-20">
        <svg viewBox="0 0 120 240" fill="none" className="w-full h-auto drop-shadow-xl">
          <g transform="translate(10, 20)">
            <path d="M40,60 Q35,140 25,220" stroke="#7a8c78" strokeWidth="3" fill="none" />
            <path d="M40,60 C20,35 15,15 35,5 C55,-5 65,15 58,35 C52,50 48,55 40,60 Z" fill="#ffffff" stroke="#e0e8e0" strokeWidth="0.8" />
            <path d="M38,45 L42,25" stroke="#e8c872" strokeWidth="2.5" strokeLinecap="round" />
          </g>
          <g transform="translate(45, 90)">
            <path d="M40,60 Q38,120 30,180" stroke="#7a8c78" strokeWidth="2.5" fill="none" />
            <path d="M40,60 C25,40 18,20 35,8 C50,0 60,18 52,38 C48,50 45,55 40,60 Z" fill="#ffffff" stroke="#e0e8e0" strokeWidth="0.8" />
            <path d="M38,45 L42,28" stroke="#ebd69a" strokeWidth="2.5" strokeLinecap="round" />
          </g>
        </svg>
      </div>

    </section>
  );
}
