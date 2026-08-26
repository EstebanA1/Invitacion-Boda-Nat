import React from "react";
// @ts-ignore
import imageBoda from "../../assets/image_boda.png";
// @ts-ignore
import portadaImage from "../../assets/portada_boda.png";

export default function OvalCoupleBlessing() {
  return (
    <section className="relative w-full py-12 sm:py-20 px-4 flex flex-col items-center justify-center bg-[#90a2b2] text-white overflow-hidden shadow-inner">
      
      {/* Background Soft Texture Gradient */}
      <div 
        className="absolute inset-0 pointer-events-none opacity-40"
        style={{
          background: "radial-gradient(circle at 50% 35%, rgba(255,255,255,0.25) 0%, rgba(120,140,158,0) 70%)"
        }}
      ></div>

      <div className="relative z-10 max-w-sm sm:max-w-md w-full mx-auto text-center flex flex-col items-center">
        
        {/* Oval Picture Frame with Beaded Pearl Relief Effect */}
        <div className="relative w-64 sm:w-72 md:w-80 aspect-[3/4] mx-auto p-4 sm:p-5 flex items-center justify-center">
          
          {/* Outer Oval Beaded Pearl Ring */}
          <div 
            className="absolute inset-0 rounded-[50%] bg-[#b8c7d4] border-4 border-[#e9eff5] shadow-2xl flex items-center justify-center"
            style={{
              boxShadow: "0 15px 35px rgba(45, 60, 75, 0.35), inset 0 2px 5px rgba(255,255,255,0.6)"
            }}
          >
            {/* Beaded Pearls Along the Ring */}
            <div className="absolute inset-1.5 sm:inset-2 rounded-[50%] border-2 border-dotted border-white/80 pointer-events-none"></div>
            <div className="absolute inset-3 sm:inset-3.5 rounded-[50%] border border-[#a2b4c4] pointer-events-none"></div>
          </div>

          {/* Inner Picture Container with Perfect Oval Mask */}
          <div className="relative w-full h-full rounded-[50%] overflow-hidden bg-[#788d9f] border-4 border-white shadow-inner">
            <img
              src={imageBoda}
              alt="Natalia y Gabriel"
              className="w-full h-full object-cover object-center transform hover:scale-105 transition-transform duration-700"
              referrerPolicy="no-referrer"
              onError={(e) => {
                const img = e.currentTarget;
                const srcList = [
                  "image_boda.png",
                  "portada_boda.png",
                  "portada_boda.jpg",
                  "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&q=80&w=800"
                ];
                const currentUrl = img.src;
                let found = false;
                for (let i = 0; i < srcList.length; i++) {
                  if (currentUrl.endsWith(srcList[i])) {
                    if (i + 1 < srcList.length) {
                      img.src = srcList[i + 1];
                    } else {
                      img.onerror = null;
                    }
                    found = true;
                    break;
                  }
                }
                if (!found) {
                  img.src = srcList[0];
                }
              }}
            />
            {/* Subtle Vignette */}
            <div className="absolute inset-0 rounded-[50%] pointer-events-none bg-radial from-transparent via-transparent to-black/20"></div>
          </div>
        </div>

        {/* Text Below the Oval Frame */}
        <div className="mt-8 sm:mt-10 px-4 space-y-2">
          <p 
            className="text-sm sm:text-base tracking-[0.2em] font-normal uppercase text-[#fdfcf9] opacity-95"
            style={{ fontFamily: '"Cormorant Garamond", "Cinzel", serif' }}
          >
            CON LA BENDICIÓN DE DIOS Y
          </p>
          <p 
            className="text-sm sm:text-base tracking-[0.2em] font-normal uppercase text-[#fdfcf9] opacity-95"
            style={{ fontFamily: '"Cormorant Garamond", "Cinzel", serif' }}
          >
            EN COMPAÑÍA DE:
          </p>
          
          {/* Parents & Blessing details */}
          <div className="pt-2 text-xs sm:text-sm text-[#e6eef5] opacity-90 italic font-light space-y-1" style={{ fontFamily: '"Cormorant Garamond", serif' }}>
            <p>Nuestros queridos Padres y Padrinos</p>
            <p className="text-[11px] sm:text-xs opacity-75 font-sans not-italic uppercase tracking-widest pt-1">
              Y la alegría de compartir este momento con todos ustedes
            </p>
          </div>

          {/* Ornamental Divider Flourish (from Reference Image 2) */}
          <div className="pt-4 flex items-center justify-center opacity-85">
            <svg width="140" height="20" viewBox="0 0 200 30" fill="none" className="text-white">
              <path d="M10,15 L70,15" stroke="currentColor" strokeWidth="0.75" />
              <path d="M130,15 L190,15" stroke="currentColor" strokeWidth="0.75" />
              {/* Central filigree */}
              <path d="M85,15 C95,5 98,25 100,15 C102,5 105,25 115,15" stroke="currentColor" strokeWidth="1" />
              <path d="M100,5 C97,12 97,18 100,25 C103,18 103,12 100,5 Z" fill="currentColor" opacity="0.6" />
              <circle cx="75" cy="15" r="2" fill="currentColor" />
              <circle cx="125" cy="15" r="2" fill="currentColor" />
            </svg>
          </div>
        </div>

      </div>
    </section>
  );
}
