import React, { useState, useEffect } from "react";
import { Church, GlassWater, Music, Utensils, Sparkles, Heart } from "lucide-react";

export default function ProgramTimelineCountdown() {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  useEffect(() => {
    // Target Date: November 28, 2026 at 14:30
    const targetDate = new Date("2026-11-28T14:30:00").getTime();

    const updateCountdown = () => {
      const now = new Date().getTime();
      const difference = targetDate - now;

      if (difference > 0) {
        const days = Math.floor(difference / (1000 * 60 * 60 * 24));
        const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((difference % (1000 * 60)) / 1000);

        setTimeLeft({ days, hours, minutes, seconds });
      } else {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
      }
    };

    updateCountdown();
    const interval = setInterval(updateCountdown, 1000);
    return () => clearInterval(interval);
  }, []);

  const timelineEvents = [
    {
      time: "14:30 hrs",
      title: "Ceremonia religiosa",
      subtitle: "Parroquia / IEP Coronel",
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" className="w-6 h-6">
          <path d="M12 2v4M10 4h4" strokeLinecap="round" />
          <path d="M12 6L4 12v9h16v-9L12 6z" />
          <path d="M10 21v-5a2 2 0 014 0v5" />
        </svg>
      ),
    },
    {
      time: "16:30 hrs",
      title: "Recepción y brindis",
      subtitle: "Bienvenida & Cóctel de honor",
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" className="w-6 h-6">
          <path d="M8 3l3 8h-6l3 -8" />
          <path d="M16 3l3 8h-6l3 -8" />
          <path d="M8 11v7M16 11v7" />
          <path d="M5 18h6M13 18h6" />
        </svg>
      ),
    },
    {
      time: "18:00 hrs",
      title: "Primer vals",
      subtitle: "Apertura de pista de baile",
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" className="w-6 h-6">
          <path d="M12 4a2 2 0 100-4 2 2 0 000 4z" />
          <path d="M9 22l3-7 3 7" />
          <path d="M6 10l6 3 6-3" />
          <path d="M12 7v8" />
        </svg>
      ),
    },
    {
      time: "19:00 hrs",
      title: "Cena y banquete",
      subtitle: "Plato principal & Postres",
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" className="w-6 h-6">
          <circle cx="12" cy="12" r="7" />
          <path d="M3 6v12M21 6v12M21 12h-3M3 10h3M3 14h3" strokeLinecap="round" />
        </svg>
      ),
    },
    {
      time: "02:30 hrs",
      title: "Fin de la celebración",
      subtitle: "Despedida de los novios",
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" className="w-6 h-6">
          <path d="M5 11l2-5h10l2 5M3 11h18v6h-2a2 2 0 01-4 0H9a2 2 0 01-4 0H3v-6z" />
          <circle cx="7" cy="17" r="1.5" />
          <circle cx="17" cy="17" r="1.5" />
        </svg>
      ),
    },
  ];

  return (
    <section className="relative w-full py-12 sm:py-20 px-4 bg-[#f8f6f2] flex flex-col items-center justify-center">
      
      {/* Container */}
      <div className="relative w-full max-w-[370px] sm:max-w-[440px] mx-auto">
        
        {/* Top Dusty Blue Envelope Flap with Heart Wax Seal holding the card */}
        <div className="relative z-0 flex justify-center -mb-8 sm:-mb-10">
          <div className="relative w-[92%] sm:w-[94%]">
            <svg viewBox="0 0 400 120" className="w-full h-auto drop-shadow-md">
              <polygon points="0,120 200,10 400,120" fill="#9ab0c2" />
              {/* Lace trim along flap */}
              <path d="M5,115 L200,16 L395,115" stroke="#ffffff" strokeWidth="2.5" strokeDasharray="3 3" fill="none" />
            </svg>

            {/* Heart Wax Seal clasping the top */}
            <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 z-30">
              <div 
                className="w-13 h-13 sm:w-14 sm:h-14 rounded-full bg-[#fdfcf9] border border-[#eee5d6] flex items-center justify-center select-none"
                style={{
                  boxShadow: "0 6px 14px rgba(45, 60, 75, 0.25), inset 0 2px 4px rgba(255,255,255,0.9)"
                }}
              >
                <span className="text-[#96806c] text-[11px] sm:text-xs font-semibold tracking-wider font-cinzel">
                  N ♥ G
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Ivory Deckle-Edged Timeline Card */}
        <div 
          className="relative z-10 w-full rounded-2xl bg-[#fdfcf9] border border-[#eee4d6] p-6 sm:p-8 pt-10 sm:pt-12 shadow-xl"
          style={{
            boxShadow: "0 15px 35px -10px rgba(50, 70, 90, 0.15), inset 0 0 15px rgba(220,205,185,0.1)"
          }}
        >
          {/* Ornate Corner Accents */}
          <div className="absolute top-3 left-3 text-[#baa894] opacity-70">
            <svg width="22" height="22" viewBox="0 0 40 40" fill="none" stroke="currentColor" strokeWidth="1">
              <path d="M5,5 Q20,5 20,20" />
              <path d="M5,5 Q5,20 20,20" />
            </svg>
          </div>
          <div className="absolute top-3 right-3 text-[#baa894] opacity-70">
            <svg width="22" height="22" viewBox="0 0 40 40" fill="none" stroke="currentColor" strokeWidth="1">
              <path d="M35,5 Q20,5 20,20" />
              <path d="M35,5 Q35,20 20,20" />
            </svg>
          </div>
          <div className="absolute bottom-3 left-3 text-[#baa894] opacity-70">
            <svg width="22" height="22" viewBox="0 0 40 40" fill="none" stroke="currentColor" strokeWidth="1">
              <path d="M5,35 Q20,35 20,20" />
              <path d="M5,35 Q5,20 20,20" />
            </svg>
          </div>
          <div className="absolute bottom-3 right-3 text-[#baa894] opacity-70">
            <svg width="22" height="22" viewBox="0 0 40 40" fill="none" stroke="currentColor" strokeWidth="1">
              <path d="M35,35 Q20,35 20,20" />
              <path d="M35,35 Q35,20 20,20" />
            </svg>
          </div>

          {/* Card Title */}
          <div className="text-center mb-8">
            <h2 
              className="text-4xl sm:text-5xl text-[#78614e] font-normal"
              style={{ fontFamily: '"Pinyon Script", "Alex Brush", cursive' }}
            >
              Programa
            </h2>
            <div className="w-10 h-px bg-[#d9cdbf] mx-auto mt-1"></div>
          </div>

          {/* Vertical Line Timeline with Icons & Text */}
          <div className="relative pl-2 sm:pl-4 space-y-6">
            
            {/* Continuous Vertical Line */}
            <div className="absolute left-[38px] sm:left-[42px] top-4 bottom-4 w-px bg-[#d5c7b5]"></div>

            {timelineEvents.map((item, index) => (
              <div key={index} className="relative flex items-start gap-4 group">
                
                {/* Icon Container with subtle badge */}
                <div className="relative z-10 w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-[#faf7f2] border border-[#dfd4c5] flex items-center justify-center text-[#8e7660] shadow-xs shrink-0 group-hover:scale-105 transition-transform">
                  {item.icon}
                </div>

                {/* Timeline Dot along the line */}
                <div className="relative z-10 -ml-2 self-center w-2 h-2 rounded-full bg-[#8e7660] border-2 border-[#faf7f2] shrink-0"></div>

                {/* Time & Event Description */}
                <div className="pl-1 flex-1">
                  <span 
                    className="text-xs sm:text-sm font-semibold text-[#6d5642] tracking-wider block"
                    style={{ fontFamily: '"Cormorant Garamond", serif' }}
                  >
                    {item.time}
                  </span>
                  <h4 
                    className="text-sm sm:text-base font-medium text-[#7a6452] leading-tight"
                    style={{ fontFamily: '"Cormorant Garamond", serif' }}
                  >
                    {item.title}
                  </h4>
                  <p className="text-[11px] text-[#9c8977] font-sans">
                    {item.subtitle}
                  </p>
                </div>

              </div>
            ))}

          </div>

        </div>

        {/* Countdown Section Below the Card (Matching Reference Image 4) */}
        <div className="mt-10 text-center">
          <p 
            className="text-3xl sm:text-4xl text-[#7a6452] mb-3 font-normal"
            style={{ fontFamily: '"Pinyon Script", "Alex Brush", cursive' }}
          >
            Faltan
          </p>

          {/* Large Countdown Numbers */}
          <div className="flex items-center justify-center gap-2 sm:gap-4 text-[#8a725e]">
            <div className="text-center">
              <span className="text-3xl sm:text-4xl font-normal tracking-tight font-serif">
                {String(timeLeft.days).padStart(2, "0")}
              </span>
              <span className="block text-[9px] sm:text-[10px] uppercase tracking-[0.2em] text-[#9e8976] mt-1 font-medium">
                DÍAS
              </span>
            </div>

            <span className="text-2xl sm:text-3xl font-light opacity-60 -mt-4">:</span>

            <div className="text-center">
              <span className="text-3xl sm:text-4xl font-normal tracking-tight font-serif">
                {String(timeLeft.hours).padStart(2, "0")}
              </span>
              <span className="block text-[9px] sm:text-[10px] uppercase tracking-[0.2em] text-[#9e8976] mt-1 font-medium">
                HORAS
              </span>
            </div>

            <span className="text-2xl sm:text-3xl font-light opacity-60 -mt-4">:</span>

            <div className="text-center">
              <span className="text-3xl sm:text-4xl font-normal tracking-tight font-serif">
                {String(timeLeft.minutes).padStart(2, "0")}
              </span>
              <span className="block text-[9px] sm:text-[10px] uppercase tracking-[0.2em] text-[#9e8976] mt-1 font-medium">
                MINUTOS
              </span>
            </div>

            <span className="text-2xl sm:text-3xl font-light opacity-60 -mt-4">:</span>

            <div className="text-center">
              <span className="text-3xl sm:text-4xl font-normal tracking-tight font-serif">
                {String(timeLeft.seconds).padStart(2, "0")}
              </span>
              <span className="block text-[9px] sm:text-[10px] uppercase tracking-[0.2em] text-[#9e8976] mt-1 font-medium">
                SEGUNDOS
              </span>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
}
