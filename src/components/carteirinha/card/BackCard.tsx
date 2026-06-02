
import React from 'react';
import { CardSettings } from '../types';
import { getBackgroundStyle } from './cardUtils';

interface BackCardProps {
  cardSettings: CardSettings;
}

const BackCard: React.FC<BackCardProps> = ({ cardSettings }) => {
  return (
    <div className="h-full w-full relative" style={getBackgroundStyle(cardSettings, 'back')}>
      {/* QR Code shown based on settings */}
      {cardSettings.showQrCode && (
        <div className="absolute left-[390px] top-[105px] transform -translate-x-1/2 -translate-y-1/2 w-[160px] h-[160px] bg-white p-2 rounded-md">
          <img 
            src="https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=https://aciesc.com.br" 
            alt="QR Code"
            className="w-full h-full"
          />
        </div>
      )}
    </div>
  );
};

export default BackCard;
