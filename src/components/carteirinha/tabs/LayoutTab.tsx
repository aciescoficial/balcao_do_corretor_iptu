
import React from 'react';
import { CardSettings } from '../types';

interface LayoutTabProps {
  cardSettings: CardSettings;
  updateCardSetting: <K extends keyof CardSettings>(key: K, value: CardSettings[K]) => void;
}

const LayoutTab: React.FC<LayoutTabProps> = ({ cardSettings, updateCardSetting }) => {
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between border-b pb-2">
        <span className="text-sm font-medium">Mostrar CPF</span>
        <label className="relative inline-flex items-center cursor-pointer">
          <input type="checkbox" 
            checked={cardSettings.showCPF} 
            onChange={(e) => updateCardSetting('showCPF', e.target.checked)}
            className="sr-only peer"
          />
          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
        </label>
      </div>
      
      <div className="flex items-center justify-between border-b pb-2">
        <span className="text-sm font-medium">Mostrar CRECI</span>
        <label className="relative inline-flex items-center cursor-pointer">
          <input type="checkbox" 
            checked={cardSettings.showCreci} 
            onChange={(e) => updateCardSetting('showCreci', e.target.checked)}
            className="sr-only peer"
          />
          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
        </label>
      </div>
      
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium">Mostrar QR Code</span>
        <label className="relative inline-flex items-center cursor-pointer">
          <input type="checkbox" 
            checked={cardSettings.showQrCode} 
            onChange={(e) => updateCardSetting('showQrCode', e.target.checked)}
            className="sr-only peer"
          />
          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
        </label>
      </div>
      
      <div className="flex items-center justify-between pt-2">
        <span className="text-sm font-medium">Posição do Logo</span>
        <select 
          value={cardSettings.logoPosition}
          onChange={(e) => updateCardSetting('logoPosition', e.target.value as 'top' | 'bottom')}
          className="border rounded p-2"
        >
          <option value="top">Topo</option>
          <option value="bottom">Base</option>
        </select>
      </div>
    </div>
  );
};

export default LayoutTab;
