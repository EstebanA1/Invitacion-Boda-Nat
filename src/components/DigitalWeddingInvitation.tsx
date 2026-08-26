import { FormEvent, useEffect, useMemo, useState } from "react";
import {
  CheckCircle2,
  ChevronDown,
  ExternalLink,
  Loader2,
  Lock,
  Mail,
  MapPin,
  Phone,
  Send,
  Utensils,
  Users,
  XCircle,
} from "lucide-react";
import { Guest } from "../types";
import { weddingConfig } from "../config";

import coverOne from "../../assets/invitation/cover-1.png";
import coverTwo from "../../assets/invitation/cover-2.png";
import envelopePhoto from "../../assets/invitation/envelope-photo.png";
import dateCard from "../../assets/invitation/date-card.png";
import blessing from "../../assets/invitation/blessing.png";

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
  { time: weddingConfig.ceremony.time, title: "Ceremonia religiosa", detail: weddingConfig.ceremony.place },
  { time: weddingConfig.reception.time, title: "Recepción y brindis", detail: "Bienvenida junto a familia y amigos" },
  { time: "18:00 hrs", title: "Primer vals", detail: "Apertura de la celebración" },
  { time: "19:00 hrs", title: "Cena y banquete", detail: "Cena, postres y momentos especiales" },
  { time: "02:30 hrs", title: "Fin de la celebración", detail: "Despedida de los novios" },
];

function getInvitationType(): "1" | "2" {
  const params = new URLSearchParams(window.location.search);
  return params.get("inv") === "2" ? "2" : "1";
}

