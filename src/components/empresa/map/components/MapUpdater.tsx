
import React, { useEffect } from 'react';
import { useMap } from 'react-leaflet';
import L from 'leaflet';

interface MapUpdaterProps {
  center: [number, number];
  zoom: number;
  mapRef: React.MutableRefObject<L.Map | null>;
}

export const MapUpdater: React.FC<MapUpdaterProps> = ({ center, zoom, mapRef }) => {
  const map = useMap();
  
  useEffect(() => {
    if (map) {
      map.setView(center, zoom);
      if (mapRef) mapRef.current = map;
    }
  }, [map, center, zoom, mapRef]);
  
  return null;
};

export default MapUpdater;
