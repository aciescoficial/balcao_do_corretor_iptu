
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import RoleTabPanel from './components/RoleTabPanel';
import { MenuPermission, SaveLoadingState } from './types';
import { UserRole } from '../types';

interface PermissionTabsProps {
  menuPermissions: Record<UserRole, MenuPermission[]>;
  saveLoading: SaveLoadingState;
  saveInProgress: boolean;
  toggleMenuPermission: (role: UserRole, menuId: string, enabled: boolean) => void;
  toggleSubPermission: (role: UserRole, menuId: string, subPermId: string, enabled: boolean) => void;
  saveAllPermissions: () => void;
}

const PermissionTabs: React.FC<PermissionTabsProps> = ({
  menuPermissions,
  saveLoading,
  saveInProgress,
  toggleMenuPermission,
  toggleSubPermission,
  saveAllPermissions
}) => {
  return (
    <Tabs defaultValue="admin" className="w-full">
      <TabsList className="grid w-full grid-cols-4 mb-4">
        <TabsTrigger value="admin">Administrador</TabsTrigger>
        <TabsTrigger value="diretoria">Diretoria</TabsTrigger>
        <TabsTrigger value="user">Associado</TabsTrigger>
        <TabsTrigger value="empresa">Empresa</TabsTrigger>
      </TabsList>
      
      <TabsContent value="admin">
        <RoleTabPanel
          role="admin"
          menuPermissions={menuPermissions.admin}
          saveLoading={saveLoading}
          saveInProgress={saveInProgress}
          isAdmin={true}
          toggleMenuPermission={toggleMenuPermission}
          toggleSubPermission={toggleSubPermission}
          onSave={saveAllPermissions}
        />
      </TabsContent>
      
      <TabsContent value="diretoria">
        <RoleTabPanel
          role="diretoria"
          menuPermissions={menuPermissions.diretoria}
          saveLoading={saveLoading}
          saveInProgress={saveInProgress}
          isAdmin={false}
          toggleMenuPermission={toggleMenuPermission}
          toggleSubPermission={toggleSubPermission}
          onSave={saveAllPermissions}
        />
      </TabsContent>
      
      <TabsContent value="user">
        <RoleTabPanel
          role="user"
          menuPermissions={menuPermissions.user}
          saveLoading={saveLoading}
          saveInProgress={saveInProgress}
          isAdmin={false}
          toggleMenuPermission={toggleMenuPermission}
          toggleSubPermission={toggleSubPermission}
          onSave={saveAllPermissions}
        />
      </TabsContent>
      
      <TabsContent value="empresa">
        <RoleTabPanel
          role="empresa"
          menuPermissions={menuPermissions.empresa}
          saveLoading={saveLoading}
          saveInProgress={saveInProgress}
          isAdmin={false}
          toggleMenuPermission={toggleMenuPermission}
          toggleSubPermission={toggleSubPermission}
          onSave={saveAllPermissions}
        />
      </TabsContent>
    </Tabs>
  );
};

export default PermissionTabs;
