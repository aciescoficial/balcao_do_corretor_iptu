
import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import { LatLng } from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { defaultIcon } from './icons/mapIcons';

interface LocationPickerProps {
  onLocationSelected: (lat: number, lng: number) => void;
  initialLatitude?: number;
  initialLongitude?: number;
}

const MapEvents = ({ onLocationSelected }: { onLocationSelected: (lat: number, lng: number) => void }) => {
  useMapEvents({
    click(e) {
      onLocationSelected(e.latlng.lat, e.latlng.lng);
    },
  });
  return null;
};

export const LocationPicker: React.FC<LocationPickerProps> = ({
  onLocationSelected,
  initialLatitude,
  initialLongitude,
}) => {
  const [position, setPosition] = useState<LatLng | null>(
    initialLatitude && initialLongitude 
      ? new LatLng(initialLatitude, initialLongitude)
      : null
  );
  const { toast } = useToast();

  useEffect(() => {
    // Set up the leaflet icon when the component mounts
    if (defaultIcon) {
      console.log("Leaflet icon initialized");
    }
  }, []);

  const handleGetCurrentLocation = () => {
    if (!navigator.geolocation) {
      toast({
        title: "Erro",
        description: "Geolocalização não suportada pelo seu navegador",
        variant: "destructive"
      });
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (location) => {
        const newPosition = new LatLng(location.coords.latitude, location.coords.longitude);
        setPosition(newPosition);
        onLocationSelected(newPosition.lat, newPosition.lng);
      },
      (error) => {
        console.error('Error getting location:', error);
        toast({
          title: "Erro",
          description: "Não foi possível obter sua localização atual",
          variant: "destructive"
        });
      }
    );
  };

  const handleMapClick = (lat: number, lng: number) => {
    setPosition(new LatLng(lat, lng));
    onLocationSelected(lat, lng);
  };

  return (
    <div className="space-y-4">
      <Button 
        type="button"
        variant="outline"
        onClick={handleGetCurrentLocation}
      >
        Usar Localização Atual
      </Button>
      
      <div className="h-[400px] w-full rounded-lg border">
        <MapContainer
          center={position || [-15.7801, -47.9292]}
          zoom={13}
          style={{ height: '100%', width: '100%' }}
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          />
          <MapEvents onLocationSelected={handleMapClick} />
          {position && (
            <Marker position={position} />
          )}
        </MapContainer>
      </div>
      
      {position && (
        <p className="text-sm text-muted-foreground">
          Localização selecionada: {position.lat.toFixed(6)}, {position.lng.toFixed(6)}
        </p>
      )}
    </div>
  );
};

export default LocationPicker;
