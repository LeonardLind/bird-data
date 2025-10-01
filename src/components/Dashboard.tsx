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
import DefaultFileUploader from "./DefaultFileUploader";

import { useTranslation } from "react-i18next";

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

  // 👇 get t() function + language toggle
  const { t, i18n } = useTranslation();
  const toggleLanguage = () => {
    i18n.changeLanguage(i18n.language === "en" ? "pt-BR" : "en");
  };

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

  // Toggle logic
  const toggleSheet = (sheet: "L1" | "L3" | "combined") => {
    setSelectedSheets((prev) => {
      if (sheet === "combined") {
        return prev.includes("combined") ? [] : ["combined"];
      } else {
        if (prev.includes("combined")) {
          return [sheet];
        }
        return prev.includes(sheet) ? [] : [sheet];
      }
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0f172a] via-[#1e293b] to-[#0f172a] text-white p-8">
      <div className="max-w-[95rem] mx-auto space-y-5">
        {data.length === 0 ? (
          <div className="flex flex-col items-center gap-6">
            <DefaultFileUploader onFileSelected={handleFileUpload} />
          </div>
        ) : (
          <>
            {/* KPI Cards + FileUploader */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="bg-[#141b2d] p-6 rounded-2xl border border-indigo-500/40 shadow-[0_0_20px_rgba(99,102,241,0.25)]">
                <KPICard title={t("totalSpecies")} value={totalSpecies} />
              </div>
              <div className="bg-[#141b2d] p-6 rounded-2xl border border-emerald-500/40 shadow-[0_0_20px_rgba(16,185,129,0.25)]">
                <KPICard title={t("detectedSpecies")} value={detectedSpecies} />
              </div>
              <div className="bg-[#141b2d] p-6 rounded-2xl border border-orange-400/40 shadow-[0_0_20px_rgba(56,189,248,0.25)] flex items-center justify-center">
                <FileUploader onFileSelected={handleFileUpload} />
              </div>
            </div>

            {/* Filter Bar */}
            <div>
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
                <label className="flex items-center gap-2 text-indigo-400 font-medium">
                  <input
                    type="checkbox"
                    checked={groupByStatus}
                    onChange={(e) => {
                      const checked = e.target.checked;
                      setGroupByStatus(checked);
                      if (checked) setShowFamilyChart(false);
                    }}
                  />
                  {t("iucnStatus")}
                </label>
                <label className="flex items-center gap-2 text-emerald-400 font-medium">
                  <input
                    type="checkbox"
                    checked={showFamilyChart}
                    onChange={(e) => {
                      const checked = e.target.checked;
                      setShowFamilyChart(checked);
                      if (checked) setGroupByStatus(false);
                    }}
                  />
                  {t("familyChart")}
                </label>
                 <button
                 onClick={toggleLanguage}
                 className="px-2 py-1 rounded-lg bg-[#141b2d] border border-indigo-500/40 
           hover:bg-indigo-600/20 transition-colors text-indigo-300 text-xs 
           font-medium shadow-sm shadow-indigo-500/10 whitespace-nowrap">
                  {i18n.language === "en"
                  ? t("translatePortuguese")
                  : t("translateEnglish")}
                  </button>
              </FilterBar>
            </div>

            {/* Chart Section */}
            <div>
              {showFamilyChart ? (
                <FamilyBarChart data={familyRecords} searchTerm={searchTerm} />
              ) : (
                <BirdPieChart
                  data={dataForChart}
                  chartFilters={chartFilters}
                  groupByStatus={groupByStatus}
                />
              )}
            </div>

            {/* Result Count */}
            <p className="text-gray-400 text-sm text-center">
              {t("showingSpecies", {
                count: filteredData.length,
                total: totalSpecies,
              })}
            </p>
          </>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
