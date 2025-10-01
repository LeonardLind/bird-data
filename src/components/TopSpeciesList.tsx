// src/components/TopSpeciesList.tsx
import React from "react";

interface SpeciesItem {
  id: string;
  label: string;
  value: number;
  color: string;
}

interface TopSpeciesListProps {
  items: SpeciesItem[];
  hoveredId: string | null;
  setHoveredId: (id: string | null) => void;
  groupByStatus?: boolean;
}

const statusNames: Record<string, string> = {
  NE: "Not Evaluated",
  DD: "Data Deficient",
  LC: "Least Concern",
  NT: "Near Threatened",
  VU: "Vulnerable",
  EN: "Endangered",
  CR: "Critically Endangered",
  EW: "Extinct in the Wild",
  EX: "Extinct"
};

const TopSpeciesList: React.FC<TopSpeciesListProps> = ({
  items,
  hoveredId,
  setHoveredId,
  groupByStatus = false
}) => {
  return (
  <div className="w-72 lg:w-80 xl:w-96 bg-[#141b2d] border border-gray-700 rounded-2xl shadow-lg p-6">
    <h3 className="text-lg font-semibold mb-4 text-indigo-300">
      {groupByStatus ? "Conservation Status" : "Top Species"}
    </h3>
    <ol>
      {items.map((item) => (
        <li
          key={item.id}
          className={`cursor-pointer flex items-center justify-between px-3 py-2 rounded-lg transition ${
            hoveredId === item.id
              ? "bg-opacity-20 font-bold scale-[1.02]"
              : "opacity-90"
          }`}
          style={{
            backgroundColor:
              hoveredId === item.id ? `${item.color}33` : "transparent",
            color: item.color,
          }}
          onMouseEnter={() => setHoveredId(item.id)}
          onMouseLeave={() => setHoveredId(null)}
        >
          <span>
            {groupByStatus
              ? `${item.id} – ${statusNames[item.id] || "Unknown"}`
              : item.label}
          </span>
          <span className="text-sm text-gray-300">({item.value})</span>
        </li>
      ))}
    </ol>
  </div>
);

};

export default TopSpeciesList;
