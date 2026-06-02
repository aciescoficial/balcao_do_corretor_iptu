
import React from 'react';
import { Info } from 'lucide-react';

interface PendingHeaderProps {
  pendingCount: number;
}

export const PendingHeader: React.FC<PendingHeaderProps> = ({ pendingCount }) => (
  <div>
    <div className="flex justify-between items-center mb-4">
      <h2 className="wp-subheader mb-0">Cadastros aguardando aprovação</h2>
      <span className="wp-badge bg-yellow-100 text-yellow-800">{pendingCount} pendentes</span>
    </div>
    
    <div className="wp-notice-warning mb-4 flex items-start">
      <Info className="h-5 w-5 mr-2 flex-shrink-0 mt-0.5" />
      <div>
        <p className="font-medium">Importante</p>
        <p className="text-sm">Verifique todos os dados antes de aprovar um cadastro. Uma vez aprovado, o cadastro será ativado no sistema.</p>
      </div>
    </div>
  </div>
);
