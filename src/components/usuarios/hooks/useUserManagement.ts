
import { useDialogState } from './useDialogState';
import { User } from '../types';
import { useUserFetch } from './useUserFetch';
import { useUserCreate } from './useUserCreate';
import { useUserEdit } from './useUserEdit';
import { useToast } from '@/hooks/use-toast';
import { useState, useCallback } from 'react';

export const useUserManagement = () => {
  const [isAddUserDialogOpen, setIsAddUserDialogOpen] = useState(false);
  const [isEditUserDialogOpen, setIsEditUserDialogOpen] = useState(false);
  const { toast } = useToast();
  
  const { 
    users, 
    filteredUsers, 
    loading, 
    error,
    searchTerm, 
    setSearchTerm,
    fetchUsers,
    connectionStatus 
  } = useUserFetch();

  const handleUserCreated = useCallback((newUser: User) => {
    setIsAddUserDialogOpen(false);
    fetchUsers(); // Refresh the user list
  }, [fetchUsers]);

  const { 
    newUser, 
    handleNewUserChange, 
    addUser,
    associados: createAssociados,
    empresas: createEmpresas,
    loadingAssociados: createLoadingAssociados,
    loadingEmpresas: createLoadingEmpresas,
    fetchAssociados: fetchCreateAssociados,
    fetchEmpresas: fetchCreateEmpresas
  } = useUserCreate(handleUserCreated);

  const handleUserUpdated = useCallback((updatedUser: User) => {
    setIsEditUserDialogOpen(false);
    fetchUsers(); // Refresh the user list
  }, [fetchUsers]);

  const {
    selectedUser,
    setSelectedUser,
    handleSelectedUserChange,
    updateUser,
    toggleUserActive,
    associados: editAssociados,
    empresas: editEmpresas,
    loadingAssociados: editLoadingAssociados,
    loadingEmpresas: editLoadingEmpresas,
    fetchAssociados: fetchEditAssociados,
    fetchEmpresas: fetchEditEmpresas
  } = useUserEdit(handleUserUpdated);

  return {
    // User list state
    loading,
    error,
    searchTerm,
    setSearchTerm,
    filteredUsers,
    connectionStatus,
    
    // Add user dialog state
    isAddUserDialogOpen,
    setIsAddUserDialogOpen,
    newUser,
    handleNewUserChange,
    addUser,
    
    // Edit user dialog state
    isEditUserDialogOpen,
    setIsEditUserDialogOpen,
    selectedUser,
    setSelectedUser,
    handleSelectedUserChange,
    updateUser,
    
    // User actions
    toggleUserActive,
    fetchUsers,

    // Associated entities
    associados: createAssociados,
    empresas: createEmpresas,
    loadingAssociados: createLoadingAssociados,
    loadingEmpresas: createLoadingEmpresas,
    fetchAssociados: fetchCreateAssociados,
    fetchEmpresas: fetchCreateEmpresas
  };
};
