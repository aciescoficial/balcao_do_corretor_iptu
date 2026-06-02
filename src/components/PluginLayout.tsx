
import React, { Suspense } from 'react';
import { useLocation } from 'react-router-dom';
import { SidebarProvider } from '@/components/ui/sidebar';
import MainSidebar from './sidebar/MainSidebar';
import Header from './layout/Header';
import MainContent from './layout/MainContent';
import { useIsMobile } from '@/hooks/use-mobile';
import { TooltipProvider } from './ui/tooltip';
import { Skeleton } from "@/components/ui/skeleton";
import LoadingSpinner from './shared/LoadingSpinner';

interface LayoutProps {
  children: React.ReactNode;
}

// Error boundary component to prevent the entire app from crashing
class ErrorBoundary extends React.Component<{children: React.ReactNode}, {hasError: boolean, error: Error | null}> {
  constructor(props: {children: React.ReactNode}) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error("Error caught by PluginLayout ErrorBoundary:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="p-8 text-center">
          <h2 className="text-2xl font-bold text-red-500 mb-4">Algo deu errado</h2>
          <p className="mb-4">Ocorreu um erro ao carregar esta página.</p>
          <button 
            className="bg-aciesc-primary text-white px-4 py-2 rounded"
            onClick={() => window.location.reload()}
          >
            Tentar novamente
          </button>
          <pre className="mt-4 text-left bg-gray-100 p-4 rounded text-xs overflow-auto">
            {this.state.error?.message}
          </pre>
        </div>
      );
    }

    return this.props.children;
  }
}

const PluginLayout: React.FC<LayoutProps> = ({ children }) => {
  const location = useLocation();
  const isMobile = useIsMobile();

  return (
    <TooltipProvider>
      <SidebarProvider defaultOpen={!isMobile}>
        <div className="flex h-screen w-full overflow-hidden">
          <ErrorBoundary>
            <Suspense fallback={<Skeleton className="h-full w-64" />}>
              <MainSidebar location={location} />
            </Suspense>
          </ErrorBoundary>
          
          <div className="flex flex-col flex-1 overflow-hidden">
            <ErrorBoundary>
              <Header />
            </ErrorBoundary>
            
            <ErrorBoundary>
              <MainContent>
                <Suspense fallback={
                  <div className="flex h-[80vh] items-center justify-center">
                    <LoadingSpinner size="large" text="Carregando página..." />
                  </div>
                }>
                  {children}
                </Suspense>
              </MainContent>
            </ErrorBoundary>
          </div>
        </div>
      </SidebarProvider>
    </TooltipProvider>
  );
};

export default PluginLayout;
