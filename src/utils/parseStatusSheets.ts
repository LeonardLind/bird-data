// src/utils/parseStatusSheets.ts
import * as XLSX from "xlsx";

export interface StatusRecord {
  species: string;
  status: string; // LC, NT, VU, EN, CR, etc.
  sheet: "L1" | "L3";
}

export const parseStatusSheets = async (file: File): Promise<StatusRecord[]> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = (e) => {
      try {
        const data = new Uint8Array(e.target?.result as ArrayBuffer);
        const workbook = XLSX.read(data, { type: "array" });

        const sheetsToRead: ("L1" | "L3")[] = ["L1", "L3"];
        const combined: StatusRecord[] = [];

        sheetsToRead.forEach((sheetName) => {
          const sheet = workbook.Sheets[sheetName];
          if (!sheet) return;

          const raw: any[][] = XLSX.utils.sheet_to_json(sheet, { header: 1, defval: "" });

          for (let i = 1; i < raw.length; i++) {
            const row = raw[i];
            const species = row[0]?.toString().trim() || "Unknown";
            const status = row[2]?.toString().trim() || "Unknown";
            combined.push({ species, status, sheet: sheetName });
          }
        });

        console.log("Parsed L1/L3 status records:", combined);
        resolve(combined);
      } catch (err) {
        reject(err);
      }
    };

    reader.onerror = (err) => reject(err);
    reader.readAsArrayBuffer(file);
  });
};
