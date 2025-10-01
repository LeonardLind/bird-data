// src/components/EmptyState.tsx
import React from "react";
import FileUploader from "./FileUploader";

interface EmptyStateProps {
  onFileSelected: (file: File) => void;
}

const DefaultFileUploader: React.FC<EmptyStateProps> = ({ onFileSelected }) => {
  return (
    <div className="flex flex-col items-center justify-center h-[60vh] gap-6 p-10">
      <div className="w-full max-w-sm">
        <FileUploader onFileSelected={onFileSelected} />
      </div>
      <p className="text-gray-400 text-center italic">
       Please upload the Bird Data (.xlsm) file to see insights.
      </p>
    </div>
  );
};

export default DefaultFileUploader;
