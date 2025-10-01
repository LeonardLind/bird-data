// src/components/FamilyBarChart.tsx
import React, { useMemo } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";

export interface FamilyRecord {
  family: string;
}

interface FamilyBarChartProps {
  data: FamilyRecord[];
  searchTerm?: string; // <-- make searchTerm optional
}

const FamilyBarChart: React.FC<FamilyBarChartProps> = ({ data, searchTerm = "" }) => {
  // Group and count species per family
  const chartData = useMemo(() => {
    const counts: Record<string, number> = {};

    data.forEach((record) => {
      const fam = record.family || "Unknown";
      if (searchTerm && !fam.toLowerCase().includes(searchTerm.toLowerCase())) return;
      counts[fam] = (counts[fam] || 0) + 1;
    });

    return Object.entries(counts)
      .map(([family, value]) => ({
        family,
        value,
      }))
      .sort((a, b) => b.value - a.value);
  }, [data, searchTerm]);

  return (
    <div className=" p-4 rounded-2xl shadow-md mt-6">
      <h3 className="text-lg font-bold mb-3">Species per Family</h3>
      <ResponsiveContainer width="100%" height={400}>
        <BarChart data={chartData} margin={{ top: 10, right: 20, left: 0, bottom: 50 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#444" />
          <XAxis
            dataKey="family"
            angle={-40}
            textAnchor="end"
            interval={0}
            tick={{ fill: "#ddd", fontSize: 12 }}
          />
          <YAxis tick={{ fill: "#ddd" }} />
          <Tooltip
            contentStyle={{ backgroundColor: "#1f2937", border: "none", color: "#fff" }}
            formatter={(value: number) => [`${value} species`, "Count"]}
          />
          <Bar
            dataKey="value"
            fill="#60a5fa"
            radius={[6, 6, 0, 0]} // rounded top
            barSize={40} // thicker bars
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default FamilyBarChart;
