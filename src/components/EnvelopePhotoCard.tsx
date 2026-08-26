import React from "react";
// @ts-ignore
import imageBoda from "../../assets/image_boda.png";
// @ts-ignore
import portadaImage from "../../assets/portada_boda.png";

export default function EnvelopePhotoCard() {
  return (
    <section className="relative w-full py-12 sm:py-16 px-4 bg-[#fbf9f4] flex items-center justify-center overflow-hidden">
      
      {/* Container */}
      <div className="relative w-full max-w-[370px] sm:max-w-[440px] mx-auto">
        
        {/* Soft Drop Shadow under the entire envelope bundle */}
        <div className="relative w-full">
          
          {/* Back Envelope Flap (Pointed Open Flap with Lace Trim) */}
          <div className="relative w-full flex justify-center -mb-28 sm:-mb-32 z-0">
            <svg viewBox="0 0 400 200" className="w-full h-auto drop-shadow-md">
              <defs>
                <linearGradient id="envelopeInnerGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="#e9edf2" />
                  <stop offset="100%" stopColor="#c5d4e0" />
                </linearGradient>
              </defs>
              {/* Lace trim along triangle flap */}
              <polygon points="0,200 200,20 400,200" fill="#a4b8c7" />
              <polygon points="12,196 200,32 388,196" fill="url(#envelopeInnerGrad)" />
              {/* Delicate lace scallops */}
              <path 
                d="M10,195 L200,28 L390,195" 
                stroke="#ffffff" 
                strokeWidth="2.5" 
                strokeDasharray="4 4" 
                fill="none" 
              />
            </svg>
          </div>

          {/* Picture Card Inside Envelope (Polaroid with White Border) */}
          <div className="relative z-10 mx-auto w-[82%] bg-white p-3 sm:p-4 rounded-md shadow-lg border border-[#e4dcce] transform -rotate-1 hover:rotate-0 transition-transform duration-300">
            
            {/* Top Left Pearl Bow Ornament */}
            <div className="absolute -top-3 -left-3 z-30 pointer-events-none">
              <svg width="42" height="42" viewBox="0 0 100 100" fill="none">
                {/* Pearl Ribbon Bow */}
                <g stroke="#ffffff" strokeWidth="4" strokeLinecap="round" strokeDasharray="1 8">
                  <path d="M50,45 C35,20 15,25 25,45 C35,55 50,45 50,45 Z" fill="#f8fafc" stroke="#d5e0ea" strokeWidth="2" />
                  <path d="M50,45 C65,20 85,25 75,45 C65,55 50,45 50,45 Z" fill="#f8fafc" stroke="#d5e0ea" strokeWidth="2" />
                  <path d="M50,48 Q35,75 25,90" stroke="#d5e0ea" strokeWidth="2" />
                  <path d="M50,48 Q60,75 70,95" stroke="#d5e0ea" strokeWidth="2" />
                </g>
                <circle cx="50" cy="45" r="6" fill="#ffffff" stroke="#c0d0dc" strokeWidth="1.5" />
              </svg>
            </div>

            {/* Photo Inside */}
            <div className="w-full aspect-[4/3] overflow-hidden bg-[#eef3f7] rounded-xs border border-[#eee]">
              <img
                src={imageBoda}
                alt="Natalia y Gabriel"
                className="w-full h-full object-cover object-center transform hover:scale-105 transition-transform duration-500"
                referrerPolicy="no-referrer"
                onError={(e) => {
                  const img = e.currentTarget;
                  const srcList = [
                    "image_boda.png",
                    "portada_boda.png",
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
            </div>
            
            {/* Polaroid caption / subtle date */}
            <div className="pt-2 text-center">
              <span className="font-script text-xl sm:text-2xl text-[#826e5a]" style={{ fontFamily: '"Pinyon Script", cursive' }}>
                Natalia & Gabriel
              </span>
            </div>
          </div>

          {/* Front Envelope Pocket (Dusty Slate Blue with V-Cut) */}
          <div className="relative -mt-16 sm:-mt-20 z-20">
            <div 
              className="w-full h-44 sm:h-52 rounded-b-2xl bg-[#98acbd] border-t-2 border-[#8ba0b2] shadow-2xl relative overflow-hidden"
              style={{
                background: "linear-gradient(180deg, #a2b5c5 0%, #8ea2b3 100%)",
                boxShadow: "0 15px 35px -5px rgba(50, 70, 90, 0.35)"
              }}
            >
              {/* Diagonal Envelope Folds */}
              <svg viewBox="0 0 400 200" className="absolute inset-0 w-full h-full pointer-events-none opacity-30" preserveAspectRatio="none">
                <line x1="0" y1="200" x2="200" y2="70" stroke="#ffffff" strokeWidth="2" />
                <line x1="400" y1="200" x2="200" y2="70" stroke="#ffffff" strokeWidth="2" />
                <polygon points="0,0 200,85 400,0 400,20 200,105 0,20" fill="#7d93a5" opacity="0.4" />
              </svg>

              {/* Heart Wax Seal in the Center */}
              <div className="absolute top-1 left-1/2 -translate-x-1/2 -translate-y-1/2 z-30">
                <div 
                  className="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-[#fdfcf9] border-2 border-[#eee6d8] flex items-center justify-center cursor-pointer transform hover:scale-105 transition-transform select-none"
                  style={{
                    boxShadow: "0 6px 16px rgba(40,55,70,0.3), inset 0 2px 4px rgba(255,255,255,0.9), inset 0 -2px 4px rgba(160,140,120,0.25)"
                  }}
                >
                  {/* Embossed Heart Monogram */}
                  <div className="text-center">
                    <span 
                      className="text-[#96806c] text-xs sm:text-sm font-semibold tracking-wider block"
                      style={{ fontFamily: '"Cinzel", serif' }}
                    >
                      N ♥ G
                    </span>
                  </div>
                </div>
              </div>

            </div>

            {/* Floral Bouquet Right Side (Calla Lilies & Dusty Blue Anthuriums) */}
            <div className="absolute -right-4 sm:-right-8 -top-24 sm:-top-32 w-28 sm:w-36 z-30 pointer-events-none">
              <svg viewBox="0 0 160 260" fill="none" className="w-full h-auto drop-shadow-xl">
                {/* White Calla Lilies */}
                <g transform="translate(40, 10)">
                  {/* Stem */}
                  <path d="M50,70 Q45,150 40,220" stroke="#7a8c78" strokeWidth="3.5" fill="none" />
                  {/* Calla Lily Petal */}
                  <path d="M50,70 C30,40 20,20 40,5 C60,-5 75,20 65,45 C60,60 55,65 50,70 Z" fill="#ffffff" stroke="#e0e8e0" strokeWidth="1" />
                  {/* Yellow Spadix */}
                  <path d="M48,50 L52,25" stroke="#e8c872" strokeWidth="3" strokeLinecap="round" />
                </g>

                {/* Dusty Blue Anthuriums */}
                <g transform="translate(10, 80)">
                  <path d="M55,60 Q50,130 45,170" stroke="#7a8c78" strokeWidth="3" fill="none" />
                  {/* Heart spathe */}
                  <path d="M55,60 C25,45 10,20 35,5 C55,-5 75,5 75,30 C75,50 65,55 55,60 Z" fill="#8aa4b8" stroke="#a0b8cc" strokeWidth="1" />
                  <path d="M45,40 L60,15" stroke="#ebd69a" strokeWidth="3" strokeLinecap="round" />
                </g>

                {/* White Small Orchids */}
                <g transform="translate(50, 110)">
                  <circle cx="20" cy="20" r="10" fill="#ffffff" stroke="#e4e8ec" strokeWidth="0.8" />
                  <circle cx="20" cy="20" r="3" fill="#f0dca0" />
                  <circle cx="35" cy="35" r="9" fill="#ffffff" stroke="#e4e8ec" strokeWidth="0.8" />
                  <circle cx="35" cy="35" r="2.5" fill="#f0dca0" />
                </g>

                {/* Hanging White Pearl Vines */}
                <g stroke="#ffffff" strokeWidth="3" strokeDasharray="1 6" strokeLinecap="round" opacity="0.9">
                  <path d="M60,160 Q55,200 50,250" />
                  <path d="M70,160 Q75,210 70,260" />
                  <path d="M80,165 Q85,205 80,240" />
                </g>
              </svg>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
}
