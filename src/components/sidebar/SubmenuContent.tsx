
import React from 'react';
import { SidebarGroupContent, SidebarMenu } from '@/components/ui/sidebar';
import SidebarMenuItem from './SidebarMenuItem';
import { LucideIcon } from 'lucide-react';

interface SubmenuItem {
  icon?: LucideIcon;
  label?: string;
  path?: string;
  roles?: string[];
}

interface SubmenuContentProps {
  submenu: SubmenuItem[];
  isExpanded: boolean;
  isActive: (path: string) => boolean;
}

const SubmenuContent: React.FC<SubmenuContentProps> = ({ 
  submenu, 
  isExpanded, 
  isActive 
}) => {
  if (!isExpanded || !submenu || submenu.length === 0) {
    return null;
  }

  return (
    <SidebarGroupContent className="bg-aciesc-dark bg-opacity-30">
      <SidebarMenu>
        {submenu.map((subItem, index) => (
          <SidebarMenuItem
            key={index}
            icon={subItem.icon}
            label={subItem.label}
            path={subItem.path}
            isActive={isActive(subItem.path!)}
          />
        ))}
      </SidebarMenu>
    </SidebarGroupContent>
  );
};

export default SubmenuContent;
