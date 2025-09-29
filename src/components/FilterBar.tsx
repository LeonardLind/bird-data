// src/components/FilterBar.tsx
import React from "react";

interface FilterBarProps {
  searchTerm: string;
  setSearchTerm: (val: string) => void;
  chartFilters: { birdNet: boolean; customModel: boolean; perch: boolean };
  setChartFilters: (
    val: { birdNet: boolean; customModel: boolean; perch: boolean }
  ) => void;
}

const FilterBar: React.FC<FilterBarProps> = ({
  searchTerm,
  setSearchTerm,
  chartFilters,
  setChartFilters,
}) => {
  const handleChartFilterChange = (key: keyof typeof chartFilters) => {
    setChartFilters({ ...chartFilters, [key]: !chartFilters[key] });
  };

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
      <div className="flex gap-6">
        {(["birdNet", "customModel", "perch"] as const).map((key) => (
          <label key={key} className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={chartFilters[key]}
              onChange={() => handleChartFilterChange(key)}
              className="w-4 h-4 accent-indigo-500"
            />
            <span>
              {key === "birdNet"
                ? "BirdNET"
                : key === "customModel"
                ? "Custom Model"
                : "Perch"}
            </span>
          </label>
        ))}
      </div>
    </div>
  );
};

export default FilterBar;
