
import { useState, useEffect, useCallback } from 'react';
import { User, UserTag } from '../../types';

type EntityType = 'associado' | 'empresa' | 'diretoria';

interface UserFormHookProps {
  user: Partial<User> | null;
  onUserChange: (field: string, value: any) => void;
  fetchAssociados: () => Promise<void>;
  fetchEmpresas: () => Promise<void>;
  isOpen: boolean;
}

export const useUserForm = ({
  user,
  onUserChange,
  fetchAssociados,
  fetchEmpresas,
  isOpen
}: UserFormHookProps) => {
  // Determine if the user is a diretoria member
  const isDiretoria = user?.tags?.includes('diretoria_aciesc') || false;

  useEffect(() => {
    if (isOpen) {
      fetchAssociados();
      fetchEmpresas();
    }
  }, [isOpen, fetchAssociados, fetchEmpresas]);

  const handleTagToggle = (tagId: UserTag, checked: boolean) => {
    if (!user) return;
    
    const currentTags = user.tags || [];
    let newTags: UserTag[];
    
    if (checked) {
      newTags = [...currentTags, tagId];
    } else {
      newTags = currentTags.filter(tag => tag !== tagId);
    }
    
    onUserChange('tags', newTags);
  };

  const handleAssociadoSelect = (associadoId: string) => {
    onUserChange('associado_id', associadoId);
    onUserChange('empresa_id', undefined);
    onUserChange('empresa_cnpj', undefined);
  };

  const handleEmpresaSelect = (empresaId: string) => {
    onUserChange('empresa_id', empresaId);
    onUserChange('associado_id', undefined);
    onUserChange('associado_cpf', undefined);
  };

  const handleDiretoriaSelect = (isDiretoria: boolean) => {
    if (!user) return;
    
    if (isDiretoria) {
      const hasDiretoriaTag = user.tags?.includes('diretoria_aciesc') || false;
      if (!hasDiretoriaTag) {
        const newTags = [...(user.tags || []), 'diretoria_aciesc'];
        onUserChange('tags', newTags);
      }
      // Clear associado and empresa selections for diretoria
      onUserChange('associado_id', undefined);
      onUserChange('associado_cpf', undefined);
      onUserChange('empresa_id', undefined);
      onUserChange('empresa_cnpj', undefined);
    } else {
      const newTags = (user.tags || []).filter(tag => tag !== 'diretoria_aciesc');
      onUserChange('tags', newTags);
    }
  };
  
  return {
    isDiretoria,
    handleTagToggle,
    handleAssociadoSelect,
    handleEmpresaSelect,
    handleDiretoriaSelect
  };
};
