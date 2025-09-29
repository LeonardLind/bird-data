// src/utils/chartUtils.ts
import type { BirdRecord } from "./parseExcel";

interface ChartFilters {
  birdNet: boolean;
  customModel: boolean;
  perch: boolean;
}

/**
 * Filter and process bird data for charts.
 */
export const getFilteredData = (
  data: BirdRecord[],
  searchTerm: string,
  chartFilters: ChartFilters
) => {
  return data
    .filter((b) =>
      searchTerm ? b.species.toLowerCase().includes(searchTerm.toLowerCase()) : true
    )
    .map((b) => ({
      ...b,
      total:
        (chartFilters.birdNet ? b.birdNet : 0) +
        (chartFilters.customModel ? b.customModel : 0) +
        (chartFilters.perch ? b.perch : 0),
    }))
    .filter((b) => b.total > 0);
};

/**
 * Get the top N species by total count.
 */
export const getTopSpecies = (data: BirdRecord[], top = 10) =>
  data
    .sort((a, b) => b.total - a.total)
    .slice(0, top)
    .map((b) => ({
      id: b.species,
      label: b.species,
      value: b.total,
      color: "#60a5fa", // Consistent blue
    }));
