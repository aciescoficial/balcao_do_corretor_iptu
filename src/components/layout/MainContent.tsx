
import React, { Suspense } from 'react';
import LoadingSpinner from '../shared/LoadingSpinner';

interface MainContentProps {
  children: React.ReactNode;
}

// Error boundary component
class ErrorBoundary extends React.Component<{children: React.ReactNode}, {hasError: boolean, error: Error | null}> {
  constructor(props: {children: React.ReactNode}) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error("Error in MainContent:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="p-8 bg-white rounded-lg shadow-sm">
          <h2 className="text-xl font-semibold text-red-600 mb-4">Erro ao carregar conteúdo</h2>
          <p className="text-gray-700 mb-4">
            Ocorreu um erro ao carregar esta página. Por favor, tente recarregar ou contate o suporte.
          </p>
          <pre className="mb-4 bg-gray-100 p-3 rounded text-xs text-red-700 overflow-auto whitespace-pre-wrap">
            {this.state.error?.message}{"\n"}{this.state.error?.stack}
          </pre>
          <button
            className="bg-aciesc-primary text-white px-4 py-2 rounded hover:bg-aciesc-primary/90"
            onClick={() => window.location.reload()}
          >
            Recarregar página
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

const MainContent: React.FC<MainContentProps> = React.memo(({ children }) => {
  return (
    <main className="flex-1 bg-gray-100 overflow-auto">
      <div className="p-4 w-full">
        <ErrorBoundary>
          <Suspense fallback={
            <div className="flex justify-center items-center h-[50vh]">
              <LoadingSpinner size="medium" text="Carregando..." />
            </div>
          }>
            {children}
          </Suspense>
        </ErrorBoundary>
      </div>
    </main>
  );
});

// Add display name for React DevTools
MainContent.displayName = 'MainContent';

export default MainContent;
