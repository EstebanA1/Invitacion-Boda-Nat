import { lazy, Suspense, useEffect, useState } from "react";
import ProgressiveWeddingInvitation from "./components/ProgressiveWeddingInvitation";

const AudioPlayer = lazy(() => import("./components/AudioPlayer"));

export default function App() {
  const [showAudioControl, setShowAudioControl] = useState(false);

  useEffect(() => {
    const show = () => setShowAudioControl(true);
    const events = ["pointerdown", "keydown", "scroll"] as const;
    events.forEach((eventName) => window.addEventListener(eventName, show, { once: true, passive: true }));
    return () => events.forEach((eventName) => window.removeEventListener(eventName, show));
  }, []);

  return (
    <>
      {showAudioControl && (
        <Suspense fallback={null}>
          <AudioPlayer />
        </Suspense>
      )}
      <ProgressiveWeddingInvitation />
    </>
  );
}
