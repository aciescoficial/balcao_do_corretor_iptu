
import React, { useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { useIsMobile } from '@/hooks/use-mobile';
import { useUserManagement } from './hooks/useUserManagement';
import { getRoleBadgeColor, getRoleLabel } from './utils/roleUtils';
import UserManagementHeader from './components/UserManagementHeader';
import UserManagementContent from './components/UserManagementContent';
import AddUserDialog from './components/AddUserDialog';
import EditUserDialog from './components/EditUserDialog';
import { User } from './types';

const UserManagement: React.FC = () => {
  const { toast } = useToast();
  const isMobile = useIsMobile();
  
  const {
    loading,
    error,
    searchTerm,
    setSearchTerm,
    filteredUsers,
    isAddUserDialogOpen,
    setIsAddUserDialogOpen,
    isEditUserDialogOpen,
    setIsEditUserDialogOpen,
    selectedUser,
    setSelectedUser,
    newUser,
    handleNewUserChange,
    handleSelectedUserChange,
    addUser,
    updateUser,
    toggleUserActive,
    fetchUsers,
    associados,
    empresas,
    loadingAssociados,
    loadingEmpresas,
    fetchAssociados,
    fetchEmpresas,
    connectionStatus
  } = useUserManagement();

  useEffect(() => {
    if (error) {
      toast({
        title: "Erro ao carregar usuários",
        description: error.message,
        variant: "destructive"
      });
    }
  }, [error, toast]);

  const handleRefresh = () => {
    toast({
      title: "Atualizando dados",
      description: "Buscando informações mais recentes...",
    });
    fetchUsers();
  };

  const handleToggleActive = async (userId: string, active: boolean) => {
    const success = await toggleUserActive(userId, active);
    if (success) {
      toast({
        title: active ? "Usuário ativado" : "Usuário desativado",
        description: `O usuário foi ${active ? 'ativado' : 'desativado'} com sucesso.`,
        variant: active ? "default" : "destructive",
      });
    } else {
      toast({
        title: "Erro ao alterar status",
        description: "Não foi possível alterar o status do usuário.",
        variant: "destructive"
      });
    }
  };

  const handleEdit = (user: User) => {
    setSelectedUser(user);
    setIsEditUserDialogOpen(true);
  };
  
  return (
    <div className="space-y-6 animate-fade-in">
      <UserManagementHeader 
        loading={loading}
        handleRefresh={handleRefresh}
        openAddDialog={() => setIsAddUserDialogOpen(true)}
        connectionStatus={connectionStatus}
      />
      
      <UserManagementContent
        loading={loading}
        error={error}
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        filteredUsers={filteredUsers}
        connectionStatus={connectionStatus}
        handleRefresh={handleRefresh}
        handleEdit={handleEdit}
        handleToggleActive={handleToggleActive}
        getRoleBadgeColor={getRoleBadgeColor}
        getRoleLabel={getRoleLabel}
        isMobile={isMobile}
      />

      <AddUserDialog
        isOpen={isAddUserDialogOpen}
        onOpenChange={setIsAddUserDialogOpen}
        newUser={newUser}
        onNewUserChange={handleNewUserChange}
        onAddUser={addUser}
        associados={associados}
        empresas={empresas}
        loadingAssociados={loadingAssociados}
        loadingEmpresas={loadingEmpresas}
        fetchAssociados={fetchAssociados}
        fetchEmpresas={fetchEmpresas}
      />

      <EditUserDialog
        isOpen={isEditUserDialogOpen}
        onOpenChange={setIsEditUserDialogOpen}
        selectedUser={selectedUser}
        onSelectedUserChange={handleSelectedUserChange}
        onUpdateUser={updateUser}
        associados={associados}
        empresas={empresas}
        loadingAssociados={loadingAssociados}
        loadingEmpresas={loadingEmpresas}
        fetchAssociados={fetchAssociados}
        fetchEmpresas={fetchEmpresas}
      />
    </div>
  );
};

export default UserManagement;
