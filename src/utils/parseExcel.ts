// src/utils/parseExcel.ts
import * as XLSX from "xlsx";

export interface BirdRecord {
  total: number;
  species: string;
  birdNet: number;
  customModel: number;
  perch: number;
  max: number;
  status: string; // LC, NT, VU, EN, CR, etc.
  
}

/**
 * Parses the uploaded Excel file and returns a clean array of BirdRecord objects.
 */
export const parseExcel = async (file: File): Promise<BirdRecord[]> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = (e) => {
      try {
        const data = new Uint8Array(e.target?.result as ArrayBuffer);
        const workbook = XLSX.read(data, { type: "array" });

        const sheet = workbook.Sheets["Combined Analysis"];
        if (!sheet) throw new Error("Sheet 'Combined Analysis' not found!");

        const jsonData = XLSX.utils.sheet_to_json<any>(sheet, { defval: null });

        console.log("Excel headers:", Object.keys(jsonData[0]));

        // Normalize headers (trim and lowercase)
        const headerMap: Record<string, string> = {};
        Object.keys(jsonData[0]).forEach((key) => {
          headerMap[key.trim().toLowerCase()] = key;
        });

        const formattedData: BirdRecord[] = jsonData.map((row) => {
          // Extract status from L1 and L3 columns (column C in each table)
          const statusL1 = row[headerMap["L1 status"]] || "";
          const statusL3 = row[headerMap["L3 status"]] || "";

          // Prefer L1 if present, otherwise L3, otherwise Unknown
          const status = statusL1.trim() || statusL3.trim() || "Unknown";

          return {
            total: Number(row[headerMap["total"]]) || 0,
            species: row[headerMap["species"]] || "Unknown",
            birdNet: Number(row[headerMap["birdnet"]]) || 0,
            customModel: Number(row[headerMap["custom model"]]) || 0,
            perch: Number(row[headerMap["perch "]]) || 0,
            max: Number(row[headerMap["max"]]) || 0,
            status,
          };
        });

        resolve(formattedData);
      } catch (error) {
        reject(error);
      }
    };

    reader.onerror = (error) => reject(error);

    reader.readAsArrayBuffer(file);
  });
};
