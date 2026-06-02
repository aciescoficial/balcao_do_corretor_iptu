
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

import { User, UserTag } from '../types';
import { useUserForm } from './hooks/useUserForm';
import { NameField, EmailField, RoleSelect, UserTagsField } from './form-fields/UserFormFields';
import { UserLinkTabs } from './form-fields/UserLinkTabs';
import { Loader2 } from 'lucide-react';

interface EditUserDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  selectedUser: User | null;
  onSelectedUserChange: (field: string, value: any) => void;
  onUpdateUser: () => Promise<boolean>;
  associados: Array<{id: string, cpf: string, nome: string, sobrenome: string}>;
  empresas: Array<{id: string, cnpj: string, nome_fantasia: string}>;
  loadingAssociados: boolean;
  loadingEmpresas: boolean;
  fetchAssociados: () => Promise<void>;
  fetchEmpresas: () => Promise<void>;
}

const EditUserDialog: React.FC<EditUserDialogProps> = ({
  isOpen,
  onOpenChange,
  selectedUser,
  onSelectedUserChange,
  onUpdateUser,
  associados,
  empresas,
  loadingAssociados,
  loadingEmpresas,
  fetchAssociados,
  fetchEmpresas
}) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const {
    isDiretoria,
    handleTagToggle,
    handleAssociadoSelect,
    handleEmpresaSelect,
    handleDiretoriaSelect
  } = useUserForm({
    user: selectedUser,
    onUserChange: onSelectedUserChange,
    fetchAssociados,
    fetchEmpresas,
    isOpen
  });
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedUser) return;
    
    setIsSubmitting(true);
    try {
      const success = await onUpdateUser();
      if (success) {
        onOpenChange(false);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!selectedUser) return null;

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !isSubmitting && onOpenChange(open)}>
      <DialogContent className="max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Editar Usuário</DialogTitle>
          <DialogDescription>
            Atualize os dados do usuário abaixo.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="space-y-4 py-4">
            <NameField 
              id="edit-name"
              value={selectedUser.name || ''} 
              onChange={(value) => onSelectedUserChange('name', value)} 
            />
            
            <EmailField 
              id="edit-email"
              value={selectedUser.email || ''} 
              onChange={(value) => onSelectedUserChange('email', value)} 
            />
            
            <RoleSelect 
              id="edit-role"
              value={selectedUser.role} 
              onChange={(value) => onSelectedUserChange('role', value)} 
            />
            
            <UserTagsField 
              prefix="edit"
              selectedTags={selectedUser.tags} 
              onTagChange={handleTagToggle} 
            />
            
            <UserLinkTabs 
              isDiretoria={isDiretoria}
              associadoId={selectedUser.associado_id}
              empresaId={selectedUser.empresa_id}
              associados={associados}
              empresas={empresas}
              loadingAssociados={loadingAssociados}
              loadingEmpresas={loadingEmpresas}
              onDiretoriaSelect={handleDiretoriaSelect}
              onAssociadoSelect={handleAssociadoSelect}
              onEmpresaSelect={handleEmpresaSelect}
            />
          </div>
          <DialogFooter>
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => onOpenChange(false)}
              disabled={isSubmitting}
            >
              Cancelar
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Salvando...
                </>
              ) : (
                "Salvar Alterações"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default EditUserDialog;
