// src/components/FamilyBarChart.tsx
import React, { useMemo } from "react";
import { ResponsiveBar } from "@nivo/bar";
import type { FamilyRecord } from "../utils/parseFamily";

interface FamilyBarChartProps {
  data: FamilyRecord[];
  searchTerm?: string;
}

const FamilyBarChart: React.FC<FamilyBarChartProps> = ({ data, searchTerm = "" }) => {
  const chartData = useMemo(() => {
    const filtered = data.filter((d) =>
      searchTerm ? d.family.toLowerCase().includes(searchTerm.toLowerCase()) : true
    );

    const counts: Record<string, number> = {};
    filtered.forEach(({ family }) => {
      counts[family] = (counts[family] || 0) + 1;
    });

    return Object.entries(counts)
      .map(([family, count]) => ({ family, count }))
      .sort((a, b) => b.count - a.count);
  }, [data, searchTerm]);

  console.log("Family chartData:", chartData); // debug

  return (
    <div style={{ height: 500, width: "100%", background: "#1f2937", padding: 20 }}>
      <ResponsiveBar
        data={chartData}
        keys={["count"]}
        indexBy="family"
        margin={{ top: 40, right: 40, bottom: 150, left: 60 }}
        padding={0.3}
        valueScale={{ type: "linear" }}
        indexScale={{ type: "band", round: true }}
        colors={{ scheme: "paired" }}
        axisBottom={{
          tickRotation: 45,
          tickSize: 5,
          tickPadding: 5,
          tickValues: chartData.length > 0 ? undefined : [],
        }}
        axisLeft={{
          tickSize: 5,
          tickPadding: 5,
        }}
        tooltip={({ value, indexValue }) => (
          <div style={{ background: "#111827", color: "#fff", padding: "4px 8px", borderRadius: 4 }}>
            <strong>{indexValue}</strong>: {value} species
          </div>
        )}
      />
    </div>
  );
};

export default FamilyBarChart;
