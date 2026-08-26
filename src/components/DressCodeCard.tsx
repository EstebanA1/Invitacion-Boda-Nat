import React from "react";
import { Sparkles } from "lucide-react";

export default function DressCodeCard() {
  return (
    <section className="relative w-full py-10 px-4 bg-[#f8f6f2] flex items-center justify-center">
      <div 
        className="relative w-full max-w-[360px] sm:max-w-[420px] rounded-2xl bg-[#fdfcf9] border border-[#ece3d5] p-6 sm:p-8 text-center shadow-lg transform hover:scale-[1.01] transition-transform duration-300"
        style={{
          boxShadow: "0 10px 30px -10px rgba(50, 70, 90, 0.12)"
        }}
      >
        {/* Filigree Corner Accents */}
        <div className="absolute top-2.5 left-2.5 text-[#baa894] opacity-50">
          <svg width="18" height="18" viewBox="0 0 40 40" fill="none" stroke="currentColor" strokeWidth="1">
            <path d="M4,4 Q18,4 18,18" />
            <path d="M4,4 Q4,18 18,18" />
          </svg>
        </div>
        <div className="absolute top-2.5 right-2.5 text-[#baa894] opacity-50">
          <svg width="18" height="18" viewBox="0 0 40 40" fill="none" stroke="currentColor" strokeWidth="1">
            <path d="M36,4 Q22,4 22,18" />
            <path d="M36,4 Q36,18 22,18" />
          </svg>
        </div>
        <div className="absolute bottom-2.5 left-2.5 text-[#baa894] opacity-50">
          <svg width="18" height="18" viewBox="0 0 40 40" fill="none" stroke="currentColor" strokeWidth="1">
            <path d="M4,36 Q18,36 18,22" />
            <path d="M4,36 Q4,22 18,22" />
          </svg>
        </div>
        <div className="absolute bottom-2.5 right-2.5 text-[#baa894] opacity-50">
          <svg width="18" height="18" viewBox="0 0 40 40" fill="none" stroke="currentColor" strokeWidth="1">
            <path d="M36,36 Q22,36 22,22" />
            <path d="M36,36 Q36,22 22,22" />
          </svg>
        </div>

        <div className="w-10 h-10 rounded-full bg-[#f4ede2] text-[#8e7660] flex items-center justify-center mx-auto mb-3 border border-[#dfd4c5]">
          <Sparkles className="w-4 h-4" />
        </div>

        <h3 
          className="text-3xl text-[#78614e] font-normal mb-1"
          style={{ fontFamily: '"Pinyon Script", "Alex Brush", cursive' }}
        >
          Código de Vestimenta
        </h3>

        <p className="text-[11px] uppercase tracking-[0.2em] font-semibold text-[#8a725e] mb-3 font-serif">
          Formal / Elegante
        </p>

        <div className="w-10 h-px bg-[#d9cdbf] mx-auto mb-3"></div>

        <p className="text-xs sm:text-sm text-[#7a6452] max-w-xs mx-auto leading-relaxed font-serif">
          Te invitamos a vestir de gala para compartir juntos una noche inolvidable.
          <span className="block mt-2 text-[11px] font-sans text-[#96806e]">
            * Se reserva el color blanco y marfil exclusivamente para la novia.
          </span>
        </p>
      </div>
    </section>
  );
}
