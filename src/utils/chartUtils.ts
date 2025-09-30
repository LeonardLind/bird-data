// src/utils/chartUtils.ts
import type { BirdRecord } from "./parseExcel";

interface ChartFilters {
  birdNet: boolean;
  customModel: boolean;
  perch: boolean;
}

const modelColors: Record<string, string> = {
  birdNet: "#60a5fa",
  customModel: "#f59e0b",
  perch: "#10b981",
};

/**
 * Filter bird data for charts, selecting the max detection model per species.
 */
export const getFilteredData = (
  data: BirdRecord[],
  chartFilters: ChartFilters
) => {
  return data
    .map((b) => {
      const modelValues = {
        birdNet: chartFilters.birdNet ? b.birdNet : 0,
        customModel: chartFilters.customModel ? b.customModel : 0,
        perch: chartFilters.perch ? b.perch : 0,
      };

      const [model, value] = Object.entries(modelValues).reduce(
        (acc, curr) => (curr[1] > acc[1] ? curr : acc),
        ["none", 0]
      );

      return {
        ...b,
        total: value,
        color: modelColors[model] || "#6b7280",
      };
    })
    .filter((b) => b.total > 0);
};

/**
 * Get top N species for pie chart.
 */
export const getTopSpecies = (data: BirdRecord[], top = 10) =>
  data
    .sort((a, b) => b.total - a.total)
    .slice(0, top)
    .map((b) => ({
      id: b.species,
      label: b.species,
      value: b.total,
      color: (b as any).color || "#60a5fa",
    }));
