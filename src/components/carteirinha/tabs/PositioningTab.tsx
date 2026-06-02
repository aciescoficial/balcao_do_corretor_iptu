
import React from 'react';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { CardSettings } from '../types';

interface PositioningTabProps {
  cardSettings: CardSettings;
  updateCardSetting: <K extends keyof CardSettings>(key: K, value: CardSettings[K]) => void;
}

const PositioningTab: React.FC<PositioningTabProps> = ({ cardSettings, updateCardSetting }) => {
  return (
    <div className="space-y-6">
      <div className="space-y-3">
        <h4 className="text-sm font-semibold">Posição da Foto</h4>
        <div className="space-y-2">
          <Label className="block text-sm">Posição X (%)</Label>
          <div className="flex items-center gap-4">
            <Slider
              value={[cardSettings.photoPosition?.x || 50]}
              min={0}
              max={100}
              step={1}
              onValueChange={(value) => updateCardSetting('photoPosition', { 
                ...cardSettings.photoPosition, 
                x: value[0] 
              })}
              className="flex-1"
            />
            <span className="text-sm w-8 text-center">{cardSettings.photoPosition?.x || 50}%</span>
          </div>
        </div>
        
        <div className="space-y-2">
          <Label className="block text-sm">Posição Y (%)</Label>
          <div className="flex items-center gap-4">
            <Slider
              value={[cardSettings.photoPosition?.y || 50]}
              min={0}
              max={100}
              step={1}
              onValueChange={(value) => updateCardSetting('photoPosition', { 
                ...cardSettings.photoPosition, 
                y: value[0] 
              })}
              className="flex-1"
            />
            <span className="text-sm w-8 text-center">{cardSettings.photoPosition?.y || 50}%</span>
          </div>
        </div>
      </div>
      
      <div className="space-y-3">
        <h4 className="text-sm font-semibold">Posição dos Textos</h4>
        <div className="space-y-2">
          <Label className="block text-sm">Posição X (%)</Label>
          <div className="flex items-center gap-4">
            <Slider
              value={[cardSettings.textPosition?.x || 50]}
              min={0}
              max={100}
              step={1}
              onValueChange={(value) => updateCardSetting('textPosition', { 
                ...cardSettings.textPosition, 
                x: value[0] 
              })}
              className="flex-1"
            />
            <span className="text-sm w-8 text-center">{cardSettings.textPosition?.x || 50}%</span>
          </div>
        </div>
        
        <div className="space-y-2">
          <Label className="block text-sm">Posição Y (%)</Label>
          <div className="flex items-center gap-4">
            <Slider
              value={[cardSettings.textPosition?.y || 50]}
              min={0}
              max={100}
              step={1}
              onValueChange={(value) => updateCardSetting('textPosition', { 
                ...cardSettings.textPosition, 
                y: value[0] 
              })}
              className="flex-1"
            />
            <span className="text-sm w-8 text-center">{cardSettings.textPosition?.y || 50}%</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PositioningTab;
