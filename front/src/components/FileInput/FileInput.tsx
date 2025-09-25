// src/components/Forms/CustomFileInput.tsx

import { useState, useRef } from 'react';

// 1. Definimos las props que el componente aceptará
interface CustomFileInputProps {
  onFileSelect: (file: File | null) => void;
}

export default function CustomFileInput({ onFileSelect }: CustomFileInputProps) {
  const [fileName, setFileName] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0] || null;
    
    // 2. Usamos la prop para enviar el objeto File completo (o null) al padre
    onFileSelect(file); 
    
    // Actualizamos el nombre del archivo solo para la UI
    setFileName(file ? file.name : '');
  };

  const handleButtonClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="flex-grow flex items-center gap-3">
      <div className="flex-grow flex items-center w-full rounded-md border border-gray-300 bg-gray-100 shadow-sm sm:text-sm h-10 px-3 text-gray-500 truncate">
        {fileName || 'Ningún archivo seleccionado'}
      </div>

      <button
        type="button"
        onClick={handleButtonClick}
        className="shrink-0 rounded-md bg-[#F46546] py-2 px-6 text-sm font-medium text-white shadow-sm hover:bg-opacity-90 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2"
      >
        Examinar
      </button>

      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        className="hidden"
      />
    </div>
  );
}