function getAdminKey(): string | null {
  return new URLSearchParams(window.location.search).get("admin");
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

function SceneImage({ src, alt, className = "" }: { src: string; alt: string; className?: string }) {
  return (
    <img
      src={src}
      alt={alt}
      className={`scene-image w-full max-w-[540px] object-contain ${className}`}
      loading="lazy"
    />
  );
}

function StatCard({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="rounded-lg border border-[#ded4c7] bg-white/78 px-4 py-3 text-center shadow-sm">
      <span className="block font-cinzel text-[10px] uppercase tracking-[0.18em] text-[#7c776d]">{label}</span>
      <strong className="mt-1 block font-serif text-3xl font-semibold text-[#4d4a45]">{value}</strong>
    </div>
  );
}

export default function DigitalWeddingInvitation() {
  const invitationType = getInvitationType();
  const isAdmin = getAdminKey() === weddingConfig.rsvp.adminKey;
  const countdown = useCountdown();
  const [guests, setGuests] = useState<Guest[]>(() => getStoredGuests());
  const [remoteLoaded, setRemoteLoaded] = useState(false);
  const [isOpening, setIsOpening] = useState(false);

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
    if (isOpening) return;
    setIsOpening(true);
    window.setTimeout(() => {
      document.getElementById("inicio")?.scrollIntoView({ behavior: "smooth", block: "start" });
      window.setTimeout(() => setIsOpening(false), 700);
    }, 760);
  };

  return (
    <div className="min-h-screen bg-[#f3f2f1] text-[#4d4a45]">
      <a
        href="#rsvp"
        className="fixed bottom-5 left-5 z-50 inline-flex h-12 w-12 items-center justify-center rounded-full border border-[#d8cdbf] bg-white/90 text-[#607d75] shadow-lg backdrop-blur transition hover:scale-105"
        aria-label="Confirmar asistencia"
        title="Confirmar asistencia"
      >
        <Mail className="h-5 w-5" />
      </a>

      <main className="invitation-scroll">
        <section className="invitation-scene relative bg-cover-paper">
          <div className="absolute inset-0 bg-paper-glow" />
          <button
            type="button"
            onClick={openInvitation}
            className={`opening-card relative block w-full max-w-[540px] cursor-pointer border-0 bg-transparent p-0 text-left transition-transform duration-300 hover:scale-[1.01] focus:outline-none focus-visible:ring-4 focus-visible:ring-[#9bcfc3]/50 ${
              isOpening ? "is-opening" : ""
            }`}
            aria-label="Abrir invitación"
          >
            <SceneImage
              src={invitationType === "2" ? coverTwo : coverOne}
              alt={`Invitación para ${invitationType} ${invitationType === "1" ? "lugar" : "lugares"}`}
              className="max-h-[94svh]"
            />
          </button>
          <button
            type="button"
            onClick={openInvitation}
            className="absolute bottom-5 left-1/2 flex -translate-x-1/2 flex-col items-center gap-1 font-cinzel text-[10px] uppercase tracking-[0.25em] text-[#77736c]"
          >
            Abrir invitación
            <ChevronDown className="h-4 w-4 animate-bounce" />
          </button>
        </section>

        <section id="inicio" className="invitation-scene bg-envelope-paper">
          <SceneImage src={envelopePhoto} alt="Sobre abierto con foto de Natalia y Gabriel" className="animate-float-in" />
        </section>

        <section className="invitation-scene bg-date-paper">
          <SceneImage src={dateCard} alt="Fecha de la boda de Natalia y Gabriel" className="animate-soft-zoom" />
        </section>

        <section className="invitation-scene bg-mint-photo">
          <SceneImage src={blessing} alt="Natalia y Gabriel con la bendición de Dios" className="animate-float-in" />
        </section>

        <section className="content-scene bg-envelope-paper px-5 py-16 sm:py-20">
          <div className="mx-auto max-w-3xl text-center">
            <p className="font-script text-4xl text-[#7b8f87] sm:text-5xl">Los esperamos</p>
            <h1 className="mt-3 font-cinzel text-2xl uppercase tracking-[0.16em] text-[#4d4a45] sm:text-4xl">
              {weddingConfig.couple.fullNames}
            </h1>
            <p className="mx-auto mt-5 max-w-xl font-serif text-xl leading-relaxed text-[#756e64]">
              Dos almas, un mismo destino. Acompáñennos a celebrar el día más importante de nuestras vidas.
            </p>

            <div className="mt-10 grid gap-4 sm:grid-cols-2">
              {[weddingConfig.ceremony, weddingConfig.reception].map((item) => (
                <article key={item.title} className="rounded-lg border border-[#ded4c7] bg-white/72 p-5 text-left shadow-sm">
                  <div className="flex items-start gap-3">
                    <MapPin className="mt-1 h-5 w-5 shrink-0 text-[#7aa99d]" />
                    <div>
                      <h2 className="font-cinzel text-sm uppercase tracking-[0.14em]">{item.title}</h2>
                      <p className="mt-2 font-serif text-2xl text-[#6d685f]">{item.time}</p>
                      <p className="mt-2 text-sm leading-relaxed text-[#726a60]">{item.place}</p>
                      <p className="mt-1 text-xs leading-relaxed text-[#8b8378]">{item.address}</p>
                      <a
                        href={item.mapUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="mt-4 inline-flex items-center gap-2 rounded-full border border-[#cfc3b4] px-4 py-2 text-xs uppercase tracking-[0.16em] text-[#665f55] transition hover:bg-[#f2ece3]"
                      >
                        Ver ubicación <ExternalLink className="h-3.5 w-3.5" />
                      </a>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="content-scene bg-soft-mint px-5 py-16 sm:py-20">
          <div className="mx-auto max-w-3xl">
            <div className="text-center">
              <p className="font-script text-4xl text-[#7b8f87] sm:text-5xl">Faltan</p>
              <div className="mt-5 grid grid-cols-4 gap-2 sm:gap-4">
                <StatCard label="Días" value={countdown.days} />
                <StatCard label="Horas" value={String(countdown.hours).padStart(2, "0")} />
                <StatCard label="Min" value={String(countdown.minutes).padStart(2, "0")} />
                <StatCard label="Seg" value={String(countdown.seconds).padStart(2, "0")} />
              </div>
            </div>

            <div className="mx-auto mt-12 max-w-xl">
              {schedule.map((item) => (
                <div key={`${item.time}-${item.title}`} className="grid grid-cols-[90px_1fr] gap-4 border-l border-[#cfc8bd] pb-7 pl-5 last:pb-0">
                  <span className="font-cinzel text-xs uppercase tracking-[0.14em] text-[#7aa99d]">{item.time}</span>
                  <div>
                    <h3 className="font-serif text-xl font-semibold text-[#5b554e]">{item.title}</h3>
                    <p className="mt-1 text-sm text-[#7d7469]">{item.detail}</p>
                  </div>
                </div>
              ))}
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
    <section id="rsvp" className="content-scene bg-envelope-paper px-5 py-16 sm:py-20">
      <div className="mx-auto max-w-2xl">
        <div className="text-center">
          <p className="font-script text-4xl text-[#7b8f87] sm:text-5xl">Confirmar asistencia</p>
          <h2 className="mt-3 font-cinzel text-xl uppercase tracking-[0.16em] text-[#4d4a45] sm:text-2xl">
            ¿Nos acompañas?
          </h2>
          <p className="mx-auto mt-3 max-w-md text-sm leading-relaxed text-[#756e64]">
            Agradecemos confirmar antes del {weddingConfig.rsvp.deadline}. Esta invitación contempla{" "}
            {invitationType === "2" ? "2 lugares" : "1 lugar"}.
          </p>
        </div>

        <div className="mt-8 rounded-lg border border-[#d9cec0] bg-white/82 p-5 shadow-lg sm:p-7">
          {status === "done" ? (
            <div className="py-8 text-center">
              <CheckCircle2 className="mx-auto h-12 w-12 text-[#79a69a]" />
              <h3 className="mt-4 font-serif text-3xl text-[#4d4a45]">Respuesta registrada</h3>
              <p className="mx-auto mt-2 max-w-sm text-sm text-[#756e64]">
                Muchas gracias. Tu confirmación fue guardada para Natalia y Gabriel.
              </p>
              <button
                type="button"
                onClick={reset}
                className="mt-6 rounded-full border border-[#cfc3b4] px-5 py-2 text-xs uppercase tracking-[0.16em] text-[#665f55] transition hover:bg-[#f2ece3]"
              >
                Registrar otra respuesta
              </button>
            </div>
          ) : (
            <form onSubmit={submit} className="space-y-5">
              <label className="block">
                <span className="form-label">Nombre y apellido</span>
                <input className="form-input" value={name} onChange={(event) => setName(event.target.value)} required />
              </label>

              <div>
                <span className="form-label">¿Confirmas tu asistencia?</span>
                <div className="grid grid-cols-2 gap-3">
                  {(["Asistirá", "No Asistirá"] as Attendance[]).map((option) => (
                    <label key={option} className="cursor-pointer">
                      <input
                        type="radio"
                        name="attendance"
                        value={option}
                        checked={attendance === option}
                        onChange={() => setAttendance(option)}
                        className="peer sr-only"
                      />
                      <span className="flex h-full items-center justify-center gap-2 rounded-lg border border-[#d9cec0] bg-[#fcfaf7] px-3 py-3 text-center text-sm text-[#5f594f] transition peer-checked:border-[#7aa99d] peer-checked:bg-[#e7f3ef]">
                        {option === "Asistirá" ? <CheckCircle2 className="h-4 w-4" /> : <XCircle className="h-4 w-4" />}
                        {option === "Asistirá" ? "Sí, asistiré" : "No podré asistir"}
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <label className="block">
                  <span className="form-label">Personas que asistirán</span>
                  <select
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

                <label className="block">
                  <span className="form-label">Teléfono</span>
                  <input
                    className="form-input"
                    value={phone}
                    onChange={(event) => setPhone(event.target.value)}
                    inputMode="tel"
                    placeholder="+56 9 ..."
                  />
                </label>
              </div>

              <div>
                <span className="form-label">Restricciones alimentarias</span>
                <div className="grid grid-cols-2 gap-2">
                  {dietaryOptions.map((option) => (
                    <label key={option} className="flex items-center gap-2 rounded-lg bg-[#fcfaf7] px-3 py-2 text-xs text-[#655e54]">
                      <input
                        type="checkbox"
                        checked={dietary.includes(option)}
                        onChange={() => toggleDiet(option)}
                        className="h-4 w-4 accent-[#7aa99d]"
                      />
                      {option}
                    </label>
                  ))}
                </div>
              </div>

              <label className="block">
                <span className="form-label">Mensaje o comentario</span>
                <textarea className="form-input min-h-24 resize-y" value={details} onChange={(event) => setDetails(event.target.value)} />
              </label>

              {status === "error" && (
                <p className="rounded-lg border border-[#e5b9ad] bg-[#fff2ef] px-4 py-3 text-sm text-[#8a4b3d]">
                  No pude confirmar la conexión con Google Sheets. Dejé una copia local en este navegador para respaldo.
                </p>
              )}

              <button
                type="submit"
                disabled={status === "sending"}
                className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-[#7aa99d] px-6 py-3 font-cinzel text-xs uppercase tracking-[0.18em] text-white shadow-md transition hover:bg-[#678f86] disabled:opacity-60"
              >
                {status === "sending" ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
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
    <section className="content-scene bg-soft-mint px-5 py-16">
      <div className="mx-auto max-w-5xl">
        <div className="mb-6 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-[#cbd9d3] bg-white/70 px-3 py-1 text-xs text-[#607d75]">
              <Lock className="h-3.5 w-3.5" />
              Resumen privado
            </div>
            <h2 className="mt-3 font-serif text-3xl text-[#4d4a45]">Confirmaciones recibidas</h2>
          </div>
          <p className="text-sm text-[#756e64]">
            {remoteLoaded ? "Datos leídos desde el endpoint configurado o respaldo local." : "Mostrando respaldo local."}
          </p>
        </div>

        <div className="grid gap-3 sm:grid-cols-4">
          <StatCard label="Asisten" value={stats.yes} />
          <StatCard label="No asisten" value={stats.no} />
          <StatCard label="Personas" value={stats.people} />
          <StatCard label="Restricciones" value={stats.diets} />
        </div>

        <div className="mt-6 overflow-hidden rounded-lg border border-[#d8d0c5] bg-white/82 shadow-sm">
          <div className="grid grid-cols-[1.2fr_0.8fr_0.7fr_1fr] gap-3 bg-[#f7f4ee] px-4 py-3 font-cinzel text-[10px] uppercase tracking-[0.14em] text-[#6e675e]">
            <span>Invitado</span>
            <span>Asistencia</span>
            <span>Personas</span>
            <span>Contacto</span>
          </div>
          {guests.length === 0 ? (
            <div className="px-4 py-10 text-center text-sm text-[#7d7469]">Aún no hay respuestas registradas.</div>
          ) : (
            guests.slice(0, 20).map((guest) => (
              <div
                key={guest.id}
                className="grid grid-cols-[1.2fr_0.8fr_0.7fr_1fr] gap-3 border-t border-[#ece5dc] px-4 py-3 text-sm text-[#5f594f]"
              >
                <span className="font-semibold">{guest.name}</span>
                <span>{guest.attendance}</span>
                <span>{guest.attendance === "Asistirá" ? 1 + Number(guest.companions || 0) : 0}</span>
                <span className="truncate">{guest.phone || "-"}</span>
              </div>
            ))
          )}
        </div>

        <div className="mt-5 grid gap-3 text-sm text-[#756e64] sm:grid-cols-3">
          <span className="inline-flex items-center gap-2"><Users className="h-4 w-4" /> Invitación 1 o 2 según `?inv=`</span>
          <span className="inline-flex items-center gap-2"><Utensils className="h-4 w-4" /> Restricciones en detalle dentro de la hoja</span>
          <span className="inline-flex items-center gap-2"><Phone className="h-4 w-4" /> Teléfono incluido en cada respuesta</span>
        </div>
      </div>
    </section>
  );
}
