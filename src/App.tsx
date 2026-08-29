import { lazy, Suspense } from "react";
import ProgressiveWeddingInvitation from "./components/ProgressiveWeddingInvitation";

const AudioPlayer = lazy(() => import("./components/AudioPlayer"));

export default function App() {
  return (
    <>
      <Suspense fallback={null}>
        <AudioPlayer />
      </Suspense>
      <ProgressiveWeddingInvitation />
    </>
  );
}
