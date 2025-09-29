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
    <div className="w-64 md:w-72 lg:w-80 ml-6">
      <h3 className="text-lg font-bold mb-2">
        {groupByStatus ? "Conservation Status" : "Top Species"}
      </h3>
      <ol className="list-decimal pl-5 space-y-1">
        {items.map((item) => (
          <li
            key={item.id}
            className={`cursor-pointer font-medium ${hoveredId === item.id ? "font-bold" : ""}`}
            style={{ color: item.color }}
            onMouseEnter={() => setHoveredId(item.id)}
            onMouseLeave={() => setHoveredId(null)}
          >
            {groupByStatus
              ? `${item.id} – ${statusNames[item.id] || "Unknown"} (${item.value})`
              : `${item.label} (${item.value})`}
          </li>
        ))}
      </ol>
    </div>
  );
};

export default TopSpeciesList;
