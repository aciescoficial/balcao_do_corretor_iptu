
import React from 'react';
import { ConveniadoData } from './types';

interface AssociadoInfoCardProps {
  selectedConveniado: ConveniadoData;
}

const AssociadoInfoCard: React.FC<AssociadoInfoCardProps> = ({ selectedConveniado }) => {
  return (
    <div className="space-y-4">
      <div className="flex justify-between border-b pb-2">
        <span className="font-medium">Nome:</span>
        <span>{`${selectedConveniado.nome} ${selectedConveniado.sobrenome}`}</span>
      </div>
      <div className="flex justify-between border-b pb-2">
        <span className="font-medium">CPF:</span>
        <span>{selectedConveniado.cpf}</span>
      </div>
      {selectedConveniado.creci && (
        <div className="flex justify-between border-b pb-2">
          <span className="font-medium">CRECI:</span>
          <span>{selectedConveniado.creci}</span>
        </div>
      )}
      {selectedConveniado.validade && (
        <div className="flex justify-between">
          <span className="font-medium">Validade:</span>
          <span>{selectedConveniado.validade}</span>
        </div>
      )}
    </div>
  );
};

export default AssociadoInfoCard;
