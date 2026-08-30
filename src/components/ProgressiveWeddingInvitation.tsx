import { lazy, Suspense, useState } from "react";

import { playBackgroundMusic } from "../backgroundMusic";
import {
  getResponsiveCoverAssets,
  getResponsiveEnvelopeAssets,
  invitationAssets,
  preloadImageSources,
  waitForImagesWithin,
} from "../invitationAssets";

const loadJourney = () => import("./DigitalWeddingInvitation");
const WeddingJourney = lazy(loadJourney);

function getInvitationType(): "1" | "2" {
  return new URLSearchParams(window.location.search).get("inv") === "2" ? "2" : "1";
}

function shouldShowJourneyInitially(): boolean {
  const params = new URLSearchParams(window.location.search);
  const targetId = window.location.hash.slice(1);
  return Boolean(params.get("admin") || (targetId && targetId !== "scene-cover" && targetId !== "inicio"));
}

function CoverScene({ onOpen, onRsvp }: { onOpen: () => void; onRsvp: () => void }) {
  const invitationType = getInvitationType();
  const guideMode = new URLSearchParams(window.location.search).get("guide") === "1";
  const coverAssets = getResponsiveCoverAssets();
  const [isPopping, setIsPopping] = useState(false);
  const [isOpening, setIsOpening] = useState(false);

  const openInvitation = async () => {
    if (isPopping || isOpening) return;

    void playBackgroundMusic();
    const coverCanvas = document.getElementById("cover-canvas");
    const envelopeSources = Object.values(getResponsiveEnvelopeAssets());
    const journeyReady = Promise.allSettled([
      loadJourney(),
      preloadImageSources(envelopeSources),
    ]);

    if (coverCanvas) await waitForImagesWithin(coverCanvas, 1000);
    setIsPopping(true);
    window.setTimeout(() => {
      setIsPopping(false);
      setIsOpening(true);
      window.setTimeout(() => void journeyReady.then(onOpen), 760);
    }, 430);
  };

  return (
    <div id="wedding-invitation" className="wedding-invitation">
      <button
        id="quick-rsvp-button"
        type="button"
        onClick={onRsvp}
        className="quick-rsvp"
        data-group="navigation"
        aria-label="Confirmar asistencia"
        title="Confirmar asistencia"
      >
        <span className="quick-rsvp-symbol" aria-hidden="true">&#9993;</span>
      </button>

      <main id="invitation-content" className="invitation-scroll">
        <section id="scene-cover" className="invitation-scene bg-cover-paper" data-scene="cover">
          <div id="cover-background" className="bg-paper-glow" data-group="background" />
          <button
            id="cover-open-button"
            type="button"
            onClick={openInvitation}
            className={`opening-card${isOpening ? " is-opening" : ""}`}
            data-group="interaction"
            title="Abrir invitación"
          >
            <div id="cover-canvas" className="layered-scene cover-composition" aria-hidden="true">
              <img id="cover-flower-top" className="cover-floral cover-floral-top" data-group="decoration" src={coverAssets.flowerTop} alt="" decoding="async" />
              <div id="cover-intro" className="cover-intro" data-group="text">
                <span>Estás cordialmente invitado</span>
                <span>a la boda de</span>
              </div>
              <h1 id="cover-names" className="cover-names" data-group="text">
                <span>Natalia</span>
                <small>&amp;</small>
                <span>Gabriel</span>
              </h1>
              <img
                id="cover-envelope"
                className="cover-envelope"
                data-group="envelope"
                src={coverAssets.envelope}
                alt=""
                width="600"
                height="444"
                loading="eager"
                decoding="async"
                fetchPriority="high"
              />
              <img id="cover-seal" className={`cover-seal${isPopping ? " is-popping" : ""}`} data-group="envelope" src={coverAssets.seal} alt="" decoding="async" />
              <img id="cover-bouquet" className="cover-bouquet" data-group="decoration" src={coverAssets.bouquet} alt="" decoding="async" />
              <div id="cover-reserved" className="cover-reserved" data-group="text">
                <span>Hemos reservado</span>
                <strong id="cover-place-count">{invitationType}</strong>
                <span id="cover-place-label">{invitationType === "1" ? "lugar en tu honor" : "lugares en tu honor"}</span>
              </div>
              <img id="cover-flower-bottom" className="cover-floral cover-floral-bottom" data-group="decoration" src={coverAssets.flowerBottom} alt="" decoding="async" />
              {guideMode && (
                <img id="cover-guide" className="scene-guide" data-group="guide" src={invitationType === "2" ? invitationAssets.guides.two : invitationAssets.guides.one} alt="" loading="lazy" decoding="async" />
              )}
            </div>
          </button>
          <button id="cover-open-hint" type="button" onClick={openInvitation} className="open-hint" data-group="interaction">
            Abrir invitación
            <span className="open-hint-icon" aria-hidden="true" />
          </button>
        </section>
      </main>
    </div>
  );
}

export default function ProgressiveWeddingInvitation() {
  const [showJourney, setShowJourney] = useState(shouldShowJourneyInitially);

  const revealJourney = (targetId: string) => {
    void loadJourney();
    window.history.replaceState(null, "", `${window.location.pathname}${window.location.search}#${targetId}`);
    setShowJourney(true);
  };

  if (!showJourney) {
    return <CoverScene onOpen={() => revealJourney("scene-envelope")} onRsvp={() => revealJourney("rsvp")} />;
  }

  return (
    <Suspense fallback={<div className="invitation-scene bg-cover-paper" aria-label="Cargando invitación" />}>
      <WeddingJourney contentOnly />
    </Suspense>
  );
}
