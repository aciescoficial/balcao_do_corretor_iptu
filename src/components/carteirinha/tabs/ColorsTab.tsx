
import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { CardSettings } from '../types';

interface ColorsTabProps {
  cardSettings: CardSettings;
  updateCardSetting: <K extends keyof CardSettings>(key: K, value: CardSettings[K]) => void;
}

const ColorsTab: React.FC<ColorsTabProps> = ({ cardSettings, updateCardSetting }) => {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-3">
          <div>
            <Label className="block text-sm font-medium mb-1">Cor Primária</Label>
            <div className="flex items-center gap-2">
              <Input 
                type="color" 
                value={cardSettings.primaryColor} 
                onChange={(e) => updateCardSetting('primaryColor', e.target.value)} 
                className="h-8 w-12 border-0 p-0"
              />
              <span className="text-sm">{cardSettings.primaryColor}</span>
            </div>
          </div>
          
          <div>
            <Label className="block text-sm font-medium mb-1">Cor Secundária</Label>
            <div className="flex items-center gap-2">
              <Input 
                type="color" 
                value={cardSettings.secondaryColor} 
                onChange={(e) => updateCardSetting('secondaryColor', e.target.value)} 
                className="h-8 w-12 border-0 p-0"
              />
              <span className="text-sm">{cardSettings.secondaryColor}</span>
            </div>
          </div>
          
          <div>
            <Label className="block text-sm font-medium mb-1">Cor do Texto</Label>
            <div className="flex items-center gap-2">
              <Input 
                type="color" 
                value={cardSettings.textColor || '#FFFFFF'} 
                onChange={(e) => updateCardSetting('textColor', e.target.value)} 
                className="h-8 w-12 border-0 p-0"
              />
              <span className="text-sm">{cardSettings.textColor || '#FFFFFF'}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ColorsTab;
