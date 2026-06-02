
import { useState, useRef } from 'react';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/components/auth';
import { ImportConveniadoData, ImportValidationData } from '../types';
import { 
  parseCSVFile, 
  parseXMLFile, 
  validateImportData, 
  generateCSVExport, 
  generateXMLExport, 
  downloadFile 
} from '../fileUtils';
import { importConveniados, exportConveniados } from '../conveniadoService';
import { logOperation } from '@/components/audit/auditLogService';

export const useImportExportConveniado = () => {
  const [showImportDialog, setShowImportDialog] = useState(false);
  const [importData, setImportData] = useState<ImportConveniadoData[]>([]);
  const [validationData, setValidationData] = useState<ImportValidationData[]>([]);
  const [importFormat, setImportFormat] = useState<'csv' | 'xml'>('csv');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();
  const { isAdmin } = useAuth();

  const handleImportClick = () => {
    if (!isAdmin) {
      toast({
        title: "Permissão negada",
        description: "Apenas administradores podem importar dados.",
        variant: "destructive",
      });
      return;
    }
    
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
      fileInputRef.current.click();
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!isAdmin) return;
    
    const file = e.target.files?.[0];
    if (file) {
      const fileReader = new FileReader();
      fileReader.onload = (event) => {
        try {
          const content = event.target?.result as string;
          let parsedData: ImportConveniadoData[] = [];
          
          const fileFormat = file.name.toLowerCase().endsWith('.xml') ? 'xml' : 'csv';
          setImportFormat(fileFormat as 'csv' | 'xml');
          
          if (fileFormat === 'xml') {
            parsedData = parseXMLFile(content);
          } else {
            parsedData = parseCSVFile(content);
          }
          
          const validations = validateImportData(parsedData);
          
          setImportData(parsedData);
          setValidationData(validations);
          setShowImportDialog(true);
        } catch (error) {
          console.error("Error parsing file:", error);
          toast({
            title: "Erro ao processar arquivo",
            description: "O arquivo não pôde ser processado. Verifique o formato e tente novamente.",
            variant: "destructive",
          });
        }
      };
      
      fileReader.readAsText(file);
    }
  };

  const handleImportConfirm = async () => {
    if (!isAdmin) {
      toast({
        title: "Permissão negada",
        description: "Apenas administradores podem importar dados.",
        variant: "destructive",
      });
      return;
    }
    
    try {
      setIsSubmitting(true);
      const count = await importConveniados(importData);
      
      // Log the import operation
      await logOperation({
        eventType: 'import',
        entityType: 'conveniado',
        format: importFormat,
        recordCount: count,
        details: `Importação de ${count} conveniados em ${importFormat.toUpperCase()}`
      });
      
      toast({
        title: "Importação realizada com sucesso",
        description: `${count} conveniados foram importados.`,
      });
      
      setShowImportDialog(false);
    } catch (error: any) {
      console.error("Error importing data:", error);
      toast({
        title: "Erro na importação",
        description: error.message || "Ocorreu um erro ao importar os conveniados. Tente novamente.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleExport = async (format: 'csv' | 'xml') => {
    if (!isAdmin) {
      toast({
        title: "Permissão negada",
        description: "Apenas administradores podem exportar dados.",
        variant: "destructive",
      });
      return;
    }
    
    try {
      const conveniados = await exportConveniados();
      let exportData;
      
      if (format === 'csv') {
        exportData = generateCSVExport(conveniados);
      } else {
        exportData = generateXMLExport(conveniados);
      }
      
      downloadFile(exportData.content, exportData.fileName, exportData.mimeType);
      
      // Log the export operation with the correct format
      await logOperation({
        eventType: 'export',
        entityType: 'conveniado',
        format,
        recordCount: conveniados.length,
        details: `Exportação de ${conveniados.length} conveniados em ${format.toUpperCase()}`
      });
      
      toast({
        title: "Exportação realizada com sucesso",
        description: `Os dados foram exportados para ${exportData.fileName}.`,
      });
    } catch (error: any) {
      console.error("Error exporting data:", error);
      toast({
        title: "Erro na exportação",
        description: "Ocorreu um erro ao exportar os dados. Tente novamente.",
        variant: "destructive",
      });
    }
  };

  return {
    showImportDialog,
    setShowImportDialog,
    importData,
    validationData,
    setValidationData,
    isSubmitting,
    fileInputRef,
    isAdmin,
    handleImportClick,
    handleFileChange,
    handleImportConfirm,
    handleExport
  };
};
