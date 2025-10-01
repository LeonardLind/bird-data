// src/components/DefaultFileUploader.tsx
import React from "react";
import FileUploader from "./FileUploader";
import { useTranslation } from "react-i18next";

interface EmptyStateProps {
  onFileSelected: (file: File) => void;
}

const DefaultFileUploader: React.FC<EmptyStateProps> = ({ onFileSelected }) => {
  const { t, i18n } = useTranslation();

  // Function to toggle language
  const toggleLanguage = () => {
    i18n.changeLanguage(i18n.language === "en" ? "pt-BR" : "en");
  };

  return (
    <div className="flex flex-col items-center justify-center h-[60vh] gap-6 p-10">
      <div className="w-full max-w-sm">
        <FileUploader onFileSelected={onFileSelected} />
      </div>

      <p className="text-gray-400 text-center italic">
        {t("uploadPrompt")}
      </p>

      <button
        onClick={toggleLanguage}
        className="px-3 py-1.5 rounded-lg bg-[#141b2d] border border-indigo-500/40  hover:bg-indigo-600/20 transition-colors text-indigo-300 text-sm font-medium shadow-sm shadow-indigo-500/10">
        {i18n.language === "en" ? t("translatePortuguese") : t("translateEnglish")}
      </button>
    </div>
  );
};

export default DefaultFileUploader;
