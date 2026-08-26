import { FormEvent, useEffect, useMemo, useState } from "react";
import {
  CheckCircle2,
  ChevronDown,
  Church,
  Loader2,
  Lock,
  Mail,
  MoonStar,
  Music2,
  Phone,
  Send,
  Utensils,
  Users,
  Wine,
  XCircle,
} from "lucide-react";
import { Guest } from "../types";
import { weddingConfig } from "../config";

import whiteFlowers from "../../assets/invitation/layers/white-flowers.png";
import greenEnvelope from "../../assets/invitation/layers/green-envelope.png";
import envelopeBack from "../../assets/invitation/layers/envelope-back.png";
import envelopeFront from "../../assets/invitation/layers/envelope-front.png";
import goldDivider from "../../assets/invitation/layers/gold-divider.png";
import mintHeartDivider from "../../assets/invitation/layers/mint-heart-divider.png";
import greenOvalFrame from "../../assets/invitation/layers/green-oval-frame.png";
import formalPhoto from "../../assets/invitation/layers/formal-photo.jpg";
import lookingPhoto from "../../assets/invitation/layers/looking-photo.jpg";
import pearlStrands from "../../assets/invitation/layers/pearl-strands.png";
import ornateFrame from "../../assets/invitation/layers/ornate-frame.png";
import envelopeSeal from "../../assets/invitation/layers/envelope-seal.png";
import mixedFlowers from "../../assets/invitation/layers/mixed-flowers.png";
import handwrittenPaper from "../../assets/invitation/layers/handwritten-paper.png";
import whiteRoseSpray from "../../assets/invitation/layers/white-rose-spray.png";
import guideScene1 from "../../assets/invitation/guides/scene-1.png";
import guideScene2 from "../../assets/invitation/guides/scene-2.png";
import guideScene3 from "../../assets/invitation/guides/scene-3.png";
import guideScene4 from "../../assets/invitation/guides/scene-4.png";
import guideScene5 from "../../assets/invitation/guides/scene-5.png";

type Attendance = Guest["attendance"];

const dietaryOptions = [
  "Sin Gluten (Celíaco)",
  "Sin Lactosa",
  "Alergia Frutos Secos",
  "Alergia Mariscos",
  "Vegano",
  "Vegetariano",
];

const schedule = [
  { time: weddingConfig.ceremony.time, title: "Ceremonia religiosa", icon: Church },
  { time: weddingConfig.reception.time, title: "Recepción y brindis", icon: Wine },
  { time: "18:00 hrs", title: "Primer vals", icon: Music2 },
  { time: "19:00 hrs", title: "Cena y banquete", icon: Utensils },
  { time: "02:30 hrs", title: "Fin de la celebración", icon: MoonStar },
];

const locations = [
  { id: "ceremony", ...weddingConfig.ceremony },
  { id: "reception", ...weddingConfig.reception },
];

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

