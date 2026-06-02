
import { useState, useEffect } from 'react';
import { UserRole } from '../../types';
import { MenuPermission, SaveLoadingState } from '../types';
import { useToast } from '@/hooks/use-toast';
import { 
  generateDefaultPermissions, 
  logPermissionChange, 
  savePermissions, 
  fetchPermissionsFromDB 
} from '../services/permissionService';

export const usePermissionData = () => {
  const [menuPermissions, setMenuPermissions] = useState<Record<UserRole, MenuPermission[]>>({
    admin: [],
    user: [],
    empresa: [],
    diretoria: []
  });
  const [loading, setLoading] = useState(true);
  const [saveInProgress, setSaveInProgress] = useState(false);
  const { toast } = useToast();
  const [saveLoading, setSaveLoading] = useState<SaveLoadingState>({});

  const fetchPermissions = async () => {
    setLoading(true);
    try {
      // Try to fetch from database first
      const { data: dbPermissions, error } = await fetchPermissionsFromDB();
      
      if (error) {
        throw error;
      }

      if (dbPermissions) {
        setMenuPermissions(dbPermissions);
      } else {
        // Fall back to default permissions if none in DB
        setMenuPermissions(generateDefaultPermissions());
      }
    } catch (error) {
      console.error("Erro ao carregar permissões:", error);
      toast({
        title: "Erro ao carregar permissões",
        description: "Não foi possível carregar as permissões.",
        variant: "destructive"
      });
      
      // Fall back to default permissions
      setMenuPermissions(generateDefaultPermissions());
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPermissions();
  }, []);

  const toggleMenuPermission = async (role: UserRole, menuId: string, enabled: boolean) => {
    const permKey = `${role}-${menuId}`;
    setSaveLoading(prev => ({ ...prev, [permKey]: true }));
    
    try {
      logPermissionChange(role, menuId, undefined, enabled);
      
      const updatedPermissions = {
        ...menuPermissions,
        [role]: menuPermissions[role].map(menu => {
          if (menu.id === menuId) {
            const updatedSubPermissions = !enabled 
              ? menu.subPermissions.map(subPerm => ({ ...subPerm, enabled: false }))
              : menu.subPermissions;
              
            return { 
              ...menu, 
              enabled, 
              subPermissions: updatedSubPermissions 
            };
          }
          return menu;
        })
      };
      
      setMenuPermissions(updatedPermissions);
      
      // Save to database in background, but don't await here
      // to prevent UI from freezing while waiting for response
      savePermissions(role, updatedPermissions[role])
        .then(({ error }) => {
          if (error) {
            console.error("Background save error:", error);
            throw error;
          }
        })
        .catch(error => {
          console.error("Background save error caught:", error);
          // Handle background save error silently
        })
        .finally(() => {
          setSaveLoading(prev => ({ ...prev, [permKey]: false }));
        });
      
      toast({
        title: "Permissão atualizada",
        description: `${role} ${enabled ? 'agora tem' : 'não tem mais'} acesso ao menu ${menuId}`,
      });
    } catch (error) {
      console.error("Erro ao atualizar permissão:", error);
      toast({
        title: "Erro ao atualizar permissão",
        description: "Não foi possível salvar a alteração.",
        variant: "destructive"
      });
      setSaveLoading(prev => ({ ...prev, [permKey]: false }));
    }
  };

  const toggleSubPermission = async (role: UserRole, menuId: string, subPermId: string, enabled: boolean) => {
    const permKey = `${role}-${menuId}-${subPermId}`;
    setSaveLoading(prev => ({ ...prev, [permKey]: true }));
    
    try {
      logPermissionChange(role, menuId, subPermId, enabled);
      
      const updatedPermissions = {
        ...menuPermissions,
        [role]: menuPermissions[role].map(menu => {
          if (menu.id === menuId) {
            const menuEnabled = enabled ? true : menu.enabled;
            
            return { 
              ...menu, 
              enabled: menuEnabled,
              subPermissions: menu.subPermissions.map(subPerm => {
                if (subPerm.id === subPermId) {
                  return { ...subPerm, enabled };
                }
                return subPerm;
              }) 
            };
          }
          return menu;
        })
      };
      
      setMenuPermissions(updatedPermissions);
      
      // Save to database in background
      savePermissions(role, updatedPermissions[role])
        .then(({ error }) => {
          if (error) throw error;
        })
        .catch(error => {
          console.error("Background save error:", error);
          // Handle background save error silently
        })
        .finally(() => {
          setSaveLoading(prev => ({ ...prev, [permKey]: false }));
        });
      
      toast({
        title: "Permissão atualizada",
        description: `${role} ${enabled ? 'agora tem' : 'não tem mais'} permissão para ${subPermId}`,
      });
    } catch (error) {
      console.error("Erro ao atualizar permissão:", error);
      toast({
        title: "Erro ao atualizar permissão",
        description: "Não foi possível salvar a alteração.",
        variant: "destructive"
      });
      setSaveLoading(prev => ({ ...prev, [permKey]: false }));
    }
  };

  const saveAllPermissions = async () => {
    setSaveInProgress(true);
    
    try {
      // Save each role's permissions
      const roles: UserRole[] = ['admin', 'user', 'empresa', 'diretoria'];
      
      const savePromises = roles.map(role => savePermissions(role, menuPermissions[role]));
      
      const results = await Promise.allSettled(savePromises);
      
      // Check for any failures
      const failures = results.filter(r => r.status === 'rejected');
      
      if (failures.length > 0) {
        throw new Error(`Falha ao salvar ${failures.length} papéis`);
      }
      
      toast({
        title: "Permissões salvas",
        description: "Todas as permissões foram salvas com sucesso.",
      });
    } catch (error) {
      console.error("Erro ao salvar permissões:", error);
      toast({
        title: "Erro ao salvar permissões",
        description: "Não foi possível salvar todas as permissões.",
        variant: "destructive"
      });
    } finally {
      setSaveInProgress(false);
    }
  };

  return {
    menuPermissions,
    loading,
    saveLoading,
    saveInProgress,
    fetchPermissions,
    toggleMenuPermission,
    toggleSubPermission,
    saveAllPermissions
  };
};
