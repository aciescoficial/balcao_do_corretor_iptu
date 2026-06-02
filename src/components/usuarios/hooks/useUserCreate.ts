
import { useState } from 'react';
import { User, UserRole, UserTag } from '../types';
import { useAssociatedEntities } from './useAssociatedEntities';
import { useUserCreation } from './useUserCreation';

export const useUserCreate = (onSuccess: (user: User) => void) => {
  const [newUser, setNewUser] = useState<Partial<User>>({
    name: '',
    email: '',
    role: 'user' as UserRole,
    tags: [] as UserTag[],
    active: true,
    associado_id: undefined,
    associado_cpf: undefined,
    empresa_id: undefined,
    empresa_cnpj: undefined
  });

  const { addUser: createUser } = useUserCreation(onSuccess);
  
  const {
    associados,
    empresas,
    loadingAssociados,
    loadingEmpresas,
    fetchAssociados,
    fetchEmpresas
  } = useAssociatedEntities();

  const handleNewUserChange = (field: string, value: any) => {
    setNewUser(prev => ({ ...prev, [field]: value }));
  };

  const addUser = async () => {
    const success = await createUser(newUser);
    
    if (success) {
      // Reset the form
      setNewUser({
        name: '',
        email: '',
        role: 'user' as UserRole,
        tags: [] as UserTag[],
        active: true,
        associado_id: undefined,
        associado_cpf: undefined,
        empresa_id: undefined,
        empresa_cnpj: undefined
      });
    }
    
    return success;
  };

  return {
    newUser,
    handleNewUserChange,
    addUser,
    associados,
    empresas,
    loadingAssociados,
    loadingEmpresas,
    fetchAssociados,
    fetchEmpresas,
  };
};
