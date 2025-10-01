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
import { useTranslation } from "react-i18next";

export interface FamilyRecord {
  family: string;
}

interface FamilyBarChartProps {
  data: FamilyRecord[];
  searchTerm?: string; 
}

const FamilyBarChart: React.FC<FamilyBarChartProps> = ({ data, searchTerm = "" }) => {
  const { t } = useTranslation();

  const chartData = useMemo(() => {
    const counts: Record<string, number> = {};

    data.forEach((record) => {
      const fam = record.family || t("unknown");
      if (searchTerm && !fam.toLowerCase().includes(searchTerm.toLowerCase())) return;
      counts[fam] = (counts[fam] || 0) + 1;
    });

    return Object.entries(counts)
      .map(([family, value]) => ({
        family,
        value,
      }))
      .sort((a, b) => b.value - a.value);
  }, [data, searchTerm, t]);

  return (
    <div className="bg-[#141b2d] border border-gray-700 rounded-2xl shadow-xl p-5 mt-6">
      <h3 className="text-xl font-semibold mb-4 text-indigo-300 tracking-wide">
        {t("familyChartTitle")}
      </h3>
      <ResponsiveContainer width="100%" height={436}>
        <BarChart data={chartData} margin={{ top: 10, right: 20, left: 0, bottom: 50 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#2d3748" />
          <XAxis
            dataKey="family"
            angle={-40}
            textAnchor="end"
            interval={0}
            tick={{ fill: "#cbd5e1", fontSize: 12 }}
          />
          <YAxis tick={{ fill: "#cbd5e1", fontSize: 12 }} />
          <Tooltip
            contentStyle={{
              backgroundColor: "#1e293b",
              border: "1px solid #334155",
              borderRadius: "8px",
              color: "#f8fafc",
            }}
            formatter={(value: number) => [
              t("tooltip.species", { count: value }),
              t("tooltip.countLabel"),
            ]}
          />
          <Bar
            dataKey="value"
            fill="url(#barGradient)"
            radius={[8, 8, 0, 0]}
            barSize={36}
          />
          <defs>
            <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#60a5fa" stopOpacity={0.9} />
              <stop offset="100%" stopColor="#2563eb" stopOpacity={0.6} />
            </linearGradient>
          </defs>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default FamilyBarChart;
