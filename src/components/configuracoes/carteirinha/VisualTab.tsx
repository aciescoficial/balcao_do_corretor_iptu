
import React from 'react';
import { Button } from '@/components/ui/button';
import CardPersonalizationPanel from '@/components/carteirinha/CardPersonalizationPanel';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { CardSettings, ConveniadoData } from '@/components/carteirinha/types';

interface VisualTabProps {
  cardSettings: CardSettings;
  updateCardSetting: <K extends keyof CardSettings>(key: K, value: CardSettings[K]) => void;
  previewData: ConveniadoData;
  saveConfig: () => Promise<void>;
  isLoading: boolean;
}

const VisualTab: React.FC<VisualTabProps> = ({ 
  cardSettings, 
  updateCardSetting,
  previewData,
  saveConfig, 
  isLoading 
}) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Personalização Visual da Carteirinha</CardTitle>
        <CardDescription>Configure a aparência padrão das carteirinhas</CardDescription>
      </CardHeader>
      <CardContent>
        <CardPersonalizationPanel 
          cardSettings={cardSettings} 
          updateCardSetting={updateCardSetting} 
          previewData={previewData}
        />
        
        <div className="mt-6">
          <p className="text-sm text-muted-foreground mb-2">
            Essas configurações definem a aparência padrão de novas carteirinhas geradas no sistema.
            Os usuários ainda podem personalizar a aparência ao gerar carteirinhas individuais.
          </p>
        </div>
      </CardContent>
      <CardFooter>
        <Button onClick={saveConfig} disabled={isLoading}>
          {isLoading ? 'Salvando...' : 'Salvar Configurações Visuais'}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default VisualTab;
