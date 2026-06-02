
import React from 'react';
import { SidebarHeader, SidebarTrigger, useSidebar } from '@/components/ui/sidebar';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const SidebarHeaderContent: React.FC = () => {
  const { state } = useSidebar();
  const isCollapsed = state === "collapsed";

  return (
    <SidebarHeader className="py-4 border-b border-aciesc-dark">
      <div className="px-4 flex items-center justify-between">
        {!isCollapsed && <h1 className="text-xl font-bold text-white">ACIESC</h1>}
        <SidebarTrigger className="text-white hover:text-gray-200">
          {isCollapsed ? (
            <ChevronRight className="h-5 w-5" />
          ) : (
            <ChevronLeft className="h-5 w-5" />
          )}
          <span className="sr-only">Toggle Sidebar</span>
        </SidebarTrigger>
      </div>
    </SidebarHeader>
  );
};

export default SidebarHeaderContent;
