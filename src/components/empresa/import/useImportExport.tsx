
import React, { useState, useRef } from 'react';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/components/auth';
import { supabase } from '@/integrations/supabase/client';
import { logOperation } from '@/components/audit/auditLogService';
import Papa from 'papaparse';
import { EmpresaData, ImportError, FieldMapping } from './types';
import { validateEmpresaData } from './validationUtils';

interface UseImportExportProps {
  onImportSuccess: () => void;
  onExportSuccess?: (format: 'csv' | 'json', count: number) => void;
}

export const useImportExport = ({ onImportSuccess, onExportSuccess }: UseImportExportProps) => {
  const [isImportDialogOpen, setIsImportDialogOpen] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [isImporting, setIsImporting] = useState(false);
  const [importData, setImportData] = useState<EmpresaData[]>([]);
  const [importErrors, setImportErrors] = useState<ImportError[]>([]);
  const [rawCsvData, setRawCsvData] = useState<Record<string, string>[]>([]);
  const [csvHeaders, setCsvHeaders] = useState<string[]>([]);
  const [fieldMapping, setFieldMapping] = useState<FieldMapping>({});
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();
  const { isAdmin } = useAuth();

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!isAdmin) {
      toast({
        title: 'Permissão negada',
        description: 'Apenas administradores podem importar dados.',
        variant: 'destructive',
      });
      return;
    }
    
    const file = event.target.files?.[0];
    if (!file) return;
    
    setIsImporting(true);
    
    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        console.log("CSV parse results:", results);
        
        const headers = results.meta.fields || [];
        setCsvHeaders(headers);
        
        const rawData = results.data as Record<string, string>[];
        setRawCsvData(rawData);
        
        setIsImportDialogOpen(true);
        setIsImporting(false);
      },
      error: (error) => {
        console.error('Parsing error:', error);
        toast({
          title: 'Erro ao processar arquivo',
          description: 'O arquivo CSV não pôde ser processado corretamente.',
          variant: 'destructive',
        });
        setIsImporting(false);
      }
    });
    
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleFieldMappingChange = (mapping: FieldMapping) => {
    setFieldMapping(mapping);
    
    // Now we transform the data using the mapping
    if (rawCsvData.length > 0) {
      const transformedData: Record<string, string>[] = rawCsvData.map(row => {
        const transformedRow: Record<string, string> = {};
        
        // Apply the mapping to transform the data
        Object.entries(mapping).forEach(([field, header]) => {
          if (header) {
            transformedRow[field] = row[header] || '';
          }
        });
        
        return transformedRow;
      });
      
      // Validate the transformed data
      const { processedData, errors } = validateEmpresaData(transformedData);
      setImportData(processedData);
      setImportErrors(errors);
    }
  };

  const handleExportEmpresas = async () => {
    if (!isAdmin) {
      toast({
        title: 'Permissão negada',
        description: 'Apenas administradores podem exportar dados.',
        variant: 'destructive',
      });
      return;
    }
    
    setIsExporting(true);
    
    try {
      const { data, error } = await supabase
        .from('empresas')
        .select('*');
      
      if (error) throw error;
      
      if (data && data.length > 0) {
        const csv = Papa.unparse(data);
        const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.setAttribute('href', url);
        link.setAttribute('download', `empresas_export_${new Date().toISOString().split('T')[0]}.csv`);
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        
        await logOperation({
          eventType: 'export',
          entityType: 'empresa',
          format: 'csv',
          recordCount: data.length,
          details: `Exportação de ${data.length} empresas em CSV`
        });
        
        toast({
          title: 'Exportação concluída',
          description: `${data.length} empresas foram exportadas com sucesso.`,
        });
        
        if (onExportSuccess) {
          await onExportSuccess('csv', data.length);
        }
      } else {
        toast({
          title: 'Sem dados para exportar',
          description: 'Não há empresas registradas para exportação.',
        });
      }
    } catch (error: any) {
      console.error('Export error:', error);
      toast({
        title: 'Erro na exportação',
        description: error.message || 'Erro ao exportar os dados.',
        variant: 'destructive',
      });
    } finally {
      setIsExporting(false);
    }
  };

  const handleConfirmImport = async () => {
    if (!isAdmin) {
      toast({
        title: 'Permissão negada',
        description: 'Apenas administradores podem importar dados.',
        variant: 'destructive',
      });
      return;
    }
    
    setIsImporting(true);
    
    try {
      const dataToInsert = importData.map(({ id, ...item }) => ({
        ...item,
        created_at: new Date().toISOString()
      }));
      
      const { data, error } = await supabase
        .from('empresas')
        .insert(dataToInsert as any[]);
      
      if (error) throw error;
      
      await logOperation({
        eventType: 'import',
        entityType: 'empresa',
        format: 'csv',
        recordCount: importData.length,
        details: `Importação de ${importData.length} empresas em CSV`
      });
      
      onImportSuccess();
      setIsImportDialogOpen(false);
      setImportData([]);
      setRawCsvData([]);
      setCsvHeaders([]);
      
      toast({
        title: 'Importação concluída',
        description: `${importData.length} empresas foram importadas com sucesso.`,
      });
    } catch (error: any) {
      console.error('Import error:', error);
      toast({
        title: 'Erro na importação',
        description: error.message || 'Erro ao importar os dados.',
        variant: 'destructive',
      });
    } finally {
      setIsImporting(false);
    }
  };

  return {
    isImportDialogOpen,
    setIsImportDialogOpen,
    isExporting,
    isImporting,
    importData,
    importErrors,
    rawCsvData,
    csvHeaders,
    fieldMapping,
    fileInputRef,
    handleFileSelect,
    handleFieldMappingChange,
    handleExportEmpresas,
    handleConfirmImport
  };
};
