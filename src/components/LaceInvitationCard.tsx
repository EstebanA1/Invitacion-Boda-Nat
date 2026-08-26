import React, { useState } from "react";

// @ts-ignore
import portadaPng from "../../assets/portada_boda.png";

export default function LaceInvitationCard() {
  const [imageError, setImageError] = useState(false);

  return (
    <section className="relative w-full min-h-[95vh] sm:min-h-screen py-10 sm:py-16 px-4 flex flex-col items-center justify-center bg-[#f7f5f0] overflow-hidden">
      
      {/* Soft Satin Silk Ambient Glow */}
      <div 
        className="absolute inset-0 pointer-events-none opacity-40"
        style={{
          background: "radial-gradient(ellipse at 50% 30%, rgba(255,255,255,0.9) 0%, rgba(238,233,224,0.4) 60%, rgba(215,205,195,0.7) 100%)"
        }}
      ></div>

      {/* Top Right Hanging Dried Florals / Gypsophila */}
      <div className="absolute top-0 right-3 sm:right-10 w-16 sm:w-24 pointer-events-none z-20 opacity-85">
        <svg viewBox="0 0 100 260" fill="none" className="w-full h-auto drop-shadow-sm">
          {/* Stems */}
          <path d="M75,0 Q70,70 58,150 Q50,200 55,260" stroke="#baa68f" strokeWidth="1.2" />
          <path d="M90,0 Q82,50 78,110 Q68,165 72,220" stroke="#baa68f" strokeWidth="1" />
          <path d="M60,0 Q54,45 42,90 Q36,145 40,190" stroke="#baa68f" strokeWidth="0.8" />
          
          {/* Delicate buds */}
          {[
            [72, 25], [78, 40], [66, 52], [60, 68], [76, 80], [84, 95], [54, 102],
            [68, 120], [80, 130], [50, 140], [60, 160], [72, 175], [46, 180], [58, 200],
            [54, 220], [56, 245], [82, 48], [88, 65], [74, 110], [70, 150], [40, 75], [44, 115]
          ].map(([cx, cy], i) => (
            <g key={i}>
              <circle cx={cx} cy={cy} r="3" fill="#d9cdbe" opacity="0.95" />
              <circle cx={cx + 1} cy={cy - 1} r="1.5" fill="#ffffff" />
            </g>
          ))}
        </svg>
      </div>

      {/* Mobile Card Container */}
      <div 
        className="relative z-10 w-full max-w-[340px] sm:max-w-[390px] mx-auto select-none transition-transform duration-500 hover:scale-[1.01]"
        style={{
          filter: "drop-shadow(0 20px 35px rgba(100, 85, 70, 0.18)) drop-shadow(0 4px 10px rgba(0,0,0,0.06))",
        }}
      >
        {/* Frame Structure with Overlay Content */}
        <div className="relative w-full aspect-[2/3.05] flex items-center justify-center">
          
          {/* 1. Base Scalloped Lace Frame Image with multi-path fallbacks */}
          {!imageError ? (
            <img
              src="recuadro.png"
              alt="Marco de Encaje Calado"
              className="absolute inset-0 w-full h-full object-contain pointer-events-none select-none"
              onError={(e) => {
                const target = e.currentTarget;
                const srcList = [
                  "recuadro.png",
                  "recuadro.jpg",
                  "lace_frame.png",
                  "ChatGPT Image 24 ago 2026, 05_41_59 p.m..png",
                  "portada_boda.png",
                  portadaPng
                ];
                const currentSrc = target.src;
                let nextIndex = -1;
                for (let i = 0; i < srcList.length; i++) {
                  if (currentSrc.endsWith(srcList[i]) || currentSrc === srcList[i]) {
                    nextIndex = i + 1;
                    break;
                  }
                }
                if (nextIndex !== -1 && nextIndex < srcList.length) {
                  target.src = srcList[nextIndex];
                } else if (nextIndex === -1 && srcList.length > 0) {
                  target.src = srcList[0];
                } else {
                  setImageError(true);
                }
              }}
            />
          ) : null}

          {/* High-Fidelity SVG Lace Frame Fallback (Identical to reference image with scalloped crochet borders) */}
          {imageError && (
            <div className="absolute inset-0 w-full h-full rounded-[28px] p-4 bg-[#fbf9f4] border border-[#e2d8ca] shadow-inner">
              <div className="w-full h-full rounded-[20px] bg-[#fbf9f5] border border-[#ece4d6] shadow-sm flex items-center justify-center">
                {/* Lace Scallop Simulation Border */}
                <div className="absolute inset-2 rounded-[22px] border-2 border-dashed border-[#ded4c5] pointer-events-none opacity-60"></div>
              </div>
            </div>
          )}

          {/* 2. Text Overlaid directly on the center of the frame (Mobile-First Typography) */}
          <div className="absolute inset-0 flex flex-col justify-between items-center text-center px-8 py-14 sm:px-10 sm:py-16 pointer-events-auto">
            
            {/* Couple Names */}
            <div className="w-full mt-2 sm:mt-4 space-y-0.5">
              <h1 
                className="text-5xl sm:text-6xl text-[#78614e] font-normal tracking-wide leading-none"
                style={{ 
                  fontFamily: '"Parisienne", "Pinyon Script", "Great Vibes", cursive',
                  textShadow: "0 1px 1px rgba(255,255,255,0.8)"
                }}
              >
                Natalia
              </h1>

              <div className="py-1">
                <span 
                  className="text-2xl sm:text-3xl text-[#9c8470] italic block leading-none"
                  style={{ fontFamily: '"Italianno", "Pinyon Script", cursive' }}
                >
                  &
                </span>
              </div>

              <h1 
                className="text-5xl sm:text-6xl text-[#78614e] font-normal tracking-wide leading-none"
                style={{ 
                  fontFamily: '"Parisienne", "Pinyon Script", "Great Vibes", cursive',
                  textShadow: "0 1px 1px rgba(255,255,255,0.8)"
                }}
              >
                Gabriel
              </h1>
            </div>

            {/* Wedding Date */}
            <div className="my-auto py-2">
              <p 
                className="text-2xl sm:text-3xl text-[#78614e] tracking-[0.25em] font-normal"
                style={{ fontFamily: '"Cormorant Garamond", serif' }}
              >
                28 . 11 . 26
              </p>
            </div>

            {/* Romantic Dedication Paragraph */}
            <div className="w-full max-w-[230px] sm:max-w-[250px] mb-2 sm:mb-4 text-[#856f5c]">
              <p 
                className="text-xs sm:text-[13px] leading-relaxed font-normal"
                style={{ fontFamily: '"Cormorant Garamond", serif' }}
              >
                Dos almas, un mismo destino. Acompáñennos a celebrar el día más importante de nuestras vidas.
              </p>
            </div>

          </div>

        </div>

      </div>

      {/* Mobile Scroll Indicator */}
      <div className="mt-6 text-center opacity-60 flex flex-col items-center">
        <span className="text-[10px] uppercase tracking-[0.25em] text-[#96806e] font-medium">
          Desliza para continuar
        </span>
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#96806e" strokeWidth="1.5" className="mt-1 animate-bounce">
          <path d="M6 9l6 6 6-6" />
        </svg>
      </div>

    </section>
  );
}
