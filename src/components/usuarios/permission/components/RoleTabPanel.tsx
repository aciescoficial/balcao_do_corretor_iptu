
import React from 'react';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';
import MenuPermissionItem from './MenuPermissionItem';
import { UserRole } from '../../types';
import { MenuPermission, SaveLoadingState } from '../types';

interface RoleTabPanelProps {
  role: UserRole;
  menuPermissions: MenuPermission[];
  saveLoading: SaveLoadingState;
  saveInProgress: boolean;
  isAdmin: boolean;
  toggleMenuPermission: (role: UserRole, menuId: string, enabled: boolean) => void;
  toggleSubPermission: (role: UserRole, menuId: string, subPermId: string, enabled: boolean) => void;
  onSave: () => void;
}

const RoleTabPanel: React.FC<RoleTabPanelProps> = ({ 
  role, 
  menuPermissions, 
  saveLoading,
  saveInProgress, 
  isAdmin,
  toggleMenuPermission, 
  toggleSubPermission,
  onSave
}) => {
  // Make sure menuPermissions is an array before attempting to map over it
  const safeMenuPermissions = Array.isArray(menuPermissions) ? menuPermissions : [];
  
  return (
    <div>
      {isAdmin && (
        <div className="p-4 rounded-md bg-muted/50 mb-4">
          <p className="text-muted-foreground">Administradores têm acesso total ao sistema. Essas permissões não podem ser modificadas.</p>
        </div>
      )}
      <div className="space-y-1">
        {safeMenuPermissions.map((menu) => (
          <MenuPermissionItem
            key={`${role}-${menu.id}`}
            role={role}
            menu={menu}
            saveLoading={saveLoading}
            toggleMenuPermission={toggleMenuPermission}
            toggleSubPermission={toggleSubPermission}
          />
        ))}
      </div>
      <div className="flex justify-end gap-2 mt-4">
        <Button 
          variant="outline" 
          onClick={() => window.location.reload()}
          disabled={saveInProgress}
        >
          Cancelar
        </Button>
        <Button 
          onClick={onSave}
          disabled={saveInProgress}
        >
          {saveInProgress ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin mr-2" />
              Salvando...
            </>
          ) : (
            "Salvar"
          )}
        </Button>
      </div>
    </div>
  );
};

export default RoleTabPanel;
