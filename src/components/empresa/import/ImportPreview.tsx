
import React from 'react';
import { AlertCircle, CheckCircle, Info, XCircle } from 'lucide-react';
import { DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { EmpresaData, ImportError, FieldMapping } from './types';
import FieldMappingComponent from './FieldMapping';

interface ImportPreviewProps {
  data: EmpresaData[];
  rawData: Record<string, string>[];
  csvHeaders: string[];
  onConfirm: () => void;
  onCancel: () => void;
  errors: ImportError[];
  fieldMapping: FieldMapping;
  onFieldMappingChange: (mapping: FieldMapping) => void;
  isImporting: boolean;
}

const ImportPreview: React.FC<ImportPreviewProps> = ({ 
  data, 
  rawData,
  csvHeaders,
  onConfirm, 
  onCancel, 
  errors,
  fieldMapping,
  onFieldMappingChange,
  isImporting
}) => {
  // Group errors by row for display
  const errorsByRow: Record<number, ImportError[]> = {};
  errors.forEach(error => {
    if (!errorsByRow[error.row]) {
      errorsByRow[error.row] = [];
    }
    errorsByRow[error.row].push(error);
  });

  return (
    <>
      <div className="mb-4">
        <h4 className="text-sm font-medium mb-2">Mapeamento de Campos</h4>
        
        <FieldMappingComponent 
          csvHeaders={csvHeaders}
          sampleData={rawData.slice(0, 3)}
          onFieldMappingChange={onFieldMappingChange}
        />
        
        <div className="mt-4 bg-slate-50 p-4 rounded-md border">
          <div className="flex items-center gap-2 mb-3">
            <Info size={16} className="text-blue-500" />
            <span className="text-sm">Campos obrigatórios: nome_fantasia, razao_social, cnpj, responsavel, telefone, email, cidade, nicho, endereco, cep, desconto, produtos</span>
          </div>
          
          {errors.length > 0 && (
            <div className="flex items-center gap-2 text-red-500 text-sm mb-2">
              <AlertCircle size={16} />
              <span>Foram encontrados {errors.length} problemas que precisam ser corrigidos antes da importação.</span>
            </div>
          )}
          
          {/* Lista de erros agrupada por tipo */}
          <ScrollArea className="h-[120px]">
            <div className="space-y-2">
              {Object.entries(
                errors.reduce<Record<string, {message: string, count: number}>>((acc, error) => {
                  const key = error.field ? `${error.field}: ${error.message}` : error.message;
                  if (!acc[key]) acc[key] = {message: error.message, count: 0};
                  acc[key].count++;
                  return acc;
                }, {})
              ).map(([key, {message, count}]) => (
                <div key={key} className="bg-red-50 text-red-700 px-3 py-2 rounded-md flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <XCircle size={16} />
                    <span>{key}</span>
                  </div>
                  <span className="bg-red-100 px-2 py-1 rounded-full text-xs font-medium">{count} {count === 1 ? 'ocorrência' : 'ocorrências'}</span>
                </div>
              ))}
            </div>
          </ScrollArea>
        </div>
      </div>

      <h4 className="text-sm font-medium mb-2">Pré-visualização dos dados</h4>
      <ScrollArea className="h-[300px] border rounded-md">
        <Table>
          <TableHeader className="bg-slate-50 sticky top-0">
            <TableRow>
              <TableHead className="w-[50px]">Linha</TableHead>
              <TableHead>Nome Fantasia</TableHead>
              <TableHead>CNPJ</TableHead>
              <TableHead>Responsável</TableHead>
              <TableHead>Nicho</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Cidade</TableHead>
              <TableHead className="w-[80px]">Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.map((item, index) => {
              const rowErrors = errorsByRow[index] || [];
              return (
                <TableRow 
                  key={index} 
                  className={rowErrors.length > 0 ? "bg-red-50" : ""}
                >
                  <TableCell>{index + 1}</TableCell>
                  <TableCell>{item.nome_fantasia}</TableCell>
                  <TableCell>{item.cnpj}</TableCell>
                  <TableCell>{item.responsavel}</TableCell>
                  <TableCell>{item.nicho}</TableCell>
                  <TableCell>{item.status}</TableCell>
                  <TableCell>{item.cidade}</TableCell>
                  <TableCell>
                    {rowErrors.length > 0 ? (
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger>
                            <AlertCircle className="h-5 w-5 text-red-500" />
                          </TooltipTrigger>
                          <TooltipContent className="w-[280px]">
                            <div className="text-xs space-y-1">
                              {rowErrors.map((err, i) => (
                                <p key={i}>{err.field ? `${err.field}: ` : ''}{err.message}</p>
                              ))}
                            </div>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    ) : (
                      <CheckCircle className="h-5 w-5 text-green-500" />
                    )}
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </ScrollArea>

      <DialogFooter className="mt-4">
        <div className="flex w-full justify-between items-center">
          <div className="flex-shrink-0">
            {errors.length > 0 && (
              <span className="text-red-500 text-sm mr-2">
                <AlertCircle className="inline h-4 w-4 mr-1" />
                {errors.length} {errors.length === 1 ? "erro encontrado" : "erros encontrados"}
              </span>
            )}
          </div>
          <div className="flex space-x-2">
            <Button variant="outline" onClick={onCancel} disabled={isImporting}>
              Cancelar
            </Button>
            <Button onClick={onConfirm} disabled={errors.length > 0 || isImporting}>
              {isImporting ? 'Processando...' : 'Confirmar Importação'}
            </Button>
          </div>
        </div>
      </DialogFooter>
    </>
  );
};

export default ImportPreview;
