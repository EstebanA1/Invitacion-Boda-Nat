import { useEffect, useState } from "react";
import { Music, VolumeX } from "lucide-react";
import {
  getBackgroundMusicState,
  subscribeToBackgroundMusic,
  toggleBackgroundMusic,
} from "../backgroundMusic";

export default function AudioPlayer() {
  const [musicState, setMusicState] = useState(getBackgroundMusicState);

  useEffect(() => {
    return subscribeToBackgroundMusic(setMusicState);
  }, []);

  const controlLabel = musicState.hasError
    ? "No se pudo cargar la música"
    : musicState.isPlaying
      ? "Pausar música"
      : "Reproducir música";

  return (
    <button
      type="button"
      onClick={() => void toggleBackgroundMusic()}
      id="musicToggleBtn"
      className={`music-toggle${musicState.isPlaying ? " is-playing" : ""}`}
      aria-label={controlLabel}
      aria-pressed={musicState.isPlaying}
      title={controlLabel}
      disabled={musicState.hasError}
    >
      {musicState.isPlaying ? <Music /> : <VolumeX />}
    </button>
  );
}
