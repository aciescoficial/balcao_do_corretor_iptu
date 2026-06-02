
import React from 'react';
import { Button } from '@/components/ui/button';
import { useDeleteEmpresa } from './hooks/useDeleteEmpresa';
import DeleteConfirmationDialog from '@/components/shared/DeleteConfirmationDialog';
import { Trash2 } from 'lucide-react';
import { useAdminPermission } from '@/hooks/use-admin-permission';

interface EmpresaActionButtonsProps {
  empresaId: string;
  onDeleteSuccess?: () => void;
}

const EmpresaActionButtons: React.FC<EmpresaActionButtonsProps> = ({ 
  empresaId,
  onDeleteSuccess
}) => {
  const { 
    isConfirmDialogOpen, 
    setIsConfirmDialogOpen, 
    openDeleteDialog, 
    deleteEmpresa,
    isDeleting
  } = useDeleteEmpresa();
  const { isAdmin } = useAdminPermission();

  const handleDeleteConfirm = async () => {
    const success = await deleteEmpresa();
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
            onClick={() => openDeleteDialog(empresaId)}
            disabled={isDeleting}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        )}
      </div>

      <DeleteConfirmationDialog
        isOpen={isConfirmDialogOpen}
        setIsOpen={setIsConfirmDialogOpen}
        title="Excluir Empresa"
        description="Tem certeza que deseja excluir esta empresa? Esta ação não pode ser desfeita."
        onConfirm={handleDeleteConfirm}
        entityName="empresa"
      />
    </>
  );
};

export default EmpresaActionButtons;
