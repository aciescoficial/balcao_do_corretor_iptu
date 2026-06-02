
import React, { useMemo } from 'react';
import { useAuth } from '@/components/auth';
import { useSidebarState } from '@/hooks/use-sidebar-state';
import SidebarMenuItem from './SidebarMenuItem';
import SidebarSubmenu from './SidebarSubmenu';
import { MenuItem, SidebarMenuItemsProps } from './types/MenuItem';
import { getAllMenuItems } from './menu-sections';
import { filterMenuItemsByRoleAndTags, filterSubmenuItemsByRoleAndTags } from './utils/menuFilters';

const SidebarMenuItems: React.FC<SidebarMenuItemsProps> = React.memo(({ location }) => {
  const { userRole, userTags, isAdmin, hasFinanceiroAccess } = useAuth();
  const { toggleMenu, isMenuExpanded } = useSidebarState();
  
  // Get all menu items and filter them based on user role and tags - memoized to prevent unnecessary filtering
  const menuItems = useMemo(() => {
    const allMenuItems = getAllMenuItems();
    return filterMenuItemsByRoleAndTags(
      allMenuItems, 
      userRole, 
      userTags, 
      isAdmin, 
      hasFinanceiroAccess
    );
  }, [userRole, userTags, isAdmin, hasFinanceiroAccess]);
  
  const isActive = (path: string) => {
    return location.pathname === path || location.pathname.startsWith(path + '/');
  };

  const renderMenu = (item: MenuItem) => {
    // Filter submenu items based on user role and required tags
    if (item.submenu) {
      const filteredSubmenu = filterSubmenuItemsByRoleAndTags(
        item.submenu,
        userRole,
        isAdmin,
        hasFinanceiroAccess
      );
      
      // Don't render the header if it has no valid submenu items
      if (filteredSubmenu.length === 0) {
        return null;
      }
      
      // Update the item with filtered submenu
      item = { ...item, submenu: filteredSubmenu };
    }
    
    if (item.header) {
      return (
        <SidebarSubmenu
          key={item.header}
          header={item.header}
          icon={item.icon}
          submenu={item.submenu || []}
          isExpanded={isMenuExpanded(item.header)}
          toggleMenu={() => toggleMenu(item.header!)}
          isActive={isActive}
        />
      );
    }
    
    return (
      <SidebarMenuItem
        key={item.path}
        icon={item.icon}
        label={item.label}
        path={item.path}
        isActive={isActive(item.path!)}
      />
    );
  };

  return (
    <>
      {menuItems.map(renderMenu)}
    </>
  );
});

// Add display name for React DevTools
SidebarMenuItems.displayName = 'SidebarMenuItems';

export default SidebarMenuItems;
