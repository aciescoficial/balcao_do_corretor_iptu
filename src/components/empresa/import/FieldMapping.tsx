
import React, { useState, useEffect } from 'react';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Check, AlertCircle } from 'lucide-react';
import { nichoOptions } from './validationUtils';

interface FieldMappingProps {
  csvHeaders: string[];
  sampleData: Record<string, string>[];
  onFieldMappingChange: (mapping: Record<string, string>) => void;
}

const requiredFields = [
  'razao_social',
  'nome_fantasia',
  'cnpj',
  'responsavel',
  'telefone',
  'email',
  'endereco',
  'cidade',
  'cep',
  'nicho',
  'desconto',
  'produtos',
];

const optionalFields = [
  'site',
  'instagram',
  'whatsapp',
  'status',
];

const fieldLabels: Record<string, string> = {
  razao_social: 'Razão Social',
  nome_fantasia: 'Nome Fantasia',
  cnpj: 'CNPJ',
  responsavel: 'Responsável',
  telefone: 'Telefone',
  email: 'Email',
  endereco: 'Endereço',
  cidade: 'Cidade',
  cep: 'CEP',
  nicho: 'Nicho',
  desconto: 'Desconto',
  produtos: 'Produtos',
  site: 'Site',
  instagram: 'Instagram',
  whatsapp: 'WhatsApp',
  status: 'Status',
};

const allFields = [...requiredFields, ...optionalFields];

const FieldMapping: React.FC<FieldMappingProps> = ({ csvHeaders, sampleData, onFieldMappingChange }) => {
  const [fieldMapping, setFieldMapping] = useState<Record<string, string>>({});
  const [validationResult, setValidationResult] = useState<Record<string, boolean>>({});
  
  // Try to automatically map fields based on similarity
  useEffect(() => {
    const initialMapping: Record<string, string> = {};
    
    csvHeaders.forEach(header => {
      // Normalize header for comparison
      const normalizedHeader = header.toLowerCase().replace(/[^a-z0-9]/g, '');
      
      // Find matching field
      const matchedField = allFields.find(field => {
        const normalizedField = field.toLowerCase().replace(/[^a-z0-9]/g, '');
        return normalizedField === normalizedHeader || 
               normalizedHeader.includes(normalizedField) || 
               normalizedField.includes(normalizedHeader);
      });
      
      if (matchedField) {
        initialMapping[matchedField] = header;
      }
    });
    
    setFieldMapping(initialMapping);
  }, [csvHeaders]);
  
  // Validate field mappings
  useEffect(() => {
    const validate = () => {
      const validation: Record<string, boolean> = {};
      
      // Check if all required fields are mapped
      requiredFields.forEach(field => {
        validation[field] = !!fieldMapping[field];
      });
      
      // Additional validation logic for specific fields could go here
      // For example, validating that the nicho field contains valid values
      if (fieldMapping.nicho && sampleData.length > 0) {
        const nichoValues = sampleData.map(row => row[fieldMapping.nicho]);
        validation.nicho = nichoValues.every(value => 
          nichoOptions.includes(value as any) || !value
        );
      }
      
      setValidationResult(validation);
    };
    
    validate();
    onFieldMappingChange(fieldMapping);
  }, [fieldMapping, sampleData, onFieldMappingChange]);
  
  const handleFieldChange = (field: string, header: string) => {
    setFieldMapping(prev => ({
      ...prev,
      [field]: header
    }));
  };
  
  const getMappedFieldValue = (field: string): string => {
    return fieldMapping[field] || '';
  };
  
  const areAllRequiredFieldsMapped = (): boolean => {
    return requiredFields.every(field => validationResult[field]);
  };
  
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium">Mapeamento de Campos</h3>
        <div className="flex items-center gap-2">
          <Badge variant={areAllRequiredFieldsMapped() ? "outline" : "destructive"}>
            {areAllRequiredFieldsMapped() ? (
              <>
                <Check className="h-3 w-3 mr-1" />
                Todos os campos obrigatórios mapeados
              </>
            ) : (
              <>
                <AlertCircle className="h-3 w-3 mr-1" />
                Alguns campos obrigatórios não estão mapeados
              </>
            )}
          </Badge>
        </div>
      </div>
      
      <div className="border rounded-md">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Campo do Sistema</TableHead>
              <TableHead>Campo CSV</TableHead>
              <TableHead>Valor de Exemplo</TableHead>
              <TableHead className="w-20">Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {allFields.map(field => {
              const isRequired = requiredFields.includes(field);
              const isValid = validationResult[field];
              const mappedHeader = fieldMapping[field];
              const sampleValue = mappedHeader && sampleData.length > 0 ? sampleData[0][mappedHeader] : '';
              
              return (
                <TableRow key={field}>
                  <TableCell>
                    {fieldLabels[field]}
                    {isRequired && <span className="text-red-500 ml-1">*</span>}
                  </TableCell>
                  <TableCell>
                    <Select 
                      value={getMappedFieldValue(field)}
                      onValueChange={(value) => handleFieldChange(field, value)}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Selecione um campo" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="">Não mapear</SelectItem>
                        {csvHeaders.map(header => (
                          <SelectItem key={header} value={header}>{header}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </TableCell>
                  <TableCell className="font-mono text-xs">
                    {sampleValue || ''}
                  </TableCell>
                  <TableCell>
                    {isRequired ? (
                      isValid ? (
                        <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                          <Check className="h-3 w-3 mr-1" />
                          OK
                        </Badge>
                      ) : (
                        <Badge variant="destructive">
                          <AlertCircle className="h-3 w-3 mr-1" />
                          Requerido
                        </Badge>
                      )
                    ) : (
                      <Badge variant="secondary">Opcional</Badge>
                    )}
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default FieldMapping;
