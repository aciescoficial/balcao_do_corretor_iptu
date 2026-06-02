
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { CardSettings, ConveniadoData } from './types';
import ColorsTab from './tabs/ColorsTab';
import LayoutTab from './tabs/LayoutTab';
import BackgroundTab from './tabs/BackgroundTab';
import PositioningTab from './tabs/PositioningTab';
import FontsTab from './tabs/FontsTab';

interface CardPersonalizationPanelProps {
  cardSettings: CardSettings;
  updateCardSetting: <K extends keyof CardSettings>(key: K, value: CardSettings[K]) => void;
  previewData?: ConveniadoData;
}

const CardPersonalizationPanel: React.FC<CardPersonalizationPanelProps> = ({ 
  cardSettings,
  updateCardSetting,
  previewData
}) => {
  return (
    <div className="mt-6">
      <h3 className="text-lg font-medium mb-4">Personalizar Carteirinha</h3>
      
      <Tabs defaultValue="colors" className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="colors">Cores</TabsTrigger>
          <TabsTrigger value="layout">Layout</TabsTrigger>
          <TabsTrigger value="background">Imagens de Fundo</TabsTrigger>
          <TabsTrigger value="positioning">Posicionamento</TabsTrigger>
          <TabsTrigger value="fonts">Fonte e Textos</TabsTrigger>
        </TabsList>
        
        {/* Colors Tab */}
        <TabsContent value="colors" className="space-y-4">
          <ColorsTab 
            cardSettings={cardSettings} 
            updateCardSetting={updateCardSetting} 
          />
        </TabsContent>
        
        {/* Layout Tab */}
        <TabsContent value="layout" className="space-y-4">
          <LayoutTab 
            cardSettings={cardSettings} 
            updateCardSetting={updateCardSetting} 
          />
        </TabsContent>
        
        {/* Background Images Tab */}
        <TabsContent value="background" className="space-y-4">
          <BackgroundTab 
            cardSettings={cardSettings} 
            updateCardSetting={updateCardSetting} 
          />
        </TabsContent>
        
        {/* Positioning Tab */}
        <TabsContent value="positioning" className="space-y-4">
          <PositioningTab 
            cardSettings={cardSettings} 
            updateCardSetting={updateCardSetting} 
          />
        </TabsContent>
        
        {/* Fonts Tab */}
        <TabsContent value="fonts" className="space-y-4">
          <FontsTab 
            cardSettings={cardSettings} 
            updateCardSetting={updateCardSetting} 
          />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default CardPersonalizationPanel;
