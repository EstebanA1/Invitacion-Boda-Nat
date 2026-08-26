import { useState, useEffect } from "react";
import { Hourglass } from "lucide-react";

export default function Countdown() {
  const targetDate = new Date("Nov 28, 2026 14:30:00").getTime();

  const [timeLeft, setTimeLeft] = useState({
    days: "00",
    hours: "00",
    minutes: "00",
    seconds: "00",
  });

  useEffect(() => {
    const updateCountdown = () => {
      const now = new Date().getTime();
      const distance = targetDate - now;

      if (distance < 0) {
        setTimeLeft({
          days: "00",
          hours: "00",
          minutes: "00",
          seconds: "00",
        });
        return;
      }

      const d = Math.floor(distance / (1000 * 60 * 60 * 24));
      const h = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const m = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
      const s = Math.floor((distance % (1000 * 60)) / 1000);

      setTimeLeft({
        days: String(d).padStart(2, "0"),
        hours: String(h).padStart(2, "0"),
        minutes: String(m).padStart(2, "0"),
        seconds: String(s).padStart(2, "0"),
      });
    };

    updateCountdown();
    const intervalId = setInterval(updateCountdown, 1000);

    return () => clearInterval(intervalId);
  }, []);

  return (
    <section
      className="py-8 text-center my-8 shadow-sm px-6 max-w-2xl mx-auto relative overflow-hidden"
      style={{
        backgroundColor: '#c4fee6',
        borderStyle: 'double',
        borderRadius: '67px',
        borderWidth: '7px',
        borderColor: '#fbfbfb',
      }}
    >
      <div className="absolute top-2 right-4 text-black/20">
        <Hourglass className="w-5 h-5 animate-spin" style={{ animationDuration: "12s" }} />
      </div>
      
      <h3 className="text-xl text-black font-semibold tracking-wide mb-6" style={{ fontFamily: 'Georgia, serif' }}>
        La Cuenta Regresiva...
      </h3>

      <div className="grid grid-cols-4 gap-2 sm:gap-4 max-w-md mx-auto relative z-10">
        {/* Days */}
        <div className="bg-white rounded-2xl p-3 sm:p-4 border border-mint/40 shadow-sm">
          <span className="block font-bold text-black" style={{ fontFamily: 'Georgia, serif', fontSize: '38px', lineHeight: '37px' }}>
            {timeLeft.days}
          </span>
          <span className="text-[10px] sm:text-xs uppercase tracking-widest text-sage-700 font-medium">
            Días
          </span>
        </div>

        {/* Hours */}
        <div className="bg-white rounded-2xl p-3 sm:p-4 border border-mint/40 shadow-sm">
          <span className="block font-bold text-black" style={{ fontFamily: 'Georgia, serif', fontSize: '38px', lineHeight: '37px' }}>
            {timeLeft.hours}
          </span>
          <span className="text-[10px] sm:text-xs uppercase tracking-widest text-sage-700 font-medium">
            Horas
          </span>
        </div>

        {/* Minutes */}
        <div className="bg-white rounded-2xl p-3 sm:p-4 border border-mint/40 shadow-sm">
          <span className="block font-bold text-black" style={{ fontFamily: 'Georgia, serif', fontSize: '38px', lineHeight: '37px' }}>
            {timeLeft.minutes}
          </span>
          <span className="text-[10px] sm:text-xs uppercase tracking-widest text-sage-700 font-medium">
            Min
          </span>
        </div>

        {/* Seconds */}
        <div className="bg-white rounded-2xl p-3 sm:p-4 border border-mint/40 shadow-sm">
          <span className="block font-bold text-black" style={{ fontFamily: 'Georgia, serif', fontSize: '38px', lineHeight: '37px' }}>
            {timeLeft.seconds}
          </span>
          <span className="text-[10px] sm:text-xs uppercase tracking-widest text-sage-700 font-medium">
            Seg
          </span>
        </div>
      </div>
    </section>
  );
}
