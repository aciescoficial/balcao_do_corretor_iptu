
import React from 'react';
import { ConveniadoData } from '../types';

interface CardPhotoProps {
  selectedConveniado: ConveniadoData | null;
  fullName: string;
  photoPosition: { x: number; y: number };
}

const CardPhoto: React.FC<CardPhotoProps> = ({ 
  selectedConveniado,
  fullName,
  photoPosition
}) => {
  return (
    <div className="absolute overflow-hidden border-4 border-[#00E676] rounded-md"
      style={{
        width: '48%',
        height: '48%',
        left: `${photoPosition.x}%`,
        top: `${photoPosition.y}%`,
        transform: 'translate(-50%, -50%)'
      }}>
      {selectedConveniado?.foto_url ? (
        <img 
          src={selectedConveniado.foto_url} 
          alt={fullName} 
          className="w-full h-full object-cover"
        />
      ) : (
        <div className="w-full h-full bg-gray-200 flex items-center justify-center text-gray-500">
          Sem foto
        </div>
      )}
    </div>
  );
};

export default CardPhoto;
