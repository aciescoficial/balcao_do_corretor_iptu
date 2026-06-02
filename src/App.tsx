
import React from 'react';
import './App.css';
import AppRoutes from './AppRoutes';
import { Toaster } from '@/components/ui/toaster';
import { AssociadoFirstLoginPopup } from './components/associado/AssociadoFirstLoginPopup';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from './components/auth/AuthProvider';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: { retry: 1, staleTime: 30_000 },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <AuthProvider>
          <div className="App">
            <AppRoutes />
            <Toaster />
            <AssociadoFirstLoginPopup />
          </div>
        </AuthProvider>
      </BrowserRouter>
    </QueryClientProvider>
  );
}

export default App;
