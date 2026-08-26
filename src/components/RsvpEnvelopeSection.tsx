import React, { useState, FormEvent } from "react";
import { Heart, Loader2, CheckCircle, XCircle, Utensils, Send, ChevronDown, ChevronUp } from "lucide-react";
import { Guest } from "../types";

interface RsvpEnvelopeSectionProps {
  onRsvpAdded: (guest: Guest) => void;
}

export default function RsvpEnvelopeSection({ onRsvpAdded }: RsvpEnvelopeSectionProps) {
  const [isOpenForm, setIsOpenForm] = useState(false);

  // Form State
  const [fullName, setFullName] = useState("");
  const [companions, setCompanions] = useState(0);
  const [attendance, setAttendance] = useState<"Asistirá" | "No Asistirá">("Asistirá");
  const [dietary, setDietary] = useState({
    gluten: false,
    lactose: false,
    nuts: false,
    seafood: false,
    vegan: false,
    vegetarian: false,
  });
  const [dietNotes, setDietNotes] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submittedName, setSubmittedName] = useState("");

  const handleDietaryChange = (key: keyof typeof dietary) => {
    setDietary((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!fullName.trim()) return;

    setIsSubmitting(true);

    const activeDiets: string[] = [];
    if (dietary.gluten) activeDiets.push("Sin Gluten (Celíaco)");
    if (dietary.lactose) activeDiets.push("Sin Lactosa");
    if (dietary.nuts) activeDiets.push("Alergia Frutos Secos");
    if (dietary.seafood) activeDiets.push("Alergia Mariscos");
    if (dietary.vegan) activeDiets.push("Vegano");
    if (dietary.vegetarian) activeDiets.push("Vegetariano");

    const newGuest: Guest = {
      id: Date.now(),
      name: fullName.trim(),
      attendance,
      companions,
      dietary: activeDiets,
      details: dietNotes.trim(),
      createdAt: new Date().toISOString(),
      isSynced: false,
    };

    // Save to local backup
    const savedGuestsStr = localStorage.getItem("wedding_guests_backup");
    const currentList: Guest[] = savedGuestsStr ? JSON.parse(savedGuestsStr) : [];
    currentList.push(newGuest);
    localStorage.setItem("wedding_guests_backup", JSON.stringify(currentList));

    onRsvpAdded(newGuest);

    // Google Sheets webhook if configured
    const scriptUrl = localStorage.getItem("wedding_script_url");
    if (scriptUrl && scriptUrl.trim() !== "") {
      try {
        const formData = new FormData();
        formData.append("name", newGuest.name);
        formData.append("attendance", newGuest.attendance);
        formData.append("companions", String(newGuest.companions));
        formData.append("dietary", newGuest.dietary.join(", "));
        formData.append("details", newGuest.details);

        await fetch(scriptUrl, {
          method: "POST",
          body: formData,
          mode: "no-cors",
        });
      } catch (err) {
        console.error("Error al sincronizar con Apps Script:", err);
      }
    }

    setSubmittedName(newGuest.name);
    setIsSubmitting(false);
    setSubmitSuccess(true);
  };

  const handleReset = () => {
    setFullName("");
    setCompanions(0);
    setAttendance("Asistirá");
    setDietary({
      gluten: false,
      lactose: false,
      nuts: false,
      seafood: false,
      vegan: false,
      vegetarian: false,
    });
    setDietNotes("");
    setSubmitSuccess(false);
  };

  return (
    <section id="rsvp-section" className="relative w-full pt-14 sm:pt-20 pb-0 bg-[#fbf9f4] flex flex-col items-center justify-center overflow-hidden scroll-mt-6">
      
      {/* Envelope Card Container */}
      <div className="relative w-full max-w-[380px] sm:max-w-[460px] mx-auto px-4 z-10">
        
        {/* Back Envelope Flap with Lace Scallop */}
        <div className="relative w-full flex justify-center -mb-24 sm:-mb-28 z-0">
          <svg viewBox="0 0 400 180" className="w-full h-auto drop-shadow-md">
            <polygon points="0,180 200,15 400,180" fill="#a0b4c4" />
            <polygon points="12,176 200,28 388,176" fill="#e9edf2" />
            <path d="M10,175 L200,24 L390,175" stroke="#ffffff" strokeWidth="2.5" strokeDasharray="4 4" fill="none" />
          </svg>
        </div>

        {/* Peeking RSVP Invitation Card */}
        <div className="relative z-10 mx-auto w-[88%] bg-[#fdfcf9] p-6 sm:p-8 rounded-t-xl shadow-lg border border-[#e4dcce] text-center">
          
          {/* Filigree Corner Accents */}
          <div className="absolute top-2.5 left-2.5 text-[#baa894] opacity-50">
            <svg width="18" height="18" viewBox="0 0 40 40" fill="none" stroke="currentColor" strokeWidth="1">
              <path d="M4,4 Q18,4 18,18" />
              <path d="M4,4 Q4,18 18,18" />
            </svg>
          </div>
          <div className="absolute top-2.5 right-2.5 text-[#baa894] opacity-50">
            <svg width="18" height="18" viewBox="0 0 40 40" fill="none" stroke="currentColor" strokeWidth="1">
              <path d="M36,4 Q22,4 22,18" />
              <path d="M36,4 Q36,18 22,18" />
            </svg>
          </div>

          <h3 
            className="text-2xl sm:text-3xl text-[#627788] font-normal tracking-wide uppercase mb-3"
            style={{ fontFamily: '"Cormorant Garamond", "Cinzel", serif' }}
          >
            CONFIRMAR ASISTENCIA
          </h3>

          <p className="text-xs text-[#8c7866] max-w-[260px] mx-auto mb-5 leading-relaxed font-serif">
            Agradecemos confirmar antes del 1 de Noviembre de 2026.
          </p>

          {/* Responder Button (Pill Button Matching Reference Image 6) */}
          <button
            onClick={() => setIsOpenForm(!isOpenForm)}
            className="inline-flex items-center gap-2 px-8 py-2.5 rounded-full border border-[#cfbeab] bg-[#fbf9f4] hover:bg-[#eee5d8] text-[#78614e] text-xs sm:text-sm font-medium tracking-wider transition-all duration-300 shadow-2xs cursor-pointer select-none"
            style={{ fontFamily: '"Cormorant Garamond", serif' }}
          >
            Responder
            {isOpenForm ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
          </button>
        </div>

        {/* Front Envelope Pocket with Heart Wax Seal & Bouquet */}
        <div className="relative -mt-10 sm:-mt-12 z-20">
          <div 
            className="w-full h-36 sm:h-44 rounded-b-2xl shadow-xl relative overflow-hidden"
            style={{
              background: "linear-gradient(180deg, #9bb0c1 0%, #879cae 100%)",
            }}
          >
            {/* Diagonal Envelope Folds */}
            <svg viewBox="0 0 400 160" className="absolute inset-0 w-full h-full pointer-events-none opacity-30" preserveAspectRatio="none">
              <line x1="0" y1="160" x2="200" y2="40" stroke="#ffffff" strokeWidth="2" />
              <line x1="400" y1="160" x2="200" y2="40" stroke="#ffffff" strokeWidth="2" />
            </svg>

            {/* Heart Wax Seal Centered at Envelope Edge */}
            <div className="absolute top-1 left-1/2 -translate-x-1/2 -translate-y-1/2 z-30">
              <div 
                className="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-[#fdfcf9] border-2 border-[#eee6d8] flex items-center justify-center cursor-pointer transform hover:scale-105 transition-transform select-none"
                style={{
                  boxShadow: "0 6px 16px rgba(40,55,70,0.3), inset 0 2px 4px rgba(255,255,255,0.9), inset 0 -2px 4px rgba(160,140,120,0.25)"
                }}
                onClick={() => setIsOpenForm(true)}
              >
                <span 
                  className="text-[#96806c] text-xs sm:text-sm font-semibold tracking-wider"
                  style={{ fontFamily: '"Cinzel", serif' }}
                >
                  N ♥ G
                </span>
              </div>
            </div>
          </div>

          {/* Floral Bouquet Right Side (Callas & Anthuriums from Reference Image 6) */}
          <div className="absolute -right-4 sm:-right-8 -top-24 sm:-top-28 w-28 sm:w-36 z-30 pointer-events-none">
            <svg viewBox="0 0 160 260" fill="none" className="w-full h-auto drop-shadow-xl">
              <g transform="translate(40, 10)">
                <path d="M50,70 Q45,150 40,220" stroke="#7a8c78" strokeWidth="3" fill="none" />
                <path d="M50,70 C30,40 20,20 40,5 C60,-5 75,20 65,45 C60,60 55,65 50,70 Z" fill="#ffffff" stroke="#e0e8e0" strokeWidth="1" />
                <path d="M48,50 L52,25" stroke="#e8c872" strokeWidth="3" strokeLinecap="round" />
              </g>
              <g transform="translate(10, 80)">
                <path d="M55,60 Q50,130 45,170" stroke="#7a8c78" strokeWidth="3" fill="none" />
                <path d="M55,60 C25,45 10,20 35,5 C55,-5 75,5 75,30 C75,50 65,55 55,60 Z" fill="#8aa4b8" stroke="#a0b8cc" strokeWidth="1" />
                <path d="M45,40 L60,15" stroke="#ebd69a" strokeWidth="3" strokeLinecap="round" />
              </g>
              <g stroke="#ffffff" strokeWidth="3" strokeDasharray="1 6" strokeLinecap="round" opacity="0.9">
                <path d="M60,160 Q55,200 50,250" />
                <path d="M70,160 Q75,210 70,260" />
                <path d="M80,165 Q85,205 80,240" />
              </g>
            </svg>
          </div>
        </div>

        {/* Interactive Expandable RSVP Form */}
        {isOpenForm && (
          <div className="mt-8 bg-white p-6 sm:p-8 rounded-2xl shadow-xl border border-[#e5ddd0] animate-fadeIn">
            
            {submitSuccess ? (
              <div className="text-center py-6">
                <div className="w-16 h-16 rounded-full bg-[#e8f1f7] text-[#607a90] flex items-center justify-center mx-auto mb-4 animate-bounce">
                  <Heart className="w-8 h-8 fill-current" />
                </div>
                <h4 className="font-serif text-2xl text-[#607a90] mb-2 font-semibold">¡Muchísimas Gracias!</h4>
                <p className="text-sm font-medium text-[#7a6452] mb-1">{submittedName}</p>
                <p className="text-xs text-[#8c7a6b] max-w-xs mx-auto mb-6">
                  Tu confirmación ha sido guardada con éxito en la lista oficial de los novios.
                </p>
                <button
                  onClick={handleReset}
                  className="text-xs uppercase tracking-wider text-[#607a90] underline hover:text-[#40566b] cursor-pointer"
                >
                  Confirmar otro invitado
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5 text-left">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-[#7a6452] mb-1.5 font-serif">
                    Nombre Completo
                  </label>
                  <input
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="Ej: Carolina Morales"
                    className="w-full bg-[#fdfcf9] border border-[#d8ccc0] focus:border-[#8eaec4] focus:ring-1 focus:ring-[#8eaec4] rounded-xl px-4 py-2.5 text-sm text-[#504033] outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-[#7a6452] mb-1.5 font-serif">
                    Acompañantes adicionales
                  </label>
                  <select
                    value={companions}
                    onChange={(e) => setCompanions(Number(e.target.value))}
                    className="w-full bg-[#fdfcf9] border border-[#d8ccc0] focus:border-[#8eaec4] focus:ring-1 focus:ring-[#8eaec4] rounded-xl px-4 py-2.5 text-sm text-[#504033] outline-none cursor-pointer"
                  >
                    <option value={0}>Ninguno (Asisto solo/a)</option>
                    <option value={1}>1 Acompañante</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-[#7a6452] mb-2 font-serif">
                    ¿Confirmas tu asistencia?
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    <label className="cursor-pointer">
                      <input
                        type="radio"
                        name="attendance"
                        value="Asistirá"
                        checked={attendance === "Asistirá"}
                        onChange={() => setAttendance("Asistirá")}
                        className="peer sr-only"
                      />
                      <div className="p-3 text-center rounded-xl border border-[#d8ccc0] bg-[#fdfcf9] peer-checked:border-[#8eaec4] peer-checked:bg-[#eaf1f7] text-xs font-medium text-[#504033] transition-all">
                        <CheckCircle className="w-4 h-4 mx-auto text-[#627788] mb-1" />
                        Sí, asistiré
                      </div>
                    </label>

                    <label className="cursor-pointer">
                      <input
                        type="radio"
                        name="attendance"
                        value="No Asistirá"
                        checked={attendance === "No Asistirá"}
                        onChange={() => setAttendance("No Asistirá")}
                        className="peer sr-only"
                      />
                      <div className="p-3 text-center rounded-xl border border-[#d8ccc0] bg-[#fdfcf9] peer-checked:border-[#8eaec4] peer-checked:bg-[#eaf1f7] text-xs font-medium text-[#504033] transition-all">
                        <XCircle className="w-4 h-4 mx-auto text-[#9e8b7c] mb-1" />
                        No podré asistir
                      </div>
                    </label>
                  </div>
                </div>

                {/* Dietary restrictions */}
                <div className="bg-[#fcfaf7] border border-[#eee4d6] p-4 rounded-xl">
                  <div className="flex items-center gap-1.5 text-[#7a6452] mb-2 font-serif text-xs font-semibold uppercase">
                    <Utensils className="w-3.5 h-3.5" />
                    <span>Restricciones alimentarias</span>
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-xs text-[#6e5a4a]">
                    {[
                      { key: "gluten", label: "Sin Gluten (Celíaco)" },
                      { key: "lactose", label: "Sin Lactosa" },
                      { key: "nuts", label: "Alergia Frutos Secos" },
                      { key: "seafood", label: "Alergia Mariscos" },
                      { key: "vegan", label: "Vegano" },
                      { key: "vegetarian", label: "Vegetariano" },
                    ].map((item) => (
                      <label key={item.key} className="flex items-center gap-2 cursor-pointer select-none">
                        <input
                          type="checkbox"
                          checked={dietary[item.key as keyof typeof dietary]}
                          onChange={() => handleDietaryChange(item.key as keyof typeof dietary)}
                          className="w-3.5 h-3.5 rounded text-[#627788] focus:ring-[#8eaec4]"
                        />
                        <span>{item.label}</span>
                      </label>
                    ))}
                  </div>

                  <div className="mt-3">
                    <textarea
                      rows={2}
                      value={dietNotes}
                      onChange={(e) => setDietNotes(e.target.value)}
                      placeholder="Comentarios adicionales sobre menú o alergias..."
                      className="w-full bg-white border border-[#d8ccc0] rounded-lg p-2 text-xs text-[#504033] outline-none"
                    ></textarea>
                  </div>
                </div>

                {/* Submit */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-3 px-6 rounded-full bg-[#8eaec4] hover:bg-[#7b9eb6] text-white text-xs uppercase tracking-widest font-semibold shadow-md transition-all cursor-pointer flex items-center justify-center gap-2"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Enviando...
                    </>
                  ) : (
                    "Enviar Respuesta"
                  )}
                </button>
              </form>
            )}

          </div>
        )}

      </div>

      {/* Romantic Scenic Footer Banner (Matching Reference Image 6) */}
      <div className="relative w-full mt-16 sm:mt-24 pt-16 pb-12 sm:pb-16 text-center text-white overflow-hidden bg-[#788e9f]">
        
        {/* Subtle Villa Lake Water Background Gradient / Overlay */}
        <div 
          className="absolute inset-0 pointer-events-none opacity-45 mix-blend-overlay"
          style={{
            background: "linear-gradient(180deg, rgba(140,165,185,0.7) 0%, rgba(90,110,125,0.9) 100%)"
          }}
        ></div>

        <div className="relative z-10 max-w-md mx-auto px-4">
          <p 
            className="text-lg sm:text-xl text-[#f5f8fb] mb-1 font-serif italic"
            style={{ fontFamily: '"Cormorant Garamond", serif' }}
          >
            Con amor
          </p>

          <h2 
            className="text-xl sm:text-2xl lg:text-3xl text-white tracking-[0.2em] font-normal uppercase select-none"
            style={{ fontFamily: '"Cinzel", "Cormorant Garamond", serif' }}
          >
            NATALIA <span className="text-3xl sm:text-4xl text-[#d4e4f0] lowercase mx-1" style={{ fontFamily: '"Pinyon Script", cursive' }}>&</span> GABRIEL
          </h2>

          <p className="text-[10px] text-[#e0ebf3] tracking-[0.3em] uppercase mt-3 opacity-80">
            28 DE NOVIEMBRE 2026
          </p>
        </div>

      </div>

    </section>
  );
}
