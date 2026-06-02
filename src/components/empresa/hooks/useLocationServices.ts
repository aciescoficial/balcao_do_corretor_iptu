
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { EmpresaData } from '../types';

export const useLocationServices = () => {
  const [currentLocation, setCurrentLocation] = useState<{lat: number, lng: number} | null>(null);
  const { toast } = useToast();

  const getCurrentLocation = () => {
    if (!navigator.geolocation) {
      toast({
        title: "Geolocalização não suportada",
        description: "Seu navegador não suporta geolocalização.",
        variant: "destructive",
      });
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        setCurrentLocation({ lat: latitude, lng: longitude });
      },
      (error) => {
        console.error("Error getting location:", error);
        toast({
          title: "Erro ao obter localização",
          description: "Não foi possível obter sua localização atual.",
          variant: "destructive",
        });
      }
    );
  };

  const locateEmpresa = (empresa: EmpresaData) => {
    if (!empresa.latitude || !empresa.longitude) return;
    
    setCurrentLocation({ lat: empresa.latitude, lng: empresa.longitude });
    return empresa;
  };

  return {
    currentLocation,
    setCurrentLocation,
    getCurrentLocation,
    locateEmpresa
  };
};
