
import React from 'react';
import { SidebarGroup } from '@/components/ui/sidebar';
import SubmenuHeader from './SubmenuHeader';
import SubmenuContent from './SubmenuContent';
import { LucideIcon } from 'lucide-react';

interface SubmenuItem {
  icon?: LucideIcon;
  label?: string;
  path?: string;
  roles?: string[];
}

interface SidebarSubmenuProps {
  header: string;
  icon?: LucideIcon;
  submenu: SubmenuItem[];
  isExpanded: boolean;
  toggleMenu: () => void;
  isActive: (path: string) => boolean;
}

const SidebarSubmenu: React.FC<SidebarSubmenuProps> = ({ 
  header, 
  icon: Icon,
  submenu, 
  isExpanded, 
  toggleMenu, 
  isActive 
}) => {
  return (
    <SidebarGroup key={header}>
      <SubmenuHeader 
        header={header}
        icon={Icon}
        isExpanded={isExpanded}
        toggleMenu={toggleMenu}
      />
      <SubmenuContent 
        submenu={submenu}
        isExpanded={isExpanded}
        isActive={isActive}
      />
    </SidebarGroup>
  );
};

export default SidebarSubmenu;
