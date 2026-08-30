import { useState, FormEvent } from "react";
import { Heart, Loader2, Utensils, CheckCircle, XCircle } from "lucide-react";
import { Guest } from "../types";

interface RsvpFormProps {
  onRsvpAdded: (guest: Guest) => void;
}

export default function RsvpForm({ onRsvpAdded }: RsvpFormProps) {
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

    // Save local backup to localStorage
    const savedGuestsStr = localStorage.getItem("wedding_guests_backup");
    const currentList: Guest[] = savedGuestsStr ? JSON.parse(savedGuestsStr) : [];
    currentList.push(newGuest);
    localStorage.setItem("wedding_guests_backup", JSON.stringify(currentList));

    // Propagate up to parent
    onRsvpAdded(newGuest);

    // Apps Script deployment trigger
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
        console.error("Error al enviar a Google Sheets de forma asíncrona:", err);
      }
    }

    setSubmittedName(newGuest.name);
    setIsSubmitting(false);
    setSubmitSuccess(true);
  };

  return (
    <section id="rsvp-section" className="py-12 scroll-mt-6">
      <div
        className="p-8 sm:p-12 shadow-lg relative overflow-hidden max-w-3xl mx-auto"
        style={{
          backgroundColor: '#fffbf7',
          borderWidth: '6px',
          borderStyle: 'double',
          borderRadius: '54px',
        }}
      >
        <div className="text-center mb-10">
          <p className="font-cursive text-4xl mb-2 text-black" style={{ color: '#000000' }}>Confirmación de Invitados</p>
          <h2 className="font-serif text-3xl font-semibold tracking-wide text-black" style={{ color: '#000000' }}>
            ¿Nos acompañas?
          </h2>
          <p className="text-sm mt-2 text-black" style={{ color: '#000000' }}>
            Por favor, confirma tu asistencia e indícanos tus requerimientos alimentarios antes del 1 de Noviembre, 2026.
          </p>
          <div className="w-16 h-[1px] bg-mint mx-auto mt-6"></div>
        </div>

        {/* Success Overlay Modal */}
        {submitSuccess ? (
          <div className="absolute inset-0 bg-crema-100/98 z-20 flex flex-col items-center justify-center text-center p-8 transition-opacity duration-300">
            <div className="w-20 h-20 rounded-full bg-mint border border-mint/80 flex items-center justify-center text-black mb-6 animate-bounce">
              <Heart className="w-8 h-8 text-black fill-black" />
            </div>
            <h3 className="font-cursive text-5xl text-black mb-2">¡Muchísimas Gracias!</h3>
            <h4 className="font-serif text-2xl text-sage-900 mb-4">{submittedName}</h4>
            <p className="text-sm text-sage-700 max-w-sm mb-6">
              Tu respuesta ha sido procesada de manera segura. Se ha registrado correctamente en las listas de confirmación e intolerancias de los novios.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Grid of General Fields */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Guest Name */}
              <div>
                <label
                  htmlFor="fullName"
                  className="block text-xs font-semibold uppercase tracking-wider text-sage-700 mb-2"
                >
                  Nombre y Apellido
                </label>
                <input
                  type="text"
                  id="fullName"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full bg-white border border-sage-300 focus:border-mint focus:ring-1 focus:ring-mint rounded-xl px-4 py-3 text-sm text-sage-900 outline-none transition-all duration-200"
                  placeholder="Ej: Sofía Martínez"
                />
              </div>

              {/* Companion/s Count (Limited to 0 or 1) */}
              <div>
                <label
                  htmlFor="guestsCount"
                  className="block text-xs font-semibold uppercase tracking-wider text-sage-700 mb-2"
                >
                  Acompañantes adicionales
                </label>
                <select
                  id="guestsCount"
                  value={companions}
                  onChange={(e) => setCompanions(Number(e.target.value))}
                  className="w-full bg-white border border-sage-300 focus:border-mint focus:ring-1 focus:ring-mint rounded-xl px-4 py-3 text-sm text-sage-900 outline-none transition-all duration-200 cursor-pointer"
                >
                  <option value={0}>Ninguno (Asisto solo/a)</option>
                  <option value={1}>1 Acompañante</option>
                </select>
              </div>
            </div>

            {/* Attendance Confirmation Buttons */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-sage-700 mb-3">
                ¿Confirmas tu asistencia?
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Yes */}
                <label className="relative cursor-pointer select-none">
                  <input
                    type="radio"
                    name="attendance"
                    value="Asistirá"
                    checked={attendance === "Asistirá"}
                    onChange={() => setAttendance("Asistirá")}
                    className="peer sr-only"
                  />
                  <div className="p-4 border border-sage-300 rounded-2xl text-center hover:bg-crema-50 peer-checked:border-mint peer-checked:bg-mint/15 transition-all duration-200" style={{ backgroundColor: '#83fee4' }}>
                    <CheckCircle className="w-5 h-5 mx-auto text-sage-700 mb-2" />
                    <p className="text-sm font-semibold text-sage-900">Sí, ¡allí estaré!</p>
                    <p className="text-[10px] text-sage-500 mt-0.5">No me lo perdería por nada</p>
                  </div>
                </label>

                {/* No */}
                <label className="relative cursor-pointer select-none">
                  <input
                    type="radio"
                    name="attendance"
                    value="No Asistirá"
                    checked={attendance === "No Asistirá"}
                    onChange={() => setAttendance("No Asistirá")}
                    className="peer sr-only"
                  />
                  <div className="p-4 bg-white border border-sage-300 rounded-2xl text-center hover:bg-crema-50 peer-checked:border-mint peer-checked:bg-mint/15 transition-all duration-200">
                    <XCircle className="w-5 h-5 mx-auto text-sage-500 mb-2" />
                    <p className="text-sm font-semibold text-sage-900">Lamentablemente no puedo</p>
                    <p className="text-[10px] text-sage-500 mt-0.5">Los acompañaré de corazón</p>
                  </div>
                </label>
              </div>
            </div>

            {/* Food Intolerances Block */}
            <div className="bg-white border border-sage-200 p-6 rounded-2xl shadow-inner">
              <div className="flex items-center gap-2 mb-3 text-sage-700">
                <Utensils className="w-4 h-4" />
                <h4 className="text-xs font-semibold uppercase tracking-wider text-sage-900">
                  ¿Requieres un menú especial o tienes intolerancias?
                </h4>
              </div>
              <p className="text-xs text-sage-500 mb-4">
                Queremos cuidar a todos nuestros invitados. Si tú o tu acompañante tienen restricciones alimentarias severas, por favor márcalas abajo:
              </p>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {[
                  { key: "gluten", label: "Sin Gluten (Celíaco)" },
                  { key: "lactose", label: "Sin Lactosa" },
                  { key: "nuts", label: "Alergia Frutos Secos" },
                  { key: "seafood", label: "Alergia Mariscos" },
                  { key: "vegan", label: "Vegano" },
                  { key: "vegetarian", label: "Vegetariano" },
                ].map((item) => (
                  <label
                    key={item.key}
                    className="flex items-center gap-2 p-2 rounded-lg cursor-pointer hover:bg-crema-50 select-none transition-all"
                  >
                    <input
                      type="checkbox"
                      checked={dietary[item.key as keyof typeof dietary]}
                      onChange={() => handleDietaryChange(item.key as keyof typeof dietary)}
                      className="w-4 h-4 rounded text-black focus:ring-mint border-sage-300 accent-mint"
                    />
                    <span className="text-xs text-sage-700 font-medium">{item.label}</span>
                  </label>
                ))}
              </div>

              {/* Custom Special Requirements Info */}
              <div className="mt-4">
                <label
                  htmlFor="dietNotes"
                  className="block text-xs font-semibold uppercase tracking-wider text-sage-500 mb-1"
                >
                  Detalle de alergias o comentarios importantes
                </label>
                <textarea
                  id="dietNotes"
                  rows={2}
                  value={dietNotes}
                  onChange={(e) => setDietNotes(e.target.value)}
                  className="w-full bg-white border border-sage-200 rounded-xl p-3 text-xs text-sage-900 focus:ring-mint focus:border-mint outline-none"
                  placeholder="Ingresa aquí detalles específicos o nombres de los acompañantes con alergia..."
                ></textarea>
              </div>
            </div>

            {/* Submit Button */}
            <div className="text-center pt-4">
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full sm:w-auto px-10 py-4 bg-mint hover:bg-opacity-95 text-black text-xs font-semibold tracking-[0.2em] uppercase rounded-full shadow-lg border border-mint transform hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 disabled:opacity-50 cursor-pointer flex items-center justify-center gap-2 mx-auto"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Enviando...
                  </>
                ) : (
                  "Enviar Confirmación"
                )}
              </button>
            </div>
          </form>
        )}
      </div>
    </section>
  );
}
