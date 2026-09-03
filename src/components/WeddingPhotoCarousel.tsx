import { memo, useCallback, useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight, Pause, Play } from "lucide-react";
import { invitationAssets } from "../invitationAssets";

const photos = invitationAssets.gallery;
const autoplayDelay = 2000;

function WeddingPhotoCarousel() {
  const trackRef = useRef<HTMLDivElement>(null);
  const animationFrameRef = useRef(0);
  const [activeIndex, setActiveIndex] = useState(0);
  const [autoplayEnabled, setAutoplayEnabled] = useState(() => !window.matchMedia("(prefers-reduced-motion: reduce)").matches);
  const [isInView, setIsInView] = useState(false);
  const [isPageVisible, setIsPageVisible] = useState(() => !document.hidden);
  const [isHovered, setIsHovered] = useState(false);
  const [isInteracting, setIsInteracting] = useState(false);
  const [interactionVersion, setInteractionVersion] = useState(0);

  const showPhoto = useCallback((index: number) => {
    const nextIndex = (index + photos.length) % photos.length;
    setInteractionVersion((version) => version + 1);
    window.cancelAnimationFrame(animationFrameRef.current);
    // Direct entry expands the rest of the invitation on the first interaction.
    animationFrameRef.current = window.requestAnimationFrame(() => {
      const track = trackRef.current;
      if (!track) return;
      track.scrollTo({
        left: nextIndex * track.clientWidth,
        behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth",
      });
    });
  }, []);

  useEffect(() => {
    const track = trackRef.current;
    const observer = "IntersectionObserver" in window
      ? new IntersectionObserver(([entry]) => setIsInView(entry.isIntersecting && entry.intersectionRatio >= 0.35), { threshold: [0, 0.35] })
      : null;
    if (track && observer) observer.observe(track);
    else setIsInView(true);

    const updateVisibility = () => setIsPageVisible(!document.hidden);
    const motionPreference = window.matchMedia("(prefers-reduced-motion: reduce)");
    const updateMotion = () => {
      if (motionPreference.matches) setAutoplayEnabled(false);
    };
    document.addEventListener("visibilitychange", updateVisibility);
    motionPreference.addEventListener("change", updateMotion);
    return () => {
      observer?.disconnect();
      document.removeEventListener("visibilitychange", updateVisibility);
      motionPreference.removeEventListener("change", updateMotion);
      window.cancelAnimationFrame(animationFrameRef.current);
    };
  }, []);

  const shouldAdvance = autoplayEnabled && isInView && isPageVisible && !isHovered && !isInteracting;

  useEffect(() => {
    if (!shouldAdvance) return;
    const timer = window.setTimeout(() => showPhoto(activeIndex + 1), autoplayDelay);
    return () => window.clearTimeout(timer);
  }, [activeIndex, interactionVersion, shouldAdvance, showPhoto]);

  return (
    <section
      id="wedding-gallery"
      className="wedding-gallery"
      data-group="gallery"
      aria-label="Fotografías de Natalia y Gabriel"
      aria-roledescription="carrusel"
      onPointerEnter={(event) => {
        if (event.pointerType === "mouse") setIsHovered(true);
      }}
      onPointerLeave={() => {
        setIsHovered(false);
        setIsInteracting(false);
      }}
      onPointerDownCapture={() => setIsInteracting(true)}
      onPointerUpCapture={() => {
        setIsInteracting(false);
        setInteractionVersion((version) => version + 1);
      }}
      onPointerCancelCapture={() => setIsInteracting(false)}
      onFocusCapture={(event) => {
        if (event.target.id !== "gallery-autoplay-toggle" && event.target.matches(":focus-visible")) setAutoplayEnabled(false);
      }}
    >
      <div className="gallery-media">
        <button
          id="gallery-autoplay-toggle"
          type="button"
          className="gallery-arrow gallery-playback"
          aria-label={autoplayEnabled ? "Pausar carrusel" : "Reanudar carrusel"}
          title={autoplayEnabled ? "Pausar carrusel" : "Reanudar carrusel"}
          aria-controls="gallery-track"
          onClick={() => setAutoplayEnabled((enabled) => !enabled)}
        >
          {autoplayEnabled ? <Pause aria-hidden="true" /> : <Play aria-hidden="true" />}
        </button>
      <div
        id="gallery-track"
        ref={trackRef}
        className="gallery-track"
        tabIndex={0}
        aria-label="Fotografías"
        onScroll={(event) => {
          const track = event.currentTarget;
          if (!track.clientWidth) return;
          setActiveIndex(Math.max(0, Math.min(photos.length - 1, Math.round(track.scrollLeft / track.clientWidth))));
        }}
        onKeyDown={(event) => {
          if (event.altKey || event.ctrlKey || event.metaKey) return;
          const target = {
            ArrowLeft: activeIndex - 1,
            ArrowRight: activeIndex + 1,
            Home: 0,
            End: photos.length - 1,
          }[event.key];
          if (target === undefined) return;
          event.preventDefault();
          showPhoto(target);
        }}
      >
        {photos.map((photo, index) => (
          <div
            id={`gallery-slide-${photo.id}`}
            key={photo.id}
            className="gallery-slide"
            role="group"
            aria-roledescription="diapositiva"
            aria-label={`${index + 1} de ${photos.length}`}
            aria-hidden={index !== activeIndex}
          >
            <img
              src={photo.src}
              srcSet={`${photo.smallSrc} 480w, ${photo.src} 720w`}
              sizes="(max-width: 540px) 86vw, 448px"
              alt={photo.alt}
              width={photo.width}
              height={photo.height}
              loading="lazy"
              decoding="async"
              draggable={false}
            />
          </div>
        ))}
      </div>
      </div>

      <div id="gallery-controls" className="gallery-controls" data-group="controls">
        <button type="button" className="gallery-arrow" aria-label="Foto anterior" title="Foto anterior" aria-controls="gallery-track" onClick={() => showPhoto(activeIndex - 1)}>
          <ChevronLeft aria-hidden="true" />
        </button>
        <div className="gallery-indicators">
          {photos.map((photo, index) => (
            <button
              key={photo.id}
              type="button"
              className="gallery-dot"
              aria-label={`Ver foto ${index + 1}: ${photo.alt}`}
              title={`Foto ${index + 1}`}
              aria-current={index === activeIndex ? "true" : undefined}
              aria-controls="gallery-track"
              onClick={() => showPhoto(index)}
            >
              <span aria-hidden="true" />
            </button>
          ))}
        </div>
        <button type="button" className="gallery-arrow" aria-label="Foto siguiente" title="Foto siguiente" aria-controls="gallery-track" onClick={() => showPhoto(activeIndex + 1)}>
          <ChevronRight aria-hidden="true" />
        </button>
      </div>
      <p className="sr-only" aria-live={shouldAdvance ? "off" : "polite"} aria-atomic="true">Foto {activeIndex + 1} de {photos.length}</p>
    </section>
  );
}

export default memo(WeddingPhotoCarousel);
