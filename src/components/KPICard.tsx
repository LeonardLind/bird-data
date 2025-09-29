// src/components/KPICard.tsx
import React from "react";

interface KPICardProps {
  title: string;
  value: number | string;
}

const KPICard: React.FC<KPICardProps> = ({ title, value }) => {
  return (
    <div className="bg-gray-850/80 backdrop-blur-sm rounded-2xl shadow-xl p-6 text-center w-full transition-transform transform hover:scale-105">
      <h3 className="text-gray-400 text-sm">{title}</h3>
      <p className="text-3xl font-bold text-white mt-2">{value}</p>
    </div>
  );
};

export default KPICard;
