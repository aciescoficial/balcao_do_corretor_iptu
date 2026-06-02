
import React from 'react';
import { Label } from '@/components/ui/label';
import { CardSettings } from '../types';

interface FontsTabProps {
  cardSettings: CardSettings;
  updateCardSetting: <K extends keyof CardSettings>(key: K, value: CardSettings[K]) => void;
}

const FontsTab: React.FC<FontsTabProps> = ({ cardSettings, updateCardSetting }) => {
  const fontOptions = [
    { value: 'Arial, sans-serif', label: 'Arial' },
    { value: 'Helvetica, sans-serif', label: 'Helvetica' },
    { value: 'Times New Roman, serif', label: 'Times New Roman' },
    { value: 'Courier New, monospace', label: 'Courier New' },
    { value: 'Georgia, serif', label: 'Georgia' },
    { value: 'Verdana, sans-serif', label: 'Verdana' },
    { value: 'Impact, sans-serif', label: 'Impact' }
  ];

  return (
    <div className="space-y-4">
      <div>
        <Label className="block text-sm font-medium mb-1">Família de Fonte</Label>
        <select
          value={cardSettings.fontFamily || 'Arial, sans-serif'}
          onChange={(e) => updateCardSetting('fontFamily', e.target.value)}
          className="w-full border rounded p-2"
        >
          {fontOptions.map(font => (
            <option key={font.value} value={font.value}>{font.label}</option>
          ))}
        </select>
        <div className="mt-2 p-2 border rounded" style={{ fontFamily: cardSettings.fontFamily || 'Arial, sans-serif' }}>
          <p>Exemplo de texto com a fonte selecionada</p>
          <p>CRECI: 12345</p>
          <p>CPF: 123.456.789-00</p>
        </div>
      </div>
    </div>
  );
};

export default FontsTab;
