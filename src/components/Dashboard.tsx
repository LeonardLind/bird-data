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
  const [chartFilters, setChartFilters] = useState({ birdNet: true, customModel: true, perch: true });
  const [groupByStatus, setGroupByStatus] = useState(false);
  const [statusSheet, setStatusSheet] = useState<"L1" | "L3" | "combined">("combined");
  const [showFamilyChart, setShowFamilyChart] = useState(false);

  const handleFileUpload = async (file: File) => {
    try {
      const speciesData = await parseExcel(file);
      setData(speciesData);

      const statuses = await parseStatusSheets(file);
      setStatusRecords(statuses);

      const families = await parseFamily(file);
      console.log("Parsed families:", families); // debug
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

    let filteredStatus: StatusRecord[];
    if (statusSheet === "L1") filteredStatus = statusRecords.filter((r) => r.sheet === "L1");
    else if (statusSheet === "L3") filteredStatus = statusRecords.filter((r) => r.sheet === "L3");
    else filteredStatus = statusRecords;

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
  }, [filteredData, statusRecords, groupByStatus, statusSheet]);

  const totalSpecies = data.length;
  const detectedSpecies = data.filter((bird) => bird.max > 0).length;

  return (
    <div style={{ padding: 24, background: "#111827", minHeight: "100vh", color: "#fff" }}>
      <h1 style={{ fontSize: 28, fontWeight: 700, marginBottom: 24 }}>Bird Data Dashboard</h1>

      <FileUploader onFileSelected={handleFileUpload} />

      {data.length === 0 ? (
        <p style={{ marginTop: 16, color: "#9ca3af" }}>Please upload a file to see insights.</p>
      ) : (
        <>
          {/* KPI Cards */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 16, marginBottom: 24 }}>
            <KPICard title="Total Species" value={totalSpecies} />
            <KPICard title="Detected Species" value={detectedSpecies} />
          </div>

          {/* Filter Bar */}
          <FilterBar
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            chartFilters={chartFilters}
            setChartFilters={setChartFilters}
          />

          {/* Group by Status Checkbox */}
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 16, marginBottom: 8 }}>
            <input type="checkbox" checked={groupByStatus} onChange={(e) => setGroupByStatus(e.target.checked)} id="groupByStatus" />
            <label htmlFor="groupByStatus">Group by Conservation Status</label>
          </div>

          {groupByStatus && (
            <div style={{ display: "flex", gap: 16, marginTop: 8, marginBottom: 16 }}>
              {["L1", "L3", "combined"].map((sheet) => (
                <label key={sheet} style={{ display: "flex", alignItems: "center", gap: 4 }}>
                  <input
                    type="radio"
                    name="statusSheet"
                    value={sheet}
                    checked={statusSheet === sheet}
                    onChange={() => setStatusSheet(sheet as "L1" | "L3" | "combined")}
                  />
                  {sheet.toUpperCase()}
                </label>
              ))}
            </div>
          )}

          {/* Family Chart Checkbox */}
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 16, marginBottom: 16 }}>
            <input type="checkbox" checked={showFamilyChart} onChange={(e) => setShowFamilyChart(e.target.checked)} id="showFamilyChart" />
            <label htmlFor="showFamilyChart">Show Family Chart</label>
          </div>

          {/* Chart Section */}
          {showFamilyChart ? (
            <FamilyBarChart data={familyRecords} searchTerm={searchTerm} />
          ) : (
            <BirdPieChart data={dataForChart} chartFilters={chartFilters} groupByStatus={groupByStatus} />
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
