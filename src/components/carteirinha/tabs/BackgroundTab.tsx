
import React, { useRef } from 'react';
import { Label } from '@/components/ui/label';
import { ImageUp } from 'lucide-react';
import { CardSettings } from '../types';

interface BackgroundTabProps {
  cardSettings: CardSettings;
  updateCardSetting: <K extends keyof CardSettings>(key: K, value: CardSettings[K]) => void;
}

const BackgroundTab: React.FC<BackgroundTabProps> = ({ cardSettings, updateCardSetting }) => {
  const frontFileInputRef = useRef<HTMLInputElement>(null);
  const backFileInputRef = useRef<HTMLInputElement>(null);

  const handleFrontImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onloadend = () => {
        updateCardSetting('frontBackgroundImage', reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleBackImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onloadend = () => {
        updateCardSetting('backBackgroundImage', reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div className="space-y-2">
        <Label className="block text-sm font-medium">Imagem de Fundo (Frente)</Label>
        <div className="border-2 border-dashed border-gray-300 rounded-md p-4 text-center cursor-pointer hover:bg-gray-50"
             onClick={() => frontFileInputRef.current?.click()}>
          {cardSettings.frontBackgroundImage ? (
            <div className="relative w-full aspect-video">
              <img 
                src={cardSettings.frontBackgroundImage} 
                alt="Background preview" 
                className="w-full h-full object-cover rounded"
              />
              <button 
                className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1"
                onClick={(e) => {
                  e.stopPropagation();
                  updateCardSetting('frontBackgroundImage', undefined);
                }}
              >
                X
              </button>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-2">
              <ImageUp size={24} />
              <span className="text-sm">Clique para fazer upload da imagem</span>
            </div>
          )}
          <input
            type="file"
            className="hidden"
            ref={frontFileInputRef}
            accept="image/*"
            onChange={handleFrontImageUpload}
          />
        </div>
      </div>
      
      <div className="space-y-2">
        <Label className="block text-sm font-medium">Imagem de Fundo (Verso)</Label>
        <div className="border-2 border-dashed border-gray-300 rounded-md p-4 text-center cursor-pointer hover:bg-gray-50"
             onClick={() => backFileInputRef.current?.click()}>
          {cardSettings.backBackgroundImage ? (
            <div className="relative w-full aspect-video">
              <img 
                src={cardSettings.backBackgroundImage} 
                alt="Background preview" 
                className="w-full h-full object-cover rounded"
              />
              <button 
                className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1"
                onClick={(e) => {
                  e.stopPropagation();
                  updateCardSetting('backBackgroundImage', undefined);
                }}
              >
                X
              </button>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-2">
              <ImageUp size={24} />
              <span className="text-sm">Clique para fazer upload da imagem</span>
            </div>
          )}
          <input
            type="file"
            className="hidden"
            ref={backFileInputRef}
            accept="image/*"
            onChange={handleBackImageUpload}
          />
        </div>
      </div>
    </div>
  );
};

export default BackgroundTab;
