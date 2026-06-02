
import React, { useState, useEffect } from 'react';
import { MapContainer as LeafletMapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import MapUpdater from './MapUpdater';
import CompanyMarkers from './CompanyMarkers';
import { EmpresaData } from '../../types';
import L from 'leaflet';

// Define type augmentation for react-leaflet components
declare module 'react-leaflet' {
  export interface MapContainerProps extends L.MapOptions {
    center: L.LatLngExpression;
    zoom: number;
    scrollWheelZoom?: boolean;
    zoomControl?: boolean;
    whenReady?: () => void;
    style?: React.CSSProperties;
  }

  export interface TileLayerProps {
    url: string;
    attribution?: string;
  }
}

interface MapComponentProps {
  companies: EmpresaData[];
  selectedCompany: EmpresaData | null;
  setSelectedCompany: (company: EmpresaData | null) => void;
  currentLocation: [number, number];
  zoom: number;
  mapRef: React.MutableRefObject<L.Map | null>;
}

export const MapContainerComponent: React.FC<MapComponentProps> = ({
  companies,
  selectedCompany,
  setSelectedCompany,
  currentLocation,
  zoom,
  mapRef
}) => {
  const [mapInitialized, setMapInitialized] = useState(false);
  const mapId = React.useId(); // Generate unique ID for each map instance

  return (
    <div className="relative h-[600px] w-full">
      <LeafletMapContainer 
        key={mapId} // Add key to force full re-rendering of map
        id={`map-${mapId}`}
        style={{ height: "100%", width: "100%" }}
        center={currentLocation}
        zoom={zoom}
        scrollWheelZoom={true}
        zoomControl={true}
        whenReady={() => {
          setMapInitialized(true);
        }}
      >
        <MapUpdater center={currentLocation} zoom={zoom} mapRef={mapRef} />
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        <CompanyMarkers 
          companies={companies}
          selectedCompany={selectedCompany}
          setSelectedCompany={setSelectedCompany}
          mapInitialized={mapInitialized}
        />
      </LeafletMapContainer>
    </div>
  );
};

export default MapContainerComponent;
