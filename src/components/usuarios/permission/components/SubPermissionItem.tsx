
import React from 'react';
import { Checkbox } from '@/components/ui/checkbox';
import { Loader2 } from 'lucide-react';
import { UserRole } from '../../types';
import { SubPermission } from '../types';

interface SubPermissionItemProps {
  role: UserRole;
  menuId: string;
  subPerm: SubPermission;
  menuEnabled: boolean;
  isLoading: boolean;
  onToggle: (role: UserRole, menuId: string, subPermId: string, enabled: boolean) => void;
}

const SubPermissionItem: React.FC<SubPermissionItemProps> = ({ 
  role, 
  menuId, 
  subPerm, 
  menuEnabled, 
  isLoading, 
  onToggle 
}) => {
  const subPermKey = `${role}-${menuId}-${subPerm.id}`;
  
  return (
    <div key={subPermKey} className="flex items-center gap-2">
      <Checkbox 
        id={subPermKey}
        checked={menuEnabled && subPerm.enabled}
        onCheckedChange={(checked) => onToggle(role, menuId, subPerm.id, !!checked)}
        disabled={role === 'admin' || !menuEnabled}
      />
      <label 
        htmlFor={subPermKey}
        className={`text-sm ${!menuEnabled ? 'text-muted-foreground' : ''}`}
      >
        {subPerm.description}
      </label>
      {isLoading && <Loader2 className="h-3 w-3 animate-spin" />}
    </div>
  );
};

export default SubPermissionItem;
