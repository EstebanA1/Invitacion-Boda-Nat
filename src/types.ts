export interface Guest {
  id: string | number;
  name: string;
  attendance: "Asistirá" | "No Asistirá";
  companions: number;
  phone?: string;
  dietary: string[];
  details: string;
  invitationType?: "1" | "2";
  createdAt?: string;
  isSynced?: boolean;
}

export interface SpreadsheetInfo {
  spreadsheetId: string;
  range: string;
}

export interface AdminStats {
  yesCount: number;
  noCount: number;
  totalGuests: number;
  dietsCount: number;
}
