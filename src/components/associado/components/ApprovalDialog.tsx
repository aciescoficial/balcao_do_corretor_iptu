
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '@/components/ui/dialog';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Loader2, AlertTriangle } from 'lucide-react';
import AssociationTypeSelector from './AssociationTypeSelector';

interface AssociationType {
  id: string;
  title: string;
  value: number;
  description: string | null;
  payment_methods: string[];
  max_installments: number;
  active: boolean;
}

interface ApprovalDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onApprove: (associationTypeId: string) => void;
  nome: string;
  sobrenome: string;
  email: string;
  isProcessing: boolean;
  error?: string | null;
}

const ApprovalDialog: React.FC<ApprovalDialogProps> = ({
  isOpen,
  onClose,
  onApprove,
  nome,
  sobrenome,
  email,
  isProcessing,
  error
}) => {
  const [selectedType, setSelectedType] = useState<AssociationType | null>(null);

  const handleApprove = () => {
    if (selectedType) {
      onApprove(selectedType.id);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Aprovar Associado</DialogTitle>
          <DialogDescription>
            Selecione o tipo de associação para {nome} {sobrenome}
          </DialogDescription>
        </DialogHeader>

        {error && (
          <Alert variant="destructive" className="mb-4">
            <AlertTriangle className="h-4 w-4" />
            <AlertTitle>Erro ao processar aprovação</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <div className="py-4">
          <AssociationTypeSelector
            onSelect={setSelectedType}
            selectedTypeId={selectedType?.id || null}
          />

          {selectedType && (
            <div className="mt-4 p-3 bg-gray-50 rounded-md">
              <h4 className="font-medium">{selectedType.title}</h4>
              <p className="text-sm text-gray-600">{selectedType.description}</p>
              <p className="mt-2 font-medium">
                Valor: {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(selectedType.value)}
              </p>
            </div>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose} disabled={isProcessing}>
            Cancelar
          </Button>
          <Button 
            onClick={handleApprove} 
            disabled={!selectedType || isProcessing}
          >
            {isProcessing ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Processando...
              </>
            ) : (
              'Aprovar e Gerar Pagamento'
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ApprovalDialog;
