
import React from 'react';
import { Button } from '@/components/ui/button';
import { RefreshCw, PlusCircle } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';

interface UserManagementHeaderProps {
  loading: boolean;
  handleRefresh: () => void;
  openAddDialog: () => void;
  connectionStatus: boolean | null;
}

const UserManagementHeader: React.FC<UserManagementHeaderProps> = ({
  loading,
  handleRefresh,
  openAddDialog,
  connectionStatus
}) => {
  const isMobile = useIsMobile();
  
  return (
    <div className="flex justify-between items-center flex-col sm:flex-row gap-4">
      <h1 className="wp-header">Gerenciamento de Usuários</h1>
      <div className="flex gap-2 w-full sm:w-auto">
        <Button 
          onClick={handleRefresh} 
          variant="outline"
          disabled={loading}
          className="flex-1 sm:flex-initial"
        >
          <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
          {loading ? "Carregando..." : "Atualizar"}
        </Button>
        <Button 
          onClick={openAddDialog}
          disabled={loading || connectionStatus === false}
          className="flex-1 sm:flex-initial"
        >
          <PlusCircle className="h-4 w-4 mr-2" />
          {isMobile ? "Novo" : "Novo Usuário"}
        </Button>
      </div>
    </div>
  );
};

export default UserManagementHeader;