function useCountdown() {
  const [now, setNow] = useState(() => Date.now());

  useEffect(() => {
    const timer = window.setInterval(() => setNow(Date.now()), 1000);
    return () => window.clearInterval(timer);
  }, []);

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

export default function DigitalWeddingInvitation() {
  const invitationType = getInvitationType();
  const isAdmin = getAdminKey() === weddingConfig.rsvp.adminKey;
  const guideMode = getGuideMode();
  const countdown = useCountdown();
  const [guests, setGuests] = useState<Guest[]>(() => getStoredGuests());
  const [remoteLoaded, setRemoteLoaded] = useState(false);
  const [isPopping, setIsPopping] = useState(false);
  const [isOpening, setIsOpening] = useState(false);

  useEffect(() => {
    const targetId = window.location.hash.slice(1);
    if (!targetId) return;

    window.requestAnimationFrame(() => {
      const target = document.getElementById(targetId);
      if (!target) return;

      const root = document.documentElement;
      const previousBehavior = root.style.scrollBehavior;
      root.style.scrollBehavior = "auto";
      target.scrollIntoView({ block: "start" });
      window.requestAnimationFrame(() => {
        root.style.scrollBehavior = previousBehavior;
      });
    });
  }, []);

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
        document.getElementById("scene-envelope")?.scrollIntoView({ behavior: "smooth", block: "start" });
        window.setTimeout(() => setIsOpening(false), 700);
      }, 760);
    }, 430);
  };

  return (
    <div id="wedding-invitation" className="wedding-invitation">
      <a
        id="quick-rsvp-button"
        href="#rsvp"
        className="quick-rsvp"
        data-group="navigation"
        aria-label="Confirmar asistencia"
        title="Confirmar asistencia"
      >
        <Mail />
      </a>

      <main id="invitation-content" className="invitation-scroll">
        <section id="scene-cover" className="invitation-scene bg-cover-paper" data-scene="cover">
          <div id="cover-background" className="bg-paper-glow" data-group="background" />
          <button
            id="cover-open-button"
            type="button"
            onClick={openInvitation}
            className={`opening-card${isOpening ? " is-opening" : ""}`}
            data-group="interaction"
            aria-label="Abrir invitación"
          >
            <div id="cover-canvas" className="layered-scene cover-composition" aria-hidden="true">
              <img id="cover-flower-top" className="cover-floral cover-floral-top" data-group="decoration" src={whiteFlowers} alt="" />
              <div id="cover-intro" className="cover-intro" data-group="text">
                <span>Estás cordialmente invitado</span>
                <span>a la boda de</span>
              </div>
              <div id="cover-names" className="cover-names" data-group="text">
                <span>Natalia</span>
                <small>&amp;</small>
                <span>Gabriel</span>
              </div>
              <img id="cover-envelope" className="cover-envelope" data-group="envelope" src={greenEnvelope} alt="" />
              <img id="cover-seal" className={`cover-seal${isPopping ? " is-popping" : ""}`} data-group="envelope" src={envelopeSeal} alt="" />
              <img id="cover-bouquet" className="cover-bouquet" data-group="decoration" src={mixedFlowers} alt="" />
              <div id="cover-reserved" className="cover-reserved" data-group="text">
                <span>Hemos reservado</span>
                <strong>{invitationType}</strong>
                <span>{invitationType === "1" ? "lugar en tu honor" : "lugares en tu honor"}</span>
              </div>
              <img id="cover-flower-bottom" className="cover-floral cover-floral-bottom" data-group="decoration" src={whiteFlowers} alt="" />
              {guideMode && (
                <img id="cover-guide" className="scene-guide" data-group="guide" src={invitationType === "2" ? guideScene2 : guideScene1} alt="" />
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

        <section id="scene-envelope" className="invitation-scene bg-envelope-paper" data-scene="envelope">
          <div id="envelope-canvas" className="layered-scene open-envelope-composition">
            <img id="envelope-back" className="open-envelope-back layer-reveal" data-group="envelope" src={envelopeBack} alt="Sobre abierto" />
            <div id="envelope-photo-frame" className="open-envelope-photo-frame layer-reveal-delay" data-group="photo">
              <img id="envelope-photo" src={lookingPhoto} alt="Natalia y Gabriel mirándose" />
            </div>
            <img id="envelope-front" className="open-envelope-front layer-reveal-late" data-group="envelope" src={envelopeFront} alt="" />
            <img id="envelope-pearls" className="open-envelope-pearls layer-reveal-delay" data-group="decoration" src={pearlStrands} alt="" />
            {guideMode && <img id="envelope-guide" className="scene-guide" data-group="guide" src={guideScene3} alt="" />}
          </div>
        </section>

        <section id="scene-date" className="invitation-scene bg-date-paper" data-scene="date">
          <div id="date-canvas" className="layered-scene date-card-composition">
            <img id="date-frame" className="date-card-frame layer-reveal" data-group="frame" src={ornateFrame} alt="Marco decorativo" />
            <div id="date-copy" className="date-card-copy layer-reveal-delay" data-group="text">
              <div id="date-card-body" className="date-card-body">
                <div id="date-names" className="date-card-names">
                  <span id="date-bride-name" className="date-card-name date-card-name-bride">Natalia Aguayo</span>
                  <small id="date-ampersand" className="date-card-ampersand">&amp;</small>
                  <span id="date-groom-name" className="date-card-name date-card-name-groom">Gabriel Figueroa</span>
                </div>
                <img id="date-divider-main" className="date-card-main-divider" data-group="decoration" src={goldDivider} alt="" />
                <div id="date-row" className="date-card-date">
                  <div id="date-weekday" className="date-card-side">
                    <img id="date-weekday-divider-top" className="gold-divider-sm" src={goldDivider} alt="" />
                    <span id="date-weekday-label">Sábado</span>
                    <img id="date-weekday-divider-bottom" className="gold-divider-sm" src={goldDivider} alt="" />
                  </div>
                  <strong id="date-day" className="date-card-day">28</strong>
                  <div id="date-month" className="date-card-side">
                    <img id="date-month-divider-top" className="gold-divider-sm" src={goldDivider} alt="" />
                    <span id="date-month-label">Noviembre</span>
                    <img id="date-month-divider-bottom" className="gold-divider-sm" src={goldDivider} alt="" />
                  </div>
                </div>
                <p id="date-year" className="date-card-year"><strong id="date-year-label">2026</strong></p>
              </div>
              <p id="date-quote" className="date-card-quote">El amor nos unió y queremos compartir contigo el día más importante de nuestras vidas.</p>
            </div>
            <img id="date-flower" className="date-card-flower layer-reveal-late" data-group="decoration" src={mixedFlowers} alt="" />
            {guideMode && <img id="date-guide" className="scene-guide" data-group="guide" src={guideScene4} alt="" />}
          </div>
        </section>

        <section id="scene-blessing" className="invitation-scene bg-mint-photo" data-scene="blessing">
          <div id="blessing-canvas" className="layered-scene blessing-composition">
            <img id="blessing-frame" className="oval-frame layer-reveal" data-group="frame" src={greenOvalFrame} alt="Marco ovalado verde" />
            <div id="blessing-photo-frame" className="oval-photo-frame layer-reveal-delay" data-group="photo">
              <img id="blessing-photo" src={formalPhoto} alt="Natalia y Gabriel" />
            </div>
            <div id="blessing-copy" className="blessing-copy layer-reveal-late" data-group="text">
              <span>Con la bendición de Dios y<br />de nuestras familias</span>
              <strong>¡Nos casamos!</strong>
            </div>
            <img id="blessing-heart-divider" className="blessing-heart-divider" data-group="decoration" src={mintHeartDivider} alt="" />
            {guideMode && <img id="blessing-guide" className="scene-guide" data-group="guide" src={guideScene5} alt="" />}
          </div>
        </section>

        <section id="scene-details" className="details-scene content-scene bg-envelope-paper" data-scene="details" aria-label="Información de la ceremonia y la recepción">
          <div id="details-canvas" className="details-composition" data-group="content">
            <img id="details-paper-top" className="details-paper details-paper-top" data-group="decoration" src={handwrittenPaper} alt="" />
            <img id="details-paper-bottom" className="details-paper details-paper-bottom" data-group="decoration" src={handwrittenPaper} alt="" />

            <div id="details-locations" className="location-stack" data-group="locations">
              {locations.map((item) => (
                <article id={`location-${item.id}`} key={item.id} className={`location-panel location-panel-${item.id}`} data-group="location">
                  <img id={`location-${item.id}-frame`} className="location-panel-frame" data-group="frame" src={ornateFrame} alt="" />
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

            <img id="details-rose-spray" className="details-rose-spray" data-group="decoration" src={whiteRoseSpray} alt="" />
          </div>
        </section>

        <section id="scene-countdown" className="countdown-section content-scene bg-soft-mint" data-scene="countdown">
          <div id="countdown-content" className="countdown-inner" data-group="content">
            <div id="countdown-heading" className="section-heading">
              <p id="countdown-kicker" className="section-kicker">Faltan</p>
              <div id="countdown-stats" className="countdown-grid" data-group="countdown">
                <StatCard id="countdown-days" label="Días" value={countdown.days} />
                <StatCard id="countdown-hours" label="Horas" value={String(countdown.hours).padStart(2, "0")} />
                <StatCard id="countdown-minutes" label="Min" value={String(countdown.minutes).padStart(2, "0")} />
                <StatCard id="countdown-seconds" label="Seg" value={String(countdown.seconds).padStart(2, "0")} />
              </div>
            </div>
          </div>
        </section>

        <section id="scene-program" className="program-scene content-scene bg-envelope-paper" data-scene="program">
          <div id="program-canvas" className="program-composition" data-group="content">
            <div id="dress-code" className="dress-code" data-group="text">
              <p id="dress-code-kicker" className="dress-code-kicker">Dress Code</p>
              <h2 id="dress-code-title" className="dress-code-title">Elegante</h2>
              <p id="dress-code-copy" className="dress-code-copy">
                Te pedimos  NO  utilizar color blanco, ya que es exclusivamente de la novia y evitar usar amarillo pastel y beige, gracias.
              </p>
            </div>

            <img id="program-envelope" className="program-envelope" data-group="decoration" src={greenEnvelope} alt="" />
            <div id="program-card-group" className="program-card-group" data-group="program-card">
              <img id="program-frame" className="program-frame" data-group="frame" src={ornateFrame} alt="" />
              <img id="program-seal" className="program-seal" data-group="decoration" src={envelopeSeal} alt="" />

              <div id="program-content" className="program-content" data-group="timeline">
                <h2 id="program-title" className="program-title">Programa</h2>
                <div id="event-timeline" className="program-timeline">
                  {schedule.map((item, index) => {
                    const Icon = item.icon;
                    return (
                      <div id={`timeline-item-${index + 1}`} key={`${item.time}-${item.title}`} className="program-row">
                        <span className="program-icon" aria-hidden="true"><Icon /></span>
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

        <RsvpSection invitationType={invitationType} onGuestAdded={addGuest} />

        {isAdmin && (
          <AdminSummary guests={guests} stats={stats} remoteLoaded={remoteLoaded} />
        )}
      </main>
    </div>
  );
}

function RsvpSection({
  invitationType,
  onGuestAdded,
}: {
  invitationType: "1" | "2";
  onGuestAdded: (guest: Guest) => void;
}) {
  const [name, setName] = useState("");
  const [attendance, setAttendance] = useState<Attendance>("Asistirá");
  const [companions, setCompanions] = useState(invitationType === "2" ? 1 : 0);
  const [phone, setPhone] = useState("");
  const [dietary, setDietary] = useState<string[]>([]);
  const [details, setDetails] = useState("");
  const [status, setStatus] = useState<"idle" | "sending" | "done" | "error">("idle");

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
    if (!name.trim()) return;

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

    const stored = [guest, ...getStoredGuests()];
    saveStoredGuests(stored);
    onGuestAdded(guest);

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

      setStatus("done");
    } catch (error) {
      console.warn("No se pudo enviar a Google Sheets:", error);
      setStatus("error");
    }
  };

  const reset = () => {
    setName("");
    setAttendance("Asistirá");
    setCompanions(maxCompanions);
    setPhone("");
    setDietary([]);
    setDetails("");
    setStatus("idle");
  };

  return (
    <section id="rsvp" className="rsvp-section content-scene bg-envelope-paper" data-scene="rsvp">
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
                Muchas gracias. Tu confirmación fue guardada para Natalia y Gabriel.
              </p>
              <button
                id="rsvp-reset"
                type="button"
                onClick={reset}
                className="secondary-button"
              >
                Registrar otra respuesta
              </button>
            </div>
          ) : (
            <form id="rsvp-form" onSubmit={submit} className="rsvp-form">
              <label className="form-field" htmlFor="rsvp-name">
                <span className="form-label">Nombre y apellido</span>
                <input id="rsvp-name" className="form-input" value={name} onChange={(event) => setName(event.target.value)} required />
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
                  No pude confirmar la conexión con Google Sheets. Dejé una copia local en este navegador para respaldo.
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
