
import React from 'react';
import {
  Sidebar,
  SidebarContent,
  SidebarMenu,
} from '@/components/ui/sidebar';
import SidebarMenuItems from './SidebarMenuItems';
import SidebarHeaderContent from './SidebarHeaderContent';

interface MainSidebarProps {
  location: {
    pathname: string;
  };
}

const MainSidebar: React.FC<MainSidebarProps> = ({ location }) => {
  return (
    <Sidebar variant="sidebar" collapsible="icon" className="bg-aciesc-primary text-white z-30 border-r border-aciesc-dark min-h-screen">
      <SidebarHeaderContent />
      <SidebarContent>
        <SidebarMenu>
          <SidebarMenuItems location={location} />
        </SidebarMenu>
      </SidebarContent>
    </Sidebar>
  );
};

export default MainSidebar;
