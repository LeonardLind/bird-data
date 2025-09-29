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

  // Handle file upload
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

  // Apply search filter
  const filteredData = useMemo(() => {
    return data.filter((bird) =>
      searchTerm
        ? bird.species.toLowerCase().includes(searchTerm.toLowerCase())
        : true
    );
  }, [data, searchTerm]);

  // Prepare data for pie chart
  const dataForChart = useMemo(() => {
    if (!groupByStatus || statusRecords.length === 0) {
      // Top 10 species chart
      return filteredData;
    }

    // Group totals by status
    const statusTotals: Record<string, number> = {};

    statusRecords.forEach(({ status }) => {
      statusTotals[status] = (statusTotals[status] || 0) + 1;
    });

    // Convert to array for the pie chart
    return Object.entries(statusTotals).map(([status, value]) => ({
      id: status,
      label: status,
      value,
      color: "#60a5fa", // we can adjust colors by status if needed
    }));
  }, [filteredData, statusRecords, groupByStatus]);

  // KPI Calculations
  const totalSpecies = data.length;
  const detectedSpecies = data.filter((bird) => bird.max > 0).length;

  return (
    <div className="p-6 bg-gray-900 min-h-screen text-gray-100">
      <h1 className="text-3xl font-bold mb-6">Bird Data Dashboard</h1>

      {/* File Upload */}
      <FileUploader onFileSelected={handleFileUpload} />

      {data.length === 0 ? (
        <p className="text-gray-400 mt-4">Please upload a file to see insights.</p>
      ) : (
        <>
          {/* KPI Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mb-6">
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
          <div className="flex items-center gap-2 mt-4 mb-4">
            <input
              type="checkbox"
              checked={groupByStatus}
              onChange={(e) => setGroupByStatus(e.target.checked)}
              id="groupByStatus"
              className="accent-blue-400"
            />
            <label htmlFor="groupByStatus">Group by Conservation Status</label>
          </div>

          {/* Chart */}
          <BirdPieChart
            data={dataForChart}
            chartFilters={chartFilters}
            groupByStatus={groupByStatus}
          />

          {/* Result Count */}
          <p className="text-gray-400 mt-4">
            Showing {filteredData.length} of {totalSpecies} species
          </p>
        </>
      )}
    </div>
  );
};

export default Dashboard;
