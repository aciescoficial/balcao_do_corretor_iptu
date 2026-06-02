
import React from 'react';
import { Download, Upload } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { useImportExport } from './import/useImportExport';
import ImportPreview from './import/ImportPreview';
import ImportInstructions from './import/ImportInstructions';
import { useAuth } from '@/components/auth';
import { useToast } from '@/hooks/use-toast';
import { logOperation } from '@/components/audit/auditLogService';

interface ImportExportEmpresasProps {
  onImportSuccess: () => void;
}

const ImportExportEmpresas: React.FC<ImportExportEmpresasProps> = ({ onImportSuccess }) => {
  const {
    isImportDialogOpen,
    setIsImportDialogOpen,
    isExporting,
    isImporting,
    importData,
    rawCsvData,
    csvHeaders,
    importErrors,
    fieldMapping,
    fileInputRef,
    handleFileSelect,
    handleFieldMappingChange,
    handleExportEmpresas,
    handleConfirmImport
  } = useImportExport({ 
    onImportSuccess,
    onExportSuccess: async (format, count) => {
      // Log export operation
      await logOperation({
        eventType: 'export',
        entityType: 'empresa',
        format,
        recordCount: count,
        details: `Exportação de ${count} empresas em ${format.toUpperCase()}`
      });
    } 
  });
  
  const { isAdmin } = useAuth();
  const { toast } = useToast();
  
  // Se não for admin, não mostra opções de importação/exportação
  if (!isAdmin) {
    return (
      <div className="space-y-6">
        <div className="border rounded-lg p-6 bg-slate-50">
          <p className="text-center text-gray-500">
            Apenas administradores podem acessar as funcionalidades de importação e exportação.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="border rounded-lg p-6 bg-slate-50">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
          <div>
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <Download className="h-5 w-5" />
              Importação e Exportação de Empresas
            </h3>
            <p className="text-sm text-gray-600 mt-1">
              Importe ou exporte dados de empresas conveniadas em formato CSV.
            </p>
          </div>
          
          <div className="flex gap-2 mt-4 md:mt-0">
            <Button
              variant="outline"
              onClick={handleExportEmpresas}
              disabled={isExporting}
              className="flex items-center gap-2"
            >
              <Download className="h-4 w-4" />
              {isExporting ? 'Exportando...' : 'Exportar CSV'}
            </Button>
            
            <Button
              onClick={() => fileInputRef.current?.click()}
              disabled={isImporting}
              className="flex items-center gap-2"
            >
              <Upload className="h-4 w-4" />
              {isImporting ? 'Importando...' : 'Importar CSV'}
            </Button>
            
            <input 
              type="file" 
              ref={fileInputRef}
              onChange={handleFileSelect}
              accept=".csv"
              className="hidden" 
            />
          </div>
        </div>
        
        <ImportInstructions />
        
        <Dialog open={isImportDialogOpen} onOpenChange={setIsImportDialogOpen}>
          <DialogContent className="max-w-4xl">
            <DialogHeader>
              <DialogTitle>Revisar Dados para Importação</DialogTitle>
              <DialogDescription>
                Mapeie os campos do seu arquivo CSV para os campos do sistema e revise os dados antes de confirmar a importação.
              </DialogDescription>
            </DialogHeader>
            
            <ImportPreview 
              data={importData}
              rawData={rawCsvData}
              csvHeaders={csvHeaders} 
              errors={importErrors}
              fieldMapping={fieldMapping}
              onFieldMappingChange={handleFieldMappingChange}
              onConfirm={handleConfirmImport}
              onCancel={() => setIsImportDialogOpen(false)}
              isImporting={isImporting}
            />
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default ImportExportEmpresas;
