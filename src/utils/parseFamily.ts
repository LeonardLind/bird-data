import * as XLSX from "xlsx";

export interface FamilyRecord {
  family: string;
}

export const parseFamily = async (file: File): Promise<FamilyRecord[]> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = (e) => {
      try {
        const data = new Uint8Array(e.target?.result as ArrayBuffer);
        const workbook = XLSX.read(data, { type: "array" });

        const sheet = workbook.Sheets["L1"]; 
        if (!sheet) throw new Error("Sheet 'L1' not found!");

        const raw: any[][] = XLSX.utils.sheet_to_json(sheet, { header: 1, defval: "" });

        if (raw.length < 2) return resolve([]); 

        const headers: string[] = raw[0].map((h: any) => h.toString().trim().toLowerCase());
        const familyColIndex = headers.findIndex((h) => h === "family");

        if (familyColIndex === -1) throw new Error("No 'Family' column found in L1 sheet!");

        const formattedData: FamilyRecord[] = raw.slice(1).map((row) => ({
          family: (row[familyColIndex] || "NaN").toString().trim(),
        }));

        resolve(formattedData);
      } catch (err) {
        reject(err);
      }
    };

    reader.onerror = (err) => reject(err);
    reader.readAsArrayBuffer(file);
  });
};
