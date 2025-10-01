// src/components/FilterBar.tsx
import React from "react";
import { useTranslation } from "react-i18next";

interface FilterBarProps {
  searchTerm: string;
  setSearchTerm: (val: string) => void;
  chartFilters: { birdNet: boolean; customModel: boolean; perch: boolean };
  setChartFilters: (
    val: { birdNet: boolean; customModel: boolean; perch: boolean }
  ) => void;
  groupByStatus: boolean;
  showFamilyChart: boolean;
  selectedSheets: ("L1" | "L3" | "combined")[];
  toggleSheet: (sheet: "L1" | "L3" | "combined") => void;
  children?: React.ReactNode;
}

const FilterBar: React.FC<FilterBarProps> = ({
  searchTerm,
  setSearchTerm,
  chartFilters,
  setChartFilters,
  groupByStatus,
  showFamilyChart,
  selectedSheets,
  toggleSheet,
  children,
}) => {
  const { t } = useTranslation();

  return (
    <div className="bg-[#141b2d] border border-gray-700 rounded-2xl shadow-lg p-5 flex flex-col md:flex-row items-center gap-6 justify-between">
      {/* Search Bar */}
      <input
        type="text"
        placeholder={t("searchSpecies")}
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="px-4 py-2 rounded-xl w-full md:w-1/3 bg-[#0f172a] border border-gray-600 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
      />

      {/* Filters row */}
      <div className="flex flex-wrap gap-6">
        {/* BirdNet / Custom / Perch */}
        {!groupByStatus &&
          !showFamilyChart &&
          ["birdNet", "customModel", "perch"].map((model) => (
            <label
              key={model}
              className="flex items-center gap-2 cursor-pointer font-medium"
              style={{
                color:
                  model === "birdNet"
                    ? "#60a5fa"
                    : model === "customModel"
                    ? "#fbbf24"
                    : "#34d399",
              }}
            >
              <input
                type="checkbox"
                checked={chartFilters[model as keyof typeof chartFilters]}
                onChange={(e) =>
                  setChartFilters({
                    ...chartFilters,
                    [model]: e.target.checked,
                  })
                }
                className="w-4 h-4 accent-current"
              />
              {t(model)}
            </label>
          ))}

        {/* L1 / L3 / Combined */}
        {groupByStatus &&
          ["L1", "L3", "combined"].map((sheet) => (
            <label
              key={sheet}
              className={`flex items-center gap-2 cursor-pointer font-medium ${
                sheet === "combined" ? "text-yellow-400" : "text-indigo-400"
              }`}
            >
              <input
                type="checkbox"
                checked={selectedSheets.includes(sheet as "L1" | "L3" | "combined")}
                onChange={() => toggleSheet(sheet as "L1" | "L3" | "combined")}
                className="w-4 h-4 accent-current"
              />
              {sheet === "combined" ? t("combined") : sheet.toUpperCase()}
            </label>
          ))}
      </div>

      {/* Right side (toggles row) */}
      <div className="flex gap-6">{children}</div>
    </div>
  );
};

export default FilterBar;
