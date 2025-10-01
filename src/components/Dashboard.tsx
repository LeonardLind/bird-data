// src/components/Dashboard.tsx
import React, { useState, useMemo } from "react";
import type { BirdRecord } from "../utils/parseExcel";
import { parseExcel } from "../utils/parseExcel";
import { parseStatusSheets, type StatusRecord } from "../utils/parseStatusSheets";
import { parseFamily, type FamilyRecord } from "../utils/parseFamily";
import FileUploader from "./FileUploader";
import KPICard from "./KPICard";
import BirdPieChart from "./BirdPieChart";
import FamilyBarChart from "./FamilyBarChart";
import FilterBar from "./FilterBar";

const Dashboard: React.FC = () => {
  const [data, setData] = useState<BirdRecord[]>([]);
  const [statusRecords, setStatusRecords] = useState<StatusRecord[]>([]);
  const [familyRecords, setFamilyRecords] = useState<FamilyRecord[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [chartFilters, setChartFilters] = useState({
    birdNet: true,
    customModel: true,
    perch: true,
  });
  const [groupByStatus, setGroupByStatus] = useState(false);
  const [selectedSheets, setSelectedSheets] = useState<("L1" | "L3" | "combined")[]>([]);
  const [showFamilyChart, setShowFamilyChart] = useState(false);

  const handleFileUpload = async (file: File) => {
    try {
      const speciesData = await parseExcel(file);
      setData(speciesData);

      const statuses = await parseStatusSheets(file);
      setStatusRecords(statuses);

      const families = await parseFamily(file);
      console.log("Parsed families:", families);
      setFamilyRecords(families);
    } catch (err) {
      console.error("Failed to parse file:", err);
    }
  };

  const filteredData = useMemo(
    () =>
      data.filter((bird) =>
        searchTerm ? bird.species.toLowerCase().includes(searchTerm.toLowerCase()) : true
      ),
    [data, searchTerm]
  );

  const dataForChart = useMemo(() => {
  if (!groupByStatus || statusRecords.length === 0) return filteredData;

  let filteredStatus: StatusRecord[] = [];
  if (selectedSheets.length === 0) {
    filteredStatus = statusRecords;
  } else if (selectedSheets.includes("combined")) {
    // Combined = include both L1 + L3
    filteredStatus = statusRecords.filter(
      (r) => r.sheet === "L1" || r.sheet === "L3"
    );
  } else {
    filteredStatus = statusRecords.filter((r) =>
      selectedSheets.includes(r.sheet as "L1" | "L3" | "combined")
    );
  }

  const statusTotals: Record<string, number> = {};
  filteredStatus.forEach(({ status }) => {
    statusTotals[status] = (statusTotals[status] || 0) + 1;
  });

  return Object.entries(statusTotals).map(([status, value]) => ({
    id: status,
    label: status,
    value,
    color: "#60a5fa",
  }));
}, [filteredData, statusRecords, groupByStatus, selectedSheets]);


  const totalSpecies = data.length;
  const detectedSpecies = data.filter((bird) => bird.max > 0).length;

  // ✅ Updated toggle logic
  const toggleSheet = (sheet: "L1" | "L3" | "combined") => {
  setSelectedSheets((prev) => {
    if (sheet === "combined") {
      // Toggle combined
      return prev.includes("combined") ? [] : ["combined"];
    } else {
      if (prev.includes("combined")) {
        // If combined was active, switch to the one clicked
        return [sheet];
      }
      // Normal toggle: allow L1 or L3 exclusively
      return prev.includes(sheet) ? [] : [sheet];
    }
  });
};


  return (
    <div style={{ padding: 24, background: "#111827", minHeight: "100vh", color: "#fff" }}>
      <FileUploader onFileSelected={handleFileUpload} />

      {data.length === 0 ? (
        <p style={{ marginTop: 16, color: "#9ca3af" }}>
          Please upload a file to see insights.
        </p>
      ) : (
        <>
          {/* KPI Cards */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
              gap: 16,
              marginBottom: 24,
            }}
          >
            <KPICard title="Total Species" value={totalSpecies} />
            <KPICard title="Detected Species" value={detectedSpecies} />
          </div>

          {/* Filter Bar */}
          <FilterBar
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            chartFilters={chartFilters}
            setChartFilters={setChartFilters}
            groupByStatus={groupByStatus}
            showFamilyChart={showFamilyChart}
            selectedSheets={selectedSheets}
            toggleSheet={toggleSheet}
          >
            {/* Group by Status */}
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={groupByStatus}
                onChange={(e) => {
                  const checked = e.target.checked;
                  setGroupByStatus(checked);
                  if (checked) setShowFamilyChart(false); // disable family if status is on
                }}
              />
              IUCN Status
            </label>

            {/* Show Family Chart */}
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={showFamilyChart}
                onChange={(e) => {
                  const checked = e.target.checked;
                  setShowFamilyChart(checked);
                  if (checked) setGroupByStatus(false); // disable status if family is on
                }}
              />
              Family Chart
            </label>
          </FilterBar>

          {/* Chart Section */}
          {showFamilyChart ? (
            <FamilyBarChart data={familyRecords} searchTerm={searchTerm} />
          ) : (
            <BirdPieChart
              data={dataForChart}
              chartFilters={chartFilters}
              groupByStatus={groupByStatus}
            />
          )}

          {/* Result Count */}
          <p style={{ color: "#9ca3af", marginTop: 16 }}>
            Showing {filteredData.length} of {totalSpecies} species
          </p>
        </>
      )}
    </div>
  );
};

export default Dashboard;
