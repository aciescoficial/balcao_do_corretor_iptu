
import React from 'react';
import { useIsMobile } from '@/hooks/use-mobile';
import SystemVersion from './SystemVersion';
import HeaderActions from './HeaderActions';
import NotificationBanner from './NotificationBanner';
import { useHeaderNotifications } from '@/hooks/useHeaderNotifications';
import ErrorBoundary from './ErrorBoundary';
import { Skeleton } from "@/components/ui/skeleton";
import { SidebarTrigger } from '@/components/ui/sidebar';

const Header: React.FC = () => {
  // Using our refactored hook with default options
  const { importantMessages } = useHeaderNotifications({
    debug: process.env.NODE_ENV !== 'production'
  });
  
  const isMobile = useIsMobile();
  
  return (
    <ErrorBoundary
      fallback={
        <header className="bg-aciesc-primary text-white py-3 px-4 flex justify-between items-center shadow-sm">
          <div className="flex items-center">
            <SystemVersion />
          </div>
          <Skeleton className="h-10 w-32" />
        </header>
      }
    >
      <header>
        <NotificationBanner messages={importantMessages} />
        <div className="bg-aciesc-primary text-white py-3 px-4 flex justify-between items-center shadow-sm">
          <div className="flex items-center gap-2">
            {isMobile && <SidebarTrigger className="text-white hover:bg-aciesc-dark" />}
            <SystemVersion />
          </div>
          
          <HeaderActions />
        </div>
      </header>
    </ErrorBoundary>
  );
};

export default Header;
