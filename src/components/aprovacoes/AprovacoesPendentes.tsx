
import React from 'react';
import { PendingHeader } from './components/PendingHeader';
import { PendingTable } from './components/PendingTable';
import { useAprovacoes } from './hooks/useAprovacoes';

const AprovacoesPendentes: React.FC = () => {
  const { pendentes, isLoading, handleApprove, handleReject } = useAprovacoes();
  
  const getTipoBadge = (tipo: string) => {
    switch (tipo) {
      case 'empresa':
        return <span className="wp-badge bg-purple-100 text-purple-800">Empresa</span>;
      default:
        return <span className="wp-badge">{tipo}</span>;
    }
  };

  return (
    <div className="space-y-6">
      <h1 className="wp-header">Aprovações Pendentes</h1>
      
      {isLoading ? (
        <div className="wp-card flex justify-center p-6">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
        </div>
      ) : pendentes.length === 0 ? (
        <div className="wp-notice-success">
          <p className="font-medium">Parabéns!</p>
          <p>Não há aprovações pendentes no momento.</p>
        </div>
      ) : (
        <div className="wp-card">
          <PendingHeader pendingCount={pendentes.length} />
          <PendingTable 
            pendentes={pendentes}
            onApprove={handleApprove}
            onReject={handleReject}
            getTipoBadge={getTipoBadge}
          />
        </div>
      )}
    </div>
  );
};

export default AprovacoesPendentes;
