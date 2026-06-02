
import React from 'react';
import { Button } from '@/components/ui/button';
import { useDeleteAssociado } from './hooks/useDeleteAssociado';
import DeleteConfirmationDialog from '@/components/shared/DeleteConfirmationDialog';
import { Trash2 } from 'lucide-react';
import { useAdminPermission } from '@/hooks/use-admin-permission';

interface AssociadoActionButtonsProps {
  associadoId: string;
  onDeleteSuccess?: () => void;
}

const AssociadoActionButtons: React.FC<AssociadoActionButtonsProps> = ({ 
  associadoId,
  onDeleteSuccess
}) => {
  const { 
    isConfirmDialogOpen, 
    setIsConfirmDialogOpen, 
    openDeleteDialog, 
    deleteAssociado,
    isDeleting
  } = useDeleteAssociado();
  const { isAdmin } = useAdminPermission();

  const handleDeleteConfirm = async () => {
    const success = await deleteAssociado();
    if (success && onDeleteSuccess) {
      onDeleteSuccess();
    }
  };

  return (
    <>
      <div className="flex space-x-2">
        <Button size="sm" variant="outline">Ver</Button>
        <Button size="sm" variant="default">Editar</Button>
        {isAdmin && (
          <Button 
            size="sm" 
            variant="destructive"
            onClick={() => openDeleteDialog(associadoId)}
            disabled={isDeleting}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        )}
      </div>

      <DeleteConfirmationDialog
        isOpen={isConfirmDialogOpen}
        setIsOpen={setIsConfirmDialogOpen}
        title="Excluir Associado"
        description="Tem certeza que deseja excluir este associado? Esta ação não pode ser desfeita."
        onConfirm={handleDeleteConfirm}
        entityName="associado"
      />
    </>
  );
};

export default AssociadoActionButtons;
