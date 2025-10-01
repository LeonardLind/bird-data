// src/components/FilterBar.tsx
import React from "react";

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
  return (
    <div className="bg-gray-850/80 backdrop-blur-sm rounded-2xl shadow-lg p-4 flex flex-col md:flex-row items-center gap-4 justify-between">
      {/* Search Bar */}
      <input
        type="text"
        placeholder="Search species..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="p-2 rounded-lg w-full md:w-1/3 bg-gray-900 border border-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
      />

      {/* Filters row */}
      <div className="flex gap-6">
        {/* BirdNet / Custom / Perch (hide if groupByStatus or family active) */}
        {!groupByStatus &&
          !showFamilyChart &&
          ["birdNet", "customModel", "perch"].map((model) => (
            <label
              key={model}
              className="flex items-center gap-1 cursor-pointer"
              style={{
                color:
                  model === "birdNet"
                    ? "#60a5fa"
                    : model === "customModel"
                    ? "#f59e0b"
                    : "#10b981",
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
              />
              {model === "birdNet"
                ? "BirdNet"
                : model === "customModel"
                ? "Custom Model"
                : "Perch"}
            </label>
          ))}

        {/* L1 / L3 / Combined checkboxes (only if groupByStatus is on) */}
        {groupByStatus &&
          ["L1", "L3", "combined"].map((sheet) => (
            <label
              key={sheet}
              className={`flex items-center gap-1 cursor-pointer ${
                sheet === "combined" ? "text-yellow-400" : "text-blue-400"
              }`}
            >
              <input
  type="checkbox"
  checked={selectedSheets.includes(sheet as "L1" | "L3" | "combined")}
  onChange={() => toggleSheet(sheet as "L1" | "L3" | "combined")}
/>

              {sheet.toUpperCase()}
            </label>
          ))}
      </div>

      {/* Right side (toggles row) */}
      <div className="flex gap-6">{children}</div>
    </div>
  );
};

export default FilterBar;
