
import React from 'react';
import { ConveniadoData, CardSettings } from '../types';

interface CardInfoProps {
  selectedConveniado: ConveniadoData | null;
  cardSettings: CardSettings;
  fullName: string;
  textStyle: { fontFamily: string; color: string };
}

const CardInfo: React.FC<CardInfoProps> = ({
  selectedConveniado,
  cardSettings,
  fullName,
  textStyle
}) => {
  return (
    <div className="absolute right-0 top-0 bottom-0 w-2/3 p-4 flex flex-col items-end justify-between"
      style={{
        right: `${100 - cardSettings.textPosition.x}%`,
        top: `${cardSettings.textPosition.y}%`,
        transform: 'translateY(-50%)'
      }}>
      {/* ACIESC Logo */}
      {cardSettings.logoPosition === 'top' && (
        <div className="flex items-center gap-2">
          <div className="text-right" style={textStyle}>
            <div className="text-4xl font-bold tracking-wider">ACIESC</div>
            <div className="text-xs max-w-xs">
              ASSOCIAÇÃO DE CORRETORES E IMOBILIÁRIAS DO ESTADO DE SANTA CATARINA
            </div>
          </div>
        </div>
      )}
      
      {/* Conveniado Info */}
      <div className="text-right space-y-2 mt-8">
        <div>
          <h2 className="text-3xl font-bold" style={{ 
            color: cardSettings.primaryColor || '#00E676',
            fontFamily: cardSettings.fontFamily || 'Arial, sans-serif'
          }}>
            CORRETOR DE
          </h2>
          <h2 className="text-3xl font-bold" style={{ 
            color: cardSettings.primaryColor || '#00E676',
            fontFamily: cardSettings.fontFamily || 'Arial, sans-serif'
          }}>
            IMÓVEIS
          </h2>
        </div>
        
        {/* Nome, CRECI, CPF na ordem específica solicitada */}
        <div className="mt-4" style={textStyle}>
          <p className="font-bold text-lg">{fullName}</p>
          {cardSettings.showCreci && <p className="font-bold">CRECI: {selectedConveniado?.creci}</p>}
          {cardSettings.showCPF && <p className="font-bold">CPF: {selectedConveniado?.cpf}</p>}
        </div>
      </div>
      
      {/* Slogan */}
      <div className="text-right mt-auto">
        <p className="text-xl font-bold mb-1" style={textStyle}>Ser associado</p>
        <p className="bg-[#00E676] text-black px-4 py-1 rounded-md inline-block font-bold">
          que fazem a diferença!
        </p>
      </div>
      
      {/* ACIESC Logo at bottom if selected */}
      {cardSettings.logoPosition === 'bottom' && (
        <div className="flex items-center gap-2 mt-4">
          <div className="text-right" style={textStyle}>
            <div className="text-4xl font-bold tracking-wider">ACIESC</div>
            <div className="text-xs max-w-xs">
              ASSOCIAÇÃO DE CORRETORES E IMOBILIÁRIAS DO ESTADO DE SANTA CATARINA
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CardInfo;
