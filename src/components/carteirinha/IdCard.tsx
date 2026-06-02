
import React from 'react';
import { AspectRatio } from '@/components/ui/aspect-ratio';
import { ConveniadoData, CardSettings } from './types';
import FrontCard from './card/FrontCard';
import BackCard from './card/BackCard';

interface IdCardProps {
  selectedConveniado: ConveniadoData | null;
  cardView: 'front' | 'back';
  cardSettings: CardSettings;
  preview?: boolean;
}

const IdCard: React.FC<IdCardProps> = ({ 
  selectedConveniado,
  cardView,
  cardSettings,
  preview = false
}) => {
  return (
    <div className={`aspect-video w-full rounded-lg overflow-hidden shadow-lg ${!preview && 'max-w-md'}`}>
      <AspectRatio ratio={600/300} className="relative">
        {cardView === 'front' ? (
          <FrontCard 
            selectedConveniado={selectedConveniado}
            cardSettings={cardSettings}
          />
        ) : (
          <BackCard
            cardSettings={cardSettings}
          />
        )}
      </AspectRatio>
    </div>
  );
};

export default IdCard;
