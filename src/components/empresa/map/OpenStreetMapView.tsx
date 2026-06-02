import React, { useState, useCallback, useRef, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import L from 'leaflet';
import { EmpresaData } from '../types';
import { setupLeafletIcons } from './icons/mapIcons';
import MapContainerComponent from './components/MapContainer';
import { useToast } from '@/hooks/use-toast';

// Initialize Leaflet icons
setupLeafletIcons();

interface MapViewProps {
  companies: EmpresaData[];
  selectedCompany: EmpresaData | null;
  setSelectedCompany: (company: EmpresaData | null) => void;
}

export const OpenStreetMapView: React.FC<MapViewProps> = ({ 
  companies, 
  selectedCompany,
  setSelectedCompany 
}) => {
  // Set initial coordinates to Itapema, SC
  const [currentLocation, setCurrentLocation] = useState<[number, number]>([-27.0861, -48.6161]);
  const [zoom, setZoom] = useState<number>(13); // Increased initial zoom for better city view
  const [loading, setLoading] = useState(false);
  const mapRef = useRef<L.Map | null>(null);
  const { toast } = useToast();
  
  // Find company's geo position (latitude, longitude)
  const geocodeCompany = async (company: EmpresaData) => {
    try {
      // Use actual coordinates if available
      if (company.latitude && company.longitude) {
        return [company.latitude, company.longitude] as [number, number];
      }
      
      // Otherwise, geocode the address or use a fallback
      // For now, we return a random position in Brazil for testing
      toast({
        title: "Geocodificação necessária",
        description: "Esta empresa não possui coordenadas exatas salvas",
      });
      
      const lat = -15.7801 + (Math.random() - 0.5) * 10;
      const lng = -47.9292 + (Math.random() - 0.5) * 10;
      
      return [lat, lng] as [number, number];
    } catch (error) {
      console.error('Error geocoding company:', error);
      return null;
    }
  };
  
  // Get user's current location
  const getCurrentLocation = useCallback(() => {
    if (navigator.geolocation) {
      setLoading(true);
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setCurrentLocation([latitude, longitude]);
          setZoom(13);
          setLoading(false);
        },
        (error) => {
          console.error('Error getting location:', error);
          toast({
            title: "Erro ao obter localização",
            description: "Não foi possível acessar sua localização atual",
            variant: "destructive"
          });
          setLoading(false);
        }
      );
    } else {
      console.error('Geolocation is not supported by this browser.');
      toast({
        title: "Geolocalização não suportada",
        description: "Seu navegador não suporta geolocalização",
        variant: "destructive"
      });
    }
  }, [toast]);
  
  // When selected company changes, center map on it
  useEffect(() => {
    if (selectedCompany) {
      geocodeCompany(selectedCompany).then(coords => {
        if (coords) {
          setCurrentLocation(coords);
          setZoom(15);
        }
      });
    }
  }, [selectedCompany]);

  // Process companies to ensure they all have coordinates
  const processedCompanies = companies.map(company => ({
    ...company,
    latitude: company.latitude || -15.7801 + (Math.random() - 0.5) * 0.1,
    longitude: company.longitude || -47.9292 + (Math.random() - 0.5) * 0.1
  }));

  return (
    <Card className="mt-4">
      <CardContent className="p-0">
        <div className="p-4 flex justify-between items-center">
          <div>
            <h3 className="font-medium">Mapa de Empresas Conveniadas</h3>
            <p className="text-sm text-gray-500">{companies.length} empresas encontradas</p>
          </div>
          
          <div className="flex space-x-2">
            <Button
              size="sm"
              variant="outline"
              onClick={getCurrentLocation}
              disabled={loading}
            >
              {loading ? "Localizando..." : "Minha Localização"}
            </Button>
          </div>
        </div>
        
        <MapContainerComponent
          companies={processedCompanies}
          selectedCompany={selectedCompany}
          setSelectedCompany={setSelectedCompany}
          currentLocation={currentLocation}
          zoom={zoom}
          mapRef={mapRef}
        />
      </CardContent>
    </Card>
  );
};

export default OpenStreetMapView;
