// src/components/FilterBar.tsx
import React from "react";

interface FilterBarProps {
  searchTerm: string;
  setSearchTerm: (val: string) => void;
  chartFilters: { birdNet: boolean; customModel: boolean; perch: boolean };
  setChartFilters: (
    val: { birdNet: boolean; customModel: boolean; perch: boolean }
  ) => void;
  children?: React.ReactNode; // 👈 allow extra controls
}

const FilterBar: React.FC<FilterBarProps> = ({
  searchTerm,
  setSearchTerm,
  chartFilters,
  setChartFilters,
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

      {/* Chart Filters */}
      <div className="flex gap-6 items-center">
        {["birdNet", "customModel", "perch"].map((model) => (
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

        {/* ✅ Extra controls passed from Dashboard */}
        {children}
      </div>
    </div>
  );
};

export default FilterBar;
