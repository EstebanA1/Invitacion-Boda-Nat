export const weddingConfig = {
  couple: {
    bride: "Natalia",
    groom: "Gabriel",
    fullNames: "Natalia Aguayo & Gabriel Figueiroa",
  },
  date: {
    iso: "2026-11-28T14:30:00-03:00",
    label: "Sábado 28 de Noviembre de 2026",
    shortLabel: "28 de Noviembre 2026",
  },
  ceremony: {
    title: "Ceremonia",
    time: "14:30 hrs",
    place: "Parroquia / IEP Coronel",
    address: "Confirma la dirección oficial antes de publicar",
    mapUrl: "https://maps.google.com/?q=Coronel%2C%20Chile",
  },
  reception: {
    title: "Recepción",
    time: "16:30 hrs",
    place: "Recepción y celebración",
    address: "Confirma la dirección oficial antes de publicar",
    mapUrl: "https://maps.google.com/?q=Coronel%2C%20Chile",
  },
  rsvp: {
    deadline: "1 de Noviembre de 2026",
    scriptUrl: import.meta.env.VITE_GOOGLE_SCRIPT_URL || "",
    adminKey: import.meta.env.VITE_ADMIN_KEY || "nati-admin-2026",
    localStorageKey: "nat_gabriel_rsvps_backup",
  },
};
