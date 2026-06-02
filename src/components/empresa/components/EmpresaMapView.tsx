
import React from 'react';
import { GoogleMap, useLoadScript, Marker, InfoWindow } from '@react-google-maps/api';
import { Navigation, MapPin } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { EmpresaData } from '../types';

interface EmpresaMapViewProps {
  apiKey: string;
  results: EmpresaData[];
  currentLocation: { lat: number, lng: number } | null;
  selectedEmpresa: EmpresaData | null;
  setSelectedEmpresa: (empresa: EmpresaData | null) => void;
  getCurrentLocation: () => void;
}

const mapContainerStyle = {
  width: '100%',
  height: '500px',
  borderRadius: '0.5rem',
};

const defaultMapOptions = {
  disableDefaultUI: false,
  zoomControl: true,
  mapTypeControl: true,
  streetViewControl: false,
  fullscreenControl: true,
};

const EmpresaMapView: React.FC<EmpresaMapViewProps> = ({
  apiKey,
  results,
  currentLocation,
  selectedEmpresa,
  setSelectedEmpresa,
  getCurrentLocation
}) => {
  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: apiKey || '',
    libraries: ['places'],
  });

  if (loadError) {
    return (
      <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-lg">
        Erro ao carregar o mapa do Google Maps. Verifique sua chave da API.
      </div>
    );
  }

  if (!isLoaded) {
    return (
      <div className="flex justify-center items-center h-[500px] bg-gray-50 border border-gray-200 rounded-lg">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="wp-card">
      <h2 className="wp-subheader mb-4 flex items-center gap-2">
        <MapPin className="h-5 w-5" />
        GeoDirectório de Empresas
        {currentLocation && (
          <span className="text-sm text-gray-500 font-normal ml-4">
            Lat: {currentLocation.lat.toFixed(5)}, Lng: {currentLocation.lng.toFixed(5)}
          </span>
        )}
      </h2>
      
      <GoogleMap
        mapContainerStyle={mapContainerStyle}
        zoom={12}
        center={currentLocation || { lat: -15.7801, lng: -47.9292 }}
        options={defaultMapOptions}
      >
        {currentLocation && (
          <Marker
            position={currentLocation}
            icon={{
              url: "https://maps.google.com/mapfiles/ms/icons/blue-dot.png",
              scaledSize: new google.maps.Size(50, 50)
            }}
          />
        )}
        
        {results.map((empresa) => (
          <Marker
            key={empresa.id}
            position={{ 
              lat: empresa.latitude || -15.7801, 
              lng: empresa.longitude || -47.9292 
            }}
            onClick={() => setSelectedEmpresa(empresa)}
          />
        ))}
        
        {selectedEmpresa && (
          <InfoWindow
            position={{ 
              lat: selectedEmpresa.latitude || -15.7801, 
              lng: selectedEmpresa.longitude || -47.9292
            }}
            onCloseClick={() => setSelectedEmpresa(null)}
          >
            <div className="p-2 max-w-xs">
              <h3 className="font-bold text-base">{selectedEmpresa.nome_fantasia}</h3>
              <p className="text-sm my-1">{selectedEmpresa.nicho}</p>
              <p className="text-sm">{selectedEmpresa.endereco}, {selectedEmpresa.cidade}</p>
              <div className="mt-2">
                <a href={`tel:${selectedEmpresa.telefone}`} className="text-blue-500 hover:underline text-sm">
                  {selectedEmpresa.telefone}
                </a>
              </div>
            </div>
          </InfoWindow>
        )}
      </GoogleMap>
      
      <div className="flex items-center justify-between mt-3">
        <p className="text-sm text-gray-500">
          Clique nos marcadores para ver detalhes das empresas.
        </p>
        <Button
          onClick={getCurrentLocation}
          variant="outline" 
          size="sm"
          className="flex items-center gap-2"
          disabled={!apiKey}
        >
          <Navigation size={14} />
          Atualizar minha localização
        </Button>
      </div>
    </div>
  );
};

export default EmpresaMapView;
