
import { useState, useEffect, useCallback } from 'react';

// Constants for localStorage keys
const STORAGE_KEYS = {
  COLLAPSED: 'aciesc-sidebar-state',
  EXPANDED_MENUS: 'aciesc-sidebar-menus',
};

// Type definition for the sidebar state
type SidebarState = {
  collapsed: boolean;
  expandedMenus: Record<string, boolean>;
};

/**
 * Hook to manage sidebar state including collapse state and expanded menus
 * @returns Object with sidebar state and methods to manipulate it
 */
export function useSidebarState() {
  // Initialize state from localStorage or use defaults
  const [state, setState] = useState<SidebarState>(() => {
    try {
      const savedCollapsed = localStorage.getItem(STORAGE_KEYS.COLLAPSED);
      const savedMenus = localStorage.getItem(STORAGE_KEYS.EXPANDED_MENUS);
      
      return {
        collapsed: savedCollapsed ? JSON.parse(savedCollapsed) : false,
        expandedMenus: savedMenus ? JSON.parse(savedMenus) : {
          // Default expanded menus
          "Admin": true,
          "Associados": true,
          "Área do Associado": true,
          "Área da Empresa": true,
          "Comunicação": true
        },
      };
    } catch (error) {
      console.error('Error loading sidebar state from localStorage:', error);
      return {
        collapsed: false,
        expandedMenus: {},
      };
    }
  });

  // Toggle sidebar collapsed state
  const toggleSidebar = useCallback(() => {
    setState(prev => ({
      ...prev,
      collapsed: !prev.collapsed,
    }));
  }, []);

  // Toggle menu expanded state
  const toggleMenu = useCallback((menuId: string) => {
    setState(prev => ({
      ...prev,
      expandedMenus: {
        ...prev.expandedMenus,
        [menuId]: !prev.expandedMenus[menuId]
      }
    }));
  }, []);

  // Check if a menu is expanded
  const isMenuExpanded = useCallback((menuId: string) => {
    // Default to expanded if not explicitly set to false
    return state.expandedMenus[menuId] !== false;
  }, [state.expandedMenus]);

  // Save state to localStorage when it changes
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.COLLAPSED, JSON.stringify(state.collapsed));
      localStorage.setItem(STORAGE_KEYS.EXPANDED_MENUS, JSON.stringify(state.expandedMenus));
    } catch (error) {
      console.error('Error saving sidebar state to localStorage:', error);
    }
  }, [state]);

  return {
    collapsed: state.collapsed,
    toggleSidebar,
    toggleMenu,
    isMenuExpanded
  };
}
