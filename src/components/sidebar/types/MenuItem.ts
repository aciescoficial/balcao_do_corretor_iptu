
import { LucideIcon } from 'lucide-react';

export interface MenuItem {
  icon?: LucideIcon;
  label?: string;
  path?: string;
  header?: string;
  roles?: string[];
  requiredTags?: string[];
  submenu?: Omit<MenuItem, 'header' | 'submenu'>[];
}

export interface SidebarMenuItemsProps {
  location: {
    pathname: string;
  };
}
