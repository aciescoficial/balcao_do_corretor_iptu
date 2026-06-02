
import React from 'react';
import { Loader2 } from 'lucide-react';
import { Switch } from '@/components/ui/switch';
import SubPermissionItem from './SubPermissionItem';
import { UserRole } from '../../types';
import { MenuPermission, SaveLoadingState } from '../types';

interface MenuPermissionItemProps {
  role: UserRole;
  menu: MenuPermission;
  saveLoading: SaveLoadingState;
  toggleMenuPermission: (role: UserRole, menuId: string, enabled: boolean) => void;
  toggleSubPermission: (role: UserRole, menuId: string, subPermId: string, enabled: boolean) => void;
}

const MenuPermissionItem: React.FC<MenuPermissionItemProps> = ({ 
  role, 
  menu, 
  saveLoading, 
  toggleMenuPermission, 
  toggleSubPermission 
}) => {
  const permKey = `${role}-${menu.id}`;
  const isLoading = saveLoading[permKey] || false;
  
  // Make sure subPermissions is an array before attempting to map over it
  const safeSubPermissions = Array.isArray(menu.subPermissions) ? menu.subPermissions : [];
  
  return (
    <div key={`${role}-${menu.id}`} className="py-4 border-b last:border-b-0">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <Switch
            checked={menu.enabled}
            onCheckedChange={(checked) => toggleMenuPermission(role, menu.id, checked)}
            disabled={role === 'admin'}
            id={`${role}-${menu.id}-switch`}
          />
          <div className="flex items-center gap-2">
            {menu.icon}
            <span className="font-medium">{menu.name}</span>
          </div>
        </div>
        {isLoading && <Loader2 className="h-4 w-4 animate-spin" />}
      </div>
      
      <div className="ml-10 space-y-2">
        {safeSubPermissions.map((subPerm) => {
          const subPermKey = `${role}-${menu.id}-${subPerm.id}`;
          const isSubLoading = saveLoading[subPermKey] || false;
          
          return (
            <SubPermissionItem
              key={subPermKey}
              role={role}
              menuId={menu.id}
              subPerm={subPerm}
              menuEnabled={menu.enabled}
              isLoading={isSubLoading}
              onToggle={toggleSubPermission}
            />
          );
        })}
      </div>
    </div>
  );
};

export default MenuPermissionItem;
