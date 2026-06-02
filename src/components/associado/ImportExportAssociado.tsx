
import React, { useRef, useState } from 'react';
import { useToast } from "@/hooks/use-toast";
import { useAuth } from '@/components/auth';
import { ImportExportActions } from './ImportExportActions';
import { ImportDialog } from './ImportDialog';
import { ImportAssociadoData, ImportValidationData } from './types';
import { importAssociados, exportAssociados } from './associadoService';
import { logOperation } from '../audit/auditLogService';

export const ImportExportAssociado: React.FC = () => {
  const [importDialogOpen, setImportDialogOpen] = useState(false);
  const [importData, setImportData] = useState<ImportAssociadoData[]>([]);
  const [validationData, setValidationData] = useState<ImportValidationData[]>([]);
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
      fileInputRef.current.click();
    }
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!isAdmin) return;
    
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (event) => {
      try {
        const csvData = event.target?.result as string;
        
        const Papa = (await import('papaparse')).default;
        
        Papa.parse(csvData, {
          header: true,
          skipEmptyLines: true,
          complete: (results) => {
            console.log("CSV parse results:", results);
            
            const mappedData = results.data.map((row: any, index) => {
              let nome = row['Nome'] || '';
              let sobrenome = '';
              
              if (nome.includes(' ')) {
                const nameParts = nome.split(' ');
                nome = nameParts[0];
                sobrenome = nameParts.slice(1).join(' ');
              }
              
              let validade = '';
              if (row['Validade']) {
                const parts = row['Validade'].split('/');
                if (parts.length === 3) {
                  validade = `${parts[2]}-${parts[1]}-${parts[0]}`;
                }
              }
              
              return {
                id: `import-${index}`,
                nome: nome,
                sobrenome: sobrenome,
                email: row['Email'] || '',
                celular: row['Celular'] || '',
                creci: row['CRECI-SC'] || '',
                cpf: row['CPF'] || '',
                rua: row['Rua'] || '',
                numero: row['Número'] || '',
                complemento: row['Complemento'] || '',
                bairro: row['Bairro'] || '',
                cidade: row['Cidade'] || '',
                estado: row['Estado'] || '',
                cep: row['CEP'] || '',
                valorPago: row['Valor Pago'] || '',
                valorDevido: row['Valor Devido'] || '',
                tipoPagamento: row['Tipo Pagamento'] || '',
                tipoAssociado: row['Tipo Associado'] || '',
                validade: validade,
                status: 'pendente' as const
              };
            });

            const validationFields = Object.keys(results.data[0] || {}).map(field => ({
              fieldName: field,
              targetField: mapFieldToTarget(field),
              isValid: validateField(field, results.data)
            }));

            setImportData(mappedData);
            setValidationData(validationFields);
            setImportDialogOpen(true);
          },
          error: (error) => {
            console.error('Error parsing CSV:', error);
            toast({
              title: "Erro ao processar arquivo",
              description: "Não foi possível ler o arquivo CSV.",
              variant: "destructive",
            });
          }
        });
      } catch (error) {
        console.error('Error processing file:', error);
        toast({
          title: "Erro ao processar arquivo",
          description: "O arquivo não está em um formato válido.",
          variant: "destructive",
        });
      }
    };
    
    reader.readAsText(file);
  };

  const validateField = (field: string, data: any[]): boolean => {
    const requiredFields = ['Nome', 'Email', 'CPF', 'Cidade'];
    
    if (requiredFields.includes(field)) {
      return data.every(row => !!row[field]);
    }
    
    return true;
  };

  const mapFieldToTarget = (field: string): string => {
    const fieldMap: Record<string, string> = {
      'Nome': 'nome',
      'Email': 'email',
      'Celular': 'celular',
      'CRECI-SC': 'creci',
      'CPF': 'cpf',
      'Rua': 'rua',
      'Número': 'numero',
      'Complemento': 'complemento',
      'Bairro': 'bairro',
      'Cidade': 'cidade',
      'Estado': 'estado',
      'CEP': 'cep',
      'Valor Pago': 'valorPago',
      'Valor Devido': 'valorDevido',
      'Tipo Pagamento': 'tipoPagamento',
      'Tipo Associado': 'tipoAssociado',
      'Validade': 'validade',
    };

    return fieldMap[field] || field.toLowerCase();
  };

  const handleConfirmImport = async () => {
    if (!isAdmin) return;
    
    setIsSubmitting(true);
    
    try {
      const count = await importAssociados(importData);
      
      await logOperation({
        eventType: 'import',
        entityType: 'associado',
        format: 'csv',
        recordCount: count,
        details: `Importação de ${count} associados`
      });
      
      toast({
        title: "Importação concluída",
        description: `${count} associados foram importados com sucesso.`,
      });
      
      setImportDialogOpen(false);
      setImportData([]);
    } catch (error) {
      console.error('Error importing data:', error);
      toast({
        title: "Erro na importação",
        description: "Não foi possível importar os associados. Tente novamente.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleExportCsv = async () => {
    if (!isAdmin) {
      toast({
        title: "Permissão negada",
        description: "Apenas administradores podem exportar dados.",
        variant: "destructive",
      });
      return;
    }
    
    try {
      const associados = await exportAssociados();
      
      if (!associados.length) {
        toast({
          title: "Nenhum dado para exportar",
          description: "Não há associados cadastrados para exportar.",
        });
        return;
      }
      
      const Papa = (await import('papaparse')).default;
      
      const csvContent = Papa.unparse({
        fields: [
          'Nome', 'Sobrenome', 'Email', 'Celular', 'CRECI-SC', 'CPF', 
          'Rua', 'Número', 'Complemento', 'Bairro', 'Cidade', 
          'Estado', 'CEP', 'Valor Pago', 'Valor Devido',
          'Tipo Pagamento', 'Tipo Associado', 'Validade'
        ],
        data: associados.map((a: any) => ([
          a.nome,
          a.sobrenome || '',
          a.email,
          a.telefone,
          a.creci || '',
          a.cpf,
          a.rua || '',
          a.numero || '',
          a.complemento || '',
          a.bairro || '',
          a.cidade || '',
          a.estado || '',
          a.cep || '',
          a.valor_pago || '',
          a.valor_devido || '',
          a.tipo_pagamento || '',
          a.tipo_associado || '',
          formatDateForExport(a.validade || '')
        ]))
      });
      
      downloadFile(csvContent, 'text/csv;charset=utf-8;', `associados_${new Date().toISOString().split('T')[0]}.csv`);
      
      await logOperation({
        eventType: 'export',
        entityType: 'associado',
        format: 'csv',
        recordCount: associados.length,
        details: `Exportação de ${associados.length} associados em CSV`
      });
      
    } catch (error) {
      console.error('Error exporting data:', error);
      toast({
        title: "Erro na exportação",
        description: "Não foi possível exportar os associados. Tente novamente.",
        variant: "destructive",
      });
    }
  };

  const handleExportXml = async () => {
    if (!isAdmin) {
      toast({
        title: "Permissão negada",
        description: "Apenas administradores podem exportar dados.",
        variant: "destructive",
      });
      return;
    }
    
    try {
      const associados = await exportAssociados();
      
      if (!associados.length) {
        toast({
          title: "Nenhum dado para exportar",
          description: "Não há associados cadastrados para exportar.",
        });
        return;
      }
      
      let xml = '<?xml version="1.0" encoding="UTF-8" ?>\n';
      xml += '<associados>\n';
      
      associados.forEach((a: any) => {
        xml += '  <associado>\n';
        xml += `    <nome>${a.nome}</nome>\n`;
        xml += `    <sobrenome>${a.sobrenome || ''}</sobrenome>\n`;
        xml += `    <email>${a.email}</email>\n`;
        xml += `    <celular>${a.telefone}</celular>\n`;
        xml += `    <creci>${a.creci || ''}</creci>\n`;
        xml += `    <cpf>${a.cpf}</cpf>\n`;
        xml += `    <rua>${a.rua || ''}</rua>\n`;
        xml += `    <numero>${a.numero || ''}</numero>\n`;
        xml += `    <complemento>${a.complemento || ''}</complemento>\n`;
        xml += `    <bairro>${a.bairro || ''}</bairro>\n`;
        xml += `    <cidade>${a.cidade}</cidade>\n`;
        xml += `    <estado>${a.estado || ''}</estado>\n`;
        xml += `    <cep>${a.cep || ''}</cep>\n`;
        xml += `    <valorPago>${a.valor_pago || ''}</valorPago>\n`;
        xml += `    <valorDevido>${a.valor_devido || ''}</valorDevido>\n`;
        xml += `    <tipoPagamento>${a.tipo_pagamento || ''}</tipoPagamento>\n`;
        xml += `    <tipoAssociado>${a.tipo_associado || ''}</tipoAssociado>\n`;
        xml += `    <validade>${formatDateForExport(a.validade || '')}</validade>\n`;
        xml += '  </associado>\n';
      });
      
      xml += '</associados>';
      
      downloadFile(xml, 'application/xml;charset=utf-8;', `associados_${new Date().toISOString().split('T')[0]}.xml`);
      
      await logOperation({
        eventType: 'export',
        entityType: 'associado',
        format: 'xml',
        recordCount: associados.length,
        details: `Exportação de ${associados.length} associados em XML`
      });
      
    } catch (error) {
      console.error('Error exporting data:', error);
      toast({
        title: "Erro na exportação",
        description: "Não foi possível exportar os associados. Tente novamente.",
        variant: "destructive",
      });
    }
  };

  const formatDateForExport = (dateStr: string): string => {
    if (!dateStr) return '';
    
    try {
      const date = new Date(dateStr);
      return date.toLocaleDateString('pt-BR');
    } catch (error) {
      return dateStr;
    }
  };

  const downloadFile = (content: string, mimeType: string, filename: string): void => {
    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', filename);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <>
      <ImportExportActions
        onImportClick={handleImportClick}
        onFileChange={handleFileChange}
        onExportCsv={handleExportCsv}
        onExportXml={handleExportXml}
        fileInputRef={fileInputRef}
        isAdmin={isAdmin}
      />
      
      <ImportDialog
        open={importDialogOpen}
        onOpenChange={setImportDialogOpen}
        importData={importData}
        validationData={validationData}
        setValidationData={setValidationData}
        isSubmitting={isSubmitting}
        onConfirm={handleConfirmImport}
      />
    </>
  );
};
