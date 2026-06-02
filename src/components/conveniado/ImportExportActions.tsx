
import React, { useRef } from 'react';
import { FileUp, FileDown } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ImportExportActionsProps {
  onImportClick: () => void;
  onFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onExportCsv: () => void;
  onExportXml: () => void;
  fileInputRef: React.RefObject<HTMLInputElement>;
  isAdmin?: boolean;
}

export const ImportExportActions: React.FC<ImportExportActionsProps> = ({ 
  onImportClick,
  onFileChange,
  onExportCsv,
  onExportXml,
  fileInputRef,
  isAdmin = false
}) => {
  if (!isAdmin) {
    return null;
  }
  
  return (
    <div className="mt-5 flex justify-between items-center border-t pt-5">
      <div className="font-medium">Importar/Exportar Conveniados</div>
      <div className="flex space-x-3">
        <input 
          type="file" 
          ref={fileInputRef} 
          onChange={onFileChange} 
          accept=".csv,.xml" 
          style={{ display: 'none' }}
        />
        <Button 
          variant="outline"
          onClick={onImportClick}
          className="flex gap-2 items-center"
        >
          <FileUp size={16} />
          Importar
        </Button>
        <div className="flex space-x-2">
          <Button 
            variant="outline" 
            onClick={onExportCsv}
            className="flex gap-2 items-center"
          >
            <FileDown size={16} />
            CSV
          </Button>
          <Button 
            variant="outline" 
            onClick={onExportXml}
            className="flex gap-2 items-center"
          >
            <FileDown size={16} />
            XML
          </Button>
        </div>
      </div>
    </div>
  );
};
