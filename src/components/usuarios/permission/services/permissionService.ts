
import { UserRole } from '../../types';
import { MenuPermission } from '../types';
import { getDefaultMenus } from '../data/defaultMenus';
import { extendedSupabase } from '@/integrations/supabase/extendedClient';
import { supabase } from '@/integrations/supabase/client';

// Creates a copy of menu permissions with specified enabled state
export const createRoleMenuPermissions = (
  defaultMenus: MenuPermission[],
  enabledMenuIds: string[],
  enabledPermissionIds: string[]
): MenuPermission[] => {
  return defaultMenus.map(menu => ({
    ...menu,
    enabled: enabledMenuIds.includes(menu.id),
    subPermissions: menu.subPermissions.map(perm => ({
      ...perm,
      enabled: enabledPermissionIds.includes(perm.id)
    }))
  }));
};

// Generate default permissions for different roles
export const generateDefaultPermissions = (): Record<UserRole, MenuPermission[]> => {
  const defaultMenus = getDefaultMenus();
  
  // Admin has all permissions
  const adminPermissions = defaultMenus.map(menu => ({
    ...menu,
    enabled: true,
    subPermissions: menu.subPermissions.map(perm => ({
      ...perm,
      enabled: true
    }))
  }));
  
  // User permissions
  const userPermissions = createRoleMenuPermissions(
    defaultMenus,
    ['dashboard', 'area_associado', 'mensagens', 'comunicacao'],
    ['view_dashboard', 'view_messages', 'view_payments', 'update_profile', 'view_companies', 'send_messages']
  );

  // Empresa permissions
  const empresaPermissions = createRoleMenuPermissions(
    defaultMenus,
    ['dashboard', 'area_empresa', 'mensagens', 'comunicacao'],
    ['view_dashboard', 'update_company', 'search_members', 'view_messages', 'send_messages']
  );
  
  // Diretoria permissions
  const diretoriaPermissions = createRoleMenuPermissions(
    defaultMenus,
    ['dashboard', 'associados', 'empresas', 'mensagens', 'comunicacao', 'carteirinhas'],
    [
      'view_dashboard', 'search_associado', 'search_empresa', 
      'view_messages', 'send_messages', 'generate_card', 'request_card'
    ]
  );

  return {
    admin: adminPermissions,
    user: userPermissions,
    empresa: empresaPermissions,
    diretoria: diretoriaPermissions
  };
};

// Define the shape of a permission entry in the database
interface RolePermissionData {
  id?: string;
  role: string;
  enabled_menus: string[];
  enabled_permissions: string[];
  created_at?: string;
  updated_at?: string;
}

// Save permissions to Supabase
export const savePermissions = async (
  role: UserRole, 
  permissions: MenuPermission[]
): Promise<{ error: any | null }> => {
  try {
    // Convert permissions to a simpler format for storage
    const permissionsData: RolePermissionData = {
      role,
      enabled_menus: permissions.filter(menu => menu.enabled).map(menu => menu.id),
      enabled_permissions: permissions.flatMap(menu => 
        menu.subPermissions
          .filter(perm => perm.enabled)
          .map(perm => perm.id)
      )
    };

    // First, check if permissions for this role already exist
    const { data: existingPermissions } = await supabase
      .from('role_permissions')
      .select('*')
      .eq('role', role)
      .single();

    // Update or insert based on existence
    if (existingPermissions) {
      // Update with only the fields we need to update
      const { error } = await supabase
        .from('role_permissions')
        .update({
          enabled_menus: permissionsData.enabled_menus,
          enabled_permissions: permissionsData.enabled_permissions,
          updated_at: new Date().toISOString()
        })
        .eq('role', role);
      
      return { error };
    } else {
      const { error } = await supabase
        .from('role_permissions')
        .insert({
          role: permissionsData.role,
          enabled_menus: permissionsData.enabled_menus,
          enabled_permissions: permissionsData.enabled_permissions
        });
      
      return { error };
    }
  } catch (error) {
    console.error("Error saving permissions:", error);
    return { error };
  }
};

// Fetch permissions from Supabase
export const fetchPermissionsFromDB = async (): Promise<{ data: Record<UserRole, MenuPermission[]> | null, error: any | null }> => {
  try {
    const { data, error } = await supabase
      .from('role_permissions')
      .select('*');
    
    if (error) {
      throw error;
    }

    if (!data || data.length === 0) {
      return { data: null, error: null };
    }

    const defaultMenus = getDefaultMenus();
    const permissionsMap: Record<UserRole, MenuPermission[]> = {} as Record<UserRole, MenuPermission[]>;

    data.forEach((roleData: RolePermissionData) => {
      const role = roleData.role as UserRole;
      
      // Make sure arrays are defined, even if they're empty in the database
      const enabledMenus = roleData.enabled_menus || [];
      const enabledPermissions = roleData.enabled_permissions || [];
      
      permissionsMap[role] = defaultMenus.map(menu => ({
        ...menu,
        enabled: enabledMenus.includes(menu.id),
        subPermissions: menu.subPermissions.map(perm => ({
          ...perm,
          enabled: enabledPermissions.includes(perm.id)
        }))
      }));
    });

    // Add defaults for any missing roles
    const defaultPerms = generateDefaultPermissions();
    const roles: UserRole[] = ['admin', 'user', 'empresa', 'diretoria'];
    roles.forEach(role => {
      if (!permissionsMap[role]) {
        permissionsMap[role] = defaultPerms[role];
      }
    });

    return { data: permissionsMap, error: null };
  } catch (error) {
    console.error("Error fetching permissions:", error);
    return { data: null, error };
  }
};

// Log permission changes for future API integration
export const logPermissionChange = (
  role: UserRole, 
  menuId: string, 
  subPermId?: string, 
  enabled?: boolean
): void => {
  if (subPermId) {
    console.log(`${role} ${enabled ? 'agora tem' : 'não tem mais'} permissão ${subPermId}`);
  } else {
    console.log(`${role} ${enabled ? 'agora tem' : 'não tem mais'} acesso ao menu ${menuId}`);
  }
};
