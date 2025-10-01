import React, { useState } from "react";

interface FileUploaderProps {
  onFileSelected: (file: File) => void; 
}

const FileUploader: React.FC<FileUploaderProps> = ({ onFileSelected }) => {
  const [error, setError] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setError(null);
    try {
      onFileSelected(file);
    } catch (err) {
      setError("Failed to handle the file.");
      console.error(err);
    }
  };

  return (
    <div>
      <input
        type="file"
        accept=".xls,.xlsx,.xlsm"
        onChange={handleFileChange}
        className="block w-full p-3 rounded-lg bg-gray-900 text-white border border-gray-700 hover:border-blue-500 transition-colors cursor-pointer"
      />
      {error && <p className="text-red-500 mt-2">{error}</p>}
    </div>
  );
};

export default FileUploader;
