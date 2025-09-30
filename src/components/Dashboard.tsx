// src/components/Dashboard.tsx
import React, { useState, useMemo } from "react";
import type { BirdRecord } from "../utils/parseExcel";
import { parseExcel } from "../utils/parseExcel";
import { parseStatusSheets, type StatusRecord } from "../utils/parseStatusSheets";
import FileUploader from "./FileUploader";
import KPICard from "./KPICard";
import BirdPieChart from "./BirdPieChart";
import FilterBar from "./FilterBar";

const Dashboard: React.FC = () => {
  const [data, setData] = useState<BirdRecord[]>([]);
  const [statusRecords, setStatusRecords] = useState<StatusRecord[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [chartFilters, setChartFilters] = useState({
    birdNet: true,
    customModel: true,
    perch: true,
  });
  const [groupByStatus, setGroupByStatus] = useState(false);
  const [statusSheet, setStatusSheet] = useState<"L1" | "L3" | "combined">("combined");

  const handleFileUpload = async (file: File) => {
    try {
      const speciesData = await parseExcel(file);
      setData(speciesData);

      const statuses = await parseStatusSheets(file);
      setStatusRecords(statuses);
    } catch (err) {
      console.error("Failed to parse file:", err);
    }
  };

  const filteredData = useMemo(() => {
    return data.filter((bird) =>
      searchTerm ? bird.species.toLowerCase().includes(searchTerm.toLowerCase()) : true
    );
  }, [data, searchTerm]);

  const dataForChart = useMemo(() => {
    if (!groupByStatus || statusRecords.length === 0) {
      return filteredData;
    }

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
    <div className="p-6 bg-gray-900 min-h-screen text-gray-100">
      <h1 className="text-3xl font-bold mb-6">Bird Data Dashboard</h1>

      <FileUploader onFileSelected={handleFileUpload} />

      {data.length === 0 ? (
        <p className="text-gray-400 mt-4">Please upload a file to see insights.</p>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mb-6">
            <KPICard title="Total Species" value={totalSpecies} />
            <KPICard title="Detected Species" value={detectedSpecies} />
          </div>

          <FilterBar
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            chartFilters={chartFilters}
            setChartFilters={setChartFilters}
          />

          <div className="flex items-center gap-2 mt-4 mb-2">
            <input
              type="checkbox"
              checked={groupByStatus}
              onChange={(e) => setGroupByStatus(e.target.checked)}
              id="groupByStatus"
              className="accent-blue-400"
            />
            <label htmlFor="groupByStatus">Group by Conservation Status</label>
          </div>

          {groupByStatus && (
            <div className="flex items-center gap-4 mt-2 mb-4">
              {["L1", "L3", "combined"].map((sheet) => (
                <label key={sheet} className="flex items-center gap-1">
                  <input
                    type="radio"
                    name="statusSheet"
                    value={sheet}
                    checked={statusSheet === sheet}
                    onChange={() => setStatusSheet(sheet as "L1" | "L3" | "combined")}
                    className="accent-blue-400"
                  />
                  {sheet.toUpperCase()}
                </label>
              ))}
            </div>
          )}

          <BirdPieChart
            data={dataForChart}
            chartFilters={chartFilters}
            groupByStatus={groupByStatus}
          />

          <p className="text-gray-400 mt-4">
            Showing {filteredData.length} of {totalSpecies} species
          </p>
        </>
      )}
    </div>
  );
};

export default Dashboard;
