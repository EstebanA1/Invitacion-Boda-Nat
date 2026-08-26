import { useState, useEffect, useRef } from "react";
import { Music, VolumeX } from "lucide-react";

export default function AudioPlayer() {
  const [isPlaying, setIsPlaying] = useState(false);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const intervalRef = useRef<number | null>(null);

  const playRomanticNote = () => {
    if (!audioCtxRef.current) return;

    // Soft chord progression for ambient romantic vibes (C Major, F Major, G Major)
    const notes = [
      261.63, 329.63, 392.00, 523.25, // C Major (C4, E4, G4, C5)
      349.23, 440.00, 523.25, 698.46, // F Major (F4, A4, C5, F5)
      392.00, 493.88, 587.33, 783.99, // G Major (G4, B4, D5, G5)
    ];

    const index = Math.floor(Math.random() * notes.length);
    const freq = notes[index];

    const ctx = audioCtxRef.current;
    
    // Resume context if suspended (browser security autoplays)
    if (ctx.state === "suspended") {
      ctx.resume();
    }

    const osc = ctx.createOscillator();
    const gainNode = ctx.createGain();

    osc.connect(gainNode);
    gainNode.connect(ctx.destination);

    osc.type = "triangle"; // Smooth, mellow woodwind-like sound
    osc.frequency.setValueAtTime(freq, ctx.currentTime);

    // Fade-in and fade-out envelope
    gainNode.gain.setValueAtTime(0, ctx.currentTime);
    gainNode.gain.linearRampToValueAtTime(0.04, ctx.currentTime + 0.4);
    gainNode.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 2.5);

    osc.start(ctx.currentTime);
    osc.stop(ctx.currentTime + 3);
  };

  const toggleMusic = () => {
    if (!isPlaying) {
      if (!audioCtxRef.current) {
        // Support standard & webkit browsers
        const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
        audioCtxRef.current = new AudioContextClass();
      }
      setIsPlaying(true);
      
      // Play immediately and then on interval
      setTimeout(() => {
        playRomanticNote();
      }, 50);

      const intervalId = window.setInterval(playRomanticNote, 1600);
      intervalRef.current = intervalId;
    } else {
      setIsPlaying(false);
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    }
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
      if (audioCtxRef.current) {
        audioCtxRef.current.close();
      }
    };
  }, []);

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <button
        onClick={toggleMusic}
        id="musicToggleBtn"
        className={`w-12 h-12 rounded-full flex items-center justify-center shadow-lg transition-all duration-300 hover:scale-110 border focus:outline-none cursor-pointer ${
          isPlaying
            ? "bg-[#8eaec4] border-[#7b9eb6] text-white animate-pulse"
            : "bg-[#fdfcf9] border-[#d8ccc0] text-[#78614e] hover:bg-[#eee5d8]"
        }`}
        aria-label="Música de ambiente"
        title={isPlaying ? "Silenciar música" : "Reproducir acordes románticos"}
      >
        {isPlaying ? (
          <Music className="w-5 h-5" />
        ) : (
          <VolumeX className="w-5 h-5 opacity-70" />
        )}
      </button>
    </div>
  );
}
