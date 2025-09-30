// src/components/BirdPieChart.tsx
import React, { useState, useMemo } from "react";
import { ResponsivePie, type PieTooltipProps } from "@nivo/pie";
import type { BirdRecord } from "../utils/parseExcel";
import TopSpeciesList from "./TopSpeciesList";
import { getFilteredData, getTopSpecies } from "../utils/chartUtils";

interface StatusChartItem {
  id: string;
  label: string;
  value: number;
  color: string;
}

interface BirdPieChartProps {
  data: BirdRecord[] | StatusChartItem[];
  chartFilters: { birdNet: boolean; customModel: boolean; perch: boolean };
  groupByStatus?: boolean;
}

const statusColors: Record<string, string> = {
  LC: "#22c55e",
  NT: "#eab308",
  VU: "#f97316",
  EN: "#ef4444",
  CR: "#b91c1c",
  NE: "#6b7280",
  DD: "#6b7280",
  EW: "#6b7280",
  EX: "#6b7280",
  Unknown: "#6b7280"
};

const BirdPieChart: React.FC<BirdPieChartProps> = ({ data, chartFilters, groupByStatus = false }) => {
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  const chartData = useMemo(() => {
    if (groupByStatus) {
      const items = data as StatusChartItem[];
      return items
        .map((item) => ({
          ...item,
          color: statusColors[item.id] || statusColors.Unknown
        }))
        .sort((a, b) => b.value - a.value);
    }

    const birdData = getFilteredData(data as BirdRecord[], "", chartFilters);
    return getTopSpecies(birdData);
  }, [data, chartFilters, groupByStatus]);

  return (
    <div className="bg-gray-850/80 backdrop-blur-sm rounded-2xl shadow-lg p-4 flex flex-col md:flex-row gap-8">
      {/* Pie Chart */}
      <div className="flex-1 h-[500px]">
        <ResponsivePie
          data={chartData}
          margin={{ top: 40, right: 40, bottom: 40, left: 40 }}
          innerRadius={0.6}
          padAngle={1}
          cornerRadius={5}
          colors={(d) => (d.data as any).color}
          activeOuterRadiusOffset={hoveredId ? 15 : 0}
          arcLabelsSkipAngle={10}
          arcLabelsTextColor={{ from: "color", modifiers: [["darker", 2]] }}
          arcLinkLabelsSkipAngle={10}
          arcLinkLabelsTextColor="#fff"
          arcLinkLabelsColor={{ from: "color" }}
          tooltip={({ datum }: PieTooltipProps<any>) => (
            <div className="bg-gray-900 text-gray-100 p-2 rounded shadow">
              <strong>{datum.id}</strong>: {datum.value.toLocaleString()}
            </div>
          )}
          onMouseEnter={(d) => setHoveredId(String(d.id))}
          onMouseLeave={() => setHoveredId(null)}
        />
      </div>

      {/* Sidebar List */}
      <TopSpeciesList
        items={chartData}
        hoveredId={hoveredId}
        setHoveredId={setHoveredId}
        groupByStatus={groupByStatus}
      />
    </div>
  );
};

export default BirdPieChart;
