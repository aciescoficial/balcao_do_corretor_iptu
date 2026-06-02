
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { secureDelete } from '@/integrations/supabase/extendedClient';
import { useAdminPermission } from '@/hooks/use-admin-permission';

export function useDeleteEmpresa() {
  const [isDeleting, setIsDeleting] = useState(false);
  const [isConfirmDialogOpen, setIsConfirmDialogOpen] = useState(false);
  const [empresaToDelete, setEmpresaToDelete] = useState<string | null>(null);
  const { toast } = useToast();
  const { checkAdminPermission } = useAdminPermission();

  const openDeleteDialog = (empresaId: string) => {
    if (!checkAdminPermission()) return;
    setEmpresaToDelete(empresaId);
    setIsConfirmDialogOpen(true);
  };

  const deleteEmpresa = async () => {
    if (!empresaToDelete || !checkAdminPermission()) return;
    
    setIsDeleting(true);
    try {
      await secureDelete('empresas', empresaToDelete);
      toast({
        title: 'Empresa excluída',
        description: 'A empresa foi excluída com sucesso.',
        variant: 'default',
      });
      // Return success for potential refreshing of data
      return true;
    } catch (error: any) {
      toast({
        title: 'Erro ao excluir empresa',
        description: error.message || 'Não foi possível excluir a empresa.',
        variant: 'destructive',
      });
      return false;
    } finally {
      setIsDeleting(false);
      setIsConfirmDialogOpen(false);
      setEmpresaToDelete(null);
    }
  };

  return {
    isDeleting,
    isConfirmDialogOpen,
    setIsConfirmDialogOpen,
    openDeleteDialog,
    deleteEmpresa
  };
}
