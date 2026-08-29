export type BackgroundMusicState = {
  isPlaying: boolean;
  hasError: boolean;
};

type MusicStateListener = (state: BackgroundMusicState) => void;

const AUDIO_ELEMENT_ID = "wedding-background-music";
const listeners = new Set<MusicStateListener>();
let currentState: BackgroundMusicState = { isPlaying: false, hasError: false };
let hasBoundAudioEvents = false;
let prefersMusic = true;

function publishState(nextState: BackgroundMusicState) {
  if (
    currentState.isPlaying === nextState.isPlaying
    && currentState.hasError === nextState.hasError
  ) return;

  currentState = nextState;
  listeners.forEach((listener) => listener(currentState));
}

function getAudioElement() {
  const audio = document.getElementById(AUDIO_ELEMENT_ID);
  if (!(audio instanceof HTMLAudioElement)) return null;

  audio.volume = 0.35;
  if (!hasBoundAudioEvents) {
    hasBoundAudioEvents = true;
    audio.addEventListener("play", () => publishState({ isPlaying: true, hasError: false }));
    audio.addEventListener("pause", () => publishState({ ...currentState, isPlaying: false }));
    audio.addEventListener("error", () => publishState({ isPlaying: false, hasError: true }));
  }

  return audio;
}

export function getBackgroundMusicState() {
  const audio = getAudioElement();
  if (audio) {
    currentState = { ...currentState, isPlaying: !audio.paused };
  }
  return currentState;
}

export function subscribeToBackgroundMusic(listener: MusicStateListener) {
  getAudioElement();
  listeners.add(listener);
  listener(currentState);
  return () => {
    listeners.delete(listener);
  };
}

export async function playBackgroundMusic() {
  const audio = getAudioElement();
  if (!audio || currentState.hasError || !prefersMusic) return false;

  try {
    await audio.play();
    return true;
  } catch {
    return false;
  }
}

export function pauseBackgroundMusic() {
  prefersMusic = false;
  getAudioElement()?.pause();
}

export async function toggleBackgroundMusic() {
  const audio = getAudioElement();
  if (!audio || currentState.hasError) return;

  if (audio.paused) {
    prefersMusic = true;
    await playBackgroundMusic();
    return;
  }

  pauseBackgroundMusic();
}

export function startBackgroundMusicAutomatically() {
  const audio = getAudioElement();
  if (!audio) return () => undefined;

  const tryToStart = () => void playBackgroundMusic();
  const handleInteraction = (event: Event) => {
    const target = event.target;
    if (target instanceof Element && target.closest("#musicToggleBtn")) return;
    tryToStart();
  };
  const cleanup = () => {
    window.removeEventListener("load", tryToStart);
    window.removeEventListener("pointerdown", handleInteraction, true);
    window.removeEventListener("keydown", handleInteraction, true);
    audio.removeEventListener("play", cleanup);
    audio.removeEventListener("error", cleanup);
  };

  window.addEventListener("pointerdown", handleInteraction, { passive: true, capture: true });
  window.addEventListener("keydown", handleInteraction, { capture: true });
  audio.addEventListener("play", cleanup, { once: true });
  audio.addEventListener("error", cleanup, { once: true });

  if (document.readyState === "complete") {
    window.setTimeout(tryToStart, 0);
  } else {
    window.addEventListener("load", tryToStart, { once: true });
  }

  return cleanup;
}
