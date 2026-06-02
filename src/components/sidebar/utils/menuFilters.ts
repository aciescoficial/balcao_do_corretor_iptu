
import { MenuItem } from '../types/MenuItem';

export const filterMenuItemsByRoleAndTags = (
  menuItems: MenuItem[], 
  userRole: string | null,
  userTags: string[] | null,
  isAdmin: boolean,
  hasFinanceiroAccess: boolean
): MenuItem[] => {
  return menuItems.filter(item => {
    // Check if user has the appropriate role
    if (item.roles && userRole) {
      if (!item.roles.includes(userRole) && !isAdmin) {
        return false;
      }
    }
    
    // Check if menu item has required tags
    if (item.requiredTags && item.requiredTags.includes('financeiro')) {
      return hasFinanceiroAccess;
    }
    
    return true;
  });
};

export const filterSubmenuItemsByRoleAndTags = (
  submenu: Omit<MenuItem, 'header' | 'submenu'>[],
  userRole: string | null,
  isAdmin: boolean,
  hasFinanceiroAccess: boolean
): Omit<MenuItem, 'header' | 'submenu'>[] => {
  return submenu.filter(subItem => {
    // Check if user has appropriate role
    if (subItem.roles && userRole) {
      if (!subItem.roles.includes(userRole) && !isAdmin) {
        return false;
      }
    }
    
    // Check if submenu item has required tags
    if (subItem.requiredTags && subItem.requiredTags.includes('financeiro')) {
      return hasFinanceiroAccess;
    }
    
    return true;
  });
};
