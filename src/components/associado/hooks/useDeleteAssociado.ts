
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { secureDelete } from '@/integrations/supabase/extendedClient';
import { useAdminPermission } from '@/hooks/use-admin-permission';

export function useDeleteAssociado() {
  const [isDeleting, setIsDeleting] = useState(false);
  const [isConfirmDialogOpen, setIsConfirmDialogOpen] = useState(false);
  const [associadoToDelete, setAssociadoToDelete] = useState<string | null>(null);
  const { toast } = useToast();
  const { checkAdminPermission } = useAdminPermission();

  const openDeleteDialog = (associadoId: string) => {
    if (!checkAdminPermission()) return;
    setAssociadoToDelete(associadoId);
    setIsConfirmDialogOpen(true);
  };

  const deleteAssociado = async () => {
    if (!associadoToDelete || !checkAdminPermission()) return;
    
    setIsDeleting(true);
    try {
      await secureDelete('associados', associadoToDelete);
      toast({
        title: 'Associado excluído',
        description: 'O associado foi excluído com sucesso.',
        variant: 'default',
      });
      // Return success for potential refreshing of data
      return true;
    } catch (error: any) {
      toast({
        title: 'Erro ao excluir associado',
        description: error.message || 'Não foi possível excluir o associado.',
        variant: 'destructive',
      });
      return false;
    } finally {
      setIsDeleting(false);
      setIsConfirmDialogOpen(false);
      setAssociadoToDelete(null);
    }
  };

  return {
    isDeleting,
    isConfirmDialogOpen,
    setIsConfirmDialogOpen,
    openDeleteDialog,
    deleteAssociado
  };
}
