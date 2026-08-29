import { useEffect, useRef, useState } from "react";
import { Music, VolumeX } from "lucide-react";

export default function AudioPlayer() {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    audio.volume = 0.35;
    const handlePlay = () => setIsPlaying(true);
    const handlePause = () => setIsPlaying(false);
    const handleError = () => {
      setIsPlaying(false);
      setHasError(true);
    };

    audio.addEventListener("play", handlePlay);
    audio.addEventListener("pause", handlePause);
    audio.addEventListener("error", handleError);

    return () => {
      audio.pause();
      audio.removeEventListener("play", handlePlay);
      audio.removeEventListener("pause", handlePause);
      audio.removeEventListener("error", handleError);
    };
  }, []);

  const toggleMusic = async () => {
    const audio = audioRef.current;
    if (!audio || hasError) return;

    if (audio.paused) {
      try {
        await audio.play();
      } catch {
        setIsPlaying(false);
      }
      return;
    }

    audio.pause();
  };

  const controlLabel = hasError
    ? "No se pudo cargar la música"
    : isPlaying
      ? "Pausar música"
      : "Reproducir música";

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <audio ref={audioRef} loop preload="none" aria-hidden="true">
        <source src="/audio/musicafondo.opus" type='audio/ogg; codecs="opus"' />
        <source src="/audio/musicafondo.mp3" type="audio/mpeg" />
      </audio>
      <button
        type="button"
        onClick={() => void toggleMusic()}
        id="musicToggleBtn"
        className={`w-12 h-12 rounded-full flex items-center justify-center shadow-lg transition-all duration-300 hover:scale-110 border focus:outline-none cursor-pointer ${
          isPlaying
            ? "bg-[#8eaec4] border-[#7b9eb6] text-white animate-pulse"
            : "bg-[#fdfcf9] border-[#d8ccc0] text-[#78614e] hover:bg-[#eee5d8]"
        }`}
        aria-label={controlLabel}
        aria-pressed={isPlaying}
        title={controlLabel}
        disabled={hasError}
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
