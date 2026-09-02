import { FormEvent, ImgHTMLAttributes, useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import {
  CheckCircle2,
  ChevronDown,
  Check,
  Copy,
  Loader2,
  Lock,
  Mail,
  Phone,
  Send,
  Utensils,
  Users,
  XCircle,
} from "lucide-react";
import { Guest } from "../types";
import { weddingConfig } from "../config";
import { invitationAssets } from "../invitationAssets";

type Attendance = Guest["attendance"];

const { cover, envelope: envelopeAssets, date, blessing, details, gifts, program, guides } = invitationAssets;

type DeferredImageProps = Omit<ImgHTMLAttributes<HTMLImageElement>, "src"> & {
  src: string;
  fallbackSrc?: string;
  priority?: boolean;
  rootMargin?: string;
};

function DeferredImage({
  src,
  fallbackSrc,
  priority = false,
  rootMargin = "100% 0px",
  loading,
  decoding,
  fetchPriority,
  onError,
  ...imageProps
}: DeferredImageProps) {
  const imageRef = useRef<HTMLImageElement>(null);
  const [shouldLoad, setShouldLoad] = useState(priority);

  useEffect(() => {
    if (priority) {
      setShouldLoad(true);
      return;
    }

    const image = imageRef.current;
    if (!image || !("IntersectionObserver" in window)) {
      setShouldLoad(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        setShouldLoad(true);
        observer.disconnect();
      },
      { rootMargin },
    );

    observer.observe(image);
    return () => observer.disconnect();
  }, [priority, rootMargin, src]);

  return (
    <img
      {...imageProps}
      ref={imageRef}
      src={shouldLoad ? src : undefined}
      data-deferred-src={shouldLoad ? undefined : src}
      loading={loading ?? "eager"}
      decoding={decoding ?? (priority ? "sync" : "async")}
      fetchPriority={fetchPriority ?? (priority ? "high" : "auto")}
      onError={(event) => {
        if (fallbackSrc && !event.currentTarget.dataset.fallbackApplied) {
          event.currentTarget.dataset.fallbackApplied = "true";
          event.currentTarget.src = fallbackSrc;
        }
        onError?.(event);
      }}
    />
  );
}

function BlessingCopy() {
  const copyRef = useRef<HTMLDivElement>(null);
  const [isTypographyReady, setIsTypographyReady] = useState(false);
  const [hasEnteredView, setHasEnteredView] = useState(false);

  useEffect(() => {
    let cancelled = false;
    let isSettled = false;
    let revealFrame = 0;
    let fallbackTimer = 0;

    const revealWithStableTypography = () => {
      if (cancelled || isSettled) return;
      isSettled = true;
      window.clearTimeout(fallbackTimer);
      revealFrame = window.requestAnimationFrame(() => {
        if (!cancelled) setIsTypographyReady(true);
      });
    };

    fallbackTimer = window.setTimeout(revealWithStableTypography, 2000);
    if ("fonts" in document) {
      void document.fonts
        .load('500 16px "Cormorant Garamond"')
        .then(revealWithStableTypography, revealWithStableTypography);
    } else {
      revealWithStableTypography();
    }

    return () => {
      cancelled = true;
      window.clearTimeout(fallbackTimer);
      window.cancelAnimationFrame(revealFrame);
    };
  }, []);

  useEffect(() => {
    const copy = copyRef.current;
    if (!copy || !("IntersectionObserver" in window)) {
      setHasEnteredView(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        setHasEnteredView(true);
        observer.disconnect();
      },
      { rootMargin: "20% 0px", threshold: 0.05 },
    );

    observer.observe(copy);
    return () => observer.disconnect();
  }, []);

  const isVisible = isTypographyReady && hasEnteredView;

  return (
    <div
      id="blessing-copy"
      ref={copyRef}
      className={`blessing-copy${isVisible ? " is-visible" : ""}`}
      data-group="text"
      style={{ visibility: isVisible ? "visible" : "hidden" }}
    >
      <span>Con la bendición de Dios y<br />de nuestras familias</span>
      <strong>¡Nos casamos!</strong>
    </div>
  );
}

function useMediaQuery(query: string) {
  const [matches, setMatches] = useState(() => window.matchMedia(query).matches);

  useEffect(() => {
    const mediaQuery = window.matchMedia(query);
    const updateMatch = () => setMatches(mediaQuery.matches);
    updateMatch();
    mediaQuery.addEventListener("change", updateMatch);
    return () => mediaQuery.removeEventListener("change", updateMatch);
  }, [query]);

  return matches;
}

const dietaryOptions = [
  "Sin Gluten (Celíaco)",
  "Sin Lactosa",
  "Alergia Frutos Secos",
  "Alergia Mariscos",
  "Vegano",
  "Vegetariano",
];

const schedule = [
  { time: weddingConfig.ceremony.time, title: "Ceremonia religiosa", image: program.icons.church },
  { time: weddingConfig.reception.time, title: "Recepción centro de evento", image: program.icons.welcome },
  { time: "17:00 p.m", title: "Cóctel y brindis con los novios", image: program.icons.toast },
  { time: "18:15 p.m", title: "Inicio cena del banquete", image: program.icons.dinner },
  { time: "21:00 p.m", title: "Dinámicas y corte del pastel", image: program.icons.cake },
  { time: "00:30 a.m", title: "Fin de la celebración", image: program.icons.car },
];

const locations = [
  { id: "ceremony", ...weddingConfig.ceremony },
  { id: "reception", ...weddingConfig.reception },
];

const journeySceneIds = new Set([
  "scene-envelope",
  "scene-date",
  "scene-blessing",
  "scene-details",
  "scene-countdown",
  "scene-program",
  "rsvp",
]);

function getInvitationType(): "1" | "2" {
  const params = new URLSearchParams(window.location.search);
  return params.get("inv") === "2" ? "2" : "1";
}

function getAdminKey(): string | null {
  return new URLSearchParams(window.location.search).get("admin");
}

function getGuideMode(): boolean {
  return new URLSearchParams(window.location.search).get("guide") === "1";
}

function shouldRevealInvitationInitially(): boolean {
  const targetId = window.location.hash.slice(1);
  return Boolean(targetId && targetId !== "scene-cover" && targetId !== "inicio");
}

function getStoredGuests(): Guest[] {
  try {
    return JSON.parse(localStorage.getItem(weddingConfig.rsvp.localStorageKey) || "[]");
  } catch {
    return [];
  }
}

function saveStoredGuests(guests: Guest[]) {
  localStorage.setItem(weddingConfig.rsvp.localStorageKey, JSON.stringify(guests));
}

function getRsvpCompletionKey(invitationType: "1" | "2") {
  return `${weddingConfig.rsvp.localStorageKey}_completed_${invitationType}`;
}

function hasCompletedRsvp(invitationType: "1" | "2") {
  try {
    return localStorage.getItem(getRsvpCompletionKey(invitationType)) === "true";
  } catch {
    return false;
  }
}

function markRsvpAsCompleted(invitationType: "1" | "2") {
  try {
    localStorage.setItem(getRsvpCompletionKey(invitationType), "true");
  } catch {
    // The success screen still prevents another response during this visit.
  }
}

function toGuestRow(guest: Guest) {
  return {
    timestamp: guest.createdAt || new Date().toISOString(),
    name: guest.name,
    attendance: guest.attendance,
    companions: guest.companions,
    totalPeople: guest.attendance === "Asistirá" ? 1 + guest.companions : 0,
    phone: guest.phone,
    dietary: guest.dietary.join(", "),
    details: guest.details,
    invitationType: guest.invitationType || "1",
  };
}

function readRemoteGuests(scriptUrl: string): Promise<Guest[]> {
  if (!scriptUrl) return Promise.resolve([]);

  return new Promise((resolve) => {
    const callbackName = `weddingRsvp_${Date.now()}`;
    const script = document.createElement("script");
    const cleanup = () => {
      delete (window as any)[callbackName];
      script.remove();
    };

    (window as any)[callbackName] = (payload: { guests?: Guest[] }) => {
      cleanup();
      resolve(Array.isArray(payload?.guests) ? payload.guests : []);
    };

    script.onerror = () => {
      cleanup();
      resolve([]);
    };

    const url = new URL(scriptUrl);
    url.searchParams.set("action", "list");
    url.searchParams.set("callback", callbackName);
    script.src = url.toString();
    document.body.appendChild(script);
  });
}

function useCountdown(active: boolean) {
  const [now, setNow] = useState(() => Date.now());

  useEffect(() => {
    if (!active) return;

    setNow(Date.now());
    const timer = window.setInterval(() => setNow(Date.now()), 1000);
    return () => window.clearInterval(timer);
  }, [active]);

  return useMemo(() => {
    const diff = Math.max(new Date(weddingConfig.date.iso).getTime() - now, 0);
    return {
      days: Math.floor(diff / 86400000),
      hours: Math.floor((diff % 86400000) / 3600000),
      minutes: Math.floor((diff % 3600000) / 60000),
      seconds: Math.floor((diff % 60000) / 1000),
    };
  }, [now]);
}

function StatCard({ id, label, value }: { id: string; label: string; value: string | number }) {
  return (
    <div id={id} className="stat-card" data-group="stat">
      <span className="stat-label">{label}</span>
      <strong className="stat-value">{value}</strong>
    </div>
  );
}

function CountdownAndGifts({ priority = false, directInitial = false }: { priority?: boolean; directInitial?: boolean }) {
  const sectionRef = useRef<HTMLElement>(null);
  const [isActive, setIsActive] = useState(false);
  const countdown = useCountdown(isActive);
  const [copied, setCopied] = useState(false);
  const bankDetails = "BancoEstado - Natalia Abigail Aguayo Gutierrez - RUT 20.125.488-4";

  useEffect(() => {
    const section = sectionRef.current;
    if (!section || !("IntersectionObserver" in window)) {
      setIsActive(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => setIsActive(entry.isIntersecting),
      { rootMargin: "200px 0px" },
    );
    observer.observe(section);
    return () => observer.disconnect();
  }, []);

  const copyBankDetails = async () => {
    try {
      await navigator.clipboard.writeText(bankDetails);
    } catch {
      const textarea = document.createElement("textarea");
      textarea.value = bankDetails;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand("copy");
      textarea.remove();
    }
    setCopied(true);
    window.setTimeout(() => setCopied(false), 2200);
  };

  return (
    <section ref={sectionRef} id="scene-countdown" className={`countdown-gifts-scene content-scene bg-envelope-paper${directInitial ? " direct-initial-scene" : ""}`} data-scene="countdown-gifts">
      <div id="countdown-gifts-canvas" className="countdown-gifts-composition" data-group="content">
        <div id="countdown-heading" className="countdown-reference-heading" data-group="countdown">
          <p id="countdown-ready" className="countdown-ready">Prepárate!</p>
          <p id="countdown-kicker" className="countdown-kicker">Faltan</p>
          <div id="countdown-stats" className="countdown-grid countdown-reference-grid">
            <StatCard id="countdown-days" label="Días" value={countdown.days} />
            <StatCard id="countdown-hours" label="Horas" value={String(countdown.hours).padStart(2, "0")} />
            <StatCard id="countdown-minutes" label="Minutos" value={String(countdown.minutes).padStart(2, "0")} />
            <StatCard id="countdown-seconds" label="Segundos" value={String(countdown.seconds).padStart(2, "0")} />
          </div>
          <p id="gift-intro" className="gift-intro">
            Lo más valioso es compartir este momento junto a ustedes.<br />
            Pero si desean bendecirnos con un detalle, pueden hacerlo por este medio.
          </p>
        </div>

        <div id="gift-card" className="gift-card-composition" data-group="gifts">
          <DeferredImage id="gift-card-lace" className="gift-card-lace" src={gifts.card} alt="" rootMargin="0px" priority={priority} />
          <div id="gift-card-content" className="gift-card-content">
            <h2 id="gift-title" className="gift-title">Regalos</h2>

            <div id="gift-paris" className="gift-option gift-option-paris">
              <h3>Lista Novios Paris</h3>
              <p className="gift-code">Código: <strong>18719819</strong></p>
              <a
                id="gift-paris-link"
                href="https://www.noviosparis.cl/home/couple-catalog/18719819"
                target="_blank"
                rel="noreferrer"
                className="gift-link"
              >
                Ingresar a la lista
              </a>
            </div>

            <span className="gift-or" aria-hidden="true">- O -</span>

            <div id="gift-bank" className="gift-option gift-option-bank">
              <h3>Cuenta Bancaria</h3>
              <p className="gift-account-name">Natalia Abigail Aguayo Gutierrez</p>
              <div className="gift-bank-row">
                <DeferredImage src={gifts.bank} alt="BancoEstado" rootMargin="0px" />
                <strong>20.125.488-4</strong>
              </div>
              <button id="gift-copy-button" type="button" className="gift-copy-button" onClick={copyBankDetails}>
                {copied ? <Check aria-hidden="true" /> : <Copy aria-hidden="true" />}
                {copied ? "Datos copiados" : "Copiar datos"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default function DigitalWeddingInvitation({ contentOnly = false }: { contentOnly?: boolean }) {
  const invitationType = getInvitationType();
  const isAdmin = getAdminKey() === weddingConfig.rsvp.adminKey;
  const guideMode = getGuideMode();
  const initialTargetId = useMemo(() => window.location.hash.slice(1), []);
  const isDirectJourneyEntry = contentOnly
    && Boolean((window as Window & { __WEDDING_DIRECT_ENTRY__?: boolean }).__WEDDING_DIRECT_ENTRY__);
  const usesMobileEnvelopeAssets = useMediaQuery("(max-width: 480px)");
  const activeEnvelopeAssets = usesMobileEnvelopeAssets ? envelopeAssets.mobile : envelopeAssets.desktop;
  const [guests, setGuests] = useState<Guest[]>(() => getStoredGuests());
  const [remoteLoaded, setRemoteLoaded] = useState(false);
  const [isPopping, setIsPopping] = useState(false);
  const [isOpening, setIsOpening] = useState(false);
  const [isInvitationReady, setIsInvitationReady] = useState(
    () => contentOnly || isAdmin || shouldRevealInvitationInitially(),
  );
  const [renderFullJourney, setRenderFullJourney] = useState(
    () => !isDirectJourneyEntry || !journeySceneIds.has(initialTargetId),
  );
  const isInitialScene = (...sceneIds: string[]) => sceneIds.includes(initialTargetId);
  const shouldRenderScene = (sceneId: string) => renderFullJourney || initialTargetId === sceneId;
  const sceneClassName = (baseClassName: string, sceneId: string) =>
    `${baseClassName}${isDirectJourneyEntry && isInitialScene(sceneId) ? " direct-initial-scene" : ""}`;

  useLayoutEffect(() => {
    if (!isInvitationReady) return;

    const targetId = window.location.hash.slice(1);
    if (!targetId) return;

    const target = document.getElementById(targetId);
    if (!target) return;

    const root = document.documentElement;
    const previousBehavior = root.style.scrollBehavior;
    root.style.scrollBehavior = "auto";
    target.scrollIntoView({ block: "start" });
    window.requestAnimationFrame(() => {
      root.style.scrollBehavior = previousBehavior;
    });
  }, [isInvitationReady, renderFullJourney]);

  useEffect(() => {
    if (renderFullJourney) return;

    const revealJourney = () => setRenderFullJourney(true);
    const passiveEvents = ["pointerdown", "touchstart", "wheel"] as const;
    passiveEvents.forEach((eventName) => {
      window.addEventListener(eventName, revealJourney, { once: true, passive: true, capture: true });
    });
    window.addEventListener("keydown", revealJourney, { once: true, capture: true });

    return () => {
      passiveEvents.forEach((eventName) => window.removeEventListener(eventName, revealJourney, { capture: true }));
      window.removeEventListener("keydown", revealJourney, { capture: true });
    };
  }, [renderFullJourney]);

  useEffect(() => {
    if (!isAdmin) return;
    readRemoteGuests(weddingConfig.rsvp.scriptUrl).then((remoteGuests) => {
      if (remoteGuests.length > 0) {
        setGuests(remoteGuests);
      }
      setRemoteLoaded(true);
    });
  }, [isAdmin]);

  const stats = useMemo(() => {
    return guests.reduce(
      (acc, guest) => {
        if (guest.attendance === "Asistirá") {
          acc.yes += 1;
          acc.people += 1 + Number(guest.companions || 0);
        } else {
          acc.no += 1;
        }
        if (guest.dietary?.length || guest.details) acc.diets += 1;
        return acc;
      },
      { yes: 0, no: 0, people: 0, diets: 0 },
    );
  }, [guests]);

  const addGuest = (guest: Guest) => {
    setGuests((current) => {
      const next = [guest, ...current];
      saveStoredGuests(next);
      return next;
    });
  };

  const openInvitation = () => {
    if (isOpening || isPopping) return;
    setIsPopping(true);
    window.setTimeout(() => {
      setIsPopping(false);
      setIsOpening(true);
      window.setTimeout(() => {
        setIsInvitationReady(true);
        window.requestAnimationFrame(() => {
          window.requestAnimationFrame(() => {
            document.getElementById("scene-envelope")?.scrollIntoView({ behavior: "smooth", block: "start" });
            window.setTimeout(() => setIsOpening(false), 700);
          });
        });
      }, 760);
    }, 430);
  };

  const openRsvp = (event: React.MouseEvent<HTMLAnchorElement>) => {
    if (isInvitationReady && renderFullJourney) return;

    event.preventDefault();
    window.history.replaceState(null, "", `${window.location.pathname}${window.location.search}#rsvp`);
    if (!isInvitationReady) setIsInvitationReady(true);
    if (!renderFullJourney) setRenderFullJourney(true);
  };

  return (
    <div id="wedding-invitation" className={`wedding-invitation${contentOnly ? " invitation-content-only" : ""}`}>
      <a
        id="quick-rsvp-button"
        href="#rsvp"
        onClick={openRsvp}
        className="quick-rsvp"
        data-group="navigation"
        aria-label="Confirmar asistencia"
        title="Confirmar asistencia"
      >
        <Mail />
      </a>

      <main id="invitation-content" className="invitation-scroll">
        {!contentOnly && (
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
              <img id="cover-flower-top" className="cover-floral cover-floral-top" data-group="decoration" src={cover.desktop.flowerTop} alt="" decoding="async" />
              <div id="cover-intro" className="cover-intro" data-group="text">
                <span>Estás cordialmente invitado</span>
                <span>a la boda de</span>
              </div>
              <h1 id="cover-names" className="cover-names" data-group="text">
                <span>Natalia</span>
                <small>&amp;</small>
                <span>Gabriel</span>
              </h1>
              <img id="cover-envelope" className="cover-envelope" data-group="envelope" src={cover.desktop.envelope} alt="" width="810" height="600" loading="eager" decoding="async" fetchPriority="high" />
              <img id="cover-seal" className={`cover-seal${isPopping ? " is-popping" : ""}`} data-group="envelope" src={cover.desktop.seal} alt="" decoding="async" />
              <img id="cover-bouquet" className="cover-bouquet" data-group="decoration" src={cover.desktop.bouquet} alt="" decoding="async" />
              <div id="cover-reserved" className="cover-reserved" data-group="text">
                <span>Hemos reservado</span>
                <strong>{invitationType}</strong>
                <span>{invitationType === "1" ? "lugar en tu honor" : "lugares en tu honor"}</span>
              </div>
              <img id="cover-flower-bottom" className="cover-floral cover-floral-bottom" data-group="decoration" src={cover.desktop.flowerBottom} alt="" decoding="async" />
              {guideMode && (
                <DeferredImage id="cover-guide" className="scene-guide" data-group="guide" src={invitationType === "2" ? guides.two : guides.one} alt="" priority />
              )}
            </div>
          </button>
          <button
            id="cover-open-hint"
            type="button"
            onClick={openInvitation}
            className="open-hint"
            data-group="interaction"
          >
            Abrir invitación
            <ChevronDown className="open-hint-icon" />
          </button>
        </section>
        )}

        {isInvitationReady && (
          <>
        {shouldRenderScene("scene-envelope") && (
        <section
          id="scene-envelope"
          className={sceneClassName("invitation-scene bg-envelope-paper", "scene-envelope")}
          data-scene="envelope"
        >
          <div id="envelope-canvas" className="layered-scene open-envelope-composition">
            <div id="envelope-stage" className="open-envelope-stage" data-group="envelope-composition">
              <DeferredImage id="envelope-back" className="open-envelope-back" data-group="envelope" src={activeEnvelopeAssets.back} alt="Sobre abierto" priority={isInitialScene("scene-envelope")} fetchPriority="auto" />
              <div id="envelope-photo-frame" className="open-envelope-photo-frame" data-group="photo">
                <DeferredImage id="envelope-photo" src={activeEnvelopeAssets.photo} alt="Natalia y Gabriel mirándose" priority={isInitialScene("scene-envelope")} fetchPriority="auto" />
              </div>
              <DeferredImage id="envelope-front" className="open-envelope-front" data-group="envelope" src={activeEnvelopeAssets.front} alt="" priority={isInitialScene("scene-envelope")} />
              <DeferredImage id="envelope-pearls" className="open-envelope-pearls" data-group="decoration" src={activeEnvelopeAssets.pearls} alt="" priority={isInitialScene("scene-envelope")} />
              <blockquote id="envelope-verse" className="open-envelope-verse" data-group="text">
                <p>“Y si alguno prevaleciere contra uno, dos le resistirán; y cordón de tres dobleces no se rompe pronto.”</p>
                <cite>Eclesiastés 4:12</cite>
              </blockquote>
            </div>
            {guideMode && <DeferredImage id="envelope-guide" className="scene-guide" data-group="guide" src={guides.envelope} alt="" />}
          </div>
        </section>
        )}

        {shouldRenderScene("scene-date") && (
        <section id="scene-date" className={sceneClassName("invitation-scene bg-date-paper", "scene-date")} data-scene="date">
          <div id="date-canvas" className="layered-scene date-card-composition">
            <DeferredImage id="date-frame" className="date-card-frame layer-reveal" data-group="frame" src={date.frame} alt="Marco decorativo" priority={isInitialScene("scene-date")} />
            <div id="date-copy" className="date-card-copy layer-reveal-delay" data-group="text">
              <div id="date-card-body" className="date-card-body">
                <div id="date-names" className="date-card-names">
                  <span id="date-bride-name" className="date-card-name date-card-name-bride">Natalia Aguayo</span>
                  <small id="date-ampersand" className="date-card-ampersand">&amp;</small>
                  <span id="date-groom-name" className="date-card-name date-card-name-groom">Gabriel Figueroa</span>
                </div>
                <DeferredImage id="date-divider-main" className="date-card-main-divider" data-group="decoration" src={date.dividerMain} alt="" />
                <div id="date-row" className="date-card-date">
                  <div id="date-weekday" className="date-card-side">
                    <DeferredImage id="date-weekday-divider-top" className="gold-divider-sm" src={date.dividerSmall} alt="" />
                    <span id="date-weekday-label">Sábado</span>
                    <DeferredImage id="date-weekday-divider-bottom" className="gold-divider-sm" src={date.dividerSmall} alt="" />
                  </div>
                  <strong id="date-day" className="date-card-day">28</strong>
                  <div id="date-month" className="date-card-side">
                    <DeferredImage id="date-month-divider-top" className="gold-divider-sm" src={date.dividerSmall} alt="" />
                    <span id="date-month-label">Noviembre</span>
                    <DeferredImage id="date-month-divider-bottom" className="gold-divider-sm" src={date.dividerSmall} alt="" />
                  </div>
                </div>
                <p id="date-year" className="date-card-year"><strong id="date-year-label">2026</strong></p>
              </div>
              <p id="date-quote" className="date-card-quote">El amor nos unió y queremos compartir contigo el día más importante de nuestras vidas.</p>
            </div>
            <DeferredImage id="date-flower" className="date-card-flower layer-reveal-late" data-group="decoration" src={date.flower} alt="" />
            {guideMode && <DeferredImage id="date-guide" className="scene-guide" data-group="guide" src={guides.date} alt="" />}
          </div>
        </section>
        )}

        {shouldRenderScene("scene-blessing") && (
        <section id="scene-blessing" className={sceneClassName("invitation-scene bg-mint-photo", "scene-blessing")} data-scene="blessing">
          <div id="blessing-canvas" className="layered-scene blessing-composition">
            <DeferredImage id="blessing-frame" className="oval-frame layer-reveal" data-group="frame" src={blessing.frame} alt="Marco ovalado verde" priority={isInitialScene("scene-blessing")} />
            <div id="blessing-photo-frame" className="oval-photo-frame layer-reveal-delay" data-group="photo">
              <DeferredImage id="blessing-photo" src={blessing.photo} alt="Natalia y Gabriel" priority={isInitialScene("scene-blessing")} />
            </div>
            <BlessingCopy />
            <DeferredImage id="blessing-heart-divider" className="blessing-heart-divider" data-group="decoration" src={blessing.divider} alt="" />
            {guideMode && <DeferredImage id="blessing-guide" className="scene-guide" data-group="guide" src={guides.blessing} alt="" />}
          </div>
        </section>
        )}

        {shouldRenderScene("scene-details") && (
        <section id="scene-details" className={sceneClassName("details-scene content-scene bg-envelope-paper", "scene-details")} data-scene="details" aria-label="Información de la ceremonia y la recepción">
          <div id="details-canvas" className="details-composition" data-group="content">
            <DeferredImage id="details-paper-top" className="details-paper details-paper-top" data-group="decoration" src={details.handwrittenPaper} alt="" />
            <DeferredImage id="details-paper-bottom" className="details-paper details-paper-bottom" data-group="decoration" src={details.handwrittenPaper} alt="" />

            <div id="details-locations" className="location-stack" data-group="locations">
              {locations.map((item) => (
                <article id={`location-${item.id}`} key={item.id} className={`location-panel location-panel-${item.id}`} data-group="location">
                  <DeferredImage id={`location-${item.id}-frame`} className="location-panel-frame" data-group="frame" src={details.locationFrame} alt="" priority={isInitialScene("scene-details")} />
                  <div id={`location-${item.id}-content`} className="location-panel-content" data-group="text">
                    <h2 id={`location-${item.id}-title`} className="location-heading">{item.title}</h2>
                    <p id={`location-${item.id}-time`} className="location-time">{item.time}</p>
                    <p id={`location-${item.id}-place`} className="location-place">{item.place}</p>
                    <a
                      id={`location-${item.id}-link`}
                      href={item.mapUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="location-link"
                    >
                      Ver Ubicación
                    </a>
                  </div>
                </article>
              ))}
            </div>

            <DeferredImage id="details-rose-spray" className="details-rose-spray" data-group="decoration" src={details.roseSpray} alt="" />
          </div>
        </section>
        )}

        {shouldRenderScene("scene-countdown") && <CountdownAndGifts priority={isInitialScene("scene-countdown")} directInitial={isDirectJourneyEntry && isInitialScene("scene-countdown")} />}

        {shouldRenderScene("scene-program") && (
        <section id="scene-program" className={sceneClassName("program-scene content-scene bg-envelope-paper", "scene-program")} data-scene="program">
          <div id="program-canvas" className="program-composition" data-group="content">
            <div id="dress-code" className="dress-code" data-group="text">
              <p id="dress-code-kicker" className="dress-code-kicker">Dress Code</p>
              <h2 id="dress-code-title" className="dress-code-title">Elegante</h2>
              <p id="dress-code-copy" className="dress-code-copy">
                Te pedimos  NO  utilizar color blanco, ya que es exclusivamente de la novia y evitar usar amarillo pastel y beige, gracias.
              </p>
            </div>

            <DeferredImage id="program-envelope" className="program-envelope" data-group="decoration" src={program.envelope} alt="" priority={isInitialScene("scene-program")} />
            <div id="program-card-group" className="program-card-group" data-group="program-card">
              <DeferredImage id="program-frame" className="program-frame" data-group="frame" src={program.frame} alt="" priority={isInitialScene("scene-program")} />
              <DeferredImage id="program-seal" className="program-seal" data-group="decoration" src={program.seal} alt="" priority={isInitialScene("scene-program")} />

              <div id="program-content" className="program-content" data-group="timeline">
                <h2 id="program-title" className="program-title">Programa</h2>
                <div id="event-timeline" className="program-timeline">
                  {schedule.map((item, index) => {
                    return (
                      <div id={`timeline-item-${index + 1}`} key={`${item.time}-${item.title}`} className="program-row">
                        <DeferredImage className="program-icon" src={item.image} alt="" aria-hidden="true" priority={isInitialScene("scene-program")} />
                        <span className="program-line" aria-hidden="true" />
                        <div className="program-row-copy">
                          <time className="program-time">{item.time}</time>
                          <h3 className="program-event">{item.title}</h3>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </section>
        )}

        {shouldRenderScene("rsvp") && (
          <RsvpSection invitationType={invitationType} onGuestAdded={addGuest} directInitial={isDirectJourneyEntry && isInitialScene("rsvp")} />
        )}

        {isAdmin && renderFullJourney && (
          <AdminSummary guests={guests} stats={stats} remoteLoaded={remoteLoaded} />
        )}
          </>
        )}
      </main>
    </div>
  );
}

function RsvpSection({
  invitationType,
  onGuestAdded,
  directInitial = false,
}: {
  invitationType: "1" | "2";
  onGuestAdded: (guest: Guest) => void;
  directInitial?: boolean;
}) {
  const [name, setName] = useState("");
  const [attendance, setAttendance] = useState<Attendance>("Asistirá");
  const [companions, setCompanions] = useState(invitationType === "2" ? 1 : 0);
  const [phone, setPhone] = useState("");
  const [dietary, setDietary] = useState<string[]>([]);
  const [details, setDetails] = useState("");
  const [status, setStatus] = useState<"idle" | "sending" | "done" | "error">(
    () => hasCompletedRsvp(invitationType) ? "done" : "idle",
  );

  const maxCompanions = invitationType === "2" ? 1 : 0;

  useEffect(() => {
    if (attendance === "No Asistirá") {
      setCompanions(0);
    } else {
      setCompanions(maxCompanions);
    }
  }, [attendance, maxCompanions]);

  const toggleDiet = (option: string) => {
    setDietary((current) =>
      current.includes(option) ? current.filter((item) => item !== option) : [...current, option],
    );
  };

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    if (!name.trim() || status === "sending" || hasCompletedRsvp(invitationType)) return;

    setStatus("sending");

    const guest: Guest = {
      id: crypto.randomUUID(),
      name: name.trim(),
      attendance,
      companions: attendance === "Asistirá" ? companions : 0,
      phone: phone.trim(),
      dietary,
      details: details.trim(),
      invitationType,
      createdAt: new Date().toISOString(),
      isSynced: false,
    };

    if (!weddingConfig.rsvp.scriptUrl) {
      setStatus("error");
      return;
    }

    try {
      const formData = new FormData();
      Object.entries(toGuestRow(guest)).forEach(([key, value]) => {
        formData.append(key, String(value));
      });

      await fetch(weddingConfig.rsvp.scriptUrl, {
        method: "POST",
        mode: "no-cors",
        body: formData,
      });

      onGuestAdded(guest);
      markRsvpAsCompleted(invitationType);
      setStatus("done");
    } catch (error) {
      console.warn("No se pudo enviar a Google Sheets:", error);
      setStatus("error");
    }
  };

  return (
    <section id="rsvp" className={`rsvp-section content-scene bg-envelope-paper${directInitial ? " direct-initial-scene" : ""}`} data-scene="rsvp">
      <div id="rsvp-content" className="rsvp-inner" data-group="content">
        <div id="rsvp-heading" className="section-heading">
          <p id="rsvp-kicker" className="section-kicker">Confirmar asistencia</p>
          <h2 id="rsvp-title" className="section-title section-title-small">
            ¿Nos acompañas?
          </h2>
          <p id="rsvp-copy" className="section-copy section-copy-small">
            Agradecemos confirmar antes del {weddingConfig.rsvp.deadline}. Esta invitación contempla{" "}
            {invitationType === "2" ? "2 lugares" : "1 lugar"}.
          </p>
        </div>

        <div id="rsvp-panel" className="rsvp-panel" data-group="form">
          {status === "done" ? (
            <div id="rsvp-success" className="success-state">
              <CheckCircle2 className="success-icon" />
              <h3 className="success-title">Respuesta registrada</h3>
              <p className="success-copy">
                Muchas gracias. Esta invitación ya registró su respuesta para Natalia y Gabriel.
              </p>
            </div>
          ) : (
            <form id="rsvp-form" onSubmit={submit} className="rsvp-form">
              <label className="form-field" htmlFor="rsvp-name">
                <span className="form-label">Nombre y apellido</span>
                <input id="rsvp-name" className="form-input" value={name} onChange={(event) => setName(event.target.value)} autoComplete="name" required />
              </label>

              <fieldset id="rsvp-attendance" className="form-group">
                <legend className="form-label">¿Confirmas tu asistencia?</legend>
                <div className="choice-grid">
                  {(["Asistirá", "No Asistirá"] as Attendance[]).map((option, index) => (
                    <label key={option} className="choice-option" htmlFor={`rsvp-attendance-${index}`}>
                      <input
                        id={`rsvp-attendance-${index}`}
                        type="radio"
                        name="attendance"
                        value={option}
                        checked={attendance === option}
                        onChange={() => setAttendance(option)}
                      />
                      <span className="choice-card">
                        {option === "Asistirá" ? <CheckCircle2 /> : <XCircle />}
                        {option === "Asistirá" ? "Sí, asistiré" : "No podré asistir"}
                      </span>
                    </label>
                  ))}
                </div>
              </fieldset>

              <div id="rsvp-contact-group" className="form-grid" data-group="contact">
                <label className="form-field" htmlFor="rsvp-people">
                  <span className="form-label">Personas que asistirán</span>
                  <select
                    id="rsvp-people"
                    className="form-input"
                    value={attendance === "Asistirá" ? 1 + companions : 0}
                    disabled={attendance === "No Asistirá"}
                    onChange={(event) => setCompanions(Math.max(0, Number(event.target.value) - 1))}
                  >
                    {attendance === "No Asistirá" ? (
                      <option value={0}>No asistiré</option>
                    ) : (
                      Array.from({ length: maxCompanions + 1 }, (_, index) => index + 1).map((count) => (
                        <option key={count} value={count}>
                          {count} {count === 1 ? "persona" : "personas"}
                        </option>
                      ))
                    )}
                  </select>
                </label>

                <label className="form-field" htmlFor="rsvp-phone">
                  <span className="form-label">Teléfono</span>
                  <input
                    id="rsvp-phone"
                    className="form-input"
                    value={phone}
                    onChange={(event) => setPhone(event.target.value)}
                    inputMode="tel"
                    autoComplete="tel"
                    placeholder="+56 9 ..."
                  />
                </label>
              </div>

              <fieldset id="rsvp-dietary" className="form-group">
                <legend className="form-label">Restricciones alimentarias</legend>
                <div className="diet-grid">
                  {dietaryOptions.map((option, index) => (
                    <label key={option} className="diet-option" htmlFor={`rsvp-diet-${index}`}>
                      <input
                        id={`rsvp-diet-${index}`}
                        type="checkbox"
                        checked={dietary.includes(option)}
                        onChange={() => toggleDiet(option)}
                      />
                      {option}
                    </label>
                  ))}
                </div>
              </fieldset>

              <label className="form-field" htmlFor="rsvp-details">
                <span className="form-label">Mensaje o comentario</span>
                <textarea id="rsvp-details" className="form-input form-textarea" value={details} onChange={(event) => setDetails(event.target.value)} />
              </label>

              {status === "error" && (
                <p id="rsvp-error" className="form-alert">
                  No se pudo enviar la respuesta. Revisa tu conexión e inténtalo nuevamente.
                </p>
              )}

              <button
                id="rsvp-submit"
                type="submit"
                disabled={status === "sending"}
                className="primary-button"
              >
                {status === "sending" ? <Loader2 className="status-spinner" /> : <Send />}
                Enviar respuesta
              </button>
            </form>
          )}
        </div>
      </div>
    </section>
  );
}

function AdminSummary({
  guests,
  stats,
  remoteLoaded,
}: {
  guests: Guest[];
  stats: { yes: number; no: number; people: number; diets: number };
  remoteLoaded: boolean;
}) {
  return (
    <section id="scene-admin" className="admin-section content-scene bg-soft-mint" data-scene="admin">
      <div id="admin-content" className="admin-inner" data-group="content">
        <div id="admin-heading" className="admin-heading">
          <div>
            <div id="admin-badge" className="admin-badge">
              <Lock />
              Resumen privado
            </div>
            <h2 id="admin-title" className="admin-title">Confirmaciones recibidas</h2>
          </div>
          <p id="admin-copy" className="admin-copy">
            {remoteLoaded ? "Datos leídos desde el endpoint configurado o respaldo local." : "Mostrando respaldo local."}
          </p>
        </div>

        <div id="admin-stats" className="admin-stats" data-group="stats">
          <StatCard id="admin-stat-yes" label="Asisten" value={stats.yes} />
          <StatCard id="admin-stat-no" label="No asisten" value={stats.no} />
          <StatCard id="admin-stat-people" label="Personas" value={stats.people} />
          <StatCard id="admin-stat-diets" label="Restricciones" value={stats.diets} />
        </div>

        <div id="admin-table" className="admin-table" data-group="responses">
          <div id="admin-table-head" className="admin-table-row admin-table-head">
            <span>Invitado</span>
            <span>Asistencia</span>
            <span>Personas</span>
            <span>Contacto</span>
          </div>
          {guests.length === 0 ? (
            <div id="admin-empty" className="empty-state">Aún no hay respuestas registradas.</div>
          ) : (
            guests.slice(0, 20).map((guest, index) => (
              <div
                id={`admin-response-${index + 1}`}
                key={guest.id}
                className="admin-table-row"
              >
                <strong>{guest.name}</strong>
                <span>{guest.attendance}</span>
                <span>{guest.attendance === "Asistirá" ? 1 + Number(guest.companions || 0) : 0}</span>
                <span className="admin-contact">{guest.phone || "-"}</span>
              </div>
            ))
          )}
        </div>

        <div id="admin-notes" className="admin-notes" data-group="notes">
          <span><Users /> Invitación 1 o 2 según `?inv=`</span>
          <span><Utensils /> Restricciones en detalle dentro de la hoja</span>
          <span><Phone /> Teléfono incluido en cada respuesta</span>
        </div>
      </div>
    </section>
  );
}
