
import React from 'react';
import { Button } from '@/components/ui/button';
import LoadingSpinner from '@/components/shared/LoadingSpinner';
import { usePermissionData } from './hooks/usePermissionData';
import PermissionTabs from './PermissionTabs';

const PermissionPanel: React.FC = () => {
  const {
    menuPermissions,
    loading,
    saveLoading,
    saveInProgress,
    fetchPermissions,
    toggleMenuPermission,
    toggleSubPermission,
    saveAllPermissions
  } = usePermissionData();

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="wp-header">Gerenciamento de Permissões</h1>
        <Button onClick={fetchPermissions} disabled={loading || saveInProgress}>
          {loading ? (
            <LoadingSpinner size="small" text="" centered={false} />
          ) : (
            "Atualizar"
          )}
        </Button>
      </div>
      
      <div className="wp-card">
        {loading ? (
          <div className="flex justify-center items-center p-8">
            <LoadingSpinner size="large" text="Carregando permissões..." />
          </div>
        ) : (
          <PermissionTabs
            menuPermissions={menuPermissions}
            saveLoading={saveLoading}
            saveInProgress={saveInProgress}
            toggleMenuPermission={toggleMenuPermission}
            toggleSubPermission={toggleSubPermission}
            saveAllPermissions={saveAllPermissions}
          />
        )}
      </div>
    </div>
  );
};

export default PermissionPanel;
