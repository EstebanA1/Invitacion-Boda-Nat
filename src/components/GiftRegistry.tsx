import { useState } from "react";
import { Gift, Copy, Store, Check } from "lucide-react";

export default function GiftRegistry() {
  const [copied, setCopied] = useState(false);

  const bankDetails =
    "Datos de Transferencia: Banco Estado, Cuenta Corriente 1234567, Rut: 12.345.678-9, Mail: nataliaygabriel@boda.cl";

  const handleCopyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(bankDetails);
      setCopied(true);
      setTimeout(() => setCopied(false), 3000);
    } catch (err) {
      // Fallback for browsers that block clipboard API in iframes
      const textarea = document.createElement("textarea");
      textarea.value = bankDetails;
      document.body.appendChild(textarea);
      textarea.select();
      try {
        document.execCommand("copy");
        setCopied(true);
        setTimeout(() => setCopied(false), 3000);
      } catch (copyErr) {
        console.error("No se pudo copiar", copyErr);
      }
      document.body.removeChild(textarea);
    }
  };

  return (
    <section
      id="gift-section"
      className="relative w-full py-10 px-4 bg-[#f8f6f2] flex items-center justify-center scroll-mt-12"
    >
      <div 
        className="relative w-full max-w-[360px] sm:max-w-[420px] rounded-2xl bg-[#fdfcf9] border border-[#ece3d5] p-6 sm:p-8 text-center shadow-lg transform hover:scale-[1.01] transition-transform duration-300"
        style={{
          boxShadow: "0 10px 30px -10px rgba(50, 70, 90, 0.12)"
        }}
      >
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
        <div className="absolute bottom-2.5 left-2.5 text-[#baa894] opacity-50">
          <svg width="18" height="18" viewBox="0 0 40 40" fill="none" stroke="currentColor" strokeWidth="1">
            <path d="M4,36 Q18,36 18,22" />
            <path d="M4,36 Q4,22 18,22" />
          </svg>
        </div>
        <div className="absolute bottom-2.5 right-2.5 text-[#baa894] opacity-50">
          <svg width="18" height="18" viewBox="0 0 40 40" fill="none" stroke="currentColor" strokeWidth="1">
            <path d="M36,36 Q22,36 22,22" />
            <path d="M36,36 Q36,22 22,22" />
          </svg>
        </div>

        <div className="w-10 h-10 rounded-full bg-[#f4ede2] text-[#8e7660] flex items-center justify-center mx-auto mb-3 border border-[#dfd4c5]">
          <Gift className="w-4 h-4 text-[#8e7660]" />
        </div>

        <h3 
          className="text-3xl text-[#78614e] font-normal mb-1"
          style={{ fontFamily: '"Pinyon Script", "Alex Brush", cursive' }}
        >
          Mesa de Regalos
        </h3>

        <p className="text-[11px] uppercase tracking-[0.2em] font-semibold text-[#8a725e] mb-3 font-serif">
          Lluvia de Sobres & Transferencia
        </p>
        
        <div className="w-10 h-px bg-[#d9cdbf] mx-auto mb-3"></div>

        <p className="text-xs sm:text-sm text-[#7a6452] max-w-xs mx-auto leading-relaxed mb-6 font-serif">
          Tu presencia es nuestro mayor regalo. Si deseas hacernos un obsequio, puedes cooperar con nuestra Luna de Miel o visitar nuestra lista.
        </p>

        <div className="flex flex-col gap-2.5 justify-center items-center">
          {/* Copy bank details */}
          <button
            onClick={handleCopyToClipboard}
            className="w-full sm:w-auto px-6 py-2.5 bg-[#fbf9f4] hover:bg-[#eee5d8] border border-[#cfbeab] text-[#78614e] rounded-full text-xs font-medium tracking-wider flex items-center justify-center gap-2 transition-all shadow-2xs cursor-pointer select-none"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 text-[#627788]" />
                <span>¡Copiado con éxito!</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5 text-[#8a725e]" />
                <span>Copiar Datos Bancarios</span>
              </>
            )}
          </button>

          {/* Wedding List Link */}
          <a
            href="https://novios.paris.cl"
            target="_blank"
            rel="noopener noreferrer"
            className="w-full sm:w-auto px-6 py-2.5 bg-[#8eaec4] hover:bg-[#7b9eb6] text-white rounded-full text-xs font-medium tracking-wider flex items-center justify-center gap-2 transition-all shadow-xs cursor-pointer select-none"
          >
            <Store className="w-3.5 h-3.5" />
            <span>Ver Tienda de Novios</span>
          </a>
        </div>

        {/* Dynamic Copied Toast Message */}
        <p
          className={`text-[11px] text-[#607a90] mt-3 font-medium transition-all duration-300 ${
            copied ? "opacity-100 transform translate-y-0" : "opacity-0 transform -translate-y-2 pointer-events-none"
          }`}
        >
          ¡Datos de cuenta bancaria copiados al portapapeles!
        </p>
      </div>
    </section>
  );
}
