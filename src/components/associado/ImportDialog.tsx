
import React from 'react';
import { Check, AlertCircle } from 'lucide-react';
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle 
} from '@/components/ui/dialog';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { ImportAssociadoData, ImportValidationData } from './types';

interface ImportDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  importData: ImportAssociadoData[];
  validationData: ImportValidationData[];
  setValidationData: (data: ImportValidationData[]) => void;
  isSubmitting: boolean;
  onConfirm: () => Promise<void>;
}

export const ImportDialog: React.FC<ImportDialogProps> = ({ 
  open, 
  onOpenChange, 
  importData, 
  validationData, 
  setValidationData,
  isSubmitting, 
  onConfirm 
}) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle>Importar Associados</DialogTitle>
          <DialogDescription>
            Verifique os dados a serem importados e confirme o mapeamento dos campos.
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4 my-4">
          <h4 className="font-medium">Validação de Campos</h4>
          
          <div className="space-y-2">
            {validationData.map((validation, idx) => (
              <div 
                key={idx} 
                className={`flex items-center justify-between p-2 rounded-md ${validation.isValid ? 'bg-green-50 text-green-800' : 'bg-yellow-50 text-yellow-800'}`}
              >
                <div className="flex items-center gap-2">
                  {validation.isValid ? (
                    <Check size={18} className="text-green-500" />
                  ) : (
                    <AlertCircle size={18} className="text-yellow-500" />
                  )}
                  <span className="font-medium">{validation.fieldName}</span>
                </div>
                
                <div className="flex items-center gap-2">
                  <span>Mapear para:</span>
                  <select 
                    className="border rounded-md p-1 bg-white"
                    value={validation.targetField}
                    onChange={(e) => {
                      const newValidationData = [...validationData];
                      newValidationData[idx] = {
                        ...validation,
                        targetField: e.target.value
                      };
                      setValidationData(newValidationData);
                    }}
                  >
                    <option value="nome">Nome</option>
                    <option value="sobrenome">Sobrenome</option>
                    <option value="cpf">CPF</option>
                    <option value="creci">CRECI</option>
                    <option value="email">Email</option>
                    <option value="celular">Telefone</option>
                    <option value="cidade">Cidade</option>
                    <option value="placaPrincipal">Placa Principal</option>
                    <option value="placaSecundaria">Placa Secundária</option>
                  </select>
                </div>
              </div>
            ))}
          </div>
          
          <h4 className="font-medium mt-4">Pré-visualização dos dados ({importData.length} registros)</h4>
          <div className="overflow-x-auto max-h-64">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nome</TableHead>
                  <TableHead>Sobrenome</TableHead>
                  <TableHead>CPF</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Telefone</TableHead>
                  <TableHead>Cidade</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {importData.slice(0, 5).map((item, idx) => (
                  <TableRow key={idx}>
                    <TableCell>{item.nome}</TableCell>
                    <TableCell>{item.sobrenome}</TableCell>
                    <TableCell>{item.cpf}</TableCell>
                    <TableCell>{item.email}</TableCell>
                    <TableCell>{item.celular}</TableCell>
                    <TableCell>{item.cidade}</TableCell>
                  </TableRow>
                ))}
                {importData.length > 5 && (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center text-gray-500">
                      + {importData.length - 5} outros registros
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancelar
          </Button>
          <Button onClick={onConfirm} disabled={isSubmitting}>
            {isSubmitting ? 'Importando...' : `Importar ${importData.length} Registros`}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
