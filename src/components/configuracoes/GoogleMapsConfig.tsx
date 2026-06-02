
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Info } from 'lucide-react';

// This is a placeholder component as we've removed Google Maps integration
const GoogleMapsConfig: React.FC = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Configuração de Mapas</CardTitle>
      </CardHeader>
      <CardContent>
        <Alert>
          <Info className="h-4 w-4" />
          <AlertTitle>Integração atualizada</AlertTitle>
          <AlertDescription>
            A integração com Google Maps foi removida. O sistema agora utiliza 
            OpenStreetMap, que não requer configuração de API key.
          </AlertDescription>
        </Alert>
      </CardContent>
    </Card>
  );
};

export default GoogleMapsConfig;
