
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Map } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { MapViewProps } from './types/MapTypes';
import { EmpresaData } from '../types';
import OpenStreetMapView from './OpenStreetMapView';

/**
 * This component now simply wraps OpenStreetMapView
 * We've removed all Google Maps integration and replaced it with OpenStreetMap
 */
const VectorMapView: React.FC<MapViewProps> = ({ 
  companies, 
  selectedCompany, 
  setSelectedCompany
}) => {
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center justify-between">
          <span className="flex items-center gap-2">
            <Map className="h-5 w-5 text-blue-500" />
            Mapa de Empresas Conveniadas
          </span>
          <Badge variant="outline" className="ml-2">
            {companies.length} empresas visíveis
          </Badge>
        </CardTitle>
      </CardHeader>
      
      <CardContent className="p-0">
        <OpenStreetMapView
          companies={companies}
          selectedCompany={selectedCompany}
          setSelectedCompany={setSelectedCompany}
        />
      </CardContent>
    </Card>
  );
};

export default VectorMapView;
