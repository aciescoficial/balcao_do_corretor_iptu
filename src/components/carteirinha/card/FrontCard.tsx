
import React from 'react';
import { ConveniadoData, CardSettings } from '../types';
import { getBackgroundStyle } from './cardUtils';
import CardPhoto from './CardPhoto';
import CardInfo from './CardInfo';

interface FrontCardProps {
  selectedConveniado: ConveniadoData | null;
  cardSettings: CardSettings;
}

const FrontCard: React.FC<FrontCardProps> = ({ 
  selectedConveniado,
  cardSettings
}) => {
  // Generate full name
  const fullName = selectedConveniado ? 
    `${selectedConveniado.nome} ${selectedConveniado.sobrenome}` : '';

  // Text styling based on card settings
  const textStyle = {
    fontFamily: cardSettings.fontFamily || 'Arial, sans-serif',
    color: cardSettings.textColor || '#FFFFFF'
  };

  return (
    <div className="h-full w-full relative p-0" style={getBackgroundStyle(cardSettings, 'front')}>
      {/* Left side with patterns and photo */}
      <div className="absolute left-0 top-0 bottom-0 w-1/3 overflow-hidden">
        {/* Green pattern background (if no custom background) */}
        {!cardSettings.frontBackgroundImage && (
          <div className="absolute left-0 top-0 bottom-0 w-full">
            <svg viewBox="0 0 200 400" className="h-full">
              <path d="M0,0 L50,0 C80,0 80,30 80,30 L80,80 C80,110 110,110 110,110 L160,110 L160,160 C160,190 190,190 190,190 L190,400 L0,400 Z" 
                    fill={cardSettings.primaryColor} />
            </svg>
          </div>
        )}
        
        {/* Validity badge */}
        <div className="absolute right-0 top-24 transform translate-x-1/2 bg-[#00E676] text-black rounded-full py-2 px-6 font-bold">
          Validade - {selectedConveniado?.validade}
        </div>
        
        {/* Profile photo with positioning */}
        <CardPhoto 
          selectedConveniado={selectedConveniado}
          fullName={fullName}
          photoPosition={cardSettings.photoPosition}
        />
      </div>
      
      {/* Right side with text content */}
      <CardInfo 
        selectedConveniado={selectedConveniado}
        cardSettings={cardSettings}
        fullName={fullName}
        textStyle={textStyle}
      />
    </div>
  );
};

export default FrontCard;
