// src/components/TopSpeciesList.tsx
import React from "react";
import { useTranslation } from "react-i18next";

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

const TopSpeciesList: React.FC<TopSpeciesListProps> = ({
  items,
  hoveredId,
  setHoveredId,
  groupByStatus = false
}) => {
  const { t } = useTranslation();

  return (
    <div className="w-72 lg:w-80 xl:w-96 bg-[#141b2d] border border-gray-700 rounded-2xl shadow-lg p-6">
      <h3 className="text-lg font-semibold mb-4 text-indigo-300">
        {groupByStatus ? t("conservationStatus") : t("topSpecies")}
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
                ? `${item.id} – ${t(`status.${item.id}`, { defaultValue: t("status.unknown") })}`
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
